# 🔧 Braidly Troubleshooting Guide

## ❌ Problem: "Invalid email or password" Error

### Solution 1: Use the Test Login Page (Easiest!)

1. Open: `test-login.html`
2. Click any "Quick Login" button
3. This will log you in automatically without typing

### Solution 2: Check Your Credentials

Make sure you're using the EXACT credentials (case-sensitive):

```
Customer: customer@braidly.com / Customer123!
Braider:  braider@braidly.com / Braider123!
Admin:    admin@braidly.com / Admin123!
```

**Common mistakes:**
- ❌ `Customer123` (missing !)
- ❌ `customer123!` (lowercase C)
- ❌ Extra spaces before or after
- ❌ Wrong email domain

### Solution 3: Clear Browser Cache

```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

Or use Incognito/Private browsing mode.

### Solution 4: Check Browser Console

1. Press F12 to open Developer Tools
2. Go to Console tab
3. Try logging in
4. Look for error messages
5. You should see logs like:
   - "Attempting login with email: customer@braidly.com"
   - "Demo account found: true"
   - "Password match! Logging in..."

### Solution 5: Verify File is Loaded

1. Open browser console (F12)
2. Type: `DEMO_ACCOUNTS`
3. Press Enter
4. You should see the account objects
5. If you see "undefined", the auth.js file isn't loading

---

## ❌ Problem: Page Not Loading

### Solution: Use a Local Server

Don't just double-click HTML files. Use a server:

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

## ❌ Problem: Images Not Showing

### Solution: Add Images

Images are placeholders. Add real images to:
```
assets/images/
├── hero-braiding.jpg
├── braider1.jpg
├── braider2.jpg
└── ... (see SETUP.md for full list)
```

Or use placeholder URLs in the HTML.

---

## ❌ Problem: Photo Editor Not Working

### Solutions:

1. **Upload an image first** - The editor needs an image to work
2. **Try different format** - Use JPG or PNG
3. **Check file size** - Keep under 5MB
4. **Check console** - Look for JavaScript errors

---

## ❌ Problem: Already Logged In

If you're stuck on a dashboard and want to test login again:

```javascript
// Open console (F12) and run:
localStorage.clear();
window.location.href = 'login.html';
```

---

## ❌ Problem: Can't Access Admin Dashboard

### Solution: Use Admin Credentials

```
Email:    admin@braidly.com
Password: Admin123!
```

Or access directly: `admin-dashboard.html`

---

## ❌ Problem: Payment Not Working

### Solution: Use Test Card

```
Card:   4242 4242 4242 4242
Expiry: 12/25 (any future date)
CVV:    123 (any 3 digits)
```

This is a demo - any valid format works.

---

## ❌ Problem: Form Validation Errors

### Solution: Check Requirements

**Password must have:**
- 8+ characters
- Uppercase letter
- Lowercase letter
- Number
- Special character (for new accounts)

**Email must be:**
- Valid format (user@domain.com)

---

## 🐛 Debug Mode

To see detailed login information:

1. Open `login.html`
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Try logging in
5. Watch the console logs

You'll see:
```
Attempting login with email: customer@braidly.com
Checking credentials...
Available demo accounts: ["customer@braidly.com", "braider@braidly.com", "admin@braidly.com"]
Demo account found: true
Checking password...
Password match! Logging in...
Redirecting to dashboard for role: customer
```

---

## 🔍 Quick Diagnostic

Run this in browser console (F12):

```javascript
// Check if auth.js is loaded
console.log('DEMO_ACCOUNTS:', typeof DEMO_ACCOUNTS !== 'undefined' ? 'Loaded' : 'Not loaded');

// Check localStorage
console.log('Logged in:', localStorage.getItem('isLoggedIn'));
console.log('User data:', localStorage.getItem('userData'));

// Test login function
console.log('handleLogin function:', typeof handleLogin !== 'undefined' ? 'Available' : 'Not available');
```

---

## 📞 Still Having Issues?

### Try These Steps in Order:

1. ✅ Use `test-login.html` (one-click login)
2. ✅ Clear browser cache and localStorage
3. ✅ Use incognito/private mode
4. ✅ Check browser console for errors
5. ✅ Verify you're using a local server
6. ✅ Try a different browser
7. ✅ Check the exact credentials (copy from this file)

### Files to Check:

- `js/auth.js` - Authentication logic
- `login.html` - Login form
- Browser console (F12) - Error messages

---

## ✅ Working? Great!

If login is working:
- Test all three roles (Customer, Braider, Admin)
- Try the booking flow
- Play with the photo editor
- Explore admin features

---

## 🎯 Quick Test Checklist

- [ ] Can access test-login.html
- [ ] Can click "Quick Login" buttons
- [ ] Gets redirected to dashboard
- [ ] Can see user data in dashboard
- [ ] Can logout and login again
- [ ] Can access all three roles

---

**Need more help? Check:**
- `QUICK_START.md` - Full walkthrough
- `README.md` - Complete documentation
- `ACCESS_GUIDE.txt` - Access instructions
