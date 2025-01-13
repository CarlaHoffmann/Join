/**
 * Generates the HTML content for a priority button.
 * @param {string} priority - The priority level (1, 2, or 3).
 * @param {boolean} isActive - Whether the button is active.
 * @returns {string} The HTML content for the button.
 */
function getButtonContent(priority, isActive) {
    const activeStatus = isActive ? '_active' : '';
    switch(priority) {
        case '1':
            return `
                <p>Urgent</p>
                <div class="double-arrow-up">
                    <img src="./assets/img/task/prio_high${activeStatus}.svg" alt="">
                </div>
            `;
        case '2':
            return `
                <p>Medium</p>
                <div class="double-line">
                    <img src="./assets/img/task/prio_med${activeStatus}.svg" alt="">
                </div>
            `;
        case '3':
            return `
                <p>Low</p>
                <div class="double-arrow-down">
                    <img src="./assets/img/task/prio_low${activeStatus}.svg" alt="">
                </div>
            `;
        default:
            return '';
    }
}

/**
 * Updates the subtask buttons to show the open state and adds an event listener for outside clicks.
 */
function openSubtaskTemplate() {
    let subtaskButtons = document.getElementById('subtask-buttons');
    subtaskButtons.innerHTML = `
        <div id="opened-subtask-icons">
            <div class="opened-subtask-icon-box icon-hover" onclick="closeSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./assets/img/task/subtask_close.svg" alt="">
            </div>
            <div><img src="./assets/img/task/vector-3.svg" alt="seperator"></div>
            <div class="opened-subtask-icon-box icon-hover"  onclick="addSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./assets/img/task/subtask_check.svg" alt="">
            </div>
        </div>
    `;
    document.addEventListener('click', closeSubtaskOnOutsideClick);
}

/**
 * Generates the HTML template for adding a new subtask.
 * @param {number} i - The index of the subtask.
 * @param {string} element - The text of the subtask.
 * @returns {string} The HTML template for the subtask.
 */
function getAddSubtaskTemplate(i, element) {
    return `
        <div id="subtask${i}">
            <div onclick="editSubtask(${i})" class="subtask-box" value="${element}">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editSubtask(${i})" class="icon-hover" src="./assets/img/task/subtask_add_pen.svg" alt=""></div>
                    <div><img src="./assets/img/task/vector-3.svg" alt=""></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./assets/img/task/subtask_add_bin.svg" alt=""></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML template for editing an existing subtask.
 * @param {number} index - The index of the subtask.
 * @param {string} currentText - The current text of the subtask.
 * @returns {string} The HTML template for editing the subtask.
 */
function editSubtaskTemplate(index, currentText, checked) {
    return `
        <div class="edit-subtask-wrapper">
            <input type="text" class="edit-subtask-input" checked="${checked}" value="${currentText}">
            <div class="edit-subtask-icons">
                <div><img onclick="deleteSubtask(${index})" class="icon-hover"  src="./assets/img/task/subtask_add_bin.svg" alt="Delete"></div>
                <div><img src="./assets/img/task/vector-3.svg" alt="Separator"></div>
                <div><img onclick="replaceSubtask(${index})" class="icon-hover"  src="./assets/img/task/subtask_check.svg" alt="Confirm"></div>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML template for updating the display of a subtask after adding, editing, or deleting.
 * @param {number} i - The index of the subtask.
 * @param {string} element - The text of the subtask.
 * @returns {string} The HTML template for the updated subtask display.
 */
function updateSubtaskDisplayTemplate(i, element) {
    return `
        <div id="subtask${i}">
            <div onclick="editSubtask(${i})" class="subtask-box">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editSubtask(${i})" class="icon-hover"  src="./assets/img/task/subtask_add_pen.svg" alt="Edit"></div>
                    <div><img src="./assets/img/task/vector-3.svg" alt="Separator"></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./assets/img/task/subtask_add_bin.svg" alt="Delete"></div>
                </div>
            </div>
        </div>
    `;
}