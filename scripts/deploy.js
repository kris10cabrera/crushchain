const { ethers } = require("hardhat");

async function main() {
	const [deployer] = await ethers.getSigners();
	console.log(`Deploying contracts with the account: ${deployer.address}`);

	const crushFactory = await ethers.getContractFactory("CrushRecords");
	const crush = await crushFactory.deploy();

	// Wait for deployment to complete
	await crush.waitForDeployment();

	// Get deployed contract address using getAddress()
	const crushAddress = await crush.getAddress();
	console.log(`Contract address: ${crushAddress}`);

	const balance = await deployer.provider.getBalance(deployer.address);
	console.log(`Account balance: ${ethers.formatEther(balance)}`);
}

module.exports = main;

if (require.main === module) {
	main()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}
