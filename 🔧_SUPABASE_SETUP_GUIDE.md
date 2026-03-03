# Supabase Setup Guide - Braidly App

## Step 1: Create Storage Buckets

1. Go to Supabase Dashboard
2. Click **Storage** in the left sidebar
3. Click **Create a new bucket**

### Create 3 Buckets:

**Bucket 1: avatars**
- Name: `avatars`
- Public: ✅ Yes
- Click Create

**Bucket 2: portfolio**
- Name: `portfolio`
- Public: ✅ Yes
- Click Create

**Bucket 3: gallery**
- Name: `gallery`
- Public: ✅ Yes
- Click Create

## Step 2: Set Bucket Policies

For each bucket, set these policies:

1. Click the bucket name
2. Click **Policies** tab
3. Click **New Policy** > **For full customization**

### Policy 1: Allow Public Read
```sql
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

Repeat for `portfolio` and `gallery` buckets.

## Step 3: Create Admin User

1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Enter:
   - Email: `admin@braidly.com`
   - Password: (strong password)
4. Click **Create user**
5. Copy the User ID (UUID)

## Step 4: Create Admin Profile

1. Go to **SQL Editor**
2. Run the SQL from `supabase/create-admin-user.sql`
3. Replace `REPLACE_WITH_ADMIN_USER_ID` with the UUID from Step 3

## Step 5: Verify Setup

Test uploads:
1. Login as braider
2. Go to Profile > Upload Avatar
3. Select an image
4. Should upload successfully

Test portfolio:
1. Go to Portfolio > Upload Photos
2. Select images
3. Should upload successfully

## Troubleshooting

**Issue: "Bucket not found"**
- Ensure bucket names are exactly: `avatars`, `portfolio`, `gallery`
- Check bucket is public

**Issue: "Permission denied"**
- Verify policies are set correctly
- Check user is authenticated

**Issue: "Upload fails"**
- Check file size < 10MB
- Check file type is JPG/PNG/WebP
- Check Supabase connection

