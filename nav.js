// Die aktuelle URL abrufen
const currentUrl = window.location.href;
const url = "https://example.com/path/to/resource";
const lastSlashIndex = url.lastIndexOf("/");
const lastPart = url.substring(lastSlashIndex + 1);
const sideBarLinks = document.querySelectorAll('#sideBarNavigation li a');

function markActiveMenuPoint(){
    sideBarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        console.log(linkHref);
        console.log(lastPart);
        if (linkHref !== lastPart) {
            link.classList.remove('activeMenuPoint');
        } else{
            link.classList.add('activeMenuPoint');
        }
    });
}

markActiveMenuPoint();