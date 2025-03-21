# Resource Management System

## Resource Types

### Primary Resources
1. **Silver Ore**
   - Main currency and progression resource
   - Collection rate: 1 per 10 seconds base rate
   - Storage capacity: 100 initially, upgradable
   - Uses: Trading, upgrades, bribes, freedom fund

2. **Food**
   - Survival necessity
   - Depletion rate: 1 unit per minute
   - Storage capacity: 120 initially (2 hours supply)
   - Sources: Rations, trading, special events
   - Quality tiers: Poor (1x), Standard (1.2x), Good (1.5x)

3. **Water**
   - Survival necessity
   - Depletion rate: 2 units per minute
   - Storage capacity: 240 initially (2 hours supply)
   - Sources: Mine springs, rations, rain collection
   - Quality tiers: Dirty (0.8x), Standard (1x), Clean (1.2x)

4. **Health**
   - Represents physical wellbeing
   - Maximum: 100 points
   - Regeneration: 1 point per minute when resting
   - Depletion: Hazards, overwork, poor food/water
   - Critical threshold: Below 20% triggers medical events

### Secondary Resources

5. **Tools**
   - Required for mining
   - Durability: 100 points
   - Degradation: 1 point per minute while mining
   - Repair cost: 10 silver ore per 10 durability
   - Quality tiers: Wooden, Iron, Steel, Silver-inlaid

6. **Medicine**
   - Used for healing and disease prevention
   - Effectiveness: 10 health points per unit
   - Sources: Trading, crafting, medical knowledge
   - Types: Herbal (basic), Roman (standard), Combined (advanced)

7. **Favor**
   - Represents relationships with different groups
   - Guard favor: Affects security and punishments
   - Slave favor: Affects cooperation and information
   - Administrator favor: Affects assignments and privileges
   - Decay rate: 1 point per day without interaction

8. **Knowledge**
   - Unlocks options and improves efficiency
   - Mining knowledge: Improves resource collection
   - Roman knowledge: Improves guard interactions
   - Tribal knowledge: Provides narrative context
   - Medical knowledge: Improves health management
   - Acquisition: Conversations, observations, events

## Resource Management Interface

### Main Dashboard
1. **Resource Counters**
   - Current/Maximum displays for all resources
   - Visual indicators for critical thresholds
   - Collection/depletion rate displays

2. **Status Indicators**
   - Health status with visual representation
   - Tool condition with durability meter
   - Current activity status (mining, resting, etc.)
   - Time of day and shift indicator

3. **Quick Actions**
   - Eat/Drink buttons with resource consumption
   - Rest button (stops mining, increases health regeneration)
   - Repair tools button with cost display
   - Trade button for quick resource exchanges

### Resource Flow Management

1. **Automatic Allocation**
   - Auto-eat toggle: Consumes food when below threshold
   - Auto-drink toggle: Consumes water when below threshold
   - Auto-repair toggle: Repairs tools when durability low
   - Efficiency settings: Prioritize survival vs. collection

2. **Resource Conversion**
   - Food preservation: Trade quantity for longevity
   - Water purification: Improve quality at quantity cost
   - Tool reinforcement: Sacrifice collection rate for durability
   - Health treatments: Convert medicine to health at different rates

3. **Storage Management**
   - Resource storage upgrades for each type
   - Hiding spots for valuable resources (risk/reward)
   - Shared storage with trusted slaves (multiplier effects)
   - Emergency reserves with access penalties

## Resource Economy

### Resource Generation

1. **Silver Ore Generation**
   - Base rate: 1 per 10 seconds
   - Click bonus: 1 per click
   - Skill multipliers: +2% per mining level
   - Tool multipliers: +50% per tool tier
   - Condition penalties: Health and tool status effects

2. **Food Acquisition**
   - Daily rations: 120 units (2 hours worth)
   - Trading: Variable rates based on events
   - Special assignments: Bonus food for difficult tasks
   - Foraging: Small amounts from above-ground assignments

3. **Water Acquisition**
   - Mine springs: 60 units per hour from specific locations
   - Rations: 120 units with daily food distribution
   - Collection: Gathering from seepage and rainfall
   - Trading: Limited availability from other slaves

4. **Health Management**
   - Rest: +1 health per minute (not mining)
   - Food quality: Up to +20% regeneration rate
   - Medicine: +10 health per unit consumed
   - Special locations: Healing spots with bonuses

### Resource Consumption

1. **Survival Costs**
   - Food: 1 unit per minute (higher during hard labor)
   - Water: 2 units per minute (higher in hot areas)
   - Health: Variable depletion based on activities
   - Tool durability: 1 point per minute while mining

2. **Upgrade Costs**
   - Tool upgrades: Exponential silver cost per tier
   - Living quarters: Silver + favor combinations
   - Skill training: Time + resource investments
   - Storage expansions: Linear scaling with capacity

3. **Social Costs**
   - Bribes: Silver for guard favor
   - Gifts: Resources for slave favor
   - Tributes: Quality items for administrator favor
   - Information: Knowledge exchanges with diminishing returns

## Resource Risk Management

### Resource Threats

1. **Confiscation**
   - Random guard inspections
   - Triggered by suspicious behavior
   - Affected by guard favor
   - Hiding mechanics to mitigate losses

2. **Theft**
   - Risk from other slaves
   - Probability based on visible wealth
   - Preventable through favor or security upgrades
   - Recovery options through confrontation or negotiation

