/**
 * @type {string|null}
 * @description variable to store editKey which is needed to edit a contact
 */
let editKey = null;

/**
 * The following variables include references to HTMLElements
 */
let contactList = document.getElementById('contactList');
let contactDetails = document.getElementById('contactDetails');
//let addContactButton = document.getElementById('addContactButton');
//let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');

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
 * Retrieves input values for the edited contact from the DOM.
 * @returns {Array<string>} - Array containing name, email, and phone values.
 */
function getEditedContactInput() {
    return ['changedName', 'changedEmail', 'changedPhone'].map(
        (id) => document.getElementById(id).value.trim()
    );
}

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
 * hides error messages
 */
function resetErrors() {
    const error = document.getElementsByClassName('error-message');
    for (i = 0; i < error.length; i++) {
        error[i].style.display = 'none';
    }
}