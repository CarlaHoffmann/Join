function init() {
    deadlineSymbol()
}

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