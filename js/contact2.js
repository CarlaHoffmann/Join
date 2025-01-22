
/**
 * Closes the edit contact overlay by adding the 'hidden' class to the edit contact box element.
 */
function closeEditOverlay(){
    document.getElementById('editContactForm').reset();
    document.getElementById('editContactBoxOverlay').classList.add('hidden');
    resetErrors();
}

/**
 * Closes the add contact overlay by adding the 'hidden' class to the add contact box element.
 */
function closeAddOverlay(){
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
 * Updates contact details based on edited form data, validates input, 
 * updates the database, and refreshes the UI.
 * 
 * @async
 * @returns {Promise<Object|void>} The updated user data or undefined if validation fails.
 */
async function updateEditedContact() {
    const [name, email, phone] = ['changedName', 'changedEmail', 'changedPhone'].map(id => document.getElementById(id).value.trim());
    if (!validateEditForm(name, email, phone)) return;
    const editLink = `${base_url}users/${editKey}.json`;
    const user = await (await fetch(editLink)).json();
    const updatedData = { ...user, mail: email, name, phone };
    const response = await fetch(editLink, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    const updatedUser = await response.json();
    loadContactData();
    closeEditOverlay();
    showContactDetails(editKey, updatedUser.name, updatedUser.mail, updatedUser.phone, updatedUser.color);
    return updatedUser;
}


/**
 * Validates the edit contact form, checks for empty fields and email format.
 * Displays error messages if validation fails.
 * 
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email of the contact.
 * @param {string} phone - The updated phone number of the contact.
 * @returns {boolean} True if validation passes, otherwise false.
 */
function validateEditForm(name, email, phone) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    ['changedName', 'changedEmail', 'changedPhone'].forEach(id => {
        const error = document.getElementById(`${id}-error-message`);
        if (!document.getElementById(id).value.trim()) {
            error.style.display = "flex";
            isValid = false;
        } else {
            error.style.display = "none";
        }
    });
    if (!emailRegex.test(email)) {
        document.getElementById("changedEmail-error-message").textContent = "Wrong Email Format";
        document.getElementById("changedEmail-error-message").style.display = "flex";
        isValid = false;
    }
    return isValid;
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
function startEditOrAddAnimation(operation){
    if(operation === 'add'){
        document.querySelector('#addContactBox').classList.add('show');
        document.querySelector('#addContactBoxOverlay').classList.remove('hidden');
    }
    if(operation === 'edit'){
        document.querySelector('#editContactBox').classList.add('show');
        document.querySelector('#editContactBoxOverlay').classList.remove('hidden');
    }
}

/**
 * hides error messages
 */
function resetErrors(){
    const error = document.getElementsByClassName('error-message');
    for(i=0;i<error.length;i++){
        error[i].style.display='none';
    }
}