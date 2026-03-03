# 🚀 SUPABASE COMPLETE SETUP - RUN THIS NOW

## ONE-STEP SETUP

### Copy and Run This SQL in Supabase SQL Editor

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire content from: `supabase/setup-storage-and-policies.sql`
5. Paste it into the SQL Editor
6. Click **Run**

That's it! All buckets and policies will be created automatically.

---

## WHAT THIS SCRIPT DOES

✅ Creates 3 storage buckets:
- `avatars` - For user profile pictures
- `portfolio` - For braider portfolio images
- `gallery` - For general gallery images

✅ Sets up policies for each bucket:
- Public read access (anyone can view)
- Authenticated upload (only logged-in users can upload)
- Authenticated update (only logged-in users can modify)
- Authenticated delete (only logged-in users can delete)

---

## VERIFICATION

After running the script, you should see:

```
Query executed successfully
```

And the verification queries will show:
- 3 buckets created
- 12 policies created (4 per bucket)

---

## TESTING UPLOADS

### Test Avatar Upload
1. Go to http://localhost:3002/braider/profile
2. Click "Upload Avatar"
3. Select a JPG/PNG image
4. Should upload successfully ✅

### Test Portfolio Upload
1. Go to http://localhost:3002/braider/portfolio
2. Click "Upload Photos"
3. Select JPG/PNG images
4. Should upload successfully ✅

---

## TROUBLESHOOTING

### Error: "Bucket already exists"
**Solution**: This is normal if you've run the script before. The script handles this automatically.

### Error: "Policy already exists"
**Solution**: This is normal. The script is idempotent and safe to run multiple times.

### Error: "Permission denied"
**Solution**: 
1. Verify you're logged in to Supabase
2. Check you have admin access
3. Try running the script again

### Upload still fails
**Solution**:
1. Verify buckets were created (check Storage tab)
2. Verify policies were created (check Policies tab)
3. Check file size < 10MB
4. Check file type is JPG/PNG/WebP
5. Refresh browser and try again

---

## NEXT STEPS

After successful setup:

1. ✅ Test uploads (see Testing Uploads above)
2. ✅ Create admin user (see below)
3. ✅ Deploy to Vercel

---

## CREATE ADMIN USER

### Step 1: Create Admin in Supabase Auth
1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - Email: `admin@braidly.com`
   - Password: (strong password, e.g., `Admin@Braidly2024!`)
4. Click **Create user**
5. Copy the User ID (UUID) - looks like: `550e8400-e29b-41d4-a716-446655440000`

### Step 2: Create Admin Profile
1. Go to **SQL Editor**
2. Click **New Query**
3. Copy this SQL:

```sql
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'PASTE_USER_ID_HERE',
  'admin@braidly.com',
  'Braidly Admin',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_active = true;
```

4. Replace `PASTE_USER_ID_HERE` with the UUID from Step 1
5. Click **Run**

### Step 3: Verify Admin User
1. Go to **Authentication** > **Users**
2. Find `admin@braidly.com`
3. Verify it's created

---

## BUTTON STYLING UPDATES

✅ Login/Signup buttons now have:
- Animated gradient background
- Smooth hover effects
- Ripple animation on click
- Glow effect
- Responsive design

✅ Input fields now have:
- Proper padding to avoid overlapping with icons
- Better focus states
- Smooth transitions
- Improved accessibility

---

## QUICK REFERENCE

| Task | File | Status |
|------|------|--------|
| Create buckets & policies | `supabase/setup-storage-and-policies.sql` | ✅ Ready |
| Create admin user | SQL snippet above | ✅ Ready |
| Animated buttons | `css/animated-buttons.css` | ✅ Ready |
| Fixed input spacing | `css/auth.css` | ✅ Ready |

---

## SUPPORT

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify all buckets exist in Storage tab
3. Verify all policies exist in Policies tab
4. Check browser console for errors
5. Try refreshing the page

---

**Status**: ✅ Ready for Production  
**Last Updated**: March 1, 2026  
**Version**: 1.0.0

