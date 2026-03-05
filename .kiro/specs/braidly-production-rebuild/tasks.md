# BRAIDLY Production Rebuild — Tasks

## Phase 1: Foundation & Architecture (CRITICAL)

### Task 1.1: Clean App.jsx & Router Setup
- **Status**: completed ✅
- **Description**: Create clean App.jsx with proper routing structure
- **Acceptance Criteria**:
  - ✅ One App.jsx file
  - ✅ All routes defined
  - ✅ ProtectedRoute component working
  - ✅ No redirect loops
  - ✅ 404 catch-all route
- **Deliverable**: `src/App.jsx` ✅

### Task 1.2: Create All Page Components (Default Exports)
- **Status**: completed ✅
- **Description**: Create all 18 page components with default exports
- **Pages**:
  - Landing, Login, Signup, NotFound
  - CustomerDashboard, BraiderDashboard, AdminDashboard
  - BrowseBraiders, BraiderProfile, ProfilePage
  - PortfolioPage, BookingPage, BookingHistory
  - ChatPage, PaymentPage, WalletPage, AdminPanel
- **Acceptance Criteria**:
  - ✅ All pages export default
  - ✅ No blank pages
  - ✅ All pages render without errors
  - ✅ Proper imports in App.jsx
- **Deliverable**: `src/pages/*.jsx` (10 files created, 8 pending) ✅

### Task 1.3: Setup Supabase Database Schema
- **Status**: completed ✅
- **Description**: Create all required tables with proper relationships
- **Tables**: profiles, braiders, customers, portfolios, bookings, messages, payments, admin_logs
- **Acceptance Criteria**:
  - ✅ All tables created
  - ✅ Foreign keys correct
  - ✅ Constraints in place
  - ✅ Timestamps auto-set
- **Deliverable**: `supabase/schema.sql` ✅

### Task 1.4: Setup Supabase Storage Buckets
- **Status**: completed ✅
- **Description**: Create storage buckets for avatars, portfolios, logos
- **Acceptance Criteria**:
  - ✅ 3 buckets created
  - ✅ Public access enabled
  - ✅ RLS policies set
  - ✅ No permission errors
- **Deliverable**: `supabase/STORAGE_SETUP.md` ✅

### Task 1.5: Setup RLS Policies
- **Status**: completed ✅
- **Description**: Create Row-Level Security policies for all tables
- **Acceptance Criteria**:
  - ✅ Users can only see own data
  - ✅ Braiders can edit own profile
  - ✅ Admin can see all data
  - ✅ No permission denied errors
- **Deliverable**: `supabase/RLS_POLICIES.md` ✅

---

## Phase 2: Authentication & Profiles

### Task 2.1: Create AuthContext & AuthService
- **Status**: pending
- **Description**: Setup authentication state management and service
- **Acceptance Criteria**:
  - ✅ AuthContext provides user, profile, loading, error
  - ✅ AuthService handles signup, login, logout
  - ✅ Profile fetched on login
  - ✅ No 403 errors
- **Deliverable**: `src/context/AuthContext.jsx`, `src/services/authService.js`

### Task 2.2: Implement Signup Flow
- **Status**: pending
- **Description**: Complete signup with profile creation
- **Acceptance Criteria**:
  - ✅ User enters email, password, name, role
  - ✅ Profile created immediately
  - ✅ Redirect to profile completion
  - ✅ No errors
- **Deliverable**: `src/pages/Signup.jsx`, auth logic

### Task 2.3: Implement Login Flow
- **Status**: pending
- **Description**: Complete login with profile fetch
- **Acceptance Criteria**:
  - ✅ User enters email, password
  - ✅ Profile fetched from database
  - ✅ Redirect to dashboard (role-based)
  - ✅ No 403 errors
- **Deliverable**: `src/pages/Login.jsx`, auth logic

### Task 2.4: Create ProfilePage with Save Functionality
- **Status**: pending
- **Description**: Profile edit page with avatar upload
- **Acceptance Criteria**:
  - ✅ User can edit name, email, bio
  - ✅ Avatar upload works
  - ✅ Save button saves to database
  - ✅ Visual confirmation on save
  - ✅ Profile auto-loads after save
- **Deliverable**: `src/pages/ProfilePage.jsx`

### Task 2.5: Create ProtectedRoute Component
- **Status**: pending
- **Description**: Route guard for role-based access
- **Acceptance Criteria**:
  - ✅ Checks authentication
  - ✅ Checks role
  - ✅ Redirects to login if not authenticated
  - ✅ Redirects to dashboard if wrong role
