# BRAIDLY Production Rebuild — Requirements

## Project Overview
**BRAIDLY** — International Braider Booking & Marketplace Web App (PWA)

A professional platform connecting customers with braiders for booking appointments, portfolio browsing, secure payments via Stripe escrow, and real-time messaging.

---

## Core Requirements (Non-Negotiable)

### 1. Clean App Architecture
- ✅ One `App.jsx` with Router
- ✅ All pages export `default`
- ✅ No duplicate files
- ✅ No demo placeholders
- ✅ No dead routes
- ✅ No redirect loops
- ✅ Proper protected routes with role-based access

### 2. User Roles (Real, Not Demo)
Three distinct roles with complete workflows:

#### Customer
- Browse braiders (gallery cards with animations)
- Filter by location (all USA states), rating, style
- Book appointments
- Pay via Stripe escrow
- Chat with braiders
- View booking history
- Manage profile & avatar

#### Braider
- Editable profile with avatar upload
- Portfolio image uploads (guaranteed save)
- Wallet balance tracking
- Booking management
- Chat with customers
- Background animations & GSAP transitions
- Save button with visual confirmation

#### Admin
- View all customers
- View all braiders
- View all bookings
- View payment transactions
- Resolve disputes
- Access chat logs
- Real dashboards (no demo text)

### 3. Auth & Profile Flow (Fixed Forever)
- Sign up → create profile immediately
- Login → fetch profile (no 403 errors)
- Save Profile button must work
- Avatar upload must work
- Profile auto-loads after save
- Braider profile reflects instantly on:
  - Customer dashboard
  - Admin dashboard

### 4. Database (Supabase — Final & Safe)

#### Required Tables
- `profiles` — User profile data (name, email, avatar_url, role)
- `braiders` — Braider-specific data (bio, rating, location, style)
- `customers` — Customer-specific data
- `portfolios` — Braider portfolio images
- `bookings` — Appointment records
- `messages` — Chat messages
- `payments` — Payment transactions
- `admin_logs` — Admin action audit trail

#### Storage Buckets (Create Once)
- `avatars` — User profile pictures
- `portfolios` — Braider portfolio images
- `logos` — Brand assets

#### Quality Rules
- ✅ Use Storage API, not SQL deletes
- ✅ Enable correct RLS policies
- ✅ No duplicate bucket creation
- ✅ No permission denied errors

### 5. Customer Experience (International Standard)
- Browse braiders (animated gallery cards)
- Filter by:
  - Location (all USA states)
  - Rating (1-5 stars)
  - Style (box braids, knotless, etc.)
- Animated background of braider images
- Book appointment (date/time picker)
- Pay via escrow (Stripe Connect)
- Chat with braider (real-time)
- PWA install button
- Works perfectly on mobile (WhatsApp-level UX)

### 6. Braider Experience
- Editable profile (name, bio, location, style, rate)
- Upload portfolio images (guaranteed save with visual feedback)
- Upload avatar (guaranteed save)
- Wallet balance display
- Booking management (accept/decline/complete)
- Chat with customers (real-time)
- Background animation (GSAP)
- Smooth transitions
- Save button MUST save and confirm visually

### 7. Admin Experience (Real Control)
- View all customers (table with search/filter)
- View all braiders (table with search/filter)
- View bookings (status, dates, amounts)
- View payments (transaction history)
- Resolve disputes (override escrow release)
- See chats (moderation)
- No demo text anywhere
- Real dashboards with real data

### 8. Payments (Stripe Connect — Escrow)
- Customer pays → funds locked in escrow
- Funds locked until job completion
- Auto-release after completion
- Admin dispute override capability
- Braider wallet balance tracking
- Admin payment dashboard
- Transaction history

### 9. UI / UX (No Amateur Look)
- Thick bold theme
- Purple accent (strong, consistent)
- White logo in navbar
- Blue bold "BRAIDLY" text on login/signup
- Icons properly spaced (no overlapping)
- Responsive buttons (hover/active states)
- Animated image backgrounds:
  - Landing page
  - Login page
  - Signup page
  - Customer dashboard
  - Braider dashboard

### 10. PWA (Mandatory)
- Installable on mobile & desktop
- Proper manifest.json
- Valid icons (192x192, 512x512)
- Offline support (service worker)
- No manifest errors
- Service worker stable (no interference with dev)

---

## Quality Rules (Absolute)
- ❌ No console errors
- ❌ No blank pages
- ❌ No broken images
- ❌ No fake data
- ❌ No demo labels
- ❌ No unused imports
- ❌ No conflicting schemas
- ✅ All errors logged visibly with explanations

---

## Tech Stack (Mandatory)
- **Frontend**: React (Vite)
- **Routing**: React Router v6
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe Connect (Escrow)
- **Animations**: GSAP + Framer Motion
- **Styling**: TailwindCSS
- **PWA**: Service Worker + Manifest
- **Mobile-First**: WhatsApp-level UX

---

## Deliverables
1. Final folder structure (clean, organized)
2. Clean `App.jsx` with Router
3. Page components (all default exports)
4. Supabase SQL schema
5. Supabase storage setup
6. RLS policies
7. `AuthService.js` (final)
8. Portfolio upload React code
9. Stripe escrow logic
10. GSAP + Framer Motion animations
11. Mobile-first UI
12. PWA configuration

---

## Success Criteria
- ✅ App loads without errors
- ✅ All pages render (no blank screens)
- ✅ Auth flow works (signup → profile → login)
- ✅ Braider profile saves and reflects instantly
- ✅ Portfolio uploads work
- ✅ Payments process via Stripe
- ✅ Chat works real-time
- ✅ PWA installs on mobile
- ✅ Mobile UX is smooth (no lag, no jank)
- ✅ Admin dashboard shows real data
