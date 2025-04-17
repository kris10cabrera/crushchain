require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
	solidity: "0.8.24",
	networks: {
		baseSepolia: {
			url: "https://sepolia.base.org",
			accounts: [process.env.PRIVATE_KEY],
			chainId: 84532,
		},
	},
	etherscan: {
		apiKey: {
			baseSepolia: process.env.BASESCAN_API_KEY,
		},
		customChains: [
			{
				network: "baseSepolia",
				chainId: 84532,
				urls: {
					apiURL: "https://api-sepolia.basescan.org/api",
					browserURL: "https://sepolia.basescan.org",
				},
			},
		],
	},
};
