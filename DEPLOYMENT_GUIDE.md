# Braidly Deployment Guide

Complete guide for deploying Braidly to production.

## Prerequisites

- GitHub account with repository
- Vercel account
- Supabase project configured
- Node.js 16+ installed locally

## Step 1: Prepare Supabase

### Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Profiles table
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
  salon_name TEXT,
  salon_address TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  braider_id UUID NOT NULL REFERENCES braider_profiles(id),
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_hours DECIMAL(3,1),
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE braider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
```

### Create Storage Buckets

In Supabase dashboard:
1. Go to Storage
2. Create bucket: `avatars` (public)
3. Create bucket: `portfolio` (public)
4. Create bucket: `gallery` (public)

## Step 2: GitHub Setup

```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/braidly.git

# Create .gitignore (already exists)
# Commit and push
git add .
git commit -m "Initial commit: Braidly platform"
git branch -M main
git push -u origin main
```

## Step 3: Vercel Deployment

### Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Vite" as framework
5. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Set Environment Variables

In Vercel project settings, add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from Supabase:
1. Go to Project Settings > API
2. Copy URL and anon key

### Deploy

Click "Deploy" - Vercel will automatically build and deploy.

## Step 4: Post-Deployment

### Verify Deployment

1. Visit your Vercel URL
2. Test signup/login
3. Test file uploads
4. Check browser console for errors

### Configure Supabase Auth

In Supabase dashboard:
1. Go to Authentication > URL Configuration
2. Add your Vercel domain to "Redirect URLs"
3. Example: `https://your-app.vercel.app/login`

### Enable CORS

In Supabase dashboard:
1. Go to Project Settings > API
2. Add your Vercel domain to CORS whitelist

## Step 5: Monitoring

### Check Logs

- Vercel: Deployments tab shows build logs
- Supabase: Logs tab shows database queries
- Browser: DevTools console for client errors

### Performance

- Vercel Analytics: Monitor page performance
- Supabase: Monitor database performance

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
npm ci
npm run build
```

### Auth Not Working

- Check Supabase credentials in .env
- Verify redirect URLs in Supabase
- Check CORS settings

### File Uploads Fail

- Verify storage buckets exist
- Check bucket permissions (should be public)
- Verify Supabase credentials

### Database Errors

- Check RLS policies
- Verify table structure
- Check user permissions

## Scaling

### Database

- Monitor query performance in Supabase
- Add indexes for frequently queried columns
- Consider read replicas for high traffic

### Storage

- Monitor storage usage
- Implement image cleanup policies
- Consider CDN for images

### API

- Monitor Supabase API usage
- Implement caching where possible
- Rate limit API calls

## Security

### Environment Variables

- Never commit .env to git
- Use Vercel secrets for sensitive data
- Rotate keys regularly

### Database

- Enable RLS policies
- Restrict table access by role
- Audit sensitive operations

### Authentication

- Enforce strong passwords
- Implement 2FA for admin accounts
- Monitor login attempts

## Maintenance

### Regular Tasks

- Monitor error logs
- Update dependencies monthly
- Review security advisories
- Backup database regularly

### Backup Strategy

- Supabase: Enable automated backups
- GitHub: Maintain clean commit history
- Vercel: Keep deployment history

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console errors
4. Check GitHub Actions (if using CI/CD)
