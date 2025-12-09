/**
 * The base URL for the Firebase Realtime Database.
 * 
 * @constant {string} base_url
 */
const base_url = "https://join-eaf29-default-rtdb.europe-west1.firebasedatabase.app";


/**
 * Loads tasks for all columns from the database and updates placeholders.
 * 
 * @async
 * @function loadTasks
 * @returns {Promise<void>}
 */
async function loadTasks() {
    try {
        await loadTaskData('toDo', 'toDoTasks');
        await loadTaskData('progress', 'progressTasks');
        await loadTaskData('feedback', 'feedbackTasks');
        await loadTaskData('done', 'doneTasks');
        updatePlaceholders();
    } catch (error) {
    }
}

/**
 * Loads task data from the database for a specific column and updates the UI.
 * 
 * @async
 * @function loadTaskData
 * @param {string} path - The path representing the task status (e.g., "toDo", "progress").
 * @param {string} containerId - The ID of the container element where tasks will be displayed.
 * @returns {Promise<void>}
 */
async function loadTaskData(path, containerId) {
    try {
        const url = `${base_url}/tasks/${path}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }
        const data = await response.json();
        if(data) {
            const taskArray = processTasks(data, path);
            displayTasks(taskArray, containerId);
        }
    } catch (error) {
    }
}

/**
 * Processes tasks data from the database into an array of task objects.
 * 
 * @function processTasks
 * @param {Object} tasks - The tasks data retrieved from the database.
 * @param {string} status - The status of the tasks (e.g., "toDo", "progress").
 * @returns {Array<Object>} - An array of processed task objects, each containing path, id, and other task properties.
 */
function processTasks(tasks, status) {
    if (!tasks) {
        return [];
    }
    return Object.keys(tasks).map(key => ({
        path: status,
        id: key,
        ...tasks[key],
        contacts: tasks[key].contacts ? Object.values(tasks[key].contacts) : [],
        subtasks: tasks[key].subtasks ? Object.values(tasks[key].subtasks) : [],
    }));
}

/**
 * Fetches the task data from the database based on the task element and ID.
 * 
 * @async
 * @function fetchTaskData
 * @param {HTMLElement} taskElement - The task element being moved.
 * @param {string} taskId - The ID of the task.
 * @returns {Promise<Object|null>} - The task data or null if an error occurs.
 */
async function fetchTaskData(taskElement, taskId) {
    try {
        const response = await fetch(getTaskUrl(taskElement.parentElement.id.replace("Tasks", ""), taskId.replace('task-', '')));
        if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        return null;
    }
}

/**
 * Fetches all users from the database.
 * @returns {Promise<Object>} - An object containing all users with their IDs as keys.
 */
async function fetchAllUsers() {
    const response = await fetch(`${task_base_url}/users.json`);
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);
    return response.json();
}

/**
 * Fetches the name of a specific contact by ID.
 * @param {string} contactId - The ID of the contact.
 * @returns {Promise<string>} - The name of the contact.
 */
async function fetchContactName(contactId) {
    const response = await fetch(`${task_base_url}/users/${contactId}/name.json`);
    if (!response.ok) throw new Error(`Failed to fetch contact name: ${response.statusText}`);
    return response.json();
}


/**
 * Constructs the URL for accessing task data in the database based on status and task key.
 * 
 * @function getTaskUrl
 * @param {string} status - The status of the task (e.g., "toDo", "progress").
 * @param {string} taskKey - The key of the task in the database.
 * @returns {string} - The constructed URL.
 */
function getTaskUrl(status, taskKey) {
    return `${base_url}/tasks/${status}/${taskKey}.json`;
}

/**
 * Moves task data from the old status to the new status in the database.
 * 
 * @async
 * @function moveTaskData
 * @param {string} oldStatus - The current status of the task.
 * @param {string} newStatus - The new status of the task.
 * @param {string} taskKey - The key of the task in the database.
 * @param {Object} taskData - The task data to be moved.
 * @returns {Promise<void>}
 */
async function moveTaskData(oldStatus, newStatus, taskKey, taskData) {
    try {
        await fetch(getTaskUrl(oldStatus, taskKey), { method: 'DELETE' });
        const putResponse = await fetch(getTaskUrl(newStatus, taskKey), {
            method: 'PUT',
            body: JSON.stringify(taskData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!putResponse.ok) throw new Error(`HTTP-Error: ${putResponse.status}`);
    } catch (error) {
    }
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
 * Sends a PUT request to update a subtask in the database.
 * @param {Object} task - The task object containing subtasks and metadata.
 * @param {string} subtaskKey - The key of the subtask to update.
 * @returns {Promise<void>}
 */
async function updateSubtaskInDatabase(task, subtaskKey) {
    const url = `${base_url}/tasks/${task.path}/${task.id}/subtasks/${subtaskKey}.json`;
    await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(task.subtasks[subtaskKey]),
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Fetches the names of contacts for a specific task.
 * @param {Array<string>} contacts - An array of contact IDs associated with a task.
 * @returns {Promise<Array<string>>} - An array of contact names.
 */
async function fetchTaskContactNames(contacts) {
    return Promise.all(
        contacts.map(async (contact) => {
            try {
                const users = await fetchAllUsers();
                if (users[contact]) {
                    return await fetchContactName(contact);
                }
                return '';
            } catch (error) {
                console.error(`Error fetching contact name for ID ${contact}:`, error);
                return 'nn';
            }
        })
    );
}

/**
 * Retrieves colors for contacts associated with tasks by querying the database.
 * 
 * @async
 * @function getContactColors
 * @param {Array<Object>} tasks - An array of task objects containing contacts.
 * @returns {Promise<Array<Array<string>>>} - A nested array of color codes for each task's contacts.
 */
async function getContactColors(tasks) {
    const contactColors = [];
    for (const task of tasks) {
        const taskContactColors = await Promise.all(task.contacts.map(async contact => {
            try {
                const response = await fetch(`${task_base_url}/users.json`);
                const users = await response.json();

                for (let userId in users) {
                    if (userId === contact) {
                        const colorResponse = await fetch(`${task_base_url}/users/${userId}/color.json`);
                        return await colorResponse.json();
                    }
                }
                return '#000000';
            } catch (error) {
                return '#000000'; 
            }
        }));
        contactColors.push(taskContactColors);
    }
    return contactColors;
}