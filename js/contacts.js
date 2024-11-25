
let contacts = [];
let sortedContacts = [];

let colors = ['var(--tagOrange)', 'var(--tagPink)', 'var(--tagPurple)',
    'var(--tagDarkPurple)', 'var(--tagLightBlue)', 'var(--tagTurquoise)',
    'var(--tagApricot)', 'var(--tagLightOrange)', 'var(--tagLightPink)',
    'var(--tagYellow)', 'var(--tagBlue)', 'var(--tagGreen)',
    'var(--taglightYellow)', 'var(--tagRed)', 'var(--tagMediumYellow)',
]



async function loadContacts() {
    contacts = Object.entries(await loadData('contacts'));
    renderContacts();
}


async function renderContacts(filter) {
    let contentContacts = document.querySelector('.contacts');
    sortedContacts = sortArray(contacts);
    contentContacts.innerHTML = '';
    let prevLetter = null;
    
    for (let i = 0; i < sortedContacts.length; i++) {
        const contact = sortedContacts[i][1];
        let firstLetter = contact['name'].charAt(0);
        prevLetter = generateLetterIfNeeded(contentContacts, i, firstLetter, prevLetter, filter);
        contentContacts.innerHTML += generateContactsInnerHTML(contact, i);
        changeColorContact('#short_name', i, contact.color);
    }
}



function generateLetterIfNeeded(contentContacts, i, firstLetter, prevLetter, filter) {
    if ((!filter || filter == firstLetter) && firstLetter !== prevLetter) {
        contentContacts.innerHTML += generateLettersInnerHTML(i, firstLetter);
        prevLetter = firstLetter;
    }
    return prevLetter;
}



function changeColorContact(id, i, color) {
    let shortName = document.querySelector(`${id}${i}`);
    shortName.style.backgroundColor = color;
}



function sortArray(array) {
    let sortedArray = array.slice().sort((a, b) => {
        if (nameIsGreaterThan(a, b)) {
            return -1;
        }
        if (nameIsLessThan(a, b)) {
            return 1;
        }
        return 0;
    })
    return sortedArray;
}



function toggleContactView(i) {
    if (currentElementWidth(1110)) {
        showContactMobile();
    } else {
        showContactDesktop();
    }
    if (typeIsDefined(i)) {
        renderFloatingContact(i);
        changeColorContact('#short_name_overview', i, sortedContacts[i][1].color);
    }
    if (!currentElementWidth(1110)) {
        showActiveContact();
    }
}



function showActiveContact() {
    let activeContactName = document.querySelector('.name_overview').textContent;
    let activeContactMail = document.querySelector('.overview_mail').textContent;
    let contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => {
        let contactName = contact.querySelector('.contact_fullName').textContent;
        let contactMail = contact.querySelector('.contact_mail').textContent;
        contact.classList.remove('active_contact');
        if (elementContainsActiveContact(contactName, activeContactName, contactMail, activeContactMail)) {
            contact.classList.add('active_contact');
        }
    });
}


function renderFloatingContact(i) {
    let contactView = document.querySelector('#contact_view');
    contactView.innerHTML = generateFloatingContactInnerHTML(i);
}



function showContactOptions(event, i) {
    event.stopPropagation(); 
    let contactOptionsMobile = document.querySelector('.contact_options_mobile');
    contactOptionsMobile.innerHTML = generateContactOptionsInnerHTML(i);
    contactOptionsMobile.classList.add('show_contact_options_mobile');
}



function closeContactOptions(event) {
    if (classIsNotContactsOptionsMobile(event)) {
      document.querySelector('.contact_options_mobile').classList.remove('show_contact_options_mobile');
    }
  }


function getRandomItem(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    let item = array[randomIndex];
    return item;
}



function getContactsInitials(name) {
    let splitName = name.split(/(\s+)/);
    firstInitial = splitName[0].charAt(0);
    if (stringIsLongEnough(splitName)) {
        secondInitial = splitName[splitName.length - 1].charAt(0);
        let mergeLetters = firstInitial + secondInitial;
        let initialLetters = capitalize(mergeLetters);
        return initialLetters;
    }
    let initialLetters = capitalize(firstInitial);
    return initialLetters;
}



function capitalize(string) {
    let capitalizedString = string.toUpperCase();
    return capitalizedString;
}



function openAddContact() {
    showDialog('.dialog_add_contact_bg', 'd_none', '.dialog_add_contact', 'show_dialog_add_contact', 50);
    clearDataContactValues();
}



async function addContact() {
    let fullName = document.querySelector('#fullName');
    let mail = document.querySelector('#mail');
    let telNumber = document.querySelector('#telNumber');
    let colorAllocation = getRandomItem(colors);
    let firstLetters = getContactsInitials(fullName.value);
    await postData(`contacts`, { name: capitalizeFirstLetters(fullName.value), mail: mail.value, phone: telNumber.value, color: colorAllocation, letters: firstLetters });
    await updateArrayContacts();
    closeDialog('.dialog_add_contact', 'show_dialog_add_contact', '.dialog_add_contact_bg', 'd_none', 0);
    toggleContactView(sortedContacts.findIndex(contact => contact === contacts[contacts.length - 1]));
    showCreateContactDoneShort();
    clearDataContactValues();
}



