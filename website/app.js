App = {
  account: undefined,
  taskManager: undefined,
  load: async () => {
    const web3Loaded = await App.loadWeb3();
    if (web3Loaded) {
      await App.loadAccount();
      await App.loadTaskManager();
      App.configureUI();
    }
  },
  configureUI: () => {
    document.querySelector('#add-task').addEventListener('click', App.addTask);
    document.querySelector('#content').style.display = 'block';
    document.querySelector('#loading').style.display = 'none';
  },
  loadWeb3: async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        return true;
      }
      return false;
    } catch (error) {
      alert(error.message);
      return false;
    }
  },
  loadAccount: async () => {
    try {
      App.account = (await window.web3.eth.getAccounts())[0];
      await App.render();
      // Keep selected account in sync
      window.ethereum.on('accountsChanged', async (accounts) => {
        App.account = accounts[0];
        await App.render(true);
      });
    } catch (error) {
      alert(error.message);
    }
  },
  loadTaskManager: async () => {
    try {
      // Load TaskManager contract schema
      const response = await fetch('.//TaskManager.json');
      // Configure TaskManager contract
      const taskManagerContract = TruffleContract(await response.json());
      taskManagerContract.setProvider(window.ethereum);
      // Grab latest TaskManager instance
      App.taskManager = await taskManagerContract.deployed();
      await App.render();
    } catch (error) {
      alert(error.message);
    }
  },
  render: async (setLoading) => {
    try {
      const contentEl = document.querySelector('#content');
      const loadingEl = document.querySelector('#loading');
      const accountEl = document.querySelector('#account');
      if (setLoading) {
        contentEl.style.display = 'none';
        loadingEl.style.display = 'flex';
      }
      if (App.taskManager) {
        accountEl.textContent = App.account;
        await App.listTasks();
        if (setLoading) {
          // Delay UI update
          setTimeout(() => {
            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
          }, 500);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  },
  listTasks: async () => {
    try {
      const taskList = await App.taskManager.listTasks({ from: App.account });
      let taskListEl = document.querySelector('#task-list');
      taskListEl.innerHTML = ''; // Clear task list
      taskList.forEach((task) => {
        const toggleTaskEl = document.createElement('input');
        toggleTaskEl.setAttribute('type', 'checkbox');
        toggleTaskEl.checked = task.complete;
        toggleTaskEl.classList.add('form-check-input', 'mt-0', 'me-2');
        toggleTaskEl.addEventListener('click', App.toggleTask);
        const taskContentEl = document.createElement(task.complete ? 's' : 'span');
        taskContentEl.innerText = task.content;
        const removeTaskEl = document.createElement('span');
        removeTaskEl.innerText = 'delete';
        removeTaskEl.addEventListener('click', App.removeTask);
        removeTaskEl.classList.add('link-danger', 'ms-2');
        const taskListItemEl = document.createElement('li');
        taskListItemEl.id = task.id;
        taskListItemEl.classList.add('list-group-item', 'd-flex', 'align-items-center');
        taskListItemEl.append(toggleTaskEl, taskContentEl, removeTaskEl);
        taskListEl.append(taskListItemEl);
      });
    } catch (error) {
      alert(error.message);
    }
  },
  addTask: async () => {
    try {
      let contentInput = document.querySelector('#task-content');
      const content = contentInput.value.trim();
      if (content) {
        await App.taskManager.addTask(content, { from: App.account });
        contentInput.value = ''; // Clear input
        await App.render();
      } else {
        alert("Task can't be empty");
      }
    } catch (error) {
      alert(error.message);
    }
  },
  removeTask: async (event) => {
    try {
      const taskID = event.target.parentElement.id;
      await App.taskManager.removeTask(taskID, { from: App.account });
      await App.render();
    } catch (error) {
      alert(error.message);
    }
  },
  toggleTask: async (event) => {
    try {
      event.preventDefault();
      const taskID = event.target.parentElement.id;
      await App.taskManager.toggleTask(taskID, { from: App.account });
      await App.render();
    } catch (error) {
      alert(error.message);
    }
  },
};

window.addEventListener('load', App.load);
