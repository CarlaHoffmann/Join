// Konvertiert ein Datum von "YYYY-MM-DD" in "DD/MM/YYYY" Format
function convertDate(date) {
    let splittedDate = date.split("-");
    let newDate = [splittedDate[2], splittedDate[1], splittedDate[0]];
    return newDate.join("/");
}

// Passt die Höhe der Task-Box an die verfügbare Höhe im Viewport an
function getDivHeight() {
    let bigTaskBox = document.querySelector('.task-box-big');
    let viewportWithoutNavi = window.innerHeight - 83;
    let height = bigTaskBox.offsetHeight;
    let gapHeight = (viewportWithoutNavi - height);
    changeTaskBoxHeight(gapHeight, height);
}

// Ändert die CSS-Höhe der Task-Box je nach verfügbarem Platz
function changeTaskBoxHeight(gapHeight, height) {
    let r = document.querySelector(':root');
    let newHeight;
    if (gapHeight < -1) {
        newHeight = 'calc(100% - 80px - 83px)';
    } else {
        newHeight = height;
    }
    r.style.setProperty('--height', newHeight);
}

// Setzt die Höhe der Task-Box auf "fit-content" zurück
function resetHeight() {
    document.querySelector(':root').style.setProperty('--height', 'fit-content');
}

// Schließt den Dialog für detaillierte Tasks
function closeDialogTask() {
    document.querySelector('.background-big-task').classList.add('d-none');
    document.querySelector('.task-box-big').classList.remove('show-task-box-big');
    loadTasks();
}

// Öffnet oder schließt den Dialog für detaillierte Tasks mit Animation
function animationDialogTask() {
    document.querySelector('.background-big-task').classList.toggle('d-none');
    setTimeout(function() {
        document.querySelector('.task-box-big').classList.toggle('show-task-box-big');
    }, 100)
}

// Holt die JSON-Daten der Tasks
async function getTasksJson() {
    let response = await fetch('./js/addTasks.json');
    tasks = await response.json();
    return tasks;
}

// Schneidet die Mitgliederliste auf maximal 7 Mitglieder für die Anzeige
function truncateMember(memberArray, task) {
    let memberContainer = document.getElementById(`task-all-member${task['id']}`);
    memberContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        let member = memberArray[i]['letters'];
        let taskId = task['id'];
        let memberId = taskId + task['assigned member'][i]['name'];
        memberContainer.innerHTML += generateMemberTaskBox(member, memberId);
        setColorMember(task, i, memberId);
    };
    let furtherMember = memberArray.length - 7;
    memberContainer.innerHTML += generateFurtherMemberNumber(furtherMember);
}

// Kürzt den Beschreibungstext einer Task auf 50 Zeichen
function truncateText(task) {
    let description = document.getElementById(`task-description${task['id']}`).innerHTML;
    let truncated = description.substring(0, 50) + "...";
    document.getElementById(`task-description${task['id']}`).innerHTML = truncated;
}

// Fügt Farbe zu den Status-Buttons basierend auf dem Status hinzu
function addStatusButtonColor(status, event) {
    event.preventDefault();
    let buttonToDo = document.getElementById("buttonToDo");
    let buttonProgress = document.getElementById("buttonProgress");
    let buttonFeedback = document.getElementById("buttonFeedback");
    let buttonDone= document.getElementById("buttonDone");
    removeClassesStatus(buttonToDo, buttonProgress, buttonFeedback, buttonDone);
    if (status === "open") {
      selectedStatusColor(buttonToDo, "backgroundColorBlue", "open");
    } else if (status === "in progress") {
      selectedStatusColor(buttonProgress, "backgroundColorBlue", "in progress");
    } else if (status === "await feedback") {
      selectedStatusColor(buttonFeedback, "backgroundColorBlue", "await feedback");
    } else if (status === "done") {
    selectedStatusColor(buttonDone, "backgroundColorBlue", "done");
    }
}

// Fügt einen neuen Subtask mit der Enter-Taste hinzu
function handleEnterKeyPushNewTask(event, index) {
    if (event.keyCode === 13) {
        event.preventDefault(); 
        addNewSubtaskPush(index);
    }
}

// Zeigt oder versteckt die Nachricht "Keine Aufgaben gefunden" basierend auf der Suchergebnisanzahl
function infoTaskFound() {
    let inputSearch = document.getElementById("no-search-result");
    if (filteredTasks.length == 0) {
        inputSearch.classList.remove('d-none');
    } else {
        inputSearch.classList.add('d-none');
    };
}

// Löscht das Suchfeld und die zugehörigen Filter
function deleteSearch() {
    let inputSearch = document.getElementById("no-search-result");
    let deleteButton = document.getElementById('delete-search');
    document.getElementById('searchField').value = '';
    deleteButton.classList.add('d-none');
    inputSearch.classList.add('d-none');
    loadTasks();
}
