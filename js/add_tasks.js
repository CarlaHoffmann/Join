let selectUsers = [];
let selectUsersColor = [];
let selectUsersLetters = [];
let selectedPrio = "medium";
let assignedArray = [];
let memberIdCounter = 0;

let subtaskIdCounter = 0;
let subtaskArray = [];
let allTasksJson = [];
let subtaskStatus = localStorage.getItem('subtaskStatus') || '';
let selectedStatus = [];

function dateValidation() {
    document.getElementById("date").setAttribute('min', new Date().toISOString().split('T')[0]);
}

function handleEnterKey(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        addNewSubtask();
    }
}

function standardPrioButton() {
    updatePrioButton("medium", "buttonMedium", "buttonImg2", "backgroundColorOrange");
}

function addPrioButtonColor(prio, event) {
    event.preventDefault();
    const buttons = {
        urgent: ["buttonUrgent", "buttonImg1", "backgroundColorRed"],
        medium: ["buttonMedium", "buttonImg2", "backgroundColorOrange"],
        low: ["buttonLow", "buttonImg3", "backgroundColorGreen"]
    };
    removeClasses(["buttonUrgent", "buttonMedium", "buttonLow", "buttonImg1", "buttonImg2", "buttonImg3"], 
        ["backgroundColorRed", "backgroundColorOrange", "backgroundColorGreen", "fontWeightAndColor", "imgColor"]);
    updatePrioButton(prio, ...buttons[prio]);
}

function updatePrioButton(prio, buttonId, imgId, bgColorClass) {
    document.getElementById(buttonId).classList.add(bgColorClass, "fontWeightAndColor");
    document.getElementById(imgId).classList.add("imgColor");
    selectedPrio = prio;
}

function initAddTasks() {
    renderContactsInAddTasks();
    initJSONaddTasks();
    standardPrioButton();
    localStorage.removeItem('subtaskStatus');
    dateValidation();
    abledButton();
}

function removeClasses(elements, classes) {
    elements.forEach(id => document.getElementById(id)?.classList.remove(...classes));
}

function renderContactsInAddTasks() {
    loadData("contacts").then(data => {
        const contacts = Object.entries(data);
        const assignedTo = document.getElementById("assignedTo");
        assignedTo.innerHTML = generateAssignedToFirst();
        contacts.forEach(([_, contact]) => {
            if (!selectUsers.includes(contact.name)) {
                assignedTo.innerHTML += `<option value="${contact.name}">${contact.name}</option>`;
            }
        });
        assignedTo.onchange = () => handleAssignedToChange(contacts, assignedTo);
    });
}

function handleAssignedToChange(contacts, assignedTo) {
    const selectedName = assignedTo.value;
    const selectedContact = contacts.find(([_, contact]) => contact.name === selectedName)?.[1];
    if (selectedContact) {
        addMember(selectedContact);
    } else {
        console.error(`Contact with name '${selectedName}' not found.`);
    }
}

function addMember({ name, color, letters }) {
    if (selectUsers.includes(name)) {
        toggleMessage("isSelected", false);
        return;
    }
    toggleMessage("isSelected", true);
    selectUsers.push(name);
    selectUsersColor.push(color);
    selectUsersLetters.push(letters);
    renderSelectedMembers();
}

function toggleMessage(elementId, isHidden) {
    const element = document.getElementById(elementId);
    element.classList.toggle("none-display", isHidden);
    element.classList.toggle("unset-display", !isHidden);
}

function renderSelectedMembers() {
    const membersArea = document.getElementById("selectedMembers");
    membersArea.innerHTML = selectUsers.map((name, index) =>
        generatePushedMembers(name, selectUsersColor[index], selectUsersLetters[index])
    ).join('');
}

function saveTaskToJson(title, description, date, prio, category) {
    assignedArray = selectUsers.map((name, index) => ({
        name, color: selectUsersColor[index], letters: selectUsersLetters[index], id: memberIdCounter++
    }));
    subtaskStatus = subtaskStatus || 'open';
    localStorage.setItem('subtaskStatus', subtaskStatus);
    renderNewTask(title, description, date, prio, category);
    postData("tasks", newTask).then(() => {
        disabledButton();
        showDialogAddTask();
        openBoardPage();
    });
}

function renderNewTask(title, description, date, prio, category) {
    newTask = {
        title, description, "due date": date, prio, category,
        "assigned member": assignedArray, subtask: subtaskArray,
        status: subtaskStatus, id: 1
    };
}

function addNewSubtask() {
    const subtaskValue = document.getElementById("subtask").value.trim();
    if (!subtaskValue) {
        toggleMessage("textSubtask", false);
        return;
    }
    toggleMessage("textSubtask", true);
    subtaskArray.push({ description: subtaskValue, isDone: false });
    document.getElementById("subtaskArea").innerHTML += generateSubtaskInnerHTML(
        `subtask_${subtaskIdCounter++}`, subtaskValue
    );
    document.getElementById("subtask").value = "";
}

function validateForm() {
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value.trim();
    const category = document.getElementById("category").value;
    if (!title || !date || category === "Select task category") {
        toggleMessage('warnTextCategory', false);
        return false;
    }
    toggleMessage('warnTextCategory', true);
    saveTaskToJson(title, document.getElementById("description").value, date, selectedPrio, category);
    return false;
}

function clearDialogAddTask() {
    ["title", "description", "date"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("category").innerHTML = generateCategoryAfterClearDialogAddTask();
    document.getElementById("subtaskArea").innerHTML = "";
    document.getElementById("assignedTo").innerHTML = generateAssignedToFirst();
    selectUsers = [];
    selectUsersColor = [];
    selectUsersLetters = [];
    renderContactsInAddTasks();
    standardPrioButton();
}
