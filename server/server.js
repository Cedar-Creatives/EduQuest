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

// Add raw body logging middleware BEFORE any JSON parsing
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    let rawBody = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', () => {
      console.log('=== RAW BODY DEBUG ===');
      console.log('Method:', req.method);
      console.log('URL:', req.url);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Raw Body Length:', rawBody.length);
      console.log('Raw Body:', JSON.stringify(rawBody));
      console.log('Raw Body (actual):', rawBody);

      // Check each character
      if (rawBody.length > 0) {
        console.log('First 10 characters:');
        for (let i = 0; i < Math.min(10, rawBody.length); i++) {
          console.log(`  Position ${i}: "${rawBody[i]}" (code: ${rawBody.charCodeAt(i)})`);
        }
      }

      // Store raw body for custom JSON parsing
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

// Custom JSON parser with better error handling (REPLACES express.json())
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      try {
        if (req.rawBody) {
          console.log('=== ATTEMPTING JSON PARSE ===');
          console.log('Parsing:', JSON.stringify(req.rawBody));
          req.body = JSON.parse(req.rawBody);
          console.log('Parsed successfully:', req.body);
        } else {
          req.body = {};
        }
      } catch (error) {
        console.log('=== JSON PARSE ERROR ===');
        console.log('Error:', error.message);
        console.log('Raw body that failed:', JSON.stringify(req.rawBody));
        return res.status(400).json({
          error: 'Invalid JSON format',
          details: error.message,
          receivedData: req.rawBody
        });
      }
    } else {
      // Not JSON content-type, set empty body
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

// Add middleware to check Firebase connection
app.use((req, res, next) => {
  console.log('=== FIREBASE CONNECTION CHECK ===');
  console.log('Request URL:', req.url);
  
  // Firebase is initialized asynchronously, so we'll just proceed
  // The actual Firebase operations will handle errors appropriately
  next();
});

// Add request logging middleware (after body parsing)
app.use((req, res, next) => {
  console.log(`=== INCOMING REQUEST ===`)
  console.log(`${req.method} ${req.url}`)
  console.log('Headers:', req.headers)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Parsed Body:', req.body)
  }
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
// Profile Routes
console.log('=== MOUNTING PROFILE ROUTES AT /api/users ===')
app.use('/api/users', profileRoutes);
// Quiz Routes
console.log('=== MOUNTING QUIZ ROUTES AT /api/quiz ===')
app.use('/api/quiz', quizRoutes);
// Dashboard Routes
console.log('=== MOUNTING DASHBOARD ROUTES AT /api/dashboard ===')
app.use('/api/dashboard', dashboardRoutes);
// Notes Routes
console.log('=== MOUNTING NOTES ROUTES AT /api/notes ===')
app.use('/api/notes', notesRoutes);

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