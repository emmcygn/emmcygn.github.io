// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Sprig user identification
    identifyUser();
    
    // Track page view
    trackPageView();
    
    // Set up event handlers
    setupEventHandlers();
});

// Identify user to Sprig
function identifyUser() {
    // Generate a random user ID if needed
    const userId = localStorage.getItem('userId') || 'user_' + Math.floor(Math.random() * 100000);
    
    // Save userId in localStorage
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId);
    }
    
    // Get or set properties from localStorage
    const properties = {
        email: localStorage.getItem('userEmail') || 'user' + userId.split('_')[1] + '@example.com',
        name: localStorage.getItem('userName') || 'Test User ' + userId.split('_')[1],
        signupDate: localStorage.getItem('signupDate') || new Date().toISOString(),
        userType: localStorage.getItem('userType') || Math.random() > 0.5 ? 'returning' : 'new'
    };
    
    // Save all properties in localStorage
    Object.keys(properties).forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, properties[key]);
        }
    });
    
    try {
        // Call Sprig identify
        window.Sprig('identify', userId, {
            email: properties.email,
            name: properties.name,
            created_at: properties.signupDate,
            user_type: properties.userType
        });
        
        console.log('Sprig: User identified', userId, properties);
    } catch (e) {
        console.error('Sprig: Error identifying user', e);
    }
}

// Track page view in Sprig
function trackPageView() {
    try {
        window.Sprig('track', 'page_viewed', {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
        
        console.log('Sprig: Page view tracked');
    } catch (e) {
        console.error('Sprig: Error tracking page view', e);
    }
}

// Set up all event handlers
function setupEventHandlers() {
    // Track category clicks
    document.querySelectorAll('nav.categories a, .icon-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category || this.textContent.trim();
            trackEvent('category_clicked', { category: category });
        });
    });
    
    // Track product clicks
    document.querySelectorAll('.product-card').forEach(product => {
        product.addEventListener('click', function(e) {
            if (!e.target.classList.contains('wishlist-button')) {
                e.preventDefault();
                const productId = this.dataset.productId;
                const productName = this.querySelector('h3').textContent;
                const productPrice = this.querySelector('.price').textContent;
                
                trackEvent('product_clicked', {
                    product_id: productId,
                    product_name: productName,
                    product_price: productPrice
                });
                
                // Simulate product page navigation
                localStorage.setItem('lastViewedProduct', productId);
                alert(`Viewing product: ${productName}`);
            }
        });
    });
    
    // Track wishlist button clicks
    document.querySelectorAll('.wishlist-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.productId;
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            this.classList.toggle('active');
            const action = this.classList.contains('active') ? 'added_to_wishlist' : 'removed_from_wishlist';
            
            trackEvent(action, {
                product_id: productId,
                product_name: productName
            });
            
            // Provide visual feedback
            this.innerHTML = this.classList.contains('active') ? '♥' : '♡';
        });
    });
    
    // Track CTA button clicks
    document.getElementById('shop-now').addEventListener('click', function() {
        trackEvent('cta_clicked', { button: 'shop_now', location: 'hero_banner' });
    });
    
    document.getElementById('check-it').addEventListener('click', function() {
        trackEvent('cta_clicked', { button: 'check_it', location: 'promo_banner' });
    });
    
    // Track newsletter subscription
    document.getElementById('subscribe-btn').addEventListener('click', function() {
        const emailInput = this.previousElementSibling;
        const email = emailInput.value.trim();
        
        if (email && email.includes('@')) {
            trackEvent('newsletter_subscribed', { email: email });
            alert('Thank you for subscribing!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address');
        }
    });
    
    // Track user sign in
    document.getElementById('sign-in').addEventListener('click', function(e) {
        e.preventDefault();
        trackEvent('sign_in_clicked');
        
        // Simulate sign in
        const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
        
        if (!isSignedIn) {
            localStorage.setItem('isSignedIn', 'true');
            alert('You are now signed in!');
            
            // Update user attributes
            window.Sprig('set', 'is_signed_in', true);
        } else {
            localStorage.setItem('isSignedIn', 'false');
            alert('You are now signed out.');
            
            // Update user attributes
            window.Sprig('set', 'is_signed_in', false);
        }
    });
    
    // Track cart clicks
    document.getElementById('cart').addEventListener('click', function(e) {
        e.preventDefault();
        trackEvent('cart_clicked');
        
        // Get cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length > 0) {
            alert(`You have ${cart.length} items in your cart.`);
        } else {
            alert('Your cart is empty.');
        }
    });
}

// Generic event tracking function
function trackEvent(eventName, properties = {}) {
    try {
        // Add standard properties
        const eventProperties = {
            ...properties,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userId: localStorage.getItem('userId')
        };
        
        // Track event in Sprig
        window.Sprig('track', eventName, eventProperties);
        
        console.log(`Sprig: Event tracked - ${eventName}`, eventProperties);
    } catch (e) {
        console.error(`Sprig: Error tracking event - ${eventName}`, e);
    }
}
