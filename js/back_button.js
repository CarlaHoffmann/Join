/**
 * This Immediately Invoked Function Expression (IIFE) initializes the back button functionality.
 * It adds an event listener to all elements with the class `back` to navigate to the previous page
 * and refresh the page after a short delay.
 */
(function() {
    /**
     * Initializes the back button functionality by attaching click event listeners
     * to all elements with the class `back`.
     */
    function initBackButton() {
        const backButtons = document.getElementsByClassName('back');
        
        Array.from(backButtons).forEach(function(backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();

                /** Navigate to the previous page in browser history */
                window.history.back();
                
                /** Reload the page after a short delay (100ms) */
                setTimeout(function() {
                    window.location.reload(true);
                }, 100);
            });
        });
    }
    /** Check if the document is still loading or already loaded */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackButton);
    } else {
        initBackButton();
    }
})();