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
 * This function highlights the active link in the sidebar and mobile navigation.
 */
function activeLink() {
    // Aktuellen Pfad abrufen und normalisieren
    const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');

    // Alle Links im Sidebar und Mobile Nav durchlaufen
    const links = document.querySelectorAll('#sidebar a, #mobileNav a');

    links.forEach(link => {
        // href des Links abrufen und normalisieren
        const linkPath = link.getAttribute('href').replace(/^\/|\/$/g, '');

        // Überprüfen, ob der href des Links mit dem aktuellen Pfad übereinstimmt
        if (linkPath === currentPath) {
            link.classList.add('active-link'); // Aktiven Link hinzufügen
        } else {
            link.classList.remove('active-link'); // Anderen Links entfernen
        }
    });
}

/**
 * This asynchronous function retrieves the initials of the logged-in user and displays them.
 */
async function getInitials() {
    try {
        const loggedInUser = await getNavUser(); // Benutzerdaten abrufen

        if (loggedInUser && loggedInUser.name) { // Überprüfen, ob ein Name vorhanden ist
            showNav();
            // Namen in Vor- und Nachnamen aufteilen
            const nameParts = loggedInUser.name.split(" ");
            let initials = "";

            // Initialen berechnen (nur die ersten Buchstaben der Teile)
            nameParts.forEach(part => {
                if (part.length > 0) {
                    initials += part[0].toUpperCase();
                }
            });

            // Initialen im HTML anzeigen
            const initialsElement = document.getElementById('first-letters');
            initialsElement.textContent = initials; // Initialen setzen
        } else {
            console.warn("Kein Benutzer eingeloggt oder Name fehlt.");
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Initialen:", error);
    }
}

/**
 * This asynchronous function fetches the logged-in user data from Firebase.
 * @returns {Object|null} The user object containing the name, or null if not found.
 */
async function getNavUser() {
    try {
        const response = await fetch(`${nav_base_url}/loggedIn.json`); // Beispiel-Pfad für den eingeloggten User
        const loggedInData = await response.json();
        return { name: loggedInData.name }; // Rückgabe des Namens des eingeloggten Users
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
        console.error("Error logging out:", error);
    }
    window.location.href = './logIn.html';
}

/** Initialize active link highlighting on page load */
window.onload = activeLink;

/** Fetch initials when DOM content is fully loaded */
document.addEventListener('DOMContentLoaded', () => {
    getInitials();
});