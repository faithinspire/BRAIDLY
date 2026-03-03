// Braider Dashboard JavaScript

class BraiderDashboard {
    constructor() {
        this.earnings = {
            total: 0,
            completed: 0,
            pending: 0
        };
        this.bookings = [];
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupBookingActions();
        this.setupEarningsManagement();
        this.setupNotifications();
    }

    loadDashboardData() {
        // Simulate API call to load dashboard data
        this.earnings = {
            total: 3450.00,
            completed: 2850.00,
            pending: 600.00
        };
        
        this.updateEarningsDisplay();
    }

    updateEarningsDisplay() {
        const totalEarnings = document.querySelector('.stat-card:first-child h3');
        if (totalEarnings) {
            totalEarnings.textContent = `$${this.earnings.total.toFixed(2)}`;
        }
    }

    setupBookingActions() {
        // Accept booking
        document.querySelectorAll('.btn-success').forEach(btn => {
            if (btn.textContent.includes('Accept')) {
                btn.addEventListener('click', (e) => {
                    const bookingItem = e.target.closest('.booking-item');
                    this.acceptBooking(bookingItem);
                });
            }
        });

        // View details
        document.querySelectorAll('.btn-outline-primary').forEach(btn => {
            if (btn.textContent.includes('View Details')) {
                btn.addEventListener('click', (e) => {
                    const bookingItem = e.target.closest('.booking-item');
                    this.showBookingDetails(bookingItem);
                });
            }
        });

        // Start route
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.textContent.includes('Start Route')) {
                btn.addEventListener('click', (e) => {
                    this.startNavigation();
                });
            }
        });
    }

    acceptBooking(bookingItem) {
        const clientName = bookingItem.querySelector('h6').textContent;
        
        if (confirm(`Accept booking from ${clientName}?`)) {
            // Simulate API call
            this.showToast('Booking accepted!', 'success');
            
            // Update UI
            const badge = bookingItem.querySelector('.badge');
            badge.classList.remove('bg-info');
            badge.classList.add('bg-success');
            badge.textContent = 'Confirmed';
            
            // Update button
            const acceptBtn = bookingItem.querySelector('.btn-success');
            acceptBtn.textContent = 'Accepted';
            acceptBtn.disabled = true;
        }
    }

    showBookingDetails(bookingItem) {
        const clientName = bookingItem.querySelector('h6').textContent;
        const service = bookingItem.querySelector('small').textContent;
        
        // Create and show modal with booking details
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Booking Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Client:</strong> ${clientName}</p>
                        <p><strong>Service:</strong> ${service}</p>
                        <p><strong>Status:</strong> Confirmed</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Contact Client</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    startNavigation() {
        // Get client address and start navigation
        const address = "123 Main St, Atlanta, GA";
        
        if (confirm('Open navigation to client location?')) {
            // Open Google Maps or Apple Maps
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
            
            this.showToast('Navigation started', 'info');
        }
    }

    setupEarningsManagement() {
        const payoutBtn = document.querySelector('.btn-primary.w-100');
        if (payoutBtn && payoutBtn.textContent.includes('Request Payout')) {
            payoutBtn.addEventListener('click', () => {
                this.requestPayout();
            });
        }
    }

    requestPayout() {
        if (this.earnings.completed === 0) {
            this.showToast('No funds available for payout', 'warning');
            return;
        }
        
        // Show payout modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Request Payout</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Available for payout: <strong>$${this.earnings.completed.toFixed(2)}</strong></p>
                        <div class="mb-3">
                            <label class="form-label">Payout Method</label>
                            <select class="form-select">
                                <option>Bank Transfer (2-3 days) - Free</option>
                                <option>Instant Transfer - $2.99 fee</option>
                            </select>
                        </div>
                        <div class="alert alert-info">
                            <small>Funds will be transferred to your linked bank account</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="this.closest('.modal').querySelector('.btn-close').click(); window.braiderDashboard.confirmPayout()">Confirm Payout</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    confirmPayout() {
        this.showToast('Payout request submitted successfully!', 'success');
        this.earnings.completed = 0;
        this.updateEarningsDisplay();
    }

    setupNotifications() {
        // Check for new bookings every 30 seconds
        setInterval(() => {
            this.checkNewBookings();
        }, 30000);
    }

    checkNewBookings() {
        // Simulate checking for new bookings
        // In production, this would be WebSocket or polling
    }

    showToast(message, type = 'info') {
        if (window.BraidlyUtils && window.BraidlyUtils.showToast) {
            window.BraidlyUtils.showToast(message, type);
        }
    }
}

// Initialize dashboard
let braiderDashboard;
document.addEventListener('DOMContentLoaded', () => {
    braiderDashboard = new BraiderDashboard();
    window.braiderDashboard = braiderDashboard;
});

// No-show report
document.querySelectorAll('.alert-warning .btn-warning').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'no-show-report.html';
    });
});

// Portfolio management
document.querySelectorAll('.portfolio-overlay .btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this photo from your portfolio?')) {
            const portfolioItem = e.target.closest('.portfolio-item');
            portfolioItem.remove();
            braiderDashboard.showToast('Photo deleted', 'success');
        }
    });
});

// Real-time earnings update
function updateEarningsRealtime(amount) {
    const currentEarnings = parseFloat(document.querySelector('.stat-card:first-child h3').textContent.replace('$', ''));
    const newEarnings = currentEarnings + amount;
    
    // Animate the change
    animateValue(document.querySelector('.stat-card:first-child h3'), currentEarnings, newEarnings, 1000);
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = `$${current.toFixed(2)}`;
    }, 16);
}

// Schedule management
function toggleAvailability(date, time) {
    console.log('Toggling availability for:', date, time);
    // Implement schedule toggle logic
}

// Analytics tracking
function trackEvent(eventName, data) {
    console.log('Event:', eventName, data);
    // Send to analytics service
}
