/**
 * Generates an HTML template for a task card.
 *
 * @param {Object} task - The task object containing task details.
 * @param {string} task.id - Unique identifier for the task.
 * @param {string} task.category - Category of the task.
 * @param {string} task.title - Title of the task.
 * @param {string} task.description - Description of the task.
 * @param {Array} task.subtasks - Array of subtask objects.
 * @param {Array} task.contacts - Array of contact IDs associated with the task.
 * @param {string} task.prio - Priority of the task.
 * @param {Array} contactNames - Array of contact names corresponding to task.contacts.
 * @param {Array} contactColors - Array of colors for contact avatars.
 * 
 * @returns {string} HTML string representing the task card.
 * 
 * @description
 * This function creates an HTML template for a task card, including:
 * - Task category, title, and description
 * - Subtask progress bar (if subtasks exist)
 * - Contact avatars (up to 3 visible, with a count for additional contacts)
 * - Task priority icon
 * - Dropdown menu for moving the task between different states
 * 
 * The function also sets up event handlers for drag-and-drop functionality
 * and for opening a detailed task overlay.
 * 
 * @requires getCategoryColor - Function to get the color for a task category.
 * @requires getContactInitials - Function to get initials from a contact name.
 * @requires getPrio - Function to get the priority text from a priority value.
 */
function taskTemplate(task, contactNames, contactColors) {
    const completedSubtasks = task.subtasks.filter(subtask => subtask.checked).length;
    const totalSubtasks = task.subtasks.length;
    const progressPercentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const maxVisibleContacts = 3;
    const visibleContacts = task.contacts.slice(0, maxVisibleContacts);
    const hiddenContactsCount = Math.max(0, task.contacts.length - maxVisibleContacts);

    const contactsHTML = visibleContacts.map((contact, index) => `
        <div class="member" style="background-color: ${contactColors[index]}">
            ${getContactInitials(contactNames[index])}
        </div>`).join('');

    const hiddenContactsHTML = hiddenContactsCount ? `
        <div class="member-users">
            +${hiddenContactsCount}
        </div>` : '';

    const progressBarHTML = totalSubtasks ? `
        <div class="progress-section">
            <div class="progress">
                <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
            </div>
            <p class="subtasks">${completedSubtasks} von ${totalSubtasks} Subtasks</p>
        </div>` : '';

    return `
        <div id="task-${task.id}" class="task-card" draggable="true"
            onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
            ondragstart="drag(event)" ondragend="dragEnd(event)">
            <div class="task-header">
                <div class="task-type" style="background-color: ${getCategoryColor(task.category)}">
                    ${task.category}
                </div>
                <div class="task-menu" onclick="event.stopPropagation();">
                    <div class="menu-circle" onclick="toggleDropdown('dropdown-${task.id}')">
                        <img src="./assets/img/board/more_vert@2x.svg" alt="More options">
                        <div id="dropdown-${task.id}" class="dropdown-menu hidden">
                            <button onclick="moveTask('${task.id}', 'toDo')">To Do</button>
                            <button onclick="moveTask('${task.id}', 'progress')">Progress</button>
                            <button onclick="moveTask('${task.id}', 'feedback')">Feedback</button>
                            <button onclick="moveTask('${task.id}', 'done')">Done</button>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
            ${progressBarHTML}
            <div class="members-section">
                <div class="members">
                    ${contactsHTML}
                    ${hiddenContactsHTML}
                </div>
                <div class="priority">
                    <img src="./assets/img/add_task/prio_${getPrio(task.prio)}.svg" alt="${getPrio(task.prio)} icon">
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates an HTML template for the task overlay, including task details, 
 * subtasks, contacts, and action buttons (edit and delete).
 * 
 * @function openTaskOverlayTemplate
 * @param {Object} task - The task object containing details to display.
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.date - The due date of the task.
 * @param {string} task.prio - The priority level of the task.
 * @param {string} contactsHTML - The HTML for displaying assigned contacts.
 * @param {string} subtasksHTML - The HTML for displaying subtasks.
 * @returns {string} The generated HTML string for the task overlay.
 */
function openTaskOverlayTemplate(task, contactsHTML, subtasksHTML) {
    return `
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
                        <span class="info-label">Priority:&nbsp;&nbsp;</span>
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
                    <div class="icon-text-button" onclick="openEditTaskOverlay(event, ${JSON.stringify(task).replace(/"/g, '&quot;')})">
                        <svg class="icon-svg" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
                        </svg>
                        <span class="icon-text">Edit</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Generates an HTML template for the edit task overlay, including input fields 
 * for editing task details such as title, description, due date, priority, category, 
 * assigned contacts, and subtasks.
 * 
 * @function openEditTaskOverlayTemplate
 * @param {Object} task - The task object containing details to prefill in the form.
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.date - The due date of the task in "dd/mm/yyyy" format.
 * @param {string} task.category - The category of the task (e.g., "Technical Task").
 * @param {string} task.prio - The priority level of the task (e.g., "1" for high, "3" for low).
 * @param {string} subtasksHTML - The pre-rendered HTML for displaying subtasks.
 * @returns {string} The generated HTML string for the edit task overlay.
 */
function openEditTaskOverlayTemplate(task, subtasksHTML) {
    return `
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
                                <div>Title<span class="red-asterisk">*</span></div>
                                <div id="titel-wrapper">
                                    <input 
                                        type="text" 
                                        id="title" 
                                        class="form-field margin-bottom title-edit pad-12-16" 
                                        placeholder="Enter a title" 
                                        minlength="3" 
                                        required 
                                        value="${task.title}">
                                    <div id="title-error" class="error-message d-none">This field is required.</div>
                                    <div id="title-minlength-error" class="error-message d-none">Please enter at least 3 characters.</div>
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
                                    <div onclick="openBoardAssigned()" id="select-field" class="selection-field form-field pad-12-16">
                                        <p>Select contacts to assign</p><img class="symbol-hover icon-hover" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                    </div>
                                    <div onclick="closeAssigned()" id="contact-drop-down" class="select-items d-none">
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
                    Ok <img src="./assets/img/add_task/check 2.svg" alt="OK Icon" class="button-icon">
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
}