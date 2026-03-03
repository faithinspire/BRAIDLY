# BRAIDLY - CRITICAL FIX TEST CHECKLIST ✅

## BEFORE TESTING
1. **Clear Browser Cache**: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"
2. **Hard Refresh**: Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
3. **Open Console**: Press `F12` to open Developer Tools

---

## TEST 1: NAVIGATION (CRITICAL) 🔴

### Steps:
1. Open `login.html` in browser
2. Login with demo account:
   - Email: `customer@braidly.com`
   - Password: `Customer123!`
3. You should land on `customer-dashboard.html`

### Test Navigation Links:
Click each link in the bottom navigation bar and verify:

| Link | Expected Result | Status |
|------|----------------|--------|
| 🏠 Home | Stays on customer-dashboard.html | ⬜ |
| 📅 Bookings | Goes to customer-bookings.html | ⬜ |
| ❤️ Favorites | Goes to customer-favorites.html | ⬜ |
| 🕐 History | Goes to customer-history.html | ⬜ |
| 👤 Profile | Goes to profile-settings.html | ⬜ |

### What to Check:
- ✅ Page loads without redirecting to login
- ✅ URL changes to correct page
- ✅ No "javascript:void" text appears when hovering over links
- ✅ No infinite redirect loops
- ✅ Bottom navigation bar visible on all pages

### If Navigation Fails:
1. Check browser console (F12) for errors
2. Check if `BRAIDLY_USER` exists in localStorage:
   - F12 → Application → Local Storage → Check for `BRAIDLY_USER`
3. Try logging out and logging back in

---

## TEST 2: AI CHATBOT (CRITICAL) 🤖

### Steps:
1. Open `index.html` (landing page) in browser
2. Look for floating purple chat button in **bottom-right corner**

### Test Chatbot Buttons:
| Button Location | Expected Result | Status |
|----------------|----------------|--------|
| Floating button (bottom-right) | Opens chat window | ⬜ |
| Navbar robot icon (top-right) | Opens chat window | ⬜ |
| Footer "Chat with AI" button | Opens chat window | ⬜ |

### What to Check:
- ✅ Floating button is visible (purple gradient circle with robot icon)
- ✅ Clicking button opens chat window with smooth animation
- ✅ Chat window appears above floating button
- ✅ Can type message and send
- ✅ Bot responds with relevant information
- ✅ Quick action buttons work (📅 How to Book, 💳 Payment Info, etc.)

### Console Logs to Verify:
Open browser console (F12) and look for these messages:
```
AI Chatbot: Attaching event listeners...
Floating button found: true
Navbar button found: true
Footer button found: true
AI Chatbot: Event listeners attached successfully
```

When you click the button, you should see:
```
toggleChat called, current state: false
Chat window toggled, new state: true
```

### If Chatbot Fails:
1. Check console for errors
2. Verify `js/ai-chatbot.js` is loaded (check Network tab in F12)
3. Try hard refresh (Ctrl+F5)
4. Check if floating button exists in DOM:
   - F12 → Elements → Search for `id="chat-toggle-btn"`

---

## TEST 3: THEME TOGGLE 🌙

### Steps:
1. On any page, look for moon/sun icon in top-right corner
2. Click the theme toggle button

### What to Check:
- ✅ Page switches between light and dark mode
- ✅ Icon changes from moon to sun (or vice versa)
- ✅ Theme persists when navigating to other pages
- ✅ All text remains readable in both modes

---

## TEST 4: LOGOUT 🚪

### Steps:
1. On any customer page, click "Logout" button in top-right
2. Confirm logout in popup

### What to Check:
- ✅ Redirects to `login.html`
- ✅ Cannot access customer pages without logging in again
- ✅ localStorage is cleared (F12 → Application → Local Storage)

---

## COMMON ISSUES & SOLUTIONS

### Issue: "javascript:void" appears when hovering over links
**Solution**: Hard refresh the page (Ctrl+F5). All javascript:void links have been removed.

### Issue: Pages redirect to login immediately
**Solution**: 
1. Check if you're logged in (localStorage should have `BRAIDLY_USER`)
2. Try logging in again
3. Check console for auth errors

### Issue: Chatbot button not visible
**Solution**:
1. Scroll to bottom-right corner of page
2. Check if button is hidden behind other elements
3. Try zooming out (Ctrl + Mouse Wheel)
4. Check console for JavaScript errors

### Issue: Chatbot doesn't open when clicked
**Solution**:
1. Check console for errors
2. Verify event listeners are attached (see console logs above)
3. Try clicking different chatbot buttons (navbar, footer, floating)
4. Hard refresh page

### Issue: Navigation loops back to home
**Solution**: This should be fixed. If it still happens:
1. Clear browser cache completely
2. Close and reopen browser
3. Check console for auth errors
4. Verify `js/auth-core.js` is loaded

---

## EXPECTED CONSOLE LOGS (NORMAL OPERATION)

When everything is working correctly, you should see:
```
AI Chatbot: Attaching event listeners...
Floating button found: true
Navbar button found: true
Footer button found: true
AI Chatbot: Event listeners attached successfully
```

When navigating between pages:
```
Auth already verified this session
```
OR
```
No auth state - redirecting to login
```

---

## REPORT ISSUES

If any test fails, please provide:
1. Which test failed (Test 1, 2, 3, or 4)
2. Browser name and version (Chrome, Firefox, Safari, etc.)
3. Screenshot of the issue
4. Console errors (F12 → Console tab)
5. Network errors (F12 → Network tab)

---

## SUCCESS CRITERIA ✅

All tests should pass:
- ✅ Navigation works smoothly without redirects
- ✅ AI Chatbot is visible and responsive
- ✅ Theme toggle works
- ✅ Logout works correctly
- ✅ No "javascript:void" text appears
- ✅ No console errors

If all tests pass, the app is ready for production! 🎉
