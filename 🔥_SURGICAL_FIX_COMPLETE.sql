-- 🔥 SURGICAL FIX - PERMANENT BACKEND SOLUTION
-- Run this in Supabase SQL Editor

-- ✅ STEP 1: CREATE/ENSURE BUCKETS (SAFE - NO DUPLICATES)
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true) 
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('portfolio', 'portfolio', true) 
on conflict (id) do nothing;

-- ✅ STEP 2: STORAGE POLICIES (FIXES NO BUCKET FOUND)

-- AVATARS UPLOAD POLICY
create policy "avatars upload" on storage.objects 
for insert with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);

-- AVATARS READ POLICY
create policy "avatars read" on storage.objects 
for select using (bucket_id = 'avatars');

-- PORTFOLIO UPLOAD POLICY
create policy "portfolio upload" on storage.objects 
for insert with check (
  bucket_id = 'portfolio'
  and auth.role() = 'authenticated'
);

-- PORTFOLIO READ POLICY
create policy "portfolio read" on storage.objects 
for select using (bucket_id = 'portfolio');

-- ✅ STEP 3: PROFILES TABLE (CLEAN & SAFE)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text default 'braider',
  created_at timestamp default now()
);

alter table profiles enable row level security;

create policy "profiles read own" on profiles 
for select using (auth.uid() = id);

create policy "profiles update own" on profiles 
for update using (auth.uid() = id);

-- ✅ STEP 4: PORTFOLIO TABLE (CLEAN & SAFE)
create table if not exists portfolio (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  image_url text not null,
  title text,
  created_at timestamp default now()
);

alter table portfolio enable row level security;

create policy "portfolio insert own" on portfolio 
for insert with check (auth.uid() = user_id);

create policy "portfolio read all" on portfolio 
for select using (true);

-- ✅ VERIFICATION
-- Run these to verify:
-- SELECT * FROM storage.buckets;
-- SELECT * FROM storage.objects LIMIT 5;
-- SELECT * FROM profiles LIMIT 5;
-- SELECT * FROM portfolio LIMIT 5;
