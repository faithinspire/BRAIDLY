# BRAIDLY - DEVELOPER GUIDE

## Quick Start for Developers

---

## 🎯 ARCHITECTURE OVERVIEW

### Core Systems:

1. **Authentication** - `js/auth-core.js`
   - Single file handles all auth
   - Uses localStorage for session
   - No complex async patterns

2. **Chatbot** - `js/chatbot.js`
   - Simple inline-styled component
   - Fixed at footer position
   - Auto-responses for common questions

3. **Supabase Integration** - `js/supabase-config.js`
   - Database connection
   - Auth provider
   - Real-time capabilities (optional)

---

## 📁 FILE STRUCTURE

```
braidly/
├── index.html                 # Landing page
├── login.html                 # Login page
├── signup.html                # Signup page
├── customer-dashboard.html    # Customer dashboard
├── braider-dashboard.html     # Braider dashboard
├── admin-dashboard.html       # Admin dashboard
├── profile-settings.html      # Profile & settings
│
├── js/
│   ├── auth-core.js          # ⭐ NEW: Core auth system
│   ├── chatbot.js            # ⭐ NEW: Simple chatbot
│   ├── supabase-config.js    # Supabase connection
│   ├── main.js               # Utility functions
│   ├── theme.js              # Dark/light theme
│   ├── dashboard.js          # Dashboard logic
│   ├── braider-dashboard.js  # Braider-specific
│   ├── admin-dashboard.js    # Admin-specific
│   └── location-search.js    # GPS/location
│
├── css/
│   ├── style.css             # Global styles
│   ├── auth.css              # Login/signup styles
│   ├── dashboard.css         # Dashboard styles
│   ├── footer-nav.css        # Footer navigation
│   └── theme.css             # Theme variables
│
└── assets/
    └── images/               # Logo and images
```

---

## 🔐 AUTHENTICATION SYSTEM

### How It Works:

```javascript
// 1. User logs in
const result = await window.braidlyLogin(email, password);

// 2. User data stored in localStorage
localStorage.setItem('BRAIDLY_USER', JSON.stringify({
    id: 'user-id',
    email: 'user@example.com',
    fullName: 'John Doe',
    role: 'customer'
}));

// 3. Dashboard pages check auth
window.protectPage(); // Redirects if not logged in

// 4. Login/signup pages check auth
window.redirectIfLoggedIn(); // Redirects if already logged in
```

### Available Functions:

```javascript
// Login
window.braidlyLogin(email, password)
// Returns: { success: true/false, user: {...}, error: '...' }

// Signup
window.braidlySignup(email, password, fullName, phone, role)
// Returns: { success: true/false, error: '...' }

// Logout
window.braidlyLogout()
// Clears storage and redirects to login

// Protect page (use on dashboards)
window.protectPage()
// Redirects to login if not authenticated

// Redirect if logged in (use on login/signup)
window.redirectIfLoggedIn()
// Redirects to dashboard if already authenticated

// Check login status
window.isLoggedIn()
// Returns: true/false

// Get current user
window.getCurrentUser()
// Returns: { id, email, fullName, role } or null
```

---

## 🤖 CHATBOT SYSTEM

### How It Works:

The chatbot is automatically added to all pages that include `js/chatbot.js`.

**Position:**
- Fixed at bottom right
- 90px from bottom (above footer nav)
- 20px from right edge
- z-index: 9998

**Features:**
- Click 💬 button to open
- Type message and press Enter
- Auto-responses for common questions
- Click X to close

### Customizing Responses:

Edit `js/chatbot.js` → `getBotResponse()` function:

```javascript
function getBotResponse(text) {
    text = text.toLowerCase();
    
    if (text.includes('your-keyword')) {
        return 'Your custom response';
    }
    
    // Add more conditions...
    
    return 'Default response';
}
```

---

## 🗄️ DATABASE SCHEMA

### Required Tables:

#### profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL,
    location TEXT,
    bio TEXT,
    avatar_url TEXT,
    preferences JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### bookings (optional)
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id),
    braider_id UUID REFERENCES profiles(id),
    style TEXT,
    date TIMESTAMP,
    status TEXT,
    price DECIMAL,
    created_at TIMESTAMP
);
```

---

## 🎨 STYLING GUIDE

### Theme Variables:

Located in `css/theme.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-color: #2d3748;
    --bg-color: #ffffff;
    --border-color: #e2e8f0;
}

