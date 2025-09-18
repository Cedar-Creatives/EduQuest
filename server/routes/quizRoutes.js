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

// POST /api/quiz/submit - Submit quiz answers and get results
router.post(
  "/submit",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/quiz/submit");
    const { quizId, answers, timeTaken, subject, difficulty } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and answers array are required.",
      });
    }

    try {
      // For demo purposes, we'll create mock results
      // In a real app, you'd fetch the quiz questions and calculate the score
      const totalQuestions = answers.length;
      let correctAnswers = 0;
      const detailedResults = [];

      // Mock question data for scoring
      const mockQuestions = [
        {
          id: "q1",
          question: "What is 5 + 7?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2,
          explanation: "5 + 7 = 12. This is basic addition.",
        },
        {
          id: "q2",
          question: "What is 9 × 3?",
          options: ["27", "21", "24", "18"],
          correctAnswer: 0,
          explanation: "9 × 3 = 27. This is basic multiplication.",
        },
        {
          id: "q3",
          question: "Solve: 15 − 6",
          options: ["7", "8", "9", "10"],
          correctAnswer: 2,
          explanation: "15 − 6 = 9. This is basic subtraction.",
        },
        {
          id: "q4",
          question: "What is 12 ÷ 4?",
          options: ["2", "3", "4", "6"],
          correctAnswer: 1,
          explanation: "12 ÷ 4 = 3. This is basic division.",
        },
        {
          id: "q5",
          question: "What is 2³ (2 to the power of 3)?",
          options: ["6", "8", "9", "12"],
          correctAnswer: 1,
          explanation: "2³ = 2 × 2 × 2 = 8. This is basic exponentiation.",
        },
      ];

      // Calculate score and create detailed results
      answers.forEach((userAnswer, index) => {
        const question = mockQuestions[index % mockQuestions.length];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
          correctAnswers++;
        }

        detailedResults.push({
          questionId: question.id,
          question: question.question,
          options: question.options,
          userAnswer: userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect,
          explanation: question.explanation,
        });
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const resultId = `result-${Date.now()}`;

      const result = {
        id: resultId,
        quizId: quizId,
        score: score,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        timeTaken: timeTaken || 0,
        subject: subject || "Unknown",
        difficulty: difficulty || "Basic",
        answers: detailedResults,
        completedAt: new Date().toISOString(),
        performance: {
          grade: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F",
          feedback: score >= 90 ? "Excellent work!" : 
                   score >= 80 ? "Great job!" : 
                   score >= 70 ? "Good effort!" : 
                   score >= 60 ? "Keep practicing!" : "Need more study time",
          strengths: correctAnswers > totalQuestions * 0.7 ? ["Strong understanding of concepts"] : [],
          improvements: correctAnswers < totalQuestions * 0.7 ? ["Review basic concepts", "Practice more problems"] : [],
        }
      };

      res.status(200).json({
        success: true,
        data: { result },
        message: "Quiz submitted successfully.",
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit quiz.",
      });
    }
  })
);

// GET /api/quiz/history - Get quiz history for user
router.get(
  "/history",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/quiz/history");
    const limit = parseInt(req.query.limit) || 10;

    try {
      // Mock quiz history data
      const mockHistory = [
        {
          id: "result-1",
          subject: "Mathematics",
          difficulty: "Basic",
          score: 85,
          totalQuestions: 10,
          correctAnswers: 8,
          timeTaken: 600, // 10 minutes in seconds
          completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          grade: "B"
        },
        {
          id: "result-2",
          subject: "English",
          difficulty: "Intermediate",
          score: 92,
          totalQuestions: 15,
          correctAnswers: 14,
          timeTaken: 900, // 15 minutes in seconds
          completedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          grade: "A"
        },
        {
          id: "result-3",
          subject: "Physics",
          difficulty: "Advanced",
          score: 78,
          totalQuestions: 12,
          correctAnswers: 9,
          timeTaken: 1200, // 20 minutes in seconds
          completedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          grade: "C"
        }
      ];

      const limitedHistory = mockHistory.slice(0, limit);

      res.status(200).json({
        success: true,
        data: limitedHistory,
        message: "Quiz history retrieved successfully.",
      });
    } catch (error) {
      console.error("Quiz history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch quiz history.",
      });
    }
  })
);

module.exports = router;
