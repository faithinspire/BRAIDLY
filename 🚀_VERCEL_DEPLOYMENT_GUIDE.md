# 🚀 Vercel Deployment Guide

## Project Name Requirements

Vercel project names must follow these rules:
- ✅ Lowercase letters only
- ✅ Can include digits (0-9)
- ✅ Can include: `.`, `_`, `-`
- ❌ NO uppercase letters
- ❌ NO special characters (except `.`, `_`, `-`)
- ❌ NO sequence `---` (three hyphens)
- ❌ Maximum 100 characters

## Correct Project Name

**Use this name:** `braidly`

## Step-by-Step Deployment

### 1. Go to Vercel
- Visit https://vercel.com/new
- Sign in with your GitHub account

### 2. Import Repository
- Select "Import Git Repository"
- Paste: `https://github.com/faithinspire/BRAIDLY.git`
- Click "Continue"

### 3. Configure Project
- **Project Name:** `braidly` (lowercase)
- **Framework Preset:** Vite
- **Root Directory:** ./
- Click "Continue"

### 4. Environment Variables
Add these environment variables:
```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

Get these from your `.env` file or Supabase dashboard.

### 5. Deploy
- Click "Deploy"
- Wait for build to complete
- Your app will be live at: `https://braidly.vercel.app`

## If You Already Have an Invalid Project

1. Go to Vercel Dashboard
2. Find your project
3. Go to Settings → General
4. Click "Delete Project"
5. Confirm deletion
6. Create a new project with the correct name `braidly`

## Troubleshooting

**Error: "Project names can be up to 100 characters..."**
- Make sure your project name is: `braidly` (all lowercase)
- No spaces, no special characters except `.`, `_`, `-`
- No `---` sequence

**Build fails after deployment**
- Check that environment variables are set correctly
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check build logs in Vercel dashboard

**App shows blank page**
- Check browser console for errors
- Verify Supabase credentials are correct
- Check that service worker is registered

## Your Configuration

**Package Name:** `braidly-react` ✅
**Vercel Project Name:** `braidly` ✅
**Build Command:** `npm run build` ✅
**Output Directory:** `dist` ✅

Everything is configured correctly. Just use `braidly` as your Vercel project name!
