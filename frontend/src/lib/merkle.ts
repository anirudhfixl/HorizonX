import {
  keccak256,
  encodePacked,
  getAddress,
  isAddress,
  parseUnits,
  concat,
  type Hex,
} from "viem";

/**
 * Standard Merkle Tree & Proof Generator for Airdrop Distributions.
 *
 * Implements OpenZeppelin MerkleProof compatible leaf double-hashing:
 * leaf = keccak256(keccak256(encodePacked(['address', 'uint256'], [account, amountWei])))
 *
 * Pair hashing is lexicographically sorted:
 * hashPair(a, b) = a < b ? keccak256(concat([a, b])) : keccak256(concat([b, a]))
 */

export interface RawRecipientInput {
  address: string;
  amount: string;
}

export interface ValidatedRecipient {
  address: `0x${string}`;
  amount: string; // human readable string (e.g. "250")
  amountWei: string; // BigInt string
  leaf: Hex;
}

export interface MerkleTreeResult {
  root: Hex;
  leaves: Hex[];
  recipients: ValidatedRecipient[];
  proofs: Record<string, Hex[]>; // lowercase address -> array of sibling proof hashes
  totalAllocationWei: string;
  totalAllocationFormatted: string;
  recipientCount: number;
}

export interface RecipientParseResult {
  recipients: ValidatedRecipient[];
  errors: string[];
  duplicateCount: number;
  totalAmountNumeric: number;
}

/* -------------------------------------------------------------------------- */
/* Cryptographic Hash Helpers                                                 */
/* -------------------------------------------------------------------------- */

export function hashLeaf(account: string, amountWei: bigint): Hex {
  // Double-hash scheme prevents second-preimage attack.
  // Normalize address through lowercase to ensure correct EIP-55 checksum
  const cleanAddr = account.trim().toLowerCase();
  const checksumAddr = isAddress(cleanAddr, { strict: false })
    ? getAddress(cleanAddr)
    : (account as `0x${string}`);

  const innerHash = keccak256(
    encodePacked(["address", "uint256"], [checksumAddr, amountWei])
  );
  return keccak256(innerHash);
}

export function hashPair(a: Hex, b: Hex): Hex {
  return a.toLowerCase() < b.toLowerCase()
    ? keccak256(concat([a, b]))
    : keccak256(concat([b, a]));
}

/* -------------------------------------------------------------------------- */
/* Parsing & Normalization                                                    */
/* -------------------------------------------------------------------------- */

export function parseRecipientList(
  input: string,
  decimals: number = 18
): RecipientParseResult {
  const errors: string[] = [];
  const normalizedMap = new Map<string, { address: `0x${string}`; totalWei: bigint }>();
  let duplicateCount = 0;

  const trimmed = input.trim();
  if (!trimmed) {
    return { recipients: [], errors: [], duplicateCount: 0, totalAmountNumeric: 0 };
  }

  // 1. Try parsing as JSON array or object
  let parsedFromJSON = false;
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const data = JSON.parse(trimmed);
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const rawAddr = item?.address || item?.[0];
          const rawAmount = String(item?.amount ?? item?.[1] ?? "");
          processEntry(rawAddr, rawAmount, i + 1);
        }
        parsedFromJSON = true;
      } else if (typeof data === "object" && data !== null) {
        let index = 1;
        for (const [key, val] of Object.entries(data)) {
          processEntry(key, String(val), index++);
        }
        parsedFromJSON = true;
      }
    } catch {
      // Fall through to CSV parser
    }
  }

  // 2. CSV / line-delimited parser
  if (!parsedFromJSON) {
    const lines = trimmed.split(/\r?\n/);
    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // Skip header if present (e.g. "address,amount")
      if (
        index === 0 &&
        cleanLine.toLowerCase().includes("address") &&
        cleanLine.toLowerCase().includes("amount")
      ) {
        return;
      }

      // Support comma, tab, semicolon or whitespace separation
      const parts = cleanLine.split(/[,;\t\s]+/).filter(Boolean);
      if (parts.length < 2) {
        errors.push(`Line ${index + 1}: Invalid format. Expected 'address, amount'`);
        return;
      }

      const rawAddr = parts[0];
      const rawAmount = parts[1];
      processEntry(rawAddr, rawAmount, index + 1);
    });
  }

  function processEntry(rawAddr: unknown, rawAmount: string, lineNum: number) {
    if (typeof rawAddr !== "string" || !isAddress(rawAddr.trim(), { strict: false })) {
      errors.push(`Line ${lineNum}: Invalid Ethereum address '${String(rawAddr)}'`);
      return;
    }

    const cleanAmount = rawAmount.trim().replace(/,/g, "");
    if (!cleanAmount || isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      errors.push(`Line ${lineNum}: Invalid allocation amount '${rawAmount}'`);
      return;
    }

    try {
      const checksumAddr = getAddress(rawAddr.trim().toLowerCase());
      const lowerKey = checksumAddr.toLowerCase();
      const amountWei = parseUnits(cleanAmount, decimals);

      if (normalizedMap.has(lowerKey)) {
        duplicateCount++;
        const current = normalizedMap.get(lowerKey)!;
        current.totalWei += amountWei;
      } else {
        normalizedMap.set(lowerKey, { address: checksumAddr, totalWei: amountWei });
      }
    } catch {
      errors.push(`Line ${lineNum}: Failed to parse amount '${rawAmount}' with ${decimals} decimals`);
    }
  }

  // Build validated recipients with leaves
  const recipients: ValidatedRecipient[] = [];
  let totalAmountNumeric = 0;

  for (const { address, totalWei } of normalizedMap.values()) {
    const leaf = hashLeaf(address, totalWei);
    // Format human-readable amount string
    const amountStr = (Number(totalWei) / 10 ** decimals).toLocaleString("en-US", {
      maximumFractionDigits: 6,
    });
    totalAmountNumeric += Number(totalWei) / 10 ** decimals;

    recipients.push({
      address,
      amount: amountStr,
      amountWei: totalWei.toString(),
      leaf,
    });
  }

  return {
    recipients,
    errors,
    duplicateCount,
    totalAmountNumeric,
  };
}

