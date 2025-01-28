/**
 * Prepares and saves the edited task by collecting necessary data 
 * and sending it to the server.
 * @param {Object} task - The task object containing task details.
 * @returns {Promise<void>}
 */
async function saveEditedTask(task) {
    try {
        const editedTask = prepareEditedTask(task);
        await saveOverlayChanges(task.id, task.path, editedTask);
        openTaskOverlay(editedTask);
    } catch (error) {
        console.error('Error saving edited task:', error);
    }
}

/**
 * Prepares an edited task object with updated information.
 * @param {Object} task - The task object.
 * @returns {Object} - The prepared edited task.
 */
function prepareEditedTask(task) {
    return {
        id: task.id,
        path: task.path,
        title: takeTitle(),
        description: takeDescription(),
        contacts: takeContacts(),
        date: takeDate(),
        prio: takePrio(),
        category: takeCatergory(),
        subtasks: takeSubtask(),
    };
}

/**
 * Sends the edited task to the server if all required elements are valid.
 * @param {string} taskId - The ID of the task.
 * @param {string} taskStatus - The status or path of the task.
 * @param {Object} editedTask - The task object with updated details.
 * @returns {Promise<void>}
 */
async function saveOverlayChanges(taskId, taskStatus, editedTask) {
    const elements = getRequiredElements();
    if (!elementsAreValid(elements)) return;

    const response = await sendEditedTask(taskId, taskStatus, editedTask);
    handleResponse(response);
}

/**
 * Sends a PUT request to update the edited task on the server.
 * @param {string} taskId - The ID of the task.
 * @param {string} taskStatus - The status or path of the task.
 * @param {Object} editedTask - The task object with updated details.
 * @returns {Promise<Response>} - The fetch API response.
 */
async function sendEditedTask(taskId, taskStatus, editedTask) {
    try {
        const url = `${base_url}/tasks/${taskStatus}/${taskId}.json`;
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(editedTask),
            headers: { 'Content-Type': 'application/json' },
        });

        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * Handles the server response and updates the application state.
 * @param {Response} response - The response object from the fetch API.
 */
function handleResponse(response) {
    if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
        throw new Error(`HTTP error: ${response.status}`);
    }

    currentSubtasks = [];
}

/**
 * Retrieves required DOM elements for the task overlay.
 * @returns {Object} - The DOM elements needed for validation.
 */
function getRequiredElements() {
    return {
        titleElement: document.getElementById('title'),
        descriptionElement: document.getElementById('description'),
        dueDateElement: document.getElementById('datepicker'),
        prioButton: document.querySelector('.prio-button.active-button'),
        categoryElement: document.getElementById('category-selection'),
    };
}

/**
 * Validates whether all required elements are present.
 * @param {Object} elements - The DOM elements to validate.
 * @returns {boolean} - True if all elements are valid, otherwise false.
 */
function elementsAreValid(elements) {
    return Object.values(elements).every((el) => el !== null);
}

/**
 * Retrieves required DOM elements for the task overlay.
 * @returns {Object} - The DOM elements needed for validation.
 */
function getRequiredElements() {
    return {
        titleElement: document.getElementById('title'),
        descriptionElement: document.getElementById('description'),
        dueDateElement: document.getElementById('datepicker'),
        prioButton: document.querySelector('.prio-button.active-button'),
        categoryElement: document.getElementById('category-selection'),
    };
}

/**
 * Validates whether all required elements are present.
 * @param {Object} elements - The DOM elements to validate.
 * @returns {boolean} - True if all elements are valid, otherwise false.
 */
function elementsAreValid(elements) {
    return Object.values(elements).every((el) => el !== null);
}
