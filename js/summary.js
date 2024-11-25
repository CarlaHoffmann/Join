// Kategorisiert Tasks basierend auf ihrem Status
function categorizeTasks(tasks) {
    open = tasks.filter(t => t[1] && t[1]['status'] === 'open');
    inProgress = tasks.filter(t => t[1] && t[1]['status'] === 'in progress');
    awaitFeedback = tasks.filter(t => t[1] && t[1]['status'] === 'await feedback');
    done = tasks.filter(t => t[1] && t[1]['status'] === 'done');
}

// Initialisiert die Zusammenfassung, lädt Tasks und Benutzerinformationen
async function initializeSummary() {
    await loadTasks();
    getTasksLength();
    loadUser();
    showName();
}

// Aktualisiert die Zusammenfassung mit Task-Anzahl und nächster Frist
function getTasksLength() {
    let urgent = allTasks.filter(t => t[1]['prio'] == 'urgent' && t[1]['status'] !== 'done');
    let upcomingDeadline = formateDateSummary(urgent);
    let mainSummary = document.querySelector('.main_summary');
    mainSummary.innerHTML = '';
    mainSummary.innerHTML += generateSummaryInnerHTML(upcomingDeadline, urgent.length, open.length, inProgress.length, awaitFeedback.length, done.length, allTasks.length);
}

// Formatiert das Fälligkeitsdatum der dringendsten Aufgabe
function formateDateSummary(array) {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        urgentDate.push(element[1]['due date']);
    }
    urgentDate = urgentDate.sort();
    let newUrgentDate = new Date(urgentDate[0]).toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"});
    if(newUrgentDate == "Invalid Date") {
        return "";
    }
    return newUrgentDate;
}

// Gibt eine Begrüßung basierend auf der aktuellen Tageszeit zurück
function showGreeting() {
    let today = new Date();
    let currentHour = today.getHours();
    if(currentHour >= 5 && currentHour <11) {
        return 'Good Morning,';
    } else if (currentHour >= 11 && currentHour <15) {
        return 'Good Day,';  
    } else if (currentHour >= 15 && currentHour <18) {
        return 'Good Afternoon,';
    } else if (currentHour >= 18 && currentHour <22) {
        return 'Good Evening,';
    } else {
        return 'Still awake or do you ever sleep?';
    }
}

// Aktualisiert die Begrüßung mit dem Namen des Benutzers
async function showName() {
    let userInfo = await getUserInfos();
    let currentGreeting = showGreeting();
    let summaryText = document.querySelector('.summaryText');
    let userLogStatus = localStorage.getItem('logStatus');
    summaryText.innerHTML = generateSummaryTextInnerHTML(userInfo.name, currentGreeting);
    if(userLogStatus === null){
        mobileGreeting();
        localStorage.setItem("logStatus", "loggedIn");
    } else {
        document.querySelector('.summaryText').classList.add('display-none');
    }
}

// Zeigt eine mobile Begrüßung mit Fade-Out-Effekt an
function mobileGreeting() {
    let summaryText = document.querySelector('.summaryText');
    setTimeout(() => {
        summaryText.classList.add('fade-out');
    }, 400);
    setTimeout(() => {
        document.querySelector('.summaryText').classList.add('display-none');
    }, 2000);
}
