import {
  hashLeaf,
  hashPair,
  parseRecipientList,
  buildMerkleTree,
  verifyMerkleProof,
} from "../lib/merkle";
import {
  saveSessionAirdrop,
  readSessionAirdrops,
  clearSessionAirdrops,
  findSessionAirdropById,
  generateSessionAirdropId,
  type SessionAirdropCampaign,
} from "../lib/airdrop-storage";
import { parseUnits, type Hex } from "viem";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n==========================================");
console.log("HORIZONX — PHASE 5 BATCH 2 MERKLE & CREATION TESTS");
console.log("==========================================");

// --- Setup In-Memory Storage for Headless Node Test ---
const inMemoryStore = new Map<string, string>();
const listeners = new Set<() => void>();

const mockSessionStorage = {
  getItem: (key: string) => inMemoryStore.get(key) ?? null,
  setItem: (key: string, val: string) => inMemoryStore.set(key, val),
  removeItem: (key: string) => inMemoryStore.delete(key),
  clear: () => inMemoryStore.clear(),
};

(globalThis as any).sessionStorage = mockSessionStorage;
(globalThis as any).addEventListener = (type: string, listener: any) => {
  listeners.add(listener);
};
(globalThis as any).removeEventListener = (type: string, listener: any) => {
  listeners.delete(listener);
};
(globalThis as any).dispatchEvent = (event: any) => {
  listeners.forEach((fn) => fn());
  return true;
};

// --- 1. Cryptographic Leaf Hashing ---
console.log("\n--- 1. Cryptographic Leaf Hashing ---");

const addr1 = "0x71C9561E873f324A3B4323E56d3935a8286C4e39" as const;
const addr2 = "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1" as const;
const amount1 = parseUnits("100", 18);
const amount2 = parseUnits("250", 18);

const leaf1 = hashLeaf(addr1, amount1);
const leaf2 = hashLeaf(addr2, amount2);

assert(typeof leaf1 === "string" && leaf1.startsWith("0x"), "leaf1 is valid hex hash");
assert(leaf1.length === 66, "leaf1 is 32-byte keccak256 hash (66 chars with 0x)");
assert(leaf1 !== leaf2, "Distinct address/amount produce distinct leaf hashes");

// Determinism check
const leaf1Repeat = hashLeaf(addr1, amount1);
assert(leaf1 === leaf1Repeat, "Leaf hashing is deterministic");

// --- 2. Sorted Pair Tree Hashing ---
console.log("\n--- 2. Sorted Pair Tree Hashing ---");

const pairHashAB = hashPair(leaf1, leaf2);
const pairHashBA = hashPair(leaf2, leaf1);
assert(pairHashAB === pairHashBA, "hashPair(A, B) is commutative via sorted order");

// --- 3. Recipient Parsing (CSV and JSON) ---
console.log("\n--- 3. Recipient Parsing (CSV and JSON) ---");

const csvInput = `
address,amount
0x71C9561E873f324A3B4323E56d3935a8286C4e39, 100
0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1, 250
0x71c9561e873f324a3b4323e56d3935a8286c4e39, 50
`;

const parsedCsv = parseRecipientList(csvInput, 18);
assert(parsedCsv.errors.length === 0, `CSV parsed with zero errors (errors: ${parsedCsv.errors.join(", ")})`);
assert(parsedCsv.recipients.length === 2, `Duplicate address merged (found ${parsedCsv.recipients.length} recipients)`);
assert(parsedCsv.duplicateCount === 1, "Duplicate count recorded as 1");

// Verify aggregated amount for addr1: 100 + 50 = 150
const addr1Entry = parsedCsv.recipients.find((r) => r.address.toLowerCase() === addr1.toLowerCase());
assert(Boolean(addr1Entry), "addr1 found in parsed list");
assert(addr1Entry?.amountWei === parseUnits("150", 18).toString(), "addr1 amounts summed to 150 tokens");

// JSON parsing
const jsonInput = JSON.stringify([
  { address: "0x71C9561E873f324A3B4323E56d3935a8286C4e39", amount: "500" },
  { address: "0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1", amount: "750" },
]);
const parsedJson = parseRecipientList(jsonInput, 18);
assert(parsedJson.recipients.length === 2, "JSON input parsed successfully into 2 recipients");
assert(parsedJson.totalAmountNumeric === 1250, "Total amount numeric calculated correctly as 1250");

