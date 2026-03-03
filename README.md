# Braidly - Professional Braiding Services Platform

A comprehensive web application connecting customers with verified professional braiders. Built with Bootstrap 5, featuring secure escrow payments, real-time booking, and advanced photo editing capabilities.

## 🌟 Features

### For Customers
- **Smart Search & Discovery**: Find verified braiders by location, style, and availability
- **Secure Booking System**: Book appointments with real-time calendar integration
- **Escrow Payment Protection**: Funds held securely until service completion
- **Rating & Reviews**: Read authentic reviews from verified customers
- **Mobile & Salon Options**: Choose between mobile service or salon visit
- **Real-time Notifications**: Stay updated on booking status
- **Referral Program**: Earn $10 credit for each friend referred

### For Braiders
- **Professional Dashboard**: Manage bookings, earnings, and schedule
- **Portfolio Management**: Showcase your work with built-in photo editor
- **Earnings Tracking**: Real-time earnings with transparent commission structure
- **Verification System**: Multi-tier verification with safety badges
- **Route Navigation**: Integrated GPS for mobile services
- **Client Communication**: In-app messaging system
- **Analytics**: Track performance and growth metrics

### For Admins
- **User Management**: Comprehensive user oversight
- **Verification Queue**: ID and background check processing
- **Dispute Resolution**: Handle customer complaints and refunds
- **Fraud Detection**: Automated flagging of suspicious activity
- **Financial Overview**: Platform-wide earnings and transactions
- **Badge Assignment**: Manage verification tiers

## 🎨 Photo Editor Features

Advanced photo editing capabilities for braiders to enhance portfolio images:

- **Filters**: Original, Bright, Contrast, Vintage, B&W
- **Adjustments**: Brightness, Contrast, Saturation controls
- **Crop & Rotate**: Precise image manipulation
- **Real-time Preview**: See changes instantly
- **High-Quality Export**: Save edited images in PNG format

## 🏗️ Project Structure

```
braidly/
├── index.html                  # Landing page
├── customer-dashboard.html     # Customer dashboard
├── braider-dashboard.html      # Braider dashboard
├── booking.html                # Booking flow
├── css/
│   ├── style.css              # Main styles
│   ├── dashboard.css          # Dashboard styles
│   ├── braider-dashboard.css  # Braider dashboard styles
│   └── booking.css            # Booking flow styles
├── js/
│   ├── main.js                # Core functionality
│   ├── dashboard.js           # Customer dashboard logic
│   ├── braider-dashboard.js   # Braider dashboard logic
│   ├── booking.js             # Booking flow logic
│   └── photo-editor.js        # Photo editing functionality
├── assets/
│   └── images/                # Image assets
└── README.md
```

## 🚀 Getting Started

### Quick Start (3 Steps!)

1. **Start a local server:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

2. **Open your browser:**
```
http://localhost:8000
```

3. **Login with demo credentials:**

#### 👤 Customer Account
```
Email: customer@braidly.com
Password: Customer123!
```

#### ✂️ Braider Account
```
Email: braider@braidly.com
Password: Braider123!
```

#### 🛡️ Admin Account
```
Email: admin@braidly.com
Password: Admin123!
```

📖 **See `QUICK_START.md` for detailed walkthrough!**

## 💳 Payment Flow

### Escrow System
1. Customer pays for service
2. Funds move to Braidly escrow account
3. Booking confirmed, both parties notified
4. Service completed
5. Customer marks as complete or auto-release after 48 hours
6. Commission deducted (15-25%)
7. Remaining funds sent to braider

### Dispute Handling
- Customer can report issues with photo evidence
- Admin reviews booking details and history
- Resolution options: Full refund, Partial refund, Release funds
- Braider may receive warning or suspension

## 🔐 Verification System

### Tier 1 - Basic Verification (Required)
- Government ID upload
- Live selfie capture
- Face match verification
- Address confirmation

### Tier 2 - Background Check (Optional)
- SSN/ITIN/Passport submission
- Criminal record screening
- Safety badge upon approval

### Tier 3 - Pro Badge
- Complete 50+ bookings
- Maintain 4.5+ rating
- Zero safety violations

## 📱 Responsive Design

Fully responsive design optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Development Phases

### Phase 1 - MVP (Current)
- ✅ User registration and authentication
- ✅ Profile setup for customers and braiders
- ✅ Search and discovery
- ✅ Booking system
- ✅ Escrow payments
- ✅ Basic ID verification
- ✅ Reviews and ratings
- ✅ Admin dashboard

### Phase 2 - Trust Expansion
- Background checks integration
- Badge tier system
- Fraud detection automation
- Dispute automation
- Wallet optimization

### Phase 3 - Growth & Monetization
- Subscription tiers
- Sponsored placements
- Advanced analytics
- Referral automation
- Push notifications

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.2
- **Icons**: Font Awesome 6.4.2
- **Canvas API**: For photo editing
- **Geolocation API**: For location services
- **LocalStorage**: For data persistence

## 🔧 Configuration

### API Integration Points
```javascript
// Update these endpoints in production
const API_BASE_URL = 'https://api.braidly.com';
const PAYMENT_GATEWAY = 'stripe'; // or 'paypal'
const MAPS_API_KEY = 'your-google-maps-api-key';
```

### Environment Variables
```
STRIPE_PUBLIC_KEY=pk_test_...
GOOGLE_MAPS_API_KEY=AIza...
TWILIO_ACCOUNT_SID=AC...
```

## 📊 Status States

### Booking Statuses
- Pending
- Confirmed
- Escrowed
- In Progress
- Completed
- Disputed
- Refunded
- Cancelled

### Verification Status
- Unverified
- Tier 1 Verified
- Tier 2 Verified
- Safety Badge Pro

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@braidly.com or join our Slack channel.

## 🙏 Acknowledgments

- Bootstrap team for the amazing framework
- Font Awesome for the icon library
- All contributors and testers

---

Built with ❤️ by the Braidly Team
