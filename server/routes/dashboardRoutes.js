const express = require("express");
const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Dashboard Routes ---

// GET /api/dashboard - Get dashboard data
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/dashboard");

    try {
      // Since we don't have Firebase Admin SDK, return mock data
      // In production, this would be replaced with actual data fetching
      const mockDashboardData = {
        stats: {
          quizzesCompleted: 12,
          averageScore: 78,
          studyStreak: 5,
          achievements: 3,
        },
        recentQuizzes: [
          {
            subject: "Mathematics",
            difficulty: "Intermediate",
            score: 85,
            date: "2024-01-01",
          },
          {
            subject: "English",
            difficulty: "Basic",
            score: 92,
            date: "2024-01-02",
          },
          {
            subject: "Physics",
            difficulty: "Advanced",
            score: 65,
            date: "2024-01-03",
          },
        ],
        achievements: [
          { title: "First Quiz", description: "Completed your first quiz" },
          {
            title: "Streak Master",
            description: "Maintained a 5-day study streak",
          },
          {
            title: "Subject Explorer",
            description: "Tried 3 different subjects",
          },
        ],
        dailyQuizzesUsed: 2,
        studyTimeToday: 45,
        aiQuestionsUsed: 3,
        weeklyProgress: 75,
      };

      res.status(200).json({
        success: true,
        data: mockDashboardData,
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
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/dashboard/stats");

    try {
      const mockStats = {
        quizzesCompleted: 12,
        averageScore: 78,
        studyStreak: 5,
        achievements: 3,
        totalStudyTime: 360,
        subjectsCovered: 4,
      };

      res.status(200).json({
        success: true,
        data: mockStats,
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
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/dashboard/recent-activity");

    try {
      const mockActivity = [
        {
          type: "quiz",
          subject: "Mathematics",
          score: 85,
          timestamp: "2024-01-01T10:00:00Z",
        },
        {
          type: "study",
          subject: "English",
          duration: 30,
          timestamp: "2024-01-01T14:00:00Z",
        },
        {
          type: "achievement",
          title: "Streak Master",
          timestamp: "2024-01-01T16:00:00Z",
        },
      ];

      res.status(200).json({
        success: true,
        data: mockActivity,
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
