/**
 * Closes the overlay when clicking outside the specified box but inside the overlay.
 * 
 * @param {Event} event - The click event object.
 * @param {string} box - The ID of the inner box element (e.g., 'addContactBox' or 'editContactBox').
 * @param {string} overlay - The ID of the overlay element.
 * 
 * @description
 * This function checks if a click occurred inside the overlay but outside the specified box.
 * If the condition is met, it closes the appropriate overlay based on the box ID.
 * The function stops event propagation to prevent unintended behavior.
 * 
 * @example
 * // Usage:
 * document.addEventListener('click', (event) => closeOverlayOnOutsideClick(event, 'addContactBox', 'addContactBoxOverlay'));
 */
function closeOverlayOnOutsideClick(event, box, overlay) {
    event.stopPropagation();
    let ContactBox = document.getElementById(box);
    let BoxOverlay = document.getElementById(overlay);

    if (!ContactBox || !BoxOverlay) {
        // console.error('One or both elements not found:', box, overlay);
        return; // Funktion beenden, wenn ein Element fehlt
    }
    
    if (BoxOverlay.contains(event.target) && !ContactBox.contains(event.target)) {
        if(box === 'addContactBox') {
            closeAddOverlay();
        }
        if(box === 'editContactBox') {
            closeEditOverlay();
        }
        if(box === 'overlay-content') {
            closeOverlay();
        }
        if(box === 'taskOverlay'|| box === 'editTaskOverlay') {
            // closeTaskOverlay();
            closeTaskOverlayAnimation(box);
        }
    }
}