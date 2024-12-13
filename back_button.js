
(function() {
    function initBackButton() {
        const backButtons = document.getElementsByClassName('back');
        
        Array.from(backButtons).forEach(function(backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Zur vorherigen Seite zurückgehen
                window.history.back();
                
                // Seite neu laden nach kurzer Verzögerung
                setTimeout(function() {
                    window.location.reload(true);
                }, 100);
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackButton);
    } else {
        initBackButton();
    }
})();