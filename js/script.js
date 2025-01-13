/**
 * Renders the task creation overlay by injecting the necessary HTML into the container.
 * 
 * @function addTask
 * @returns {void}
 */
// function addTask() {
//     let container = document.getElementById('task-overlay'); 
//     container.innerHTML = addTaskHTML();
// }


/**
 * Retrieves the value of a specified query parameter from the current page's URL.
 * 
 * @function getQueryParam
 * @param {string} param - The name of the query parameter to retrieve.
 * @returns {string|null} The value of the query parameter, or `null` if it is not present.
 */
// function getQueryParam(param) {
//     let urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(param);
// }




/**
 * Includes external HTML files into elements with the `w3-include-html` attribute.
 * 
 * - Fetches the HTML content from the file specified in the `w3-include-html` attribute.
 * - If the fetch is successful, inserts the content into the element.
 * - If the fetch fails, displays "Page not found" in the element.
 * 
 * After inclusion, calls `loadTemplateFunctions` and `setPreviousPageParams` to initialize additional logic.
 * 
 * @async
 * @function includeHTML
 * @returns {Promise<void>} Resolves when all HTML includes are processed.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    // loadTemplateFunctions();
    // setPreviousPageParams();
}

/**
 * Loads and executes template-specific functions based on the current page.
 * 
 * - Activates the appropriate menu class with `changeClassToActive`.
 * - Checks user-related functionality with `checkUser` and `loadUser`.
 * - For specific pages (e.g., privacy policy, legal notice), removes elements if the user is not logged in.
 * 
 * @function loadTemplateFunctions
 * @returns {void}
 */
// function loadTemplateFunctions() {
//     changeClassToActive();
//     checkUser();
//     loadUser();
//     if (window.location.pathname == '/privacyPolicy.html' || window.location.pathname == '/legalNotice.html' || window.location.pathname == '/Join/legalNotice.html' || window.location.pathname == '/Join/privacyPolicy.html') {
//         if (!isUserLoggedIn()) {
//         removeElements();
//         }
//     }
// }

/**
 * Sets a query parameter (`containsLinks`) on all links in the document based on the presence of `.links` in `.top_side_menu`.
 * 
 * @function setPreviousPageParams
 * @returns {void}
 */
// let userMail;
// function setPreviousPageParams() {
//     let containsLinks = document.querySelector('.top_side_menu')?.contains(document.querySelector('.links')) || false;
//     let links = document.querySelectorAll('a');

//     links.forEach(link => {
//         try {
//             let url = new URL(link.href);
//             url.searchParams.set('containsLinks', containsLinks);
//             link.href = url.toString();
//         } catch (error) {
//         }
//     });
// }





/**
 * Checks if a user is currently logged in by verifying the presence of `userMail` in local storage.
 * 
 * @function isUserLoggedIn
 * @returns {boolean} `true` if `userMail` exists in local storage, otherwise `false`.
 */
// function isUserLoggedIn() {
//     return localStorage.getItem('userMail') !== null;
// }


/**
 * Highlights the active menu link by adding the `activeLink` class to the link that matches the current page's path.
 * 
 * @function changeClassToActive
 * @returns {void}
 */
// function changeClassToActive() {
//     let activePage = window.location.pathname;
//     let menuLinks = document.querySelectorAll('.active_link');
//     menuLinks.forEach(link => {
//         if (link.href.includes(`${activePage}`)) {
//             link.classList.add('activeLink');
//         }
//     })
// }


/**
 * Verifies if a user is logged in and redirects to the homepage if not.
 * 
 * - Checks `userMail` in local storage to determine if a user is logged in.
 * - Prevents redirection on specific pages (e.g., privacy policy, legal notice) when accessed from certain referring pages.
 * 
 * @function checkUser
 * @returns {void}
 */
// function checkUser() {
//     let userMail = localStorage.getItem('userMail');
//     let previousPage = document.referrer;
//     let currentPage = window.location.pathname;
//     let dependingPages = ['/privacy.html', '/legal_notice.html', '/Join/privacy.html', '/Join/legal_notice.html'];
//     if (dependingPages.includes(currentPage) && (previousPage.includes('/index.html') || previousPage.includes('/signup.html') || dependingPages.some(page => previousPage.includes(page)))) {
//         return;
//     }
//     if (userMail === null ) {
//         window.location.href = './index.html';
//     } 
// }


/**
 * Prevents the propagation of an event to parent elements.
 * 
 * @function doNotClose
 * @param {Event} event - The event object to stop propagation for.
 * @returns {void}
 */
// function doNotClose(event) {
//     event.stopPropagation();
// }


/**
 * Determines the `display` style property of a given element.
 * 
 * - Uses `currentStyle` for older versions of Internet Explorer.
 * - Falls back to `getComputedStyle` for modern browsers.
 * 
 * @function proveElementStyle
 * @param {Element} element - The DOM element to retrieve the `display` style for.
 * @returns {string} The value of the `display` style property.
 */
