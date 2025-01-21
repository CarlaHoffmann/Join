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
 * Adds a new contact by collecting form input values, generating a color, 
 * and uploading the data to the server. Also clears the form, updates the UI, 
 * and reloads contact data.
 * 
 * @async
 * @function addContact
 * @returns {Promise<void>} A promise that resolves when the contact is successfully added.
 */

/**
 * Adds a new contact after validation, updates the database and UI.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function addContact() {
    const fields = ['name', 'email', 'phone'].map(id => document.getElementById(id));
    const [name, mail, phone] = fields.map(f => f.value.trim());
    if (!validateContactFields(name, mail, phone)) return;

    const uploadData = { name, mail, phone, color: returnColor(), password: 'pw' };
    await createNewContact('/users', uploadData);

    closeAddOverlay();
    clearAddContactFields();
    showContactAddedOverlay();
    loadContactData();
    resetErrorMessages(fields);
}

/**
 * Validates input fields and shows error messages if validation fails.
 * 
 * @param {string} name - Contact's name.
 * @param {string} mail - Contact's email.
 * @param {string} phone - Contact's phone.
 * @returns {boolean} True if validation passes, false otherwise.
 */
function validateContactFields(name, mail, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fields = { name, mail, phone };
    let isValid = true;

    Object.entries(fields).forEach(([id, value]) => {
        const error = document.getElementById(`${id}-error-message`);
        if (!value || (id === 'mail' && !emailRegex.test(mail))) {
            error.textContent = id === 'mail' ? "Wrong Email Format" : "This field is required";
            error.style.display = "flex";
            isValid = false;
        } else {
            error.style.display = "none";
        }
    });

    return isValid;
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
 * Deletes a contact and removes them from all associated tasks.
 * Updates the database and the UI to reflect the changes.
 * 
 * @async
 * @param {string} key - The unique identifier of the contact to be deleted.
 */
async function deleteContact(key) {
    try {
        const contactUrl = `${base_url}/users/${key}.json`;
        const contactResponse = await fetch(contactUrl);
        const contact = await contactResponse.json();
        if (!contact) {
            console.error('Contact not found.');
            return;
        }

        await fetch(contactUrl, { method: 'DELETE' });
        await removeContactFromTasks(contact.name);

        contactDetails.innerHTML = '';
        closeDetailsOverlay();
        await loadContactData();
        await loadTasks();

    } catch (error) {
    }
}


/**
 * Removes a contact from all tasks where they are assigned.
 * 
 * @async
 * @param {string} contactName - The name of the contact to be removed.
 */
async function removeContactFromTasks(contactName) {
    try {
        const tasksUrl = `${base_url}/tasks.json`;
        const tasksResponse = await fetch(tasksUrl);
        const tasksData = await tasksResponse.json();

        if (!tasksData) {
            return;
        }

        for (const [status, tasks] of Object.entries(tasksData)) {
            for (const [taskId, task] of Object.entries(tasks)) {

                if (task.contacts && task.contacts.includes(contactName)) {
                    task.contacts = task.contacts.filter(name => name !== contactName);

                    const taskUrl = `${base_url}/tasks/${status}/${taskId}.json`;
                    await fetch(taskUrl, {
                        method: 'PUT',
                        body: JSON.stringify(task),
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }
        }
    } catch (error) {
    }
}


/**
 * Deletes a contact from the Firebase database by its unique key and updates the contact list.
 * It sends a DELETE request to Firebase and reloads the contact data after the deletion.
 * 
 * @async
 * @param {string} key - The unique identifier of the contact to be deleted from the database.
 * @returns {Promise<Object>} The response data from the DELETE request to Firebase.
 */
async function updateDeletedContact(key){
    const contactDetails = document.getElementById('contactDetails');
    const deleteLink = base_url + "users" + "/" + key;
    const response = await fetch(deleteLink + ".json", {method:'DELETE'});
    loadContactData();
    contactDetails.innerHTML = "";

    return await response.json();
}

/**
 * Creates a new contact in the Firebase database by sending a POST request with the provided data.
 * 
 * @async
 * @param {string} [path=""] - The path in the Firebase database where the contact data should be stored.
 * @param {Object} [data={}] - The data of the new contact to be created, typically an object containing the contact's details.
 * @param {string} data.name - The name of the contact.
 * @param {string} data.email - The email address of the contact.
 * @param {string} data.phone - The phone number of the contact.
 * @param {string} data.color - The color associated with the contact.
 * @returns {Promise<Object>} The response data from the Firebase database after the contact is created.
 */
async function createNewContact(path = "", data={}){
    let response = await fetch(base_url + path + ".json", {
        method:"POST",
        header:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

/**
 * Toggles the visibility of a specified element and, if in edit mode, populates it with user data for editing.
 * 
 * @async
 * @param {string} elementId - The ID of the HTML element to show by removing the 'hidden' class.
 * @param {string|null} [key=null] - The unique identifier of the user for edit mode, defaults to null if no edit is required.
 * @param {boolean} [edit=false] - A flag indicating whether to enable edit mode; if true, user data will be fetched and displayed for editing.
 */
async function toggleView(elementId, key=null, edit=false){
    editKey = key;
    document.getElementById(elementId).classList.remove('hidden');

    if(edit){
        const editLink = base_url + "users" + "/" + editKey;
        let response = await fetch(editLink + ".json");
        let user = await response.json();

        document.getElementById('changedImg').style.backgroundColor = user.color;
        document.getElementById('changedImg').textContent = getNameInitials(user.name);
        document.getElementById('changedName').value = user.name;
        document.getElementById('changedEmail').value = user.mail;
        document.getElementById('changedPhone').value = user.phone;
    }
}
