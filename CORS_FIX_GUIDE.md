# CORS Error Fix Guide

## Problem
You're seeing CORS (Cross-Origin Resource Sharing) policy errors in the browser console when trying to use Google Sign-In popup. This is a browser security feature that blocks the popup communication.

## ✅ Solutions Implemented

### 1. Fallback to Redirect Method
I've updated all three authentication flows (Login, Signup, Registration Modal) to automatically fall back to redirect method if popup is blocked:

- **First attempt**: Opens popup window
- **If blocked**: Automatically redirects to Google Sign-In page
- **After authentication**: Returns to your app

### 2. Enhanced Error Handling
Better error messages and automatic fallback handling for:
- `auth/popup-blocked`
- `auth/popup-closed-by-user`
- `auth/cancelled-popup-request`

## 🔧 Additional Fixes You Can Try

### Option 1: Allow Popups in Browser (Recommended)

#### Chrome/Edge:
1. Look for the popup blocker icon in the address bar (usually on the right)
2. Click it and select "Always allow popups from localhost"
3. Refresh the page and try again

#### Firefox:
1. Click the shield icon in the address bar
2. Turn off "Enhanced Tracking Protection" for localhost
3. Or add localhost to exceptions in Settings > Privacy & Security

#### Safari:
1. Go to Safari > Preferences > Websites > Pop-up Windows
2. Find localhost and set to "Allow"

### Option 2: Use Redirect Method (Already Implemented as Fallback)

The code now automatically uses redirect if popup fails. This will:
1. Redirect you to Google Sign-In page
2. After authentication, redirect back to your app
3. Complete the sign-in process

### Option 3: Test in Incognito/Private Mode

Sometimes browser extensions block popups. Try:
1. Open an incognito/private window
2. Navigate to your app
3. Try Google Sign-In again

### Option 4: Check Firebase Console Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `festifa-721e1`
3. Navigate to **Authentication** > **Settings** > **Authorized domains**
4. Ensure these domains are listed:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (when ready)

## 🧪 Testing the Fix

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Clear browser cache and cookies** for localhost

3. **Try Google Sign-In**:
   - Click "Continue with Google"
   - If popup works: You'll see a small popup window
   - If popup is blocked: You'll see a toast message and be redirected

4. **Check browser console**:
   - Open DevTools (F12)
   - Look for any remaining errors
   - The CORS errors should be handled gracefully now

## 📝 Expected Behavior

### Popup Method (Preferred):
1. Click "Continue with Google"
2. Small popup window opens
3. Select Google account
4. Popup closes automatically
5. Redirected to dashboard

### Redirect Method (Fallback):
1. Click "Continue with Google"
2. Toast message: "Popup blocked. Redirecting to Google Sign-In..."
3. Full page redirects to Google
4. Select Google account
5. Redirected back to your app
6. Automatically signed in and redirected to dashboard

## 🐛 Troubleshooting

### Still seeing CORS errors?
- Clear browser cache completely
- Try a different browser
- Check if any browser extensions are blocking requests
- Verify Firebase configuration in `.env` is correct

### Redirect not working?
- Check browser console for specific error messages
- Verify authorized domains in Firebase Console
- Ensure your backend endpoint `/auth/firebase` is accessible

### Authentication succeeds but doesn't redirect?
- Check localStorage for authentication data
- Verify navigation logic in the code
- Check browser console for JavaScript errors

## 🔒 Security Note

The CORS errors you're seeing are actually a **security feature** of modern browsers. They prevent malicious websites from opening popups and stealing user credentials. The solutions above work around this while maintaining security.

## 📞 Next Steps

1. Allow popups for localhost in your browser (easiest fix)
2. Test the authentication flow
3. If popup still doesn't work, the redirect method will activate automatically
4. For production, ensure your production domain is added to Firebase authorized domains

The implementation now handles both popup and redirect methods seamlessly!
