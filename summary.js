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

async function getDeadline() {
    let responseToDO = await fetch(base_url + "/tasks/toDo.json");
    let responseInProgress = await fetch(base_url + "/tasks/inProgress.json");
    let responseFeedback = await fetch(base_url + "/tasks/feedback.json");
    let tasksToDO = await responseToDO.json();
    let tasksInProgress = await responseInProgress.json();
    let tasksFeedback = await responseFeedback.json();

    let allTasks = [...Object.values(tasksToDO || {}), ...Object.values(tasksInProgress || {}), ...Object.values(tasksFeedback || {})];
    let priorityCount = countTasksByPriority(allTasks);
    console.log(allTasks);

    updateDeadlineCounter(priorityCount);
    updateDeadlinePriority(priorityCount);
    updateDeadlineDate(allTasks);
}

function countTasksByPriority(tasks) {
    return tasks.reduce((counts, task) => {
        if (task.prio === "1") counts.prio1++;
        else if (task.prio === "2") counts.prio2++;
        else if (task.prio === "3") counts.prio3++;
        return counts;
    }, { prio1: 0, prio2: 0, prio3: 0 });
}

function updateDeadlineCounter(priorityCount) {
    let counter = document.getElementById('deadline-counter');
    if (counter) {
        if (priorityCount.prio1 > 0) counter.innerHTML = priorityCount.prio1;
        else if (priorityCount.prio2 > 0) counter.innerHTML = priorityCount.prio2;
        else if (priorityCount.prio3 > 0) counter.innerHTML = priorityCount.prio3;
        else counter.innerHTML = "0";
    } else {
        console.error("Element with ID 'deadline-counter' not found");
    }
}

function updateDeadlinePriority(priorityCount) {
    let priorityElement = document.getElementById('deadline-prio');
    if (priorityElement) {
        if (priorityCount.prio1 > 0) priorityElement.innerHTML = "Urgent";
        else if (priorityCount.prio2 > 0) priorityElement.innerHTML = "Medium";
        else if (priorityCount.prio3 > 0) priorityElement.innerHTML = "Low";
        else priorityElement.innerHTML = "No tasks";
    } else {
        console.error("Element with ID 'deadline-prio' not found");
    }
}

function updateDeadlineDate(tasks) {
    let dateElement = document.getElementById('deadline-date');
    if (dateElement) {
        let nearestTask = tasks
            .filter(task => task.date) // Filter tasks with a date
            .sort((a, b) => {
                // Sort by priority first, then by date
                if (a.prio !== b.prio) return a.prio - b.prio;
                return new Date(a.date) - new Date(b.date);
            })[0]; // Get the first task (highest priority and nearest date)

        if (nearestTask) {
            dateElement.innerHTML = nearestTask.date;
        } else {
            dateElement.innerHTML = "No upcoming deadlines";
        }
    } else {
        console.error("Element with ID 'deadline-date' not found");
    }
}
    // let counter = document.getElementById('deadline-counter');
    // // counter.inner =
    // if (counter) {
    //     if (priorityCount.prio1 > 0) {
    //         counter.innerHTML = priorityCount.prio1;
    //     } else if (priorityCount.prio2 > 0) {
    //         counter.innerHTML = priorityCount.prio2;
    //     } else if (priorityCount.prio3 > 0) {
    //         counter.innerHTML = priorityCount.prio3;
    //     } else {
    //         counter.innerHTML = "0";
    //     }
    // } else {
    //     console.error("Element with ID 'deadline-counter' not found");
    // }
    // console.log(priorityCount.prio2);
    // if() {}
    // In der div id="deadline-prio" soll eingebunden werden: bei prio 1= Urgent, bei prio2 = medium, bei prio 3 = low.
    // Bei id="deadline-date" soll das Datum der am nächsten fälligen task mit der höchsten Priorität ausgegeben werden.


// function countTasksByPriority(tasksToDO, tasksInProgress, tasksFeedback) {
//     let tasks = tasksToDO + tasksInProgress + tasksFeedback;
//     let counts = { prio1: 0, prio2: 0, prio3: 0 };
    
//     for (let key in tasks) {
//         let task = tasks[key];
//         if (task.prio === "1") {
//             counts.prio1++;
//         } else if (task.prio === "2") {
//             counts.prio2++;
//         } else if (task.prio === "3") {
//             counts.prio3++;
//         }
//     }
    
//     return counts;
// }

document.addEventListener('DOMContentLoaded', initSummary);
document.addEventListener('DOMContentLoaded', deadlineSymbol);