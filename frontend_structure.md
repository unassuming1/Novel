# The Grass Crown: Idle Game - Frontend Structure

## Project Structure
```
/
├── index.html          # Main game page
├── css/                # Stylesheets
│   ├── main.css        # Main styles
│   ├── ui.css          # UI component styles
│   └── animations.css  # Animation styles
├── js/                 # JavaScript files
│   ├── main.js         # Main game initialization
│   ├── game.js         # Core game loop
│   ├── resources.js    # Resource management
│   ├── upgrades.js     # Upgrade system
│   ├── narrative.js    # Story progression
│   ├── characters.js   # Character interactions
│   ├── events.js       # Random events
│   ├── helpers.js      # Helper functions
│   ├── ui.js           # UI updates
│   └── save.js         # Save/load functionality
├── assets/             # Game assets
│   ├── images/         # Image files
│   │   ├── mine/       # Mine visuals
│   │   ├── characters/ # Character portraits
│   │   ├── icons/      # Resource and UI icons
│   │   └── backgrounds/# Background images
│   ├── audio/          # Sound effects and music
│   └── data/           # JSON data files
│       ├── story.json  # Story events and text
│       ├── upgrades.json # Upgrade definitions
│       └── characters.json # Character data
└── README.md           # Project documentation
```

## HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Grass Crown: Idle Game</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/ui.css">
    <link rel="stylesheet" href="css/animations.css">
</head>
<body>
    <div id="game-container">
        <!-- Header Section -->
        <header id="game-header">
            <h1>The Grass Crown: Idle Game</h1>
            <div id="resource-display">
                <!-- Resource counters will be dynamically inserted here -->
            </div>
        </header>

        <!-- Main Game Area -->
        <main id="game-main">
            <!-- Left Panel: Mine View -->
            <section id="mine-view">
                <div id="mine-background"></div>
                <div id="mine-interactive-area"></div>
                <div id="mine-click-area"></div>
            </section>

            <!-- Center Panel: Main Game Interface -->
            <section id="game-interface">
                <div id="current-activity"></div>
                <div id="progress-indicators"></div>
                <div id="helper-display"></div>
            </section>

            <!-- Right Panel: Tabs for different sections -->
            <section id="game-tabs">
                <div id="tab-buttons">
                    <button class="tab-button active" data-tab="upgrades">Upgrades</button>
                    <button class="tab-button" data-tab="news">News</button>
                    <button class="tab-button" data-tab="characters">Characters</button>
                    <button class="tab-button" data-tab="journal">Journal</button>
                </div>
                
                <div id="tab-content">
                    <!-- Upgrades Tab -->
                    <div id="upgrades-tab" class="tab-panel active">
                        <h2>Upgrades</h2>
                        <div id="available-upgrades"></div>
                    </div>
                    
                    <!-- News Tab -->
                    <div id="news-tab" class="tab-panel">
                        <h2>News from the Frontier</h2>
                        <div id="news-feed"></div>
                    </div>
                    
                    <!-- Characters Tab -->
                    <div id="characters-tab" class="tab-panel">
                        <h2>Characters</h2>
                        <div id="character-list"></div>
                    </div>
                    
                    <!-- Journal Tab -->
                    <div id="journal-tab" class="tab-panel">
                        <h2>Journal</h2>
                        <div id="journal-entries"></div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer Section -->
        <footer id="game-footer">
            <div id="status-messages"></div>
            <div id="game-controls">
                <button id="save-button">Save Game</button>
                <button id="options-button">Options</button>
            </div>
        </footer>

        <!-- Modal Dialogs -->
        <div id="modal-container" class="hidden">
            <div id="modal-content"></div>
        </div>

        <!-- Notification Area -->
        <div id="notification-area"></div>
    </div>

    <!-- Scripts -->
    <script src="js/helpers.js"></script>
    <script src="js/save.js"></script>
    <script src="js/resources.js"></script>
    <script src="js/upgrades.js"></script>
    <script src="js/narrative.js"></script>
    <script src="js/characters.js"></script>
    <script src="js/events.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/game.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

## CSS Structure (main.css)

