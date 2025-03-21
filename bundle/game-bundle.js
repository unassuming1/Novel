// Bundled JavaScript for The Grass Crown: Idle Game

// ==================== HELPERS ====================
// Helper functions for the game
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return Math.floor(num);
    }
};

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const chance = (percentage) => {
    return Math.random() < (percentage / 100);
};

// ==================== SAVE MANAGER ====================
const SaveManager = (function() {
    const SAVE_KEY = 'grassCrownIdleGame';
    
    function saveGame() {
        const saveData = {
            resources: Resources.getAll(),
            upgrades: Upgrades.getAll(),
            characters: Characters.getAllData(),
            narrative: Narrative.getSaveData(),
            timePlayed: Game.getTimePlayed(),
            lastSaved: Date.now()
        };
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        return true;
    }
    
    function loadGame() {
        const saveData = localStorage.getItem(SAVE_KEY);
        
        if (!saveData) {
            return false;
        }
        
        try {
            const data = JSON.parse(saveData);
            
            // Load resources
            if (data.resources) {
                Resources.setAll(data.resources);
            }
            
            // Load upgrades
            if (data.upgrades) {
                Upgrades.setAll(data.upgrades);
            }
            
            // Load characters
            if (data.characters) {
                Characters.setAllData(data.characters);
            }
            
            // Load narrative
            if (data.narrative) {
                Narrative.loadSaveData(data.narrative);
            }
            
            // Load time played
            if (data.timePlayed) {
                Game.setTimePlayed(data.timePlayed);
            }
            
            return true;
        } catch (e) {
            console.error('Error loading save data:', e);
            return false;
        }
    }
    
    function resetGame() {
        localStorage.removeItem(SAVE_KEY);
        window.location.reload();
    }
    
    return {
        saveGame,
        loadGame,
        resetGame
    };
})();

