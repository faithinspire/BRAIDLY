# Supabase RLS Policies — BRAIDLY

## Overview

Row-Level Security (RLS) policies ensure users can only access their own data. All policies are already included in `schema.sql`, but this document explains each one.

---

## Database RLS Policies

### PROFILES Table

**Policy 1: Users can create own profile (CRITICAL FOR SIGNUP)**
```sql
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```
- Users can create their own profile during signup
- Required for account creation to work
- Prevents unauthorized profile creation

**Policy 2: Users can view own profile**
```sql
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```
- Users can only see their own profile
- Prevents viewing other users' data

**Policy 3: Users can update own profile**
```sql
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```
- Users can only update their own profile
- Prevents unauthorized profile changes

**Policy 4: Admins can view all profiles**
```sql
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Admins can view all user profiles
- Required for admin dashboard

---

### BRAIDERS Table

**Policy 1: Braiders can create own record (CRITICAL FOR SIGNUP)**
```sql
CREATE POLICY "Braiders can create own record" ON braiders
  FOR INSERT WITH CHECK (auth.uid() = id);
```
- Braiders can create their own braider record during signup
- Required for braider account creation
- Prevents unauthorized braider record creation

**Policy 2: Anyone can view braider profiles**
```sql
CREATE POLICY "Anyone can view braider profiles" ON braiders
  FOR SELECT USING (TRUE);
```
- Public visibility for braider discovery
- Customers need to browse braiders

**Policy 3: Braiders can update own profile**
```sql
CREATE POLICY "Braiders can update own profile" ON braiders
  FOR UPDATE USING (auth.uid() = id);
```
- Braiders can only update their own profile
- Prevents unauthorized profile changes

---

### CUSTOMERS Table

**Policy 1: Customers can create own record (CRITICAL FOR SIGNUP)**
```sql
CREATE POLICY "Customers can create own record" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);
```
- Customers can create their own customer record during signup
- Required for customer account creation
- Prevents unauthorized customer record creation

**Policy 2: Customers can view own profile**
```sql
CREATE POLICY "Customers can view own profile" ON customers
  FOR SELECT USING (auth.uid() = id);
```
- Customers can only see their own profile
- Prevents viewing other customers' data

**Policy 3: Customers can update own profile**
```sql
CREATE POLICY "Customers can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = id);
```
- Customers can only update their own profile
- Prevents unauthorized profile changes

---

## Critical Signup Flow

The signup process requires these INSERT policies to work:

1. **Auth User Created** - Supabase auth.signUp() creates user in auth.users table
2. **Profile Created** - INSERT policy allows new user to create profile record
3. **Role-Specific Record Created** - INSERT policy allows creation of braider/customer record
4. **Login Works** - User can now login and profile loads

**Without INSERT policies, signup fails silently at step 2.**

---

## Other Tables

All other tables (bookings, messages, payments, etc.) have appropriate INSERT policies for their specific use cases. See schema.sql for complete details.

---

### PORTFOLIOS Table

**Policy 1: Anyone can view portfolios**
```sql
CREATE POLICY "Anyone can view portfolios" ON portfolios
  FOR SELECT USING (TRUE);
```
- Public visibility for braider discovery
- Customers need to see braider portfolios

**Policy 2: Braiders can insert own portfolio**
```sql
CREATE POLICY "Braiders can insert own portfolio" ON portfolios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM braiders WHERE id = auth.uid()
    ) AND braider_id = auth.uid()
  );
```
- Only braiders can upload portfolio images
- Braiders can only upload to their own portfolio

**Policy 3: Braiders can delete own portfolio**
```sql
CREATE POLICY "Braiders can delete own portfolio" ON portfolios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM braiders WHERE id = auth.uid()
    ) AND braider_id = auth.uid()
  );
```
- Only braiders can delete portfolio images
- Braiders can only delete their own images

---

### BOOKINGS Table

**Policy 1: Users can view own bookings**
```sql
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = braider_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Customers can see their own bookings
- Braiders can see bookings for their services
- Admins can see all bookings

**Policy 2: Customers can create bookings**
```sql
CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM customers WHERE id = auth.uid()
    )
  );
```
- Only customers can create bookings
- Customers can only create bookings for themselves

**Policy 3: Braiders can update booking status**
```sql
CREATE POLICY "Braiders can update booking status" ON bookings
  FOR UPDATE USING (
    auth.uid() = braider_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Braiders can update bookings for their services
- Admins can update any booking

---

### MESSAGES Table

**Policy 1: Users can view own messages**
```sql
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
```
- Users can only see messages they sent or received
- Prevents viewing other users' conversations

**Policy 2: Users can send messages**
```sql
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
```
- Users can only send messages as themselves
- Prevents impersonation

---

### PAYMENTS Table

**Policy 1: Users can view own payments**
```sql
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = braider_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Customers can see their own payments
- Braiders can see payments for their services
- Admins can see all payments

**Policy 2: Admins can update payments**
```sql
CREATE POLICY "Admins can update payments" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Only admins can update payment status
- Required for dispute resolution

---

### ADMIN_LOGS Table

**Policy 1: Admins can view logs**
```sql
CREATE POLICY "Admins can view logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Only admins can view audit logs
- Prevents unauthorized access to admin actions

**Policy 2: Admins can insert logs**
```sql
CREATE POLICY "Admins can insert logs" ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
- Only admins can create audit logs
- Ensures audit trail integrity

---

## Storage RLS Policies

### avatars Bucket

**Policy 1: Anyone can view avatars**
```sql
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
```

**Policy 2: Users can upload own avatar**
```sql
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 3: Users can delete own avatar**
```sql
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### portfolios Bucket

**Policy 1: Anyone can view portfolios**
```sql
CREATE POLICY "Anyone can view portfolios" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolios');
```

**Policy 2: Braiders can upload portfolio images**
```sql
CREATE POLICY "Braiders can upload portfolio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolios' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM braiders WHERE id = auth.uid()
    )
  );
```

**Policy 3: Braiders can delete own portfolio images**
```sql
CREATE POLICY "Braiders can delete portfolio" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolios' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM braiders WHERE id = auth.uid()
    )
  );
```

### logos Bucket

**Policy 1: Anyone can view logos**
```sql
CREATE POLICY "Anyone can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');
```

**Policy 2: Admins can upload logos**
```sql
CREATE POLICY "Admins can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Policy 3: Admins can delete logos**
```sql
CREATE POLICY "Admins can delete logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'logos' AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Verification Checklist

- [ ] All database RLS policies created
- [ ] All storage RLS policies created
- [ ] No permission denied errors
- [ ] Users can only see own data
- [ ] Braiders can see all braider profiles
- [ ] Customers can see all braider profiles
- [ ] Admins can see all data
- [ ] Test upload/delete works
- [ ] Test public access works

---

## Troubleshooting

### "Permission denied" Error
- Check RLS policies are enabled on the table
- Verify user role in profiles table
- Check auth.uid() is set correctly

### Can't see data
- Verify RLS policy allows SELECT
- Check user ID matches policy condition
- Verify user role if role-based policy

### Can't upload files
- Verify storage bucket exists
- Check RLS policy allows INSERT
- Verify file path matches policy
- Check file size limits

---

## Next Steps

1. Run schema.sql in Supabase SQL Editor
2. Create storage buckets
3. Apply storage RLS policies
4. Test all policies
5. Move to Phase 2 (Authentication)
