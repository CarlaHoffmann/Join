

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
    if (category === 'User Story') {
        return '#0038FF;';
    }
    if (category === 'Technical Task') {
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
                <div class="dateSelect">${task.date}</div>
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
    <!-- Delete Button -->
        <button class="deleteBtn" onclick="deleteTask('${task.id}')">
            <svg width="82" height="24" viewBox="0 0 82 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_71348_10259" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
    <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_71348_10259)">
    <path d="M7.5 21C6.95 21 6.47917 20.8042 6.0875 20.4125C5.69583 20.0208 5.5 19.55 5.5 19V6C5.21667 6 4.97917 5.90417 4.7875 5.7125C4.59583 5.52083 4.5 5.28333 4.5 5C4.5 4.71667 4.59583 4.47917 4.7875 4.2875C4.97917 4.09583 5.21667 4 5.5 4H9.5C9.5 3.71667 9.59583 3.47917 9.7875 3.2875C9.97917 3.09583 10.2167 3 10.5 3H14.5C14.7833 3 15.0208 3.09583 15.2125 3.2875C15.4042 3.47917 15.5 3.71667 15.5 4H19.5C19.7833 4 20.0208 4.09583 20.2125 4.2875C20.4042 4.47917 20.5 4.71667 20.5 5C20.5 5.28333 20.4042 5.52083 20.2125 5.7125C20.0208 5.90417 19.7833 6 19.5 6V19C19.5 19.55 19.3042 20.0208 18.9125 20.4125C18.5208 20.8042 18.05 21 17.5 21H7.5ZM7.5 6V19H17.5V6H7.5ZM9.5 16C9.5 16.2833 9.59583 16.5208 9.7875 16.7125C9.97917 16.9042 10.2167 17 10.5 17C10.7833 17 11.0208 16.9042 11.2125 16.7125C11.4042 16.5208 11.5 16.2833 11.5 16V9C11.5 8.71667 11.4042 8.47917 11.2125 8.2875C11.0208 8.09583 10.7833 8 10.5 8C10.2167 8 9.97917 8.09583 9.7875 8.2875C9.59583 8.47917 9.5 8.71667 9.5 9V16ZM13.5 16C13.5 16.2833 13.5958 16.5208 13.7875 16.7125C13.9792 16.9042 14.2167 17 14.5 17C14.7833 17 15.0208 16.9042 15.2125 16.7125C15.4042 16.5208 15.5 16.2833 15.5 16V9C15.5 8.71667 15.4042 8.47917 15.2125 8.2875C15.0208 8.09583 14.7833 8 14.5 8C14.2167 8 13.9792 8.09583 13.7875 8.2875C13.5958 8.47917 13.5 8.71667 13.5 9V16Z" fill="#2A3647"/>
    </g>
    <path d="M37.5 17.5H33.9091V5.86364H37.6591C38.7879 5.86364 39.7538 6.09659 40.5568 6.5625C41.3598 7.02462 41.9754 7.68939 42.4034 8.55682C42.8314 9.42045 43.0455 10.4545 43.0455 11.6591C43.0455 12.8712 42.8295 13.9148 42.3977 14.7898C41.9659 15.661 41.3371 16.3314 40.5114 16.8011C39.6856 17.267 38.6818 17.5 37.5 17.5ZM35.3182 16.25H37.4091C38.3712 16.25 39.1686 16.0644 39.8011 15.6932C40.4337 15.322 40.9053 14.7936 41.2159 14.108C41.5265 13.4223 41.6818 12.6061 41.6818 11.6591C41.6818 10.7197 41.5284 9.91098 41.2216 9.23295C40.9148 8.55114 40.4564 8.02841 39.8466 7.66477C39.2367 7.29735 38.4773 7.11364 37.5682 7.11364H35.3182V16.25ZM48.8864 17.6818C48.0455 17.6818 47.3201 17.4962 46.7102 17.125C46.1042 16.75 45.6364 16.2273 45.3068 15.5568C44.9811 14.8826 44.8182 14.0985 44.8182 13.2045C44.8182 12.3106 44.9811 11.5227 45.3068 10.8409C45.6364 10.1553 46.0947 9.62121 46.6818 9.23864C47.2727 8.85227 47.9621 8.65909 48.75 8.65909C49.2045 8.65909 49.6534 8.73485 50.0966 8.88636C50.5398 9.03788 50.9432 9.28409 51.3068 9.625C51.6705 9.96212 51.9602 10.4091 52.1761 10.9659C52.392 11.5227 52.5 12.2083 52.5 13.0227V13.5909H45.7727V12.4318H51.1364C51.1364 11.9394 51.0379 11.5 50.8409 11.1136C50.6477 10.7273 50.3712 10.4223 50.0114 10.1989C49.6553 9.97538 49.2348 9.86364 48.75 9.86364C48.2159 9.86364 47.7538 9.99621 47.3636 10.2614C46.9773 10.5227 46.6799 10.8636 46.4716 11.2841C46.2633 11.7045 46.1591 12.1553 46.1591 12.6364V13.4091C46.1591 14.0682 46.2727 14.6269 46.5 15.0852C46.7311 15.5398 47.0511 15.8864 47.4602 16.125C47.8693 16.3598 48.3447 16.4773 48.8864 16.4773C49.2386 16.4773 49.5568 16.428 49.8409 16.3295C50.1288 16.2273 50.3769 16.0758 50.5852 15.875C50.7936 15.6705 50.9545 15.4167 51.0682 15.1136L52.3636 15.4773C52.2273 15.9167 51.9981 16.303 51.6761 16.6364C51.3542 16.9659 50.9564 17.2235 50.483 17.4091C50.0095 17.5909 49.4773 17.6818 48.8864 17.6818ZM55.8807 5.86364V17.5H54.5398V5.86364H55.8807ZM61.9957 17.6818C61.1548 17.6818 60.4295 17.4962 59.8196 17.125C59.2135 16.75 58.7457 16.2273 58.4162 15.5568C58.0904 14.8826 57.9276 14.0985 57.9276 13.2045C57.9276 12.3106 58.0904 11.5227 58.4162 10.8409C58.7457 10.1553 59.2041 9.62121 59.7912 9.23864C60.3821 8.85227 61.0715 8.65909 61.8594 8.65909C62.3139 8.65909 62.7628 8.73485 63.206 8.88636C63.6491 9.03788 64.0526 9.28409 64.4162 9.625C64.7798 9.96212 65.0696 10.4091 65.2855 10.9659C65.5014 11.5227 65.6094 12.2083 65.6094 13.0227V13.5909H58.8821V12.4318H64.2457C64.2457 11.9394 64.1473 11.5 63.9503 11.1136C63.7571 10.7273 63.4806 10.4223 63.1207 10.1989C62.7647 9.97538 62.3442 9.86364 61.8594 9.86364C61.3253 9.86364 60.8632 9.99621 60.473 10.2614C60.0866 10.5227 59.7893 10.8636 59.581 11.2841C59.3726 11.7045 59.2685 12.1553 59.2685 12.6364V13.4091C59.2685 14.0682 59.3821 14.6269 59.6094 15.0852C59.8404 15.5398 60.1605 15.8864 60.5696 16.125C60.9787 16.3598 61.4541 16.4773 61.9957 16.4773C62.348 16.4773 62.6662 16.428 62.9503 16.3295C63.2382 16.2273 63.4863 16.0758 63.6946 15.875C63.9029 15.6705 64.0639 15.4167 64.1776 15.1136L65.473 15.4773C65.3366 15.9167 65.1075 16.303 64.7855 16.6364C64.4635 16.9659 64.0658 17.2235 63.5923 17.4091C63.1188 17.5909 62.5866 17.6818 61.9957 17.6818ZM71.4446 8.77273V9.90909H66.9219V8.77273H71.4446ZM68.2401 6.68182H69.581V15C69.581 15.3788 69.6359 15.6629 69.7457 15.8523C69.8594 16.0379 70.0033 16.1629 70.1776 16.2273C70.3556 16.2879 70.5431 16.3182 70.7401 16.3182C70.8878 16.3182 71.009 16.3106 71.1037 16.2955C71.1984 16.2765 71.2741 16.2614 71.331 16.25L71.6037 17.4545C71.5128 17.4886 71.3859 17.5227 71.223 17.5568C71.0601 17.5947 70.8537 17.6136 70.6037 17.6136C70.2249 17.6136 69.8537 17.5322 69.4901 17.3693C69.1302 17.2064 68.831 16.9583 68.5923 16.625C68.3575 16.2917 68.2401 15.8712 68.2401 15.3636V6.68182ZM77.027 17.6818C76.1861 17.6818 75.4607 17.4962 74.8509 17.125C74.2448 16.75 73.777 16.2273 73.4474 15.5568C73.1217 14.8826 72.9588 14.0985 72.9588 13.2045C72.9588 12.3106 73.1217 11.5227 73.4474 10.8409C73.777 10.1553 74.2353 9.62121 74.8224 9.23864C75.4134 8.85227 76.1027 8.65909 76.8906 8.65909C77.3452 8.65909 77.794 8.73485 78.2372 8.88636C78.6804 9.03788 79.0838 9.28409 79.4474 9.625C79.8111 9.96212 80.1009 10.4091 80.3168 10.9659C80.5327 11.5227 80.6406 12.2083 80.6406 13.0227V13.5909H73.9134V12.4318H79.277C79.277 11.9394 79.1785 11.5 78.9815 11.1136C78.7884 10.7273 78.5118 10.4223 78.152 10.1989C77.7959 9.97538 77.3755 9.86364 76.8906 9.86364C76.3565 9.86364 75.8944 9.99621 75.5043 10.2614C75.1179 10.5227 74.8205 10.8636 74.6122 11.2841C74.4039 11.7045 74.2997 12.1553 74.2997 12.6364V13.4091C74.2997 14.0682 74.4134 14.6269 74.6406 15.0852C74.8717 15.5398 75.1918 15.8864 75.6009 16.125C76.0099 16.3598 76.4853 16.4773 77.027 16.4773C77.3793 16.4773 77.6974 16.428 77.9815 16.3295C78.2694 16.2273 78.5175 16.0758 78.7259 15.875C78.9342 15.6705 79.0952 15.4167 79.2088 15.1136L80.5043 15.4773C80.3679 15.9167 80.1387 16.303 79.8168 16.6364C79.4948 16.9659 79.0971 17.2235 78.6236 17.4091C78.1501 17.5909 77.6179 17.6818 77.027 17.6818Z" fill="#2A3647"/>
    </svg>
    </button>
                
                <div class="vertical-line"></div>
                <button class="editBtn" onclick="openEditTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})">

