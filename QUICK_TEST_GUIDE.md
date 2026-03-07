# QUICK TEST GUIDE - BRAIDLY

## 🚀 START HERE

### Step 1: Open Application
```
URL: http://localhost:5180/
```

### Step 2: Hard Refresh Browser
- **Windows**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### Step 3: You Should See
- BRAIDLY logo
- "Connect with Professional Braiders" heading
- "Get Started" and "Sign In" buttons
- Beautiful animated background

---

## ✅ TEST FLOWS

### Test 1: Customer Signup
1. Click "Get Started"
2. Fill form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Role: `Customer`
3. Click "Create Account"
4. **Expected**: Auto-login and redirect to Customer Dashboard

### Test 2: Customer Dashboard
1. After signup, you should see:
   - Welcome message: "Welcome, John Doe"
   - Stats: Total Bookings, Completed, Pending
   - Quick Actions: Browse Braiders, My Bookings, Messages, My Profile
   - Your Bookings section (empty initially)

### Test 3: Browse Braiders
1. Click "Browse Braiders" button
2. You should see:
   - Filter options: Location, Rating, Style
   - Sample braiders: Amara Johnson, Zara Williams, Nadia Brown
   - Each braider card shows: name, location, rating, style, price

### Test 4: Create Booking
1. Click "My Bookings"
2. Click "New Booking" button
3. Fill form:
   - Braider ID: `braider_1`
   - Appointment Date: Select any future date
   - Amount: `150`
   - Notes: `Any special requests`
4. Click "Create Booking"
5. **Expected**: Booking appears in list

### Test 5: Send Message
1. Click "Messages"
2. You should see empty conversations initially
3. Send a test message to start conversation
4. **Expected**: Message appears in chat

### Test 6: Logout & Login
1. Click profile or logout button
2. Go to `/login`
3. Enter credentials:
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Sign In"
5. **Expected**: Redirect to Customer Dashboard

### Test 7: Braider Signup
1. Go to `/signup`
2. Fill form:
   - Full Name: `Jane Smith`
   - Email: `jane@example.com`
   - Password: `password123`
   - Role: `Braider`
3. Click "Create Account"
4. **Expected**: Auto-login and redirect to Braider Dashboard

### Test 8: Braider Dashboard
1. After braider signup, you should see:
   - Welcome message: "Welcome, Jane Smith"
   - Stats: Total Bookings, Wallet Balance, Rating
   - Quick Actions: My Bookings, Wallet, Messages, My Profile
   - Recent Bookings section

---

## 🔍 WHAT TO VERIFY

### Authentication
- ✅ Signup creates account
- ✅ Login validates credentials
- ✅ Auto-login after signup works
- ✅ Logout clears session
- ✅ Session persists on page refresh
- ✅ Wrong password shows error
- ✅ Duplicate email shows error

### Navigation
- ✅ Customer redirects to customer dashboard
- ✅ Braider redirects to braider dashboard
- ✅ Protected routes block unauthorized access
- ✅ All buttons navigate correctly

### Data
- ✅ Bookings persist after refresh
- ✅ Messages persist after refresh
- ✅ User data persists after refresh
- ✅ Filters work correctly

### UI
- ✅ Forms display correctly
- ✅ Error messages show
- ✅ Loading states appear
- ✅ Buttons are clickable
- ✅ Responsive on mobile

---

## 🐛 TROUBLESHOOTING

### Issue: Blank Page
**Solution**: 
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Check browser console (F12)

### Issue: Login Fails
**Solution**:
1. Verify email/password are correct
2. Check if account was created
3. Try signup first

### Issue: Dashboard Won't Load
**Solution**:
1. Check browser console for errors
2. Verify you're logged in
3. Try hard refresh

### Issue: Messages Not Showing
**Solution**:
1. Verify you're in correct conversation
2. Try sending a new message
3. Check localStorage in DevTools

---

## 📱 MOBILE TESTING

1. Open on mobile device: `http://10.98.162.234:5180/`
2. Test signup on mobile
3. Test all pages on mobile
4. Verify responsive design
5. Test touch interactions

---

## ✨ SUCCESS CRITERIA

All tests pass when:
- ✅ Signup works without errors
- ✅ Login works without errors
- ✅ Dashboard loads correctly
- ✅ All pages are accessible
- ✅ Data persists correctly
- ✅ No console errors
- ✅ Responsive on all devices

---

## 📊 TEST RESULTS

After testing, document:
- [ ] Signup works
- [ ] Login works
- [ ] Customer dashboard loads
- [ ] Braider dashboard loads
- [ ] Browse braiders works
- [ ] Create booking works
- [ ] Send message works
- [ ] Logout works
- [ ] Session persists
- [ ] No console errors

---

## 🎯 FINAL CHECKLIST

- [ ] Open http://localhost:5180/
- [ ] Hard refresh browser
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test all dashboards
- [ ] Test all features
- [ ] Check browser console
- [ ] Test on mobile
- [ ] Document any issues

**Ready to test!** 🚀
