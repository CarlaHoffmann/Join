// Title


// Description


// Assigned to




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
    const icon = document.querySelector('#dropdown-icon1');

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



// Funktion zur Überprüfung der Auswahl vor dem Absenden des Formulars
function validateForm() {
    let isValid = true;

    // Validierung für das Title-Feld
    const title = document.getElementById('title').value;
    const titleError = document.getElementById('title-error');
    if (title.trim() === '') {
        titleError.classList.remove('d-none');
        isValid = false;
    } else {
        titleError.classList.add('d-none');
    }

    // Validierung für das Due Date-Feld
    const dueDate = document.getElementById('datepicker').value;
    const dueDateError = document.getElementById('due-date-error');
    if (dueDate.trim() === '') {
        dueDateError.classList.remove('d-none');
        isValid = false;
    } else {
        dueDateError.classList.add('d-none');
    }

    // Validierung für Category (dein bereits vorhandener Code)
    const categorySelection = document.getElementById('category-selection').textContent;
    const errorMessage = document.getElementById('error-message');
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none'); // Fehlermeldung anzeigen
        isValid = false;
    } else {
        errorMessage.classList.add('d-none'); // Fehlermeldung ausblenden
    }

    return isValid; // Formular nur absenden, wenn alle Felder korrekt sind
}


document.getElementById('title').addEventListener('input', function() {
    const title = this.value.trim();  // trim für Leerzeichen am Anfang/Ende
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');

    // Wenn das Feld leer ist
    if (title === '') {
        titleError.classList.remove('d-none');  
        // titleMinlengthError.classList.add('d-none'); 
    } 
    // Wenn die Eingabe weniger als 3 Zeichen hat
    else if (title.length < 3) {
        titleError.classList.add('d-none'); 
        titleMinlengthError.classList.remove('d-none');
    } 
    // Wenn die Eingabe korrekt ist
    else {
        titleError.classList.add('d-none'); 
        titleMinlengthError.classList.add('d-none');
    }
});

document.getElementById('datepicker').addEventListener('input', function() {
    const dueDate = this.value;
    const dueDateError = document.getElementById('due-date-error');
    
    if (dueDate.trim() === '') {
        dueDateError.classList.remove('d-none');
    } else {
        dueDateError.classList.add('d-none');
    }
});

document.getElementById('category-selection').addEventListener('click', function() {
    const categorySelection = this.textContent;
    const errorMessage = document.getElementById('error-message');
    
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none');
    } else {
        errorMessage.classList.add('d-none');
    }
});

function validateForm() {
    let isValid = true;

    // Validierung für das Title-Feld
    const title = document.getElementById('title').value;
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');
    
    if (title.trim() === '') {
        titleError.classList.remove('d-none');
        titleMinlengthError.classList.add('d-none');
        isValid = false;
    } else if (title.length < 3) {
        titleError.classList.add('d-none');
        titleMinlengthError.classList.remove('d-none');
        isValid = false;
    } else {
        titleError.classList.add('d-none');
        titleMinlengthError.classList.add('d-none');
    }

    // Validierung für das Due Date-Feld
    const dueDate = document.getElementById('datepicker').value;
    const dueDateError = document.getElementById('due-date-error');
    if (dueDate.trim() === '') {
        dueDateError.classList.remove('d-none');
        isValid = false;
    } else {
        dueDateError.classList.add('d-none');
    }

    // Validierung für Category
    const categorySelection = document.getElementById('category-selection').textContent;
    const errorMessage = document.getElementById('error-message');
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none');
        isValid = false;
    } else {
        errorMessage.classList.add('d-none');
    }

    return isValid;
}document.getElementById('title').addEventListener('input', function() {
    const title = this.value.trim();  // trim für Leerzeichen am Anfang/Ende
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');

    // Wenn das Feld leer ist
    if (title === '') {
        titleError.classList.remove('d-none');  
        // titleMinlengthError.classList.add('d-none'); 
    } 
    // Wenn die Eingabe weniger als 3 Zeichen hat
    else if (title.length < 3) {
        titleError.classList.add('d-none'); 
        titleMinlengthError.classList.remove('d-none');
    } 
    // Wenn die Eingabe korrekt ist
    else {
        titleError.classList.add('d-none'); 
        titleMinlengthError.classList.add('d-none');
    }
});

document.getElementById('datepicker').addEventListener('input', function() {
    const dueDate = this.value;
    const dueDateError = document.getElementById('due-date-error');
    
    if (dueDate.trim() === '') {
        dueDateError.classList.remove('d-none');
    } else {
        dueDateError.classList.add('d-none');
    }
});

document.getElementById('category-selection').addEventListener('click', function() {
    const categorySelection = this.textContent;
    const errorMessage = document.getElementById('error-message');
    
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none');
    } else {
        errorMessage.classList.add('d-none');
    }
});

function validateForm() {
    let isValid = true;

    // Validierung für das Title-Feld
    const title = document.getElementById('title').value;
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');
    
    if (title.trim() === '') {
        titleError.classList.remove('d-none');
        titleMinlengthError.classList.add('d-none');
        isValid = false;
    } else if (title.length < 3) {
        titleError.classList.add('d-none');
        titleMinlengthError.classList.remove('d-none');
        isValid = false;
    } else {
        titleError.classList.add('d-none');
        titleMinlengthError.classList.add('d-none');
    }

    // Validierung für das Due Date-Feld
    const dueDate = document.getElementById('datepicker').value;
    const dueDateError = document.getElementById('due-date-error');
    if (dueDate.trim() === '') {
        dueDateError.classList.remove('d-none');
        isValid = false;
    } else {
        dueDateError.classList.add('d-none');
    }

    // Validierung für Category
    const categorySelection = document.getElementById('category-selection').textContent;
    const errorMessage = document.getElementById('error-message');
    if (categorySelection === 'Select task category') {
        errorMessage.classList.remove('d-none');
        isValid = false;
    } else {
        errorMessage.classList.add('d-none');
    }

    return isValid;
}