// events.js - Random events system

const Events = (function() {
    // Event definitions
    const eventDefinitions = [
        {
            id: 'cave_in',
            title: 'Minor Cave-In',
            description: 'A section of the tunnel ceiling collapses, blocking access to part of the mine.',
            probability: 0.001, // Chance per second
            cooldown: 86400, // 1 day in seconds
            requirements: {},
            effects: {
                resources: { silver: -10, health: -5 }
            },
            lastTriggered: 0
        },
        {
            id: 'guard_inspection',
            title: 'Guard Inspection',
            description: 'Guards are conducting a surprise inspection of the miners and their quarters.',
            probability: 0.0008,
            cooldown: 43200, // 12 hours in seconds
            requirements: {},
            effects: {
                resources: { favor: -1 }
            },
            choices: [
                {
                    text: 'Hide your extra resources',
                    success: {
                        probability: 0.6,
                        description: 'You successfully hide your extra resources from the guards.',
                        effects: {}
                    },
                    failure: {
                        description: 'The guards find your hidden stash and confiscate it.',
                        effects: {
                            resources: { silver: -50, food: -5, water: -5 }
                        }
                    }
                },
                {
                    text: 'Comply with the inspection',
                    success: {
                        probability: 0.9,
                        description: 'The guards appreciate your cooperation.',
                        effects: {
                            resources: { favor: 1 }
                        }
                    },
                    failure: {
                        description: 'Despite your cooperation, the guards are in a bad mood.',
                        effects: {}
                    }
                }
            ],
            lastTriggered: 0
        },
        {
            id: 'rich_vein',
            title: 'Rich Silver Vein',
            description: 'You discover an unusually rich vein of silver ore.',
            probability: 0.0005,
            cooldown: 172800, // 2 days in seconds
            requirements: {},
            effects: {
                resources: { silver: 100 }
            },
            choices: [
                {
                    text: 'Keep it to yourself',
                    success: {
                        probability: 0.7,
                        description: 'You manage to mine the vein in secret, keeping all the silver for yourself.',
                        effects: {
                            resources: { silver: 50 }
                        }
                    },
                    failure: {
                        description: 'Another slave spots you and reports to the overseer. You are punished.',
                        effects: {
                            resources: { health: -10, favor: -2 }
                        }
                    }
                },
                {
                    text: 'Report it to the overseer',
                    success: {
                        probability: 0.8,
                        description: 'The overseer rewards your honesty.',
                        effects: {
                            resources: { favor: 2, food: 5 }
                        }
                    },
                    failure: {
                        description: 'The overseer takes credit for the discovery himself.',
                        effects: {}
                    }
                }
            ],
            lastTriggered: 0
        },
        {
            id: 'sick_slave',
            title: 'Sick Fellow Slave',
            description: 'One of your fellow slaves has fallen ill and needs help.',
            probability: 0.0006,
            cooldown: 64800, // 18 hours in seconds
            requirements: {
                storyBeats: ['plague_rumors']
            },
            choices: [
                {
                    text: 'Help the sick slave',
                    success: {
                        probability: 0.6,
                        description: 'You help nurse the slave back to health. They are grateful.',
                        effects: {
                            resources: { food: -3, water: -3, favor: 1, knowledge: 1 }
                        }
                    },
                    failure: {
                        description: 'Despite your efforts, the slave\'s condition worsens. You may have caught their illness.',
                        effects: {
                            resources: { food: -3, water: -3, health: -5 }
                        }
                    }
                },
                {
                    text: 'Keep your distance',
                    success: {
                        probability: 0.9,
                        description: 'You avoid catching the illness, though you feel guilty.',
                        effects: {}
                    },
                    failure: {
                        description: 'Other slaves notice your selfishness and think less of you.',
                        effects: {
                            resources: { favor: -1 }
                        }
                    }
                }
            ],
            lastTriggered: 0
        },
        {
            id: 'extra_rations',
            title: 'Extra Rations',
            description: 'A supply error has resulted in extra food rations being delivered to the mine.',
            probability: 0.0004,
            cooldown: 129600, // 36 hours in seconds
            requirements: {},
            effects: {
                resources: { food: 10 }
            },
            lastTriggered: 0
        },
        {
            id: 'water_shortage',
            title: 'Water Shortage',
            description: 'The mine\'s water supply has been reduced due to a broken aqueduct.',
            probability: 0.0005,
            cooldown: 86400, // 1 day in seconds
            requirements: {},
            effects: {
                resourceRates: { water: -0.1 }
            },
            duration: 3600, // 1 hour in seconds
            lastTriggered: 0
        },
        {
            id: 'tool_breakage',
            title: 'Broken Tools',
            description: 'Your mining tools have broken from overuse.',
            probability: 0.0007,
            cooldown: 43200, // 12 hours in seconds
            requirements: {},
            effects: {
                resources: { tools: -1 }
            },
            lastTriggered: 0
        },
        {
            id: 'overseer_mood',
            title: 'Overseer\'s Good Mood',
            description: 'The mine overseer is in an unusually good mood today.',
            probability: 0.0004,
            cooldown: 86400, // 1 day in seconds
            requirements: {
                characters: ['overseer']
            },
            effects: {
                resources: { favor: 1, food: 2 }
            },
            lastTriggered: 0
        },
        {
            id: 'imperial_visit',
            title: 'Imperial Official Visit',
            description: 'An official from Rome is inspecting the mine\'s production.',
            probability: 0.0002,
            cooldown: 259200, // 3 days in seconds
            requirements: {},
            effects: {},
            choices: [
                {
                    text: 'Work harder to impress the official',
                    success: {
                        probability: 0.5,
                        description: 'The official notices your exceptional effort and mentions it to the overseer.',
                        effects: {
                            resources: { health: -5, favor: 2 }
                        }
                    },
                    failure: {
                        description: 'Despite your efforts, the official doesn\'t notice you.',
                        effects: {
                            resources: { health: -5 }
                        }
                    }
                },
                {
                    text: 'Continue working normally',
                    success: {
                        probability: 0.9,
                        description: 'The inspection passes without incident.',
                        effects: {}
                    },
                    failure: {
                        description: 'The official notices your lack of enthusiasm and makes a comment to the overseer.',
                        effects: {
                            resources: { favor: -1 }
                        }
                    }
                }
            ],
            lastTriggered: 0
        },
        {
            id: 'escaped_slave',
            title: 'Escaped Slave',
            description: 'A slave has attempted to escape. The guards are on high alert and questioning everyone.',
            probability: 0.0003,
            cooldown: 172800, // 2 days in seconds
            requirements: {},
            choices: [
                {
                    text: 'Claim no knowledge of the escape',
                    success: {
                        probability: 0.7,
                        description: 'The guards believe you and move on.',
                        effects: {}
                    },
                    failure: {
                        description: 'The guards are suspicious and put you on reduced rations as punishment.',
                        effects: {
                            resources: { food: -5, water: -5 }
                        }
                    }
                },
                {
                    text: 'Provide false information to misdirect the guards',
                    success: {
                        probability: 0.4,
                        description: 'Your misdirection gives the escaped slave more time. Some other slaves regard you with newfound respect.',
                        effects: {
                            resources: { favor: 1 }
                        }
                    },
                    failure: {
                        description: 'The guards realize you\'re lying and punish you severely.',
                        effects: {
                            resources: { health: -15, favor: -2 }
                        }
                    }
                }
            ],
            lastTriggered: 0
        }
    ];
    
    // Current events state
    let events = [];
    let activeEvents = [];
    
    // Initialize events
    function init() {
        events = [...eventDefinitions];
    }
    
    // Check for events
    function checkForEvents(deltaTime) {
        // Update active events
        updateActiveEvents(deltaTime);
        
        // Check for new events
        events.forEach(event => {
            // Skip if on cooldown
            if (Date.now() - event.lastTriggered < event.cooldown * 1000) {
                return;
            }
            
            // Check requirements
            if (!checkEventRequirements(event)) {
                return;
            }
            
            // Calculate if event should trigger
            const triggerChance = event.probability * deltaTime;
            if (Math.random() < triggerChance) {
                triggerEvent(event);
            }
        });
    }
    
    // Check if event requirements are met
    function checkEventRequirements(event) {
        if (!event.requirements) return true;
        
        // Check character requirements
        if (event.requirements.characters) {
            for (const charId of event.requirements.characters) {
                const character = Characters.getCharacter(charId);
                if (!character || !character.unlocked) {
                    return false;
                }
            }
        }
        
        // Check story beat requirements
        if (event.requirements.storyBeats) {
            for (const beatId of event.requirements.storyBeats) {
                if (!Narrative.isStoryBeatUnlocked(beatId)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Trigger an event
    function triggerEvent(event) {
        event.lastTriggered = Date.now();
        
        // Apply immediate effects
        if (event.effects) {
            applyEventEffects(event.effects);
        }
        
        // Add to active events if it has a duration
        if (event.duration) {
            activeEvents.push({
                id: event.id,
                timeRemaining: event.duration,
                effects: event.effects
            });
        }
        
        // Show event notification
        UI.showNotification(`Event: ${event.title}`, 'event');
        
        // If event has choices, show modal
        if (event.choices) {
            showEventChoicesModal(event);
        } else {
            // Add to journal
            Narrative.addJournalEntry(event.title, event.description);
        }
    }
    
    // Show event choices modal
    function showEventChoicesModal(event) {
        let content = `
            <h2>${event.title}</h2>
            <p>${event.description}</p>
            <div class="event-choices">
        `;
        
        event.choices.forEach((choice, index) => {
            content += `
                <button class="event-choice" data-event-id="${event.id}" data-choice-index="${index}">
                    ${choice.text}
                </button>
            `;
        });
        
        content += `</div>`;
        
        UI.showModal(content);
        
        // Add event listeners to choice buttons
        setTimeout(() => {
            const choiceButtons = document.querySelectorAll('.event-choice');
            choiceButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const eventId = this.getAttribute('data-event-id');
                    const choiceIndex = parseInt(this.getAttribute('data-choice-index'));
                    handleEventChoice(eventId, choiceIndex);
                    UI.hideModal();
                });
            });
        }, 0);
    }
    
    // Handle event choice
    function handleEventChoice(eventId, choiceIndex) {
        const event = events.find(e => e.id === eventId);
        if (!event || !event.choices || choiceIndex >= event.choices.length) {
            return;
        }
        
        const choice = event.choices[choiceIndex];
        const outcome = Math.random() < choice.success.probability ? 'success' : 'failure';
        const result = outcome === 'success' ? choice.success : choice.failure;
        
        // Apply effects
        if (result.effects) {
            applyEventEffects(result.effects);
        }
        
        // Add to journal
        Narrative.addJournalEntry(
            `${event.title} - Outcome`,
            `${event.description}\n\nYou chose to ${choice.text.toLowerCase()}.\n\n${result.description}`
        );
        
        // Show notification
        UI.showNotification(result.description, 'event');
    }
    
    // Apply event effects
    function applyEventEffects(effects) {
        if (effects.resources) {
            for (const [resource, amount] of Object.entries(effects.resources)) {
                Resources.add(resource, amount);
            }
        }
        
        if (effects.resourceRates) {
            for (const [resource, rate] of Object.entries(effects.resourceRates)) {
                Resources.setRate(resource, Resources.getRate(resource) + rate);
            }
        }
    }
    
    // Update active events
    function updateActiveEvents(deltaTime) {
        for (let i = activeEvents.length - 1; i >= 0; i--) {
            const activeEvent = activeEvents[i];
            
            // Reduce time remaining
            activeEvent.timeRemaining -= deltaTime;
            
            // Check if event has ended
            if (activeEvent.timeRemaining <= 0) {
                // Revert resource rate effects
                if (activeEvent.effects && activeEvent.effects.resourceRates) {
                    for (const [resource, rate] of Object.entries(activeEvent.effects.resourceRates)) {
                        Resources.setRate(resource, Resources.getRate(resource) - rate);
                    }
                }
                
                // Remove from active events
                activeEvents.splice(i, 1);
                
                // Show notification
                const event = events.find(e => e.id === activeEvent.id);
                if (event) {
                    UI.showNotification(`Event ended: ${event.title}`, 'event');
                }
            }
        }
    }
    
    // Get events state for saving
    function getState() {
        return {
            events: events.map(event => ({
                id: event.id,
                lastTriggered: event.lastTriggered
            })),
            activeEvents: activeEvents
        };
    }
    
    // Load events state
    function loadState(savedState) {
        if (!savedState) return;
        
        // Restore events state
        if (savedState.events) {
            savedState.events.forEach(savedEvent => {
                const event = events.find(e => e.id === savedEvent.id);
                if (event) {
                    event.lastTriggered = savedEvent.lastTriggered;
                }
            });
        }
        
        // Restore active events
        if (savedState.activeEvents) {
            activeEvents = savedState.activeEvents;
        }
    }
    
    // Public API
    return {
        init,
        checkForEvents,
        getState,
        loadState
    };
})();
