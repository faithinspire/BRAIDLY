// Footer Navigation Generator

const FOOTER_NAV_CONFIGS = {
    customer: [
        { icon: 'fa-home', label: 'Home', href: 'customer-dashboard.html', page: 'customer-dashboard' },
        { icon: 'fa-calendar-alt', label: 'Bookings', href: 'customer-bookings.html', page: 'customer-bookings', badge: 2 },
        { icon: 'fa-heart', label: 'Favorites', href: 'customer-favorites.html', page: 'customer-favorites' },
        { icon: 'fa-history', label: 'History', href: 'customer-history.html', page: 'customer-history' },
        { icon: 'fa-wallet', label: 'Wallet', href: 'customer-wallet.html', page: 'customer-wallet' },
        { icon: 'fa-gift', label: 'Referrals', href: 'customer-referrals.html', page: 'customer-referrals' },
        { icon: 'fa-headset', label: 'Support', href: 'customer-support.html', page: 'customer-support' }
    ],
    braider: [
        { icon: 'fa-home', label: 'Home', href: 'braider-dashboard.html', page: 'braider-dashboard' },
        { icon: 'fa-calendar-check', label: 'Bookings', href: 'braider-bookings.html', page: 'braider-bookings', badge: 3 },
        { icon: 'fa-clock', label: 'Schedule', href: 'braider-schedule.html', page: 'braider-schedule' },
        { icon: 'fa-wallet', label: 'Earnings', href: 'braider-earnings.html', page: 'braider-earnings' },
        { icon: 'fa-images', label: 'Portfolio', href: 'braider-portfolio.html', page: 'braider-portfolio' },
        { icon: 'fa-star', label: 'Reviews', href: 'braider-reviews.html', page: 'braider-reviews' },
        { icon: 'fa-chart-line', label: 'Analytics', href: 'braider-analytics.html', page: 'braider-analytics' }
    ],
    admin: [
        { icon: 'fa-home', label: 'Dashboard', href: 'admin-dashboard.html', page: 'admin-dashboard' },
        { icon: 'fa-users', label: 'Users', href: 'admin-user-management.html', page: 'admin-user-management' },
        { icon: 'fa-id-card', label: 'Verify', href: 'admin-verification.html', page: 'admin-verification', badge: 5 },
        { icon: 'fa-gavel', label: 'Disputes', href: 'admin-disputes.html', page: 'admin-disputes' },
        { icon: 'fa-exclamation-triangle', label: 'Fraud', href: 'admin-fraud.html', page: 'admin-fraud' },
        { icon: 'fa-chart-bar', label: 'Financial', href: 'admin-financial.html', page: 'admin-financial' },
        { icon: 'fa-chart-line', label: 'Analytics', href: 'admin-analytics.html', page: 'admin-analytics' }
    ]
};

function createFooterNav(role) {
    const config = FOOTER_NAV_CONFIGS[role];
    if (!config) return;

    // Get current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

    // Create footer nav HTML
    const footerHTML = `
        <nav class="footer-nav">
            <div class="footer-nav-container">
                ${config.map(item => `
                    <a href="${item.href}" class="footer-nav-item ${currentPage === item.page ? 'active' : ''}">
                        <div class="footer-nav-icon">
                            <i class="fas ${item.icon}"></i>
                            ${item.badge ? `<span class="footer-nav-badge">${item.badge}</span>` : ''}
                        </div>
                        <span class="footer-nav-label">${item.label}</span>
                    </a>
                `).join('')}
            </div>
        </nav>
    `;

    // Remove old sidebar if exists
    const oldSidebar = document.querySelector('.sidebar');
    if (oldSidebar) {
        oldSidebar.remove();
    }

    // Adjust main content area
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.remove('col-md-9', 'ms-sm-auto', 'col-lg-10');
        mainContent.classList.add('col-12');
        mainContent.style.paddingBottom = '100px';
    }

    // Insert footer nav
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Auto-initialize based on user role
window.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const role = userData.role;

    if (role && FOOTER_NAV_CONFIGS[role]) {
        createFooterNav(role);
    }
});

// Export for manual initialization
window.initFooterNav = createFooterNav;
