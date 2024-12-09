// Generiert den HTML-Inhalt für einen Button
function getButtonContent(priority, isActive) {
    const activeStatus = isActive ? '_active' : '';
    switch(priority) {
        case '1':
            return `
                <p>Urgent</p>
                <div class="double-arrow-up">
                    <img src="./img/task/prio_high${activeStatus}.svg" alt="">
                </div>
            `;
        case '2':
            return `
                <p>Medium</p>
                <div class="double-line">
                    <img src="./img/task/prio_med${activeStatus}.svg" alt="">
                </div>
            `;
        case '3':
            return `
                <p>Low</p>
                <div class="double-arrow-down">
                    <img src="./img/task/prio_low${activeStatus}.svg" alt="">
                </div>
            `;
        default:
            return '';
    }
}

function openSubtaskTemplate() {
    let subtaskButtons = document.getElementById('subtask-buttons');
    subtaskButtons.innerHTML = `
        <div id="opened-subtask-icons">
            <div class="opened-subtask-icon-box icon-hover" onclick="closeSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./img/task/subtask_close.svg" alt="">
            </div>
            <div><img src="./img/task/vector-3.svg" alt="seperator"></div>
            <div class="opened-subtask-icon-box icon-hover"  onclick="addSubtask()">
                <img class="opened-subtask-img symbol-hover" src="./img/task/subtask_check.svg" alt="">
            </div>
        </div>
    `;
    document.addEventListener('click', closeSubtaskOnOutsideClick);
}

function getAddSubtaskTemplate(i, element) {
    return `
        <div id="subtask${i}">
            <div onclick="editSubtask(${i})" class="subtask-box">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editSubtask(${i})" class="icon-hover" src="./img/task/subtask_add_pen.svg" alt=""></div>
                    <div><img src="./img/task/vector-3.svg" alt=""></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt=""></div>
                </div>
            </div>
        </div>
    `;
}

function editSubtaskTemplate(index, currentText) {
    return `
        <div class="edit-subtask-wrapper">
            <input type="text" class="edit-subtask-input" value="${currentText}">
            <div class="edit-subtask-icons">
                <div><img onclick="deleteSubtask(${index})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt="Delete"></div>
                <div><img src="./img/task/vector-3.svg" alt="Separator"></div>
                <div><img onclick="replaceSubtask(${index})" class="icon-hover"  src="./img/task/subtask_check.svg" alt="Confirm"></div>
            </div>
        </div>
    `;
}

function updateSubtaskDisplayTemplate(i, element) {
    return `
        <div id="subtask${i}">
            <div onclick="editSubtask(${i})" class="subtask-box">
                <div>• ${element}</div>
                <div class="added-subtask-icons">
                    <div><img onclick="editSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_pen.svg" alt="Edit"></div>
                    <div><img src="./img/task/vector-3.svg" alt="Separator"></div>
                    <div><img onclick="deleteSubtask(${i})" class="icon-hover"  src="./img/task/subtask_add_bin.svg" alt="Delete"></div>
                </div>
            </div>
        </div>
    `;
}