# Supabase Troubleshooting Guide

## Current Error: "column 'status' does not exist" or similar column errors

This error means your Supabase database schema is either:
1. Not created yet
2. Partially created (missing some columns)
3. Out of sync with the application code

## Solution Steps

### Step 1: Check if Tables Exist

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `rsemdxjizhkqaoptdxlc`
3. Click on "Table Editor" in the left sidebar
4. Check if you see these tables:
   - profiles
   - braider_profiles
   - services
   - bookings
   - reviews
   - disputes
   - favorites
   - portfolio_images

### Step 2A: If NO Tables Exist - Run Full Schema

1. In Supabase Dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the file `supabase/schema-fixed.sql` from your project
4. Copy ALL the content
5. Paste it into the SQL Editor
6. Click "Run" button
7. Wait for success message
8. Go back to "Table Editor" and verify all tables are created

### Step 2B: If Tables Exist But Have Errors - Run Migration

1. In Supabase Dashboard, click "SQL Editor"
2. Click "New Query"
3. Open the file `supabase/migration-add-missing-columns.sql` from your project
4. Copy ALL the content
5. Paste it into the SQL Editor
6. Click "Run" button
7. Check the output for success messages

### Step 3: Verify Schema

After running the schema, verify these key columns exist:

**disputes table should have:**
- id
- booking_id
- filed_by
- reason
- description
- status
- resolution
- created_at
- updated_at
- resolved_at

**bookings table should have:**
- id
- booking_number
- customer_id
- braider_id
- service_id
- booking_date
- booking_time
- status
- payment_status
- total_amount
- platform_fee
- braider_amount
- created_at
- updated_at

**braider_profiles table should have:**
- id
- user_id
- business_name
- bio
- city
- state
- verification_status
- rating
- total_reviews
- is_active
- created_at
- updated_at

### Step 4: Test the Application

1. Open your browser console (F12)
2. Navigate to any admin page
3. Check for errors in the console
4. If you see "Failed to load resource: net::ERR_NAME_NOT_RESOLVED", this is a network issue, not a schema issue

## Common Errors and Solutions

### Error: "column 'X' does not exist"
**Solution:** Run the migration script (Step 2B above)

### Error: "relation 'public.X' does not exist"
**Solution:** Run the full schema script (Step 2A above)

### Error: "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"
**Solution:** This is a network/DNS issue. Check:
- Your internet connection
- Supabase service status: https://status.supabase.com
- Your Supabase URL is correct in `js/supabase-config.js`

### Error: "Invalid API key"
**Solution:** 
1. Go to Supabase Dashboard > Settings > API
2. Copy the "anon public" key
3. Update `js/supabase-config.js` with the correct key

### Error: "Row Level Security policy violation"
**Solution:** The schema includes RLS policies. Make sure you're logged in with a valid user account.

## Verification Checklist

- [ ] All 8 tables exist in Supabase
- [ ] disputes table has 'status' column
- [ ] disputes table has 'updated_at' column
- [ ] No console errors when loading admin pages
- [ ] Can see data loading (even if empty)
- [ ] Supabase URL and API key are correct in `js/supabase-config.js`

## Need More Help?

1. Check the browser console for specific error messages
2. Check Supabase Dashboard > Logs for database errors
3. Verify your Supabase project is active and not paused
4. Make sure you're using the correct Supabase URL: `https://rsemdxjizhkqaoptdxlc.supabase.co`

## Quick Test Query

Run this in Supabase SQL Editor to test if everything is working:

```sql
-- Test query to verify schema
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name IN ('disputes', 'bookings', 'braider_profiles', 'profiles')
ORDER BY table_name, ordinal_position;
```

This should return a list of all columns in your main tables. If it returns nothing, your schema hasn't been created yet.
