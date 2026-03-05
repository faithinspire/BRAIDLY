# BRAIDLY Production Rebuild — Design

## Architecture Overview

### Folder Structure
```
src/
├── App.jsx                          # Main router (clean, simple)
├── main.jsx                         # Entry point
├── index.css                        # Global styles
├── App.css                          # App-level styles
│
├── pages/                           # All pages (default exports)
│   ├── Landing.jsx                  # Home page
│   ├── Login.jsx                    # Auth login
│   ├── Signup.jsx                   # Auth signup
│   ├── NotFound.jsx                 # 404 page
│   ├── CustomerDashboard.jsx        # Customer home
│   ├── BraiderDashboard.jsx         # Braider home
│   ├── AdminDashboard.jsx           # Admin home
│   ├── BrowseBraiders.jsx           # Gallery + filters
│   ├── BraiderProfile.jsx           # Braider detail view
│   ├── ProfilePage.jsx              # User profile edit
│   ├── PortfolioPage.jsx            # Portfolio management
│   ├── BookingPage.jsx              # Booking creation
│   ├── BookingHistory.jsx           # Booking list
│   ├── ChatPage.jsx                 # Messaging
│   ├── PaymentPage.jsx              # Stripe checkout
│   ├── WalletPage.jsx               # Braider wallet
│   └── AdminPanel.jsx               # Admin controls
│
├── components/                      # Reusable components
│   ├── Navbar.jsx                   # Top navigation
│   ├── BraiderCard.jsx              # Gallery card
│   ├── Button.jsx                   # Styled button
│   ├── Modal.jsx                    # Modal dialog
│   ├── Form.jsx                     # Form wrapper
│   ├── ImageUpload.jsx              # File upload
│   ├── ChatBox.jsx                  # Chat UI
│   ├── ProtectedRoute.jsx           # Auth guard
│   ├── ErrorBoundary.jsx            # Error handler
│   └── LoadingSpinner.jsx           # Loading state
│
├── context/                         # State management
│   ├── AuthContext.jsx              # Auth state
│   └── BraidlyContext.jsx           # App state
│
├── services/                        # API & external services
│   ├── supabaseClient.js            # Supabase setup
│   ├── authService.js               # Auth logic
│   ├── dbService.js                 # Database queries
│   ├── storageService.js            # File uploads
│   ├── stripeService.js             # Stripe integration
│   └── chatService.js               # Messaging
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.js                   # Auth hook
│   ├── useProfile.js                # Profile hook
│   └── useBooking.js                # Booking hook
│
├── utils/                           # Utilities
│   ├── validators.js                # Form validation
│   ├── formatters.js                # Data formatting
│   └── constants.js                 # App constants
│
└── styles/                          # Global styles
    ├── tailwind.css                 # TailwindCSS
    ├── animations.css               # GSAP animations
    └── theme.css                    # Color theme
```

---

## Component Architecture

### App.jsx (Clean Router)
```jsx
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Customer routes */}
          <Route path="/customer/dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute role="customer"><ProfilePage /></ProtectedRoute>} />
          <Route path="/customer/browse" element={<ProtectedRoute role="customer"><BrowseBraiders /></ProtectedRoute>} />
          <Route path="/customer/booking" element={<ProtectedRoute role="customer"><BookingPage /></ProtectedRoute>} />
          <Route path="/customer/chat" element={<ProtectedRoute role="customer"><ChatPage /></ProtectedRoute>} />
          
          {/* Braider routes */}
          <Route path="/braider/dashboard" element={<ProtectedRoute role="braider"><BraiderDashboard /></ProtectedRoute>} />
          <Route path="/braider/profile" element={<ProtectedRoute role="braider"><ProfilePage /></ProtectedRoute>} />
          <Route path="/braider/portfolio" element={<ProtectedRoute role="braider"><PortfolioPage /></ProtectedRoute>} />
          <Route path="/braider/wallet" element={<ProtectedRoute role="braider"><WalletPage /></ProtectedRoute>} />
          <Route path="/braider/chat" element={<ProtectedRoute role="braider"><ChatPage /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/panel" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

---

## Database Schema (Supabase)

### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('customer', 'braider', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### braiders table
```sql
CREATE TABLE braiders (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  location TEXT,
  style TEXT,
  hourly_rate DECIMAL(10,2),
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### portfolios table
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  braider_id UUID NOT NULL REFERENCES braiders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### bookings table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  braider_id UUID NOT NULL REFERENCES braiders(id),
  appointment_date TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### messages table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### payments table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  braider_id UUID NOT NULL REFERENCES braiders(id),
  amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'completed', 'released', 'disputed')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Storage Buckets

### avatars
- Path: `avatars/{user_id}/{filename}`
- Public: Yes (for profile images)
- RLS: Users can upload/delete own avatar

### portfolios
- Path: `portfolios/{braider_id}/{filename}`
- Public: Yes (for gallery display)
- RLS: Braiders can upload/delete own portfolio

### logos
- Path: `logos/{filename}`
- Public: Yes
- RLS: Admin only

---

## Authentication Flow

1. **Signup**
   - User enters email, password, name, role
   - Supabase Auth creates user
   - Create profile record immediately
   - Redirect to profile completion
   - Set role in profile

2. **Login**
   - User enters email, password
   - Supabase Auth validates
   - Fetch profile from database
   - Set auth context
   - Redirect to dashboard (role-based)

3. **Protected Routes**
   - Check auth context
   - Verify role matches route
   - Redirect to login if not authenticated
   - Redirect to dashboard if wrong role

---

## UI/UX Design System

### Colors
- **Primary**: Purple (#7e22ce)
- **Secondary**: Blue (#3b82f6)
- **Accent**: White (#ffffff)
- **Background**: Dark (#1a1a1a)
- **Text**: Light (#f5f5f5)

### Typography
- **Headings**: Bold, 32px+
- **Body**: Regular, 16px
- **Labels**: Medium, 14px

### Components
- **Buttons**: Rounded, 8px, hover effects
- **Cards**: Rounded, 12px, shadow
- **Inputs**: Rounded, 6px, border
- **Icons**: Font Awesome 6.4.0

### Animations
- **Page transitions**: GSAP fade-in
- **Button hover**: Scale + shadow
- **Image load**: Fade-in
- **Background**: Parallax scroll

---

## Mobile-First Approach

- **Breakpoints**: 320px, 640px, 1024px, 1280px
- **Touch targets**: 44px minimum
- **Spacing**: 8px grid
- **Typography**: Responsive scaling
- **Images**: Lazy loading
- **Performance**: <3s load time

---

## PWA Configuration

### manifest.json
- App name: "BRAIDLY"
- Short name: "Braidly"
- Icons: 192x192, 512x512
- Theme color: #7e22ce
- Display: standalone
- Orientation: portrait-primary

### Service Worker
- Cache static assets
- Network-first for API calls
- Offline fallback page
- No interference with dev server

---

## Error Handling

- **Auth errors**: Show message, redirect to login
- **API errors**: Show toast notification
- **Validation errors**: Inline form errors
- **Network errors**: Retry with exponential backoff
- **Unknown errors**: Error boundary catches, logs to console

---

## Performance Targets

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s
- **Bundle size**: <200KB (gzipped)
