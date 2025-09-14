// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleERC20 is ERC20, Ownable {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event LargeTransfer(address indexed from, address indexed to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        if (amount > 1000 * 10**decimals()) {
            emit LargeTransfer(msg.sender, to, amount);
        }
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (amount > 1000 * 10**decimals()) {
            emit LargeTransfer(from, to, amount);
        }
        return super.transferFrom(from, to, amount);
    }

    // Gas-intensive function for profiling
    function expensiveOperation(uint256 iterations) public {
        uint256 result = 0;
        for (uint256 i = 0; i < iterations; i++) {
            result += i * i;
        }
    }

    // Function that can revert for chaos testing
    function riskyFunction(uint256 value) public pure returns (uint256) {
        require(value < 100, "Value too high");
        return value * 2;
    }
}