// ==================== RESOURCES ====================
const Resources = (function() {
    // Resource data
    let resources = {
        silver: 0,
        food: 10,
        water: 10,
        tools: 0,
        knowledge: 0,
        favor: 0,
        health: 100
    };
    
    // Resource rates (per second)
    let rates = {
        silver: 0,
        food: -0.01,
        water: -0.02,
        tools: 0,
        knowledge: 0,
        favor: 0,
        health: 0
    };
    
    // Resource info
    const resourceInfo = {
        silver: {
            name: 'Silver',
            description: 'The precious metal you mine for your Roman masters.',
            icon: 'silver.svg',
            baseValue: 1
        },
        food: {
            name: 'Food',
            description: 'Basic sustenance to keep you alive.',
            icon: 'food.svg',
            baseValue: 0.5
        },
        water: {
            name: 'Water',
            description: 'Essential for survival in the mines.',
            icon: 'water.svg',
            baseValue: 0.3
        },
        tools: {
            name: 'Tools',
            description: 'Improves your mining efficiency.',
            icon: 'tools.svg',
            baseValue: 5
        },
        knowledge: {
            name: 'Knowledge',
            description: 'Information and skills you\'ve acquired.',
            icon: 'knowledge.svg',
            baseValue: 10
        },
        favor: {
            name: 'Favor',
            description: 'How well you\'re regarded by those in power.',
            icon: 'favor.svg',
            baseValue: 20
        },
        health: {
            name: 'Health',
            description: 'Your physical wellbeing. If this reaches zero, you\'ll need to recover.',
            icon: 'health.svg',
            baseValue: 1
        }
    };
    
    // Get a specific resource
    function get(resource) {
        return resources[resource] || 0;
    }
    
    // Get all resources
    function getAll() {
        return {...resources};
    }
    
    // Set a specific resource
    function set(resource, value) {
        if (resources[resource] !== undefined) {
            resources[resource] = value;
            return true;
        }
        return false;
    }
    
    // Set all resources
    function setAll(newResources) {
        resources = {...newResources};
    }
    
    // Add to a resource
    function add(resource, amount) {
        if (resources[resource] !== undefined) {
            resources[resource] += amount;
            return true;
        }
        return false;
    }
    
    // Subtract from a resource
    function subtract(resource, amount) {
        if (resources[resource] !== undefined) {
            resources[resource] = Math.max(0, resources[resource] - amount);
            return true;
        }
        return false;
    }
    
    // Get resource rate
    function getRate(resource) {
        return rates[resource] || 0;
    }
    
    // Set resource rate
    function setRate(resource, rate) {
        if (rates[resource] !== undefined) {
            rates[resource] = rate;
            return true;
        }
        return false;
    }
    
    // Get all rates
    function getAllRates() {
        return {...rates};
    }
    
    // Get resource info
    function getResourceInfo(resource) {
        return resourceInfo[resource] || null;
    }
    
    // Update resources based on rates
    function update(deltaTime) {
        for (const resource in rates) {
            if (rates[resource] !== 0) {
                resources[resource] += rates[resource] * deltaTime;
                
                // Ensure resources don't go below 0
                if (resources[resource] < 0) {
                    resources[resource] = 0;
                    
                    // Special case for health reaching 0
                    if (resource === 'health' && resources.health <= 0) {
                        Game.triggerEvent('healthDepleted');
                    }
                }
            }
        }
        
        // Check for starvation/dehydration
        if (resources.food <= 0) {
            rates.health = -0.1; // Losing health due to starvation
        } else if (resources.water <= 0) {
            rates.health = -0.2; // Losing health due to dehydration
        } else if (resources.health < 100) {
            rates.health = 0.01; // Slowly recover health if not starving/dehydrated
        } else {
            rates.health = 0;
        }
    }
    
    // Check if player can afford a cost
    function canAfford(cost) {
        for (const resource in cost) {
            if (resources[resource] < cost[resource]) {
                return false;
            }
        }
        return true;
    }
    
    // Pay a cost
    function payCost(cost) {
        if (!canAfford(cost)) {
            return false;
        }
        
        for (const resource in cost) {
            subtract(resource, cost[resource]);
        }
        
        return true;
    }
    
    return {
        get,
        getAll,
        set,
        setAll,
        add,
        subtract,
        getRate,
        setRate,
        getAllRates,
        getResourceInfo,
        update,
        canAfford,
        payCost
    };
})();

