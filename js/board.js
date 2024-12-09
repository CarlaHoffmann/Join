

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




// function displayTasks(taskArray, containerId) {
//     const tasks = document.getElementById(containerId);
//     const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));

//     // HTML für die Tasks generieren
//     tasks.innerHTML = taskArray.map(task => {
//         const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
//         const contactsHTML = task.contacts.map(contact => `<div class="member">${contact}</div>`).join('');
//         const prio = getPrio(task.prio);
        
//         return `
//             <div id="task-${task.id}" class="task-card" draggable="true" 
//                 onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
//                 ondragstart="drag(event)" ondragend="dragEnd(event)">
//                 <div class="task-type">${task.category}</div>
//                 <h3 class="task-title">${task.title}</h3>
//                 <p class="task-description">${task.description}</p>
//                 <div class="progress-section">
//                     <div class="progress">
//                         <div class="progress-bar" style="width: 50%;"></div>
//                     </div>
//                     <p class="subtasks">${subtasksText}</p>
//                 </div>
//                 <div class="members-section">
//                     <div class="members" style="background-color: ${getContactColor(task.contacts)}">${contactsHTML}</div>
//                     <div class="priority">
//                         <img src="./assets/img/add_task/prio_${prio}.svg" alt="${prio} icon">
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');

//     // Placeholder-Logik
//     if (taskArray.length === 0) {
//         placeholder.style.display = "block"; // Placeholder anzeigen
//     } else {
//         placeholder.style.display = "none"; // Placeholder verstecken
//     }
// }
// async function displayTasks(taskArray, containerId) {
//     const tasks = document.getElementById(containerId);
//     const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));

//     // Farben für die Kontakte abrufen
//     const contactColors = await getContactColors(taskArray);
//     console.log(taskArray);

//     // HTML für die Tasks generieren
//     tasks.innerHTML = taskArray.map((task, index) => {
//         const contactColor = contactColors[index];
//         const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
//         const contactsHTML = task.contacts.map(contact => `<div class="member" style="background-color: ${contactColor}">${contact}</div>`).join('');
//         const prio = getPrio(task.prio);

//         console.log(contactColor);

//         return `
//             <div id="task-${task.id}" class="task-card" draggable="true" 
//                 onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
//                 ondragstart="drag(event)" ondragend="dragEnd(event)">
//                 <div class="task-type">${task.category}</div>
//                 <h3 class="task-title">${task.title}</h3>
//                 <p class="task-description">${task.description}</p>
//                 <div class="progress-section">
//                     <div class="progress">
//                         <div class="progress-bar" style="width: 50%;"></div>
//                     </div>
//                     <p class="subtasks">${subtasksText}</p>
//                 </div>
//                 <div class="members-section">
//                     <div class="members">${contactsHTML}</div>
//                     <div class="priority">
//                         <img src="./assets/img/add_task/prio_${prio}.svg" alt="${prio} icon">
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');

//     // Placeholder-Logik
//     if (taskArray.length === 0) {
//         placeholder.style.display = "block"; // Placeholder anzeigen
//     } else {
//         placeholder.style.display = "none"; // Placeholder verstecken
//     }
// }
// async function displayTasks(taskArray, containerId) {
//     const tasks = document.getElementById(containerId);
//     const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));

//     // Farben für die Kontakte abrufen
//     const contactColors = await getContactColors(taskArray);
//     const contactInitials = await getContactInitials(task.contact);

//     // HTML für die Tasks generieren
//     tasks.innerHTML = taskArray.map((task, taskIndex) => {
//         const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
//         const contactsHTML = task.contacts.map((contact, contactIndex) => {
//             const contactColor = contactColors[taskIndex][contactIndex];
//             return `<div class="member" style="background-color: ${contactColor}">${contact}</div>`;
//         }).join('');
//         const prio = getPrio(task.prio);

