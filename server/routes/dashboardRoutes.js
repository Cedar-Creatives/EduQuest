const express = require("express");
const { requireUser } = require("./middleware/firebaseAuth.js");
const { db } = require("../config/firebase");

const router = express.Router();

console.log("=== DASHBOARD ROUTES MODULE LOADED ===");

// GET /api/dashboard - Get dashboard statistics and data
router.get("/", requireUser, async (req, res) => {
  try {
    console.log("=== FETCHING DASHBOARD DATA ===");
    console.log("User ID:", req.user.uid);

    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      console.log("User not found for dashboard request");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userDoc.data();

    // Check for subscription expiry and update stats
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
        "User subscription expired and was downgraded during dashboard fetch"
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

    // Calculate recent quizzes (last 3)
    const recentQuizzes = user.completedQuizzes
      ? user.completedQuizzes
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
          .slice(0, 3)
          .map((quiz) => ({
            subject:
              quiz.subject.charAt(0).toUpperCase() + quiz.subject.slice(1),
            difficulty:
              quiz.difficulty.charAt(0).toUpperCase() +
              quiz.difficulty.slice(1),
            score: quiz.score,
            date: formatTimeAgo(quiz.completedAt),
          }))
      : [];

    // Calculate achievements based on user stats
    const achievements = [];
    if ((user.totalQuizzes || 0) >= 20) {
      achievements.push({
        title: "Quiz Master",
        description: "Completed 20 quizzes",
      });
    }
    if (
      user.completedQuizzes &&
      user.completedQuizzes.some((quiz) => quiz.score === 100)
    ) {
      achievements.push({
        title: "Perfect Score",
        description: "Got 100% on a quiz",
      });
    }
    if ((user.studyStreak || 0) >= 5) {
      achievements.push({
        title: "Study Streak",
        description: `${user.studyStreak} days in a row`,
      });
    }

    // Calculate study time today (mock for now - would need actual tracking)
    const studyTimeToday = Math.min((user.dailyQuizzesTaken || 0) * 15, 120); // Assume 15 min per quiz, max 2 hours

    // Calculate weekly progress (mock based on recent activity)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyQuizzes = user.completedQuizzes
      ? user.completedQuizzes.filter(
          (quiz) => new Date(quiz.completedAt) >= weekAgo
        ).length
      : 0;
    const weeklyProgress = Math.min((weeklyQuizzes / 7) * 100, 100); // Target: 1 quiz per day

    const dashboardData = {
      stats: {
        quizzesCompleted: user.totalQuizzes || 0,
        averageScore: user.averageScore || 0,
        studyStreak: user.studyStreak || 0,
        achievements: achievements.length,
      },
      recentQuizzes: recentQuizzes,
      achievements: achievements,
      dailyQuizzesUsed: user.dailyQuizzesTaken || 0,
      studyTimeToday: studyTimeToday,
      weeklyProgress: Math.round(weeklyProgress),
    };

    console.log("Dashboard data prepared:", {
      userId: req.user.uid,
      totalQuizzes: user.totalQuizzes || 0,
      averageScore: user.averageScore || 0,
      dailyQuizzesUsed: user.dailyQuizzesTaken || 0,
      recentQuizzesCount: recentQuizzes.length,
      achievementsCount: achievements.length,
    });

    res.json(dashboardData);
  } catch (error) {
    console.error("=== DASHBOARD DATA FETCH ERROR ===");
    console.error("Error fetching dashboard data:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

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
