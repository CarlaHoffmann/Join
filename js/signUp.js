const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"


document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("animatedLogo");

    // Entferne und füge die Animation wieder hinzu, um sie zurückzusetzen
    logo.classList.remove("animate");
    void logo.offsetWidth; // Trigger a DOM reflow
    logo.classList.add("animate");
});


// Fügt einen neuen Benutzer hinzu, überprüft E-Mail und zeigt Fehler an
async function addUser() {
    document.getElementById('mailError').classList.add('hidden');
    document.getElementById('singupError').classList.add('hidden');
    existingMailSignUp();
}

// Überprüft, ob die eingegebene E-Mail bereits in der Datenbank existiert
async function existingMailSignUp() {
    const users = Object.entries(await loadUsers());
    let email = document.getElementById('email').value.toLowerCase();
    let user = users.find(u => u[1].mail == email);            
    if (user === undefined) {  
        matchPassword();
    } else {
        document.getElementById('mailError').classList.remove('hidden');  
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${base_url}/users.json`);
        const users = await response.json();

        // Erstelle ein Array von Kontakten
        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name }));
        console.log(contactsArray);
        return contactsArray;        
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
        return [];
    }
}

// Vergleicht Passwort und Bestätigungspasswort und fügt Benutzer hinzu, wenn sie übereinstimmen
async function matchPassword() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    if (password != confirmPassword) {
        document.getElementById('singupError').classList.remove('hidden');        
        document.getElementById('confirmPassword').classList.add('input-border');
    } else {
        createContact();
        successful();
    }
}

async function createContact() {
    let contact = {
        name: takeName(),
        mail: takeMail(),
        password: takePassword(),
        color: getColor()
    }
    console.log("Contact to be sent:", contact);
    await getLoggedIn();
    await postData(contact);
    // showSuccessMessage();
}

function takeName() {
    let name = document.getElementById('name');
    return name.value;
}

function takeMail() {
    let mail = document.getElementById('email');
    return mail.value;
}

function takePassword() {
    let password = document.getElementById('password');
    return password.value;
}

//made by Bastian
function getColor() {
    const rgbaColorArrays = [
        [255,122,0],
        [147,39,255],
        [110, 82, 255],
        [252, 113, 255],
        [255, 187, 43],
        [31,215,193]
    ];
    const random = Math.floor(Math.random() * ((rgbaColorArrays.length-1) - 0 + 1)) + 0;
    const randomColor = 'rgba(' + rgbaColorArrays[random] + ')';
    return randomColor; 
}

async function postData(contact) {
    try {
        let response = await fetch(base_url + "/users/" + ".json",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error posting data:", error);
    }
}

async function getLoggedIn() {
    let name = takeName();
    console.log(name);
    try {
        let response = await fetch(base_url + "/loggedIn/" + ".json",{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: name })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error Guest:", error);
    }
}

// Zeigt eine Erfolgsnachricht nach erfolgreicher Registrierung und leitet zur Startseite weiter
function successful() {
    let signupButton = document.getElementById('signupButton');
    let successMessage = document.getElementById('successMessage');
    signupButton.classList.add('cover-button');
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');
    setTimeout(() => {
        window.location.href = './summary.html';
    }, 1500);
}

// Setzt den Fokus auf das Namensfeld und aktualisiert die Darstellung
function changeName() {
    document.getElementById('nameContainer').classList.add('password_container_border');
    document.getElementById('emailContainer').classList.remove('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
    document.getElementById('confirmPasswordButten').classList.remove('password_container_border');
}

// Setzt den Fokus auf das E-Mail-Feld und aktualisiert die Darstellung
function changeEmail() {
    document.getElementById('nameContainer').classList.remove('password_container_border');
    document.getElementById('emailContainer').classList.add('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
    document.getElementById('confirmPasswordButten').classList.remove('password_container_border');
}

// Setzt den Fokus auf das Passwortfeld und aktualisiert die Darstellung
function changePassword() {
    document.getElementById('nameContainer').classList.remove('password_container_border');
    document.getElementById('emailContainer').classList.remove('password_container_border');
    document.getElementById('passwordButten').classList.add('password_container_border');
    document.getElementById('confirmPasswordButten').classList.remove('password_container_border');
    var x = document.getElementById("password");
    if (x.type === "password") {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('notSee').classList.remove('hidden');
    } else {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('notSee').classList.add('hidden');
    }
}

// Setzt den Fokus auf das Bestätigungspasswort-Feld und aktualisiert die Darstellung
function changeConfirmPassword() {
    document.getElementById('nameContainer').classList.remove('password_container_border');
    document.getElementById('emailContainer').classList.remove('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
    document.getElementById('confirmPasswordButten').classList.add('password_container_border');
    var x = document.getElementById("confirmPassword");
    if (x.type === "password") {
        document.getElementById('confirmpPasswordLock').classList.add('hidden');
        document.getElementById('notSeeConfirm').classList.remove('hidden');
    } else {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('notSeeConfirm').classList.add('hidden');
    }
}

// Wechselt die Sichtbarkeit des Passworts und aktualisiert das Icon
function togglePasswordVisibility() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById('lock').classList.remove('hidden');
      document.getElementById('notSee').classList.add('hidden');
    } else {
      x.type = "password";
      document.getElementById('lock').classList.add('hidden');
      document.getElementById('notSee').classList.remove('hidden');
    }
}

// Wechselt die Sichtbarkeit des Bestätigungspassworts und aktualisiert das Icon
function toggleConfirmPasswordVisibility() {
    var x = document.getElementById("confirmPassword");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById('seeConfirm').classList.remove('hidden');
      document.getElementById('notSeeConfirm').classList.add('hidden');
    } else {
      x.type = "password";
      document.getElementById('seeConfirm').classList.add('hidden');
      document.getElementById('notSeeConfirm').classList.remove('hidden');
    }
}

// Zeigt eine Erfolgsnachricht an und animiert sie
// function showSuccessMessage() {
//     const message = document.getElementById('successMessage');
//     message.classList.remove('hidden');
//     message.classList.add('animate');
// }