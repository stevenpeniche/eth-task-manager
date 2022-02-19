// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/// @title A tool for managing tasks for an arbitrary amount of users
/// @author Steven Peniche
/// @notice You can use this smart contract to help manage your tasks. Your tasks will be associated with your public address.
contract TaskManager {
    struct Task {
        address owner;
        uint256 id;
        string content;
        bool complete;
    }

    event AddTask(address owner, uint256 taskID);

    /// @notice The ID that'll be used for the next task added
    /// @dev Increments with every task added to serve as a unique ID for the next task
    uint256 public nextTaskID;
    /// @dev Iterate through the list by looping from 0 up until the nextTaskID value. It get's incremented with every task added.
    // mapping(uint256 => Task) public list;

    /// @dev Separately maintains a list of tasks for addresses
    mapping(address => Task[]) internal _taskLists;

    /// @notice Get's task with given ID in your task list
    /// @return Returns the task associated with the given ID
    function getTask(uint256 id) public view returns (Task memory) {
        require(_taskLists[msg.sender].length > 0, "Your task list is empty");
        return _taskLists[msg.sender][_getTaskIndex(msg.sender, id)];
    }

    /// @notice A list of your tasks
    /// @return Returns an array of tasks
    function listTasks() public view returns (Task[] memory) {
        return _taskLists[msg.sender];
    }

    /// @notice Adds a task to the list of tasks being managed for the message sender
    /// @param content text describing he task
    function addTask(string memory content) public {
        _taskLists[msg.sender].push(
            Task(msg.sender, nextTaskID, content, false)
        );
        emit AddTask(msg.sender, nextTaskID);
        nextTaskID++;
    }

    /// @notice Removes a task from the list of tasks being managed for the message sender
    /// @dev The last task in the list is moved to the "removed" task's index
    /// @param id unique identifier of the task to be removed
    function removeTask(uint256 id) public {
        Task[] storage taskList = _taskLists[msg.sender];
        taskList[_getTaskIndex(msg.sender, id)] = taskList[taskList.length - 1]; // Replace with task at end of list, if any
        taskList.pop(); // Adjust list length
    }

    /// @notice Toggles a task in the taskLists of tasks being managed for message sender
    /// @dev Set's the Task's complete property to the opposite of it's current value.
    /// @param id unique identifier of the task to be toggled
    function toggleTask(uint256 id) public {
        Task storage task = _taskLists[msg.sender][
            _getTaskIndex(msg.sender, id)
        ];
        task.complete = !task.complete;
    }

    /// @dev Get's the index for a task within the owners list by comparing IDs
    /// @return index The index of a task within the owner's task list. Reverts if not found.
    function _getTaskIndex(address owner, uint256 id)
        internal
        view
        returns (uint256 index)
    {
        Task[] memory taskList = _taskLists[owner];
        for (uint256 i = 0; i < taskList.length; i++) {
            if (taskList[i].id == id) {
                return i;
            }
        }
        revert("Task with given ID not found in your task list.");
    }
}
