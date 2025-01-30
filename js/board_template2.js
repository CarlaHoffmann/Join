/**
 * Generates the HTML for assigned contacts.
 * 
 * @param {Array} contacts - List of assigned contacts.
 * @param {Array} contactNames - Names of the assigned contacts.
 * @param {Array} contactColors - Colors associated with the contacts.
 * @returns {string} - Generated HTML string for contacts.
 */
function generateContactsHTML(contacts, contactNames, contactColors) {
    return contacts.map((contact, index) => {
        const initials = getContactInitials(contactNames[index]);
        return `
            <div class="assigned-contact">
                <div class="contact-initial" style="background-color: ${contactColors[index]};">${initials}</div>
                <span class="contact-name">${contactNames[index]}</span>
            </div>`;
    }).join('');
}

/**
 * Generates the HTML for the subtasks list.
 * 
 * @param {Object} subtasks - Object containing subtasks with keys.
 * @param {string} taskPath - The path of the task.
 * @param {string} taskId - The ID of the task.
 * @returns {string} - Generated HTML string for subtasks.
 */
function generateSubtasksHTML(subtasks, taskPath, taskId) {
    let subtasksHTML = '';
    for (const key in subtasks || {}) {
        if (Object.hasOwnProperty.call(subtasks, key)) {
            const subtask = subtasks[key];
            const svgIcon = subtask.checked
                ? 'assets/img/board/checked_button.svg'
                : 'assets/img/board/check_button.svg';

            subtasksHTML += `
                <div class="check" data-subtask-key="${key}">
                    <img src="${svgIcon}" class="subtask-checkbox-icon" alt="Subtask Status" 
                         onclick="toggleSubtaskStatus('${taskPath}', '${taskId}', '${key}', ${!subtask.checked})">
                    <div class="subtask-text">${subtask.task}</div>
                </div>`;
        }
    }
    return subtasksHTML;
}

/**
 * Generates the HTML template for the dialog.
 * 
 * @param {string} message - The message to display in the dialog.
 * @returns {string} - The generated HTML string.
 */
function createDialogTemplate(message) {
    return `
        <p>${message}</p>
        <div class="dialog-buttons">
            <button class="dialog-button confirm">
                <img src="assets/img/board/check.svg" alt="Yes" class="dialog-icon"/>
                 Yes
            </button>
            <button class="dialog-button cancel">
                <img src="assets/img/board/close.svg" alt="No" class="dialog-icon"/>
                 No
            </button>
        </div>`;
}
