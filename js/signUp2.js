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
async function showSuccessMessage() {
    let successOverlay = document.getElementById('successOverlay');
    let successMessage = document.getElementById('successMessage');

        successOverlay.classList.remove("hidden");
        successOverlay.classList.add("show");

        setTimeout(() => {
            successMessage.classList.add("hidden"); 
            successOverlay.classList.remove("show");
        }, 3600); 
}