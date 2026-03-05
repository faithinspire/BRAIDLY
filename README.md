# Braidly - Professional Braiding Services Platform

A modern React-based marketplace connecting customers with professional braiders. Built with Vite, React 18, Supabase, and Framer Motion.

## Features

- **Customer Dashboard** - Browse braiders, book appointments, manage bookings
- **Braider Dashboard** - Manage schedule, portfolio, earnings, reviews
- **Admin Dashboard** - User management, verification, analytics, disputes
- **Authentication** - Email/password signup with role-based access control
- **File Uploads** - Avatar and portfolio image management with compression
- **PWA Support** - Installable web app with offline capabilities
- **Responsive Design** - Mobile-first approach with animations
- **Form Validation** - Zod-based runtime validation

## Tech Stack

- **Frontend**: React 18, React Router 6, Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Animations**: Framer Motion, GSAP
- **Validation**: Zod
- **Styling**: CSS3 with responsive design
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your Supabase credentials
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/              # Application entry, routing, protected routes
├── auth/             # Authentication context and services
├── pages/            # 34 page components (customer, braider, admin)
├── components/       # 20 reusable UI components
├── services/         # Supabase and file upload services
├── schemas/          # Zod validation schemas
├── hooks/            # Custom React hooks
├── animations/       # GSAP and Framer Motion animations
├── styles/           # Global CSS and responsive utilities
└── main.jsx          # Entry point
```

## Key Pages

### Customer
- `/customer/dashboard` - Main dashboard
- `/customer/browse` - Browse available braiders
- `/customer/braider/:id` - View braider profile
- `/customer/book/:braiderId` - Create booking
- `/customer/bookings` - Manage bookings
- `/customer/profile` - Edit profile

### Braider
- `/braider/dashboard` - Main dashboard
- `/braider/profile` - Edit profile
- `/braider/portfolio` - Manage portfolio images
- `/braider/schedule` - Manage availability
- `/braider/earnings` - View earnings
- `/braider/reviews` - View customer reviews
- `/braider/bookings` - Manage bookings

### Admin
- `/admin/dashboard` - Analytics overview
- `/admin/users` - User management
- `/admin/verification` - Verify braiders
- `/admin/disputes` - Handle disputes
- `/admin/analytics` - Detailed analytics
- `/admin/financial` - Financial reports
- `/admin/settings` - System settings

## Authentication

Users can sign up as:
- **Customer** - Browse and book braiders
- **Braider** - Offer services and manage bookings
- **Admin** - Manage platform

Role-based access control is enforced via `ProtectedRoute` component.

## Database Schema

Key tables:
- `profiles` - User profiles
- `braider_profiles` - Braider-specific data
- `bookings` - Appointment bookings
- `portfolio_images` - Braider portfolio
- `gallery_images` - Public gallery
- `reviews` - Customer reviews
- `payments` - Payment records

## File Upload

Images are uploaded to Supabase Storage with:
- Automatic compression (max 2000px, 80% quality)
- File validation (JPG, PNG, WebP only)
- Retry logic (3 attempts)
- Progress tracking

## Deployment

### Vercel

```bash
# Push to GitHub
git push origin main

# Connect repository to Vercel
# Set environment variables in Vercel dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY

# Deploy automatically on push
```

### Environment Variables

Required for production:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Development

### Available Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- ESLint configured for React
- Zod for runtime validation
- Error boundaries in place
- Comprehensive error handling

## Known Issues & TODOs

- [ ] Payment processing integration (Stripe/PayPal)
- [ ] Email notifications system
- [ ] Real-time messaging
- [ ] Admin analytics data fetching
- [ ] Braider availability calendar
- [ ] Advanced search filters
- [ ] Map integration for location services
- [ ] Dispute resolution workflow

## Support

For issues or questions, please check the documentation or contact support.

## License

Proprietary - All rights reserved
