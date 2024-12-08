
const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app";

// Aufgaben beim Laden der Seite aus der Datenbank abrufen
async function loadTasks() {
    try {
        await loadTaskData('toDo', 'toDoTasks');
        await loadTaskData('progress', 'progressTasks');
        await loadTaskData('feedback', 'feedbackTasks');
        await loadTaskData('done', 'doneTasks');
        updatePlaceholders(); // Placeholder aktualisieren
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Funktion, um Tasks für eine Spalte aus der Datenbank zu laden
async function loadTaskData(status, containerId) {
    try {
        const url = `${base_url}/tasks/${status}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const data = await response.json();
        const taskArray = processTasks(data, status); // Tasks in ein Array umwandeln
        displayTasks(taskArray, containerId); // Tasks im entsprechenden Container anzeigen
    } catch (error) {
        console.error(`Error loading ${status} tasks:`, error);
    }
}

// Funktion, um die Tasks aus der Datenbank zu verarbeiten
function processTasks(tasks, status) {
    if (!tasks) return [];
    return Object.keys(tasks).map(key => ({
        path: status,
        id: key,
        ...tasks[key],
        contacts: tasks[key].contacts ? Object.values(tasks[key].contacts) : [],
        subtasks: tasks[key].subtasks ? Object.values(tasks[key].subtasks) : [],
    }));
}




function displayTasks(taskArray, containerId) {
    const tasks = document.getElementById(containerId);
    const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));

    // HTML für die Tasks generieren
    tasks.innerHTML = taskArray.map(task => {
        const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
        const contactsHTML = task.contacts.map(contact => `<div class="member">${contact}</div>`).join('');
        const prio = getPrio(task.prio);

        return `
            <div id="task-${task.id}" class="task-card" draggable="true" 
                onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
                ondragstart="drag(event)" ondragend="dragEnd(event)">
                <div class="task-type">${task.category}</div>
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description}</p>
                <div class="progress-section">
                    <div class="progress">
                        <div class="progress-bar" style="width: 50%;"></div>
                    </div>
                    <p class="subtasks">${subtasksText}</p>
                </div>
                <div class="members-section">
                    <div class="members">${contactsHTML}</div>
                    <div class="priority">
                        <img src="./assets/img/add_task/prio_${prio}.svg" alt="${prio} icon">
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Placeholder-Logik
    if (taskArray.length === 0) {
        placeholder.style.display = "block"; // Placeholder anzeigen
    } else {
        placeholder.style.display = "none"; // Placeholder verstecken
    }
}


// Hilfsfunktion, um die Priorität anzuzeigen
function getPrio(priority) {
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'medium';
        case '3': return 'low';
        default: return 'medium';
    }
}

// Drag-and-Drop-Funktionen
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    const task = event.target;
    task.classList.add("dragging"); // Task als "ziehend" markieren
    event.dataTransfer.setData("taskId", task.id);
}

function dragEnd(event) {
    const task = event.target;
    task.classList.remove("dragging"); // Markierung entfernen
}

// Funktion zum Verschieben von Tasks zwischen Spalten
async function drop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    const taskElement = document.getElementById(taskId);

    if (!taskElement) return;

    const oldStatus = taskElement.parentElement.id.replace("Tasks", "");
    const container = document.getElementById(newStatus + "Tasks");
    container.appendChild(taskElement);

    try {
        // Aktualisiere die Firebase-Daten (wenn benötigt)
        updatePlaceholders(); // Placeholder prüfen
    } catch (error) {
        console.error("Error moving task:", error);
    }
}


// Highlight-Funktionen für Spalten
function highlight(columnId) {
    const column = document.getElementById(columnId);
    if (column) {
        column.classList.add("highlight-column");
    }
}

function removeHighlightLeave(columnId) {
    const column = document.getElementById(columnId);
    if (column) {
        column.classList.remove("highlight-column");
    }
}

function removeHighlightEnd(columnId) {
    removeHighlightLeave(columnId);
}




let currentTask = null; // Variable, um die aktuelle Task zu speichern

/**
 * Öffnet das Bearbeitungs-Overlay für eine vorhandene Task.
 * @param {string} taskId - Die ID der zu bearbeitenden Task.
 * @param {string} status - Der Status (Spalte), in der sich die Task befindet.
 */
