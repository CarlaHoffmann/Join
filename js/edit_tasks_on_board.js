/**
 * Opens the contact dropdown and populates it with a list of contacts.
 * 
 * - Loads the contacts and prepares them based on the logged-in user.
 * - Generates the HTML for the contacts list and updates the dropdown.
 * - Updates the selected contacts in the overlay.
 * 
 * @async
 * @function openAssigned
 * @returns {Promise<void>} Resolves when the contacts are loaded and the dropdown is populated.
 */
async function openBoardAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');

    const contacts = await loadContacts();
    const loggedInUser = await getUser();

    const preparedContacts = await prepareContacts(contacts, loggedInUser);
    const contactsHTML = createEditContactsHTML(preparedContacts, selectedContacts, loggedInUser);

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.classList.remove('d-none');
    document.addEventListener('click', closeAssignedOnOutsideClick);
    updateEditContacts();
}

/**
 * Generates the HTML for a list of contacts to be displayed in the contact selection dropdown.
 * 
 * - Loops through the provided contacts and creates a label with a checkbox for each.
 * - Marks a contact as selected if it exists in `taskContacts`.
 * - Appends "(You)" next to the logged-in user's name if they are part of the contacts.
 * 
 * @function createEditContactsHTML
 * @param {Array<Object>} contacts - The list of contacts to display, where each contact has `name`, `id`, etc.
 * @param {Array<string>} taskContacts - The list of contacts already assigned to the task.
 * @param {Object} loggedInUser - The logged-in user object containing the user's details.
 * @returns {string} The generated HTML string for the contacts list.
 */
function createEditContactsHTML(contacts, taskContacts, loggedInUser) {
    let contactsHTML = '';

    contacts.forEach((contact) => {
        const isSelected = taskContacts.includes(contact.id);
        const isCurrentUser = loggedInUser.name !== 'Guest' && contact.name === loggedInUser.name;
        contactsHTML += `
            <label onclick="handleContactClick(event)" class="selection-name contact-label">
                <div>${contact.name}${isCurrentUser ? ' (You)' : ''}</div>
                <input type="checkbox" id="${contact.id}" value="${contact.name}" ${isSelected ? 'checked' : ''}>
            </label>
        `;
    });

    return contactsHTML;
}


/**
 * Updates the displayed initials of selected contacts in the UI.
 * 
 * - Clears the previous contact initials.
 * - Loops through the `selectedContacts` array and generates initials and background colors for each contact.
 * - Updates the UI with the newly generated initials for each contact.
 * 
 * @async
 * @function updateEditContacts
 * @returns {Promise<void>} Resolves when the contact initials are successfully updated in the UI.
 */
async function updateEditContacts() {
    let contactInitials = document.getElementById('selected-contacts');
    contactInitials.innerHTML = ''; 

    let contactInis = '';

    for (let i = 0; i < selectedContacts.length; i++) {
        const contactId = selectedContacts[i];

        let contactName = await getContactName(contactId);
        let initials = contactName.split(' ').map(word => word[0]).join('');
        
        let color = await getContactColor(contactId);
        
        contactInis += `<div class="contact-initial" style="background-color: ${color};">${initials}</div>`;
    }
    contactInitials.innerHTML = contactInis;
}


/**
 * Initializes the edit priority by resetting all priority buttons and activating the selected priority button.
 * 
 * - Resets all priority buttons to their default state.
 * - Activates the button corresponding to the given priority.
 * 
 * @function initializeEditPriority
 * @param {string} prio - The priority level to be set (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {void}
 */
function initializeEditPriority(prio) {
    resetAllPriorityButtons();
    
    const priority = prio;
    const prioButton = document.getElementById(`prio${priority}`);
    if (prioButton) {
        activateEditButton(prioButton, priority);
    }
}


/**
 * Activates the edit priority button by updating its styles and content.
 * 
 * - Removes the hover effect class and adds the active class.
 * - Adds a class corresponding to the priority level.
 * - Updates the button's content to reflect the selected priority.
 * 
 * @function activateEditButton
 * @param {Element} button - The priority button to be activated.
 * @param {string} priority - The priority level to be applied (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {void}
 */
function activateEditButton(button, priority) {
    button.classList.remove('hover-button');
    button.classList.add('active-button');
    button.classList.add(getPriorityClassEdit(priority));
    updateButtonContent(button);
}

/**
 * Returns the corresponding CSS class for a given priority level.
 * 
 * - Returns 'urgent' for priority 1, 'med' for priority 2, and 'low' for priority 3.
 * 
 * @function getPriorityClassEdit
 * @param {string} priority - The priority level (e.g., "1" for urgent, "2" for medium, "3" for low).
 * @returns {string} The CSS class corresponding to the priority level.
 */
function getPriorityClassEdit(priority) {
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'med';
        case '3': return 'low';
    }
}


