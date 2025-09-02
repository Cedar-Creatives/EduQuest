# EduQuest Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project with Firestore database and Authentication

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd EduQuest
npm install
```

### 2. Environment Configuration

#### Server Configuration

1. Copy `server/.env.example` to `server/.env`
2. Fill in your Firebase credentials:
   ```
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   ```
3. Add your API keys (REQUIRED for AI features):
   ```
   OPENAI_API_KEY=your_openai_key
   OPENROUTER_API_KEY=your_openrouter_key
   ```

#### Client Configuration

1. Copy `client/.env.example` to `client/.env`
2. Fill in your Firebase web app configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Enable Google authentication (optional)
4. **Enable Firestore Database:**
   - Go to Firestore Database
   - Create database in test mode (for development)
   - Choose a location close to your users
5. **Create a service account for server:**
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Rename to `firebase-service-account.json`
   - Place in `server/config/` folder
6. **Get web app configuration for client:**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web app icon (</>) to add a web app
   - Register your app and copy the config object

### 4. Start the Application

```bash
# Start both client and server
npm start

# Or start individually:
npm run client    # Starts client on port 3000
npm run server    # Starts server on port 5000
```

## Environment Variables Reference

### Server (.env)

| Variable                | Description                 | Required                            |
| ----------------------- | --------------------------- | ----------------------------------- |
| `PORT`                  | Server port                 | No (default: 5000)                  |
| `NODE_ENV`              | Environment                 | No (default: development)           |
| `FIREBASE_PROJECT_ID`   | Firebase project ID         | Yes                                 |
| `FIREBASE_PRIVATE_KEY`  | Service account private key | Yes                                 |
| `FIREBASE_CLIENT_EMAIL` | Service account email       | Yes                                 |
| `OPENAI_API_KEY`        | OpenAI API key              | Yes (for AI features)               |
| `OPENROUTER_API_KEY`    | OpenRouter API key          | Yes (for AI features)               |
| `JWT_SECRET`            | JWT signing secret          | No                                  |
| `CLIENT_URL`            | Frontend URL for CORS       | No (default: http://localhost:3000) |

### Client (.env)

| Variable                            | Description                  | Required                            |
| ----------------------------------- | ---------------------------- | ----------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase web API key         | Yes                                 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         | Yes                                 |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID          | Yes                                 |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      | Yes                                 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes                                 |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID              | Yes                                 |
| `VITE_API_URL`                      | Backend API URL              | No (default: http://localhost:5000) |

## Troubleshooting

### Common Issues

1. **Firebase Connection Failed**

   - Check service account file exists in `server/config/`
   - Verify environment variables are set correctly
   - Ensure Firebase project has Firestore enabled

2. **Client Blank Screen**

   - Check browser console for errors
   - Verify Firebase config in client `.env`
   - Check if server is running on port 5000

3. **Port Already in Use**

   - Change `PORT` in server `.env`
   - Update `VITE_API_URL` in client `.env`
   - Kill existing processes: `npx kill-port 5000 3000`

4. **Authentication Issues**
   - Verify Firebase Auth is enabled
   - Check service account permissions
   - Ensure Firestore rules allow read/write

### Debug Commands

```bash
# Check server health
curl http://localhost:5000/api/health

# Check client build
cd client && npm run build

# View server logs
cd server && npm run dev

# Reset everything
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json
npm install
```

## Development

### Project Structure

```
EduQuest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── config/       # Configuration files
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── config/           # Configuration files
│   ├── services/         # Business logic
│   └── package.json
└── package.json          # Root package.json
```

### Available Scripts

- `npm start` - Start both client and server
- `npm run client` - Start only client
- `npm run server` - Start only server
- `npm run debug` - Start with debugging enabled
- `npm run client-install` - Install client dependencies
- `npm run server-install` - Install server dependencies

## Deployment

### Production Build

```bash
# Build client
cd client && npm run build

# Start server in production mode
cd server && NODE_ENV=production npm start
```

### Environment Variables

- Set `NODE_ENV=production` in production
- Use strong `JWT_SECRET` in production
- Configure proper CORS origins
- Set up production Firebase project

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Check browser console for client errors
4. Verify all environment variables are set correctly
