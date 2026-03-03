# 🚀 Braidly Quick Start Guide

## Get Started in 3 Steps!

### Step 1: Open the Application
```bash
# Option A: Using Python
python -m http.server 8000

# Option B: Using Node.js
npx http-server -p 8000

# Option C: Using PHP
php -S localhost:8000

# Option D: Just double-click index.html
```

Then open: **http://localhost:8000**

---

### Step 2: Choose Your Login

Go to the login page and use one of these accounts:

#### 👤 **Customer Account**
```
Email: customer@braidly.com
Password: Customer123!
```
**What you'll see:**
- Search for braiders
- Browse featured braiders
- Book appointments
- View favorites
- Referral program

---

#### ✂️ **Braider Account**
```
Email: braider@braidly.com
Password: Braider123!
```
**What you'll see:**
- Earnings dashboard ($1,200)
- Upcoming appointments (4)
- Portfolio editor with photo tools
- Booking management
- Payout requests

---

#### 🛡️ **Admin Account**
```
Email: admin@braidly.com
Password: Admin123!
```
**What you'll see:**
- Platform statistics
- User management (2,547 users)
- Verification queue (15 pending)
- Dispute center (23 active)
- Fraud alerts
- Financial overview ($45.2K)

---

### Step 3: Explore Features

#### As a Customer:
1. **Search** → Enter location and style
2. **Browse** → View featured braiders
3. **Book** → Click "View Profile" → "Book Now"
4. **Pay** → Complete payment (demo mode)
5. **Confirm** → See booking confirmation

#### As a Braider:
1. **Dashboard** → View earnings and stats
2. **Bookings** → Accept/decline appointments
3. **Portfolio** → Click "Add Photos" to use photo editor
4. **Edit Photos** → Apply filters, adjust brightness, crop
5. **Earnings** → Request payout

#### As an Admin:
1. **Overview** → See platform statistics
2. **Verification** → Approve/reject ID checks
3. **Disputes** → Handle customer complaints
4. **Fraud** → Investigate suspicious activity
5. **Reports** → View financial data

---

## 🎯 Key Pages to Test

### Public Pages (No Login Required)
- **Landing Page**: `index.html`
- **Sign Up**: `signup.html`
- **Login**: `login.html`

### Customer Pages
- **Dashboard**: `customer-dashboard.html`
- **Booking**: `booking.html`
- **Payment**: `payment.html`

### Braider Pages
- **Dashboard**: `braider-dashboard.html`
- **Photo Editor**: Click "Add Photos" in portfolio section

### Admin Pages
- **Dashboard**: `admin-dashboard.html`

---

## 🎨 Photo Editor Features

1. Click "Add Photos" in braider dashboard
2. Upload an image
3. Try these features:
   - **Filters**: Original, Bright, Contrast, Vintage, B&W
   - **Brightness**: Adjust slider
   - **Contrast**: Adjust slider
   - **Saturation**: Adjust slider
   - **Rotate**: Click rotate buttons
   - **Crop**: Use crop tool
4. Click "Save to Portfolio"

---

## 💡 Pro Tips

### Testing Booking Flow:
1. Login as customer
2. Click any braider's "View Profile"
3. Select a service (Box Braids, Knotless, etc.)
4. Choose date and time
5. Select location (Mobile/Salon)
6. Proceed to payment
7. Enter card: `4242 4242 4242 4242`
8. Expiry: Any future date (e.g., `12/25`)
9. CVV: Any 3 digits (e.g., `123`)
10. Confirm payment

### Testing Admin Features:
1. Login as admin
2. Click "Approve" on verification requests
3. Handle disputes with refund options
4. Review fraud alerts
5. Check financial overview

### Creating Your Own Account:
1. Go to `signup.html`
2. Choose role (Customer or Braider)
3. Fill in any details
4. Password must have:
   - 8+ characters
   - Uppercase letter
   - Lowercase letter
   - Number
5. Sign up and you're in!

---

## 🔄 Reset Demo Data

To start fresh:
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

Or just use **Incognito/Private browsing mode**.

---

## 📱 Mobile Testing

1. Open on your phone's browser
2. Or use Chrome DevTools:
   - Press F12
   - Click device toolbar icon
   - Select iPhone/Android
3. Test bottom navigation
4. Try touch gestures

---

## 🐛 Troubleshooting

**Can't see images?**
- Images are placeholders
- Add real images to `assets/images/` folder
- See `SETUP.md` for image specifications

**Login not working?**
- Check you're using exact credentials
- Try clearing browser cache
- Use incognito mode

**Page looks broken?**
- Make sure you're running a local server
- Don't just open HTML files directly
- Check browser console for errors

**Photo editor not working?**
- Upload an image first
- Check browser console for errors
- Try a different image format (JPG, PNG)

---

## 🎓 Next Steps

1. ✅ Test all three user roles
2. ✅ Try the booking flow end-to-end
3. ✅ Play with the photo editor
4. ✅ Explore admin features
5. 📖 Read `README.md` for full documentation
6. 🔧 Check `SETUP.md` for deployment guide
7. 🚀 Add backend integration (see `PROJECT_SUMMARY.md`)

---

## 📞 Need Help?

- 📖 Full docs: `README.md`
- 🔧 Setup guide: `SETUP.md`
- 📊 Feature list: `PROJECT_SUMMARY.md`
- 🔐 All credentials: `DEMO_CREDENTIALS.md`

---

## 🎉 Enjoy Exploring Braidly!

You now have access to a complete marketplace platform with:
- ✅ 3 user roles (Customer, Braider, Admin)
- ✅ Escrow payment system
- ✅ Photo editor with filters
- ✅ Booking management
- ✅ Admin tools
- ✅ Mobile responsive design

**Have fun testing!** 🚀

---

*Built with ❤️ for the braiding community*
