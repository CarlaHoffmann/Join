/**
 * Opens a task creation overlay or navigates to a new page based on screen width.
 *
 * This function is used to display a form for adding a new task. 
 * - If the screen width is less than or equal to 500px, the user is redirected to a `task.html` page.
 * - For wider screens, it dynamically generates and injects an overlay containing the task creation form into the DOM.
 * 
 * The overlay includes various input fields such as title, description, due date, priority, category, and subtasks.
 * It also initializes event handlers and validation for the form.
 *
 * Dependencies:
 * - `initializeDatePicker()`: Initializes the date picker component for the due date input field.
 * - `initializePriority()`: Sets up the priority selection buttons.
 * - `initializeValidation()`: Adds validation logic to form fields.
 *
 * @function
 * @returns {void}
 */
function addTask() {
    if (window.innerWidth <= 500) {
        window.location.href = './task.html';
    } else {
        let overlay = document.getElementById('task-overlay');
        overlay.innerHTML = addTaskTemplate();
        initializeDatePicker();
        initializePriority();
        initializeValidation();
    }
}

/**
 * Closes the task creation overlay by clearing its content.
 *
 * This function resets the innerHTML of the overlay element identified by `task-overlay`.
 * It ensures that the overlay is removed from the user's view.
 *
 * @function
 * @returns {void}
 */function closeOverlay() {
    const overlay = document.getElementById('task-overlay');
    overlay.innerHTML = '';
}
