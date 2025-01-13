// config.js

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


/**
 * Opens the edit overlay for a specified task and populates it with task data.
 * 
 * @async
 * @function openEditTaskOverlay
 * @param {Object} task - The task object containing details to populate the overlay.
 * @returns {Promise<void>} Resolves when the overlay is successfully rendered and initialized.
 */
let currentTask = null;

async function openEditTaskOverlay(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');

    selectedContacts = task.contacts;

    Object.keys(task.subtasks).forEach(key => {
        currentSubtasks.push({
            task: task.subtasks[key].task,
            checked: task.subtasks[key].checked
        });
    });

    const subtasksHTML = currentSubtasks.map((subtask, index) => {
        return getAddEditedSubtaskTemplate(index, subtask.task, subtask.checked);
    }).join('');

    overlayContainer.innerHTML = `
    <div class="taskOverlay">
        <!-- Schließen-Button -->
        <div class="close" onclick="closeTaskOverlay()">
            <img src="assets/img/add_task/close.svg" alt="Close" />
        </div>

        <!-- Scrollbarer Bereich -->
        <div class="scroll-container fill-in-part-edit">
            <div class="add-task-edit-form">
                
                <!-- Erster Abschnitt -->
                <div id="add-task-first" class="width-440-edit">
                    <div class="labled-box">
                        <label class="form-label">
                            <div>
                                Title<span class="red-asterisk">*</span>
                            </div>
                            <div id="titel-wrapper">
                                <input 
                                    type="text" 
                                    id="title" 
                                    class="form-field margin-bottom title-edit" 
                                    placeholder="Enter a title" 
                                    minlength="3" 
                                    required 
                                    value="${task.title}">
                                <div id="title-error" class="error-message d-none">
                                    This field is required.
                                </div>
                                <div id="title-minlength-error" class="error-message d-none">
                                    Please enter at least 3 characters.
                                </div>
                                </div>
                            </label>
                        </div>

                        <div class="labled-box">
                            <label class="form-label">
                                Description
                                <textarea name="description" id="description" class="form-field margin-bottom description" placeholder="Enter a description">${task.description}</textarea>
                            </label>
                        </div>

                        <div class="labled-box">
                            <label class="form-label">
                                Assigned to
                                <div id="contact-selection" class="contact-selection">
                                    <div onclick="openAssigned()" id="select-field" class="selection-field form-field pad-12-16">
                                        <p>Select contacts to assign</p><img class="symbol-hover icon-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
                                    </div>
                                    <div onclick="closeAssigned()" id="contact-drop-down" class="select-items" style="display: none;">
                                        <div id="contact-dropped-down" class="selection-field form-field pad-12-16 blue-border">
                                            <p>Select contacts to assign</p><img class="symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
                                        </div>
                                        <div id="contacts-to-select"></div>
                                    </div>
                                </div>
                            </label>
                            <div id="selected-contacts" class="selected-contacts"></div>
                        </div>
                    </div>

                    <div class="vertical-divider hide-mobile"></div>

                    <div id="add-task-second" class="width-440-edit">
                        <div class="labled-box">
                            <label class="form-label">
                                <div>Due date<span class="red-asterisk">*</span></div>
                                <div class="date-input-wrapper">
                                    <input type="text" id="datepicker" class="form-field margin-bottom pad-12-16 date-input" placeholder="dd/mm/yyyy" maxlength="10" required value="${task.date}">
                                    <span class="calendar-icon">
                                        <img src="./img/task/event.svg" alt="Calendar" class="calendar-icon">
                                    </span>
                                    <div id="due-date-error" class="error-message d-none">This field is required.</div>
                                </div>
                            </label>                    
                        </div>

                        <div class="labled-box">
                            <div class="button-box">
                                <div  class="form-label">Prio</div>
                                <div class="prio-buttons">
                                    <button onclick="priority(1, event)" class="prio-button hover-button" id="prio1">
                                        <p>Urgent</p>
                                        <div class="double-arrow-up">
                                            <img src="./img/task/prio_high.svg" alt="high">
                                        </div>
                                    </button>
                                    <button onclick="priority(2, event)" class="prio-button hover-button" id="prio2">
                                        <p>Medium</p>
                                        <div class="double-line">
                                            <img src="./img/task/prio_med.svg" alt="medium">
                                        </div>
                                    </button>
                                    <button onclick="priority(3, event)" class="prio-button hover-button" id="prio3">
                                        <p>Low</p>
                                        <div class="double-arrow-down">
                                            <img src="./img/task/prio_low.svg" alt="low">
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="labled-box">
                            <div class="form-label">
                                <div>Category<span class="red-asterisk">*</span></div>
                                <div id="select-wrapper" class="select-wrapper">
                                    <div  id="category">
                                        <div onclick="showCategory()" class="select-field">
                                            <div id="category-selection" class="form-field margin-bottom pad-12-16">'Select task category'</div>
                                            <img class="dropdown-icon symbol-hover icon-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
                                        </div>
                                    </div>
                                    <div id="error-message" class="error-message d-none">This field is required.</div>

                                    <div id="opened-category" class="d-none">
                                        <div onclick="showCategory()" class="select-field">
                                            <div class="form-field pad-12-16 blue-border">Select task category</div>
                                            <img id="dropdown-icon2" class="dropdown-icon symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
                                        </div>
                                        <div class="selection-drop-down">
                                            <div onclick="categorySelected('Technical Task')" class="drop-down-field">Technical Task</div>
                                            <div onclick="categorySelected('User Story')" class="drop-down-field">User Story</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="labled-box">
                            <label class="form-label">
                                Subtasks
                                <div onclick="openEditSubtaskTemplate(${JSON.stringify(task).replace(/"/g, '&quot;')})" id="subtask-input-wrapper">
                                    <div id="subtask">
                                        <input id="subtaskInput" type="text" class="form-field pad-12-16" placeholder="Add new subtask">
                                        <div id="subtask-buttons">
                                            <img class="subtask-img symbol-hover icon-hover" src="./img/task/subtask.svg" alt="add subtask">
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <div>
                                <div id="subtasks">
                                    ${subtasksHTML}
                                </div>
                            </div>
                            <span class="font-16 hide-desktop"><span class="red-asterisk">*</span>This field is required</span>
                        </div>

                        <!-- Weitere Felder und Logik hierhin -->
                    </div>
                </div>
            </div>

        <div class="okBtnContainer">
            <button onclick="saveEditedTask(${JSON.stringify(task).replace(/"/g, '&quot;')})" class="submit-button">
                OK <img src="assets/img/add_task/check 2.svg" alt="OK Icon" class="button-icon">

            </button>
        </div>
            <div id="task-added-overlay" class="dialog d-none">
                <div id="task-added-confirmation">
                    <div class="confirmation-text">Task added to board</div>
                    <img src="./img/task/board_symbol.svg" alt="">
                </div>
            </div>
        </div>`;

    overlayContainer.classList.remove('d-none');

    updateEditContacts();
    initializeDatePicker();
    initializeEditPriority(task.prio);
    categorySelected(task.category);
}


