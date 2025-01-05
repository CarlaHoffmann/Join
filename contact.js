/**
 * @type {string|null}
 * @description variable to store editKey which is needed to edit a contact
 */
let editKey = null;

/**
 * @type {string}
 * @description basic url to firebase
 */
const base_url = 'https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * The following variables include references to HTMLElements
 */
let contactList = document.getElementById('contactList');
let contactDetails = document.getElementById('contactDetails');
let addContactButton = document.getElementById('addContactButton');
let addContactBoxOverlay = document.getElementById('addContactBoxOverlay');

/**
 * Clears the input fields in the "Add Contact" form.
 * Resets the values of the name, email, and phone input elements to an empty string.
 */
function clearAddContactFields(){
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
}

/**
 * Adds a new contact by collecting form input values, generating a color, 
 * and uploading the data to the server. Also clears the form, updates the UI, 
 * and reloads contact data.
 * 
 * @async
 * @function addContact
 * @returns {Promise<void>} A promise that resolves when the contact is successfully added.
 */
async function addContact(){
    let name = document.getElementById('name').value;
    let mail = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let color = returnColor();
    let uploadData = {
        'phone':phone,
        'color':color,
        'mail':mail,
        'name':name,
        'password':'pw',
    }
    await createNewContact('/users', uploadData);
    closeAddOverlay();
    clearAddContactFields();
    showContactAddedOverlay();
    loadContactData();
}

/**
 * Extracts the initials from a given name.
 * If the name consists of a single part, returns the first letter of that part.
 * If the name has multiple parts, returns the initials of the first and last parts.
 * 
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials derived from the name.
 */
function getNameInitials(name) {
    let nameParts = name.split(' ');
    if (nameParts.length < 2) {
        return name.charAt(0); // Wenn nur ein Namesteil vorhanden ist, gib den ersten Buchstaben zurück
    }
    return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}

/**
 * Generates an HTML template string for displaying detailed information about a contact.
 * 
 * @param {string} key - The unique identifier for the contact.
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The background color for the contact's initials circle.
 * @returns {string} The HTML string representing the contact's details template.
 */
