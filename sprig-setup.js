// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Check if Sprig is loaded
    function checkSprigLoaded() {
        if (typeof window.Sprig !== 'undefined') {
            // Set the User ID using the recommended method
            const userId = 'user_' + Math.floor(Math.random() * 100000);
            window.Sprig('setUserId', userId);
            console.log('Sprig: Set User ID to', userId);
            
            // Set user email (important for targeting)
            const userEmail = userId + '@example.com';
            window.Sprig('setEmail', userEmail);
            console.log('Sprig: Set email to', userEmail);
            
            // Set user attributes for targeting
            window.Sprig('setAttributes', {
                account_type: Math.random() > 0.7 ? 'premium' : 'free',
                user_type: Math.random() > 0.5 ? 'returning' : 'new',
                signup_date: new Date().toISOString().split('T')[0],
                purchase_count: Math.floor(Math.random() * 10),
                total_spend: Math.floor(Math.random() * 500),
                preferred_category: getRandomCategory(),
                has_completed_profile: Math.random() > 0.3
            });
            console.log('Sprig: Set user attributes');
            
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

// Helper function to get a random category
function getRandomCategory() {
    const categories = [
        'equipment', 'jewellery', 'mens_wear', 'ladies_wear', 
        'automobiles', 'home_items', 'kids_toys', 'accessories'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
}

// Set up event tracking
function setupTracking() {
    // Track category clicks
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.textContent.trim();
            
            // Track the event
            window.Sprig('track', 'link_clicked', {
                text: linkText,
                href: this.href || 'no-href'
            });
            
            // Update user attributes based on behavior
            if (linkText.includes('Sign in')) {
                window.Sprig('setAttribute', 'last_sign_in_attempt', new Date().toISOString());
            } else if (linkText.includes('cart')) {
                window.Sprig('setAttribute', 'viewed_cart', true);
            } else if (linkText.includes('Wishlist')) {
                window.Sprig('setAttribute', 'has_wishlist', true);
            }
            
            console.log('Tracked link click:', linkText);
        });
    });
    
    // Track search behavior
    const searchForm = document.querySelector('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            if (searchInput) {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    // Track the search event
                    window.Sprig('track', 'search_performed', {
                        term: searchTerm
                    });
                    
                    // Update search-related attributes
                    window.Sprig('setAttributes', {
                        last_search_term: searchTerm,
                        has_searched: true,
                        search_count: incrementCounter('search_count')
                    });
                    
                    console.log('Tracked search:', searchTerm);
                    alert('Search tracked: ' + searchTerm);
                }
            }
        });
    }
    
    // Track shop now button
    const shopNowBtn = document.getElementById('SHOP_NOW');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function() {
            window.Sprig('track', 'shop_now_clicked');
            
            // Update engagement attributes
            window.Sprig('setAttributes', {
                engaged_with_promotions: true,
                engagement_level: 'high'
            });
            
            console.log('Tracked shop now click');
        });
    }
    
    // Track category interactions
    document.querySelectorAll('[data-category]').forEach(element => {
        element.addEventListener('click', function(e) {
            const category = this.dataset.category;
            
            // Track category click event
            window.Sprig('track', 'category_clicked', {
                category: category
            });
            
            // Update category preference attributes
            window.Sprig('setAttribute', 'last_viewed_category', category);
            window.Sprig('setAttribute', 'category_interest_' + category, true);
            
            console.log('Tracked category click:', category);
        });
    });
    
    // Handle simulated page navigation
    document.addEventListener('click', function(e) {
        // Simulate page navigation for demonstration purposes
        if (e.target.tagName === 'A' && e.target.href) {
            e.preventDefault();
            
            // Increment page view count attribute
            window.Sprig('setAttribute', 'page_view_count', incrementCounter('page_view_count'));
            console.log('Updated page view count attribute');
        }
    });
}

// Helper function to increment counters stored as attributes
function incrementCounter(attributeName) {
    // Get the current counter from localStorage for demo purposes
    let currentValue = parseInt(localStorage.getItem(attributeName) || '0');
    currentValue++;
    localStorage.setItem(attributeName, currentValue.toString());
    return currentValue;
}

// Add some session-based attributes after a delay
setTimeout(function() {
    if (typeof window.Sprig !== 'undefined') {
        // Set session-based attributes after 30 seconds
        window.Sprig('setAttributes', {
            session_duration: '30+ seconds',
            is_engaged: true,
            device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            browser: getBrowserInfo(),
            time_of_day: new Date().getHours() < 12 ? 'morning' : 
                         new Date().getHours() < 18 ? 'afternoon' : 'evening'
        });
        console.log('Updated session attributes');
    }
}, 30000);

// Helper to get browser info
function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) return "IE";
    if (ua.indexOf("Edge") > -1) return "Edge";
    return "Unknown";
}
