// Store simulation data
const simulationData = {
    users: {},
    groups: {},
    totalEvents: 0,
    firstSeen: null,
    lastSeen: null,
    previousPeriodEvents: 0,
    currentPeriodEvents: 0,
    currentUserId: null,
    currentGroupId: null
};

// DOM Elements
const userIdInput = document.getElementById('userId');
const userEmailInput = document.getElementById('userEmail');
const userNameInput = document.getElementById('userName');
const groupIdInput = document.getElementById('groupId');
const groupNameInput = document.getElementById('groupName');
const eventNameSelect = document.getElementById('eventName');

const generateUserIdButton = document.getElementById('generateUserId');
const generateGroupIdButton = document.getElementById('generateGroupId');
const identifyUserButton = document.getElementById('identifyUser');
const identifyGroupButton = document.getElementById('identifyGroup');
const trackEventButton = document.getElementById('trackEvent');
const eventLogList = document.getElementById('eventLog');
const connectionStatusDisplay = document.getElementById('connectionStatus');

// Metric displays
const totalEventsDisplay = document.getElementById('totalEvents');
const activeDaysDisplay = document.getElementById('activeDays');
const firstSeenDisplay = document.getElementById('firstSeen');
const lastSeenDisplay = document.getElementById('lastSeen');
const usageTrendDisplay = document.getElementById('usageTrend');

// Generate a random ID
function generateRandomId() {
    return Math.random().toString(36).substring(2, 10);
}

// Generate random email based on name or random
function generateRandomEmail(name) {
    if (name && name.trim() !== '') {
        const formattedName = name.toLowerCase().replace(/\s+/g, '.');
        return `${formattedName}@example.com`;
    }
    
    const randomName = generateRandomId();
    return `user.${randomName}@example.com`;
}

// Generate random name
function generateRandomName() {
    const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'Robert', 'Olivia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Taylor'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
}

