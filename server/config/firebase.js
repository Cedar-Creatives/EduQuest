const admin = require('firebase-admin');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('=== MISSING REQUIRED ENVIRONMENT VARIABLES ===');
  console.error('Please configure these variables in Replit Secrets:');
  missingVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  console.error('\nTo fix this:');
  console.error('1. Click on "Secrets" in the left sidebar');
  console.error('2. Add each missing environment variable');
  console.error('3. Restart the application');
  process.exit(-1);
}

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('=== FIREBASE ADMIN INITIALIZED SUCCESSFULLY ===');
  } catch (error) {
    console.error('=== FIREBASE ADMIN INITIALIZATION ERROR ===');
    console.error('Error:', error.message);
    // Attempt to provide more specific guidance if the error is related to credentials
    if (error.message.includes('private_key') || error.message.includes('client_email')) {
      console.error('Hint: Ensure your Firebase service account key is correctly configured in Replit Secrets.');
    }
    process.exit(-1); // Exit if initialization fails after validation
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };