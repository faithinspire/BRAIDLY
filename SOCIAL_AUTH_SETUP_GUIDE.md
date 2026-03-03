# Social Authentication Setup Guide

## Overview

Braidly now supports Google and Apple authentication through Supabase. This guide will help you configure these providers.

---

## Features Added

### 1. ✅ Splash Screen
- Beautiful animated splash screen with hair animation
- Shows "Braidly" branding with crown icon
- Animated hair strands that wave
- Floating particles effect
- 3-second display before redirecting
- Automatically redirects based on login status:
  - Logged in → Appropriate dashboard (customer/braider/admin)
  - Not logged in → Login page

### 2. ✅ Google Authentication
- "Continue with Google" button on login page
- "Continue with Google" button on signup page
- One-click authentication
- Automatic account creation
- Profile data sync

### 3. ✅ Apple Authentication
- "Continue with Apple" button on login page
- "Continue with Apple" button on signup page
- One-click authentication
- Automatic account creation
- Profile data sync

---

## How to Configure

### Step 1: Enable Providers in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `rsemdxjizhkqaoptdxlc`
3. Click "Authentication" in the left sidebar
4. Click "Providers"
5. You'll see a list of authentication providers

---

### Step 2: Configure Google Authentication

#### In Google Cloud Console:

1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if prompted
6. Select "Web application" as application type
7. Add authorized redirect URIs:
   ```
   https://rsemdxjizhkqaoptdxlc.supabase.co/auth/v1/callback
   ```
8. Copy the Client ID and Client Secret

#### In Supabase Dashboard:

1. Go to Authentication → Providers
2. Find "Google" and click to expand
3. Toggle "Enable Sign in with Google"
4. Paste your Client ID
5. Paste your Client Secret
6. Click "Save"

---

### Step 3: Configure Apple Authentication

#### In Apple Developer Portal:

1. Go to https://developer.apple.com
2. Sign in with your Apple Developer account
3. Go to "Certificates, Identifiers & Profiles"
4. Click "Identifiers" → "+" to create new
5. Select "App IDs" and click "Continue"
6. Select "App" and click "Continue"
7. Fill in:
   - Description: Braidly
   - Bundle ID: com.braidly.app (or your domain)
8. Enable "Sign in with Apple"
9. Click "Continue" and "Register"

#### Create Service ID:

1. Go back to "Identifiers"
2. Click "+" to create new
3. Select "Services IDs" and click "Continue"
4. Fill in:
   - Description: Braidly Web
   - Identifier: com.braidly.web
5. Enable "Sign in with Apple"
6. Click "Configure"
7. Add domains and return URLs:
   - Domains: `rsemdxjizhkqaoptdxlc.supabase.co`
   - Return URLs: `https://rsemdxjizhkqaoptdxlc.supabase.co/auth/v1/callback`
8. Click "Save" and "Continue"

#### Create Private Key:

1. Go to "Keys" in left sidebar
2. Click "+" to create new key
3. Name it "Braidly Sign in with Apple Key"
4. Enable "Sign in with Apple"
5. Click "Configure" and select your App ID
6. Click "Save" and "Continue"
7. Click "Register"
8. Download the .p8 key file (you can only download once!)
9. Note the Key ID shown

#### In Supabase Dashboard:

1. Go to Authentication → Providers
2. Find "Apple" and click to expand
3. Toggle "Enable Sign in with Apple"
4. Fill in:
   - Services ID: com.braidly.web (from step above)
   - Team ID: Found in Apple Developer account (top right)
   - Key ID: From the key you created
   - Private Key: Open the .p8 file and paste contents
5. Click "Save"

---

## Step 4: Test Authentication

### Test Google Login:
1. Open your app: http://localhost:8000 (or your domain)
2. Click "Log In"
3. Click "Continue with Google"
4. Select your Google account
5. Should redirect to customer dashboard
6. Check that profile is created in Supabase

### Test Apple Login:
1. Open your app
2. Click "Log In"
3. Click "Continue with Apple"
4. Sign in with Apple ID
5. Should redirect to customer dashboard
6. Check that profile is created in Supabase

