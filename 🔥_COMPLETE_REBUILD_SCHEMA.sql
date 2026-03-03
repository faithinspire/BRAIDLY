-- ============================================
-- STEP 1: DROP ALL OLD BROKEN TABLES & POLICIES
-- ============================================
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.earnings CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.braiders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- STEP 2: CREATE FRESH SCHEMA FROM SCRATCH
-- ============================================

-- PROFILES TABLE (base for all users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'braider', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRAIDERS TABLE
CREATE TABLE public.braiders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio TEXT,
  location TEXT,
  years_experience INTEGER DEFAULT 0,
  specialties TEXT[],
  portfolio_images TEXT[],
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES TABLE
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  braider_id UUID REFERENCES public.braiders(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS TABLE
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  braider_id UUID REFERENCES public.braiders(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled','refunded')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  total_amount DECIMAL(10,2) NOT NULL,
  location TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS TABLE
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  braider_id UUID REFERENCES public.braiders(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  method TEXT DEFAULT 'card' CHECK (method IN ('card','paypal','bank_transfer','cash','paystack','stripe')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed','refunded')),
  transaction_ref TEXT UNIQUE,
  payment_provider TEXT,
  provider_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EARNINGS TABLE
CREATE TABLE public.earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  braider_id UUID REFERENCES public.braiders(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  gross_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending','processing','paid','failed')),
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS TABLE
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  braider_id UUID REFERENCES public.braiders(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error','booking','payment')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES TABLE (Chat)
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.braiders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: RLS POLICIES — PROFILES
-- ============================================
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- STEP 5: RLS POLICIES — BRAIDERS
-- ============================================
CREATE POLICY "braiders_select_all" ON public.braiders
  FOR SELECT USING (true);

CREATE POLICY "braiders_insert_own" ON public.braiders
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
  );

CREATE POLICY "braiders_update_own" ON public.braiders
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "braiders_update_admin" ON public.braiders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- STEP 6: RLS POLICIES — SERVICES
-- ============================================
CREATE POLICY "services_select_all" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "services_insert_own" ON public.services
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.braiders WHERE id = braider_id AND profile_id = auth.uid())
  );

CREATE POLICY "services_update_own" ON public.services
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.braiders WHERE id = braider_id AND profile_id = auth.uid())
  );

-- ============================================
-- STEP 7: RLS POLICIES — BOOKINGS
-- ============================================
CREATE POLICY "bookings_select_customer" ON public.bookings
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "bookings_select_braider" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.braiders WHERE id = braider_id AND profile_id = auth.uid())
  );

CREATE POLICY "bookings_select_admin" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "bookings_insert_customer" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "bookings_update_parties" ON public.bookings
  FOR UPDATE USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.braiders WHERE id = braider_id AND profile_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- STEP 8: RLS POLICIES — PAYMENTS
-- ============================================
CREATE POLICY "payments_select_customer" ON public.payments
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "payments_select_braider" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.braiders WHERE id = braider_id AND profile_id = auth.uid())
  );

CREATE POLICY "payments_select_admin" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "payments_insert_customer" ON public.payments
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- ============================================
-- STEP 9: RLS POLICIES — EARNINGS
-- ============================================
CREATE POLICY "earnings_select_braider" ON public.earnings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.braiders WHERE id = braider_id AND profile_id = auth.uid())
  );

CREATE POLICY "earnings_select_admin" ON public.earnings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- STEP 10: RLS POLICIES — NOTIFICATIONS
-- ============================================
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- STEP 11: RLS POLICIES — MESSAGES
-- ============================================
CREATE POLICY "messages_select_parties" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- ============================================
-- STEP 12: RLS POLICIES — REVIEWS
-- ============================================
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_customer" ON public.reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());

-- ============================================
-- STEP 13: AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 14: AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_braiders_updated_at BEFORE UPDATE ON public.braiders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- STEP 15: AUTO-CREATE EARNINGS WHEN PAYMENT COMPLETES
-- ============================================
CREATE OR REPLACE FUNCTION public.create_earning_on_payment() RETURNS TRIGGER AS $$
DECLARE
  platform_fee_rate DECIMAL := 0.10;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.earnings (
      braider_id, payment_id, booking_id,
      gross_amount, platform_fee, net_amount, payout_status
    )
    SELECT
      NEW.braider_id,
      NEW.id,
      NEW.booking_id,
      NEW.amount,
      (NEW.amount * platform_fee_rate),
      (NEW.amount * (1 - platform_fee_rate)),
      'pending'
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_payment_completed
  AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.create_earning_on_payment();

-- ============================================
-- STEP 16: ENABLE REALTIME ON KEY TABLES
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.earnings;

-- ============================================
-- STEP 17: INSERT EXISTING USER PROFILE MANUALLY
-- ============================================
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '123429d8-f502-4c0c-b7a2-74496c1102c2',
  'sholaolu88@gmail.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

SELECT 'COMPLETE REBUILD SCHEMA DEPLOYED SUCCESSFULLY' as status;
