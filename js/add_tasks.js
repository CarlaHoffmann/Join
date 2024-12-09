function addTask() {
    let overlay = document.getElementById('task-overlay');
    overlay.innerHTML = `
<div id="editTaskOverlay" class="d-none">
    <div class="edit-task-content">
        <!-- Title -->
        <div class="labled-box">
            <label for="edit-task-title">Title</label>
            <input id="edit-task-title" type="text" class="form-field" placeholder="Enter task title" />
        </div>

        <!-- Category -->
        <div class="labled-box">
            <label for="edit-task-category">Category</label>
            <select id="edit-task-category" class="form-field">
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
            </select>
        </div>

        <!-- Description -->
        <div class="labled-box">
            <label for="edit-task-description">Description</label>
            <textarea id="edit-task-description" class="form-field" placeholder="Enter task description"></textarea>
        </div>

        <!-- Priority -->
        <div class="labled-box">
            <label for="edit-task-priority">Priority</label>
            <select id="edit-task-priority" class="form-field">
                <option value="1">Urgent</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
            </select>
        </div>

        <!-- Save and Cancel Buttons -->
        <div class="button-container">
            <button id="edit-task-cancel" class="cancel-button">Cancel</button>
            <button id="edit-task-save" class="save-button">Save</button>
        </div>
    </div>
</div>

    `;
    initializeDatePicker();
    initializePriority();
    initializeValidation();
}

// Function to close the overlay
function closeOverlay() {
    const overlay = document.getElementById('task-overlay');
    overlay.innerHTML = ''; // Clear the overlay content
}
