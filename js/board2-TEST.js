// subtaskManagement

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
 * Toggles the status of a subtask and updates its visual representation in the UI.
 * 
 * @async
 * @function toggleSubtaskStatus
 * @param {string} path - The database path for the task containing the subtask.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {string} subtaskKey - The key of the subtask to toggle.
 * @returns {Promise<void>} Resolves when the status is toggled and UI is updated.
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
    } catch (error) {
    }
}


/**
 * Filters and returns the existing subtasks by removing duplicates based on task name.
 * 
 * - Checks whether a subtask already exists by comparing task names (case-insensitive).
 * - Returns a new array of subtasks with unique names.
 * 
 * @function getExistingSubtasks
 * @param {Array<Object>} currentSubtasks - The list of current subtasks to be filtered.
 * @returns {Array<Object>} A new array containing the unique subtasks.
 */
function getExistingSubtasks(currentSubtasks) {
    const newSubtask = [];
    if (currentSubtasks) {
        currentSubtasks.forEach(element => {
            const taskExists = newSubtask.some(subtask => subtask.task.toLowerCase() === element.task.toLowerCase());
            if (!taskExists) {
                newSubtask.push({
                    task: element.task,
                    checked: element.checked || false
                });
            }
        });
    }
    return newSubtask;
}


/**
 * Generates the HTML template for a subtask with options to edit or delete it.
 * 
 * - Creates a div for the subtask with its description.
 * - Adds icons for editing and deleting the subtask.
 * 
 * @function getAddEditedSubtaskTemplate
 * @param {number} i - The index of the subtask in the list.
 * @param {string} element - The description of the subtask.
 * @param {boolean} checked - The checked status of the subtask.
 * @returns {string} The HTML template for the subtask.
 */
function getAddEditedSubtaskTemplate(i, element, checked) {
    return `
        <div id="subtask${i}">
            <div onclick="editEditedSubtask(${i}, '${element}', ${checked})" class="subtask-box" value="${checked}">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editEditedSubtask(${i}, '${element}', ${checked})" class="icon-hover" src="./img/task/subtask_add_pen.svg" alt=""></div>
                    <div><img src="./img/task/vector-3.svg" alt=""></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt=""></div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Adds a new subtask to the task and updates the displayed list of subtasks.
 * 
 * - Retrieves the new subtask input and adds it to the list of existing subtasks.
 * - Checks if the subtask already exists before adding it.
 * - Updates the displayed list of subtasks in the UI.
 * 
 * @function addEditedSubtask
 * @param {Object} task - The task object containing the current subtasks to be updated.
 * @returns {void}
 */
let existingSubtasks = [];
function addEditedSubtask(task) {
    let subtaskInput = document.getElementById('subtaskInput');
    let addedSubtask = document.getElementById('subtasks');

    let newSubtask = subtaskInput.value.trim();

    if (existingSubtasks.length === 0) {
        existingSubtasks = getExistingSubtasks(task.subtasks);
    }

    console.log(existingSubtasks);
    currentSubtasks = [];
    currentSubtasks = existingSubtasks;

    if (newSubtask) {

            currentSubtasks.push({
                task: newSubtask,
                checked: false
            });
        } else {
    }

    addedSubtask.innerHTML = '';
    for (let i = 0; i < currentSubtasks.length; i++) {
        const element = currentSubtasks[i];
        addedSubtask.innerHTML += getAddEditedSubtaskTemplate(i, element.task, element.checked);
    }
    closeSubtask();
}


/**
 * Edits an existing subtask by updating its content and focusing the input field.
 * 
 * - Replaces the subtask element's content with the edit template.
 * - Focuses the input field and positions the cursor at the end of the text.
 * 
 * @function editEditedSubtask
 * @param {number} index - The index of the subtask to be edited.
 * @param {string} text - The new text for the subtask.
 * @param {boolean} checked - The checked status of the subtask.
 * @returns {void}
 */
function editEditedSubtask(index, text, checked) {
    let subtaskElement = document.getElementById(`subtask${index}`);
    subtaskElement.innerHTML = editSubtaskTemplate(index, text, checked);

    let input = subtaskElement.querySelector('.edit-subtask-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}