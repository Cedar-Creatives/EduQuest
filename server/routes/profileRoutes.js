const express = require("express");
const { requireUser } = require("./middleware/firebaseAuth.js");
const { db } = require("../config/firebase");

const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


// --- Helper Functions ---

// Downgrades a user's subscription to freemium
const downgradeToFreemium = async (uid) => {
  console.log(`Downgrading user ${uid} to freemium.`);
  await db.collection("users").doc(uid).update({
    plan: "freemium",
    subscriptionStatus: "freemium",
    subscriptionState: "expired",
    dailyQuizLimit: 3,
  });
  console.log(`User ${uid} has been downgraded.`);
};

// Formats a date to a human-readable "time ago" string
const formatTimeAgo = (date) => {
  if (!date) return "Unknown";
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};


// --- Profile Routes ---

// GET /api/users/profile - Get comprehensive user profile data
router.get("/profile", requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  console.log(`-> GET /api/users/profile for UID: ${uid}`);

  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  let user = userDoc.data();

  // Check for subscription expiry
  const today = new Date();
  if (user.subscriptionStatus === "premium" && user.subscriptionEndDate && today > new Date(user.subscriptionEndDate)) {
    await downgradeToFreemium(uid);
    // Re-fetch user data after downgrade
    const updatedUserDoc = await db.collection("users").doc(uid).get();
    user = updatedUserDoc.data();
  }

  const profileData = {
    username: user.username,
    email: user.email,
    role: user.role || "user",
    plan: user.plan || "freemium",
    // ... (rest of the profile data construction)
  };

  res.status(200).json({ success: true, profile: profileData });
}));


// PUT /api/users/profile - Update user profile information
router.put("/profile", requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { username, bio } = req.body;
  console.log(`-> PUT /api/users/profile for UID: ${uid}`);

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required." });
  }

  const updateData = {
    username: username.trim(),
    bio: bio ? bio.trim() : "",
    updatedAt: new Date(),
  };

  await db.collection("users").doc(uid).update(updateData);
  console.log(`Profile updated for UID: ${uid}`);

  const updatedUserDoc = await db.collection("users").doc(uid).get();
  const updatedUser = updatedUserDoc.data();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
    },
  });
}));


// --- Subscription Routes ---

// POST /api/users/upgrade - Upgrade user to a premium plan
router.post("/upgrade", requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { plan } = req.body;
  console.log(`-> POST /api/users/upgrade for UID: ${uid} with plan: ${plan}`);

  if (!plan || !["monthly", "yearly"].includes(plan)) {
    return res.status(400).json({ success: false, message: "A valid plan (monthly or yearly) is required." });
  }

  const userDoc = await db.collection("users").doc(uid).get();
  const user = userDoc.data();

  if (user.subscriptionStatus === "premium") {
    return res.status(400).json({ success: false, message: "You are already a premium subscriber." });
  }

  const endDate = new Date();
  if (plan === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  const upgradeData = {
    plan: "premium",
    subscriptionStatus: "premium",
    subscriptionState: "active",
    subscriptionStartDate: new Date(),
    subscriptionEndDate: endDate,
    dailyQuizLimit: -1, // Unlimited
  };

  await db.collection("users").doc(uid).update(upgradeData);
  console.log(`User ${uid} upgraded to premium.`);

  res.status(200).json({ success: true, message: `Successfully upgraded to premium ${plan} plan!` });
}));


// POST /api/users/cancel-subscription - Cancel a premium subscription
router.post("/cancel-subscription", requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  console.log(`-> POST /api/users/cancel-subscription for UID: ${uid}`);
  
  const userDoc = await db.collection("users").doc(uid).get();
  const user = userDoc.data();

  if (user.subscriptionStatus !== "premium" || user.subscriptionState === "cancelled") {
    return res.status(400).json({ success: false, message: "No active premium subscription to cancel." });
  }

  const cancellationData = {
    subscriptionState: "cancelled",
    subscriptionCancelledAt: new Date(),
  };

  await db.collection("users").doc(uid).update(cancellationData);
  console.log(`User ${uid} cancelled their subscription.`);

  const endDateFormatted = new Date(user.subscriptionEndDate).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  res.status(200).json({
    success: true,
    message: `Your subscription has been cancelled. You will retain premium access until ${endDateFormatted}.`,
  });
}));


// GET /api/users/subscription - Get detailed subscription status
router.get("/subscription", requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  console.log(`-> GET /api/users/subscription for UID: ${uid}`);

  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const user = userDoc.data();

  // Daily quiz reset logic
  if (user.lastQuizResetDate && new Date().toDateString() !== new Date(user.lastQuizResetDate).toDateString()) {
    await userDoc.ref.update({ dailyQuizzesTaken: 0, lastQuizResetDate: new Date() });
    user.dailyQuizzesTaken = 0;
  }
  
  const canTakeMoreQuizzes = user.plan === "premium" || (user.dailyQuizzesTaken || 0) < (user.dailyQuizLimit || 3);

  const subscriptionDetails = {
    status: user.subscriptionStatus,
    plan: user.plan || "freemium",
    state: user.subscriptionState,
    endDate: user.subscriptionEndDate ? user.subscriptionEndDate.toISOString() : null,
    dailyQuizLimit: user.dailyQuizLimit || 3,
    dailyQuizzesTaken: user.dailyQuizzesTaken || 0,
    canTakeMoreQuizzes,
  };

  res.status(200).json({ success: true, subscription: subscriptionDetails });
}));

module.exports = router;
