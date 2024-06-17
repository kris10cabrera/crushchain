const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("crush", {
	// This is the path to the module's source file
	source: require.resolve("./crush.js"),
	// This is the path to the module's test file
	test: require.resolve("./test/Crush.js"),
});
