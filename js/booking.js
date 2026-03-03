// Booking Flow JavaScript

class BookingManager {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {
            braiderId: null,
            serviceId: null,
            serviceName: '',
            price: 0,
            date: null,
            time: null,
            duration: '',
            location: 'mobile',
            address: ''
        };
        
        this.init();
    }

    init() {
        this.setupServiceSelection();
        this.setupTimeSlots();
        this.setupLocationSelection();
        this.setupPaymentButton();
    }

    setupServiceSelection() {
        document.querySelectorAll('input[name="service"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const label = e.target.nextElementSibling;
                const serviceName = label.querySelector('h6').textContent;
                const price = label.querySelector('.service-price').textContent;
                const duration = label.querySelector('small').textContent;
                
                this.bookingData.serviceName = serviceName;
                this.bookingData.price = parseFloat(price.replace('$', ''));
                this.bookingData.duration = duration;
                
                this.updateSummary();
                this.moveToStep(2);
            });
        });
    }

    setupTimeSlots() {
        document.querySelectorAll('.time-slot:not(.disabled)').forEach(slot => {
            slot.addEventListener('click', (e) => {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
                
                this.bookingData.time = e.target.textContent;
                this.updateSummary();
            });
        });

        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.bookingData.date = e.target.value;
                this.updateSummary();
                this.loadAvailableTimeSlots(e.target.value);
            });
        }
    }

    setupLocationSelection() {
        document.querySelectorAll('input[name="location"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.bookingData.location = e.target.id;
                this.updateSummary();
            });
        });

        const addressInput = document.querySelector('input[placeholder*="address"]');
        if (addressInput) {
            addressInput.addEventListener('change', (e) => {
                this.bookingData.address = e.target.value;
            });
        }
    }

    setupPaymentButton() {
        const paymentBtn = document.querySelector('.btn-primary.w-100.btn-lg');
        if (paymentBtn) {
            paymentBtn.addEventListener('click', () => {
                if (this.validateBooking()) {
                    this.proceedToPayment();
                }
            });
        }
    }

    loadAvailableTimeSlots(date) {
        // Simulate API call to get available time slots
        console.log('Loading time slots for:', date);
        
        // In production, this would fetch from the backend
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            // Randomly disable some slots for demo
            if (Math.random() > 0.7) {
                slot.classList.add('disabled');
                slot.disabled = true;
            } else {
                slot.classList.remove('disabled');
                slot.disabled = false;
            }
        });
    }

    updateSummary() {
        // Update service
        const serviceSpan = document.querySelector('.summary-item:nth-child(1) strong');
        if (serviceSpan && this.bookingData.serviceName) {
            serviceSpan.textContent = this.bookingData.serviceName;
        }

        // Update date
        const dateSpan = document.querySelector('.summary-item:nth-child(2) strong');
        if (dateSpan && this.bookingData.date) {
            const formattedDate = new Date(this.bookingData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            dateSpan.textContent = formattedDate;
        }

        // Update time
        const timeSpan = document.querySelector('.summary-item:nth-child(3) strong');
        if (timeSpan && this.bookingData.time) {
            timeSpan.textContent = this.bookingData.time;
        }

        // Update duration
        const durationSpan = document.querySelector('.summary-item:nth-child(4) strong');
        if (durationSpan && this.bookingData.duration) {
            durationSpan.textContent = this.bookingData.duration.replace('⏱ ', '');
        }

        // Update location
        const locationSpan = document.querySelector('.summary-item:nth-child(5) strong');
        if (locationSpan) {
            locationSpan.textContent = this.bookingData.location === 'mobile' ? 'Mobile Service' : 'Salon';
        }

        // Update price
        const priceSpan = document.querySelector('.summary-item:not(.total) strong:last-child');
        const totalSpan = document.querySelector('.summary-item.total strong:last-child');
        if (priceSpan && this.bookingData.price) {
            priceSpan.textContent = `$${this.bookingData.price.toFixed(2)}`;
            if (totalSpan) {
                totalSpan.textContent = `$${this.bookingData.price.toFixed(2)}`;
            }
        }
    }

    moveToStep(step) {
        this.currentStep = step;
        
        // Update progress indicators
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });
    }

    validateBooking() {
        if (!this.bookingData.serviceName) {
            this.showError('Please select a service');
            return false;
        }
        
        if (!this.bookingData.date) {
            this.showError('Please select a date');
            return false;
        }
        
        if (!this.bookingData.time) {
            this.showError('Please select a time');
            return false;
        }
        
        if (this.bookingData.location === 'mobile' && !this.bookingData.address) {
            this.showError('Please enter your address for mobile service');
            return false;
        }
        
        return true;
    }

    proceedToPayment() {
        // Store booking data
        sessionStorage.setItem('bookingData', JSON.stringify(this.bookingData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    }

    showError(message) {
        if (window.BraidlyUtils && window.BraidlyUtils.showToast) {
            window.BraidlyUtils.showToast(message, 'danger');
        } else {
            alert(message);
        }
    }
}

// Initialize booking manager
document.addEventListener('DOMContentLoaded', () => {
    new BookingManager();
});

// Cancellation policy modal
const cancellationLink = document.querySelector('.cancellation-policy');
if (cancellationLink) {
    cancellationLink.style.cursor = 'pointer';
    cancellationLink.addEventListener('click', () => {
        // Show modal with full cancellation policy
        const modal = new bootstrap.Modal(document.getElementById('cancellationModal'));
        modal.show();
    });
}

// Auto-save booking progress
setInterval(() => {
    const bookingManager = window.bookingManager;
    if (bookingManager) {
        localStorage.setItem('bookingDraft', JSON.stringify(bookingManager.bookingData));
    }
}, 5000);

// Restore booking progress
window.addEventListener('load', () => {
    const savedBooking = localStorage.getItem('bookingDraft');
    if (savedBooking) {
        const data = JSON.parse(savedBooking);
        // Restore form values
        console.log('Restored booking data:', data);
    }
});
