require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
	solidity: "0.8.24",
	networks: {
		base: {
			url: "https://mainnet.base.org",
			accounts: [process.env.PRIVATE_KEY],
			chainId: 8453,
			gasPrice: 1000000000, // 1 gwei
		},
	},
	etherscan: {
		apiKey: {
			base: process.env.BASESCAN_API_KEY,
		},
		customChains: [
			{
				network: "base",
				chainId: 8453,
				urls: {
					apiURL: "https://api.basescan.org/api",
					browserURL: "https://basescan.org",
				},
			},
		],
	},
};
