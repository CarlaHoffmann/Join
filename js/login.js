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
    const isMobile = window.innerWidth <= 768;

    if (!overlay || !animatedLogo || !headerLogo) {
        return;
    }

    if(playAnimation) {
        console.log(playAnimation);
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
function toggleCheckbox(element) {
    const img = element.querySelector('.checkbox-icon');
    const isChecked = img.getAttribute('src') === './assets/img/general/checked_button.svg';

    // Toggle Zustand
    if (isChecked) {
        img.setAttribute('src', './assets/img/general/check_button.svg');
        element.dataset.checked = "false";
    } else {
        img.setAttribute('src', './assets/img/general/checked_button.svg');
        element.dataset.checked = "true";
    }
}


/**
 * Handles the login button click event, preventing default form submission and initiating login logic.
 * 
 * @function handleLoginClick
 * @param {Event} event - The click event triggered by the login button.
 * @returns {void}
 */

function handleLoginClick(event) {
    event.preventDefault(); // Verhindert das Standard-Submit-Event
    existingMailLogIn(); // Ruft die Login-Funktion auf
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
        const mailIsTrue = validateEmail();

        if (!mailIsTrue) {
            return;
        }
        const user = findUserByEmail(users);

        if (user) {
            await handleUserLogin(user);
        } else {
            showLoginError();
        }
    } catch (error) {
    }
}


/**
 * Validates the email input and displays an error message if the email is invalid.
 * 
 * @function validateEmail
 * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
 * 
 * @description
 * - Checks if the email input is non-empty and matches a standard email format using a regex pattern.
 * - Clears any existing error message if the email is valid.
 * - Displays an error message in the `emailError` container if the email is invalid.
 */
function validateEmail() {
    const emailInput = document.getElementById("email").value; // Get the value, not the element
    const errorContainer = document.getElementById("emailError");
    const emailError = `<span class="error-message">Check your email. Please try again.</span>`;
    // const emailError = "Check your email. Please try again.";
    let test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);

    if (emailInput !== '' && test) {
        errorContainer.innerHTML = ''; 
        return true;
    } else {
        errorContainer.innerHTML = emailError;
        return false;
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
function findUserByEmail(users) {
    const email = document.getElementById("email").value;
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
async function handleUserLogin(user) {
    const passwordInput = document.getElementById("password").value;
    const errorContainer = document.getElementById("passwordError");
    const passwordError = `<span class="error-message">Check your password. Please try again.</span>`;
    // const passwordError = "Check your password. Please try again.";
    if (user.password === passwordInput) {
        await saveUser(user.name, user.mail);
        redirectToSummary();
    } else {
        errorContainer.innerHTML = passwordError;
    }
}


/**
 * Redirects the user to the summary page.
 * 
 * @function redirectToSummary
 * @returns {void}
 */
function redirectToSummary() {
    window.location.href = './summary.html';
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
        return usersArray;
    } catch (error) {
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
        let response = await fetch(log_base_url + "/loggedIn/" + ".json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();
    } catch (error) {
    }
}


/**
 * Logs in a guest user by sending a "Guest" user entry to the database and redirects to the summary page.
 * 
 * @async
 * @function guestLogin
 * @returns {Promise<void>}
 * 
 * @description
 * - Sends a `PUT` request to update the "loggedIn" entry with the guest user's information.
 * - Redirects to the summary page (`summary.html`) upon successful request completion.
 * - Handles errors silently without displaying them to the user.
 */
async function guestLogin() {
    try {
        let response = await fetch(log_base_url + "/loggedIn/" + ".json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Guest" })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();
    } catch (error) {
    }
    window.location.href = './summary.html';
}


/**
 * This function changes the appearance of the email input field when focused.
 */
function changeEmail() {
    document.getElementById('emailContainer').classList.add('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
}


/**
 * Handles the password input field's state, toggling the lock icon and visibility button based on the input value.
 * 
 * @function handlePasswordInput
 * @returns {void}
 * 
 * @description
 * - Hides the lock icon and shows the visibility toggle button when the password input field is not empty.
 * - Displays the lock icon and hides the visibility toggle button when the password input field is empty.
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
 * Toggles the visibility of the password field and updates the visibility icons.
 * 
 * @function togglePasswordVisibility
 * @returns {void}
 * 
 * @description
 * - Changes the `type` attribute of the password input field between "password" and "text".
 * - Toggles the visibility of the "not see" and "see" icons accordingly.
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

/**
 * Saves the login credentials to local storage if "Remember Me" is checked.
 * @function saveCredentials
 */
function saveCredentials() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.querySelector('.checkbox-container').dataset.checked === "true";

    if (rememberMe) {
        localStorage.setItem("rememberMe", JSON.stringify({ email, password }));
    } else {
        localStorage.removeItem("rememberMe");
    }
}

/**
 * Loads and autofills login credentials from local storage if "Remember Me" was previously selected.
 * @function loadCredentials
 */
function loadCredentials() {
    const savedCredentials = JSON.parse(localStorage.getItem("rememberMe"));

    if (savedCredentials) {
        document.getElementById("email").value = savedCredentials.email;
        document.getElementById("password").value = savedCredentials.password;

        const checkboxIcon = document.querySelector('.checkbox-icon');
        checkboxIcon.src = './assets/img/general/checked_button.svg';
        document.querySelector('.checkbox-container').dataset.checked = "true";
    }
}

/**
 * Modifies the handleLoginClick function to include saveCredentials.
 * Handles the login button click event, preventing default form submission and initiating login logic.
 * @function handleLoginClick
 * @param {Event} event - The click event triggered by the login button.
 * @returns {void}
 */
function handleLoginClick(event) {
    event.preventDefault(); 
    saveCredentials();      
    existingMailLogIn();
}

// Load credentials on page load
document.addEventListener("DOMContentLoaded", loadCredentials);