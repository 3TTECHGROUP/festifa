# Google Sign-In Setup Checklist

Use this checklist to complete the Google Sign-In integration for your Festifa application.

## ✅ Completed (Already Done)

- [x] Firebase SDK installed (`firebase` package)
- [x] Firebase configuration file created (`/src/config/firebase.ts`)
- [x] RTK Query endpoint added for Firebase authentication
- [x] Google Sign-In integrated in Login page
- [x] Google Sign-In integrated in Signup page
- [x] Google Sign-In integrated in Registration Modal
- [x] Environment variable template created (`.env.example`)
- [x] Setup documentation created (`GOOGLE_SIGNIN_SETUP.md`)

## 🔲 To Do (Your Action Items)

### 1. Firebase Project Setup

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create a new Firebase project (or select existing)
- [ ] Enable Google Authentication in Firebase Console
  - Navigate to Authentication > Sign-in method
  - Enable Google provider
  - Add support email
- [ ] Register your web app in Firebase
  - Click the Web icon (`</>`) in project overview
  - Register app with a nickname (e.g., "Festifa Web")
- [ ] Copy Firebase configuration values

### 2. Environment Configuration

- [ ] Open `.env` file in project root
- [ ] Replace placeholder values with your Firebase credentials:
  ```
  VITE_FIREBASE_API_KEY=your_actual_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  ```
- [ ] Save the `.env` file
- [ ] Restart your development server

### 3. Firebase Console Configuration

- [ ] Add authorized domains in Firebase Console
  - Go to Authentication > Settings > Authorized domains
  - Add `localhost` (for development)
  - Add your production domain when ready

### 4. Backend Verification

- [ ] Verify backend endpoint exists: `POST /auth/firebase`
- [ ] Ensure backend validates Firebase ID tokens
- [ ] Test backend response format matches expected structure
- [ ] Verify CORS is configured properly

### 5. Testing

- [ ] Test Google Sign-In on Login page
  - Click "Continue with Google"
  - Select Google account
  - Verify redirect to dashboard
  - Check localStorage for user data
- [ ] Test Google Sign-In on Signup page
  - Click "Continue with Google"
  - Select Google account
  - Verify redirect to dashboard
- [ ] Test Google Sign-In in Registration Modal
  - Open modal from event page
  - Click "Continue with Google"
  - Verify authentication works
- [ ] Test error scenarios
  - Cancel Google Sign-In popup
  - Use invalid credentials
  - Test network errors

### 6. Production Deployment

- [ ] Add production domain to Firebase authorized domains
- [ ] Set up environment variables in production
- [ ] Test Google Sign-In in production environment
- [ ] Monitor authentication logs in Firebase Console

## 📚 Reference Documents

- **Detailed Setup Guide**: `GOOGLE_SIGNIN_SETUP.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Environment Template**: `.env.example`

## 🆘 Troubleshooting

If you encounter issues, check:

1. **Firebase Configuration**
   - Verify all environment variables are set correctly
   - Ensure you've restarted the dev server after updating `.env`

2. **Firebase Console**
   - Check that Google authentication is enabled
   - Verify authorized domains include your current domain

3. **Backend**
   - Confirm `/auth/firebase` endpoint is accessible
   - Verify ID token validation is implemented
   - Check CORS configuration

4. **Browser Console**
   - Look for Firebase authentication errors
   - Check network tab for API request/response

## 📞 Support

For detailed instructions, see `GOOGLE_SIGNIN_SETUP.md`

Firebase Documentation: https://firebase.google.com/docs/auth
