-- ============================================================================
-- CRITICAL DATABASE SCHEMA FIX
-- Fixes missing columns and tables for avatar and portfolio uploads
-- ============================================================================

-- Step 1: Add missing avatar_url column to braider_profiles
ALTER TABLE public.braider_profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS business_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS city VARCHAR(50),
ADD COLUMN IF NOT EXISTS state VARCHAR(50),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS address VARCHAR(200),
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS travel_radius INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mobile_service BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS salon_service BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS salon_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS salon_address VARCHAR(200);

-- Step 2: Create portfolio_images table for storing braider portfolio photos
CREATE TABLE IF NOT EXISTS public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  braider_id UUID NOT NULL REFERENCES public.braider_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  style_category VARCHAR(50),
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_images_braider_id ON public.portfolio_images(braider_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_images_style_category ON public.portfolio_images(style_category);

-- Step 3: Create hair_styles table for customer dashboard
CREATE TABLE IF NOT EXISTS public.hair_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(50),
  difficulty_level VARCHAR(20),
  estimated_time_minutes INTEGER,
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for hair styles
CREATE INDEX IF NOT EXISTS idx_hair_styles_category ON public.hair_styles(category);
CREATE INDEX IF NOT EXISTS idx_hair_styles_is_active ON public.hair_styles(is_active);

-- Step 4: Create braider_specialties table to link braiders with hair styles they offer
CREATE TABLE IF NOT EXISTS public.braider_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  braider_id UUID NOT NULL REFERENCES public.braider_profiles(id) ON DELETE CASCADE,
  hair_style_id UUID NOT NULL REFERENCES public.hair_styles(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(braider_id, hair_style_id)
);

-- Create index for braider specialties
CREATE INDEX IF NOT EXISTS idx_braider_specialties_braider_id ON public.braider_specialties(braider_id);
CREATE INDEX IF NOT EXISTS idx_braider_specialties_hair_style_id ON public.braider_specialties(hair_style_id);

-- Step 5: Enable RLS on new tables
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hair_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.braider_specialties ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for portfolio_images
CREATE POLICY "portfolio_images_select_all" ON public.portfolio_images
  FOR SELECT USING (true);

CREATE POLICY "portfolio_images_insert_own" ON public.portfolio_images
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.braider_profiles WHERE id = braider_id
    )
  );

CREATE POLICY "portfolio_images_update_own" ON public.portfolio_images
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.braider_profiles WHERE id = braider_id
    )
  );

CREATE POLICY "portfolio_images_delete_own" ON public.portfolio_images
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.braider_profiles WHERE id = braider_id
    )
  );

-- Step 7: Create RLS policies for hair_styles
CREATE POLICY "hair_styles_select_all" ON public.hair_styles
  FOR SELECT USING (is_active = true);

-- Step 8: Create RLS policies for braider_specialties
CREATE POLICY "braider_specialties_select_all" ON public.braider_specialties
  FOR SELECT USING (true);

CREATE POLICY "braider_specialties_insert_own" ON public.braider_specialties
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.braider_profiles WHERE id = braider_id
    )
  );

CREATE POLICY "braider_specialties_update_own" ON public.braider_specialties
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.braider_profiles WHERE id = braider_id
    )
  );

CREATE POLICY "braider_specialties_delete_own" ON public.braider_specialties
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.braider_profiles WHERE id = braider_id
    )
  );

-- Step 9: Insert sample hair styles for customer dashboard
INSERT INTO public.hair_styles (name, description, image_url, category, difficulty_level, estimated_time_minutes, price_range_min, price_range_max, is_active)
VALUES
  ('Box Braids', 'Classic protective style with square-shaped sections', '/assets/images/b_Long_box_braids_with.png', 'braids', 'intermediate', 240, 80, 150, true),
  ('Knotless Braids', 'Modern braiding technique without knots at the base', '/assets/images/b_Knotless_braids_hair.png', 'braids', 'advanced', 300, 100, 180, true),
  ('Cornrows', 'Tight braids close to the scalp in geometric patterns', '/assets/images/b_Professional_photo_o.png', 'braids', 'intermediate', 180, 60, 120, true),
  ('Twists', 'Two-strand twists for a textured protective look', '/assets/images/b_Medium_knotless_brai.png', 'twists', 'beginner', 120, 50, 100, true),
  ('Locs', 'Permanent or temporary locking of hair sections', '/assets/images/b_Professional_photo_o.png', 'locs', 'advanced', 360, 150, 300, true),
  ('Weave', 'Hair extensions sewn onto braided tracks', '/assets/images/b_Long_box_braids_with.png', 'weave', 'intermediate', 180, 100, 200, true),
  ('Crochet Braids', 'Hair extensions attached using crochet hooks', '/assets/images/b_Knotless_braids_hair.png', 'braids', 'intermediate', 150, 70, 140, true),
  ('Kids Braids', 'Protective styles designed for children', '/assets/images/b_Medium_knotless_brai.png', 'kids', 'beginner', 90, 40, 80, true)
ON CONFLICT (name) DO NOTHING;

-- Step 10: Create trigger to update braider_profiles updated_at timestamp
CREATE OR REPLACE FUNCTION update_braider_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_braider_profiles_updated_at_trigger ON public.braider_profiles;
CREATE TRIGGER update_braider_profiles_updated_at_trigger
BEFORE UPDATE ON public.braider_profiles
FOR EACH ROW
EXECUTE FUNCTION update_braider_profiles_updated_at();

-- Step 11: Create trigger to update portfolio_images updated_at timestamp
CREATE OR REPLACE FUNCTION update_portfolio_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_portfolio_images_updated_at_trigger ON public.portfolio_images;
CREATE TRIGGER update_portfolio_images_updated_at_trigger
BEFORE UPDATE ON public.portfolio_images
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_images_updated_at();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify braider_profiles columns
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'braider_profiles' ORDER BY ordinal_position;

-- Verify portfolio_images table exists
-- SELECT * FROM public.portfolio_images LIMIT 1;

-- Verify hair_styles table exists
-- SELECT * FROM public.hair_styles LIMIT 1;

-- Verify braider_specialties table exists
-- SELECT * FROM public.braider_specialties LIMIT 1;
