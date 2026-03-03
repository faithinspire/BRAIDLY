// Theme Toggle System for Braidly

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);
        
        // Setup navbar toggle button if it exists
        this.setupNavbarToggle();
        
        // Create floating toggle button as fallback
        this.createToggleButton();
        
        // Listen for system theme changes
        this.watchSystemTheme();
    }

    setupNavbarToggle() {
        const navToggle = document.getElementById('theme-toggle');
        const navIcon = document.getElementById('theme-icon');
        
        if (navToggle && navIcon) {
            // Update icon based on current theme
            navIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            // Add click listener
            navToggle.addEventListener('click', () => {
                this.toggleTheme();
                navIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            });
        }
    }

    createToggleButton() {
        // Check if button already exists
        if (document.querySelector('.theme-toggle')) return;

        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = this.currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        button.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(button);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
        
        // Save preference
        localStorage.setItem('theme', this.currentTheme);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.currentTheme } 
        }));
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    updateToggleButton() {
        const button = document.querySelector('.theme-toggle');
        if (button) {
            button.innerHTML = this.currentTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            darkModeQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't set a preference
                if (!localStorage.getItem('theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(this.currentTheme);
                    this.updateToggleButton();
                }
            });
        }
    }

    getTheme() {
        return this.currentTheme;
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}

// Export for use in other scripts
window.ThemeManager = ThemeManager;
