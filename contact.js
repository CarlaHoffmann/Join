let editKey = null;

const base_url = 'https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/';
let contactList = document.getElementById('contactList');
let contactDetails = document.getElementById('contactDetails');
let addContactButton = document.getElementById('addContactButton');
let addContactBox = document.getElementById('addContactBox');

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
    closeAddContactBox();
    clearAddContactFields();
    loadContactData();
}

function getNameInitials(name) {
    let nameParts = name.split(' ');
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}

function returnContactTemplate(key, name, email, phone, color){
    // console.log(email);
    return `
        <div class="detailsBox">
            <div class="contactHeader">
                <div style="background:${color}" class="circleDetails">${(getNameInitials(name))}</div>
                <div class='nameDetails'>
                    <p>${name}</p>
                    <div class="contactItemControls">
                        <div id="editContainer" onclick="toggleView('editContactBox', '${key}', true)"><img src="img/contact/edit.svg"><span>Edit</span></div>
                        <div id="deleteContainer" onclick="deleteContact('${key}')"><img src="img/contact/delete.svg"><span>Delete</span></div>
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
    contactDetails.innerHTML = returnContactTemplate(key, name, email, phone, color);
    contactDetailsOverlay.innerHTML = returnContactTemplate(key, name, email, phone, color);

    // Animation starten
    contactDetails.classList.add('show');
}

function showOverlayAddContact() {
    let contactDetailOverlayBox = document.getElementById('contactDetailOverlayBox');
    contactDetailOverlayBox.classList.add('contactDetailOverlayBox');
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
    //fills contactList
    usersArray.forEach(user => {
        contactList.innerHTML += `
            <div class="contact" onclick="showContact('${user.key}', '${user.name}', '${user.mail}', '${user.phone}', '${user.color}'), showOverlayAddContact()")>
                <div style="background:${user.color}" class="circle">${getNameInitials(user.name)}</div>
                <div class="contactInformation">
                    <p class="contactInformationName">${user.name}</p>
                    <p class="email">${user.mail}</p>
                </div>
            </div>
        `;
    });
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

function closeEditBox(){
    document.getElementById('editContactBox').classList.add('hidden');
}

function closeAddContactBox(){
    document.getElementById('addContactBox').classList.add('hidden');
}
            
async function editContact() {
    const changedName = document.getElementById('changedName').value.trim();
    const changedEmail = document.getElementById('changedEmail').value.trim();
    const changedPhone = document.getElementById('changedPhone').value.trim();
    console.log(editKey);
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
        closeEditBox();
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Bearbeiten des Kontakts:', error);
        alert('Es gab einen Fehler beim Bearbeiten des Kontakts. Bitte versuchen Sie es erneut.');
    }
}