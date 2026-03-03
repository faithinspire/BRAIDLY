# HOW TO RUN THE SQL FIX SCRIPT

## Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

## Step 2: Run the Fixed Script
Copy and paste the **ENTIRE** contents of `FIXED_FINAL_SCRIPT.sql` into the SQL Editor, then click "Run".

## Step 3: Verify the Results
After running, you should see:
1. **Admin status** - Confirming admin user exists
2. **Gallery status** - Showing number of images
3. **Braider status** - Showing braider counts
4. **Final success message** - "✅ ALL FIXES APPLIED SUCCESSFULLY!"

## Step 4: Test the Fixes

### Test Admin Login:
- Email: `admin@braidly.com`
- Password: `Admin123456`
- Should redirect to: `/admin/dashboard` (NOT customer dashboard)

### Test Customer Dashboard:
1. Login as customer
2. Check for:
   - Hairstyle gallery with images
   - WhatsApp chat button (bottom-right)
   - Real braider data (not demo data)

### Test Braider Portfolio:
1. Login as braider
2. Try uploading photos
3. Photos should:
   - Upload successfully
   - Appear in braider portfolio
   - Automatically appear in customer gallery

## Troubleshooting:

### If you get "relation does not exist" errors:
The script creates tables if they don't exist. If you get errors about missing tables, run this first:

```sql
-- Create basic tables if missing
CREATE TABLE IF NOT EXISTS public.portfolio_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    braider_id UUID REFERENCES public.braider_profiles(id),
    image_url TEXT NOT NULL,
    caption TEXT,
    style_category TEXT,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.braider_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    verification_status TEXT DEFAULT 'unverified',
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

### If admin login still goes to customer dashboard:
Check the user's role in the database:
```sql
SELECT email, role FROM public.profiles WHERE email = 'admin@braidly.com';
```
Should show `role = 'admin'`

### If gallery doesn't show images:
Check if gallery_images table has data:
```sql
SELECT COUNT(*) as image_count FROM public.gallery_images;
```

## What the Script Fixes:

1. **Creates admin user** with proper admin role
2. **Creates gallery table** for customer dashboard
3. **Populates gallery** with sample images
4. **Fixes RLS policies** for proper access control
5. **Enables portfolio-gallery sync** - braider uploads appear in customer gallery

## Support:
If issues persist after running the script, check the Supabase logs for detailed error messages.