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
        console.error("Fehler beim Laden der Tasks:", error);
    }
}

async function loadToDo() {
    try {
        const url = `${base_url}/tasks/toDo.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const toDo = await response.json();
        const toDoArray = processTasks(toDo);
        displayTasks(toDoArray, 'openTasks');
    } catch (error) {
        console.error("Fehler beim Laden der ToDo-Tasks:", error);
    }
}

async function loadInProgress() {
    try {
        const url = `${base_url}/tasks/progress.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const progress = await response.json();
        const progressArray = processTasks(progress);
        displayTasks(progressArray, 'inProgressTasks');
    } catch (error) {
        console.error("Fehler beim Laden der InProgress-Tasks:", error);
    }
}

async function loadAwaitFeedback() {
    try {
        const url = `${base_url}/tasks/feedback.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const feedback = await response.json();
        const feedbackArray = processTasks(feedback);
        displayTasks(feedbackArray, 'awaitFeedbackTasks');
    } catch (error) {
        console.error("Fehler beim Laden der Feedback-Tasks:", error);
    }
}

async function loadDone() {
    try {
        const url = `${base_url}/tasks/done.json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const done = await response.json();
        const doneArray = processTasks(done);
        displayTasks(doneArray, 'doneTasks');
    } catch (error) {
        console.error("Fehler beim Laden der Done-Tasks:", error);
    }
}

function processTasks(tasks) {
    if (!tasks) return [];

    const taskArray = [];

    for (const key in tasks) {
        if (tasks.hasOwnProperty(key)) {
            const task = tasks[key];
            if (!task) continue;

            const taskObject = {
                id: key,
                title: task.title ?? '',
                category: task.category ?? '',
                contacts: task.contacts ? Object.values(task.contacts) : [],
                date: task.date ?? '',
                description: task.description ?? '',
                prio: task.prio ?? 0,
                subtasks: task.subtasks ? Object.values(task.subtasks) : [],
            };
            taskArray.push(taskObject);
        }
    }
    return taskArray;
}

function displayTasks(taskArray, containerId) {
    const tasks = document.getElementById(containerId);
    let taskHTML = '';

    taskArray.forEach(task => {
        const subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
        const contactsHTML = task.contacts.map(contact => `<div class="member" style="background-color: #7f5af0;">${contact}</div>`).join('');
        const prio = getPrio(task.prio);

        taskHTML += `
            <div id="task-${task.id}" class="task-card" draggable="true" ondragstart="drag(event)">
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
    });

    tasks.innerHTML = taskHTML;
}

function getPrio(priority) {
    switch (priority) {
        case '1':
            return 'urgent';
        case '2':
            return 'medium';
        case '3':
            return 'low';
        default:
            return 'medium';
    }
}




