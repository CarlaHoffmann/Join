/** Prio */
/** 
 * This function initializes the priority buttons by resetting all buttons and setting the medium priority as the default. 
 */
function initializePriority() {
    resetAllPriorityButtons();
    setMediumPriority();
}

/** 
 * This function handles the priority button click event. It prevents the default button
 * behavior if an event is provided, resets other buttons, and toggles the current button.
 */
function priority(x, event) {
    if (event) {
        event.preventDefault();
    }
    const currentPrio = document.getElementById(`prio${x}`);
    const allPrios = document.querySelectorAll('.prio-button');
    resetOtherButtons(allPrios, currentPrio);
    toggleCurrentButton(currentPrio, x);
}

/** This function resets all priority buttons except the current one.*/
function resetOtherButtons(allButtons, currentButton) {
    allButtons.forEach(button => {
        if (button !== currentButton) {
            resetButton(button);
        }
    });
}

/** This function toggles the state of the current priority button (activates or deactivates it).*/
function toggleCurrentButton(button, priority) {
    if (button.classList.contains('active-button')) {
        resetButton(button);
    } else {
        activateButton(button, priority);
    }
}

/** This function resets a priority button to its default state.*/
function resetButton(button) {
    button.classList.remove('active-button', 'urgent', 'med', 'low');
    button.classList.add('hover-button');
    updateButtonContent(button);
}

/** This function activates a priority button with the specified priority.*/
function activateButton(button, priority) {
    button.classList.remove('hover-button');
    button.classList.add('active-button');
    button.classList.add(getPriorityClass(priority));
    updateButtonContent(button);
}

/** This function determines the CSS class based on the priority level.*/
function getPriorityClass(priority) {
    switch(priority) {
        case 1: return 'urgent';
        case 2: return 'med';
        case 3: return 'low';
    }
}

/** This function updates the content of a priority button based on its state.*/
function updateButtonContent(button) {
    const priority = button.id.replace('prio', '');
    const isActive = button.classList.contains('active-button');
    button.innerHTML = getButtonContent(priority, isActive);
}

/** This function resets all priority buttons to their default state.*/
function resetAllPriorityButtons() {
    const priorityButtons = document.querySelectorAll('.prio-button');
    priorityButtons.forEach(button => {
        resetButton(button);
    });
}

/** This function sets the medium priority button as active by default.*/
function setMediumPriority() {
    const mediumButton = document.getElementById('prio2');
    if (mediumButton) {
        activateButton(mediumButton, 2);
    } else {
        return;
    }
}

/** Category */
/** This function toggles the visibility of the category dropdown.*/
function showCategory() {
    const dropdown = document.getElementById('opened-category');
    dropdown.classList.toggle('d-none'); 

    const categorySelection = document.getElementById('category-selection');
    categorySelection.textContent = "Select task category";
}

/** This function handles the selection of a category from the dropdown.*/
function categorySelected(category) {
    const categorySelection = document.getElementById('category-selection');
    const errorMessage = document.getElementById('error-message');

    categorySelection.textContent = category; 
    errorMessage.classList.add('d-none');

    document.getElementById('opened-category').classList.add('d-none'); 
}

/** Subtask*/
/**
 * This array stores the list of subtasks.
 */
let currentSubtasks = [];

/**
 * This function closes the subtask input field and resets its view to the original state.
 */
function closeSubtask() {
    let subtaskButtons = document.getElementById('subtask-buttons');
    let subtaskInput = document.getElementById('subtaskInput');

    subtaskButtons.innerHTML = `
        <img class="subtask-img symbol-hover icon-hover" src="./assets/img/task/subtask.svg" alt="add subtask">
    `;
    subtaskInput.value = '';
    document.removeEventListener('click', closeSubtaskOnOutsideClick);
}

/**
 * This function closes the subtask input field when a click occurs outside the subtask wrapper.
 * @param {Event} event - The click event.
 */
function closeSubtaskOnOutsideClick(event) {
    let subtaskWrapper = document.getElementById('subtask-input-wrapper');
    if (!subtaskWrapper.contains(event.target)) {
        closeSubtask();
    }
}

