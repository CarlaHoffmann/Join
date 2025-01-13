

/**
 * Adds event listeners to subtask checkboxes to handle status updates.
 * 
 * @function addSubtaskListeners
 * @param {Object} task - The task object containing subtasks to update.
 * @returns {void}
 */
let subtaskListenerFunction;

function addSubtaskListeners(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    const checkboxes = overlayContainer.querySelectorAll('input[type="checkbox"]');

    subtaskListenerFunction = async (event) => {
        const checkbox = event.target;
        const subtaskKey = checkbox.dataset.subtaskKey;
        const isChecked = checkbox.checked;

        task.subtasks[subtaskKey].checked = isChecked;

        const url = `${base_url}/tasks/${task.path}/${task.id}/subtasks/${subtaskKey}.json`;
        await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(task.subtasks[subtaskKey]),
            headers: { 'Content-Type': 'application/json' },
        });
    };

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', subtaskListenerFunction);
    });
}


/**
 * Removes event listeners from subtask checkboxes and resets the listener function.
 * 
 * @function removeSubtaskListeners
 * @returns {void}
 */
function removeSubtaskListeners() {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    const checkboxes = overlayContainer.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        if (subtaskListenerFunction) {
            checkbox.removeEventListener('change', subtaskListenerFunction);
        }
    });

    subtaskListenerFunction = null;
}

/**
 * Returns the image path for the specified priority level.
 * 
 * @function getPrioImage
 * @param {string} prio - The priority level (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {string} The file path to the corresponding priority image.
 */
function getPrioImage(prio) {
    switch (prio) {
        case '1': // Urgent
            return 'assets/img/board/prio_urgent.svg';
        case '2': // Medium
            return 'assets/img/board/prio_medium.svg';
        case '3': // Low
            return 'assets/img/board/prio_low.svg';
        default:
            return 'assets/img/board/prio_medium.svg';
    }
}


/**
 * Returns the text representation for the specified priority level.
 * 
 * @function getPrioText
 * @param {string} prio - The priority level (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {string} The corresponding priority text.
 */
function getPrioText(prio) {
    switch (prio) {
        case '1':
            return 'Urgent';
        case '2':
            return 'Medium';
        case '3':
            return 'Low';
        default:
            return 'Medium';
    }
}


/**
 * Enables edit mode for a task overlay by making input fields editable and showing relevant buttons.
 * 
 * @function enableEditMode
 * @returns {void}
 */
function enableEditMode() {
    document.getElementById('overlayTitle').removeAttribute('readonly');
    document.getElementById('overlayDescription').removeAttribute('readonly');
    document.getElementById('overlayDueDate').removeAttribute('readonly');
    document.querySelectorAll('.prio-button').forEach(button => button.removeAttribute('disabled'));

    document.getElementById('newSubtaskInput').classList.remove('d-none');
    document.getElementById('addSubtaskButton').classList.remove('d-none');

    document.getElementById('editTaskButton').classList.add('d-none');
    document.getElementById('saveTaskButton').classList.remove('d-none');
}


/**
 * Sets the priority for a task in the overlay by updating the active button and the hidden input field.
 * 
 * @function setOverlayPriority
 * @param {string} priority - The priority level to set (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {void}
 */
function setOverlayPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => button.classList.remove('active-button'));
    document.getElementById(`prio${priority}`).classList.add('active-button');
    document.getElementById('overlayPriority').value = priority;
}


/**
 * Adds a new subtask to the overlay's subtask list if the input is not empty.
 * 
 * @function addOverlaySubtask
 * @returns {void}
 */
function addOverlaySubtask() {
    const newSubtask = document.getElementById('newSubtaskInput').value.trim();
    if (newSubtask) {
        const subtasksList = document.getElementById('overlaySubtasks');
        subtasksList.innerHTML += `<li>${newSubtask}</li>`;
        document.getElementById('newSubtaskInput').value = '';
    }
}


/**
 * Closes the task overlay, saves subtasks for the current task if available, and reloads tasks.
 * 
 * @async
 * @function closeTaskOverlay
 * @returns {Promise<void>} Resolves when the overlay is closed and tasks are reloaded.
 */
async function closeTaskOverlay() {
    const overlayContainer = document.getElementById('taskOverlayContainer');

    if (currentTask && Object.keys(currentTask).length > 0) {
        await saveTaskSubtasks(currentTask);
    }

    overlayContainer.classList.add('d-none');
    overlayContainer.innerHTML = '';
    await loadTasks();
}


/**
 * Closes the edit overlay for a task.
 * 
 * This function performs the following actions:
 * 1. Retrieves the task overlay container element.
 * 2. Adds the 'd-none' class to hide the overlay.
 * 3. Clears the inner HTML of the overlay container.
 * 4. Resets the currentSubtasks array to an empty array.
 * 
 * @function
 * @name closeEditOverlay
 * @returns {void}
 */
