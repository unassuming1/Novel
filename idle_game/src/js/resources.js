// resources.js - Handles all resource management for the idle game

// Resource data structure
const resources = {
  silver: {
    amount: 0,
    max: 100,
    rate: 0.1, // per second
    display: "Silver Ore"
  },
  food: {
    amount: 120,
    max: 120,
    rate: -0.0167, // per second (-1 per minute)
    quality: 1,
    display: "Food"
  },
  water: {
    amount: 240,
    max: 240,
    rate: -0.0333, // per second (-2 per minute)
    quality: 1,
    display: "Water"
  },
  health: {
    amount: 100,
    max: 100,
    rate: 0.0167, // per second when resting
    display: "Health"
  },
  tools: {
    durability: 100,
    max: 100,
    rate: -0.0167, // per second while mining
    tier: 1,
    display: "Tool Durability"
  },
  medicine: {
    amount: 5,
    max: 20,
    effectiveness: 10,
    display: "Medicine"
  },
  favor: {
    guard: 50,
    slave: 50,
    admin: 25,
    display: "Favor"
  },
  knowledge: {
    mining: 1,
    roman: 1,
    tribal: 1,
    medical: 1,
    display: "Knowledge"
  }
};

// Player state
const player = {
  status: "idle", // idle, mining, resting, infirmary
  statusDuration: 0,
  stamina: 20,
  maxStamina: 20,
  staminaRegenRate: 1/30, // 1 per 30 seconds
  miningEfficiency: 100, // percentage
  clickPower: 1,
  shift: "day", // day or night
  skillExperience: {
    mining: 0,
    roman: 0,
    tribal: 0,
    medical: 0
  }
};

// Game state
const gameState = {
  day: 1,
  time: 0, // seconds since game start
  timeScale: 1, // 1 second real time = 1 minute game time
  paused: false,
  lastUpdate: Date.now(),
  offlineProgressLimit: 7200, // 2 hours in seconds
  currentChapter: 1
};

// Resource update function (called every frame)
function updateResources(deltaTime) {
  // Skip updates if game is paused
  if (gameState.paused) return;
  
  // Update silver based on mining status
  if (player.status === "mining" && resources.tools.durability > 0) {
    const miningRate = calculateMiningRate();
    resources.silver.amount = Math.min(
      resources.silver.amount + miningRate * deltaTime,
      resources.silver.max
    );
    
    // Reduce tool durability while mining
    resources.tools.durability = Math.max(
      resources.tools.durability + resources.tools.rate * deltaTime,
      0
    );
  }
  
  // Update food and water (always consumed)
  resources.food.amount = Math.max(
    resources.food.amount + resources.food.rate * deltaTime,
    0
  );
  
  resources.water.amount = Math.max(
    resources.water.amount + resources.water.rate * deltaTime,
    0
  );
  
  // Update health based on conditions
  const healthRate = calculateHealthRate();
  resources.health.amount = Math.min(
    Math.max(resources.health.amount + healthRate * deltaTime, 0),
    resources.health.max
  );
  
  // Update stamina if not at max
  if (player.stamina < player.maxStamina) {
    player.stamina = Math.min(
      player.stamina + player.staminaRegenRate * deltaTime,
      player.maxStamina
    );
  }
  
  // Check for critical resource states
  checkResourceCrisis();
  
  // Update UI
  updateResourceDisplay();
}

// Calculate mining rate based on all factors
function calculateMiningRate() {
  let rate = resources.silver.rate;
  
  // Apply tool tier bonus
  rate *= (1 + (resources.tools.tier - 1) * 0.5);
  
  // Apply mining skill bonus
  rate *= (1 + (resources.knowledge.mining - 1) * 0.02);
  
  // Apply health penalty if below 50%
  if (resources.health.amount < resources.health.max * 0.5) {
    rate *= 0.75;
  }
  
  // Apply food/water penalty if below 20%
  if (resources.food.amount < resources.food.max * 0.2 ||
      resources.water.amount < resources.water.max * 0.2) {
    rate *= 0.5;
  }
  
  // Apply tool durability scaling
  const durabilityFactor = resources.tools.durability / resources.tools.max;
  if (durabilityFactor < 0.5) {
    rate *= (0.5 + durabilityFactor);
  }
  
  // Apply shift bonus/penalty
  if (player.shift === "night") {
    rate *= 1.25; // 25% bonus at night
  }
  
  // Apply efficiency modifier
  rate *= (player.miningEfficiency / 100);
  
  return rate;
}

