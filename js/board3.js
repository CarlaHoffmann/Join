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

    overlayContainer.innerHTML = `
    <div onclick="closeOverlayOnOutsideClick(event, 'editTaskOverlay', 'editTaskOverlayBackground')" id="editTaskOverlayBackground" class="overlay-container">
        <div id="editTaskOverlay" class="taskOverlay">
            <!-- Schließen-Button -->
            <div class="close" onclick="closeTaskOverlay()">
                <img src="./assets/img/add_task/close.svg" alt="Close" />
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
                                        class="form-field margin-bottom title-edit pad-12-16" 
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
                                        <p>Select contacts to assign</p><img class="symbol-hover icon-hover" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                    </div>
                                    <div onclick="closeAssigned()" id="contact-drop-down" class="select-items" style="display: none;">
                                        <div id="contact-dropped-down" class="selection-field form-field pad-12-16 blue-border">
                                            <p>Select contacts to assign</p><img class="symbol-hover dropdown-icon-mirrored" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
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
                                        <img src="./assets/img/task/event.svg" alt="Calendar" class="calendar-icon">
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
                                            <img src="./assets/img/task/prio_high.svg" alt="high">
                                        </div>
                                    </button>
                                    <button onclick="priority(2, event)" class="prio-button hover-button" id="prio2">
                                        <p>Medium</p>
                                        <div class="double-line">
                                            <img src="./assets/img/task/prio_med.svg" alt="medium">
                                        </div>
                                    </button>
                                    <button onclick="priority(3, event)" class="prio-button hover-button" id="prio3">
                                        <p>Low</p>
                                        <div class="double-arrow-down">
                                            <img src="./assets/img/task/prio_low.svg" alt="low">
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
                                            <img class="dropdown-icon symbol-hover icon-hover" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                        </div>
                                    </div>
                                    <div id="error-message" class="error-message d-none">This field is required.</div>

                                    <div id="opened-category" class="d-none">
                                        <div onclick="showCategory()" class="select-field">
                                            <div class="form-field pad-12-16 blue-border">Select task category</div>
                                            <img id="dropdown-icon2" class="dropdown-icon symbol-hover dropdown-icon-mirrored" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
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
                                            <img class="subtask-img symbol-hover icon-hover" src="./assets/img/task/subtask.svg" alt="add subtask">
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <div class="subtasks-box"
                                <div id="subtasks">
                                    ${subtasksHTML}
                                </div>
                            </div>
                            <span class="font-16 hide-desktop"><span class="red-asterisk">*</span>This field is required</span>
                        </div>

                        <!-- Weitere Felder und Logik hierhin -->
                    </div>
                </div>            
                <div class="okBtnContainer">
                <button onclick="saveEditedTask(${JSON.stringify(task).replace(/"/g, '&quot;')})" class="submit-button">
                    OK <img src="./assets/img/add_task/check 2.svg" alt="OK Icon" class="button-icon">
                </button>
            </div>
            </div>



            <div id="task-added-overlay" class="dialog d-none">
                <div id="task-added-confirmation">
                    <div class="confirmation-text">Task added to board</div>
                    <img src="./assets/img/task/board_symbol.svg" alt="">
                </div>
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

