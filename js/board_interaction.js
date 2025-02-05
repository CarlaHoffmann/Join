/**
 * Allows an element to be dropped by preventing the default dragover behavior.
 * 
 * @function allowDrop
 * @param {DragEvent} event - The drag event.
 * @returns {void}
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Initiates a drag operation for a task and marks it as "dragging."
 * 
 * @function drag
 * @param {DragEvent} event - The drag event.
 * @returns {void}
 */
function drag(event) {
    const task = event.target;
    task.classList.add("dragging"); // Task als "ziehend" markieren
    event.dataTransfer.setData("taskId", task.id);
}

/**
 * Handles the end of a drag operation by removing the "dragging" class from the task.
 * 
 * @function dragEnd
 * @param {DragEvent} event - The drag event.
 * @returns {void}
 */
function dragEnd(event) {
    const task = event.target;
    task.classList.remove("dragging"); // Markierung entfernen
}

/**
 * Handles the drop event for a task, moving it to a new status and updating the database and UI.
 * 
 * @async
 * @function drop
 * @param {DragEvent} event - The drag event.
 * @param {string} newStatus - The new status for the task (e.g., "toDo", "progress").
 * @returns {Promise<void>}
 */
async function drop(event, newStatus) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData("taskId");
    const taskElement = document.getElementById(taskId);
    if (!taskElement) return;
    const taskData = await fetchTaskData(taskElement, taskId);
    if (!taskData) return;
    const { oldStatus, taskKey } = extractTaskInfo(taskElement, taskId);

    await moveTaskData(oldStatus, newStatus, taskKey, taskData);
    updateTaskElement(taskElement, newStatus, taskKey);
}

/**
 * Extracts task information, such as the old status and task key, from the task element and ID.
 * 
 * @function extractTaskInfo
 * @param {HTMLElement} taskElement - The task element being moved.
 * @param {string} taskId - The ID of the task.
 * @returns {Object} - An object containing the old status and task key.
 */
function extractTaskInfo(taskElement, taskId) {
    const oldStatus = taskElement.parentElement.id.replace("Tasks", "");
    const taskKey = taskId.replace('task-', '');
    return { oldStatus, taskKey };
}

/**
 * Highlights a column by adding a "highlight-column" class to it.
 * 
 * @function highlight
 * @param {string} columnId - The ID of the column to highlight.
 * @returns {void}
 */
function highlight(columnId) {
    const column = document.getElementById(columnId);
    if (column) {
        column.classList.add("highlight-column");
    }
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

/**
 * Removes the highlight from a column at the end of a drag operation.
 * 
 * @function removeHighlightEnd
 * @param {string} columnId - The ID of the column to remove the highlight from.
 * @returns {void}
 */
function removeHighlightEnd(columnId) {
    removeHighlightLeave(columnId);
}

/**
 * Toggles the visibility of the dropdown menu and updates the menu-circle color.
 *
 * @param {string} dropdownId - The ID of the dropdown menu to toggle.
 */
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const menuCircle = dropdown?.parentElement; // Der umgebende .menu-circle

    if (dropdown) {
        if (dropdown.classList.contains('hidden')) {
            dropdown.classList.remove('hidden');
            menuCircle?.classList.add('dropdown-active');
            document.addEventListener('click', (event) => closeDropdownMobileOnOutsideClick(event, dropdownId));
        } else {
            closeDropdown(dropdownId);
        }
    }
}

/**
 * Closes the dropdown menu and removes the active state.
 *
 * @param {string} dropdownId - The ID of the dropdown menu to close.
 */
function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const menuCircle = dropdown?.parentElement; // Der umgebende .menu-circle

    if (dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden'); // Schließe das Dropdown
        menuCircle?.classList.remove('dropdown-active'); // Entferne die aktive Klasse
    }
    document.removeEventListener('click', (event) => closeDropdownMobileOnOutsideClick(event, dropdownId));
}