```css
/* Base Styles */
:root {
    /* Color Palette */
    --primary-color: #8B4513; /* SaddleBrown - earthy tone for Roman theme */
    --secondary-color: #CD853F; /* Peru - lighter brown */
    --accent-color: #DAA520; /* GoldenRod - gold for Roman empire */
    --dark-color: #3C2F2F; /* Dark brown for mine */
    --light-color: #F5DEB3; /* Wheat - light parchment color */
    --text-color: #2E2E2E; /* Dark gray for text */
    --text-light: #F5F5F5; /* WhiteSmoke for text on dark backgrounds */
    --danger-color: #8B0000; /* DarkRed for warnings */
    --success-color: #006400; /* DarkGreen for positive indicators */
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* Font Sizes */
    --font-xs: 0.75rem;
    --font-sm: 0.875rem;
    --font-md: 1rem;
    --font-lg: 1.25rem;
    --font-xl: 1.5rem;
    --font-xxl: 2rem;
    
    /* Border Radius */
    --border-radius-sm: 3px;
    --border-radius-md: 5px;
    --border-radius-lg: 8px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Times New Roman', Times, serif;
    color: var(--text-color);
    background-color: var(--light-color);
    line-height: 1.6;
}

#game-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    background-color: var(--light-color);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Header Styles */
#game-header {
    background-color: var(--primary-color);
    color: var(--text-light);
    padding: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid var(--accent-color);
}

#game-header h1 {
    font-size: var(--font-xl);
    font-variant: small-caps;
    letter-spacing: 1px;
}

#resource-display {
    display: flex;
    gap: var(--spacing-md);
}

.resource-counter {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.resource-icon {
    width: 20px;
    height: 20px;
}

/* Main Game Area */
#game-main {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    flex-grow: 1;
}

/* Mine View */
#mine-view {
    position: relative;
    background-color: var(--dark-color);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    min-height: 400px;
}

#mine-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/images/mine/mine-background.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.7;
}

#mine-interactive-area {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
}

#mine-click-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
}

/* Game Interface */
#game-interface {
    background-color: rgba(245, 222, 179, 0.7);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

#current-activity {
    background-color: var(--light-color);
    border: 1px solid var(--secondary-color);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-md);
    min-height: 100px;
}

#progress-indicators {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.progress-bar {
    height: 20px;
    background-color: var(--light-color);
    border: 1px solid var(--secondary-color);
    border-radius: var(--border-radius-sm);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: var(--accent-color);
    width: 0%;
    transition: width 0.3s ease;
}

#helper-display {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: var(--spacing-sm);
}

.helper-card {
    background-color: var(--light-color);
    border: 1px solid var(--secondary-color);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
    text-align: center;
    font-size: var(--font-sm);
}

/* Tabs Section */
#game-tabs {
    background-color: var(--light-color);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--secondary-color);
    overflow: hidden;
}

#tab-buttons {
    display: flex;
    background-color: var(--secondary-color);
}

.tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: var(--font-md);
    color: var(--text-light);
    transition: background-color 0.3s;
}

.tab-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.tab-button.active {
    background-color: var(--primary-color);
    font-weight: bold;
}

.tab-panel {
    display: none;
    padding: var(--spacing-md);
    max-height: 500px;
    overflow-y: auto;
}

.tab-panel.active {
    display: block;
}

/* Footer */
#game-footer {
    background-color: var(--primary-color);
    color: var(--text-light);
    padding: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 3px solid var(--accent-color);
}

#game-controls {
    display: flex;
    gap: var(--spacing-md);
}

button {
    background-color: var(--secondary-color);
    color: var(--text-light);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-family: inherit;
    transition: background-color 0.3s;
}

button:hover {
    background-color: var(--accent-color);
}

/* Modal */
#modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

#modal-container.hidden {
    display: none;
}

#modal-content {
    background-color: var(--light-color);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* Notifications */
#notification-area {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    z-index: 50;
}

.notification {
    background-color: var(--light-color);
    border-left: 4px solid var(--accent-color);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    #game-main {
        grid-template-columns: 1fr;
    }
    
    #game-header {
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    
    #resource-display {
        flex-wrap: wrap;
        justify-content: center;
    }
}
```

## JavaScript Core Structure (main.js)

```javascript
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
            UI.switchTab(tabName);
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
```

## JavaScript Game Core (game.js)

```javascript
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
```

## JavaScript Resources Module (resources.js)

