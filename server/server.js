// Load environment variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { admin, db } = require("./config/firebase");

// Route imports
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notesRoutes = require("./routes/notesRoutes");
const progressRoutes = require('./routes/progressRoutes');

// --- Pre-computation and Startup Checks ---
console.log('=== SERVER STARTUP ===');
const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'OPENROUTER_API_KEY'];
let missingVars = false;
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    missingVars = true;
  }
});

if (missingVars) {
  process.exit(1);
}

console.log('Environment variables check: OK');
console.log('PORT:', process.env.PORT || 3000);


// --- App Initialization ---
const app = express();
const port = process.env.PORT || 3000;


// --- Middleware ---
app.enable('json spaces');
app.enable('strict routing');
app.use(cors({}));
app.use(express.json()); // Use built-in JSON parser
app.use(express.urlencoded({ extended: true }));


// --- Firebase Connection ---
console.log('=== INITIALIZING FIREBASE CONNECTION ===');
db.collection('test').doc('test').get()
  .then(() => {
    console.log('=== FIREBASE CONNECTION SUCCESS ===');
    console.log('Firebase project:', process.env.FIREBASE_PROJECT_ID);
  })
  .catch(error => {
    console.error('=== FIREBASE CONNECTION ERROR ===');
    console.error('Error:', error.message);
    // Optionally, exit if Firebase connection is critical
    // process.exit(1);
  });


// --- Request Logging ---
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


// --- API Routes ---
app.use(basicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/dashboard', progressRoutes);


// --- Helper Endpoints ---
app.get('/api/health', (req, res) => {
  console.log('=== HEALTH CHECK ===');
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      initialized: !!admin.apps.length
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      port: port
    }
  };
  res.json(health);
});

app.get('/api/help', (req, res) => {
  console.log('=== GET /api/help - Developer Help Requested ===');

  res.json({
    message: 'EduQuest API - Developer Help',
    gettingStarted: {
      step1: 'Create a test user: POST /api/auth/create-test-user',
      step2: 'Copy the accessToken from the response',
      step3: 'Use the token in Authorization header: "Authorization: Bearer YOUR_TOKEN"'
    },
    availableEndpoints: {
      authentication: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login existing user',
        'POST /api/auth/create-test-user': 'Create test user and get token',
        'POST /api/auth/test-login': 'Login and get token for testing'
      },
      quiz: {
        'GET /api/quiz/subjects': 'Get all quiz subjects',
        'POST /api/quiz/subjects': 'Create new subject (requires auth)',
        'POST /api/quiz/questions': 'Create new question (requires auth)',
        'GET /api/quiz/subjects/:id/questions': 'Get questions by subject'
      }
    },
    quickStart: {
      command1: 'curl -X POST http://localhost:3000/api/auth/create-test-user',
      command2: 'Copy the accessToken from response',
      command3: 'For Windows CMD: curl -X POST http://localhost:3000/api/quiz/subjects -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"name\": \"Mathematics\", \"description\": \"Basic mathematics\", \"avgTime\": 20}"',
      command4: 'For PowerShell: curl -X POST http://localhost:3000/api/quiz/subjects -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"name": "Mathematics", "description": "Basic mathematics", "avgTime": 20}''
    },
    troubleshooting: {
      issue1: 'If you get 401/403 errors, make sure you have a valid accessToken',
      issue2: 'Get a token by calling /api/auth/create-test-user first',
      issue3: 'Make sure to use http://localhost:3000 (not 5173) for API calls',
      issue4: 'On Windows, use proper JSON escaping or try PowerShell instead of CMD'
    }
  });
});

// --- Error Handling ---
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`=== UNHANDLED APPLICATION ERROR ===`);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


// --- Server Startup ---
const server = app.listen(port, () => {
  console.log(`=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  - GET  /api/health (health check)');
  console.log('  - GET  /api/help (developer help)');
});


// --- Graceful Shutdown ---
const gracefulShutdown = (signal) => {
  console.log(`
${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    // Close Firebase connection if needed, though Admin SDK handles this
    // admin.app().delete()
    //   .then(() => console.log('Firebase Admin SDK shut down.'))
    //   .catch(err => console.error('Error shutting down Firebase Admin SDK:', err));
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: exit process or restart
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Optional: exit process or restart. It's often not safe to continue.
  process.exit(1);
});
