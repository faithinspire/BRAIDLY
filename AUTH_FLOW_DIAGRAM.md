# BRAIDLY AUTH FLOW - VISUAL DIAGRAM

## Signup Flow (FIXED ✅)

```
┌─────────────────────────────────────────────────────────────┐
│ USER VISITS /signup                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ SIGNUP PAGE RENDERS                                         │
│ - Full Name input                                           │
│ - Email input                                               │
│ - Password input                                            │
│ - Role selector (Customer / Braider)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ USER FILLS FORM & CLICKS "CREATE ACCOUNT"                  │
│ - selectedRole = "customer" or "braider"                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ SIGNUP FUNCTION CALLED                                      │
│ - Create auth user in Supabase Auth                         │
│ - Create profile in database with role                      │
│ - Create role-specific record (customers/braiders table)    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ SIGNUP SUCCESSFUL                                           │
│ - success = true                                            │
│ - User object returned                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ REDIRECT BASED ON selectedRole                              │
│                                                             │
│ if (selectedRole === 'braider')                             │
│   → navigate('/braider/dashboard')                          │
│ else                                                        │
│   → navigate('/customer/dashboard')                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD LOADS                                             │
│ - ProtectedRoute checks: user exists ✅                     │
│ - ProtectedRoute checks: role matches ✅                    │
│ - Dashboard renders with user data                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Login Flow (FIXED ✅)

```
┌─────────────────────────────────────────────────────────────┐
│ USER VISITS /login                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LOGIN PAGE RENDERS                                          │
│ - Email input                                               │
│ - Password input                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ USER ENTERS CREDENTIALS & CLICKS "SIGN IN"                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LOGIN FUNCTION CALLED                                       │
│ - Validate email & password with Supabase Auth              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────┴───────┐
                    ↓               ↓
            ┌──────────────┐  ┌──────────────┐
            │ INVALID      │  │ VALID        │
            │ CREDENTIALS  │  │ CREDENTIALS  │
            └──────────────┘  └──────────────┘
                    ↓               ↓
            ┌──────────────┐  ┌──────────────┐
            │ Show error   │  │ Fetch profile│
            │ message      │  │ from DB      │
            └──────────────┘  └──────────────┘
                    ↓               ↓
            ┌──────────────┐  ┌──────────────┐
            │ User can     │  │ Get role:    │
            │ retry login  │  │ customer,    │
            │              │  │ braider, or  │
            │              │  │ admin        │
            └──────────────┘  └──────────────┘
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ CUSTOMER     │  │ BRAIDER      │  │ ADMIN        │
            │ role         │  │ role         │  │ role         │
            └──────────────┘  └──────────────┘  └──────────────┘
                    ↓               ↓               ↓
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ navigate to  │  │ navigate to  │  │ navigate to  │
            │ /customer/   │  │ /braider/    │  │ /admin/      │
            │ dashboard    │  │ dashboard    │  │ dashboard    │
            └──────────────┘  └──────────────┘  └──────────────┘
                    ↓               ↓               ↓
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ DASHBOARD    │  │ DASHBOARD    │  │ DASHBOARD    │
            │ LOADS        │  │ LOADS        │  │ LOADS        │
            └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Logout Flow (FIXED ✅)

```
┌─────────────────────────────────────────────────────────────┐
│ USER CLICKS "LOGOUT" BUTTON IN NAVBAR                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LOGOUT FUNCTION CALLED                                      │
│ - Call supabase.auth.signOut()                              │
│ - Clear user state in AuthContext                           │
│ - Clear profile state in AuthContext                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────┴───────┐
                    ↓               ↓
            ┌──────────────┐  ┌──────────────┐
            │ LOGOUT       │  │ LOGOUT       │
            │ FAILED       │  │ SUCCESSFUL   │
            └──────────────┘  └──────────────┘
                    ↓               ↓
            ┌──────────────┐  ┌──────────────┐
            │ Show error   │  │ navigate to  │
            │ message      │  │ / (landing)  │
            │ Button stays │  │              │
            │ enabled      │  │              │
            └──────────────┘  └──────────────┘
                                    ↓
                    ┌───────────────────────────┐
                    │ LANDING PAGE LOADS        │
                    │ - "Sign In" button        │
                    │ - "Get Started" button    │
                    │ - Background images       │
                    │ - No "Logout" button      │
                    └───────────────────────────┘
```

