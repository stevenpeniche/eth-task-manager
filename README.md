# Ethereum Task Manager Tutorial

Build a task manager Ethereum dApp using VanillaJS, [Bootstrap 5](https://getbootstrap.com/), [Truffle](https://github.com/trufflesuite/truffle) and [Web3.js](https://github.com/ChainSafe/web3.js).

## Features

Users will be able to...

1. Add a task
2. List all tasks
3. Remove a task
4. Toggle a task

## Setup

1. Fork this repository on GitHub.
2. Open a terminal window.
3. Clone this repository to your computer with `git clone <insert repository URL>`.
4. Change into the cloned code base directory with `cd eth-task-manager`.
6. Install [Node](https://nodejs.org/en/) if you haven't already.
   1. Verify installation.
      1. Run `node --version` - _should be `v14` or higher._
      2. Run `npm --version` - _should be `v6` or higher._
7. Install project dependencies with `npm install`.
8. Initialize a hardhat project with `npx hardhat init`.
   1. Select the **Create an empty hardhat.config.js** option.
10. There should be a file named `hardhat.config.js`. Replace it's contents with this code block:
    ```js
      module.exports = {
        solidity: '0.8.0',
        networks: {
          hardhat: {
            chainId: 1337,
          },
        },
      };
    ```

## Development

1. Run `npm run dev`.
