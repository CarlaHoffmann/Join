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
                            <div id="editContainer" class="icon-text-button" onclick="toggleView('editContactBoxOverlay', '${key}', true), startEditOrAddAnimation('edit')">
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
                <img src="./assets/img/contact/edit.svg" alt="Edit">
                <span>Edit</span>
            </div>

            <!-- Delete Option -->
            <div onclick="deleteContact('${key}')" class="option-item">
                <img src="./assets/img/contact/delete.svg" alt="Delete">
                <span>Delete</span>
            </div>
        </div>
    `;
}
/**
 * Generates and displays a contact list in the DOM.
 * 
 * This function iterates through an array of user objects, creating a structured
 * HTML representation of a contact list. It groups contacts alphabetically and
 * adds dividers for each new letter. Each contact is displayed with their initials,
 * name, and email.
 * 
 * @function
 * @name returnContactList
 * @global
 * 
 * @requires usersArray - An array of user objects, each containing name, key, mail, phone, and color properties.
 * @requires lettersArray - An array to keep track of letters already processed.
 * @requires contactList - A DOM element where the contact list will be inserted.
 * @requires getNameInitials - A function that returns initials given a name.
 * 
 * @returns {void} This function does not return a value, it directly modifies the DOM.
 * 
 * @example
 * // Assuming usersArray, lettersArray, and contactList are properly defined
 * returnContactList();
 */
function returnContactList(){
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