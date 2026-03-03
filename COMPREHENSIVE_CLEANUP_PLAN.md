# COMPREHENSIVE APP CLEANUP & FIX PLAN

## ISSUES IDENTIFIED

### 1. LOGO DARK BACKGROUND ISSUE
- Logo has dark background in multiple pages
- Need to remove background completely using CSS

### 2. DUPLICATE JAVASCRIPT FILES
**Auth Files (4 files - need only 1)**:
- `js/auth-core.js` ✅ KEEP (currently in use, working)
- `js/auth.js` ❌ DELETE (duplicate, for login/signup forms only)
- `js/auth-system.js` ❌ DELETE (duplicate, not used)
- `js/auth-guard.js` ❌ DELETE (duplicate, causes conflicts)

**Chatbot Files (3 files - need only 1)**:
- `js/ai-chatbot.js` ✅ KEEP (main chatbot with UI)
- `js/chatbot.js` ❌ DELETE (duplicate, old version)
- `js/intelligent-chatbot.js` ❌ DELETE (knowledge base only, merged into ai-chatbot)

**Other Duplicates**:
- `js/supabase-auth.js` - Check if needed
- `js/logout.js` - Check if needed (logout in auth-core.js)
- `js/footer-nav.js` - Check if needed
- `js/offline-mode.js` - Check if needed

### 3. GOOGLE MAPS API
- API key present: `AIzaSyBXm9F3vK2pL4qR7nH8wJ5tC6dE9fG0hI1`
- Location search implemented in `js/location-search.js`
- Need to verify it's working on landing page

### 4. UNUSED DOCUMENTATION FILES
Too many MD files cluttering the root directory

## EXECUTION PLAN

### PHASE 1: FIX LOGO BACKGROUND
- Add CSS to remove dark background from all logo instances
- Use transparent background and proper filters

### PHASE 2: REMOVE DUPLICATE JS FILES
- Delete unused auth files
- Delete unused chatbot files
- Keep only essential files

### PHASE 3: VERIFY GOOGLE MAPS
- Test location search on landing page
- Ensure autocomplete works
- Verify GPS button functionality

### PHASE 4: CLEAN UP DOCUMENTATION
- Keep only essential docs
- Archive old status files

### PHASE 5: FINAL VERIFICATION
- Test all pages
- Verify no broken links
- Check console for errors
