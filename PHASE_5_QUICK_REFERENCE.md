# PHASE 5 - QUICK REFERENCE GUIDE

## New Pages & Routes

| Page | Customer Route | Braider Route | Admin Route | Purpose |
|------|---|---|---|---|
| BookingPage | `/customer/booking` | `/braider/booking` | - | Manage appointments |
| PaymentPage | `/customer/payment` | - | - | Process payments |
| WalletPage | - | `/braider/wallet` | - | Manage earnings |
| ChatPage | `/customer/chat` | `/braider/chat` | `/admin/chat` | Messaging |

---

## Database Service Methods

### Bookings
```javascript
// Create booking
await dbService.createBooking(customerId, braiderId, appointmentDate, amount, notes)

// Get bookings
await dbService.getBookings(userId, role) // role: 'customer' or 'braider'

// Update status
await dbService.updateBookingStatus(bookingId, status) // pending, confirmed, completed, cancelled
```

### Payments
```javascript
// Create payment
await dbService.createPayment(bookingId, customerId, braiderId, amount)

// Get payments
await dbService.getPayments(userId, role)

// Update status
await dbService.updatePaymentStatus(paymentId, status) // pending, completed, released, refunded, disputed

// Release to wallet
await dbService.releasePaymentToWallet(paymentId, braiderId, amount)
```

### Wallet
```javascript
// Get wallet info
await dbService.getBraiderWallet(braiderId)

// Withdraw funds
await dbService.withdrawFromWallet(braiderId, amount)
```

### Messages
```javascript
// Send message
await dbService.sendMessage(senderId, recipientId, content)

// Get messages
await dbService.getMessages(userId, otherUserId)

// Mark as read
await dbService.markMessageAsRead(messageId)
```

---

## Component Usage

### BookingPage
```jsx
import BookingPage from './pages/BookingPage'

// In App.jsx routes:
<Route path="/customer/booking" element={<ProtectedRoute requiredRole="customer"><BookingPage /></ProtectedRoute>} />
```

### PaymentPage
```jsx
import PaymentPage from './pages/PaymentPage'

// In App.jsx routes:
<Route path="/customer/payment" element={<ProtectedRoute requiredRole="customer"><PaymentPage /></ProtectedRoute>} />
```

### WalletPage
```jsx
import WalletPage from './pages/WalletPage'

// In App.jsx routes:
<Route path="/braider/wallet" element={<ProtectedRoute requiredRole="braider"><WalletPage /></ProtectedRoute>} />
```

### ChatPage
```jsx
import ChatPage from './pages/ChatPage'

// In App.jsx routes:
<Route path="/customer/chat" element={<ProtectedRoute requiredRole="customer"><ChatPage /></ProtectedRoute>} />
```

---

## Key Features

### BookingPage
- ✅ Create bookings (customers only)
- ✅ View all bookings
- ✅ Confirm/decline bookings (braiders)
- ✅ Mark as completed (braiders)
- ✅ Real-time status updates
- ✅ Empty states

### PaymentPage
- ✅ Select confirmed booking
- ✅ Enter payment details
- ✅ Process payment
- ✅ View payment history
- ✅ Release to wallet (braiders)
- ✅ Status tracking

### WalletPage
- ✅ View balance
- ✅ View total bookings
- ✅ Withdraw funds
- ✅ View payment history
- ✅ Balance validation
- ✅ Access control

### ChatPage
- ✅ Conversation list
- ✅ Message thread
- ✅ Send messages
- ✅ Timestamps
- ✅ Real-time updates
- ✅ Empty states

---

## Database Tables Used

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| bookings | Appointments | customer_id, braider_id, appointment_date, status, amount |
| payments | Payment records | booking_id, customer_id, braider_id, amount, status |
| braiders | Braider data | wallet_balance, total_bookings |
| messages | Chat messages | sender_id, recipient_id, content, read |

---

## Status Values

### Booking Status
- `pending` - Awaiting braider confirmation
- `confirmed` - Braider confirmed
- `completed` - Appointment completed
- `cancelled` - Booking cancelled

### Payment Status
- `pending` - Payment initiated
- `completed` - Payment processed
- `released` - Released to braider wallet
- `refunded` - Payment refunded
- `disputed` - Payment disputed

---

## Error Handling

All pages include:
- Try-catch blocks
- User-friendly error messages
- Loading states
- Empty states
- Validation checks

Example:
```javascript
try {
  const { booking, error } = await dbService.createBooking(...)
  if (error) throw new Error(error)
  // Success handling
} catch (err) {
  setError(err.message)
}
```

---

## Styling

All pages use:
- Purple/Blue/Pink gradient theme
- Glassmorphism backgrounds
- Responsive grid layouts
- Mobile-first design
- Smooth animations
- Status color coding

---

## Testing

### Manual Testing Steps

1. **Booking Flow**
   - Login as customer
   - Go to `/customer/booking`
   - Create booking
   - Login as braider
   - Go to `/braider/booking`
   - Confirm booking

2. **Payment Flow**
   - Login as customer
   - Go to `/customer/payment`
   - Select confirmed booking
   - Enter payment details
   - Process payment

3. **Wallet Flow**
   - Login as braider
   - Go to `/braider/wallet`
   - View balance
   - Withdraw funds

4. **Chat Flow**
   - Login as customer
   - Go to `/customer/chat`
   - Send message
   - Login as braider
   - Go to `/braider/chat`
   - View message

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Bookings not showing | Check user role and ID in database |
| Payment not processing | Verify booking is confirmed |
| Wallet balance not updating | Check withdrawal amount vs balance |
| Messages not appearing | Verify sender_id and recipient_id |

---

## Next Phase (Phase 6)

- Admin dashboard
- Dispute resolution
- User management
- Analytics
- Notifications

