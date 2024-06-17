import { ethers } from "hardhat";

export async function main() {
	const [deployer] = await ethers.getSigners();
	console.log(`Deploying contracts with the account: ${deployer.address}`);
	const crushFactory = await ethers.getContractFactory("CrushRecords");
	const crush = await crushFactory.deploy();
	console.log(`Contract address: ${crush.address}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
