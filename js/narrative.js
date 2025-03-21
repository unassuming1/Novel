// narrative.js - Story progression and narrative elements

const Narrative = (function() {
    // Story progression state
    const state = {
        currentDay: 1,
        storyProgress: 0,
        newsSystemUnlocked: false,
        newsItems: [],
        journalEntries: [],
        unlockedStoryElements: [],
        activeQuests: []
    };
    
    // Story beats definitions - key narrative moments that unlock as the game progresses
    const storyBeats = [
        {
            id: 'introduction',
            title: 'Arrival at the Mine',
            content: 'You arrive at the silver mine, shackled and exhausted from the journey. The overseer assigns you to the upper tunnels - the easiest work, but also the least productive. "Don\'t die in your first week," he grunts. "It\'s a waste of good chains."',
            trigger: { type: 'immediate' },
            unlocked: false
        },
        {
            id: 'first_silver',
            title: 'First Silver',
            content: 'You extract your first pieces of silver ore. Your hands are already blistered, but there\'s a small sense of accomplishment. A veteran miner notices your technique and shakes his head. "You\'ll break your back that way. Here, like this." His small advice makes the work slightly more bearable.',
            trigger: { type: 'resource', resource: 'silver', amount: 10 },
            unlocked: false
        },
        {
            id: 'grass_crown_news',
            title: 'News from the Frontier',
            content: 'During the evening meal, you overhear guards talking about a general named Titus Aelius Gallus who has been awarded the grass crown - Rome\'s highest military honor - for his victory against the Marcomanni tribes. The soldiers speak of him with reverence, though one mutters that the victory came at a terrible cost.',
            trigger: { type: 'resource', resource: 'silver', amount: 100 },
            unlocked: false,
            addNews: true
        },
        {
            id: 'overseer_story',
            title: 'The Overseer\'s Tale',
            content: 'The mine overseer, loosened by wine, reveals he once served in the legions under General Titus. "Strictest commander I ever had," he says, "but fair. He wouldn\'t ask men to do what he wouldn\'t do himself. Saved my life at the Danube crossing." He falls silent, lost in memory, then barks at everyone to get back to work.',
            trigger: { type: 'upgrade', upgradeId: 'overseer_favor' },
            unlocked: false,
            addNews: true
        },
        {
            id: 'plague_rumors',
            title: 'Whispers of Disease',
            content: 'New slaves arrive at the mine, bringing rumors of a strange sickness spreading through the empire. "They say it came from the East with returning soldiers," one explains. "Whole villages emptied. They call it the Antonine Plague." The overseers order the new arrivals quarantined in the lower tunnels.',
            trigger: { type: 'day', day: 10 },
            unlocked: false,
            addNews: true
        },
        {
            id: 'supply_reduction',
            title: 'Dwindling Supplies',
            content: 'The regular supply wagon arrives half-empty. The driver explains that military requisitions have priority - General Titus\'s forces on the frontier need resources to hold back the barbarian tribes. Your food ration is cut by a third. "Empire\'s at war," shrugs the overseer. "We all make sacrifices."',
            trigger: { type: 'day', day: 15 },
            unlocked: false,
            effects: { resourceRates: { food: -0.05 } },
            addNews: true
        },
        {
            id: 'political_intrigue',
            title: 'Political Machinations',
            content: 'A visiting official brings gossip from Rome. Apparently, a senator named Lucius Priscus is questioning General Titus\'s victories, calling them "exaggerated" and "costly failures dressed as success." The mine administrator seems troubled. "Politics," he spits. "Priscus wants Titus\'s command for one of his own puppets."',
            trigger: { type: 'day', day: 20 },
            unlocked: false,
            addNews: true
        },
        {
            id: 'winter_hardship',
            title: 'Harsh Winter',
            content: 'The winter turns brutal. Even deep in the mines, the cold seeps through. You hear that on the frontier, the Danube has frozen solid, allowing Marcomanni raiders to cross directly into Roman territory. General Titus\'s forces are fighting in waist-deep snow. In the mine, three slaves freeze to death in the outer tunnels overnight.',
            trigger: { type: 'day', day: 30 },
            unlocked: false,
            effects: { resourceRates: { health: -0.1 } },
            addNews: true
        },
        {
            id: 'plague_arrives',
            title: 'The Plague Reaches the Mine',
            content: 'The Antonine Plague arrives with a new shipment of slaves. Within days, a dozen miners show symptoms - high fever, rash, bloody cough. The sick are isolated in an abandoned tunnel, but it\'s clear containment is failing. The overseer looks grim. "Same on the frontier," he says. "General Titus lost a third of his men, not to swords but to this invisible enemy."',
            trigger: { type: 'day', day: 40 },
            unlocked: false,
            effects: { resourceRates: { health: -0.2 } },
            addNews: true
        },
        {
            id: 'emperor_frontier',
            title: 'The Emperor at the Front',
            content: 'Remarkable news arrives: Emperor Marcus Aurelius himself has traveled to the Danube frontier to support General Titus. "Never happened in my lifetime," marvels an old slave. "An emperor at the battlefront." The guards discuss what this means - some think it shows the dire situation, others believe it demonstrates the Emperor\'s faith in Titus.',
            trigger: { type: 'day', day: 50 },
            unlocked: false,
            addNews: true
        },
        {
            id: 'philosophical_text',
            title: 'The Emperor\'s Wisdom',
            content: 'A slave who serves in the administrator\'s house smuggles in scraps of parchment - copied fragments from a text the Emperor is writing. "Meditations," he calls them. The philosophical passages speak of enduring hardship, finding inner tranquility amid chaos, and the equality of all men\'s souls. You hide these treasured words beneath your sleeping mat.',
            trigger: { type: 'resource', resource: 'knowledge', amount: 10 },
            unlocked: false,
            effects: { resources: { knowledge: 5 } },
            addNews: true
        },
        {
            id: 'final_battle',
            title: 'The Decisive Battle',
            content: 'Word spreads like wildfire through the mine: General Titus has led a desperate stand against the largest Marcomanni force yet assembled. Against overwhelming odds, the Romans held their position on the frozen Danube. The battle lasted two days, and though casualties were severe, the barbarian alliance has shattered. For the first time in months, there\'s hope that the frontier will hold.',
            trigger: { type: 'day', day: 60 },
            unlocked: false,
            addNews: true
        },
        {
            id: 'emperor_death',
            title: 'The Emperor\'s Passing',
            content: 'Solemn news arrives from the frontier: Emperor Marcus Aurelius has died in camp, with General Titus at his bedside. The empire is in mourning. In the mine, even the overseers seem subdued. Work is halted for one day out of respect - an unprecedented occurrence. Rumors already swirl about the new Emperor Commodus and what his reign will bring.',
            trigger: { type: 'day', day: 70 },
            unlocked: false,
            addNews: true
        },
        {
            id: 'new_dawn',
            title: 'Changing Times',
            content: 'The first official proclamation from Emperor Commodus arrives at the mine. Policies are changing - military focus shifting away from the frontier, new administrators appointed. The mine overseer who served under Titus is reassigned. Before leaving, he tells you, "Titus said the grass crown was both his greatest honor and heaviest burden. I never understood until now." The empire is entering a new era, for better or worse.',
            trigger: { type: 'day', day: 80 },
            unlocked: false,
            addNews: true
        }
    ];
    
    // Quest definitions
    const quests = [
        {
            id: 'veteran_memories',
            title: 'Veteran\'s Memories',
            description: 'The old veteran who served under General Titus seems willing to share stories. Gain his trust to learn more about the frontier wars.',
            requirements: { characters: ['overseer'], favor: 3 },
            rewards: { knowledge: 5, favor: 2 },
            steps: [
                { description: 'Bring the veteran extra water rations', cost: { water: 5 } },
                { description: 'Listen to his stories of the Danube campaigns', time: 2 },
                { description: 'Find a small token to remind him of his service', special: 'find_token' }
            ],
            complete: false,
            active: false,
            currentStep: 0
        },
        {
            id: 'plague_medicine',
            title: 'Healing Hands',
            description: 'With the plague spreading, any medical knowledge is valuable. Learn basic treatments to help yourself and others.',
            requirements: { storyBeats: ['plague_arrives'], knowledge: 5 },
            rewards: { knowledge: 10, health: 20, favor: 5 },
            steps: [
                { description: 'Collect medicinal herbs from around the mine', time: 3 },
                { description: 'Learn treatment methods from the mine\'s medic', cost: { silver: 200 } },
                { description: 'Treat three sick miners', cost: { food: 10, water: 15 } }
            ],
            complete: false,
            active: false,
            currentStep: 0
        },
        {
            id: 'imperial_wisdom',
            title: 'Words of Marcus Aurelius',
            description: 'The Emperor\'s philosophical writings offer both wisdom and comfort in these harsh times.',
            requirements: { storyBeats: ['philosophical_text'], knowledge: 8 },
            rewards: { knowledge: 15, health: 10 },
            steps: [
                { description: 'Collect more fragments of the Emperor\'s writings', special: 'find_writings' },
                { description: 'Study the philosophical concepts', time: 5 },
                { description: 'Apply the stoic principles to your daily work', special: 'practice_stoicism' }
            ],
            complete: false,
            active: false,
            currentStep: 0
        }
    ];
    
    // Initialize narrative system
    function init() {
        // Trigger immediate story beats
        checkStoryProgression();
    }
    
    // Check for story progression
    function checkProgression() {
        checkStoryBeats();
        checkQuestAvailability();
        updateActiveQuests();
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
        state.storyProgress++;
        
        // Add to journal
        addJournalEntry(beat.title, beat.content);
        
        // Add to news if applicable
        if (beat.addNews && state.newsSystemUnlocked) {
            addNewsItem(beat.title, beat.content);
        }
        
        // Apply effects if any
        if (beat.effects) {
            applyStoryEffects(beat.effects);
        }
        
        // Add to unlocked story elements
        state.unlockedStoryElements.push(beat.id);
        
        // Show notification
        UI.showNotification(`New journal entry: ${beat.title}`, 'story');
    }
    
    // Apply story effects
    function applyStoryEffects(effects) {
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
    
    // Check for available quests
    function checkQuestAvailability() {
        quests.forEach(quest => {
            if (quest.complete || quest.active) return;
            
            let available = true;
            
            // Check requirements
            if (quest.requirements) {
                // Check character requirements
                if (quest.requirements.characters) {
                    for (const charId of quest.requirements.characters) {
                        const character = Characters.getCharacter(charId);
                        if (!character || !character.unlocked) {
                            available = false;
                            break;
                        }
                    }
                }
                
                // Check favor requirement
                if (quest.requirements.favor && Resources.get('favor') < quest.requirements.favor) {
                    available = false;
                }
                
                // Check knowledge requirement
                if (quest.requirements.knowledge && Resources.get('knowledge') < quest.requirements.knowledge) {
                    available = false;
                }
                
                // Check story beat requirements
                if (quest.requirements.storyBeats) {
                    for (const beatId of quest.requirements.storyBeats) {
                        if (!state.unlockedStoryElements.includes(beatId)) {
                            available = false;
                            break;
                        }
                    }
                }
            }
            
            if (available && !quest.active) {
                activateQuest(quest);
            }
        });
    }
    
    // Activate a quest
    function activateQuest(quest) {
        quest.active = true;
        state.activeQuests.push(quest.id);
        
        // Add journal entry
        addJournalEntry(`New Quest: ${quest.title}`, quest.description);
        
        // Show notification
        UI.showNotification(`New quest available: ${quest.title}`, 'quest');
    }
    
    // Update active quests
    function updateActiveQuests() {
        // This would check progress on active quests
        // For now, just a placeholder
    }
    
    // Advance a quest step
    function advanceQuest(questId) {
        const quest = quests.find(q => q.id === questId);
        
        if (!quest || !quest.active || quest.complete) {
            return false;
        }
        
        const currentStep = quest.steps[quest.currentStep];
        
        // Check if step can be completed
        if (currentStep.cost) {
            if (!Resources.canAfford(currentStep.cost)) {
                return false;
            }
            Resources.pay(currentStep.cost);
        }
        
        // Advance to next step
        quest.currentStep++;
        
        // Check if quest is complete
        if (quest.currentStep >= quest.steps.length) {
            completeQuest(quest);
        } else {
            // Update journal
            addJournalEntry(`Quest Update: ${quest.title}`, 
                `Completed: ${currentStep.description}\nNext: ${quest.steps[quest.currentStep].description}`);
            
            // Show notification
            UI.showNotification(`Quest step completed: ${quest.title}`, 'quest');
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
        
        // Add journal entry
        addJournalEntry(`Quest Completed: ${quest.title}`, 
            `You have completed the quest "${quest.title}". ${Object.entries(quest.rewards).map(([resource, amount]) => 
                `Gained ${amount} ${Resources.getResourceInfo(resource).name}`).join(', ')}`);
        
        // Show notification
        UI.showNotification(`Quest completed: ${quest.title}`, 'quest');
    }
    
    // Add a journal entry
    function addJournalEntry(title, content) {
        const entry = {
            id: generateId(),
            title,
            content,
            timestamp: Date.now(),
            gameDay: getGameDay()
        };
        
        state.journalEntries.push(entry);
    }
    
    // Add a news item
    function addNewsItem(title, content) {
        if (!state.newsSystemUnlocked) return;
        
        const newsItem = {
            id: generateId(),
            title,
            content,
            timestamp: Date.now(),
            gameDay: getGameDay(),
            read: false
        };
        
        state.newsItems.push(newsItem);
    }
    
    // Unlock the news system
    function unlockNewsSystem() {
        state.newsSystemUnlocked = true;
        
        // Add initial news items for already unlocked story beats
        storyBeats.forEach(beat => {
            if (beat.unlocked && beat.addNews) {
                addNewsItem(beat.title, beat.content);
            }
        });
        
        // Show notification
        UI.showNotification('You can now receive news from the frontier!', 'system');
    }
    
    // Trigger a random story bit
    function triggerRandomStoryBit() {
        // This would be called when the player finds something special
        // For now, just a placeholder that adds a small journal entry
        
        const storyBits = [
            {
                title: 'A Moment of Reflection',
                content: 'During a brief rest, you notice sunlight filtering through a crack in the ceiling. For just a moment, the harsh reality of the mine fades, and you remember what it was like to be free.'
            },
            {
                title: 'Overheard Conversation',
                content: 'Guards talking nearby mention General Titus\'s name. "They say he sleeps in the same conditions as his men," one says. "No special tent or meals." The other scoffs, "That\'s why soldiers love him and politicians hate him."'
            },
            {
                title: 'Hidden Message',
                content: 'You find a message scratched into the mine wall, hidden behind a loose rock: "Strength is not in the body, but in the spirit. -M"'
            },
            {
                title: 'The Old Slave\'s Wisdom',
                content: 'An elderly slave shares his secret for survival: "Find one beautiful thing each day, no matter how small. A drop of water, a memory, even just a deeper breath. That\'s how you keep your soul alive."'
            }
        ];
        
        const storyBit = randomElement(storyBits);
        addJournalEntry(storyBit.title, storyBit.content);
        
        // Show notification
        UI.showNotification(`New journal entry: ${storyBit.title}`, 'story');
    }
    
    // Get current game day
    function getGameDay() {
        return Math.floor(Game.getTimePlayed() / (24 * 60 * 60)) + 1;
    }
    
    // Generate a unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Get all journal entries
    function getJournalEntries() {
        return [...state.journalEntries];
    }
    
    // Get all news items
    function getNewsItems() {
        return [...state.newsItems];
    }
    
    // Get active quests
    function getActiveQuests() {
        return quests.filter(quest => quest.active);
    }
    
    // Get narrative state for saving
    function getState() {
        return {
            storyProgress: state.storyProgress,
            newsSystemUnlocked: state.newsSystemUnlocked,
            newsItems: state.newsItems,
            journalEntries: state.journalEntries,
            unlockedStoryElements: state.unlockedStoryElements,
            activeQuests: state.activeQuests,
            storyBeats: storyBeats.map(beat => ({
                id: beat.id,
                unlocked: beat.unlocked
            })),
            quests: quests.map(quest => ({
                id: quest.id,
                active: quest.active,
                complete: quest.complete,
                currentStep: quest.currentStep
            }))
        };
    }
    
    // Load narrative state
    function loadState(savedState) {
        if (!savedState) return;
        
        state.storyProgress = savedState.storyProgress || 0;
        state.newsSystemUnlocked = savedState.newsSystemUnlocked || false;
        state.newsItems = savedState.newsItems || [];
        state.journalEntries = savedState.journalEntries || [];
        state.unlockedStoryElements = savedState.unlockedStoryElements || [];
        state.activeQuests = savedState.activeQuests || [];
        
        // Restore story beats state
        if (savedState.storyBeats) {
            savedState.storyBeats.forEach(savedBeat => {
                const beat = storyBeats.find(b => b.id === savedBeat.id);
                if (beat) {
                    beat.unlocked = savedBeat.unlocked;
                }
            });
        }
        
        // Restore quests state
        if (savedState.quests) {
            savedState.quests.forEach(savedQuest => {
                const quest = quests.find(q => q.id === savedQuest.id);
                if (quest) {
                    quest.active = savedQuest.active;
                    quest.complete = savedQuest.complete;
                    quest.currentStep = savedQuest.currentStep;
                }
            });
        }
    }
    
    // Public API
    return {
        init,
        checkProgression,
        addJournalEntry,
        addNewsItem,
        unlockNewsSystem,
        triggerRandomStoryBit,
        getJournalEntries,
        getNewsItems,
        getActiveQuests,
        advanceQuest,
        getState,
        loadState
    };
})();
