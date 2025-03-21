// characters.js - Character system for the game

const Characters = (function() {
    // Character definitions
    const characterDefinitions = [
        {
            id: 'overseer',
            name: 'Lucius Severus',
            role: 'Mine Overseer',
            description: 'A gruff veteran who once served under General Titus. Despite his harsh exterior, he maintains a sense of fairness unusual for his position.',
            portrait: 'overseer.png',
            relationshipLevel: 'Neutral',
            dialogues: [
                {
                    id: 'intro',
                    text: "Don't expect special treatment, slave. But work hard and follow orders, and you'll survive longer than most.",
                    requirements: {}
                },
                {
                    id: 'military_past',
                    text: "Yes, I served with General Titus. Ten years on the frontier. The man's a true Roman - strict but fair. He saved my life at the Danube crossing when barbarians ambushed our unit.",
                    requirements: { relationshipLevel: 'Friendly' }
                },
                {
                    id: 'frontier_news',
                    text: "News from the frontier isn't good. The Marcomanni are pressing hard, and now this plague... Titus is fighting two enemies at once. The Senate doesn't understand what it's like out there.",
                    requirements: { relationshipLevel: 'Friendly', storyBeats: ['plague_rumors'] }
                },
                {
                    id: 'emperor_visit',
                    text: "Emperor Marcus Aurelius himself has gone to the frontier. Unprecedented. I served under him too, briefly. A philosopher on the throne... but don't mistake his thoughtfulness for weakness.",
                    requirements: { relationshipLevel: 'Trusted', storyBeats: ['emperor_frontier'] }
                }
            ],
            unlocked: false
        },
        {
            id: 'messenger',
            name: 'Cassius',
            role: 'Imperial Messenger',
            description: 'A quick-witted courier who travels between Rome, the frontier, and the provinces. His position gives him access to information from across the empire.',
            portrait: 'messenger.png',
            relationshipLevel: 'Neutral',
            dialogues: [
                {
                    id: 'intro',
                    text: "You're interested in news? Most slaves only care about their next meal. I travel all over - Rome, the frontier, and everywhere between. For a bit of silver, I might share what I hear.",
                    requirements: {}
                },
                {
                    id: 'titus_reputation',
                    text: "General Titus? His men would die for him. The Senate? Different story. Senator Priscus especially - keeps questioning Titus's victories, calling them 'pyrrhic' and 'wasteful.' Politics is as dangerous as the battlefield.",
                    requirements: { relationshipLevel: 'Friendly' }
                },
                {
                    id: 'plague_spread',
                    text: "The plague is everywhere now. Started with returning soldiers from the eastern campaigns. I've seen villages where half the people are dead or dying. The frontier camps have it worst - men packed together, perfect for spreading sickness.",
                    requirements: { relationshipLevel: 'Friendly', storyBeats: ['plague_arrives'] }
                },
                {
                    id: 'emperor_writings',
                    text: "The Emperor writes constantly - philosophical reflections, they say. I glimpsed him once at the frontier camp, writing by lamplight while generals waited for orders. Strange man, but respected. Some of his writings circulate among the educated.",
                    requirements: { relationshipLevel: 'Trusted', storyBeats: ['emperor_frontier'] }
                }
            ],
            unlocked: false
        },
        {
            id: 'veteran_slave',
            name: 'Demetrius',
            role: 'Veteran Mine Slave',
            description: 'An elderly Greek who has survived the mines for over a decade. His knowledge of the mine\'s operation and survival techniques is unmatched.',
            portrait: 'veteran_slave.png',
            relationshipLevel: 'Neutral',
            dialogues: [
                {
                    id: 'intro',
                    text: "New, are you? Listen carefully if you want to live. Drink when water's offered, even if you're not thirsty. Save half your food ration for later. And never, ever show weakness to the guards.",
                    requirements: {}
                },
                {
                    id: 'survival_tips',
                    text: "Mining technique matters. Strike at this angle, see? Saves your strength, gets more silver. The overseers don't care how you do it as long as you meet your quota. Work smarter, not harder.",
                    requirements: { relationshipLevel: 'Friendly' }
                },
                {
                    id: 'mine_secrets',
                    text: "There are hidden places in the mine where you can rest unseen. Small cavities behind loose rocks, abandoned tunnels they've forgotten about. I'll show you some, but keep them secret. They've saved my life during punishments.",
                    requirements: { relationshipLevel: 'Trusted' }
                },
                {
                    id: 'empire_perspective',
                    text: "I've been here through three emperors now. Hadrian, Antoninus Pius, now Marcus Aurelius. Down here, it hardly matters who wears the purple. The mine remains, and so do we, forgotten by Rome until they need more silver for their wars.",
                    requirements: { relationshipLevel: 'Trusted', storyBeats: ['emperor_frontier'] }
                }
            ],
            unlocked: true
        },
        {
            id: 'medicus',
            name: 'Atticus',
            role: 'Mine Medicus',
            description: 'A former military medic now assigned to keep the slaves alive enough to work. Despite his circumstances, he maintains his healer\'s oath.',
            portrait: 'medicus.png',
            relationshipLevel: 'Neutral',
            dialogues: [
                {
                    id: 'intro',
                    text: "Another injured worker? Let me see. Hmm, not too deep. Hold still... There. Keep it clean, if that's even possible down here. Come back if it festers.",
                    requirements: {}
                },
                {
                    id: 'medical_advice',
                    text: "Prevention is better than treatment. Tear a strip from your tunic and wrap your hands before mining. Drink boiled water when possible. And that moss that grows near the water channels? It fights infection if you chew it.",
                    requirements: { relationshipLevel: 'Friendly' }
                },
                {
                    id: 'plague_insights',
                    text: "This plague is unlike anything I've seen. High fever, rash that turns to pustules, then the coughing of blood. Once those symptoms appear, few survive. Keep your distance from the sick and cover your mouth with damp cloth.",
                    requirements: { relationshipLevel: 'Friendly', storyBeats: ['plague_arrives'] }
                },
                {
                    id: 'philosophical_healing',
                    text: "I served as a medic in the legions before being assigned here. The Emperor's stoic philosophy actually has medical merit. The mind affects the body. Those who maintain hope and purpose recover faster than those who surrender to despair.",
                    requirements: { relationshipLevel: 'Trusted', storyBeats: ['philosophical_text'] }
                }
            ],
            unlocked: false
        }
    ];
    
    // Current characters state
    let characters = {};
    
    // Initialize characters
    function init() {
        characterDefinitions.forEach(char => {
            characters[char.id] = {...char};
        });
    }
    
    // Get all characters
    function getAll() {
        return {...characters};
    }
    
    // Get a specific character
    function getCharacter(characterId) {
        return characters[characterId];
    }
    
    // Unlock a character
    function unlock(characterId) {
        if (!characters[characterId]) {
            console.error(`Character "${characterId}" not found`);
            return false;
        }
        
        characters[characterId].unlocked = true;
        
        // Add journal entry
        Narrative.addJournalEntry(
            `New Contact: ${characters[characterId].name}`,
            `You've met ${characters[characterId].name}, ${characters[characterId].role.toLowerCase()}. ${characters[characterId].description}`
        );
        
        // Show notification
        UI.showNotification(`New character met: ${characters[characterId].name}`, 'character');
        
        return true;
    }
    
    // Improve relationship with a character
    function improveRelationship(characterId) {
        if (!characters[characterId] || !characters[characterId].unlocked) {
            return false;
        }
        
        const character = characters[characterId];
        
        // Simple relationship progression
        switch (character.relationshipLevel) {
            case 'Neutral':
                character.relationshipLevel = 'Friendly';
                break;
            case 'Friendly':
                character.relationshipLevel = 'Trusted';
                break;
            case 'Trusted':
                character.relationshipLevel = 'Loyal';
                break;
            default:
                return false; // Already at max or unknown level
        }
        
        // Add journal entry
        Narrative.addJournalEntry(
            `Improved Relationship: ${character.name}`,
            `Your relationship with ${character.name} has improved to ${character.relationshipLevel}.`
        );
        
        // Show notification
        UI.showNotification(`Relationship improved with ${character.name}`, 'character');
        
        return true;
    }
    
    // Get available dialogues for a character
    function getAvailableDialogues(characterId) {
        if (!characters[characterId] || !characters[characterId].unlocked) {
            return [];
        }
        
        const character = characters[characterId];
        
        return character.dialogues.filter(dialogue => {
            // Check relationship level requirement
            if (dialogue.requirements.relationshipLevel) {
                const levels = ['Neutral', 'Friendly', 'Trusted', 'Loyal'];
                const requiredLevel = levels.indexOf(dialogue.requirements.relationshipLevel);
                const currentLevel = levels.indexOf(character.relationshipLevel);
                
                if (currentLevel < requiredLevel) {
                    return false;
                }
            }
            
            // Check story beat requirements
            if (dialogue.requirements.storyBeats) {
                for (const beatId of dialogue.requirements.storyBeats) {
                    if (!Narrative.isStoryBeatUnlocked(beatId)) {
                        return false;
                    }
                }
            }
            
            return true;
        });
    }
    
    // Talk to a character
    function talkTo(characterId, dialogueId) {
        if (!characters[characterId] || !characters[characterId].unlocked) {
            return null;
        }
        
        const character = characters[characterId];
        const dialogue = character.dialogues.find(d => d.id === dialogueId);
        
        if (!dialogue) {
            return null;
        }
        
        // Check if this dialogue is available
        const availableDialogues = getAvailableDialogues(characterId);
        if (!availableDialogues.some(d => d.id === dialogueId)) {
            return null;
        }
        
        // Small chance to improve relationship
        if (Math.random() < 0.2) {
            improveRelationship(characterId);
        }
        
        // Small chance to gain knowledge
        if (Math.random() < 0.3) {
            Resources.add('knowledge', 1);
            UI.showNotification('You gained a bit of knowledge from the conversation', 'resource');
        }
        
        return dialogue.text;
    }
    
    // Get helper count (for resource consumption calculations)
    function getHelperCount() {
        // This would be implemented to count active helpers/workers
        // For now, just a placeholder
        return 0;
    }
    
    // Get character state for saving
    function getState() {
        const state = {};
        
        for (const [id, character] of Object.entries(characters)) {
            state[id] = {
                unlocked: character.unlocked,
                relationshipLevel: character.relationshipLevel
            };
        }
        
        return state;
    }
    
    // Load character state
    function loadState(savedState) {
        if (!savedState) return;
        
        for (const [id, state] of Object.entries(savedState)) {
            if (characters[id]) {
                characters[id].unlocked = state.unlocked;
                characters[id].relationshipLevel = state.relationshipLevel;
            }
        }
    }
    
    // Public API
    return {
        init,
        getAll,
        getCharacter,
        unlock,
        improveRelationship,
        getAvailableDialogues,
        talkTo,
        getHelperCount,
        getState,
        loadState
    };
})();