/**
 * Closes the edit task overlay and reopens the task overlay for viewing the task.
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
 * Starts the task overlay animation by making the container visible and applying the animation class.
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
 * Closes the task overlay with an animation and hides the container.
 * 
 * @function closeTaskOverlayAnimation
 * @returns {void}
 */
function closeTaskOverlayAnimation() {
    let taskOverlay = document.getElementById('taskOverlay');
    let taskOverlayContainer = document.getElementById('taskOverlayContainer');
    taskOverlay.classList.remove('show');
    taskOverlay.classList.add('hide');
    
    taskOverlayContainer.classList.add('d-none');
    closeTaskOverlay();
}



/**
 * Opens the task overlay for viewing the details of a specific task, including contacts, subtasks, and metadata.
 * 
 * @async
 * @function openTaskOverlay
 * @param {Object} task - The task object containing the details to display in the overlay.
 * @returns {Promise<void>} Resolves when the overlay is populated and displayed.
 */
async function openTaskOverlay(task) {
    currentTask = task;
    const overlayContainer = document.getElementById('taskOverlayContainer');

    const contactColors = await getContactColors([task]);
    const contactsHTML = task.contacts.map((contact, index) => {
        const contactColor = contactColors[0][index];
        const initials = getContactInitials(contact);
        return `
            <div class="assigned-contact">
                <div class="contact-initial" style="background-color: ${contactColor};">${initials}</div>
                <span class="contact-name">${contact}</span>
            </div>`;
    }).join('');

    let subtasksHTML = '';
    for (const key in task.subtasks || {}) {
        if (Object.hasOwnProperty.call(task.subtasks, key)) {
            const subtask = task.subtasks[key];
            const svgIcon = subtask.checked
                ? 'assets/img/board/checked_button.svg'
                : 'assets/img/board/check_button.svg';
    
            subtasksHTML += `
                <div class="check" data-subtask-key="${key}">
                    <img src="${svgIcon}" class="subtask-checkbox-icon" alt="Subtask Status" 
                         onclick="toggleSubtaskStatus('${task.path}', '${task.id}', '${key}', ${!subtask.checked})">
                    <div class="subtask-text">${subtask.task}</div>
                </div>`;
            }
        }
    overlayContainer.innerHTML = `
    <div id="taskOverlay" class="taskOverlay">
        <div class="taskSelect">
            <div class="taskContainer" style="background-color: ${getCategoryColor(task.category)}">${task.category}</div>
            <div class="close" onclick="closeTaskOverlay()">
                <img src="assets/img/add_task/close.svg" alt="Close" />
            </div>
        </div>

        <!-- Titel -->
        <div class="headline">${task.title}</div>

        <!-- Beschreibung -->
        <div class="description">${task.description}</div>

        <!-- Due Date und Priority untereinander -->
        <div class="task-info-wrapper">
            <div class="task-info">
                <span class="info-label">Due date:</span>
                <span class="info-value">${task.date}</span>
            </div>
            <div class="task-info">
                <span class="info-label">Priority:</span>
                <span class="info-value priority-container">
                    ${getPrioText(task.prio)}
                    <img src="${getPrioImage(task.prio)}" alt="Priority Icon" class="priority-icon">
                </span>
            </div>
        </div>

        <!-- Assigned Contacts -->
        <div>
            <span class="info-label">Assigned To:</span>
            <div class="userContainer">${contactsHTML}</div>
        </div>

        <!-- Subtasks -->
        <div>
            <span class="info-label">Subtasks:</span>
            <div>${subtasksHTML}</div>
        </div>

        <!-- Delete and Edit Buttons -->
        <div class="deleteEditBtnContainer">
            <!-- Delete Button -->
            <div class="icon-text-button" onclick="deleteTask('${task.id}')">
                <svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 11V17" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 11V17" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="icon-text">Delete</span>
            </div>

            <!-- Vertikale Trennlinie -->
            <div class="vertical-line"></div>

            <!-- Edit Button -->
            <div class="icon-text-button" onclick="openEditTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})">
                <svg class="icon-svg" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
                </svg>
                <span class="icon-text">Edit</span>
            </div>
        </div>
    </div>`;

    // Event Listener für die Subtasks hinzufügen
    addSubtaskListeners(task);

    // Überprüfen Sie, ob das DOM aktualisiert wurde
    requestAnimationFrame(() => {
        if (document.getElementById('taskOverlay')) {
            startTaskOverlayAnimation();
        }
    });
}



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
 * Returns the image path for the specified priority level.
 * 
 * @function getPrioImage
 * @param {string} prio - The priority level (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {string} The file path to the corresponding priority image.
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
 * Returns the text representation for the specified priority level.
 * 
 * @function getPrioText
 * @param {string} prio - The priority level (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {string} The corresponding priority text.
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
 * Enables edit mode for a task overlay by making input fields editable and showing relevant buttons.
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
 * Sets the priority for a task in the overlay by updating the active button and the hidden input field.
 * 
 * @function setOverlayPriority
 * @param {string} priority - The priority level to set (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {void}
 */
function setOverlayPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => button.classList.remove('active-button'));
    document.getElementById(`prio${priority}`).classList.add('active-button');
    document.getElementById('overlayPriority').value = priority;
}


/**
 * Adds a new subtask to the overlay's subtask list if the input is not empty.
 * 
 * @function addOverlaySubtask
 * @returns {void}
 */
function addOverlaySubtask() {
    const newSubtask = document.getElementById('newSubtaskInput').value.trim();
    if (newSubtask) {
        const subtasksList = document.getElementById('overlaySubtasks');
        subtasksList.innerHTML += `<li>${newSubtask}</li>`;
        document.getElementById('newSubtaskInput').value = '';
    }
}


/**
 * Closes the task overlay, saves subtasks for the current task if available, and reloads tasks.
 * 
 * @async
 * @function closeTaskOverlay
 * @returns {Promise<void>} Resolves when the overlay is closed and tasks are reloaded.
 */
async function closeTaskOverlay() {
    const overlayContainer = document.getElementById('taskOverlayContainer');

    if (currentTask && Object.keys(currentTask).length > 0) {
        await saveTaskSubtasks(currentTask);
    }

    overlayContainer.classList.add('d-none');
    overlayContainer.innerHTML = '';
    await loadTasks();
}


/**
 * Saves the updated subtasks of a task to the database.
 * 
 * @async
 * @function saveTaskSubtasks
 * @param {Object} task - The task object containing the updated subtasks.
 * @returns {Promise<void>} Resolves when the subtasks are successfully saved.
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
 * Updates the task overlay with the latest data from the database.
 * 
 * @async
 * @function updateOverlay
 * @param {string} taskId - The ID of the task to update.
 * @param {string} taskStatus - The status (column) of the task in the database.
 * @returns {Promise<void>} Resolves when the overlay is updated with the latest task data.
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
 * Deletes all subtasks for a given task from the database.
 * 
 * @async
 * @function deleteSubtasks
 * @param {string} path - The database path for the task.
 * @param {string} id - The ID of the task whose subtasks are to be deleted.
 * @returns {Promise<void>} Resolves when the subtasks are successfully deleted.
 */
async function deleteSubtasks(path, id) {
    try {
        const url = `${base_url}/tasks/${path}/${id}/subtasks.json`;
        const response = await fetch(url, { method: 'DELETE' });

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }
    } catch (error) {
    }
}


