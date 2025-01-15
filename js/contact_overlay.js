function closeAddContactOnOutsideClick(event) {
    event.stopPropagation();
    let addContactBox = document.getElementById('addContactBox');
    let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');
    
    if (addContactBoxOverlay.contains(event.target) && !addContactBox.contains(event.target)) {
        closeAddOverlay();
    }
}