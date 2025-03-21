// narrative.js - Handles narrative events and story progression for the idle game

// Player narrative state tracking
const playerNarrativeState = {
  // Current chapter and day tracking
  currentDay: 1,
  currentChapter: 1,
  
  // Completed events
  completedEvents: [],
  
  // Knowledge of main story elements
  mainStoryKnowledge: {
    tribalMovements: 0, // 0-100 understanding
    plagueImpact: 0,
    settlementArrangement: 0,
    withdrawalProcess: 0
  },
  
  // Character relationships
  characterRelationships: {
    marcus: 0, // Guard Captain
    livia: 0,  // Administrator's Assistant
    cassius: 0, // Merchant
    elva: 0    // Tribal Elder
  },
  
  // Narrative path leanings (0-100)
  narrativePaths: {
    romanIntegration: 0,
    tribalLoyalty: 0,
    independentSurvivor: 0,
    revolutionary: 0
  },
  
  // Ending eligibility flags
  endingFlags: {
    manumissionEligible: false,
    escapeNetworkEstablished: false,
    merchantConnectionSecured: false,
    slaveRevoltPrepared: false
  },
  
  // Unlocked characters
  unlockedCharacters: {
    marcus: false,
    livia: false,
    cassius: false,
    elva: false
  }
};

// Narrative event data structure
const narrativeEvents = {
  // Chapter 1 events
  "intro": {
    id: "intro",
    title: "Welcome to the Silver Mines",
    trigger: {
      type: "time",
      day: 1
    },
    content: "You have been assigned to the silver mines of Noricum, a province just south of the Danube frontier. As a slave captured from a tribal village beyond the river, you must work to survive while gathering information about the events unfolding along the frontier.",
    choices: [
      {
        text: "Begin your work in the mines",
        outcome: {
          status: "mining",
          description: "You pick up your tools and begin the arduous work of mining silver ore."
        }
      }
    ],
    chapter: 1,
    mainStoryConnection: "Introduction to the setting"
  },
  
  "tribal_rumors": {
    id: "tribal_rumors",
    title: "Whispers from the North",
    trigger: {
      type: "time",
      day: 2
    },
    content: "Guards pass by your work area, discussing reports of unusual tribal movements beyond the Danube. \"Whole villages emptying,\" one says. \"Command thinks they're gathering somewhere north of the river.\"",
    choices: [
      {
        text: "Listen quietly",
        outcome: {
          knowledge: {tribal: 1},
          description: "You store this information away. It matches what you'd heard before your capture."
        }
      },
      {
        text: "Ask about your home village",
        requirements: {favor: {guard: 10}},
        outcome: {
          favor: {guard: -5},
          knowledge: {tribal: 2},
          description: "The guards are surprised by your question but mention your village was among those emptied. This confirms your family likely survived."
        }
      }
    ],
    chapter: 1,
    mainStoryConnection: "Tribal movements beyond the Danube"
  },
  
  "plague_aftermath": {
    id: "plague_aftermath",
    title: "Echoes of Plague",
    trigger: {
      type: "time",
      day: 3
    },
    content: "A new group of slaves arrives at the mine. They're thin and weak, survivors of a plague that swept through a nearby settlement. The guards keep them separate from the rest of you, but their coughing can be heard throughout the mine.",
    choices: [
      {
        text: "Keep your distance",
        outcome: {
          health: 0,
          description: "You maintain your distance from the new arrivals, focusing on your work instead."
        }
      },
      {
        text: "Offer medical knowledge",
        requirements: {knowledge: {medical: 2}},
        outcome: {
          favor: {slave: 10, guard: 5},
          knowledge: {medical: 1},
          description: "You share some tribal remedies that might help with their symptoms. Both the slaves and guards appreciate your assistance."
        }
      }
    ],
    chapter: 1,
    mainStoryConnection: "Aftermath of plague in the legion"
  },
  
  // Chapter 2-3 events
  "increased_quotas": {
    id: "increased_quotas",
    title: "Military Demands",
    trigger: {
      type: "time",
      day: 6
    },
    content: "The mine overseer announces increased silver quotas. \"The frontier legions require additional funds for reinforcements,\" he explains. \"All slaves will work extended shifts until further notice.\"",
    choices: [
      {
        text: "Accept the new quotas",
        outcome: {
          silver: {rate: 0.15},
          health: {rate: -0.02},
          description: "You resign yourself to the harder work. The silver collection rate increases, but at a cost to your health."
        }
      },
      {
        text: "Work strategically to preserve strength",
        requirements: {knowledge: {mining: 2}},
        outcome: {
          silver: {rate: 0.12},
          description: "Your mining knowledge allows you to meet most of the quota while preserving your strength."
        }
      }
    ],
    chapter: 2,
    mainStoryConnection: "Military reinforcement requests"
  },
  
  "diplomatic_mission": {
    id: "diplomatic_mission",
    title: "The Envoy's Visit",
    trigger: {
      type: "time",
      day: 9
    },
    content: "A Roman diplomatic envoy visits the mine administrator. Through snippets of conversation, you learn they've been meeting with tribal leaders beyond the Danube. The administrator seems concerned about the reports.",
    choices: [
      {
        text: "Focus on your work",
        outcome: {
          silver: 5,
          description: "You keep your head down and continue mining, earning a small bonus for your diligence."
        }
      },
      {
        text: "Listen carefully to the conversation",
        requirements: {knowledge: {roman: 1}},
        outcome: {
          knowledge: {roman: 1, tribal: 1},
          description: "You overhear details about a tribal confederation forming beyond the frontier. This matches rumors you've heard from your own people."
        }
      }
    ],
    chapter: 3,
    mainStoryConnection: "Roman diplomatic mission"
  },
  
  // Chapter 4-5 events
  "winter_preparation": {
    id: "winter_preparation",
    title: "The Coming Cold",
    trigger: {
      type: "time",
      day: 13
    },
    content: "The first snow falls outside the mine entrance. Guards bring in extra wood for the fires and thicker blankets for themselves. The slaves receive minimal additional provisions for the winter months ahead.",
    choices: [
      {
        text: "Request better winter provisions",
        requirements: {favor: {guard: 20}},
        outcome: {
          favor: {guard: -5},
          food: 20,
          water: 40,
          description: "Your good standing with the guards earns you some extra rations, though at a cost to your relationship."
        }
      },
      {
        text: "Share tribal winter survival techniques",
        requirements: {knowledge: {tribal: 2}},
        outcome: {
          favor: {slave: 15},
          knowledge: {tribal: 1},
          description: "You teach fellow slaves how to conserve body heat and make the most of limited resources. They're grateful for your knowledge."
        }
      }
    ],
    chapter: 4,
    mainStoryConnection: "Harsh winter approaching"
  },
  
  "refugee_crisis": {
    id: "refugee_crisis",
    title: "Displaced Peoples",
    trigger: {
      type: "time",
      day: 16
    },
    content: "A new group of slaves arrives - tribal people from beyond the Danube. They speak your language and tell of entire villages fleeing south due to pressure from other tribes and the harsh winter conditions.",
    choices: [
      {
        text: "Ask about your family's village",
        outcome: {
          knowledge: {tribal: 2},
          description: "They confirm your village was among those that moved south before winter. Your family may have survived."
        }
      },
      {
        text: "Ask about tribal politics",
        requirements: {knowledge: {tribal: 3}},
        outcome: {
          knowledge: {tribal: 2},
          narrativePaths: {tribalLoyalty: 10},
          description: "You learn about the complex alliances forming among the tribes, and how some are considering unprecedented cooperation with Rome."
        }
      }
    ],
    chapter: 5,
    mainStoryConnection: "Refugee crisis beyond the Danube"
  },
  
  // Chapter 6-7 events
  "imperial_directive": {
    id: "imperial_directive",
    title: "Unprecedented Orders",
    trigger: {
      type: "time",
      day: 21
    },
    content: "The mine administrator gathers all workers to announce an imperial directive. \"By order of the Emperor, certain tribal groups are being permitted temporary settlement on Roman lands during the winter months. This is a temporary measure only.\"",
    choices: [
      {
        text: "React with surprise",
        outcome: {
          description: "Like everyone else, you're shocked by this unprecedented arrangement. Romans allowing barbarians to settle within the empire?"
        }
      },
      {
        text: "Ask if your tribe is included",
        requirements: {favor: {admin: 10}},
        outcome: {
          knowledge: {tribal: 2, roman: 1},
          description: "The administrator confirms your tribe is among those permitted to settle. This is valuable information about your people's status."
        }
      }
    ],
    chapter: 6,
    mainStoryConnection: "Imperial directive for temporary settlement"
  },
  
  "supply_disruption": {
    id: "supply_disruption",
    title: "Diverted Resources",
    trigger: {
      type: "time",
      day: 25
    },
    content: "Food rations are reduced as supplies are diverted to support the tribal settlements. Guards grumble about \"feeding barbarians while Romans go hungry.\" Tension in the mine is palpable.",
    choices: [
      {
        text: "Accept the reduced rations",
        outcome: {
          food: {max: -20},
          description: "You tighten your belt and make do with less, like everyone else in the mine."
        }
      },
      {
        text: "Suggest tribal preservation techniques",
        requirements: {knowledge: {tribal: 3}, favor: {guard: 25}},
        outcome: {
          favor: {guard: 10},
          food: {rate: 0.005},
          description: "You share tribal methods for preserving food through winter. The guards implement your suggestions, improving the situation for everyone."
        }
      }
    ],
    chapter: 7,
    mainStoryConnection: "Resource allocation shifts due to settlement"
  },
  
  // Chapter 8-9 events
  "winter_hardship": {
    id: "winter_hardship",
    title: "The Deepest Cold",
    trigger: {
      type: "time",
      day: 31
    },
    content: "The winter reaches its harshest point. Even deep in the mines, the cold seeps through. Several older slaves have fallen ill, and work productivity has dropped significantly.",
    choices: [
      {
        text: "Focus on personal survival",
        outcome: {
          health: -10,
          narrativePaths: {independentSurvivor: 10},
          description: "You concentrate on keeping yourself alive, conserving energy and resources."
        }
      },
      {
        text: "Help care for the ill",
        requirements: {knowledge: {medical: 2}},
        outcome: {
          health: -15,
          medicine: 2,
          favor: {slave: 20},
          narrativePaths: {revolutionary: 10},
          description: "You sacrifice some of your own health to help others, earning their loyalty and gratitude."
        }
      }
    ],
    chapter: 8,
    mainStoryConnection: "Winter hardships"
  },
  
  "medical_cooperation": {
    id: "medical_cooperation",
    title: "Healing Exchange",
    trigger: {
      type: "time",
      day: 35
    },
    content: "A Roman physician visits the mine to address illness among the slaves. Surprisingly, he brings tribal healers with him. They're working together, combining approaches to combat winter diseases.",
    choices: [
      {
        text: "Observe their techniques",
        outcome: {
          knowledge: {medical: 1, roman: 1},
          description: "You watch carefully as they work, learning from both Roman and tribal healing methods."
        }
      },
      {
        text: "Offer your own knowledge",
        requirements: {knowledge: {medical: 3}},
        outcome: {
          favor: {admin: 15},
          medicine: 3,
          knowledge: {medical: 2},
          description: "Your contributions impress both the Roman physician and tribal healers. They leave you with additional medicine and valuable knowledge."
        }
      }
    ],
    chapter: 9,
    mainStoryConnection: "Medical cooperation development"
  },
  
  // Chapter 10 events
  "spring_thaw": {
    id: "spring_thaw",
    title: "The Ice Breaks",
    trigger: {
      type: "time",
      day: 41
    },
    content: "The mine overseer announces that reports from the frontier indicate the Danube ice is beginning to thin. \"The settlement arrangement will be concluding,\" he says. \"Prepare for changing conditions as normal operations resume.\"",
    choices: [
      {
        text: "Focus on your work",
        outcome: {
          silver: 10,
          description: "You continue your labor, but recognize this political shift may be your last opportunity for action."
        }
      },
      {
        text: "Ask about frontier conditions",
        requirements: {knowledge: {roman: 3}},
        outcome: {
          knowledge: {tribal: 3, roman: 2},
          description: "Using your understanding of Roman customs, you phrase your question appropriately. The overseer explains that the tribal groups will be returning north of the river as agreed in the imperial directive."
        }
      }
    ],
    chapter: 10,
    mainStoryConnection: "Spring thaw and withdrawal process"
  },
  
  "freedom_decision": {
    id: "freedom_decision",
    title: "Moment of Choice",
    trigger: {
      type: "time",
      day: 45
    },
    content: "With spring arriving and the frontier situation changing, you realize this may be your best opportunity to determine your future. The choices you've made and relationships you've built have created several possible paths forward.",
    choices: [
      {
        text: "Pursue Roman manumission",
        requirements: {narrativePaths: {romanIntegration: 30}, silver: 1000},
        outcome: {
          endingFlags: {manumissionEligible: true},
          description: "You've saved enough silver and built enough Roman connections to pursue legal freedom within the empire."
        }
      },
      {
        text: "Plan tribal return",
        requirements: {narrativePaths: {tribalLoyalty: 30}, knowledge: {tribal: 5}},
        outcome: {
          endingFlags: {escapeNetworkEstablished: true},
          description: "Your tribal connections and knowledge have created a path for you to escape and rejoin your people north of the Danube."
        }
      },
      {
        text: "Establish merchant identity",
        requirements: {narrativePaths: {independentSurvivor: 30}, silver: 800},
        outcome: {
          endingFlags: {merchantConnectionSecured: true},
          description: "Your resources and independent nature have positioned you to potentially establish yourself as a trader between Roman and tribal territories."
        }
      },
      {
        text: "Organize collective action",
        requirements: {narrativePaths: {revolutionary: 30}, favor: {slave: 75}},
        outcome: {
          endingFlags: {slaveRevoltPrepared: true},
          description: "You've built enough solidarity among fellow slaves to potentially organize a coordinated escape or even a revolt."
        }
      }
    ],
    chapter: 10,
    mainStoryConnection: "Long-term implications and resolution"
  },
  
  "game_conclusion": {
    id: "game_conclusion",
    title: "The Path Forward",
    trigger: {
      type: "time",
      day: 50
    },
    content: "As the frontier situation resolves and spring fully arrives, your moment of decision has come. The knowledge you've gathered, resources you've accumulated, and relationships you've built all converge to determine your fate.",
    choices: [
      {
        text: "View your ending",
        outcome: {
          description: "Your journey concludes based on the choices you've made throughout your time in the silver mines."
        }
      }
    ],
    chapter: 10,
    mainStoryConnection: "Narrative conclusion"
  }
};

