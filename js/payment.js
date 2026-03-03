// Payment Processing JavaScript

// Payment method selection
document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('active');
        });
        this.closest('.payment-option').classList.add('active');
        
        // Show/hide card form based on selection
        const cardForm = document.getElementById('cardForm');
        if (this.id === 'card') {
            cardForm.style.display = 'block';
        } else {
            cardForm.style.display = 'none';
        }
    });
});

// Card number formatting
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
        
        // Detect card type
        detectCardType(value);
    });
}

// Expiry date formatting
const expiryInput = document.getElementById('expiry');
if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        
        e.target.value = value;
    });
}

// CVV input restriction
const cvvInput = document.getElementById('cvv');
if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Detect card type
function detectCardType(number) {
    const cardIcon = document.querySelector('.input-group-text i');
    
    // Remove all card classes
    cardIcon.className = '';
    
    // Visa
    if (/^4/.test(number)) {
        cardIcon.className = 'fab fa-cc-visa';
    }
    // Mastercard
    else if (/^5[1-5]/.test(number)) {
        cardIcon.className = 'fab fa-cc-mastercard';
    }
    // Amex
    else if (/^3[47]/.test(number)) {
        cardIcon.className = 'fab fa-cc-amex';
    }
    // Discover
    else if (/^6(?:011|5)/.test(number)) {
        cardIcon.className = 'fab fa-cc-discover';
    }
    // Default
    else {
        cardIcon.className = 'fas fa-credit-card';
    }
}

// Confirm payment button
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', function() {
        if (validatePaymentForm()) {
            processPayment();
        }
    });
}

// Validate payment form
function validatePaymentForm() {
    const agreeTerms = document.getElementById('agreeTerms');
    
    if (!agreeTerms.checked) {
        showToast('Please agree to the terms and conditions', 'warning');
        return false;
    }
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || cardNumber.length < 13) {
            showToast('Please enter a valid card number', 'danger');
            return false;
        }
        
        if (!cardName) {
            showToast('Please enter cardholder name', 'danger');
            return false;
        }
        
        if (!expiry || expiry.length < 5) {
            showToast('Please enter expiry date', 'danger');
            return false;
        }
        
        if (!cvv || cvv.length < 3) {
            showToast('Please enter CVV', 'danger');
            return false;
        }
        
        // Validate expiry date
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showToast('Card has expired', 'danger');
            return false;
        }
    }
    
    return true;
}

// Process payment
function processPayment() {
    const btn = confirmPaymentBtn;
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    
    // Get payment data
    const paymentData = {
        method: document.querySelector('input[name="paymentMethod"]:checked').id,
        amount: 150.00,
        bookingId: 'BR-2024-1234',
        timestamp: new Date().toISOString()
    };
    
    if (paymentData.method === 'card') {
        paymentData.card = {
            number: document.getElementById('cardNumber').value.replace(/\s/g, ''),
            name: document.getElementById('cardName').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value,
            saveCard: document.getElementById('saveCard').checked
        };
    }
    
    // Simulate payment processing
    setTimeout(() => {
        console.log('Payment data:', paymentData);
        
        // In production, this would call your payment gateway API
        // Example: Stripe, PayPal, etc.
        
        // Simulate successful payment
        const success = true;
        
        if (success) {
            // Store booking confirmation
            const bookingConfirmation = {
                bookingId: 'BR-2024-1234',
                status: 'confirmed',
                paymentStatus: 'escrowed',
                amount: 150.00,
                date: 'April 15, 2024',
                time: '10:00 AM',
                braider: 'Braid\'s Beauty',
                service: 'Box Braids'
            };
            
            localStorage.setItem('lastBooking', JSON.stringify(bookingConfirmation));
            
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Send confirmation email (in production)
            sendConfirmationEmail(bookingConfirmation);
            
            // Notify braider (in production)
            notifyBraider(bookingConfirmation);
        } else {
            btn.disabled = false;
            btn.innerHTML = originalText;
            showToast('Payment failed. Please try again.', 'danger');
        }
    }, 3000);
}

// Send confirmation email
function sendConfirmationEmail(booking) {
    console.log('Sending confirmation email for booking:', booking.bookingId);
    // In production, this would call your email service API
}

// Notify braider
function notifyBraider(booking) {
    console.log('Notifying braider about new booking:', booking.bookingId);
    // In production, this would send push notification or SMS
}

// Toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Load booking data from session
window.addEventListener('load', () => {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
        const data = JSON.parse(bookingData);
        console.log('Loaded booking data:', data);
        // Update UI with booking data
    }
});

// Luhn algorithm for card validation
function validateCardNumber(number) {
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Security features
// Prevent copy/paste of CVV
if (cvvInput) {
    cvvInput.addEventListener('paste', (e) => {
        e.preventDefault();
        showToast('For security, please type your CVV', 'warning');
    });
}

// Clear sensitive data on page unload
window.addEventListener('beforeunload', () => {
    if (document.getElementById('cardNumber')) {
        document.getElementById('cardNumber').value = '';
        document.getElementById('cvv').value = '';
    }
});