3. **Spoilage**
   - Food degrades over time
   - Water contamination events
   - Medicine effectiveness reduction
   - Preventable through storage upgrades

4. **Resource Crises**
   - Mine flooding: Water abundance but tool damage
   - Supply shortages: Food/water scarcity events
   - Tool breakage: Sudden durability loss
   - Health emergencies: Rapid health depletion

### Risk Mitigation Strategies

1. **Resource Diversification**
   - Balanced storage of different resources
   - Multiple acquisition methods for each resource
   - Relationship networks spanning different groups
   - Skill development across various areas

2. **Security Measures**
   - Hiding spots for valuable resources
   - Trusted allies for shared protection
   - Guard relationships for preferential treatment
   - Strategic resource visibility management

3. **Emergency Protocols**
   - Crisis-specific response options
   - Resource conversion during shortages
   - Favor expenditure for emergency assistance
   - Knowledge application for alternative solutions

## Resource-Narrative Integration

### Resource-Triggered Events

1. **Wealth Thresholds**
   - 100 Silver: Guard attention increases
   - 500 Silver: Administrator takes notice
   - 1,000 Silver: Freedom planning becomes available
   - 5,000 Silver: Major story decision point unlocks

2. **Survival Challenges**
   - Food shortage: Narrative about frontier supply problems
   - Water contamination: Parallel to plague storyline
   - Health crisis: Medical knowledge exchange opportunities
   - Tool shortage: Connection to military resource allocation

3. **Favor Milestones**
   - Guard favor (75+): Access to frontier news
   - Slave favor (75+): Tribal background information
   - Administrator favor (75+): Political context from Rome
   - Combined high favor: Unique narrative opportunities

### Resource Management Consequences

1. **Survival Strategy Impact**
   - Selfish resource hoarding: Negative slave favor, narrative isolation
   - Generous sharing: Positive slave favor, community narrative threads
   - Efficient optimization: Faster progression, pragmatic storyline
   - Risk-taking: Higher failure rate but unique narrative opportunities

2. **Long-term Resource Choices**
   - Freedom fund priority: Narrative focus on escape planning
   - Knowledge priority: Narrative focus on understanding events
   - Favor priority: Narrative focus on relationships and politics
   - Balanced approach: Broader but less deep narrative exposure

## Resource System Implementation

### Data Structure

```javascript
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
```

### Resource Update Loop

```javascript
// Main resource update function (called every second)
function updateResources() {
  // Update silver based on mining status and modifiers
  if (player.status === "mining" && resources.tools.durability > 0) {
    const miningRate = calculateMiningRate();
    resources.silver.amount = Math.min(
      resources.silver.amount + miningRate,
      resources.silver.max
    );
    
    // Reduce tool durability while mining
    resources.tools.durability = Math.max(
      resources.tools.durability + resources.tools.rate,
      0
    );
  }
  
  // Update food and water (always consumed)
  resources.food.amount = Math.max(
    resources.food.amount + resources.food.rate,
    0
  );
  
  resources.water.amount = Math.max(
    resources.water.amount + resources.water.rate,
    0
  );
  
  // Update health based on conditions
  const healthRate = calculateHealthRate();
  resources.health.amount = Math.min(
    Math.max(resources.health.amount + healthRate, 0),
    resources.health.max
  );
  
  // Check for critical resource states
  checkResourceCrisis();
  
  // Update UI
  updateResourceDisplay();
  
  // Check for resource-based events
  checkResourceEvents();
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
  
  return rate;
}
```

### Resource Crisis System

```javascript
// Check for resource crises
function checkResourceCrisis() {
  // Health crisis
  if (resources.health.amount === 0) {
    triggerHealthCrisis();
  }
  
  // Food crisis
  if (resources.food.amount === 0) {
    applyStarvationEffects();
  }
  
  // Water crisis
  if (resources.water.amount === 0) {
    applyDehydrationEffects();
  }
  
  // Tool crisis
  if (resources.tools.durability === 0) {
    applyBrokenToolEffects();
  }
}

// Handle health crisis
function triggerHealthCrisis() {
  player.status = "infirmary";
  player.statusDuration = 3600; // 1 hour
  addLogMessage("You've collapsed from exhaustion and been taken to the infirmary.");
  triggerEvent("health_crisis");
}
```

## Resource Balancing Guidelines

1. **Time-Value Relationship**
   - 1 hour of passive play should yield ~360 silver
   - 1 hour of active play should yield ~720 silver
   - Basic upgrades should cost 1-2 hours of passive collection
   - Major upgrades should cost 5-8 hours of active collection

2. **Resource Ratio Guidelines**
   - Food cost: 60 silver per day (survival baseline)
   - Water cost: 30 silver per day (survival baseline)
   - Tool maintenance: 100 silver per day (full repairs)
   - Medicine: 50 silver per unit (health emergency insurance)

3. **Progression Pacing**
   - First tool upgrade: Day 1-2
   - Living quarters upgrade: Day 3-4
   - First major connection: Day 5-7
   - Freedom options appear: Day 14-21
   - End-game choices: Day 30-40

4. **Difficulty Scaling**
   - Resource costs increase by ~15% per tier
   - Resource threats increase by ~10% per week
   - Resource gains increase by ~8% per skill level
   - Crisis frequency increases during narrative turning points
