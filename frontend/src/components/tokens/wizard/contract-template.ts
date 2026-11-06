export function generateIllustrativeContractSource(
  name: string,
  symbol: string,
  decimals: number,
  isBurnable: boolean,
  isMintable: boolean,
  isPausable: boolean,
  isPermit: boolean
): string {
  const safeContractName = (symbol.replace(/[^a-zA-Z0-9]/g, "") || "Token") + "Token";
  const safeTokenName = name.replace(/["\\]/g, "") || "Sample Token";
  const safeSymbol = symbol.replace(/["\\]/g, "") || "SMPL";

  const imports: string[] = ['import "@openzeppelin/contracts/token/ERC20/ERC20.sol";'];
  const inherited: string[] = ["ERC20"];

  if (isBurnable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";');
    inherited.push("ERC20Burnable");
  }
  if (isPausable) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";');
    inherited.push("ERC20Pausable");
  }
  if (isPermit) {
    imports.push('import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";');
    inherited.push("ERC20Permit");
  }
  if (isMintable || isPausable) {
    imports.push('import "@openzeppelin/contracts/access/Ownable.sol";');
    inherited.push("Ownable");
  }

  const constructorParams = ["address initialOwner", "uint256 initialSupply"];
  const constructorInits = [
    `ERC20("${safeTokenName}", "${safeSymbol}")`,
  ];

  if (isPermit) {
    constructorInits.push(`ERC20Permit("${safeTokenName}")`);
  }
  if (isMintable || isPausable) {
    constructorInits.push("Ownable(initialOwner)");
  }

  let body = "";

  if (decimals !== 18) {
    body += `
    function decimals() public view virtual override returns (uint8) {
        return ${decimals};
    }
`;
  }

  if (isMintable) {
    body += `
    /**
     * @dev Mint additional tokens. Restricted to contract owner.
     * Note: Subject to Architecture Decision D-05 / D-06 review.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
`;
  }

  if (isPausable) {
    body += `
    /**
     * @dev Emergency pause functions. Restricted to contract owner.
     * Note: Centralized pause authority subject to D-06 authority review.
     */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Required override for OpenZeppelin v5 ERC20 + ERC20Pausable.
     */
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
`;
  }

  return `// SPDX-License-Identifier: MIT
// Illustrative OpenZeppelin v5.0.1 Source Template (Preview Configuration)
// Note: Architecture decisions D-05 (features) and D-06 (upgradeability) remain pending review.
pragma solidity 0.8.24;

${imports.join("\n")}

/**
 * @title ${safeTokenName} (${safeSymbol})
 * @dev Illustrative ERC-20 implementation for preview on Ethereum Sepolia (D-04).
 */
contract ${safeContractName} is ${inherited.join(", ")} {
    constructor(
        ${constructorParams.join(",\n        ")}
    )
        ${constructorInits.join("\n        ")}
    {
        _mint(initialOwner, initialSupply * 10 ** ${decimals});
    }
${body}}`;
}