// ==================== UPGRADES ====================
const Upgrades = (function() {
    // Upgrade data
    let upgrades = [
        {
            id: 'better_pick',
            name: 'Better Pick',
            description: 'A stronger pick that increases silver mining efficiency.',
            cost: { silver: 50 },
            effect: { silverPerClick: 2 },
            purchased: false,
            visible: true,
            requirements: {}
        },
        {
            id: 'water_flask',
            name: 'Water Flask',
            description: 'A flask to store water, reducing your water consumption rate.',
            cost: { silver: 100 },
            effect: { waterRate: 0.01 },
            purchased: false,
            visible: true,
            requirements: {}
        },
        {
            id: 'food_rations',
            name: 'Better Food Rations',
            description: 'Improved food that lasts longer and keeps you healthier.',
            cost: { silver: 150, food: 20 },
            effect: { foodRate: 0.005, healthRate: 0.01 },
            purchased: false,
            visible: true,
            requirements: {}
        },
        {
            id: 'mining_technique',
            name: 'Improved Mining Technique',
            description: 'A more efficient way to mine silver with less effort.',
            cost: { silver: 200, knowledge: 10 },
            effect: { silverPerClick: 3, healthRate: 0.005 },
            purchased: false,
            visible: false,
            requirements: { knowledge: 10 }
        },
        {
            id: 'overseer_bribe',
            name: 'Bribe the Overseer',
            description: 'Pay the overseer to look the other way, allowing you more freedom.',
            cost: { silver: 300 },
            effect: { favor: 10 },
            purchased: false,
            visible: false,
            requirements: { silver: 250 }
        },
        {
            id: 'secret_stash',
            name: 'Secret Stash',
            description: 'A hidden place to store extra resources away from prying eyes.',
            cost: { silver: 400, tools: 5 },
            effect: { resourceCap: 1.5 },
            purchased: false,
            visible: false,
            requirements: { tools: 5 }
        },
        {
            id: 'veteran_friendship',
            name: 'Befriend Veteran Slave',
            description: 'Gain valuable knowledge from a slave who has survived for years.',
            cost: { food: 30, water: 30 },
            effect: { knowledge: 20, healthRate: 0.02 },
            purchased: false,
            visible: false,
            requirements: { food: 30, water: 30 }
        },
        {
            id: 'messenger_contact',
            name: 'Contact with Messenger',
            description: 'Establish a connection with a messenger who brings news from outside.',
            cost: { silver: 500, favor: 5 },
            effect: { newsAccess: true },
            purchased: false,
            visible: false,
            requirements: { favor: 5 }
        }
    ];
    
    // Get all upgrades
    function getAll() {
        return upgrades.map(upgrade => ({...upgrade}));
    }
    
    // Set all upgrades
    function setAll(newUpgrades) {
        upgrades = [...newUpgrades];
    }
    
    // Get available upgrades
    function getAvailable() {
        return upgrades.filter(upgrade => !upgrade.purchased && upgrade.visible);
    }
    
    // Get purchased upgrades
    function getPurchased() {
        return upgrades.filter(upgrade => upgrade.purchased);
    }
    
    // Purchase an upgrade
    function purchase(id) {
        const upgrade = upgrades.find(u => u.id === id);
        
        if (!upgrade || upgrade.purchased || !upgrade.visible) {
            return false;
        }
        
        if (!Resources.canAfford(upgrade.cost)) {
            return false;
        }
        
        // Pay the cost
        Resources.payCost(upgrade.cost);
        
        // Mark as purchased
        upgrade.purchased = true;
        
        // Apply effects
        applyUpgradeEffects(upgrade);
        
        // Check for newly available upgrades
        updateUpgradeVisibility();
        
        // Trigger event
        Game.triggerEvent('upgradePurchased', upgrade);
        
        return true;
    }
    
    // Apply upgrade effects
    function applyUpgradeEffects(upgrade) {
        for (const effect in upgrade.effect) {
            switch (effect) {
                case 'silverPerClick':
                    Game.setSilverPerClick(Game.getSilverPerClick() + upgrade.effect[effect]);
                    break;
                case 'waterRate':
                    Resources.setRate('water', Resources.getRate('water') + upgrade.effect[effect]);
                    break;
                case 'foodRate':
                    Resources.setRate('food', Resources.getRate('food') + upgrade.effect[effect]);
                    break;
                case 'healthRate':
                    Resources.setRate('health', Resources.getRate('health') + upgrade.effect[effect]);
                    break;
                case 'favor':
                    Resources.add('favor', upgrade.effect[effect]);
                    break;
                case 'knowledge':
                    Resources.add('knowledge', upgrade.effect[effect]);
                    break;
                case 'resourceCap':
                    // This would be implemented if we had resource caps
                    break;
                case 'newsAccess':
                    Narrative.unlockNews();
                    break;
            }
        }
    }
    
    // Update which upgrades are visible based on requirements
    function updateUpgradeVisibility() {
        upgrades.forEach(upgrade => {
            if (!upgrade.visible && !upgrade.purchased) {
                let meetsRequirements = true;
                
                for (const resource in upgrade.requirements) {
                    if (Resources.get(resource) < upgrade.requirements[resource]) {
                        meetsRequirements = false;
                        break;
                    }
                }
                
                if (meetsRequirements) {
                    upgrade.visible = true;
                }
            }
        });
    }
    
    return {
        getAll,
        setAll,
        getAvailable,
        getPurchased,
        purchase,
        updateUpgradeVisibility
    };
})();

