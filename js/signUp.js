

/**
 * Validates the sign-up form by checking the user's name, email, and password.
 * 
 * @function validateSignUp
 * @param {Object} users - An object containing existing user data for validation.
 * @returns {boolean} - Returns `true` if the sign-up validation is successful, otherwise `false`.
 */
function validateSignUp(users) {
    let nameError = document.getElementById('name-error');
    const userName = document.getElementById('name');
    if(userName.value != '') {
        const isEmailValid = checkExistingMail(users);
        if (!isEmailValid) {
            return false; 
        }
        let checkedPassword = checkSignUpPassword();
        if(checkedPassword) {
            return true;
        }
    } else {
        nameError.innerHTML = "Please insert a name. Please try again.";
        return;
    }
}


/**
 * Validates the email input and displays an error message if invalid.
 *
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function validateEmailAndShowError() {
    const mailError = document.getElementById('mail-error');
    const mailIsValid = validateSignUpEmail();

    if (!mailIsValid) {
        mailError.innerHTML = "Please enter a valid email address.";
        return false;
    }

    mailError.innerHTML = ""; 
    return true;
}


/**
 * Checks if a user with the provided email exists and displays an error message if so.
 *
 * @param {Array} users - Array of user objects to search through.
 * @returns {boolean} True if no user with the email exists, otherwise false.
 */
function findUserByEmailAndShowError(users) {
    const mailError = document.getElementById('mail-error');
    const user = findSignUpUserByEmail(users);

    if (user) {
        mailError.innerHTML = "Check your email and password. Please try again.";
        return false;
    }
    mailError.innerHTML = ""; 
    return true;
}


/**
 * Checks if a given email is valid and does not already exist in the user list.
 *
 * @param {Array} users - Array of user objects to search through.
 * @returns {boolean} True if the email is valid and does not exist, otherwise false.
 */
function checkExistingMail(users) {
    try {
        if (!validateEmailAndShowError()) {
            return false;
        }
        return findUserByEmailAndShowError(users);
    } catch (error) {
        console.error("An error occurred while checking the email:", error);
        return false;
    }
}


/**
 * Validates the email input during sign-up and displays an error message if invalid.
 * 
 * @function validateSignUpEmail
 * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
 */
function validateSignUpEmail() {
    const emailInput = document.getElementById("email").value; // Get the value, not the element
    const errorContainer = document.getElementById("mail-error");
    const emailError = `<span class="error-message">Check your email. Please try again.</span>`;

    let test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
    
    if(emailInput !== '' && test) {
        errorContainer.innerHTML = ''; 
        return true;
    } else {
        errorContainer.innerHTML = emailError;
        return false;
    }
}

/**
 * Finds a user in the database by their email during sign-up.
 * 
 * @function findSignUpUserByEmail
 * @param {Array<Object>} users - An array of user objects containing email data.
 * @returns {boolean} - Returns `true` if a user with the given email is found, otherwise `false`.
 */
function findSignUpUserByEmail(users) {
    const email = document.getElementById("email").value;
    let user = users.find(u => u.mail === email);

    if(user) {
        return true;
    } else {
        return false;
    }
}

/**
 * Validates the sign-up passwords, ensuring they are non-empty and match.
 * 
 * @function checkSignUpPassword
 * @returns {boolean} - Returns `true` if the passwords are valid and match, otherwise `false`.
 */
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
 * Retrieves the value of the name input field.
 * 
 * @function takeName
 * @returns {string} - The value of the name input field.
 */
function takeName() {
    let name = document.getElementById('name');
    // signUpName = name;
    return name.value;
}

/**
 * Retrieves the value of the email input field.
 * 
 * @function takeMail
 * @returns {string} - The value of the email input field.
 */
function takeMail() {
    let mail = document.getElementById('email');
    return mail.value;
}

/**
 * Retrieves the value of the password input field.
 * 
 * @function takePassword
 * @returns {string} - The value of the password input field.
 */
function takePassword() {
    let password = document.getElementById('password');
    return password.value;
}

/**
 * Closes the privacy modal by removing the "show" class.
 * 
 * @function closeModal
 * @returns {void}
 */
function closeModal() {
    const privacyModal = document.getElementById('privacy-modal');
    privacyModal.classList.remove('show');
}


/**
 * Handles the visibility toggle button and lock icon for the password input field.
 * 
 * @function handlePasswordInputSignUp
 * @returns {void}
 */
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


/**
 * Handles the visibility toggle button and lock icon for the confirm password input field.
 * 
 * @function handleConfirmPasswordInputSignUp
 * @returns {void}
 */
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
 * Toggles the visibility of the password field and updates the visibility icons.
 * 
 * @function togglePasswordVisibility
 * @returns {void}
 */
function togglePasswordVisibility() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById('see').classList.remove('hidden');
      document.getElementById('notSee').classList.add('hidden');
    } else {
      x.type = "password";
      document.getElementById('see').classList.add('hidden');
      document.getElementById('notSee').classList.remove('hidden');
    }
}


/**
 * Toggles the visibility of the confirm password field and updates the visibility icons.
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


/**
 * Toggles the privacy policy checkbox state and updates the corresponding icon and dataset.
 * 
 * @function toggleCheckboxPrivacyPolicy
 * @param {HTMLElement} element - The checkbox element containing the icon to toggle.
 * @returns {void}
 */
function toggleCheckboxPrivacyPolicy(element) {
    const img = element.querySelector('.checkbox-icon');
    const isChecked = img.getAttribute('src') === 'assets/img/general/checked_button.svg';

    if (isChecked) {
        img.setAttribute('src', 'assets/img/general/check_button.svg');
        element.dataset.checked = "false";
    } else {
        img.setAttribute('src', 'assets/img/general/checked_button.svg');
        element.dataset.checked = "true";
    }
}


/**
 * Displays a success message overlay and redirects to the summary page after a delay.
 * 
 * @async
 * @function showSuccessMessage
 * @returns {Promise<void>}
 */
function showSuccessMessage() {
    return new Promise((resolve) => {
        let successOverlay = document.getElementById('successOverlay');
        let successMessage = document.getElementById('successMessage');

        successOverlay.classList.remove('hidden');
        successMessage.classList.add('show');

        requestAnimationFrame(() => {
            setTimeout(() => {
                successMessage.classList.remove('show'); 
                successOverlay.classList.add('hidden'); 
                resolve();
            }, 1600);
        });
    });
}