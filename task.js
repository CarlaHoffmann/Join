let selectedContacts = [];

// Assigned to
function openAssigned() {
    let contactSelection = document.getElementById('contact-selection');
    contactSelection.innerHTML = `
        <div id="contact-drop-down" class="select-items">
            <div onclick="closeAssigned()" id="contact-dropped-down" class="selection-field form-field pad-12-16 blue-border">
                <p>Select contacts to assign</p><img class="symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
            </div>
            <div class="selection-name" onclick="toggleCheckbox('contact1', event)">
                <label for="contact1">Sofia Müller (You)</label>
                <input type="checkbox" id="contact1" value="Sofia Müller">
            </div>
            <div class="selection-name" onclick="toggleCheckbox('contact2', event)">
                <label for="contact2">Anton Mayer</label>
                <input type="checkbox" id="contact2" value="Anton Mayer">
            </div>
            <div class="selection-name" onclick="toggleCheckbox('contact3', event)">
                <label for="contact3">Anja Schulz</label>
                <input type="checkbox" id="contact3" value="Anja Schulz">
            </div>
            <div class="selection-name" onclick="toggleCheckbox('contact4', event)">
                <label for="contact4">Benedikt Ziegler</label>
                <input type="checkbox" id="contact4" value="Benedikt Ziegler">
            </div>
            <div class="selection-name" onclick="toggleCheckbox('contact5', event)">
                <label for="contact5">David Eisenberg</label>
                <input type="checkbox" id="contact5" value="David Eisenberg">
            </div>
        </div>
    `;

    selectedContacts.forEach(name => {
        let checkbox = Array.from(document.querySelectorAll('input[type="checkbox"]'))
            .find(cb => cb.value === name);
        if (checkbox) checkbox.checked = true;
    });

    updateSelectedContacts();
}

function toggleCheckbox(id, event) {
    let checkbox = document.getElementById(id);
    checkbox.checked = !checkbox.checked;

    let contactName = checkbox.value;
    if (checkbox.checked) {
        if (!selectedContacts.includes(contactName)) {
            selectedContacts.push(contactName);
        }
    } else {
        selectedContacts = selectedContacts.filter(name => name !== contactName);
    }
    
    updateSelectedContacts();
    event.stopPropagation();
}

function updateSelectedContacts() {
    let contactInitials = document.getElementById('selected-contacts');
    contactInitials.innerHTML = '';
    
    selectedContacts.forEach(name => {
        let initials = name.split(' ').map(word => word[0]).join('');
        contactInitials.innerHTML += `<div class="contact-initial" value="${selectedContacts}">${initials}</div>`;
    });
}

function closeAssigned() {
    let contactSelection = document.getElementById('contact-selection');
    contactSelection.innerHTML = `
        <div onclick="openAssigned()" id="select-field" class="selection-field form-field pad-12-16">
            <p>Select contacts to assign</p><img class="symbol-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
        </div>
    `;
}


//Date
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize date picker and warning dialog elements
//     const datepicker = document.getElementById('datepicker');
//     const warningDialog = document.getElementById('warning-dialog');
//     const dialogMessage = document.getElementById('dialog-message');
//     // const dialogClose = document.getElementById('dialog-close');

//     // Set current year and maximum allowed year
//     const currentYear = new Date().getFullYear();
//     const maxYear = currentYear + 5;

//     // Add event listeners
//     datepicker.addEventListener('input', handleDateInput);
//     datepicker.addEventListener('blur', validateFullDate);
//     // dialogClose.onclick = closeWarningDialog;
//     window.onclick = handleWindowClick;

//     // Handle date input and formatting
//     function handleDateInput(e) {
//         let value = this.value.replace(/\D/g, '');
//         let parts = [
//             value.slice(0, 2),
//             value.slice(2, 4),
//             value.slice(4, 8)
//         ];

//         validateAndFormatParts(parts);
//         this.value = formatDate(parts);
//     }

//     // Validate and format individual date parts
//     function validateAndFormatParts(parts) {
//         validateDay(parts);
//         validateMonth(parts);
//         validateYear(parts);
//     }

//     // Validate day (01-31)
//     function validateDay(parts) {
//         if (parts[0].length === 2) {
//             let day = parseInt(parts[0]);
//             if (day < 1) parts[0] = '01';
//             if (day > 31) parts[0] = '31';
//         }
//     }

//     // Validate month (01-12)
//     function validateMonth(parts) {
//         if (parts[1].length === 2) {
//             let month = parseInt(parts[1]);
//             if (month < 1) parts[1] = '01';
//             if (month > 12) parts[1] = '12';
//         }
//     }

//     // Validate year (currentYear-maxYear)
//     function validateYear(parts) {
//         if (parts[2].length === 4) {
//             let year = parseInt(parts[2]);
//             if (year < currentYear) parts[2] = currentYear.toString();
//             if (year > maxYear) parts[2] = maxYear.toString();
//         }
//     }