<svg width="63" height="24" viewBox="0 0 63 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_48008_4079" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
<rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_48008_4079)">
<path d="M5.5 19H6.9L15.525 10.375L14.125 8.975L5.5 17.6V19ZM19.8 8.925L15.55 4.725L16.95 3.325C17.3333 2.94167 17.8042 2.75 18.3625 2.75C18.9208 2.75 19.3917 2.94167 19.775 3.325L21.175 4.725C21.5583 5.10833 21.7583 5.57083 21.775 6.1125C21.7917 6.65417 21.6083 7.11667 21.225 7.5L19.8 8.925ZM18.35 10.4L7.75 21H3.5V16.75L14.1 6.15L18.35 10.4Z" fill="#2A3647"/>
</g>
<path d="M33.9091 17.5V5.86364H40.9318V7.11364H35.3182V11.0455H40.5682V12.2955H35.3182V16.25H41.0227V17.5H33.9091ZM46.5852 17.6818C45.858 17.6818 45.2159 17.4981 44.6591 17.1307C44.1023 16.7595 43.6667 16.2367 43.3523 15.5625C43.0379 14.8845 42.8807 14.0833 42.8807 13.1591C42.8807 12.2424 43.0379 11.447 43.3523 10.7727C43.6667 10.0985 44.1042 9.57765 44.6648 9.21023C45.2254 8.8428 45.8731 8.65909 46.608 8.65909C47.1761 8.65909 47.625 8.75379 47.9545 8.94318C48.2879 9.12879 48.5417 9.34091 48.7159 9.57955C48.8939 9.81439 49.0322 10.0076 49.1307 10.1591H49.2443V5.86364H50.5852V17.5H49.2898V16.1591H49.1307C49.0322 16.3182 48.892 16.5189 48.7102 16.7614C48.5284 17 48.2689 17.214 47.9318 17.4034C47.5947 17.589 47.1458 17.6818 46.5852 17.6818ZM46.767 16.4773C47.3049 16.4773 47.7595 16.3371 48.1307 16.0568C48.5019 15.7727 48.7841 15.3807 48.9773 14.8807C49.1705 14.3769 49.267 13.7955 49.267 13.1364C49.267 12.4848 49.1723 11.9148 48.983 11.4261C48.7936 10.9337 48.5133 10.5511 48.142 10.2784C47.7708 10.0019 47.3125 9.86364 46.767 9.86364C46.1989 9.86364 45.7254 10.0095 45.3466 10.3011C44.9716 10.589 44.6894 10.9811 44.5 11.4773C44.3144 11.9697 44.2216 12.5227 44.2216 13.1364C44.2216 13.7576 44.3163 14.322 44.5057 14.8295C44.6989 15.3333 44.983 15.7348 45.358 16.0341C45.7367 16.3295 46.2064 16.4773 46.767 16.4773ZM53.2273 17.5V8.77273H54.5682V17.5H53.2273ZM53.9091 7.31818C53.6477 7.31818 53.4223 7.22917 53.233 7.05114C53.0473 6.87311 52.9545 6.65909 52.9545 6.40909C52.9545 6.15909 53.0473 5.94508 53.233 5.76705C53.4223 5.58902 53.6477 5.5 53.9091 5.5C54.1705 5.5 54.3939 5.58902 54.5795 5.76705C54.7689 5.94508 54.8636 6.15909 54.8636 6.40909C54.8636 6.65909 54.7689 6.87311 54.5795 7.05114C54.3939 7.22917 54.1705 7.31818 53.9091 7.31818ZM60.8196 8.77273V9.90909H56.2969V8.77273H60.8196ZM57.6151 6.68182H58.956V15C58.956 15.3788 59.0109 15.6629 59.1207 15.8523C59.2344 16.0379 59.3783 16.1629 59.5526 16.2273C59.7306 16.2879 59.9181 16.3182 60.1151 16.3182C60.2628 16.3182 60.384 16.3106 60.4787 16.2955C60.5734 16.2765 60.6491 16.2614 60.706 16.25L60.9787 17.4545C60.8878 17.4886 60.7609 17.5227 60.598 17.5568C60.4351 17.5947 60.2287 17.6136 59.9787 17.6136C59.5999 17.6136 59.2287 17.5322 58.8651 17.3693C58.5052 17.2064 58.206 16.9583 57.9673 16.625C57.7325 16.2917 57.6151 15.8712 57.6151 15.3636V6.68182Z" fill="#2A3647"/>
</svg>
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
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'med';
        case '3': return 'low';
        // default: return 'med';
    }
}

