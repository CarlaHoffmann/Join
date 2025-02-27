const task_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"
/** This URL is used to connect to the Firebase Realtime Database. */

let selectedContacts = [];

/**
 * Opens and populates the contacts dropdown.
 * 
 * @async
 * @description Loads contacts, prepares dropdown, and sets up event handling
 * @throws {Error} If contact or user loading fails
 * 
 * @example
 * await openAssigned();
 */
async function openAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');

    const contacts = await loadContacts();
    const loggedInUser = await getUser();

    const preparedContacts = await prepareContacts(contacts, loggedInUser);
    const contactsHTML = createContactsHTML(preparedContacts, selectedContacts, loggedInUser);

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.classList.remove('d-none');
    restoreActiveContacts();
    document.addEventListener('click', closeAssignedOnOutsideClick);
}

/** 
 * This asynchronous function fetches contacts from the Firebase Realtime Database.
 * Purpose: Retrieves a list of contacts from the Firebase Realtime Database.
 * Return: An array of contact objects with id and name properties.
 */
async function loadContacts() {
    try {
        const response = await fetch(`${task_base_url}/users.json`);
        const users = await response.json();

        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name }));

        return contactsArray;
    } catch (error) {
        return [];
    }
}

/**
 * Prepares the contact list by sorting contacts and prioritizing the logged-in user.
 * 
 * - If the user is a "Guest", contacts are simply sorted alphabetically.
 * - If the user is logged in, their contact is moved to the top of the list.
 * 
 * @async
 * @function prepareContacts
 * @param {Array} contacts - Array of contact objects with at least a `name` property.
 * @param {Object} loggedInUser - Object representing the logged-in user.
 * @returns {Promise<Array>} Sorted array of contacts with the logged-in user at the top (if applicable).
 */
async function prepareContacts(contacts, loggedInUser) {
    if (loggedInUser === 'Guest') {
        return contacts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        const loggedInContactIndex = contacts.findIndex(contact => contact.name === loggedInUser.name);
        const [loggedInContact] = contacts.splice(loggedInContactIndex, 1);
        return [loggedInContact, ...contacts]; 
    }
}

/**
 * Generates HTML for the contact list, including checkboxes for selection.
 * 
 * - Each contact is displayed inside a `<label>` with a checkbox.
 * - If the contact is selected, the checkbox is pre-checked.
 * - If the contact is the logged-in user, "(You)" is appended to their name.
 * 
 * @function createContactsHTML
 * @param {Array} contacts - Array of contact objects with at least `id` and `name` properties.
 * @param {Array} selectedContacts - Array of selected contact IDs.
 * @param {Object} loggedInUser - Object representing the logged-in user.
 * @returns {string} The generated HTML string for the contact list.
 */
