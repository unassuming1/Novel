// Enhanced narrative.js - Making narrative a central component of gameplay

const Narrative = (function() {
    // Story progression state
    const state = {
        currentDay: 1,
        storyProgress: 0,
        newsSystemUnlocked: true, // Changed to true by default to make narrative immediately available
        newsItems: [],
        journalEntries: [],
        unlockedStoryElements: [],
        activeQuests: [],
        currentNarrativeDisplay: null, // Track what's currently being displayed
        narrativeQueue: [], // Queue for narrative elements to display
        lastNarrativeUpdate: 0, // Track when we last updated the narrative display
        narrativeUpdateInterval: 60000, // Update narrative display every minute (in ms)
        narrativeVisible: true // Control visibility of narrative panel
    };
    
    // Story beats definitions - key narrative moments that unlock as the game progresses
    const storyBeats = [
        {
            id: 'introduction',
            title: 'Arrival at the Mine',
            content: 'You arrive at the silver mine, shackled and exhausted from the journey. The overseer assigns you to the upper tunnels - the easiest work, but also the least productive. "Don\'t die in your first week," he grunts. "It\'s a waste of good chains."',
            trigger: { type: 'immediate' },
            unlocked: false,
            image: 'mine_entrance.svg'
        },
        {
            id: 'first_silver',
            title: 'First Silver',
            content: 'You extract your first pieces of silver ore. Your hands are already blistered, but there\'s a small sense of accomplishment. A veteran miner notices your technique and shakes his head. "You\'ll break your back that way. Here, like this." His small advice makes the work slightly more bearable.',
            trigger: { type: 'resource', resource: 'silver', amount: 10 },
            unlocked: false,
            image: 'silver_ore.svg'
        },
        {
            id: 'grass_crown_news',
            title: 'News from the Frontier',
            content: 'During the evening meal, you overhear guards talking about a general named Sulla who has been awarded the grass crown - Rome\'s highest military honor - for saving his legion from certain death. The soldiers speak of him with reverence, though one mutters that the victory came at a terrible cost.',
            trigger: { type: 'resource', resource: 'silver', amount: 50 },
            unlocked: false,
            addNews: true,
            image: 'grass_crown.svg'
        },
        {
            id: 'overseer_story',
            title: 'The Overseer\'s Tale',
            content: 'The mine overseer, loosened by wine, reveals he once served in the legions under General Sulla. "Strictest commander I ever had," he says, "but fair. He wouldn\'t ask men to do what he wouldn\'t do himself. Saved my life during a battle with the Samnites." He falls silent, lost in memory, then barks at everyone to get back to work.',
            trigger: { type: 'resource', resource: 'silver', amount: 100 },
            unlocked: false,
            addNews: true,
            image: 'overseer.svg'
        },
        {
            id: 'political_rumors',
            title: 'Political Whispers',
            content: 'A new slave arrives who once served in a wealthy Roman household. He speaks of growing tensions in Rome\'s political circles. "Sulla\'s victories have made him popular with the people and the army, but the Senate fears his ambition. Some say he seeks to follow in the footsteps of Marius."',
            trigger: { type: 'resource', resource: 'silver', amount: 200 },
            unlocked: false,
            addNews: true,
            image: 'roman_senate.svg'
        },
        {
            id: 'mithridates_war',
            title: 'War in the East',
            content: 'News arrives that Rome is now at war with King Mithridates of Pontus. The Senate has appointed Sulla to lead the campaign. "More silver will be needed for the war effort," announces the mine administrator. "Production quotas are doubled, effective immediately."',
            trigger: { type: 'resource', resource: 'silver', amount: 500 },
            unlocked: false,
            addNews: true,
            image: 'roman_legion.svg'
        },
        {
            id: 'political_betrayal',
            title: 'Political Betrayal',
            content: 'A merchant brings shocking news: while Sulla prepared his army, his enemies in Rome stripped him of his command and gave it to Marius instead. The mine overseer spits on the ground. "Politics! The man saves Rome, and this is his reward?"',
            trigger: { type: 'resource', resource: 'silver', amount: 1000 },
            unlocked: false,
            addNews: true,
            image: 'betrayal.svg'
        },
        {
            id: 'march_on_rome',
            title: 'March on Rome',
            content: 'The mine falls silent as unprecedented news spreads: Sulla has marched his legions on Rome itself - the first Roman general to turn his army against the Republic. They say he wears his grass crown as he leads his men into the city. "Civil war," mutters the overseer. "Gods help us all."',
            trigger: { type: 'resource', resource: 'silver', amount: 2000 },
            unlocked: false,
            addNews: true,
            image: 'rome_march.svg'
        },
        {
            id: 'sulla_dictator',
            title: 'Dictator of Rome',
            content: 'Word reaches the mine that Sulla has been named Dictator of Rome with unlimited power to reform the Republic. The mine administrator announces that production must increase to pay for the new regime. "The Dictator remembers those who serve him well," he adds meaningfully.',
            trigger: { type: 'resource', resource: 'silver', amount: 5000 },
            unlocked: false,
            addNews: true,
            image: 'dictator.svg'
        },
        {
            id: 'proscriptions',
            title: 'The Proscriptions',
            content: 'Dark tales filter down to the mines about Sulla\'s "proscriptions" - lists of enemies who can be killed on sight, their property seized. Many wealthy Romans have been executed, their assets claimed for the state treasury. Even in the depths of the mine, people speak Sulla\'s name in whispers now.',
            trigger: { type: 'resource', resource: 'silver', amount: 10000 },
            unlocked: false,
            addNews: true,
            image: 'proscriptions.svg'
        },
        {
            id: 'constitutional_reforms',
            title: 'Constitutional Reforms',
            content: 'News arrives that Sulla is using his power to reform Rome\'s government, strengthening the Senate and limiting the power of the common people. "He claims he\'s saving the Republic from itself," explains a literate slave who reads proclamations. "Some call him a tyrant, others a savior."',
            trigger: { type: 'resource', resource: 'silver', amount: 20000 },
            unlocked: false,
            addNews: true,
            image: 'reforms.svg'
        },
        {
            id: 'retirement',
            title: 'Unexpected Retirement',
            content: 'Astonishing news spreads through the empire: after achieving absolute power, Sulla has voluntarily stepped down as Dictator and retired to his country estate. "They say he still wears his grass crown at public appearances," remarks the overseer. "A reminder of where his power began."',
            trigger: { type: 'resource', resource: 'silver', amount: 50000 },
            unlocked: false,
            addNews: true,
            image: 'retirement.svg'
        },
        {
            id: 'death_of_sulla',
            title: 'Death of a Dictator',
            content: 'Word reaches the mines that Sulla has died. They say he requested that his epitaph read: "No friend ever served me, and no enemy ever wronged me, whom I have not repaid in full." The Republic he sought to save continues, though forever changed by his actions.',
            trigger: { type: 'resource', resource: 'silver', amount: 100000 },
            unlocked: false,
            addNews: true,
            image: 'funeral.svg'
        },
        {
            id: 'legacy',
            title: 'Legacy of the Grass Crown',
            content: 'As you toil in the mines, you reflect on Sulla\'s rise and fall. From a simple grass crown on the battlefield to absolute power and back to private life. Perhaps there\'s a lesson there about power, ambition, and the choices we make with what little freedom we have.',
            trigger: { type: 'resource', resource: 'silver', amount: 200000 },
            unlocked: false,
            addNews: true,
            image: 'legacy.svg'
        }
    ];
    
    // Background stories that provide context and atmosphere
    const backgroundStories = [
        {
            id: 'mine_life_1',
            title: 'Life in the Mines',
            content: 'The silver mines are a world unto themselves. In the deeper tunnels, some slaves haven\'t seen daylight in years. They develop pale, almost translucent skin and eyes sensitive to even the dim lamplight. Veterans say you can tell how long someone has been here by how they react to the mention of the sun.',
            image: 'deep_mine.svg'
        },
        {
            id: 'roman_politics_1',
            title: 'Politics of Rome',
            content: 'Even in the mines, echoes of Rome\'s political struggles reach you. The optimates and populares - conservatives and reformers - battle for control of the Republic. Generals like Sulla and Marius rise to prominence through military success, their ambitions extending beyond the battlefield.',
            image: 'roman_politics.svg'
        },
        {
            id: 'grass_crown_meaning',
            title: 'The Grass Crown',
            content: 'The corona graminea - the grass crown - is Rome\'s highest military decoration, awarded only to a commander who saves an entire legion from destruction. Made from grasses and wildflowers collected from the battlefield itself, it is considered more honorable than crowns of gold or silver.',
            image: 'grass_crown_detail.svg'
        },
        {
            id: 'silver_importance',
            title: 'Silver and Empire',
            content: 'Rome\'s hunger for silver is insatiable. The denarius, the standard silver coin, finances the legions that expand and defend the empire. Each swing of your pick contributes to this vast machine of conquest and governance, though you\'ll never hold the fruits of your labor.',
            image: 'denarius.svg'
        },
        {
            id: 'slave_solidarity',
            title: 'Bonds of Hardship',
            content: 'Despite the brutal conditions, small kindnesses exist among the mine slaves. An extra sip of water shared, a warning whispered about an unstable tunnel, a hand offered in the darkness when someone stumbles. These tiny moments of humanity are treasured all the more for their rarity.',
            image: 'slaves.svg'
        }
    ];
    
    // Quest definitions
    const quests = [
        {
            id: 'veteran_memories',
            title: 'Veteran\'s Memories',
            description: 'The old veteran who served under General Sulla seems willing to share stories. Gain his trust to learn more about the frontier wars.',
            requirements: { favor: 3 },
            rewards: { knowledge: 5, favor: 2 },
            steps: [
                { description: 'Bring the veteran extra water rations', cost: { water: 5 } },
                { description: 'Listen to his stories of the campaigns', time: 2 },
                { description: 'Find a small token to remind him of his service', special: 'find_token' }
            ],
            complete: false,
            active: false,
            currentStep: 0,
            image: 'veteran.svg'
        },
        {
            id: 'secret_message',
            title: 'Message from Rome',
            description: 'A new slave claims to have information about Sulla\'s actions in Rome that could be valuable.',
            requirements: { knowledge: 5 },
            rewards: { knowledge: 10, silver: 50 },
            steps: [
                { description: 'Gain the new slave\'s trust', cost: { food: 3 } },
                { description: 'Create a distraction for the guards', time: 1 },
                { description: 'Decode the hidden message', special: 'decode_message' }
            ],
            complete: false,
            active: false,
            currentStep: 0,
            image: 'message.svg'
        }
    ];
    
    // Initialize narrative system
    function init() {
        // Unlock immediate story beats
        checkStoryBeats();
        
        // Add initial journal entry
        addJournalEntry({
            title: 'First Day in the Mines',
            content: 'The darkness is absolute here, broken only by flickering oil lamps. The air is thick with dust that coats the lungs. I must find a way to survive this place.'
        });
        
        // Set up narrative update interval
        setInterval(updateNarrativeDisplay, 10000); // Check for narrative updates every 10 seconds
        
        // Queue initial background story
        queueBackgroundStory();
    }
    
    // Check for narrative progression
    function checkProgression() {
        checkStoryBeats();
        checkQuestAvailability();
        updateActiveQuests();
        
        // Periodically queue background stories
        if (Math.random() < 0.1) { // 10% chance each check
            queueBackgroundStory();
        }
    }
    
    // Check if any story beats should be unlocked
    function checkStoryBeats() {
        storyBeats.forEach(beat => {
            if (beat.unlocked) return;
            
            let shouldUnlock = false;
            
            switch (beat.trigger.type) {
                case 'immediate':
                    shouldUnlock = true;
                    break;
                case 'resource':
                    shouldUnlock = Resources.get(beat.trigger.resource) >= beat.trigger.amount;
                    break;
                case 'day':
                    shouldUnlock = getGameDay() >= beat.trigger.day;
                    break;
                case 'upgrade':
                    const upgrade = Upgrades.getUpgrade(beat.trigger.upgradeId);
                    shouldUnlock = upgrade && upgrade.purchased;
                    break;
            }
            
            if (shouldUnlock) {
                unlockStoryBeat(beat);
            }
        });
    }
    
    // Unlock a story beat
    function unlockStoryBeat(beat) {
        beat.unlocked = true;
        state.unlockedStoryElements.push(beat.id);
        state.storyProgress++;
        
        // Add to news feed if applicable
        if (beat.addNews) {
            addNewsItem({
                title: beat.title,
                content: beat.content,
                image: beat.image
            });
        }
        
        // Add to journal
        addJournalEntry({
            title: beat.title,
            content: beat.content,
            image: beat.image
        });
        
        // Queue for display in narrative panel
        queueNarrativeElement({
            type: 'story',
            title: beat.title,
            content: beat.content,
            image: beat.image
        });
        
        // Apply any effects
        if (beat.effects) {
            applyStoryEffects(beat.effects);
        }
        
        // Trigger UI update
        UI.updateNarrativeDisplay();
        UI.showNotification(`New story: ${beat.title}`);
    }
    
    // Queue a narrative element for display
    function queueNarrativeElement(element) {
        state.narrativeQueue.push(element);
        
        // If nothing is currently displayed, show this immediately
        if (!state.currentNarrativeDisplay) {
            updateNarrativeDisplay();
        }
    }
    
    // Update the narrative display
    function updateNarrativeDisplay() {
        const now = Date.now();
        
        // If something is currently displayed, check if it's time to change
        if (state.currentNarrativeDisplay) {
            // Keep each narrative element displayed for at least 60 seconds
            if (now - state.lastNarrativeUpdate < state.narrativeUpdateInterval) {
                return;
            }
        }
        
        // If we have queued narrative elements, display the next one
        if (state.narrativeQueue.length > 0) {
            state.currentNarrativeDisplay = state.narrativeQueue.shift();
            state.lastNarrativeUpdate = now;
            
            // Update UI
            UI.updateNarrativeDisplay(state.currentNarrativeDisplay);
        } 
        // If queue is empty but we've been showing the same thing for a while, show a random background story
        else if (now - state.lastNarrativeUpdate > state.narrativeUpdateInterval * 3) {
            queueBackgroundStory();
            if (state.narrativeQueue.length > 0) {
                state.currentNarrativeDisplay = state.narrativeQueue.shift();
                state.lastNarrativeUpdate = now;
                
                // Update UI
                UI.updateNarrativeDisplay(state.currentNarrativeDisplay);
            }
        }
    }
    
    // Queue a random background story
    function queueBackgroundStory() {
        if (backgroundStories.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * backgroundStories.length);
        const story = backgroundStories[randomIndex];
        
        queueNarrativeElement({
            type: 'background',
            title: story.title,
            content: story.content,
            image: story.image
        });
    }
    
    // Add a news item
    function addNewsItem(item) {
        // Ensure news system is unlocked
        state.newsSystemUnlocked = true;
        
        // Add timestamp
        item.timestamp = Date.now();
        item.day = getGameDay();
        
        // Add to news array
        state.newsItems.unshift(item); // Add to beginning of array
        
        // Limit news items to prevent array from growing too large
        if (state.newsItems.length > 50) {
            state.newsItems.pop(); // Remove oldest
        }
        
        // Update UI
        UI.updateNewsFeed();
    }
    
    // Add a journal entry
    function addJournalEntry(entry) {
        // Add timestamp
        entry.timestamp = Date.now();
        entry.day = getGameDay();
        
        // Add to journal array
        state.journalEntries.unshift(entry); // Add to beginning of array
        
        // Update UI
        UI.updateJournal();
    }
    
    // Check for available quests
    function checkQuestAvailability() {
        quests.forEach(quest => {
            if (quest.complete || quest.active) return;
            
            // Check if requirements are met
            let requirementsMet = true;
            
            if (quest.requirements) {
                // Check favor requirement
                if (quest.requirements.favor && Resources.get('favor') < quest.requirements.favor) {
                    requirementsMet = false;
                }
                
                // Check knowledge requirement
                if (quest.requirements.knowledge && Resources.get('knowledge') < quest.requirements.knowledge) {
                    requirementsMet = false;
                }
                
                // Check story beat requirements
                if (quest.requirements.storyBeats) {
                    for (const beatId of quest.requirements.storyBeats) {
                        if (!state.unlockedStoryElements.includes(beatId)) {
                            requirementsMet = false;
                            break;
                        }
                    }
                }
            }
            
            if (requirementsMet) {
                activateQuest(quest);
            }
        });
    }
    
    // Activate a quest
    function activateQuest(quest) {
        quest.active = true;
        state.activeQuests.push(quest.id);
        
        // Add to journal
        addJournalEntry({
            title: `New Quest: ${quest.title}`,
            content: quest.description,
            image: quest.image
        });
        
        // Queue for display in narrative panel
        queueNarrativeElement({
            type: 'quest',
            title: `New Quest: ${quest.title}`,
            content: quest.description,
            image: quest.image
        });
        
        // Update UI
        UI.updateQuestDisplay();
        UI.showNotification(`New quest available: ${quest.title}`);
    }
    
    // Update active quests
    function updateActiveQuests() {
        state.activeQuests.forEach(questId => {
            const quest = quests.find(q => q.id === questId);
            if (!quest || quest.complete) return;
            
            // Check if current step can be completed
            const currentStep = quest.steps[quest.currentStep];
            
            if (currentStep.cost) {
                // Check if player has resources for this step
                let canComplete = true;
                for (const [resource, amount] of Object.entries(currentStep.cost)) {
                    if (Resources.get(resource) < amount) {
                        canComplete = false;
                        break;
                    }
                }
                
                if (canComplete) {
                    // Mark step as completable in UI
                    UI.updateQuestStepStatus(quest.id, quest.currentStep, 'completable');
                }
            } else if (currentStep.time) {
                // Time-based steps are handled by the UI
            } else if (currentStep.special) {
                // Special steps are handled by specific functions
                // These might be triggered by events or specific actions
            }
        });
    }
    
    // Complete a quest step
    function completeQuestStep(questId) {
        const quest = quests.find(q => q.id === questId);
        if (!quest || quest.complete) return false;
        
        const currentStep = quest.steps[quest.currentStep];
        
        // Deduct resources if needed
        if (currentStep.cost) {
            for (const [resource, amount] of Object.entries(currentStep.cost)) {
                Resources.subtract(resource, amount);
            }
        }
        
        // Advance to next step
        quest.currentStep++;
        
        // Check if quest is complete
        if (quest.currentStep >= quest.steps.length) {
            completeQuest(quest);
        } else {
            // Update journal
            addJournalEntry({
                title: `Quest Update: ${quest.title}`,
                content: `Step completed: ${currentStep.description}`,
                image: quest.image
            });
            
            // Update UI
            UI.updateQuestDisplay();
            UI.showNotification(`Quest step completed: ${currentStep.description}`);
        }
        
        return true;
    }
    
    // Complete a quest
    function completeQuest(quest) {
        quest.complete = true;
        quest.active = false;
        
        // Remove from active quests
        const index = state.activeQuests.indexOf(quest.id);
        if (index !== -1) {
            state.activeQuests.splice(index, 1);
        }
        
        // Award rewards
        if (quest.rewards) {
            for (const [resource, amount] of Object.entries(quest.rewards)) {
                Resources.add(resource, amount);
            }
        }
        
        // Add to journal
        addJournalEntry({
            title: `Quest Completed: ${quest.title}`,
            content: `You have completed the quest and received your rewards.`,
            image: quest.image
        });
        
        // Queue for display in narrative panel
        queueNarrativeElement({
            type: 'quest_complete',
            title: `Quest Completed: ${quest.title}`,
            content: `You have successfully completed this quest and gained new insights about Sulla and the Grass Crown.`,
            image: quest.image
        });
        
        // Update UI
        UI.updateQuestDisplay();
        UI.showNotification(`Quest completed: ${quest.title}`);
    }
    
    // Apply effects from story beats
    function applyStoryEffects(effects) {
        // Apply resource rate changes
        if (effects.resourceRates) {
            for (const [resource, multiplier] of Object.entries(effects.resourceRates)) {
                // This would need to be implemented in the Resources module
                Resources.adjustRate(resource, multiplier);
            }
        }
        
        // Apply one-time resource changes
        if (effects.resources) {
            for (const [resource, amount] of Object.entries(effects.resources)) {
                Resources.add(resource, amount);
            }
        }
    }
    
    // Get current game day
    function getGameDay() {
        return Math.floor(Game.getTimePlayed() / (60 * 60 * 24)) + 1; // Convert seconds to days
    }
    
    // Trigger a random story bit for variety
    function triggerRandomStoryBit() {
        const randomStories = [
            "A guard mentions that Sulla's grass crown was woven from grasses and wildflowers from the battlefield where he saved his men.",
            "You overhear that before his military success, Sulla lived a life of poverty despite his patrician birth.",
            "Someone says that Sulla's rival Marius was once his commander and mentor before they became bitter enemies.",
            "A merchant claims that Sulla has strange prophetic dreams that guide his military decisions.",
            "There's a rumor that Sulla's face is marked with red blotches and scars, which some see as a sign of divine favor."
        ];
        
        const randomStory = randomStories[Math.floor(Math.random() * randomStories.length)];
        
        // Add as a minor news item
        addNewsItem({
            title: "Rumor About Sulla",
            content: randomStory,
            image: "sulla_portrait.svg"
        });
        
        // Queue for narrative display
        queueNarrativeElement({
            type: 'rumor',
            title: "Rumor About Sulla",
            content: randomStory,
            image: "sulla_portrait.svg"
        });
    }
    
    // Toggle narrative visibility
    function toggleNarrativeVisibility() {
        state.narrativeVisible = !state.narrativeVisible;
        UI.updateNarrativeVisibility(state.narrativeVisible);
        return state.narrativeVisible;
    }
    
    // Get state for saving
    function getState() {
        return {
            currentDay: state.currentDay,
            storyProgress: state.storyProgress,
            newsSystemUnlocked: state.newsSystemUnlocked,
            newsItems: state.newsItems,
            journalEntries: state.journalEntries,
            unlockedStoryElements: state.unlockedStoryElements,
            activeQuests: state.activeQuests,
            narrativeVisible: state.narrativeVisible
        };
    }
    
    // Load state
    function loadState(savedState) {
        if (!savedState) return;
        
        state.currentDay = savedState.currentDay || 1;
        state.storyProgress = savedState.storyProgress || 0;
        state.newsSystemUnlocked = savedState.newsSystemUnlocked || false;
        state.newsItems = savedState.newsItems || [];
        state.journalEntries = savedState.journalEntries || [];
        state.unlockedStoryElements = savedState.unlockedStoryElements || [];
        state.activeQuests = savedState.activeQuests || [];
        state.narrativeVisible = savedState.narrativeVisible !== undefined ? savedState.narrativeVisible : true;
        
        // Mark story beats as unlocked
        storyBeats.forEach(beat => {
            beat.unlocked = state.unlockedStoryElements.includes(beat.id);
        });
        
        // Update quest status
        quests.forEach(quest => {
            const activeIndex = state.activeQuests.indexOf(quest.id);
            quest.active = activeIndex !== -1;
            
            // We'd need additional saved state to track quest progress and completion
        });
    }
    
    // Public API
    return {
        init,
        checkProgression,
        addNewsItem,
        addJournalEntry,
        getStoryProgress: () => state.storyProgress,
        getNewsItems: () => state.newsItems,
        getJournalEntries: () => state.journalEntries,
        isNewsSystemUnlocked: () => state.newsSystemUnlocked,
        completeQuestStep,
        triggerRandomStoryBit,
        getCurrentNarrativeDisplay: () => state.currentNarrativeDisplay,
        isNarrativeVisible: () => state.narrativeVisible,
        toggleNarrativeVisibility,
        getState,
        loadState
    };
})();
