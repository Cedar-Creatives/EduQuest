const express = require("express");
const router = express.Router();
const openRouterService = require("../services/openRouterService");

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Quiz Routes ---

// POST /api/quiz/generate - Generate quiz via AI
router.post(
  "/generate",
  asyncHandler(async (req, res) => {
    const { subject, difficulty, count } = req.body || {};
    if (!subject || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "subject and difficulty are required",
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

// GET /api/quiz/:subject/:difficulty - Basic mock quiz for subject/difficulty
router.get(
  "/:subject/:difficulty",
  asyncHandler(async (req, res) => {
    const { subject, difficulty } = req.params;
    const normalizedSubject = String(subject).toLowerCase();
    const normalizedDifficulty = String(difficulty).toLowerCase();
    const count = Math.max(
      1,
      Math.min(parseInt(req.query.count, 10) || 10, 50)
    );

    // Base templates
    const baseTemplates = [
      {
        question:
          normalizedSubject === "mathematics"
            ? "What is 5 + 7?"
            : "What is the capital of France?",
        options:
          normalizedSubject === "mathematics"
            ? ["10", "11", "12", "13"]
            : ["Paris", "Lyon", "Marseille", "Nice"],
        correctAnswer: normalizedSubject === "mathematics" ? 2 : 0,
        explanation:
          normalizedSubject === "mathematics"
            ? "5 + 7 = 12"
            : "Paris is the capital of France.",
      },
      {
        question:
          normalizedSubject === "mathematics"
            ? "What is 9 × 3?"
            : "Which ocean borders Nigeria?",
        options:
          normalizedSubject === "mathematics"
            ? ["27", "21", "24", "18"]
            : [
                "Atlantic Ocean",
                "Indian Ocean",
                "Pacific Ocean",
                "Arctic Ocean",
              ],
        correctAnswer: 0,
        explanation:
          normalizedSubject === "mathematics"
            ? "9 × 3 = 27"
            : "Nigeria borders the Atlantic Ocean.",
      },
      {
        question:
          normalizedSubject === "mathematics"
            ? "Solve: 15 − 6"
            : "What is the synonym of 'quick'?",
        options:
          normalizedSubject === "mathematics"
            ? ["7", "8", "9", "10"]
            : ["Rapid", "Slow", "Lazy", "Heavy"],
        correctAnswer: normalizedSubject === "mathematics" ? 2 : 0,
        explanation:
          normalizedSubject === "mathematics"
            ? "15 − 6 = 9"
            : "'Rapid' is a synonym for 'quick'.",
      },
      {
        question:
          normalizedSubject === "mathematics"
            ? "What is 6 ÷ 2?"
            : "Which is a noun?",
        options:
          normalizedSubject === "mathematics"
            ? ["2", "3", "4", "6"]
            : ["Run", "Blue", "Happiness", "Quickly"],
        correctAnswer: normalizedSubject === "mathematics" ? 1 : 2,
        explanation:
          normalizedSubject === "mathematics"
            ? "6 ÷ 2 = 3"
            : "'Happiness' is a noun.",
      },
    ];

    const questions = Array.from({ length: count }).map((_, i) => {
      const t = baseTemplates[i % baseTemplates.length];
      return {
        id: `q${i + 1}`,
        question: t.question,
        options: t.options,
        correctAnswer: t.correctAnswer,
        explanation: t.explanation,
        difficulty: normalizedDifficulty,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: `mock-${Date.now()}`,
          subject: normalizedSubject,
          difficulty: normalizedDifficulty,
          questions,
        },
      },
    });
  })
);

// GET /api/quiz/subjects - Get all quiz subjects
router.get(
  "/subjects",
  asyncHandler(async (req, res, next) => {
    console.log("-> GET /api/quiz/subjects");

    try {
      // Mock subjects data
      const mockSubjects = [
        {
          id: "math",
          name: "Mathematics",
          description: "Basic mathematics concepts",
          avgTime: 20,
          questionCount: 15,
          difficulty: "Intermediate",
        },
        {
          id: "english",
          name: "English Language",
          description: "English grammar and literature",
          avgTime: 25,
          questionCount: 20,
          difficulty: "Basic",
        },
        {
          id: "physics",
          name: "Physics",
          description: "Physics fundamentals",
          avgTime: 30,
          questionCount: 18,
          difficulty: "Advanced",
        },
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

// POST /api/quiz/subjects - Create new subject
router.post(
  "/subjects",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/quiz/subjects");
    const { name, description, avgTime } = req.body;

    if (!name || !description || !avgTime) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and average time are required.",
      });
    }

    try {
      // Mock subject creation
      const newSubject = {
        id: "subject-" + Date.now(),
        name,
        description,
        avgTime,
        questionCount: 0,
        difficulty: "Basic",
        createdAt: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: "Subject created successfully.",
        data: newSubject,
      });
    } catch (error) {
      console.error("Subject creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create subject.",
      });
    }
  })
);

// GET /api/quiz/subjects/:id/questions - Get questions by subject
router.get(
  "/subjects/:id/questions",
  asyncHandler(async (req, res, next) => {
    console.log(`-> GET /api/quiz/subjects/${req.params.id}/questions`);

    try {
      // Mock questions data
      const mockQuestions = [
        {
          id: "q1",
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          explanation: "2 + 2 equals 4",
          difficulty: "Basic",
        },
        {
          id: "q2",
          question: "What is the capital of Nigeria?",
          options: ["Lagos", "Abuja", "Kano", "Ibadan"],
          correctAnswer: 1,
          explanation: "Abuja is the capital of Nigeria",
          difficulty: "Basic",
        },
      ];

      res.status(200).json({
        success: true,
        data: mockQuestions,
      });
    } catch (error) {
      console.error("Questions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch questions.",
      });
    }
  })
);

// POST /api/quiz/questions - Create new question
router.post(
  "/questions",
  asyncHandler(async (req, res, next) => {
    console.log("-> POST /api/quiz/questions");
    const {
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      subjectId,
    } = req.body;

    if (
      !question ||
      !options ||
      correctAnswer === undefined ||
      !explanation ||
      !difficulty ||
      !subjectId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    try {
      // Mock question creation
      const newQuestion = {
        id: "question-" + Date.now(),
        question,
        options,
        correctAnswer,
        explanation,
        difficulty,
        subjectId,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: "Question created successfully.",
        data: newQuestion,
      });
    } catch (error) {
      console.error("Question creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create question.",
      });
    }
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