// ==================== NARRATIVE ====================
const Narrative = (function() {
    // Story progression
    let storyProgress = 0;
    let newsUnlocked = false;
    
    // News items
    let newsItems = [
        {
            id: 'news_1',
            title: 'Rumors from the Frontier',
            content: 'There are whispers among the slaves about a Roman general leading troops against the Cimbri in the north. Some say he\'s a brilliant tactician.',
            unlocked: false,
            timestamp: 0
        },
        {
            id: 'news_2',
            title: 'Battle Reports',
            content: 'Word has reached the mines that the Roman general Gaius Marius has defeated the Cimbri in a decisive battle. The soldiers are celebrating his victory.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 1 }
        },
        {
            id: 'news_3',
            title: 'The Grass Crown',
            content: 'The messenger speaks of a great honor bestowed upon General Marius. His soldiers have awarded him the corona graminea - the Grass Crown - the highest military honor, woven from grasses collected from the battlefield.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 2 }
        },
        {
            id: 'news_4',
            title: 'Political Tensions',
            content: 'There are rumors of political strife in Rome. General Marius has gained significant popularity and power following his military successes, causing concern among the Senate.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 3 }
        },
        {
            id: 'news_5',
            title: 'Civil Conflict',
            content: 'Disturbing news arrives from Rome. Civil war has broken out between Marius and his former lieutenant Sulla. The Republic is divided, and blood is being spilled in the streets of Rome itself.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 4 }
        }
    ];
    
    // Journal entries
    let journalEntries = [
        {
            id: 'journal_1',
            title: 'First Days in the Mine',
            content: 'I\'ve been sold to work in these silver mines. The conditions are brutal, but I must survive. I hear the overseer speaking of a successful general. Perhaps there\'s hope for a better future, even for a slave like me.',
            unlocked: true,
            timestamp: 0
        },
        {
            id: 'journal_2',
            title: 'The General\'s Name',
            content: 'I learned the general\'s name today - Gaius Marius. They say he rose from humble origins, not unlike myself. Though I am a slave and he a general, there\'s something inspiring about his story.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 1 }
        },
        {
            id: 'journal_3',
            title: 'The Grass Crown',
            content: 'The messenger spoke of a crown made of grass and wildflowers given to Marius by his soldiers. The corona graminea - the highest honor. A crown of worthless weeds that means more than gold. There\'s a lesson there.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 2 }
        },
        {
            id: 'journal_4',
            title: 'Power and Corruption',
            content: 'Marius has become consul seven times, breaking all tradition. Power changes men. I wonder if the humble general who earned the grass crown still exists beneath the politician he\'s become.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 3 }
        },
        {
            id: 'journal_5',
            title: 'The Fall',
            content: 'Civil war. Marius against Sulla. The Republic tears itself apart while we slaves continue to toil in darkness. The grass crown general now leads Romans to kill Romans. Glory is fleeting, but the mines are eternal.',
            unlocked: false,
            timestamp: 0,
            requirement: { storyProgress: 4 }
        }
    ];
    
    // Advance the story
    function advanceStory() {
        storyProgress++;
        
        // Unlock news items
        newsItems.forEach(news => {
            if (!news.unlocked && news.requirement && news.requirement.storyProgress <= storyProgress) {
                unlockNewsItem(news.id);
            }
        });
        
        // Unlock journal entries
        journalEntries.forEach(entry => {
            if (!entry.unlocked && entry.requirement && entry.requirement.storyProgress <= storyProgress) {
                unlockJournalEntry(entry.id);
            }
        });
        
        // Trigger event
        Game.triggerEvent('storyAdvanced', storyProgress);
        
        return storyProgress;
    }
    
    // Get story progress
    function getStoryProgress() {
        return storyProgress;
    }
    
    // Unlock news access
    function unlockNews() {
        newsUnlocked = true;
        
        // Unlock the first news item
        if (newsItems.length > 0) {
            unlockNewsItem(newsItems[0].id);
        }
        
        return true;
    }
    
    // Check if news is unlocked
    function isNewsUnlocked() {
        return newsUnlocked;
    }
    
    // Unlock a specific news item
    function unlockNewsItem(id) {
        const news = newsItems.find(n => n.id === id);
        
        if (news && !news.unlocked) {
            news.unlocked = true;
            news.timestamp = Date.now();
            
            // Trigger event
            Game.triggerEvent('newsUnlocked', news);
            
            return true;
        }
        
        return false;
    }
    
    // Get all news items
    function getNewsItems() {
        return newsItems.filter(news => news.unlocked).map(news => ({...news}));
    }
    
    // Unlock a journal entry
    function unlockJournalEntry(id) {
        const entry = journalEntries.find(e => e.id === id);
        
        if (entry && !entry.unlocked) {
            entry.unlocked = true;
            entry.timestamp = Date.now();
            
            // Trigger event
            Game.triggerEvent('journalEntryUnlocked', entry);
            
            return true;
        }
        
        return false;
    }
    
    // Get all journal entries
    function getJournalEntries() {
        return journalEntries.filter(entry => entry.unlocked).map(entry => ({...entry}));
    }
    
    // Get save data
    function getSaveData() {
        return {
            storyProgress,
            newsUnlocked,
            newsItems: newsItems.map(news => ({
                id: news.id,
                unlocked: news.unlocked,
                timestamp: news.timestamp
            })),
            journalEntries: journalEntries.map(entry => ({
                id: entry.id,
                unlocked: entry.unlocked,
                timestamp: entry.timestamp
            }))
        };
    }
    
    // Load save data
    function loadSaveData(data) {
        if (data.storyProgress !== undefined) {
            storyProgress = data.storyProgress;
        }
        
        if (data.newsUnlocked !== undefined) {
            newsUnlocked = data.newsUnlocked;
        }
        
        if (data.newsItems) {
            data.newsItems.forEach(savedNews => {
                const news = newsItems.find(n => n.id === savedNews.id);
                if (news) {
                    news.unlocked = savedNews.unlocked;
                    news.timestamp = savedNews.timestamp;
                }
            });
        }
        
        if (data.journalEntries) {
            data.journalEntries.forEach(savedEntry => {
                const entry = journalEntries.find(e => e.id === savedEntry.id);
                if (entry) {
                    entry.unlocked = savedEntry.unlocked;
                    entry.timestamp = savedEntry.timestamp;
                }
            });
        }
    }
    
    return {
        advanceStory,
        getStoryProgress,
        unlockNews,
        isNewsUnlocked,
        unlockNewsItem,
        getNewsItems,
        unlockJournalEntry,
        getJournalEntries,
        getSaveData,
        loadSaveData
    };
})();