function createContactsHTML(contacts, selectedContacts, loggedInUser) {
    let contactsHTML = '';

    contacts.forEach((contact) => {
        const isSelected = selectedContacts.includes(contact.id);
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
 * Restores the active state for previously selected contacts.
 * 
 * Iterates through the `selectedContacts` array and applies the 
 * "active" class to the corresponding contact labels.
 */
function restoreActiveContacts() {
    selectedContacts.forEach(contactId => {
        let contactLabel = document.getElementById(contactId)?.closest('.selection-name');
        if (contactLabel) {
            contactLabel.classList.add('active');
        }
    });
}

/** 
 * This asynchronous function retrieves the currently logged-in user from the Firebase Realtime Database.
 */
async function getUser() {
    try {
        const response = await fetch(`${task_base_url}/loggedIn.json`); 
        const loggedInData = await response.json();

        return { name: loggedInData.name };
    } catch (error) {
        return null;
    }
}

/** This function handles the click event on a contact label.
* Purpose: Toggles the selection status of a contact when its label is clicked.
*/
function handleContactClick(event) {
    event.stopPropagation();
    const label = event.currentTarget;
    const checkbox = label.querySelector('input[type="checkbox"]');

    toggleContact({ target: checkbox });

    if (checkbox.checked) {
        label.classList.add('active');
    } else {
        label.classList.remove('active');
    }
}

/** This function toggles the selection status of a contact.
* Purpose: Adds or removes a contact from the selectedContacts array based on the checkbox state.
*/
function toggleContact(event) {
    const checkbox = event.target;
    const contactId = checkbox.id;
    
    if (checkbox.checked) {
        if (!selectedContacts.includes(contactId)) {
            selectedContacts.push(contactId);
        }
    } else {
        selectedContacts = selectedContacts.filter(id => id !== contactId);
    }
}

/** 
 * This function updates the display of selected contacts.
 */
async function updateSelectedContacts() {
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
 * Retrieves the name of a contact based on their ID.
 *
 * @async
 * @param {string} contactId - The ID of the contact.
 * @returns {Promise<string>} The name of the contact or 'no name' if not found.
 * @throws {Error} If there's an issue fetching the data.
 */
async function getContactName(contactId) {
    try {
        const response = await fetch(`${task_base_url}/users.json`);
        const users = await response.json();
        
        for (let userId in users) {
            if (userId === contactId) {
                const nameResponse = await fetch(`${task_base_url}/users/${userId}/name.json`);
                return await nameResponse.json();
            }
        }
        return 'no name';
    } catch (error) {
        return '';
    }
}

/** 
 * This asynchronous function retrieves the color associated with a contact.
 */
async function getContactColor(contactId) {
    try {
        const response = await fetch(`${task_base_url}/users.json`);
        const users = await response.json();
        
        for (let userId in users) {
            if (userId === contactId) {
                const colorResponse = await fetch(`${task_base_url}/users/${userId}/color.json`);
                return await colorResponse.json();
            }
        }
        return '#000000'; /** Standard, if no color can be found*/
    } catch (error) {
        return '#000000'; /** Standard color if not found*/
    }
}

/** 
 * This function closes the contact dropdown and clears its content.
 */
function closeAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');
    contactDropDown.classList.add('d-none');
    contactsToSelect.innerHTML = '';
    document.removeEventListener('click', closeAssignedOnOutsideClick);
    updateSelectedContacts();
}

/**
 * Closes the assigned contacts dropdown when clicking outside.
 * 
 * @param {Event} event - The click event object.
 * @description Checks if the click is outside the contact dropdown and closes it if so.
 */
function closeAssignedOnOutsideClick(event) {
    event.stopPropagation();
    let ContactBox = document.getElementById('contact-drop-down');
    if (!ContactBox.contains(event.target)) {
        closeAssigned();
    }
}

/** 
 * Date
 */
let datepicker, warningDialog, dialogMessage, currentYear, maxYear;

/** 
 * This function initializes the date picker and sets up event listeners.
 */
function initializeDatePicker() {
    datepicker = document.getElementById('datepicker');
    warningDialog = document.getElementById('warning-dialog');
    dialogMessage = document.getElementById('dialog-message');
    currentYear = new Date().getFullYear();
    maxYear = currentYear + 5;

    if (datepicker) {
        setupEventListeners(datepicker, warningDialog);
    } else {
        return;
    }
}

/** 
 * This function sets up event listeners for the date picker.
 */
function setupEventListeners(datepicker, warningDialog) {
    datepicker.addEventListener('input', handleDateInput);
    datepicker.addEventListener('blur', validateFullDate);
    window.onclick = (event) => handleWindowClick(event, warningDialog);
}

/**
 * These functions handle and validate the date input.
 */
function handleDateInput() {
    let value = this.value.replace(/\D/g, '');
    let parts = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 8)];
    validateAndFormatParts(parts);
    this.value = formatDate(parts);
}

/**
 * Validates and formats the day, month, and year parts of the date.
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateAndFormatParts(parts) {
    validateDay(parts);
    validateMonth(parts);
    validateYear(parts);
}

/**
 * Validates the day part of the date to ensure it is within the valid range (1-31).
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateDay(parts) {
    if (parts[0].length === 2) {
        let day = parseInt(parts[0]);
        if (day < 1) parts[0] = '01';
        if (day > 31) parts[0] = '31';
    }
}

/**
 * Validates the month part of the date to ensure it is within the valid range (1-12).
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateMonth(parts) {
    if (parts[1].length === 2) {
        let month = parseInt(parts[1]);
        if (month < 1) parts[1] = '01';
        if (month > 12) parts[1] = '12';
    }
}

/**
 * Validates the year part of the date to ensure it is within a specified range.
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 */
function validateYear(parts) {
    if (parts[2].length === 4) {
        let year = parseInt(parts[2]);
        if (year < currentYear) parts[2] = currentYear.toString();
        if (year > maxYear) parts[2] = maxYear.toString();
    }
}

/**
 * Formats the date parts into a string in the format DD/MM/YYYY.
 * @param {Array<string>} parts - An array containing the day, month, and year parts.
 * @returns {string} The formatted date string.
 */
function formatDate(parts) {
    return parts.join('/').replace(/\/+$/, '');
}

/**
 * Validates the full date to ensure it forms a valid date.
 */
function validateFullDate() {
    const parts = this.value.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
        const [day, month, year] = parts.map(part => parseInt(part, 10));
        const date = new Date(year, month - 1, day);
    }
}

/** 
 * This function handles window clicks to close the warning dialog if necessary.
 */
function handleWindowClick(event, warningDialog) {
    if (event.target == warningDialog) {
        closeWarningDialog(warningDialog);
    }
}