const TaskManager = artifacts.require('TaskManager');

contract('TaskManager', (accounts) => {
  it('should initialize with 0 tasks', async () => {
    const taskManager = await TaskManager.deployed();
    const taskCount = await taskManager.taskCount();

    assert.equal(await taskCount.toNumber(), 0);
  });

  it('should add task correctly', async () => {
    const taskManager = await TaskManager.deployed();
    const taskOwner = accounts[0];
    const taskContent = 'Buy more satoshis';
    await taskManager.addTask(taskContent, { from: taskOwner });
    const addedTask = await taskManager.list(0);

    assert.equal((await taskManager.taskCount()).toNumber(), 1);
    assert.equal(addedTask.owner, taskOwner);
    assert.equal(addedTask.complete, false);
  });

  it('should remove task correctly', async () => {
    const taskManager = await TaskManager.deployed();
    const taskID = await taskManager.nextTaskID();
    await taskManager.addTask('Buy more satoshis', { from: accounts[0] });
    await taskManager.removeTask(taskID, { from: accounts[0] });

    assert.equal((await taskManager.list(taskID)).content, '');
  });

  it('should toggle task correctly', async () => {
    const taskManager = await TaskManager.deployed();
    await taskManager.addTask('Buy more satoshis', { from: accounts[0] });
    await taskManager.toggleTask(0);
    const addedTask = await taskManager.list(0);

    assert.equal(addedTask.complete, true);
  });
});
