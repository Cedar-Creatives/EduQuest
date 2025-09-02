const express = require("express");
const { auth, db } = require("../config/firebase");
const { requireUser } = require("./middleware/firebaseAuth.js");

const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Error mapping for Firebase Auth ---
const getFirebaseAuthErrorMessage = (errorCode) => {
  const errorMap = {
    "auth/email-already-exists":
      "Email address is already in use by another account.",
    "auth/invalid-email": "The email address is not valid.",
    "auth/weak-password": "The password is too weak.",
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "The password is not valid.",
  };
  return errorMap[errorCode] || "An unexpected authentication error occurred.";
};

// --- Authentication Routes ---

// POST /api/auth/register - Register a new user
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/auth/register");
    const { email, password, username } = req.body;

    if (!email || !password) {
      console.warn("Registration failed: Missing email or password.");
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    try {
      console.log(`Creating user in Firebase Auth for email: ${email}`);
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: username || email.split("@")[0],
      });
      console.log(`User created in Firebase Auth: ${userRecord.uid}`);

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
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        // Fields from previous schema to ensure consistency
        completedQuizzes: [],
        totalQuizzes: 0,
        averageScore: 0,
        studyStreak: 0,
        lastStudyDate: null,
        achievements: 0,
      };

      await db.collection("users").doc(userRecord.uid).set(userData);
      console.log(
        `User document created in Firestore for UID: ${userRecord.uid}`
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: {
          user: {
            uid: userRecord.uid,
            email: userRecord.email,
            username: userData.username,
          },
        },
      });
    } catch (error) {
      console.error(`Registration error for ${email}:`, error);
      const message = getFirebaseAuthErrorMessage(error.code);
      res.status(400).json({ success: false, message });
    }
  })
);

// POST /api/auth/login - Endpoint to confirm user exists and update login time
router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/auth/login");
    const { email } = req.body;

    if (!email) {
      console.warn("Login failed: Missing email.");
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const usersRef = db.collection("users");
    const querySnapshot = await usersRef
      .where("email", "==", email)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.warn(`Login attempt for non-existent user: ${email}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const userDoc = querySnapshot.docs[0];
    await userDoc.ref.update({ lastLoginAt: new Date() });
    console.log(`Updated last login time for user: ${userDoc.id}`);

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      message: "Login successful.",
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
  })
);

// POST /api/auth/verify-token - Verify Firebase ID token and get user data
router.post(
  "/verify-token",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/auth/verify-token");
    const { idToken } = req.body;

    if (!idToken) {
      console.warn("Token verification failed: Missing ID token.");
      return res
        .status(400)
        .json({ success: false, message: "ID token is required." });
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log(`Token verified for UID: ${decodedToken.uid}`);

      const userDoc = await db.collection("users").doc(decodedToken.uid).get();
      if (!userDoc.exists) {
        console.warn(
          `User document not found for verified UID: ${decodedToken.uid}`
        );
        return res
          .status(404)
          .json({ success: false, message: "User data not found." });
      }

      res.status(200).json({
        success: true,
        message: "Token verified successfully.",
        data: { user: userDoc.data() },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    }
  })
);

// POST /api/auth/logout - Note user logout time
router.post(
  "/logout",
  requireUser,
  asyncHandler(async (req, res, next) => {
    const uid = req.user.uid;
    console.log(`-> POST /api/auth/logout for UID: ${uid}`);

    await db.collection("users").doc(uid).update({ lastLogoutAt: new Date() });
    console.log(`Updated last logout time for user: ${uid}`);

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  })
);

// GET /api/auth/me - Get current user data
router.get(
  "/me",
  requireUser,
  asyncHandler(async (req, res, next) => {
    const uid = req.user.uid;
    console.log(`-> GET /api/auth/me for UID: ${uid}`);

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      console.warn(`User document not found for authenticated user: ${uid}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: { user: userDoc.data() },
    });
  })
);

// POST /api/auth/create-test-user - Development utility to create a test user
router.post(
  "/create-test-user",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/auth/create-test-user");

    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "testpassword123";

    const userRecord = await auth.createUser({
      email: testEmail,
      password: testPassword,
      displayName: "Test User",
    });
    console.log(`Test user created in Auth: ${userRecord.uid}`);

    const userData = {
      uid: userRecord.uid,
      email: testEmail,
      username: "Test User",
      role: "user",
      plan: "freemium",
      subscriptionState: "active",
      dailyQuizLimit: 5, // Higher limit for testing
      dailyQuizzesTaken: 0,
      lastQuizResetDate: new Date(),
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
    };

    await db.collection("users").doc(userRecord.uid).set(userData);
    console.log(`Test user document created in Firestore: ${userRecord.uid}`);

    res.status(201).json({
      success: true,
      message: "Test user created successfully.",
      data: {
        user: {
          uid: userRecord.uid,
          email: testEmail,
          username: "Test User",
        },
        credentials: {
          email: testEmail,
          password: testPassword,
        },
      },
    });
  })
);

module.exports = router;
