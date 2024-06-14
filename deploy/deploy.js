const func = async (hre) => {
	const { deployer } = await hre.getNamedAccounts();
	const { deploy } = hre.deployments;
	const crush = await deploy("Crush", {
		from: deployer,
	});
	console.log(`Contract deployed to: ${crush.address}`);
};

export default func;
func.tags = ["Crush"];
func.id = "deploy_crush";
