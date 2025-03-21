// events.js - Handles game events and main loop for the idle game

// Game initialization
function initializeGame() {
  // Load saved game if available
  if (!loadGame()) {
    // First time setup
    initializeResources();
    initializeNarrative();
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Start game loop
  startGameLoop();
  
  // Add welcome message
  addLogMessage("Welcome to The Silver Mines of Noricum. Survive, gather resources, and uncover the story of the Danube frontier.");
}

// Initialize default resources
function initializeResources() {
  // Default values are already set in resources.js
  updateResourceDisplay();
  updateMiningStatus();
  updatePlayerStatus();
  updateSkillDisplay();
  updateUpgradeDisplay();
}

// Set up event listeners
function setupEventListeners() {
  // Mining button
  document.getElementById("mine-button").addEventListener("click", function() {
    if (player.status === "mining") {
      mineClick();
    } else {
      startMining();
    }
  });
  
  // Mine clickable area
  document.getElementById("mine-clickable").addEventListener("click", function() {
    if (player.status === "mining") {
      mineClick();
    }
  });
  
  // Action buttons
  document.getElementById("eat-button").addEventListener("click", eatFood);
  document.getElementById("drink-button").addEventListener("click", drinkWater);
  document.getElementById("rest-button").addEventListener("click", startResting);
  document.getElementById("repair-button").addEventListener("click", repairTools);
  
  // Upgrade buttons
  document.getElementById("buy-tool-upgrade").addEventListener("click", function() {
    purchaseUpgrade("tools");
  });
  
  document.getElementById("buy-quarters-upgrade").addEventListener("click", function() {
    purchaseUpgrade("livingQuarters");
  });
  
  document.getElementById("buy-storage-upgrade").addEventListener("click", function() {
    purchaseUpgrade("storage");
  });
  
  // Add keyboard shortcuts
  document.addEventListener("keydown", function(event) {
    // Space bar for mining
    if (event.code === "Space") {
      if (player.status === "mining") {
        mineClick();
      } else {
        startMining();
      }
      event.preventDefault();
    }
    
    // E for eat
    if (event.code === "KeyE") {
      eatFood();
      event.preventDefault();
    }
    
    // D for drink
    if (event.code === "KeyD") {
      drinkWater();
      event.preventDefault();
    }
    
    // R for rest
    if (event.code === "KeyR") {
      startResting();
      event.preventDefault();
    }
    
    // T for repair tools
    if (event.code === "KeyT") {
      repairTools();
      event.preventDefault();
    }
  });
}

// Game loop variables
let lastTimestamp = 0;
let accumulatedTime = 0;
const DAY_LENGTH = 300; // 5 minutes real time = 1 day in game

// Start game loop
function startGameLoop() {
  lastTimestamp = Date.now();
  requestAnimationFrame(gameLoop);
}

// Main game loop
function gameLoop(timestamp) {
  // Calculate delta time in seconds
  const now = Date.now();
  const deltaTime = (now - lastTimestamp) / 1000;
  lastTimestamp = now;
  
  // Skip if game is paused
  if (!gameState.paused) {
    // Update resources
    updateResources(deltaTime);
    
    // Accumulate time for day advancement
    accumulatedTime += deltaTime;
    if (accumulatedTime >= DAY_LENGTH) {
      advanceDay();
      accumulatedTime -= DAY_LENGTH;
    }
    
    // Update status durations
    updateStatusDurations(deltaTime);
    
    // Auto-save every minute
    gameState.timeSinceLastSave += deltaTime;
    if (gameState.timeSinceLastSave >= 60) {
      saveGame();
      gameState.timeSinceLastSave = 0;
    }
  }
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Update status durations
function updateStatusDurations(deltaTime) {
  // Handle infirmary status
  if (player.status === "infirmary") {
    player.statusDuration -= deltaTime;
    
    if (player.statusDuration <= 0) {
      player.status = "idle";
      player.statusDuration = 0;
      resources.health.amount = Math.max(resources.health.amount, 20); // Ensure minimum health
      addLogMessage("You've been released from the infirmary.");
      updatePlayerStatus();
    }
  }
}

// Handle shift changes
function changeShift() {
  player.shift = player.shift === "day" ? "night" : "day";
  
  // Apply shift-specific effects
  if (player.shift === "night") {
    // Night shift has higher silver yield but more health drain
    resources.silver.rate = 0.15; // 50% bonus
    resources.health.rate = 0.01; // 40% less regeneration
    addLogMessage("Night shift begins. Silver yield increases, but health regeneration decreases.");
  } else {
    // Day shift has normal values
    resources.silver.rate = 0.1;
    resources.health.rate = 0.0167;
    addLogMessage("Day shift begins. Normal working conditions resume.");
  }
  
  updatePlayerStatus();
  updateResourceDisplay();
}

// Handle game events
function handleGameEvent(eventType, data) {
  switch (eventType) {
    case "resource_crisis":
      // Handle resource crisis events
      if (data.type === "food") {
        addLogMessage("CRISIS: You've run out of food! Health will deteriorate rapidly.");
      } else if (data.type === "water") {
        addLogMessage("CRISIS: You've run out of water! Health will deteriorate very rapidly.");
      } else if (data.type === "health") {
        triggerHealthCrisis();
      } else if (data.type === "tools") {
        addLogMessage("Your tools have broken completely. You must repair them to continue mining.");
        player.status = "idle";
        updatePlayerStatus();
      }
      break;
      
    case "discovery":
      // Handle discovery events
      addLogMessage(`DISCOVERY: ${data.message}`);
      if (data.reward) {
        applyDiscoveryReward(data.reward);
      }
      break;
      
    case "shift_change":
      // Handle shift change
      changeShift();
      break;
      
    case "game_ending":
      // Handle game ending
      showGameEnding();
      break;
  }
}

// Apply discovery reward
function applyDiscoveryReward(reward) {
  if (reward.silver) {
    resources.silver.amount = Math.min(resources.silver.amount + reward.silver, resources.silver.max);
  }
  
  if (reward.food) {
    resources.food.amount = Math.min(resources.food.amount + reward.food, resources.food.max);
  }
  
  if (reward.water) {
    resources.water.amount = Math.min(resources.water.amount + reward.water, resources.water.max);
  }
  
  if (reward.medicine) {
    resources.medicine.amount = Math.min(resources.medicine.amount + reward.medicine, resources.medicine.max);
  }
  
  if (reward.knowledge) {
    for (const [type, amount] of Object.entries(reward.knowledge)) {
      resources.knowledge[type] += amount;
    }
  }
  
  updateResourceDisplay();
  updateSkillDisplay();
}

// Show game ending
function showGameEnding() {
  const ending = getGameEnding();
  
  // Create modal content
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalChoices = document.getElementById("modal-choices");
  
  modalTitle.textContent = `Ending: ${ending.details.title}`;
  modalDescription.textContent = ending.details.description;
  
  // Clear previous choices
  modalChoices.innerHTML = "";
  
  // Add restart button
  const restartButton = document.createElement("button");
  restartButton.textContent = "Start New Game";
  restartButton.addEventListener("click", function() {
    // Reset game
    resetGame();
    // Close modal
    document.getElementById("event-modal").style.display = "none";
  });
  
  modalChoices.appendChild(restartButton);
  
  // Show modal
  document.getElementById("event-modal").style.display = "block";
}

// Reset game
function resetGame() {
  // Clear local storage
  localStorage.removeItem("silverMinesSave");
  
  // Reset all game state
  // Resources
  resources.silver.amount = 0;
  resources.food.amount = 120;
  resources.water.amount = 240;
  resources.health.amount = 100;
  resources.tools.durability = 100;
  resources.medicine.amount = 5;
  resources.favor.guard = 50;
  resources.favor.slave = 50;
  resources.favor.admin = 25;
  resources.knowledge.mining = 1;
  resources.knowledge.roman = 1;
  resources.knowledge.tribal = 1;
  resources.knowledge.medical = 1;
  
  // Player
  player.status = "idle";
  player.statusDuration = 0;
  player.stamina = 20;
  player.miningEfficiency = 100;
  player.shift = "day";
  player.skillExperience = {
    mining: 0,
    roman: 0,
    tribal: 0,
    medical: 0
  };
  
  // Game state
  gameState.day = 1;
  gameState.time = 0;
  gameState.paused = false;
  gameState.lastUpdate = Date.now();
  
  // Upgrades
  for (const upgrade in upgrades) {
    if (upgrade === "tools") {
      upgrades[upgrade].level = 1;
    } else {
      upgrades[upgrade].level = 0;
    }
  }
  
  // Narrative
  playerNarrativeState.currentDay = 1;
  playerNarrativeState.currentChapter = 1;
  playerNarrativeState.completedEvents = [];
  playerNarrativeState.mainStoryKnowledge = {
    tribalMovements: 0,
    plagueImpact: 0,
    settlementArrangement: 0,
    withdrawalProcess: 0
  };
  playerNarrativeState.characterRelationships = {
    marcus: 0,
    livia: 0,
    cassius: 0,
    elva: 0
  };
  playerNarrativeState.narrativePaths = {
    romanIntegration: 0,
    tribalLoyalty: 0,
    independentSurvivor: 0,
    revolutionary: 0
  };
  playerNarrativeState.endingFlags = {
    manumissionEligible: false,
    escapeNetworkEstablished: false,
    merchantConnectionSecured: false,
    slaveRevoltPrepared: false
  };
  playerNarrativeState.unlockedCharacters = {
    marcus: false,
    livia: false,
    cassius: false,
    elva: false
  };
  
  // Reset UI
  document.getElementById("current-day").textContent = 1;
  document.getElementById("log-entries").innerHTML = "";
  
  // Initialize game
  initializeResources();
  initializeNarrative();
  
  // Add reset message
  addLogMessage("New game started. Welcome to the Silver Mines of Noricum.");
}

// Initialize game when page loads
window.addEventListener("load", initializeGame);

// Export functions
window.handleGameEvent = handleGameEvent;
