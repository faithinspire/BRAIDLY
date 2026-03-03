// Offline Mode Detection - Production Version (No Demo Mode)
// Only shows offline banner when actually offline

class OfflineMode {
    constructor() {
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Check initial state
        if (!this.isOnline) {
            this.showOfflineBanner();
        }
    }

    handleOnline() {
        this.isOnline = true;
        this.hideOfflineBanner();
        console.log('Connection restored');
    }

    handleOffline() {
        this.isOnline = false;
        this.showOfflineBanner();
        console.log('Connection lost');
    }

    showOfflineBanner() {
        // Remove any existing banner
        this.hideOfflineBanner();
        
        // Create offline banner
        const banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.className = 'offline-banner';
        banner.innerHTML = `
            <div class="offline-content">
                <i class="fas fa-wifi-slash"></i>
                <span>You're offline. Some features may be unavailable.</span>
            </div>
        `;
        
        document.body.prepend(banner);
        
        // Add styles if not already present
        if (!document.getElementById('offline-banner-styles')) {
            const style = document.createElement('style');
            style.id = 'offline-banner-styles';
            style.textContent = `
                .offline-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #f56565;
                    color: white;
                    padding: 12px 20px;
                    text-align: center;
                    z-index: 10000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    animation: slideDown 0.3s ease;
                }
                
                .offline-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .offline-content i {
                    font-size: 18px;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 480px) {
                    .offline-banner {
                        padding: 10px 15px;
                    }
                    
                    .offline-content {
                        font-size: 12px;
                    }
                    
                    .offline-content i {
                        font-size: 16px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => banner.remove(), 300);
        }
    }

    isOffline() {
        return !this.isOnline;
    }
}

// Initialize offline mode detection
const offlineMode = new OfflineMode();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = offlineMode;
}