//     // Format date parts into a string
//     function formatDate(parts) {
//         return parts.join('/').replace(/\/+$/, '');
//     }

//     // Validate the full date on blur
//     function validateFullDate() {
//         const parts = this.value.split('/');
//         if (parts.length === 3 && parts[2].length === 4) {
//             const day = parseInt(parts[0], 10);
//             const month = parseInt(parts[1], 10) - 1;
//             const year = parseInt(parts[2], 10);
//             const date = new Date(year, month, day);

//             if (!isValidDate(date, day, month, year)) {
//                 showWarning('Please enter a valid date.');
//             }
//         } else if (this.value !== '') {
//             showWarning('Please enter the date in dd/mm/yyyy format.');
//         }
//     }

//     // Check if the date is valid
//     function isValidDate(date, day, month, year) {
//         return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
//     }

//     // Display warning message
//     function showWarning(message) {
//         dialogMessage.textContent = message;
//         warningDialog.style.display = 'block';
//     }

//     // Close warning dialog
//     function closeWarningDialog() {
//         warningDialog.style.display = 'none';
//     }

//     // Handle clicks outside the dialog to close it
//     function handleWindowClick(event) {
//         if (event.target == warningDialog) {
//             closeWarningDialog();
//         }
//     }
// });

document.addEventListener('DOMContentLoaded', initializeDatePicker);

function initializeDatePicker() {
    const datepicker = document.getElementById('datepicker');
    const warningDialog = document.getElementById('warning-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 5;

    setupEventListeners(datepicker, warningDialog);
    
    return { datepicker, warningDialog, dialogMessage, currentYear, maxYear };
}

function setupEventListeners(datepicker, warningDialog) {
    datepicker.addEventListener('input', handleDateInput);
    datepicker.addEventListener('blur', validateFullDate);
    window.onclick = (event) => handleWindowClick(event, warningDialog);
}

function handleDateInput(e) {
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
    const { currentYear, maxYear } = initializeDatePicker();
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
        if (!isValidDate(date, day, month - 1, year)) {
            showWarning('Please enter a valid date.');
        }
    } else if (this.value !== '') {
        showWarning('Please enter the date in dd/mm/yyyy format.');
    }
}

function isValidDate(date, day, month, year) {
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
}

function showWarning(message) {
    const { dialogMessage, warningDialog } = initializeDatePicker();
    dialogMessage.textContent = message;
    warningDialog.style.display = 'block';
}

function closeWarningDialog(warningDialog) {
    warningDialog.style.display = 'none';
}

function handleWindowClick(event, warningDialog) {
    if (event.target == warningDialog) {
        closeWarningDialog(warningDialog);
    }
}



// Prio
function priority(x) {
    const currentPrio = document.getElementById(`prio${x}`);
    const allPrios = document.querySelectorAll('.prio-button');

    resetOtherButtons(allPrios, currentPrio);
    toggleCurrentButton(currentPrio, x);
}

function initializePriority() {
    priority(2);
    // const mediumButton = document.getElementById('prio-2');
    // activateButton(mediumButton, 2);
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
        default: return '';
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

// Category
function showCategory() {
    const dropdown = document.getElementById('opened-category');
    const icon = document.querySelector('#dropdown-icon2');

    dropdown.classList.toggle('d-none'); // Dropdown anzeigen oder verbergen
    icon.classList.toggle('dropdown-icon-mirrored'); 
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
    let subtaskButtons = document.getElementById('subtask-buttons');
    let subtaskInput = document.getElementById('subtaskInput');

    // Setze die Ansicht auf den ursprünglichen Zustand zurück
    subtaskButtons.innerHTML = `
        <img class="subtask-img symbol-hover icon-hover" src="./img/task/subtask.svg" alt="add subtask">
    `;
    subtaskInput.value = '';
    document.removeEventListener('click', closeSubtaskOnOutsideClick);
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
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars
            if (validateForm()) {
                showTaskAddedOverlay();
                // createTask();
                console.log('Form is valid. Submitting...');
            }
        });
    } else {
        console.error('Submit button not found');
    }
});

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

    if (dueDate === '') {
        dueDateError.classList.remove('d-none');
        return false;
    }
    return true;
}

function validateCategory() {
    const categorySelection = document.getElementById('category-selection');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.classList.add('d-none');

    if (categorySelection.value === '' || categorySelection.value === 'Select task category') {
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

// Funktion zum Hinzufügen von Event-Listenern für die Echtzeit-Validierung
function setupFormValidation() {
    document.getElementById('title').addEventListener('input', validateTitle);
    document.getElementById('datepicker').addEventListener('change', validateDueDate);
    document.getElementById('category-selection').addEventListener('change', validateCategory);
}

// Diese Funktion beim Laden der Seite aufrufen
document.addEventListener('DOMContentLoaded', setupFormValidation);


document.addEventListener('DOMContentLoaded', initializePriority);