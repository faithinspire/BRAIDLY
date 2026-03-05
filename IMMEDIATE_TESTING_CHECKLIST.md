# IMMEDIATE TESTING CHECKLIST

## Before You Start
- Make sure you have the latest code (all fixes applied)
- Restart your dev server: `npm run dev`
- Clear browser cache if needed

---

## Test 1: Form Input Visibility ✓
**Location**: Login or Signup page
**Steps**:
1. Go to http://localhost:5173/signup (or your phone IP)
2. Click on the "Full Name" input field
3. Type something
4. **Expected**: Text should be visible, bold, and dark colored
5. **Verify**: All form inputs (name, email, password) show text clearly

---

## Test 2: Signup Flow with Auto-Login ✓
**Location**: Signup page
**Steps**:
1. Go to http://localhost:5173/signup
2. Fill in form:
   - Full Name: Test User
   - Email: test@example.com (use unique email)
   - Password: password123
   - Role: Customer
3. Click "Create Account"
4. **Expected**: 
   - See green success message: "Account created! Logging in automatically..."
   - After 1 second, auto-login happens
   - Redirected to /customer/dashboard
5. **Verify**: You're logged in and on the correct dashboard

---

## Test 3: Login Flow ✓
**Location**: Login page
**Steps**:
1. Logout first (if logged in)
2. Go to http://localhost:5173/login
3. Fill in form:
   - Email: test@example.com (from Test 2)
   - Password: password123
4. Click "Sign In"
5. **Expected**: 
   - Redirected to /customer/dashboard
   - Profile loads properly
6. **Verify**: You're logged in and on the correct dashboard

---

## Test 4: Braider Signup & Login ✓
**Location**: Signup page
**Steps**:
1. Go to http://localhost:5173/signup
2. Fill in form:
   - Full Name: Test Braider
   - Email: braider@example.com (unique email)
   - Password: password123
   - Role: **Braider** (select this)
3. Click "Create Account"
4. **Expected**: 
   - Auto-login happens
   - Redirected to /braider/dashboard (NOT customer dashboard)
5. **Verify**: You're on the braider dashboard

---

## Test 5: Phone Testing ✓
**Location**: Your phone
**Steps**:
1. Get your computer's local IP (e.g., 192.168.1.100)
2. On phone, visit: http://192.168.1.100:5173
3. **Expected**: App loads without WebSocket errors
4. **Verify**: 
   - No "WebSocket closed without opened" error in console
   - Form inputs are visible
   - Signup/login works

---

## Test 6: Error Handling ✓
**Location**: Signup page
**Steps**:
1. Try to signup with invalid email (e.g., "notanemail")
2. **Expected**: Error message appears
3. Try to signup with password < 6 characters
4. **Expected**: Error message appears
5. Try to signup with existing email
6. **Expected**: Error message appears

---

## Browser Console Check
**Open DevTools** (F12) and check:
- ❌ No "WebSocket closed without opened" errors
- ❌ No "Failed to connect to websocket" errors
- ✓ Auth messages should be clear
- ✓ Profile loading should work

---

## If Something Fails

### WebSocket Still Failing?
- Check vite.config.js has proper HMR config
- Restart dev server: `npm run dev`
- Clear browser cache

### Form Text Not Visible?
- Check src/pages/Auth.css has input styling
- Verify color is #1f2937 (dark gray)
- Check background-color is #ffffff (white)

### Auto-Login Not Working?
- Check browser console for errors
- Verify profile is loading (check Network tab)
- Check Supabase credentials in .env

### Redirect Not Working?
- Check ProtectedRoute.jsx logic
- Verify profile.role is set correctly
- Check browser console for navigation errors

---

## Success Indicators

✅ Form inputs are visible and bold
✅ Signup auto-logs in user
✅ Login redirects to correct dashboard
✅ No WebSocket errors on phone
✅ Success/error messages display properly
✅ Profile loads after login

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Check for errors
npm run lint

# Build for production
npm run build
```

