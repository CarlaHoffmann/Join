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
    const [details, overlay, menu] = ['contactDetails', 'contactDetailsOverlay', 'contactDetailsOverlayMenu'].map(id => document.getElementById(id));
    const template = returnContactDetailsTemplate(key, name, email, phone, color);
    details.innerHTML = overlay.innerHTML = template;
    menu.innerHTML = returncontactDetailsMenuTemplate(key);
    details.classList.contains('show') ? (details.classList.remove('show'), requestAnimationFrame(() => details.classList.add('show'))) : details.classList.add('show');
    document.querySelectorAll('.contact').forEach(c => c.classList.remove('selected'));
    const selected = document.querySelector(`.contact[onclick*="'${key}'"]`);
    selected && selected.classList.add('selected');
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
    returnContactList();
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
 * Updates contact details based on edited form data.
 * 
 * @async
 * @function updateEditedContact
 * @throws {Error} If form fields are empty or HTTP request fails
 * @returns {Promise<Object>} Updated contact data
 */
async function updateEditedContact() {
    const [name, email, phone] = ['changedName', 'changedEmail', 'changedPhone'].map(id => document.getElementById(id).value.trim());
    if (!name || !email || !phone) return alert("Bitte füllen Sie alle Felder aus.");
    const editLink = `${base_url}users/${editKey}`;
    const userResponse = await fetch(`${editLink}.json`);
    if (!userResponse.ok) throw new Error(`HTTP error! status: ${userResponse.status}`);
    const user = await userResponse.json();
    const data = { ...user, mail: email, name, phone };
    const response = await fetch(`${editLink}.json`, {
        method: 'PUT', headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    loadContactData();
    contactDetails.innerHTML = '';
    closeEditOverlay();
    return await response.json();
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
 * Depending on the specified operation, the appropriate box is shown
 * by adding the "show" class and removing the "hidden" class from overlay.
 * @param {string} operation - The type of operation to perform. 
 *                              Use "add" to display the "Add Contact" overlay, 
 *                              or "edit" to display the "Edit Contact" overlay.
 */
function startEditOrAddAnimation(operation){
    if(operation === 'add'){
        document.querySelector('#addContactBox').classList.add('show');
        document.querySelector('#addContactBoxOverlay').classList.remove('hidden');
    }
    if(operation === 'edit'){
        document.querySelector('#editContactBox').classList.add('show');
        document.querySelector('#editContactBoxOverlay').classList.remove('hidden');
    }
}