# 🚀 GET RUNNING NOW - 3 STEPS

## ✅ Step 1: Setup Database (5 minutes)

### Go to Supabase
1. Open https://app.supabase.com
2. Login with your account
3. Select project: **rsemdjxizhkqaoptdxlc**

### Run Database Schema
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open file: `supabase/schema.sql` (in your project)
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** button (or Ctrl+Enter)
7. Wait for ✅ success message

### Create Storage Buckets
1. Click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Name: `avatars` → Make Public → Create
4. Repeat for `portfolio` bucket
5. Repeat for `gallery` bucket

**Done!** ✅

---

## ✅ Step 2: Start Dev Server (1 minute)

```bash
# In terminal, go to project directory
cd braidly

# Start development server
npm run dev
```

You should see:
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

**Done!** ✅

---

## ✅ Step 3: Create Account & Test (2 minutes)

### Open App
1. Click link: http://localhost:5173/
2. You should see the **BRAIDELY** login page

### Sign Up
1. Click **Sign up** link
2. Select **I'm a Customer**
3. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Location: `New York, NY`
4. Click **Sign Up**

### You Should See
✅ Customer Dashboard  
✅ Demo braiders showing  
✅ Search bar working  
✅ Stats showing  

**Done!** ✅

---

## 🎉 You're Running!

The app is now live at: **http://localhost:5173**

### What You Can Do
- ✅ Sign up as customer or braider
- ✅ Browse braiders (demo data)
- ✅ Search by location
- ✅ View admin dashboard
- ✅ Test all features

### Next Steps
1. **Create more test accounts**
   - Customer account
   - Braider account
   - Admin account

2. **Test all features**
   - Browse braiders
   - Book appointments
   - Chat system
   - Admin dashboard

3. **Deploy to production**
   - Follow `DEPLOYMENT_CHECKLIST.md`
   - Push to GitHub
   - Deploy to Vercel

---

## ⚠️ If Something Goes Wrong

### "Auth session missing" Error
- This is **normal** when not logged in
- Just sign up with a new account
- Error should disappear

### "Database tables not found" Error
- You skipped Step 1
- Go back and run the schema.sql file
- Refresh the app

### "Storage bucket not found" Error
- You skipped creating storage buckets
- Go back and create them
- Refresh the app

### Still Having Issues?
- Check `TROUBLESHOOTING.md`
- Check browser console (F12)
- Restart dev server: `npm run dev`
- Clear browser cache: `Ctrl+Shift+Delete`

---

## 📱 Test on Mobile

### Option 1: Same Network
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac)
2. On phone, visit: `http://YOUR_IP:5173`
3. Should work on same WiFi

### Option 2: Browser DevTools
1. Press F12 in browser
2. Click device icon (top left)
3. Select mobile device
4. Test responsive design

---

## 🎯 Success Checklist

- [ ] Database schema created
- [ ] Storage buckets created
- [ ] Dev server running
- [ ] App loads at localhost:5173
- [ ] Can sign up
- [ ] Can login
- [ ] Dashboard shows
- [ ] Demo braiders visible
- [ ] Search works
- [ ] No console errors

---

## 📊 What's Working

✅ **Authentication**
- Sign up with email/password
- Login with credentials
- Role selection (customer/braider)
- Protected routes

✅ **Customer Features**
- Browse braiders
- Search by location
- View braider profiles
- Demo data showing

✅ **Braider Features**
- Dashboard with stats
- Booking management
- Profile editing

✅ **Admin Features**
- Admin dashboard
- User management
- Booking monitoring

✅ **Mobile**
- Fully responsive
- Touch-friendly
- Works on all devices

---

## 🚀 Ready to Deploy?

Once everything is working locally:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "International standard rebuild complete"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import GitHub repository
   - Set environment variables
   - Deploy

3. **Your app is live!**
   - Share the URL
   - Invite users
   - Start getting bookings

---

## 💡 Pro Tips

### Faster Development
- Use `npm run dev` for hot reload
- Keep browser DevTools open (F12)
- Use React DevTools extension
- Check console for errors

### Testing
- Create multiple test accounts
- Test on different browsers
- Test on mobile devices
- Test all user flows

### Debugging
- Use browser DevTools (F12)
- Check Network tab for API calls
- Check Console for errors
- Use React DevTools for state

---

## 📞 Need Help?

1. **Check Troubleshooting**: `TROUBLESHOOTING.md`
2. **Check Setup Guide**: `SETUP_INSTRUCTIONS.md`
3. **Check Docs**: `INTERNATIONAL_REBUILD_GUIDE.md`
4. **Check Browser Console**: F12 → Console tab

---

**Status**: ✅ Ready to Run  
**Time**: ~10 minutes  
**Difficulty**: Easy  

**Let's go! 🚀**
