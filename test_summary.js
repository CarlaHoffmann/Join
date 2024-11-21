const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

async function initSummary() {
    await countToDo();
    await countDone();
    await countTasksOnBoard();
    await countTasksInProgress();
    await countAwaitingFeedback();
    await findHighestPriorityTask();
}

async function countToDo() {
    let response = await fetch(base_url + "/tasks/toDo" + ".json");
    let responseToJson = await response.json();
    let count = Object.keys(responseToJson).length;
    let todoCounter = document.getElementById('todo-counter');
    todoCounter.innerHTML = await count;
}

async function countTasksInProgress() {
    let response = await fetch(base_url + "/tasks/inProgress" + ".json");
    let responseToJson = await response.json();
    let count = Object.keys(responseToJson).length;
    let todoCounter = document.getElementById('in-progress-counter');
    todoCounter.innerHTML = await count;
}
async function countAwaitingFeedback() {
    let response = await fetch(base_url + "/tasks/feedback" + ".json");
    let responseToJson = await response.json();
    let count = Object.keys(responseToJson).length;
    let todoCounter = document.getElementById('feedback-awaiting-counter');
    todoCounter.innerHTML = await count;
}

async function countDone() {
    let response = await fetch(base_url + "/tasks/done" + ".json");
    let responseToJson = await response.json();
    let count = Object.keys(responseToJson).length;
    let todoCounter = document.getElementById('done-counter');
    todoCounter.innerHTML = await count;
}

function countTasksOnBoard() {
    let todo = parseInt(document.getElementById('todo-counter').innerHTML);
    let progress = parseInt(document.getElementById('in-progress-counter').innerHTML);
    let feedback = parseInt(document.getElementById('feedback-awaiting-counter').innerHTML);
    let done = parseInt(document.getElementById('done-counter').innerHTML);
    let totalTasks = todo + progress + feedback + done;
    let tasksCounter = document.getElementById('tasks-counter');
    tasksCounter.innerHTML = totalTasks;
}

async function findHighestPriorityTask() {
    try {
        const categories = ['toDo', 'inProgress', 'feedback'];
        const allTasks = await fetchAllTasks(categories);
        const { highestPriorityTasks, earliestDate } = findHighestPriorityAndEarliestDate(allTasks);

        if (highestPriorityTasks.length > 0) {
            console.log("Höchste Priorität Tasks:", highestPriorityTasks);
            updateUI(highestPriorityTasks, earliestDate);
        } else {
            console.log("Keine Aufgaben gefunden");
            updateUI(null, null);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Aufgaben:", error);
    }
}

async function fetchAllTasks(categories) {
    let allTasks = [];
    for (const category of categories) {
        const response = await fetch(`${base_url}/tasks/${category}.json`);
        const tasks = await response.json();
        allTasks = allTasks.concat(Object.values(tasks));
    }
    return allTasks;
}

function findHighestPriorityAndEarliestDate(tasks) {
    const highestPriority = findHighestPriority(tasks);
    const highestPriorityTasks = filterTasksByPriority(tasks, highestPriority);
    const earliestDate = findEarliestDate(highestPriorityTasks);

    return { highestPriorityTasks, earliestDate };
}

function findHighestPriority(tasks) {
    return tasks.reduce((highestPriority, task) => {
        const taskPriority = parseInt(task.prio);
        return taskPriority < highestPriority ? taskPriority : highestPriority;
    }, Infinity);
}

function filterTasksByPriority(tasks, priority) {
    return tasks.filter(task => parseInt(task.prio) === priority);
}

function findEarliestDate(tasks) {
    return tasks.reduce((earliestDate, task) => {
        const taskDate = parseDate(task.date);
        return !earliestDate || taskDate < earliestDate ? taskDate : earliestDate;
    }, null);
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Monate in JavaScript sind 0-indexiert
}

function updateUI(tasks, earliestDate) {
    const elements = getUIElements();
    
    if (areAllElementsPresent(elements)) {
        if (tasks && tasks.length > 0) {
            updateWithTasks(elements, tasks, earliestDate);
        } else {
            updateWithoutTasks(elements);
        }
    } else {
        console.error("Eines oder mehrere erforderliche Elemente wurden nicht gefunden.");
    }
}

function getUIElements() {
    return {
        color: document.getElementById('deadline-symbol'),
        image: document.getElementById('deadline-image'),
        counter: document.getElementById('deadline-counter'),
        prio: document.getElementById('deadline-prio'),
        date: document.getElementById('deadline-date')
    };
}

function areAllElementsPresent(elements) {
    return Object.values(elements).every(element => element);
}

function updateWithTasks(elements, tasks, earliestDate) {
    const task = tasks[0];
    elements.color.classList.add(getSymbolColor(task.prio));
    elements.image.src = getSymbol(task.prio);
    elements.counter.innerHTML = tasks.length;
    elements.prio.innerHTML = getPriorityText(task.prio);
    elements.date.innerHTML = formatDate(earliestDate);
}

function updateWithoutTasks(elements) {
    elements.image.src = "./img/summary/prio_high.svg";
    elements.counter.innerHTML = "0";
    elements.prio.innerHTML = "Urgent";
    elements.date.innerHTML = "No upcoming Deadline";
}

function getSymbolColor(prio) {
    switch(prio) {
        case "1": return "urgent";
        case "2": return "medium";
        case "3": return "low";
        default: return "urgent";
    }
}

function getSymbol(prio) {
    switch(prio) {
        case "1": return "./img/summary/prio_high.svg";
        case "2": return "./img/summary/prio_mid.svg";
        case "3": return "./img/summary/prio_low.svg";
        default: return "./img/summary/prio_high.svg";
    }
}

function getPriorityText(prio) {
    switch (prio) {
        case "1": return "Urgent";
        case "2": return "Medium";
        case "3": return "Low";
        default: return "Unknown";
    }
}

function formatDate(date) {
    if (!date) return "None";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function goToBoard() {
    window.location.href = 'board.html';
}

document.addEventListener('DOMContentLoaded', initSummary);
// document.addEventListener('DOMContentLoaded', function() {
//     if (document.title === 'Summary') { // Ersetze 'Summary Page Title' durch den tatsächlichen Titel
//         initSummary();
//     }
// });