function closeEditOverlay() {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    overlayContainer.classList.add('d-none');
    overlayContainer.innerHTML = '';
    currentSubtasks = [];
}


/**
 * Saves the updated subtasks of a task to the database.
 * 
 * @async
 * @function saveTaskSubtasks
 * @param {Object} task - The task object containing the updated subtasks.
 * @returns {Promise<void>} Resolves when the subtasks are successfully saved.
 */
async function saveTaskSubtasks(task) {
    try {
        const url = `${base_url}/tasks/${task.path}/${task.id}/subtasks.json`;
        const updatedSubtasks = task.subtasks;

        await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedSubtasks),
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
    }
    currentSubtasks = [];
}


/**
 * Updates the task overlay with the latest data from the database.
 * 
 * @async
 * @function updateOverlay
 * @param {string} taskId - The ID of the task to update.
 * @param {string} taskStatus - The status (column) of the task in the database.
 * @returns {Promise<void>} Resolves when the overlay is updated with the latest task data.
 */
async function updateOverlay(taskId, taskStatus) {
    try {
        const url = `${base_url}/tasks/${taskStatus}/${taskId}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const updatedTask = await response.json();

        openTaskOverlay({ ...updatedTask, id: taskId, path: taskStatus });
    } catch (error) {
    }
}


/**
 * Deletes a task and its subtasks from the database and removes it from the UI.
 * 
 * @async
 * @function deleteTask
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {Promise<void>} Resolves when the task and its subtasks are successfully deleted.
 */
async function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        try {
            const taskElement = document.getElementById(`task-${taskId}`);
            const parentColumnId = taskElement.parentElement.id.replace("Tasks", "");

            const url = `${base_url}/tasks/${parentColumnId}/${taskId}.json`;
            await fetch(url, { method: 'DELETE' });

            taskElement.remove();

            updatePlaceholders();

            currentTask = [];
            closeTaskOverlay();
        } catch (error) { }
    }
}


/**
 * Updates the visibility of placeholders in task columns based on the number of tasks.
 * 
 * @function updatePlaceholders
 * @returns {void}
 */
function updatePlaceholders() {
    const columns = ["toDo", "progress", "feedback", "done"];
    columns.forEach(column => {
        const tasksContainer = document.getElementById(column + "Tasks");
        const placeholder = document.getElementById(column + "Placeholder");
        if (tasksContainer.childElementCount === 0) {
            placeholder.style.display = "block";
        } else {
            placeholder.style.display = "none";
        }
    });
}

/**
 * Selects the search field element from the DOM.
 * 
 * @constant {Element} searchField - The input element for the search functionality.
 */
const searchField = document.querySelector('#searchField');



/**
 * Searches for tasks and users matching the search input and updates their visibility.
 * 
 * - Tasks are searched by title, description, category, and participants.
 * - Users are searched by name.
 * - Displays a "no results" message if no matches are found.
 * 
 * @function addSearchTask
 * @returns {void}
 */
/**
 * Performs a search for tasks and users based on the input value and displays matching results.
 * 
 * @function addSearchTask
 * @returns {void}
 */
function addSearchTask() {
    const searchValue = document.getElementById("searchField").value.toLowerCase();
    const tasksContainers = document.querySelectorAll(".tasks-container");
    const userList = document.querySelectorAll("#user-list .user-card");

    let noResultFound = true;

    tasksContainers.forEach(container => {
        container.querySelectorAll(".task-card").forEach(task => {
            const match = ['task-title', 'task-description', 'task-type']
                .some(className => task.querySelector(`.${className}`).textContent.toLowerCase().includes(searchValue)) ||
                Array.from(task.querySelectorAll(".members-section .contact-name"))
                    .some(contact => contact.textContent.toLowerCase().includes(searchValue));

            task.style.visibility = match ? "visible" : "hidden";
            task.style.display = match ? "" : "none";
            if (match) noResultFound = false;
        });
    });

    userList.forEach(user => {
        const userName = user.querySelector(".user-name").textContent.toLowerCase();
        const match = userName.includes(searchValue);
        user.style.visibility = match ? "visible" : "hidden";
        user.style.display = match ? "" : "none";
        if (match) noResultFound = false;
    });

    document.getElementById("no-search-result").style.display = noResultFound ? "block" : "none";
    document.getElementById("delete-search").classList.toggle("d-none", !searchValue);
}



/**
 * Clears the search field, hides the delete icon and "no results" message, and displays all tasks.
 * 
 * @function deleteSearch
 * @returns {void}
 */
function deleteSearch() {
    document.getElementById("searchField").value = "";
    document.getElementById("delete-search").classList.add("d-none");
    document.getElementById("no-search-result").style.display = "none";

    const tasksContainers = document.querySelectorAll(".tasks-container");
    tasksContainers.forEach(container => {
        const tasks = container.querySelectorAll(".task-card");
        tasks.forEach(task => {
            task.style.display = "block";
        });
    });
}
