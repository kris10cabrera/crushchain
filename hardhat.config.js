require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
	solidity: "0.8.24",
	networks: {
		base: {
			url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
			accounts: [process.env.PRIVATE_KEY],
			chainId: 8453,
			gasPrice: 1000000000, // 1 gwei
			timeout: 60000, // 1 minute timeout
			confirmations: 2, // wait for 2 confirmations
			gas: 2100000, // gas limit
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
