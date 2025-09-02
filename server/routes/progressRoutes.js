const express = require("express");
const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Progress Routes ---

// GET /api/progress - Get user progress
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/progress");

    try {
      // Mock progress data
      const mockProgress = {
        totalQuizzes: 12,
        averageScore: 78,
        studyStreak: 5,
        achievements: 3,
        subjects: [
          { name: "Mathematics", progress: 75, quizzesTaken: 5 },
          { name: "English", progress: 60, quizzesTaken: 4 },
          { name: "Physics", progress: 45, quizzesTaken: 3 },
        ],
        weeklyProgress: [
          { week: "Week 1", quizzes: 3, averageScore: 80 },
          { week: "Week 2", quizzes: 4, averageScore: 75 },
          { week: "Week 3", quizzes: 5, averageScore: 82 },
        ],
      };

      res.status(200).json({
        success: true,
        data: mockProgress,
      });
    } catch (error) {
      console.error("Progress error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch progress.",
      });
    }
  })
);

// GET /api/progress/subjects - Get progress by subject
router.get(
  "/subjects",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/progress/subjects");

    try {
      // Mock subject progress data
      const mockSubjectProgress = [
        {
          name: "Mathematics",
          progress: 75,
          quizzesTaken: 5,
          averageScore: 80,
        },
        { name: "English", progress: 60, quizzesTaken: 4, averageScore: 75 },
        { name: "Physics", progress: 45, quizzesTaken: 3, averageScore: 70 },
      ];

      res.status(200).json({
        success: true,
        data: mockSubjectProgress,
      });
    } catch (error) {
      console.error("Subject progress error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch subject progress.",
      });
    }
  })
);

module.exports = router;