// Character definitions
const narrativeCharacters = {
  marcus: {
    name: "Marcus",
    title: "Guard Captain",
    description: "A stern but fair veteran soldier assigned to the mines after a frontier injury. Has valuable information about military matters.",
    dialogueOptions: {
      basic: [
        "What's the situation on the frontier?",
        "How long have you been stationed here?",
        "What do you think of the tribal settlement?"
      ],
      advanced: [
        "Can you tell me about the legion's structure?",
        "What do you know about Titus Aelius Gallus?",
        "How serious is the tribal confederation threat?"
      ]
    },
    favorThresholds: {
      basic: 25,
      advanced: 50,
      special: 75
    }
  },
  
  livia: {
    name: "Livia",
    title: "Administrator's Assistant",
    description: "An educated Roman woman who manages records for the mine. Has access to official communications and political information.",
    dialogueOptions: {
      basic: [
        "What brings new orders to the mine?",
        "How are resources allocated?",
        "What's your role here?"
      ],
      advanced: [
        "What does the imperial directive actually say?",
        "How unusual is this settlement arrangement?",
        "What political implications concern the administrator?"
      ]
    },
    favorThresholds: {
      basic: 25,
      advanced: 50,
      special: 75
    }
  },
  
  cassius: {
    name: "Cassius",
    title: "Merchant",
    description: "A traveling trader who supplies the mine and carries news between settlements. Has broad but sometimes unreliable information.",
    dialogueOptions: {
      basic: [
        "What goods do you trade?",
        "Where have you traveled recently?",
        "What news from other settlements?"
      ],
      advanced: [
        "How has trade been affected by the tribal settlement?",
        "What opportunities might arise with spring?",
        "Could you help someone establish a new identity?"
      ]
    },
    favorThresholds: {
      basic: 25,
      advanced: 50,
      special: 75
    }
  },
  
  elva: {
    name: "Elva",
    title: "Tribal Elder",
    description: "An elder from your tribal confederation, recently brought to the mines. Has deep knowledge of tribal history and current movements.",
    dialogueOptions: {
      basic: [
        "What happened to our village?",
        "Which tribes have formed alliances?",
        "What tribal knowledge might help us survive here?"
      ],
      advanced: [
        "What do the tribal leaders think of the settlement arrangement?",
        "How are our people adapting to Roman proximity?",
        "What plans exist for after the winter?"
      ]
    },
    favorThresholds: {
      basic: 25,
      advanced: 50,
      special: 75
    }
  }
};

