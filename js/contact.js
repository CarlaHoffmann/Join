/**
 * @type {string|null}
 * @description variable to store editKey which is needed to edit a contact
 */
let editKey = null;

/**
 * @type {string}
 * @description basic url to firebase
 */
const base_url = 'https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * The following variables include references to HTMLElements
 */
let contactList = document.getElementById('contactList');
let contactDetails = document.getElementById('contactDetails');
let addContactButton = document.getElementById('addContactButton');
let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');

/**
 * Clears the input fields in the "Add Contact" form.
 * Resets the values of the name, email, and phone input elements to an empty string.
 */
function clearAddContactFields(){
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}


/**
 * Handles the addition of a new contact by validating input, saving data, and updating the UI.
 * @returns {Promise<void>}
 */
async function addContact() {
    const fields = getContactInputFields();
    const [name, mail, phone] = fields.map(field => field.value);
    const color = returnColor();
    const uploadData = { phone, color, mail, name, password: 'pw' };

    if (isValidContactInput(name, mail, phone)) {
        await createNewContact('/users', uploadData);
        handleSuccessfulContactAddition(fields);
    } else {
        showErrorMessages(fields, name && mail && phone, isValidEmail(mail));
    }
}

/**
 * Retrieves the input fields for contact data.
 * @returns {Array<HTMLInputElement>} - Array of input field elements.
 */
function getContactInputFields() {
    return ['name', 'email', 'phone'].map(id => document.getElementById(id));
}

/**
 * Validates the input fields for the new contact.
 * @param {string} name - The entered name.
 * @param {string} mail - The entered email.
 * @param {string} phone - The entered phone number.
 * @returns {boolean} - True if the input is valid, otherwise false.
 */
function isValidContactInput(name, mail, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return name && mail && phone && emailRegex.test(mail);
}

/**
 * Creates a new contact by sending data to the server.
 * @param {string} endpoint - The API endpoint to send the data to.
 * @param {Object} data - The contact data to upload.
 * @returns {Promise<void>}
 */
