# Supabase Storage Setup — BRAIDLY

## Storage Buckets to Create

Create these 3 buckets in Supabase Storage:

### 1. **avatars** (User Profile Pictures)
- **Bucket Name**: `avatars`
- **Public**: Yes
- **Path**: `avatars/{user_id}/{filename}`
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **Max File Size**: 5MB

### 2. **portfolios** (Braider Portfolio Images)
- **Bucket Name**: `portfolios`
- **Public**: Yes
- **Path**: `portfolios/{braider_id}/{filename}`
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **Max File Size**: 10MB

### 3. **logos** (Brand Assets)
- **Bucket Name**: `logos`
- **Public**: Yes
- **Path**: `logos/{filename}`
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/svg+xml`, `image/webp`
- **Max File Size**: 2MB

---

## How to Create Buckets in Supabase

### Via Supabase Dashboard

1. Go to **Storage** in Supabase Dashboard
2. Click **Create a new bucket**
3. Enter bucket name (e.g., `avatars`)
4. Toggle **Public bucket** to ON
5. Click **Create bucket**
6. Repeat for `portfolios` and `logos`

### Via SQL (Alternative)

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create portfolios bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true);

-- Create logos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true);
```

---

## Storage RLS Policies

Apply these policies to each bucket:

### avatars Bucket Policies

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

### portfolios Bucket Policies

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

### logos Bucket Policies

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

- [ ] `avatars` bucket created and public
- [ ] `portfolios` bucket created and public
- [ ] `logos` bucket created and public
- [ ] All RLS policies applied
- [ ] No permission denied errors
- [ ] Test upload works
- [ ] Test delete works
- [ ] Test public access works

---

## Next Steps

1. Create all 3 buckets in Supabase Dashboard
2. Apply all RLS policies
3. Test upload/delete functionality
4. Verify public access works
5. Move to Task 1.5 (RLS Policies for Database)
