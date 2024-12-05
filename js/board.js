// async function loadTasks() {
//     await loadToDo();
//     await loadInProgress();
// }

// async function loadToDo() {
//   try {
//       const url = `${base_url}/tasks/toDo.json`;
//       const response = await fetch(url);

//       if (!response.ok) {
//           throw new Error(`HTTP-Error: ${response.status}`);
//       }

//       const toDo = await response.json();
//       const toDoArray = [];

//       // Iteriere durch die ToDo-Einträge
//       for (const key in toDo) {
//           if (toDo.hasOwnProperty(key)) {
//               const task = toDo[key];
//               // Erstelle ein neues Objekt mit den relevanten Eigenschaften
//               const taskObject = {
//                   id: key,
//                   title: task.title,
//                   category: task.category,
//                   contacts: Object.values(task.contacts), // Array von Kontakten
//                   date: task.date,
//                   description: task.description,
//                   prio: task.prio,
//                   subtasks: Object.values(task.subtasks), // Array von Subtasks
//               };
//               toDoArray.push(taskObject);
//           }
//       }
//       smallTask(toDoArray);
//       console.log(toDoArray);
//   } catch (error) {
//       console.error("Fehler beim Laden der Tasks:", error);
//   }
// }

// function smallTask(taskArray) {
//   let tasks = document.getElementById('openTasks');
//   let taskHTML = '';

//   // Iteriere durch jedes Task-Objekt im Array
//   taskArray.forEach(task => {
//       let subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
//       let contactsHTML = task.contacts.map(contact => `<div class="member" style="background-color: #7f5af0;">${contact}</div>`).join('');
//       // console.log(task.prio);
//       taskHTML += `
//           <div class="task-card">
//               <div class="task-type">${task.category}</div>
//               <h3 class="task-title">${task.title}</h3>
//               <p class="task-description">${task.description}</p>
//               <div class="progress-section">
//                   <div class="progress">
//                       <div class="progress-bar" style="width: 50%;"></div>
//                   </div>
//                   <p class="subtasks">${subtasksText}</p>
//               </div>
//               <div class="members-section">
//                   <div class="members">
//                       ${contactsHTML}
//                       <div class="member" style="background-color: #ff85a1;">DE</div>
//                       <div class="member" style="background-color: #ffd803;">EF</div>
//                   </div>
//                   <div class="priority">
//                       <img src="./assets/img/add_task/prio_${getPrio(task.prio)}.svg" alt="medium icon">
//                   </div>
//               </div>
//           </div>
//       `;
//   });

//   tasks.innerHTML = taskHTML;
// }

// function getPrio(priority) {
//   switch(priority) {
//       case 1: return 'urgent';
//       case 2: return 'medium';
//       case 3: return 'low';
//       default: return 'medium';
//   }
// }

// async function loadInProgress() {
//   try {
//       const url = `${base_url}/tasks/progress.json`;
//       const response = await fetch(url);

//       if (!response.ok) {
//           throw new Error(`HTTP-Error: ${response.status}`);
//       }

//       const progress = await response.json();
//       const progressArray = [];

//       // Iteriere durch die ToDo-Einträge
//       for (const key in progress) {
//           if (progress.hasOwnProperty(key)) {
//               const task = progress[key];
//               // Erstelle ein neues Objekt mit den relevanten Eigenschaften
//               const taskObject = {
//                   id: key,
//                   title: task.title,
//                   category: task.category,
//                   contacts: Object.values(task.contacts), // Array von Kontakten
//                   date: task.date,
//                   description: task.description,
//                   prio: task.prio,
//                   subtasks: Object.values(task.subtasks), // Array von Subtasks
//               };
//               progressArray.push(taskObject);
//           }
//       }
//       smallTask(progressArray);
//       console.log(progressArray);
//   } catch (error) {
//       console.error("Fehler beim Laden der Tasks:", error);
//   }
// }

// async function loadToDo() {
//   try {
//       const url = `${base_url}/tasks/toDo.json`;
//       const response = await fetch(url);

//       if (!response.ok) {
//           throw new Error(`HTTP-Error: ${response.status}`);
//       }

//       const toDo = await response.json();
//       const toDoArray = processTasks(toDo);
//       displayTasks(toDoArray, 'openTasks');
//       console.log(toDoArray);
//   } catch (error) {
//       console.error("Fehler beim Laden der ToDo-Tasks:", error);
//   }
// }

// async function loadInProgress() {
//   try {
//       const url = `${base_url}/tasks/progress.json`;
//       const response = await fetch(url);

//       if (!response.ok) {
//           throw new Error(`HTTP-Error: ${response.status}`);
//       }