function returnContactDetailsTemplate(key, name, email, phone, color){
    return `
                <div class="detailsBox">
            <div class="contactHeader">
                <div style="background:${color}" class="circleDetails">${getNameInitials(name)}</div>
                <div class="nameDetails">
                        <p>${name}</p>
                        <div class="contactItemControls">

                            <!-- Edit -->
                            <div id="editContainer" class="icon-text-button" onclick="toggleView('editContactBoxOverlay', '${key}', true)">
                                <svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_249463_2447" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#29ABE2"/>
                                </mask> <g mask="url(#mask0_249463_2447)">
                                <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                                </g>
                                </svg>
                                <span>Edit</span>
                            </div>

                            <!-- Delete -->
                            <div id="deleteContainer" class="icon-text-button" onclick="deleteContact('${key}')">
                                <svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_249463_2" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#29ABE2"/> </mask> <g mask="url(#mask0_249463_2)"> <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/></g>
                                </svg>
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class='contactInformationTitle'>Contact Information</p>
            <div class="contactFooter">
                <div class="contactFooterInformation">
                    <b>Email</b>
                    <p class="email">${email}</p>
                </div>
                <div class="contactFooterInformation">
                    <b>Phone</b>
                    <p>${phone}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates an HTML template string for the contact details options menu.
 * The menu includes options to edit or delete the contact.
 * 
 * @param {string} key - The unique identifier for the contact.
 * @returns {string} The HTML string representing the options menu for the contact.
 */
function returncontactDetailsMenuTemplate(key) {
    return `
        <div id="options-menu" class="options-menu hidden">
            <!-- Edit Option -->
            <div onclick="toggleView('editContactBoxOverlay', '${key}', true); startEditOrAddAnimation('edit')" class="option-item">
                <img src="img/contact/edit.svg" alt="Edit">
                <span>Edit</span>
            </div>

            <!-- Delete Option -->
            <div onclick="deleteContact('${key}')" class="option-item">
                <img src="img/contact/delete.svg" alt="Delete">
                <span>Delete</span>
            </div>
        </div>
    `;
}


/**
 * Displays the detailed information of a selected contact, including name, email, 
 * phone, and color. Also manages the animation and highlights the selected contact.
 * 
 * @param {string} key - The unique identifier for the contact to display.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The background color associated with the contact.
 */

function showContactDetails(key, name, email, phone, color) {
    const contactDetails = document.getElementById('contactDetails');
    const contactDetailsOverlay = document.getElementById('contactDetailsOverlay');
    const contactDetailsOverlayMenu = document.getElementById('contactDetailsOverlayMenu');

    // Inhalt setzen
    contactDetails.innerHTML = returnContactDetailsTemplate(key, name, email, phone, color);
    contactDetailsOverlay.innerHTML = returnContactDetailsTemplate(key, name, email, phone, color);
    contactDetailsOverlayMenu.innerHTML = returncontactDetailsMenuTemplate(key);

    // Animation starten
    if (contactDetails.classList.contains('show')) {
        contactDetails.classList.remove('show');
        requestAnimationFrame(() => {
            contactDetails.classList.add('show');
        });
    } else {
        contactDetails.classList.add('show');
    }

    // Entferne 'selected' von allen Kontakten
    document.querySelectorAll('.contact').forEach(contact => {
        contact.classList.remove('selected');
    });

    // Füge 'selected' dem aktuellen Kontakt hinzu
    const selectedContact = document.querySelector(`.contact[onclick*="'${key}'"]`);
    if (selectedContact) {
        selectedContact.classList.add('selected');
    }
}

/**
 * Displays the contact detail overlay by adding a specific CSS class to the overlay element.
 */
function showContactDetailOverlay() {
    let contactDetailBoxOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlay.classList.add('contactDetailBox');
}

/**
 * Sorts an array of users alphabetically by their name property.
 * The sorting is case-insensitive.
 * 
 * @param {Array} usersArray - The array of user objects to be sorted.
 * @param {Object} usersArray[] - The user object containing at least a `name` property.
 * @param {string} usersArray[].name - The name of the user, used for sorting.
 */
function sortUsers(usersArray){
    usersArray.sort(function(a,b){
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if(nameA < nameB){ //a before b
            return -1;
        } else if(nameA > nameB){ //b before a
            return 1;
        } else{ //same value
            return 0;
        }
    });
}

/**
 * Asynchronously loads contact data from a Firebase database, processes the data,
 * and populates the contact list with users' information, sorted alphabetically.
 * It also displays the appropriate letters for name initials and manages the UI elements.
 * 
 * @async
 */
async function loadContactData(){
    let response = await fetch(base_url + ".json");
    let responseToJson = await response.json();
    let users = await responseToJson.users;
    usersArray = Object.values(users);
    let keys = Object.keys(users);
    for(let i = 0; i < usersArray.length; i++){
        usersArray[i].key = keys[i];
    }
    sortUsers(usersArray);
    contactList.innerHTML = "";
    let lettersArray = [];
    for (let i = 0; i < usersArray.length; i++) {
        let user = usersArray[i];
        let firstUserLetter = getNameInitials(user.name)[0].toLowerCase();
        let letterExists = lettersArray.includes(firstUserLetter);
        if (!letterExists) {
            lettersArray.push(firstUserLetter);
            contactList.innerHTML += `
                <div class="capital-letter-box">
                    <p class="capital-letter">${firstUserLetter.toUpperCase()}</p>
                </div>
                <hr>
            `;
        }
        contactList.innerHTML += `
            <div class="contact" onclick="showContactDetails('${user.key}', '${user.name}', '${user.mail}', '${user.phone}', '${user.color}'), showContactDetailOverlay()")>
                <div style="background:${user.color}" class="circle">${getNameInitials(user.name)}</div>
                <div class="contactInformation">
                    <p class="contactInformationName">${user.name}</p>
                    <p class="email">${user.mail}</p>
                </div>
            </div>
        `;
    }
}

loadContactData();

/**
 * Deletes a contact by its key, updates the contact list, and clears the contact details overlay.
 * It also calls the function to handle the deletion process in the database or data structure.
 * 
 * @async
 * @param {string} key - The unique identifier of the contact to be deleted.
 */
async function deleteContact(key){
    updateDeletedContact(key);
    const contactDetails = document.getElementById('contactDetails');
    contactDetails.innerHTML = '';

    closeDetailsOverlay();
}

/**
 * Deletes a contact from the Firebase database by its unique key and updates the contact list.
 * It sends a DELETE request to Firebase and reloads the contact data after the deletion.
 * 
 * @async
 * @param {string} key - The unique identifier of the contact to be deleted from the database.
 * @returns {Promise<Object>} The response data from the DELETE request to Firebase.
 */
async function updateDeletedContact(key){
    const contactDetails = document.getElementById('contactDetails');
    const deleteLink = base_url + "users" + "/" + key;
    const response = await fetch(deleteLink + ".json", {method:'DELETE'});
    loadContactData();
    contactDetails.innerHTML = "";

    return await response.json();
}

/**
 * Creates a new contact in the Firebase database by sending a POST request with the provided data.
 * 
 * @async
 * @param {string} [path=""] - The path in the Firebase database where the contact data should be stored.
 * @param {Object} [data={}] - The data of the new contact to be created, typically an object containing the contact's details.
 * @param {string} data.name - The name of the contact.
 * @param {string} data.email - The email address of the contact.
 * @param {string} data.phone - The phone number of the contact.
 * @param {string} data.color - The color associated with the contact.
 * @returns {Promise<Object>} The response data from the Firebase database after the contact is created.
 */
async function createNewContact(path = "", data={}){
    let response = await fetch(base_url + path + ".json", {
        method:"POST",
        header:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

/**
 * Toggles the visibility of a specified element and, if in edit mode, populates it with user data for editing.
 * 
 * @async
 * @param {string} elementId - The ID of the HTML element to show by removing the 'hidden' class.
 * @param {string|null} [key=null] - The unique identifier of the user for edit mode, defaults to null if no edit is required.
 * @param {boolean} [edit=false] - A flag indicating whether to enable edit mode; if true, user data will be fetched and displayed for editing.
 */
async function toggleView(elementId, key=null, edit=false){
    editKey = key;
    document.getElementById(elementId).classList.remove('hidden');

    if(edit){
        const editLink = base_url + "users" + "/" + editKey;
        let response = await fetch(editLink + ".json");
        let user = await response.json();

        document.getElementById('changedImg').style.backgroundColor = user.color;
        // document.getElementById('changedImg').innerHTML = getNameInitials(user.name);
        document.getElementById('changedImg').textContent = getNameInitials(user.name);
        document.getElementById('changedName').value = user.name;
        document.getElementById('changedEmail').value = user.mail;
        document.getElementById('changedPhone').value = user.phone;
    }
};

/**
 * Closes the edit contact overlay by adding the 'hidden' class to the edit contact box element.
 */
function closeEditOverlay(){
    document.getElementById('editContactBoxOverlay').classList.add('hidden');
}

/**
 * Closes the add contact overlay by adding the 'hidden' class to the add contact box element.
 */
function closeAddOverlay(){
    document.getElementById('addContactBoxOverlay').classList.add('hidden');
}

/**
 * Edits a contact by updating its details and then fetching the updated user data to display.
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves once the contact details have been updated and displayed.
 */
async function editContact() {
    await updateEditedContact();
    
    const response = await fetch(`${base_url}/users/${editKey}.json`);
    const user = await response.json();
    console.log(user);
    
    showContactDetails(editKey, user.name, user.mail, user.phone, user.color);
}

/**
 * Updates the contact details with the new values entered in the edit form. 
 * Validates the form inputs, sends a PUT request to update the contact data, 
 * and refreshes the contact list.
 * 
 * @async
 * @returns {Promise<Object>} A promise that resolves to the updated contact data after the PUT request.
 * @throws {Error} Throws an error if there is an issue with the HTTP request or input validation.
 */
async function updateEditedContact() {
    const changedName = document.getElementById('changedName').value.trim();
    const changedEmail = document.getElementById('changedEmail').value.trim();
    const changedPhone = document.getElementById('changedPhone').value.trim();
    const editLink = base_url + "users" + "/" + editKey;

    // Validierung der Eingabedaten
    if (!changedName || !changedEmail || !changedPhone) {
        alert("Bitte füllen Sie alle Felder aus.");
        return;
    }

    try {
        let userResponse = await fetch(editLink + ".json");
        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        let user = await userResponse.json();

        const data = {
            'color': user.color,
            'mail': changedEmail,
            'name': changedName,
            'password': user.password,
            'phone': changedPhone
        };

        const response = await fetch(editLink + ".json", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        loadContactData();
        contactDetails.innerHTML = '';
        closeEditOverlay();
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Bearbeiten des Kontakts:', error);
        alert('Es gab einen Fehler beim Bearbeiten des Kontakts. Bitte versuchen Sie es erneut.');
    }
}

/**
 * Closes the contact details overlay by removing the 'contactDetailBox' class 
 * and resetting the selected contact state.
 * It also removes the 'selected' class from all contacts to clear the selection.
 */
function closeDetailsOverlay() {
    let contactDetailBoxOverlayOverlay = document.getElementById('contactDetailBox');
    contactDetailBoxOverlayOverlay.classList.remove('contactDetailBox');

    document.querySelectorAll('.contact').forEach(contact => {
        contact.classList.remove('selected');
    });
}

/**
 * Toggles the visibility of the control menu and the active state of the control circle.
 * It adds/removes the 'hidden' class to the control menu and the 'active' class to 
 * the mobile control circle element to show/hide the menu and change its state.
 */
function openControlMenu() {
    let controlMenu = document.getElementById('options-menu');
    let circleControl = document.querySelector('.circle-edit-mobile-control');

    controlMenu.classList.remove('hidden');
    circleControl.classList.add('active'); 
    setTimeout(() => {
        controlMenu.classList.add('active');
    }, 10);

    document.addEventListener('click', handleClickOutside);
}

/**
 * Closes the control menu by hiding it and resetting its position.
 * The function removes the "active" class, adds the "hidden" class to the menu,
 * and ensures a smooth transition effect before fully resetting its position.
 * Also removes the click event listener for handling clicks outside the menu.
 */
function closeControlMenu() {
    let controlMenu = document.getElementById('options-menu');
    let circleControl = document.querySelector('.circle-edit-mobile-control');
    
    controlMenu.classList.remove('active');
    controlMenu.classList.add('hidden');

    setTimeout(() => {
        circleControl.classList.remove('active');
        controlMenu.style.transform = "translateX(100%)";
    }, 600);

    document.removeEventListener('click', handleClickOutside);
}


/**
 * Handles click events outside the control menu and circle control.
 * If the clicked element is not inside the control menu or the circle control,
 * the function triggers the `closeControlMenu` function to hide the menu.
 *
 * @param {MouseEvent} event - The click event object containing details about the event.
 */
function handleClickOutside(event) {
    const controlMenu = document.getElementById('options-menu');
    const circleControl = document.querySelector('.circle-edit-mobile-control');
    if (!controlMenu.contains(event.target) && !circleControl.contains(event.target)) {
        closeControlMenu();
    }
}

/**
 * Displays a confirmation overlay when a contact is added.
 * The overlay is shown with a small delay to allow for animation, and automatically hides 
 * after 3 seconds. The 'show' and 'hidden' classes are used to control the visibility and 
 * animation of the overlay.
 */
function showContactAddedOverlay() {
    const overlay = document.getElementById('contact-added-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }, 3000);
}
/**
 * Toggles the visibility of an overlay element for adding or editing a contact.
 * Depending on the specified operation, the appropriate overlay is shown
 * by adding the "show" class and removing the "hidden" class.
 * @param {string} operation - The type of operation to perform. 
 *                              Use "add" to display the "Add Contact" overlay, 
 *                              or "edit" to display the "Edit Contact" overlay.
 */
function startEditOrAddAnimation(operation){
    if(operation === 'add'){
        document.querySelector('#addContactBoxOverlay').classList.add('show');
        document.querySelector('#addContactBoxOverlay').classList.remove('hidden');
    }
    if(operation === 'edit'){
        document.querySelector('#editContactBoxOverlay').classList.add('show');
        document.querySelector('#editContactBoxOverlay').classList.remove('hidden');
    }
}