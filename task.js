
// Category
document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category-selection');
    
    // Setze initial den Platzhaltertext
    categorySelect.value = '';
    
    categorySelect.addEventListener('change', function() {
        if (this.value !== '') {
            // Entferne die leere Option, wenn eine Auswahl getroffen wurde
            this.querySelector('option[value=""]').remove();
        }
    });

    categorySelect.addEventListener('focus', function() {
        if (this.value === '') {
            // Wenn keine Auswahl getroffen wurde, wähle die leere Option
            this.querySelector('option[value=""]').selected = true;
        }
    });
});


//Date
document.addEventListener('DOMContentLoaded', function() {
    const datepicker = document.getElementById('datepicker');
    const warningDialog = document.getElementById('warning-dialog');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogClose = document.getElementById('dialog-close');

    datepicker.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length >= 4) {
            this.value = this.value.slice(0,2) + '/' + this.value.slice(2,4) + '/' + this.value.slice(4);
        } else if (this.value.length >= 2) {
            this.value = this.value.slice(0,2) + '/' + this.value.slice(2);
        }
    });

    datepicker.addEventListener('blur', function() {
        const parts = this.value.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);

            if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
                showWarning('Bitte geben Sie ein gültiges Datum ein.');
            }
        } else if (this.value !== '') {
            showWarning('Bitte geben Sie das Datum im Format dd/mm/yyyy ein.');
        }
    });

    function showWarning(message) {
        dialogMessage.textContent = message;
        warningDialog.style.display = 'block';
    }

    dialogClose.onclick = function() {
        warningDialog.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == warningDialog) {
            warningDialog.style.display = 'none';
        }
    }
});