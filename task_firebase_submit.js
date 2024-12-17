// This asynchronous function creates a new task object from the form data and posts it to the server.
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

// This asynchronous function posts the task data to the server using the fetch API.
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

// This function extracts the title from the form.
function takeTitle() {
    let title = document.getElementById('title');
    return title.value;
}

// This function extracts the description from the form.
function takeDescription() {
    let description = document.getElementById('description');
    return description.value;
}

// This function extracts the selected contacts.
function takeContacts() {
    return selectedContacts;
}

// This function extracts the due date from the form.
function takeDate() {
    let date = document.getElementById('datepicker');
    return date.value;
}

// This function extracts the selected priority.
function takePrio() {
    let activeButton = document.querySelector('.prio-button.active-button');
    return activeButton.id.replace('prio', '');
}

// This function extracts the selected category.
function takeCatergory() {
    let category = document.getElementById('category-selection');
    return category.innerHTML;
}

// This function extracts and formats the subtasks.
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