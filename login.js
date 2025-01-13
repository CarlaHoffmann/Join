/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const log_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"


/**
 * Manages the animation of the overlay and logo based on page reload or navigation type.
 * 
 * - Plays the animation if the page is reloaded.
 * - Skips the animation and directly displays the header logo on navigation.
 * - Transfers the animated logo to the header once the animation ends.
 * 
 * @function animationWindow
 * @returns {void}
 */
function animationWindow() {
    const overlay = document.getElementById('overlay');
    const animatedLogo = document.getElementById('animatedLogo');
    const headerLogo = document.getElementById('headerLogo');

    if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
        animatedLogo.addEventListener('animationend', () => {
            overlay.style.display = 'none';
            headerLogo.src = animatedLogo.src;
            headerLogo.style.display = 'block';
        });
    } else {
        overlay.style.display = 'none';
        headerLogo.src = animatedLogo.src;
        headerLogo.style.display = 'block';
    }
}


/**
 * Toggles the state of a checkbox by updating its icon and associated data attribute.
 * 
 * - Changes the `src` attribute of the checkbox icon based on the current state.
 * - Updates the `data-checked` attribute to reflect the checkbox's state.
 * 
 * @function toggleCheckbox
 * @param {Element} element - The checkbox container element that contains the icon to toggle.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', animationWindow);

function toggleCheckbox(element) {
    const img = element.querySelector('.checkbox-icon');
    const isChecked = img.getAttribute('src') === 'assets/img/general/checked_button.svg';

    // Toggle Zustand
    if (isChecked) {
        img.setAttribute('src', 'assets/img/general/check_button.svg');
        element.dataset.checked = "false";
    } else {
        img.setAttribute('src', 'assets/img/general/checked_button.svg');
        element.dataset.checked = "true";
    }
}

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