// function proveElementStyle(element) {
//     return element.currentStyle ? element.currentStyle.display : getComputedStyle(element).display;
// }


/**
 * Retrieves the width of a given DOM element using its bounding rectangle.
 * 
 * @function proveElementWidth
 * @param {Element} element - The DOM element to measure.
 * @returns {number} The width of the element in pixels.
 */
// function proveElementWidth(element) {
//     let elementWidth = element;
//     let rect = elementWidth.getBoundingClientRect();
//     return rect.width;
// }


/**
 * Toggles the visibility of a dialog with a background and applies a delayed transition class.
 * 
 * @function showDialog
 * @param {string} classDialogBg - The CSS selector for the dialog background element.
 * @param {string} classD_none - The CSS class to toggle visibility of the background.
 * @param {string} classDialog - The CSS selector for the dialog element.
 * @param {string} showClassDialog - The CSS class to toggle the display or animation of the dialog.
 * @param {number} time - The delay in milliseconds before toggling the `showClassDialog` class.
 * @returns {void}
 */
// function showDialog(classDialogBg, classD_none, classDialog, showClassDialog, time) {
//     document.querySelector(`${classDialogBg}`).classList.toggle(`${classD_none}`);
//     setTimeout(function() {
//         document.querySelector(`${classDialog}`).classList.toggle(`${showClassDialog}`);
//     }, time);
// }


/**
 * Closes a dialog by removing visibility classes and optionally clears dialog-specific data.
 * 
 * - Removes the display or animation class for the dialog.
 * - Adds a visibility class for the dialog background after a delay.
 * - Clears task dialog data if the current page is `board.html`.
 * 
 * @function closeDialog
 * @param {string} classDialog - The CSS selector for the dialog element.
 * @param {string} showClassDialog - The CSS class to remove from the dialog for visibility or animation.
 * @param {string} classDialogBg - The CSS selector for the dialog background element.
 * @param {string} classD_none - The CSS class to add to the background for hiding it.
 * @param {number} time - The delay in milliseconds before toggling the background visibility.
 * @returns {void}
 */
// function closeDialog(classDialog, showClassDialog, classDialogBg, classD_none, time) {
//     document.querySelector(`${classDialog}`).classList.remove(`${showClassDialog}`);
//     setTimeout(function() {
//         document.querySelector(`${classDialogBg}`).classList.add(`${classD_none}`);
//     }, time);
//     if (window.location.pathname == '/board.html') {
//         clearDialogAddTask();
//     }
// }


/**
 * Sets the `href` attribute of a specified element to the referring URL.
 * 
 * @function setReferrer
 * @param {string} container - The CSS selector for the element whose `href` will be set.
 * @returns {void}
 */
// function setReferrer(container) {
//     document.querySelector(container).href = document.referrer;
// }


/**
 * Removes specific elements from the DOM based on the referrer URL and query parameters.
 * 
 * - Checks if the referrer is from specific pages or if the `containsLinks` query parameter is `false`.
 * - Removes elements like `.links`, `#profileHeader`, and `#side_menu` from the page.
 * - Adjusts the height of `#main_container` if elements are removed.
 * 
 * @function removeElements
 * @returns {void}
 */
// function removeElements() {
//     let previousPage = document.referrer;
//     let containsLinks = getQueryParam('containsLinks') === 'true';

//     if (previousPage.includes('/index.html') || previousPage.includes('/signup.html') || !containsLinks) {
//         ['.links'].forEach(classes => {
//             let element = document.querySelector(classes);
//             if (element) {
//                 element.remove();
//             }
//         });
//         document.querySelector('#profileHeader').remove();
//         document.querySelector('#side_menu').remove();
//         document.querySelector('#main_container').style.height = "calc(100vh - 80px)";
//     }
// }


/**
 * Loads the user's email from local storage and assigns it to the `userMail` variable.
 * 
 * @function loadUser
 * @returns {void}
 */
function loadUser() {
    userMail = localStorage.getItem('userMail');
}

/**
 * Retrieves the user's information, such as name and initials (letters).
 * 
 * - If the user is a guest or not logged in, defaults to "Guest" and "G".
 * - For logged-in users, fetches the user's name and initials from the contacts list.
 * 
 * @async
 * @function getUserInfos
 * @returns {Promise<Object>} Resolves to an object containing:
 * - `name` {string}: The user's name.
 * - `letters` {string}: The user's initials.
 */
// async function getUserInfos() {
//         let guestMail = '"guest@mail.com"';
//         let name = 'Guest';
//         let letters = 'G';
//         loadUser();
//         if (userMail !== guestMail && userMail !== null) {
//             contacts = Object.entries(await loadData('contacts'));
//             let formattedUserMail = userMail.replace(/"/g, '');
//             let currentIndex = contacts.findIndex(contact => contact[1].mail === formattedUserMail);
//                 name = contacts[currentIndex][1].name;
//                 letters = contacts[currentIndex][1].letters;
//         }
//         return { name, letters };
//     }