// Current active event
let currentEvent = null;

// Initialize narrative system
function initializeNarrative() {
  // Set up initial event (intro)
  triggerEvent("intro");
  
  // Update day display
  document.getElementById("current-day").textContent = playerNarrativeState.currentDay;
}

// Trigger narrative event
function triggerEvent(eventId) {
  // Get event data
  const event = narrativeEvents[eventId];
  
  if (!event) {
    console.error(`Event ${eventId} not found`);
    return false;
  }
  
  // Check if event has already been completed
  if (playerNarrativeState.completedEvents.includes(eventId)) {
    return false;
  }
  
  // Set current event
  currentEvent = event;
  
  // Update event display
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-description").textContent = event.content;
  
  // Clear previous choices
  const choicesContainer = document.getElementById("event-choices");
  choicesContainer.innerHTML = "";
  
  // Add choices
  event.choices.forEach((choice, index) => {
    // Check if choice requirements are met
    if (choice.requirements) {
      if (!checkChoiceRequirements(choice.requirements)) {
        return; // Skip this choice
      }
    }
    
    const choiceButton = document.createElement("button");
    choiceButton.className = "choice-button";
    choiceButton.textContent = choice.text;
    choiceButton.addEventListener("click", () => {
      selectChoice(index);
    });
    
    choicesContainer.appendChild(choiceButton);
  });
  
  // Add event to log
  addLogMessage(`Event: ${event.title}`);
  
  return true;
}