// ==================== CHARACTERS ====================
const Characters = (function() {
    // Character data
    let characters = {
        player: {
            id: 'player',
            name: 'You',
            role: 'Mine Slave',
            description: 'A slave working in the Roman silver mines, trying to survive while hearing tales of the outside world.',
            portrait: 'player.svg',
            unlocked: true,
            relationshipLevel: 'Self'
        },
        overseer: {
            id: 'overseer',
            name: 'Brutus',
            role: 'Mine Overseer',
            description: 'A harsh taskmaster who ensures the slaves meet their quotas. He can be bribed for small favors.',
            portrait: 'overseer.svg',
            unlocked: false,
            relationshipLevel: 'Hostile'
        },
        veteran_slave: {
            id: 'veteran_slave',
            name: 'Seneca',
            role: 'Veteran Slave',
            description: 'An older slave who has survived the mines for many years. He has valuable knowledge to share.',
            portrait: 'veteran_slave.svg',
            unlocked: false,
            relationshipLevel: 'Neutral'
        },
        messenger: {
            id: 'messenger',
            name: 'Hermes',
            role: 'Messenger',
            description: 'A messenger who travels between the mines and the outside world, bringing news and rumors.',
            portrait: 'messenger.svg',
            unlocked: false,
            relationshipLevel: 'Neutral'
        },
        medicus: {
            id: 'medicus',
            name: 'Galen',
            role: 'Mine Medicus',
            description: 'A slave with medical knowledge who tends to the injured and sick in the mines.',
            portrait: 'medicus.svg',
            unlocked: false,
            relationshipLevel: 'Neutral'
        }
    };
    
    // Unlock a character
    function unlockCharacter(id) {
        if (characters[id] && !characters[id].unlocked) {
            characters[id].unlocked = true;
            
            // Trigger event
            Game.triggerEvent('characterUnlocked', characters[id]);
            
            return true;
        }
        
        return false;
    }
    
    // Improve relationship with a character
    function improveRelationship(id) {
        if (!characters[id] || !characters[id].unlocked) {
            return false;
        }
        
        const levels = ['Hostile', 'Unfriendly', 'Neutral', 'Friendly', 'Trusted', 'Loyal'];
        const currentIndex = levels.indexOf(characters[id].relationshipLevel);
        
        if (currentIndex < levels.length - 1) {
            characters[id].relationshipLevel = levels[currentIndex + 1];
            
            // Trigger event
            Game.triggerEvent('relationshipImproved', {
                character: characters[id],
                oldLevel: levels[currentIndex],
                newLevel: levels[currentIndex + 1]
            });
            
            return true;
        }
        
        return false;
    }
    
    // Get all characters
    function getAll() {
        const result = {};
        
        for (const id in characters) {
            result[id] = {...characters[id]};
        }
        
        return result;
    }
    
    // Get all character data for saving
    function getAllData() {
        const result = {};
        
        for (const id in characters) {
            result[id] = {
                unlocked: characters[id].unlocked,
                relationshipLevel: characters[id].relationshipLevel
            };
        }
        
        return result;
    }
    
    // Set all character data from save
    function setAllData(data) {
        for (const id in data) {
            if (characters[id]) {
                characters[id].unlocked = data[id].unlocked;
                characters[id].relationshipLevel = data[id].relationshipLevel;
            }
        }
    }
    
    return {
        unlockCharacter,
        improveRelationship,
        getAll,
        getAllData,
        setAllData
    };
})();

