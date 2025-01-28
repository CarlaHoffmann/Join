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
    const greetingOverlay = document.getElementsByClassName('greeting')[0];
    const greetNameOverlay = document.getElementsByClassName('greet-name')[0];
    const greeting = document.getElementsByClassName('greeting')[1];
    const greetName = document.getElementsByClassName('greet-name')[1];
    const overlay = document.getElementById('greeting-overlay');

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
 * This function checks if the referrer is from the correct pages.
 * @returns {boolean} Whether the referrer is valid.
 */
function isReferrerValid() {
    const referrer = document.referrer;
    return referrer && (referrer.includes('signUp.html') || referrer.includes('logIn.html'));
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
 * This function updates the greeting text based on the logged-in user.
 * @param {HTMLElement} greeting - The greeting element.
 * @param {HTMLElement} greetName - The greet name element.
 * @param {string} user - The name of the logged-in user.
 */
function updateGreeting(greeting, greetName, user) {
    if (user === 'Guest') {
        greeting.innerHTML = 'Good morning!';
        greetName.innerHTML = '';
    } else {
        greeting.innerHTML = `Good morning,`;
        greetName.innerHTML = user;
    }
}

/**
 * This function shows the greeting overlay if the screen width is less than or equal to 1275px.
 * @param {HTMLElement} overlay - The greeting overlay element.
 */
function showGreetingOverlay(overlay) {
    if (window.matchMedia("(max-width: 1275px)").matches) {
        overlay.classList.remove('hidden');
        overlay.classList.add('show');

        setTimeout(function() {
            overlay.classList.remove('show');
            overlay.classList.add('hidden');
        }, 3000);
    }
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
 * This function calculates the total number of tasks by summing the counts from the "toDo", "progress", and "feedback" categories.
 */
function countTasksOnBoard() {
    let todo = parseInt(document.getElementById('todo-counter').innerHTML);
    let progress = parseInt(document.getElementById('in-progress-counter').innerHTML);
    let feedback = parseInt(document.getElementById('feedback-awaiting-counter').innerHTML);
    let totalTasks = todo + progress + feedback;
    let tasksCounter = document.getElementById('tasks-counter');
    tasksCounter.innerHTML = totalTasks;
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

/**
 * This function finds the highest priority tasks and the earliest due date among the fetched tasks.
 * @param {Array<Object>} tasks - An array of tasks.
 * @returns {Object} An object containing the highest priority tasks and the earliest due date.
 */
function findHighestPriorityAndEarliestDate(tasks) {
    const highestPriority = findHighestPriority(tasks);
    const highestPriorityTasks = filterTasksByPriority(tasks, highestPriority);
    const earliestDate = findEarliestDate(highestPriorityTasks);

    return { highestPriorityTasks, earliestDate };
}

/**
 * This function finds the highest priority (lowest numerical value) among the tasks.
 * @param {Array<Object>} tasks - An array of tasks.
 * @returns {number} The highest priority.
 */
function findHighestPriority(tasks) {
    return tasks.reduce((highestPriority, task) => {
        const taskPriority = parseInt(task.prio);
        return taskPriority < highestPriority ? taskPriority : highestPriority;
    }, Infinity);
}

/**
 * This function filters tasks based on the specified priority.
 * @param {Array<Object>} tasks - An array of tasks.
 * @param {number} priority - The priority to filter by.
 * @returns {Array<Object>} An array of tasks with the specified priority.
 */
function filterTasksByPriority(tasks, priority) {
    return tasks.filter(task => parseInt(task.prio) === priority);
}

/**
 * This function finds the earliest due date among the tasks.
 * @param {Array<Object>} tasks - An array of tasks.
 * @returns {Date} The earliest due date.
 */
function findEarliestDate(tasks) {
    return tasks.reduce((earliestDate, task) => {
        const taskDate = parseDate(task.date);
        return !earliestDate || taskDate < earliestDate ? taskDate : earliestDate;
    }, null);
}

/**
 * This function parses a date string into a Date object.
 * @param {string} dateString - The date string in the format DD/MM/YYYY.
 * @returns {Date} The parsed Date object.
 */
function parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Monate in JavaScript sind 0-indexiert
}

/**
 * This function updates the UI with the highest priority tasks and the earliest due date.
 * @param {Array<Object>} tasks - The highest priority tasks.
 * @param {Date} earliestDate - The earliest due date.
 */
function updateUI(tasks, earliestDate) {
    const elements = getUIElements();
    if (areAllElementsPresent(elements)) {
        if (tasks && tasks.length > 0) {
            updateWithTasks(elements, tasks, earliestDate);
        } else {
            updateWithoutTasks(elements);
        }
    }
}

/**
 * This function retrieves the necessary UI elements for updating the task summary.
 * @returns {Object} An object containing the UI elements.
 */
function getUIElements() {
    return {
        color: document.getElementById('deadline-symbol'),
        image: document.getElementById('deadline-image'),
        counter: document.getElementById('deadline-counter'),
        prio: document.getElementById('deadline-prio'),
        date: document.getElementById('deadline-date')
    };
}

/**
 * This function checks if all the retrieved UI elements are present.
 * @param {Object} elements - An object containing the UI elements.
 * @returns {boolean} Whether all elements are present.
 */
function areAllElementsPresent(elements) {
    return Object.values(elements).every(element => element);
}