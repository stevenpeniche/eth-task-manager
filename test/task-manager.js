const { expect } = require('chai');
const { ethers, accounts } = require('hardhat');

describe('TaskManager', () => {
  let taskManager;

  before(async () => {
    // Use the same task manager instance for each test
    const TaskManager = await hre.ethers.getContractFactory('TaskManager');
    taskManager = await TaskManager.deploy();
    await taskManager.deployed();
  });

  it('should initialize with 0 tasks', async () => {
    const nextTaskID = await taskManager.nextTaskID();

    expect(await nextTaskID.toNumber()).to.equal(0);
  });

  it('should add task correctly', async () => {
    const taskOwner = accounts[0];
    const taskContent = 'Buy more Bitcoin';
    const taskID = await taskManager.nextTaskID();
    await taskManager.addTask(taskContent);
    const addedTask = await taskManager.getTask(taskID);

    expect(addedTask.owner).to.equal(taskOwner.address);
    expect(addedTask.content).to.equal(taskContent);
    expect(addedTask.complete).to.be.false;
    expect(await taskManager.nextTaskID()).to.equal(1);
  });

  it('should remove task correctly', async () => {
    const firstTaskID = await taskManager.nextTaskID();
    const firstTaskContent = 'Buy more Bitcoin';
    await taskManager.addTask(firstTaskContent);
    const secondTaskID = await taskManager.nextTaskID();
    const secondTaskContent = 'Buy more ETH';
    await taskManager.addTask(secondTaskContent);
    const thirdTaskID = await taskManager.nextTaskID();
    const thirdTaskContent = 'Buy more $GME';
    await taskManager.addTask(thirdTaskContent);

    expect((await taskManager.getTask(firstTaskID)).content).to.equal(firstTaskContent);
    await taskManager.removeTask(secondTaskID);
    // Expect the non-removed tasks to remain
    expect((await taskManager.getTask(firstTaskID)).content).to.equal(firstTaskContent);
    expect((await taskManager.getTask(thirdTaskID)).content).to.equal(thirdTaskContent);
    // Expect the second task to have been remove, i.e. throw a "revert" error
    await expect(taskManager.getTask(secondTaskID)).to.be.revertedWith(
      'Task with given ID not found in your task list.'
    );
  });

  it('should toggle task correctly', async () => {
    const taskID = await taskManager.nextTaskID();
    await taskManager.addTask('Buy more Bitcoin');
    await taskManager.toggleTask(taskID);
    const addedTask = await taskManager.getTask(taskID);

    expect(addedTask.complete).to.be.true;
  });

  it('should list tasks correctly', async () => {
    const taskOwner = accounts[1];
    const taskManagerWithOwnerConnection = await taskManager.connect(taskOwner);
    await taskManagerWithOwnerConnection.addTask('Buy more Bitcoin');
    await taskManagerWithOwnerConnection.addTask('Buy more ETH');
    await taskManagerWithOwnerConnection.addTask('Buy more $GME');
    const taskList = await taskManagerWithOwnerConnection.listTasks();

    expect(taskList).to.have.lengthOf(3);
  });
});
