const {
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

describe("Crush", () => {
	async function deployCrushChain() {
		// Get the signers
		const [deployer, otherAccount] = await ethers.getSigners();

		// Deploy with the first signer (deployer/admin)
		const Crushchain = await ethers.getContractFactory(
			"CrushRecords",
			deployer,
		);
		const crushchain = await Crushchain.deploy();

		// Return both the contract and signers
		return { crushchain, deployer, otherAccount };
	}
	describe("crush", () => {
		it("should Create crush", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await expect(crushchain.addCrush("0x4142"))
				.to.emit(crushchain, "CrushAdded")
				.withArgs("0x4142");
		});
		it("should emit CrushAdded event", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await expect(crushchain.addCrush("0x4142"))
				.to.emit(crushchain, "CrushAdded")
				.withArgs("0x4142");
		});
		it("should allow you to get crush via ID", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await crushchain.addCrush("0x4142");
			const crush = await crushchain.getCrush(1);
			expect(crush).to.equal("AB");
		});
		it("will not allow you to set an empty crush,", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await expect(crushchain.addCrush("0x")).to.be.rejectedWith(
				"incorrect data length",
			);
		});
		it("will not allow you to set crush with more than 2 letters", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await expect(crushchain.addCrush("0x616161")).to.be.rejectedWith(
				"incorrect data length",
			);
		});
		it("will return crush in string format", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await crushchain.addCrush("0x6B63");
			const crush = await crushchain.getCrush(1);
			expect(crush).to.equal("kc");
		});
		it("will create a list of crushes and return via getCrushes", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await crushchain.addCrush("0x7A6A");
			await crushchain.addCrush("0x6663");
			await crushchain.addCrush("0x6572");
			const crushes = await crushchain.getCrushes(1, 333);
			expect(crushes.length).to.equal(3);
			expect(crushes).to.deep.equal(["zj", "fc", "er"]);
		});

		it("should allow admin to delete a crush", async () => {
			// Get contract and admin signer
			const { crushchain, deployer } = await loadFixture(deployCrushChain);
			// Add a crush first
			await crushchain.addCrush("0x4142");
			// Verify admin is set
			const contractAdmin = await crushchain.admin();
			expect(contractAdmin).to.equal(deployer.address);
			// Try deleting as admin
			await expect(crushchain.connect(deployer).deleteCrush(1))
				.to.emit(crushchain, "CrushDeleted")
				.withArgs(1);
			// Verify crush was deleted
			const crush = await crushchain.getCrush(1);
			expect(crush).to.equal("");
		});
		it("should not allow non-admin to delete a crush", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			const [_, otherAccount] = await ethers.getSigners();

			await crushchain.addCrush("0x4142");

			await expect(
				crushchain.connect(otherAccount).deleteCrush(1),
			).to.be.revertedWithCustomError(crushchain, "NotAdmin");

			const crush = await crushchain.getCrush(1);
			expect(crush).to.equal("AB");
		});

		it("should not allow deletion of non-existent crush", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);

			await expect(crushchain.deleteCrush(1)).to.be.revertedWithCustomError(
				crushchain,
				"InvalidPagination",
			);
		});
	});
});
