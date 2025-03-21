// upgrades.js - Handles all upgrade systems for the idle game

// Upgrade definitions
const upgrades = {
  tools: {
    name: "Mining Tools",
    level: 1,
    maxLevel: 4,
    baseCost: 100,
    costMultiplier: 2.5,
    description: [
      "Wooden Pick - Basic mining tool",
      "Iron Pick - 50% faster mining",
      "Steel Pick - 100% faster mining and improved durability",
      "Silver-inlaid Pick - 150% faster mining and special ore discovery"
    ],
    effect: function(level) {
      // Apply tool tier effects
      resources.tools.tier = level;
      
      // Reset durability to max when upgrading
      resources.tools.durability = resources.tools.max;
      
      // Improve durability max at higher tiers
      if (level >= 3) {
        resources.tools.max = 150;
      }
      
      // Update mining efficiency
      updateMiningEfficiency();
      
      // Update displays
      updateResourceDisplay();
      updateUpgradeDisplay();
    }
  },
  
  livingQuarters: {
    name: "Living Quarters",
    level: 0,
    maxLevel: 4,
    baseCost: 200,
    costMultiplier: 2,
    description: [
      "Shared Barracks - Basic sleeping area",
      "Private Corner - Slightly better rest quality",
      "Small Cell - Improved rest and storage",
      "Comfortable Quarters - Best rest quality and storage",
      "Hidden Refuge - Maximum rest and special options"
    ],
    effect: function(level) {
      // Improve health regeneration rate when resting
      const healthBonus = 0.25 * level; // 25% per level
      
      // Improve storage capacity
      const storageBonus = 0.2 * level; // 20% per level
      resources.silver.max = Math.floor(100 * (1 + storageBonus));
      resources.food.max = Math.floor(120 * (1 + storageBonus));
      resources.water.max = Math.floor(240 * (1 + storageBonus));
      resources.medicine.max = Math.floor(20 * (1 + storageBonus));
      
      // Update displays
      updateResourceDisplay();
      updateUpgradeDisplay();
    }
  },
  
  connections: {
    name: "Connections",
    level: 0,
    maxLevel: 4,
    baseCost: 300,
    costMultiplier: 3,
    description: [
      "No Connections - You're on your own",
      "Fellow Slaves - Basic information network",
      "Friendly Guard - Access to guard information",
      "Merchant Contact - Trading opportunities",
      "Administrator's Assistant - High-level information"
    ],
    effect: function(level) {
      // Unlock new narrative options
      if (level === 1) {
        addLogMessage("You've established connections with fellow slaves. New information sources available.");
        unlockCharacter("elva");
      } else if (level === 2) {
        addLogMessage("You've gained the trust of a guard. New information sources available.");
        unlockCharacter("marcus");
      } else if (level === 3) {
        addLogMessage("You've established contact with a merchant. New trading options available.");
        unlockCharacter("cassius");
      } else if (level === 4) {
        addLogMessage("You've gained access to the administrator's assistant. High-level information available.");
        unlockCharacter("livia");
      }
      
      // Update displays
      updateUpgradeDisplay();
    }
  },
  
  storage: {
    name: "Storage Solutions",
    level: 0,
    maxLevel: 3,
    baseCost: 150,
    costMultiplier: 1.8,
    description: [
      "Basic Storage - Limited capacity",
      "Hidden Caches - 50% more storage",
      "Secure Containers - 100% more storage",
      "Network of Hiding Spots - 200% more storage"
    ],
    effect: function(level) {
      // Improve storage capacity
      const storageBonus = 0.5 * level; // 50% per level
      resources.silver.max = Math.floor(100 * (1 + storageBonus));
      resources.food.max = Math.floor(120 * (1 + storageBonus));
      resources.water.max = Math.floor(240 * (1 + storageBonus));
      resources.medicine.max = Math.floor(20 * (1 + storageBonus));
      
      // Update displays
      updateResourceDisplay();
      updateUpgradeDisplay();
    }
  }
};

// Calculate cost for next level of upgrade
function calculateUpgradeCost(upgrade) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
}

