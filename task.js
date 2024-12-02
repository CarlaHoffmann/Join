const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

let selectedContacts = [];

// Assigned to
// async function openAssigned() {
//     let contactDropDown = document.getElementById('contact-drop-down');
//     let contactsToSelect = document.getElementById('contacts-to-select');
//     const contacts = await loadContacts();
//     console.log(contacts);
//     let contactsHTML = '';

//     contacts.forEach((contact, index) => {
//         const isSelected = selectedContacts.includes(contact.name);
//         contactsHTML += `
//                 <label onclick="handleContactClick(event)" for="${contact.id}" class="selection-name contact-label">
//                     <div>${contact.name}${index === 0 ? ' (You)' : ''}</div>
//                     <input type="checkbox" id="${contact.id}" value="${contact.name}" ${isSelected ? 'checked' : ''}>
//                 </label>
//         `;
//     });
    
//     contactsToSelect.innerHTML = contactsHTML;
//     contactDropDown.style.display = 'block';
// }

async function openAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');
    const contacts = await loadContacts();
    console.log(contacts);
    let contactsHTML = '';

    const loggedInUser = await getUser(); // Hole den eingeloggten User

    contacts.forEach((contact) => {
        const isSelected = selectedContacts.includes(contact.name);
        const isCurrentUser = loggedInUser.name !== 'Guest' && contact.name === loggedInUser.name;
        contactsHTML += `
            <label onclick="handleContactClick(event)" for="${contact.id}" class="selection-name contact-label">
                <div>${contact.name}${isCurrentUser ? ' (You)' : ''}</div>
                <input type="checkbox" id="${contact.id}" value="${contact.name}" ${isSelected ? 'checked' : ''}>
            </label>
        `;
    });

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.style.display = 'block';
}

// Funktion zum Laden der Kontakte aus Firebase
async function loadContacts() {
    try {
        const loggedInUser = await getUser(); // Hole den eingeloggten User
        const response = await fetch(`${base_url}/users.json`);
        const users = await response.json();

        // Erstelle ein Array von Kontakten
        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name }));

        // Finde den eingeloggten User und entferne ihn aus dem Array
        const loggedInContactIndex = contactsArray.findIndex(contact => contact.name === loggedInUser.name);
        if (loggedInContactIndex !== -1) {
            const [loggedInContact] = contactsArray.splice(loggedInContactIndex, 1); // Entferne den User aus dem Array

            // Sortiere die restlichen Kontakte alphabetisch nach Namen
            contactsArray.sort((a, b) => a.name.localeCompare(b.name));

            return [loggedInContact, ...contactsArray]; // Füge ihn an erster Stelle wieder hinzu
        }

        // Wenn kein eingeloggter User gefunden wurde, gebe das ursprüngliche Array zurück und sortiere es
        return contactsArray.sort((a, b) => a.name.localeCompare(b.name));
        
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
        return [];
    }
}

// Funktion zum Abrufen des aktuell eingeloggten Benutzers
async function getUser() {
    try {
        const response = await fetch(`${base_url}/loggedIn.json`); // Beispiel-Pfad für den eingeloggten User
        const loggedInData = await response.json();

        return { name: loggedInData.name }; // Rückgabe des Namens des eingeloggten Users
    } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        return null;
    }
}

function handleContactClick(event) {
    event.stopPropagation(); // Verhindert die Ausbreitung des Events
    const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
    toggleContact({ target: checkbox }); // Aktualisiere den Kontaktstatus
}

function toggleContact(event) {
    const checkbox = event.target;
    const contactName = checkbox.value;
    
    if (checkbox.checked) {
        if (!selectedContacts.includes(contactName)) {
            selectedContacts.push(contactName);
        }
    } else {
        selectedContacts = selectedContacts.filter(name => name !== contactName);
    }
    
    // updateSelectedContacts();
    // console.log("selectedContacts aktualisiert:", selectedContacts);
}

async function updateSelectedContacts() {
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


async function getContactColor(contactName) {
    try {
        const response = await fetch(`${base_url}/users.json`);
        const users = await response.json();
        
        for (let userId in users) {
            if (users[userId].name === contactName) {
                const colorResponse = await fetch(`${base_url}/users/${userId}/color.json`);
                return await colorResponse.json();
            }
        }
        return '#000000'; // Standardfarbe, falls keine gefunden wird
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontaktfarbe:", error);
        return '#000000'; // Standardfarbe im Fehlerfall
    }
}

function closeAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');
    contactDropDown.style.display = 'none';
    contactsToSelect.innerHTML = '';
    updateSelectedContacts();
}

