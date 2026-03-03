# BRAIDLY - QUICK REFERENCE CARD

## 🚀 INSTANT START GUIDE

---

## ⚡ 3-STEP SETUP

### 1. Configure Supabase
Edit `js/supabase-config.js`:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 2. Create Database
Run in Supabase SQL Editor:
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Deploy
```bash
vercel --prod
# or
netlify deploy --prod
```

---

## 🔐 AUTH FUNCTIONS

```javascript
// Login
await window.braidlyLogin(email, password)

// Signup
await window.braidlySignup(email, password, fullName, phone, role)

// Logout
window.braidlyLogout()

// Protect page (dashboards)
window.protectPage()

// Redirect if logged in (login/signup)
window.redirectIfLoggedIn()

// Check status
window.isLoggedIn()  // true/false
window.getCurrentUser()  // user object or null
```

---

## 🤖 CHATBOT

**Position:** Bottom right, 90px from bottom
**Files:** `js/chatbot.js`
**Auto-loads on:** All dashboard pages

**Customize responses:**
Edit `getBotResponse()` function in `js/chatbot.js`

---

## 🎨 LOGO STYLING

```css
/* Auth pages (120px) */
<img src="..." style="height: 120px; background: transparent !important; mix-blend-mode: multiply; filter: brightness(1.3) contrast(1.2);">

/* Dashboards (50px) */
<img src="..." style="height: 50px; background: transparent !important; mix-blend-mode: multiply; filter: brightness(1.3) contrast(1.2);">
```

---

## 📁 KEY FILES

```
js/
├── auth-core.js       ⭐ Auth system
├── chatbot.js         ⭐ Chatbot
├── supabase-config.js  Configure here
├── main.js            Utilities
└── theme.js           Dark/light mode

Pages/
├── login.html
├── signup.html
├── customer-dashboard.html
├── braider-dashboard.html
└── admin-dashboard.html
```

---

## 🧪 TESTING

```bash
# 1. Clear cache
Ctrl+Shift+Delete

# 2. Test login
Go to login.html → Enter credentials → Should redirect to dashboard

# 3. Test persistence
Refresh page → Should stay logged in

# 4. Test chatbot
Click 💬 button → Should open at bottom right

# 5. Test logout
Click logout → Should redirect to login
```

---

## 🐛 QUICK FIXES

### Login loops?
```javascript
// Clear everything
localStorage.clear();
sessionStorage.clear();
// Hard refresh: Ctrl+Shift+R
```

### Chatbot not showing?
```javascript
// Check console
console.log(document.getElementById('braidly-chatbot'));
// Should show element, not null
```

### Logo has background?
```html
<!-- Add to img tag -->
style="background: transparent !important; mix-blend-mode: multiply;"
```

---

## 📊 FILE STATUS

### ✅ Active Files:
- `js/auth-core.js` - Auth system
- `js/chatbot.js` - Chatbot
- All dashboard HTML files

### ❌ Deprecated (Don't Use):
- `js/auth-system.js`
- `js/auth-guard.js`
- `js/supabase-auth.js`
- `js/auth.js`
- `js/logout.js`
- `js/ai-chatbot.js`

---

## 🎯 COMMON TASKS

### Add new dashboard page:
```html
<script src="js/auth-core.js"></script>
<script>window.protectPage();</script>
<script src="js/chatbot.js"></script>
```

### Add new auth function:
Edit `js/auth-core.js`, add:
```javascript
window.yourFunction = function() {
    // Your code
};
```

### Customize chatbot:
Edit `js/chatbot.js` → `getBotResponse()`

---

## 📞 SUPPORT

### Check These First:
1. Browser console (F12)
2. Network tab (F12)
3. Supabase logs
4. localStorage contents

### Common Issues:
- **Not configured** → Check `js/supabase-config.js`
- **Logout loop** → Clear cache
- **Chatbot missing** → Check script loaded
- **Logo background** → Hard refresh

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Supabase configured
- [ ] Database created
- [ ] RLS policies enabled
- [ ] Tested login/signup
- [ ] Tested on mobile
- [ ] Chatbot works
- [ ] Logo looks good
- [ ] No console errors

---

## 🎉 QUICK WINS

**Auth works:** ✅ No more logout loops
**Chatbot works:** ✅ Positioned at footer
**Logo clean:** ✅ No dark background
**Session persists:** ✅ Stays logged in
**Responsive:** ✅ Works on mobile

---

**Everything you need on one page! 🚀**
