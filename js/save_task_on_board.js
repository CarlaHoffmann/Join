/**
 * Saves the changes made to a task in the overlay and updates the task.
 * 
 * - Constructs an edited task object from the overlay inputs.
 * - Saves the updated task to the database and reloads the task overlay with the changes.
 * 
 * @async
 * @function saveEditedTask
 * @param {Object} task - The original task object to be edited.
 * @returns {Promise<void>} Resolves when the task is successfully updated.
 */
async function saveEditedTask(task) {
    try {
        const taskId = task.id;
        const taskStatus = task.path;
        let editedTask = {
            id: taskId,
            path: taskStatus,
            title: takeTitle(),
            description: takeDescription(),
            contacts: takeContacts(),
            date: takeDate(),
            prio: takePrio(),
            category: takeCatergory(),
            subtasks: takeSubtask(),
        }
        await saveOverlayChanges(taskId, taskStatus, editedTask);
        
        openTaskOverlay(editedTask); 
    } catch (error) {
    }
}


/**
 * Saves changes made to a task overlay by sending the updated task data to the database.
 * 
 * - Validates the presence of necessary elements in the overlay.
 * - Sends a `PUT` request to update the task in the database.
 * - Clears the current subtasks after a successful update.
 * 
 * @async
 * @function saveOverlayChanges
 * @param {string} taskId - The ID of the task to be updated.
 * @param {string} taskStatus - The status (column) of the task in the database.
 * @param {Object} editedTask - The updated task object containing the new data.
 * @returns {Promise<void>} Resolves when the task is successfully updated in the database.
 */
async function saveOverlayChanges(taskId, taskStatus, editedTask) {
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    const dueDateElement = document.getElementById('datepicker');
    const prioButton = document.querySelector('.prio-button.active-button');
    const categoryElement = document.getElementById('category-selection');

    if (!titleElement || !descriptionElement || !dueDateElement || !prioButton || !categoryElement) {
        return;
    }
    try {
        const url = `${base_url}/tasks/${taskStatus}/${taskId}.json`;
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(editedTask),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        currentSubtasks = [];

    } catch (error) {
    }
}