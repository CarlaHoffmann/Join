// Initialisieren von selectedContacts mit task.contacts
// let taskContacts = task.contacts;

// Funktion zum Öffnen der Kontaktliste
async function openAssigned() {
    let contactDropDown = document.getElementById('contact-drop-down');
    let contactsToSelect = document.getElementById('contacts-to-select');

    const contacts = await loadContacts();
    const loggedInUser = await getUser();

    const preparedContacts = await prepareContacts(contacts, loggedInUser);
    const contactsHTML = createEditContactsHTML(preparedContacts, selectedContacts, loggedInUser);

    contactsToSelect.innerHTML = contactsHTML;
    contactDropDown.style.display = 'block';

    // Aktualisieren der ausgewählten Kontakte im Overlay
    updateEditContacts();
}

// Funktion zum Erstellen der Kontaktliste
function createEditContactsHTML(contacts, taskContacts, loggedInUser) {
    let contactsHTML = '';

    contacts.forEach((contact) => {
        const isSelected = taskContacts.includes(contact.name);
        const isCurrentUser = loggedInUser.name !== 'Guest' && contact.name === loggedInUser.name;
        contactsHTML += `
            <label onclick="handleContactClick(event)" for="${contact.id}" class="selection-name contact-label">
                <div>${contact.name}${isCurrentUser ? ' (You)' : ''}</div>
                <input type="checkbox" id="${contact.id}" value="${contact.name}" ${isSelected ? 'checked' : ''}>
            </label>
        `;
    });

    return contactsHTML;
}

// Funktion zum Aktualisieren der ausgewählten Kontakte im Overlay
async function updateEditContacts() {
    let contactInitials = document.getElementById('selected-contacts');
    contactInitials.innerHTML = ''; // Leere den Inhalt vor dem Neuaufbau

    let contactInis = ''; // Variable zum Sammeln der HTML-Strings

    for (let i = 0; i < selectedContacts.length; i++) {
        const contactName = selectedContacts[i];
        let initials = contactName.split(' ').map(word => word[0]).join('');
        
        // Farbe für den Kontakt abrufen
        let color = await getContactColor(contactName);
        
        // Füge den HTML-String zur Sammlung hinzu
        contactInis += `<div class="contact-initial" style="background-color: ${color};">${initials}</div>`;
    }

    // Füge alle Kontakt-Initialen hinzu
    contactInitials.innerHTML = contactInis;
}

function initializeEditPriority(prio) {
    resetAllPriorityButtons();
    
    const priority = prio;
    console.log(priority);
    const prioButton = document.getElementById(`prio${priority}`);
    if (prioButton) {
        activateEditButton(prioButton, priority);
    } else {
        console.error('Priority button not found');
    }
}

function activateEditButton(button, priority) {
    button.classList.remove('hover-button');
    button.classList.add('active-button');
    button.classList.add(getPriorityClassEdit(priority));
    updateButtonContent(button);
}

function getPriorityClassEdit(priority) {
    console.log('prio');
    switch (priority) {
        case '1': return 'urgent';
        case '2': return 'med';
        case '3': return 'low';
        // default: return 'med';
    }
}

async function saveEditedTask(task) {
    // const submitButton = document.querySelector('.submit-button');

    // if (submitButton) {
    //     submitButton.addEventListener('click', async function(event) {
            // event.preventDefault(); // Verhindert das standardmäßige Absenden des Formulars

            if (validateForm()) {
                await createEditTask(task.path, task.id);
                console.log('Form is valid. Submitting...');
                // openTaskOverlay(${JSON.stringify(task).replace(/"/g, '&quot;')})
                openTaskOverlay(task);
            }
        // });
    // } 
    else {
        console.error('Submit button not found');
    }
};

async function createEditTask(path, id) {
    let task = {
        title: takeTitle(),
        description: takeDescription(),
        contacts: takeContacts(),
        date: takeDate(),
        prio: takePrio(),
        category: takeCatergory(),
        subtasks: takeSubtask(),
    };

    try {
        await postEditData(task, path, id);
        showTaskAddedOverlay();
        await loadTasks();

    } catch (error) {
        console.error("Error during task creation or loading:", error);
    } finally {
        await openTaskOverlay(task);
    }
}


async function postEditData(taskData, path, id) {
    console.log(taskData);
    try {
        let response = await fetch(`${task_base_url}/tasks/${path}/${id}.json`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(taskData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();
        // console.log("Task successfully added:", result);
        return result;
    } catch (error) {
        console.error("Error posting data:", error);
    }
}


function takeTitle() {
    let title = document.getElementById('title');
    return title.value;
}

function takeDescription() {
    let description = document.getElementById('description');
    return description.value;
}

function takeContacts() {
    return selectedContacts;
}

function takeDate() {
    let date = document.getElementById('datepicker');
    return date.value;
}

function takePrio() {
    let activeButton = document.querySelector('.prio-button.active-button');
    return activeButton.id.replace('prio', '');
}

function takeCatergory() {
    let category = document.getElementById('category-selection');
    return category.innerHTML;
}

function takeSubtask() {
    if (subtasks.length > 0) {
        const formattedSubtasks = subtasks.map((subtask) => {
            return {
                task: subtask,
                checked: false
            };
        });
        return formattedSubtasks;
    } else {
        // console.log("Keine Subtasks vorhanden");
        return [];
    }
}