//       const progress = await response.json();
//       const progressArray = processTasks(progress);
//       displayTasks(progressArray, 'inProgressTasks'); // Anpassen des Container-IDs
//       console.log(progressArray);
//   } catch (error) {
//       console.error("Fehler beim Laden der InProgress-Tasks:", error);
//   }
// }

// function processTasks(tasks) {
//   const taskArray = [];

//   for (const key in tasks) {
//       if (tasks.hasOwnProperty(key)) {
//           const task = tasks[key];
//           const taskObject = {
//               id: key,
//               title: task.title,
//               category: task.category,
//               contacts: Object.values(task.contacts),
//               date: task.date,
//               description: task.description,
//               prio: task.prio,
//               subtasks: Object.values(task.subtasks),
//           };
//           taskArray.push(taskObject);
//       }
//   }
//   return taskArray;
// }

// function displayTasks(taskArray, containerId) {
//   let tasks = document.getElementById(containerId);
//   let taskHTML = '';

//   taskArray.forEach(task => {
//       let subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
//       let contactsHTML = task.contacts.map(contact => `<div class="member" style="background-color: #7f5af0;">${contact}</div>`).join('');

//       taskHTML += `
//           <div class="task-card">
//               <div class="task-type">${task.category}</div>
//               <h3 class="task-title">${task.title}</h3>
//               <p class="task-description">${task.description}</p>
//               <div class="progress-section">
//                   <div class="progress">
//                       <div class="progress-bar" style="width: 50%;"></div>
//                   </div>
//                   <p class="subtasks">${subtasksText}</p>
//               </div>
//               <div class="members-section">
//                   <div class="members">
//                       ${contactsHTML}
//                       <div class="member" style="background-color: #ff85a1;">DE</div>
//                       <div class="member" style="background-color: #ffd803;">EF</div>
//                   </div>
//                   <div class="priority">
//                       <img src="./assets/img/add_task/prio_${getPrio(task.prio)}.svg" alt="medium icon">
//                   </div>
//               </div>
//           </div>
//       `;
//   });

//   tasks.innerHTML = taskHTML;
// }

// function getPrio(priority) {
//   switch (priority) {
//       case 1:
//           return 'urgent';
//       case 2:
//           return 'medium';
//       case 3:
//           return 'low';
//       default:
//           return 'medium';
//   }
// }
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
        const taskArray = processTasks(data); // Tasks in ein Array umwandeln
        displayTasks(taskArray, containerId); // Tasks im entsprechenden Container anzeigen
    } catch (error) {
        console.error(`Error loading ${status} tasks:`, error);
    }
}

// Funktion, um die Tasks aus der Datenbank zu verarbeiten
function processTasks(tasks) {
    if (!tasks) return [];
    return Object.keys(tasks).map(key => ({
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



// Dynamisches Task Overlay Edit 
function openTaskOverlay(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    
    // Dynamisches HTML für das Overlay
    overlayContainer.innerHTML = `
        <div class="taskOverlay">
            <div class="taskSelect">
                <div class="taskContainer">${task.category}</div>
                <div class="close" onclick="closeTaskOverlay()">
                    <img src="assets/img/add_task/close.svg" alt="Close" />
                </div>
            </div>
            <div class="headline">${task.title}</div>
            <div>${task.description}</div>
            <div>
                <div class="textColor">Due date:</div>
                <div class="dateSelect">${task.dueDate || "No date set"}</div>
            </div>
            <div>
                <div class="textColor">Priority:</div>
                <div class="dateSelect">${task.prio}</div>
            </div>
            <div>
                <span class="textColor">Assigned To:</span>
                <div class="userContainer">
                    ${task.contacts
                        .map(contact => `
                            <div class="user">
                                <div class="userButton">${contact.initials}</div>
                                <div class="userName">${contact.name}</div>
                            </div>
                        `)
                        .join('')}
                </div>
            </div>
            <div>
                <span>Subtasks:</span>
                <div>
                    ${task.subtasks
                        .map(subtask => `
                            <div>
                                <div class="check"></div>
                                <div>${subtask.title}</div>
                            </div>
                        `)
                        .join('')}
                </div>
            </div>
            <div class="deleteEditBtnContainer">
                <button class="deletBtn" onclick="deleteTask('${task.id}')">
                 <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_75601_14820" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                    <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_75601_14820)">
                    <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z" fill="#2A3647"/>
                    </g>
                    </svg>

                    Delete
                </button>
                <div class="stroke"></div>
                <button class="editBtn" onclick="editTask('${task.id}')">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                        <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_75592_9969)">
                        <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
                        </g>
                    </svg>
                    Edit
                </button>
            </div>
        </div>
    `;

    overlayContainer.classList.remove('d-none'); // Overlay sichtbar machen
}


function closeTaskOverlay() {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    overlayContainer.classList.add('d-none');
    overlayContainer.innerHTML = ''; // Inhalt löschen
}




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
