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
			await expect(crushchain.addCrush("2130706433", "0x4142"))
				.to.emit(crushchain, "CrushAdded")
				.withArgs("2130706433", "0x4142");
		});
		it("should emit CrushAdded event", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await expect(crushchain.addCrush("1756330402", "0x4142"))
				.to.emit(crushchain, "CrushAdded")
				.withArgs("1756330402", "0x4142");
		});
		it("should allow you to get crush via ID", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await crushchain.addCrush("2130706433", "0x4142");
			const crush = await crushchain.getCrush(1);
			expect(crush[0]).to.equal("127.0.0.1");
			expect(crush[1]).to.equal("AB");
		});
		it("will not allow you to set crush with more than 2 letters", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await expect(
				crushchain.addCrush("0x7f000001", "0x616161"),
			).to.be.rejectedWith("incorrect data length");
		});
		it("will return ip address and crush in string format", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			await crushchain.addCrush("1756330402", "0x6B63");
			const crush = await crushchain.getCrush(1);
			expect(crush[0]).to.equal("104.175.121.162");
			expect(crush[1]).to.equal("kc");
		});
		it("will create a list of crushes and return via getCrushes", async () => {
			const { crushchain } = await loadFixture(deployCrushChain);
			// ny, zj
			await crushchain.addCrush("2637637524", "0x7A6A");
			// la habana fc
			await crushchain.addCrush("3188102244", "0x6663");
			// curitiba er
			await crushchain.addCrush("2991229952", "0x6572");
			const crushes = await crushchain.getCrushes();
			console.log(crushes, "okokoko");
			expect(crushes.length).to.equal(3);

			expect(crushes).to.deep.equal([
				"157.55.39.148 zj",
				"190.6.148.100 fc",
				"178.74.140.0 er",
			]);
		});
	});
});