[data-theme="dark"] {
    --text-color: #f7fafc;
    --bg-color: #1a202c;
    --border-color: #2d3748;
}
```

### Logo Styling:

```css
/* Auth pages (login/signup) */
img.auth-logo {
    height: 120px;
    background: transparent !important;
    mix-blend-mode: multiply;
    filter: brightness(1.3) contrast(1.2);
}

/* Dashboard pages */
.navbar-brand img {
    height: 50px;
    background: transparent !important;
    mix-blend-mode: multiply;
    filter: brightness(1.3) contrast(1.2);
}
```

---

## 🔧 ADDING NEW FEATURES

### Adding a New Dashboard Page:

1. **Create HTML file:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Page - Braidly</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <!-- Your content -->
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/supabase-config.js"></script>
    <script src="js/auth-core.js"></script>
    <script>window.protectPage();</script>
    <script src="js/chatbot.js"></script>
</body>
</html>
```

2. **Add to navigation:**
Update footer nav in dashboard HTML files.

### Adding a New Auth Function:

Edit `js/auth-core.js`:

```javascript
// Add new function
window.yourNewFunction = async function() {
    // Your code here
};
```

### Adding a New Chatbot Response:

Edit `js/chatbot.js` → `getBotResponse()`:

```javascript
function getBotResponse(text) {
    text = text.toLowerCase();
    
    if (text.includes('new-keyword')) {
        return 'New response';
    }
    
    // Existing responses...
}
```

---

## 🧪 TESTING

### Manual Testing:

```bash
# 1. Start local server
python -m http.server 8000
# or
npx serve

# 2. Open browser
http://localhost:8000

# 3. Test flows:
# - Signup → Login → Dashboard
# - Logout → Login again
# - Refresh page (should stay logged in)
# - Click chatbot
# - Check logo on all pages
```

### Automated Testing (Future):

```javascript
// Example test structure
describe('Authentication', () => {
    it('should login successfully', async () => {
        const result = await window.braidlyLogin('test@example.com', 'password');
        expect(result.success).toBe(true);
    });
    
    it('should persist session', () => {
        const user = window.getCurrentUser();
        expect(user).not.toBeNull();
    });
});
```

---

## 🐛 DEBUGGING

### Common Issues:

**Issue: "Supabase not configured"**
```javascript
// Check in browser console:
console.log(window.supabaseClient);
// Should show Supabase client object

// If undefined, check js/supabase-config.js
```

**Issue: User logged out immediately**
```javascript
// Check localStorage:
console.log(localStorage.getItem('BRAIDLY_USER'));
// Should show user object

// If null, auth is not persisting
// Clear cache and try again
```

**Issue: Chatbot not appearing**
```javascript
// Check if script loaded:
console.log(document.getElementById('braidly-chatbot'));
// Should show chatbot element

// If null, check js/chatbot.js is included
```

### Debug Mode:

Add to any page for debugging:

```javascript
// Show all auth state
console.log('Logged in:', window.isLoggedIn());
console.log('User:', window.getCurrentUser());
console.log('Storage:', localStorage.getItem('BRAIDLY_USER'));
```

---

## 📦 DEPENDENCIES

### Required:
- Bootstrap 5.3.2 (CSS framework)
- Font Awesome 6.4.2 (Icons)
- Supabase JS 2.x (Backend)

### Optional:
- Google Maps API (for location search)
- Stripe (for payments - future)

### CDN Links:
```html
<!-- Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

## 🚀 DEPLOYMENT

### Quick Deploy:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
git push origin main
```

### Environment Variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## 📝 CODE STYLE

### JavaScript:
- Use `const` and `let` (no `var`)
- Use arrow functions where appropriate
- Use async/await (no callbacks)
- Add comments for complex logic

### HTML:
- Use semantic HTML5 tags
- Add ARIA labels for accessibility
- Use Bootstrap classes for styling

### CSS:
- Use CSS variables for theming
- Mobile-first responsive design
- Use flexbox/grid for layouts

---

## 🎯 BEST PRACTICES

### Security:
- Never expose Supabase service key
- Use Row Level Security (RLS)
- Validate all user inputs
- Sanitize data before display

### Performance:
- Minimize JavaScript bundle size
- Lazy load images
- Use CDN for static assets
- Enable caching

### Accessibility:
- Use semantic HTML
- Add alt text to images
- Ensure keyboard navigation
- Test with screen readers

---

## 📞 SUPPORT

### Resources:
- Supabase Docs: https://supabase.com/docs
- Bootstrap Docs: https://getbootstrap.com/docs
- MDN Web Docs: https://developer.mozilla.org

### Getting Help:
1. Check browser console for errors
2. Review this guide
3. Check Supabase logs
4. Test in incognito mode

---

**Happy coding! 🚀**
