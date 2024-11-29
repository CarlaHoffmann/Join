function animationWindow() {
    const overlay = document.getElementById('overlay');
    const animatedLogo = document.getElementById('animatedLogo');
    const headerLogo = document.getElementById('headerLogo');

    // Prüfen, ob die Animation bereits abgespielt wurde
    if (!sessionStorage.getItem('animationPlayed')) {
        // Starten der Animation
        animatedLogo.addEventListener('animationend', () => {
            overlay.style.display = 'none'; // Verstecke Overlay
            headerLogo.src = animatedLogo.src; // Logo in den Header transferieren
            headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
        });

        // Markieren, dass die Animation abgespielt wurde
        sessionStorage.setItem('animationPlayed', 'true');
    } else {
        // Wenn die Animation bereits abgespielt wurde
        overlay.style.display = 'none'; // Verstecke das Overlay
        headerLogo.src = animatedLogo.src; // Header-Logo setzen
        headerLogo.style.display = 'block'; // Header-Logo sichtbar machen
    }
}

// Aufrufen der Funktion beim Laden der Seite
window.onload = animationWindow;


async function existingMailLogIn() {
    users = Object.entries(await loadData('users'));
    let email = document.getElementById('email').value.toLowerCase();
    let user = users.find(u => u[1].mail == email);            
    if(user === undefined){  
        document.getElementById('loginErrorPassword').classList.remove('hidden');
    } else {    
        login();
    }
}

async function login() {
    let email = document.getElementById('email').value.toLowerCase();
    let password = document.getElementById('password').value;
    let user = users.find(u => u[1].mail == email && u[1].password == password);
    if (user) {
        saveUser(email);
        window.location.href = './summary.html';
    } else {
        document.getElementById('loginError').classList.remove('hidden');
        document.getElementById('passwordButten').classList.add('input-border');
    }
}

function checkUser() {
    let userMail = localStorage.getItem('userMail');
    let previousPage = document.referrer;
    let currentPage = window.location.pathname;
    let dependingPages = ['/privacy.html', '/legal_notice.html', '/Join/privacy.html', '/Join/legal_notice.html'];
    if (dependingPages.includes(currentPage) && (previousPage.includes('/index.html') || previousPage.includes('/signup.html') || dependingPages.some(page => previousPage.includes(page)))) {
        return;
    }
    if (userMail === null ) {
        window.location.href = './index.html';
    } 
}

function saveUser(email) {
    let userMail = JSON.stringify(email);
    localStorage.setItem("userMail", userMail);
}

function logout(){
    localStorage.removeItem('userMail');
    localStorage.removeItem('logStatus');
}

function guestLogin() {
    saveUser('guest@mail.com');
    window.location.href = './summary.html';
}

function changePassword() {
    document.getElementById('passwordButten').classList.add('password_container_border');
    document.getElementById('emailContainer').classList.remove('password_container_border');
    var x = document.getElementById("password");
    if (x.type === "password") {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('unlock').classList.remove('hidden');
    } else {
        document.getElementById('passwordLock').classList.add('hidden');
        document.getElementById('unlock').classList.add('hidden');
    }
}

function changeEmail() {
    document.getElementById('emailContainer').classList.add('password_container_border');
    document.getElementById('passwordButten').classList.remove('password_container_border');
}

function togglePasswordVisibility() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      document.getElementById('lock').classList.remove('hidden');
      document.getElementById('unlock').classList.add('hidden');
    } else {
      x.type = "password";
      document.getElementById('lock').classList.add('hidden');
      document.getElementById('unlock').classList.remove('hidden');
    }
}