//Date
let datepicker, warningDialog, dialogMessage, currentYear, maxYear;

function initializeDatePicker() {
    datepicker = document.getElementById('datepicker');
    warningDialog = document.getElementById('warning-dialog');
    dialogMessage = document.getElementById('dialog-message');
    currentYear = new Date().getFullYear();
    maxYear = currentYear + 5;

    if (datepicker) {
        setupEventListeners(datepicker, warningDialog);
    } else {
        console.error("Das Element mit der ID 'datepicker' wurde nicht gefunden.");
    }
}

function setupEventListeners(datepicker, warningDialog) {
    datepicker.addEventListener('input', handleDateInput);
    datepicker.addEventListener('blur', validateFullDate);
    window.onclick = (event) => handleWindowClick(event, warningDialog);
}

function handleDateInput() {
    let value = this.value.replace(/\D/g, '');
    let parts = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 8)];
    validateAndFormatParts(parts);
    this.value = formatDate(parts);
}

function validateAndFormatParts(parts) {
    validateDay(parts);
    validateMonth(parts);
    validateYear(parts);
}

function validateDay(parts) {
    if (parts[0].length === 2) {
        let day = parseInt(parts[0]);
        if (day < 1) parts[0] = '01';
        if (day > 31) parts[0] = '31';
    }
}

function validateMonth(parts) {
    if (parts[1].length === 2) {
        let month = parseInt(parts[1]);
        if (month < 1) parts[1] = '01';
        if (month > 12) parts[1] = '12';
    }
}

function validateYear(parts) {
    if (parts[2].length === 4) {
        let year = parseInt(parts[2]);
        if (year < currentYear) parts[2] = currentYear.toString();
        if (year > maxYear) parts[2] = maxYear.toString();
    }
}

function formatDate(parts) {
    return parts.join('/').replace(/\/+$/, '');
}

function validateFullDate() {
    const parts = this.value.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
        const [day, month, year] = parts.map(part => parseInt(part, 10));
        const date = new Date(year, month - 1, day);
    }
}

function isValidDate(date, day, month, year) {
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
}

function handleWindowClick(event, warningDialog) {
    if (event.target == warningDialog) {
        closeWarningDialog(warningDialog);
    }
}

// Prio
function initializePriority() {
    resetAllPriorityButtons();
    setMediumPriority();
}

function priority(x, event) {
    if (event) {
        event.preventDefault(); // Verhindert das Standardverhalten des Buttons, wenn ein Event übergeben wird
    }
    const currentPrio = document.getElementById(`prio${x}`);
    const allPrios = document.querySelectorAll('.prio-button');
    resetOtherButtons(allPrios, currentPrio);
    toggleCurrentButton(currentPrio, x);
}

// Setzt alle anderen Buttons zurück
function resetOtherButtons(allButtons, currentButton) {
    allButtons.forEach(button => {
        if (button !== currentButton) {
            resetButton(button);
        }
    });
}

// Schaltet den aktuellen Button um (aktivieren/deaktivieren)
function toggleCurrentButton(button, priority) {
    if (button.classList.contains('active-button')) {
        resetButton(button);
    } else {
        activateButton(button, priority);
    }
}

// Setzt einen Button in den Grundzustand zurück
function resetButton(button) {
    button.classList.remove('active-button', 'urgent', 'med', 'low');
    button.classList.add('hover-button');
    updateButtonContent(button);
}

// Aktiviert einen Button
function activateButton(button, priority) {
    button.classList.remove('hover-button');
    button.classList.add('active-button');
    button.classList.add(getPriorityClass(priority));
    updateButtonContent(button);
}

// Bestimmt die CSS-Klasse basierend auf der Priorität
function getPriorityClass(priority) {
    switch(priority) {
        case 1: return 'urgent';
        case 2: return 'med';
        case 3: return 'low';
        // default: return 'med';
    }
}

// Aktualisiert den Inhalt eines Buttons
function updateButtonContent(button) {
    const priority = button.id.replace('prio', '');
    const isActive = button.classList.contains('active-button');
    button.innerHTML = getButtonContent(priority, isActive);
}

