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

async function loadTasks() {
  try {
      await loadToDo();
      await loadInProgress();
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
      console.log(toDoArray);
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
      console.log(progressArray);
  } catch (error) {
      console.error("Fehler beim Laden der InProgress-Tasks:", error);
  }
}

function processTasks(tasks) {
  if (!tasks) return []; // Return an empty array if tasks is null or undefined

  const taskArray = [];

  for (const key in tasks) {
      if (tasks.hasOwnProperty(key)) {
          const task = tasks[key];
          if (!task) continue; // Skip if task is null or undefined

          const taskObject = {
              id: key,
              title: task.title ?? '', // Use nullish coalescing operator for default values
              category: task.category ?? '',
              contacts: task.contacts ? Object.values(task.contacts) : [], // Check if contacts is not null before using Object.values
              date: task.date ?? '',
              description: task.description ?? '',
              prio: task.prio ?? 0,
              subtasks: task.subtasks ? Object.values(task.subtasks) : [], // Check if subtasks is not null before using Object.values
          };
          taskArray.push(taskObject);
      }
  }
  return taskArray;
}

function displayTasks(taskArray, containerId) {
  let tasks = document.getElementById(containerId);
  let taskHTML = '';

  taskArray.forEach(task => {
      let subtasksText = `${task.subtasks.length} von ${task.subtasks.length} Subtasks`;
      let contactsHTML = task.contacts.map(contact => `<div class="member" style="background-color: #7f5af0;">${contact}</div>`).join('');
      let prio = getPrio(task.prio);
      console.log(prio);
      taskHTML += `
          <div class="task-card">
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
                  <div class="members">
                      ${contactsHTML}
                      <div class="member" style="background-color: #ff85a1;">DE</div>
                      <div class="member" style="background-color: #ffd803;">EF</div>
                  </div>
                  <div class="priority">
                      <img src="./assets/img/add_task/prio_${prio}.svg" alt="medium icon">
                  </div>
              </div>
          </div>
      `;
  });

  tasks.innerHTML = taskHTML;
}

function getPrio(priority) {
  console.log(priority);
  switch (priority) {
      case '1':
          return 'urgent';
      case '2':
          return 'medium';
      case '3':
          return 'low';
      // default:
      //     return 'medium';
  }
}