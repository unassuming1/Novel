# The Grass Crown: Idle Game Mechanics Design

## Core Game Loop

### Resources
1. **Silver Ore**: Primary resource gathered by mining
2. **Food**: Required to maintain energy and health
3. **Water**: Required to maintain health and prevent dehydration
4. **Tools**: Improve mining efficiency
5. **Knowledge**: Gained from stories and interactions, unlocks upgrades
6. **Favor**: Represents standing with overseers and other characters
7. **Health**: Decreases over time, must be maintained

### Primary Activities
1. **Mining**: Click/idle collection of silver ore
   - Auto-mining increases as game progresses
   - Different mine sections yield different amounts
   - Tool quality affects mining speed

2. **Resource Management**:
   - Allocate silver to purchase food, water, tools
   - Balance immediate needs vs. long-term investments
   - Trade resources with other slaves or guards

3. **Story Progression**:
   - News events trigger at specific resource milestones
   - Character interactions unlock based on favor and progress
   - Philosophical discoveries provide permanent bonuses

### Upgrades System
1. **Tool Upgrades**:
   - Basic Pick → Iron Pick → Steel Pick → Master's Pick
   - Each level increases mining efficiency

2. **Skill Upgrades**:
   - Mining Technique: Increases ore per click
   - Endurance: Reduces food/water consumption
   - Bartering: Better trade rates
   - Leadership: Improves helper efficiency

3. **Helper System**:
   - Recruit other slaves to auto-mine
   - Assign helpers to different tasks (mining, water collection, etc.)
   - Helpers require food and water to maintain

4. **Mine Expansion**:
   - Unlock new areas of the mine
   - Each area has unique resources and challenges
   - Deeper areas have higher risks but better rewards

## Progression System

### Experience Levels
1. **Novice Slave**: Basic mining, high resource consumption
2. **Experienced Miner**: Improved efficiency, access to better tools
3. **Trusted Worker**: Can lead small teams, access to restricted areas
4. **Skilled Craftsman**: Can create tools, better trading options
5. **Overseer's Favorite**: Special privileges, influence over other slaves

### Milestone Unlocks
1. **Better Living Quarters**: Improves health regeneration
2. **Access to Market**: Enables trading for special items
3. **Workshop Access**: Craft tools and items
4. **Message Network**: Receive news more frequently
5. **Private Stash**: Store resources safely

### Prestige System
- **Freedom Points**: Ultra-rare resource that persists through resets
- **Rebirth Option**: Start over with bonuses based on previous achievements
- **Legacy System**: Each playthrough adds to the mine's history

## Narrative Integration

### News System
- **News Board**: Updates with stories from the frontier
- **Messenger**: Character who delivers news at regular intervals
- **Impact System**: News affects resource availability and prices

### Character Interaction
- **Dialogue System**: Simple conversations with key characters
- **Favor System**: Build relationships to unlock benefits
- **Quest System**: Complete tasks for characters to earn rewards

### Story Unlocks
- **Scrolls**: Collectible items that reveal parts of Titus's story
- **Memories**: Triggered by specific actions, provide context
- **Philosophical Insights**: Provide permanent bonuses

## Game Economy

### Resource Balance
- **Input/Output Ratios**: Carefully balanced resource generation and consumption
- **Inflation Control**: Resource costs increase with player progress
- **Sink Mechanics**: Ways to spend excess resources for benefits

### Time Mechanics
- **Day/Night Cycle**: Different activities available at different times
- **Season System**: Affects resource availability
- **Event Calendar**: Special events based on Roman calendar

### Risk/Reward
- **Mine Hazards**: Random events that can damage health or tools
- **Guard Inspections**: Chance to lose resources if hiding contraband
- **Opportunity Investments**: Spend resources for chance at high returns

## User Interface Design

### Main Screen Elements
1. **Mine View**: Visual representation of current mining area
2. **Resource Panel**: Shows current resources and collection rates
3. **Upgrade Shop**: Access to available upgrades
4. **News Panel**: Shows recent news from the frontier
5. **Character Portraits**: Access to interactions with key characters

### Visual Progression
- Mine appearance changes as player progresses
- Character appearances change based on health and status
- Visual indicators of story progress (e.g., plague effects, seasonal changes)

### Notification System
- Important news highlighted with special effects
- Achievements pop up when completed
- Resource warnings when running low

## Technical Implementation Considerations

### State Management
- Save game state to localStorage
- Track multiple resource generation rates
- Maintain story progression flags

### Offline Progression
- Calculate resources gained while away
- Cap offline gains to encourage regular play
- Provide summary of events missed

### Performance Optimization
- Throttle update frequency for idle mechanics
- Batch DOM updates
- Lazy load assets for different game stages

## Balancing Philosophy

### Early Game (First Hour)
- Frequent small rewards
- Quick introduction to core mechanics
- Story elements introduced gradually

### Mid Game (Days 2-7)
- Longer upgrade cycles
- More strategic choices
- Regular story beats

### Late Game (Week 2+)
- Long-term goals
- Complex resource management
- Major story revelations

### Endgame
- Prestige mechanics
- Completionist goals
- Final narrative resolution
