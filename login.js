


const log_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

function animationWindow() {
    const overlay = document.getElementById('overlay');
    const animatedLogo = document.getElementById('animatedLogo');
    const headerLogo = document.getElementById('headerLogo');

    // Prüfen, ob die Animation bereits abgespielt wurde
    if (!sessionStorage.getItem('animationPlayed')) {
        animatedLogo.addEventListener('animationend', () => {
            overlay.style.display = 'none'; // Verstecke Overlay
            headerLogo.src = animatedLogo.src; // Übertrage Logo in den Header
            headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
            sessionStorage.setItem('animationPlayed', 'true'); // Status speichern
        });
    } else {
        // Wenn die Animation bereits abgespielt wurde
        overlay.style.display = 'none'; // Verstecke Overlay
        headerLogo.src = animatedLogo.src; // Logo in den Header übertragen
        headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
    }
}

// Starte Animation beim Laden der Seite
window.onload = animationWindow;


// Starte Animation beim Laden der Seite
window.onload = animationWindow;


async function loadUsers() {
    try {
        const response = await fetch(`${log_base_url}/users.json`);
        const users = await response.json();

        // create an Array with user objects
        const usersArray = Object.values(users).map(userData => ({ name: userData.name, email: userData.mail, password: userData.password }));
        console.log(usersArray);
        return usersArray;
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
        return [];
    }
}

async function saveUser(name, email) {
    try {
        let response = await fetch(log_base_url + "/loggedIn/" + ".json",{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: name })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();
        console.log("Guest logged in:", result);
        // Zum Beispiel mit localStorage
        localStorage.setItem('currentUser', email);
    } catch (error) {
        console.error("Fehler beim Speichern des Benutzers:", error);
    }
}

async function guestLogin() {
    try {
        let response = await fetch(log_base_url + "/loggedIn/" + ".json",{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: "Guest" })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();
        console.log("Guest logged in:", result);
    } catch (error) {
        console.error("Error Guest:", error);
    }
    window.location.href = './summary.html';
}

function changePassword() {
    document.getElementById('passwordButten').classList.add('password_container_border');
    document.getElementById('emailContainer').classList.remove('password_container_border');
    var x = document.getElementById("password");
    if (x.type === "password") {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('unlock').classList.remove('hidden');
    } else {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('unlock').classList.add('hidden');
    }
}

function changeEmail() {
    document.getElementById('emailContainer').classList.add('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
}

function togglePasswordVisibility() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById('lock').classList.remove('hidden');
      document.getElementById('unlock').classList.add('hidden');
    } else {
      x.type = "password";
      document.getElementById('lock').classList.add('hidden');
      document.getElementById('unlock').classList.remove('hidden');
    }
}
