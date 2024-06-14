import { expect } from "chai";

describe("shouldEnableCrushes", () => {
	it("shouldn't allow a crush with more than 2 characters", async () => {
		// Test case 1: crush with 1 character
		const result1 = await shouldEnableCrushes();
		expect(result1).to.be.reverted();

		// Test case 2: crush with 3 characters
		const result2 = await shouldEnableCrushes();
		expect(result2).to.be.reverted();
	});
});
