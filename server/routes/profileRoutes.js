const express = require("express");
const router = express.Router();
const { requireUser } = require("./middleware/firebaseAuth.js");
const { db, auth } = require("../config/firebase");

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Profile Routes ---

// GET /api/users/profile - Get user profile
router.get(
  "/profile",
  requireUser,
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/users/profile for UID: ${req.user.uid}`);

    try {
      const userDoc = await db.collection("users").doc(req.user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ success: false, message: "User profile not found" });
      }

      res.status(200).json({
        success: true,
        data: userDoc.data(),
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch profile.",
      });
    }
  })
);

// PUT /api/users/profile - Update user profile
router.put(
  "/profile",
  requireUser,
  asyncHandler(async (req, res, next) => {
    const { uid } = req.user;
    console.log(`-> PUT /api/users/profile for UID: ${uid}`);
    const { username, ...otherUpdates } = req.body;

    try {
      const userRef = db.collection("users").doc(uid);

      // If username is being updated, check for uniqueness first
      if (username) {
        const newUsername = String(username).trim();
        if (newUsername.length < 3) {
          return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
        }

        const snapshot = await db.collection("users").where("username", "==", newUsername).limit(1).get();
        if (!snapshot.empty && snapshot.docs[0].id !== uid) {
          return res.status(409).json({ success: false, message: "Username already exists" });
        }

        // Update both Firebase Auth and Firestore
        await auth.updateUser(uid, { displayName: newUsername });
        await userRef.update({ username: newUsername, ...otherUpdates });
      } else {
        // Update only other fields in Firestore
        await userRef.update(otherUpdates);
      }

      const updatedUserDoc = await userRef.get();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: updatedUserDoc.data(),
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile.",
      });
    }
  })
);

// POST /api/users/upgrade - Upgrade user to premium
router.post(
  "/upgrade",
  requireUser,
  asyncHandler(async (req, res, next) => {
    const { uid } = req.user;
    console.log(`-> POST /api/users/upgrade for UID: ${uid}`);
    const { plan } = req.body;

    try {
      if (!plan || !["monthly", "yearly"].includes(plan)) {
        return res.status(400).json({ success: false, message: "Invalid plan." });
      }

      const userRef = db.collection("users").doc(uid);
      const subscriptionEndDate = new Date();
      if (plan === "monthly") {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      } else {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      }

      await userRef.update({
        plan: plan,
        subscriptionStatus: "premium",
        subscriptionStartDate: new Date(),
        subscriptionEndDate: subscriptionEndDate,
      });

      const updatedUserDoc = await userRef.get();

      res.status(200).json({
        success: true,
        message: `Successfully upgraded to ${plan} premium plan!`,
        data: updatedUserDoc.data(),
      });
    } catch (error) {
      console.error("Upgrade error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process upgrade.",
      });
    }
  })
);

module.exports = router;
