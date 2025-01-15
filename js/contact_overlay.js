function closeOverlayOnOutsideClick(event, box, overlay) {
    event.stopPropagation();
    let ContactBox = document.getElementById(box);
    let BoxOverlay = document.getElementById(overlay);
    
    if (BoxOverlay.contains(event.target) && !ContactBox.contains(event.target)) {
        if(box === 'addContactBox') {
            closeAddOverlay();
        }
        if(box === 'editContactBox') {
            closeEditOverlay();
        }
    }
}