// Funktion: Task hinzufügen
// Diese Funktion fügt ein Task-Overlay in den Container mit der ID 'task-overlay' ein.

function addTask() {
    let container = document.getElementById('task-overlay'); // Der Container, in den das Overlay eingefügt wird.
    container.innerHTML = addTaskHTML(); // Fügt den dynamisch generierten HTML-Code ein.
}



let userMail;

function setPreviousPageParams() {
    let containsLinks = document.querySelector('.top_side_menu')?.contains(document.querySelector('.links')) || false;
    let links = document.querySelectorAll('a');

    links.forEach(link => {
        try {
            let url = new URL(link.href);
            url.searchParams.set('containsLinks', containsLinks);
            link.href = url.toString();
        } catch (error) {
        }
    });
}

function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    loadTemplateFunctions();
    setPreviousPageParams();
}

function loadTemplateFunctions() {
    changeClassToActive();
    /*hideHelpIcon();*/
    checkUser();
    loadUser();
    /*showLetters();*/
    if (window.location.pathname == '/privacyPolicy.html' || window.location.pathname == '/legalNotice.html' || window.location.pathname == '/Join/legalNotice.html' || window.location.pathname == '/Join/privacyPolicy.html') {
        if (!isUserLoggedIn()) {
        removeElements();
        }
    }
}

function isUserLoggedIn() {
    return localStorage.getItem('userMail') !== null;
}

function changeClassToActive() {
    let activePage = window.location.pathname;
    let menuLinks = document.querySelectorAll('.active_link');
    menuLinks.forEach(link => {
        if (link.href.includes(`${activePage}`)) {
            link.classList.add('activeLink');
        }
    })
}

function doNotClose(event) {
    event.stopPropagation();
}

function proveElementStyle(element) {
    return element.currentStyle ? element.currentStyle.display : getComputedStyle(element).display;
}

function proveElementWidth(element) {
    let elementWidth = element;
    let rect = elementWidth.getBoundingClientRect();
    return rect.width;
}

function showDialog(classDialogBg, classD_none, classDialog, showClassDialog, time) {
    document.querySelector(`${classDialogBg}`).classList.toggle(`${classD_none}`);
    setTimeout(function() {
        document.querySelector(`${classDialog}`).classList.toggle(`${showClassDialog}`);
    }, time);
}

function closeDialog(classDialog, showClassDialog, classDialogBg, classD_none, time) {
    document.querySelector(`${classDialog}`).classList.remove(`${showClassDialog}`);
    setTimeout(function() {
        document.querySelector(`${classDialogBg}`).classList.add(`${classD_none}`);
    }, time);
    if (window.location.pathname == '/board.html') {
        clearDialogAddTask();
    }
}

function setReferrer(container) {
    document.querySelector(container).href = document.referrer;
}

function removeElements() {
    let previousPage = document.referrer;
    let containsLinks = getQueryParam('containsLinks') === 'true';

    if (previousPage.includes('/index.html') || previousPage.includes('/signup.html') || !containsLinks) {
        ['.links'].forEach(classes => {
            let element = document.querySelector(classes);
            if (element) {
                element.remove();
            }
        });
        document.querySelector('#profileHeader').remove();
        document.querySelector('#side_menu').remove();
        document.querySelector('#main_container').style.height = "calc(100vh - 80px)";
    }
}

function loadUser() {
    userMail = localStorage.getItem('userMail');
}

async function getUserInfos() {
        let guestMail = '"guest@mail.com"';
        let name = 'Guest';
        let letters = 'G';
        loadUser();
        if (userMail !== guestMail && userMail !== null) {
            contacts = Object.entries(await loadData('contacts'));
            let formattedUserMail = userMail.replace(/"/g, '');
            let currentIndex = contacts.findIndex(contact => contact[1].mail === formattedUserMail);
                name = contacts[currentIndex][1].name;
                letters = contacts[currentIndex][1].letters;
        }
        return { name, letters };
    }
