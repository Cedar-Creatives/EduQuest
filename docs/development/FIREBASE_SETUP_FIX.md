# 🔧 **Firebase Google Auth Setup Fix**

## **Issue Identified**
`Firebase: Error (auth/network-request-failed)` when trying to sign in with Google.

## **Root Cause**
The current domain `192.168.0.200:5173` is not authorized in Firebase Authentication settings.

## **Quick Fix Steps**

### **1. Add Authorized Domains in Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `eduquest-4d851`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add these domains:
   - `localhost` (should already be there)
   - `192.168.0.200` (your current IP)
   - `127.0.0.1` (local loopback)

### **2. Configure OAuth Consent Screen (if needed)**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `eduquest-4d851`
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Add authorized domains:
   - `localhost`
   - `192.168.0.200`
   - Your production domain (when ready)

### **3. Update OAuth Client Settings**

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID
3. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://192.168.0.200:5173`
   - `http://127.0.0.1:5173`

### **4. Alternative: Use localhost Instead**

If you want to avoid domain configuration, access the app via:
- `http://localhost:5173` instead of `http://192.168.0.200:5173`

## **Testing the Fix**

After making these changes:
1. Wait 5-10 minutes for changes to propagate
2. Clear browser cache and cookies completely
3. Try in incognito/private browser window
4. If still failing, try accessing via `http://127.0.0.1:5173` instead

## **Alternative Debug Method**

If the issue persists, temporarily disable popup and use redirect:
1. In your AuthContext, change `signInWithPopup` to `signInWithRedirect`
2. This can help identify if it's a popup-specific issue

## **Production Setup**

For production deployment, make sure to:
1. Add your production domain to Firebase authorized domains
2. Update OAuth client with production URLs
3. Update environment variables with production Firebase config

---

**Status**: Configuration fix required in Firebase Console
**ETA**: 5-10 minutes after applying changes