async function openEditTaskOverlay(taskId, status) {
    try {
        const url = `${base_url}/tasks/${status}/${taskId}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        // Die aktuelle Task-Daten abrufen
        currentTask = await response.json();

        // Overlay mit den Task-Daten befüllen
        document.getElementById("editTaskOverlay").classList.remove("d-none");
        document.getElementById("edit-task-title").value = currentTask.title || "";
        document.getElementById("edit-task-description").value = currentTask.description || "";
        document.getElementById("edit-task-priority").value = currentTask.prio || "2"; // Default "medium"

        document.getElementById("edit-task-save").setAttribute("data-task-id", taskId);
        document.getElementById("edit-task-save").setAttribute("data-status", status);

    } catch (error) {
        console.error("Error loading task:", error);
    }
}

/**
 * Schließt das Bearbeitungs-Overlay.
 */
function closeEditTaskOverlay() {
    document.getElementById("editTaskOverlay").classList.add("d-none");
    currentTask = null;
}

/**
 * Speichert die bearbeiteten Daten und aktualisiert die Task in Firebase.
 */
async function saveEditedTask() {
    const taskId = document.getElementById("edit-task-save").getAttribute("data-task-id");
    const status = document.getElementById("edit-task-save").getAttribute("data-status");

    // Neue Task-Daten aus dem Overlay abrufen
    const updatedTask = {
        ...currentTask,
        title: document.getElementById("edit-task-title").value,
        description: document.getElementById("edit-task-description").value,
        prio: document.getElementById("edit-task-priority").value,
    };

    try {
        const url = `${base_url}/tasks/${status}/${taskId}.json`;
        await fetch(url, {
            method: "PUT",
            body: JSON.stringify(updatedTask),
        });

        // Task im DOM aktualisieren
        loadTasks(); // Aktualisiere das Board
        closeEditTaskOverlay(); // Overlay schließen
    } catch (error) {
        console.error("Error saving edited task:", error);
    }
}

// Event-Listener für das Bearbeitungs-Overlay hinzufügen
document.getElementById("edit-task-cancel").addEventListener("click", closeEditTaskOverlay);
document.getElementById("edit-task-save").addEventListener("click", saveEditedTask);


function openTaskOverlay(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');

    overlayContainer.innerHTML = `
        <div class="taskOverlay">
            <div class="taskSelect">
                <div class="taskContainer">${task.category}</div>
                <div class="close" onclick="closeTaskOverlay()">
                    <img src="assets/img/add_task/close.svg" alt="Close" />
                </div>
            </div>
            <div id="overlayContent">
                <div class="headline">
                    <label>Title:</label>
                    <input id="overlayTitle" type="text" value="${task.title}" class="overlay-input" readonly />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea id="overlayDescription" class="overlay-textarea" readonly>${task.description}</textarea>
                </div>
                <div>
                    <label>Due Date:</label>
                    <input id="overlayDueDate" type="date" value="${task.date || ''}" class="overlay-input" readonly />
                </div>
                <div>
                    <label>Priority:</label>
                    <div class="prio-buttons">
                        <button onclick="setOverlayPriority(1)" class="prio-button ${task.prio === '1' ? 'urgent active-button' : ''}" id="prio1" disabled>Urgent</button>
                        <button onclick="setOverlayPriority(2)" class="prio-button ${task.prio === '2' ? 'med active-button' : ''}" id="prio2" disabled>Medium</button>
                        <button onclick="setOverlayPriority(3)" class="prio-button ${task.prio === '3' ? 'low active-button' : ''}" id="prio3" disabled>Low</button>
                    </div>
                </div>
                <div>
                    <label>Assigned to:</label>
                    <div id="overlayContacts" class="selected-contacts">
                        ${task.contacts.map(contact => `<div class="contact-initial">${contact}</div>`).join('')}
                    </div>
                </div>
                <div>
                    <label>Subtasks:</label>
                    <ul id="overlaySubtasks">
                        ${task.subtasks.map(subtask => `<li>${subtask}</li>`).join('')}
                    </ul>
                    <input id="newSubtaskInput" type="text" placeholder="Add new subtask" class="overlay-input d-none" />
                    <button onclick="addOverlaySubtask()" id="addSubtaskButton" class="d-none">Add</button>
                </div>
                <div class="buttonContainer">
                    <button class="editBtn" id="editTaskButton" onclick="enableEditMode()">Edit</button>
                    <button class="saveBtn d-none" id="saveTaskButton" onclick="saveOverlayChanges('${task.id}', '${task.path}')">OK</button>
                </div>
            </div>
        </div>
    `;

    overlayContainer.classList.remove('d-none');
}


function enableEditMode() {
    // Felder editierbar machen
    document.getElementById('overlayTitle').removeAttribute('readonly');
    document.getElementById('overlayDescription').removeAttribute('readonly');
    document.getElementById('overlayDueDate').removeAttribute('readonly');
    document.querySelectorAll('.prio-button').forEach(button => button.removeAttribute('disabled'));

    // Subtasks editierbar machen
    document.getElementById('newSubtaskInput').classList.remove('d-none');
    document.getElementById('addSubtaskButton').classList.remove('d-none');

    // Buttons aktualisieren
    document.getElementById('editTaskButton').classList.add('d-none');
    document.getElementById('saveTaskButton').classList.remove('d-none');
}



async function saveOverlayChanges(taskId, taskStatus) {
    // Geänderte Daten aus den Feldern abrufen
    const titleElement = document.getElementById('overlayTitle');
    const descriptionElement = document.getElementById('overlayDescription');
    const dueDateElement = document.getElementById('overlayDueDate');
    const prioButton = document.querySelector('.prio-button.active-button');
    const contactsElements = document.querySelectorAll('#overlayContacts .contact-initial');
    const subtasksElements = document.querySelectorAll('#overlaySubtasks li');

    if (!titleElement || !descriptionElement || !dueDateElement || !prioButton || contactsElements.length === 0 || subtasksElements.length === 0) {
        console.error('Ein oder mehrere erforderliche Elemente existieren nicht.');
        return;
    }

    const updatedTask = {
        title: titleElement.value,
        description: descriptionElement.value,
        date: dueDateElement.value,
        prio: prioButton.id.replace('prio', ''),
        contacts: Array.from(contactsElements).map(contact => contact.textContent),
        subtasks: Array.from(subtasksElements).map(subtask => subtask.textContent),
    };

    console.log(updatedTask);

    try {
        const url = `${base_url}/tasks/${taskStatus}/${taskId}.json`;
        console.log(url);

        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedTask),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error: ${response.status} - ${errorMessage}`);
        }

        console.log('Task successfully updated!');
        closeTaskOverlay();
        loadTasks(); // Aktualisiere das Board
    } catch (error) {
        console.error('Error saving task changes:', error);
    }
}




function setOverlayPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => button.classList.remove('active-button'));
    document.getElementById(`prio${priority}`).classList.add('active-button');
    document.getElementById('overlayPriority').value = priority;
}


function addOverlaySubtask() {
    const newSubtask = document.getElementById('newSubtaskInput').value.trim();
    if (newSubtask) {
        const subtasksList = document.getElementById('overlaySubtasks');
        subtasksList.innerHTML += `<li>${newSubtask}</li>`;
        document.getElementById('newSubtaskInput').value = '';
    }
}




function closeTaskOverlay() {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    overlayContainer.classList.add('d-none');
    overlayContainer.innerHTML = ''; // Inhalt löschen
}



//  Task Overlay Delete 
async function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        try {
            // Identifiziere die Spalte (toDo, progress, feedback, done) anhand der Task-ID
            const taskElement = document.getElementById(`task-${taskId}`);
            const parentColumnId = taskElement.parentElement.id.replace("Tasks", "");

            // Lösche die Task aus Firebase
            const url = `${base_url}/tasks/${parentColumnId}/${taskId}.json`;
            await fetch(url, { method: 'DELETE' });

            // Entferne die Task aus dem DOM
            taskElement.remove();

            // Überprüfe, ob der Placeholder angezeigt werden soll
            updatePlaceholders();

            // Schließe das Overlay
            closeTaskOverlay();

            console.log(`Task ${taskId} deleted successfully`);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }
}





//  Task Placeholder  
function updatePlaceholders() {
    const columns = ["toDo", "progress", "feedback", "done"];
    columns.forEach(column => {
        const tasksContainer = document.getElementById(column + "Tasks");
        const placeholder = document.getElementById(column + "Placeholder");
        console.log(`Checking ${column}: ${tasksContainer.childElementCount} tasks`);
        if (tasksContainer.childElementCount === 0) {
            placeholder.style.display = "block";
            console.log(`Showing placeholder for ${column}`);
        } else {
            placeholder.style.display = "none";
            console.log(`Hiding placeholder for ${column}`);
        }
    });
}


function addSearchTask() {
    const searchInput = document.getElementById("searchField").value.toLowerCase();
    const allTasks = document.querySelectorAll(".task-card");
    const noSearchResult = document.getElementById("no-search-result");

    let hasResults = false;

    allTasks.forEach(task => {
        const taskTitle = task.querySelector(".task-title").textContent.toLowerCase();
        const taskDescription = task.querySelector(".task-description").textContent.toLowerCase();
        const taskCategory = task.querySelector(".task-type").textContent.toLowerCase();

        if (taskTitle.includes(searchInput) || taskDescription.includes(searchInput) || taskCategory.includes(searchInput)) {
            task.style.display = "block"; // Zeige den Task
            hasResults = true;
        } else {
            task.style.display = "none"; // Verstecke den Task
        }
    });
}

// Suchfeld zurücksetzen
function deleteSearch() {
    const searchField = document.getElementById("searchField");
    searchField.value = ""; // Eingabe leeren
    addSearchTask(); // Alle Tasks wieder sichtbar machen
}