function clearDataContactValues() {
    document.querySelector('#fullName').value = '';
    document.querySelector('#mail').value = '';
    document.querySelector('#telNumber').value = '';
}



function showCreateContactDoneShort() {
    document.querySelector('.create_contact_done').classList.add('show_create_contact_done');
    setTimeout(function () {
        document.querySelector('.create_contact_done').classList.remove('show_create_contact_done');
    }, 800);
}



function capitalizeFirstLetters(name) {
    return name.split(' ').map(word => {
        if (word.trim().length > 0) {
            return word[0].toUpperCase() + word.slice(1);
        } else {
            return '';
        }
    }).join(' ');
}



function editContact(event, index) {
    if (currentElementWidth(1110)) {
        showDialog('.dialog_edit_contact_bg', 'd_none', '.dialog_edit_contact', 'show_dialog_edit_contact', 50);
        closeContactOptions(event);
    } else {
        showDialog('.dialog_edit_contact_bg', 'd_none', '.dialog_edit_contact', 'show_dialog_edit_contact', 0);
    }
    let dialogEditContact = document.querySelector('.dialog_edit_contact_bg');
    dialogEditContact.innerHTML = generateDialoEditInnerHTML(index);
    changeColorContact('#create_contact_short_name_edit', index, sortedContacts[index][1].color);
    showSavedData(index);
}



function showSavedData(index) {
    document.querySelector('#fullName_edit').value = `${sortedContacts[index][1].name}`;
    document.querySelector('#mail_edit').value = `${sortedContacts[index][1].mail}`;
    document.querySelector('#telNumber_edit').value = `${sortedContacts[index][1].phone}`;
}



async function saveNewData(index) {
    let newName = document.querySelector('#fullName_edit');
    let firstLetters = getContactsInitials(newName.value);
    let newMail = document.querySelector('#mail_edit');
    let newTelNumber = document.querySelector('#telNumber_edit');
    let currentIndex = contacts.findIndex(contact => contact === sortedContacts[index]);

    await editData(`contacts/${contacts[currentIndex][0]}`, {name: capitalizeFirstLetters(newName.value), mail: newMail.value, phone: newTelNumber.value, letters: firstLetters});
    await updateArrayContacts();
    closeDialog('.dialog_edit_contact', 'show_dialog_edit_contact', '.dialog_edit_contact_bg', 'd_none', 100);
    toggleContactView(sortedContacts.findIndex(contact => contact === contacts[currentIndex]));
}



async function deleteContact(event, index) {
    let currentIndex = contacts.findIndex(contact => contact === sortedContacts[index]);
    deleteContactInTasks(currentIndex, contacts);
    await deleteData(`contacts/${contacts[currentIndex][0]}`);
    await updateArrayContacts();
    if (currentElementWidth(1110)) {
        showContactMobile();
        closeContactOptions(event);
    } else {
        document.querySelector('.floating_contact').classList.toggle('d_none');
        document.querySelector('.floating_contact').classList.toggle('show_floating_contact_desktop');
    }
    if(document.querySelector('.show_dialog_edit_contact')) {
        closeDialog('.dialog_edit_contact', 'show_dialog_edit_contact', '.dialog_edit_contact_bg', 'd_none', 0);
    }
}



function showContactMobile() {
    document.querySelector('#content_contacts').classList.toggle('d_none');
    document.querySelector('#contact_view').classList.toggle('d_none');
    document.querySelector('.floating_contact').classList.toggle('d_none');
}


function showContactDesktop() {
    document.querySelector('.floating_contact').classList.add('d_none');
    setTimeout(function () {
        document.querySelector('.floating_contact').classList.add('show_floating_contact_desktop');
    }, 0);
}



async function updateArrayContacts() {
    contacts = Object.entries(await loadData('contacts'));
    renderContacts();
}



function nameIsGreaterThan(a, b) {
    return a[1].name < b[1].name;
}



function nameIsLessThan(a, b) {
    return a[1].name > b[1].name;
}



function typeIsDefined(i) {
    return typeof i !== 'undefined';
}



function elementContainsActiveContact(contactName, activeContactName, contactMail, activeContactMail) {
    return contactName === activeContactName && contactMail === activeContactMail;
}



function classIsNotContactsOptionsMobile(event) {
    return event.target.className != 'hide_desktop';
}



function stringIsLongEnough(string) {
    return string.length > 2;
}


function currentElementWidth(number) {
    return proveElementWidth(document.querySelector('.wrapped_maxWidth')) <= number;
}
