// function animationWindow() {
//     const overlay = document.getElementById('overlay');
//     const animatedLogo = document.getElementById('animatedLogo');
//     const headerLogo = document.getElementById('headerLogo');

//     // Prüfen, ob die Animation bereits abgespielt wurde
//     if (!sessionStorage.getItem('animationPlayed')) {
//         // Starten der Animation
//         animatedLogo.addEventListener('animationend', () => {
//             overlay.style.display = 'none'; // Verstecke Overlay
//             headerLogo.src = animatedLogo.src; // Logo in den Header transferieren
//             headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
//         });

//         // Markieren, dass die Animation abgespielt wurde
//         sessionStorage.setItem('animationPlayed', 'true');
//     } else {
//         // Wenn die Animation bereits abgespielt wurde
//         overlay.style.display = 'none'; // Verstecke das Overlay
//         headerLogo.src = animatedLogo.src; // Header-Logo setzen
//         headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
//     }
// }




/**
 * This function manages the animation window on page load. 
 * It checks if the animation has already been played and updates the UI accordingly.
 */
function animationWindow() {
    const overlay = document.getElementById('overlay');
    const animatedLogo = document.getElementById('animatedLogo');
    const headerLogo = document.getElementById('headerLogo');

    if (!sessionStorage.getItem('animationPlayed')) {

        animatedLogo.addEventListener('animationend', () => {
            overlay.style.display = 'none'; // Verstecke Overlay
            headerLogo.src = animatedLogo.src; // Logo in den Header transferieren
            headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
            sessionStorage.setItem('animationPlayed', 'true');
        });
    } else {
        overlay.style.display = 'none'; // Verstecke das Overlay
        headerLogo.src = animatedLogo.src; // Header-Logo setzen
        headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
    }
}

/** Trigger the animation window function on page load */
window.onload = animationWindow;

/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const log_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

/**
 * This asynchronous function handles user login with an existing email and password.
 */
async function existingMailLogIn() {
    try {
        const users = await loadUsers();
        let mail = document.getElementById('email').value.toLowerCase();
        let password = document.getElementById('password').value;

        // Find user by E-Mail
        let user = users.find(u => u.mail === mail);

        if (user) {
            // if password fits, save user
            if (user.password === password) {
                let name = user.name;
                await saveUser(name, mail);
                window.location.href = './summary.html';
            } else {
                document.getElementById('loginErrorPassword').classList.remove('hidden');
                document.getElementById('passwordButten').classList.add('input-border');
            }
        } else {
            document.getElementById('loginErrorPassword').classList.remove('hidden');
        }
    } catch (error) {
        console.error("Fehler beim Anmelden:", error);
    }
}

/**
 * This asynchronous function loads all users from Firebase.
 * @returns {Array<Object>} An array of user objects containing name, email, and password.
 */
async function loadUsers() {
    try {
        const response = await fetch(`${log_base_url}/users.json`);
        const users = await response.json();

        // create an Array with user objects
        const usersArray = Object.values(users).map(userData => ({ name: userData.name, mail: userData.mail, password: userData.password }));
        console.log(usersArray);
        return usersArray;
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
        return [];
    }
}

/**
 * This asynchronous function saves the logged-in user's data to Firebase.
 * @param {string} name - The name of the logged-in user.
 * @param {string} mail - The email of the logged-in user.
 */
async function saveUser(name, mail) {
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
        localStorage.setItem('currentUser', mail);
    } catch (error) {
        console.error("Fehler beim Speichern des Benutzers:", error);
    }
}

/**
 * This asynchronous function logs in a guest user and redirects to the summary page.
 */

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

/**
 * This function changes the appearance of the password input field when focused.
 */
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

/**
 * This function changes the appearance of the email input field when focused.
 */
function changeEmail() {
    document.getElementById('emailContainer').classList.add('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
}

/**
 * This function toggles the visibility of the password input field between text and password types.
 */
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