```javascript
// resources.js - Resource management

const Resources = (function() {
    // Resource definitions
    const resourceTypes = {
        silver: { name: 'Silver', icon: 'silver.png', startAmount: 0 },
        food: { name: 'Food', icon: 'food.png', startAmount: 10 },
        water: { name: 'Water', icon: 'water.png', startAmount: 10 },
        tools: { name: 'Tools', icon: 'tools.png', startAmount: 1 },
        knowledge: { name: 'Knowledge', icon: 'knowledge.png', startAmount: 0 },
        favor: { name: 'Favor', icon: 'favor.png', startAmount: 0 },
        health: { name: 'Health', icon: 'health.png', startAmount: 100, max: 100 }
    };
    
    // Current resource amounts
    const resources = {};
    
    // Resource generation rates
    const rates = {};
    
    // Initialize resources
    function init() {
        // Set starting amounts
        for (const [key, config] of Object.entries(resourceTypes)) {
            resources[key] = config.startAmount;
            rates[key] = 0;
        }
        
        // Set initial rates
        rates.silver = 0;
        rates.food = -0.1; // Base consumption
        rates.water = -0.15; // Base consumption
        rates.health = 0;
    }
    
    // Get resource amount
    function get(resourceType) {
        if (resources[resourceType] === undefined) {
            console.error(`Resource type "${resourceType}" does not exist`);
            return 0;
        }
        return resources[resourceType];
    }
    
    // Get all resources
    function getAll() {
        return { ...resources };
    }
    
    // Add to resource
    function add(resourceType, amount) {
        if (resources[resourceType] === undefined) {
            console.error(`Resource type "${resourceType}" does not exist`);
            return;
        }
        
        resources[resourceType] += amount;
        
        // Cap at max if defined
        if (resourceTypes[resourceType].max !== undefined) {
            resources[resourceType] = Math.min(resources[resourceType], resourceTypes[resourceType].max);
        }
        
        // Ensure non-negative for most resources (except rates)
        if (resourceType !== 'health') {
            resources[resourceType] = Math.max(resources[resourceType], 0);
        }
    }
    
    // Subtract from resource
    function subtract(resourceType, amount) {
        add(resourceType, -amount);
    }
    
    // Set resource amount
    function set(resourceType, amount) {
        if (resources[resourceType] === undefined) {
            console.error(`Resource type "${resourceType}" does not exist`);
            return;
        }
        
        resources[resourceType] = amount;
        
        // Cap at max if defined
        if (resourceTypes[resourceType].max !== undefined) {
            resources[resourceType] = Math.min(resources[resourceType], resourceTypes[resourceType].max);
        }
        
        // Ensure non-negative for most resources
        if (resourceType !== 'health') {
            resources[resourceType] = Math.max(resources[resourceType], 0);
        }
    }
    
    // Get resource rate
    function getRate(resourceType) {
        if (rates[resourceType] === undefined) {
            return 0;
        }
        return rates[resourceType];
    }
    
    // Set resource rate
    function setRate(resourceType, rate) {
        if (rates[resourceType] === undefined) {
            rates[resourceType] = 0;
        }
        rates[resourceType] = rate;
    }
    
    // Check if player can afford cost
    function canAfford(costs) {
        for (const [resourceType, amount] of Object.entries(costs)) {
            if (get(resourceType) < amount) {
                return false;
            }
        }
        return true;
    }
    
    // Pay resources
    function pay(costs) {
        if (!canAfford(costs)) {
            return false;
        }
        
        for (const [resourceType, amount] of Object.entries(costs)) {
            subtract(resourceType, amount);
        }
        
        return true;
    }
    
    // Get resource info
    function getResourceInfo(resourceType) {
        return resourceTypes[resourceType];
    }
    
    // Load saved state
    function loadState(savedResources) {
        if (!savedResources) return;
        
        for (const [key, value] of Object.entries(savedResources)) {
            if (resources[key] !== undefined) {
                resources[key] = value;
            }
        }
    }
    
    // Public API
    return {
        init,
        get,
        getAll,
        add,
        subtract,
        set,
        getRate,
        setRate,
        canAfford,
        pay,
        getResourceInfo,
        loadState
    };
})();
```

## JavaScript UI Module (ui.js)