// Generate random company name
function generateRandomCompanyName() {
    const prefixes = ['Acme', 'Global', 'Tech', 'Omega', 'Alpha', 'Nexus', 'Quantum', 'Vertex', 'Echo', 'Horizon'];
    const suffixes = ['Inc', 'Corp', 'Labs', 'Solutions', 'Systems', 'Technologies', 'Group', 'Enterprises', 'Partners', 'Industries'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${suffix}`;
}

// Format date for display
function formatDate(date) {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
}

// Check June.so connection
function checkJuneConnection() {
    if (!window.analytics || typeof window.analytics.track !== 'function') {
        connectionStatusDisplay.textContent = 'June.so Not Connected';
        connectionStatusDisplay.parentElement.classList.add('status-error');
        return false;
    }
    
    connectionStatusDisplay.textContent = 'June.so Connected';
    connectionStatusDisplay.parentElement.classList.add('status-success');
    return true;
}

// Update metrics displays
function updateMetrics() {
    // Count users
    const userCount = Object.keys(simulationData.users).length;
    
    // Count active users (had events in the last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
    let activeUsers = 0;
    
    // Count active users
    for (const userId in simulationData.users) {
        if (simulationData.users[userId].lastSeen >= thirtyDaysAgo) {
            activeUsers++;
        }
    }
    
    // Calculate usage trend
    let usageTrend = 0;
    if (simulationData.previousPeriodEvents > 0) {
        usageTrend = ((simulationData.currentPeriodEvents - simulationData.previousPeriodEvents) / simulationData.previousPeriodEvents) * 100;
    }
    
    // Update displays
    totalEventsDisplay.textContent = simulationData.totalEvents;
    
    // Calculate active days for current user
    let activeDays = 0;
    const userId = simulationData.currentUserId;
    
    if (userId && simulationData.users[userId]) {
        activeDays = simulationData.users[userId].activeDays || 0;
    }
    
    activeDaysDisplay.textContent = activeDays;
    firstSeenDisplay.textContent = formatDate(simulationData.firstSeen);
    lastSeenDisplay.textContent = formatDate(simulationData.lastSeen);
    usageTrendDisplay.textContent = `${usageTrend > 0 ? '+' : ''}${usageTrend.toFixed(1)}%`;
}

// Log an event to the UI
function logToUI(message, isError = false) {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    const logItem = document.createElement('li');
    logItem.textContent = `[${timestamp}] ${message}`;
    
    if (isError) {
        logItem.style.color = '#c62828';
    }
    
    eventLogList.prepend(logItem);
}

// Track an event and update simulation data
function trackEvent(eventName) {
    const now = new Date();
    const userId = simulationData.currentUserId;
    const groupId = simulationData.currentGroupId;
    
    // Check if we have an identified user
    if (!userId) {
        logToUI('Error: Please identify a user first before tracking events', true);
        return;
    }
    
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
    
    // Update user data
    const today = now.toDateString();
    
    if (simulationData.users[userId]) {
        simulationData.users[userId].lastSeen = now;
        if (!simulationData.users[userId].eventDates.includes(today)) {
            simulationData.users[userId].eventDates.push(today);
            simulationData.users[userId].activeDays = simulationData.users[userId].eventDates.length;
        }
    }
    
    // Log to UI
    let eventMessage = `User ${userId} performed "${eventName}"`;
    if (groupId) {
        eventMessage += ` in company ${groupId}`;
    }
    logToUI(eventMessage);
    
    // Send to June.so analytics
    try {
        if (checkJuneConnection()) {
            const properties = {
                browser: navigator.userAgent.includes('Chrome') ? 'chrome' : 
                         navigator.userAgent.includes('Firefox') ? 'firefox' : 
                         navigator.userAgent.includes('Safari') ? 'safari' : 'other'
            };
            
            // If we have a group ID, add it to context as per documentation
            const options = groupId ? { context: { groupId: groupId } } : null;
            
            if (options) {
                window.analytics.track(eventName, properties, options);
                console.log(`Tracked event "${eventName}" for user ${userId} in group ${groupId}`, properties, options);
            } else {
                window.analytics.track(eventName, properties);
                console.log(`Tracked event "${eventName}" for user ${userId}`, properties);
            }
            
            logToUI(`Successfully sent "${eventName}" event to June.so`);
        } else {
            logToUI(`Simulated event "${eventName}" locally (June.so connection unavailable)`, true);
        }
    } catch (e) {
        console.error('Error tracking event with June.so:', e);
        logToUI(`Error: Failed to track event with June.so: ${e.message}`, true);
    }
    
    // Update UI
    updateMetrics();
}

// Identify a user
function identifyUser(userId, traits) {
    // Update simulation data
    if (!simulationData.users[userId]) {
        simulationData.users[userId] = {
            id: userId,
            traits: traits,
            firstSeen: new Date(),
            lastSeen: new Date(),
            activeDays: 0,
            eventDates: []
        };
    } else {
        simulationData.users[userId].traits = {
            ...simulationData.users[userId].traits,
            ...traits
        };
    }
    
    // Set as current user
    simulationData.currentUserId = userId;
    
    // Log to UI
    logToUI(`Identified user: ${userId} (${traits.name || 'Unnamed'})`);
    
    // Send to June.so analytics
    try {
        if (checkJuneConnection()) {
            window.analytics.identify(userId, traits);
            console.log(`Identified user ${userId}`, traits);
            logToUI(`Successfully sent user identification to June.so`);
        } else {
            logToUI(`Simulated user identification locally (June.so connection unavailable)`, true);
        }
    } catch (e) {
        console.error('Error identifying user with June.so:', e);
        logToUI(`Error: Failed to identify user with June.so: ${e.message}`, true);
    }
    
    // Update UI
    updateMetrics();
}

// Identify a group/company
function identifyGroup(groupId, traits) {
    // Make sure we have an identified user first
    if (!simulationData.currentUserId) {
        logToUI('Error: Please identify a user first before identifying a company', true);
        return;
    }
    
    // Update simulation data
    if (!simulationData.groups[groupId]) {
        simulationData.groups[groupId] = {
            id: groupId,
            traits: traits,
            firstSeen: new Date(),
            lastSeen: new Date(),
            members: [simulationData.currentUserId]
        };
    } else {
        simulationData.groups[groupId].traits = {
            ...simulationData.groups[groupId].traits,
            ...traits
        };
        
        // Add user to group if not already a member
        if (!simulationData.groups[groupId].members.includes(simulationData.currentUserId)) {
            simulationData.groups[groupId].members.push(simulationData.currentUserId);
        }
    }
    
    // Set as current group
    simulationData.currentGroupId = groupId;
    
    // Log to UI
    logToUI(`Identified company: ${groupId} (${traits.name || 'Unnamed'})`);
    
    // Send to June.so analytics
    try {
        if (checkJuneConnection()) {
            window.analytics.group(groupId, traits);
            console.log(`Identified group ${groupId}`, traits);
            logToUI(`Successfully sent company identification to June.so`);
        } else {
            logToUI(`Simulated company identification locally (June.so connection unavailable)`, true);
        }
    } catch (e) {
        console.error('Error identifying group with June.so:', e);
        logToUI(`Error: Failed to identify company with June.so: ${e.message}`, true);
    }
    
    // Update UI
    updateMetrics();
}

// Event listeners
generateUserIdButton.addEventListener('click', () => {
    userIdInput.value = generateRandomId();
    userNameInput.value = generateRandomName();
    userEmailInput.value = generateRandomEmail(userNameInput.value);
});

generateG
