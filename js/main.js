// main.js - Game initialization and main loop

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('The Grass Crown: Idle Game - Initializing...');
    
    // Initialize game
    Game.init();
    
    // Load saved game if exists
    SaveManager.loadGame();
    
    // Start game loop
    Game.start();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Game initialized successfully!');
});

// Set up UI event listeners
function setupEventListeners() {
    // Mine click area
    document.getElementById('mine-click-area').addEventListener('click', function(e) {
        Game.handleMineClick(e);
    });
    
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            console.log('Tab clicked:', tabName);
            
            // Update active class on buttons
            tabButtons.forEach(btn => {
                if (btn === this) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update active class on panels
            const tabPanels = document.querySelectorAll('.tab-panel');
            tabPanels.forEach(panel => {
                if (panel.id === `${tabName}-tab`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
            
            // Update the tab content
            UI.update();
        });
    });
    
    // Save button
    document.getElementById('save-button').addEventListener('click', function() {
        SaveManager.saveGame();
        UI.showNotification('Game saved successfully!');
    });
    
    // Options button
    document.getElementById('options-button').addEventListener('click', function() {
        UI.showOptionsModal();
    });
    
    // Auto-save every minute
    setInterval(function() {
        SaveManager.saveGame();
        console.log('Auto-saved game');
    }, 60000);
}
