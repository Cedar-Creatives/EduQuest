const express = require("express");
const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Profile Routes ---

// GET /api/users/profile - Get user profile
router.get(
  "/profile",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/users/profile");

    try {
      // Mock profile data
      const mockProfile = {
        uid: "user-" + Date.now(),
        email: "user@example.com",
        username: "TestUser",
        role: "user",
        plan: "freemium",
        subscriptionState: "active",
        dailyQuizLimit: 3,
        dailyQuizzesTaken: 1,
        lastQuizResetDate: new Date().toISOString(),
        completedQuizzes: [],
        totalQuizzes: 0,
        averageScore: 0,
        studyStreak: 0,
        lastStudyDate: null,
        achievements: 0,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isActive: true,
      };

      res.status(200).json({
        success: true,
        data: mockProfile,
      });
    } catch (error) {
      console.error("Profile error:", error);
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
  asyncHandler(async (req, res, next) => {
    console.log("-> PUT /api/users/profile");
    const updates = req.body;

    try {
      // Mock profile update
      const updatedProfile = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: updatedProfile,
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
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/users/upgrade");
    const { plan } = req.body;

    try {
      // Validate plan
      if (!plan || !["monthly", "yearly"].includes(plan)) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan. Must be 'monthly' or 'yearly'.",
        });
      }

      // Mock upgrade response
      const upgradeResponse = {
        success: true,
        message: `Successfully upgraded to ${plan} premium plan!`,
        user: {
          subscriptionStatus: "premium",
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: new Date(
            Date.now() +
              (plan === "monthly"
                ? 30 * 24 * 60 * 60 * 1000
                : 365 * 24 * 60 * 60 * 1000)
          ).toISOString(),
          plan: plan,
          features: {
            unlimitedQuizzes: true,
            advancedAnalytics: true,
            uploadNotes: true,
            prioritySupport: true,
            offlineAccess: true,
            customStudyPlans: true,
          },
        },
      };

      console.log("=== UPGRADE SUCCESS ===");
      console.log("Plan:", plan);
      console.log("Response:", upgradeResponse);

      res.status(200).json(upgradeResponse);
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
