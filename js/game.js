// game.js - Core game functionality

const Game = (function() {
    // Private variables
    let gameInitialized = false;
    let gameRunning = false;
    let lastUpdate = 0;
    let gameLoopId = null;
    
    // Game state
    const state = {
        startTime: 0,
        currentTime: 0,
        timePlayed: 0,
        clickPower: 1,
        autoMineRate: 0,
        lastOfflineTime: 0
    };
    
    // Initialize game
    function init() {
        if (gameInitialized) return;
        
        // Initialize modules
        Resources.init();
        Upgrades.init();
        Narrative.init();
        Characters.init();
        Events.init();
        UI.init();
        
        state.startTime = Date.now();
        state.currentTime = state.startTime;
        
        gameInitialized = true;
    }
    
    // Start game loop
    function start() {
        if (gameRunning) return;
        
        lastUpdate = Date.now();
        gameLoopId = requestAnimationFrame(gameLoop);
        gameRunning = true;
        
        // Calculate offline progress if needed
        calculateOfflineProgress();
    }
    
    // Stop game loop
    function stop() {
        if (!gameRunning) return;
        
        cancelAnimationFrame(gameLoopId);
        gameRunning = false;
        state.lastOfflineTime = Date.now();
    }
    
    // Main game loop
    function gameLoop(timestamp) {
        // Calculate delta time in seconds
        const now = Date.now();
        const deltaTime = (now - lastUpdate) / 1000;
        lastUpdate = now;
        
        // Update game state
        update(deltaTime);
        
        // Update UI
        UI.update();
        
        // Continue loop
        gameLoopId = requestAnimationFrame(gameLoop);
    }
    
    // Update game state
    function update(deltaTime) {
        state.currentTime = Date.now();
        state.timePlayed += deltaTime;
        
        // Update resources
        updateResources(deltaTime);
        
        // Check for events
        Events.checkForEvents(deltaTime);
        
        // Check for narrative progression
        Narrative.checkProgression();
    }
    
    // Update resources
    function updateResources(deltaTime) {
        // Auto-mine silver
        const silverMined = state.autoMineRate * deltaTime;
        if (silverMined > 0) {
            Resources.add('silver', silverMined);
        }
        
        // Consume food and water
        const foodConsumed = calculateFoodConsumption() * deltaTime;
        const waterConsumed = calculateWaterConsumption() * deltaTime;
        
        Resources.subtract('food', foodConsumed);
        Resources.subtract('water', waterConsumed);
        
        // Update health based on food and water levels
        updateHealth(deltaTime);
    }
    
    // Calculate food consumption rate
    function calculateFoodConsumption() {
        // Base consumption plus helpers
        return 0.1 + (0.05 * Characters.getHelperCount());
    }
    
    // Calculate water consumption rate
    function calculateWaterConsumption() {
        // Base consumption plus helpers
        return 0.15 + (0.08 * Characters.getHelperCount());
    }
    
    // Update player health
    function updateHealth(deltaTime) {
        const foodLevel = Resources.get('food');
        const waterLevel = Resources.get('water');
        
        let healthChange = 0;
        
        // Lose health if out of food or water
        if (foodLevel <= 0 || waterLevel <= 0) {
            healthChange = -0.5 * deltaTime;
        } 
        // Gain health if both are sufficient
        else if (foodLevel > 5 && waterLevel > 5) {
            healthChange = 0.1 * deltaTime;
        }
        
        if (healthChange !== 0) {
            Resources.add('health', healthChange);
        }
        
        // Check for game over
        if (Resources.get('health') <= 0) {
            handleGameOver();
        }
    }
    
    // Handle mine click
    function handleMineClick(event) {
        // Add silver based on click power
        Resources.add('silver', state.clickPower);
        
        // Show click animation
        UI.showClickAnimation(event.clientX, event.clientY);
        
        // Chance for special discovery
        if (Math.random() < 0.05) {
            handleSpecialDiscovery();
        }
    }
    
    // Handle special discovery
    function handleSpecialDiscovery() {
        const discoveryTypes = ['tool', 'food', 'knowledge', 'story'];
        const type = discoveryTypes[Math.floor(Math.random() * discoveryTypes.length)];
        
        switch (type) {
            case 'tool':
                Resources.add('tools', 1);
                UI.showNotification('You found a tool fragment!');
                break;
            case 'food':
                Resources.add('food', 2);
                UI.showNotification('You found some hidden food!');
                break;
            case 'knowledge':
                Resources.add('knowledge', 1);
                UI.showNotification('You learned something new!');
                break;
            case 'story':
                Narrative.triggerRandomStoryBit();
                break;
        }
    }
    
    // Calculate offline progress
    function calculateOfflineProgress() {
        if (state.lastOfflineTime === 0) return;
        
        const offlineTime = Date.now() - state.lastOfflineTime;
        const offlineHours = offlineTime / (1000 * 60 * 60);
        
        // Cap offline progress to 12 hours
        const cappedHours = Math.min(offlineHours, 12);
        
        if (cappedHours > 0.05) { // Only process if more than 3 minutes
            const offlineSeconds = cappedHours * 60 * 60;
            
            // Calculate resources gained (at reduced efficiency)
            const silverGained = state.autoMineRate * offlineSeconds * 0.5;
            
            // Calculate resources consumed
            const foodConsumed = calculateFoodConsumption() * offlineSeconds * 0.7;
            const waterConsumed = calculateWaterConsumption() * offlineSeconds * 0.7;
            
            // Apply changes
            Resources.add('silver', silverGained);
            Resources.subtract('food', foodConsumed);
            Resources.subtract('water', waterConsumed);
            
            // Show offline progress modal
            UI.showOfflineProgressModal({
                time: cappedHours,
                silver: silverGained,
                food: foodConsumed,
                water: waterConsumed
            });
        }
    }
    
    // Handle game over
    function handleGameOver() {
        stop();
        UI.showGameOverModal();
    }
    
    // Get game state for saving
    function getState() {
        return {
            gameState: state,
            resources: Resources.getAll(),
            upgrades: Upgrades.getState(),
            narrative: Narrative.getState(),
            characters: Characters.getState(),
            events: Events.getState(),
            lastSaveTime: Date.now()
        };
    }
    
    // Load game state
    function loadState(savedState) {
        if (!savedState) return false;
        
        // Load game state
        Object.assign(state, savedState.gameState);
        
        // Load module states
        Resources.loadState(savedState.resources);
        Upgrades.loadState(savedState.upgrades);
        Narrative.loadState(savedState.narrative);
        Characters.loadState(savedState.characters);
        Events.loadState(savedState.events);
        
        // Set offline time
        state.lastOfflineTime = savedState.lastSaveTime;
        
        return true;
    }
    
    // Public API
    return {
        init,
        start,
        stop,
        handleMineClick,
        getState,
        loadState,
        getClickPower: () => state.clickPower,
        setClickPower: (value) => { state.clickPower = value; },
        getAutoMineRate: () => state.autoMineRate,
        setAutoMineRate: (value) => { state.autoMineRate = value; },
        getTimePlayed: () => state.timePlayed
    };
})();
