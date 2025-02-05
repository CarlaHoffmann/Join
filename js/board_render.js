/**
 * Displays a list of tasks in the specified container.
 * 
 * @async
 * @function displayTasks
 * @param {Array<Object>} taskArray - Array of task objects to be displayed.
 * @param {string} containerId - ID of the container where tasks will be rendered.
 * @returns {Promise<void>}
 */
async function displayTasks(taskArray, containerId) {
    const tasks = document.getElementById(containerId);
    const contactName = await getContactNames(taskArray);

    const contactColors = await getContactColors(taskArray);
    let taskHTML = "";

    for (let i = 0; i < taskArray.length; i++) {
        taskHTML += taskTemplate(taskArray[i], contactName[i], contactColors[i]);
    }

    tasks.innerHTML = taskHTML;
}

/**
 * Fetches the names of contacts associated with a list of tasks.
 * @param {Array<Object>} tasks - An array of task objects containing contact IDs.
 * @returns {Promise<Array<Array<string>>>} - A nested array of contact names for each task.
 */
async function getContactNames(tasks) {
    const contactNames = [];

    for (const task of tasks) {
        const taskContactNames = await fetchTaskContactNames(task.contacts);
        contactNames.push(taskContactNames);
    }

    return contactNames;
}

/**
 * Updates the task element in the UI, moving it to the new column and updating placeholders.
 * 
 * @function updateTaskElement
 * @param {HTMLElement} taskElement - The task element being moved.
 * @param {string} newStatus - The new status of the task.
 * @param {string} taskKey - The key of the task in the database.
 * @returns {void}
 */
function updateTaskElement(taskElement, newStatus, taskKey) {
    taskElement.id = `task-${taskKey}`;
    document.getElementById(newStatus + "Tasks").appendChild(taskElement);
    updatePlaceholders();
}

/**
 * Updates placeholders for all task columns.
 * Iterates through predefined columns and updates their placeholders.
 */
function updatePlaceholders() {
    const columns = ["toDo", "progress", "feedback", "done"];
    columns.forEach(updateColumnPlaceholder);
}

/**
 * Updates the placeholder for a specific task column.
 * Checks for the presence of task cards and placeholders, then shows or hides the placeholder accordingly.
 * 
 * @param {string} column - The name of the column to update (e.g., "toDo", "progress", "feedback", "done").
 */
function updateColumnPlaceholder(column) {
    const tasksContainer = document.getElementById(column + "Tasks");
    const placeholder = document.getElementById(column + "Placeholder");

    const hasTaskCards = tasksContainer.querySelector('.task-card') !== null;
    const hasPlaceholder = tasksContainer.querySelector("#" + column + "Placeholder") !== null;

    if (hasTaskCards && hasPlaceholder) {
        hidePlaceholder(placeholder);
    } else if (!hasTaskCards && hasPlaceholder) {
        showPlaceholder(placeholder);
    } else if (!hasTaskCards && !hasPlaceholder) {
        getPlaceholder(column);
    }
}

/**
 * Hides a placeholder element by removing the 'show' class and adding the 'hide' class.
 * 
 * @param {HTMLElement} placeholder - The placeholder element to hide.
 */
function hidePlaceholder(placeholder) {
    placeholder.classList.remove('show');
    placeholder.classList.add('hide');
}

/**
 * Shows a placeholder element by removing the 'hide' class and adding the 'show' class.
 * 
 * @param {HTMLElement} placeholder - The placeholder element to show.
 */
function showPlaceholder(placeholder) {
    placeholder.classList.remove('hide');
    placeholder.classList.add('show');
}

/**
 * Creates and inserts a placeholder for a specific column.
 * Clears the existing content of the tasks container and adds a new placeholder with appropriate text.
 * 
 * @param {string} column - The name of the column for which to create a placeholder (e.g., "toDo", "progress", "feedback", "done").
 */
function getPlaceholder(column) {
    const tasksContainer = document.getElementById(column + "Tasks");
    tasksContainer.innerHTML = '';
    if(column === 'toDo') {
        tasksContainer.innerHTML = `<div id="toDoPlaceholder" class="placeholder show">No tasks To do</div>`;
    }
    if(column === 'progress') {
        tasksContainer.innerHTML = `<div id="progressPlaceholder" class="placeholder show">No tasks In progress</div>`;
    }
    if(column === 'feedback') {
        tasksContainer.innerHTML = `<div id="feedbackPlaceholder" class="placeholder show">No tasks Await feedback</div>`;
    }
    if(column === 'done') {
        tasksContainer.innerHTML = `<div id="donePlaceholder" class="placeholder show">No tasks Done</div>`;
    }
}

/**
 * Opens the task overlay with task details and dynamically inserts the required content.
 * 
 * @param {Object} task - The task object containing details like contacts and subtasks.
 * @returns {Promise<void>} - A promise that resolves when the overlay is displayed.
 */
async function openTaskOverlay(task) {
    currentTask = task;
    const overlayContainer = document.getElementById('taskOverlayContainer');

    const contactNames = await getContactNames([task]);
    const contactColors = await getContactColors([task]);
    const contactsHTML = generateContactsHTML(task.contacts, contactNames[0], contactColors[0]);
    const subtasksHTML = generateSubtasksHTML(task.subtasks, task.path, task.id);

    overlayContainer.innerHTML = openTaskOverlayTemplate(task, contactsHTML, subtasksHTML);

    addSubtaskListeners(task);

    requestAnimationFrame(() => {
        if (document.getElementById('taskOverlay')) {
            startTaskOverlayAnimation();
        }
    });
}

