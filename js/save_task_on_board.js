async function saveEditedTask(task) {
    const submitButton = document.querySelector('.submit-button');
    // console.log(task.key);

    if (submitButton) {
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars

            if (validateForm()) {
                await createEditTask(task.path, task.id);
                console.log('Form is valid. Submitting...');
                // openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})
                // openTaskOverlay(task);
                console.log(task);
            }
        });
    } 
    else {
        console.error('Submit button not found');
    }
};

async function createEditTask(path, id) {
    let task = {
        title: takeTitle(),
        description: takeDescription(),
        contacts: takeContacts(),
        date: takeDate(),
        prio: takePrio(),
        category: takeCatergory(),
        subtasks: takeSubtask(),
    };

    try {
        await postEditData(task, path, id);
        showTaskAddedOverlay();
        // await loadTasks();
        currentSubtasks = [];

    } catch (error) {
        console.error("Error during task creation or loading:", error);
    // } finally {
    //     await openTaskOverlay(task);
    }
}

async function postEditData(taskData, path, id) {
    console.log(taskData);
    try {
        let response = await fetch(`${task_base_url}/tasks/${path}/${id}.json`, {
            method: "PUT",
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

function takeSubtask() {
    currentSubtasks = existingSubtasks;
    existingSubtasks = [];
    if (currentSubtasks.length > 0) {
        const formattedSubtasks = currentSubtasks.map((subtask) => {
            return subtask;
        });
        
        return formattedSubtasks;
    } else {
        // console.log("Keine Subtasks vorhanden");
        return [];
    }
}