// save.js - Save and load game state

const SaveManager = (function() {
    const SAVE_KEY = 'grassCrownIdleGame';
    
    // Save game state
    function saveGame() {
        const gameState = Game.getState();
        
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }
    
    // Load game state
    function loadGame() {
        try {
            const savedState = localStorage.getItem(SAVE_KEY);
            
            if (!savedState) {
                console.log('No saved game found');
                return false;
            }
            
            const gameState = JSON.parse(savedState);
            return Game.loadState(gameState);
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }
    
    // Reset game
    function resetGame() {
        try {
            localStorage.removeItem(SAVE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to reset game:', error);
            return false;
        }
    }
    
    // Public API
    return {
        saveGame,
        loadGame,
        resetGame
    };
})();
