// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MiniDEX is ReentrancyGuard {
    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
    }

    mapping(bytes32 => Pool) public pools;
    mapping(bytes32 => mapping(address => uint256)) public liquidityBalances;

    event PoolCreated(bytes32 indexed poolId, address tokenA, address tokenB);
    event LiquidityAdded(bytes32 indexed poolId, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(bytes32 indexed poolId, address indexed trader, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event HighVolumeSwap(bytes32 indexed poolId, address indexed trader, uint256 amountIn, uint256 amountOut);

    function createPool(address tokenA, address tokenB) external returns (bytes32 poolId) {
        require(tokenA != tokenB, "Identical tokens");
        require(tokenA != address(0) && tokenB != address(0), "Zero address");
        
        poolId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(pools[poolId].tokenA == address(0), "Pool exists");
        
        pools[poolId] = Pool({
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: 0,
            reserveB: 0,
            totalLiquidity: 0
        });
        
        emit PoolCreated(poolId, tokenA, tokenB);
    }

    function addLiquidity(
        bytes32 poolId,
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant returns (uint256 liquidity) {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool not found");
        
        IERC20(pool.tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(pool.tokenB).transferFrom(msg.sender, address(this), amountB);
        
        if (pool.totalLiquidity == 0) {
            liquidity = sqrt(amountA * amountB);
        } else {
            liquidity = min(
                (amountA * pool.totalLiquidity) / pool.reserveA,
                (amountB * pool.totalLiquidity) / pool.reserveB
            );
        }
        
        pool.reserveA += amountA;
        pool.reserveB += amountB;
        pool.totalLiquidity += liquidity;
        liquidityBalances[poolId][msg.sender] += liquidity;
        
        emit LiquidityAdded(poolId, msg.sender, amountA, amountB, liquidity);
    }

    function swap(
        bytes32 poolId,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant returns (uint256 amountOut) {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool not found");
        require(tokenIn == pool.tokenA || tokenIn == pool.tokenB, "Invalid token");
        
        bool isTokenA = tokenIn == pool.tokenA;
        (uint256 reserveIn, uint256 reserveOut) = isTokenA 
            ? (pool.reserveA, pool.reserveB) 
            : (pool.reserveB, pool.reserveA);
        
        // Simple constant product formula with 0.3% fee
        uint256 amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);
        require(amountOut >= minAmountOut, "Insufficient output");
        
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        address tokenOut = isTokenA ? pool.tokenB : pool.tokenA;
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        if (isTokenA) {
            pool.reserveA += amountIn;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += amountIn;
            pool.reserveA -= amountOut;
        }
        
        emit Swap(poolId, msg.sender, tokenIn, tokenOut, amountIn, amountOut);
        
        // Emit high volume event for monitoring
        if (amountIn > 10000 * 10**18) {
            emit HighVolumeSwap(poolId, msg.sender, amountIn, amountOut);
        }
    }

    // Gas-intensive function for profiling
    function complexCalculation(uint256 iterations) external pure returns (uint256) {
        uint256 result = 1;
        for (uint256 i = 1; i <= iterations; i++) {
            result = (result * i) % 1000000007;
        }
        return result;
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