// ==================== EVENTS ====================
const Events = (function() {
    // Event listeners
    const listeners = {};
    
    // Add event listener
    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        
        listeners[event].push(callback);
        return true;
    }
    
    // Remove event listener
    function off(event, callback) {
        if (!listeners[event]) {
            return false;
        }
        
        const index = listeners[event].indexOf(callback);
        
        if (index !== -1) {
            listeners[event].splice(index, 1);
            return true;
        }
        
        return false;
    }
    
    // Trigger event
    function trigger(event, data) {
        if (!listeners[event]) {
            return false;
        }
        
        listeners[event].forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error(`Error in event listener for ${event}:`, e);
            }
        });
        
        return true;
    }
    
    return {
        on,
        off,
        trigger
    };
})();

// ==================== UI ====================
const UI = (function() {
    // Cache DOM elements
    let elements = {};
    
    // Initialize UI
    function init() {
        cacheElements();
        createResourceCounters();
        updateResourceDisplay();
        
        // Initial tab - only call after elements are cached
        if (elements.tabButtons && elements.tabPanels) {
            switchTab('upgrades');
        } else {
            console.error('Tab elements not properly cached');
            // Fallback: manually set the upgrades tab as active
            const upgradesTab = document.getElementById('upgrades-tab');
            if (upgradesTab) {
                upgradesTab.classList.add('active');
            }
        }
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
        if (!elements.resourceDisplay) return;
        
        elements.resourceDisplay.innerHTML = '';
        
        const resourceTypes = ['silver', 'food', 'water', 'tools', 'knowledge', 'favor', 'health'];
        
        resourceTypes.forEach(type => {
            const resourceInfo = Resources.getResourceInfo(type);
            
            const counter = document.createElement('div');
            counter.className = 'resource-counter';
            counter.id = `${type}-counter`;
            
            const icon = document.createElement('img');
            icon.className = 'resource-icon';
            icon.src = `assets/images/icons/${type}.svg`;
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
        if (elements.currentActivity) {
            elements.currentActivity.textContent = 'Mining silver in the depths of the Roman mine...';
        }
    }
    
    // Update helper display
    function updateHelperDisplay() {
        // This would show active helpers/workers
        // Placeholder for now
        if (elements.helperDisplay) {
            elements.helperDisplay.innerHTML = '<div class="helper-card">No helpers yet</div>';
        }
    }
    
    // Update upgrades tab
    function updateUpgradesTab() {
        if (!elements.availableUpgrades) return;
        
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
        if (!elements.newsFeed) return;
        
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
        if (!elements.characterList) return;
        
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
                    <img src="assets/images/characters/${character.id}.svg" alt="${character.name}">
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
        if (!elements.journalEntries) return;
        
        const journalEntries = Narrative.getJournalEntries();
        
        if (journalEntries.length === 0) {
            elements.journalEntries.innerHTML = '<p>Your journal is empty.</p>';
            return;
        }
        
        elements.journalEntries.innerHTML = '';
        
        // Sort entries by date, newest first
        const sortedEntries = [...journalEntries].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            
            const date = new Date(entry.timestamp);
            const dateString = entry.timestamp ? `Day ${Math.floor(Game.getTimePlayed() / (24 * 60 * 60))}` : 'Day 1';
            
            entryElement.innerHTML = `
                <div class="journal-header">
                    <h3>${entry.title}</h3>
                    <span class="journal-date">${dateString}</span>
                </div>
                <p>${entry.content}</p>
            `;
            
            elements.journalEntries.appendChild(entryElement);
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        if (!elements.notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        elements.notificationArea.appendChild(notification);
        
        // Remove after a delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                elements.notificationArea.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Show modal
    function showModal(title, content) {
        if (!elements.modalContainer || !elements.modalContent) return;
        
        elements.modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;
        
        elements.modalContainer.classList.remove('hidden');
        
        // Add event listener to close button
        const closeButton = elements.modalContent.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', hideModal);
        }
    }
    
    // Hide modal
    function hideModal() {
        if (!elements.modalContainer) return;
        
        elements.modalContainer.classList.add('hidden');
    }
    
    // Show options modal
    function showOptionsModal() {
        const content = `
            <div class="options-container">
                <button id="save-game-button">Save Game</button>
                <button id="reset-game-button">Reset Game</button>
                <div class="volume-control">
                    <label for="volume-slider">Volume</label>
                    <input type="range" id="volume-slider" min="0" max="100" value="50">
                </div>
            </div>
        `;
        
        showModal('Options', content);
        
        // Add event listeners
        const saveButton = document.getElementById('save-game-button');
        const resetButton = document.getElementById('reset-game-button');
        
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                SaveManager.saveGame();
                showNotification('Game saved successfully!');
                hideModal();
            });
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
                    SaveManager.resetGame();
                }
            });
        }
    }
    
    // Switch tab
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
    
    return {
        init,
        update,
        updateResourceDisplay,
        updateUpgradesTab,
        updateNewsTab,
        updateCharactersTab,
        updateJournalTab,
        showNotification,
        showModal,
        hideModal,
        showOptionsModal,
        switchTab
    };
})();

