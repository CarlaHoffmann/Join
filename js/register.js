// Fügt einen neuen Benutzer hinzu, überprüft E-Mail und zeigt Fehler an
async function addUser() {
    document.getElementById('mailError').classList.add('hidden');
    document.getElementById('singupError').classList.add('hidden');
    existingMailSignUp();
}

// Überprüft, ob die eingegebene E-Mail bereits in der Datenbank existiert
async function existingMailSignUp() {
    users = Object.entries(await loadData('users'));
    let email = document.getElementById('email').value.toLowerCase();
    let user = users.find(u => u[1].mail == email);            
    if (user === undefined) {  
        matchPassword();
    } else {
        document.getElementById('mailError').classList.remove('hidden');  
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
        let name = document.getElementById('name');
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        let colorAllocation = getRandomItem(colors);
        let firstLetters = getContactsInitials(name.value);
        await postData('users', { name: name.value, mail: email.value, password: password.value });
        await postData(`contacts`, { name: capitalizeFirstLetters(name.value), mail: email.value, phone: '', color: colorAllocation, letters: firstLetters });
        successful();
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
        window.location.href = './index.html';
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
function showMessage() {
    const message = document.getElementById('successMessage');
    message.classList.remove('hidden');
    message.classList.add('animate');
}
