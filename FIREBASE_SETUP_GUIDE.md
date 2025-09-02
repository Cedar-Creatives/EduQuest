# Firebase Setup Guide for EduQuest

## Quick Start (5 minutes)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `eduquest-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication" → "Get started"
2. Go to "Sign-in method" tab
3. Enable "Email/Password" provider
4. Enable "Google" provider (optional)
5. Save changes

### 3. Enable Firestore Database

1. In Firebase Console, go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose closest to your users)
4. Click "Done"

### 4. Get Project Configuration

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</> icon)
4. Enter app nickname: `EduQuest Web`
5. Click "Register app"
6. Copy the configuration object

### 5. Configure Environment Variables

**Create `client/.env` file:**

```bash
# Copy the values from Firebase config object
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

**Create `server/.env` file:**

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Required for AI features
OPENROUTER_API_KEY=your_openrouter_key_here

# Optional - for server-side Firebase operations
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 6. Start the Application

```bash
# Install dependencies (if not already done)
npm install
cd client && npm install
cd ../server && npm install

# Start both client and server
npm start
```

## Detailed Configuration

### Firebase Project Structure

Your Firebase project will have these collections:

```
Firestore Database:
├── users/                    # User profiles and data
│   └── {uid}/               # Individual user documents
├── quizzes/                 # Quiz data
│   └── {quizId}/           # Individual quiz documents
├── notes/                   # Study notes
│   └── {noteId}/           # Individual note documents
└── subjects/                # Quiz subjects
    └── {subjectId}/        # Individual subject documents
```

### Security Rules (Firestore)

For development, use these permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Quizzes are readable by all authenticated users
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Notes are readable by all authenticated users
    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Subjects are readable by all authenticated users
    match /subjects/{subjectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Authentication Setup

#### Email/Password Authentication

- Already enabled in Firebase Console
- Users can register with email/password
- Password reset functionality included

#### Google Authentication (Optional)

1. In Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add your domain to authorized domains
4. Configure OAuth consent screen if needed

### Environment Variables Reference

#### Client Environment Variables (Required)

```bash
# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSy...                    # Web API Key
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com  # Auth Domain
VITE_FIREBASE_PROJECT_ID=your-project-id          # Project ID
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com  # Storage Bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789       # Messaging Sender ID
VITE_FIREBASE_APP_ID=1:123456789:web:abc123      # App ID
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX         # Measurement ID

# API Configuration
VITE_API_URL=http://localhost:5000                # Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api       # API Base URL
VITE_NODE_ENV=development                         # Environment
```

#### Server Environment Variables (Optional)

```bash
# Server Configuration
PORT=5000                                         # Server port
NODE_ENV=development                              # Environment

# AI Integration (Required for AI features)
OPENROUTER_API_KEY=sk-or-...                     # OpenRouter API key

# Firebase Admin SDK (Optional - for server-side operations)
FIREBASE_PROJECT_ID=your-project-id              # Project ID
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@...  # Service account email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..." # Private key

# CORS Configuration
CLIENT_URL=http://localhost:3000                 # Client URL for CORS
```

## Testing Your Setup

### 1. Test Server

```bash
cd server
node server.js
```

Should see:

```
=== SERVER STARTUP ===
Environment variables check: OK
PORT: 5000
=== FIREBASE: Client-side authentication only ===
=== SERVER STARTED SUCCESSFULLY ===
Server running at http://localhost:5000
```

### 2. Test Client

```bash
cd client
npm run dev
```

Should see:

```
VITE v5.0.0  ready in 1234 ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Test Firebase Connection

1. Open http://localhost:5173
2. Should see the landing page (not blank screen)
3. Try to register a new account
4. Check Firebase Console → Authentication → Users (should see new user)
5. Check Firebase Console → Firestore → Data (should see user document)

## Troubleshooting

### Blank Screen Issues

- **Check browser console** for Firebase initialization errors
- **Verify environment variables** are correctly set
- **Ensure Firebase project** has Authentication and Firestore enabled
- **Check network tab** for failed API calls

### Authentication Issues

- **Verify Firebase Auth** is enabled in console
- **Check sign-in methods** are properly configured
- **Ensure domain** is added to authorized domains (for Google auth)

### Database Issues

- **Verify Firestore** is enabled and in test mode
- **Check security rules** allow read/write operations
- **Ensure collections** are created properly

### API Issues

- **Check server logs** for errors
- **Verify CORS** configuration
- **Test API endpoints** directly with curl/Postman

## Production Considerations

### Security Rules

Update Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (resource == null || resource.data.createdBy == request.auth.uid);
    }

    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (resource == null || resource.data.createdBy == request.auth.uid);
    }
  }
}
```

### Environment Variables

- Use production Firebase project
- Set up proper environment variable management
- Configure CORS for production domain
- Set up monitoring and logging

### Performance

- Enable Firebase Performance Monitoring
- Set up Firebase Analytics
- Configure proper indexing for Firestore queries
- Implement caching strategies

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check server logs for errors
3. Verify Firebase configuration
4. Test API endpoints individually
5. Check network connectivity

The application should work immediately after proper Firebase configuration!
