const { ethers } = require("hardhat");

async function main() {
  try {
    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();
    console.log(`Checking balance for address: ${deployer.address}`);

    // Get the current balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log(`Current balance: ${ethers.formatEther(balance)} BASE`);

    // Estimate gas for deployment
    const crushFactory = await ethers.getContractFactory("CrushRecords");
    
    // Estimate gas for deployment transaction
    const deploymentGasEstimate = await ethers.provider.estimateGas(
      crushFactory.getDeployTransaction().data
    );
    
    // Get current gas price
    const gasPrice = await ethers.provider.getFeeData();
    
    // Calculate deployment cost using maxFeePerGas or gasPrice
    const deploymentCost = gasPrice.maxFeePerGas
      ? deploymentGasEstimate * gasPrice.maxFeePerGas
      : deploymentGasEstimate * gasPrice.gasPrice;
    
    console.log(`Estimated gas needed for deployment: ${deploymentGasEstimate.toString()}`);
    console.log(`Estimated cost for deployment: ${ethers.formatEther(deploymentCost)} BASE`);
    
    if (balance < deploymentCost) {
      console.log("⚠️ WARNING: Your account may not have enough BASE for deployment!");
      console.log(`You need at least ${ethers.formatEther(deploymentCost)} BASE, but you only have ${ethers.formatEther(balance)} BASE`);
    } else {
      const remainingBalance = balance - deploymentCost;
      console.log(`Estimated remaining balance after deployment: ${ethers.formatEther(remainingBalance)} BASE`);
      console.log("✅ You have enough BASE for deployment!");
    }
  } catch (error) {
    console.error("Error checking balance:", error.message);
    if (error.message.includes("account not found")) {
      console.error("Make sure your PRIVATE_KEY in .env is correct and the account exists on Base network");
    } else if (error.message.includes("network") || error.message.includes("provider")) {
      console.error("Make sure your Base network configuration in hardhat.config.js is correct");
    }
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

