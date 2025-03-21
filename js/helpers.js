// helpers.js - Utility functions for the game

/**
 * Format a number for display
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
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

/**
 * Format time for display
 * @param {number} hours - Time in hours
 * @returns {string} - Formatted time string
 */
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

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random float
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Check if an event should trigger based on probability
 * @param {number} probability - Probability between 0 and 1
 * @returns {boolean} - Whether the event should trigger
 */
function chance(probability) {
    return Math.random() < probability;
}

/**
 * Get a random element from an array
 * @param {Array} array - Array to get random element from
 * @returns {*} - Random element
 */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Create a throttled function that only executes once per specified interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle interval in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Create a debounced function that only executes after waiting
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Calculate exponential cost
 * @param {number} baseCost - Base cost
 * @param {number} count - Current count
 * @param {number} growthRate - Growth rate (default: 1.15)
 * @returns {number} - New cost
 */
function calculateExponentialCost(baseCost, count, growthRate = 1.15) {
    return Math.floor(baseCost * Math.pow(growthRate, count));
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if two objects are equal
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} - Whether the objects are equal
 */
function objectsEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Get the current game day based on time played
 * @param {number} timePlayed - Time played in seconds
 * @returns {number} - Current game day
 */
function getGameDay(timePlayed) {
    // 1 game day = 10 minutes real time
    const secondsPerGameDay = 600;
    return Math.floor(timePlayed / secondsPerGameDay) + 1;
}

/**
 * Get the current game time as a string
 * @param {number} timePlayed - Time played in seconds
 * @returns {string} - Current game time as a string
 */
function getGameTimeString(timePlayed) {
    const secondsPerGameDay = 600;
    const day = Math.floor(timePlayed / secondsPerGameDay) + 1;
    
    // Calculate time of day (24 hour cycle)
    const secondsInDay = timePlayed % secondsPerGameDay;
    const hourOfDay = Math.floor((secondsInDay / secondsPerGameDay) * 24);
    const minuteOfHour = Math.floor(((secondsInDay / secondsPerGameDay) * 24 * 60) % 60);
    
    return `Day ${day}, ${hourOfDay.toString().padStart(2, '0')}:${minuteOfHour.toString().padStart(2, '0')}`;
}
