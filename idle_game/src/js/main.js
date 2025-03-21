// main.js - Main entry point for the idle game

// Game state initialization
if (!gameState) {
  gameState = {
    day: 1,
    time: 0,
    timeScale: 1,
    paused: false,
    lastUpdate: Date.now(),
    offlineProgressLimit: 7200,
    timeSinceLastSave: 0,
    currentChapter: 1
  };
}

// Resource collection system
const resourceCollection = {
  // Mining click system
  clickValue: 1,
  clickMultiplier: 1,
  criticalChance: 0.05,
  criticalMultiplier: 2,
  
  // Automatic collection
  autoCollectors: {
    assistants: {
      count: 0,
      baseRate: 0.05,
      cost: 500,
      costMultiplier: 1.2
    },
    tools: {
      count: 0,
      baseRate: 0.1,
      cost: 1000,
      costMultiplier: 1.5
    },
    techniques: {
      count: 0,
      baseRate: 0.2,
      cost: 2000,
      costMultiplier: 2
    }
  },
  
  // Special resource discoveries
  discoveries: {
    silverVein: {
      chance: 0.01,
      minAmount: 10,
      maxAmount: 50
    },
    foodCache: {
      chance: 0.005,
      minAmount: 20,
      maxAmount: 40
    },
    waterSource: {
      chance: 0.005,
      minAmount: 40,
      maxAmount: 80
    },
    medicinalHerbs: {
      chance: 0.002,
      minAmount: 1,
      maxAmount: 3
    },
    romanArtifact: {
      chance: 0.001,
      knowledgeGain: {
        roman: 1
      }
    },
    tribalArtifact: {
      chance: 0.001,
      knowledgeGain: {
        tribal: 1
      }
    }
  }
};

// Initialize resource collection system
function initializeResourceCollection() {
  // Set up auto-collection interval
  setInterval(updateAutoCollection, 1000);
  
  // Update UI
  updateCollectionDisplay();
}

// Handle mining click with resource collection system
function handleMiningClick() {
  if (player.status !== "mining" || resources.tools.durability <= 0 || player.stamina < 1) {
    return 0;
  }
  
  // Reduce stamina
  player.stamina = Math.max(player.stamina - 1, 0);
  
  // Apply stamina efficiency penalty if low
  let clickEfficiency = 1;
  if (player.stamina < player.maxStamina * 0.2) {
    clickEfficiency = 0.5;
  }
  
  // Calculate base click value
  let clickValue = resourceCollection.clickValue * resourceCollection.clickMultiplier * clickEfficiency;
  
  // Apply mining skill bonus
  clickValue *= (1 + (resources.knowledge.mining - 1) * 0.05);
  
  // Apply tool tier bonus
  clickValue *= (1 + (resources.tools.tier - 1) * 0.25);
  
  // Check for critical click
  let isCritical = Math.random() < resourceCollection.criticalChance;
  if (isCritical) {
    clickValue *= resourceCollection.criticalMultiplier;
    addLogMessage(`Critical mining strike! ${clickValue.toFixed(1)} silver found.`);
  }
  
  // Add silver
  const silverGain = clickValue;
  resources.silver.amount = Math.min(resources.silver.amount + silverGain, resources.silver.max);
  
  // Update mining skill experience
  player.skillExperience.mining += 0.1;
  checkSkillLevelUp();
  
  // Check for discoveries
  checkForDiscoveries();
  
  // Update UI
  updateResourceDisplay();
  updateMiningStatus();
  
  // Return silver gained
  return silverGain;
}

// Update auto-collection
function updateAutoCollection() {
  if (gameState.paused || player.status !== "mining" || resources.tools.durability <= 0) {
    return;
  }
  
  // Calculate auto-collection rate
  let autoRate = 0;
  
  // Add rates from auto-collectors
  for (const [type, collector] of Object.entries(resourceCollection.autoCollectors)) {
    autoRate += collector.count * collector.baseRate;
  }
  
  // Apply mining skill bonus
  autoRate *= (1 + (resources.knowledge.mining - 1) * 0.05);
  
  // Apply tool tier bonus
  autoRate *= (1 + (resources.tools.tier - 1) * 0.25);
  
  // Apply health penalty if below 50%
  if (resources.health.amount < resources.health.max * 0.5) {
    autoRate *= 0.75;
  }
  
  // Add silver
  if (autoRate > 0) {
    const silverGain = autoRate;
    resources.silver.amount = Math.min(resources.silver.amount + silverGain, resources.silver.max);
    
    // Update UI
    updateResourceDisplay();
  }
}

