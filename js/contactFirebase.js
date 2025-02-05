/**
 * @type {string}
 * @description basic url to firebase
 */

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

const base_url = 'https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/';

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