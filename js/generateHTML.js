// Generates HTML for a small task box.
function generateSmallTaskBox(task) {
  return /* HTML */ `
    <div id="task-box-small" class="task-box" onclick="showDialogTask(${task["id"]})" draggable="true" ondragstart="startDraggin(${task["id"]})">
        <div id="task${task["id"]}">
            <p id="task-category${task["id"]}" class="task-type">${task["category"]}</p>
            <p class="task-headline">${task["title"]}</p>
            <p id="task-description${task["id"]}" class="task-description">${task["description"]}</p>
        </div>
        <div class="member-prio-section">
            <div id="task-all-member${task["id"]}" class="task-all-member"></div>
            <img id="taskPrio${task["id"]}" src="assets/img/add_task/prio_low.svg">
        </div>
    </div>`;
}

// Generates HTML for a detailed task box (expanded view).
function generateBigTaskBox(task) {
  return /* HTML */ `
    <div class="d-flex-center-space-btw">
        <p id="task-category-big${task[0][1]["id"]}" class="task-type">${task[0][1]["category"]}</p>
        <div class="close-icon" onclick="closeDialogTask()">
            <img src="./assets/img/add_task/close.svg" />
        </div>
    </div>
    <h2>${task[0][1]["title"]}</h2>
    <p class="task-description-big">${task[0][1]["description"]}</p>
    <div>
        <div class="d-flex">
            <p class="width-30">Due date:</p>
            <p>${convertDate(task[0][1]["due date"])}</p>
        </div>
        <div class="d-flex">
            <p class="width-30">Priority:</p>
            <p>${task[0][1]["prio"]}</p>
            <img id="taskPrioBigBox${task[0][1]["id"]}" class="prio-icon" src="assets/img/add_task/prio_low.svg" />
        </div>
        <div>
            <div id="member-headline" class="margin-top-16px">Assigned To:</div>
            <div id="container-member-big-task" class="container-member-big-task"></div>
        </div>
        <div id="subtaks-headline${task[0][1]["id"]}"></div>
        <div id="subtasks${task[0][1]["id"]}" class="container-subtasks"></div>
        <div class="container-delete-edit">
            <div class="delete" onclick="deleteTask(event, ${task[0][1]["id"]})">
                <img class="contact_delete_icon img_width16" src="/img/contact/delete.svg" alt="delete icon" />
                <p>Delete</p>
            </div>
            <div class="border-left">
                <div class="edit" onclick="editTask(${task[0][1]["id"]}, event)">
                    <img class="contact_edit_icon img_width16" src="img/contact/edit.svg" alt="edit icon" />
                    <p>Edit</p>
                </div>
            </div>
        </div>
    </div>`;
}

// Generates HTML for the headline of subtasks.
function generateSubtasksHeadline() {
  return /* HTML */ `<p class="margin-top-16px">Subtasks</p>`;
}

// Generates HTML for a single subtask in a detailed view.
function generateSubtasksSectionBigTask(subtask, i, taskId) {
  return /* HTML */ `
    <div class="subtasks">
        <div id="subtask-checkbox${i}" class="subtask-checkbox" onclick="checkUncheckBox(${i},${taskId})"></div>
        <p>${subtask["description"]}</p>
    </div>`;
}

// Generates HTML for the progress bar and subtask count.
function generateSubtasksSection(allSubtasks, doneSubtasks, progress) {
  return /* HTML */ `
    <div class="progress-section">
        <div class="progress">
            <div class="progress-bar" style="width: ${progress}%;"></div>
        </div>
        <p class="amount-subtask">${doneSubtasks}/${allSubtasks} Subtasks</p>
    </div>`;
}

// Generates HTML for a member associated with a task.
function generateMemberTaskBox(member, memberId) {
  return /* HTML */ `<div id="${memberId}" class="member">${member}</div>`;
}

// Generates HTML for displaying additional member count.
function generateFurtherMemberNumber(furtherMember) {
  return /* HTML */ `<div class="further-member">+${furtherMember}</div>`;
}

// Generates HTML when no tasks are available.
function generateNoTaskBox(sentence) {
  return /* HTML */ `
    <div class="no-task-div">
        <p>${sentence}</p>
    </div>`;
}

// Generates HTML for a member in a detailed task box.
function generateMemberBigTaskBox(member) {
  return /* HTML */ `
    <div class="container-letters-name">
        <div id="member-letter-cirlce${member["id"]}" class="member-big-task">${member["letters"]}</div>
        <p>${member["name"]}</p>
    </div>`;
}
