let content = document.getElementById('content');

function loadNavBar() {
    let header = document.getElementsByClassName('header');
    let navBar = document.getElementsByClassName('nav-bar');
    header.innerHTML = `
        <header>
            <span id="headerText">Kanban Project Management Tool</span>
            <a class="naviLink" href="summary.html"><img id="headerLogo" src="img/nav/mobileLogo.svg"></a>
            <div id="headerControls">
                <a id="help-link" href="help.html"><span>?</span></a>
                
                <span id="firstLetter">G</span>
            </div>
        </header>
    `;
    navBar.innerHTML = `
        <nav id="sidebar">
            <div id="topPart">
                <a class="naviLink" href="summary.html"><img src="img/nav/logo.svg"></a>
                <ul id="sideBarNavigation">
                    <li><a onclick="loadContent('summary.html');" href="#"><img src="img/nav/summary.svg">Summary</a></li>
                    <li><a href="task.html"><img src="img/nav/addTasks.svg">Add Tasks</a></li>
                    <li><a href="board.html"><img src="img/nav/board.svg">Board</a></li>
                    <li><a href="contact.html"><img src="img/nav/contacts.svg">Contacts</a></li>
                </ul>
            </div>

            <ul>
                <li><a class="naviLink" href="privacyPolicy.html">Privacy Policy</a></li>
                <li><a class="naviLink" href="legalNotice.html">Legal Notice</a></li>
            </ul>
        </nav>

        <div id="content">
        </div>

        <nav id="mobileNav">
            <ul>
                <li><a href="summary.html"><img src="img/nav/summaryMobile.svg"><span>Summary</span></a></li>
                <li><a href="task.html"><img src="img/nav/addTasksMobile.svg">Add Task</a></li>
                <li><a href="board.html"><img src="img/nav/boardMobile.svg">Board</a></li>
                <li><a href="contact.html"><img src="img/nav/contactsMobile.svg">Contacts</a></li>
            </ul>
        </nav>
    `;
}

function loadContent(path) {
    let content = document.getElementById('content');
    content.setAttribute('w3-include-html', path);
    w3.includeHTML(function() {
        console.log('Content loaded');
        // Hier können Sie zusätzlichen Code ausführen, nachdem der Inhalt geladen wurde
    });
}