// Check if choice requirements are met
function checkChoiceRequirements(requirements) {
  // Check favor requirements
  if (requirements.favor) {
    for (const [faction, level] of Object.entries(requirements.favor)) {
      if (resources.favor[faction] < level) {
        return false;
      }
    }
  }
  
  // Check knowledge requirements
  if (requirements.knowledge) {
    for (const [type, level] of Object.entries(requirements.knowledge)) {
      if (resources.knowledge[type] < level) {
        return false;
      }
    }
  }
  
  // Check narrative path requirements
  if (requirements.narrativePaths) {
    for (const [path, level] of Object.entries(requirements.narrativePaths)) {
      if (playerNarrativeState.narrativePaths[path] < level) {
        return false;
      }
    }
  }
  
  // Check resource requirements
  if (requirements.silver && resources.silver.amount < requirements.silver) {
    return false;
  }
  
  return true;
}

// Select choice in current event
function selectChoice(choiceIndex) {
  if (!currentEvent) return;
  
  const choice = currentEvent.choices[choiceIndex];
  if (!choice) return;
  
  // Apply outcome
  applyChoiceOutcome(choice.outcome);
  
  // Add to completed events
  playerNarrativeState.completedEvents.push(currentEvent.id);
  
  // Add outcome to log
  addLogMessage(choice.outcome.description);
  
  // Clear current event
  currentEvent = null;
  
  // Update event display
  document.getElementById("event-title").textContent = "Daily Activities";
  document.getElementById("event-description").textContent = "Continue your work in the silver mines while waiting for the next significant event.";
  
  // Clear choices
  const choicesContainer = document.getElementById("event-choices");
  choicesContainer.innerHTML = "";
  
  // Check for next events
  checkForEvents();
}

