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

window.onload = activeLink;