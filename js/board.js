
let currentDraggedTask;
let allTasks;
let assignedArrayEdit = [];
let filteredTasks = [];


function categorizeTasks(tasks) {
    open = tasks.filter(t => t[1] && t[1]['status'] === 'open');
    inProgress = tasks.filter(t => t[1] && t[1]['status'] === 'in progress');
    awaitFeedback = tasks.filter(t => t[1] && t[1]['status'] === 'await feedback');
    done = tasks.filter(t => t[1] && t[1]['status'] === 'done');
}

function startDraggin(id) {
    currentDraggedTask = id;
}


function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(newStatus) {
    allTasks[currentDraggedTask][1]['status'] = newStatus;
    await editData(`tasks/${allTasks[currentDraggedTask][0]}`, { status: newStatus });
    updateTasksHTML(allTasks);
}


function highlight(id) {
    document.getElementById(id).classList.add('board-column-highlight');
}


function removeHighlightLeave(id) {
    document.getElementById(id).classList.remove('board-column-highlight');
}


function removeHighlightEnd(id) {
    document.getElementById(id).classList.remove('board-column-highlight');
}


async function showDialogTask(i) {
    let bigTaskBox = document.getElementById('task-box-big');
    bigTaskBox.classList.remove('edit-mode');
    let currentTask = allTasks.filter(t => t[1]['id'] == i);
    animationDialogTask();
    bigTaskBox.innerHTML = '';
    bigTaskBox.innerHTML += generateBigTaskBox(currentTask);
    getAllMembersBigTask(currentTask);
    setPriorityBigTask(currentTask);
    setTaskCategoryBigTask(currentTask);
    getAllSubtasksBigTask(currentTask);
    getDivHeight(currentTask);
}


function getAllMembersBigTask(currentTask) {
    if (typeof currentTask[0][1]['assigned member'] === "undefined") { document.getElementById('member-headline').innerHTML = '' } else {
        let memberContainer = document.getElementById('container-member-big-task');
        let taskAllMembers = currentTask[0][1]['assigned member'];
        for (let i = 0; i < taskAllMembers.length; i++) {
            const currentTaskMember = taskAllMembers[i];
            memberContainer.innerHTML += generateMemberBigTaskBox(currentTaskMember);
            setColorMemberBigTask(currentTaskMember);
        };
    }
}


function setColorMemberBigTask(currentTaskMember) {
    let colorMember = currentTaskMember['color'];
    let memberContainer = document.getElementById(`member-letter-cirlce${currentTaskMember['id']}`);
    memberContainer.style.backgroundColor = colorMember;
}


function setPriorityBigTask(currentTask) {
    let taskPrio = currentTask[0][1]['prio'];
    if (taskPrio == 'low') {
        document.getElementById(`taskPrioBigBox${currentTask[0][1]['id']}`).src = './assets/img/add_task/prio_low.svg';
    } else {
        if (taskPrio == 'medium') {
            document.getElementById(`taskPrioBigBox${currentTask[0][1]['id']}`).src = './assets/img/add_task/prio_medium.svg';
        } else {
            document.getElementById(`taskPrioBigBox${currentTask[0][1]['id']}`).src = './assets/img/add_task/prio_urgent.svg';
        }
    };
}


function setTaskCategoryBigTask(task) {
    let taskCategory = task[0][1]['category'];
    let taskCategoryContainer = document.getElementById(`task-category-big${task[0][1]['id']}`);
    if (taskCategory == 'User Story') {
        taskCategoryContainer.style.backgroundColor = '#0038FF';
    } else {
        taskCategoryContainer.style.backgroundColor = '#1FD7C1';
    };
}


function getAllSubtasksBigTask(currentTask) {
    let subtasksSection = document.getElementById(`subtasks${currentTask[0][1]['id']}`);
    let subtaskHeadline = document.getElementById(`subtaks-headline${currentTask[0][1]['id']}`);
    let taskAllSubtasks = currentTask[0][1]['subtask'];
    let currentTaskId = currentTask[0][1]['id'];
    if (typeof taskAllSubtasks !== "undefined") {
        subtaskHeadline.innerHTML = generateSubtasksHeadline();
        for (let i = 0; i < taskAllSubtasks.length; i++) {
            const subtask = taskAllSubtasks[i];
            subtasksSection.innerHTML += generateSubtasksSectionBigTask(subtask, i, currentTaskId);
            setSubtaskStatus(subtask, i);
        };
    };
}


