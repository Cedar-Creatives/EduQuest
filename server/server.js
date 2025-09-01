// Load environment variables
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notesRoutes = require("./routes/notesRoutes");
const progressRoutes = require('./routes/progressRoutes');
const { admin, db } = require("./config/firebase");
const cors = require("cors");

console.log('=== SERVER STARTUP ===');
console.log('Environment variables check:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '[SET]' : '[NOT SET]');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '[SET]' : '[NOT SET]');
console.log('PORT:', process.env.PORT || 3000);

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("Error: FIREBASE_PROJECT_ID variable in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));

// Add body parsing middleware
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    let rawBody = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', () => {
      // Store raw body for custom JSON parsing
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

// Custom JSON parser with better error handling
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      try {
        if (req.rawBody) {
          req.body = JSON.parse(req.rawBody);
        } else {
          req.body = {};
        }
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid JSON format',
          details: error.message
        });
      }
    } else {
      req.body = {};
    }
  }
  next();
});

app.use(express.urlencoded({ extended: true }));

// Firebase connection check
console.log('=== INITIALIZING FIREBASE CONNECTION ===');
try {
  // Test Firebase connection
  db.collection('test').doc('test').get().then(() => {
    console.log('=== FIREBASE CONNECTION SUCCESS ===');
    console.log('Firebase project:', process.env.FIREBASE_PROJECT_ID);
  }).catch(error => {
    console.error('=== FIREBASE CONNECTION ERROR ===');
    console.error('Error:', error.message);
  });
} catch (error) {
  console.error('=== FIREBASE INITIALIZATION ERROR ===');
  console.error('Error:', error.message);
}



// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next();
});

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Mount all routes
app.use('/api/users', profileRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/dashboard', progressRoutes);


// Add a helpful endpoint for new developers
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
      command3: 'For Windows CMD: curl -X POST http://localhost:3000/api/quiz/subjects -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\\"name\\": \\"Mathematics\\", \\"description\\": \\"Basic mathematics\\", \\"avgTime\\": 20}"',
      command4: 'For PowerShell: curl -X POST http://localhost:3000/api/quiz/subjects -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d \'{"name": "Mathematics", "description": "Basic mathematics", "avgTime": 20}\''
    },
    troubleshooting: {
      issue1: 'If you get 401/403 errors, make sure you have a valid accessToken',
      issue2: 'Get a token by calling /api/auth/create-test-user first',
      issue3: 'Make sure to use http://localhost:3000 (not 5173) for API calls',
      issue4: 'On Windows, use proper JSON escaping or try PowerShell instead of CMD'
    }
  });
});

// Add a health check endpoint
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

  console.log('Health check result:', health);
  res.json(health);
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  console.log(`=== 404 NOT FOUND ===`)
  console.log(`${req.method} ${req.url} - Route not found`)
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`=== UNHANDLED APPLICATION ERROR ===`);
  console.error(`Error: ${err.message}`);
  console.error('Stack:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);

  res.status(500).json({
    success: false,
    message: "There was an error serving your request.",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  - GET  /api/health (health check)');
  console.log('  - GET  /api/help (developer help)');
  console.log('  - POST /api/auth/login (user login)');
  console.log('  - POST /api/auth/register (user registration)');
});