
/**
 * Closes the edit contact overlay by adding the 'hidden' class to the edit contact box element.
 */
function closeEditOverlay() {
    document.getElementById('editContactForm').reset();
    document.getElementById('editContactBoxOverlay').classList.add('hidden');
    resetErrors();
}

/**
 * Closes the add contact overlay by adding the 'hidden' class to the add contact box element.
 */
function closeAddOverlay() {
    document.getElementById('addContactForm').reset();
    document.getElementById('addContactBoxOverlay').classList.add('hidden');
    resetErrors();
}

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
 * Retrieves input values for the edited contact from the DOM.
 * @returns {Array<string>} - Array containing name, email, and phone values.
 */
function getEditedContactInput() {
    return ['changedName', 'changedEmail', 'changedPhone'].map(
        (id) => document.getElementById(id).value.trim()
    );
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
 * Prepares the updated user data by merging the existing user data with new inputs.
 * @param {Object} user - The existing user data.
 * @param {string} name - The updated name.
 * @param {string} email - The updated email.
 * @param {string} phone - The updated phone number.
 * @returns {Object} - The prepared updated user data.
 */
function prepareUpdatedData(user, name, email, phone) {
    return { ...user, name, mail: email, phone };
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
 * Refreshes the UI after editing a contact.
 * @param {string} key - The unique key for the user.
 * @param {Object} updatedUser - The updated user data.
 */
function refreshUIAfterEdit(key, updatedUser) {
    loadContactData();
    closeEditOverlay();
    showContactDetails(
        key,
        updatedUser.name,
        updatedUser.mail,
        updatedUser.phone,
        updatedUser.color
    );
}

/**
 * Validates the edit form fields (name, email, phone) and displays error messages if needed.
 * @param {string} name - The entered name.
 * @param {string} email - The entered email.
 * @param {string} phone - The entered phone number.
 * @returns {boolean} - True if all inputs are valid, false otherwise.
 */
function validateEditForm(name, email, phone) {
    let isValid = validateRequiredFields();
    isValid = validateEmailFormat(email) && isValid; // Combine both validations
    return isValid;
}

/**
 * Validates that all required fields are filled.
 * Displays error messages for empty fields.
 * @returns {boolean} - True if all fields are filled, false otherwise.
 */
function validateRequiredFields() {
    let isValid = true;

    ['changedName', 'changedEmail', 'changedPhone'].forEach((id) => {
        const input = document.getElementById(id).value.trim();
        const error = document.getElementById(`${id}-error-message`);

        if (!input) {
            showError(error, "This field is required");
            isValid = false;
        } else {
            hideError(error);
        }
    });

    return isValid;
}

/**
 * Validates the email format using a regex pattern.
 * Displays an error message for invalid email format.
 * @param {string} email - The entered email.
 * @returns {boolean} - True if the email format is valid, false otherwise.
 */
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = document.getElementById("changedEmail-error-message");

    if (!emailRegex.test(email)) {
        showError(emailError, "Wrong Email Format");
        return false;
    }

    hideError(emailError);
    return true;
}

/**
 * Displays an error message.
 * @param {HTMLElement} errorElement - The DOM element to display the error in.
 * @param {string} message - The error message to display.
 */
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = "flex";
}

/**
 * Hides an error message.
 * @param {HTMLElement} errorElement - The DOM element to hide the error in.
 */
function hideError(errorElement) {
    errorElement.style.display = "none";
}

/**
 * Closes the contact details overlay by removing the 'contactDetailBox' class 
 * and resetting the selected contact state.
 * It also removes the 'selected' class from all contacts to clear the selection.
 */
function closeDetailsOverlay() {
    let contactDetailBoxOverlayOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlayOverlay.classList.remove('contactDetailBox');

    document.querySelectorAll('.contact').forEach(contact => {
        contact.classList.remove('selected');
    });
}

/**
 * Toggles the visibility of the control menu and the active state of the control circle.
 * It adds/removes the 'hidden' class to the control menu and the 'active' class to 
 * the mobile control circle element to show/hide the menu and change its state.
 */
function openControlMenu() {
    let controlMenu = document.getElementById('options-menu');
    let circleControl = document.querySelector('.circle-edit-mobile-control');

    controlMenu.classList.remove('hidden');
    circleControl.classList.add('active');
    setTimeout(() => {
        controlMenu.classList.add('active');
    }, 10);

    document.addEventListener('click', handleClickOutside);
}

/**
 * Closes the control menu by hiding it and resetting its position.
 * The function removes the "active" class, adds the "hidden" class to the menu,
 * and ensures a smooth transition effect before fully resetting its position.
 * Also removes the click event listener for handling clicks outside the menu.
 */
function closeControlMenu() {
    let controlMenu = document.getElementById('options-menu');
    let circleControl = document.querySelector('.circle-edit-mobile-control');

    controlMenu.classList.remove('active');
    controlMenu.classList.add('hidden');

    setTimeout(() => {
        circleControl.classList.remove('active');
        controlMenu.style.transform = "translateX(100%)";
    }, 600);

    document.removeEventListener('click', handleClickOutside);
}

/**
 * Handles click events outside the control menu and circle control.
 * If the clicked element is not inside the control menu or the circle control,
 * the function triggers the `closeControlMenu` function to hide the menu.
 *
 * @param {MouseEvent} event - The click event object containing details about the event.
 */
function handleClickOutside(event) {
    const controlMenu = document.getElementById('options-menu');
    const circleControl = document.querySelector('.circle-edit-mobile-control');
    if (!controlMenu.contains(event.target) && !circleControl.contains(event.target)) {
        closeControlMenu();
    }
}

/**
 * Displays a confirmation overlay when a contact is added.
 * The overlay is shown with a small delay to allow for animation, and automatically hides 
 * after 3 seconds. The 'show' and 'hidden' classes are used to control the visibility and 
 * animation of the overlay.
 */
function showContactAddedOverlay() {
    const overlay = document.getElementById('contact-added-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }, 3000);
}

/**
 * Toggles the visibility of an overlay element for adding or editing a contact.
 * Depending on the specified operation, the appropriate box is shown
 * by adding the "show" class and removing the "hidden" class from overlay.
 * @param {string} operation - The type of operation to perform. 
 *                              Use "add" to display the "Add Contact" overlay, 
 *                              or "edit" to display the "Edit Contact" overlay.
 */
function startEditOrAddAnimation(operation) {
    if (operation === 'add') {
        document.querySelector('#addContactBox').classList.add('show');
        document.querySelector('#addContactBoxOverlay').classList.remove('hidden');
    }
    if (operation === 'edit') {
        document.querySelector('#editContactBox').classList.add('show');
        document.querySelector('#editContactBoxOverlay').classList.remove('hidden');
    }
}

/**
 * hides error messages
 */
function resetErrors() {
    const error = document.getElementsByClassName('error-message');
    for (i = 0; i < error.length; i++) {
        error[i].style.display = 'none';
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

/**
 * Populates the edit form with user data.
 * @param {Object} user - The user data to populate the form with.
 */
function populateEditForm(user) {
    const changedImg = document.getElementById('changedImg');
    changedImg.style.backgroundColor = user.color;
    changedImg.textContent = getNameInitials(user.name);

    document.getElementById('changedName').value = user.name;
    document.getElementById('changedEmail').value = user.mail;
    document.getElementById('changedPhone').value = user.phone;
}