# Braidly Setup Guide

## Quick Start

### 1. Project Structure
```
braidly/
├── index.html                  # Landing page
├── customer-dashboard.html     # Customer dashboard
├── braider-dashboard.html      # Braider dashboard
├── booking.html                # Booking flow
├── admin-dashboard.html        # Admin panel
├── css/
│   ├── style.css              # Main landing page styles
│   ├── dashboard.css          # Customer dashboard styles
│   ├── braider-dashboard.css  # Braider dashboard styles
│   ├── booking.css            # Booking flow styles
│   └── admin-dashboard.css    # Admin panel styles
├── js/
│   ├── main.js                # Core functionality
│   ├── dashboard.js           # Customer dashboard logic
│   ├── braider-dashboard.js   # Braider dashboard logic
│   ├── booking.js             # Booking flow logic
│   ├── photo-editor.js        # Photo editing functionality
│   └── admin-dashboard.js     # Admin panel logic
├── assets/
│   └── images/                # Image assets (see below)
├── README.md                   # Project documentation
└── SETUP.md                    # This file
```

### 2. Required Image Assets

Create the following folders and add images:

```
assets/images/
├── hero-braiding.jpg          # Hero section background (1920x1080)
├── braider-working.jpg        # Braider CTA section (1200x800)
├── braider1.jpg               # Sample braider profile (400x400)
├── braider2.jpg               # Sample braider profile (400x400)
├── braider3.jpg               # Sample braider profile (400x400)
├── portfolio1.jpg             # Portfolio sample (600x600)
├── portfolio2.jpg             # Portfolio sample (600x600)
├── recent1.jpg                # Recently viewed (300x300)
├── recent2.jpg                # Recently viewed (300x300)
├── client1.jpg                # Client avatar (100x100)
├── client2.jpg                # Client avatar (100x100)
├── user-avatar.jpg            # Default user avatar (100x100)
├── braider-avatar.jpg         # Default braider avatar (100x100)
├── admin-avatar.jpg           # Admin avatar (100x100)
├── user1.jpg                  # Admin panel user (100x100)
├── user2.jpg                  # Admin panel user (100x100)
└── sample-braid.jpg           # Photo editor sample (800x800)
```

### 3. Image Specifications

#### Hero Section
- **hero-braiding.jpg**: 1920x1080px, high-quality image of professional braiding
- Should show a braider working or finished braids
- Bright, professional lighting

#### Braider Profiles
- **braider1-3.jpg**: 400x400px, square format
- Professional headshots or portfolio images
- Clear, well-lit photos

#### Portfolio Images
- **portfolio1-2.jpg**: 600x600px minimum
- High-quality finished braid work
- Various styles (box braids, knotless, cornrows, etc.)

#### Avatars
- **All avatars**: 100x100px minimum
- Square format, centered faces
- Professional appearance

### 4. Placeholder Images

If you don't have images yet, use these placeholder services:

```html
<!-- Hero Image -->
<img src="https://via.placeholder.com/1920x1080/667eea/ffffff?text=Professional+Braiding" alt="Hero">

<!-- Braider Profile -->
<img src="https://via.placeholder.com/400x400/667eea/ffffff?text=Braider" alt="Braider">

<!-- Portfolio -->
<img src="https://via.placeholder.com/600x600/667eea/ffffff?text=Portfolio" alt="Portfolio">

<!-- Avatar -->
<img src="https://via.placeholder.com/100x100/667eea/ffffff?text=User" alt="User">
```

Or use free stock photo services:
- Unsplash: https://unsplash.com/s/photos/braids
- Pexels: https://www.pexels.com/search/braids/
- Pixabay: https://pixabay.com/images/search/braids/

### 5. Running the Application

#### Option 1: Python HTTP Server
```bash
cd braidly
python -m http.server 8000
```
Then open: http://localhost:8000

#### Option 2: Node.js HTTP Server
```bash
cd braidly
npx http-server -p 8000
```
Then open: http://localhost:8000

#### Option 3: PHP Built-in Server
```bash
cd braidly
php -S localhost:8000
```
Then open: http://localhost:8000

#### Option 4: VS Code Live Server
1. Install "Live Server" extension
2. Right-click index.html
3. Select "Open with Live Server"

### 6. Testing Different User Roles

#### Customer Flow
1. Open `index.html`
2. Click "Sign Up" → "Continue as Customer"
3. Navigate to `customer-dashboard.html`
4. Test search, booking, and favorites

#### Braider Flow
1. Open `index.html`
2. Click "Join as a Braider"
3. Navigate to `braider-dashboard.html`
4. Test booking management, earnings, portfolio

#### Admin Flow
1. Navigate directly to `admin-dashboard.html`
2. Test verification, disputes, fraud alerts

### 7. Customization

#### Colors
Edit CSS variables in each stylesheet:
```css
:root {
    --primary-color: #667EEA;
    --secondary-color: #764ba2;
    --accent-color: #F6AD55;
    --success-color: #48BB78;
    --danger-color: #F56565;
}
```

#### Branding
Replace "Braidly" with your brand name in:
- All HTML files (navbar, footer, titles)
- README.md
- Meta tags

#### Features
Enable/disable features by commenting out sections in HTML files.

### 8. Production Deployment

#### Before Deployment:
1. Replace placeholder images with real images
2. Update API endpoints in JavaScript files
3. Add real payment gateway integration
4. Set up SSL certificate
5. Configure environment variables
6. Test all user flows thoroughly

#### Deployment Options:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable hosting
- **Traditional hosting**: Upload via FTP

### 9. API Integration Points

Update these in production:

```javascript
// js/main.js
const API_BASE_URL = 'https://api.braidly.com';

// Payment gateway
const STRIPE_PUBLIC_KEY = 'pk_live_...';

// Maps API
const GOOGLE_MAPS_API_KEY = 'AIza...';

// SMS notifications
const TWILIO_ACCOUNT_SID = 'AC...';
```

### 10. Database Schema (Backend)

You'll need these tables:
- users (customers, braiders, admins)
- bookings
- services
- payments
- reviews
- verifications
- disputes
- messages
- referrals

### 11. Security Checklist

- [ ] Implement user authentication (JWT or sessions)
- [ ] Add CSRF protection
- [ ] Sanitize all user inputs
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Secure file uploads
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Regular security audits

### 12. Performance Optimization

- [ ] Minify CSS and JavaScript
- [ ] Optimize images (WebP format)
- [ ] Enable gzip compression
- [ ] Add CDN for static assets
- [ ] Implement lazy loading
- [ ] Add service worker for PWA
- [ ] Optimize database queries
- [ ] Add caching layer

### 13. Browser Support

Tested and supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### 14. Accessibility

- All images have alt text
- Proper heading hierarchy
- Keyboard navigation support
- ARIA labels where needed
- Color contrast meets WCAG AA standards
- Form labels properly associated

### 15. Support & Documentation

For questions or issues:
- Email: support@braidly.com
- Documentation: https://docs.braidly.com
- GitHub Issues: https://github.com/yourusername/braidly/issues

### 16. License

MIT License - See LICENSE file for details

---

## Next Steps

1. Add your images to `assets/images/`
2. Start a local server
3. Test all features
4. Customize branding and colors
5. Set up backend API
6. Deploy to production

Happy coding! 🚀
