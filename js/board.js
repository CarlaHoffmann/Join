/**
 * Firebase Base URL for accessing the Realtime Database.
 * This URL is used to interact with the Firebase Realtime Database
 * for CRUD operations related to tasks, users, and other entities.
 * 
 * @constant {string} base_url - The base URL for Firebase Realtime Database.
 * @example
 * // Example usage in an API call
 * const response = await fetch(`${base_url}/tasks/toDo.json`);
 */
const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Loads tasks from the database and updates placeholders in the UI.
 * 
 * @async
 * @function loadTasks
 * @returns {Promise<void>} Resolves when all tasks are loaded and placeholders are updated.
 */
async function loadTasks() {
    try {
        await loadTaskData('toDo', 'toDoTasks');
        await loadTaskData('progress', 'progressTasks');
        await loadTaskData('feedback', 'feedbackTasks');
        await loadTaskData('done', 'doneTasks');
        updatePlaceholders();
    } catch (error) {
        // Error handling can be implemented here or logged elsewhere if needed
    }
}


/**
 * Loads tasks for a specific column from the database and displays them in the UI.
 * 
 * @async
 * @function loadTaskData
 * @param {string} path - The database path for the task column.
 * @param {string} containerId - The ID of the container where tasks will be displayed.
 * @returns {Promise<void>} Resolves when tasks are loaded and displayed.
 */
