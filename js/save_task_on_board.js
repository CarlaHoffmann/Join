async function saveEditedTask(task) {
    try {
        const taskId = task.id;
        const taskStatus = task.path;
        
        
        // task.subtasks = currentSubtasks;
        let editedTask = {
            id: taskId,
            path: taskStatus,
            title: takeTitle(),
            description: takeDescription(),
            contacts: takeContacts(),
            date: takeDate(),
            prio: takePrio(),
            category: takeCatergory(),
            subtasks: takeSubtask(),
        }

        // Änderungen speichern
        await saveOverlayChanges(taskId, taskStatus, editedTask);
        
        console.log(editedTask);
        // Overlay direkt mit aktuellen Daten aktualisieren
        openTaskOverlay(editedTask); 
        // console.log('Overlay erfolgreich aktualisiert.');
    } catch (error) {
        // console.error('Fehler beim Validieren und Aktualisieren der Task:', error);
    }
}

//new
async function saveOverlayChanges(taskId, taskStatus, editedTask) {
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    const dueDateElement = document.getElementById('datepicker');
    const prioButton = document.querySelector('.prio-button.active-button');
    const categoryElement = document.getElementById('category-selection');
    const contactsElements = selectedContacts;

    // const subtasksContainer = document.getElementById("subtasks");
    // const subtaskElements = subtasksContainer.querySelectorAll(".check");
    const subtaskElements = currentSubtasks;

    if (!titleElement || !descriptionElement || !dueDateElement || !prioButton || !categoryElement) {
        console.error('Ein oder mehrere erforderliche Elemente fehlen.');
        return;
    }

    // Task-Daten aktualisieren
    // const updatedTask = {
    //     title: titleElement.value,
    //     description: descriptionElement.value,
    //     date: dueDateElement.value,
    //     prio: prioButton.id.replace('prio', ''),
    //     category: categoryElement.textContent.trim(),
    //     contacts: contactsElements,
    //     subtasks: subtaskElements
    // };
    // console.log(updatedTask);

    try {
        // URL für das Aktualisieren der bestehenden Task
        const url = `${base_url}/tasks/${taskStatus}/${taskId}.json`;
        const response = await fetch(url, {
            method: 'PUT', // Wichtig: PUT überschreibt die bestehende Aufgabe
            body: JSON.stringify(editedTask),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // console.log('Task erfolgreich gespeichert:', updatedTask);
        currentSubtasks = [];
        // Board aktualisieren
        // await loadTasks();
    } catch (error) {
        // console.error("Fehler beim Aktualisieren der Aufgabe:", error);
    }
}


// async function postEditData(taskData, path, id) {
//     console.log(taskData);
//     try {
//         let response = await fetch(`${task_base_url}/tasks/${path}/${id}.json`, {
//             method: "PUT",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify(taskData)
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         let result = await response.json();
//         // console.log("Task successfully added:", result);
//         return result;
//     } catch (error) {
//         console.error("Error posting data:", error);
//     }
// }