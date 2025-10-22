# Firebase Environment Setup

This project uses Firebase for authentication, database, and storage. To set up the environment variables:

## 1. Create Environment File

Create a `.env` file in the root directory of your project with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 2. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon (⚙️) and select "Project settings"
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" and select the web icon (</>)
6. Copy the configuration values from the Firebase config object

## 3. Example Configuration

Here's what your `.env` file should look like with actual values:

```env
VITE_FIREBASE_API_KEY=AIzaSyAdQEzEB9PaSa8S_Jns7GELHrYAPVgJHf0
VITE_FIREBASE_AUTH_DOMAIN=home-1e420.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://home-1e420-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=home-1e420
VITE_FIREBASE_STORAGE_BUCKET=home-1e420.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=237502846110
VITE_FIREBASE_APP_ID=1:237502846110:web:68729122ed80d0af7bd78f
```

## 4. Security Notes

- **Never commit your `.env` file to version control**
- The `.env` file is already included in `.gitignore`
- Environment variables prefixed with `VITE_` are exposed to the client-side code
- For production, set these variables in your hosting platform's environment settings

## 5. Firebase Services Setup

Make sure you have the following Firebase services enabled:

### Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password authentication

### Realtime Database
- Go to Realtime Database
- Create a database in test mode (for development)
- Set up proper security rules for production

### Database Rules Example
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && auth.token.role == 'admin'"
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 6. Troubleshooting

If you get an error about missing environment variables:
1. Make sure your `.env` file is in the root directory
2. Restart your development server after creating/updating the `.env` file
3. Check that all required variables are present and have valid values
4. Ensure variable names start with `VITE_` (required for Vite)

## 7. Production Deployment

For production deployment (Vercel, Netlify, etc.):
1. Add the environment variables in your hosting platform's dashboard
2. Do not include the `.env` file in your deployment
3. The hosting platform will use the environment variables you set in their dashboard
