/**
 * Retrieves DOM elements for greeting.
 * @returns {Object} An object containing greeting-related DOM elements.
 */
function getGreetingElements() {
    return {
        greetingOverlay: document.getElementsByClassName('greeting')[0],
        greetNameOverlay: document.getElementsByClassName('greet-name')[0],
        greeting: document.getElementsByClassName('greeting')[1],
        greetName: document.getElementsByClassName('greet-name')[1],
        overlay: document.getElementById('greeting-overlay')
    };
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

/**
 * This function updates the UI with the highest priority tasks and the earliest due date.
 * @param {Object} elements - An object containing the UI elements.
 * @param {Array<Object>} tasks - The highest priority tasks.
 * @param {Date} earliestDate - The earliest due date.
 */
function updateWithTasks(elements, tasks, earliestDate) {
    const task = tasks[0];
    elements.color.classList.add(getSymbolColor(task.prio));
    elements.image.src = getSymbol(task.prio);
    elements.counter.innerHTML = tasks.length;
    elements.prio.innerHTML = getPriorityText(task.prio);
    elements.date.innerHTML = formatDate(earliestDate);
}

/**
 * This function updates the UI to indicate that there are no upcoming tasks.
 * @param {Object} elements - An object containing the UI elements.
 */
function updateWithoutTasks(elements) {
    elements.color.classList.add(getSymbolColor(1));
    elements.image.src = "./assets/img/summary/prio_high.svg";
    elements.counter.innerHTML = "0";
    elements.prio.innerHTML = "Urgent";
    elements.date.innerHTML = "No upcoming Deadline";
}

/**
 * This function returns the CSS class for the symbol color based on the priority.
 * @param {string} prio - The priority level (1, 2, or 3).
 * @returns {string} The CSS class for the symbol color.
 */
function getSymbolColor(prio) {
    switch(prio) {
        case "1": return "urgent";
        case "2": return "medium";
        case "3": return "low";
        default: return "urgent";
    }
}

/**
 * This function returns the URL of the symbol image based on the priority.
 * @param {string} prio - The priority level (1, 2, or 3).
 * @returns {string} The URL of the symbol image.
 */
function getSymbol(prio) {
    switch(prio) {
        case "1": return "./assets/img/summary/prio_high.svg";
        case "2": return "./assets/img/summary/prio_mid.svg";
        case "3": return "./assets/img/summary/prio_low.svg";
        default: return "./assets/img/summary/prio_high.svg";
    }
}

/**
 * This function returns the text representation of the priority level.
 * @param {string} prio - The priority level (1, 2, or 3).
 * @returns {string} The text representation of the priority.
 */
function getPriorityText(prio) {
    switch (prio) {
        case "1": return "Urgent";
        case "2": return "Medium";
        case "3": return "Low";
        default: return "Unknown";
    }
}

/**
 * This function formats a Date object into a human-readable string.
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
    if (!date) return "None";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * This function redirects the user to the board page.
 */
function goToBoard() {
    window.location.href = 'board.html';
}

/**
 * Initializes the task summary when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', initSummary);