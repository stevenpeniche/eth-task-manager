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
5. Download [Ganache](https://trufflesuite.com/ganache/) to run a local Ethereum blockchain.
6. Install [Node](https://nodejs.org/en/) if you haven't already.
   1. Verify installation.
      1. Run `node --version` - _should be `v14` or higher._
      2. Run `npm --version` - _should be `v6` or higher._
7. Install [Truffle](https://github.com/trufflesuite/truffle) globally by running `npm install -g truffle`.
   1. Verify installation with `truffle --version` - _should be `v5` or higher._
8. Install project dependencies with `npm install`.
9. Initialize a truffle project with `truffle init`.
10. There should be a file named `truffle-config.js`. Replace it's contents with this code block:
    ```js
    module.exports = {
      networks: {
        development: {
          host: '127.0.0.1',
          port: 7545,
          network_id: '*', // Match any network id
        },
      },
      solc: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    };
    ```

## Development

1. Launch Ganache app.
2. Run `npm run dev`.