// Funktion zum Öffnen des Edit-Overlays
async function openEditTaskOverlay(task) {
    const overlayContainer = document.getElementById('taskOverlayContainer');
    console.log(task);

    // Initialisieren von selectedContacts mit task.contacts
    selectedContacts = task.contacts;

    // Farben für die Kontakte abrufen
    // const contactColors = await getContactColors([task]);
    // const contactsHTML = task.contacts.map((contact, index) => {
    //     const contactColor = contactColors[0][index]; // Erste Aufgabe und entsprechender Kontakt
    //     const initials = getContactInitials(contact);
    //     return `
    //         <div class="assigned-contact">
    //             <div class="contact-initial" style="background-color: ${contactColor};">${initials}</div>
    //             <span class="contact-name">${contact}</span>
    //         </div>`;
    // }).join('');

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
                                <div class="close" onclick="closeTaskOverlay()"><img src="assets/img/add_task/close.svg" alt="Close" /></div>

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
                                    <input type="text" id="datepicker" class="form-field margin-bottom pad-12-16 date-input" placeholder="dd/mm/yyyy" maxlength="10" required value="${task.date}">
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
                                            <div id="category-selection" class="form-field margin-bottom pad-12-16">'Select task category'</div>
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

        <div class="okBtnContainer">
            <button onclick="initializeValidationEdit(), openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})" class="submit-button">
                OK <img src="assets/img/add_task/check 2.svg" alt="OK Icon" class="button-icon">

            </button>
        </div>
            <div id="task-added-overlay" class="dialog d-none">
                <div id="task-added-confirmation">
                    <div class="confirmation-text">Task added to board</div>
                    <img src="./img/task/board_symbol.svg" alt="">
                </div>
            </div>
        </div>`;

    overlayContainer.classList.remove('d-none');
    categorySelected(task.category);

    // Aktualisieren der ausgewählten Kontakte im Overlay
    updateEditContacts();
    initializeDatePicker();
    initializeEditPriority(task.prio);
    const categorySelection = document.getElementById('category-selection');
    categorySelection.textContent = task.category || 'Select task category';
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

const searchField = document.querySelector('#searchField');
console.log(searchField);