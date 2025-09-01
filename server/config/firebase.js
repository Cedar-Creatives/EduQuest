const admin = require('firebase-admin');

// The most reliable way to authenticate is using the service account JSON file.
// This avoids all parsing issues with multi-line private keys in .env files.
try {
  // Path to your service account key file
  const serviceAccount = require('./firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

} catch (error) {
  console.error('=== FIREBASE ADMIN INITIALIZATION ERROR ===');
  console.error('Error initializing Firebase Admin SDK. This can happen if the service account file is missing or corrupted.');
  console.error('1. Make sure you have uploaded your Firebase service account JSON file to `server/config/`.');
  console.error('2. Make sure the file is named `firebase-service-account.json`.');
  console.error('Original Error:', error.message);
  process.exit(1); // Exit if Firebase connection fails
}

const db = admin.firestore();

// Test the connection
db.collection('test-connection').get()
  .then(() => {
    console.log('=== FIREBASE CONNECTION SUCCESSFUL ===');
  })
  .catch(error => {
    console.error('=== FIREBASE CONNECTION FAILED ===');
    console.error('Could not connect to Firestore. Check your service account permissions and Firestore rules.');
    console.error('Original Error:', error.message);
  });

module.exports = { admin, db };
