const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

// function init() {
//     deadlineSymbol();
//     countToDo();
// }

function deadlineSymbol() {
    let deadlineInfo = document.getElementById('deadline-prio');
    // Überprüfen, ob der Textinhalt von deadlineInfo 'Urgent' ist
    if (deadlineInfo && deadlineInfo.textContent.trim() === 'Urgent') {
        let symbolColor = document.getElementById('deadline-symbol');
        symbolColor.classList.add('urgent');
        // symbol.innerHTML = `<img src="./img/summary/prio_high.svg" alt="">`;
        let symbol = document.getElementById('deadline-image');
        symbol.src = "./img/summary/prio_high.svg";
    }

    if (deadlineInfo && deadlineInfo.textContent.trim() === 'Medium') {
        let symbolColor = document.getElementById('deadline-symbol');
        symbolColor.classList.add('medium');
        // symbol.innerHTML = `<img src="./img/summary/prio_high.svg" alt="">`;
        let symbol = document.getElementById('deadline-image');
        symbol.src = "./img/summary/prio_mid.svg";
    }

    if (deadlineInfo && deadlineInfo.textContent.trim() === 'Low') {
        let symbolColor = document.getElementById('deadline-symbol');
        symbolColor.classList.add('low');
        // symbol.innerHTML = `<img src="./img/summary/prio_high.svg" alt="">`;
        let symbol = document.getElementById('deadline-image');
        symbol.src = "./img/summary/prio_low.svg";
    }
}

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
        let highestPriorityTasks = [];
        let highestPriority = Infinity;
        let earliestDate = null;

        for (const category of categories) {
            const response = await fetch(`${base_url}/tasks/${category}.json`);
            const tasks = await response.json();

            for (const taskId in tasks) {
                const task = tasks[taskId];
                const taskPriority = parseInt(task.prio);
                const taskDate = parseDate(task.date);

                if (taskPriority < highestPriority) {
                    // Neue höchste Priorität gefunden
                    highestPriority = taskPriority;
                    highestPriorityTasks = [task];
                    earliestDate = taskDate;
                } else if (taskPriority === highestPriority) {
                    // Neue höchste Priorität gefunden
                    highestPriorityTasks.push(task);
                    if (!earliestDate || taskDate < earliestDate) {
                        earliestDate = taskDate;
                    }
                }
            }
        }

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

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); // Monate in JavaScript sind 0-indexiert
}

function updateUI(tasks, earliestDate) {
    const colorElement = document.getElementById('deadline-symbol');
    const imageElement = document.getElementById('deadline-image');
    const counterElement = document.getElementById('deadline-counter');
    const prioElement = document.getElementById('deadline-prio');
    const dateElement = document.getElementById('deadline-date');

    if (colorElement && imageElement && counterElement && prioElement && dateElement) {
        if (tasks && tasks.length > 0) {
            const highestPrioTask = tasks[0];
            colorElement.classList.add(getSymbolColor(highestPrioTask.prio));
            imageElement.src = getSymbol(highestPrioTask.prio);
            counterElement.innerHTML = tasks.length.toString();
            prioElement.innerHTML = getPriorityText(tasks[0].prio);
            dateElement.innerHTML = formatDate(earliestDate);
        } else {
            imageElement.src = "./img/summary/prio_high.svg";
            counterElement.innerHTML = "0";
            prioElement.innerHTML = "None";
            dateElement.innerHTML = "None";
        }
    } else {
        console.error("Eines oder mehrere erforderliche Elemente wurden nicht gefunden.");
    }
}

function formatDate(date) {
    if (!date) return "None";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getPriorityText(prio) {
    switch (prio) {
        case "1": return "Urgent";
        case "2": return "Medium";
        case "3": return "Low";
        default: return "Unknown";
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

function getSymbolColor(prio) {
    switch(prio) {
        case "1": return "urgent";
        case "2": return "medium";
        case "3": return "low";
        default: return "urgent";
    }
}

document.addEventListener('DOMContentLoaded', initSummary);
document.addEventListener('DOMContentLoaded', deadlineSymbol);