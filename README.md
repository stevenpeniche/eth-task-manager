# Ethereum Task Manager Tutorial

Build a task manager Ethereum dApp using [TypeScript](https://github.com/Microsoft/TypeScript), [React](https://github.com/facebook/react), [React Bootstrap 5](https://github.com/react-bootstrap/react-bootstrap), [Hardhat](https://github.com/NomicFoundation/hardhat) and [Ethers.js](https://github.com/ethers-io/ethers.js).

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
5. Create a branch dedicated to the implementation type you're working on, i.e. VanillaJS, TypeScript/React, etc.
6. Install [Node](https://nodejs.org/en/) if you haven't already.
   1. Verify installation.
      1. Run `node --version` - _should be `v14` or higher._
      2. Run `npm --version` - _should be `v7` or higher since we're using NPM workspaces._
7. Install project dependencies with `npm install`.
8. From the root directory, create and move into a directory named **core** with `mkdir core` and `cd core`.
   1. Initialize a hardhat project with `npx hardhat init`.
   2. Select the **Create an empty hardhat.config.js** option.
   3. There should be a file named `hardhat.config.js`. Replace it's contents with this code block:
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
9. From the root directory, initialize a remix project with `npx create-remix` using these options:
   1. Type `web`.
   2. Select **Remix App Server**.
   3. Select **TypeScript**.
   4. Type `n` or `no`.

## Development

1. From the project root directory run `npm run dev`.