// Apply choice outcome
function applyChoiceOutcome(outcome) {
  // Apply status change
  if (outcome.status) {
    player.status = outcome.status;
    updatePlayerStatus();
  }
  
  // Apply resource changes
  if (outcome.silver) {
    if (typeof outcome.silver === 'number') {
      resources.silver.amount = Math.min(resources.silver.amount + outcome.silver, resources.silver.max);
    } else if (outcome.silver.rate) {
      resources.silver.rate += outcome.silver.rate;
    }
  }
  
  if (outcome.food) {
    if (typeof outcome.food === 'number') {
      resources.food.amount = Math.min(resources.food.amount + outcome.food, resources.food.max);
    } else if (outcome.food.rate) {
      resources.food.rate += outcome.food.rate;
    } else if (outcome.food.max) {
      resources.food.max += outcome.food.max;
    }
  }
  
  if (outcome.water) {
    if (typeof outcome.water === 'number') {
      resources.water.amount = Math.min(resources.water.amount + outcome.water, resources.water.max);
    } else if (outcome.water.rate) {
      resources.water.rate += outcome.water.rate;
    } else if (outcome.water.max) {
      resources.water.max += outcome.water.max;
    }
  }
  
  if (outcome.health) {
    if (typeof outcome.health === 'number') {
      resources.health.amount = Math.min(Math.max(resources.health.amount + outcome.health, 0), resources.health.max);
    } else if (outcome.health.rate) {
      resources.health.rate += outcome.health.rate;
    }
  }
  
  if (outcome.medicine) {
    resources.medicine.amount = Math.min(resources.medicine.amount + outcome.medicine, resources.medicine.max);
  }
  
  // Apply knowledge changes
  if (outcome.knowledge) {
    for (const [type, amount] of Object.entries(outcome.knowledge)) {
      resources.knowledge[type] += amount;
    }
    updateSkillDisplay();
  }
  
  // Apply favor changes
  if (outcome.favor) {
    for (const [faction, amount] of Object.entries(outcome.favor)) {
      resources.favor[faction] = Math.max(Math.min(resources.favor[faction] + amount, 100), 0);
    }
    updateSkillDisplay();
  }
  
  // Apply narrative path changes
  if (outcome.narrativePaths) {
    for (const [path, amount] of Object.entries(outcome.narrativePaths)) {
      playerNarrativeState.narrativePaths[path] += amount;
    }
  }
  
  // Apply ending flags
  if (outcome.endingFlags) {
    for (const [flag, value] of Object.entries(outcome.endingFlags)) {
      playerNarrativeState.endingFlags[flag] = value;
    }
  }
  
  // Update displays
  updateResourceDisplay();
}

