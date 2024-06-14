import { ethers } from "hardhat";

export async function deployCrushFixture() {
	const signers = await ethers.getSigners();
	const admin = signers[0];
	const crushFactory = await ethers.getContractFactory("Crush");
	const crush = await crushFactory.connect(admin).deploy();
	await crush.waitForDeployment();
	return { crush };
}
