/**
 * The base URL for the Firebase Realtime Database used by the application.
 * 
 * This URL is used for interacting with the database, specifically for reading and writing data.
 * 
 * @constant {string} base_url - The base URL of the Firebase Realtime Database.
 */
const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

const signUpName = '';

async function handleSignUpClick(event) {
    event.preventDefault(); // Verhindert das Standard-Submit-Event
    const checkboxContainer = document.getElementById('checkbox-container');
    const isChecked = checkboxContainer.getAttribute('data-checked') === 'true';
    console.log(isChecked);
    if(isChecked) {
        const users = await loadUsers();
        const usableData = validateSignUp(users);
        console.log(usableData);
        if (usableData === true) {
            if(await createContact()) {
                showSuccessMessage();
                await getLoggedIn();
            }

            console.log('User is valid. Submitting...');
        }
    } else {
        alert('Please accept Privacy Policy');
    }
}

/**
 * Loads the list of users from the database and returns an array of user objects.
 * 
 * - Fetches the users from the Firebase database.
 * - Maps the data into an array of user objects containing the user ID and name.
 * - In case of an error (e.g., network failure), returns an empty array.
 * 
 * @async
 * @function loadUsers
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects with `id` and `name` properties.
 */
async function loadUsers() {
    try {
        const response = await fetch(`${base_url}/users.json`);
        const users = await response.json();

        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name, mail: userData.mail }));
        console.log(contactsArray);
        return contactsArray;        
    } catch (error) {
        return [];
    }
}

function validateSignUp(users) {
    let nameError = document.getElementById('name-error');
    const userName = document.getElementById('name');
    if(userName.value != '') {
        const isEmailValid = checkExistingMail(users);
        if (!isEmailValid) {
            return false; // Wenn E-Mail ungültig ist, hier abbrechen
        }
        // Nur wenn E-Mail gültig ist, Passwort überprüfen
        let checkedPassword = checkSignUpPassword();
        console.log(checkedPassword);
        if(checkedPassword) {
            return true;
        }
    } else {
        nameError.innerHTML = "Please insert a name. Please try again.";
        return;
    }
}

function checkExistingMail(users) {
    let mailError = document.getElementById('mail-error');
    try {
        // const users = await loadUsers();
        const mailIsValid = validateSignUpEmail();
        
        if (mailIsValid) {
            const user = findSignUpUserByEmail(users); // Pass email to the function
            console.log(user);
            if (user) {
                mailError.innerHTML = "Check your email and password. Please try again.";
                return false;
            } else {
                mailError.innerHTML = ""; // Clear error message if email is valid and not registered
                return true;
            }
        } else {
            mailError.innerHTML = "Please enter a valid email address.";
            return false;
        }
    } catch (error) {
        return false;
    }
}

function validateSignUpEmail() {
    const emailInput = document.getElementById("email").value; // Get the value, not the element
    const errorContainer = document.getElementById("mail-error");
    const emailError = `<span class="error-message">Check your email. Please try again.</span>`;
    // const emailError = "Check your email. Please try again.";
    let test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
    
    if(emailInput !== '' && test) {
        errorContainer.innerHTML = ''; // Clear any existing error message
        return true;
    } else {
        errorContainer.innerHTML = emailError;
        return false;
    }
}

function findSignUpUserByEmail(users) {
    const email = document.getElementById("email").value;
    let user = users.find(u => u.mail === email);
    console.log(user);
    if(user) {
        return true;
    } else {
        return false;
    }
}

function checkSignUpPassword() {
    let password1 = document.getElementById('password').value;
    let password2 = document.getElementById('confirmPassword').value;
    let passwordError1 = document.getElementById('pw-error-1');
    let passwordError2 = document.getElementById('pw-error-2');
    if(password1 != '') {
        if(password1 === password2) {
            return true;
        } else {
            passwordError2.innerHTML = "Your passwords don't match. Please try again.";
            return false;
        }
    } else {
        passwordError1.innerHTML = "Please insert a password.";
        return false;
    }
}

/**
 * Creates a new contact by gathering the input data and saving it to the system.
 * 
 * - Collects the contact's name, email, password, and color.
 * - Ensures the user is logged in by calling `getLoggedIn`.
 * - Sends the contact data to the server via the `postData` function.
 * 
 * @async
 * @function createContact
 * @returns {Promise<void>} Resolves after the contact data is successfully posted to the server.
 */
