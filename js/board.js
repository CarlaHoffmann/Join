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
        // Error handling can be implemented here or logged elsewhere if needed
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
    const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));
    console.log(placeholder);
    try {
        const url = `${base_url}/tasks/${path}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if(data) {
            placeholder.classList.add('hide');
            console.log(placeholder);
            const taskArray = processTasks(data, path);
            displayTasks(taskArray, containerId);
        } else {
            placeholder.classList.add('show');
            console.log(placeholder);
        }
        // updatePlaceholders();
    } catch (error) {
        // Error handling can be implemented here or logged elsewhere if needed
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
 * Displays a list of tasks in the specified container with progress, contacts, and priority information.
 * 
 * @async
 * @function displayTasks
 * @param {Array<Object>} taskArray - An array of task objects to be displayed.
 * @param {string} containerId - The ID of the container where tasks will be rendered.
 * @returns {Promise<void>}
 */
async function displayTasks(taskArray, containerId) {
    const tasks = document.getElementById(containerId);
    

    const contactColors = await getContactColors(taskArray);

    tasks.innerHTML = taskArray.map((task, taskIndex) => {
        const completedSubtasks = task.subtasks.filter(subtask => subtask.checked).length;
        const totalSubtasks = task.subtasks.length;
        const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
        const subtasksText = totalSubtasks > 0 ? `${completedSubtasks} von ${totalSubtasks} Subtasks` : "";

        const contactsHTML = task.contacts.map((contact, contactIndex) => {
            const contactColor = contactColors[taskIndex][contactIndex];
            const initials = getContactInitials(contact);
            return `<div class="member" style="background-color: ${contactColor}">${initials}</div>`;
        }).join('');

        const prio = getPrio(task.prio);

        const progressBarHTML = totalSubtasks > 0 ? `
            <div class="progress-section">
                <div class="progress">
                    <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                </div>
                <p class="subtasks">${subtasksText}</p>
            </div>` : '';

        return `
            <div id="task-${task.id}" class="task-card" draggable="true" 
                onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
                ondragstart="drag(event)" ondragend="dragEnd(event)">
                <div class="task-type" style="background-color: ${getCategoryColor(task.category)}">${task.category}</div>
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                ${progressBarHTML}
                <div class="members-section">
                    <div class="members">${contactsHTML}</div>
                    <div class="priority">
                        <img src="./assets/img/add_task/prio_${prio}.svg" alt="${prio} icon">
                    </div>
                </div>
            </div>
        `;
    }).join('');

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
                    if (users[userId].name === contact) {
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
 * Handles the drop event for a task, moving it to a new status and updating the database.
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
