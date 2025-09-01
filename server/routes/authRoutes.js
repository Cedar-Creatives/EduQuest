const express = require("express");
const { auth, db } = require("../config/firebase");
const { requireUser } = require("./middleware/firebaseAuth.js");

const router = express.Router();

console.log("=== AUTH ROUTES MODULE LOADED ===");

// POST /api/auth/register - Register a new user (Firebase handles this)
router.post("/register", async (req, res) => {
  console.log("=== BACKEND REGISTER START ===");
  console.log("Register request body:", req.body);

  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      console.log("Register validation failed: missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Create user in Firebase Auth
    console.log("Creating user in Firebase Auth with email:", email);
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username || email.split("@")[0],
    });

    console.log("User created in Firebase Auth:", userRecord.uid);

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      username: username || email.split("@")[0],
      role: "user",
      plan: "freemium",
      subscriptionState: "active",
      dailyQuizLimit: 3,
      dailyQuizzesTaken: 0,
      lastQuizResetDate: new Date(),
      completedQuizzes: [],
      totalQuizzes: 0,
      averageScore: 0,
      studyStreak: 0,
      lastStudyDate: null,
      achievements: 0,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
    };

    await db.collection("users").doc(userRecord.uid).set(userData);
    console.log("User document created in Firestore");

    const responseData = {
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          username: userData.username,
          role: userData.role,
          plan: userData.plan,
          subscriptionStatus: userData.plan,
        },
      },
    };

    console.log("Sending register response:", {
      success: responseData.success,
      message: responseData.message,
      hasUser: !!responseData.data.user,
    });
    console.log("=== BACKEND REGISTER SUCCESS ===");

    res.json(responseData);
  } catch (error) {
    console.error("=== BACKEND REGISTER ERROR ===");
    console.error("Register error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle Firebase-specific errors
    let errorMessage = "Registration failed";
    if (error.code === "auth/email-already-exists") {
      errorMessage = "Email already exists";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak";
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
});

// POST /api/auth/login - Login user (Firebase handles this)
router.post("/login", async (req, res) => {
  console.log("=== BACKEND LOGIN START ===");
  console.log("Login request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Login validation failed: missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Firebase Auth handles login - this endpoint is mainly for compatibility
    // The actual login should happen on the frontend with Firebase Auth
    console.log("Login request received for email:", email);

    // Get user from Firestore to check if they exist
    const usersRef = db.collection("users");
    const q = usersRef.where("email", "==", email);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.log("User not found in Firestore");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    console.log("User found in Firestore:", userData.uid);

    // Update last login
    await db.collection("users").doc(userData.uid).update({
      lastLoginAt: new Date(),
    });

    const responseData = {
      success: true,
      message: "Login successful",
      data: {
        user: {
          uid: userData.uid,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          subscriptionStatus: userData.subscriptionStatus,
        },
      },
    };

    console.log("Sending login response:", {
      success: responseData.success,
      message: responseData.message,
      hasUser: !!responseData.data.user,
    });
    console.log("=== BACKEND LOGIN SUCCESS ===");

    res.json(responseData);
  } catch (error) {
    console.error("=== BACKEND LOGIN ERROR ===");
    console.error("Login error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
});

// POST /api/auth/verify-token - Verify Firebase ID token
router.post("/verify-token", async (req, res) => {
  console.log("=== BACKEND VERIFY TOKEN START ===");

  try {
    const { idToken } = req.body;

    if (!idToken) {
      console.log("Token verification failed: missing ID token");
      return res.status(400).json({
        success: false,
        message: "ID token is required",
      });
    }

    console.log("Verifying Firebase ID token...");
    const decodedToken = await auth.verifyIdToken(idToken);

    console.log("Token verified successfully for user:", decodedToken.uid);

    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      console.log("User not found in Firestore");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    const responseData = {
      success: true,
      message: "Token verified successfully",
      data: {
        user: {
          uid: userData.uid,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          subscriptionStatus: userData.subscriptionStatus,
        },
      },
    };

    console.log("=== BACKEND VERIFY TOKEN SUCCESS ===");
    res.json(responseData);
  } catch (error) {
    console.error("=== BACKEND VERIFY TOKEN ERROR ===");
    console.error("Token verification error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

// POST /api/auth/logout - Logout user
router.post("/logout", requireUser, async (req, res) => {
  console.log("=== BACKEND LOGOUT START ===");
  console.log("Logout request for user:", req.user.uid);

  try {
    // Firebase handles logout automatically
    // We just need to update the user's last logout time if needed
    await db.collection("users").doc(req.user.uid).update({
      lastLogoutAt: new Date(),
    });

    console.log("=== BACKEND LOGOUT SUCCESS ===");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("=== BACKEND LOGOUT ERROR ===");
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", requireUser, async (req, res) => {
  console.log("=== BACKEND GET CURRENT USER ===");
  console.log("Getting current user:", req.user.uid);

  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      console.log("Current user not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();
    console.log("Current user retrieved successfully");

    res.json({
      success: true,
      data: {
        user: {
          uid: userData.uid,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          subscriptionStatus: userData.subscriptionStatus,
        },
      },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/auth/create-test-user - Create test user for development
router.post("/create-test-user", async (req, res) => {
  console.log("=== BACKEND CREATE TEST USER ===");

  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "testpassword123";
    const testUsername = "testuser";

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: testEmail,
      password: testPassword,
      displayName: testUsername,
    });

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      username: testUsername,
      role: "user",
      subscriptionStatus: "freemium",
      subscriptionState: "active",
      dailyQuizLimit: 3,
      dailyQuizzesTaken: 0,
      lastQuizResetDate: new Date(),
      completedQuizzes: [],
      totalQuizzes: 0,
      averageScore: 0,
      studyStreak: 0,
      lastStudyDate: null,
      achievements: 0,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    console.log("Test user created successfully:", userRecord.uid);
    res.json({
      success: true,
      message: "Test user created successfully",
      data: {
        user: {
          uid: userRecord.uid,
          email: testEmail,
          username: testUsername,
        },
        credentials: {
          email: testEmail,
          password: testPassword,
        },
      },
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create test user",
    });
  }
});

module.exports = router;
