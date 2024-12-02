const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

async function initSummary() {
    await countToDo();
    await countDone();
    await countTasksInProgress();
    await countAwaitingFeedback();
    await countTasksOnBoard();
    await findHighestPriorityTask();
}

// async function countToDo() {
//     let response = await fetch(base_url + "/tasks/toDo" + ".json");
//     let responseToJson = await response.json();
//     let count = Object.keys(responseToJson).length;
//     let todoCounter = document.getElementById('todo-counter');
//     todoCounter.innerHTML = await count;
// }
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
        console.error("Fehler beim Abrufen der To-Do-Daten:", error);
        // Optional: Benutzerfreundliche Fehlermeldung im UI anzeigen
        todoCounter.innerHTML = "-";
    }
}

// async function countTasksInProgress() {
//     let response = await fetch(base_url + "/tasks/inProgress" + ".json");
//     let responseToJson = await response.json();
//     let count = Object.keys(responseToJson).length;
    
//     let progressCounter = document.getElementById('in-progress-counter');
//     progressCounter.innerHTML = await count;
// }
async function countTasksInProgress() {
    let progressCounter = document.getElementById('in-progress-counter');
    try {
        let response = await fetch(base_url + "/tasks/inProgress" + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let responseToJson = await response.json();
        let count = responseToJson ? Object.keys(responseToJson).length : 0;
        progressCounter.innerHTML = count;
    } catch (error) {
        console.error("Fehler beim Abrufen der In-Progress-Aufgaben:", error);
        // Fehlerfall: "Fehler beim Laden der Aufgaben" anzeigen
        progressCounter.innerHTML = "-";
    }
}

// async function countAwaitingFeedback() {
//     let response = await fetch(base_url + "/tasks/feedback" + ".json");
//     let responseToJson = await response.json();
//     let count = Object.keys(responseToJson).length;
//     let feedbackCounter = document.getElementById('feedback-awaiting-counter');
//     feedbackCounter.innerHTML = await count;
// }
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
        console.error("Fehler beim Abrufen der Feedback-Aufgaben:", error);
        feedbackCounter.innerHTML = "-";
    }
}

// async function countDone() {
//     let response = await fetch(base_url + "/tasks/done" + ".json");
//     let responseToJson = await response.json();
//     let count = Object.keys(responseToJson).length;
//     let doneCounter = document.getElementById('done-counter');
//     doneCounter.innerHTML = await count;
// }
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
        console.error("Fehler beim Abrufen der erledigten Aufgaben:", error);
        doneCounter.innerHTML = "Fehler beim Laden der Aufgaben";
    }
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
        updateUI(null, null);
    }
}

// async function fetchAllTasks(categories) {
//     let allTasks = [];
//     for (const category of categories) {
//         const response = await fetch(`${base_url}/tasks/${category}.json`);
//         const tasks = await response.json();
//         allTasks = allTasks.concat(Object.values(tasks));
//     }
//     return allTasks;
// }
async function fetchAllTasks(categories) {
    let allTasks = [];
    for (const category of categories) {
        try {
            const response = await fetch(`${base_url}/tasks/${category}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const tasks = await response.json();
            
            // Überprüfen, ob tasks nicht undefined oder null ist
            if (tasks) {
                allTasks = allTasks.concat(Object.values(tasks));
            }
        } catch (error) {
            console.error(`Fehler beim Abrufen der Aufgaben für Kategorie ${category}:`, error);
        }
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
    elements.color.classList.add(getSymbolColor(1));
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