/**
 * This function adds a new subtask to the list and updates the display.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    let addedSubtask = document.getElementById('subtasks');

    if (subtaskInput.value !== '') {
        currentSubtasks.push({
            task: subtaskInput.value,
            checked: false
        });
    }

    addedSubtask.innerHTML = '';

    for (let i = 0; i < currentSubtasks.length; i++) {
        const element = currentSubtasks[i].task;
        addedSubtask.innerHTML += getAddSubtaskTemplate(i, element);
    }
    closeSubtask();
}

/**
 * This function edits an existing subtask by replacing its content with an input field.
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    let subtaskElement = document.getElementById(`subtask${index}`);
    let currentText = currentSubtasks[index].task;
    subtaskElement.innerHTML = editSubtaskTemplate(index, currentText, 'false');

    let input = subtaskElement.querySelector('.edit-subtask-input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}

/**
 * This function replaces the text of an edited subtask and updates the display.
 * @param {number} index - The index of the subtask to replace.
 */
function replaceSubtask(index) {
    let subtaskElement = document.getElementById(`subtask${index}`);
    let input = subtaskElement.querySelector('.edit-subtask-input');
    let newText = input.value.trim();

    if (newText !== '') {
        currentSubtasks[index].task = newText;
        updateSubtaskDisplay();
    } else {
        deleteSubtask(index);
    }
}

/**
 * This function deletes a subtask from the list and updates the display.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
    currentSubtasks.splice(index, 1);
    updateSubtaskDisplay();
}

/**
 * This function updates the display of all subtasks after adding, editing, or deleting a subtask.
 */
function updateSubtaskDisplay() {
    let addedSubtask = document.getElementById('subtasks');
    addedSubtask.innerHTML = '';

    for (let i = 0; i < currentSubtasks.length; i++) {
        const element = currentSubtasks[i].task;
        addedSubtask.innerHTML += updateSubtaskDisplayTemplate(i, element);
    }
}

/** validation*/
/**
 * This function initializes the form validation by adding an event listener to the submit button.
 */
function initializeValidation() {
    const submitButton = document.querySelector('.submit-button');

    if (submitButton) {
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault();

            if (validateForm()) {
                await createTask();
            }
        });
    } else {
        return;
    }
};

/**
 * This function validates the entire form by calling individual validation functions for each field.
 * @returns {boolean} Whether the form is valid.
 */
function validateForm() {
    let isValid = true;

    isValid = validateTitle() && isValid;
    isValid = validateDueDate() && isValid;
    isValid = validateCategory() && isValid;

    return isValid;
}

/**
 * This function validates the title field to ensure it is not empty and meets the minimum length requirement.
 * @returns {boolean} Whether the title is valid.
 */
function validateTitle() {
    const title = document.getElementById('title').value.trim();
    const titleError = document.getElementById('title-error');
    const titleMinlengthError = document.getElementById('title-minlength-error');
    
    titleError.classList.add('d-none');
    titleMinlengthError.classList.add('d-none');

    if (title === '') {
        titleError.classList.remove('d-none');
        return false;
    } else if (title.length < 3) {
        titleMinlengthError.classList.remove('d-none');
        return false;
    }
    return true;
}

/**
 * This function validates the due date field to ensure it is not empty and meets the required format.
 * @returns {boolean} Whether the due date is valid.
 */
function validateDueDate() {
    const dueDate = document.getElementById('datepicker').value.trim();
    const dueDateError = document.getElementById('due-date-error');
    
    dueDateError.classList.add('d-none');

    if (dueDate === '' || dueDate.length < 10) {
        dueDateError.classList.remove('d-none');
        return false;
    }
    return true;
}

/**
 * This function validates the category selection to ensure a category is selected.
 * @returns {boolean} Whether the category is valid.
 */
function validateCategory() {
    const categorySelection = document.getElementById('category-selection');
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('d-none');

    if (categorySelection.innerHTML === 'Select task category') {
        errorMessage.classList.remove('d-none');
        return false;
    } else {
        return true;
    }
}

/**
 * This function displays an overlay indicating that the task has been added successfully,
 * hides the task added overlay, and redirects to the board page.
 */
function showTaskAddedOverlay() {
    const overlay = document.getElementById('task-added-overlay');
    overlay.classList.remove('d-none');
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10); 

    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.classList.add('d-none');
            goToBoard();
        }, 300); 
    }, 3000);
}

/**
 * This function redirects the user to the board page.
 */
function goToBoard() {
    window.location.href = 'board.html';
}

/**
 * This function clears all fields and resets the form to its initial state.
 */
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('datepicker').value = '';

    selectedContacts = [];
    updateSelectedContacts();

    resetAllPriorityButtons();
    setMediumPriority();

    resetCategory();

    currentSubtasks = [];
    updateSubtaskDisplay();

    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.classList.add('d-none'));
}

/**
 * This function resets the category selection to its initial state.
 */
function resetCategory() {
    const categorySelection = document.getElementById('category-selection');
    categorySelection.textContent = 'Select task category';
    document.getElementById('opened-category').classList.add('d-none');
}