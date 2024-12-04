let editKey = null;

const base_url = 'https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/';
let contactList = document.getElementById('contactList');
let contactDetails = document.getElementById('contactDetails');
let addContactButton = document.getElementById('addContactButton');
let addContactBox = document.getElementById('addContactBox');

function addContact(){
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let color = returnColor();
    let uploadData = {
        'name':name,
        'email':email,
        'phone':phone,
        'color':color,
    }
    createNewContact('/users', uploadData);
}

function getNameInitials(name) {
    let nameParts = name.split(' ');
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}

function returnContactTemplate(key, name, email, phone, color){
    return `
        <div>
            <div class="contactHeader">
                <div style="background:${color}" class="circle">${(getNameInitials(name))}</div>
                <div>
                    <p>${name}</p>
                    <div class="contactItemControls">
                        <div id="editContainer" onclick="toggleView('editContactBox', '${key}', ${true})"><img src="img/contact/edit.svg"><span>Edit</span></div>
                        <div id="deleteContainer" onclick="deleteContact('${key}')"><img src="img/contact/delete.svg"><span>Delete</span></div>
                    </div>
                </div>
            </div>
            <div class="contactFooter">
                <p>Contact Information</p>
                <b>Email</b>
                <p>${email}</p>
                <b>Phone</b>
                ${phone}
            </div>
        </div>
    `;
}

// function showContact(key, name, email, phone, color){
//     contactDetails.innerHTML = returnContactTemplate(key, name, email, phone, color);
// }
// function showContact(key, name, email, phone, color) {
//     // Zeige die Kontaktansicht an und füge die Klasse 'show' hinzu
//     const contactDetails = document.getElementById('contactDetails');
//     contactDetails.classList.add('show');
//     contactDetails.style.display = 'flex'; // Sicherstellen, dass es sichtbar ist

//     // Setze den Inhalt der Kontaktansicht
//     contactDetails.innerHTML = returnContactTemplate(key, name, email, phone, color);
// }
function showContact(key, name, email, phone, color) {
    const contactDetails = document.getElementById('contactDetails');

    // Inhalt setzen
    contactDetails.innerHTML = returnContactTemplate(key, name, email, phone, color);

    // Animation starten
    contactDetails.classList.add('show');
}


async function loadContactData(){
    
    let response = await fetch(base_url + ".json");
    let responseToJson = await response.json();
    let users = await responseToJson.users;
    let numberOfUser = Object.keys(users).length;
    let userKeys = Object.keys(users);
    
    for(let i = 0; i < numberOfUser; i++){
        let key = userKeys[i];
        // let user = users[key];
        let name = users[key].name;
        let mail = users[key].email;
        let phone = users[key].phone;
        let color = users[key].color;
        contactList.innerHTML += `
            <div class="contact" onclick="showContact('${key}', '${name}', '${mail}', '${phone}', '${color}')")>
                <div style="background:${color}" class="circle">${getNameInitials(name)}</div>
                <div class="contactInformation">
                    <h3>${name}</h3>
                </div>
            </div>
        `;
    }
}

loadContactData();
            
async function deleteContact(key){
    const deleteLink = base_url + "users" + "/" + key;
    const response = await fetch(deleteLink + ".json", {method:'DELETE'});
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
    document.getElementById(elementId).classList.toggle('hidden');
    if(edit){

        const editLink = base_url + "users" + "/" + editKey;
        let response = await fetch(editLink + ".json");
        let user = await response.json();

        document.getElementById('changedName').value = user.name;
        document.getElementById('changedEmail').value = user.email;
        document.getElementById('changedPhone').value = user.phone;
    }
};
            
async function editContact(){
    const changedName = document.getElementById('changedName').value;
    const changedEmail = document.getElementById('changedEmail').value;
    const changedPhone = document.getElementById('changedPhone').value;
    const data = {
        'name':changedName,
        'email':changedEmail,
        'phone':changedPhone,
    };
    const editLink = base_url + "users" + "/" + editKey + '.json';
    const response = await fetch(editLink, 
    {
        method:'PUT',
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}