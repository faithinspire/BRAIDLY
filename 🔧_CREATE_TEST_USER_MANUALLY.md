# 🔧 CREATE TEST USER MANUALLY IN SUPABASE

Since Supabase is rejecting email formats, let's create a test user manually.

## STEP-BY-STEP GUIDE

### Step 1: Create Auth User

1. Go to: **https://app.supabase.com**
2. Select project: **mmluzuxcoqyrtenstkxq**
3. Click: **Authentication** → **Users**
4. Click: **"Add user"** button (top right)
5. Fill in:
   ```
   Email: admin@test.com
   Password: Admin123456
   Auto Confirm User: ✅ CHECK THIS BOX!
   ```
6. Click: **"Create user"**
7. **COPY THE USER ID** (you'll need it next)

### Step 2: Create Profile

1. Click: **Table Editor** (left sidebar)
2. Select table: **profiles**
3. Click: **"Insert"** → **"Insert row"**
4. Fill in:
   ```
   id: [PASTE THE USER ID FROM STEP 1]
   email: admin@test.com
   full_name: Admin User
   phone: 1234567890
   role: admin
   ```
5. Click: **"Save"**

### Step 3: Test Login

1. Go to: **http://localhost:3001/login**
2. Enter:
   ```
   Email: admin@test.com
   Password: Admin123456
   ```
3. Click: **"Login"**
4. Should redirect to: **http://localhost:3001/admin/dashboard**

## Create Multiple Test Users

### Customer User:
```
Auth:
- Email: customer@test.com
- Password: Customer123456
- Auto Confirm: ✅

Profile:
- id: [user id]
- email: customer@test.com
- full_name: Customer User
- role: customer
```

### Braider User:
```
Auth:
- Email: braider@test.com
- Password: Braider123456
- Auto Confirm: ✅

Profile:
- id: [user id]
- email: braider@test.com
- full_name: Braider User
- role: braider

ALSO create in braider_profiles table:
- user_id: [user id]
- is_active: true
- verification_status: unverified
```

### Admin User:
```
Auth:
- Email: admin@test.com
- Password: Admin123456
- Auto Confirm: ✅

Profile:
- id: [user id]
- email: admin@test.com
- full_name: Admin User
- role: admin
```

## Important Notes

1. **Auto Confirm User** - MUST be checked when creating user
2. **User ID** - Must match between auth.users and profiles table
3. **Email** - Must be same in both auth and profiles
4. **Role** - Must be: customer, braider, or admin (lowercase)

## After Creating Users

Test each one:

1. **Admin:**
   - Login: admin@test.com / Admin123456
   - Should go to: /admin/dashboard

2. **Braider:**
   - Login: braider@test.com / Braider123456
   - Should go to: /braider/dashboard

3. **Customer:**
   - Login: customer@test.com / Customer123456
   - Should go to: /customer/dashboard

## If Login Still Fails

Check browser console (F12) for errors. The detailed logging will show exactly what's wrong.

## Summary

✅ Create user in Authentication → Users (with Auto Confirm checked)
✅ Create profile in Table Editor → profiles (with matching user id)
✅ For braiders, also create in braider_profiles table
✅ Test login with the credentials

This bypasses the email validation issue!
