


/**
 * Edits a contact by updating its details and then fetching the updated user data to display.
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves once the contact details have been updated and displayed.
 */
async function editContact() {
    await updateEditedContact();
    const response = await fetch(`${base_url}/users/${editKey}.json`);
    const user = await response.json();
}

/**
 * Updates the edited contact's details in the database and updates the UI.
 * @returns {Promise<Object>} - The updated user data.
 */
async function updateEditedContact() {
    const [name, email, phone] = getEditedContactInput();
    if (!validateEditForm(name, email, phone)) return;

    const user = await fetchUserData(editKey);
    const updatedData = prepareUpdatedData(user, name, email, phone);
    const updatedUser = await saveUpdatedContact(editKey, updatedData);

    refreshUIAfterEdit(editKey, updatedUser);
    return updatedUser;
}



/**
 * Fetches the existing user data from the database.
 * @param {string} key - The unique key for the user.
 * @returns {Promise<Object>} - The existing user data.
 */
async function fetchUserData(key) {
    const response = await fetch(`${base_url}users/${key}.json`);
    return response.json();
}



/**
 * Sends the updated user data to the database.
 * @param {string} key - The unique key for the user.
 * @param {Object} data - The updated user data.
 * @returns {Promise<Object>} - The updated user data from the response.
 */
async function saveUpdatedContact(key, data) {
    const response = await fetch(`${base_url}users/${key}.json`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
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
 * Toggles the visibility of an element and, optionally, populates form fields for editing.
 * @param {string} elementId - The ID of the element to toggle visibility for.
 * @param {string|null} key - The unique key of the user to fetch data for (if editing).
 * @param {boolean} edit - Indicates if the form is in edit mode.
 */
async function toggleView(elementId, key = null, edit = false) {
    editKey = key;
    document.getElementById(elementId).classList.remove('hidden');

    if (edit) {
        const user = await fetchUserData(key);
        populateEditForm(user);
    }
}

/**
 * Fetches user data from the server based on the provided key.
 * @param {string} key - The unique key of the user to fetch data for.
 * @returns {Promise<Object>} - The user data.
 */
async function fetchUserData(key) {
    const editLink = `${base_url}users/${key}.json`;
    const response = await fetch(editLink);
    return response.json();
}