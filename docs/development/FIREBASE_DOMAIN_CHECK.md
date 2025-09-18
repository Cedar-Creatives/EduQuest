# 🔍 Firebase Domain Authorization Check

## Current Issue
- Domain: `localhost`
- Origin: `http://localhost:5173`
- Error: `auth/network-request-failed` at `_validateOrigin`

## Step-by-Step Fix

### 1. Firebase Console Check
1. Go to: https://console.firebase.google.com/
2. Select project: **eduquest-4d851**
3. Click **Authentication** in left sidebar
4. Click **Settings** tab
5. Scroll to **Authorized domains** section

**Expected domains:**
- `localhost` ✓ (should be there by default)
- `eduquest-4d851.firebaseapp.com` ✓ (should be there by default)

### 2. Google Cloud Console Check
1. Go to: https://console.cloud.google.com/
2. Select project: **eduquest-4d851**
3. Go to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (Web application)
5. Click to edit it

**Required settings:**
- **Authorized JavaScript origins:**
  - `http://localhost:5173` ✓
  - `http://127.0.0.1:5173` ✓
- **Authorized redirect URIs:**
  - `http://localhost:5173` ✓
  - `http://127.0.0.1:5173` ✓

### 3. Alternative Test
Try accessing your app via: `http://127.0.0.1:5173` instead of `http://localhost:5173`

Sometimes `127.0.0.1` works when `localhost` doesn't due to DNS resolution differences.

### 4. Browser Test
1. Clear all browser data for localhost:5173
2. Try in incognito/private window
3. Check if popups are blocked

### 5. Firebase Project Settings
Verify your Firebase config in `.env` matches your project:
- Project ID: `eduquest-4d851`
- Auth Domain: `eduquest-4d851.firebaseapp.com`

## Debug Commands

Run these in your browser console on the login page:

```javascript
// Check current domain
console.log('Domain:', window.location.hostname)
console.log('Origin:', window.location.origin)

// Check Firebase config
console.log('Firebase Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID)
```

## Next Steps
1. Verify Firebase Console has `localhost` in authorized domains
2. Verify Google Cloud Console has `http://localhost:5173` in OAuth origins
3. Wait 5-10 minutes after making changes
4. Try `http://127.0.0.1:5173` as alternative
5. Test in incognito window