/* -------------------------------------------------------------------------- */
/* Merkle Tree & Proof Generation                                             */
/* -------------------------------------------------------------------------- */

export function buildMerkleTree(recipients: ValidatedRecipient[]): MerkleTreeResult {
  if (recipients.length === 0) {
    return {
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
      leaves: [],
      recipients: [],
      proofs: {},
      totalAllocationWei: "0",
      totalAllocationFormatted: "0",
      recipientCount: 0,
    };
  }

  // Calculate total allocation
  let totalWei = BigInt(0);
  for (const r of recipients) {
    totalWei += BigInt(r.amountWei);
  }

  // Map each leaf to its original recipient for proof extraction
  const leaves = recipients.map((r) => r.leaf);

  // If single leaf, root is the leaf itself, proof is empty
  if (leaves.length === 1) {
    const proofs: Record<string, Hex[]> = {
      [recipients[0].address.toLowerCase()]: [],
    };
    return {
      root: leaves[0],
      leaves,
      recipients,
      proofs,
      totalAllocationWei: totalWei.toString(),
      totalAllocationFormatted: recipients[0].amount,
      recipientCount: 1,
    };
  }

  // Build levels up to the root
  const treeLevels: Hex[][] = [];
  treeLevels.push(leaves);

  let currentLevel = leaves;
  while (currentLevel.length > 1) {
    const nextLevel: Hex[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(hashPair(currentLevel[i], currentLevel[i + 1]));
      } else {
        // Odd node promoted to next level
        nextLevel.push(currentLevel[i]);
      }
    }
    treeLevels.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = currentLevel[0];

  // Generate proofs for each recipient
  const proofs: Record<string, Hex[]> = {};

  for (let idx = 0; idx < recipients.length; idx++) {
    const proof: Hex[] = [];
    let currentIndex = idx;

    for (let levelIdx = 0; levelIdx < treeLevels.length - 1; levelIdx++) {
      const level = treeLevels[levelIdx];
      const isEven = currentIndex % 2 === 0;
      const siblingIndex = isEven ? currentIndex + 1 : currentIndex - 1;

      if (siblingIndex < level.length) {
        proof.push(level[siblingIndex]);
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    proofs[recipients[idx].address.toLowerCase()] = proof;
  }

  return {
    root,
    leaves,
    recipients,
    proofs,
    totalAllocationWei: totalWei.toString(),
    totalAllocationFormatted: recipients.length > 0 ? recipients[0].amount : "0",
    recipientCount: recipients.length,
  };
}

/* -------------------------------------------------------------------------- */
/* Cryptographic Proof Verification                                           */
/* -------------------------------------------------------------------------- */

export function verifyMerkleProof(leaf: Hex, proof: Hex[], root: Hex): boolean {
  let computedHash = leaf;
  for (const sibling of proof) {
    computedHash = hashPair(computedHash, sibling);
  }
  return computedHash.toLowerCase() === root.toLowerCase();
}
