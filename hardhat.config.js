require('@nomiclabs/hardhat-waffle');

// Extend HR with accounts property
extendEnvironment(async (hre) => {
  hre.accounts = await hre.ethers.getSigners();
});

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('deploy', 'Deploys contracts', async (taskArgs, hre) => {
  const TaskManager = await hre.ethers.getContractFactory('TaskManager');
  const taskManager = await TaskManager.deploy();
  await taskManager.deployed();

  console.log('TaskManager deployed to:', taskManager.address);
});

module.exports = {
  solidity: '0.8.0',
};
