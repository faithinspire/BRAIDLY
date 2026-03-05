-- ============================================================================
-- COMPLETE BRAIDLY AUTH FORCE FIX
-- Run this entire script in Supabase SQL Editor
-- This will fix ALL signup/login issues
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP EXISTING POLICIES (Clean slate)
-- ============================================================================

DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

DROP POLICY IF EXISTS "Braiders can create own record" ON braiders;
DROP POLICY IF EXISTS "Anyone can view braider profiles" ON braiders;
DROP POLICY IF EXISTS "Braiders can update own profile" ON braiders;

DROP POLICY IF EXISTS "Customers can create own record" ON customers;
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;

-- ============================================================================
-- STEP 2: RECREATE ALL RLS POLICIES (Complete and correct)
-- ============================================================================

-- ============================================================================
-- PROFILES RLS POLICIES (CRITICAL: Includes INSERT for signup)
-- ============================================================================

-- CRITICAL: Allow users to create their own profile during signup
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- BRAIDERS RLS POLICIES (CRITICAL: Includes INSERT for signup)
-- ============================================================================

-- CRITICAL: Allow braiders to create their own record during signup
CREATE POLICY "Braiders can create own record" ON braiders
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow anyone to view braider profiles (for discovery)
CREATE POLICY "Anyone can view braider profiles" ON braiders
  FOR SELECT USING (TRUE);

-- Allow braiders to update their own profile
CREATE POLICY "Braiders can update own profile" ON braiders
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- CUSTOMERS RLS POLICIES (CRITICAL: Includes INSERT for signup)
-- ============================================================================

-- CRITICAL: Allow customers to create their own record during signup
CREATE POLICY "Customers can create own record" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow customers to view their own profile
CREATE POLICY "Customers can view own profile" ON customers
  FOR SELECT USING (auth.uid() = id);

-- Allow customers to update their own profile
CREATE POLICY "Customers can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- PORTFOLIOS RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view portfolios" ON portfolios;
DROP POLICY IF EXISTS "Braiders can insert own portfolio" ON portfolios;
DROP POLICY IF EXISTS "Braiders can delete own portfolio" ON portfolios;

CREATE POLICY "Anyone can view portfolios" ON portfolios
  FOR SELECT USING (TRUE);

CREATE POLICY "Braiders can insert own portfolio" ON portfolios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM braiders WHERE id = auth.uid()
    ) AND braider_id = auth.uid()
  );

CREATE POLICY "Braiders can delete own portfolio" ON portfolios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM braiders WHERE id = auth.uid()
    ) AND braider_id = auth.uid()
  );

-- ============================================================================
-- BOOKINGS RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can create bookings" ON bookings;
DROP POLICY IF EXISTS "Braiders can update booking status" ON bookings;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = braider_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM customers WHERE id = auth.uid()
    )
  );

CREATE POLICY "Braiders can update booking status" ON bookings
  FOR UPDATE USING (
    auth.uid() = braider_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- MESSAGES RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================================================
-- PAYMENTS RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can update payments" ON payments;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = braider_id OR
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update payments" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- ADMIN_LOGS RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view logs" ON admin_logs;
DROP POLICY IF EXISTS "Admins can insert logs" ON admin_logs;

CREATE POLICY "Admins can view logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert logs" ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that all policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