```javascript
// ui.js - User interface management

const UI = (function() {
    // Cache DOM elements
    let elements = {};
    
    // Initialize UI
    function init() {
        cacheElements();
        createResourceCounters();
        updateResourceDisplay();
        
        // Initial tab
        switchTab('upgrades');
    }
    
    // Cache frequently used DOM elements
    function cacheElements() {
        elements = {
            resourceDisplay: document.getElementById('resource-display'),
            mineClickArea: document.getElementById('mine-click-area'),
            currentActivity: document.getElementById('current-activity'),
            progressIndicators: document.getElementById('progress-indicators'),
            helperDisplay: document.getElementById('helper-display'),
            availableUpgrades: document.getElementById('available-upgrades'),
            newsFeed: document.getElementById('news-feed'),
            characterList: document.getElementById('character-list'),
            journalEntries: document.getElementById('journal-entries'),
            statusMessages: document.getElementById('status-messages'),
            modalContainer: document.getElementById('modal-container'),
            modalContent: document.getElementById('modal-content'),
            notificationArea: document.getElementById('notification-area'),
            tabButtons: document.querySelectorAll('.tab-button'),
            tabPanels: document.querySelectorAll('.tab-panel')
        };
    }
    
    // Create resource counters
    function createResourceCounters() {
        elements.resourceDisplay.innerHTML = '';
        
        const resourceTypes = ['silver', 'food', 'water', 'tools', 'knowledge', 'favor', 'health'];
        
        resourceTypes.forEach(type => {
            const resourceInfo = Resources.getResourceInfo(type);
            
            const counter = document.createElement('div');
            counter.className = 'resource-counter';
            counter.id = `${type}-counter`;
            
            const icon = document.createElement('img');
            icon.className = 'resource-icon';
            icon.src = `assets/images/icons/${resourceInfo.icon}`;
            icon.alt = resourceInfo.name;
            
            const value = document.createElement('span');
            value.className = 'resource-value';
            value.id = `${type}-value`;
            value.textContent = '0';
            
            const rate = document.createElement('span');
            rate.className = 'resource-rate';
            rate.id = `${type}-rate`;
            
            counter.appendChild(icon);
            counter.appendChild(value);
            counter.appendChild(rate);
            
            elements.resourceDisplay.appendChild(counter);
        });
    }
    
    // Update the UI
    function update() {
        updateResourceDisplay();
        updateCurrentActivity();
        updateHelperDisplay();
        
        // Update active tab content
        const activeTab = document.querySelector('.tab-panel.active');
        if (activeTab) {
            const tabId = activeTab.id;
            
            switch (tabId) {
                case 'upgrades-tab':
                    updateUpgradesTab();
                    break;
                case 'news-tab':
                    updateNewsTab();
                    break;
                case 'characters-tab':
                    updateCharactersTab();
                    break;
                case 'journal-tab':
                    updateJournalTab();
                    break;
            }
        }
    }
    
    // Update resource display
    function updateResourceDisplay() {
        const resourceTypes = ['silver', 'food', 'water', 'tools', 'knowledge', 'favor', 'health'];
        
        resourceTypes.forEach(type => {
            const value = Resources.get(type);
            const rate = Resources.getRate(type);
            
            const valueElement = document.getElementById(`${type}-value`);
            const rateElement = document.getElementById(`${type}-rate`);
            
            if (valueElement) {
                valueElement.textContent = formatNumber(value);
            }
            
            if (rateElement) {
                if (rate !== 0) {
                    const sign = rate > 0 ? '+' : '';
                    rateElement.textContent = ` (${sign}${formatNumber(rate)}/s)`;
                    rateElement.className = `resource-rate ${rate > 0 ? 'positive' : 'negative'}`;
                } else {
                    rateElement.textContent = '';
                }
            }
        });
    }
    
    // Update current activity display
    function updateCurrentActivity() {
        // This would be updated based on what the player is currently doing
        // For now, just a placeholder
        elements.currentActivity.textContent = 'Mining silver in the depths of the Roman mine...';
    }
    
    // Update helper display
    function updateHelperDisplay() {
        // This would show active helpers/workers
        // Placeholder for now
        elements.helperDisplay.innerHTML = '<div class="helper-card">No helpers yet</div>';
    }
    
    // Update upgrades tab
    function updateUpgradesTab() {
        const availableUpgrades = Upgrades.getAvailable();
        
        if (availableUpgrades.length === 0) {
            elements.availableUpgrades.innerHTML = '<p>No upgrades available yet.</p>';
            return;
        }
        
        elements.availableUpgrades.innerHTML = '';
        
        availableUpgrades.forEach(upgrade => {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-item';
            
            const canAfford = Resources.canAfford(upgrade.cost);
            
            upgradeElement.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <div class="upgrade-cost">
                    ${Object.entries(upgrade.cost).map(([resource, amount]) => 
                        `<span class="${Resources.get(resource) >= amount ? 'can-afford' : 'cannot-afford'}">
                            ${Resources.getResourceInfo(resource).name}: ${formatNumber(amount)}
                        </span>`
                    ).join(', ')}
                </div>
                <button class="upgrade-button" data-id="${upgrade.id}" ${canAfford ? '' : 'disabled'}>
                    ${canAfford ? 'Purchase' : 'Cannot Afford'}
                </button>
            `;
            
            elements.availableUpgrades.appendChild(upgradeElement);
        });
        
        // Add event listeners to upgrade buttons
        const upgradeButtons = elements.availableUpgrades.querySelectorAll('.upgrade-button');
        upgradeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const upgradeId = this.getAttribute('data-id');
                Upgrades.purchase(upgradeId);
                updateUpgradesTab(); // Refresh after purchase
                update(); // Update all UI
            });
        });
    }
    
    // Update news tab
    function updateNewsTab() {
        const newsItems = Narrative.getNewsItems();
        
        if (newsItems.length === 0) {
            elements.newsFeed.innerHTML = '<p>No news from the frontier yet.</p>';
            return;
        }
        
        elements.newsFeed.innerHTML = '';
        
        // Sort news by date, newest first
        const sortedNews = [...newsItems].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedNews.forEach(news => {
            const newsElement = document.createElement('div');
            newsElement.className = 'news-item';
            
            const date = new Date(news.timestamp);
            const dateString = `Day ${Math.floor(Game.getTimePlayed() / (24 * 60 * 60))}`;
            
            newsElement.innerHTML = `
                <div class="news-header">
                    <h3>${news.title}</h3>
                    <span class="news-date">${dateString}</span>
                </div>
                <p>${news.content}</p>
            `;
            
            elements.newsFeed.appendChild(newsElement);
        });
    }
    
    // Update characters tab
    function updateCharactersTab() {
        const characters = Characters.getAll();
        
        if (Object.keys(characters).length === 0) {
            elements.characterList.innerHTML = '<p>You haven\'t met anyone noteworthy yet.</p>';
            return;
        }
        
        elements.characterList.innerHTML = '';
        
        Object.values(characters).forEach(character => {
            if (!character.unlocked) return;
            
            const characterElement = document.createElement('div');
            characterElement.className = 'character-card';
            
            characterElement.innerHTML = `
                <div class="character-portrait">
                    <img src="assets/images/characters/${character.portrait}" alt="${character.name}">
                </div>
                <div class="character-info">
                    <h3>${character.name}</h3>
                    <p class="character-role">${character.role}</p>
                    <p>${character.description}</p>
                    <div class="character-relationship">
                        Relationship: <span class="relationship-level">${character.relationshipLevel}</span>
                    </div>
                </div>
            `;
            
            elements.characterList.appendChild(characterElement);
        });
    }
    
    // Update journal tab
    function updateJournalTab() {
        const journalEntries = Narrative.getJournalEntries();
        
        if (journalEntries.length === 0) {
            elements.journalEntries.innerHTML = '<p>Your journal is empty. Record your experiences as you work in the mine.</p>';
            return;
        }
        
        elements.journalEntries.innerHTML = '';
        
        // Sort entries by date, newest first
        const sortedEntries = [...journalEntries].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            
            const date = new Date(entry.timestamp);
            const dateString = `Day ${Math.floor(entry.gameDay)}`;
            
            entryElement.innerHTML = `
                <div class="entry-header">
                    <h3>${entry.title}</h3>
                    <span class="entry-date">${dateString}</span>
                </div>
                <p>${entry.content}</p>
            `;
            
            elements.journalEntries.appendChild(entryElement);
        });
    }
    
    // Switch active tab
    function switchTab(tabName) {
        // Update tab buttons
        elements.tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update tab panels
        elements.tabPanels.forEach(panel => {
            if (panel.id === `${tabName}-tab`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        // Update the newly active tab content
        update();
    }
    
    // Show click animation
    function showClickAnimation(x, y) {
        const animation = document.createElement('div');
        animation.className = 'click-animation';
        animation.style.left = `${x}px`;
        animation.style.top = `${y}px`;
        
        document.body.appendChild(animation);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(animation);
        }, 1000);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        elements.notificationArea.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                elements.notificationArea.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Show modal
    function showModal(content) {
        elements.modalContent.innerHTML = content;
        elements.modalContainer.classList.remove('hidden');
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', hideModal);
        
        elements.modalContent.appendChild(closeButton);
    }
    
    // Hide modal
    function hideModal() {
        elements.modalContainer.classList.add('hidden');
    }
    
    // Show options modal
    function showOptionsModal() {
        const content = `
            <h2>Game Options</h2>
            <div class="options-container">
                <div class="option-group">
                    <h3>Audio</h3>
                    <label>
                        <input type="checkbox" id="option-sound-effects" checked>
                        Sound Effects
                    </label>
                    <label>
                        <input type="checkbox" id="option-music" checked>
                        Background Music
                    </label>
                    <div class="volume-control">
                        <span>Volume:</span>
                        <input type="range" id="option-volume" min="0" max="100" value="50">
                    </div>
                </div>
                <div class="option-group">
                    <h3>Display</h3>
                    <label>
                        <input type="checkbox" id="option-animations" checked>
                        Show Animations
                    </label>
                    <label>
                        <input type="checkbox" id="option-notifications" checked>
                        Show Notifications
                    </label>
                </div>
                <div class="option-group">
                    <h3>Game</h3>
                    <button id="reset-game-button">Reset Game</button>
                    <p class="warning">Warning: This will delete all progress!</p>
                </div>
            </div>
        `;
        
        showModal(content);
        
        // Add event listener for reset button
        document.getElementById('reset-game-button').addEventListener('click', function() {
            if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
                SaveManager.resetGame();
                location.reload();
            }
        });
    }
    
    // Show offline progress modal
    function showOfflineProgressModal(progress) {
        const content = `
            <h2>Welcome Back!</h2>
            <p>You were away for ${formatTime(progress.time)}.</p>
            <div class="offline-progress">
                <h3>While you were away:</h3>
                <ul>
                    <li>Mined ${formatNumber(progress.silver)} silver</li>
                    <li>Consumed ${formatNumber(progress.food)} food</li>
                    <li>Consumed ${formatNumber(progress.water)} water</li>
                </ul>
            </div>
        `;
        
        showModal(content);
    }
    
    // Show game over modal
    function showGameOverModal() {
        const content = `
            <h2>Game Over</h2>
            <p>You have died in the silver mines of Rome.</p>
            <p>You survived for ${formatTime(Game.getTimePlayed())}.</p>
            <button id="restart-game-button">Start New Game</button>
        `;
        
        showModal(content);
        
        // Add event listener for restart button
        document.getElementById('restart-game-button').addEventListener('click', function() {
            SaveManager.resetGame();
            location.reload();
        });
    }
    
    // Format number for display
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else if (Number.isInteger(num)) {
            return num.toString();
        } else {
            return num.toFixed(1);
        }
    }
    
    // Format time for display
    function formatTime(hours) {
        if (hours < 1) {
            return Math.floor(hours * 60) + ' minutes';
        } else if (hours < 24) {
            return Math.floor(hours) + ' hours, ' + Math.floor((hours % 1) * 60) + ' minutes';
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = Math.floor(hours % 24);
            return days + ' days, ' + remainingHours + ' hours';
        }
    }
    
    // Public API
    return {
        init,
        update,
        switchTab,
        showClickAnimation,
        showNotification,
        showModal,
        hideModal,
        showOptionsModal,
        showOfflineProgressModal,
        showGameOverModal
    };
})();
```

## JavaScript Save Manager (save.js)

```javascript
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
```

## Directory Structure Creation

Let's create the necessary directory structure for the game:

```
/home/ubuntu/Novel/
├── index.html
├── css/
│   ├── main.css
│   ├── ui.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── resources.js
│   ├── upgrades.js
│   ├── narrative.js
│   ├── characters.js
│   ├── events.js
│   ├── helpers.js
│   ├── ui.js
│   └── save.js
└── assets/
    ├── images/
    │   ├── mine/
    │   ├── characters/
    │   ├── icons/
    │   └── backgrounds/
    ├── audio/
    └── data/
```