// ==================== GAME ====================
const Game = (function() {
    // Game state
    let running = false;
    let timePlayed = 0; // in seconds
    let lastUpdate = 0;
    let silverPerClick = 1;
    
    // Initialize game
    function init() {
        // Set up event listeners
        Events.on('upgradePurchased', handleUpgradePurchased);
        Events.on('storyAdvanced', handleStoryAdvanced);
        Events.on('healthDepleted', handleHealthDepleted);
        
        // Initialize other modules
        UI.init();
        Upgrades.updateUpgradeVisibility();
        
        // Unlock initial characters
        Characters.unlockCharacter('player');
        
        // Unlock initial journal entry
        // Already done in Narrative initialization
        
        console.log('Game initialized');
    }
    
    // Start game loop
    function start() {
        if (running) return;
        
        running = true;
        lastUpdate = Date.now();
        
        // Start game loop
        requestAnimationFrame(gameLoop);
        
        console.log('Game started');
    }
    
    // Stop game loop
    function stop() {
        running = false;
        console.log('Game stopped');
    }
    
    // Game loop
    function gameLoop() {
        if (!running) return;
        
        const now = Date.now();
        const deltaTime = (now - lastUpdate) / 1000; // Convert to seconds
        lastUpdate = now;
        
        // Update game time
        timePlayed += deltaTime;
        
        // Update resources
        Resources.update(deltaTime);
        
        // Update UI
        UI.update();
        
        // Check for story progression
        checkStoryProgression();
        
        // Continue loop
        requestAnimationFrame(gameLoop);
    }
    
    // Handle mine click
    function handleMineClick(e) {
        // Add silver
        Resources.add('silver', silverPerClick);
        
        // Small chance to find other resources
        if (chance(5)) {
            Resources.add('tools', 1);
        }
        
        if (chance(2)) {
            Resources.add('knowledge', 1);
        }
        
        // Small health cost for mining
        Resources.subtract('health', 0.1);
        
        // Create click effect
        createClickEffect(e);
        
        // Update UI
        UI.updateResourceDisplay();
    }
    
    // Create click effect
    function createClickEffect(e) {
        const clickArea = document.getElementById('mine-click-area');
        
        if (!clickArea) return;
        
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        
        // Position relative to click area
        const rect = clickArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        
        clickArea.appendChild(effect);
        
        // Remove after animation
        setTimeout(() => {
            clickArea.removeChild(effect);
        }, 1000);
    }
    
    // Check for story progression
    function checkStoryProgression() {
        const storyProgress = Narrative.getStoryProgress();
        const silver = Resources.get('silver');
        const knowledge = Resources.get('knowledge');
        
        // Story progression based on silver and knowledge milestones
        if (storyProgress === 0 && silver >= 200) {
            Narrative.advanceStory();
            Characters.unlockCharacter('overseer');
        } else if (storyProgress === 1 && knowledge >= 20) {
            Narrative.advanceStory();
            Characters.unlockCharacter('veteran_slave');
        } else if (storyProgress === 2 && silver >= 500) {
            Narrative.advanceStory();
            Characters.unlockCharacter('messenger');
        } else if (storyProgress === 3 && knowledge >= 50) {
            Narrative.advanceStory();
            Characters.unlockCharacter('medicus');
        }
    }
    
    // Event handlers
    function handleUpgradePurchased(upgrade) {
        UI.showNotification(`Purchased: ${upgrade.name}`);
    }
    
    function handleStoryAdvanced(progress) {
        UI.showNotification('Your understanding of the world has deepened', 'story');
    }
    
    function handleHealthDepleted() {
        UI.showNotification('Your health has reached zero! Rest to recover.', 'warning');
        // Could implement recovery mechanics here
    }
    
    // Getters and setters
    function getTimePlayed() {
        return timePlayed;
    }
    
    function setTimePlayed(time) {
        timePlayed = time;
    }
    
    function getSilverPerClick() {
        return silverPerClick;
    }
    
    function setSilverPerClick(value) {
        silverPerClick = value;
    }
    
    // Trigger an event
    function triggerEvent(event, data) {
        Events.trigger(event, data);
    }
    
    return {
        init,
        start,
        stop,
        handleMineClick,
        getTimePlayed,
        setTimePlayed,
        getSilverPerClick,
        setSilverPerClick,
        triggerEvent
    };
})();

// ==================== MAIN ====================
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
    const mineClickArea = document.getElementById('mine-click-area');
    if (mineClickArea) {
        mineClickArea.addEventListener('click', function(e) {
            Game.handleMineClick(e);
        });
    }
    
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
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            SaveManager.saveGame();
            UI.showNotification('Game saved successfully!');
        });
    }
    
    // Options button
    const optionsButton = document.getElementById('options-button');
    if (optionsButton) {
        optionsButton.addEventListener('click', function() {
            UI.showOptionsModal();
        });
    }
}
