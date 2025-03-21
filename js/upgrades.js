// upgrades.js - Upgrade system

const Upgrades = (function() {
    // Upgrade definitions
    const upgradeDefinitions = [
        {
            id: 'basic_tools',
            name: 'Basic Mining Tools',
            description: 'Improve your mining tools to increase silver production.',
            cost: { silver: 50 },
            requirements: {},
            effects: {
                clickPower: 2
            },
            purchased: false,
            visible: true
        },
        {
            id: 'water_bucket',
            name: 'Water Bucket',
            description: 'A larger bucket to store more water.',
            cost: { silver: 100 },
            requirements: { upgrades: ['basic_tools'] },
            effects: {
                resources: { water: 5 }
            },
            purchased: false,
            visible: false
        },
        {
            id: 'food_pouch',
            name: 'Food Pouch',
            description: 'A pouch to store more food rations.',
            cost: { silver: 150 },
            requirements: { upgrades: ['basic_tools'] },
            effects: {
                resources: { food: 5 }
            },
            purchased: false,
            visible: false
        },
        {
            id: 'mining_technique',
            name: 'Improved Mining Technique',
            description: 'Learn better mining techniques from other slaves.',
            cost: { silver: 200, knowledge: 1 },
            requirements: { upgrades: ['basic_tools'] },
            effects: {
                clickPower: 3,
                autoMine: 0.1
            },
            purchased: false,
            visible: false
        },
        {
            id: 'helper_slave',
            name: 'Helper Slave',
            description: 'Convince another slave to help you mine.',
            cost: { silver: 300, food: 10, favor: 1 },
            requirements: { upgrades: ['mining_technique'] },
            effects: {
                autoMine: 0.5
            },
            purchased: false,
            visible: false
        },
        {
            id: 'iron_pick',
            name: 'Iron Pickaxe',
            description: 'A stronger pickaxe that breaks through rock more efficiently.',
            cost: { silver: 500, tools: 2 },
            requirements: { upgrades: ['mining_technique'] },
            effects: {
                clickPower: 5
            },
            purchased: false,
            visible: false
        },
        {
            id: 'water_source',
            name: 'Access to Water Source',
            description: 'Find a small underground water source in the mine.',
            cost: { silver: 750, knowledge: 3 },
            requirements: { upgrades: ['water_bucket'] },
            effects: {
                resourceRates: { water: 0.1 }
            },
            purchased: false,
            visible: false
        },
        {
            id: 'food_storage',
            name: 'Hidden Food Storage',
            description: 'Create a secret place to store more food safely.',
            cost: { silver: 1000, tools: 3 },
            requirements: { upgrades: ['food_pouch'] },
            effects: {
                resources: { food: 15 }
            },
            purchased: false,
            visible: false
        },
        {
            id: 'mining_team',
            name: 'Mining Team',
            description: 'Organize a small team of slaves to mine together.',
            cost: { silver: 2000, food: 30, water: 20, favor: 3 },
            requirements: { upgrades: ['helper_slave'] },
            effects: {
                autoMine: 2
            },
            purchased: false,
            visible: false
        },
        {
            id: 'overseer_favor',
            name: 'Overseer\'s Favor',
            description: 'Gain the favor of a mine overseer for better treatment.',
            cost: { silver: 3000, favor: 5 },
            requirements: { upgrades: ['mining_team'] },
            effects: {
                resourceRates: { food: 0.05, water: 0.05 },
                unlocks: ['overseer_character']
            },
            purchased: false,
            visible: false
        },
        {
            id: 'steel_pick',
            name: 'Steel Pickaxe',
            description: 'A premium quality pickaxe that greatly increases mining efficiency.',
            cost: { silver: 5000, tools: 5 },
            requirements: { upgrades: ['iron_pick'] },
            effects: {
                clickPower: 10
            },
            purchased: false,
            visible: false
        },
        {
            id: 'messenger_contact',
            name: 'Messenger Contact',
            description: 'Establish contact with a messenger who brings news from the frontier.',
            cost: { silver: 7500, favor: 8 },
            requirements: { upgrades: ['overseer_favor'] },
            effects: {
                unlocks: ['messenger_character', 'news_system']
            },
            purchased: false,
            visible: false
        },
        {
            id: 'medical_knowledge',
            name: 'Basic Medical Knowledge',
            description: 'Learn how to treat minor injuries and illnesses.',
            cost: { silver: 10000, knowledge: 10 },
            requirements: { upgrades: ['messenger_contact'] },
            effects: {
                resourceRates: { health: 0.1 }
            },
            purchased: false,
            visible: false
        },
        {
            id: 'silver_stash',
            name: 'Hidden Silver Stash',
            description: 'Create a secret place to hide some of your silver from inspections.',
            cost: { silver: 15000, tools: 8 },
            requirements: { upgrades: ['steel_pick'] },
            effects: {
                silverStorage: 5000
            },
            purchased: false,
            visible: false
        },
        {
            id: 'master_miner',
            name: 'Master Miner Status',
            description: 'Your mining skills are recognized, granting you special privileges.',
            cost: { silver: 25000, knowledge: 15, favor: 10 },
            requirements: { upgrades: ['steel_pick', 'medical_knowledge'] },
            effects: {
                clickPower: 20,
                autoMine: 5,
                resourceRates: { food: 0.1, water: 0.1 }
            },
            purchased: false,
            visible: false
        }
    ];
    
    // Current upgrades state
    let upgrades = [];
    
    // Initialize upgrades
    function init() {
        upgrades = [...upgradeDefinitions];
        updateVisibility();
    }
    
    // Update which upgrades are visible based on requirements
    function updateVisibility() {
        upgrades.forEach(upgrade => {
            if (upgrade.purchased) return;
            
            // Check requirements
            const meetsRequirements = checkRequirements(upgrade.requirements);
            upgrade.visible = meetsRequirements;
        });
    }
    
    // Check if requirements are met
    function checkRequirements(requirements) {
        if (!requirements) return true;
        
        // Check upgrade requirements
        if (requirements.upgrades) {
            for (const upgradeId of requirements.upgrades) {
                const requiredUpgrade = upgrades.find(u => u.id === upgradeId);
                if (!requiredUpgrade || !requiredUpgrade.purchased) {
                    return false;
                }
            }
        }
        
        // Check resource requirements
        if (requirements.resources) {
            for (const [resource, amount] of Object.entries(requirements.resources)) {
                if (Resources.get(resource) < amount) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Get available upgrades
    function getAvailable() {
        return upgrades.filter(upgrade => upgrade.visible && !upgrade.purchased);
    }
    
    // Get purchased upgrades
    function getPurchased() {
        return upgrades.filter(upgrade => upgrade.purchased);
    }
    
    // Purchase an upgrade
    function purchase(upgradeId) {
        const upgrade = upgrades.find(u => u.id === upgradeId);
        
        if (!upgrade) {
            console.error(`Upgrade "${upgradeId}" not found`);
            return false;
        }
        
        if (upgrade.purchased) {
            console.log(`Upgrade "${upgradeId}" already purchased`);
            return false;
        }
        
        if (!upgrade.visible) {
            console.error(`Upgrade "${upgradeId}" not available`);
            return false;
        }
        
        // Check if player can afford the upgrade
        if (!Resources.canAfford(upgrade.cost)) {
            console.log(`Cannot afford upgrade "${upgradeId}"`);
            return false;
        }
        
        // Pay for the upgrade
        Resources.pay(upgrade.cost);
        
        // Apply upgrade effects
        applyUpgradeEffects(upgrade);
        
        // Mark as purchased
        upgrade.purchased = true;
        
        // Update visibility of other upgrades
        updateVisibility();
        
        console.log(`Purchased upgrade "${upgradeId}"`);
        return true;
    }
    
    // Apply upgrade effects
    function applyUpgradeEffects(upgrade) {
        const effects = upgrade.effects;
        
        if (!effects) return;
        
        // Apply click power effect
        if (effects.clickPower) {
            Game.setClickPower(effects.clickPower);
        }
        
        // Apply auto mine effect
        if (effects.autoMine) {
            Game.setAutoMineRate(Game.getAutoMineRate() + effects.autoMine);
        }
        
        // Apply resource effects
        if (effects.resources) {
            for (const [resource, amount] of Object.entries(effects.resources)) {
                Resources.add(resource, amount);
            }
        }
        
        // Apply resource rate effects
        if (effects.resourceRates) {
            for (const [resource, rate] of Object.entries(effects.resourceRates)) {
                Resources.setRate(resource, Resources.getRate(resource) + rate);
            }
        }
        
        // Apply unlock effects
        if (effects.unlocks) {
            for (const unlockId of effects.unlocks) {
                if (unlockId.endsWith('_character')) {
                    const characterId = unlockId.replace('_character', '');
                    Characters.unlock(characterId);
                } else if (unlockId === 'news_system') {
                    Narrative.unlockNewsSystem();
                }
            }
        }
    }
    
    // Get upgrade by ID
    function getUpgrade(upgradeId) {
        return upgrades.find(u => u.id === upgradeId);
    }
    
    // Get upgrade state for saving
    function getState() {
        return upgrades.map(upgrade => ({
            id: upgrade.id,
            purchased: upgrade.purchased,
            visible: upgrade.visible
        }));
    }
    
    // Load upgrade state
    function loadState(savedUpgrades) {
        if (!savedUpgrades) return;
        
        savedUpgrades.forEach(savedUpgrade => {
            const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
            if (upgrade) {
                upgrade.purchased = savedUpgrade.purchased;
                upgrade.visible = savedUpgrade.visible;
            }
        });
        
        // Re-apply effects of purchased upgrades
        upgrades.filter(u => u.purchased).forEach(upgrade => {
            applyUpgradeEffects(upgrade);
        });
        
        updateVisibility();
    }
    
    // Public API
    return {
        init,
        getAvailable,
        getPurchased,
        purchase,
        getUpgrade,
        getState,
        loadState
    };
})();