// Calculate health regeneration/depletion rate
function calculateHealthRate() {
  let rate = 0;
  
  // Base regeneration when resting
  if (player.status === "resting") {
    rate = resources.health.rate;
    
    // Apply living quarters bonus if upgraded
    if (upgrades.livingQuarters.level > 0) {
      rate *= (1 + upgrades.livingQuarters.level * 0.25);
    }
  }
  
  // Health depletion from lack of food/water
  if (resources.food.amount === 0) {
    rate -= 0.05; // -3 health per minute when starving
  }
  
  if (resources.water.amount === 0) {
    rate -= 0.1; // -6 health per minute when dehydrated
  }
  
  // Health depletion from overwork (low stamina while mining)
  if (player.status === "mining" && player.stamina < player.maxStamina * 0.2) {
    rate -= 0.033; // -2 health per minute when overworked
  }
  
  return rate;
}

// Check for resource crises
function checkResourceCrisis() {
  // Health crisis
  if (resources.health.amount === 0 && player.status !== "infirmary") {
    triggerHealthCrisis();
  }
  
  // Tool breakage
  if (resources.tools.durability === 0 && player.status === "mining") {
    player.status = "idle";
    addLogMessage("Your tools have broken. You need to repair them to continue mining.");
  }
}

// Handle health crisis
function triggerHealthCrisis() {
  player.status = "infirmary";
  player.statusDuration = 3600; // 1 hour
  addLogMessage("You've collapsed from exhaustion and been taken to the infirmary.");
  triggerEvent("health_crisis");
}

// Resource actions
function eatFood() {
  if (resources.food.amount >= 1) {
    resources.food.amount -= 1;
    resources.health.amount = Math.min(
      resources.health.amount + 5,
      resources.health.max
    );
    addLogMessage("You ate some food (+5 Health).");
    updateResourceDisplay();
    return true;
  }
  return false;
}

function drinkWater() {
  if (resources.water.amount >= 2) {
    resources.water.amount -= 2;
    resources.health.amount = Math.min(
      resources.health.amount + 3,
      resources.health.max
    );
    addLogMessage("You drank some water (+3 Health).");
    updateResourceDisplay();
    return true;
  }
  return false;
}

function useMedicine() {
  if (resources.medicine.amount >= 1) {
    resources.medicine.amount -= 1;
    resources.health.amount = Math.min(
      resources.health.amount + resources.medicine.effectiveness,
      resources.health.max
    );
    addLogMessage(`You used medicine (+${resources.medicine.effectiveness} Health).`);
    updateResourceDisplay();
    return true;
  }
  return false;
}

function repairTools() {
  const repairAmount = 10;
  const repairCost = 10;
  
  if (resources.silver.amount >= repairCost && resources.tools.durability < resources.tools.max) {
    resources.silver.amount -= repairCost;
    resources.tools.durability = Math.min(
      resources.tools.durability + repairAmount,
      resources.tools.max
    );
    addLogMessage(`You repaired your tools (+${repairAmount} Durability).`);
    updateResourceDisplay();
    return true;
  }
  return false;
}

function startMining() {
  if (player.status !== "infirmary") {
    player.status = "mining";
    addLogMessage("You begin mining for silver.");
    updatePlayerStatus();
  }
}

function stopMining() {
  if (player.status === "mining") {
    player.status = "idle";
    addLogMessage("You stop mining.");
    updatePlayerStatus();
  }
}

function startResting() {
  if (player.status !== "infirmary") {
    player.status = "resting";
    addLogMessage("You begin resting to recover health.");
    updatePlayerStatus();
  }
}

