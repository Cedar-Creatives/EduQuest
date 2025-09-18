const express = require("express");
const router = express.Router();
const { requireUser } = require("./middleware/firebaseAuth.js");
const { db } = require("../config/firebase");

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Dashboard Routes ---

// All dashboard routes are protected by the requireUser middleware
// GET /api/dashboard - Get main dashboard data
router.get(
  "/",
  requireUser,
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/dashboard for UID: ${req.user.uid}`);

    try {
      const userDoc = await db.collection("users").doc(req.user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const userData = userDoc.data();

      // Fetch recent quizzes (example, adjust as per your schema)
      const quizHistorySnapshot = await db.collection("quizHistory")
        .where("userId", "==", req.user.uid)
        .orderBy("completedAt", "desc")
        .limit(3)
        .get();

      const recentQuizzes = quizHistorySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          subject: data.subject,
          difficulty: data.difficulty,
          score: data.score,
          date: data.completedAt.toDate().toISOString().split('T')[0], // format as YYYY-MM-DD
        };
      });

      const dashboardData = {
        stats: {
          quizzesCompleted: userData.totalQuizzes || 0,
          averageScore: userData.averageScore || 0,
          studyStreak: userData.studyStreak || 0,
          achievements: userData.achievements || 0,
        },
        recentQuizzes,
        achievements: userData.achievementsList || [], // Assuming achievements are stored in the user doc
        dailyQuizzesUsed: userData.dailyQuizzesTaken || 0,
        studyTimeToday: userData.studyTimeToday || 0, // Assuming this is tracked
        aiQuestionsUsed: userData.aiQuestionsUsed || 0, // Assuming this is tracked
        weeklyProgress: userData.weeklyProgress || 0, // Assuming this is tracked
      };

      res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data.",
      });
    }
  })
);

// GET /api/dashboard/stats - Get user statistics
router.get(
  "/stats",
  requireUser,
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/dashboard/stats for UID: ${req.user.uid}`);

    try {
      const userDoc = await db.collection("users").doc(req.user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const userData = userDoc.data();

      const stats = {
        quizzesCompleted: userData.totalQuizzes || 0,
        averageScore: userData.averageScore || 0,
        studyStreak: userData.studyStreak || 0,
        achievements: userData.achievements || 0,
        totalStudyTime: userData.totalStudyTime || 0, // Assuming this is tracked
        subjectsCovered: userData.subjectsCovered ? userData.subjectsCovered.length : 0, // Assuming subjectsCovered is an array
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics.",
      });
    }
  })
);

// GET /api/dashboard/recent-activity - Get recent user activity
router.get(
  "/recent-activity",
  requireUser,
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/dashboard/recent-activity for UID: ${req.user.uid}`);

    try {
        // Example: Fetch last 5 quiz activities
        const activitySnapshot = await db.collection("quizHistory")
            .where("userId", "==", req.user.uid)
            .orderBy("completedAt", "desc")
            .limit(5)
            .get();
        
        const recentActivity = activitySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                type: "quiz",
                subject: data.subject,
                score: data.score,
                timestamp: data.completedAt.toDate().toISOString(),
            };
        });

      res.status(200).json({
        success: true,
        data: recentActivity,
      });
    } catch (error) {
      console.error("Recent activity error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch recent activity.",
      });
    }
  })
);

module.exports = router;