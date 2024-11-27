function addTask() {
    let container = document.getElementById('task-overlay');
    container.innerHTML = `
        <div id="board-add-task-overlay">
            <!-- Close button -->
            <img src="assets/img/add_task/close.svg" alt="Close" class="close-button" onclick="closeOverlay()" />

            <div id="overlay-content">
                <div class="form-box">
                    <form onsubmit="return validateForm()" id="add-task" novalidate>
                        <div class="upper-form">
                            <h1 class="headline">Add Task</h1>
                            <div class="scroll-container fill-in-part">
                                <div class="add-task-form">
                                    <div id="add-task-first" class="width-440">
                                        <div class="labled-box">
                                            <label class="form-label">
                                                <div>Title<span class="red-asterisk">*</span></div>
                                                <div id="titel-wrapper">
                                                    <input type="text" id="title" class="form-field margin-bottom title" placeholder="Enter a title" minlength="3" required>
                                                    <div id="title-error" class="error-message d-none">This field is required.</div>
                                                    <div id="title-minlength-error" class="error-message d-none">Please enter at least 3 characters.</div>
                                                </div>
                                            </label>
                                        </div>
                                        <div class="labled-box">
                                            <label class="form-label">
                                                Description
                                                <textarea name="description" id="description" class="form-field margin-bottom description" placeholder="Enter a description"></textarea>
                                            </label>
                                        </div>
                                        <div class="labled-box">
                                            <label class="form-label">
                                                Assigned to
                                                <div id="contact-selection" class="contact-selection">
                                                    <div onclick="openAssigned()" id="select-field" class="selection-field form-field pad-12-16">
                                                        <p>Select contacts to assign</p><img class="symbol-hover icon-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
                                                    </div>
                                                    <div onclick="closeAssigned()" id="contact-drop-down" class="select-items" style="display: none;">
                                                        <div id="contact-dropped-down" class="selection-field form-field pad-12-16 blue-border">
                                                            <p>Select contacts to assign</p><img class="symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
                                                        </div>
                                                        <div id="contacts-to-select"></div>
                                                    </div>
                                                </div>
                                            </label>
                                            <div id="selected-contacts" class="selected-contacts"></div>
                                        </div>
                                    </div>
                                    <div class="vertical-divider hide-mobile"></div>
                                    <div id="add-task-second" class="width-440">
                                        <div class="labled-box">
                                            <label class="form-label">
                                                <div>Due date<span class="red-asterisk">*</span></div>
                                                <div class="date-input-wrapper">
                                                    <input type="text" id="datepicker" class="form-field margin-bottom pad-12-16 date-input" placeholder="dd/mm/yyyy" maxlength="10" required>
                                                    <span class="calendar-icon">
                                                        <img src="./img/task/event.svg" alt="Calendar" class="calendar-icon">
                                                    </span>
                                                    <div id="due-date-error" class="error-message d-none">This field is required.</div>
                                                </div>
                                            </label>                    
                                        </div>
                                        <div class="labled-box">
                                            <div class="button-box">
                                                Prio
                                                <div class="prio-buttons">
                                                    <button onclick="priority(1, event)" class="prio-button hover-button" id="prio1">
                                                        <p>Urgent</p>
                                                        <div class="double-arrow-up">
                                                            <img src="./img/task/prio_high.svg" alt="high">
                                                        </div>
                                                    </button>
                                                    <button onclick="priority(2, event)" class="prio-button hover-button" id="prio2">
                                                        <p>Medium</p>
                                                        <div class="double-line">
                                                            <img src="./img/task/prio_med.svg" alt="medium">
                                                        </div>
                                                    </button>
                                                    <button onclick="priority(3, event)" class="prio-button hover-button" id="prio3">
                                                        <p>Low</p>
                                                        <div class="double-arrow-down">
                                                            <img src="./img/task/prio_low.svg" alt="low">
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="labled-box">
                                            <div class="form-label">
                                                <div>Category<span class="red-asterisk">*</span></div>
                                                <div id="select-wrapper" class="select-wrapper">
                                                    <div id="category">
                                                        <div onclick="showCategory()" class="select-field">
                                                            <div id="category-selection" class="form-field margin-bottom pad-12-16">Select task category</div>
                                                            <img class="dropdown-icon symbol-hover icon-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
                                                        </div>
                                                    </div>
                                                    <div id="error-message" class="error-message d-none">This field is required.</div>
                                                    <div id="opened-category" class="d-none">
                                                        <div onclick="showCategory()" class="select-field">
                                                            <div class="form-field pad-12-16 blue-border">Select task category</div>
                                                            <img id="dropdown-icon2" class="dropdown-icon symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
                                                        </div>
                                                        <div class="selection-drop-down">
                                                            <div onclick="categorySelected('Technical Task')" class="drop-down-field">Technical Task</div>
                                                            <div onclick="categorySelected('User Story')" class="drop-down-field">User Story</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="labled-box">
                                            <label class="form-label">
                                                Subtasks
                                                <div onclick="openSubtask()" id="subtask-input-wrapper">
                                                    <div id="subtask">
                                                        <input onclick="openSubtask()" id="subtaskInput" type="text" class="form-field pad-12-16" placeholder="Add new subtask">
                                                        <div id="subtask-buttons">
                                                            <img class="subtask-img symbol-hover icon-hover" src="./img/task/subtask.svg" alt="add subtask">
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                            <div>
                                                <div id="subtasks"></div>
                                            </div>
                                            <span class="font-16 hide-desktop"><span class="red-asterisk">*</span>This field is required</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="add-task-bottom">
                            <span class="font-16 hide-mobile"><span class="red-asterisk">*</span>This field is required</span>
                            <div class="bottom-buttons width-440">
                                <button onclick="clearForm()" type="reset" class="clear-button hover-button">Clear 
                                    <img class="icon-normal" src="./img/task/iconoir_cancel.svg" alt="">
                                    <img class="icon-hover" src="./img/task/iconoir_cancel_hover.svg" alt="">
                                </button>
                                <button class="submit-button hover-button">Create Task <img src="./img/task/check.svg" alt=""></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Function to close the overlay
function closeOverlay() {
    const overlay = document.getElementById('task-overlay');
    overlay.innerHTML = ''; // Clear the overlay content
}





// let selectUsers = [];
// let selectUsersColor = [];
// let selectUsersLetters = [];
// let selectedPrio = "medium";
// let assignedArray = [];
// let memberIdCounter = 0;

// let subtaskIdCounter = 0;
// let subtaskArray = [];
// let allTasksJson = [];
// let subtaskStatus = localStorage.getItem('subtaskStatus') || '';
// let selectedStatus = [];

// function dateValidation() {
//     document.getElementById("date").setAttribute('min', new Date().toISOString().split('T')[0]);
// }

// function handleEnterKey(event) {
//     if (event.keyCode === 13) {
//         event.preventDefault();
//         addNewSubtask();
//     }
// }

// function standardPrioButton() {
//     updatePrioButton("medium", "buttonMedium", "buttonImg2", "backgroundColorOrange");
// }

// function addPrioButtonColor(prio, event) {
//     event.preventDefault();
//     const buttons = {
//         urgent: ["buttonUrgent", "buttonImg1", "backgroundColorRed"],
//         medium: ["buttonMedium", "buttonImg2", "backgroundColorOrange"],
//         low: ["buttonLow", "buttonImg3", "backgroundColorGreen"]
//     };
//     removeClasses(["buttonUrgent", "buttonMedium", "buttonLow", "buttonImg1", "buttonImg2", "buttonImg3"], 
//         ["backgroundColorRed", "backgroundColorOrange", "backgroundColorGreen", "fontWeightAndColor", "imgColor"]);
//     updatePrioButton(prio, ...buttons[prio]);
// }

// function updatePrioButton(prio, buttonId, imgId, bgColorClass) {
//     document.getElementById(buttonId).classList.add(bgColorClass, "fontWeightAndColor");
//     document.getElementById(imgId).classList.add("imgColor");
//     selectedPrio = prio;
// }

// /*
// function initAddTasks() {
//     renderContactsInAddTasks();
//     initJSONaddTasks();
//     standardPrioButton();
//     localStorage.removeItem('subtaskStatus');
//     dateValidation();
//     abledButton();
// }
// */

// function removeClasses(elements, classes) {
//     elements.forEach(id => document.getElementById(id)?.classList.remove(...classes));
// }

// function renderContactsInAddTasks() {
//     loadData("contacts").then(data => {
//         const contacts = Object.entries(data);
//         const assignedTo = document.getElementById("assignedTo");
//         assignedTo.innerHTML = generateAssignedToFirst();
//         contacts.forEach(([_, contact]) => {
//             if (!selectUsers.includes(contact.name)) {
//                 assignedTo.innerHTML += `<option value="${contact.name}">${contact.name}</option>`;
//             }
//         });
//         assignedTo.onchange = () => handleAssignedToChange(contacts, assignedTo);
//     });
// }

// function handleAssignedToChange(contacts, assignedTo) {
//     const selectedName = assignedTo.value;
//     const selectedContact = contacts.find(([_, contact]) => contact.name === selectedName)?.[1];
//     if (selectedContact) {
//         addMember(selectedContact);
//     } else {
//         console.error(`Contact with name '${selectedName}' not found.`);
//     }
// }

// function addMember({ name, color, letters }) {
//     if (selectUsers.includes(name)) {
//         toggleMessage("isSelected", false);
//         return;
//     }
//     toggleMessage("isSelected", true);
//     selectUsers.push(name);
//     selectUsersColor.push(color);
//     selectUsersLetters.push(letters);
//     renderSelectedMembers();
// }

// function toggleMessage(elementId, isHidden) {
//     const element = document.getElementById(elementId);
//     element.classList.toggle("none-display", isHidden);
//     element.classList.toggle("unset-display", !isHidden);
// }

// function renderSelectedMembers() {
//     const membersArea = document.getElementById("selectedMembers");
//     membersArea.innerHTML = selectUsers.map((name, index) =>
//         generatePushedMembers(name, selectUsersColor[index], selectUsersLetters[index])
//     ).join('');
// }

// function saveTaskToJson(title, description, date, prio, category) {
//     assignedArray = selectUsers.map((name, index) => ({
//         name, color: selectUsersColor[index], letters: selectUsersLetters[index], id: memberIdCounter++
//     }));
//     subtaskStatus = subtaskStatus || 'open';
//     localStorage.setItem('subtaskStatus', subtaskStatus);
//     renderNewTask(title, description, date, prio, category);
//     postData("tasks", newTask).then(() => {
//         disabledButton();
//         showDialogAddTask();
//         openBoardPage();
//     });
// }

// function renderNewTask(title, description, date, prio, category) {
//     newTask = {
//         title, description, "due date": date, prio, category,
//         "assigned member": assignedArray, subtask: subtaskArray,
//         status: subtaskStatus, id: 1
//     };
// }

// function addNewSubtask() {
//     const subtaskValue = document.getElementById("subtask").value.trim();
//     if (!subtaskValue) {
//         toggleMessage("textSubtask", false);
//         return;
//     }
//     toggleMessage("textSubtask", true);
//     subtaskArray.push({ description: subtaskValue, isDone: false });
//     document.getElementById("subtaskArea").innerHTML += generateSubtaskInnerHTML(
//         `subtask_${subtaskIdCounter++}`, subtaskValue
//     );
//     document.getElementById("subtask").value = "";
// }

// function validateForm() {
//     const title = document.getElementById("title").value.trim();
//     const date = document.getElementById("date").value.trim();
//     const category = document.getElementById("category").value;
//     if (!title || !date || category === "Select task category") {
//         toggleMessage('warnTextCategory', false);
//         return false;
//     }
//     toggleMessage('warnTextCategory', true);
//     saveTaskToJson(title, document.getElementById("description").value, date, selectedPrio, category);
//     return false;
// }

// function clearDialogAddTask() {
//     ["title", "description", "date"].forEach(id => document.getElementById(id).value = "");
//     document.getElementById("category").innerHTML = generateCategoryAfterClearDialogAddTask();
//     document.getElementById("subtaskArea").innerHTML = "";
//     document.getElementById("assignedTo").innerHTML = generateAssignedToFirst();
//     selectUsers = [];
//     selectUsersColor = [];
//     selectUsersLetters = [];
//     renderContactsInAddTasks();
//     standardPrioButton();
// }
