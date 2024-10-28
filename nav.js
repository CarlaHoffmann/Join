// Die aktuelle URL abrufen
const currentUrl = window.location.href;
let url = currentUrl;
const lastSlashIndex = url.lastIndexOf("/");
const lastPart = url.substring(lastSlashIndex + 1);
const navigationLinks = document.querySelectorAll('#sideBarNavigation li a, #mobileNav ul li a, .naviLink');
const content = document.getElementById('content');

function markActiveMenuPoint(){
    navigationLinks.forEach(link => {
        link.onclick= function (event){
            event.preventDefault();
            urlToLoad = link.getAttribute('href');
            content.setAttribute('w3-include-html', urlToLoad);
            w3.includeHTML();
        }
    });
}

markActiveMenuPoint();