function setSubtaskStatus(subtask, i) {

    let subtaskStatus = subtask['isDone'];
    let subtaskClass = document.getElementById(`subtask-checkbox${i}`)
    if (subtaskStatus == true) {
        subtaskClass.classList.add('subtask-checkbox-checked');
    } else {
        subtaskClass.classList.remove('subtask-checkbox-checked');
    };
}


async function checkUncheckBox(i, currentTaskId) {
    let subtaskContainer = document.getElementById(`subtask-checkbox${i}`);
    if (allTasks[currentTaskId][1]['subtask'][i]['isDone'] == false) {
        subtaskContainer.classList.add('subtask-checkbox-checked');
        await editData(`tasks/${allTasks[currentTaskId][0]}/subtask/${i}`, { isDone: true });
        renderSubtask();
    } else {
        if (allTasks[currentTaskId][1]['subtask'][i]['isDone'] == true) {
            subtaskContainer.classList.remove('subtask-checkbox-checked')
            await editData(`tasks/${allTasks[currentTaskId][0]}/subtask/${i}`, { isDone: false });
            renderSubtask();
        }
    }
}


async function renderSubtask() {
    allTasks = Object.entries(await loadData('tasks'));
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        task[1]['id'] = i;
    }
}


async function loadTasks() {
    allTasks = Object.entries(await loadData('tasks'));
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        task[1]['id'] = i;
    }
    categorizeTasks(allTasks);
    updateTasksHTML(allTasks);
}


function updateTasksHTML(tasks) {
    updateTasksByStatus(tasks, 'open', 'openTasks', 'No tasks To do');
    updateTasksByStatus(tasks, 'in progress', 'inProgressTasks', 'No tasks in progress');
    updateTasksByStatus(tasks, 'await feedback', 'awaitFeedbackTasks', 'No tasks await feedback');
    updateTasksByStatus(tasks, 'done', 'doneTasks', 'No tasks done');
    resetHeight();
}


function updateTasksByStatus(tasks, status, elementId, noTaskMessage) {
    let filteredTasks = tasks.filter(t => t[1] && t[1]['status'] === status);
    let taskBoard = document.getElementById(elementId);

    if (taskBoard) {
        taskBoard.innerHTML = '';
        if (filteredTasks.length > 0) {
            for (let i = 0; i < filteredTasks.length; i++) {
                const taskData = filteredTasks[i][1];
                taskBoard.innerHTML += generateSmallTaskBox(taskData);
                getAllMembers(taskData);
                setPriority(taskData);
                setTaskCategory(taskData);
                getAllSubtasks(taskData);
                truncateText(taskData);
            }
        } else {
            taskBoard.innerHTML = generateNoTaskBox(noTaskMessage);
        }
    }
}


function getAllMembers(task) {
    if (typeof task['assigned member'] !== "undefined") {
        for (let j = 0; j < task['assigned member'].length; j++) {
            const member = task['assigned member'][j]['letters'];
            let taskId = task['id'];
            let memberId = taskId + task['assigned member'][j]['name'];
            document.getElementById(`task-all-member${task['id']}`).innerHTML += generateMemberTaskBox(member, memberId);
            setColorMember(task, j, memberId);
        };
        if (task['assigned member'].length > 9) {
            let memberArray = task['assigned member'];
            truncateMember(memberArray, task);
        };
    };
}


function setColorMember(task, j, memberId) {
    let colorMember = task['assigned member'][j]['color'];
    let memberContainer = document.getElementById(memberId);
    memberContainer.style.backgroundColor = colorMember;
}


