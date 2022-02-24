import React, { useEffect, useState } from 'react';
import * as ethers from 'ethers';
import { TaskManager__factory } from '../../../core/typechain-types';
import {
  Button,
  Container,
  FormCheck,
  FormControl,
  InputGroup,
  ListGroup,
  Spinner,
} from 'react-bootstrap';

import type { providers, Signer } from 'ethers';
import type { TaskManager } from '../../../core/typechain-types';

const TASK_MANAGER_CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

export default function Index() {
  let [taskManager, setTaskManager] = useState<TaskManager>();
  let [account, setAccount] = useState<Signer>();
  let [accountAddress, setAccountAddress] = useState<string>();
  let [loading, setLoading] = useState<boolean>(true);
  let [newTaskContent, setNewTaskContent] = useState<string>('');
  let [tasks, setTasks] = useState<TaskManager.TaskStruct[]>();

  const loadWeb3 = async () => {
    try {
      // Connect to Ethereum via Metamask
      if (!window.ethereum) {
        throw new Error('Metamask Ethereum provider unavailable');
      }
      const web3 = new ethers.providers.Web3Provider(window.ethereum);
      // Request EOA access
      await web3.send('eth_requestAccounts', []);
      setAccount(await web3.getSigner());
      // On EOA change
      (web3.provider as providers.BaseProvider)?.on('accountsChanged', async () => {
        setLoading(true);
        setAccount(await web3.getSigner());
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const loadTaskManager = async (account: Signer) => {
    try {
      // Compare bytecode to default "Not deployed value" to check if it's been deployed
      if ((await account.provider?.getCode(TASK_MANAGER_CONTRACT_ADDRESS)) === '0x') {
        alert("Task Manager Contract hasn't been deployed to this network");
      }
      setTaskManager(TaskManager__factory.connect(TASK_MANAGER_CONTRACT_ADDRESS, account));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const listTasks = async () => {
    try {
      setTasks(await taskManager?.listTasks());
    } catch (error: any) {
      alert(error.message);
    }
  };

  const addTask = async () => {
    try {
      if (!newTaskContent) {
        alert("Task can't be empty");
        return;
      }
      const tx = await taskManager?.addTask(newTaskContent);
      await tx?.wait();
      await listTasks();
      setNewTaskContent(''); // Reset task content input
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleTask = async (id: ethers.BigNumberish) => {
    try {
      const tx = await taskManager?.toggleTask(id);
      await tx?.wait();
      await listTasks();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const removeTask = async (id: ethers.BigNumberish) => {
    try {
      const tx = await taskManager?.removeTask(id);
      await tx?.wait();
      await listTasks();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // On Account change
  useEffect(() => {
    (async () => {
      if (account) {
        setAccountAddress(await account.getAddress());
        await loadTaskManager(account);
      }
    })();
  }, [account]);

  // On Task Manager change
  useEffect(() => {
    (async () => {
      await listTasks();
      setLoading(false);
    })();
  }, [taskManager]);

  // On initial render
  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <Container>
      <section className="text-center mt-5">
        <h1>Task Manager</h1>
        <p className="lead">An Ethereum dApp to help you manager your tasks</p>
      </section>
      <section className="mt-4">
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <h5 className="text-center mb-3">Account: {accountAddress || '0x'}</h5>
            <ListGroup className="shadow-sm">
              {tasks?.map((task) => (
                <ListGroup.Item className="d-flex align-items-center" key={task.id.toString()}>
                  <FormCheck.Input
                    className="mt-0 me-2"
                    type="checkbox"
                    checked={task.complete}
                    onChange={() => toggleTask(task.id)}
                  />
                  {task.complete ? <s>{task.content}</s> : <span>{task.content}</span>}
                  <span className="link-danger ms-2" onClick={() => removeTask(task.id)}>
                    delete
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <InputGroup className="mt-3">
              <FormControl
                placeholder="What do you need to do?"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
              />
              <Button onClick={addTask}>Add Task</Button>
            </InputGroup>
          </>
        )}
      </section>
    </Container>
  );
}
