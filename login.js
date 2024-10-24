
/* LOGO Animation */ 
window.addEventListener('load', () => {
    const logo = document.getElementById('logo');
    const overlay = document.getElementById('overlay');

    setTimeout(() => {
        logo.classList.add('shrink');  
        overlay.classList.add('hidden'); 
    }, 300); 
});


/* Checkbox */
function toggleCheckBox() {
    let checkBoxIcons = document.querySelectorAll("#checkbox-img");

    checkBoxIcons.forEach(checkBoxIcon => {
        if (checkBoxIcon.src.includes("checkbox_icon.svg")) {
            checkBoxIcon.src = "img/login/Property 1=Default.png";
        } else {
            checkBoxIcon.src = "img/login/Property 1=checked.png";
        }
    });
}