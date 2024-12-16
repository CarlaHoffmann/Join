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
        // Task successfully added
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
        // If no subtask, return []
        return [];
    }
}