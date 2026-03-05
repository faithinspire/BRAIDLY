# BRAIDLY - IMMEDIATE TESTING GUIDE

## Server Status
✅ Dev server is running on `http://localhost:5173/`

## Quick Test Checklist

### Test 1: Signup as Customer
1. Open `http://localhost:5173/signup`
2. Fill in:
   - Full Name: `Test Customer`
   - Email: `customer@test.com`
   - Password: `password123`
   - Role: `Customer`
3. Click "Create Account"
4. **Expected**: Redirect to `/customer/dashboard`
5. **Verify**: URL shows `/customer/dashboard`, navbar shows "Logout" button

### Test 2: Logout
1. Click "Logout" button in navbar
2. **Expected**: Redirect to landing page (`/`)
3. **Verify**: URL shows `/`, see "Sign In" and "Get Started" buttons

### Test 3: Login as Customer
1. Go to `http://localhost:5173/login`
2. Fill in:
   - Email: `customer@test.com`
   - Password: `password123`
3. Click "Sign In"
4. **Expected**: Redirect to `/customer/dashboard`
5. **Verify**: URL shows `/customer/dashboard`

### Test 4: Signup as Braider
1. Logout first
2. Go to `http://localhost:5173/signup`
3. Fill in:
   - Full Name: `Test Braider`
   - Email: `braider@test.com`
   - Password: `password123`
   - Role: `Braider`
4. Click "Create Account"
5. **Expected**: Redirect to `/braider/dashboard`
6. **Verify**: URL shows `/braider/dashboard`

### Test 5: Login as Braider
1. Logout first
2. Go to `http://localhost:5173/login`
3. Fill in:
   - Email: `braider@test.com`
   - Password: `password123`
4. Click "Sign In"
5. **Expected**: Redirect to `/braider/dashboard`
6. **Verify**: URL shows `/braider/dashboard`

### Test 6: Protected Routes (Role Mismatch)
1. Login as customer
2. Try to access `http://localhost:5173/braider/dashboard`
3. **Expected**: Redirect to `/customer/dashboard` (NOT landing page)
4. **Verify**: URL shows `/customer/dashboard`

### Test 7: Protected Routes (Not Logged In)
1. Logout
2. Try to access `http://localhost:5173/customer/dashboard`
3. **Expected**: Redirect to `/login`
4. **Verify**: URL shows `/login`

### Test 8: Background Images
1. Open any page (Landing, Login, Signup, Dashboard)
2. **Expected**: See animated background images transitioning
3. **Verify**: Images fade in/out smoothly, no black gaps

### Test 9: Navbar Consistency
1. Navigate through different pages
2. **Expected**: Navbar appears on all pages
3. **Verify**: Logo and buttons are consistent

### Test 10: Error Handling
1. Go to `/login`
2. Enter wrong email/password
3. Click "Sign In"
4. **Expected**: See error message "Login failed"
5. **Verify**: Button re-enables, can try again

## Browser Console Check
1. Open browser DevTools (F12)
2. Go to Console tab
3. **Expected**: No red errors
4. **Verify**: Only info/warning messages if any

## Common Issues & Solutions

### Issue: Blank Page
- **Solution**: Hard refresh (Ctrl+Shift+R)
- **Check**: Browser console for errors

### Issue: Redirect to Landing Page Instead of Dashboard
- **Solution**: This should be fixed now
- **Check**: Verify ProtectedRoute.jsx has role-based redirects

### Issue: Images Not Loading
- **Solution**: Check if `/backgrounds/bg1.jpg` etc. exist in `public/backgrounds/`
- **Check**: Network tab in DevTools

### Issue: Logout Not Working
- **Solution**: Check if logout button is disabled
- **Check**: Browser console for errors

## Success Criteria

✅ All 10 tests pass
✅ No console errors
✅ Redirects work correctly
✅ Background images animate
✅ Navbar is consistent
✅ Error messages display properly

## Next Steps

If all tests pass:
1. Test on mobile device (responsive design)
2. Test PWA install button
3. Test WhatsApp chat button
4. Test AI chatbot
5. Test theme toggle

If any test fails:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify Supabase connection
4. Check `.env` file has correct credentials
