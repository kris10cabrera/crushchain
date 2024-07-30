const {
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

describe("Crush", () => {
	async function deployCrushChain() {
		const Crushchain = await ethers.getContractFactory("CrushRecords");
		const crushchain = await Crushchain.deploy();
		return { crushchain };
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
			const crushes = await crushchain.getCrushes(1, 667);
			expect(crushes.length).to.equal(3);
			expect(crushes).to.deep.equal(["zj", "fc", "er"]);
		});
	});
});
