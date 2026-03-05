# 🚀 BRAIDELY SETUP INSTRUCTIONS

## Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone <your-repo>
cd braidly
npm install
```

### 2. Setup Supabase
1. Go to https://app.supabase.com
2. Create a new project
3. Copy your **Project URL** and **Anon Key**
4. Create `.env` file:
```bash
cp .env.example .env
```
5. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Setup Database
1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy all content from `supabase/schema.sql`
4. Paste and run the SQL

### 4. Create Storage Buckets
In Supabase Storage, create 3 **public** buckets:
- `avatars`
- `portfolio`
- `gallery`

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Test Accounts

### Customer Account
- Email: `customer@test.com`
- Password: `Test123!`

### Braider Account
- Email: `braider@test.com`
- Password: `Test123!`

### Admin Account
- Email: `admin@test.com`
- Password: `Test123!`

---

## Project Structure

```
braidly/
├── src/
│   ├── pages/              # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── BraiderDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ChatPage.jsx
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Button.jsx
│   │   ├── BraiderCard.jsx
│   │   └── ...
│   ├── context/            # State management
│   │   └── AuthContext.jsx
│   ├── services/           # API services
│   │   └── supabaseClient.js
│   ├── App.jsx
│   └── App.css
├── public/                 # Static files
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── supabase/
│   └── schema.sql         # Database schema
├── .env.example           # Environment template
├── package.json
└── vite.config.js
```

---

## Key Features Implemented

### ✅ Authentication
- Email/password signup and login
- Role-based access (customer, braider, admin)
- Secure session management
- Protected routes

### ✅ Customer Dashboard
- Browse all braiders
- Search by location
- View braider profiles
- Book appointments
- Chat with braiders
- View booking history

### ✅ Braider Dashboard
- Manage bookings (accept/reject)
- Edit profile and portfolio
- Track earnings
- Chat with customers
- View completed bookings

### ✅ Admin Dashboard
- View all users
- Monitor bookings
- Track payments
- Release escrow payments
- Suspend users

### ✅ Chat System
- Real-time messaging
- Message status (sent, delivered, read)
- Chat history
- Works on mobile

### ✅ Payment System
- Stripe integration ready
- Escrow system
- Payment tracking
- Platform commission (10%)

### ✅ Mobile Optimization
- Fully responsive design
- Touch-friendly buttons
- Mobile-first layout
- PWA ready

---

## Environment Variables

### Required
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Optional
```
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_APP_URL=http://localhost:5173
```

---

## Database Schema

### profiles
- User account information
- Role, avatar, bio, location

### braider_profiles
- Braider-specific data
- Rate, specialties, rating

### bookings
- Booking records
- Customer ↔ Braider
- Status tracking

### messages
- Chat messages
- Real-time sync

### payments
- Payment records
- Escrow system
- Commission tracking

---

## Common Tasks

### Add a New Page
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Create CSS file
4. Import and use

### Add a New Component
1. Create file in `src/components/`
2. Create CSS file
3. Export from component
4. Import in pages

### Query Database
```javascript
import { dbService } from '../services/supabaseClient'

// Get all braiders
const braiders = await dbService.getAllBraiders()

// Get customer bookings
const bookings = await dbService.getCustomerBookings(userId)

// Create booking
const booking = await dbService.createBooking(bookingData)
```

### Use Authentication
```javascript
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, profile, signOut } = useAuth()
  
  return <div>{profile?.full_name}</div>
}
```

---

## Deployment

### Vercel (Recommended)
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

### Build for Production
```bash
npm run build
npm run preview
```

---

## Troubleshooting

### Supabase Connection Error
- Check environment variables
- Verify Supabase project is active
- Check network connectivity

### Authentication Not Working
- Verify email format
- Check password requirements
- Ensure user exists in database

### Database Queries Failing
- Check RLS policies
- Verify table permissions
- Check SQL syntax

### Chat Not Working
- Enable Realtime in Supabase
- Check message permissions
- Verify browser console

---

## Next Steps

1. **Customize Branding**
   - Update logo and colors
   - Customize email templates
   - Add company information

2. **Add Features**
   - Ratings and reviews
   - Favorites system
   - Referral program
   - Analytics

3. **Optimize Performance**
   - Image optimization
   - Database indexing
   - Caching strategies
   - CDN integration

4. **Security**
   - Rate limiting
   - Input validation
   - CORS configuration
   - SSL/TLS

5. **Monitoring**
   - Error tracking
   - User analytics
   - Performance monitoring
   - Payment reconciliation

---

## Support

- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Stripe**: https://stripe.com/docs

---

**Status**: ✅ Ready for Development
**Last Updated**: March 4, 2026
**Version**: 2.0.0