/**
 * Starts the animation for the task overlay by making it visible and adding the "show" animation class.
 * 
 * @function startTaskOverlayAnimation
 * @returns {void}
 */
function startTaskOverlayAnimation() {
    let taskOverlayContainer = document.getElementById('taskOverlayContainer');
    let taskOverlay = document.getElementById('taskOverlay');

    taskOverlayContainer.classList.remove('d-none');
    taskOverlay.classList.add('show');
}

/**
 * Closes the task overlay with an animation and invokes the close function after the animation ends.
 * 
 * @function closeTaskOverlayAnimation
 * @param {string} overlayBox - The ID of the overlay element to animate and close.
 * @returns {void}
 */
function closeTaskOverlayAnimation(overlayBox) {
    let overlay = document.getElementById(overlayBox);
    if (overlay.classList.contains('show')) {
        overlay.classList.remove('show');
    }
    overlay.classList.add('hide');
    setTimeout(closeTaskOverlay, 400);
}



/**
 * Closes the task overlay, saves any changes to subtasks, and reloads tasks.
 * 
 * @async
 * @function closeTaskOverlay
 * @returns {Promise<void>}
 */
async function closeTaskOverlay() {
    const overlayContainer = document.getElementById('taskOverlayContainer');

    if (currentTask && Object.keys(currentTask).length > 0) {
        await saveTaskSubtasks(currentTask);
    }

    overlayContainer.classList.add('d-none');
    overlayContainer.innerHTML = '';
    await loadTasks();
    currentSubtasks = [];
}

/**
 * Stores the currently selected task for editing.
 * @type {Object|null}
 */
let currentTask = null;

/**
 * Opens the edit task overlay and initializes its components.
 * @async
 * @param {Event} event - The event that triggered the function.
 * @param {Object} task - The task object to be edited.
 */
async function openEditTaskOverlay(event, task) {
    event.stopPropagation();

    const overlayContainer = document.getElementById('taskOverlayContainer');
    prepareSelectedContacts(task);
    prepareCurrentSubtasks(task);

    const subtasksHTML = generateSubtasksHTML();
    displayEditTaskOverlay(overlayContainer, task, subtasksHTML);
    initializeEditTaskComponents(task);
}

/**
 * Closes the edit task overlay and reopens the task overlay with the given task details.
 * 
 * @function closeEditTaskOverlay
 * @param {Object} task - The task object to reopen in the task overlay.
 * @returns {void}
 */
function closeEditTaskOverlay(task) {
    currentTask = null;
    openTaskOverlay(task);
}

/**
 * Enables edit mode for the task overlay, allowing fields to be modified and new subtasks to be added.
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
 * Sets the priority of the task in the overlay and updates the UI.
 * 
 * @function setOverlayPriority
 * @param {string} priority - The priority level to set (e.g., "High", "Medium", "Low").
 * @returns {void}
 */
function setOverlayPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => button.classList.remove('active-button'));
    document.getElementById(`prio${priority}`).classList.add('active-button');
    document.getElementById('overlayPriority').value = priority;
}

/**
 * Adds a new subtask to the current task and updates the task list.
 * 
 * @async
 * @function addOverlaySubtask
 * @returns {Promise<void>}
 */
async function addOverlaySubtask() {
    const input = document.getElementById('newSubtaskInput');
    const newSubtask = input.value.trim();
    if (!newSubtask) return;

    const url = `${base_url}/tasks/${currentTask.path}/${currentTask.id}/subtasks.json`;
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ task: newSubtask, checked: false }),
        headers: { 'Content-Type': 'application/json' },
    });

    input.value = '';
    loadTasks();
}

/**
 * Fetches task data by ID and status, then updates and opens the task overlay.
 * 
 * @async
 * @function updateOverlay
 * @param {string} taskId - The unique ID of the task to update.
 * @param {string} taskStatus - The current status of the task (e.g., "toDo", "done").
 * @returns {Promise<void>}
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
 * Prepares the selected contacts for the task being edited.
 * @param {Object} task - The task object containing contact information.
 */
function prepareSelectedContacts(task) {
    selectedContacts = task.contacts;
}

/**
 * Prepares the current subtasks for the task being edited.
 * @param {Object} task - The task object containing subtask information.
 */
function prepareCurrentSubtasks(task) {
    currentSubtasks = [];
    Object.keys(task.subtasks).forEach(key => {
        currentSubtasks.push({
            task: task.subtasks[key].task,
            checked: task.subtasks[key].checked
        });
    });
}

/**
 * Generates HTML for the subtasks.
 * @returns {string} HTML string representing the subtasks.
 */
function generateSubtasksHTML() {
    return currentSubtasks.map((subtask, index) => {
        return getAddEditedSubtaskTemplate(index, subtask.task, subtask.checked);
    }).join('');
}

/**
 * Displays the edit task overlay in the specified container.
 * @param {HTMLElement} container - The container element for the overlay.
 * @param {Object} task - The task object being edited.
 * @param {string} subtasksHTML - The HTML string for subtasks.
 */
function displayEditTaskOverlay(container, task, subtasksHTML) {
    container.innerHTML = openEditTaskOverlayTemplate(task, subtasksHTML);
    container.classList.remove('d-none');
}

/**
 * Initializes various components of the edit task overlay.
 * @param {Object} task - The task object being edited.
 */
function initializeEditTaskComponents(task) {
    updateEditContacts();
    initializeDatePicker();
    initializeEditPriority(task.prio);
    categorySelected(task.category);
}