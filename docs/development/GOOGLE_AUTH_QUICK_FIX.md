# 🔧 **Quick Fix: Google Authentication Error**

## **Issue:** 
`Firebase: Error (auth/network-request-failed)` when using Google sign-in

## **Immediate Solution:**

### **✅ Use localhost instead of IP address**
1. Open your browser
2. Navigate to: `http://localhost:5173` 
3. Try Google sign-in again

### **Why this works:**
- `localhost` is pre-authorized in Firebase
- IP addresses like `192.168.0.200` need manual authorization
- This is a common development environment issue

---

## **Alternative Solutions:**

### **Option 1: Authorize your IP in Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `eduquest-4d851`
3. Authentication → Settings → Authorized domains
4. Add: `192.168.0.200`

### **Option 2: Test with Email/Password**
- Email/password authentication should work fine
- Use this for testing while configuring Google auth

---

## **Status:**
- ✅ **Email/Password Auth**: Working
- ⚠️ **Google Auth**: Domain configuration needed
- ✅ **All Other Features**: Fully functional

**Quick Fix**: Use `http://localhost:5173` for immediate testing!