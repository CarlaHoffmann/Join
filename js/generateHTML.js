// Generiert HTML für eine kleine Task-Box (z.B. für Listen oder Boards).
function generateSmallTaskBox(task) {
    return /* HTML */ `
      <div 
          id="task-box-small" 
          class="task-box" 
          onclick="showDialogTask(${task["id"]})" 
          draggable="true" 
          ondragstart="startDraggin(${task["id"]})">
          
          <!-- Container für die Task-Details -->
          <div id="task${task["id"]}">
              <!-- Zeigt die Kategorie der Aufgabe an -->
              <p id="task-category${task["id"]}" class="task-type">${task["category"]}</p>
              
              <!-- Zeigt den Titel der Aufgabe an -->
              <p class="task-headline">${task["title"]}</p>
              
              <!-- Zeigt eine kurze Beschreibung der Aufgabe an -->
              <p id="task-description${task["id"]}" class="task-description">${task["description"]}</p>
          </div>
  
          <!-- Abschnitt für Mitglieder und Priorität -->
          <div class="member-prio-section">
              <!-- Container, um alle Mitglieder der Aufgabe anzuzeigen -->
              <div id="task-all-member${task["id"]}" class="task-all-member"></div>
              
              <!-- Zeigt ein Icon für die Priorität der Aufgabe -->
              <img id="taskPrio${task["id"]}" src="assets/img/add_task/prio_low.svg">
          </div>
      </div>`;
  }
  
  // Generiert HTML für eine detaillierte Task-Box (z.B. für die Detailansicht).
  function generateBigTaskBox(task) {
    return /* HTML */ `
      <div class="d-flex-center-space-btw">
          <!-- Zeigt die Kategorie der Aufgabe an -->
          <p id="task-category-big${task[0][1]["id"]}" class="task-type">${task[0][1]["category"]}</p>
          
          <!-- Icon zum Schließen der Detailansicht -->
          <div class="close-icon" onclick="closeDialogTask()">
              <img src="./assets/img/add_task/close.svg" />
          </div>
      </div>
      
      <!-- Titel der Aufgabe -->
      <h2>${task[0][1]["title"]}</h2>
      
      <!-- Beschreibung der Aufgabe -->
      <p class="task-description-big">${task[0][1]["description"]}</p>
      
      <div>
          <!-- Abschnitt für das Fälligkeitsdatum -->
          <div class="d-flex">
              <p class="width-30">Fälligkeitsdatum:</p>
              <p>${convertDate(task[0][1]["due date"])}</p>
          </div>
  
          <!-- Abschnitt für die Priorität -->
          <div class="d-flex">
              <p class="width-30">Priorität:</p>
              <p>${task[0][1]["prio"]}</p>
              <img id="taskPrioBigBox${task[0][1]["id"]}" class="prio-icon" src="assets/img/add_task/prio_low.svg" />
          </div>
  
          <!-- Abschnitt für zugewiesene Mitglieder -->
          <div>
              <div id="member-headline" class="margin-top-16px">Zugewiesen an:</div>
              <div id="container-member-big-task" class="container-member-big-task"></div>
          </div>
  
          <!-- Subtasks -->
          <div id="subtaks-headline${task[0][1]["id"]}"></div>
          <div id="subtasks${task[0][1]["id"]}" class="container-subtasks"></div>
  
          <!-- Buttons zum Löschen und Bearbeiten -->
          <div class="container-delete-edit">
              <div class="delete" onclick="deleteTask(event, ${task[0][1]["id"]})">
                  <img class="contact_delete_icon img_width16" src="/img/contact/delete.svg" alt="delete icon" />
                  <p>Löschen</p>
              </div>
              <div class="border-left">
                  <div class="edit" onclick="editTask(${task[0][1]["id"]}, event)">
                      <img class="contact_edit_icon img_width16" src="img/contact/edit.svg" alt="edit icon" />
                      <p>Bearbeiten</p>
                  </div>
              </div>
          </div>
      </div>`;
  }
  
  // Generiert HTML für die Überschrift der Subtasks.
  function generateSubtasksHeadline() {
    return /* HTML */ `<p class="margin-top-16px">Subtasks</p>`;
  }
  
  // Generiert HTML für einen einzelnen Subtask in der detaillierten Ansicht.
  function generateSubtasksSectionBigTask(subtask, i, taskId) {
    return /* HTML */ `
      <div class="subtasks">
          <!-- Checkbox, um den Subtask abzuhaken -->
          <div id="subtask-checkbox${i}" class="subtask-checkbox" onclick="checkUncheckBox(${i},${taskId})"></div>
          
          <!-- Beschreibung des Subtasks -->
          <p>${subtask["description"]}</p>
      </div>`;
  }
  
  // Generiert HTML für den Fortschrittsbalken und die Subtask-Zählung.
  function generateSubtasksSection(allSubtasks, doneSubtasks, progress) {
    return /* HTML */ `
      <div class="progress-section">
          <!-- Fortschrittsbalken -->
          <div class="progress">
              <div class="progress-bar" style="width: ${progress}%;"></div>
          </div>
          <!-- Anzahl der erledigten Subtasks -->
          <p class="amount-subtask">${doneSubtasks}/${allSubtasks} Subtasks</p>
      </div>`;
  }
  
  // Generiert HTML für ein Mitglied, das einer Aufgabe zugeordnet ist.
  function generateMemberTaskBox(member, memberId) {
    return /* HTML */ `<div id="${memberId}" class="member">${member}</div>`;
  }
  
  // Generiert HTML für die Anzeige zusätzlicher Mitglieder.
  function generateFurtherMemberNumber(furtherMember) {
    return /* HTML */ `<div class="further-member">+${furtherMember}</div>`;
  }
  
  // Generiert HTML, wenn keine Aufgaben verfügbar sind.
  function generateNoTaskBox(sentence) {
    return /* HTML */ `
      <div class="no-task-div">
          <p>${sentence}</p>
      </div>`;
  }
  
  // Generiert HTML für ein Mitglied in einer detaillierten Aufgabenansicht.
  function generateMemberBigTaskBox(member) {
    return /* HTML */ `
      <div class="container-letters-name">
          <!-- Initialen des Mitglieds -->
          <div id="member-letter-cirlce${member["id"]}" class="member-big-task">${member["letters"]}</div>
          
          <!-- Vollständiger Name des Mitglieds -->
          <p>${member["name"]}</p>
      </div>`;
  }
  