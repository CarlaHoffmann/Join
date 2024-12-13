// const task_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

// function submit() {
//     checkForm();
// }

// function checkForm() {
//     createTask();
// }

async function createTask() {
    let task = {
        title: takeTitle(),
        description: takeDescription(),
        contacts: takeContacts(),
        date: takeDate(),
        prio: takePrio(),
        category: takeCatergory(),
        subtasks: takeSubtask(),
    }
    // console.log("Task to be sent:", task);
    await postData(task);
    clearForm(); // Hier wird das Formular geleert
    showTaskAddedOverlay();
}

async function postData(taskData) {
    try {
        let response = await fetch(task_base_url + "/tasks/toDo" + ".json",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();
        // console.log("Task successfully added:", result);
        return result;
    } catch (error) {
        console.error("Error posting data:", error);
    }
}

function takeTitle() {
    let title = document.getElementById('title');
    return title.value;
}

function takeDescription() {
    let description = document.getElementById('description');
    return description.value;
}

function takeContacts() {
    return selectedContacts;
}

function takeDate() {
    let date = document.getElementById('datepicker');
    return date.value;
}

function takePrio() {
    let activeButton = document.querySelector('.prio-button.active-button');
    return activeButton.id.replace('prio', '');
}

function takeCatergory() {
    let category = document.getElementById('category-selection');
    return category.innerHTML;
}

// function takeSubtask() {
//     if (subtasks.length > 0) {
//         for each subtasks
//         return subtasks; // Wir können das Array direkt zurückgeben
//     } else {
//         console.log("Keine Subtasks vorhanden");
//         return [];
//     }
// }
function takeSubtask() {
    if (subtasks.length > 0) {
        const formattedSubtasks = subtasks.map((subtask) => {
            return {
                task: subtask,
                checked: false
            };
        });
        return formattedSubtasks;
    } else {
        // console.log("Keine Subtasks vorhanden");
        return [];
    }
}