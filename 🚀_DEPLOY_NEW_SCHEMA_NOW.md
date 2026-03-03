# 🚀 DEPLOY NEW PRODUCTION SCHEMA - STEP BY STEP

## ⚠️ IMPORTANT: BACKUP YOUR DATA FIRST!

Before deploying the new schema, make sure to backup your Supabase database:
1. Go to Supabase Dashboard
2. Click "Backups" in the left sidebar
3. Click "Create a backup" button
4. Wait for backup to complete

---

## 📋 DEPLOYMENT STEPS

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://app.supabase.com
2. Click on your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Copy the New Schema
1. Open the file: `🔥_FINAL_SCHEMA.sql`
2. Copy ALL the content (Ctrl+A, Ctrl+C)

### Step 3: Paste and Execute
1. Paste the entire schema into the Supabase SQL Editor
2. Click the "Run" button (or press Ctrl+Enter)
3. Wait for execution to complete (should take 30-60 seconds)

### Step 4: Verify Deployment
After execution completes, you should see:
```
✅ PRODUCTION SCHEMA v2.0 DEPLOYED
total_profiles: X
total_braider_profiles: X
total_bookings: 0
total_reviews: 0
total_payments: 0
total_storage_buckets: 3
```

---

## 🔐 CREATE ADMIN USER

### Step 1: Open SQL Editor Again
1. Click "New Query" in SQL Editor
2. Open the file: `CREATE_ADMIN_USER.sql`
3. Copy ALL the content

### Step 2: Execute Admin Creation
1. Paste into SQL Editor
2. Click "Run"
3. You should see:
```
Admin user created successfully!
id | email | role
---|-------|-----
[UUID] | admin@braidly.com | admin
```

### Step 3: Test Admin Login
1. Go to your app: http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `admin@braidly.com`
   - Password: `Admin123456`
4. You should be redirected to `/admin/dashboard`

---

## 🧪 VERIFY ALL FEATURES

### Test Customer Features:
- [ ] Login as customer
- [ ] Browse braiders
- [ ] View braider profiles
- [ ] Create booking
- [ ] View bookings
- [ ] View favorites
- [ ] View history
- [ ] Update profile

### Test Braider Features:
- [ ] Login as braider
- [ ] View dashboard
- [ ] View upcoming bookings
- [ ] Upload portfolio images
- [ ] Update profile
- [ ] View earnings
- [ ] View reviews
- [ ] View schedule

### Test Admin Features:
- [ ] Login as admin
- [ ] View admin dashboard
- [ ] View user management
- [ ] View verifications
- [ ] View disputes
- [ ] View analytics
- [ ] View financial data
- [ ] View settings

---

## 📊 NEW SCHEMA STRUCTURE

### Tables Created:
1. **profiles** - User accounts (customers, braiders, admins)
2. **braider_profiles** - Braider business information
3. **portfolio_images** - Braider work samples
4. **gallery_images** - Public gallery
5. **bookings** - Appointment bookings
6. **reviews** - Customer reviews and ratings
7. **payments** - Payment transactions
8. **earnings** - Braider earnings tracking
9. **notifications** - Real-time notifications

### Key Features:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Real-time subscriptions enabled
- ✅ Automatic timestamp updates
- ✅ Automatic rating calculations
- ✅ Proper foreign key relationships
- ✅ Storage buckets configured

---

## 🔄 ROLLBACK PLAN (If Needed)

If something goes wrong:

### Option 1: Restore from Backup
1. Go to Supabase Dashboard
2. Click "Backups"
3. Find your backup
4. Click "Restore"
5. Confirm restoration

### Option 2: Manual Rollback
1. Open SQL Editor
2. Run: `DROP SCHEMA IF EXISTS public CASCADE;`
3. Restore from backup

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

### Immediate:
1. ✅ Test all features (see verification checklist above)
2. ✅ Create test users for each role
3. ✅ Test photo uploads
4. ✅ Test real-time updates

### This Week:
1. Implement real-time subscriptions
2. Add payment integration
3. Implement financial features
4. Add notifications system

### Next Week:
1. Apply theme and styling
2. Implement animations
3. Full responsiveness testing
4. Performance optimization

---

## 📞 TROUBLESHOOTING

### Error: "Table already exists"
- The schema tries to drop and recreate tables
- If you get this error, run: `DROP SCHEMA IF EXISTS public CASCADE;`
- Then run the schema again

### Error: "Permission denied"
- Make sure you're logged in as the project owner
- Check that you have SQL Editor access

### Error: "Foreign key constraint failed"
- This shouldn't happen with the new schema
- If it does, restore from backup and try again

### App not connecting to database
- Check your `.env` file has correct Supabase credentials
- Verify RLS policies are enabled
- Check browser console for errors

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Backup created
- [ ] Schema deployed successfully
- [ ] Admin user created
- [ ] Admin login works
- [ ] Customer features work
- [ ] Braider features work
- [ ] Admin features work
- [ ] Photo uploads work
- [ ] Real-time updates work
- [ ] All tests pass

---

## 🎉 YOU'RE DONE!

Once all tests pass, your app is ready for:
- Real-time integration
- Financial system implementation
- Theme and styling
- Full production deployment

**Congratulations! Your new production schema is live!**

