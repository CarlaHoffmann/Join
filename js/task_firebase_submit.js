/**
 * This asynchronous function creates a new task object from the form data and posts it to the server.
 */
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
    clearForm(); 
    showTaskAddedOverlay();
}

/**
 * This asynchronous function posts the task data to the server using the fetch API.
 * @param {Object} taskData - The task object to be posted.
 * @returns {Object} The response from the server, or an error if the request fails.
 */
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
        return result;
    } catch (error) {
        return;
    }
}

/**
 * This function extracts the title from the form.
 * @returns {string} The title value.
 */
function takeTitle() {
    let title = document.getElementById('title');
    return title.value;
}

/**
 * This function extracts the description from the form.
 * @returns {string} The description value.
 */
function takeDescription() {
    let description = document.getElementById('description');
    return description.value;
}

/**
 * This function extracts the selected contacts.
 * @returns {Array<string>} An array of selected contact names.
 */
function takeContacts() {
    return selectedContacts;
}

/**
 * This function extracts the due date from the form.
 * @returns {string} The due date value.
 */
function takeDate() {
    let date = document.getElementById('datepicker');
    return date.value;
}

/**
 * This function extracts the selected priority.
 * @returns {string} The priority level (1, 2, or 3).
 */
function takePrio() {
    let activeButton = document.querySelector('.prio-button.active-button');
    return activeButton.id.replace('prio', '');
}

/**
 * This function extracts the selected category.
 * @returns {string} The category text.
 */
function takeCatergory() {
    let category = document.getElementById('category-selection');
    return category.innerHTML;
}

/**
 * Retrieves the current subtasks.
 * @returns {Array} An array of current subtasks if any exist, otherwise an empty array.
 */
function takeSubtask() {
    if (currentSubtasks.length > 0) {
        return currentSubtasks;
    } else {
        return [];
    }
}