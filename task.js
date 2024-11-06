let selectedContacts = [];

// Title


// Description


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
        console.log(initials);
        contactInitials.innerHTML += `<div class="contact-initial">${initials}</div>`;
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
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker and warning dialog elements
    const datepicker = document.getElementById('datepicker');
    const warningDialog = document.getElementById('warning-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogClose = document.getElementById('dialog-close');

    // Set current year and maximum allowed year
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 5;

    // Add event listeners
    datepicker.addEventListener('input', handleDateInput);
    datepicker.addEventListener('blur', validateFullDate);
    dialogClose.onclick = closeWarningDialog;
    window.onclick = handleWindowClick;

    // Handle date input and formatting
    function handleDateInput(e) {
        let value = this.value.replace(/\D/g, '');
        let parts = [
            value.slice(0, 2),
            value.slice(2, 4),
            value.slice(4, 8)
        ];

        validateAndFormatParts(parts);
        this.value = formatDate(parts);
    }

    // Validate and format individual date parts
    function validateAndFormatParts(parts) {
        validateDay(parts);
        validateMonth(parts);
        validateYear(parts);
    }

    // Validate day (01-31)
    function validateDay(parts) {
        if (parts[0].length === 2) {
            let day = parseInt(parts[0]);
            if (day < 1) parts[0] = '01';
            if (day > 31) parts[0] = '31';
        }
    }

    // Validate month (01-12)
    function validateMonth(parts) {
        if (parts[1].length === 2) {
            let month = parseInt(parts[1]);
            if (month < 1) parts[1] = '01';
            if (month > 12) parts[1] = '12';
        }
    }

    // Validate year (currentYear-maxYear)
    function validateYear(parts) {
        if (parts[2].length === 4) {
            let year = parseInt(parts[2]);
            if (year < currentYear) parts[2] = currentYear.toString();
            if (year > maxYear) parts[2] = maxYear.toString();
        }
    }

    // Format date parts into a string
    function formatDate(parts) {
        return parts.join('/').replace(/\/+$/, '');
    }

    // Validate the full date on blur
    function validateFullDate() {
        const parts = this.value.split('/');
        if (parts.length === 3 && parts[2].length === 4) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);

            if (!isValidDate(date, day, month, year)) {
                showWarning('Please enter a valid date.');
            }
        } else if (this.value !== '') {
            showWarning('Please enter the date in dd/mm/yyyy format.');
        }
    }

    // Check if the date is valid
    function isValidDate(date, day, month, year) {
        return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
    }

    // Display warning message
    function showWarning(message) {
        dialogMessage.textContent = message;
        warningDialog.style.display = 'block';
    }

    // Close warning dialog
    function closeWarningDialog() {
        warningDialog.style.display = 'none';
    }

    // Handle clicks outside the dialog to close it
    function handleWindowClick(event) {
        if (event.target == warningDialog) {
            closeWarningDialog();
        }
    }
});


// Prio
function priority(x) {
    const currentPrio = document.getElementById(`prio-${x}`);
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
        default: return '';
    }
}

// Aktualisiert den Inhalt eines Buttons
function updateButtonContent(button) {
    const priority = button.id.split('-')[1];
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
function openSubtask() {
    let subtaskButtons = document.getElementById('subtask-buttons');
    subtaskButtons.innerHTML = `
        <div id="opened-subtask-icons">
            <div class="opened-subtask-icon-box"><img class="opened-subtask-img symbol-hover" src="./img/task/subtask_close.svg" alt=""></div>
            <div><img src="./img/task/vector-3.svg" alt=""></div>
            <div class="opened-subtask-icon-box"><img class="opened-subtask-img symbol-hover" src="./img/task/subtask_check.svg" alt=""></div>
        </div>
    `;
}


// Event Listener zur Überprüfung
const titleInput = document.getElementById('title');
titleInput.addEventListener('input', validateTitle);
titleInput.addEventListener('blur', validateTitle);  // Hinzufügen von blur für die Validierung beim Verlassen

function validateTitle() {
    const title = this.value.trim();  // trim für Leerzeichen am Anfang/Ende
    const titleError = document.getElementById('title-error');
    
    // Wenn das Feld leer ist
    if (title === '') {
        titleError.classList.remove('d-none');  
    } else {
        titleError.classList.add('d-none');
    }
};

// Datepicker-Eingabe in Echtzeit validieren
const dateInput = document.getElementById('datepicker');
dateInput.addEventListener('input', validateDueDate);
dateInput.addEventListener('blur', validateDueDate);

function validateDueDate() {
    const dueDate = this.value.trim();
    const dueDateError = document.getElementById('due-date-error');
    
    if (dueDate === '') {
        dueDateError.classList.remove('d-none');  // Fehlermeldung anzeigen, wenn das Feld leer ist
    } else {
        dueDateError.classList.add('d-none');  // Fehlermeldung ausblenden, wenn ein Wert eingegeben wurde
    }
};

// Kategorieauswahl validieren
document.getElementById('category-selection').addEventListener('click', function() {
    const categorySelection = this.textContent;
    const errorMessage = document.getElementById('error-message');
    
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none');  // Fehlermeldung anzeigen, wenn keine Kategorie ausgewählt ist
    } else {
        errorMessage.classList.add('d-none');  // Fehlermeldung ausblenden, wenn eine Kategorie ausgewählt wurde
    }
});

// Formular-Validierung beim Absenden
function validateForm() {
    let isValid = true;

    // Title-Feld-Validierung (muss mindestens 3 Zeichen enthalten)
    const title = document.getElementById('title').value.trim();
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');
    
    if (title === '') {
        titleError.classList.remove('d-none');  // Fehlermeldung für leeres Feld
        isValid = false;
    } else {
        titleError.classList.add('d-none');  // Fehler verstecken
    }

    // Due-Date-Feld-Validierung (muss ein Datum enthalten)
    const dueDate = document.getElementById('datepicker').value.trim();
    const dueDateError = document.getElementById('due-date-error');
    
    if (dueDate === '') {
        dueDateError.classList.remove('d-none');  // Fehlermeldung anzeigen, wenn das Feld leer ist
        isValid = false;
    } else {
        dueDateError.classList.add('d-none');  // Fehlermeldung verstecken, wenn ein Datum eingegeben wurde
    }

    // Kategorieauswahl-Validierung (muss eine Kategorie ausgewählt sein)
    const categorySelection = document.getElementById('category-selection').textContent;
    const errorMessage = document.getElementById('error-message');
    
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none');  // Fehlermeldung anzeigen, wenn keine Kategorie ausgewählt wurde
        isValid = false;
    } else {
        errorMessage.classList.add('d-none');  // Fehlermeldung verstecken, wenn eine Kategorie ausgewählt wurde
    }

    return isValid;  // Formular wird nur abgesendet, wenn alle Felder gültig sind
};