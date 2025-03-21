// game.js - Core game functionality with true idle mechanics

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
        autoMineRate: 0.5, // Start with some automatic mining (changed from 0)
        resourceRates: {
            silver: 0.5,   // Base rate for silver per second
            food: -0.1,    // Consumption rate
            water: -0.15,  // Consumption rate
            tools: 0.05,   // Slow automatic tool creation
            knowledge: 0.02, // Slow knowledge gain
            favor: 0.01,   // Very slow favor gain
            health: 0.0    // Health is neutral by default
        },
        resourceMultipliers: {
            silver: 1,
            food: 1,
            water: 1,
            tools: 1,
            knowledge: 1,
            favor: 1,
            health: 1
        },
        lastOfflineTime: 0,
        idleMode: true, // New property to track if idle mode is active
        narrativeUpdateTimer: 0, // Timer for narrative updates
        narrativeUpdateInterval: 30, // Update narrative every 30 seconds
        mineLevel: 1, // Current mine level
        mineLevelCost: 100, // Base cost to upgrade mine level
        mineLevelMultiplier: 1.5, // Multiplier for mine level costs
        automationLevel: {
            silver: 1,
            food: 0,
            water: 0,
            tools: 0
        },
        automationCost: {
            silver: 50,
            food: 100,
            water: 75,
            tools: 150
        },
        automationMultiplier: 1.8, // Cost increase for automation upgrades
        eventProbability: 0.05, // 5% chance of random event per minute
        eventTimer: 0,
        eventInterval: 60, // Check for events every minute
        tutorialComplete: false,
        tutorialStep: 0,
        achievementsUnlocked: []
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
        
        // Set initial resource values
        Resources.set('silver', 0);
        Resources.set('food', 10);
        Resources.set('water', 10);
        Resources.set('tools', 5);
        Resources.set('knowledge', 0);
        Resources.set('favor', 0);
        Resources.set('health', 100);
        
        // Set up resource production based on automation levels
        updateResourceRates();
        
        // Start tutorial if not completed
        if (!state.tutorialComplete) {
            startTutorial();
        }
        
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
        updateEventTimer(deltaTime);
        
        // Update narrative timer
        updateNarrativeTimer(deltaTime);
        
        // Check for narrative progression
        Narrative.checkProgression();
        
        // Check for achievements
        checkAchievements();
    }
    
    // Update resources based on rates and automation
    function updateResources(deltaTime) {
        // Apply resource rates to all resources
        for (const [resource, rate] of Object.entries(state.resourceRates)) {
            const effectiveRate = rate * state.resourceMultipliers[resource];
            const change = effectiveRate * deltaTime;
            
            if (change !== 0) {
                Resources.add(resource, change);
            }
        }
        
        // Update health based on food and water levels
        updateHealth(deltaTime);
        
        // Check for game over
        if (Resources.get('health') <= 0) {
            handleGameOver();
        }
    }
    
    // Update health based on food and water levels
    function updateHealth(deltaTime) {
        const foodLevel = Resources.get('food');
        const waterLevel = Resources.get('water');
        
        let healthChange = 0;
        
        // Lose health if out of food or water
        if (foodLevel <= 0 && waterLevel <= 0) {
            healthChange = -1.0 * deltaTime; // Faster health loss if both are depleted
        } 
        else if (foodLevel <= 0 || waterLevel <= 0) {
            healthChange = -0.5 * deltaTime; // Lose health if either is depleted
        } 
        // Gain health if both are sufficient
        else if (foodLevel > 5 && waterLevel > 5) {
            healthChange = 0.1 * deltaTime;
        }
        
        if (healthChange !== 0) {
            // Apply health change directly to avoid double-counting with resource rates
            Resources.set('health', Math.min(100, Math.max(0, Resources.get('health') + healthChange)));
        }
    }
    
    // Update resource rates based on upgrades and automation
    function updateResourceRates() {
        // Base rates
        state.resourceRates.silver = 0.5 * state.automationLevel.silver;
        state.resourceRates.food = -0.1 + (0.15 * state.automationLevel.food);
        state.resourceRates.water = -0.15 + (0.2 * state.automationLevel.water);
        state.resourceRates.tools = 0.05 * state.automationLevel.tools;
        
        // Apply mine level multiplier to silver production
        state.resourceRates.silver *= (1 + (state.mineLevel - 1) * 0.5);
        
        // Knowledge and favor rates scale with other resources
        state.resourceRates.knowledge = 0.02 * (1 + Resources.get('tools') / 50);
        state.resourceRates.favor = 0.01 * (1 + Resources.get('silver') / 1000);
        
        // Health is managed separately
        state.resourceRates.health = 0;
        
        // Apply any active effects from events or story
        // (This would be implemented when we have such effects)
        
        // Update UI to show new rates
        UI.updateResourceRates();
    }
    
    // Update narrative timer
    function updateNarrativeTimer(deltaTime) {
        state.narrativeUpdateTimer += deltaTime;
        
        if (state.narrativeUpdateTimer >= state.narrativeUpdateInterval) {
            state.narrativeUpdateTimer = 0;
            
            // Trigger narrative update
            Narrative.checkProgression();
            
            // Small chance to trigger a random story bit
            if (Math.random() < 0.2) { // 20% chance each interval
                Narrative.triggerRandomStoryBit();
            }
        }
    }
    
    // Update event timer
    function updateEventTimer(deltaTime) {
        state.eventTimer += deltaTime;
        
        if (state.eventTimer >= state.eventInterval) {
            state.eventTimer = 0;
            
            // Check for random events
            if (Math.random() < state.eventProbability) {
                Events.triggerRandomEvent();
            }
        }
    }
    
    // Upgrade mine level
    function upgradeMineLevel() {
        const cost = calculateMineLevelCost();
        
        if (Resources.get('silver') >= cost) {
            Resources.subtract('silver', cost);
            state.mineLevel++;
            updateResourceRates();
            
            UI.showNotification(`Mine upgraded to level ${state.mineLevel}!`);
            return true;
        }
        
        return false;
    }
    
    // Calculate cost for next mine level
    function calculateMineLevelCost() {
        return Math.floor(state.mineLevelCost * Math.pow(state.mineLevelMultiplier, state.mineLevel - 1));
    }
    
    // Upgrade automation for a resource
    function upgradeAutomation(resource) {
        if (!state.automationCost[resource]) return false;
        
        const cost = calculateAutomationCost(resource);
        
        if (Resources.get('silver') >= cost) {
            Resources.subtract('silver', cost);
            state.automationLevel[resource]++;
            updateResourceRates();
            
            UI.showNotification(`${resource.charAt(0).toUpperCase() + resource.slice(1)} automation upgraded to level ${state.automationLevel[resource]}!`);
            return true;
        }
        
        return false;
    }
    
    // Calculate cost for next automation level
    function calculateAutomationCost(resource) {
        return Math.floor(state.automationCost[resource] * Math.pow(state.automationMultiplier, state.automationLevel[resource]));
    }
    
    // Handle mine click (still available but less important)
    function handleMineClick(event) {
        // Add silver based on click power (reduced impact)
        const clickPower = 1 + (state.mineLevel * 0.5);
        Resources.add('silver', clickPower);
        
        // Show click animation
        UI.showClickAnimation(event.clientX, event.clientY);
        
        // Chance for special discovery (higher than before to reward clicking)
        if (Math.random() < 0.1) {
            handleSpecialDiscovery();
        }
    }
    
    // Handle special discovery
    function handleSpecialDiscovery() {
        const discoveryTypes = ['tool', 'food', 'water', 'knowledge', 'story'];
        const type = discoveryTypes[Math.floor(Math.random() * discoveryTypes.length)];
        
        switch (type) {
            case 'tool':
                Resources.add('tools', 1 + state.mineLevel);
                UI.showNotification('You found some tool fragments!');
                break;
            case 'food':
                Resources.add('food', 2 + state.mineLevel);
                UI.showNotification('You found some hidden food!');
                break;
            case 'water':
                Resources.add('water', 2 + state.mineLevel);
                UI.showNotification('You found a water source!');
                break;
            case 'knowledge':
                Resources.add('knowledge', 1 + Math.floor(state.mineLevel / 2));
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
            
            // Calculate resources gained/consumed (at reduced efficiency)
            const offlineEfficiency = 0.7; // 70% efficiency when offline
            
            // Track changes for display
            const changes = {};
            
            // Apply resource changes
            for (const [resource, rate] of Object.entries(state.resourceRates)) {
                const effectiveRate = rate * state.resourceMultipliers[resource] * offlineEfficiency;
                const change = effectiveRate * offlineSeconds;
                
                if (change !== 0) {
                    // Special handling for health to prevent death while offline
                    if (resource === 'health') {
                        const newHealth = Math.max(1, Resources.get('health') + change);
                        Resources.set('health', newHealth);
                        changes[resource] = newHealth - Resources.get('health');
                    } else {
                        Resources.add(resource, change);
                        changes[resource] = change;
                    }
                }
            }
            
            // Show offline progress modal
            UI.showOfflineProgressModal({
                time: cappedHours,
                changes: changes
            });
            
            // Check for narrative progression after offline time
            Narrative.checkProgression();
        }
    }
    
    // Toggle idle mode
    function toggleIdleMode() {
        state.idleMode = !state.idleMode;
        UI.updateIdleModeDisplay(state.idleMode);
        return state.idleMode;
    }
    
    // Start tutorial
    function startTutorial() {
        state.tutorialStep = 1;
        showTutorialStep();
    }
    
    // Show current tutorial step
    function showTutorialStep() {
        switch (state.tutorialStep) {
            case 1:
                UI.showTutorial("Welcome to the silver mines! You are a slave working here, hearing distant tales of Rome's politics and wars. The mine produces resources automatically - you don't need to constantly click.");
                break;
            case 2:
                UI.showTutorial("Your main resources are silver, food, and water. You need food and water to survive. If either runs out, your health will decline.");
                break;
            case 3:
                UI.showTutorial("As you gather silver, you'll hear news about a Roman general named Sulla and his grass crown. The narrative will unfold automatically as you progress.");
                break;
            case 4:
                UI.showTutorial("You can upgrade your mine and automation levels to increase resource production. This is an idle game - resources accumulate even when you're not actively playing.");
                break;
            case 5:
                UI.showTutorial("That's all you need to know to get started. Good luck in the mines, and pay attention to the stories you hear about Sulla and the Grass Crown!");
                state.tutorialComplete = true;
                break;
        }
    }
    
    // Advance tutorial to next step
    function advanceTutorial() {
        if (state.tutorialStep < 5) {
            state.tutorialStep++;
            showTutorialStep();
            return true;
        }
        return false;
    }
    
    // Check for achievements
    function checkAchievements() {
        // Silver milestones
        const silverMilestones = [100, 1000, 10000, 100000, 1000000];
        const silverAmount = Resources.get('silver');
        
        silverMilestones.forEach(milestone => {
            const achievementId = `silver_${milestone}`;
            if (silverAmount >= milestone && !state.achievementsUnlocked.includes(achievementId)) {
                unlockAchievement(achievementId, `Mined ${milestone} Silver`);
            }
        });
        
        // Mine level milestones
        const mineLevelMilestones = [5, 10, 25, 50, 100];
        
        mineLevelMilestones.forEach(milestone => {
            const achievementId = `mine_level_${milestone}`;
            if (state.mineLevel >= milestone && !state.achievementsUnlocked.includes(achievementId)) {
                unlockAchievement(achievementId, `Mine Level ${milestone}`);
            }
        });
        
        // Story progress milestones
        const storyMilestones = [5, 10, 15];
        const storyProgress = Narrative.getStoryProgress();
        
        storyMilestones.forEach(milestone => {
            const achievementId = `story_${milestone}`;
            if (storyProgress >= milestone && !state.achievementsUnlocked.includes(achievementId)) {
                unlockAchievement(achievementId, `Uncovered ${milestone} Story Elements`);
            }
        });
    }
    
    // Unlock an achievement
    function unlockAchievement(id, name) {
        state.achievementsUnlocked.push(id);
        UI.showNotification(`Achievement Unlocked: ${name}`);
        UI.updateAchievements();
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
        
        // Update resource rates based on loaded state
        updateResourceRates();
        
        return true;
    }
    
    // Public API
    return {
        init,
        start,
        stop,
        handleMineClick,
        upgradeMineLevel,
        upgradeAutomation,
        toggleIdleMode,
        advanceTutorial,
        getState,
        loadState,
        getMineLevel: () => state.mineLevel,
        getMineLevelCost: calculateMineLevelCost,
        getAutomationLevel: (resource) => state.automationLevel[resource] || 0,
        getAutomationCost: calculateAutomationCost,
        getResourceRate: (resource) => state.resourceRates[resource] * state.resourceMultipliers[resource],
        getResourceMultiplier: (resource) => state.resourceMultipliers[resource],
        setResourceMultiplier: (resource, value) => { state.resourceMultipliers[resource] = value; updateResourceRates(); },
        isIdleModeActive: () => state.idleMode,
        getTimePlayed: () => state.timePlayed,
        getAchievements: () => state.achievementsUnlocked
    };
})();
