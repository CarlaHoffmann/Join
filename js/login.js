/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const log_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"


/**
 * Manages the animation of the overlay and logo based on page load or navigation type.
 * 
 * - Always plays the animation when the page or login.js is loaded.
 * - Skips the animation and directly displays the header logo if it's already loaded (no animation on page navigation).
 * - Transfers the animated logo to the header once the animation ends.
 * 
 * @function animationWindow
 * @returns {void}
 */
function animationWindow() {
    const overlay = document.getElementById('overlay');
    const animatedLogo = document.getElementById('animatedLogo');
    const headerLogo = document.getElementById('headerLogo');

    if (!overlay || !animatedLogo || !headerLogo) {
        return;
    }
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        animatedLogo.src = './assets/img/general/logo.svg';

        animatedLogo.addEventListener('animationend', () => {
            animatedLogo.src = './assets/img/login/login-logo.svg';
            headerLogo.src = animatedLogo.src;
            headerLogo.style.display = 'block';
            overlay.style.display = 'none';
        });
    } else {
        animatedLogo.addEventListener('animationend', () => {
            overlay.style.display = 'none';
            headerLogo.src = animatedLogo.src;
            headerLogo.style.display = 'block';
        });
    }
}

// Call the animation function when the page is loaded
document.addEventListener('DOMContentLoaded', animationWindow);

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

// new
document.addEventListener("DOMContentLoaded", () => {
    // Elements for Login and Sign-Up
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword"); // Optional for login
    const loginButton = document.getElementById("login_button_color");
    const signUpButton = document.getElementById("signupButton");
    const emailContainer = document.getElementById("emailContainer");
    const passwordContainer = document.getElementById("passwordButten");
    const confirmPasswordContainer = document.getElementById("confirmPasswordButten");

    // Error messages
    const emailError = createErrorMessage("Check your email. Please try again.");
    const passwordError = createErrorMessage("Check your password. Please try again.");
    const confirmPasswordError = createErrorMessage("Passwords do not match. Please try again.");

    // Attach error messages
    attachErrorMessage(emailContainer, emailError);
    attachErrorMessage(passwordContainer, passwordError);
    if (confirmPasswordContainer) {
        attachErrorMessage(confirmPasswordContainer, confirmPasswordError);
    }

    // Event Listeners for Login and Sign-Up
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            handleValidation({
                emailValue: emailInput.value.trim(),
                passwordValue: passwordInput.value.trim(),
                confirmPasswordValue: null,
                isSignUp: false,
            });
        });
    }

    if (signUpButton) {
        signUpButton.addEventListener("click", (e) => {
            e.preventDefault();
            handleValidation({
                emailValue: emailInput.value.trim(),
                passwordValue: passwordInput.value.trim(),
                confirmPasswordValue: confirmPasswordInput?.value.trim(),
                isSignUp: true,
            });
        });
    }

function handleValidation({ emailValue, passwordValue, confirmPasswordValue, isSignUp }) {
    let isValid = true;

    // Validate Email
    if (!validateEmail(emailValue)) {
        displayError(emailContainer, emailError);
        hideValid(emailContainer);
        isValid = false;
    } else {
        hideError(emailContainer, emailError);
        displayValid(emailContainer);
    }

    // Validate Password
    if (passwordValue.length < 6) {
        displayError(passwordContainer, passwordError);
        hideValid(passwordContainer);
        isValid = false;
    } else {
        hideError(passwordContainer, passwordError);
        displayValid(passwordContainer);
    }

    // Validate Confirm Password (if sign-up)
    if (isSignUp && confirmPasswordValue !== passwordValue) {
        displayError(confirmPasswordContainer, confirmPasswordError);
        hideValid(confirmPasswordContainer);
        isValid = false;
    } else if (isSignUp) {
        hideError(confirmPasswordContainer, confirmPasswordError);
        displayValid(confirmPasswordContainer);
    }

    return isValid;
}

function createErrorMessage(message) {
    const error = document.createElement("span");
    error.className = "error-message";
    error.textContent = message;
    return error;
}

function attachErrorMessage(container, errorElement) {
    container.parentNode.insertBefore(errorElement, container.nextSibling);
}

function displayError(container, errorElement) {
    container.classList.add("input-border");
    errorElement.style.display = "block";
}

function hideError(container, errorElement) {
    container.classList.remove("input-border");
    errorElement.style.display = "none";
}

function displayValid(container) {
    container.classList.add("valid-input");
}

function hideValid(container) {
    container.classList.remove("valid-input");
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

});

/**
 * Handles the login process for an existing user.
 * Loads users, checks credentials, and manages the login flow.
 * @async
 * @function
 * @throws {Error} If there's an error during the login process
 */
async function existingMailLogIn() {
    try {
        const users = await loadUsers();
        const { mail, password } = getLoginCredentials();
        const user = findUserByEmail(users, mail);

        if (user) {
            await handleUserLogin(user, password);
        } else {
            showLoginError();
        }
    } catch (error) {
        console.error("Fehler beim Anmelden:", error);
    }
}

/**
 * Retrieves login credentials from the input fields.
 * @function
 * @returns {{mail: string, password: string}} An object containing the email and password
 */
function getLoginCredentials() {
    const mail = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    return { mail, password };
}

/**
 * Finds a user by their email address in the users array.
 * @function
 * @param {Array} users - The array of user objects
 * @param {string} email - The email address to search for
 * @returns {Object|undefined} The user object if found, undefined otherwise
 */
function findUserByEmail(users, email) {
    return users.find(u => u.mail === email);
}

/**
 * Handles the login process for a specific user.
 * Checks the password, saves the user if correct, and manages redirection or error display.
 * @async
 * @function
 * @param {Object} user - The user object
 * @param {string} password - The password to check
 */
async function handleUserLogin(user, password) {
    if (user.password === password) {
        await saveUser(user.name, user.mail);
        redirectToSummary();
    } else {
        showPasswordError();
    }
}

/**
 * Redirects the user to the summary page.
 * @function
 */
function redirectToSummary() {
    window.location.href = './summary.html';
}

/**
 * Displays an error message for incorrect password.
 * @function
 */
function showPasswordError() {
    document.getElementById('loginErrorPassword').classList.remove('hidden');
    document.getElementById('passwordButten').classList.add('input-border');
}

/**
 * Displays a general login error message.
 * @function
 */
function showLoginError() {
    document.getElementById('loginErrorPassword').classList.remove('hidden');
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
 * Handles the visibility of the lock and visibility icons based on input content.
 */
function handlePasswordInput() {
    const passwordInput = document.getElementById("password");
    const lockIcon = document.getElementById("passwordLock");
    const visibilityButton = document.getElementById("visibilityButton");

    if (passwordInput.value.trim() !== "") {
        // Hide the lock icon and show the visibility toggle
        lockIcon.style.display = "none";
        visibilityButton.classList.remove("hidden");
    } else {
        // Show the lock icon and hide the visibility toggle
        lockIcon.style.display = "block";
        visibilityButton.classList.add("hidden");
    }
}

/**
 * Toggles the visibility of the password input field.
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const notSeeIcon = document.getElementById("notSee");
    const seeIcon = document.getElementById("see");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        notSeeIcon.classList.add("hidden");
        seeIcon.classList.remove("hidden");
    } else {
        passwordInput.type = "password";
        notSeeIcon.classList.remove("hidden");
        seeIcon.classList.add("hidden");
    }
}
