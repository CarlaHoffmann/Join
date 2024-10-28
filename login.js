
/* LOGO Animation */ 
window.addEventListener('load', () => {
    const logo = document.getElementById('logo');
    const overlay = document.getElementById('overlay');

    setTimeout(() => {
        logo.classList.add('shrink');  
        overlay.classList.add('hidden'); 
    }, 300); 
});

    /* Checkbox-Icon's */
    function toggleCheckBox() {
        let checkBoxIcons = document.querySelectorAll("#checkBoxIcon");
    
        checkBoxIcons.forEach(checkBoxIcon => {
            if (checkBoxIcon.src.includes("checkbox_icon.svg")) {
                checkBoxIcon.src = "img/login/Property 1=checked.png";
            } else {
                checkBoxIcon.src = "img/login_img/checkbox_icon.svg";
            }
            checkBoxIcon.style.width = "24px";
            checkBoxIcon.style.height = "24px";
        });
    }


    /*
     /* Checkbox-Icon's 
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();  // Standard-Formularabsenden verhindern
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
    
        // Beispielbedingung für die Fehlermeldung
        if (email === "" || password === "") {
            // Fehlermeldung anzeigen
            errorMessage.style.display = 'block';
        } else {
            // Fehlermeldung ausblenden, wenn keine Fehler auftreten
            errorMessage.style.display = 'none';
            // Weitere Logik zum Senden der Anmeldedaten...
        }
    });
    
    */