/**
 * returns addTaskOverlay
 * @function
 * @returns 
 */
function addTaskTemplate(){
    return `
    <div onclick="closeOverlayOnOutsideClick(event, 'overlay-content', 'board-add-task-overlay')" id="board-add-task-overlay"> 
        <div id="overlay-content">
            <div class="form-box">
                <form onsubmit="return validateForm()" id="add-task" novalidate>
                    <div class="upper-form">
                        <div class="task-head">
                            <h1 class="headline">Add Task</h1>

                            <!-- Close button -->
                            <div onclick="closeOverlay()" class="close-button-box">
                                <img src="./assets/img/add_task/close.svg" alt="Close" class="close-button"/>
                            </div>
                        </div>
                        <div class="scroll-container fill-in-part">
                            <div class="add-task-form">
                                <div id="add-task-first" class="width-440">
                                    <div class="labled-box">
                                        <label class="form-label">
                                            <div>Title<span class="red-asterisk">*</span></div>
                                            <div id="titel-wrapper">
                                                <input type="text" id="title" class="form-field margin-bottom title pad-12-16" placeholder="Enter a title" minlength="3" required>
                                                <div id="title-error" class="error-message d-none">This field is required.</div>
                                                <div id="title-minlength-error" class="error-message d-none">Please enter at least 3 characters.</div>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="labled-box">
                                        <label class="form-label">
                                            Description
                                            <textarea name="description" id="description" class="form-field margin-bottom description" placeholder="Enter a description"></textarea>
                                        </label>
                                    </div>
                                    <div class="labled-box">
                                        <label class="form-label">
                                            Assigned to
                                            <div id="contact-selection" class="contact-selection">
                                                <div onclick="openBoardAssigned()" id="select-field" class="selection-field form-field pad-12-16">
                                                    <p>Select contacts to assign</p><img class="symbol-hover icon-hover" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                                </div>
                                                <div onclick="closeAssigned()" id="contact-drop-down" class="select-items d-none">
                                                    <div id="contact-dropped-down" class="selection-field form-field pad-12-16 blue-border">
                                                        <p>Select contacts to assign</p>
                                                        <img class="symbol-hover dropdown-icon-mirrored" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                                    </div>
                                                    <div id="contacts-to-select"></div>
                                                </div>
                                            </div>
                                        </label>
                                        <div id="selected-contacts" class="selected-contacts"></div>
                                    </div>
                                </div>
                                <div class="vertical-divider hide-mobile"></div>
                                <div id="add-task-second" class="width-440">
                                    <div class="labled-box">
                                        <label class="form-label">
                                            <div>Due date<span class="red-asterisk">*</span></div>
                                            <div class="date-input-wrapper">
                                                <input type="text" id="datepicker" class="form-field margin-bottom pad-12-16 date-input" placeholder="dd/mm/yyyy" maxlength="10" required>
                                                <span class="calendar-icon">
                                                    <img src="./assets/img/task/event.svg" alt="Calendar" class="calendar-icon">
                                                </span>
                                                <div id="due-date-error" class="error-message d-none">This field is required.</div>
                                            </div>
                                        </label>                    
                                    </div>
                                    <div class="labled-box">
                                        <div class="button-box">
                                            Prio
                                            <div class="prio-buttons">
                                                <button onclick="priority(1, event)" class="prio-button hover-button" id="prio1">
                                                    <p>Urgent</p>
                                                    <div class="double-arrow-up">
                                                        <img src="./assets/img/task/prio_high.svg" alt="high">
                                                    </div>
                                                </button>
                                                <button onclick="priority(2, event)" class="prio-button hover-button" id="prio2">
                                                    <p>Medium</p>
                                                    <div class="double-line">
                                                        <img src="./assets/img/task/prio_med.svg" alt="medium">
                                                    </div>
                                                </button>
                                                <button onclick="priority(3, event)" class="prio-button hover-button" id="prio3">
                                                    <p>Low</p>
                                                    <div class="double-arrow-down">
                                                        <img src="./assets/img/task/prio_low.svg" alt="low">
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="labled-box">
                                        <div class="form-label">
                                            <div>Category<span class="red-asterisk">*</span></div>
                                            <div id="select-wrapper" class="select-wrapper">
                                                <div id="category">
                                                    <div onclick="showCategory()" class="select-field">
                                                        <div id="category-selection" class="form-field margin-bottom pad-12-16">Select task category</div>
                                                        <img class="dropdown-icon symbol-hover icon-hover" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                                    </div>
                                                </div>
                                                <div id="error-message" class="error-message d-none">This field is required.</div>
                                                <div id="opened-category" class="d-none">
                                                    <div onclick="showCategory()" class="select-field">
                                                        <div class="form-field pad-12-16 blue-border">Select task category</div>
                                                        <img id="dropdown-icon2" class="dropdown-icon symbol-hover dropdown-icon-mirrored" src="./assets/img/task/arrow_drop_downaa.svg" alt="">
                                                    </div>
                                                    <div class="selection-drop-down">
                                                        <div onclick="categorySelected('Technical Task')" class="drop-down-field">Technical Task</div>
                                                        <div onclick="categorySelected('User Story')" class="drop-down-field">User Story</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="labled-box">
                                        <label class="form-label">
                                            Subtasks
                                            <div onclick="openSubtaskTemplate()" id="subtask-input-wrapper">
                                                <div id="subtask">
                                                    <input onclick="openSubtaskTemplate()" id="subtaskInput" type="text" class="form-field pad-12-16" placeholder="Add new subtask">
                                                    <div id="subtask-buttons">
                                                        <img class="subtask-img symbol-hover icon-hover" src="./assets/img/task/subtask.svg" alt="add subtask">
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div>
                                            <div id="subtasks">
                                            </div>
                                        </div>
                                        <span class="font-16 hide-desktop"><span class="red-asterisk">*</span>This field is required</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="add-task-bottom">
                        <span class="font-16 hide-mobile"><span class="red-asterisk">*</span>This field is required</span>
                        <div class="bottom-buttons width-440">
                            <button onclick="clearForm()" type="reset" class="clear-button hover-button">Clear 
                                <img class="icon-normal" src="./assets/img/task/iconoir_cancel.svg" alt="">
                                <img class="icon-hover" src="./assets/img/task/iconoir_cancel_hover.svg" alt="">
                            </button>
                            <button class="submit-button hover-button">Create Task <img src="./assets/img/task/check.svg" alt=""></button>
                        </div>
                    </div>
                </form>
                <div id="task-added-overlay" class="dialog d-none">
                    <div id="task-added-confirmation">
                        <div class="confirmation-text">Task added to board</div>
                        <img src="./assets/img/task/board_symbol.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}