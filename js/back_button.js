/**
 * This Immediately Invoked Function Expression (IIFE) initializes the back button functionality.
 * It adds click event listeners to all elements with the class `back` to navigate to the previous page
 * and refresh the page after a short delay.
 */
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safelyInitBackButton);
    } else {
        safelyInitBackButton();
    }
})();

/**
 * Safely initializes the back button functionality with error handling.
 */
function safelyInitBackButton() {
    try {
        initBackButton();
    } catch (error) {
        console.error("Error initializing back button functionality:", error);
    }
}

/**
 * Initializes the back button functionality by attaching event listeners
 * to all elements with the class `back`.
 */
function initBackButton() {
    const backButtons = getBackButtonElements();
    addClickListenersToBackButtons(backButtons);
}

/**
 * Retrieves all elements with the class `back`.
 * @returns {HTMLCollection} - A collection of elements with the class `back`.
 */
function getBackButtonElements() {
    return document.getElementsByClassName('back');
}

/**
 * Adds click event listeners to the provided back button elements.
 * @param {HTMLCollection} backButtons - The collection of back button elements.
 */
function addClickListenersToBackButtons(backButtons) {
    for (const backButton of backButtons) {
        backButton.addEventListener('click', handleBackButtonClick);
    }
}

/**
 * Handles the back button click event by navigating to the previous page
 * and refreshing the page after a short delay.
 * @param {Event} e - The click event object.
 */
function handleBackButtonClick(e) {
    e.preventDefault();
    navigateBack();
    refreshPageWithDelay();
}

/**
 * Navigates to the previous page using the browser's history API.
 */
function navigateBack() {
    window.history.back();
}

/**
 * Refreshes the page after a short delay.
 */
function refreshPageWithDelay() {
    setTimeout(() => {
        window.location.reload(true);
    }, 100);
}
