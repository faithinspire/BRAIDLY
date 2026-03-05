# BRAIDLY CSS CLASSES REFERENCE

## Main Classes

### Background & Layout
```css
.braidly-animated-bg          /* Fixed animated gradient background */
.braidly-image-carousel       /* Image carousel overlay */
.carousel-image               /* Individual carousel images */
.braidly-page-content         /* Page content wrapper (z-index: 10) */
```

### Navbar
```css
.braidly-navbar               /* Fixed navbar (70px height) */
.braidly-logo                 /* Logo container (flex) */
.braidly-logo-text            /* "BRAIDLY" text (gradient) */
.braidly-logo-icon            /* "B" icon box (purple gradient) */
```

### Auth Pages
```css
.braidly-auth-container       /* Centered container for auth forms */
.braidly-auth-card            /* White card with form (glassmorphism) */
```

### Forms
```css
.braidly-form-group           /* Form field wrapper */
.braidly-form-group label     /* Form label */
.braidly-form-group input     /* Text/email/password inputs */
.braidly-form-group select    /* Select dropdowns */
```

### Buttons
```css
.braidly-btn                  /* Base button styles */
.braidly-btn-primary          /* Purple/blue gradient button */
.braidly-btn-secondary        /* Transparent with border button */
```

### Messages
```css
.braidly-error                /* Red error message box */
.braidly-success              /* Green success message box */
```

### Links
```css
.braidly-link                 /* Purple links with hover effect */
```

### Loading
```css
.braidly-loading              /* Spinning loader animation */
```

---

## Color Variables

```css
:root {
  --braidly-purple: #7e22ce;   /* Primary accent */
  --braidly-blue: #3b82f6;     /* Secondary accent */
  --braidly-pink: #ec4899;     /* Tertiary accent */
  --braidly-dark: #1a1a2e;     /* Dark background */
}
```

---

## Animations

### Gradient Animation
```css
@keyframes braidlyGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
/* Duration: 15s, infinite */
```

### Image Fade Animation
```css
@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 0.15; }
  50% { opacity: 0.15; }
  90% { opacity: 0; }
  100% { opacity: 0; }
}
/* Duration: 8s, infinite */
```

### Spinner Animation
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
/* Duration: 0.8s, infinite */
```

---

## Usage Examples

### Landing Page
```jsx
<div className="braidly-animated-bg" />
<BraidlyNavbar />
<div className="braidly-page-content">
  <h1>BRAIDLY</h1>
  <button className="braidly-btn braidly-btn-primary">Sign In</button>
</div>
```

### Login Page
```jsx
<div className="braidly-animated-bg" />
<BraidlyNavbar />
<div className="braidly-page-content">
  <div className="braidly-auth-container">
    <div className="braidly-auth-card">
      <h1>Welcome Back</h1>
      <form>
        <div className="braidly-form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <button className="braidly-btn braidly-btn-primary">Sign In</button>
      </form>
    </div>
  </div>
</div>
```

### Error Message
```jsx
{error && (
  <div className="braidly-error">
    {error}
  </div>
)}
```

### Success Message
```jsx
{success && (
  <div className="braidly-success">
    Account created successfully!
  </div>
)}
```

---

## Responsive Breakpoints

### Tablet (768px and below)
- Navbar height: 70px → 70px (same)
- Logo text: 28px → 20px
- Page padding: 2rem → 1rem

### Mobile (480px and below)
- Navbar height: 60px
- Logo text: 20px → 16px
- Logo icon: 40px → 32px
- Auth card padding: 3rem → 1.5rem
- Form buttons: full width → full width

---

## Z-Index Hierarchy

```
1000  - Navbar (fixed)
10    - Page content
-1    - Image carousel
-2    - Gradient background
```

---

## Glassmorphism Effect

Auth cards use:
```css
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

---

## Shadow Effects

### Navbar
```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
```

### Auth Card
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Primary Button
```css
box-shadow: 0 8px 20px rgba(126, 34, 206, 0.3);
/* On hover: 0 12px 30px rgba(126, 34, 206, 0.4); */
```

---

## Transitions

All interactive elements use:
```css
transition: all 0.3s ease;
```

This includes:
- Button hover effects
- Link color changes
- Input focus states
- Logo scale on hover

---

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (with -webkit prefixes)
- **Mobile**: Responsive design, all features work

---

## Performance Notes

- All animations use CSS (no JavaScript)
- GPU-accelerated transforms
- Backdrop blur may impact performance on older devices
- Fallback to solid colors if blur not supported

