// const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

// async function loadTasks() {
//     let response = await fetch(base_url + "/toDo" + ".json");
//     let responseToJson = await response.json();
//     console.log(responseToJson);
// }
// async function loadTasks() {
//     try {
//         const url = `${base_url}/toDo.json`; // Bessere URL-Konstruktion
//         const response = await fetch(url);
        
//         if (!response.ok) {
//             throw new Error(`HTTP-Error: ${response.status}`);
//         }
        
//         const toDo = await response.json();
//         const toDoArray = Object.entries(toDo).map(([title, category]) => ({ title: title, category: category }));
//         console.log(toDoArray);
//     } catch (error) {
//         console.error("Fehler beim Laden der Tasks:", error);
//     }
// }
async function loadTasks() {
    await loadToDo();
}

// async function loadToDo() {
//     try {
//         const url = `${base_url}/tasks/toDo.json`; // Bessere URL-Konstruktion
//         const response = await fetch(url);
        
//         // if (!response.ok) {
//         //     throw new Error(`HTTP-Error: ${response.status}`);
//         // }
        
//         const toDo = await response.json();
//         const toDoArray = Object.entries(toDo).map(([key, value]) => ({
//             key,
//             title: value.title,
//             category: value.category
//         }));
//         console.log(toDoArray);
//     } catch (error) {
//         console.error("Fehler beim Laden der Tasks:", error);
//     }
// }
async function loadToDo() {
    try {
      const url = `${base_url}/tasks/toDo.json`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP-Error: ${response.status}`);
      }
  
      const toDo = await response.json();
      const toDoArray = [];
  
      // Iteriere durch die ToDo-Einträge
      for (const key in toDo) {
        if (toDo.hasOwnProperty(key)) {
          const task = toDo[key];
          // Erstelle ein neues Objekt mit den relevanten Eigenschaften
          const taskObject = {
            id: key,
            title: task.title,
            category: task.category,
            contacts: Object.values(task.contacts), // Array von Kontakten
            date: task.date,
            description: task.description,
            prio: task.prio,
            subtasks: Object.values(task.subtasks), // Array von Subtasks
          };
          toDoArray.push(taskObject);
        }
      }
  
      console.log(toDoArray);
    } catch (error) {
      console.error("Fehler beim Laden der Tasks:", error);
    }
  }
//   async function loadToDo() {
//     try {
//       const url = `${base_url}/tasks/toDo.json`;
//       const response = await fetch(url);
  
//       if (!response.ok) {
//         throw new Error(`HTTP-Error: ${response.status}`);
//       }
  
//       const toDoData = await response.json();
//       const toDoArray = [];
  
//       // Iteriere durch die ToDo-Einträge
//       Object.keys(toDoData).forEach((key, index) => {
//         const task = toDoData[key];
//         // Erstelle ein neues Objekt mit den relevanten Eigenschaften
//         const taskObject = {
//           index: index,
//           title: task.title,
//           category: task.category,
//           contacts: Object.values(task.contacts), // Array von Kontakten
//           date: task.date,
//           description: task.description,
//           prio: task.prio,
//           subtasks: Object.values(task.subtasks) // Array von Subtasks
//         };
//         toDoArray.push(taskObject);
//       });
  
//       console.log(toDoArray);
//     } catch (error) {
//       console.error("Fehler beim Laden der Tasks:", error);
//     }
//   }
//   async function loadToDo() {
//     try {
//       const url = `${base_url}/tasks/toDo.json`;
//       const response = await fetch(url);
  
//       if (!response.ok) {
//         throw new Error(`HTTP-Error: ${response.status}`);
//       }
  
//       const toDoData = await response.json();
  
//       // Überprüfe, ob toDoData ein Objekt ist
//       if (typeof toDoData !== 'object' || toDoData === null) {
//         console.error("Fehler: toDoData ist nicht ein Objekt oder leer.");
//         return;
//       }
  
//       const toDoArray = [];
  
//       // Iteriere durch die ToDo-Einträge
//       Object.keys(toDoData).forEach((key, index) => {
//         const task = toDoData[key];
//         // Erstelle ein neues Objekt mit den relevanten Eigenschaften
//         const taskObject = {
//           index: index,
//           title: task.title,
//           category: task.category,
//           contacts: Object.values(task.contacts), // Array von Kontakten
//           date: task.date,
//           description: task.description,
//           prio: task.prio,
//           subtasks: Object.values(task.subtasks) // Array von Subtasks
//         };
//         toDoArray.push(taskObject);
//       });
  
//       console.log(toDoArray);
//     } catch (error) {
//       console.error("Fehler beim Laden der Tasks:", error);
//     }
//   }