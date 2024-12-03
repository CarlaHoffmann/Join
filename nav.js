const nav_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"

function toggleHelpMenu() {
    let helpMenu = document.getElementById('help-menu');
    helpMenu.classList.toggle('d-none');
}

// function activeLink() {
//     // Aktuellen Pfad abrufen
//     const currentPath = window.location.pathname.split('/').pop();

//     // Alle Links im Sidebar und Mobile Nav durchlaufen
//     const links = document.querySelectorAll('#sidebar a, #mobileNav a');

//     links.forEach(link => {
//         // Überprüfen, ob der href des Links mit dem aktuellen Pfad übereinstimmt
//         if (link.getAttribute('href') === currentPath) {
//             link.classList.add('active-link'); // Aktiven Link hinzufügen
//         } else {
//             link.classList.remove('active-link'); // Anderen Links entfernen
//         }
//     });
// }
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

async function getInitials() {
    try {
        const loggedInUser = await getUser(); // Benutzerdaten abrufen

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

async function getUser() {
    try {
        const response = await fetch(`${nav_base_url}/loggedIn.json`); // Beispiel-Pfad für den eingeloggten User
        const loggedInData = await response.json();
        console.log(loggedInData);
        return { name: loggedInData.name }; // Rückgabe des Namens des eingeloggten Users
    } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        return null;
    }
}

// Wenn niemand eingeloggt ist, wird die Navigation ausgeblendet
function showNav() {
    let header = document.getElementById('headerControls');
    let sideNav = document.getElementById('sideBarNavigation');
    let mobileNav = document.getElementById('mobileNav');
    header.classList.remove('d-none');
    sideNav.classList.remove('d-none');
    mobileNav.classList.remove('d-none');
}

// const log_base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"
async function logOut() {
    try {
        let response = await fetch(base_url + "/loggedIn/" + ".json",{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: "" })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // console.error("Error Guest:", error);
    }
    window.location.href = './logIn.html';
}

window.onload = activeLink;
document.addEventListener('DOMContentLoaded', () => {
    getInitials();
});