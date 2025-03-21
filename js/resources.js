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