function setPriority(task) {
    let taskPrio = task['prio'];
    if (taskPrio == 'low') {
        document.getElementById(`taskPrio${task['id']}`).src = './assets/img/add_task/prio_low.svg';
    } else {
        if (taskPrio == 'medium') {
            document.getElementById(`taskPrio${task['id']}`).src = './assets/img/add_task/prio_medium.svg';
        } else {
            document.getElementById(`taskPrio${task['id']}`).src = './assets/img/add_task/prio_urgent.svg';
        }
    };
}

function setTaskCategory(task) {
    let taskCategory = task['category'];
    let taskCategoryContainer = document.getElementById(`task-category${task['id']}`);
    if (taskCategory == 'User Story') {
        taskCategoryContainer.classList.add('user-story');
    } else {
        taskCategoryContainer.classList.add('technical-task');
    };
}


function getAllSubtasks(task) {
    let subtasks = task['subtask'];
    if (typeof subtasks !== "undefined") {
        calcSubtasksProgress(subtasks, task);
    };
}



function calcSubtasksProgress(subtasks, task) {
    let subtasksSection = document.getElementById(`task${task['id']}`);
    allDoneSubtasks = subtasks.filter(t => t['isDone'] == true);
    let numberSubtasks = subtasks.length;
    let numberDoneSubtasks = allDoneSubtasks.length;
    let progress = ((numberDoneSubtasks / numberSubtasks) * 100).toFixed(0);
    subtasksSection.innerHTML += generateSubtasksSection(numberSubtasks, numberDoneSubtasks, progress);
}


function editTask(index, event) {
    let bigTaskBox = document.getElementById('task-box-big');
    bigTaskBox.classList.add('edit-mode');
    bigTaskBox.innerHTML = generateEditTaskBox(index);
    renderContactsInAddTasks();
    /*showSavedTasksData(index);*/
    let taskData = allTasks[index][1];
    addPrioButtonColor(taskData.prio, event);
    addStatusButtonColor(taskData.status, event);
    resetHeight();
    getDivHeight();
}


function showSavedTasksData(index) {
    document.querySelector('.title_tasks').value = `${allTasks[index][1].title}`;
    document.querySelector('.description_tasks').value = `${allTasks[index][1].description}`;
    document.querySelector('.dueDate_edit').innerHTML = generateInputDateHTML(index);
    renderExistingMembersEditTask(index);
    if (typeof allTasks[index][1].subtask !== 'undefined') {
        renderSubtasks(index);
    }
}


async function saveNewDataTasks(index) {
    let newTitle = document.getElementById("title");
    let newDescription = document.getElementById("description");
    let newDueDate = document.getElementById("date");
    let newPrio = selectedPrio;
    let newStatus = selectedStatus;
    await deleteData(`tasks/${allTasks[index][0]["assigned member"]}`);
    for (let i = 0; i < selectUsers.length; i++) {
        let memberArray = { name: selectUsers[i], color: selectUsersColor[i], letters: selectUsersLetters[i], id: i };
        assignedArrayEdit.push(memberArray);
    }
    await editData(`tasks/${allTasks[index][0]}`, { title: newTitle.value, description: newDescription.value, "due date": newDueDate.value, prio: newPrio, status: newStatus, "assigned member": assignedArrayEdit });
    await loadTasks();
    animationDialogTask();
    showDialogTask(index);
    assignedArrayEdit = [];
}


async function editSubtaskEdit(subtaskId, iSubtask, iTask) {
    editSubtask(subtaskId);
    setTimeout(() => {
        let editInput = document.querySelector(`#${subtaskId} .editInput`);
        if (editInput) {
            editInput.addEventListener("blur", async() => {
                let editedSubtask = editInput.value.trim();
                if (editedSubtask !== "") {
                    await updateSubtask(editedSubtask, iSubtask, iTask);
                }
            });
            editInput.addEventListener("keyup", async(event) => {
                if (event.key === 'Enter') {
                    let editedSubtask = editInput.value.trim();
                    if (editedSubtask !== "") {
                        await updateSubtask(editedSubtask, iSubtask, iTask);
                    }
                }
            });
        }
    }, 0);
}


