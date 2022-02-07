// SPDX-License-Identifier: MIT
pragma solidity 0.5.0;

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
    /// @notice The ID that'll be used for the next task added
    /// @dev Increments with every task added to serve as a unique ID for the next task
    uint256 public nextTaskID;
    /// @notice The total number of tasks being managed
    /// @dev Incremented/Decremented with every task addition/removal
    uint256 public taskCount;
    /// @notice A collection of all tasks being managed
    mapping(uint256 => Task) public list;

    /// @notice Adds a task to the collection of tasks being managed
    /// @param content text describing he task
    function addTask(string memory content) public {
        list[nextTaskID] = Task(msg.sender, nextTaskID, content, false);
        nextTaskID++;
        taskCount++;
    }

    /// @notice Removes a task from the collection of tasks being managed
    /// @dev A defaulted Task struct is added in it's place
    /// @param id unique identifier of the task to be removed
    function removeTask(uint256 id) public {
        list[id] = Task(
            0x0000000000000000000000000000000000000000,
            0,
            "",
            false
        );
        taskCount--;
    }

    /// @notice Toggles a task in the collection of tasks being managed
    /// @dev Set's the Task's complete property to the opposite of it's current value.
    /// @param id unique identifier of the task to be toggled
    function toggleTask(uint256 id) public {
        list[id].complete = !list[id].complete;
    }
}
