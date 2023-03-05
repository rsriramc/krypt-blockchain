const main = async () => {
	// This is smart contract factory
	const Transactions = await hre.ethers.getContractFactory("Transactions");
	// This is smart contract instance
	const transactions = await Transactions.deploy();

	// Wait for the smart contract to be deployed
	await transactions.deployed();

	// Print the address of the smart contract
	console.log("Transactions deployed to:", transactions.address);
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

runMain();