async function loadTaskData(path, containerId) {
    try {
        const url = `${base_url}/tasks/${path}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const data = await response.json();
        const taskArray = processTasks(data, path);
        displayTasks(taskArray, containerId);
    } catch (error) {
        // Error handling can be implemented here or logged elsewhere if needed
    }
}


/**
 * Processes tasks retrieved from the database, adding additional properties like contacts and subtasks.
 * 
 * @function processTasks
 * @param {Object} tasks - The tasks object retrieved from the database.
 * @param {string} status - The status of the tasks (e.g., "toDo", "progress").
 * @returns {Array<Object>} An array of processed task objects with additional properties.
 */
function processTasks(tasks, status) {
    if (!tasks) return [];
    return Object.keys(tasks).map(key => ({
        path: status,
        id: key,
        ...tasks[key],
        contacts: tasks[key].contacts ? Object.values(tasks[key].contacts) : [],
        subtasks: tasks[key].subtasks ? Object.values(tasks[key].subtasks) : [],
    }));
}


/**
 * Displays tasks in the specified container and updates placeholders.
 * 
 * @async
 * @function displayTasks
 * @param {Array<Object>} taskArray - Array of task objects to be displayed.
 * @param {string} containerId - The ID of the container where tasks will be rendered.
 * @returns {Promise<void>} Resolves after the tasks are rendered and the placeholder is updated.
 */
async function displayTasks(taskArray, containerId) {
    const tasks = document.getElementById(containerId);
    const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));

    // Farben für die Kontakte abrufen
    const contactColors = await getContactColors(taskArray);

    tasks.innerHTML = taskArray.map((task, taskIndex) => {
        const completedSubtasks = task.subtasks.filter(subtask => subtask.checked).length;
        const totalSubtasks = task.subtasks.length;
        const subtasksText = `${completedSubtasks} von ${totalSubtasks} Subtasks`;
        const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        const contactsHTML = task.contacts.map((contact, contactIndex) => {
            const contactColor = contactColors[taskIndex][contactIndex];
            const initials = getContactInitials(contact);
            return `<div class="member" style="background-color: ${contactColor}">${initials}</div>`;
        }).join('');

        const prio = getPrio(task.prio);

        return `
            <div id="task-${task.id}" class="task-card" draggable="true" 
                onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
                ondragstart="drag(event)" ondragend="dragEnd(event)">
                <div class="task-type" style="background-color: ${getCategoryColor(task.category)}">${task.category}</div>
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <div class="progress-section">
                    <div class="progress">
                        <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                    </div>
                    <p class="subtasks">${subtasksText}</p>
                </div>
                <div class="members-section">
                    <div class="members">${contactsHTML}</div>
                    <div class="priority">
                        <img src="./assets/img/add_task/prio_${prio}.svg" alt="${prio} icon">
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Placeholder-Logik
    placeholder.style.display = taskArray.length === 0 ? "block" : "none";
}


/**
 * Retrieves contact colors for each contact in the provided tasks.
 * 
 * @async
 * @function getContactColors
 * @param {Array<Object>} tasks - Array of task objects containing contacts.
 * @returns {Promise<Array<Array<string>>>} Resolves to an array of arrays, where each sub-array contains color codes for contacts in a task.
 */
async function getContactColors(tasks) {
    const contactColors = [];
    for (const task of tasks) {
        const taskContactColors = await Promise.all(task.contacts.map(async contact => {
            try {
                const response = await fetch(`${task_base_url}/users.json`);
                const users = await response.json();

                for (let userId in users) {
                    if (users[userId].name === contact) {
                        const colorResponse = await fetch(`${task_base_url}/users/${userId}/color.json`);
                        return await colorResponse.json();
                    }
                }
                return '#000000';
            } catch (error) {
                console.error("Fehler beim Abrufen der Kontaktfarbe:", error);
                return '#000000'; 
            }
        }));
        contactColors.push(taskContactColors);
    }
    return contactColors;
}

/**
 * Extracts the initials from a contact's name.
 * 
 * @function getContactInitials
 * @param {string} contact - The full name of the contact.
 * @returns {string} The initials of the contact in uppercase.
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
 * @returns {string} The hex color code associated with the category, or a default color if the category is not recognized.
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
 * Returns the priority level as a string based on the priority code.
 * 
 * @function getPrio
 * @param {string} priority - The priority code (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {string} The corresponding priority level ("urgent", "medium", or "low"). Defaults to "medium" if the code is unrecognized.
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
 * @param {DragEvent} event - The drag event triggered when an item is dragged over a drop target.
 * @returns {void}
 */
function allowDrop(event) {
    event.preventDefault();
}


/**
 * Handles the dragstart event by marking the task as being dragged and storing its ID.
 * 
 * @function drag
 * @param {DragEvent} event - The drag event triggered when a task starts being dragged.
 * @returns {void}
 */
function drag(event) {
    const task = event.target;
    task.classList.add("dragging"); // Task als "ziehend" markieren
    event.dataTransfer.setData("taskId", task.id);
}


/**
 * Handles the dragend event by removing the "dragging" class from the task.
 * 
 * @function dragEnd
 * @param {DragEvent} event - The drag event triggered when a task is dropped or the drag ends.
 * @returns {void}
 */
function dragEnd(event) {
    const task = event.target;
    task.classList.remove("dragging"); // Markierung entfernen
}


/**
 * Handles the drop event by moving a task to a new status column and updating the database.
 * 
 * @async
 * @function drop
 * @param {DragEvent} event - The drop event triggered when a task is dropped onto a new status column.
 * @param {string} newStatus - The new status to which the task is being moved (e.g., "toDo", "done").
 * @returns {Promise<void>} Resolves after the task is successfully moved and the database is updated.
 */
async function drop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    const taskElement = document.getElementById(taskId);
    if (!taskElement) return;

    const oldStatus = taskElement.parentElement.id.replace("Tasks", "");
    const taskKey = taskId.replace('task-', '');
    const taskUrl = `${base_url}/tasks/${oldStatus}/${taskKey}.json`;
    const newTaskUrl = `${base_url}/tasks/${newStatus}/${taskKey}.json`;
    const container = document.getElementById(newStatus + "Tasks");

    try {
        const response = await fetch(taskUrl);
        if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
        const taskData = await response.json();

        await fetch(taskUrl, { method: 'DELETE' });

        const putResponse = await fetch(newTaskUrl, {
            method: 'PUT',
            body: JSON.stringify(taskData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!putResponse.ok) throw new Error(`HTTP-Error: ${putResponse.status}`);

        taskElement.id = `task-${taskKey}`;
        container.appendChild(taskElement);
        updatePlaceholders();
    } catch (error) {
    }
}



/**
 * Highlights a specified column by adding a CSS class.
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
 * Removes the highlight from a specified column by removing a CSS class.
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
 * Removes the highlight from a specified column by calling `removeHighlightLeave`.
 * 
 * @function removeHighlightEnd
 * @param {string} columnId - The ID of the column to remove the highlight from.
 * @returns {void}
 */
function removeHighlightEnd(columnId) {
    removeHighlightLeave(columnId);
}