async function createNewContact(endpoint, data) {
    const url = `${base_url}${endpoint}.json`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

/**
 * Handles UI updates and resets after a successful contact addition.
 * @param {Array<HTMLInputElement>} fields - The input fields to clear.
 */
function handleSuccessfulContactAddition(fields) {
    closeAddOverlay();
    clearAddContactFields(fields);
    showContactAddedOverlay();
    loadContactData();
    fields.forEach(el => hideErrorMessage(el));
}

/**
 * Clears the input fields for adding a new contact.
 * @param {Array<HTMLInputElement>} fields - The input fields to clear.
 */
function clearAddContactFields(fields) {
    fields.forEach(field => (field.value = ''));
}

/**
 * Displays error messages for invalid input fields.
 * @param {Array<HTMLInputElement>} fields - The input fields to validate.
 * @param {boolean} notEmpty - Whether all fields are filled.
 * @param {boolean} validEmail - Whether the email is valid.
 */
function showErrorMessages(fields, notEmpty, validEmail) {
    fields.forEach(field => {
        const errorElement = document.getElementById(`${field.id}-error-message`);
        if (!field.value.trim()) {
            showErrorMessage(errorElement, 'This field is required');
        } else if (field.id === 'email' && !validEmail) {
            showErrorMessage(errorElement, 'Invalid email format');
        } else {
            hideErrorMessage(errorElement);
        }
    });
}

/**
 * Shows an error message for a specific field.
 * @param {HTMLElement} errorElement - The error message element.
 * @param {string} message - The error message to display.
 */
function showErrorMessage(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'flex';
}

/**
 * Hides the error message for a specific field.
 * @param {HTMLElement} errorElement - The error message element.
 */
function hideErrorMessage(errorElement) {
    errorElement.style.display = 'none';
}


/**
 * Displays error messages for invalid form fields.
 * 
 * @function showErrorMessages
 * @param {HTMLElement[]} fields - Array of input field elements to check.
 * @param {boolean} notEmpty - Flag indicating if all fields are non-empty.
 * @param {boolean} validEmail - Flag indicating if the email is valid.
 * 
 * @description
 * This function shows error messages for empty fields and invalid email format.
 * It displays error messages next to the corresponding input fields.
 * 
 * @example
 * // Call the function
 * showErrorMessages([nameInput, emailInput, phoneInput], false, true);
 */

function showErrorMessages(fields, notEmpty, validEmail) {
    if (!notEmpty) {
        fields.forEach(element => {
            if (!element.value) {
                document.getElementById(`${element.id}-error-message`).style.display = "flex";
            }
        });
    }
    if (!validEmail) {
        const emailError = document.getElementById("email-error-message");
        emailError.innerHTML = "Wrong Email Format";
        emailError.style.display = "flex";
    }
    document.getElementById("email-error-message").style.display = validEmail ? "none" : "flex";
}

/**
 * Resets error messages for input fields.
 * 
 * @param {HTMLElement[]} fields - Array of input elements.
 */
function resetErrorMessages(fields) {
    fields.forEach(f => document.getElementById(`${f.id}-error-message`).style.display = "none");
}

/**
 * Extracts the initials from a given name.
 * If the name consists of a single part, returns the first letter of that part.
 * If the name has multiple parts, returns the initials of the first and last parts.
 * 
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials derived from the name.
 */
function getNameInitials(name) {
    let nameParts = name.split(' ');
    if (nameParts.length < 2) {
        return name.charAt(0); // Wenn nur ein Namesteil vorhanden ist, gib den ersten Buchstaben zurück
    }
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}

/**
 * Displays the detailed information of a selected contact, including name, email, 
 * phone, and color. Also manages the animation and highlights the selected contact.
 * 
 * @param {string} key - The unique identifier for the contact to display.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The background color associated with the contact.
 */
function showContactDetails(key, name, email, phone, color) {
    const [details, overlay, menu] = ['contactDetails', 'contactDetailsOverlay', 'contactDetailsOverlayMenu'].map(id => document.getElementById(id));
    const template = returnContactDetailsTemplate(key, name, email, phone, color);
    details.innerHTML = overlay.innerHTML = template;
    menu.innerHTML = returncontactDetailsMenuTemplate(key);
    details.classList.contains('show') ? (details.classList.remove('show'), requestAnimationFrame(() => details.classList.add('show'))) : details.classList.add('show');
    document.querySelectorAll('.contact').forEach(c => c.classList.remove('selected'));
    const selected = document.querySelector(`.contact[onclick*="'${key}'"]`);
    selected && selected.classList.add('selected');
}

/**
 * Displays the contact detail overlay by adding a specific CSS class to the overlay element.
 */
function showContactDetailOverlay() {
    let contactDetailBoxOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlay.classList.add('contactDetailBox');
}

/**
 * Sorts an array of users alphabetically by their name property.
 * The sorting is case-insensitive.
 * 
 * @param {Array} usersArray - The array of user objects to be sorted.
 * @param {Object} usersArray[] - The user object containing at least a `name` property.
 * @param {string} usersArray[].name - The name of the user, used for sorting.
 */
function sortUsers(usersArray){
    usersArray.sort(function(a,b){
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if(nameA < nameB){ //a before b
            return -1;
        } else if(nameA > nameB){ //b before a
            return 1;
        } else{ //same value
            return 0;
        }
    });
}

/**
 * Asynchronously loads contact data from a Firebase database, processes the data,
 * and populates the contact list with users' information, sorted alphabetically.
 * It also displays the appropriate letters for name initials and manages the UI elements.
 * 
 * @async
 */
async function loadContactData(){
    let response = await fetch(base_url + ".json");
    let responseToJson = await response.json();
    let users = 
    await responseToJson.users;
    usersArray = Object.values(users);
    let keys = Object.keys(users);
    for(let i = 0; i < usersArray.length; i++){
        usersArray[i].key = keys[i];
    }
    sortUsers(usersArray);
    contactList.innerHTML = "";
    returnContactList();
}

loadContactData();

/**
 * Deletes a contact from the database and updates related tasks and UI.
 * @param {string} key - The unique key of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(key) {
    try {
        const contact = await fetchContact(key);
        if (!contact) return;

        await deleteContactFromDatabase(key);
        await removeContactFromTasks(contact.name);

        clearContactDetails();
        closeDetailsOverlay();
        await refreshContactAndTaskData();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

/**
 * Fetches a contact from the database by key.
 * @param {string} key - The unique key of the contact.
 * @returns {Promise<Object|null>} - The contact data or null if not found.
 */
async function fetchContact(key) {
    const contactUrl = `${base_url}/users/${key}.json`;
    const response = await fetch(contactUrl);
    return response.ok ? response.json() : null;
}

/**
 * Deletes a contact from the database by key.
 * @param {string} key - The unique key of the contact.
 * @returns {Promise<void>}
 */
async function deleteContactFromDatabase(key) {
    const contactUrl = `${base_url}/users/${key}.json`;
    await fetch(contactUrl, { method: 'DELETE' });
}

/**
 * Clears the contact details section in the UI.
 */
function clearContactDetails() {
    contactDetails.innerHTML = '';
}

/**
 * Refreshes the contact list and tasks in the UI.
 * @returns {Promise<void>}
 */
async function refreshContactAndTaskData() {
    await loadContactData();
    await loadTasks();
}

/**
 * Removes a specific contact from all tasks where it is assigned.
 * @param {string} contactName - The name of the contact to remove.
 * @returns {Promise<void>}
 */
async function removeContactFromTasks(contactName) {
    try {
        const tasksData = await fetchAllTasks();
        if (!tasksData) return;

        for (const [status, tasks] of Object.entries(tasksData)) {
            for (const [taskId, task] of Object.entries(tasks)) {
                await processTaskContacts(task, status, taskId, contactName);
            }
        }
    } catch (error) {
    }
}

/**
 * Fetches all tasks from the database.
 * @returns {Promise<Object|null>} - The tasks data or null if no data exists.
 */
async function fetchAllTasks() {
    const tasksUrl = `${base_url}/tasks.json`;
    const response = await fetch(tasksUrl);
    return response.ok ? response.json() : null;
}

/**
 * Processes a single task to remove the specified contact if it exists.
 * @param {Object} task - The task object to process.
 * @param {string} status - The status of the task (e.g., "todo", "in-progress").
 * @param {string} taskId - The unique ID of the task.
 * @param {string} contactName - The name of the contact to remove.
 * @returns {Promise<void>}
 */
async function processTaskContacts(task, status, taskId, contactName) {
    if (task.contacts && task.contacts.includes(contactName)) {
        task.contacts = task.contacts.filter(name => name !== contactName);
        await updateTaskContacts(status, taskId, task);
    }
}

/**
 * Updates a task's contacts in the database.
 * @param {string} status - The status of the task (e.g., "todo", "in-progress").
 * @param {string} taskId - The unique ID of the task.
 * @param {Object} updatedTask - The updated task object.
 * @returns {Promise<void>}
 */
async function updateTaskContacts(status, taskId, updatedTask) {
    const taskUrl = `${base_url}/tasks/${status}/${taskId}.json`;
    await fetch(taskUrl, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: { 'Content-Type': 'application/json' },
    });
}