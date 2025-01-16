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

// function logIn() {
    
document.addEventListener("DOMContentLoaded", () => {
    // Elements for Login and Sign-Up
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const loginButton = document.getElementById("login_button_color");
    const signUpButton = document.getElementById("signupButton");
    const emailContainer = document.getElementById("emailContainer");
    const passwordContainer = document.getElementById("passwordButten");
    const confirmPasswordContainer = document.getElementById("confirmPasswordButten");

    // Error messages
    const emailError = createErrorMessage("Check your email. Please try again.");
    const passwordError = createErrorMessage("Check your password. Please try again.");
    const confirmPasswordError = createErrorMessage("Your passwords don't match. Please try again.");

    // // Attach error messages
    // attachErrorMessage(emailContainer, emailError);
    // attachErrorMessage(passwordContainer, passwordError);
    // if (confirmPasswordContainer) attachErrorMessage(confirmPasswordContainer, confirmPasswordError);

    // Event Listeners for Login and Sign-Up
    loginButton?.addEventListener("click", (e) => {
        e.preventDefault();
        handleValidation(emailInput.value.trim(), passwordInput.value.trim(), null, false);
    });

    signUpButton?.addEventListener("click", (e) => {
        e.preventDefault();
        handleValidation(emailInput.value.trim(), passwordInput.value.trim(), confirmPasswordInput?.value.trim(), true);
    });
});
// }

/**
 * Handles validation for login and sign-up forms.
 * @param {string} email - The email input value.
 * @param {string} password - The password input value.
 * @param {string|null} confirmPassword - The confirm password input value (if sign-up).
 * @param {boolean} isSignUp - Indicates if it's a sign-up operation.
 */
function handleValidation(email, password, confirmPassword, isSignUp) {
    const emailContainer = document.getElementById("emailContainer");
    const emailError = createErrorMessage("Check your email. Please try again.");
    const passwordContainer = document.getElementById("passwordButten");
    const passwordError = createErrorMessage("Check your password. Please try again.");
    const confirmPasswordContainer = document.getElementById("confirmPasswordButten");

    // Attach error messages
    attachErrorMessage(emailContainer, emailError);
    attachErrorMessage(passwordContainer, passwordError);
    if (confirmPasswordContainer) attachErrorMessage(confirmPasswordContainer, confirmPasswordError);

    // Email validation bleibt bestehen
    validateField(validateEmail(email), emailContainer, emailError);

    if (isSignUp) {
        // Passwort-Längenprüfung entfernt
        validateField(password !== '', passwordContainer, passwordError); 
        validateField(password === confirmPassword, confirmPasswordContainer, confirmPasswordError);
    } else {
        validateField(password !== '', passwordContainer, passwordError); // Nur prüfen, ob Passwort eingegeben wurde
    }
}

/**
 * Validates a field and displays appropriate feedback.
 * @param {boolean} condition - Validation condition.
 * @param {HTMLElement} container - The input container element.
 * @param {HTMLElement} errorElement - The error message element.
 */
function validateField(condition, container, errorElement) {
    if (condition) {
        hideError(container, errorElement);
        displayValid(container);
    } else {
        displayError(container, errorElement);
        hideValid(container);
    }
}

/**
 * Creates an error message element.
 * @param {string} message - The error message text.
 * @returns {HTMLElement} The created error message element.
 */
function createErrorMessage(message) {
    const error = document.createElement("span");
    error.className = "error-message";
    error.textContent = message;
    return error;
}

/**
 * Attaches an error message element after a container.
 * @param {HTMLElement} container - The input container element.
 * @param {HTMLElement} errorElement - The error message element.
 */
function attachErrorMessage(container, errorElement) {
    container.parentNode.insertBefore(errorElement, container.nextSibling);
}

/**
 * Displays an error message.
 * @param {HTMLElement} container - The input container element.
 * @param {HTMLElement} errorElement - The error message element.
 */
function displayError(container, errorElement) {
    container.classList.add("input-border");
    errorElement.style.display = "block";
}

/**
 * Hides an error message.
 * @param {HTMLElement} container - The input container element.
 * @param {HTMLElement} errorElement - The error message element.
 */
function hideError(container, errorElement) {
    container.classList.remove("input-border");
    errorElement.style.display = "none";
}

/**
 * Highlights a valid input.
 * @param {HTMLElement} container - The input container element.
 */
function displayValid(container) {
    container.classList.add("valid-input");
}

/**
 * Removes the valid input highlight.
 * @param {HTMLElement} container - The input container element.
 */
function hideValid(container) {
    container.classList.remove("valid-input");
}

/**
 * Validates an email address format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



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
// function changePassword() {
//     document.getElementById('passwordButten').classList.add('password_container_border');
//     document.getElementById('emailContainer').classList.remove('password_container_border');
//     var x = document.getElementById("password");
//     if (x.type === "password") {
//         document.getElementById('passwordLock').classList.add('hidden');
//         document.getElementById('unlock').classList.remove('hidden');
//     } else {
//         document.getElementById('passwordLock').classList.add('hidden');
//         document.getElementById('unlock').classList.add('hidden');
//     }
// }

/**
 * This function changes the appearance of the email input field when focused.
 */
function changeEmail() {
    document.getElementById('emailContainer').classList.add('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
}


/**
 * Handles changes in the password input field.
 * Displays or hides the lock icon and the visibility toggle button 
 * depending on whether the input field contains text.
 */
function handlePasswordInput() {
    const passwordInput = document.getElementById("password");
    const lockIcon = document.getElementById("passwordLock");
    const visibilityButton = document.getElementById("visibilityButton");

    if (passwordInput.value.trim() !== "") {
        lockIcon.style.display = "none";
        visibilityButton.classList.remove("hidden");
    } else {
        lockIcon.style.display = "block";
        visibilityButton.classList.add("hidden");
    }
}

/**
 * Toggles the visibility of the password input field.
 * Switches between masked (password) and unmasked (text) input types
 * and updates the visibility icons accordingly.
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
