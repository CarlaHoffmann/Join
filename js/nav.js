/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const nav_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

/**
 * This function toggles the visibility of the help menu.
 */
function toggleHelpMenu() {
    let helpMenu = document.getElementById('help-menu');
    helpMenu.classList.toggle('d-none');
}

/**
 * Fetches the user's initials and handles the display or redirection based on login status.
 * @async
 */
async function getInitials() {
    try {
        const loggedInUser = await getNavUser();
        if (loggedInUser && loggedInUser.name) {
            handleLoggedInUser(loggedInUser);
        } else {
            handleNoLoggedInUser();
        }
    } catch (error) {
    }
}

/**
 * Handles actions for a logged-in user.
 * @param {Object} user - The logged-in user object.
 * @param {string} user.name - The name of the logged-in user.
 */
function handleLoggedInUser(user) {
    showNav();
    const initials = calculateInitials(user.name);
    displayInitials(initials);
}

/**
 * Calculates initials from a given name.
 * @param {string} name - The full name of the user.
 * @returns {string} The calculated initials.
 */
function calculateInitials(name) {
    const nameParts = name.split(" ");
    return nameParts
        .filter(part => part.length > 0)
        .map(part => part[0].toUpperCase())
        .join('');
}

/**
 * Displays the initials in the DOM.
 * @param {string} initials - The initials to be displayed.
 */
function displayInitials(initials) {
    const initialsElement = document.getElementById('first-letters');
    initialsElement.textContent = initials;
}

/**
 * Handles the case when no user is logged in.
 * Redirects to login page unless on privacy policy or legal notice pages.
 */
function handleNoLoggedInUser() {
    const path = window.location.pathname;
    if (!path.includes('privacyPolicy.html') && !path.includes('legalNotice.html')) {
        window.location.href = './logIn.html';
    }
}

/**
 * This asynchronous function fetches the logged-in user data from Firebase.
 * @returns {Object|null} The user object containing the name, or null if not found.
 */
async function getNavUser() {
    try {
        const response = await fetch(`${nav_base_url}/loggedIn.json`);
        const loggedInData = await response.json();
        return { name: loggedInData.name }; 
    } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        return null;
    }
}

/**
 * This function shows the navigation elements when a user is logged in.
 */
function showNav() {
    let header = document.getElementById('headerControls');
    let sideNav = document.getElementById('sideBarNavigation');
    let mobileNav = document.getElementById('mobileNav');
    header.classList.remove('d-none');
    sideNav.classList.remove('d-none');
    mobileNav.classList.remove('d-none');
}

/**
 * Initializes the navigation setup process.
 * This function checks if the document is still loading and sets up
 * an event listener for the DOMContentLoaded event if necessary.
 * If the document is already loaded, it immediately calls setupNavigation.
 *
 * @function
 * @name initializeNavigation
 */
function initializeNavigation() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupNavigation);
    } else {
        setupNavigation();
    }
}

/**
 * Sets up the navigation by including HTML content and activating links.
 * This function checks for the availability of w3.includeHTML().
 * If available, it uses w3.includeHTML() to include HTML content and then calls activeLink.
 * If w3.includeHTML() is not available, it logs an error and directly calls activeLink.
 *
 * @function
 * @name setupNavigation
 */
function setupNavigation() {
    if (typeof w3 !== 'undefined' && typeof w3.includeHTML === 'function') {
        w3.includeHTML(activeLink);
    } else {
        console.error('w3.includeHTML is not available');
        activeLink();
    }
}

/**
 * Highlights the active link in the sidebar and mobile navigation.
 * A link is considered active if its path is contained within the current URL path.
 */
function activeLink() {
    const currentPath = window.location.pathname.replace(/^\/|\/$/g, '').replace(/\.html$/, '');
    const links = document.querySelectorAll('#sidebar a, #mobileNav a');

    links.forEach(link => {
        const linkPath = link.getAttribute('href').replace(/\.html$/, '');

        if (currentPath.includes(linkPath)) {
            link.classList.add('active-link');
        } else {
            link.classList.remove('active-link');
        }
    });
}

/**
 * Initiates the navigation setup process.
 * This function call starts the initialization of the navigation system.
 * It triggers the process of setting up event listeners or immediately
 * setting up the navigation, depending on the document's ready state.
 *
 * @function
 * @name initializeNavigation
 * @see initializeNavigation
 */
initializeNavigation();

/**
 * This asynchronous function logs out the user by clearing their session in Firebase.
 */
async function logOut() {
    try {
        let response = await fetch(`${nav_base_url}/loggedIn.json`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: "" })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
    }
    window.location.href = './logIn.html';
}

/** Fetch initials when DOM content is fully loaded */
document.addEventListener('DOMContentLoaded', () => {
    getInitials();
});