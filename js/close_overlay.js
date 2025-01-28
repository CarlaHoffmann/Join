/**
 * Handles closing an overlay when clicking outside of the specified box.
 * @param {Event} event - The click event.
 * @param {string} box - The ID of the box element to check for clicks outside of.
 * @param {string} overlay - The ID of the overlay element to check.
 */
function closeOverlayOnOutsideClick(event, box, overlay) {
    event.stopPropagation();

    const contactBox = document.getElementById(box);
    const boxOverlay = document.getElementById(overlay);

    if (!contactBox || !boxOverlay) return;

    if (isClickOutsideBox(event, contactBox, boxOverlay)) {
        handleOverlayClose(box);
    }
}

/**
 * Checks if the click was outside the specified box within the overlay.
 * @param {Event} event - The click event.
 * @param {HTMLElement} contactBox - The box element to check against.
 * @param {HTMLElement} boxOverlay - The overlay element to check against.
 * @returns {boolean} - True if the click was outside the box, false otherwise.
 */
function isClickOutsideBox(event, contactBox, boxOverlay) {
    return boxOverlay.contains(event.target) && !contactBox.contains(event.target);
}

/**
 * Closes the appropriate overlay based on the given box ID.
 * @param {string} box - The ID of the box to determine which overlay to close.
 */
function handleOverlayClose(box) {
    const closeActions = {
        addContactBox: closeAddOverlay,
        editContactBox: closeEditOverlay,
        'overlay-content': closeOverlay,
        taskOverlay: () => closeTaskOverlayAnimation('taskOverlay'),
        editTaskOverlay: () => closeTaskOverlayAnimation('editTaskOverlay'),
    };

    if (closeActions[box]) {
        closeActions[box]();
    } else {
        console.warn(`No handler defined for box ID: ${box}`);
    }
}
