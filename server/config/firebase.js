// Load environment variables from .env file
require("dotenv").config();

const admin = require("firebase-admin");

console.log("=== FIREBASE: Initializing Admin SDK ===");

// Check if required environment variables are present
const requiredEnvVars = [
  "FIREBASE_TYPE",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_CLIENT_ID",
  "FIREBASE_AUTH_URI",
  "FIREBASE_TOKEN_URI",
  "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
  "FIREBASE_CLIENT_X509_CERT_URL",
  "FIREBASE_DATABASE_URL",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error("=== FIREBASE ERROR: Missing environment variables ===");
  console.error("Missing:", missingVars);
  throw new Error(
    `Missing Firebase environment variables: ${missingVars.join(", ")}`
  );
}

console.log("=== FIREBASE: All environment variables present ===");

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  console.log("=== FIREBASE: Admin SDK initialized successfully ===");
  console.log("=== FIREBASE: Project ID:", process.env.FIREBASE_PROJECT_ID);
} catch (error) {
  console.error("=== FIREBASE ERROR: Failed to initialize Admin SDK ===");
  console.error("Error:", error.message);
  throw error;
}

const db = admin.firestore();
const auth = admin.auth();

console.log("=== FIREBASE: Firestore and Auth services ready ===");

module.exports = { admin, db, auth };