async function createContact() {
    let contact = {
        name: takeName(),
        mail: takeMail(),
        password: takePassword(),
        color: returnColor()
    }
    await postData(contact);
}

/**
 * Retrieves the value of the name input field.
 * 
 * - Gets the value entered by the user in the name field of the form.
 * 
 * @function takeName
 * @returns {string} The value of the name input field.
 */
function takeName() {
    let name = document.getElementById('name');
    // signUpName = name;
    return name.value;
}

/**
 * Retrieves the value of the email input field.
 * 
 * - Gets the value entered by the user in the email field of the form.
 * 
 * @function takeMail
 * @returns {string} The value of the email input field.
 */
function takeMail() {
    let mail = document.getElementById('email');
    return mail.value;
}

/**
 * Retrieves the value of the password input field.
 * 
 * - Gets the value entered by the user in the password field of the form.
 * 
 * @function takePassword
 * @returns {string} The value of the password input field.
 */
function takePassword() {
    let password = document.getElementById('password');
    return password.value;
}

/**
 * Sends the contact data to the Firebase database by posting it to the users endpoint.
 * 
 * - Converts the contact object to a JSON string and sends it to the server using the POST method.
 * - Handles errors by throwing an exception if the response is not OK.
 * 
 * @async
 * @function postData
 * @param {Object} contact - The contact data to be sent to the server.
 * @returns {Promise<void>} Resolves when the data is successfully posted, or catches an error if the request fails.
 */
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
    }
}

/**
 * Sends the logged-in user's name to the server to update the logged-in status.
 * 
 * - Retrieves the user's name from the form and sends it to the server as part of the request body.
 * - If the request fails, logs an error message.
 * 
 * @async
 * @function getLoggedIn
 * @returns {Promise<void>} Resolves when the logged-in status is successfully updated.
 */
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
    }
}

function handlePasswordInputSignUp() {
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

function handleConfirmPasswordInputSignUp() {
    const passwordInput = document.getElementById("confirmPassword");
    const lockIcon = document.getElementById("confirmPasswordLock");
    const visibilityButton = document.getElementById("confirmVisibilityButton");

    if (passwordInput.value.trim() !== "") {
        lockIcon.style.display = "none";
        visibilityButton.classList.remove("hidden");
    } else {
        lockIcon.style.display = "block";
        visibilityButton.classList.add("hidden");
    }
}

/**
 * Toggles the visibility of the password field between "password" and "text".
 * 
 * - If the password is hidden, it is revealed by changing the input type to "text".
 * - If the password is visible, it is hidden by changing the input type to "password".
 * - Updates the visibility of the lock and visibility icons accordingly.
 * 
 * @function togglePasswordVisibility
 * @returns {void}
 */
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


/**
 * Toggles the visibility of the confirm password field between "password" and "text".
 * 
 * - If the confirm password is hidden, it is revealed by changing the input type to "text".
 * - If the confirm password is visible, it is hidden by changing the input type to "password".
 * - Updates the visibility of the confirmation password icons accordingly.
 * 
 * @function toggleConfirmPasswordVisibility
 * @returns {void}
 */
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

function toggleCheckboxPrivacyPolicy(element) {
    const img = element.querySelector('.checkbox-icon');
    const isChecked = img.getAttribute('src') === 'assets/img/general/checked_button.svg';

    // Toggle Zustand
    if (isChecked) {
        img.setAttribute('src', 'assets/img/general/check_button.svg');
        element.dataset.checked = "false";
        // element.setAttribute('value', 'false');
    } else {
        img.setAttribute('src', 'assets/img/general/checked_button.svg');
        element.dataset.checked = "true";
        // element.setAttribute('value', 'true');
    }
}

// anpassen für SignUp
async function showSuccessMessage() {
        successOverlay.classList.add("show");
        successMessage.style.display = "block";

        setTimeout(() => {
            successMessage.classList.add("hide"); 
            successOverlay.classList.remove("show");

            setTimeout(() => {
                successMessage.style.display = "none"; 
                successOverlay.classList.remove("show");
                redirectToSummary();
            },); 
        }, 1600); // visible 2 sec
}