// Generiert den HTML-Inhalt für einen Button
function getButtonContent(priority, isActive) {
    const activeStatus = isActive ? '_active' : '';
    switch(priority) {
        case '1':
            return `
                <p>Urgent</p>
                <div class="double-arrow-up">
                    <img src="./img/task/prio_high${activeStatus}.svg" alt="">
                </div>
            `;
        case '2':
            return `
                <p>Medium</p>
                <div class="double-line">
                    <img src="./img/task/prio_med${activeStatus}.svg" alt="">
                </div>
            `;
        case '3':
            return `
                <p>Low</p>
                <div class="double-arrow-down">
                    <img src="./img/task/prio_low${activeStatus}.svg" alt="">
                </div>
            `;
        default:
            return '';
    }
}

function resetAllPriorityButtons() {
    const priorityButtons = document.querySelectorAll('.prio-button');
    priorityButtons.forEach(button => {
        resetButton(button);
    });
}

function setMediumPriority() {
    const mediumButton = document.getElementById('prio2');
    if (mediumButton) {
        activateButton(mediumButton, 2);
    } else {
        console.error('Medium priority button not found');
    }
}

// Category
function showCategory() {
    const dropdown = document.getElementById('opened-category');
    dropdown.classList.toggle('d-none'); // Dropdown anzeigen oder verbergen

    const categorySelection = document.getElementById('category-selection');
    categorySelection.textContent = "Select task category";
}

function categorySelected(category) {
    // Das Element mit der ID "category-selection" abrufen
    const categorySelection = document.getElementById('category-selection');
    const errorMessage = document.getElementById('error-message');

    // Den Text des ausgewählten Eintrags in das Feld übertragen
    categorySelection.textContent = category; 

    // Fehlermeldung ausblenden
    errorMessage.classList.add('d-none');

    // Das Dropdown-Menü wieder schließen, nachdem eine Auswahl getroffen wurde
    document.getElementById('opened-category').classList.add('d-none'); 
}

// Subtask
let subtasks = [];

function openSubtask() {
    let subtaskButtons = document.getElementById('subtask-buttons');
    subtaskButtons.innerHTML = `
        <div id="opened-subtask-icons">
            <div class="opened-subtask-icon-box icon-hover" onclick="closeSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./img/task/subtask_close.svg" alt="">
            </div>
            <div><img src="./img/task/vector-3.svg" alt="seperator"></div>
            <div class="opened-subtask-icon-box icon-hover"  onclick="addSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./img/task/subtask_check.svg" alt="">
            </div>
        </div>
    `;
    document.addEventListener('click', closeSubtaskOnOutsideClick);
}

function closeSubtask() {
    if (document.title === 'Add Task') {
        let subtaskButtons = document.getElementById('subtask-buttons');
        let subtaskInput = document.getElementById('subtaskInput');

        // Setze die Ansicht auf den ursprünglichen Zustand zurück
        subtaskButtons.innerHTML = `
            <img class="subtask-img symbol-hover icon-hover" src="./img/task/subtask.svg" alt="add subtask">
        `;
        subtaskInput.value = '';
        document.removeEventListener('click', closeSubtaskOnOutsideClick);
    }
}

function closeSubtaskOnOutsideClick(event) {
    let subtaskWrapper = document.getElementById('subtask-input-wrapper');
    if (!subtaskWrapper.contains(event.target)) {
        closeSubtask();
    }
}

function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    let addedSubtask = document.getElementById('subtasks');

    if (subtaskInput.value !== '') {
        subtasks.push(subtaskInput.value);
    }
    addedSubtask.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        addedSubtask.innerHTML += `
            <div id="subtask${i}">
                <div onclick="editSubtask(${i})" class="subtask-box">
                    <div>• ${element}</div>
                    <div class="added-subtask-icons">
                        <div><img onclick="editSubtask(${i})" class="icon-hover" src="./img/task/subtask_add_pen.svg" alt=""></div>
                        <div><img src="./img/task/vector-3.svg" alt=""></div>
                        <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt=""></div>
                    </div>
                </div>
            </div>
        `;
    }
    closeSubtask();
}

