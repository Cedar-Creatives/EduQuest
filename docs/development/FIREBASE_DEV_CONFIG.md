# 🔥 **Firebase Development Configuration**

## **Current Issue: Google Auth Network Error**

### **Error Details:**
```
Firebase: Error (auth/network-request-failed)
```

### **Root Cause:**
The development server is running on `192.168.0.200:5173` which is not authorized in Firebase Authentication settings.

---

## **Immediate Solutions**

### **Option 1: Use localhost (Recommended)**
Access the application via: `http://localhost:5173` instead of `http://192.168.0.200:5173`

### **Option 2: Authorize Current Domain**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `eduquest-4d851`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add: `192.168.0.200`

### **Option 3: Configure OAuth Client**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `eduquest-4d851`
3. Navigate to **APIs & Services** → **Credentials**
4. Edit OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins**:
   - `http://192.168.0.200:5173`
   - `http://localhost:5173`

---

## **Development Best Practices**

### **Local Development URLs**
Always use these for development:
- `http://localhost:5173` (frontend)
- `http://localhost:5000` (backend API)

### **Network Access**
If you need network access (other devices):
1. Configure Firebase authorized domains
2. Update OAuth client settings
3. Test thoroughly before production

### **Environment Variables**
Ensure these are set in `client/.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSyC9FQyZ9U_nQW-7IUyQIRTlnzk3g04MgX0
VITE_FIREBASE_AUTH_DOMAIN=eduquest-4d851.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eduquest-4d851
```

---

## **Testing Google Auth**

### **Steps to Test:**
1. Access via `http://localhost:5173`
2. Navigate to `/login`
3. Click "Continue with Google"
4. Should open Google OAuth popup
5. Complete authentication
6. Should redirect to `/app`

### **Expected Behavior:**
- Popup opens without errors
- User can select Google account
- Authentication completes successfully
- User is redirected to dashboard
- User data is created in Firestore

---

## **Troubleshooting**

### **Common Issues:**
1. **Popup Blocked**: Enable popups for localhost
2. **Network Error**: Check authorized domains
3. **Invalid Domain**: Update OAuth client settings
4. **CORS Issues**: Verify Firebase configuration

### **Debug Steps:**
1. Check browser console for detailed errors
2. Verify Firebase project settings
3. Test with different browsers
4. Clear browser cache and cookies

---

## **Production Configuration**

When deploying to production:
1. Add production domain to Firebase authorized domains
2. Update OAuth client with production URLs
3. Update environment variables
4. Test authentication flow thoroughly

---

**Status**: Configuration issue identified
**Solution**: Use localhost or configure Firebase domains
**ETA**: Immediate fix available