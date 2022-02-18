import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';

task('accounts', 'Prints the list of accounts', async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task('deploy', 'Deploys contracts', async (_, hre) => {
  const TaskManager = await hre.ethers.getContractFactory('TaskManager');
  const taskManager = await TaskManager.deploy();
  await taskManager.deployed();

  console.log('TaskManager deployed to:', taskManager.address);
});

export default {
  solidity: '0.8.0',
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
