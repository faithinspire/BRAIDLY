// Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.stats = {
            totalUsers: 2547,
            activeBookings: 1234,
            pendingDisputes: 23,
            revenue: 45200
        };
        this.init();
    }

    init() {
        this.setupVerificationActions();
        this.setupDisputeActions();
        this.setupFraudAlerts();
        this.loadDashboardData();
    }

    setupVerificationActions() {
        // Approve verification
        document.querySelectorAll('.btn-success').forEach(btn => {
            if (btn.textContent.includes('Approve')) {
                btn.addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    this.approveVerification(row);
                });
            }
        });

        // Reject verification
        document.querySelectorAll('.btn-danger').forEach(btn => {
            if (btn.textContent.includes('Reject')) {
                btn.addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    this.rejectVerification(row);
                });
            }
        });
    }

    approveVerification(row) {
        const userName = row.querySelector('strong').textContent;
        const verificationType = row.querySelector('.badge').textContent;
        
        if (confirm(`Approve ${verificationType} for ${userName}?`)) {
            this.showToast(`${userName} verification approved`, 'success');
            row.remove();
            this.updateVerificationCount(-1);
        }
    }

    rejectVerification(row) {
        const userName = row.querySelector('strong').textContent;
        
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            this.showToast(`${userName} verification rejected`, 'warning');
            row.remove();
            this.updateVerificationCount(-1);
        }
    }

    updateVerificationCount(change) {
        const header = document.querySelector('.card-header h5');
        const currentCount = parseInt(header.textContent.match(/\d+/)[0]);
        const newCount = currentCount + change;
        header.textContent = header.textContent.replace(/\d+/, newCount);
    }

    setupDisputeActions() {
        // Full refund
        document.querySelectorAll('.dispute-actions .btn-success').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const disputeItem = e.target.closest('.dispute-item');
                this.processRefund(disputeItem, 'full');
            });
        });

        // Partial refund
        document.querySelectorAll('.dispute-actions .btn-warning').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const disputeItem = e.target.closest('.dispute-item');
                this.processRefund(disputeItem, 'partial');
            });
        });

        // Release funds
        document.querySelectorAll('.dispute-actions .btn-primary').forEach(btn => {
            if (btn.textContent.includes('Release')) {
                btn.addEventListener('click', (e) => {
                    const disputeItem = e.target.closest('.dispute-item');
                    this.releaseFunds(disputeItem);
                });
            }
        });

        // Suspend braider
        document.querySelectorAll('.dispute-actions .btn-danger').forEach(btn => {
            if (btn.textContent.includes('Suspend')) {
                btn.addEventListener('click', (e) => {
                    const disputeItem = e.target.closest('.dispute-item');
                    this.suspendBraider(disputeItem);
                });
            }
        });
    }

    processRefund(disputeItem, type) {
        const bookingId = disputeItem.querySelector('h6').textContent;
        const amount = disputeItem.querySelector('p:nth-child(2)').textContent.match(/\$[\d.]+/)[0];
        
        let refundAmount = amount;
        if (type === 'partial') {
            refundAmount = prompt(`Enter partial refund amount (max ${amount}):`);
            if (!refundAmount) return;
        }
        
        if (confirm(`Process ${type} refund of ${refundAmount} for ${bookingId}?`)) {
            this.showToast(`Refund of ${refundAmount} processed`, 'success');
            disputeItem.remove();
            this.updateDisputeCount(-1);
        }
    }

    releaseFunds(disputeItem) {
        const bookingId = disputeItem.querySelector('h6').textContent;
        
        if (confirm(`Release funds to braider for ${bookingId}?`)) {
            this.showToast('Funds released to braider', 'success');
            disputeItem.remove();
            this.updateDisputeCount(-1);
        }
    }

    suspendBraider(disputeItem) {
        const bookingId = disputeItem.querySelector('h6').textContent;
        
        const duration = prompt('Suspension duration (days):');
        if (duration) {
            this.showToast(`Braider suspended for ${duration} days`, 'warning');
            disputeItem.remove();
            this.updateDisputeCount(-1);
        }
    }

    updateDisputeCount(change) {
        const header = document.querySelectorAll('.card-header h5')[1];
        const currentCount = parseInt(header.textContent.match(/\d+/)[0]);
        const newCount = currentCount + change;
        header.textContent = header.textContent.replace(/\d+/, newCount);
        
        // Update stats card
        this.stats.pendingDisputes += change;
        document.querySelectorAll('.stat-card')[2].querySelector('h3').textContent = this.stats.pendingDisputes;
    }

    setupFraudAlerts() {
        document.querySelectorAll('.fraud-alert .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alert = e.target.closest('.fraud-alert');
                const alertType = alert.querySelector('strong').textContent;
                this.reviewFraudAlert(alertType, alert);
            });
        });

        // Main fraud alert button
        const mainAlertBtn = document.querySelector('.alert-danger .btn-danger');
        if (mainAlertBtn) {
            mainAlertBtn.addEventListener('click', () => {
                window.location.href = '#fraud-investigation';
            });
        }
    }

    reviewFraudAlert(alertType, alertElement) {
        // Show detailed fraud investigation modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Fraud Investigation: ${alertType}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>User Activity</h6>
                        <ul>
                            <li>Account created: 15 days ago</li>
                            <li>Total bookings: 12</li>
                            <li>Cancellations: 8</li>
                            <li>Disputes filed: 3</li>
                        </ul>
                        <h6>Recommended Actions</h6>
                        <div class="btn-group w-100">
                            <button class="btn btn-warning">Warn User</button>
                            <button class="btn btn-danger">Suspend Account</button>
                            <button class="btn btn-dark">Ban Permanently</button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Take Action</button>
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

    loadDashboardData() {
        // Simulate loading real-time data
        this.updateStats();
        
        // Refresh every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);
    }

    updateStats() {
        // Simulate real-time stat updates
        // In production, this would fetch from API
        console.log('Updating dashboard stats...');
    }

    showToast(message, type = 'info') {
        if (window.BraidlyUtils && window.BraidlyUtils.showToast) {
            window.BraidlyUtils.showToast(message, type);
        } else {
            alert(message);
        }
    }

    exportData(type) {
        console.log(`Exporting ${type} data...`);
        // Implement data export functionality
    }

    generateReport(reportType) {
        console.log(`Generating ${reportType} report...`);
        // Implement report generation
    }
}

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    window.adminDashboard = adminDashboard;
});

// Real-time notifications
function checkAdminNotifications() {
    // Check for new disputes, verifications, fraud alerts
    // In production, this would use WebSocket
}

setInterval(checkAdminNotifications, 10000);

// Export functionality
function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function convertToCSV(data) {
    // Convert data array to CSV format
    return data.map(row => row.join(',')).join('\n');
}

// Analytics tracking
function trackAdminAction(action, details) {
    console.log('Admin action:', action, details);
    // Send to analytics service
}
