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