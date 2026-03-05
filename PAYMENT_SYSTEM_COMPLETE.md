# Braidly Payment System - Complete Integration Guide

## Overview

The Braidly payment system provides a comprehensive, international payment processing solution with escrow protection, supporting 7 payment providers across 50+ countries and 30+ currencies.

## System Architecture

### Core Components

1. **Payment Service** (`src/services/paymentService.js`)
   - Provider configuration and management
   - Currency conversion and exchange rates
   - Payment processing with provider-specific handlers
   - Escrow transaction management
   - Fee calculation
   - Webhook handling
   - Payment analytics

2. **Payment Page** (`src/pages/PaymentPage.jsx`)
   - Multi-step payment form
   - Country and currency selection
   - Provider selection
   - Payment method selection
   - Card details input (for card payments)
   - Real-time fee calculation
   - Escrow protection information

3. **Payment History** (`src/pages/PaymentHistory.jsx`)
   - View all past transactions
   - Filter by status
   - Download receipts
   - View detailed payment information

4. **Payment Analytics** (`src/pages/PaymentAnalytics.jsx`)
   - Payment statistics and metrics
   - Provider usage breakdown
   - Payment method distribution
   - Status breakdown
   - Daily transaction tracking
   - Admin-only access

5. **Escrow Management** (`src/pages/EscrowPage.jsx`)
   - View escrow transactions
   - Release funds after service completion
   - Request refunds with reasons
   - Transaction timeline tracking

## Supported Payment Providers

### 1. Stripe
- **Countries**: 50+ (US, CA, GB, AU, DE, FR, IT, ES, NL, BE, AT, CH, SE, NO, DK, FI, IE, PT, GR, CZ, PL, HU, RO, BG, HR, SI, SK, LT, LV, EE, MT, CY, LU, JP, SG, HK, NZ, MX, BR, AR, CL, CO, PE, IN, AE, SA, ZA)
- **Currencies**: 20+ (USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK, NZD, MXN, SGD, HKD, NOK, KRW, TRY, RUB, INR, BRL, ZAR)
- **Methods**: Card, Bank Transfer, Digital Wallet
- **Fee**: 2.9% + $0.30 (card), 1% (bank transfer), 1.5% (wallet)

### 2. PayPal
- **Countries**: 50+ (US, CA, GB, AU, DE, FR, IT, ES, NL, BE, AT, CH, SE, NO, DK, FI, IE, PT, GR, CZ, PL, HU, RO, BG, HR, SI, SK, LT, LV, EE, MT, CY, LU, JP, SG, HK, NZ, MX, BR, AR, CL, CO, PE, IN, AE, SA, ZA, TH, MY, PH, VN, ID)
- **Currencies**: 25+ (USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SEK, NZD, MXN, SGD, HKD, NOK, KRW, TRY, RUB, INR, BRL, ZAR, THB, MYR, PHP, VND, IDR)
- **Methods**: Digital Wallet, Bank Transfer, Card
- **Fee**: 2% (wallet), 1.5% (bank transfer), 3.5% (card)

### 3. Wise (TransferWise)
- **Countries**: 50+ (All major countries)
- **Currencies**: 25+ (All major currencies)
- **Methods**: Bank Transfer
- **Fee**: 1% (bank transfer)
- **Best for**: International bank transfers

### 4. Square
- **Countries**: 6 (US, CA, AU, JP, GB, IE)
- **Currencies**: 6 (USD, CAD, AUD, JPY, GBP, EUR)
- **Methods**: Card, Digital Wallet
- **Fee**: 2.9% + $0.30 (card), 1.5% (wallet)

### 5. Razorpay
- **Countries**: 5 (IN, AE, SA, MY, SG)
- **Currencies**: 5 (INR, AED, SAR, MYR, SGD)
- **Methods**: Card, Digital Wallet, Bank Transfer, UPI
- **Fee**: 2% (card), 1% (wallet), 0.5% (bank transfer), 0% (UPI)
- **Best for**: India and Southeast Asia

