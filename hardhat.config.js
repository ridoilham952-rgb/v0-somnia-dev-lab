require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    somnia: {
      url: process.env.SOMNIA_RPC_URL || "https://rpc.somnia.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 50311,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 21,
  },
}
