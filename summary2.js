/**
 * This function updates the UI with the highest priority tasks and the earliest due date.
 * @param {Object} elements - An object containing the UI elements.
 * @param {Array<Object>} tasks - The highest priority tasks.
 * @param {Date} earliestDate - The earliest due date.
 */
function updateWithTasks(elements, tasks, earliestDate) {
    const task = tasks[0];
    elements.color.classList.add(getSymbolColor(task.prio));
    elements.image.src = getSymbol(task.prio);
    elements.counter.innerHTML = tasks.length;
    elements.prio.innerHTML = getPriorityText(task.prio);
    elements.date.innerHTML = formatDate(earliestDate);
}

/**
 * This function updates the UI to indicate that there are no upcoming tasks.
 * @param {Object} elements - An object containing the UI elements.
 */
function updateWithoutTasks(elements) {
    elements.color.classList.add(getSymbolColor(1));
    elements.image.src = "./img/summary/prio_high.svg";
    elements.counter.innerHTML = "0";
    elements.prio.innerHTML = "Urgent";
    elements.date.innerHTML = "No upcoming Deadline";
}

/**
 * This function returns the CSS class for the symbol color based on the priority.
 * @param {string} prio - The priority level (1, 2, or 3).
 * @returns {string} The CSS class for the symbol color.
 */
function getSymbolColor(prio) {
    switch(prio) {
        case "1": return "urgent";
        case "2": return "medium";
        case "3": return "low";
        default: return "urgent";
    }
}

/**
 * This function returns the URL of the symbol image based on the priority.
 * @param {string} prio - The priority level (1, 2, or 3).
 * @returns {string} The URL of the symbol image.
 */
function getSymbol(prio) {
    switch(prio) {
        case "1": return "./img/summary/prio_high.svg";
        case "2": return "./img/summary/prio_mid.svg";
        case "3": return "./img/summary/prio_low.svg";
        default: return "./img/summary/prio_high.svg";
    }
}

/**
 * This function returns the text representation of the priority level.
 * @param {string} prio - The priority level (1, 2, or 3).
 * @returns {string} The text representation of the priority.
 */
function getPriorityText(prio) {
    switch (prio) {
        case "1": return "Urgent";
        case "2": return "Medium";
        case "3": return "Low";
        default: return "Unknown";
    }
}

/**
 * This function formats a Date object into a human-readable string.
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
    if (!date) return "None";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * This function redirects the user to the board page.
 */
function goToBoard() {
    window.location.href = 'board.html';
}

/**
 * Initializes the task summary when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', initSummary);