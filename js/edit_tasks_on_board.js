// Initialisieren von selectedContacts mit task.contacts
// let taskContacts = task.contacts;

// Funktion zum Öffnen der Kontaktliste
async function openAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');

    const contacts = await loadContacts();
    const loggedInUser = await getUser();

    const preparedContacts = await prepareContacts(contacts, loggedInUser);
    const contactsHTML = createEditContactsHTML(preparedContacts, selectedContacts, loggedInUser);

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.style.display = 'block';

    // Aktualisieren der ausgewählten Kontakte im Overlay
    updateEditContacts();
}

// Funktion zum Erstellen der Kontaktliste
function createEditContactsHTML(contacts, taskContacts, loggedInUser) {
    let contactsHTML = '';

    contacts.forEach((contact) => {
        const isSelected = taskContacts.includes(contact.name);
        const isCurrentUser = loggedInUser.name !== 'Guest' && contact.name === loggedInUser.name;
        contactsHTML += `
            <label onclick="handleContactClick(event)" for="${contact.id}" class="selection-name contact-label">
                <div>${contact.name}${isCurrentUser ? ' (You)' : ''}</div>
                <input type="checkbox" id="${contact.id}" value="${contact.name}" ${isSelected ? 'checked' : ''}>
            </label>
        `;
    });

    return contactsHTML;
}

// Funktion zum Aktualisieren der ausgewählten Kontakte im Overlay
async function updateEditContacts() {
    let contactInitials = document.getElementById('selected-contacts');
    contactInitials.innerHTML = ''; // Leere den Inhalt vor dem Neuaufbau

    let contactInis = ''; // Variable zum Sammeln der HTML-Strings

    for (let i = 0; i < selectedContacts.length; i++) {
        const contactName = selectedContacts[i];
        let initials = contactName.split(' ').map(word => word[0]).join('');
        
        // Farbe für den Kontakt abrufen
        let color = await getContactColor(contactName);
        
        // Füge den HTML-String zur Sammlung hinzu
        contactInis += `<div class="contact-initial" style="background-color: ${color};">${initials}</div>`;
    }

    // Füge alle Kontakt-Initialen hinzu
    contactInitials.innerHTML = contactInis;
}

function initializeEditPriority(prio) {
    resetAllPriorityButtons();
    
    const priority = prio;
    console.log(priority);
    const prioButton = document.getElementById(`prio${priority}`);
    if (prioButton) {
        activateEditButton(prioButton, priority);
    } else {
        console.error('Priority button not found');
    }
}

function activateEditButton(button, priority) {
    button.classList.remove('hover-button');
    button.classList.add('active-button');
    button.classList.add(getPriorityClassEdit(priority));
    updateButtonContent(button);
}

function getPriorityClassEdit(priority) {
    console.log('prio');
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'med';
        case '3': return 'low';
        // default: return 'med';
    }
}


/**
 * Updates the subtask buttons to show the open state and adds an event listener for outside clicks.
 */
function openEditSubtaskTemplate(task) {
    let subtaskButtons = document.getElementById('subtask-buttons');
    subtaskButtons.innerHTML = `
        <div id="opened-subtask-icons">
            <div class="opened-subtask-icon-box icon-hover" onclick="closeSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./img/task/subtask_close.svg" alt="">
            </div>
            <div><img src="./img/task/vector-3.svg" alt="seperator"></div>
            <div class="opened-subtask-icon-box icon-hover"  onclick="addEditedSubtask(${JSON.stringify(task).replace(/"/g, '&quot;')})">
                <img class="opened-subtask-img symbol-hover" src="./img/task/subtask_check.svg" alt="">
            </div>
        </div>
    `;
    document.addEventListener('click', closeSubtaskOnOutsideClick);
}


let existingSubtasks = [];
let currentSubtasks = [];
/**
 * This function adds a new subtask to the list and updates the display.
 */
function addEditedSubtask(task) {
    let subtaskInput = document.getElementById('subtaskInput');
    let addedSubtask = document.getElementById('subtasks');

    let newSubtask = subtaskInput.value.trim();
    console.log(newSubtask);

    // Aktualisiere existingSubtasks nur, wenn es leer ist
    if (existingSubtasks.length === 0) {
        existingSubtasks = getExistingSubtasks(task.subtasks);
    }
    currentSubtasks = [];
    currentSubtasks = document.getElementById('subtasks');
    console.log(existingSubtasks);
    subtasks = [];
    subtasks.push(existingSubtasks);
    subtasks.push(currentSubtasks);

    console.log(subtasks);

    if (newSubtask) {
        // Prüfen, ob die neue Task bereits existiert
        const taskExists = subtasks.some(subtask => subtask.task.toLowerCase() === newSubtask.toLowerCase());
        if (!taskExists) {
            subtasks.push({
                task: newSubtask,
                checked: false
            });
        } else {
            console.log("Task already exists:", newSubtask);
        }
    }
    console.log(existingSubtasks);

    addedSubtask.innerHTML = '';
    for (let i = 0; i < existingSubtasks.length; i++) {
        const element = existingSubtasks[i];
        addedSubtask.innerHTML += getAddEditedSubtaskTemplate(i, element.task, element.checked);
    }
    closeSubtask();
}

function getAddEditedSubtaskTemplate(i, element, checked) {
    return `
        <div id="subtask${i}">
            <div onclick="editEditedSubtask(${i}, '${element}', ${checked})" class="subtask-box" value="${checked}">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editEditedSubtask(${i}, '${element}', ${checked})" class="icon-hover" src="./img/task/subtask_add_pen.svg" alt=""></div>
                    <div><img src="./img/task/vector-3.svg" alt=""></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt=""></div>
                </div>
            </div>
        </div>
    `;
}

function getExistingSubtasks(subtasks) {
    const newSubtask = [];
    if (subtasks) {
        subtasks.forEach(element => {
            // Prüfe, ob die Subtask bereits existiert
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

function editEditedSubtask(index, text, checked) {
    console.log(index, text, checked);
    /**
     * Get the subtask element and its current text.
     */
    let subtaskElement = document.getElementById(`subtask${index}`);
    // let currentText = subtasks[index];
    // let currentText = text;

    subtaskElement.innerHTML = editSubtaskTemplate(index, text, checked);

    /**
     * Focus the input field and set the cursor to the end.
     */
    let input = subtaskElement.querySelector('.edit-subtask-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}