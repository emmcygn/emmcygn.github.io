// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Check if Sprig is loaded
    function checkSprigLoaded() {
        if (typeof window.Sprig !== 'undefined') {
            // Set the User ID using the recommended method
            const userId = 'user_' + Math.floor(Math.random() * 100000);
            window.Sprig('setUserId', userId);
            console.log('Sprig: Set User ID to', userId);
            
            // Set user properties
            const userProperties = {
                email: userId + '@example.com',
                name: 'Test User ' + userId.split('_')[1],
                signupDate: new Date().toISOString(),
                userType: Math.random() > 0.5 ? 'returning' : 'new'
            };
            
            // Track page view
            window.Sprig('track', 'page_viewed', {
                page: window.location.pathname,
                referrer: document.referrer
            });
            
            // Set up event handlers for tracking
            setupTracking();
        } else {
            console.log('Sprig not loaded yet, retrying...');
            setTimeout(checkSprigLoaded, 500);
        }
    }
    
    // Start checking if Sprig is loaded
    setTimeout(checkSprigLoaded, 500);
});

// Set up event tracking
function setupTracking() {
    // Track category clicks
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.textContent.trim();
            window.Sprig('track', 'link_clicked', {
                text: linkText,
                href: this.href
            });
            console.log('Tracked link click:', linkText);
        });
    });
    
    // Track search
    const searchForm = document.querySelector('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            if (searchInput) {
                const searchTerm = searchInput.value.trim();
                window.Sprig('track', 'search_performed', {
                    term: searchTerm
                });
                console.log('Tracked search:', searchTerm);
                alert('Search tracked: ' + searchTerm);
            }
        });
    }
    
    // Track buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            window.Sprig('track', 'button_clicked', {
                text: buttonText
            });
            console.log('Tracked button click:', buttonText);
        });
    });
}