async function updateSubtask(editedSubtask, iSubtask, iTask) {
    let newEditedSubtask = editedSubtask.replace("- ", "");
    allTasks[iTask][1].subtask[iSubtask].description = newEditedSubtask;
    let updatedSubtasks = allTasks[iTask][1].subtask;
    await editData(`tasks/${allTasks[iTask][0]}`, { subtask: updatedSubtasks });
}


async function deleteSubtaskEdit(subtaskId, iSubtask, iTask) {
    let taskData = allTasks[iTask][1];
    taskData.subtask.splice(iSubtask, 1);
    await editData(`tasks/${allTasks[iTask][0]}`, { subtask: taskData.subtask });
    removeSubtask(subtaskId);
    renderSubtasks(iTask);
}


async function addNewSubtaskPush(index) {
    let newTask = document.getElementById("subtask").value;
    if (newTask === "") {
        document.getElementById("textSubtask").classList.add("unset-display");
        return;
    }
    let existingSubtasks = allTasks[index][1].subtask || [];
    let newSubtask = { description: newTask, isDone: false };
    existingSubtasks.push(newSubtask);
    await editData(`tasks/${allTasks[index][0]}`, { subtask: existingSubtasks });
    allTasks[index][1].subtask = existingSubtasks;
    addNewSubtask();
    renderSubtasks(index);
}


function renderExistingMembersEditTask(index) {
    let existingMembersContainer = document.querySelector('#selectedMembers');
    existingMembersContainer.innerHTML = '';
    let existingMembers = allTasks[index][1]['assigned member'];
    selectUsers = [];
    selectUsersColor = [];
    selectUsersLetters = [];
    if (typeof allTasks[index][1]['assigned member'] !== "undefined") {
        for (let i = 0; i < existingMembers.length; i++) {
            const member = existingMembers[i];
            selectUsers.push(member.name);
            selectUsersLetters.push(member.letters);
            selectUsersColor.push(member.color);
            existingMembersContainer.innerHTML += `<div onclick="deleteSelectMember('${member.name}', '${member.color}', '${member.letters}')" id="${member.id}" class="profilbild">${member.letters}</div>`;
            document.getElementById(`${member.id}`).style.backgroundColor = `${member.color}`;
        };
    };
}


function renderSubtasks(index) {
    let subtaskAreaEdit = document.querySelector('#subtaskArea');
    let existingSubTasks = allTasks[index][1].subtask;
    subtaskAreaEdit.innerHTML = '';
    for (let i = 0; i < existingSubTasks.length; i++) {
        const subTask = existingSubTasks[i];
        subtaskAreaEdit.innerHTML += generateEditSubtaskInnerHTML(`subtask_${i}`, subTask.description, i, index);
    }
}


async function deleteContactInTasks(currentIndex, contacts) {
    let contactName = contacts[currentIndex][1]['name'];
    allTasks = Object.entries(await loadData('tasks'));
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i][1]['assigned member'];
        if (typeof task !== 'undefined') {
            for (let j = 0; j < task.length; j++) {
            const member = task[j];
            if (member['name'] == contactName) {
                allTasks[i][1]['assigned member'].splice(j, 1);
                let member = allTasks[i][1]['assigned member'];
                await editData(`tasks/${allTasks[i][0]}`, { "assigned member": member });
                };
            };
        };
    };
}


 function addSearchTask() {
    filteredTasks = [];
    let search = document.getElementById('searchField').value.toLowerCase();
    let deleteButton = document.getElementById('delete-search');
    if (search === '') {
        loadTasks();
        deleteButton.classList.add('d-none');
        return;
    }
    for (let i = 0; i < allTasks.length; i++) {
        let tasks = allTasks[i];
        if (tasks[1]['description'].toLowerCase().includes(search) || tasks[1]['title'].toLowerCase().includes(search)) {
            filteredTasks.push(tasks);
        };
        deleteButton.classList.remove('d-none');
        updateTasksHTML(filteredTasks);
    };
    infoTaskFound(filteredTasks);
}


async function deleteTask(event, index) {
    await deleteData(`tasks/${allTasks[index][0]}`);
    await loadTasks();
    closeDialogTask();
}