// Check for events that should trigger
function checkForEvents() {
  // Check time-based events
  for (const [id, event] of Object.entries(narrativeEvents)) {
    if (playerNarrativeState.completedEvents.includes(id)) continue;
    
    if (event.trigger.type === "time" && playerNarrativeState.currentDay === event.trigger.day) {
      triggerEvent(id);
      return; // Only trigger one event at a time
    }
  }
  
  // Check resource-based events
  // (To be implemented)
  
  // Check relationship-based events
  // (To be implemented)
}

// Advance game day
function advanceDay() {
  playerNarrativeState.currentDay++;
  
  // Update day display
  document.getElementById("current-day").textContent = playerNarrativeState.currentDay;
  
  // Check for chapter transitions
  updateChapter();
  
  // Check for events
  checkForEvents();
  
  // Daily resource adjustments
  applyDailyResourceChanges();
  
  // Add day change to log
  addLogMessage(`Day ${playerNarrativeState.currentDay} begins.`);
}

// Update current chapter based on day
function updateChapter() {
  let newChapter = 1;
  
  if (playerNarrativeState.currentDay >= 6) newChapter = 2;
  if (playerNarrativeState.currentDay >= 10) newChapter = 3;
  if (playerNarrativeState.currentDay >= 13) newChapter = 4;
  if (playerNarrativeState.currentDay >= 18) newChapter = 5;
  if (playerNarrativeState.currentDay >= 21) newChapter = 6;
  if (playerNarrativeState.currentDay >= 27) newChapter = 7;
  if (playerNarrativeState.currentDay >= 31) newChapter = 8;
  if (playerNarrativeState.currentDay >= 37) newChapter = 9;
  if (playerNarrativeState.currentDay >= 41) newChapter = 10;
  
  if (newChapter !== playerNarrativeState.currentChapter) {
    playerNarrativeState.currentChapter = newChapter;
    addLogMessage(`Chapter ${newChapter} begins.`);
  }
}

// Apply daily resource changes
function applyDailyResourceChanges() {
  // Daily food ration
  resources.food.amount = Math.min(resources.food.amount + 60, resources.food.max);
  
  // Daily water ration
  resources.water.amount = Math.min(resources.water.amount + 120, resources.water.max);
  
  // Favor decay
  resources.favor.guard = Math.max(resources.favor.guard - 1, 0);
  resources.favor.slave = Math.max(resources.favor.slave - 1, 0);
  resources.favor.admin = Math.max(resources.favor.admin - 1, 0);
  
  // Update displays
  updateResourceDisplay();
  updateSkillDisplay();
}

