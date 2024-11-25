













let editingTask = null; // Speichert die zu bearbeitende Aufgabe
let targetContainer = null; // Speichert das Ziel für die Aufgabe

// Öffnet das Overlay zum Hinzufügen einer neuen Aufgabe
function openAddTaskOverlay(containerId) {
    editingTask = null;
    targetContainer = containerId;
    document.getElementById("overlay-title").textContent = "Add Task";
    document.getElementById("task-text").value = "";
    toggleOverlay(true);
}

// Öffnet das Overlay zum Bearbeiten einer vorhandenen Aufgabe
function openEditTaskOverlay(taskElement) {
    editingTask = taskElement;
    document.getElementById("overlay-title").textContent = "Edit Task";
    document.getElementById("task-text").value = taskElement.textContent;
    toggleOverlay(true);
}

// Zeigt oder versteckt das Overlay
function toggleOverlay(show) {
    document.getElementById("overlay").style.display = show ? "flex" : "none";
}

// Schließt das Overlay
function closeOverlay() {
    toggleOverlay(false);
    editingTask = null;
    targetContainer = null;
}

// Speichert die neue oder bearbeitete Aufgabe
function saveTask() {
    const taskText = document.getElementById("task-text").value.trim();
    if (!taskText) return;

    if (editingTask) {
        editingTask.textContent = taskText;
    } else if (targetContainer) {
        const newTask = createTaskElement(taskText);
        document.getElementById(targetContainer).appendChild(newTask);
        updatePlaceholder(targetContainer);
    }
    closeOverlay();
}

// Löscht die aktuelle Aufgabe
function deleteTask() {
    if (editingTask) {
        const containerId = editingTask.parentElement.id;
        editingTask.remove();
        updatePlaceholder(containerId);
        closeOverlay();
    }
}

// Erstellt ein neues Aufgabenelement
function createTaskElement(taskText) {
    const newTask = document.createElement("div");
    newTask.className = "task";
    newTask.draggable = true;
    newTask.ondragstart = dragStart;
    newTask.ondragend = dragEnd;
    newTask.onclick = () => openEditTaskOverlay(newTask);
    newTask.textContent = taskText;
    return newTask;
}

// Zeigt oder versteckt den Platzhalter basierend auf der Anzahl der Aufgaben
function updatePlaceholder(containerId) {
    const container = document.getElementById(containerId);
    const hasTasks = container.querySelectorAll(".task").length > 0;
    container.querySelector(".placeholder").style.display = hasTasks ? "none" : "block";
}

// Ermöglicht das Ablegen von Aufgaben
function allowDrop(event) {
    event.preventDefault();
}

// Startet den Drag-Effekt
function dragStart(event) {
    event.target.classList.add("rotate");
    event.dataTransfer.setData("text/plain", event.target.id);
}

// Entfernt die Rotation nach dem Drag-Effekt
function dragEnd(event) {
    event.target.classList.remove("rotate");
}

// Behandelt das Ablegen der Aufgabe in einen neuen Container
function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const task = document.getElementById(taskId);
    const container = event.target.closest(".task-container");

    if (container) {
        container.appendChild(task);
        updatePlaceholder(container.id);
        updatePlaceholder(task.parentElement.id);
    }
}