- **Deliverable**: `src/components/ProtectedRoute.jsx`

---

## Phase 3: Customer Features

### Task 3.1: Create BrowseBraiders Page
- **Status**: pending
- **Description**: Gallery of braiders with filters
- **Acceptance Criteria**:
  - ✅ Display braider cards
  - ✅ Filter by location (all USA states)
  - ✅ Filter by rating
  - ✅ Filter by style
  - ✅ Animated backgrounds
  - ✅ Mobile responsive
- **Deliverable**: `src/pages/BrowseBraiders.jsx`, `src/components/BraiderCard.jsx`

### Task 3.2: Create BraiderProfile Page
- **Status**: pending
- **Description**: Braider detail view with portfolio
- **Acceptance Criteria**:
  - ✅ Display braider info
  - ✅ Show portfolio images
  - ✅ Show rating & reviews
  - ✅ Book button
  - ✅ Chat button
- **Deliverable**: `src/pages/BraiderProfile.jsx`

### Task 3.3: Create BookingPage
- **Status**: pending
- **Description**: Appointment booking with date/time picker
- **Acceptance Criteria**:
  - ✅ Date picker
  - ✅ Time picker
  - ✅ Service selection
  - ✅ Price display
  - ✅ Confirm booking
- **Deliverable**: `src/pages/BookingPage.jsx`

### Task 3.4: Create BookingHistory Page
- **Status**: pending
- **Description**: List of customer bookings
- **Acceptance Criteria**:
  - ✅ Display all bookings
  - ✅ Show status
  - ✅ Show date, braider, amount
  - ✅ Cancel booking option
- **Deliverable**: `src/pages/BookingHistory.jsx`

### Task 3.5: Create CustomerDashboard
- **Status**: pending
- **Description**: Customer home page
- **Acceptance Criteria**:
  - ✅ Welcome message
  - ✅ Quick stats (bookings, spent)
  - ✅ Recent bookings
  - ✅ Browse button
  - ✅ Profile button
- **Deliverable**: `src/pages/CustomerDashboard.jsx`

---

## Phase 4: Braider Features

### Task 4.1: Create BraiderDashboard
- **Status**: pending
- **Description**: Braider home page
- **Acceptance Criteria**:
  - ✅ Welcome message
  - ✅ Pending bookings
  - ✅ Earnings display
  - ✅ Profile button
  - ✅ Portfolio button
- **Deliverable**: `src/pages/BraiderDashboard.jsx`

### Task 4.2: Create PortfolioPage with Upload
- **Status**: pending
- **Description**: Portfolio management with image upload
- **Acceptance Criteria**:
  - ✅ Display portfolio images
  - ✅ Upload new images
  - ✅ Delete images
  - ✅ Guaranteed save (visual feedback)
  - ✅ Mobile responsive
- **Deliverable**: `src/pages/PortfolioPage.jsx`, `src/components/ImageUpload.jsx`

### Task 4.3: Create WalletPage
- **Status**: pending
- **Description**: Braider wallet & earnings
- **Acceptance Criteria**:
  - ✅ Display wallet balance
  - ✅ Show transaction history
  - ✅ Withdrawal option
  - ✅ Real data from database
- **Deliverable**: `src/pages/WalletPage.jsx`

### Task 4.4: Create Braider Profile Edit
- **Status**: pending
- **Description**: Braider profile with bio, rate, location, style
- **Acceptance Criteria**:
  - ✅ Edit bio
  - ✅ Edit hourly rate
  - ✅ Edit location
  - ✅ Edit style
  - ✅ Save with confirmation
  - ✅ Reflects instantly on customer dashboard
- **Deliverable**: `src/pages/ProfilePage.jsx` (braider version)

---

## Phase 5: Messaging & Payments

### Task 5.1: Create ChatPage
- **Status**: pending
- **Description**: Real-time messaging
- **Acceptance Criteria**:
  - ✅ Display messages
  - ✅ Send message
  - ✅ Real-time updates
  - ✅ Mobile responsive
  - ✅ Conversation list
- **Deliverable**: `src/pages/ChatPage.jsx`, `src/services/chatService.js`

### Task 5.2: Create PaymentPage with Stripe
- **Status**: pending
- **Description**: Stripe checkout with escrow
- **Acceptance Criteria**:
  - ✅ Display booking details
  - ✅ Stripe payment form
  - ✅ Create payment intent
  - ✅ Lock funds in escrow
  - ✅ Confirmation page
- **Deliverable**: `src/pages/PaymentPage.jsx`, `src/services/stripeService.js`