/**
 * Opens the edit subtask template by displaying the relevant buttons and icons for the task.
 * 
 * - Displays close and check icons for managing subtasks in the task overlay.
 * - Adds an event listener to close the subtask overlay when clicking outside of it.
 * 
 * @function openEditSubtaskTemplate
 * @param {Object} task - The task object that contains the subtasks to be edited.
 * @returns {void}
 */
function openEditSubtaskTemplate(task) {
    let subtaskButtons = document.getElementById('subtask-buttons');
    subtaskButtons.innerHTML = `
        <div id="opened-subtask-icons">
            <div class="opened-subtask-icon-box icon-hover" onclick="closeSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./assets/img/task/subtask_close.svg" alt="">
            </div>
            <div><img src="./assets/img/task/vector-3.svg" alt="seperator"></div>
            <div class="opened-subtask-icon-box icon-hover"  onclick="addEditedSubtask(${JSON.stringify(task).replace(/"/g, '&quot;')})">
                <img class="opened-subtask-img symbol-hover" src="./assets/img/task/subtask_check.svg" alt="">
            </div>
        </div>
    `;
    document.addEventListener('click', closeSubtaskOnOutsideClick);
}


/**
 * Adds a new subtask to the task and updates the displayed list of subtasks.
 * 
 * - Retrieves the new subtask input and adds it to the list of existing subtasks.
 * - Checks if the subtask already exists before adding it.
 * - Updates the displayed list of subtasks in the UI.
 * 
 * @function addEditedSubtask
 * @param {Object} task - The task object containing the current subtasks to be updated.
 * @returns {void}
 */
let existingSubtasks = [];

function addEditedSubtask(task) {
    let subtaskInput = document.getElementById('subtaskInput');
    let addedSubtask = document.getElementById('subtasks');

    let newSubtask = subtaskInput.value.trim();

    if (existingSubtasks.length === 0) {
        existingSubtasks = getExistingSubtasks(task.subtasks);
    }

    currentSubtasks = [];
    currentSubtasks = existingSubtasks;

    if (newSubtask) {

            currentSubtasks.push({
                task: newSubtask,
                checked: false
            });
        } else {
    }

    addedSubtask.innerHTML = '';
    for (let i = 0; i < currentSubtasks.length; i++) {
        const element = currentSubtasks[i];
        addedSubtask.innerHTML += getAddEditedSubtaskTemplate(i, element.task, element.checked);
    }
    closeSubtask();
}


/**
 * Generates the HTML template for a subtask with options to edit or delete it.
 * 
 * - Creates a div for the subtask with its description.
 * - Adds icons for editing and deleting the subtask.
 * 
 * @function getAddEditedSubtaskTemplate
 * @param {number} i - The index of the subtask in the list.
 * @param {string} element - The description of the subtask.
 * @param {boolean} checked - The checked status of the subtask.
 * @returns {string} The HTML template for the subtask.
 */
function getAddEditedSubtaskTemplate(i, element, checked) {
    return `
        <div id="subtask${i}">
            <div onclick="editEditedSubtask(${i}, '${element}', ${checked})" class="subtask-box" value="${checked}">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editEditedSubtask(${i}, '${element}', ${checked})" class="icon-hover" src="./assets/img/task/subtask_add_pen.svg" alt=""></div>
                    <div><img src="./assets/img/task/vector-3.svg" alt=""></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./assets/img/task/subtask_add_bin.svg" alt=""></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filters and returns the existing subtasks by removing duplicates based on task name.
 * 
 * - Checks whether a subtask already exists by comparing task names (case-insensitive).
 * - Returns a new array of subtasks with unique names.
 * 
 * @function getExistingSubtasks
 * @param {Array<Object>} currentSubtasks - The list of current subtasks to be filtered.
 * @returns {Array<Object>} A new array containing the unique subtasks.
 */
function getExistingSubtasks(currentSubtasks) {
    const newSubtask = [];
    if (currentSubtasks) {
        currentSubtasks.forEach(element => {
            const taskExists = newSubtask.some(subtask => subtask.task.toLowerCase() === element.task.toLowerCase());
            if (!taskExists) {
                newSubtask.push({
                    task: element.task,
                    checked: element.checked || false
                });
            }
        });
    }
    return newSubtask;
}

/**
 * Edits an existing subtask by updating its content and focusing the input field.
 * 
 * - Replaces the subtask element's content with the edit template.
 * - Focuses the input field and positions the cursor at the end of the text.
 * 
 * @function editEditedSubtask
 * @param {number} index - The index of the subtask to be edited.
 * @param {string} text - The new text for the subtask.
 * @param {boolean} checked - The checked status of the subtask.
 * @returns {void}
 */
function editEditedSubtask(index, text, checked) {
    let subtaskElement = document.getElementById(`subtask${index}`);
    if(subtaskElement) {
        subtaskElement.innerHTML = editSubtaskTemplate(index, text, checked);
        
        let input = subtaskElement.querySelector('.edit-subtask-input');
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    }
}