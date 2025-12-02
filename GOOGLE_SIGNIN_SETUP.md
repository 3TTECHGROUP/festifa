# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In with Firebase for the Festifa application.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com/)
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Once created, click on your project to open it

## Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** from the left sidebar
2. Click on the **Sign-in method** tab
3. Click on **Google** in the providers list
4. Toggle the **Enable** switch
5. Add a support email (required)
6. Click **Save**

## Step 3: Register Your Web App

1. In your Firebase project overview, click the **Web** icon (`</>`)
2. Register your app with a nickname (e.g., "Festifa Web")
3. You'll receive your Firebase configuration object

## Step 4: Get Your Firebase Configuration

After registering your app, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 5: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Copy the contents from `.env.example`
3. Fill in your Firebase configuration values:

```env
# API Configuration
VITE_API_BASE_URL=https://festifa-backend-v2-production.up.railway.app

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `festifa.com`)

## Step 7: Backend Configuration

The backend endpoint expects the following request format:

**Endpoint:** `POST https://festifa-backend-v2-production.up.railway.app/auth/firebase`

**Request Body:**
```json
{
  "id_token": "string"
}
```

The backend should:
1. Verify the Firebase ID token
2. Extract user information (email, name, picture, etc.)
3. Create or update the user in your database
4. Return user data with authentication status

**Expected Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "email_verified": true,
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T00:00:00Z"
  }
}
```

## How It Works

### Frontend Flow

1. User clicks "Continue with Google" button
2. Firebase opens Google Sign-In popup
3. User selects their Google account and grants permissions
4. Firebase returns user credentials with ID token
5. Frontend sends ID token to backend at `/auth/firebase`
6. Backend validates token and returns user data
7. Frontend stores authentication state and redirects to dashboard

### Implementation Details

The Google Sign-In is implemented in:
- **Login Page** (`/src/pages/Login.tsx`)
- **Signup Page** (`/src/pages/Signup.tsx`)
- **Registration Modal** (`/src/components/RegistrationModal.tsx`)

All three components use the same authentication flow:
```typescript
const handleGoogleSignIn = async () => {
  // 1. Open Google Sign-In popup
  const result = await signInWithPopup(auth, googleProvider)
  
  // 2. Get Firebase ID token
  const idToken = await result.user.getIdToken()
  
  // 3. Send to backend
  const res = await firebaseAuth({ id_token: idToken }).unwrap()
  
  // 4. Store auth state and redirect
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('user', JSON.stringify(res.data))
  navigate('/dashboard')
}
```

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login or signup page
3. Click "Continue with Google"
4. Select a Google account
5. You should be redirected to the dashboard upon successful authentication

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Firebase Console > Authentication > Settings > Authorized domains

### "Firebase: Error (auth/popup-blocked)"
- Allow popups for your domain in browser settings
- Or use `signInWithRedirect` instead of `signInWithPopup`

### "Firebase: Error (auth/invalid-api-key)"
- Check that your `VITE_FIREBASE_API_KEY` is correct in `.env`
- Ensure you've restarted the dev server after changing `.env`

### Backend returns 401 or authentication fails
- Verify the backend is correctly validating Firebase ID tokens
- Check that the backend endpoint `/auth/firebase` is accessible
- Ensure CORS is properly configured on the backend

## Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **API keys are safe for client-side use** - Firebase API keys are meant to be public
3. **Backend validation is crucial** - Always verify ID tokens on the backend
4. **Use environment variables** - Never hardcode credentials in source code

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web)
- [Firebase ID Token Verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
