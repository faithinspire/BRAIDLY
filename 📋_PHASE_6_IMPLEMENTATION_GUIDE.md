# PHASE 6: COMPONENT INTEGRATION GUIDE

## Overview
This guide shows how to integrate the new upload service, design system, and components into existing pages.

---

## 1. UPDATE BRAIDER PROFILE (File Upload Fix)

### File: `src/pages/BraiderProfile.jsx`

**Replace the avatar upload handler:**

```javascript
// OLD CODE (DELETE):
const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    setSaving(true)
    const { supabaseDB } = await import('../services/supabase')
    const publicUrl = await supabaseDB.uploadAvatar(user.id, file)
    setProfileData(prev => ({ ...prev, avatar_url: publicUrl }))
    // ... rest of old code
  }
}

// NEW CODE (REPLACE WITH):
import { uploadAvatar } from '../services/uploadService'

const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  try {
    setSaving(true)
    setUploadProgress(0)

    const result = await uploadAvatar(user.id, file, (progress) => {
      setUploadProgress(progress)
    })

    if (result.success) {
      // Update profile with new avatar URL
      const { error } = await supabase
        .from('braider_profiles')
        .update({ avatar_url: result.url })
        .eq('user_id', user.id)

      if (error) throw error

      setProfileData(prev => ({ ...prev, avatar_url: result.url }))
      showSuccessToast('Avatar uploaded successfully!')
    } else {
      showErrorToast(result.error)
    }
  } catch (error) {
    showErrorToast(error.message || 'Failed to save avatar')
  } finally {
    setSaving(false)
    setUploadProgress(0)
  }
}
```

**Add state for upload progress:**

```javascript
const [uploadProgress, setUploadProgress] = useState(0)
```

**Update the file input to show progress:**

```javascript
<div className="upload-area">
  <input
    type="file"
    accept="image/*"
    onChange={handleAvatarUpload}
    disabled={saving}
  />
  {uploadProgress > 0 && uploadProgress < 100 && (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
      <span>{uploadProgress}%</span>
    </div>
  )}
</div>
```

---

## 2. UPDATE BRAIDER PORTFOLIO (File Upload Fix)

### File: `src/pages/BraiderPortfolio.jsx`

**Replace portfolio upload handler:**

```javascript
// OLD CODE (DELETE):
const handleUploadPhoto = async () => {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    
    input.onchange = async (e) => {
      // ... old upload logic
    }
  }
}

// NEW CODE (REPLACE WITH):
import { uploadPortfolioImage } from '../services/uploadService'

const handleUploadPhoto = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true

  input.onchange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    let successCount = 0
    let errorCount = 0

    for (const file of files) {
      try {
        const result = await uploadPortfolioImage(
          user.id,
          file,
          file.name.split('.')[0],
          selectedStyle === 'all' ? 'Box Braids' : selectedStyle,
          (progress) => {
            console.log(`Upload progress: ${progress}%`)
          }
        )

        if (result.success) {
          // Save to database
          const { error } = await supabase
            .from('portfolio_images')
            .insert({
              braider_id: braiderProfile.id,
              image_url: result.url,
              caption: result.caption,
              style_category: result.category
            })

          if (!error) {
            successCount++
          } else {
            errorCount++
          }
        } else {
          errorCount++
        }
      } catch (error) {
        console.error('Upload error:', error)
        errorCount++
      }
    }

    setUploading(false)
    
    if (successCount > 0) {
      showSuccessToast(`${successCount} image(s) uploaded successfully!`)
      loadPortfolio() // Refresh portfolio
    }
    
    if (errorCount > 0) {
      showErrorToast(`${errorCount} image(s) failed to upload`)
    }
  }

  input.click()
}
```

---

## 3. UPDATE BUTTONS (Use New Button Component)

### Replace all buttons with new Button component:

```javascript
// OLD CODE:
<button className="btn btn-primary">Upload</button>

// NEW CODE:
import Button from '../components/Button'

<Button variant="primary" icon="fas fa-upload">
  Upload
</Button>

// With loading state:
<Button 
  variant="primary" 
  loading={uploading}
  disabled={uploading}
>
  {uploading ? 'Uploading...' : 'Upload'}
</Button>

// Different variants:
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="success">Save</Button>
<Button variant="ghost">Learn More</Button>

// Different sizes:
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Full width:
<Button fullWidth>Full Width Button</Button>

// With icon:
<Button icon="fas fa-save" iconPosition="left">Save</Button>
<Button icon="fas fa-arrow-right" iconPosition="right">Next</Button>
```

