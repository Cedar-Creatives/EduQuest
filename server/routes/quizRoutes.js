const express = require("express");
const router = express.Router();
const { requireUser } = require("./middleware/firebaseAuth.js"); // Correctly import the middleware
const openRouterService = require("../services/openRouterService");

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Quiz Routes ---

// POST /api/quizzes/generate - Generate quiz via AI
router.post(
  "/generate",
  requireUser, // Protect this route
  asyncHandler(async (req, res) => {
    console.log(`-> POST /api/quizzes/generate for UID: ${req.user.uid}`);
    const { subject, difficulty, count } = req.body || {};
    if (!subject || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Subject and difficulty are required",
      });
    }
    try {
      const questions = await openRouterService.generateQuizQuestions(
        subject,
        difficulty,
        count || 5
      );
      return res.status(200).json({
        success: true,
        data: {
          quiz: { id: `ai-${Date.now()}`, subject, difficulty, questions },
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate quiz",
      });
    }
  })
);

// GET /api/quizzes/subjects - Get all quiz subjects
router.get(
  "/subjects",
  requireUser, // Protect this route
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/quizzes/subjects for UID: ${req.user.uid}`);

    try {
      // This mock data will now be sent to authenticated users, fixing the "No quizzes available" screen.
      const mockSubjects = [
        { name: 'Mathematics', difficulty: 'Easy', time: '10 mins', questions: 5 },
        { name: 'History', difficulty: 'Medium', time: '15 mins', questions: 10 },
        { name: 'Science', difficulty: 'Hard', time: '20 mins', questions: 15 },
        { name: 'Geography', difficulty: 'Medium', time: '12 mins', questions: 8 }
      ];

      res.status(200).json({
        success: true,
        data: mockSubjects,
      });
    } catch (error) {
      console.error("Subjects error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch subjects.",
      });
    }
  })
);

// GET /api/quizzes/:subject/:difficulty - Basic mock quiz for subject/difficulty
router.get(
  "/:subject/:difficulty",
  requireUser, // Protect this route
  asyncHandler(async (req, res) => {
    console.log(`-> GET /api/quizzes/:subject/:difficulty for UID: ${req.user.uid}`);
    const { subject, difficulty } = req.params;
    const questions = [
        { id: 'q1', question: `A ${difficulty} question about ${subject}?`, options: ['A', 'B', 'C'], correctAnswer: 0 },
        { id: 'q2', question: `Another ${difficulty} question about ${subject}?`, options: ['X', 'Y', 'Z'], correctAnswer: 1 },
    ];

    return res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: `mock-${Date.now()}`,
          subject,
          difficulty,
          questions,
        },
      },
    });
  })
);

module.exports = router;
