const express = require("express");
const { requireUser } = require("./middleware/firebaseAuth.js");
const { db } = require("../config/firebase");

const router = express.Router();

console.log("=== PROFILE ROUTES MODULE LOADED ===");

// GET /api/users/profile - Get user profile data
router.get("/profile", requireUser, async (req, res) => {
  try {
    console.log("Fetching profile for user:", req.user.uid);

    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userDoc.data();

    // Check for subscription expiry before sending profile data
    const today = new Date();
    if (
      user.subscriptionStatus === "premium" &&
      user.subscriptionEndDate &&
      today > new Date(user.subscriptionEndDate)
    ) {
      // Downgrade to freemium
      await db.collection("users").doc(req.user.uid).update({
        subscriptionStatus: "freemium",
        subscriptionState: "expired",
        dailyQuizLimit: 3,
        dailyQuizzesTaken: 0,
      });

      user.subscriptionStatus = "freemium";
      user.subscriptionState = "expired";
      user.dailyQuizLimit = 3;
      user.dailyQuizzesTaken = 0;

      console.log(
        "User subscription expired and was downgraded during profile fetch"
      );
    }

    // Calculate subject-wise statistics
    const subjectStats = {};
    if (user.completedQuizzes) {
      user.completedQuizzes.forEach((quiz) => {
        if (!subjectStats[quiz.subject]) {
          subjectStats[quiz.subject] = {
            totalScore: 0,
            count: 0,
          };
        }
        subjectStats[quiz.subject].totalScore += quiz.score;
        subjectStats[quiz.subject].count += 1;
      });
    }

    const subjectStatsArray = Object.keys(subjectStats).map((subject) => ({
      name: subject.charAt(0).toUpperCase() + subject.slice(1),
      score:
        Math.round(
          subjectStats[subject].totalScore / subjectStats[subject].count
        ) || 0,
    }));

    // Get recent activity (last 5 completed quizzes)
    const recentActivity = user.completedQuizzes
      ? user.completedQuizzes
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 5)
          .map((quiz) => ({
            action: `Completed ${
              quiz.subject.charAt(0).toUpperCase() + quiz.subject.slice(1)
            } Quiz`,
            date: formatTimeAgo(quiz.completedAt),
            score: quiz.score,
          }))
      : [];

    // Format join date
    const joinedDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "Unknown";

    // Calculate next billing date for premium users
    let nextBilling = null;
    let subscriptionStatusText = user.subscriptionStatus;

    if (user.subscriptionStatus === "premium" && user.subscriptionEndDate) {
      nextBilling = new Date(user.subscriptionEndDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      // If subscription is cancelled but still active
      if (user.subscriptionState === "cancelled") {
        subscriptionStatusText = "premium (cancelled)";
      }
    }

    const profileData = {
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      role: user.role || "user",
      plan: user.plan || user.subscriptionStatus || "freemium",
      subscriptionStatus: user.subscriptionStatus || "freemium",
      subscriptionState: user.subscriptionState,
      subscriptionStatusText: subscriptionStatusText,
      joinedDate: joinedDate,
      avatar: null, // Will be implemented later with file upload
      stats: {
        totalQuizzes: user.totalQuizzes || 0,
        averageScore: user.averageScore || 0,
        studyStreak: user.studyStreak || 0,
        achievements: user.achievements || 0,
      },
      subjectStats: subjectStatsArray,
      recentActivity: recentActivity,
      nextBilling: nextBilling,
      subscriptionEndDate: user.subscriptionEndDate,
      subscriptionCancelledAt: user.subscriptionCancelledAt,
      dailyQuizLimit: user.dailyQuizLimit || 3,
      dailyQuizzesTaken: user.dailyQuizzesTaken || 0,
      canTakeMoreQuizzes:
        user.plan === "premium" ||
        user.subscriptionStatus === "premium" ||
        (user.dailyQuizzesTaken || 0) < (user.dailyQuizLimit || 3),
    };

    console.log("Profile data prepared for user:", req.user.uid);

    res.json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});

// PUT /api/users/profile - Update user profile data
router.put("/profile", requireUser, async (req, res) => {
  try {
    console.log("=== BACKEND PROFILE UPDATE START ===");
    console.log("User ID:", req.user.uid);
    console.log("Request body:", req.body);

    const { username, email, bio, plan } = req.body;

    // Validate input
    if (!username || !email) {
      console.log("Validation failed: missing username or email");
      return res.status(400).json({
        success: false,
        message: "Username and email are required",
      });
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      console.log("Email changed, checking for conflicts...");
      const usersRef = db.collection("users");
      const q = usersRef.where("email", "==", email);
      const querySnapshot = await q.get();

      if (!querySnapshot.empty) {
        const existingUser = querySnapshot.docs[0];
        if (existingUser.id !== req.user.uid) {
          console.log("Email conflict found with user:", existingUser.id);
          return res.status(400).json({
            success: false,
            message: "Email is already taken by another user",
          });
        }
      }
      console.log("No email conflicts found");
    }

    // Prepare update data
    const updateData = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      bio: bio ? bio.trim() : "",
      updatedAt: new Date(),
    };

    console.log("Base update data prepared:", updateData);

    // Handle plan update (only allow certain transitions)
    if (plan && plan !== req.user.subscriptionStatus) {
      console.log("Plan change requested:", {
        from: req.user.subscriptionStatus,
        to: plan,
        userRole: req.user.role,
      });

      if (
        req.user.role === "admin" ||
        (req.user.subscriptionStatus === "freemium" &&
          subscriptionStatus === "premium")
      ) {
        console.log("Plan change authorized");
        updateData.subscriptionStatus = plan;

        if (plan === "premium") {
          updateData.subscriptionStartDate = new Date();
          // Set subscription end date to 1 year from now
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1);
          updateData.subscriptionEndDate = endDate;
          updateData.subscriptionState = "active";
          updateData.subscriptionCancelledAt = null;
          updateData.dailyQuizLimit = -1; // Unlimited for premium
          console.log("Premium subscription data added:", {
            subscriptionStartDate: updateData.subscriptionStartDate,
            subscriptionEndDate: updateData.subscriptionEndDate,
            dailyQuizLimit: updateData.dailyQuizLimit,
          });
        } else if (plan === "freemium") {
          updateData.subscriptionStartDate = null;
          updateData.subscriptionEndDate = null;
          updateData.subscriptionState = "active";
          updateData.subscriptionCancelledAt = null;
          updateData.dailyQuizLimit = 3; // Reset to freemium limit
          console.log("Freemium subscription data added");
        }
      } else {
        console.log("Subscription change not authorized:", {
          userRole: req.user.role,
          currentStatus: req.user.subscriptionStatus,
          requestedStatus: subscriptionStatus,
        });
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to change subscription status in this way",
        });
      }
    } else if (plan) {
      console.log("Plan unchanged or not provided:", {
        current: req.user.subscriptionStatus,
        requested: plan,
      });
    }

    console.log("Final update data:", updateData);

    // Update user
    await db.collection("users").doc(req.user.uid).update(updateData);

    // Get updated user data
    const updatedUserDoc = await db.collection("users").doc(req.user.uid).get();
    const updatedUser = updatedUserDoc.data();

    console.log("User updated successfully:", {
      uid: req.user.uid,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      subscriptionStatus: updatedUser.subscriptionStatus,
    });

    console.log("=== BACKEND PROFILE UPDATE SUCCESS ===");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        plan: updatedUser.plan || updatedUser.subscriptionStatus,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("=== BACKEND PROFILE UPDATE ERROR ===");
    console.error("Error updating user profile:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
});

