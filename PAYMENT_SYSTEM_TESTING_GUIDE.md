# Payment System Testing Guide

## Test Environment Setup

### Prerequisites
- App running on `http://localhost:5178/`
- User logged in as customer or admin
- Browser console open for debugging

## Test Scenarios

### 1. Payment Form Navigation

**Test Case 1.1: Access Payment Page**
```
Steps:
1. Login as customer
2. Navigate to http://localhost:5178/payment
3. Verify payment form loads

Expected Result:
- Payment form displays
- Booking summary shows
- Escrow information visible
- No console errors
```

**Test Case 1.2: Country Selection**
```
Steps:
1. Click country dropdown
2. Select different countries (US, GB, IN, NG, ZA)
3. Verify providers update

Expected Result:
- Providers filter correctly
- Available providers display
- Currency updates automatically
```

**Test Case 1.3: Provider Selection**
```
Steps:
1. Select country (US)
2. Click different provider cards
3. Verify methods update

Expected Result:
- Provider card highlights
- Payment methods update
- Currency options change
```

### 2. Payment Method Testing

**Test Case 2.1: Card Payment**
```
Steps:
1. Select Stripe provider
2. Select Card method
3. Enter card details:
   - Name: Test User
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
4. Click Pay

Expected Result:
- Form validates
- Payment processes
- Success message displays
- Redirects to bookings
```

**