### 6. Flutterwave
- **Countries**: 15+ African countries (NG, GH, KE, UG, TZ, RW, ZA, CM, CI, SN, BJ, BW, MW, MZ, ZM, ZW)
- **Currencies**: 10+ (NGN, GHS, KES, UGX, TZS, RWF, ZAR, XAF, XOF, USD)
- **Methods**: Card, Digital Wallet, Bank Transfer, Mobile Money
- **Fee**: 3.5% (card), 2% (wallet), 1% (bank transfer), 1% (mobile money)
- **Best for**: African payments

### 7. Stripe Africa
- **Countries**: 4 (ZA, NG, GH, KE)
- **Currencies**: 5 (ZAR, NGN, GHS, KES, USD)
- **Methods**: Card, Bank Transfer
- **Fee**: 3.5% (card), 1.5% (bank transfer)

## Payment Flow

### Step 1: Initiate Payment
```javascript
// User navigates to /payment
// Booking details are passed as props
const booking = {
  id: 'booking_1',
  price: 150,
  service: 'Box Braids',
  braiderName: 'Sarah',
  date: '2026-03-10'
}
```

### Step 2: Select Location & Currency
- User selects their country
- Available providers are automatically filtered
- User selects currency (auto-populated based on provider)

### Step 3: Select Payment Provider
- Available providers for the selected country are displayed
- User clicks on a provider card to select it

### Step 4: Select Payment Method
- Available methods for the selected provider are displayed
- User selects their preferred payment method

### Step 5: Enter Payment Details
- If card is selected, user enters card details:
  - Cardholder name
  - Card number (formatted with spaces)
  - Expiry date (MM/YY)
  - CVC (3-4 digits)

### Step 6: Review & Confirm
- Booking summary is displayed
- Fees are calculated and shown
- Escrow protection information is displayed
- User clicks "Pay" button

### Step 7: Process Payment
- Payment is processed through the selected provider
- Escrow transaction is created
- Funds are held in escrow
- Success message is displayed
- User is redirected to bookings page

## Escrow System

### Escrow States

1. **Pending** (⏳)
   - Payment initiated but not yet confirmed
   - Funds not yet held

2. **Held** (🔒)
   - Funds are securely held by Braidly
   - Service is being provided
   - Customer can release or request refund

3. **Released** (✓)
   - Customer confirmed satisfaction
   - Funds released to braider
   - Transaction complete

4. **Refunded** (↩️)
   - Customer requested refund
   - Funds returned to customer
   - Transaction cancelled

### Escrow Workflow

```
Payment Initiated
    ↓
Funds Held in Escrow
    ↓
    ├─→ Service Completed → Customer Confirms → Funds Released to Braider
    │
    └─→ Issue Arises → Customer Requests Refund → Funds Returned to Customer
```

## Fee Structure

### Processing Fees
- Vary by provider and payment method
- Automatically calculated based on selection
- Displayed to user before payment

### Platform Fee
- 5% of base amount
- Covers Braidly operations and support
- Included in total amount

### Example Fee Calculation
```
Base Amount: $150.00
Processing Fee (Stripe Card): $4.35 (2.9%)
Platform Fee: $7.50 (5%)
Total: $161.85
```

## API Integration (Production)

### Stripe Integration
```javascript
// In production, replace simulation with:
const response = await fetch('https://api.stripe.com/v1/payment_intents', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
  body: new URLSearchParams({
    amount: Math.round(details.amount * 100),
    currency: details.currency.toLowerCase(),
    payment_method_types: [details.method]
  })
})
```

