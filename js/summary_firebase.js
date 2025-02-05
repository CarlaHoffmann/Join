const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

/**
 * This asynchronous function initializes the task summary by calling several functions to 
 * fetch and display various task counts and the highest priority task.
 */
async function initSummary() {
    await getGreetingOverlay();
    await getGreetingName();
    await countToDo();
    await countDone();
    await countTasksInProgress();
    await countAwaitingFeedback();
    await countTasksOnBoard();
    await findHighestPriorityTask();
}

/**
 * This asynchronous function displays a greeting overlay and updates the greeting name based on the logged-in user.
 */
async function getGreetingOverlay() {
    const {greetingOverlay, greetNameOverlay, greeting, greetName, overlay} = getGreetingElements();

    if (isReferrerValid()) {
        try {
            const user = await getLoggedInUser();
            if(window.innerWidth <= 1275) {
                updateGreeting(greetingOverlay, greetNameOverlay, user);
                showGreetingOverlay(overlay);
            } else {
                updateGreeting(greeting, greetName, user);
            }
        } catch (error) {
        }
    }
}

/**
 * This asynchronous function fetches the name of the logged-in user from the Firebase Realtime Database.
 * @returns {string} The name of the logged-in user.
 */
async function getLoggedInUser() {
    const response = await fetch(`${base_url}/loggedIn.json`);
    const loggedInData = await response.json();
    return loggedInData.name;
}

/**
 * This asynchronous function updates the greeting name based on the logged-in user.
 */
async function getGreetingName() {
    let greeting = document.getElementsByClassName('greeting')[1];
    let greetName = document.getElementsByClassName('greet-name')[1];
    try {
        const response = await fetch(`${base_url}/loggedIn.json`); 
        const loggedInData = await response.json();
        let user = loggedInData.name;

        if(user === 'Guest') {
            greeting.innerHTML = 'Good morning!';
            greetName.innerHTML = '';
        } else {
            greetName.innerHTML = loggedInData.name; 
        }
    } catch (error) {
    }
}

/**
 * This asynchronous function counts the number of tasks in the "toDo" category.
 */
async function countToDo() {
    let todoCounter = document.getElementById('todo-counter');
    try {
        let response = await fetch(base_url + "/tasks/toDo" + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let responseToJson = await response.json();
        let count = responseToJson ? Object.keys(responseToJson).length : 0;
        todoCounter.innerHTML = count;
    } catch (error) {
        todoCounter.innerHTML = "-";
    }
}

/**
 * This asynchronous function counts the number of tasks in the "progress" category.
 */
async function countTasksInProgress() {
    let progressCounter = document.getElementById('in-progress-counter');
    try {
        let response = await fetch(base_url + "/tasks/progress" + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let responseToJson = await response.json();
        let count = responseToJson ? Object.keys(responseToJson).length : 0;
        progressCounter.innerHTML = count;
    } catch (error) {
        progressCounter.innerHTML = "-";
    }
}

/**
 * This asynchronous function counts the number of tasks in the "feedback" category.
 */
async function countAwaitingFeedback() {
    let feedbackCounter = document.getElementById('feedback-awaiting-counter');
    try {
        let response = await fetch(base_url + "/tasks/feedback" + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let responseToJson = await response.json();
        let count = responseToJson ? Object.keys(responseToJson).length : 0;
        feedbackCounter.innerHTML = count;
    } catch (error) {
        feedbackCounter.innerHTML = "-";
    }
}

/**
 * This asynchronous function counts the number of tasks in the "done" category.
 */
async function countDone() {
    let doneCounter = document.getElementById('done-counter');
    try {
        let response = await fetch(base_url + "/tasks/done" + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let responseToJson = await response.json();
        let count = responseToJson ? Object.keys(responseToJson).length : 0;
        doneCounter.innerHTML = count;
    } catch (error) {
        doneCounter.innerHTML = "Fehler beim Laden der Aufgaben";
    }
}

/**
 * This asynchronous function finds the highest priority task across all categories and updates the UI accordingly.
 */
async function findHighestPriorityTask() {
    try {
        const categories = ['toDo', 'progress', 'feedback'];
        const allTasks = await fetchAllTasks(categories);
        const { highestPriorityTasks, earliestDate } = findHighestPriorityAndEarliestDate(allTasks);

        if (highestPriorityTasks.length > 0) {
            updateUI(highestPriorityTasks, earliestDate);
        } else {
            updateUI(null, null);
        }
    } catch (error) {
        updateUI(null, null);
    }
}

/**
 * This asynchronous function fetches all tasks from the specified categories.
 * @param {Array<string>} categories - An array of task categories.
 * @returns {Array<Object>} An array of all tasks.
 */
async function fetchAllTasks(categories) {
    let allTasks = [];
    for (const category of categories) {
        try {
            const response = await fetch(`${base_url}/tasks/${category}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const tasks = await response.json();
            
            if (tasks) {
                allTasks = allTasks.concat(Object.values(tasks));
            }
        } catch (error) {
        }
    }
    return allTasks;
}