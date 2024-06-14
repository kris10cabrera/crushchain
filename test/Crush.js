const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
import { shouldEnableCrushes } from "./Crush.behavior";
import { deployCrushFixture } from "./Crush.fixture";

describe("crush tests", () => {
	before(async function () {
		this.signers = {};
		const signers = await ethers.getSigners();
		this.signers.admin = signers[0];
		this.loadFixture = loadFixture;
	});
	describe("crush", () => {
		it("should deploy crush", async function () {
			const { crush } = await this.loadFixture(deployCrushFixture);
			expect(crush.address).to.be.properAddress;
		});
		shouldEnableCrushes();
	});
});
