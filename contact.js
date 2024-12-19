let editKey = null;

const base_url = 'https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/';
let contactList = document.getElementById('contactList');
let contactDetails = document.getElementById('contactDetails');
let addContactButton = document.getElementById('addContactButton');
let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');

function clearAddContactFields(){
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}

async function addContact(){
    let name = document.getElementById('name').value;
    let mail = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let color = returnColor();
    let uploadData = {
        'phone':phone,
        'color':color,
        'mail':mail,
        'name':name,
        'password':'pw',
    }
    await createNewContact('/users', uploadData);
    closeAddOverlay();
    clearAddContactFields();
    loadContactData();
}

function getNameInitials(name) {
    let nameParts = name.split(' ');
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}

function returnContactDetailsTemplate(key, name, email, phone, color){

    return `
        <div class="detailsBox">
            <div class="contactHeader">
                <div style="background:${color}" class="circleDetails">${(getNameInitials(name))}</div>
                <div class='nameDetails'>
                    <p>${name}</p>
                    <div class="contactItemControls">

                    <!-- Edit -->
                    <div id="editContainer" onclick="toggleView('editContactBoxOverlay', '${key}', true)">
                        <svg class="icon-svg icon-text-button" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 11V17" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>                        
                     <span class="icon-text">Edit</span>
                    </div>
                       
                    <!-- Delete -->
                    <div id="deleteContainer" onclick="deleteContact('${key}')">
                        <svg class="icon-svg icon-text-button" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
                    </svg>                        
                    <span>Delete</span></div>
                    </div>
                </div>
            </div>
            <p class='contactInformationTitle'>Contact Information</p>
            <div class="contactFooter">
                <div class="contactFooterInformation">
                    <b>Email</b>
                    <p class="email">${email}</p>
                </div>
                <div class="contactFooterInformation">
                    <b>Phone</b>
                    <p>${phone}</p>
                </div>
            </div>
        </div>
    `;
}

function showContact(key, name, email, phone, color) {
    const contactDetails = document.getElementById('contactDetails');
    const contactDetailsOverlay = document.getElementById('contactDetailsOverlay');

    // Inhalt setzen
    contactDetails.innerHTML = returnContactDetailsTemplate(key, name, email, phone, color);
    contactDetailsOverlay.innerHTML = returnContactDetailsTemplate(key, name, email, phone, color);

    // Animation starten
    if (contactDetails.classList.contains('show')) {
        contactDetails.classList.remove('show');
        requestAnimationFrame(() => {
            contactDetails.classList.add('show');
        });
    } else {
        contactDetails.classList.add('show');
    }

    // Entferne 'selected' von allen Kontakten
    document.querySelectorAll('.contact').forEach(contact => {
        contact.classList.remove('selected');
    });

    // Füge 'selected' dem aktuellen Kontakt hinzu
    const selectedContact = document.querySelector(`.contact[onclick*="'${key}'"]`);
    if (selectedContact) {
        selectedContact.classList.add('selected');
    }
}

function showOverlayAddContact() {
    let contactDetailBoxOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlay.classList.add('contactDetailBox');
}

function sortUsers(usersArray){
    usersArray.sort(function(a,b){
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if(nameA < nameB){ //a before b
            return -1;
        } else if(nameA > nameB){ //b before a
            return 1;
        } else{ //same value
            return 0;
        }
    });
}


async function loadContactData(){
    //read out data from firebase
    let response = await fetch(base_url + ".json");
    let responseToJson = await response.json();
    let users = await responseToJson.users;
    //create usersArray (includes values from firebaseanswer)
    usersArray = Object.values(users);
    //add key from firebaseanswer to usersarray
    let keys = Object.keys(users);
    for(let i = 0; i < usersArray.length; i++){
        usersArray[i].key = keys[i];
    }
    //sort usersArray
    sortUsers(usersArray);
    //clears contactList
    contactList.innerHTML = "";
    //array to recognize which letters have to be shown
    let lettersArray = [];
    //fills contactList
    for (let i = 0; i < usersArray.length; i++) {
        let user = usersArray[i];
        let firstUserLetter = getNameInitials(user.name)[0].toLowerCase();
        let letterExists = lettersArray.includes(firstUserLetter);
        if (!letterExists) {
            lettersArray.push(firstUserLetter);
            contactList.innerHTML += `
                <p>${firstUserLetter.toUpperCase()}</p>
                <hr>
            `;
        }
        contactList.innerHTML += `
            <div class="contact" onclick="showContact('${user.key}', '${user.name}', '${user.mail}', '${user.phone}', '${user.color}'), showOverlayAddContact()")>
                <div style="background:${user.color}" class="circle">${getNameInitials(user.name)}</div>
                <div class="contactInformation">
                    <p class="contactInformationName">${user.name}</p>
                    <p class="email">${user.mail}</p>
                </div>
            </div>
        `;
    }
}

loadContactData();

async function deleteContact(key){
    const contactDetails = document.getElementById('contactDetails');
    const deleteLink = base_url + "users" + "/" + key;
    const response = await fetch(deleteLink + ".json", {method:'DELETE'});
    loadContactData();
    contactDetails.innerHTML = "";
    return await response.json();
}

async function createNewContact(path = "", data={}){
    let response = await fetch(base_url + path + ".json", {
        method:"POST",
        header:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    });
    return responseToJson = await response.json();
}
            
async function toggleView(elementId, key=null, edit=false){

    editKey = key;
    document.getElementById(elementId).classList.remove('hidden');

    if(edit){

        const editLink = base_url + "users" + "/" + editKey;
        let response = await fetch(editLink + ".json");
        let user = await response.json();

        document.getElementById('changedName').value = user.name;
        document.getElementById('changedEmail').value = user.mail;
        document.getElementById('changedPhone').value = user.phone;
    }
};

function closeEditOverlay(){
    document.getElementById('editContactBoxOverlay').classList.add('hidden');
}

function closeAddOverlay(){
    document.getElementById('addContactBoxOverlay').classList.add('hidden');
}
            
async function editContact() {
    const changedName = document.getElementById('changedName').value.trim();
    const changedEmail = document.getElementById('changedEmail').value.trim();
    const changedPhone = document.getElementById('changedPhone').value.trim();
    const editLink = base_url + "users" + "/" + editKey;

    // Validierung der Eingabedaten
    if (!changedName || !changedEmail || !changedPhone) {
        alert("Bitte füllen Sie alle Felder aus.");
        return;
    }

    try {
        let userResponse = await fetch(editLink + ".json");
        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        let user = await userResponse.json();

        const data = {
            'color': user.color,
            'mail': changedEmail,
            'name': changedName,
            'password': user.password,
            'phone': changedPhone, // Ändere 'phone' in 'telephone', wenn nötig
        };

        const response = await fetch(editLink + ".json", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        loadContactData();
        contactDetails.innerHTML = '';
        closeEditOverlay();
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Bearbeiten des Kontakts:', error);
        alert('Es gab einen Fehler beim Bearbeiten des Kontakts. Bitte versuchen Sie es erneut.');
    }
}

function closeDetailsOverlay() {
    let contactDetailBoxOverlayOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlayOverlay.classList.remove('contactDetailBox');

    document.querySelectorAll('.contact').forEach(contact => {
        contact.classList.remove('selected');
    });
}
