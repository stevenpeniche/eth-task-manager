const TaskManager = artifacts.require('TaskManager');

contract('TaskManager', (accounts) => {
  it('should initialize with 0 tasks', async () => {
    const taskManager = await TaskManager.deployed();
    const nextTaskID = await taskManager.nextTaskID();

    assert.equal(await nextTaskID.toNumber(), 0);
  });

  it('should add task correctly', async () => {
    const taskManager = await TaskManager.deployed();
    const taskOwner = accounts[0];
    const taskContent = 'Buy more Bitcoin';
    const taskID = await taskManager.nextTaskID();
    await taskManager.addTask(taskContent, { from: taskOwner });
    const addedTask = await taskManager.getTask(taskID);

    assert.equal(addedTask.owner, taskOwner);
    assert.equal(addedTask.content, taskContent);
    assert.equal(addedTask.complete, false);
    assert.equal((await taskManager.nextTaskID()).toNumber(), 1);
  });

  it('should remove task correctly', async () => {
    const taskManager = await TaskManager.deployed();
    const firstTaskID = await taskManager.nextTaskID();
    const firstTaskContent = 'Buy more Bitcoin';
    await taskManager.addTask(firstTaskContent);
    const secondTaskID = await taskManager.nextTaskID();
    const secondTaskContent = 'Buy more ETH';
    await taskManager.addTask(secondTaskContent);
    const thirdTaskID = await taskManager.nextTaskID();
    const thirdTaskContent = 'Buy more $GME';
    await taskManager.addTask(thirdTaskContent);

    assert.equal((await taskManager.getTask(firstTaskID)).content, firstTaskContent);
    await taskManager.removeTask(secondTaskID);
    // Expect the none removed tasks to remain
    assert.equal((await taskManager.getTask(firstTaskID)).content, firstTaskContent);
    assert.equal((await taskManager.getTask(thirdTaskID)).content, thirdTaskContent);
    // Expect the second task to have been remove, i.e. throw a "revert" error
    try {
      await taskManager.getTask(secondTaskID);
    } catch (error) {
      assert.equal(
        error.message,
        'Returned error: VM Exception while processing transaction: revert Task with given ID not found in your task list.'
      );
    }
  });

  it('should toggle task correctly', async () => {
    const taskManager = await TaskManager.deployed();
    const taskID = await taskManager.nextTaskID();
    await taskManager.addTask('Buy more Bitcoin');
    await taskManager.toggleTask(taskID);
    const addedTask = await taskManager.getTask(taskID);

    assert.equal(addedTask.complete, true);
  });

  it('should list tasks correctly', async () => {
    const taskOwner = accounts[1];
    const taskManager = await TaskManager.deployed();
    await taskManager.addTask('Buy more Bitcoin', { from: taskOwner });
    await taskManager.addTask('Buy more ETH', { from: taskOwner });
    await taskManager.addTask('Buy more $GME', { from: taskOwner });
    const taskList = await taskManager.listTasks({ from: taskOwner });

    assert.equal(taskList.length, 3);
  });
});
