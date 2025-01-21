/**
 * Opens the task editing overlay and populates it with the provided task details.
 * 
 * @async
 * @function openEditTaskOverlay
 * @param {Event} event - The event that triggered the function.
 * @param {Object} task - The task object containing details to populate the overlay.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Array<string>} task.contacts - The contacts assigned to the task.
 * @param {Object} task.subtasks - Subtasks of the task, keyed by unique identifiers.
 * @param {string} task.date - The due date of the task.
 * @param {string} task.prio - The priority of the task (e.g., "1" for Urgent, "2" for Medium, "3" for Low).
 * @param {string} task.category - The category of the task (e.g., "Technical Task", "User Story").
 * @returns {void}
 */
let currentTask = null;

async function openEditTaskOverlay(event, task) {
    event.stopPropagation();
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

    overlayContainer.innerHTML = openEditTaskOverlayTemplate(task);

    overlayContainer.classList.remove('d-none');

    updateEditContacts();
    initializeDatePicker();
    initializeEditPriority(task.prio);
    categorySelected(task.category);
}


/**
 * Closes the edit task overlay and reopens the task overlay with the given task details.
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
        console.error("Fehler beim Aktualisieren des Subtask-Status:", error);
    }
}


/**
 * Starts the animation for the task overlay by making it visible and adding the "show" animation class.
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
 * Closes the task overlay with an animation and invokes the close function after the animation ends.
 * 
 * @function closeTaskOverlayAnimation
 * @param {string} overlayBox - The ID of the overlay element to animate and close.
 * @returns {void}
 */
function closeTaskOverlayAnimation(overlayBox) {
    let overlay = document.getElementById(overlayBox);
    if (overlay.classList.contains('show')) {
        overlay.classList.remove('show');
    }
    overlay.classList.add('hide');
    setTimeout(closeTaskOverlay, 400);
}


/**
 * Opens the task overlay and populates it with the task details, including contacts and subtasks.
 * 
 * @async
 * @function openTaskOverlay
 * @param {Object} task - The task object containing the details to display in the overlay.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Array<string>} task.contacts - An array of contacts assigned to the task.
 * @param {Object} task.subtasks - An object of subtasks, keyed by unique identifiers.
 * @param {string} task.date - The due date of the task.
 * @param {string} task.prio - The priority level of the task.
 * @param {string} task.category - The category of the task.
 * @param {string} task.path - The current path of the task in the database.
 * @param {string} task.id - The unique ID of the task.
 * @returns {Promise<void>}
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
    overlayContainer.innerHTML = openTaskOverlayTemplate(task, contactsHTML);

    addSubtaskListeners(task);

    requestAnimationFrame(() => {
        if (document.getElementById('taskOverlay')) {
            startTaskOverlayAnimation();
        }
    });
}

