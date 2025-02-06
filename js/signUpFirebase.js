const base_url = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app"
const signUpName = '';

/**
 * Handles the sign-up button click event, validating the user input and creating a new account.
 * 
 * @async
 * @function handleSignUpClick
 * @param {Event} event - The click event triggered by the sign-up button.
 * @returns {Promise<void>}
 * 
 * @description
 * - Prevents the default form submission behavior.
 * - Checks if the Privacy Policy checkbox is checked.
 * - Validates user input (name, email, password) against existing users.
 * - Creates a new user account if validation passes.
 * - Displays a success message and logs in the user upon successful account creation.
 */
async function handleSignUpClick(event) {
    event.preventDefault();
    const isChecked = document.getElementById('checkbox-container').getAttribute('data-checked') === 'true';
    const privacyModal = document.getElementById('privacy-modal');
    if (!isChecked) {
        privacyModal.classList.add('show');
        return;
    };

    const users = await loadUsers();
    if (validateSignUp(users)) {
        const contact = await createContact();
        if (contact) {
            await showSuccessMessage();
            await getLoggedIn();
            redirectToSummary();
        }
    }
}


/**
 * Fetches the list of users from the database and converts it into an array of user objects.
 * 
 * @async
 * @function loadUsers
 * @returns {Promise<Array<Object>>} - An array of user objects, each containing `id`, `name`, and `mail`.
 * 
 * @description
 * - Retrieves all users from the Firebase Realtime Database.
 * - Transforms the database response into a structured array of user objects.
 * - Returns an empty array if an error occurs.
 */
async function loadUsers() {
    try {
        const response = await fetch(`${base_url}/users.json`);
        const users = await response.json();

        const contactsArray = Object.entries(users).map(([userId, userData]) => ({ id: userId, name: userData.name, mail: userData.mail }));
        return contactsArray;        
    } catch (error) {
        return [];
    }
}


/**
 * Creates a new contact by collecting input data and posting it to the database.
 * 
 * @async
 * @function createContact
 * @returns {Promise<boolean>} - Returns `true` after the contact is successfully created.
 */
async function createContact() {
    let contact = {
        name: takeName(),
        mail: takeMail(),
        password: takePassword(),
        color: returnColor()
    }
    await postData(contact);
    return true;
}


/**
 * Sends a new contact object to the database by posting it to the "users" collection.
 * 
 * @async
 * @function postData
 * @param {Object} contact - The contact object to be added to the database.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.mail - The email of the contact.
 * @param {string} contact.password - The password of the contact.
 * @param {string} contact.color - The color associated with the contact.
 * @returns {Promise<void>}
 */
async function postData(contact) {
    try {
        let response = await fetch(base_url + "/users/" + ".json",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
    }
}

/**
 * Sends the logged-in user's name to the database by updating the "loggedIn" entry.
 * 
 * @async
 * @function getLoggedIn
 * @returns {Promise<void>}
 */
async function getLoggedIn() {
    let name = takeName();
    try {
        let response = await fetch(base_url + "/loggedIn/" + ".json",{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: name })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
    }
}