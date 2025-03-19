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
const groupIndustryInput = document.getElementById('groupIndustry');
const eventNameSelect = document.getElementById('eventName');
const eventPropertiesInput = document.getElementById('eventProperties');
const includeGroupCheckbox = document.getElementById('includeGroup');

const generateUserIdButton = document.getElementById('generateUserId');
const generateGroupIdButton = document.getElementById('generateGroupId');
const identifyUserButton = document.getElementById('identifyUser');
const identifyGroupButton = document.getElementById('identifyGroup');
const trackEventButton = document.getElementById('trackEvent');
const clearLogButton = document.getElementById('clearLog');
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

// Generate random industry
function generateRandomIndustry() {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Media', 'Transportation', 'Energy', 'Entertainment'];
    return industries[Math.floor(Math.random() * industries.length)];
}

// Format date for display
function formatDate(date) {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
}

// Parse JSON safely
function safeJSONParse(str) {
    try {
        return str ? JSON.parse(str) : {};
    } catch (e) {
        logToUI(`Error parsing JSON: ${e.message}`, 'error');
        return {};
    }
}

// Check June.so connection
function checkJuneConnection() {
    if (!window.analytics || typeof window.analytics.track !== 'function') {
        connectionStatusDisplay.textContent = 'June.so Not Connected';
        connectionStatusDisplay.className = 'status-error';
        return false;
    }
    
    connectionStatusDisplay.textContent = 'June.so Connected';
    connectionStatusDisplay.className = 'status-success';
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
function logToUI(message, type = 'info') {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    const logItem = document.createElement('li');
    logItem.textContent = `[${timestamp}] ${message}`;
    logItem.className = `log-${type}`;
    
    eventLogList.prepend(logItem);
    
    // Auto scroll to top of log
    eventLogList.scrollTop = 0;
}

// Track an event and update simulation data
function trackEvent(eventName, properties = {}) {
    const now = new Date();
    const userId = simulationData.currentUserId;
    const groupId = simulationData.currentGroupId;
    const includeGroup = includeGroupCheckbox.checked;
    
    // Check if we have an identified user
    if (!userId) {
        logToUI('Error: Please identify a user first before tracking events', 'error');
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
    if (groupId && includeGroup) {
        eventMessage += ` in company ${groupId}`;
    }
    logToUI(eventMessage);
    
    // Send to June.so analytics
    try {
        if (checkJuneConnection()) {
            // Prepare options object if groupId is available and checkbox is checked
            let options = null;
            if (groupId && includeGroup) {
                options = { context: { groupId: groupId } };
            }
            
            if (options) {
                // Track with groupId context
                window.analytics.track(eventName, properties, options, () => {
                    console.log('Track event callback executed');
                });
                console.log(`Tracked event "${eventName}" for user ${userId} in group ${groupId}`, properties, options);
            } else {
                // Track without groupId context
                window.analytics.track(eventName, properties, () => {
                    console.log('Track event callback executed');
                });
                console.log(`Tracked event "${eventName}" for user ${userId}`, properties);
            }
            
            logToUI(`Successfully sent "${eventName}" event to June.so`, 'success');
        } else {
            logToUI(`Simulated event "${eventName}" locally (June.so connection unavailable)`, 'error');
        }
    } catch (e) {
        console.error('Error tracking event with June.so:', e);
        logToUI(`Error: Failed to track event with June.so: ${e.message}`, 'error');
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
            window.analytics.identify(userId, traits, () => {
                console.log('Identify callback executed');
            });
            console.log(`Identified user ${userId}`, traits);
            logToUI(`Successfully sent user identification to June.so`, 'success');
        } else {
            logToUI(`Simulated user identification locally (June.so connection unavailable)`, 'error');
        }
    } catch (e) {
        console.error('Error identifying user with June.so:', e);
        logToUI(`Error: Failed to identify user with June.so: ${e.message}`, 'error');
    }
    
    // Update UI
    updateMetrics();
}

// Identify a group/company
function identifyGroup(groupId, traits) {
    // Make sure we have an identified user first
    if (!simulationData.currentUserId) {
        logToUI('Error: Please identify a user first before identifying a company', 'error');
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
            window.analytics.group(groupId, traits, () => {
                console.log('Group callback executed');
            });
            console.log(`Identified group ${groupId}`, traits);
            logToUI(`Successfully sent company identification to June.so`, 'success');
        } else {
            logToUI(`Simulated company identification locally (June.so connection unavailable)`, 'error');
        }
    } catch (e) {
        console.error('Error identifying group with June.so:', e);
        logToUI(`Error: Failed to identify company with June.so: ${e.message}`, 'error');
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

generateGroupIdButton.addEventListener('click', () => {
    groupIdInput.value = generateRandomId();
    groupNameInput.value = generateRandomCompanyName();
    groupIndustryInput.value = generateRandomIndustry();
});

identifyUserButton.addEventListener('click', () => {
    const userId = userIdInput.value.trim();
    const email = userEmailInput.value.trim();
    const name = userNameInput.value.trim();
    
    if (!userId) {
        logToUI('Error: User ID is required', 'error');
        return;
    }
    
    if (!email) {
        logToUI('Error: Email is required', 'error');
        return;
    }
    
    const traits = {
        email: email
    };
    
    if (name) traits.name = name;
    
    identifyUser(userId, traits);
});

identifyGroupButton.addEventListener('click', () => {
    const groupId = groupIdInput.value.trim();
    const name = groupNameInput.value.trim();
    const industry = groupIndustryInput.value.trim();
    
    if (!groupId) {
        logToUI('Error: Group/Company ID is required', 'error');
        return;
    }
    
    const traits = {};
    
    if (name) traits.name = name;
    if (industry) traits.industry = industry;
    
    identifyGroup(groupId, traits);
});

trackEventButton.addEventListener('click', () => {
    const eventName = eventNameSelect.value;
    let properties = {};
    
    // Try to parse properties from the textarea
    try {
        const propertiesText = eventPropertiesInput.value.trim();
        if (propertiesText) {
            properties = JSON.parse(propertiesText);
        }
    } catch (e) {
        logToUI(`Error parsing properties JSON: ${e.message}`, 'error');
        return;
    }
    
    trackEvent(eventName, properties);
});

clearLogButton.addEventListener('click', () => {
    eventLogList.innerHTML = '';
    logToUI('Event log cleared');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Generate random IDs and names
    userIdInput.value = generateRandomId();
    userNameInput.value = generateRandomName();
    userEmailInput.value = generateRandomEmail(userNameInput.value);
    groupIdInput.value = generateRandomId();
    groupNameInput.value = generateRandomCompanyName();
    groupIndustryInput.value = generateRandomIndustry();
    
    // Initialize metrics
    updateMetrics();
    
    // Check connection with a delay to allow script to load
    setTimeout(() => {
        checkJuneConnection();
    }, 2000);
    
    // Log page load
    logToUI('Page loaded. Ready to identify users and track events.');
    
    // Add example properties to the properties textarea
    const defaultProperties = {
        browser: navigator.userAgent.includes('Chrome') ? 'chrome' : 
                 navigator.userAgent.includes('Firefox') ? 'firefox' : 
                 navigator.userAgent.includes('Safari') ? 'safari' : 'other'
    };
    
    eventPropertiesInput.value = JSON.stringify(defaultProperties, null, 2);
    
    // Auto track page view with page() method
    try {
        if (window.analytics && window.analytics.page) {
            // Page view is already tracked in the June.so initialization script
            logToUI('Page view automatically tracked on load');
        }
    } catch (e) {
        console.error('Error tracking page view:', e);
    }
});

// Function to add a test event for quick testing
function addTestEvent() {
    // Only if we already have a user identified
    if (simulationData.currentUserId) {
        const testEvents = [
            'Page Viewed',
            'Button Clicked',
            'Form Submitted',
            'Feature Used'
        ];
        
        const randomEvent = testEvents[Math.floor(Math.random() * testEvents.length)];
        const randomProperties = {
            timestamp: new Date().toISOString(),
            randomValue: Math.floor(Math.random() * 100)
        };
        
        trackEvent(randomEvent, randomProperties);
    }
}

// Add keyboard shortcuts for convenience
document.addEventListener('keydown', (e) => {
    // Alt+1: Identify User
    if (e.altKey && e.key === '1') {
        identifyUserButton.click();
    }
    
    // Alt+2: Identify Group
    if (e.altKey && e.key === '2') {
        identifyGroupButton.click();
    }
    
    // Alt+3: Track Event
    if (e.altKey && e.key === '3') {
        trackEventButton.click();
    }
    
    // Alt+R: Generate Random IDs
    if (e.altKey && e.key === 'r') {
        generateUserIdButton.click();
        generateGroupIdButton.click();
    }
    
    // Alt+T: Add Test Event
    if (e.altKey && e.key === 't') {
        addTestEvent();
    }
    
    // Alt+C: Clear Log
    if (e.altKey && e.key === 'c') {
        clearLogButton.click();
    }
});