### PayPal Integration
```javascript
const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${PAYPAL_ACCESS_TOKEN}` },
  body: JSON.stringify({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: { value: details.amount.toString(), currency_code: details.currency }
    }]
  })
})
```

### Wise Integration
```javascript
const response = await fetch('https://api.wise.com/v1/transfers', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${WISE_API_TOKEN}` },
  body: JSON.stringify({
    targetAccount: details.accountId,
    quoteUuid: details.quoteId,
    customerTransactionId: `braidly_${Date.now()}`
  })
})
```

## Webhook Handling

### Supported Events
- `charge.succeeded` - Payment successful
- `charge.failed` - Payment failed
- `charge.refunded` - Payment refunded
- `payment.completed` - Payment completed
- `payment.failed` - Payment failed
- `transfer.completed` - Escrow transfer completed

### Webhook Handler
```javascript
import { handlePaymentWebhook } from './services/paymentService'

// In your webhook endpoint:
const result = handlePaymentWebhook(event)
```

## Data Storage

### localStorage Keys
- `BRAIDLY_PAYMENTS` - Array of all payment transactions
- `BRAIDLY_USER` - Current user information

### Payment Object Structure
```javascript
{
  id: 'payment_1234567890',
  status: 'success',
  amount: 161.85,
  currency: 'USD',
  provider: 'stripe',
  method: 'card',
  timestamp: '2026-03-04T10:30:00Z',
  transactionId: 'txn_abc123def456',
  reference: 'ref_ABC123DEF456',
  escrow: {
    id: 'escrow_1234567890',
    bookingId: 'booking_1',
    amount: 150,
    currency: 'USD',
    paymentMethod: 'card',
    status: 'held',
    createdAt: '2026-03-04T10:30:00Z',
    updatedAt: '2026-03-04T10:30:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2026-03-04T10:30:00Z',
        description: 'Payment pending'
      },
      {
        status: 'held',
        timestamp: '2026-03-04T10:30:05Z',
        description: 'Funds held in escrow'
      }
    ]
  },
  booking: 'booking_1'
}
```

## Routes

### Payment Routes
- `/payment` - Payment form (requires authentication)
- `/payment/history` - Payment history (requires authentication)
- `/payment/analytics` - Payment analytics (admin only)

### Escrow Routes
- `/escrow` - Escrow management (requires authentication)

## Functions Reference

### Payment Service Functions

#### `getPaymentProvidersForCountry(countryCode)`
Returns available payment providers for a country.

#### `getCurrenciesForProvider(providerId)`
Returns available currencies for a provider.

#### `convertCurrency(amount, fromCurrency, toCurrency)`
Converts amount between currencies using exchange rates.

#### `calculatePaymentFees(amount, provider, method)`
Calculates processing and platform fees.

#### `processPayment(paymentDetails)`
Processes payment through the selected provider.

#### `createEscrowTransaction(bookingId, amount, currency, paymentMethod)`
Creates a new escrow transaction.

#### `holdFundsInEscrow(escrowId)`
Holds funds in escrow.

#### `releaseFundsFromEscrow(escrowId, recipientId)`
Releases funds from escrow to recipient.

#### `refundFromEscrow(escrowId, reason)`
Refunds funds from escrow to customer.

#### `getPaymentHistory(userId)`
Gets payment history for a user.

#### `getPaymentById(paymentId)`
Gets a specific payment by ID.

#### `updatePaymentStatus(paymentId, status)`
Updates payment status.

#### `handlePaymentWebhook(event)`
Handles webhook events from payment providers.

#### `getPaymentAnalytics()`
Gets payment analytics and statistics.

#### `initiateRefund(paymentId, reason)`
Initiates a refund for a payment.

#### `generatePaymentReceipt(paymentId)`
Generates a payment receipt.

## Security Considerations

1. **Card Data**
   - Never store full card details
   - Use provider tokenization
   - Implement PCI compliance

2. **API Keys**
   - Store in environment variables
   - Never commit to version control
   - Rotate regularly

3. **Webhooks**
   - Verify webhook signatures
   - Implement idempotency
   - Log all webhook events

4. **Escrow**
   - Implement dispute resolution
   - Add fraud detection
   - Maintain audit logs

## Testing

### Test Payment Details
```
Card Number: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
Name: Test User
```

### Test Scenarios
1. Successful payment with card
2. Successful payment with wallet
3. Successful payment with bank transfer
4. Failed payment
5. Refund request
6. Escrow release

## Future Enhancements

1. **Real API Integration**
   - Implement actual provider APIs
   - Add webhook verification
   - Implement real currency conversion

2. **Advanced Features**
   - Multi-currency wallet
   - Subscription payments
   - Recurring billing
   - Invoice generation

3. **Dispute Resolution**
   - Automated dispute handling
   - Mediation system
   - Appeal process

4. **Compliance**
   - PCI DSS compliance
   - GDPR compliance
   - Regional payment regulations

5. **Analytics**
   - Advanced reporting
   - Fraud detection
   - Payment trends

## Support

For issues or questions about the payment system, contact support@braidly.com

---

**Last Updated**: March 4, 2026
**Version**: 1.0.0
