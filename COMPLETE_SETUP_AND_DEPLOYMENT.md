# Complete Setup & Deployment Guide

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env` file in root directory:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your Supabase project settings.

### 3. Start Development Server
```bash
npm run dev
```

You'll see:
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### 4. Open in Browser
- Desktop: `http://localhost:5173/`
- Phone: `http://192.168.x.x:5173/` (use Network URL)

---

## 📱 Phone Testing Setup

### Prerequisites
- Phone on same WiFi as computer
- Browser on phone (Chrome, Safari, Firefox)

### Steps

1. **Find Your Computer's IP**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Look for IPv4 address (e.g., `192.168.1.100`)

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Open on Phone**
   - Open browser on phone
   - Go to: `http://192.168.x.x:5173/`
   - App loads!

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't reach server | Check firewall, verify IP address |
| WebSocket fails | Already fixed in vite.config.js |
| Page blank | Check browser console for errors |
| Slow loading | Test on faster WiFi |

---

## 📲 PWA Installation

### Android (Chrome)
1. Open app in Chrome
2. Tap menu (⋮) → "Install app"
3. Tap "Install"
4. App on home screen ✅

### iOS (Safari)
1. Open app in Safari
2. Tap Share (↗️)
3. Scroll → "Add to Home Screen"
4. Tap "Add"
5. App on home screen ✅

### What PWA Gives You
- ✅ App icon on home screen
- ✅ Full-screen experience
- ✅ Works offline (cached content)
- ✅ Fast loading
- ✅ Native app feel

---

## 🔧 Development Workflow

### File Structure
```
braidly/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── context/        # React context (auth)
│   ├── services/       # API services (Supabase)
│   ├── styles/         # Global styles
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service worker
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── .env                # Environment variables
```

### Common Tasks

**Add a new page:**
1. Create `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`
3. Wrap with `<ProtectedRoute>` if needed

**Add a new component:**
1. Create `src/components/MyComponent.jsx`
2. Create `src/components/MyComponent.css`
3. Import and use in pages

**Update styles:**
1. Edit CSS files in `src/pages/` or `src/components/`
2. Changes auto-reload in browser

**Test on phone:**
1. Make changes
2. Phone browser auto-refreshes
3. Test immediately

---

## 🧪 Testing Checklist

### Before Deployment

**Authentication**
- [ ] Signup works (customer role)
- [ ] Signup works (braider role)
- [ ] Login works
- [ ] Logout works
- [ ] Redirects to correct dashboard
- [ ] Protected routes work

**UI/UX**
- [ ] Landing page loads
- [ ] All buttons clickable
- [ ] Forms work
- [ ] Images load
- [ ] Responsive on mobile
- [ ] Theme toggle works
- [ ] AI Chatbot works
- [ ] WhatsApp button works

**Features**
- [ ] Browse braiders works
- [ ] Booking works
- [ ] Payment form works
- [ ] Chat works
- [ ] Profile page works
- [ ] Dashboard displays correctly

**Performance**
- [ ] App loads in < 3 seconds
- [ ] No lag when scrolling
- [ ] Buttons respond immediately
- [ ] Forms submit without delay

**Network**
- [ ] Works on WiFi
- [ ] Works on 4G/5G
- [ ] Handles slow network
- [ ] Shows loading states
- [ ] Retries on failure

**PWA**
- [ ] Installs on Android
- [ ] Installs on iOS
- [ ] Works offline
- [ ] App icon appears
- [ ] Full-screen mode works

**Console**
- [ ] No JavaScript errors
- [ ] No CORS errors
- [ ] No network errors
- [ ] WebSocket connected

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Creates optimized `dist/` folder.

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Set Environment Variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

4. **Done!**
   - App deployed at `your-project.vercel.app`
   - Auto-deploys on push to main

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Drag dist/ folder to Netlify
```

**GitHub Pages:**
```bash
npm run build
# Push dist/ to gh-pages branch
```

---

## 🔐 Security Checklist

Before deployment:

- [ ] No API keys in code
- [ ] All secrets in `.env`
- [ ] `.env` in `.gitignore`
- [ ] CORS configured correctly
- [ ] RLS policies enabled
- [ ] No console.log() with sensitive data
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Rate limiting configured
- [ ] Input validation working
- [ ] Error messages don't leak info

---

## 📊 Monitoring

### After Deployment

**Check Logs:**
- Vercel: Dashboard → Deployments → Logs
- Supabase: Dashboard → Logs

**Monitor Performance:**
- Vercel: Dashboard → Analytics
- Browser: DevTools → Performance tab

**Track Errors:**
- Browser console (F12)
- Sentry (optional error tracking)

---

## 🐛 Debugging

### Common Issues

**App won't load:**
1. Check browser console (F12)
2. Check network tab
3. Verify `.env` variables
4. Check Supabase status

**Login doesn't work:**
1. Check Supabase auth settings
2. Verify email/password
3. Check RLS policies
4. Check browser console

**Slow performance:**
1. Check network tab
2. Check Performance tab
3. Optimize images
4. Enable caching

**PWA won't install:**
1. Must be HTTPS (automatic on Vercel)
2. Check manifest.json
3. Check service worker
4. Try different browser

---

## 📚 Resources

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [PWA Docs](https://web.dev/progressive-web-apps/)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up `.env` file
3. ✅ Start dev server: `npm run dev`
4. ✅ Test on phone
5. ✅ Run through testing checklist
6. ✅ Build for production: `npm run build`
7. ✅ Deploy to Vercel
8. ✅ Monitor and maintain

---

## 💡 Tips

- **Hot Reload:** Changes auto-reload in browser
- **Mobile DevTools:** F12 on phone to debug
- **Network Throttling:** Simulate slow network in DevTools
- **Offline Testing:** Disable WiFi to test PWA
- **Multiple Devices:** Test on different phones/browsers
- **Version Control:** Commit frequently
- **Environment Variables:** Never commit `.env`

---

## 🆘 Support

If you encounter issues:

1. Check console for errors (F12)
2. Check network tab for failed requests
3. Verify environment variables
4. Check Supabase status
5. Try clearing browser cache
6. Try different browser
7. Check GitHub issues
8. Ask for help!

---

Good luck! 🚀
