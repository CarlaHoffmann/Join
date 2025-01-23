const task_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"
/** This URL is used to connect to the Firebase Realtime Database. */

let selectedContacts = [];

/** This function opens the contact dropdown and populates it with contacts.*/
async function openAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');

    const contacts = await loadContacts();
    const loggedInUser = await getUser();

    const preparedContacts = await prepareContacts(contacts, loggedInUser);
    console.log(preparedContacts);
    console.log(loggedInUser);
    const contactsHTML = createContactsHTML(preparedContacts, selectedContacts, loggedInUser);

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.style.display = 'block';
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

        /** Create an array with contacts */
        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name }));

        return contactsArray;
    } catch (error) {
        return [];
    }
}

/** This function prepares the contacts array by sorting and positioning the logged-in user at the top.*/
async function prepareContacts(contacts, loggedInUser) {
    if (loggedInUser === 'Guest') {
        return contacts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
    // return contacts;

    const loggedInContactIndex = contacts.findIndex(contact => contact.name === loggedInUser.name);
    console.log(loggedInContactIndex);
    // if (loggedInContactIndex !== -1) {
        const [loggedInContact] = contacts.splice(loggedInContactIndex, 1); /** Remove the user from the array */
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        return [loggedInContact, ...contacts]; /** Add it back at the beginning */
    }
}

/** 
 * This function generates the HTML for displaying the contacts.
 */
function createContactsHTML(contacts, selectedContacts, loggedInUser) {
    let contactsHTML = '';

    contacts.forEach((contact, index) => {
        const isSelected = selectedContacts.includes(contact.id);
        const isCurrentUser = loggedInUser.name !== 'Guest' && contact.name === loggedInUser.name;
        contactsHTML += `
            <label onclick="handleContactClick(event, ${index})" class="selection-name contact-label">
                <div>${contact.name}${isCurrentUser ? ' (You)' : ''}</div>
                <input type="checkbox" id="${contact.id}" value="${contact.name}" ${isSelected ? 'checked' : ''}>
            </label>
        `;
    });

    return contactsHTML;
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
function handleContactClick(event, index) {
    event.stopPropagation();
    const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
    toggleContact({ target: checkbox }, index); 
}

/** This function toggles the selection status of a contact.
* Purpose: Adds or removes a contact from the selectedContacts array based on the checkbox state.
*/
function toggleContact(event, index) {
    const checkbox = event.target;
    // const contactName = checkbox.value;
    const contactId = checkbox.id;
    
    if (checkbox.checked) {
        if (!selectedContacts.includes(contactId)) {
            selectedContacts.push(contactId);
        }
    } else {
        selectedContacts = selectedContacts.filter(id => id !== contactId);
        console.log(selectedContacts);
    }
}

/** 
 * This function updates the display of selected contacts.
 */
async function updateSelectedContacts() {
    let contactInitials = document.getElementById('selected-contacts');
    contactInitials.innerHTML = ''; 

    let contactInis = ''; /** Variable for collecting strings*/

    for (let i = 0; i < selectedContacts.length; i++) {
        const contactId = selectedContacts[i];

        let contactName = await getContactName(contactId);
        let initials = contactName.split(' ').map(word => word[0]).join('');
        
        /** 
         * Get color of contacts
         */
        let color = await getContactColor(contactId); 
        
        /** 
         * Add HTML-String to collection
         */
        contactInis += `<div class="contact-initial" style="background-color: ${color};">${initials}</div>`;
    }

    /** 
     * Add all contact-initials 
    */
    contactInitials.innerHTML = contactInis;
}

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
        return 'no name'; /** Standard, if no name can be found*/
    } catch (error) {
        return ''; /** Standard name if not found*/
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
    contactDropDown.style.display = 'none';
    contactsToSelect.innerHTML = '';
    updateSelectedContacts();
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