/**
 * Deletes a task and its subtasks from the database and removes it from the UI.
 * 
 * @async
 * @function deleteTask
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {Promise<void>} Resolves when the task and its subtasks are successfully deleted.
 */
async function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        try {
            const taskElement = document.getElementById(`task-${taskId}`);
            const parentColumnId = taskElement.parentElement.id.replace("Tasks", "");

            await deleteSubtasks(parentColumnId, taskId);

            const url = `${base_url}/tasks/${parentColumnId}/${taskId}.json`;
            await fetch(url, { method: 'DELETE' });

            taskElement.remove();

            updatePlaceholders();

            currentTask = [];
            closeTaskOverlay();
        } catch (error) {}
    }
}


/**
 * Updates the visibility of placeholders in task columns based on the number of tasks.
 * 
 * @function updatePlaceholders
 * @returns {void}
 */
function updatePlaceholders() {
    const columns = ["toDo", "progress", "feedback", "done"];
    columns.forEach(column => {
        const tasksContainer = document.getElementById(column + "Tasks");
        const placeholder = document.getElementById(column + "Placeholder");
        if (tasksContainer.childElementCount === 0) {
            placeholder.style.display = "block";
        } else {
            placeholder.style.display = "none";
        }
    });
}

/**
 * Selects the search field element from the DOM.
 * 
 * @constant {Element} searchField - The input element for the search functionality.
 */