//         return `
//             <div id="task-${task.id}" class="task-card" draggable="true" 
//                 onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
//                 ondragstart="drag(event)" ondragend="dragEnd(event)">
//                 <div class="task-type">${task.category}</div>
//                 <h3 class="task-title">${task.title}</h3>
//                 <p class="task-description">${task.description}</p>
//                 <div class="progress-section">
//                     <div class="progress">
//                         <div class="progress-bar" style="width: 50%;"></div>
//                     </div>
//                     <p class="subtasks">${subtasksText}</p>
//                 </div>
//                 <div class="members-section">
//                     <div class="members">${contactsHTML}</div>
//                     <div class="priority">
//                         <img src="./assets/img/add_task/prio_${prio}.svg" alt="${prio} icon">
//                     </div>
//                 </div>
//             </div>
//         `;
//     }).join('');

//     // Placeholder-Logik
//     if (taskArray.length === 0) {
//         placeholder.style.display = "block"; // Placeholder anzeigen
//     } else {
//         placeholder.style.display = "none"; // Placeholder verstecken
//     }
// }
async function displayTasks(taskArray, containerId) {
    const tasks = document.getElementById(containerId);
    const placeholder = document.getElementById(containerId.replace("Tasks", "Placeholder"));

    // Farben für die Kontakte abrufen
    const contactColors = await getContactColors(taskArray);

    // HTML für die Tasks generieren
    tasks.innerHTML = taskArray.map((task, taskIndex) => {
        const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
        const contactsHTML = task.contacts.map((contact, contactIndex) => {
            const contactColor = contactColors[taskIndex][contactIndex];
            const initials = getContactInitials(contact);
            return `<div class="member" style="background-color: ${contactColor}">${initials}</div>`;
        }).join('');
        const prio = getPrio(task.prio);

        return `
            <div id="task-${task.id}" class="task-card" draggable="true" 
                onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})"
                ondragstart="drag(event)" ondragend="dragEnd(event)">
                <div class="task-type" style="background-color: ${getCategoryColor(task.category)}">${task.category}</div>
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

// async function getContactColor(tasks) {
//     try {
//         const response = await fetch(`${task_base_url}/users.json`);
//         const users = await response.json();
        
//         for (let userId in users) {
//             if (users[userId].name === contactName) {
//                 const colorResponse = await fetch(`${task_base_url}/users/${userId}/color.json`);
//                 return await colorResponse.json();
//             }
//         }
//         return '#000000'; // Standardfarbe, falls keine gefunden wird
//     } catch (error) {
//         console.error("Fehler beim Abrufen der Kontaktfarbe:", error);
//         return '#000000'; // Standardfarbe im Fehlerfall
//     }
// }
async function getContactColors(tasks) {
    const contactColors = [];
    for (const task of tasks) {
        const taskContactColors = await Promise.all(task.contacts.map(async contact => {
            try {
                const response = await fetch(`${task_base_url}/users.json`);
                const users = await response.json();
                
                for (let userId in users) {
                    if (users[userId].name === contact) {
                        const colorResponse = await fetch(`${task_base_url}/users/${userId}/color.json`);
                        return await colorResponse.json();
                    }
                }
                return '#000000'; // Standardfarbe, falls keine gefunden wird
            } catch (error) {
                console.error("Fehler beim Abrufen der Kontaktfarbe:", error);
                return '#000000'; // Standardfarbe im Fehlerfall
            }
        }));
        // contactColors.push(taskContactColors.join(', ')); // oder eine andere Art, die Farben zu kombinieren
        contactColors.push(taskContactColors);
    }
    return contactColors;
}

// async function getContactInitials(contact) {
//     let initials = contact.split(' ').map(word => word[0]).join('');
//     return initials;
// }
function getContactInitials(contact) {
    let initials = contact.split(' ').map(word => word[0]).join('').toUpperCase();
    return initials;
}

function getCategoryColor(category) {
    if(category === 'User Story') {
        return '#0038FF;';
    }
    if(category === 'Technical Task') {
        return '#1FD7C1;';
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
        // Task-Daten aus Firebase abrufen
        const taskKey = taskId.replace('task-', '');
        const taskUrl = `${base_url}/tasks/${oldStatus}/${taskKey}.json`;
        const response = await fetch(taskUrl);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const taskData = await response.json();

        // Task aus dem alten Status entfernen
        await fetch(taskUrl, { method: 'DELETE' });

        // Task unter dem neuen Status mit derselben Task-ID hinzufügen
        const newTaskUrl = `${base_url}/tasks/${newStatus}/${taskKey}.json`;
        const putResponse = await fetch(newTaskUrl, {
            method: 'PUT',
            body: JSON.stringify(taskData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!putResponse.ok) {
            throw new Error(`HTTP-Error: ${putResponse.status}`);
        }

        // Task-ID aktualisieren (falls erforderlich)
        taskElement.id = `task-${taskKey}`;

        updatePlaceholders(); // Placeholder prüfen
    } catch (error) {
        console.error("Fehler beim Verschieben des Tasks:", error);
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


async function openTaskOverlay(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    console.log(task);

    // Farben für die Kontakte abrufen
    const contactColors = await getContactColors([task]);
    const contactsHTML = task.contacts.map((contact, index) => {
        const contactColor = contactColors[0][index]; // Erste Aufgabe und entsprechender Kontakt
        const initials = getContactInitials(contact);
        return `
            <div class="assigned-contact">
                <div class="contact-initial" style="background-color: ${contactColor};">${initials}</div>
                <span class="contact-name">${contact}</span>
            </div>`;
    }).join('');

    // Subtasks mit Checkbox-Status
    const subtasksHTML = Object.keys(task.subtasks).map(key => {
        const subtask = task.subtasks[key];
        return `
            <div class="check">
                <input type="checkbox" ${subtask.checked ? 'checked' : ''} disabled>
                <div>${subtask.task}</div>
            </div>`;
    }).join('');

    overlayContainer.innerHTML = `
        <div class="taskOverlay">
            <div class="taskSelect">
                <div class="taskContainer">${task.category}</div>
                <div class="close" onclick="closeTaskOverlay()"><img src="assets/img/add_task/close.svg" alt="Close" /></div>
            </div>
            <div class="headline">${task.title}</div>
            <div>${task.description}</div>
            <div>
                <div class="textColor">Due date:</div>
                <div class="dateSelect">${getDate(task.date)}</div>
            </div>
            <div>
                <div class="textColor">Priority:</div>
                <div class="dateSelect">${getPrio(task.prio)}</div>
            </div>
            <div>
                <span class="textColor">Assigned To:</span>
                <div class="userContainer">${contactsHTML}</div>
            </div>
            <div>
                <span>Subtasks:</span>
                <div>
                    ${subtasksHTML}
                </div>
            </div>
            <div class="deleteEditBtnContainer">
                <button class="deletBtn" onclick="deleteTask('${task.id}')">
                    Delete
                </button>
                <div class="stroke"></div>
                <button class="editBtn" onclick="openEditTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})">
                    Edit
                </button>
            </div>
        </div>`;
        
    overlayContainer.classList.remove('d-none');
}

// Fügen Sie dies nach der Erstellung des HTML-Inhalts hinzu
document.querySelectorAll('.check input[type="checkbox"]').forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
        const taskId = task.id;
        const subtaskId = Object.keys(task.subtasks)[index];
        const isChecked = checkbox.checked;

        // Beispiel für die Verwendung von Firebase Realtime Database
        const db = firebase.database();
        db.ref(`toDo/${taskId}/subtasks/${subtaskId}/checked`).set(isChecked);
    });
});

function getPriorityClass(priority) {
    console.log('prio');
    switch(priority) {
        case '1': return 'urgent';
        case '2': return 'med';
        case '3': return 'low';
        // default: return 'med';
    }
}

// function openEditTaskOverlay(task) {
//     const overlayContainer = document.getElementById('taskOverlayContainer');
//     console.log(task);

//     overlayContainer.innerHTML = `
//         <div class="taskOverlay">
//             <div class="scroll-container fill-in-part-edit">
//                 <div class="add-task-edit-form">
//                     <div id="add-task-first" class="width-440-edit">
//                         <div class="labled-box">
//                             <label class="form-label">
//                                 <div>Title<span class="red-asterisk">*</span></div>
//                                 <div id="titel-wrapper">
//                                     <input type="text" id="title" class="form-field margin-bottom title-edit" placeholder="Enter a title" minlength="3" required value="${task.title}">
//                                     <div id="title-error" class="error-message d-none">This field is required.</div>
//                                     <div id="title-minlength-error" class="error-message d-none">Please enter at least 3 characters.</div>
//                                 </div>
//                             </label>
//                         </div>

//                         <div class="labled-box">
//                             <label class="form-label">
//                                 Description
//                                 <textarea name="description" id="description" class="form-field margin-bottom description" placeholder="Enter a description">${task.description}</textarea>
//                             </label>
//                         </div>


//                         <div class="labled-box">
//                             <label class="form-label">
//                                 Assigned to
//                                 <div id="contact-selection" class="contact-selection">
//                                     <div onclick="openAssigned()" id="select-field" class="selection-field form-field pad-12-16">
//                                         <p>Select contacts to assign</p><img class="symbol-hover icon-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
//                                     </div>
//                                     <div onclick="closeAssigned()" id="contact-drop-down" class="select-items" style="display: none;">
//                                         <div id="contact-dropped-down" class="selection-field form-field pad-12-16 blue-border">
//                                             <p>Select contacts to assign</p><img class="symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
//                                         </div>
//                                         <div id="contacts-to-select"></div>
//                                     </div>
//                                 </div>
//                             </label>
//                             <div id="selected-contacts" class="selected-contacts"></div>
//                         </div>
//                     </div>

//                     <div class="vertical-divider hide-mobile"></div>

//                     <div id="add-task-second" class="width-440-edit">
//                         <div class="labled-box">
//                             <label class="form-label">
//                                 <div>Due date<span class="red-asterisk">*</span></div>
//                                 <div class="date-input-wrapper">
//                                     <input type="text" id="datepicker" class="form-field margin-bottom pad-12-16 date-input" placeholder="dd/mm/yyyy" maxlength="10" required>
//                                     <span class="calendar-icon">
//                                         <img src="./img/task/event.svg" alt="Calendar" class="calendar-icon">
//                                     </span>
//                                     <div id="due-date-error" class="error-message d-none">This field is required.</div>
//                                 </div>
                                
//                             </label>                    
//                         </div>
                        

//                         <div class="labled-box">
//                             <div class="button-box">
//                                 <div  class="form-label">Prio</div>
//                                 <div class="prio-buttons">
//                                     <button onclick="priority(1, event)" class="prio-button hover-button" id="prio1">
//                                         <p>Urgent</p>
//                                         <div class="double-arrow-up">
//                                             <img src="./img/task/prio_high.svg" alt="high">
//                                         </div>
//                                     </button>
//                                     <button onclick="priority(2, event)" class="prio-button hover-button" id="prio2">
//                                         <p>Medium</p>
//                                         <div class="double-line">
//                                             <img src="./img/task/prio_med.svg" alt="medium">
//                                         </div>
//                                     </button>
//                                     <button onclick="priority(3, event)" class="prio-button hover-button" id="prio3">
//                                         <p>Low</p>
//                                         <div class="double-arrow-down">
//                                             <img src="./img/task/prio_low.svg" alt="low">
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div class="labled-box">
//                             <div class="form-label">
//                                 <div>Category<span class="red-asterisk">*</span></div>
//                                 <div id="select-wrapper" class="select-wrapper">
//                                     <div  id="category">
//                                         <div onclick="showCategory()" class="select-field">
//                                             <div id="category-selection" class="form-field margin-bottom pad-12-16">Select task category</div>
//                                             <img class="dropdown-icon symbol-hover icon-hover" src="./img/task/arrow_drop_downaa.svg" alt="">
//                                         </div>
//                                     </div>
//                                     <div id="error-message" class="error-message d-none">This field is required.</div>

//                                     <div id="opened-category" class="d-none">
//                                         <div onclick="showCategory()" class="select-field">
//                                             <div class="form-field pad-12-16 blue-border">Select task category</div>
//                                             <img id="dropdown-icon2" class="dropdown-icon symbol-hover dropdown-icon-mirrored" src="./img/task/arrow_drop_downaa.svg" alt="">
//                                         </div>
//                                         <div class="selection-drop-down">
//                                             <div onclick="categorySelected('Technical Task')" class="drop-down-field">Technical Task</div>
//                                             <div onclick="categorySelected('User Story')" class="drop-down-field">User Story</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div class="labled-box">
//                             <label class="form-label">
//                                 Subtasks
//                                 <div onclick="openSubtaskTemplate()" id="subtask-input-wrapper">
//                                     <div id="subtask">
//                                         <input onclick="openSubtaskTemplate()" id="subtaskInput" type="text" class="form-field pad-12-16" placeholder="Add new subtask">
//                                         <div id="subtask-buttons">
//                                             <img class="subtask-img symbol-hover icon-hover" src="./img/task/subtask.svg" alt="add subtask">
//                                         </div>
//                                     </div>
//                                 </div>
//                             </label>
//                             <div>
//                                 <div id="subtasks">
//                                 </div>
//                             </div>
//                             <span class="font-16 hide-desktop"><span class="red-asterisk">*</span>This field is required</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <button onclick="openTaskOverlay()">OK</button>
//         </div>
//     `;
// }
// Funktion zum Öffnen des Edit-Overlays
let taskContacts = task.contacts;

async function openEditTaskOverlay(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    console.log(task);

    // Initialisieren von selectedContacts mit task.contacts
    // taskContacts = task.contacts;

    // Farben für die Kontakte abrufen
    const contactColors = await getContactColors([task]);
    const contactsHTML = task.contacts.map((contact, index) => {
        const contactColor = contactColors[0][index]; // Erste Aufgabe und entsprechender Kontakt
        const initials = getContactInitials(contact);
        return `
            <div class="assigned-contact">
                <div class="contact-initial" style="background-color: ${contactColor};">${initials}</div>
                <span class="contact-name">${contact}</span>
            </div>`;
    }).join('');

    // Subtasks aus dem task-Objekt laden
    let subtasks = [];
    Object.keys(task.subtasks).forEach(key => {
        subtasks.push({
            task: task.subtasks[key].task,
            checked: task.subtasks[key].checked
        });
    });

    // Subtasks-HTML generieren
    const subtasksHTML = subtasks.map((subtask, index) => {
        return getAddSubtaskTemplate(index, subtask.task);
    }).join('');

    overlayContainer.innerHTML = `
        <div class="taskOverlay">
            <div class="scroll-container fill-in-part-edit">
                <div class="add-task-edit-form">
                    <div id="add-task-first" class="width-440-edit">
                        <div class="labled-box">
                            <label class="form-label">
                                <div>Title<span class="red-asterisk">*</span></div>
                                <div id="titel-wrapper">
                                    <input type="text" id="title" class="form-field margin-bottom title-edit" placeholder="Enter a title" minlength="3" required value="${task.title}">
                                    <div id="title-error" class="error-message d-none">This field is required.</div>
                                    <div id="title-minlength-error" class="error-message d-none">Please enter at least 3 characters.</div>
                                </div>
                            </label>
                        </div>

                        <div class="labled-box">
                            <label class="form-label">
                                Description
                                <textarea name="description" id="description" class="form-field margin-bottom description" placeholder="Enter a description">${task.description}</textarea>
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

                    <div id="add-task-second" class="width-440-edit">
                        <div class="labled-box">
                            <label class="form-label">
                                <div>Due date<span class="red-asterisk">*</span></div>
                                <div class="date-input-wrapper">
                                    <input type="text" id="datepicker" class="form-field margin-bottom pad-12-16 date-input" placeholder="dd/mm/yyyy" maxlength="10" required value="${getDate(task.date)}">
                                    <span class="calendar-icon">
                                        <img src="./img/task/event.svg" alt="Calendar" class="calendar-icon">
                                    </span>
                                    <div id="due-date-error" class="error-message d-none">This field is required.</div>
                                </div>
                            </label>                    
                        </div>

                        <div class="labled-box">
                            <div class="button-box">
                                <div  class="form-label">Prio</div>
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
                                    <div  id="category">
                                        <div onclick="showCategory()" class="select-field">
                                            <div id="category-selection" class="form-field margin-bottom pad-12-16">${task.category || 'Select task category'}</div>
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
                                <div onclick="openSubtaskTemplate()" id="subtask-input-wrapper">
                                    <div id="subtask">
                                        <input onclick="openSubtaskTemplate()" id="subtaskInput" type="text" class="form-field pad-12-16" placeholder="Add new subtask">
                                        <div id="subtask-buttons">
                                            <img class="subtask-img symbol-hover icon-hover" src="./img/task/subtask.svg" alt="add subtask">
                                        </div>
                                    </div>
                                </div>
                            </label>
                            <div>
                                <div id="subtasks">
                                    ${subtasksHTML}
                                </div>
                            </div>
                            <span class="font-16 hide-desktop"><span class="red-asterisk">*</span>This field is required</span>
                        </div>

                        <!-- Weitere Felder und Logik hierhin -->
                    </div>
                </div>
            </div>

            <div class="deleteEditBtnContainer">
                <button onclick="openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})">OK</button>
            </div>
        </div>`;
        
    overlayContainer.classList.remove('d-none');

    // Aktualisieren der ausgewählten Kontakte im Overlay
    updateEditContacts();
    initializeDatePicker();
    initializeEditPriority(task.prio);
    const categorySelection = document.getElementById('category-selection');
    categorySelection.textContent = task.category || 'Select task category';
}

function getDate(date){
    // Zerlege das Datum in seine Bestandteile
    const parts = date.split('-');
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];

    // Formatiere das Datum als dd/mm/yyyy
    return `${day}/${month}/${year}`;
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



// async function saveOverlayChanges(taskId, category) {
//     // Geänderte Daten aus den Feldern abrufen
//     const updatedTask = {
//         title: document.getElementById('overlayTitle').value,
//         description: document.getElementById('overlayDescription').value,
//         date: document.getElementById('overlayDueDate').value,
//         prio: document.querySelector('.prio-button.active-button').id.replace('prio', ''),
//         contacts: Array.from(document.querySelectorAll('#overlayContacts .contact-initial')).map(contact => contact.textContent),
//         subtasks: Array.from(document.querySelectorAll('#overlaySubtasks li')).map(subtask => subtask.textContent),
//     };

//     try {
//         const url = `${base_url}/tasks/${category}/${taskId}.json`;
//         const response = await fetch(url, {
//             method: 'PUT',
//             body: JSON.stringify(updatedTask),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`);
//         }

//         console.log('Task successfully updated!');
//         closeTaskOverlay();
//         loadTasks(); // Aktualisiere das Board
//     } catch (error) {
//         console.error('Error saving task changes:', error);
//     }
// }
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