/**
 * Closes the dropdown when a click occurs outside of it.
 * 
 * @param {Event} event - The click event object.
 * @param {string} dropdownId - The ID of the dropdown element.
 * 
 * @description
 * This function is typically used as an event listener for click events on the document.
 * It checks if the click occurred outside the specified dropdown and closes it if so.
 * 
 * @example
 * document.addEventListener('click', (event) => closeDropdownMobileOnOutsideClick(event, 'myDropdownId'));
 * 
 * @requires closeDropdown - A function that handles closing the dropdown.
 */
function closeDropdownMobileOnOutsideClick(event, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown && !dropdown.contains(event.target)) {
        closeDropdown(dropdownId);
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

let subtaskListenerFunction;
/**
 * Adds event listeners to subtask checkboxes to handle updates when toggled.
 * @param {Object} task - The task object containing subtasks and metadata.
 */
function addSubtaskListeners(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    const checkboxes = overlayContainer.querySelectorAll('input[type="checkbox"]');

    subtaskListenerFunction = (event) => handleSubtaskToggle(event, task);

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', subtaskListenerFunction);
    });
}

/**
 * Handles the toggle of a subtask checkbox, updates the task's state, 
 * and sends the update to the database.
 * @param {Event} event - The change event triggered by the checkbox.
 * @param {Object} task - The task object containing subtasks and metadata.
 */
async function handleSubtaskToggle(event, task) {
    const checkbox = event.target;
    const subtaskKey = checkbox.dataset.subtaskKey;
    const isChecked = checkbox.checked;

    task.subtasks[subtaskKey].checked = isChecked;

    await updateSubtaskInDatabase(task, subtaskKey);
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
 * Toggles the completion status of a subtask and updates it in the database and UI.
 * 
 * @async
 * @function toggleSubtaskStatus
 * @param {string} path - The path representing the task's status (e.g., "toDo", "progress").
 * @param {string} taskId - The unique ID of the task containing the subtask.
 * @param {string} subtaskKey - The unique key of the subtask to toggle.
 * @returns {Promise<void>}
 */
async function toggleSubtaskStatus(path, taskId, subtaskKey) {
    try {
        const subtaskElement = document.querySelector(`.check[data-subtask-key="${subtaskKey}"] img`);
        const currentStatus = subtaskElement.src.includes('checked_button.svg');
        const newStatus = !currentStatus;
        subtaskElement.src = newStatus
            ? 'assets/img/board/checked_button.svg'
            : 'assets/img/board/check_button.svg';
        currentTask.subtasks[subtaskKey].checked = newStatus;

        const url = `${base_url}/tasks/${path}/${taskId}/subtasks/${subtaskKey}.json`;
        await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ ...currentTask.subtasks[subtaskKey], checked: newStatus }),
            headers: { 'Content-Type': 'application/json' },
        });
        loadTasks();
    } catch (error) {
    }
}

/**
 * Deletes a task by its ID after user confirmation and updates the UI.
 *
 * @async
 * @function deleteTask
 * @param {string} taskId - The unique ID of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
    const confirmDelete = await showCustomConfirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        try {
            const taskElement = document.getElementById(`task-${taskId}`);
            const parentColumnId = taskElement.parentElement.id.replace("Tasks", "");

            const url = `${base_url}/tasks/${parentColumnId}/${taskId}.json`;
            await fetch(url, { method: 'DELETE' });

            taskElement.remove();

            currentTask = [];
            closeTaskOverlay();
        } catch (error) {
        }
    }
}

/**
 * Moves a task to a specified column and closes the dropdown.
* @param {string} taskId - The ID of the task to move.
* @param {string} newStatus - The new status to move the task to (e.g., 'toDo', 'progress').
*/
async function moveTask(taskId, newStatus) {
    const taskElement = document.getElementById(`task-${taskId}`);
    const oldStatus = taskElement.parentElement.id.replace("Tasks", "");

    const taskData = await fetchTaskData(taskElement, taskId);
    if (!taskData) return;

    await moveTaskData(oldStatus, newStatus, taskId, taskData); 
    updateTaskElement(taskElement, newStatus, taskId);

    const dropdownId = `dropdown-${taskId}`;
    closeDropdown(dropdownId); 
}