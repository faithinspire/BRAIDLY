-- ============================================================================
-- 🔥 STORAGE BUCKETS - FINAL FIX
-- ============================================================================
-- Deploy this AFTER creating buckets in Supabase UI
-- Buckets needed: avatars, portfolio, landing (all PUBLIC)
-- ============================================================================

-- ============================================================================
-- AVATARS BUCKET POLICIES
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
-- PORTFOLIO BUCKET POLICIES
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
-- LANDING BUCKET POLICIES (PUBLIC)
-- ============================================================================
CREATE POLICY "landing_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'landing');

SELECT 'STORAGE BUCKETS CONFIGURED - IMAGE UPLOADS READY' as status;
