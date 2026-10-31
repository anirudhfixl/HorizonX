/** Token Contract helper tests. Run: npx tsx src/tests/token-contract.test.ts */
import { MOCK_TOKENS } from "../lib/mock-data";
import { EIP20_INTERFACE, abiSignature, isErc20Standard, rawSupplyUnits, isEvmAddress } from "../components/tokens/token-contract";

let failed = 0;
const assert = (c: boolean, m: string) => {
  if (!c) { failed++; console.error("FAILED: " + m); } else console.log("PASSED: " + m);
};

assert(rawSupplyUnits("100,000,000", 18) === "100000000" + "0".repeat(18), "raw supply = supply x 10^decimals");
assert(rawSupplyUnits("1", 0) === "1", "zero decimals keeps value");
assert(rawSupplyUnits("0", 18) === "0", "zero supply stays 0");
assert(rawSupplyUnits(undefined, 18) === undefined, "missing supply is not invented");
assert(rawSupplyUnits("100", undefined) === undefined, "missing decimals is not invented");
assert(rawSupplyUnits("1.5M", 18) === undefined, "non-integer supply is not guessed");
assert(isErc20Standard("ERC-20") && isErc20Standard("erc20") && !isErc20Standard("ERC-721") && !isErc20Standard(undefined), "erc20 detection");
assert(isEvmAddress("0x892a43b2f671b2691e9b24ee945c35d5d8c9a7d1") && !isEvmAddress("0x1234...abcd") && !isEvmAddress(undefined), "address format check");
assert(EIP20_INTERFACE.filter((i) => i.type === "function").length === 9, "EIP-20 has 9 functions");
assert(EIP20_INTERFACE.filter((i) => i.type === "event").length === 2, "EIP-20 has 2 events");
assert(abiSignature(EIP20_INTERFACE.find((i) => i.name === "transfer")!) === "transfer(address to, uint256 amount)", "transfer signature");
assert(abiSignature(EIP20_INTERFACE.find((i) => i.name === "Transfer")!) === "Transfer(address indexed from, address indexed to, uint256 value)", "Transfer event signature");
for (const t of MOCK_TOKENS) {
  assert(rawSupplyUnits(t.totalSupply, t.decimals) !== undefined, `${t.id}: raw supply derivable`);
  assert(isEvmAddress(t.contractAddress), `${t.id}: catalog address is 20-byte hex`);
}
if (failed) process.exit(1);
console.log("ALL TOKEN CONTRACT TESTS PASSED");
