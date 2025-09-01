
# Environment Setup Guide

## Required Environment Variables

Configure these in Replit Secrets (Tools > Secrets):

### Firebase Configuration
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
```

### AI Integration
```
OPENROUTER_API_KEY=your-openrouter-api-key
```

## How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy values from JSON to environment variables above

## How to Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up/Login
3. Go to API Keys section
4. Generate a new API key
5. Copy the key to OPENROUTER_API_KEY

## Testing Configuration

After setting up environment variables:
1. Restart the application
2. Check server logs for successful Firebase initialization
3. Test API endpoints at http://localhost:3000/api/health