// Purchase upgrade
function purchaseUpgrade(upgradeId) {
  const upgrade = upgrades[upgradeId];
  
  // Check if upgrade is at max level
  if (upgrade.level >= upgrade.maxLevel) {
    addLogMessage(`${upgrade.name} is already at maximum level.`);
    return false;
  }
  
  // Calculate cost
  const cost = calculateUpgradeCost(upgrade);
  
  // Check if player has enough silver
  if (resources.silver.amount >= cost) {
    // Deduct cost
    resources.silver.amount -= cost;
    
    // Increase level
    upgrade.level++;
    
    // Apply effects
    upgrade.effect(upgrade.level);
    
    // Log message
    addLogMessage(`Upgraded ${upgrade.name} to level ${upgrade.level}.`);
    
    // Update displays
    updateResourceDisplay();
    updateUpgradeDisplay();
    
    return true;
  } else {
    addLogMessage(`Not enough silver to upgrade ${upgrade.name}.`);
    return false;
  }
}

// Update mining efficiency based on various factors
function updateMiningEfficiency() {
  let efficiency = 100; // Base efficiency
  
  // Tool tier bonus
  efficiency *= (1 + (resources.tools.tier - 1) * 0.5);
  
  // Mining skill bonus
  efficiency *= (1 + (resources.knowledge.mining - 1) * 0.02);
  
  // Health penalty if below 50%
  if (resources.health.amount < resources.health.max * 0.5) {
    efficiency *= 0.75;
  }
  
  // Food/water penalty if below 20%
  if (resources.food.amount < resources.food.max * 0.2 ||
      resources.water.amount < resources.water.max * 0.2) {
    efficiency *= 0.5;
  }
  
  // Tool durability scaling
  const durabilityFactor = resources.tools.durability / resources.tools.max;
  if (durabilityFactor < 0.5) {
    efficiency *= (0.5 + durabilityFactor);
  }
  
  // Set player mining efficiency
  player.miningEfficiency = Math.floor(efficiency);
  
  // Update display
  updateMiningStatus();
}

// Update upgrade display
function updateUpgradeDisplay() {
  // Update tool upgrade
  const toolUpgrade = document.getElementById("tool-upgrade");
  const toolCost = document.getElementById("tool-upgrade-cost");
  const toolButton = document.getElementById("buy-tool-upgrade");
  
  if (upgrades.tools.level >= upgrades.tools.maxLevel) {
    toolCost.textContent = "MAX";
    toolButton.disabled = true;
  } else {
    const cost = calculateUpgradeCost(upgrades.tools);
    toolCost.textContent = cost;
    toolButton.disabled = resources.silver.amount < cost;
  }
  
  // Update quarters upgrade
  const quartersUpgrade = document.getElementById("quarters-upgrade");
  const quartersCost = document.getElementById("quarters-upgrade-cost");
  const quartersButton = document.getElementById("buy-quarters-upgrade");
  
  if (upgrades.livingQuarters.level >= upgrades.livingQuarters.maxLevel) {
    quartersCost.textContent = "MAX";
    quartersButton.disabled = true;
  } else {
    const cost = calculateUpgradeCost(upgrades.livingQuarters);
    quartersCost.textContent = cost;
    quartersButton.disabled = resources.silver.amount < cost;
  }
  
  // Update storage upgrade
  const storageUpgrade = document.getElementById("storage-upgrade");
  const storageCost = document.getElementById("storage-upgrade-cost");
  const storageButton = document.getElementById("buy-storage-upgrade");
  
  if (upgrades.storage.level >= upgrades.storage.maxLevel) {
    storageCost.textContent = "MAX";
    storageButton.disabled = true;
  } else {
    const cost = calculateUpgradeCost(upgrades.storage);
    storageCost.textContent = cost;
    storageButton.disabled = resources.silver.amount < cost;
  }
}

// Unlock character for narrative interactions
function unlockCharacter(characterId) {
  // This will be implemented in narrative.js
  if (window.unlockNarrativeCharacter) {
    window.unlockNarrativeCharacter(characterId);
  }
}

// Export functions and objects
window.upgrades = upgrades;
window.purchaseUpgrade = purchaseUpgrade;
window.updateUpgradeDisplay = updateUpgradeDisplay;
window.updateMiningEfficiency = updateMiningEfficiency;
