// Store simulation data
const simulationData = {
    users: {},
    groups: {},
    companies: {},
    totalEvents: 0,
    firstSeen: null,
    lastSeen: null,
    previousPeriodEvents: 0,
    currentPeriodEvents: 0
};

// Event types to simulate
const eventTypes = [
    'Page View', 
    'Button Click', 
    'Form Submit',
    'Video Play',
    'Sign Up',
    'Login',
    'Purchase',
    'Feature Used',
    'Account Created',
    'Feedback Submitted'
];

// DOM Elements
const userTypeSelect = document.getElementById('userType');
const entityIdInput = document.getElementById('entityId');
const generateIdButton = document.getElementById('generateId');
const performEventButton = document.getElementById('performEvent');
const identifyButton = document.getElementById('identify');
const eventLogList = document.getElementById('eventLog');

// Metric displays
const totalEventsDisplay = document.getElementById('totalEvents');
const activeDaysDisplay = document.getElementById('activeDays');
const firstSeenDisplay = document.getElementById('firstSeen');
const lastSeenDisplay = document.getElementById('lastSeen');
const usageTrendDisplay = document.getElementById('usageTrend');
const totalSeatsDisplay = document.getElementById('totalSeats');
const activeSeatsDisplay = document.getElementById('activeSeats');

// Generate a random ID
function generateRandomId() {
    return Math.random().toString(36).substring(2, 10);
}

// Format date for display
function formatDate(date) {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
}

// Update metrics displays
function updateMetrics() {
    // Count users, groups, companies
    const userCount = Object.keys(simulationData.users).length;
    const groupCount = Object.keys(simulationData.groups).length;
    const companyCount = Object.keys(simulationData.companies).length;
    
    // Count active entities (had events in the last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
    let activeUsers = 0;
    let activeGroups = 0;
    let activeCompanies = 0;
    
    // Count active users
    for (const userId in simulationData.users) {
        if (simulationData.users[userId].lastSeen >= thirtyDaysAgo) {
            activeUsers++;
        }
    }
    
    // Count active groups
    for (const groupId in simulationData.groups) {
        if (simulationData.groups[groupId].lastSeen >= thirtyDaysAgo) {
            activeGroups++;
        }
    }
    
    // Count active companies
    for (const companyId in simulationData.companies) {
        if (simulationData.companies[companyId].lastSeen >= thirtyDaysAgo) {
            activeCompanies++;
        }
    }
    
    // Calculate usage trend
    let usageTrend = 0;
    if (simulationData.previousPeriodEvents > 0) {
        usageTrend = ((simulationData.currentPeriodEvents - simulationData.previousPeriodEvents) / simulationData.previousPeriodEvents) * 100;
    }
    
    // Update displays
    totalEventsDisplay.textContent = simulationData.totalEvents;
    
    // Calculate active days for current user type and ID
    const type = userTypeSelect.value;
    const id = entityIdInput.value;
    let activeDays = 0;
    
    if (type === 'user' && simulationData.users[id]) {
        activeDays = simulationData.users[id].activeDays || 0;
    } else if (type === 'group' && simulationData.groups[id]) {
        activeDays = simulationData.groups[id].activeDays || 0;
    } else if (type === 'company' && simulationData.companies[id]) {
        activeDays = simulationData.companies[id].activeDays || 0;
    }
    
    activeDaysDisplay.textContent = activeDays;
    firstSeenDisplay.textContent = formatDate(simulationData.firstSeen);
    lastSeenDisplay.textContent = formatDate(simulationData.lastSeen);
    usageTrendDisplay.textContent = `${usageTrend > 0 ? '+' : ''}${usageTrend.toFixed(1)}%`;
    
    totalSeatsDisplay.textContent = userCount;
    activeSeatsDisplay.textContent = activeUsers;
}