const searchField = document.querySelector('#searchField');



/**
 * Searches for tasks and users matching the search input and updates their visibility.
 * 
 * - Tasks are searched by title, description, category, and participants.
 * - Users are searched by name.
 * - Displays a "no results" message if no matches are found.
 * 
 * @function addSearchTask
 * @returns {void}
 */
/**
 * Performs a search for tasks and users based on the input value and displays matching results.
 * 
 * @function addSearchTask
 * @returns {void}
 */
function addSearchTask() {
    const searchValue = document.getElementById("searchField").value.toLowerCase(); 
    const tasksContainers = document.querySelectorAll(".tasks-container");
    const userList = document.querySelectorAll("#user-list .user-card");

    let noResultFound = true;

    // Search tasks
    tasksContainers.forEach(container => {
        container.querySelectorAll(".task-card").forEach(task => {
            const match = ['task-title', 'task-description', 'task-type']
                .some(className => task.querySelector(`.${className}`).textContent.toLowerCase().includes(searchValue)) ||
                Array.from(task.querySelectorAll(".members-section .contact-name"))
                    .some(contact => contact.textContent.toLowerCase().includes(searchValue));

            task.style.visibility = match ? "visible" : "hidden";
            task.style.display = match ? "" : "none";
            if (match) noResultFound = false;
        });
    });

    // Search users
    userList.forEach(user => {
        const userName = user.querySelector(".user-name").textContent.toLowerCase();
        const match = userName.includes(searchValue);
        user.style.visibility = match ? "visible" : "hidden";
        user.style.display = match ? "" : "none";
        if (match) noResultFound = false;
    });

    // Show no results message
    document.getElementById("no-search-result").style.display = noResultFound ? "block" : "none";
    document.getElementById("delete-search").classList.toggle("d-none", !searchValue); 
}



/**
 * Clears the search field, hides the delete icon and "no results" message, and displays all tasks.
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
