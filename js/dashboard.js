// Customer Dashboard JavaScript

// Favorite toggle
document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            showToast('Added to favorites', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            showToast('Removed from favorites', 'info');
        }
    });
});

// Category selection
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.querySelector('p').textContent;
        window.location.href = `search.html?category=${encodeURIComponent(category)}`;
    });
});

// Search with filters
class SearchFilter {
    constructor() {
        this.filters = {
            location: '',
            style: '',
            priceMin: 0,
            priceMax: 500,
            rating: 0,
            verified: false,
            mobile: false,
            availableToday: false
        };
    }

    updateFilter(key, value) {
        this.filters[key] = value;
        this.applyFilters();
    }

    applyFilters() {
        // Filter braider cards based on current filters
        const braiderCards = document.querySelectorAll('.braider-card');
        braiderCards.forEach(card => {
            let show = true;
            
            // Apply filter logic here
            // This is a simplified example
            
            if (show) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    resetFilters() {
        this.filters = {
            location: '',
            style: '',
            priceMin: 0,
            priceMax: 500,
            rating: 0,
            verified: false,
            mobile: false,
            availableToday: false
        };
        this.applyFilters();
    }
}

const searchFilter = new SearchFilter();

// Referral link copy
const referralBtn = document.querySelector('.referral-banner .btn-light');
if (referralBtn) {
    referralBtn.addEventListener('click', function() {
        const referralLink = 'https://braidly.com/ref/SARAH123';
        navigator.clipboard.writeText(referralLink).then(() => {
            showToast('Referral link copied!', 'success');
        });
    });
}

// Load more braiders
let currentPage = 1;
const loadMoreBtn = document.getElementById('loadMoreBraiders');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        loadBraiders(currentPage);
    });
}

function loadBraiders(page) {
    // Simulate API call
    showToast('Loading more braiders...', 'info');
    
    setTimeout(() => {
        // Add more braider cards to the DOM
        showToast('Loaded successfully', 'success');
    }, 1000);
}

// Real-time notifications
function checkNotifications() {
    // Simulate checking for new notifications
    // In production, this would be a WebSocket or polling mechanism
}

setInterval(checkNotifications, 30000); // Check every 30 seconds

// Bottom navigation active state (mobile)
document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(i => {
            i.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load user preferences
    loadUserPreferences();
    
    // Initialize search
    initializeSearch();
    
    // Check for new messages
    checkNotifications();
});

function loadUserPreferences() {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        document.querySelector('input[placeholder*="location"]').value = savedLocation;
    }
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-section input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value;
            if (query.length > 2) {
                performSearch(query);
            }
        }, 300));
    }
}

function performSearch(query) {
    console.log('Searching for:', query);
    // Implement search logic
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'info') {
    if (window.BraidlyUtils && window.BraidlyUtils.showToast) {
        window.BraidlyUtils.showToast(message, type);
    }
}
