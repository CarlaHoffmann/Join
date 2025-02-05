/**
 * Generates initials from a contact's name.
 * 
 * @function getContactInitials
 * @param {string} contact - The full name of the contact.
 * @returns {string} - The initials derived from the contact's name.
 */
function getContactInitials(contact) {
    let initials = contact.split(' ').map(word => word[0]).join('').toUpperCase();
    return initials;
}

/**
 * Returns the color associated with a given task category.
 * 
 * @function getCategoryColor
 * @param {string} category - The category of the task (e.g., "User Story", "Technical Task").
 * @returns {string} - The color code corresponding to the category.
 */
function getCategoryColor(category) {
    if (category === 'User Story') {
        return '#0038FF';
    }
    if (category === 'Technical Task') {
        return '#1FD7C1';
    }
    return '#000000';
}

/**
 * Maps a priority level to its corresponding priority label.
 * 
 * @function getPrio
 * @param {string} priority - The priority level (e.g., '1', '2', '3').
 * @returns {string} - The priority label ('urgent', 'medium', 'low').
 */
function getPrio(priority) {
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'medium';
        case '3': return 'low';
        default: return 'medium';
    }
}

/**
 * Returns the file path of the priority image corresponding to the given priority level.
 * 
 * @function getPrioImage
 * @param {string} prio - The priority level (e.g., '1', '2', '3').
 * @returns {string} - The file path of the priority image.
 */
function getPrioImage(prio) {
    switch (prio) {
        case '1': // Urgent
            return 'assets/img/board/prio_urgent.svg';
        case '2': // Medium
            return 'assets/img/board/prio_medium.svg';
        case '3': // Low
            return 'assets/img/board/prio_low.svg';
        default:
            return 'assets/img/board/prio_medium.svg';
    }
}

/**
 * Returns the priority text corresponding to the given priority level.
 * 
 * @function getPrioText
 * @param {string} prio - The priority level (e.g., '1', '2', '3').
 * @returns {string} - The priority text ('Urgent', 'Medium', 'Low').
 */
function getPrioText(prio) {
    switch (prio) {
        case '1':
            return 'Urgent';
        case '2':
            return 'Medium';
        case '3':
            return 'Low';
        default:
            return 'Medium';
    }
}

/**
 * Creates a custom confirmation dialog with an overlay.
 * 
 * @param {string} message - The message to display in the dialog.
 * @returns {Object} - An object containing the overlay and dialog elements.
 */
function createDialog(message) {
    const overlay = createOverlay();
    const dialog = createDialogElement(message);
    return { overlay, dialog };
}

/**
 * Creates and appends an overlay to the document body.
 * 
 * @returns {HTMLElement} - The created overlay element.
 */
function createOverlay() {
    return document.body.appendChild(Object.assign(document.createElement("div"), { className: "overlay show" }));
}


/**
 * Creates and appends a dialog element with buttons.
 * 
 * @param {string} message - The message to display in the dialog.
 * @returns {HTMLElement} - The created dialog element.
 */
function createDialogElement(message) {
    const dialog = document.body.appendChild(Object.assign(document.createElement("div"), { className: "custom-confirm-dialog" }));
    dialog.innerHTML = createDialogTemplate(message);
    return dialog;
}

/**
 * Adds event listeners to the dialog buttons and the overlay.
 *
 * @function addListeners
 * @param {Object} elements - The elements containing the `overlay` and `dialog`.
 * @param {Function} resolve - The resolve function of the Promise, used to return user selection.
 */
function addListeners(elements, resolve) {
    for (const [selector, result] of [[".confirm", true], [".cancel", false]]) {
        elements.dialog.querySelector(selector).addEventListener("click", () => resolve(result) || cleanup(elements));
    }
    elements.overlay.addEventListener("click", (e) => {
        if (e.target === elements.overlay) resolve(false) || cleanup(elements);
    });
}

/**
 * Removes the overlay and dialog elements from the DOM.
 *
 * @function cleanup
 * @param {Object} elements - The elements containing the `overlay` and `dialog`.
 */
function cleanup({ overlay, dialog }) {
    overlay.remove();
    dialog.remove();
}

/**
 * Displays a custom confirmation dialog with a message.
 *
 * @function showCustomConfirm
 * @param {string} message - The message to display in the dialog.
 * @returns {Promise<boolean>} - Resolves to `true` if "Yes" is clicked, or `false` if "No" or outside the dialog is clicked.
 */
function showCustomConfirm(message) {
    return new Promise((resolve) => {
        const elements = createDialog(message);
        addListeners(elements, resolve);
    });
}
