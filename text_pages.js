function openHelp() {
    let helpOverlay = document.getElementById('additional-content');
    helpOverlay.innerHTML = `
        <div id="help-overlay">
            <div onclick="closeHelp()" id="back"><img src="./img/arrow-left-line.svg" alt=""></div>
            <div id="help-content">
                <h1>Help</h1>                
                <div class="textfield">
                    <section>
                        <p>Welcome to the help page for <span class="join-blue">Join</span>, your guide to using our kanban project management tool.
                            Here, we'll provide an overview of what <span class="join-blue">Join</span> is, how it can benefit you, and how to use it.
                        </p>
                    </section>

                    <section>
                        <h2>What is Join?</h2>
                        <div class="text">
                            <p><span class="join-blue">Join</span> is a kanban-based project management tool designed and built by a group of dedicated students as part of
                                their web development bootcamp at the Developer Akademie.
                            </p>
                            <p>
                                Kanban, a Japanese term meaning "billboard", is a highly effective method to visualize work, limit
                                work-in-progress, and maximize efficiency (or flow). <span class="join-blue">Join</span> leverages the principles of kanban to help users
                                manage their tasks and projects in an intuitive, visual interface.
                            </p>
                            <p>
                                It is important to note that <span class="join-blue">Join</span> is designed as an educational exercise and is not intended for extensive
                                business usage. While we strive to ensure the best possible user experience, we cannot guarantee consistent
                                availability, reliability, accuracy, or other aspects of quality regarding Join.
                            </p>
                        </div>
                    </section>
                    
                    <h2>How to use it</h2>

                    <section>
                        <div class="text">
                            <p>Here is a step-by-step guide on how to use <a href="#">Join</a>:</p>

                            <div class="step">
                                <span class="counter">1.</span>
                                <div>
                                    <h3>Exploring the Board</h3>
                                    <p>When you log in to <a href="#">Join</a>, you'll find a default board. This board represents your project
                                        and contains four default lists: "To Do", "In Progress", "Await feedback" and "Done".
                                    </p>
                                </div>
                            </div>

                            <div class="step">
                                <span class="counter">2.</span>
                                <div>
                                    <h3>Creating Contacts</h3>
                                    <p>In <a href="#">Join</a>, you can add contacts to collaborate on your projects. Go to the "Contacts" section,
                                        click on "New contact", and fill in the required information. Once added, these contacts can be assigned
                                        tasks and they can interact with the tasks on the board.
                                    </p>
                                </div>
                            </div>

                            <div class="step">
                                <span class="counter">3.</span>
                                <div>
                                    <h3>Adding Cards</h3>
                                    <p>Now that you've added your contacts, you can start adding cards. Cards represent individual tasks. Click the "+-"
                                        button under the appropriate list to create a new card. Fill in the task details in the card, like task name,
                                        description, due date, assignees, etc.
                                    </p>    
                                </div>
                            </div>

                            <div class="step">
                                <span class="counter">4.</span>
                                <div>
                                    <h3>Moving Cards</h3>
                                    <p>As the task moves from one stage to another, you can reflect that on the board by dragging and dropping the
                                        card from one list to another.
                                    </p>
                                </div>
                            </div>

                            <div class="step">
                                <span class="counter">5.</span>
                                <div class="text">
                                    <div>
                                        <h3>Deleting Cards</h3>
                                        <p>Once a task is completed, you can either move it to the "Done" list or delete it. Deleting a card will permanently
                                            remove it from the board. Please exercise caution when deleting cards, as this action is irreversible.
                                        </p>
                                    </div>

                                    <p class="reminder">
                                        Remember that using <a href="#">Join</a> effectively requires consistent updates from you and your team to ensure the board reflects the current state of your project.
                                    </p>
                
                                    <p class="footer">
                                        Have more questions about <a href="#">Join</a>? Feel free to contact us at [Your Contact Email]. We're here to help you!
                                    </p>
                                </div>
                            </div> 
                        </div>
                    </section>
                </div>
                
                <h2>Enjoy using Join!</h2>
            </div>
        </div>
    `;
}

function closeHelp() {
    let helpOverlay = document.getElementById('additional-content');
    helpOverlay.innerHTML = '';
}

function openLegalNotice() {}
function closeLegalNotice() {}

// document.addEventListener('DOMContentLoaded', function() {
//     if (document.title === 'Help' || document.title === 'Privacy Policy' || document.title === 'Legal notice') {
//         const backButton = document.getElementById('back');
        
//         backButton.addEventListener('click', function(e) {
//         e.preventDefault();
        
//         // Zur vorherigen Seite zurückgehen
//         window.history.back();
        
//         // Seite neu laden nach kurzer Verzögerung
//         setTimeout(function() {
//             window.location.reload(true);
//         }, 100);
//         });
//     }
//   });
  (function() {
    function initBackButton() {
        const backButtons = document.getElementsByClassName('back');
        
        Array.from(backButtons).forEach(function(backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Zur vorherigen Seite zurückgehen
                window.history.back();
                
                // Seite neu laden nach kurzer Verzögerung
                setTimeout(function() {
                    window.location.reload(true);
                }, 100);
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackButton);
    } else {
        initBackButton();
    }
})();