function editSubtask(index) {
    let subtaskElement = document.getElementById(`subtask${index}`);
    let currentText = subtasks[index];

    subtaskElement.innerHTML = `
        <div class="edit-subtask-wrapper">
            <input type="text" class="edit-subtask-input" value="${currentText}">
            <div class="edit-subtask-icons">
                <div><img onclick="deleteSubtask(${index})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt="Delete"></div>
                <div><img src="./img/task/vector-3.svg" alt="Separator"></div>
                <div><img onclick="replaceSubtask(${index})" class="icon-hover"  src="./img/task/subtask_check.svg" alt="Confirm"></div>
            </div>
        </div>
    `;

    // Fokussiere das Eingabefeld und setze den Cursor ans Ende
    let input = subtaskElement.querySelector('.edit-subtask-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}

function replaceSubtask(index) {
    let subtaskElement = document.getElementById(`subtask${index}`);
    let input = subtaskElement.querySelector('.edit-subtask-input');
    let newText = input.value.trim();

    if (newText !== '') {
        subtasks[index] = newText;
        updateSubtaskDisplay();
    } else {
        deleteSubtask(index);
    }
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskDisplay();
}

function updateSubtaskDisplay() {
    let addedSubtask = document.getElementById('subtasks');
    addedSubtask.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        addedSubtask.innerHTML += `
            <div id="subtask${i}">
                <div onclick="editSubtask(${i})" class="subtask-box">
                    <div>• ${element}</div>
                    <div class="added-subtask-icons">
                        <div><img onclick="editSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_pen.svg" alt="Edit"></div>
                        <div><img src="./img/task/vector-3.svg" alt="Separator"></div>
                        <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt="Delete"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

// validation
function initializeValidation() {
    const submitButton = document.querySelector('.submit-button');

    if (submitButton) {
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars

            if (validateForm()) {
                await createTask();
                console.log('Form is valid. Submitting...');
            }
        });
    } else {
        console.error('Submit button not found');
    }
};

function validateForm() {
    let isValid = true;

    isValid = validateTitle() && isValid;
    isValid = validateDueDate() && isValid;
    isValid = validateCategory() && isValid;

    return isValid;
}

function validateTitle() {
    const title = document.getElementById('title').value.trim();
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');
    
    titleError.classList.add('d-none');
    titleMinlengthError.classList.add('d-none');

    if (title === '') {
        titleError.classList.remove('d-none');
        return false;
    } else if (title.length < 3) {
        titleMinlengthError.classList.remove('d-none');
        return false;
    }
    return true;
}

function validateDueDate() {
    const dueDate = document.getElementById('datepicker').value.trim();
    const dueDateError = document.getElementById('due-date-error');
    
    dueDateError.classList.add('d-none');

    if (dueDate === '' || dueDate.length < 10) {
        dueDateError.classList.remove('d-none');
        return false;
    }
    return true;
}

function validateCategory() {
    const categorySelection = document.getElementById('category-selection');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.classList.add('d-none');

    if (categorySelection.innerHTML === '' || categorySelection.innerHTML === 'Select task category') {
        errorMessage.classList.remove('d-none');
        return false;
    }
    return true;
}

function showTaskAddedOverlay() {
    const overlay = document.getElementById('task-added-overlay');
    overlay.classList.remove('d-none');
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10); // Kleine Verzögerung für die Animation

    // Automatisches Ausblenden nach 3 Sekunden
    setTimeout(() => {
        hideTaskAddedOverlay();
    }, 3000);
}

function hideTaskAddedOverlay() {
    const overlay = document.getElementById('task-added-overlay');
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 300); // Warten auf das Ende der Ausblend-Animation
    goToBoard();
}

function goToBoard() {
    window.location.href = 'board.html';
}

function clearForm() {
    // Leeren der Textfelder
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('datepicker').value = '';

    // Leeren der Kontakte
    selectedContacts = [];
    updateSelectedContacts();

    // Zurücksetzen der Priorität
    resetAllPriorityButtons();
    setMediumPriority();

    // Zurücksetzen der Kategorie
    resetCategory();

    // Leeren der Subtasks
    subtasks = [];
    updateSubtaskDisplay();

    // Entfernen aller Fehlermeldungen
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.classList.add('d-none'));
}

function resetCategory() {
    const categorySelection = document.getElementById('category-selection');
    categorySelection.textContent = 'Select task category';
    document.getElementById('opened-category').classList.add('d-none');
}