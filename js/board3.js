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
function closeTaskOverlayAnimation(overlayBox) {
    let overlay = document.getElementById(overlayBox);
    // let taskOverlayContainer = document.getElementById('taskOverlayContainer');
    if(overlay.classList.contains('show')) {
        overlay.classList.remove('show');
    }
    overlay.classList.add('hide');

    // taskOverlayContainer.classList.add('d-none');
    setTimeout(closeTaskOverlay, 400);
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
        <div onclick="closeOverlayOnOutsideClick(event, 'taskOverlay', 'openTaskOverlayBackground')" id="openTaskOverlayBackground" class="overlay-container">
            <div id="taskOverlay" class="taskOverlay">
                <div class="taskSelect">
                    <div class="taskContainer" style="background-color: ${getCategoryColor(task.category)}">${task.category}</div>
                    <div class="close" onclick="closeTaskOverlay()">
                        <img src="./assets/img/add_task/close.svg" alt="Close" />
                    </div>
                </div>

                <!-- Titel -->
                <div class="headline">${task.title}</div>

                <!-- Beschreibung -->
                <div class="description-overlay">${task.description}</div>

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
                    <div class="subtasks-box">${subtasksHTML}</div>
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
            </div>
        </div>
    `;

    // Event Listener für die Subtasks hinzufügen
    addSubtaskListeners(task);

    // Überprüfen Sie, ob das DOM aktualisiert wurde
    requestAnimationFrame(() => {
        if (document.getElementById('taskOverlay')) {
            startTaskOverlayAnimation();
        }
    });
}