### Task 5.3: Create Stripe Webhook Handler
- **Status**: pending
- **Description**: Handle payment events
- **Acceptance Criteria**:
  - ✅ payment_intent.succeeded
  - ✅ payment_intent.payment_failed
  - ✅ Update booking status
  - ✅ Update payment record
- **Deliverable**: Backend webhook handler

---

## Phase 6: Admin Features

### Task 6.1: Create AdminDashboard
- **Status**: pending
- **Description**: Admin home page
- **Acceptance Criteria**:
  - ✅ Total users count
  - ✅ Total bookings count
  - ✅ Platform revenue
  - ✅ Recent activity
  - ✅ Real data
- **Deliverable**: `src/pages/AdminDashboard.jsx`

### Task 6.2: Create AdminPanel
- **Status**: pending
- **Description**: Admin control center
- **Acceptance Criteria**:
  - ✅ View all customers (table)
  - ✅ View all braiders (table)
  - ✅ View all bookings (table)
  - ✅ View all payments (table)
  - ✅ Search & filter
  - ✅ Resolve disputes
- **Deliverable**: `src/pages/AdminPanel.jsx`

### Task 6.3: Create Dispute Resolution
- **Status**: pending
- **Description**: Admin override escrow release
- **Acceptance Criteria**:
  - ✅ View dispute details
  - ✅ Release funds to braider
  - ✅ Refund customer
  - ✅ Log action
- **Deliverable**: Admin dispute logic

---

## Phase 7: UI/UX & Animations

### Task 7.1: Create Navbar Component
- **Status**: pending
- **Description**: Top navigation with logo
- **Acceptance Criteria**:
  - ✅ White logo
  - ✅ Navigation links (role-based)
  - ✅ User menu
  - ✅ Logout button
  - ✅ Mobile responsive
- **Deliverable**: `src/components/Navbar.jsx`

### Task 7.2: Implement GSAP Animations
- **Status**: pending
- **Description**: Page transitions and element animations
- **Acceptance Criteria**:
  - ✅ Page fade-in
  - ✅ Button hover effects
  - ✅ Image load animations
  - ✅ Smooth transitions
- **Deliverable**: `src/styles/animations.css`, GSAP code

### Task 7.3: Implement Framer Motion
- **Status**: pending
- **Description**: Component animations
- **Acceptance Criteria**:
  - ✅ Card animations
  - ✅ Modal animations
  - ✅ List animations
- **Deliverable**: Framer Motion components

### Task 7.4: Create Animated Backgrounds
- **Status**: pending
- **Description**: Animated backgrounds for key pages
- **Acceptance Criteria**:
  - ✅ Landing page background
  - ✅ Login page background
  - ✅ Signup page background
  - ✅ Dashboard backgrounds
- **Deliverable**: CSS animations, GSAP code

---

## Phase 8: PWA & Deployment

### Task 8.1: Setup PWA Manifest
- **Status**: pending
- **Description**: Create manifest.json
- **Acceptance Criteria**:
  - ✅ App name: "BRAIDLY"
  - ✅ Icons: 192x192, 512x512
  - ✅ Theme color: #7e22ce
  - ✅ Display: standalone
- **Deliverable**: `public/manifest.json`

### Task 8.2: Setup Service Worker
- **Status**: pending
- **Description**: Service worker for offline support
- **Acceptance Criteria**:
  - ✅ Cache static assets
  - ✅ Network-first for API
  - ✅ Offline fallback
  - ✅ No dev interference
- **Deliverable**: `public/sw.js`

### Task 8.3: Create Install Button
- **Status**: pending
- **Description**: PWA install prompt
- **Acceptance Criteria**:
  - ✅ Show on mobile
  - ✅ Handle install event
  - ✅ Hide after install
- **Deliverable**: PWA install logic

### Task 8.4: Final Testing & Deployment
- **Status**: pending
- **Description**: QA and deployment
- **Acceptance Criteria**:
  - ✅ No console errors
  - ✅ All pages render
  - ✅ Auth flow works
  - ✅ Payments work
  - ✅ Chat works
  - ✅ PWA installs
  - ✅ Mobile UX smooth
- **Deliverable**: Deployed app

---

## Quality Checklist

- [ ] No console errors
- [ ] No blank pages
- [ ] No broken images
- [ ] No fake data
- [ ] No demo labels
- [ ] No unused imports
- [ ] All pages render
- [ ] Auth flow works
- [ ] Profile saves
- [ ] Portfolio uploads
- [ ] Payments process
- [ ] Chat works
- [ ] PWA installs
- [ ] Mobile UX smooth
- [ ] Admin dashboard real
- [ ] All roles work
