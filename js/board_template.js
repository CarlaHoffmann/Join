function openTaskOverlayTemplate(task, contactsHTML) {
    return `
        <div onclick="closeOverlayOnOutsideClick(event, 'taskOverlay', 'openTaskOverlayBackground')" id="openTaskOverlayBackground" class="overlay-container">
            <div id="taskOverlay" class="taskOverlay">
                <div class="taskSelect">
                    <div class="taskContainer" style="background-color: ${getCategoryColor(task.category)}">${task.category}</div>
                    <div class="close" onclick="closeTaskOverlay()">
                        <img src="./assets/img/add_task/close.svg" alt="Close" />
                    </div>
                </div>

                <!-- Titel -->
                <div class="headline">${task.title}</div>

                <!-- Beschreibung -->
                <div class="description-overlay">${task.description}</div>

                <!-- Due Date und Priority untereinander -->
                <div class="task-info-wrapper">
                    <div class="task-info">
                        <span class="info-label">Due date:</span>
                        <span class="info-value">${task.date}</span>
                    </div>
                    <div class="task-info">
                        <span class="info-label">Priority:&nbsp;&nbsp;</span>
                        <span class="info-value priority-container">
                            ${getPrioText(task.prio)}
                            <img src="${getPrioImage(task.prio)}" alt="Priority Icon" class="priority-icon">
                        </span>
                    </div>
                </div>

                <!-- Assigned Contacts -->
                <div>
                    <span class="info-label">Assigned To:</span>
                    <div class="userContainer">${contactsHTML}</div>
                </div>

                <!-- Subtasks -->
                <div>
                    <span class="info-label">Subtasks:</span>
                    <div class="subtasks-box">${subtasksHTML}</div>
                </div>

                <!-- Delete and Edit Buttons -->
                <div class="deleteEditBtnContainer">
                    <!-- Delete Button -->
                    <div class="icon-text-button" onclick="deleteTask('${task.id}')">
                        <svg class="icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 11V17" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 11V17" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="icon-text">Delete</span>
                    </div>

                    <!-- Vertikale Trennlinie -->
                    <div class="vertical-line"></div>

                    <!-- Edit Button -->
                    <div class="icon-text-button" onclick="openEditTaskOverlay(event, ${JSON.stringify(task).replace(/"/g, '&quot;')})">
                        <svg class="icon-svg" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="#2A3647"/>
                        </svg>
                        <span class="icon-text">Edit</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}