---

## Protected Route Flow (FIXED ✅)

```
┌─────────────────────────────────────────────────────────────┐
│ USER TRIES TO ACCESS /customer/dashboard                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ProtectedRoute COMPONENT CHECKS:                            │
│ 1. Is auth initialized?                                     │
│ 2. Is user logged in?                                       │
│ 3. Does user's role match required role?                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
    ┌────────┐          ┌────────┐         ┌────────┐
    │ NOT    │          │ NOT    │         │ ROLE   │
    │ INIT   │          │ LOGGED │         │ MISMATCH
    │        │          │ IN     │         │        │
    └────────┘          └────────┘         └────────┘
        ↓                   ↓                   ↓
    ┌────────┐          ┌────────┐         ┌────────┐
    │ Show   │          │ Redirect│        │ Redirect
    │ Loading│          │ to      │        │ to      │
    │ state  │          │ /login  │        │ correct │
    │        │          │         │        │ dashboard
    └────────┘          └────────┘         └────────┘
        ↓                   ↓                   ↓
    ┌────────┐          ┌────────┐         ┌────────┐
    │ Wait   │          │ LOGIN  │         │ CUSTOMER
    │ for    │          │ PAGE   │         │ trying  │
    │ init   │          │ LOADS  │         │ /braider│
    │        │          │        │         │ /dash   │
    └────────┘          └────────┘         └────────┘
        ↓                                       ↓
    ┌────────┐                             ┌────────┐
    │ Check  │                             │ Redirect
    │ again  │                             │ to      │
    │        │                             │ /customer
    └────────┘                             │ /dashboard
        ↓                                   └────────┘
    ┌────────┐                                 ↓
    │ DASHBOARD                           ┌────────┐
    │ LOADS  │                            │ CUSTOMER
    │        │                            │ DASHBOARD
    └────────┘                            │ LOADS
                                          └────────┘
```

---

## Key Differences: BEFORE vs AFTER

### BEFORE (BROKEN ❌)
```
Signup → setTimeout(200ms) → Fetch profile → Redirect
         ↓
         Race condition! Profile might not exist yet
         ↓
         Redirect to landing page (WRONG)

Login → setTimeout(100ms) → Fetch profile → Redirect
        ↓
        Race condition! Auth state might not update yet
        ↓
        Redirect fails or goes to wrong place

Protected Route → Role mismatch → Redirect to "/" (landing page)
                                  ↓
                                  User confused! Should go to their dashboard

Logout → await logout() → navigate immediately
         ↓
         Might redirect before logout completes
         ↓
         Session not cleared properly
```

### AFTER (FIXED ✅)
```
Signup → Redirect based on selectedRole (no setTimeout)
         ↓
         Customer → /customer/dashboard
         Braider → /braider/dashboard
         ✅ Instant, reliable, no race conditions

Login → Fetch profile → Redirect based on actual role
        ↓
        Customer → /customer/dashboard
        Braider → /braider/dashboard
        Admin → /admin/dashboard
        ✅ Reliable, uses actual database role

Protected Route → Role mismatch → Redirect to correct dashboard
                                  ↓
                                  Customer → /customer/dashboard
                                  Braider → /braider/dashboard
                                  Admin → /admin/dashboard
                                  ✅ User goes to their dashboard, not landing page

Logout → Check success flag → Redirect only if successful
         ↓
         Session cleared properly
         ↓
         Redirect to landing page
         ✅ Reliable, proper error handling
```

---

## Summary

| Flow | Before | After |
|------|--------|-------|
| **Signup** | ❌ Redirects to landing page | ✅ Redirects to correct dashboard |
| **Login** | ❌ Doesn't redirect or redirects wrong | ✅ Redirects to correct dashboard |
| **Logout** | ❌ Doesn't work properly | ✅ Redirects to landing page |
| **Protected Routes** | ❌ Redirects to landing page on role mismatch | ✅ Redirects to correct dashboard |
| **Race Conditions** | ❌ Multiple setTimeout hacks | ✅ No setTimeout, direct logic |
| **Error Handling** | ❌ Silent failures | ✅ Proper error messages |

---

## Testing the Flows

See `IMMEDIATE_TESTING_GUIDE.md` for step-by-step testing instructions.
