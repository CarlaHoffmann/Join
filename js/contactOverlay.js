let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');

/**
 * Displays the contact detail overlay by adding a specific CSS class to the overlay element.
 */
function showContactDetailOverlay() {
    let contactDetailBoxOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlay.classList.add('contactDetailBox');
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