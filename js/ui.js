// ui.js - User interface management

const UI = (function() {
    // Cache DOM elements
    let elements = {};
    
    // Initialize UI
    function init() {
        cacheElements();
        createResourceCounters();
        updateResourceDisplay();
        
        // Initial tab - only call after elements are cached
        if (elements.tabButtons && elements.tabPanels) {
            switchTab('upgrades');
        } else {
            console.error('Tab elements not properly cached');
            // Fallback: manually set the upgrades tab as active
            const upgradesTab = document.getElementById('upgrades-tab');
            if (upgradesTab) {
                upgradesTab.classList.add('active');
            }
        }
    }
    
    // Cache frequently used DOM elements
    function cacheElements() {
        elements = {
            resourceDisplay: document.getElementById('resource-display'),
            mineClickArea: document.getElementById('mine-click-area'),
            currentActivity: document.getElementById('current-activity'),
            progressIndicators: document.getElementById('progress-indicators'),
            helperDisplay: document.getElementById('helper-display'),
            availableUpgrades: document.getElementById('available-upgrades'),
            newsFeed: document.getElementById('news-feed'),
            characterList: document.getElementById('character-list'),
            journalEntries: document.getElementById('journal-entries'),
            statusMessages: document.getElementById('status-messages'),
            modalContainer: document.getElementById('modal-container'),
            modalContent: document.getElementById('modal-content'),
            notificationArea: document.getElementById('notification-area'),
            tabButtons: document.querySelectorAll('.tab-button'),
            tabPanels: document.querySelectorAll('.tab-panel')
        };
    }
    
    // Create resource counters
    function createResourceCounters() {
        elements.resourceDisplay.innerHTML = '';
        
        const resourceTypes = ['silver', 'food', 'water', 'tools', 'knowledge', 'favor', 'health'];
        
        resourceTypes.forEach(type => {
            const resourceInfo = Resources.getResourceInfo(type);
            
            const counter = document.createElement('div');
            counter.className = 'resource-counter';
            counter.id = `${type}-counter`;
            
            const icon = document.createElement('img');
            icon.className = 'resource-icon';
            icon.src = `assets/images/icons/${resourceInfo.icon}`;
            icon.alt = resourceInfo.name;
            
            const value = document.createElement('span');
            value.className = 'resource-value';
            value.id = `${type}-value`;
            value.textContent = '0';
            
            const rate = document.createElement('span');
            rate.className = 'resource-rate';
            rate.id = `${type}-rate`;
            
            counter.appendChild(icon);
            counter.appendChild(value);
            counter.appendChild(rate);
            
            elements.resourceDisplay.appendChild(counter);
        });
    }
    
    // Update the UI
    function update() {
        updateResourceDisplay();
        updateCurrentActivity();
        updateHelperDisplay();
        
        // Update active tab content
        const activeTab = document.querySelector('.tab-panel.active');
        if (activeTab) {
            const tabId = activeTab.id;
            
            switch (tabId) {
                case 'upgrades-tab':
                    updateUpgradesTab();
                    break;
                case 'news-tab':
                    updateNewsTab();
                    break;
                case 'characters-tab':
                    updateCharactersTab();
                    break;
                case 'journal-tab':
                    updateJournalTab();
                    break;
            }
        }
    }
    
    // Update resource display
    function updateResourceDisplay() {
        const resourceTypes = ['silver', 'food', 'water', 'tools', 'knowledge', 'favor', 'health'];
        
        resourceTypes.forEach(type => {
            const value = Resources.get(type);
            const rate = Resources.getRate(type);
            
            const valueElement = document.getElementById(`${type}-value`);
            const rateElement = document.getElementById(`${type}-rate`);
            
            if (valueElement) {
                valueElement.textContent = formatNumber(value);
            }
            
            if (rateElement) {
                if (rate !== 0) {
                    const sign = rate > 0 ? '+' : '';
                    rateElement.textContent = ` (${sign}${formatNumber(rate)}/s)`;
                    rateElement.className = `resource-rate ${rate > 0 ? 'positive' : 'negative'}`;
                } else {
                    rateElement.textContent = '';
                }
            }
        });
    }
    
    // Update current activity display
    function updateCurrentActivity() {
        // This would be updated based on what the player is currently doing
        // For now, just a placeholder
        elements.currentActivity.textContent = 'Mining silver in the depths of the Roman mine...';
    }
    
    // Update helper display
    function updateHelperDisplay() {
        // This would show active helpers/workers
        // Placeholder for now
        elements.helperDisplay.innerHTML = '<div class="helper-card">No helpers yet</div>';
    }
    
    // Update upgrades tab
    function updateUpgradesTab() {
        const availableUpgrades = Upgrades.getAvailable();
        
        if (availableUpgrades.length === 0) {
            elements.availableUpgrades.innerHTML = '<p>No upgrades available yet.</p>';
            return;
        }
        
        elements.availableUpgrades.innerHTML = '';
        
        availableUpgrades.forEach(upgrade => {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-item';
            
            const canAfford = Resources.canAfford(upgrade.cost);
            
            upgradeElement.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <div class="upgrade-cost">
                    ${Object.entries(upgrade.cost).map(([resource, amount]) => 
                        `<span class="${Resources.get(resource) >= amount ? 'can-afford' : 'cannot-afford'}">
                            ${Resources.getResourceInfo(resource).name}: ${formatNumber(amount)}
                        </span>`
                    ).join(', ')}
                </div>
                <button class="upgrade-button" data-id="${upgrade.id}" ${canAfford ? '' : 'disabled'}>
                    ${canAfford ? 'Purchase' : 'Cannot Afford'}
                </button>
            `;
            
            elements.availableUpgrades.appendChild(upgradeElement);
        });
        
        // Add event listeners to upgrade buttons
        const upgradeButtons = elements.availableUpgrades.querySelectorAll('.upgrade-button');
        upgradeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const upgradeId = this.getAttribute('data-id');
                Upgrades.purchase(upgradeId);
                updateUpgradesTab(); // Refresh after purchase
                update(); // Update all UI
            });
        });
    }
    
    // Update news tab
    function updateNewsTab() {
        const newsItems = Narrative.getNewsItems();
        
        if (newsItems.length === 0) {
            elements.newsFeed.innerHTML = '<p>No news from the frontier yet.</p>';
            return;
        }
        
        elements.newsFeed.innerHTML = '';
        
        // Sort news by date, newest first
        const sortedNews = [...newsItems].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedNews.forEach(news => {
            const newsElement = document.createElement('div');
            newsElement.className = 'news-item';
            
            const date = new Date(news.timestamp);
            const dateString = `Day ${Math.floor(Game.getTimePlayed() / (24 * 60 * 60))}`;
            
            newsElement.innerHTML = `
                <div class="news-header">
                    <h3>${news.title}</h3>
                    <span class="news-date">${dateString}</span>
                </div>
                <p>${news.content}</p>
            `;
            
            elements.newsFeed.appendChild(newsElement);
        });
    }
    
    // Update characters tab
    function updateCharactersTab() {
        const characters = Characters.getAll();
        
        if (Object.keys(characters).length === 0) {
            elements.characterList.innerHTML = '<p>You haven\'t met anyone noteworthy yet.</p>';
            return;
        }
        
        elements.characterList.innerHTML = '';
        
        Object.values(characters).forEach(character => {
            if (!character.unlocked) return;
            
            const characterElement = document.createElement('div');
            characterElement.className = 'character-card';
            
            characterElement.innerHTML = `
                <div class="character-portrait">
                    <img src="assets/images/characters/${character.portrait}" alt="${character.name}">
                </div>
                <div class="character-info">
                    <h3>${character.name}</h3>
                    <p class="character-role">${character.role}</p>
                    <p>${character.description}</p>
                    <div class="character-relationship">
                        Relationship: <span class="relationship-level">${character.relationshipLevel}</span>
                    </div>
                </div>
            `;
            
            elements.characterList.appendChild(characterElement);
        });
    }
    
    // Update journal tab
    function updateJournalTab() {
        const journalEntries = Narrative.getJournalEntries();
        
        if (journalEntries.length === 0) {
            elements.journalEntries.innerHTML = '<p>Your journal is empty. Record your experiences as you work in the mine.</p>';
            return;
        }
        
        elements.journalEntries.innerHTML = '';
        
        // Sort entries by date, newest first
        const sortedEntries = [...journalEntries].sort((a, b) => b.timestamp - a.timestamp);
        
        sortedEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            
            const date = new Date(entry.timestamp);
            const dateString = `Day ${Math.floor(entry.gameDay)}`;
            
            entryElement.innerHTML = `
                <div class="entry-header">
                    <h3>${entry.title}</h3>
                    <span class="entry-date">${dateString}</span>
                </div>
                <p>${entry.content}</p>
            `;
            
            elements.journalEntries.appendChild(entryElement);
        });
    }
    
    // Switch active tab
    function switchTab(tabName) {
        // Update tab buttons
        elements.tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update tab panels
        elements.tabPanels.forEach(panel => {
            if (panel.id === `${tabName}-tab`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        // Update the newly active tab content
        update();
    }
    
    // Show click animation
    function showClickAnimation(x, y) {
        const animation = document.createElement('div');
        animation.className = 'click-animation';
        animation.style.left = `${x}px`;
        animation.style.top = `${y}px`;
        
        document.body.appendChild(animation);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(animation);
        }, 1000);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        elements.notificationArea.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                elements.notificationArea.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Show modal
    function showModal(content) {
        elements.modalContent.innerHTML = content;
        elements.modalContainer.classList.remove('hidden');
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', hideModal);
        
        elements.modalContent.appendChild(closeButton);
    }
    
    // Hide modal
    function hideModal() {
        elements.modalContainer.classList.add('hidden');
    }
    
    // Show options modal
    function showOptionsModal() {
        const content = `
            <h2>Game Options</h2>
            <div class="options-container">
                <div class="option-group">
                    <h3>Audio</h3>
                    <label>
                        <input type="checkbox" id="option-sound-effects" checked>
                        Sound Effects
                    </label>
                    <label>
                        <input type="checkbox" id="option-music" checked>
                        Background Music
                    </label>
                    <div class="volume-control">
                        <span>Volume:</span>
                        <input type="range" id="option-volume" min="0" max="100" value="50">
                    </div>
                </div>
                <div class="option-group">
                    <h3>Display</h3>
                    <label>
                        <input type="checkbox" id="option-animations" checked>
                        Show Animations
                    </label>
                    <label>
                        <input type="checkbox" id="option-notifications" checked>
                        Show Notifications
                    </label>
                </div>
                <div class="option-group">
                    <h3>Game</h3>
                    <button id="reset-game-button">Reset Game</button>
                    <p class="warning">Warning: This will delete all progress!</p>
                </div>
            </div>
        `;
        
        showModal(content);
        
        // Add event listener for reset button
        document.getElementById('reset-game-button').addEventListener('click', function() {
            if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
                SaveManager.resetGame();
                location.reload();
            }
        });
    }
    
    // Show offline progress modal
    function showOfflineProgressModal(progress) {
        const content = `
            <h2>Welcome Back!</h2>
            <p>You were away for ${formatTime(progress.time)}.</p>
            <div class="offline-progress">
                <h3>While you were away:</h3>
                <ul>
                    <li>Mined ${formatNumber(progress.silver)} silver</li>
                    <li>Consumed ${formatNumber(progress.food)} food</li>
                    <li>Consumed ${formatNumber(progress.water)} water</li>
                </ul>
            </div>
        `;
        
        showModal(content);
    }
    
    // Show game over modal
    function showGameOverModal() {
        const content = `
            <h2>Game Over</h2>
            <p>You have died in the silver mines of Rome.</p>
            <p>You survived for ${formatTime(Game.getTimePlayed())}.</p>
            <button id="restart-game-button">Start New Game</button>
        `;
        
        showModal(content);
        
        // Add event listener for restart button
        document.getElementById('restart-game-button').addEventListener('click', function() {
            SaveManager.resetGame();
            location.reload();
        });
    }
    
    // Format number for display
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else if (Number.isInteger(num)) {
            return num.toString();
        } else {
            return num.toFixed(1);
        }
    }
    
    // Format time for display
    function formatTime(hours) {
        if (hours < 1) {
            return Math.floor(hours * 60) + ' minutes';
        } else if (hours < 24) {
            return Math.floor(hours) + ' hours, ' + Math.floor((hours % 1) * 60) + ' minutes';
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = Math.floor(hours % 24);
            return days + ' days, ' + remainingHours + ' hours';
        }
    }
    
    // Public API
    return {
        init,
        update,
        switchTab,
        showClickAnimation,
        showNotification,
        showModal,
        hideModal,
        showOptionsModal,
        showOfflineProgressModal,
        showGameOverModal
    };
})();
