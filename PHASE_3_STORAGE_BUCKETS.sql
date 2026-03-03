-- ============================================================================
-- PHASE 3: STORAGE BUCKETS & POLICIES
-- ============================================================================
-- Deploy this AFTER Phase 2 to set up storage buckets and policies
-- ============================================================================

-- Note: Bucket creation must be done via Supabase Dashboard UI
-- Go to: Storage → Create new bucket
-- Create these buckets as PUBLIC:
-- 1. avatars
-- 2. portfolio
-- 3. landing

-- Once buckets are created, run these policies:

-- ============================================================================
-- Avatars Bucket Policies
-- ============================================================================
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_user_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Portfolio Bucket Policies
-- ============================================================================
CREATE POLICY "portfolio_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "portfolio_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "portfolio_user_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Landing Bucket Policies (public)
-- ============================================================================
CREATE POLICY "landing_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'landing');

SELECT 'PHASE 3 COMPLETE - STORAGE BUCKETS CONFIGURED' as result;