---

## Files Modified

### 1. splash.html (NEW)
- Beautiful animated splash screen
- Hair animation with waving strands
- Crown icon with bounce animation
- Floating particles
- Loading spinner
- Auto-redirects after 3 seconds

### 2. login.html
- Added "Continue with Google" button
- Added "Continue with Apple" button
- Added `loginWithGoogle()` function
- Added `loginWithApple()` function
- Integrated with Supabase OAuth

### 3. signup.html
- Added "Continue with Google" button
- Added "Continue with Apple" button
- Added `signupWithGoogle()` function
- Added `signupWithApple()` function
- Integrated with Supabase OAuth

### 4. css/auth.css
- Added `.social-btn` styles
- Hover effects with transform
- Gradient animation on hover
- Better divider styling
- Icon sizing

### 5. index.html
- Added splash screen redirect logic
- Uses sessionStorage to show splash once per session
- Redirects to splash.html on first visit

---

## How It Works

### Splash Screen Flow:
1. User visits index.html
2. Checks if splash was shown this session
3. If not shown → Redirect to splash.html
4. Splash shows for 3 seconds with animation
5. Checks if user is logged in
6. Redirects to appropriate page:
   - Admin → admin-dashboard.html
   - Braider → braider-dashboard.html
   - Customer → customer-dashboard.html
   - Not logged in → login.html

### Social Login Flow:
1. User clicks "Continue with Google/Apple"
2. Supabase initiates OAuth flow
3. User authenticates with provider
4. Provider redirects back to Supabase
5. Supabase creates/updates user account
6. Redirects to customer-dashboard.html
7. User is logged in

### Profile Creation:
- When user signs in with Google/Apple for first time
- Supabase automatically creates auth.users entry
- You need to create corresponding profiles entry
- Use Supabase Database Triggers or Functions
- Or handle in your application code

---

## Important Notes

### Security:
- Never commit OAuth secrets to git
- Use environment variables in production
- Keep .p8 key file secure
- Rotate keys periodically

### Redirect URLs:
- Must match exactly in provider settings
- Include protocol (https://)
- No trailing slashes
- Test in both development and production

### User Data:
- Google provides: email, name, profile picture
- Apple provides: email, name (optional)
- Store additional data in profiles table
- Sync on first login

### Testing:
- Test with multiple accounts
- Test signup and login separately
- Test on different browsers
- Test on mobile devices

---

## Troubleshooting

### "Google login is not configured yet"
- Check that Google provider is enabled in Supabase
- Verify Client ID and Secret are correct
- Check redirect URI matches exactly
- Clear browser cache and try again

### "Apple login is not configured yet"
- Check that Apple provider is enabled in Supabase
- Verify Services ID, Team ID, Key ID are correct
- Check private key is pasted correctly
- Ensure domain and return URL are configured

### Redirect not working:
- Check redirect URL in Supabase matches your domain
- Verify OAuth callback URL in provider settings
- Check browser console for errors
- Test with different browsers

### Profile not created:
- Check Supabase logs for errors
- Verify profiles table exists
- Check RLS policies allow inserts
- May need to create profile manually on first login

---

## Next Steps

### 1. Create Profile on Social Login
Add a database trigger or function to automatically create profile when user signs up via OAuth:

```sql
-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Sync Profile Data
Update profile when user logs in with updated info from provider.

### 3. Add More Providers
- Facebook
- Twitter
- GitHub
- Microsoft

### 4. Customize Redirect
Based on user role, redirect to appropriate dashboard.

---

## Summary

✅ Splash screen with beautiful hair animation
✅ Google authentication on login and signup
✅ Apple authentication on login and signup
✅ Supabase OAuth integration
✅ Automatic redirects based on login status
✅ Styled social login buttons
✅ Error handling and user feedback

Users can now sign in with Google or Apple in addition to email/password!

To activate:
1. Configure providers in Supabase Dashboard
2. Add OAuth credentials from Google/Apple
3. Test the login flow
4. Add profile creation trigger (optional)

See this guide for detailed setup instructions.