// Check for special resource discoveries
function checkForDiscoveries() {
  // Silver vein discovery
  if (Math.random() < resourceCollection.discoveries.silverVein.chance) {
    const amount = Math.floor(
      resourceCollection.discoveries.silverVein.minAmount + 
      Math.random() * (resourceCollection.discoveries.silverVein.maxAmount - resourceCollection.discoveries.silverVein.minAmount)
    );
    
    resources.silver.amount = Math.min(resources.silver.amount + amount, resources.silver.max);
    addLogMessage(`You discovered a rich silver vein! +${amount} silver.`);
    
    // Trigger discovery event
    handleGameEvent("discovery", {
      type: "silver",
      message: `You discovered a rich silver vein! +${amount} silver.`,
      reward: {
        silver: amount
      }
    });
  }
  
  // Food cache discovery
  if (Math.random() < resourceCollection.discoveries.foodCache.chance) {
    const amount = Math.floor(
      resourceCollection.discoveries.foodCache.minAmount + 
      Math.random() * (resourceCollection.discoveries.foodCache.maxAmount - resourceCollection.discoveries.foodCache.minAmount)
    );
    
    resources.food.amount = Math.min(resources.food.amount + amount, resources.food.max);
    addLogMessage(`You found a hidden food cache! +${amount} food.`);
    
    // Trigger discovery event
    handleGameEvent("discovery", {
      type: "food",
      message: `You found a hidden food cache! +${amount} food.`,
      reward: {
        food: amount
      }
    });
  }
  
  // Water source discovery
  if (Math.random() < resourceCollection.discoveries.waterSource.chance) {
    const amount = Math.floor(
      resourceCollection.discoveries.waterSource.minAmount + 
      Math.random() * (resourceCollection.discoveries.waterSource.maxAmount - resourceCollection.discoveries.waterSource.minAmount)
    );
    
    resources.water.amount = Math.min(resources.water.amount + amount, resources.water.max);
    addLogMessage(`You discovered a fresh water source! +${amount} water.`);
    
    // Trigger discovery event
    handleGameEvent("discovery", {
      type: "water",
      message: `You discovered a fresh water source! +${amount} water.`,
      reward: {
        water: amount
      }
    });
  }
  
  // Medicinal herbs discovery
  if (Math.random() < resourceCollection.discoveries.medicinalHerbs.chance) {
    const amount = Math.floor(
      resourceCollection.discoveries.medicinalHerbs.minAmount + 
      Math.random() * (resourceCollection.discoveries.medicinalHerbs.maxAmount - resourceCollection.discoveries.medicinalHerbs.minAmount)
    );
    
    resources.medicine.amount = Math.min(resources.medicine.amount + amount, resources.medicine.max);
    addLogMessage(`You found medicinal herbs! +${amount} medicine.`);
    
    // Trigger discovery event
    handleGameEvent("discovery", {
      type: "medicine",
      message: `You found medicinal herbs! +${amount} medicine.`,
      reward: {
        medicine: amount
      }
    });
  }
  
  // Roman artifact discovery
  if (Math.random() < resourceCollection.discoveries.romanArtifact.chance) {
    resources.knowledge.roman += resourceCollection.discoveries.romanArtifact.knowledgeGain.roman;
    addLogMessage(`You discovered a Roman artifact! +${resourceCollection.discoveries.romanArtifact.knowledgeGain.roman} Roman knowledge.`);
    
    // Trigger discovery event
    handleGameEvent("discovery", {
      type: "roman_artifact",
      message: `You discovered a Roman artifact! +${resourceCollection.discoveries.romanArtifact.knowledgeGain.roman} Roman knowledge.`,
      reward: {
        knowledge: {
          roman: resourceCollection.discoveries.romanArtifact.knowledgeGain.roman
        }
      }
    });
    
    updateSkillDisplay();
  }
  
  // Tribal artifact discovery
  if (Math.random() < resourceCollection.discoveries.tribalArtifact.chance) {
    resources.knowledge.tribal += resourceCollection.discoveries.tribalArtifact.knowledgeGain.tribal;
    addLogMessage(`You discovered a tribal artifact! +${resourceCollection.discoveries.tribalArtifact.knowledgeGain.tribal} Tribal knowledge.`);
    
    // Trigger discovery event
    handleGameEvent("discovery", {
      type: "tribal_artifact",
      message: `You discovered a tribal artifact! +${resourceCollection.discoveries.tribalArtifact.knowledgeGain.tribal} Tribal knowledge.`,
      reward: {
        knowledge: {
          tribal: resourceCollection.discoveries.tribalArtifact.knowledgeGain.tribal
        }
      }
    });
    
    updateSkillDisplay();
  }
}

// Purchase auto-collector
function purchaseAutoCollector(type) {
  const collector = resourceCollection.autoCollectors[type];
  if (!collector) return false;
  
  // Calculate cost
  const cost = Math.floor(collector.cost * Math.pow(collector.costMultiplier, collector.count));
  
  // Check if player has enough silver
  if (resources.silver.amount >= cost) {
    // Deduct cost
    resources.silver.amount -= cost;
    
    // Increase count
    collector.count++;
    
    // Log message
    addLogMessage(`Purchased ${type} auto-collector. You now have ${collector.count}.`);
    
    // Update displays
    updateResourceDisplay();
    updateCollectionDisplay();
    
    return true;
  } else {
    addLogMessage(`Not enough silver to purchase ${type} auto-collector.`);
    return false;
  }
}

// Update collection display
function updateCollectionDisplay() {
  // This will be implemented when the UI is expanded
  // to include auto-collectors and collection upgrades
}

// Override the original mineClick function to use the new resource collection system
window.mineClick = handleMiningClick;

// Initialize resource collection system when page loads
window.addEventListener("load", initializeResourceCollection);

// Export functions and objects
window.resourceCollection = resourceCollection;
window.purchaseAutoCollector = purchaseAutoCollector;
