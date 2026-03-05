-- ============================================================================
-- NUCLEAR AUTH FIX - COMPLETE REBUILD FROM SCRATCH
-- Run this entire script in Supabase SQL Editor
-- This will completely rebuild the auth system
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP EVERYTHING (Complete clean slate)
-- ============================================================================
DROP TRIGGER IF EXISTS create_role_record_trigger ON profiles;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_braiders_updated_at ON braiders;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;

DROP FUNCTION IF EXISTS create_role_record();
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS braiders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- STEP 2: CREATE TABLES (Minimal, working version)
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'braider', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE braiders (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  location TEXT,
  style TEXT,
  hourly_rate DECIMAL(10, 2) DEFAULT 0,
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  braider_id UUID NOT NULL REFERENCES braiders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  braider_id UUID NOT NULL REFERENCES braiders(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  braider_id UUID NOT NULL REFERENCES braiders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_connect_account_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: CREATE INDEXES
-- ============================================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_braiders_location ON braiders(location);
CREATE INDEX idx_braiders_rating ON braiders(rating DESC);
CREATE INDEX idx_portfolios_braider_id ON portfolios(braider_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_braider_id ON bookings(braider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_braider_id ON payments(braider_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);

-- ============================================================================
-- STEP 4: CREATE FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 5: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_braiders_updated_at BEFORE UPDATE ON braiders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: ENABLE RLS
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE braiders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: CREATE RLS POLICIES - PERMISSIVE (Allow everything for now)
-- ============================================================================

-- PROFILES - Allow all operations
CREATE POLICY "profiles_all" ON profiles FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- BRAIDERS - Allow all operations
CREATE POLICY "braiders_all" ON braiders FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- CUSTOMERS - Allow all operations
CREATE POLICY "customers_all" ON customers FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- PORTFOLIOS - Allow all operations
CREATE POLICY "portfolios_all" ON portfolios FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- BOOKINGS - Allow all operations
CREATE POLICY "bookings_all" ON bookings FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- MESSAGES - Allow all operations
CREATE POLICY "messages_all" ON messages FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- PAYMENTS - Allow all operations
CREATE POLICY "payments_all" ON payments FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ADMIN_LOGS - Allow all operations
CREATE POLICY "admin_logs_all" ON admin_logs FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'NUCLEAR AUTH FIX COMPLETE!' as status;
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';
SELECT COUNT(*) as policy_count FROM pg_policies WHERE schemaname = 'public';
