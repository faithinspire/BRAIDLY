# BRAIDLY Phases 5-10 Testing Guide

## Quick Start Testing

### 1. Landing Page (Phase 5)
**URL**: `http://localhost:5173/`

**Desktop Testing**:
- [ ] Hero section displays with purple/blue gradient
- [ ] Carousel rotates every 5 seconds
- [ ] Carousel indicators are clickable
- [ ] "Get Started" button links to signup
- [ ] "Learn More" button links to login
- [ ] Features section displays 4 cards
- [ ] WhatsApp icon visible in bottom-left
- [ ] Footer displays copyright

**Mobile Testing (480px)**:
- [ ] Hero content stacks vertically
- [ ] Carousel is hidden
- [ ] Buttons are full-width
- [ ] WhatsApp icon is properly positioned
- [ ] No horizontal scroll

**Tablet Testing (768px)**:
- [ ] Layout stacks vertically
- [ ] Carousel visible but smaller
- [ ] All elements responsive

---

### 2. AI Chatbot (Phase 6)
**Location**: Bottom-right corner (all pages)

**Functionality Testing**:
- [ ] Chat button opens/closes
- [ ] Can type and send messages
- [ ] Bot responds to "book" keyword
- [ ] Bot responds to "price" keyword
- [ ] Bot responds to "location" keyword
- [ ] Bot responds to "help" keyword
- [ ] Typing indicator shows while loading
- [ ] Chat history persists on reload

**Mobile Testing**:
- [ ] Chat window is full-width on mobile
- [ ] Send button is touch-friendly (44px+)
- [ ] Input field is accessible
- [ ] No keyboard blocking

**Supabase Integration**:
- [ ] Braider data loads from database
- [ ] Location search works
- [ ] Style search works

---

### 3. Concurrent Write Fixes (Phase 7)
**Testing Signup Flow**:
1. Go to `/signup`
2. Fill in form with test data
3. Submit form
4. [ ] No AbortError in console
5. [ ] User created successfully
6. [ ] Profile created
7. [ ] Role-specific record created
8. [ ] Redirect to login

**Testing Payment Release**:
1. As braider, go to wallet
2. Release payment
3. [ ] No AbortError
4. [ ] Payment status updates
5. [ ] Wallet balance updates
6. [ ] No duplicate writes

**Testing Concurrent Requests**:
1. Open multiple browser tabs
2. Submit forms simultaneously
3. [ ] No race conditions
4. [ ] No duplicate records
5. [ ] All operations complete

---

### 4. Mobile Optimization (Phase 8)
**Breakpoint Testing**:

**480px (Small Phone)**:
- [ ] All buttons minimum 44px
- [ ] Touch targets properly spaced
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Forms accessible
- [ ] Hamburger menu works

**768px (Tablet)**:
- [ ] Layout responsive
- [ ] All elements visible
- [ ] Touch targets adequate
- [ ] Navigation works

**1024px (Desktop)**:
- [ ] Full layout visible
- [ ] Proper spacing
- [ ] All features accessible

**Keyboard Testing**:
- [ ] Tab navigation works
- [ ] Focus visible on all elements
- [ ] Enter submits forms
- [ ] Escape closes modals

**Form Testing**:
- [ ] Input fields 44px+ height
- [ ] Font size 16px+ (no iOS zoom)
- [ ] Focus states visible
- [ ] Mobile keyboard doesn't block

---

### 5. Theme Toggle (Phase 9)
**Location**: Top-right corner (below navbar)

**Light Mode Testing**:
- [ ] Default theme is light
- [ ] Background is white
- [ ] Text is dark
- [ ] Buttons visible
- [ ] Proper contrast

**Dark Mode Testing**:
1. Click theme toggle button
2. [ ] Background turns dark
3. [ ] Text turns light
4. [ ] All elements themed
5. [ ] Proper contrast maintained
6. [ ] Smooth transition

**Persistence Testing**:
1. Toggle to dark mode
2. Reload page
3. [ ] Dark mode persists
4. Toggle to light mode
5. Reload page
6. [ ] Light mode persists

**System Preference Testing**:
1. Clear localStorage
2. Set system to dark mode
3. Reload page
4. [ ] Dark mode loads automatically
5. Set system to light mode
6. Reload page
7. [ ] Light mode loads automatically

**Accessibility Testing**:
- [ ] Light mode contrast ratio 7:1+
- [ ] Dark mode contrast ratio 7:1+
- [ ] All text readable
- [ ] No color-only indicators

---

### 6. Final Verification (Phase 10)

**Route Testing**:
```
Public Routes:
- [ ] / (Landing)
- [ ] /login (Login)
- [ ] /signup (Signup)
- [ ] /404 (Not Found)

Protected Routes (require auth):
- [ ] /customer/dashboard
- [ ] /customer/browse
- [ ] /customer/profile
- [ ] /customer/chat
- [ ] /customer/booking
- [ ] /customer/payment
- [ ] /braider/dashboard
- [ ] /braider/profile
- [ ] /braider/chat
- [ ] /braider/booking
- [ ] /braider/wallet
- [ ] /admin/dashboard
- [ ] /admin/chat
```

**Authentication Flow**:
1. Go to `/signup`
2. [ ] Create account with email/password
3. [ ] Redirected to login
4. [ ] Login with credentials
5. [ ] Redirected to dashboard
6. [ ] Profile shows correct role
7. [ ] Logout works
8. [ ] Redirected to home

**Navbar Testing**:
- [ ] Public navbar shows: Home, Sign In, Sign Up
- [ ] Private navbar shows: Dashboard, Profile, Messages, Logout
- [ ] Mobile hamburger menu works
- [ ] Menu closes on navigation
- [ ] Theme toggle visible

**Console Testing**:
- [ ] Open DevTools Console
- [ ] [ ] Zero errors
- [ ] [ ] Zero warnings
- [ ] [ ] No unhandled rejections

**Performance Testing**:
- [ ] Open DevTools Performance tab
- [ ] [ ] Smooth 60fps animations
- [ ] [ ] No jank or stuttering
- [ ] [ ] Page loads in < 3 seconds

**Accessibility Testing**:
- [ ] Tab through all interactive elements
- [ ] [ ] Focus visible on all elements
- [ ] [ ] Keyboard navigation works
- [ ] [ ] No keyboard traps
- [ ] [ ] Screen reader friendly (test with NVDA/JAWS)

---

## Browser Testing Checklist

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Devices
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S21 (360px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

---

## Performance Checklist

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s
- [ ] No layout thrashing
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

---

## Accessibility Checklist (WCAG 2.1 AA)

- [ ] Color contrast 4.5:1 for text
- [ ] Color contrast 3:1 for UI components
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] Form labels associated
- [ ] Error messages clear
- [ ] Respects prefers-reduced-motion
- [ ] Touch targets 44x44px minimum
- [ ] No auto-playing audio/video

---

## Bug Report Template

If you find an issue, please report:

```
**Title**: [Brief description]

**Severity**: Critical / High / Medium / Low

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Browser/Device**:

**Console Errors**:

**Screenshots**:
```

---

## Sign-Off

- [ ] All tests passed
- [ ] No critical issues
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Performance acceptable
- [ ] Ready for production

**Tested By**: _______________
**Date**: _______________
**Status**: ✅ APPROVED / ❌ NEEDS FIXES
