function toggleHelpMenu() {
    let helpMenu = document.getElementById('help-menu');
    helpMenu.classList.toggle('d-none');
}

function activeLink() {
    // Aktuellen Pfad abrufen
    const currentPath = window.location.pathname.split('/').pop();

    // Alle Links im Sidebar und Mobile Nav durchlaufen
    const links = document.querySelectorAll('#sidebar a, #mobileNav a');

    links.forEach(link => {
        // Überprüfen, ob der href des Links mit dem aktuellen Pfad übereinstimmt
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link'); // Aktiven Link hinzufügen
        } else {
            link.classList.remove('active-link'); // Anderen Links entfernen
        }
    });
}

async function checkLoggedIn() {
    const loggedInUser = await getUser();
    if (loggedInUser = '') {
        let sideNav = document.getElementById('sideBarNavigation');
        let mobileNav = document.getElementById('mobileNav');
        sideNav.classList.add('d-none');
        mobileNav.classList.add('d-none');
    } 
}

async function getUser() {
    try {
        const response = await fetch(`${base_url}/loggedIn.json`); // Beispiel-Pfad für den eingeloggten User
        const loggedInData = await response.json();

        return { name: loggedInData.name }; // Rückgabe des Namens des eingeloggten Users
    } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        return null;
    }
}

window.onload = activeLink;