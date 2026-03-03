# 🚀 Supabase Setup Guide for Braidly

## ✅ Supabase Configuration Complete

Your Supabase credentials have been integrated into the application!

### 📋 Your Supabase Details

```
Project URL: https://rsemdxjizhkqaoptdxlc.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: (stored securely - use only for backend)
```

---

## 🔧 Setup Steps

### Step 1: Run the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire content from `supabase/schema.sql`
5. Paste and click **Run**

This will create all necessary tables:
- profiles
- braider_profiles
- services
- bookings
- reviews
- disputes
- favorites
- portfolio_images

### Step 2: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google** and **Apple** for social login
4. Configure email templates if needed

### Step 3: Set Up Storage (for images)

1. Go to **Storage**
2. Create these buckets:
   - `avatars` (public)
   - `portfolio` (public)
   - `verification-docs` (private)

3. Set bucket policies:

```sql
-- Avatars bucket policy
CREATE POLICY "Public avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Portfolio bucket policy
CREATE POLICY "Public portfolio images viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Braiders can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Configure Row Level Security (RLS)

The schema already includes RLS policies, but verify they're enabled:

1. Go to **Database** → **Tables**
2. For each table, ensure RLS is **enabled**
3. Check policies are active

---

## 🔐 Authentication Flow

### Demo Accounts (Local Storage)
The app still supports demo accounts for testing:
```
customer@braidly.com / Customer123!
braider@braidly.com / Braider123!
admin@braidly.com / Admin123!
```

### Real Supabase Accounts
Users can now create real accounts that are stored in Supabase!

**Sign Up Flow:**
1. User fills signup form
2. `signUpWithSupabase()` creates auth user
3. Profile created in `profiles` table
4. If braider, `braider_profiles` entry created
5. User logged in automatically

**Login Flow:**
1. User enters credentials
2. `signInWithSupabase()` authenticates
3. Profile fetched from database
4. Session stored in localStorage
5. User redirected to appropriate dashboard

---

## 📝 Using Supabase in Your Code

### Check if Supabase is Available

```javascript
if (window.supabaseClient) {
    console.log('Supabase is ready!');
    // Use Supabase
} else {
    console.log('Using demo mode');
    // Fall back to localStorage
}
```

### Sign Up Example

```javascript
const result = await window.SupabaseAuth.signUp(
    'user@example.com',
    'SecurePassword123!',
    'John Doe',
    'customer'
);

if (result.success) {
    console.log('User created:', result.user);
} else {
    console.error('Error:', result.error);
}
```

### Login Example

```javascript
const result = await window.SupabaseAuth.signIn(
    'user@example.com',
    'SecurePassword123!'
);

if (result.success) {
    console.log('Logged in:', result.profile);
    // Redirect to dashboard
} else {
    console.error('Error:', result.error);
}
```

### Logout Example

```javascript
const result = await window.SupabaseAuth.signOut();
if (result.success) {
    window.location.href = 'login.html';
}
```

### Get Current User

```javascript
const profile = await window.SupabaseAuth.getCurrentUserProfile();
if (profile) {
    console.log('Current user:', profile);
}
```

---

## 🗄️ Database Operations

### Fetch Braiders

```javascript
const { data, error } = await supabaseClient
    .from('braider_profiles')
    .select(`
        *,
        profiles:user_id (
            full_name,
            avatar_url
        )
    `)
    .eq('is_active', true)
    .order('rating', { ascending: false });

if (!error) {
    console.log('Braiders:', data);
}
```

### Create Booking

```javascript
const { data, error } = await supabaseClient
    .from('bookings')
    .insert([
        {
            booking_number: 'BR-2024-' + Date.now(),
            customer_id: userId,
            braider_id: braiderId,
            service_id: serviceId,
            booking_date: '2024-04-15',
            booking_time: '10:00',
            total_amount: 150.00,
            platform_fee: 30.00,
            braider_amount: 120.00,
            status: 'pending'
        }
    ])
    .select();
```

### Add Review

```javascript
const { data, error } = await supabaseClient
    .from('reviews')
    .insert([
        {
            booking_id: bookingId,
            customer_id: customerId,
            braider_id: braiderId,
            rating: 5,
            comment: 'Amazing service!'
        }
    ]);
```

---

## 🔄 Migration from Demo to Supabase

### Option 1: Dual Mode (Recommended)
Keep both demo and Supabase working:

```javascript
async function login(email, password) {
    // Try Supabase first
    if (window.supabaseClient) {
        const result = await window.SupabaseAuth.signIn(email, password);
        if (result.success) return result;
    }
    
    // Fall back to demo accounts
    return loginWithDemo(email, password);
}
```

### Option 2: Supabase Only
Remove demo accounts and use only Supabase:

1. Remove `DEMO_ACCOUNTS` from `js/auth.js`
2. Update `handleLogin()` to only use Supabase
3. Remove localStorage fallback

---

## 🧪 Testing Supabase Integration

### Test Checklist

- [ ] Can create new account
- [ ] Can login with Supabase account
- [ ] Can logout
- [ ] Profile data persists
- [ ] Braider profile created for braiders
- [ ] Can fetch braiders list
- [ ] Can create bookings
- [ ] Can add reviews
- [ ] Images upload to storage
- [ ] RLS policies work correctly

### Test Script

```javascript
// Run in browser console
async function testSupabase() {
    console.log('Testing Supabase...');
    
    // Test 1: Check connection
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('count');
    console.log('Connection:', error ? 'Failed' : 'Success');
    
    // Test 2: Check auth
    const session = await window.SupabaseAuth.getCurrentSession();
    console.log('Session:', session ? 'Active' : 'None');
    
    // Test 3: Check profile
    const profile = await window.SupabaseAuth.getCurrentUserProfile();
    console.log('Profile:', profile);
}

testSupabase();
```

---

## 🔒 Security Best Practices

### 1. Never Expose Service Role Key
- Only use in backend/server code
- Never commit to Git
- Use environment variables

### 2. Use RLS Policies
- All tables have RLS enabled
- Users can only access their own data
- Public data is read-only

### 3. Validate Input
- Always validate on backend
- Use Supabase's built-in validation
- Sanitize user input

### 4. Secure File Uploads
- Limit file sizes
- Validate file types
- Use signed URLs for private files

---

## 📊 Monitoring & Analytics

### Enable Supabase Logs

1. Go to **Logs** in Supabase Dashboard
2. Monitor:
   - API requests
   - Authentication events
   - Database queries
   - Errors

### Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Configure alerts for:
   - High error rates
   - Slow queries
   - Storage limits

---

## 🚀 Production Deployment

### Environment Variables

Create `.env` file:
```
VITE_SUPABASE_URL=https://rsemdxjizhkqaoptdxlc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Update Config

```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Deploy Checklist

- [ ] Database schema deployed
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ [ ] Email templates configured
- [ ] Environment variables set
- [ ] CORS configured
- [ ] SSL enabled
- [ ] Backups enabled

---

## 🆘 Troubleshooting

### Issue: "Failed to fetch"
**Solution:** Check CORS settings in Supabase Dashboard

### Issue: "Row Level Security policy violation"
**Solution:** Verify RLS policies are correctly configured

### Issue: "Invalid API key"
**Solution:** Check that anon key is correct in `supabase-config.js`

### Issue: "User not found"
**Solution:** Ensure profile was created after signup

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✅ You're All Set!

Your Braidly app is now connected to Supabase and ready for production use!

**Next Steps:**
1. Run the schema in Supabase SQL Editor
2. Test signup/login with real accounts
3. Upload images to storage buckets
4. Deploy to production

**Demo credentials still work for testing!**
