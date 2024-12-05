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

async function loadTasks() {
    try {
        await loadToDo();
        await loadInProgress();
        await loadAwaitFeedback();
        await loadDone();
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

async function loadToDo() {
    await loadTaskData('toDo', 'toDoTasks');
}

async function loadInProgress() {
    await loadTaskData('progress', 'progressTasks');
}

async function loadAwaitFeedback() {
    await loadTaskData('feedback', 'feedbackTasks');
}

async function loadDone() {
    await loadTaskData('done', 'doneTasks');
}

async function loadTaskData(status, containerId) {
    try {
        const url = `${base_url}/tasks/${status}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const data = await response.json();
        const taskArray = processTasks(data);
        displayTasks(taskArray, containerId);
    } catch (error) {
        console.error(`Error loading ${status} tasks:`, error);
    }
}

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
    tasks.innerHTML = taskArray.map(task => {
        const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
        const contactsHTML = task.contacts.map(contact => `<div class="member">${contact}</div>`).join('');
        const prio = getPrio(task.prio);

        return `
            <div id="task-${task.id}" class="task-card" draggable="true" 
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
}

function getPrio(priority) {
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'medium';
        case '3': return 'low';
        default: return 'medium';
    }
}


// Drag-and-Drop Functions
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("taskId", event.target.id);
}

async function drop(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    const taskElement = document.getElementById(taskId);

    if (!taskElement) return;

    const container = document.getElementById(newStatus + "Tasks");
    container.appendChild(taskElement);

    const taskKey = taskId.replace("task-", "");
    try {
        const oldStatus = taskElement.parentElement.id.replace("Tasks", "");
        const taskData = await (await fetch(`${base_url}/tasks/${oldStatus}/${taskKey}.json`)).json();

        await fetch(`${base_url}/tasks/${newStatus}/${taskKey}.json`, {
            method: "PUT",
            body: JSON.stringify(taskData),
        });

        await fetch(`${base_url}/tasks/${oldStatus}/${taskKey}.json`, { method: "DELETE" });

        console.log(`Task ${taskKey} moved from ${oldStatus} to ${newStatus}`);
    } catch (error) {
        console.error("Error moving task:", error);
    }
}

// Highlight Functions
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


function drag(event) {
    const task = event.target;
    task.classList.add("dragging"); // Neigung aktivieren
    event.dataTransfer.setData("taskId", task.id);
}

function dragEnd(event) {
    const task = event.target;
    task.classList.remove("dragging"); // Neigung entfernen
}