---

## 4. UPDATE CARDS (Use New Card Component)

### Replace card markup with Card component:

```javascript
// OLD CODE:
<div className="card">
  <div className="card-header">
    <h3>Profile</h3>
  </div>
  <div className="card-body">
    {/* content */}
  </div>
  <div className="card-footer">
    <button>Save</button>
  </div>
</div>

// NEW CODE:
import Card from '../components/Card'
import Button from '../components/Button'

<Card
  title="Profile"
  icon="fas fa-user"
  header={<Button size="sm" variant="ghost">Edit</Button>}
  footer={<Button variant="primary">Save Changes</Button>}
>
  {/* content */}
</Card>
```

---

## 5. UPDATE STYLING (Use Design System)

### Replace old theme imports:

```javascript
// OLD CODE (DELETE):
import '../../css/white-purple-theme.css'
import '../../css/deep-purple-theme.css'

// NEW CODE (ADD):
import '../../css/design-system.css'
```

### Use CSS variables in custom styles:

```css
/* OLD CODE */
.my-component {
  background: #9333ea;
  color: white;
  padding: 1rem;
}

/* NEW CODE */
.my-component {
  background: var(--color-primary-600);
  color: var(--color-neutral-0);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.my-component:hover {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-lg);
}
```

---

## 6. ADD TOAST NOTIFICATIONS

### Create a simple toast service:

```javascript
// src/services/toastService.js
export function showSuccessToast(message) {
  // Use your toast library or create simple alerts
  console.log('✅', message)
  // TODO: Implement proper toast UI
}

export function showErrorToast(message) {
  console.error('❌', message)
  // TODO: Implement proper toast UI
}

export function showWarningToast(message) {
  console.warn('⚠️', message)
  // TODO: Implement proper toast UI
}
```

---

## 7. FORM VALIDATION (Next Phase)

### Example with Zod validation:

```javascript
import { z } from 'zod'

const profileSchema = z.object({
  business_name: z.string().min(3, 'Business name required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
  city: z.string().min(2, 'City required'),
  base_price: z.number().min(10, 'Price must be at least $10')
})

const handleSaveProfile = async (formData) => {
  try {
    const validated = profileSchema.parse(formData)
    // Save to database
  } catch (error) {
    showErrorToast(error.errors[0].message)
  }
}
```

---

## 8. IMPLEMENTATION CHECKLIST

- [ ] Update BraiderProfile.jsx with new upload service
- [ ] Update BraiderPortfolio.jsx with new upload service
- [ ] Replace all buttons with Button component
- [ ] Replace all cards with Card component
- [ ] Update all imports to use design-system.css
- [ ] Test file uploads work correctly
- [ ] Test progress indicators show
- [ ] Test error messages display
- [ ] Test buttons have proper states
- [ ] Test cards render correctly
- [ ] Test responsive design on mobile
- [ ] Test PWA installation
- [ ] Test offline functionality

---

## 9. TESTING UPLOADS

### Test avatar upload:
1. Go to Braider Profile
2. Click upload avatar
3. Select JPG/PNG/WebP image
4. Verify progress bar shows
5. Verify success message appears
6. Verify avatar updates in profile
7. Refresh page - avatar should persist

### Test portfolio upload:
1. Go to Braider Portfolio
2. Click upload photos
3. Select multiple images
4. Verify each uploads with progress
5. Verify success count shows
6. Verify images appear in portfolio
7. Refresh page - images should persist

---

## 10. COMMON ISSUES & SOLUTIONS

### Issue: "Failed to upload avatar"
**Solution:** Check Supabase storage buckets exist:
- avatars
- portfolio
- gallery

### Issue: Images not persisting after refresh
**Solution:** Verify database update succeeded:
```sql
SELECT * FROM braider_profiles WHERE user_id = 'YOUR_USER_ID';
```

### Issue: Progress bar not showing
**Solution:** Ensure onProgress callback is called:
```javascript
const result = await uploadAvatar(userId, file, (progress) => {
  setUploadProgress(progress) // Must update state
})
```

### Issue: Button not responding
**Solution:** Check disabled state:
```javascript
<Button disabled={loading || saving}>
  Upload
</Button>
```

---

## NEXT STEPS

1. Implement Phase 6 (Component Integration)
2. Implement Phase 7 (Form Validation)
3. Implement Phase 8 (Error Handling)
4. Implement Phase 9 (Mobile Optimization)
5. Deploy to production

---

**Ready to implement? Start with BraiderProfile.jsx!**
