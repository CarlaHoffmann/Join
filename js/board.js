/**
 * The base URL for the Firebase Realtime Database.
 * 
 * @constant {string} base_url
 */
const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app";


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

/**
 * Generates initials from a contact's name.
 * 
 * @function getContactInitials
 * @param {string} contact - The full name of the contact.
 * @returns {string} - The initials derived from the contact's name.
 */
function getContactInitials(contact) {
    let initials = contact.split(' ').map(word => word[0]).join('').toUpperCase();
    return initials;
}

/**
 * Returns the color associated with a given task category.
 * 
 * @function getCategoryColor
 * @param {string} category - The category of the task (e.g., "User Story", "Technical Task").
 * @returns {string} - The color code corresponding to the category.
 */
function getCategoryColor(category) {
    if (category === 'User Story') {
        return '#0038FF';
    }
    if (category === 'Technical Task') {
        return '#1FD7C1';
    }
    return '#000000';
}

/**
 * Maps a priority level to its corresponding priority label.
 * 
 * @function getPrio
 * @param {string} priority - The priority level (e.g., '1', '2', '3').
 * @returns {string} - The priority label ('urgent', 'medium', 'low').
 */
function getPrio(priority) {
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'medium';
        case '3': return 'low';
        default: return 'medium';
    }
}

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