// Log an event to the UI and simulate tracking
function logEvent(eventType, entityType, entityId) {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    // Add to log
    const logItem = document.createElement('li');
    logItem.textContent = `[${timestamp}] ${entityType} ${entityId} performed ${eventType}`;
    eventLogList.prepend(logItem);
    
    // Update simulation data
    simulationData.totalEvents++;
    simulationData.lastSeen = now;
    
    if (!simulationData.firstSeen) {
        simulationData.firstSeen = now;
    }
    
    // Track events for usage trend
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
    const fourWeeksAgo = new Date(now - 28 * 24 * 60 * 60 * 1000);
    
    if (now > twoWeeksAgo) {
        simulationData.currentPeriodEvents++;
    } else if (now > fourWeeksAgo) {
        simulationData.previousPeriodEvents++;
    }
    
    // Update entity data
    const today = now.toDateString();
    
    if (entityType === 'user') {
        if (!simulationData.users[entityId]) {
            simulationData.users[entityId] = {
                firstSeen: now,
                lastSeen: now,
                activeDays: 1,
                eventDates: [today]
            };
        } else {
            simulationData.users[entityId].lastSeen = now;
            if (!simulationData.users[entityId].eventDates.includes(today)) {
                simulationData.users[entityId].eventDates.push(today);
                simulationData.users[entityId].activeDays = simulationData.users[entityId].eventDates.length;
            }
        }
    } else if (entityType === 'group') {
        if (!simulationData.groups[entityId]) {
            simulationData.groups[entityId] = {
                firstSeen: now,
                lastSeen: now,
                activeDays: 1,
                eventDates: [today]
            };
        } else {
            simulationData.groups[entityId].lastSeen = now;
            if (!simulationData.groups[entityId].eventDates.includes(today)) {
                simulationData.groups[entityId].eventDates.push(today);
                simulationData.groups[entityId].activeDays = simulationData.groups[entityId].eventDates.length;
            }
        }
    } else if (entityType === 'company') {
        if (!simulationData.companies[entityId]) {
            simulationData.companies[entityId] = {
                firstSeen: now,
                lastSeen: now,
                activeDays: 1,
                eventDates: [today]
            };
        } else {
            simulationData.companies[entityId].lastSeen = now;
            if (!simulationData.companies[entityId].eventDates.includes(today)) {
                simulationData.companies[entityId].eventDates.push(today);
                simulationData.companies[entityId].activeDays = simulationData.companies[entityId].eventDates.length;
            }
        }
    }
    
    // Send to June.so analytics
    try {
        if (window.analytics && window.analytics.track) {
            window.analytics.track(eventType, {
                entityType: entityType,
                entityId: entityId
            });
        }
    } catch (e) {
        console.error('Error tracking event with June.so:', e);
    }
    
    // Update UI
    updateMetrics();
}

// Event listeners
generateIdButton.addEventListener('click', () => {
    entityIdInput.value = generateRandomId();
});

performEventButton.addEventListener('click', () => {
    const entityType = userTypeSelect.value;
    let entityId = entityIdInput.value.trim();
    
    if (!entityId) {
        entityId = generateRandomId();
        entityIdInput.value = entityId;
    }
    
    // Pick a random event type
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Log and track the event
    logEvent(eventType, entityType, entityId);
});

identifyButton.addEventListener('click', () => {
    const entityType = userTypeSelect.value;
    let entityId = entityIdInput.value.trim();
    
    if (!entityId) {
        entityId = generateRandomId();
        entityIdInput.value = entityId;
    }
    
    // Log identification
    const logItem = document.createElement('li');
    logItem.textContent = `[${new Date().toLocaleString()}] Identified ${entityType} ${entityId}`;
    eventLogList.prepend(logItem);
    
    // Send to June.so analytics
    try {
        if (window.analytics && window.analytics.identify) {
            const traits = {};
            
            if (entityType === 'user') {
                traits.userType = 'individual';
            } else if (entityType === 'group') {
                traits.userType = 'group';
                traits.groupId = entityId;
            } else if (entityType === 'company') {
                traits.userType = 'company';
                traits.companyId = entityId;
            }
            
            window.analytics.identify(entityId, traits);
        }
    } catch (e) {
        console.error('Error identifying with June.so:', e);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    entityIdInput.value = generateRandomId();
    updateMetrics();
    
    // Track initial page view
    setTimeout(() => {
        const entityType = userTypeSelect.value;
        const entityId = entityIdInput.value;
        logEvent('Page View', entityType, entityId);
    }, 1000);
});
