/**
 * Adds change event listeners to subtask checkboxes in the task overlay, updating the database on changes.
 * 
 * @function addSubtaskListeners
 * @param {Object} task - The task object containing subtasks to be updated.
 * @param {string} task.path - The path representing the task's status (e.g., "toDo", "done").
 * @param {string} task.id - The unique ID of the task.
 * @param {Object} task.subtasks - The subtasks object, where each subtask is keyed by a unique identifier.
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
 * Removes change event listeners from all subtask checkboxes in the task overlay.
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
 * Returns the file path of the priority image corresponding to the given priority level.
 * 
 * @function getPrioImage
 * @param {string} prio - The priority level (e.g., '1', '2', '3').
 * @returns {string} - The file path of the priority image.
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
 * Returns the priority text corresponding to the given priority level.
 * 
 * @function getPrioText
 * @param {string} prio - The priority level (e.g., '1', '2', '3').
 * @returns {string} - The priority text ('Urgent', 'Medium', 'Low').
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
 * Saves updated subtasks for a specific task to the database.
 * 
 * @async
 * @function saveTaskSubtasks
 * @param {Object} task - The task object containing task details.
 * @param {string} task.path - The path representing the task's status (e.g., "toDo", "done").
 * @param {string} task.id - The unique ID of the task.
 * @param {Array} task.subtasks - The array of updated subtasks to be saved.
 * @returns {Promise<void>}
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
    // const tasks = document.getElementById(containerId);
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
 * Selects the search input field element.
 * 
 * @constant {HTMLElement} searchField
 */
const searchField = document.querySelector('#searchField');


/**
 * Filters tasks and users based on the search input and updates the UI state.
 * 
 * @function addSearchTask
 * @returns {void}
 */
function addSearchTask() {
    const searchValue = document.getElementById("searchField").value.toLowerCase();
    const noResult = !filterElements(".tasks-container .task-card", searchValue, ['task-title', 'task-description', 'task-type'], ".members-section .contact-name")
                   & !filterElements("#user-list .user-card", searchValue, ['user-name']);

    document.getElementById("no-search-result").style.display = noResult ? "block" : "none";
    document.getElementById("delete-search").classList.toggle("d-none", !searchValue);
}


/**
 * Filters elements based on a search value and updates their visibility and display properties.
 * 
 * @function filterElements
 * @param {string} selector - CSS selector for the elements to filter.
 * @param {string} searchValue - The search term to match.
 * @param {string[]} childClasses - Classes of child elements to check for matches.
 * @param {string} [extraSelector] - Optional additional selector for child elements to include in the search.
 * @returns {boolean} - Returns `true` if any matching elements are found, otherwise `false`.
 */
function filterElements(selector, searchValue, childClasses, extraSelector) {
    let found = false;

    document.querySelectorAll(selector).forEach(element => {
        const match = childClasses.some(cls => element.querySelector(`.${cls}`)?.textContent.toLowerCase().includes(searchValue)) ||
                      Array.from(element.querySelectorAll(extraSelector || "")).some(el => el.textContent.toLowerCase().includes(searchValue));

        element.style.visibility = match ? "visible" : "hidden";
        element.style.display = match ? "" : "none";
        if (match) found = true;
    });

    return found;
}


/**
 * Clears the search input and resets task visibility and related UI elements.
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


/**
 * Removes the "highlight-column" class from a column when the drag leaves the area.
 * 
 * @function removeHighlightLeave
 * @param {string} columnId - The ID of the column to remove the highlight from.
 * @returns {void}
 */
function removeHighlightLeave(columnId) {
    const column = document.getElementById(columnId);
    if (column) {
        column.classList.remove("highlight-column");
    }
}