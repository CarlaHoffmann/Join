const task_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

let selectedContacts = [];

// Assigned to
async function openAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');

    const contacts = await loadContacts();
    const loggedInUser = await getUser();

    const preparedContacts = await prepareContacts(contacts, loggedInUser);
    const contactsHTML = createContactsHTML(preparedContacts, selectedContacts, loggedInUser);

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.style.display = 'block';
}

// Funktion zum Laden der Kontakte aus Firebase
async function loadContacts() {
    try {
        const response = await fetch(`${task_base_url}/users.json`);
        const users = await response.json();

        // Erstelle ein Array von Kontakten
        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name }));

        return contactsArray;
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
        return [];
    }
}

async function prepareContacts(contacts, loggedInUser) {
    if (!loggedInUser) return contacts;

    const loggedInContactIndex = contacts.findIndex(contact => contact.name === loggedInUser.name);
    if (loggedInContactIndex !== -1) {
        const [loggedInContact] = contacts.splice(loggedInContactIndex, 1); // Entferne den User aus dem Array
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        return [loggedInContact, ...contacts]; // Füge ihn an erster Stelle wieder hinzu
    }

    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function createContactsHTML(contacts, selectedContacts, loggedInUser) {
    let contactsHTML = '';

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

    return contactsHTML;
}

// Funktion zum Abrufen des aktuell eingeloggten Benutzers
async function getUser() {
    try {
        const response = await fetch(`${task_base_url}/loggedIn.json`); // Beispiel-Pfad für den eingeloggten User
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
        const response = await fetch(`${task_base_url}/users.json`);
        const users = await response.json();
        
        for (let userId in users) {
            if (users[userId].name === contactName) {
                const colorResponse = await fetch(`${task_base_url}/users/${userId}/color.json`);
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