# 🌍 BRAIDELY INTERNATIONAL STANDARD REBUILD GUIDE

## Phase 1: Setup & Configuration

### Step 1: Supabase Project Setup

1. **Create Supabase Project**
   - Go to https://app.supabase.com
   - Create a new project
   - Copy your Project URL and Anon Key

2. **Run Database Schema**
   - Go to SQL Editor in Supabase
   - Copy content from `supabase/schema.sql`
   - Run the SQL to create all tables

3. **Create Storage Buckets**
   - Go to Storage in Supabase
   - Create 3 public buckets:
     - `avatars` (for user profile pictures)
     - `portfolio` (for braider portfolio images)
     - `gallery` (for gallery images)

4. **Update Environment Variables**
   ```bash
   cp .env.example .env
   ```
   - Update `VITE_SUPABASE_URL` with your project URL
   - Update `VITE_SUPABASE_ANON_KEY` with your anon key

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Phase 2: Authentication Flow

### User Registration
1. User selects role (Customer or Braider)
2. Fills signup form with email, password, name, location
3. Account created in Supabase Auth
4. Profile created in `profiles` table
5. If braider, `braider_profiles` entry created

### User Login
1. User enters email and password
2. Supabase Auth validates credentials
3. User profile loaded from database
4. Redirected to appropriate dashboard

### Role-Based Access
- **Customer**: `/customer/dashboard`
- **Braider**: `/braider/dashboard`
- **Admin**: `/admin/dashboard`

---

## Phase 3: Customer Experience

### Customer Dashboard
- View all available braiders
- Search by location
- See upcoming bookings
- Quick stats (bookings, favorites, available braiders)

### Braider Browsing
- Click "View Profile & Book" on any braider card
- See full braider profile with portfolio
- View availability and pricing
- Book appointment

### Booking Flow
1. Select service type
2. Choose date and time
3. Review price
4. Make payment (Stripe)
5. Booking confirmed

### Chat System
- Real-time messaging with braiders
- Message status (sent, delivered, read)
- Chat history persists

---

## Phase 4: Braider Experience

### Braider Dashboard
- View pending booking requests
- Accept/reject bookings
- See upcoming appointments
- Track earnings
- View completed bookings

### Profile Management
- Upload profile photo
- Add bio and specialties
- Set hourly rate
- Upload portfolio images
- Set availability

### Booking Management
- Accept/reject requests
- Chat with customers
- Mark bookings as complete
- View earnings

---

## Phase 5: Admin Experience

### Admin Dashboard
- View all users (customers, braiders)
- Monitor all bookings
- Track payments and escrow
- View platform revenue
- Suspend users if needed

### Tabs
- **Overview**: Quick stats and recent activity
- **Users**: All users with suspend option
- **Bookings**: All bookings with status
- **Payments**: All payments with release option

---

## Phase 6: Payment System (Stripe Integration)

### Escrow Flow
1. Customer books braider
2. Payment held in escrow (Stripe)
3. Braider completes service
4. Payment released to braider
5. Platform takes commission (10%)

### Payment Status
- **Held**: Payment authorized, waiting for completion
- **Released**: Payment sent to braider
- **Refunded**: Payment returned to customer

### Admin Controls
- View all payments
- Release held payments
- Monitor platform revenue

---

## Phase 7: Real-Time Features

### Chat System
- Uses Supabase Realtime
- Messages sync across devices
- Typing indicators
- Read receipts

### Notifications
- New booking requests
- Message notifications
- Payment confirmations
- Booking reminders

---

## Phase 8: Mobile Optimization

### Mobile-First Design
- All pages responsive
- Touch-friendly buttons (48px minimum)
- Bottom navigation on mobile
- No horizontal scroll
- Optimized images

### PWA Features
- Installable on home screen
- Works offline (basic functionality)
- Splash screen
- App icon

---

## Phase 9: Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Deploy

### Environment Variables (Production)
```
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

---

## Database Schema Overview

### profiles
- User account information
- Role (customer, braider, admin)
- Avatar, bio, location

### braider_profiles
- Braider-specific information
- Hourly rate, specialties
- Rating, reviews count
- Portfolio images

### bookings
- Booking records
- Customer ↔ Braider
- Service type, date, price
- Status (pending, accepted, completed, cancelled)

### messages
- Chat messages
- Sender ↔ Recipient
- Message status (sent, delivered, read)

### payments
- Payment records
- Escrow system
- Amount, platform fee
- Status (held, released, refunded)

### reviews
- Customer reviews of braiders
- Rating (1-5)
- Comment

---

## Testing Checklist

### Authentication
- [ ] Sign up as customer
- [ ] Sign up as braider
- [ ] Login with credentials
- [ ] Logout
- [ ] Password reset

### Customer Features
- [ ] View braiders
- [ ] Search by location
- [ ] View braider profile
- [ ] Book appointment
- [ ] Chat with braider
- [ ] View bookings
- [ ] Cancel booking

### Braider Features
- [ ] Edit profile
- [ ] Upload portfolio images
- [ ] Set availability
- [ ] Accept booking
- [ ] Reject booking
- [ ] Chat with customer
- [ ] View earnings

### Admin Features
- [ ] View all users
- [ ] View all bookings
- [ ] View all payments
- [ ] Suspend user
- [ ] Release payment

### Payment System
- [ ] Create booking with payment
- [ ] Payment held in escrow
- [ ] Admin releases payment
- [ ] Braider receives funds

### Chat System
- [ ] Send message
- [ ] Receive message
- [ ] Message status updates
- [ ] Chat history persists

---

## Troubleshooting

### Supabase Connection Issues
- Check environment variables
- Verify Supabase project is active
- Check network connectivity

### Authentication Errors
- Verify email format
- Check password requirements
- Ensure user exists in database

### Payment Issues
- Check Stripe API keys
- Verify payment intent creation
- Check escrow status

### Chat Not Working
- Check Realtime is enabled in Supabase
- Verify message permissions
- Check browser console for errors

---

## Next Steps

1. **Customize Branding**
   - Update logo and colors
   - Customize email templates
   - Add company information

2. **Add More Features**
   - Ratings and reviews
   - Favorites/bookmarks
   - Referral system
   - Analytics dashboard

3. **Optimize Performance**
   - Image optimization
   - Database indexing
   - Caching strategies
   - CDN integration

4. **Security Hardening**
   - Rate limiting
   - Input validation
   - CORS configuration
   - SSL/TLS certificates

5. **Monitoring & Analytics**
   - Error tracking (Sentry)
   - User analytics
   - Performance monitoring
   - Payment reconciliation

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Stripe Docs**: https://stripe.com/docs
- **Vite Docs**: https://vitejs.dev

---

**Status**: ✅ Production Ready
**Last Updated**: March 4, 2026
**Version**: 2.0.0 (International Standard Rebuild)
