# Braidly Quick Start Guide

Get Braidly up and running in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- Supabase account (free tier works)
- GitHub account (for deployment)
- Vercel account (for hosting)

## Local Development (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
# Get these from: https://app.supabase.com/project/_/settings/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Test Authentication
- Go to `/signup` to create an account
- Choose role: customer, braider, or admin
- Login with your credentials
- You'll be redirected to your dashboard

## Deployment (10 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit: Braidly platform"
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Vite" as framework
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### 3. Configure Supabase
1. Go to Supabase dashboard
2. Project Settings > API
3. Add your Vercel domain to CORS whitelist
4. Authentication > URL Configuration
5. Add redirect URL: `https://your-app.vercel.app/login`

## Database Setup (5 minutes)

### 1. Create Tables
Copy and run this SQL in Supabase SQL Editor:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Braider profiles
CREATE TABLE braider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  address TEXT,
  base_price DECIMAL(10,2),
  travel_radius INTEGER,
  mobile_service BOOLEAN DEFAULT true,
  salon_service BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  braider_id UUID NOT NULL REFERENCES braider_profiles(id),
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_hours DECIMAL(3,1),
  location TEXT,
  status TEXT DEFAULT 'pending',
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio images
CREATE TABLE portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  braider_id UUID NOT NULL REFERENCES braider_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  style_category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery images
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  braider_id UUID NOT NULL REFERENCES braider_profiles(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  braider_id UUID NOT NULL REFERENCES braider_profiles(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  braider_id UUID NOT NULL REFERENCES braider_profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE braider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### 2. Create Storage Buckets
In Supabase Storage tab:
- Create bucket: `avatars` (public)
- Create bucket: `portfolio` (public)
- Create bucket: `gallery` (public)

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/          # Routing and app setup
├── auth/         # Authentication
├── pages/        # Page components
├── components/   # Reusable components
├── services/     # API services
├── schemas/      # Validation schemas
├── hooks/        # Custom hooks
├── animations/   # Animations
└── styles/       # CSS
```

## Key Pages

### Public
- `/` - Landing page
- `/login` - Login
- `/signup` - Sign up

### Customer
- `/customer/dashboard` - Dashboard
- `/customer/browse` - Browse braiders
- `/customer/bookings` - My bookings
- `/customer/profile` - My profile

### Braider
- `/braider/dashboard` - Dashboard
- `/braider/profile` - My profile
- `/braider/portfolio` - Portfolio
- `/braider/earnings` - Earnings

### Admin
- `/admin/dashboard` - Dashboard
- `/admin/users` - Users
- `/admin/analytics` - Analytics

## Test Accounts

Create test accounts by signing up with:
- Email: `test@example.com`
- Password: `Test@123456`
- Role: Choose customer, braider, or admin

## Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Connection Error
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check CORS settings in Supabase

### File Upload Fails
- Verify storage buckets exist
- Check bucket permissions (should be public)
- Verify Supabase credentials

## Next Steps

1. **Customize Branding**
   - Update logo in `index.html`
   - Modify colors in CSS files
   - Update app name in `manifest.json`

2. **Add Background Images**
   - Add braiding style images to `public/backgrounds/`
   - Name them: `bg1.jpg`, `bg2.jpg`, etc.

3. **Configure Email**
   - Set up SendGrid or similar
   - Add email templates
   - Configure email notifications

4. **Set Up Payments**
   - Integrate Stripe or PayPal
   - Configure payment webhooks
   - Test payment flow

5. **Monitor & Optimize**
   - Set up error tracking (Sentry)
   - Monitor performance
   - Optimize database queries

## Support

- **Documentation**: See README.md
- **Deployment**: See DEPLOYMENT_GUIDE.md
- **Features**: See INTEGRATION_CHECKLIST.md
- **Status**: See PROJECT_STATUS.md

## Quick Links

- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Dashboard](https://vercel.com)
- [GitHub Repository](https://github.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Ready to launch?** Follow the deployment steps above and you'll be live in minutes!