// POST /api/users/upgrade - Upgrade user to premium subscription
router.post("/upgrade", requireUser, async (req, res) => {
  console.log("=== UPGRADE ENDPOINT HIT ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request path:", req.path);

  try {
    console.log("=== SUBSCRIPTION UPGRADE START ===");
    console.log("User ID:", req.user.uid);
    console.log("Current subscription status:", req.user.subscriptionStatus);
    console.log("Upgrade request data:", req.body);

    const { plan } = req.body;

    // Validate input
    if (!plan || !["monthly", "yearly"].includes(plan)) {
      console.log("Invalid plan specified:", plan);
      return res.status(400).json({
        success: false,
        message: "Valid plan (monthly or yearly) is required",
      });
    }

    // Check if user is already premium
    if (req.user.subscriptionStatus === "premium") {
      console.log("User is already premium");
      return res.status(400).json({
        success: false,
        message: "You are already a premium subscriber",
      });
    }

    // Prepare upgrade data
    const upgradeData = {
      plan: "premium",
      subscriptionStatus: "premium",
      subscriptionState: "active",
      subscriptionStartDate: new Date(),
      subscriptionCancelledAt: null,
      dailyQuizLimit: -1, // Unlimited for premium
      updatedAt: new Date(),
    };

    // Set subscription end date based on plan
    const endDate = new Date();
    if (plan === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    upgradeData.subscriptionEndDate = endDate;

    console.log("Upgrade data prepared:", upgradeData);

    // Update user subscription
    await db.collection("users").doc(req.user.uid).update(upgradeData);

    // Get updated user data
    const updatedUserDoc = await db.collection("users").doc(req.user.uid).get();
    const updatedUser = updatedUserDoc.data();

    console.log("Subscription upgraded successfully:", {
      uid: req.user.uid,
      subscriptionStatus: updatedUser.subscriptionStatus,
      subscriptionStartDate: updatedUser.subscriptionStartDate,
      subscriptionEndDate: updatedUser.subscriptionEndDate,
    });

    console.log("=== SUBSCRIPTION UPGRADE SUCCESS ===");

    res.json({
      success: true,
      message: `Successfully upgraded to premium ${plan} plan!`,
      user: {
        plan: updatedUser.plan,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionStartDate: updatedUser.subscriptionStartDate.toISOString(),
        subscriptionEndDate: updatedUser.subscriptionEndDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("=== SUBSCRIPTION UPGRADE ERROR ===");
    console.error("Error upgrading subscription:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to upgrade subscription",
    });
  }
});

// POST /api/users/cancel-subscription - Cancel user subscription
router.post("/cancel-subscription", requireUser, async (req, res) => {
  try {
    console.log("=== SUBSCRIPTION CANCELLATION START ===");
    console.log("User ID:", req.user.uid);
    console.log("Current subscription status:", req.user.subscriptionStatus);
    console.log("Current subscription state:", req.user.subscriptionState);

    // Check if user has premium subscription
    if (req.user.subscriptionStatus !== "premium") {
      console.log("User does not have premium subscription");
      return res.status(400).json({
        success: false,
        message: "You do not have an active premium subscription to cancel",
      });
    }

    // Check if subscription is already cancelled
    if (req.user.subscriptionState === "cancelled") {
      console.log("Subscription is already cancelled");
      return res.status(400).json({
        success: false,
        message: "Your subscription is already cancelled",
      });
    }

    // Mark subscription as cancelled but keep premium access until end date
    const cancellationData = {
      plan: "premium", // Keep plan as premium until end date
      subscriptionState: "cancelled",
      subscriptionCancelledAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Cancellation data prepared:", cancellationData);

    // Update user subscription
    await db.collection("users").doc(req.user.uid).update(cancellationData);

    // Get updated user data
    const updatedUserDoc = await db.collection("users").doc(req.user.uid).get();
    const updatedUser = updatedUserDoc.data();

    const endDateFormatted = new Date(
      updatedUser.subscriptionEndDate
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    console.log("Subscription cancelled successfully:", {
      uid: req.user.uid,
      subscriptionState: updatedUser.subscriptionState,
      subscriptionCancelledAt: updatedUser.subscriptionCancelledAt,
      subscriptionEndDate: updatedUser.subscriptionEndDate,
    });

    console.log("=== SUBSCRIPTION CANCELLATION SUCCESS ===");

    res.json({
      success: true,
      message: `Your subscription has been cancelled. You will retain premium access until ${endDateFormatted}.`,
      user: {
        plan: updatedUser.plan,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionState: updatedUser.subscriptionState,
        subscriptionEndDate: updatedUser.subscriptionEndDate.toISOString(),
        subscriptionCancelledAt:
          updatedUser.subscriptionCancelledAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("=== SUBSCRIPTION CANCELLATION ERROR ===");
    console.error("Error cancelling subscription:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
    });
  }
});

// GET /api/users/subscription - Get subscription details and status
router.get("/subscription", requireUser, async (req, res) => {
  try {
    console.log("=== GET SUBSCRIPTION DETAILS START ===");
    console.log("User ID:", req.user.uid);
    console.log("Current subscription status:", req.user.subscriptionStatus);

    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userDoc.data();

    // Check for subscription expiry before sending data
    const today = new Date();
    if (
      user.subscriptionStatus === "premium" &&
      user.subscriptionEndDate &&
      today > new Date(user.subscriptionEndDate)
    ) {
      // Downgrade to freemium
      await db.collection("users").doc(req.user.uid).update({
        plan: "freemium",
        subscriptionStatus: "freemium",
        subscriptionState: "expired",
        dailyQuizLimit: 3,
        dailyQuizzesTaken: 0,
      });

      user.plan = "freemium";
      user.subscriptionStatus = "freemium";
      user.subscriptionState = "expired";
      user.dailyQuizLimit = 3;
      user.dailyQuizzesTaken = 0;

      console.log(
        "User subscription expired and was downgraded during subscription details fetch"
      );
    }

    // Reset daily quiz count if needed
    if (user.lastQuizResetDate) {
      const today = new Date();
      const lastReset = new Date(user.lastQuizResetDate);

      if (today.toDateString() !== lastReset.toDateString()) {
        await db.collection("users").doc(req.user.uid).update({
          dailyQuizzesTaken: 0,
          lastQuizResetDate: today,
        });
        user.dailyQuizzesTaken = 0;
      }
    }

    // Prepare subscription details
    let subscriptionDetails = {
      status: user.subscriptionStatus,
      plan: user.plan || user.subscriptionStatus || "freemium",
      startDate: null,
      endDate: null,
      nextBilling: null,
      amount: 0,
      state: user.subscriptionState,
      dailyQuizLimit: user.dailyQuizLimit || 3,
      dailyQuizzesTaken: user.dailyQuizzesTaken || 0,
      canTakeMoreQuizzes:
        user.plan === "premium" ||
        user.subscriptionStatus === "premium" ||
        (user.dailyQuizzesTaken || 0) < (user.dailyQuizLimit || 3),
      features: {
        unlimitedQuizzes:
          user.plan === "premium" || user.subscriptionStatus === "premium",
        advancedAnalytics:
          user.plan === "premium" || user.subscriptionStatus === "premium",
        uploadNotes:
          user.plan === "premium" || user.subscriptionStatus === "premium",
        prioritySupport:
          user.plan === "premium" || user.subscriptionStatus === "premium",
        offlineAccess:
          user.plan === "premium" || user.subscriptionStatus === "premium",
        customStudyPlans:
          user.plan === "premium" || user.subscriptionStatus === "premium",
      },
    };

    if (user.subscriptionStatus === "premium") {
      subscriptionDetails.startDate = user.subscriptionStartDate
        ? user.subscriptionStartDate.toISOString()
        : null;
      subscriptionDetails.endDate = user.subscriptionEndDate
        ? user.subscriptionEndDate.toISOString()
        : null;

      if (user.subscriptionEndDate) {
        subscriptionDetails.nextBilling = new Date(
          user.subscriptionEndDate
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // Calculate amount based on subscription duration (mock calculation)
      if (user.subscriptionStartDate && user.subscriptionEndDate) {
        const startDate = new Date(user.subscriptionStartDate);
        const endDate = new Date(user.subscriptionEndDate);
        const monthsDiff =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());

        subscriptionDetails.amount = monthsDiff >= 12 ? 95.99 : 9.99; // Yearly vs Monthly
      }
    }

    console.log("Subscription details prepared:", {
      status: subscriptionDetails.status,
      plan: subscriptionDetails.plan,
      dailyQuizLimit: subscriptionDetails.dailyQuizLimit,
      dailyQuizzesTaken: subscriptionDetails.dailyQuizzesTaken,
      canTakeMoreQuizzes: subscriptionDetails.canTakeMoreQuizzes,
    });

    console.log("=== GET SUBSCRIPTION DETAILS SUCCESS ===");

    res.json({
      success: true,
      subscription: subscriptionDetails,
    });
  } catch (error) {
    console.error("=== GET SUBSCRIPTION DETAILS ERROR ===");
    console.error("Error fetching subscription details:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription details",
    });
  }
});

console.log("=== UPGRADE ROUTE REGISTERED ===");

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays === 1) {
    return "1 day ago";
  } else {
    return `${diffInDays} days ago`;
  }
}

module.exports = router;
