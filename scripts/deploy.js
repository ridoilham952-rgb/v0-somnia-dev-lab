const hre = require("hardhat")

async function main() {
  console.log("Deploying contracts to Somnia Network...")

  // Deploy SampleERC20
  const SampleERC20 = await hre.ethers.getContractFactory("SampleERC20")
  const token = await SampleERC20.deploy("Somnia Test Token", "STT", 1000000)
  await token.waitForDeployment()
  console.log("SampleERC20 deployed to:", await token.getAddress())

  // Deploy MiniDEX
  const MiniDEX = await hre.ethers.getContractFactory("MiniDEX")
  const dex = await MiniDEX.deploy()
  await dex.waitForDeployment()
  console.log("MiniDEX deployed to:", await dex.getAddress())

  // Save deployment addresses
  const deployments = {
    SampleERC20: await token.getAddress(),
    MiniDEX: await dex.getAddress(),
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  }

  console.log("Deployment complete:", deployments)

  // Create initial pool
  console.log("Creating initial pool...")
  const poolId = await dex.createPool(await token.getAddress(), "0x0000000000000000000000000000000000000000")
  console.log("Pool created with ID:", poolId)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
