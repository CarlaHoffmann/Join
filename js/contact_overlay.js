// document.addEventListener('click', closeAddContactOnOutsideClick);

// function closeAddContactOnOutsideClick(event) {
//     let addContactBox = document.getElementById('addContactBox');
//     if (!addContactBox.contains(event.target)) {
//         closeAddOverlay();
//     }
// }
function closeAddContactOnOutsideClick(event) {
    let addContactBox = document.getElementById('addContactBox');
    let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');
    
    if (addContactBoxOverlay.contains(event.target) && !addContactBox.contains(event.target)) {
        closeAddOverlay();
    }
}