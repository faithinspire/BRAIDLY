# How to Create Admin User in Supabase

## Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

## Step 2: Run the Admin User Creation Script
Copy and paste the entire contents of `CREATE_ADMIN_USER.sql` into the SQL Editor, then click "Run".

## Step 3: Verify the Users Were Created
After running the script, you should see a results table showing:
- Admin user: admin@braidly.com / Admin123456
- Braider user: braider@example.com / Braider123  
- Customer user: customer@example.com / Customer123

## Step 4: Test Login
You can now login with:
- **Admin**: admin@braidly.com / Admin123456
- **Braider**: braider@example.com / Braider123
- **Customer**: customer@example.com / Customer123

## Important Notes:
- The admin user has full access to all admin features
- The braider user has a complete braider profile with sample data
- All users are pre-verified and ready to use
- These credentials are for development/testing only

## If You Encounter Errors:
1. Make sure you're connected to the correct Supabase project
2. Check that all required tables exist (profiles, braider_profiles, etc.)
3. If RLS policies are blocking, run the `DISABLE_ALL_RLS_NOW.sql` script first
4. The app has emergency bypass mode enabled, so you can still login even if database operations fail