// Mining click action
function mineClick() {
  if (player.status === "mining" && resources.tools.durability > 0 && player.stamina >= 1) {
    // Reduce stamina
    player.stamina = Math.max(player.stamina - 1, 0);
    
    // Apply stamina efficiency penalty if low
    let clickEfficiency = 1;
    if (player.stamina < player.maxStamina * 0.2) {
      clickEfficiency = 0.5;
    }
    
    // Add silver based on click power
    const silverGain = player.clickPower * clickEfficiency;
    resources.silver.amount = Math.min(
      resources.silver.amount + silverGain,
      resources.silver.max
    );
    
    // Update mining skill experience
    player.skillExperience.mining += 0.1;
    checkSkillLevelUp();
    
    // Update UI
    updateResourceDisplay();
    updateMiningStatus();
    
    return silverGain;
  }
  return 0;
}

// Check for skill level ups
function checkSkillLevelUp() {
  // Mining skill
  const currentMiningLevel = resources.knowledge.mining;
  const requiredExp = currentMiningLevel * 10;
  
  if (player.skillExperience.mining >= requiredExp) {
    player.skillExperience.mining -= requiredExp;
    resources.knowledge.mining++;
    addLogMessage(`Your mining skill increased to level ${resources.knowledge.mining}!`);
    updateSkillDisplay();
  }
  
  // Check other skills similarly
}

// Update UI displays
function updateResourceDisplay() {
  // Update silver display
  document.getElementById("silver-amount").textContent = Math.floor(resources.silver.amount);
  document.getElementById("silver-max").textContent = resources.silver.max;
  document.getElementById("silver-rate").textContent = calculateMiningRate().toFixed(2);
  
  // Update food display
  document.getElementById("food-amount").textContent = Math.floor(resources.food.amount);
  document.getElementById("food-max").textContent = resources.food.max;
  document.getElementById("food-rate").textContent = Math.abs(resources.food.rate).toFixed(4);
  
  // Update water display
  document.getElementById("water-amount").textContent = Math.floor(resources.water.amount);
  document.getElementById("water-max").textContent = resources.water.max;
  document.getElementById("water-rate").textContent = Math.abs(resources.water.rate).toFixed(4);
  
  // Update health display
  document.getElementById("health-amount").textContent = Math.floor(resources.health.amount);
  document.getElementById("health-max").textContent = resources.health.max;
  document.getElementById("health-rate").textContent = Math.abs(calculateHealthRate()).toFixed(4);
  
  // Update tools display
  document.getElementById("tools-amount").textContent = Math.floor(resources.tools.durability);
  document.getElementById("tools-max").textContent = resources.tools.max;
  document.getElementById("tools-rate").textContent = Math.abs(resources.tools.rate).toFixed(4);
  
  // Update medicine display
  document.getElementById("medicine-amount").textContent = resources.medicine.amount;
  document.getElementById("medicine-max").textContent = resources.medicine.max;
  
  // Update button states based on resource availability
  document.getElementById("eat-button").disabled = resources.food.amount < 1;
  document.getElementById("drink-button").disabled = resources.water.amount < 2;
  document.getElementById("repair-button").disabled = resources.silver.amount < 10 || resources.tools.durability >= resources.tools.max;
}

function updateMiningStatus() {
  document.getElementById("efficiency-value").textContent = player.miningEfficiency;
  document.getElementById("stamina-value").textContent = Math.floor(player.stamina);
}

function updatePlayerStatus() {
  document.getElementById("status-value").textContent = player.status.charAt(0).toUpperCase() + player.status.slice(1);
  document.getElementById("shift-value").textContent = player.shift.charAt(0).toUpperCase() + player.shift.slice(1);
  
  // Update mining button state
  document.getElementById("mine-button").disabled = player.status !== "mining" || resources.tools.durability <= 0;
}

function updateSkillDisplay() {
  // Update mining skill
  document.getElementById("mining-level").textContent = resources.knowledge.mining;
  const miningProgress = (player.skillExperience.mining / (resources.knowledge.mining * 10)) * 100;
  document.getElementById("mining-progress").style.width = `${miningProgress}%`;
  
  // Update other skills similarly
  document.getElementById("roman-level").textContent = resources.knowledge.roman;
  document.getElementById("tribal-level").textContent = resources.knowledge.tribal;
  document.getElementById("medical-level").textContent = resources.knowledge.medical;
  
  // Update relationship displays
  document.getElementById("guard-favor").textContent = resources.favor.guard;
  document.getElementById("guard-progress").style.width = `${resources.favor.guard}%`;
  
  document.getElementById("slave-favor").textContent = resources.favor.slave;
  document.getElementById("slave-progress").style.width = `${resources.favor.slave}%`;
  
  document.getElementById("admin-favor").textContent = resources.favor.admin;
  document.getElementById("admin-progress").style.width = `${resources.favor.admin}%`;
}

