export function shouldEnableCrushes() {
	it("shouldn't allow a crush with more than 2 characters", async function () {
		const { crush } = await this.loadFixture(deployCrush);
		await expect(crush.crush("a")).to.be.reverted();
		await expect(crush.crush("abc")).to.be.reverted();
	});
}