// Unlock character for narrative interactions
function unlockNarrativeCharacter(characterId) {
  if (narrativeCharacters[characterId]) {
    playerNarrativeState.unlockedCharacters[characterId] = true;
    addLogMessage(`You've established a connection with ${narrativeCharacters[characterId].name}, the ${narrativeCharacters[characterId].title}.`);
  }
}

// Get character dialogue options
function getCharacterDialogueOptions(characterId) {
  const character = narrativeCharacters[characterId];
  if (!character) return [];
  
  const options = [...character.dialogueOptions.basic];
  
  if (resources.favor[characterId] >= character.favorThresholds.advanced) {
    options.push(...character.dialogueOptions.advanced);
  }
  
  return options;
}

// Get game ending based on player choices
function getGameEnding() {
  // Determine primary ending
  let primaryEnding = "default";
  let primaryScore = 0;
  
  // Check Roman integration path
  if (playerNarrativeState.endingFlags.manumissionEligible) {
    const score = playerNarrativeState.narrativePaths.romanIntegration;
    if (score > primaryScore) {
      primaryScore = score;
      primaryEnding = "roman";
    }
  }
  
  // Check tribal loyalty path
  if (playerNarrativeState.endingFlags.escapeNetworkEstablished) {
    const score = playerNarrativeState.narrativePaths.tribalLoyalty;
    if (score > primaryScore) {
      primaryScore = score;
      primaryEnding = "tribal";
    }
  }
  
  // Check independent survivor path
  if (playerNarrativeState.endingFlags.merchantConnectionSecured) {
    const score = playerNarrativeState.narrativePaths.independentSurvivor;
    if (score > primaryScore) {
      primaryScore = score;
      primaryEnding = "merchant";
    }
  }
  
  // Check revolutionary path
  if (playerNarrativeState.endingFlags.slaveRevoltPrepared) {
    const score = playerNarrativeState.narrativePaths.revolutionary;
    if (score > primaryScore) {
      primaryScore = score;
      primaryEnding = "revolt";
    }
  }
  
  // Return ending details
  return {
    type: primaryEnding,
    score: primaryScore,
    details: getEndingDetails(primaryEnding)
  };
}

// Get ending details
function getEndingDetails(endingType) {
  switch (endingType) {
    case "roman":
      return {
        title: "Roman Citizen",
        description: "Through diligent work and building Roman connections, you've earned enough to purchase your freedom. As the tribal settlement concludes and the frontier returns to normal, you begin a new life as a freedman within the Empire, forever changed by your experiences and knowledge of both worlds."
      };
    case "tribal":
      return {
        title: "Return to the Tribes",
        description: "Using your knowledge and tribal connections, you escape during the confusion of the spring withdrawal. Crossing the Danube, you rejoin your people, bringing valuable information about Roman ways that will help your tribe navigate the complex frontier politics in the years to come."
      };
    case "merchant":
      return {
        title: "Frontier Trader",
        description: "With your accumulated resources and understanding of both Roman and tribal cultures, you establish yourself as a merchant. Operating in the frontier zone, you build a unique life bridging two worlds, finding opportunity in the spaces between empires."
      };
    case "revolt":
      return {
        title: "Slave Uprising",
        description: "The solidarity you built among fellow slaves culminates in a coordinated uprising. While the outcome remains uncertain, you've seized control of your destiny and inspired others to fight for freedom, creating a legacy that will be whispered throughout the mines for generations."
      };
    default:
      return {
        title: "Survivor",
        description: "You continue to endure life in the silver mines, neither escaping nor advancing. Yet the knowledge you've gained and the events you've witnessed have given you a unique perspective on the world beyond the mine walls. Perhaps another opportunity will arise in time."
      };
  }
}

// Export functions and objects
window.playerNarrativeState = playerNarrativeState;
window.narrativeEvents = narrativeEvents;
window.narrativeCharacters = narrativeCharacters;
window.initializeNarrative = initializeNarrative;
window.triggerEvent = triggerEvent;
window.advanceDay = advanceDay;
window.unlockNarrativeCharacter = unlockNarrativeCharacter;
window.getGameEnding = getGameEnding;