// Add message to the event log
function addLogMessage(message) {
  const logEntries = document.getElementById("log-entries");
  const entry = document.createElement("li");
  entry.className = "log-entry";
  entry.textContent = message;
  
  // Add to the top of the list
  logEntries.insertBefore(entry, logEntries.firstChild);
  
  // Limit log entries to 20
  while (logEntries.children.length > 20) {
    logEntries.removeChild(logEntries.lastChild);
  }
}

// Save and load functions
function saveGame() {
  const saveData = {
    resources: resources,
    player: player,
    gameState: gameState,
    upgrades: upgrades,
    narrativeState: playerNarrativeState
  };
  
  localStorage.setItem("silverMinesSave", JSON.stringify(saveData));
  addLogMessage("Game saved.");
}

function loadGame() {
  const saveData = localStorage.getItem("silverMinesSave");
  
  if (saveData) {
    const data = JSON.parse(saveData);
    
    // Load resources
    Object.assign(resources, data.resources);
    
    // Load player state
    Object.assign(player, data.player);
    
    // Load game state
    Object.assign(gameState, data.gameState);
    
    // Load upgrades
    Object.assign(upgrades, data.upgrades);
    
    // Load narrative state
    Object.assign(playerNarrativeState, data.narrativeState);
    
    // Calculate offline progress
    const now = Date.now();
    const timeDiff = Math.min((now - gameState.lastUpdate) / 1000, gameState.offlineProgressLimit);
    
    if (timeDiff > 60) { // Only process if more than a minute has passed
      processOfflineProgress(timeDiff);
    }
    
    gameState.lastUpdate = now;
    
    // Update all displays
    updateResourceDisplay();
    updateMiningStatus();
    updatePlayerStatus();
    updateSkillDisplay();
    updateUpgradeDisplay();
    
    addLogMessage("Game loaded.");
    return true;
  }
  
  return false;
}

// Process offline progress
function processOfflineProgress(seconds) {
  // Calculate resources gained/lost while offline
  const silverGained = player.status === "mining" ? calculateMiningRate() * seconds : 0;
  const foodLost = Math.abs(resources.food.rate) * seconds;
  const waterLost = Math.abs(resources.water.rate) * seconds;
  
  // Apply changes with limits
  resources.silver.amount = Math.min(resources.silver.amount + silverGained, resources.silver.max);
  resources.food.amount = Math.max(resources.food.amount - foodLost, 0);
  resources.water.amount = Math.max(resources.water.amount - waterLost, 0);
  
  // Handle tool durability
  if (player.status === "mining") {
    resources.tools.durability = Math.max(resources.tools.durability - Math.abs(resources.tools.rate) * seconds, 0);
  }
  
  // Handle health changes
  const healthChange = calculateHealthRate() * seconds;
  resources.health.amount = Math.min(Math.max(resources.health.amount + healthChange, 0), resources.health.max);
  
  // Check if player should be in infirmary
  if (resources.health.amount === 0 && player.status !== "infirmary") {
    player.status = "infirmary";
    player.statusDuration = 3600; // 1 hour
  }
  
  // Create summary message
  const minutes = Math.floor(seconds / 60);
  let summary = `While you were away (${minutes} minutes): `;
  
  if (silverGained > 0) {
    summary += `+${Math.floor(silverGained)} silver, `;
  }
  
  summary += `-${Math.floor(foodLost)} food, -${Math.floor(waterLost)} water.`;
  
  addLogMessage(summary);
}

// Export functions and objects
window.resources = resources;
window.player = player;
window.gameState = gameState;
window.startMining = startMining;
window.stopMining = stopMining;
window.startResting = startResting;
window.mineClick = mineClick;
window.eatFood = eatFood;
window.drinkWater = drinkWater;
window.useMedicine = useMedicine;
window.repairTools = repairTools;
window.updateResources = updateResources;
window.saveGame = saveGame;
window.loadGame = loadGame;
