const express = require("express");
const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Quiz Routes ---

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

module.exports = router;