// Malformed input handling
const malformedInput = `0xInvalidAddr, 100\n0x71C9561E873f324A3B4323E56d3935a8286C4e39, -50`;
const parsedMalformed = parseRecipientList(malformedInput, 18);
assert(parsedMalformed.errors.length === 2, `Malformed lines detected (found ${parsedMalformed.errors.length} errors)`);

// --- 4. Merkle Tree & Cryptographic Proof Verification ---
console.log("\n--- 4. Merkle Tree & Proof Verification ---");

const multiRecipientsCsv = `
0x71C9561E873f324A3B4323E56d3935a8286C4e39, 1000
0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1, 2000
0x34291849a0293847291038472910482910293847, 3000
0x7492a43b2f671b2691e9b24ee945c35d5d8c4712, 4000
`;

const parsedTreeData = parseRecipientList(multiRecipientsCsv, 18);
const tree = buildMerkleTree(parsedTreeData.recipients);

assert(typeof tree.root === "string" && tree.root.startsWith("0x"), "Tree produces valid hex root");
assert(tree.leaves.length === 4, "Tree has exactly 4 leaves");
assert(Object.keys(tree.proofs).length === 4, "Proof generated for all 4 recipients");

// Verify all 4 proofs against the root
for (const recipient of tree.recipients) {
  const proof = tree.proofs[recipient.address.toLowerCase()];
  assert(Array.isArray(proof) && proof.length > 0, `Recipient ${recipient.address} has non-empty proof`);

  const isValid = verifyMerkleProof(recipient.leaf, proof, tree.root);
  assert(isValid === true, `Merkle proof verified for ${recipient.address}`);
}

// Negative verification tests
const fakeLeaf = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as Hex;
const firstProof = tree.proofs[tree.recipients[0].address.toLowerCase()];
assert(
  verifyMerkleProof(fakeLeaf, firstProof, tree.root) === false,
  "Tampered leaf fails verification"
);

const tamperedProof = [...firstProof];
tamperedProof[0] = fakeLeaf;
assert(
  verifyMerkleProof(tree.recipients[0].leaf, tamperedProof, tree.root) === false,
  "Tampered proof hash fails verification"
);

// --- 5. Campaign Creation & Session Persistence ---
console.log("\n--- 5. Campaign Creation & Session Persistence ---");

clearSessionAirdrops();

const campaignId = generateSessionAirdropId();
assert(campaignId.startsWith("session-air-"), "Generated ID starts with 'session-air-'");

const newAirdrop: SessionAirdropCampaign = {
  id: campaignId,
  title: "Viem Merkle Test Drop",
  description: "Test campaign with cryptographic Merkle tree.",
  category: "DeFi",
  type: "merkle",
  tokenId: "prominers",
  ownerAddress: addr1,
  status: "active",
  totalReward: "10,000 PMIN",
  recipientCount: tree.recipientCount,
  claimedCount: 0,
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 86400000 * 30).toISOString(),
  network: "Ethereum Sepolia",
  merkleRoot: tree.root,
  merkleTreeData: {
    root: tree.root,
    recipients: tree.recipients.map((r) => ({
      address: r.address,
      amount: r.amount,
      amountWei: r.amountWei,
    })),
    proofs: tree.proofs,
  },
  createdAt: "2026-10-31",
  updatedAt: "2026-10-31",
  provenance: "session",
  isSimulated: true,
};

saveSessionAirdrop(newAirdrop);

const stored = readSessionAirdrops();
assert(stored.length === 1, "Session contains 1 saved campaign");
assert(stored[0].id === campaignId, "Saved campaign ID matches");
assert(stored[0].merkleRoot === tree.root, "Saved campaign Merkle root matches tree root");
assert(stored[0].provenance === "session", "Campaign marked as 'session'");
assert(stored[0].isSimulated === true, "Campaign marked as 'isSimulated'");
assert(stored[0].network === "Ethereum Sepolia", "Network is locked to Ethereum Sepolia (D-04)");

const resolved = findSessionAirdropById(campaignId);
assert(Boolean(resolved), "Campaign retrievable via findSessionAirdropById");
assert(resolved?.merkleTreeData?.recipients.length === 4, "Stored Merkle tree recipients count equals 4");

console.log("\n==========================================");
console.log("ALL PHASE 5 BATCH 2 TESTS PASSED! 🎉");
console.log("==========================================\n");
