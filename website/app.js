const TASK_MANAGER_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Grab from running node

App = {
  account: undefined,
  web3: undefined,
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
  },
  loadWeb3: async () => {
    try {
      if (window.ethereum) {
        App.web3 = new ethers.providers.Web3Provider(window.ethereum); // Web 3 via Metamask
        await App.web3.send('eth_requestAccounts', []);
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
      App.account = await App.web3.getSigner();
      // Keep selected account synced
      App.web3.provider.on('accountsChanged', async (accounts) => {
        App.account = await App.web3.getSigner();
        await App.render(true);
      });
    } catch (error) {
      alert(error.message);
    }
  },
  loadTaskManager: async () => {
    try {
      if ((await App.web3.getCode(TASK_MANAGER_CONTRACT_ADDRESS)) === '0x') {
        // Default "Not deployed value"
        alert("Task Manager Contract hasn't been deployed to this network!");
        return;
      }
      // Load TaskManager contract schema
      const response = await fetch('./TaskManager.sol/TaskManager.json');
      // Grab TaskManager contract ABI
      const taskManagerContractABI = (await response.json()).abi;
      // Create TaskManager instance
      App.taskManager = await new ethers.Contract(
        TASK_MANAGER_CONTRACT_ADDRESS,
        taskManagerContractABI,
        App.account
      );
      await App.render(true);
    } catch (error) {
      alert(error.message);
    }
  },
  render: async (setLoading) => {
    try {
      const contentEl = document.querySelector('#content');
      const loadingEl = document.querySelector('#loading');
      const accountEl = document.querySelector('#account');
      if (!App.account || !App.taskManager) {
        const message = 'Not connected to Web3';
        alert(message);
        loadingEl.innerHTML = message;
        return;
      }
      if (setLoading) {
        contentEl.style.display = 'none';
        loadingEl.style.display = 'flex';
      }
      accountEl.textContent = await App.account.getAddress();
      await App.listTasks();
      if (setLoading) {
        // Delay UI update
        setTimeout(() => {
          loadingEl.style.display = 'none';
          contentEl.style.display = 'block';
        }, 500);
      }
    } catch (error) {
      alert(error.message);
    }
  },
  listTasks: async () => {
    try {
      const taskList = await App.taskManager.listTasks();
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
        const tx = await App.taskManager.addTask(content);
        contentInput.value = ''; // Clear input
        await tx.wait();
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
      const tx = await App.taskManager.removeTask(taskID);
      await tx.wait();
      await App.render();
    } catch (error) {
      alert(error.message);
    }
  },
  toggleTask: async (event) => {
    try {
      event.preventDefault();
      const taskID = event.target.parentElement.id;
      const tx = await App.taskManager.toggleTask(taskID);
      await tx.wait();
      await App.render();
    } catch (error) {
      alert(error.message);
    }
  },
};

window.addEventListener('load', App.load);
