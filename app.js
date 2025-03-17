// Current page to track navigation
let currentPage = 'home';

// Update status message
function updateStatus(message) {
    const status = document.getElementById('status');
    const timestamp = new Date().toLocaleTimeString();
    status.innerHTML = `<strong>${timestamp}</strong>: ${message}`;
}

// Identify user function
function identifyUser() {
    const userId = document.getElementById('userId').value || 'user-' + Math.floor(Math.random() * 1000);
    const userName = document.getElementById('userName').value || 'Test User';
    const userEmail = document.getElementById('userEmail').value || 'test@example.com';
    
    try {
        window.userpilot.identify(userId, {
            name: userName,
            email: userEmail,
            created_at: new Date().toISOString()
        });
        updateStatus(`User identified: ${userName} (${userId})`);
    } catch (e) {
        updateStatus(`Error identifying user: ${e.message}`);
        console.error(e);
    }
}

// Track predefined event
function trackEvent(eventName) {
    try {
        window.userpilot.track(eventName, {
            page: currentPage,
            timestamp: new Date().toISOString()
        });
        updateStatus(`Event tracked: ${eventName}`);
    } catch (e) {
        updateStatus(`Error tracking event: ${e.message}`);
        console.error(e);
    }
}

// Track custom event
function trackCustomEvent() {
    const eventName = document.getElementById('customEvent').value;
    if (!eventName) {
        updateStatus('Please enter a custom event name');
        return;
    }
    
    try {
        window.userpilot.track(eventName, {
            page: currentPage,
            timestamp: new Date().toISOString()
        });
        updateStatus(`Custom event tracked: ${eventName}`);
    } catch (e) {
        updateStatus(`Error tracking custom event: ${e.message}`);
        console.error(e);
    }
}

// Track event with custom properties
function trackComplexEvent() {
    const eventName = document.getElementById('complexEventName').value;
    const propKey1 = document.getElementById('propKey1').value;
    const propValue1 = document.getElementById('propValue1').value;
    const propKey2 = document.getElementById('propKey2').value;
    const propValue2 = document.getElementById('propValue2').value;
    
    if (!eventName || !propKey1 || !propValue1) {
        updateStatus('Please enter event name and at least one property');
        return;
    }
    
    const properties = {
        page: currentPage,
        timestamp: new Date().toISOString()
    };
    
    properties[propKey1] = propValue1;
    if (propKey2 && propValue2) {
        properties[propKey2] = propValue2;
    }
    
    try {
        window.userpilot.track(eventName, properties);
        updateStatus(`Complex event tracked: ${eventName} with properties`);
    } catch (e) {
        updateStatus(`Error tracking complex event: ${e.message}`);
        console.error(e);
    }
}

// Simulate page navigation
function simulateNavigation(page) {
    currentPage = page;
    updateStatus(`Navigated to: ${page} page`);
    
    // Reload Userpilot on navigation
    try {
        window.userpilot.reload();
        trackEvent('Page Viewed');
    } catch (e) {
        updateStatus(`Error reloading Userpilot: ${e.message}`);
        console.error(e);
    }
}

// Initialize with a page view on load
window.onload = function() {
    setTimeout(function() {
        if (typeof window.userpilot !== 'undefined') {
            updateStatus('Userpilot loaded successfully');
            trackEvent('Page Viewed');
        } else {
            updateStatus('Failed to load Userpilot');
        }
    }, 1000);
};