const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const { requireUser } = require('./middleware/firebaseAuth');
const openRouterService = require('../services/openRouterService');

// Test endpoint without authentication for debugging
router.post('/test-subject', async (req, res) => {
  console.log('=== POST /api/quiz/test-subject (NO AUTH) ===');
  console.log('Request body:', req.body);

  try {
    const { name, description, avgTime } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Name and description are required',
        receivedBody: req.body
      });
    }

    const subjectData = {
      name: name.trim(),
      description: description.trim(),
      avgTime: avgTime || 15,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create subject in Firestore
    const subjectRef = await db.collection('subjects').add(subjectData);
    const subject = { id: subjectRef.id, ...subjectData };

    console.log('Test subject created successfully:', subject.id);
    res.status(201).json({
      message: 'Test subject created successfully',
      data: { subject }
    });
  } catch (error) {
    console.error('Error creating test subject:', error.message);
    res.status(400).json({
      error: error.message,
      receivedBody: req.body
    });
  }
});

// Subject routes
router.post('/subjects', requireUser, async (req, res) => {
  console.log('=== POST /api/quiz/subjects ===');
  console.log('Request body:', req.body);

  try {
    const { name, description, avgTime } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: 'Name and description are required'
      });
    }

    const subjectData = {
      name: name.trim(),
      description: description.trim(),
      avgTime: avgTime || 15,
      createdBy: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Try to generate AI description if OpenRouter is available
    try {
      const aiDescription = await openRouterService.generateSubjectDescription(name);
      subjectData.description = aiDescription;
    } catch (aiError) {
      console.log('AI description generation failed, using provided description');
    }

    // Create subject in Firestore
    const subjectRef = await db.collection('subjects').add(subjectData);
    const subject = { id: subjectRef.id, ...subjectData };

    console.log('Subject created successfully:', subject.id);
    res.status(201).json({
      message: 'Subject created successfully',
      data: { subject }
    });
  } catch (error) {
    console.error('Error creating subject:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

router.get('/subjects', async (req, res) => {
  console.log('=== GET /api/quiz/subjects ===');

  try {
    const subjectsSnapshot = await db.collection('subjects').get();
    const subjects = [];
    
    subjectsSnapshot.forEach(doc => {
      subjects.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Returning ${subjects.length} subjects`);
    res.json({
      message: 'Subjects retrieved successfully',
      data: { subjects }
    });
  } catch (error) {
    console.error('Error fetching subjects:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/subjects/:id', async (req, res) => {
  console.log('=== GET /api/quiz/subjects/:id ===');
  console.log('Subject ID:', req.params.id);

  try {
    const subjectDoc = await db.collection('subjects').doc(req.params.id).get();
    
    if (!subjectDoc.exists) {
      return res.status(404).json({
        error: 'Subject not found'
      });
    }

    const subject = { id: subjectDoc.id, ...subjectDoc.data() };
    console.log('Subject found:', subject.name);
    
    res.json({
      message: 'Subject retrieved successfully',
      data: { subject }
    });
  } catch (error) {
    console.error('Error fetching subject:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/subjects/:id', requireUser, async (req, res) => {
  console.log('=== PUT /api/quiz/subjects/:id ===');
  console.log('Subject ID:', req.params.id);
  console.log('Update data:', req.body);

  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection('subjects').doc(req.params.id).update(updateData);
    const subjectDoc = await db.collection('subjects').doc(req.params.id).get();
    const subject = { id: subjectDoc.id, ...subjectDoc.data() };

    console.log('Subject updated successfully');
    res.json({
      message: 'Subject updated successfully',
      data: { subject }
    });
  } catch (error) {
    console.error('Error updating subject:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

router.delete('/subjects/:id', requireUser, async (req, res) => {
  console.log('=== DELETE /api/quiz/subjects/:id ===');
  console.log('Subject ID:', req.params.id);

  try {
    await db.collection('subjects').doc(req.params.id).delete();

    console.log('Subject deleted successfully');
    res.json({
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Question routes
router.post('/questions', requireUser, async (req, res) => {
  console.log('=== POST /api/quiz/questions ===');
  console.log('Request body:', req.body);

  try {
    const { subject, difficulty, question, options, correctAnswer, explanation } = req.body;

    if (!subject || !difficulty || !question || !options || correctAnswer === undefined || !explanation) {
      return res.status(400).json({
        error: 'All fields are required: subject, difficulty, question, options, correctAnswer, explanation'
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Options must be an array with at least 2 items'
      });
    }

    if (correctAnswer < 0 || correctAnswer >= options.length) {
      return res.status(400).json({
        error: 'Correct answer index must be within options range'
      });
    }

    const questionData = {
      subject,
      difficulty: difficulty.toLowerCase(),
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer,
      explanation: explanation.trim(),
      createdBy: req.user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create question in Firestore
    const questionRef = await db.collection('questions').add(questionData);
    const newQuestion = { id: questionRef.id, ...questionData };

    console.log('Question created successfully:', newQuestion.id);
    res.status(201).json({
      message: 'Question created successfully',
      data: { question: newQuestion }
    });
  } catch (error) {
    console.error('Error creating question:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

router.get('/subjects/:subjectId/questions', async (req, res) => {
  console.log('=== GET /api/quiz/subjects/:subjectId/questions ===');
  console.log('Subject ID:', req.params.subjectId);
  console.log('Difficulty filter:', req.query.difficulty);

  try {
    let query = db.collection('questions').where('subject', '==', req.params.subjectId);
    
    if (req.query.difficulty) {
      query = query.where('difficulty', '==', req.query.difficulty.toLowerCase());
    }

    const questionsSnapshot = await query.get();
    const questions = [];
    
    questionsSnapshot.forEach(doc => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Returning ${questions.length} questions`);
    res.json({
      message: 'Questions retrieved successfully',
      data: { questions }
    });
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/questions/:id', async (req, res) => {
  console.log('=== GET /api/quiz/questions/:id ===');
  console.log('Question ID:', req.params.id);

  try {
    const questionDoc = await db.collection('questions').doc(req.params.id).get();
    
    if (!questionDoc.exists) {
      return res.status(404).json({
        error: 'Question not found'
      });
    }

    const question = { id: questionDoc.id, ...questionDoc.data() };
    console.log('Question found');
    
    res.json({
      message: 'Question retrieved successfully',
      data: { question }
    });
  } catch (error) {
    console.error('Error fetching question:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

router.put('/questions/:id', requireUser, async (req, res) => {
  console.log('=== PUT /api/quiz/questions/:id ===');
  console.log('Question ID:', req.params.id);
  console.log('Update data:', req.body);

  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await db.collection('questions').doc(req.params.id).update(updateData);
    const questionDoc = await db.collection('questions').doc(req.params.id).get();
    const question = { id: questionDoc.id, ...questionDoc.data() };

    console.log('Question updated successfully');
    res.json({
      message: 'Question updated successfully',
      data: { question }
    });
  } catch (error) {
    console.error('Error updating question:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

router.delete('/questions/:id', requireUser, async (req, res) => {
  console.log('=== DELETE /api/quiz/questions/:id ===');
  console.log('Question ID:', req.params.id);

  try {
    await db.collection('questions').doc(req.params.id).delete();

    console.log('Question deleted successfully');
    res.json({
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// NEW: AI-powered quiz generation endpoint
router.post('/generate', requireUser, async (req, res) => {
  console.log('=== POST /api/quiz/generate ===');
  console.log('Request body:', req.body);

  try {
    const { subject, difficulty, count = 5 } = req.body;

    if (!subject || !difficulty) {
      return res.status(400).json({
        error: 'Subject and difficulty are required'
      });
    }

    // Check if user can take quiz (freemium limits)
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    if (userData.subscriptionStatus === 'freemium') {
      // Reset daily count if needed
      const today = new Date();
      const lastReset = new Date(userData.lastQuizResetDate);
      
      if (today.toDateString() !== lastReset.toDateString()) {
        await db.collection('users').doc(req.user.uid).update({
          dailyQuizzesTaken: 0,
          lastQuizResetDate: today
        });
        userData.dailyQuizzesTaken = 0;
      }
      
      if (userData.dailyQuizzesTaken >= userData.dailyQuizLimit) {
        return res.status(403).json({
          error: 'Daily quiz limit reached. Upgrade to premium for unlimited quizzes.'
        });
      }
    }

    // Generate quiz using OpenRouter AI
    const questions = await openRouterService.generateQuizQuestions(subject, difficulty, count);

    // Create quiz session in Firestore
    const quizData = {
      userId: req.user.uid,
      subject,
      difficulty,
      questions,
      questionCount: questions.length,
      createdAt: new Date(),
      status: 'active'
    };

    const quizRef = await db.collection('quizzes').add(quizData);
    const quiz = { id: quizRef.id, ...quizData };

    // Update user's daily quiz count
    await db.collection('users').doc(req.user.uid).update({
      dailyQuizzesTaken: userData.dailyQuizzesTaken + 1
    });

    console.log('AI quiz generated successfully:', quiz.id);
    res.json({
      message: 'Quiz generated successfully',
      data: { quiz }
    });
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// NEW: AI-powered answer explanation endpoint
router.post('/explain', requireUser, async (req, res) => {
  console.log('=== POST /api/quiz/explain ===');
  console.log('Request body:', req.body);

  try {
    const { question, userAnswer, correctAnswer, explanation } = req.body;

    if (!question || userAnswer === undefined || correctAnswer === undefined || !explanation) {
      return res.status(400).json({
        error: 'All fields are required: question, userAnswer, correctAnswer, explanation'
      });
    }

    // Generate enhanced explanation using OpenRouter AI
    const enhancedExplanation = await openRouterService.explainAnswer(
      question, 
      userAnswer, 
      correctAnswer, 
      explanation
    );

    console.log('Answer explanation generated successfully');
    res.json({
      message: 'Answer explanation generated successfully',
      data: { 
        explanation: enhancedExplanation,
        originalExplanation: explanation
      }
    });
  } catch (error) {
    console.error('Error generating explanation:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Quiz selection route - creates a quiz session and returns quiz ID
router.post('/subjects/:subjectId/select', async (req, res) => {
  console.log('=== POST /api/quiz/subjects/:subjectId/select ===');
  console.log('Subject ID:', req.params.subjectId);
  console.log('Request body:', req.body);

  try {
    const { difficulty, questionCount = 10 } = req.body;

    if (!difficulty) {
      return res.status(400).json({
        error: 'Difficulty level is required'
      });
    }

    // Verify subject exists
    const subjectDoc = await db.collection('subjects').doc(req.params.subjectId).get();
    
    if (!subjectDoc.exists) {
      return res.status(404).json({
        error: 'Subject not found'
      });
    }

    const subject = { id: subjectDoc.id, ...subjectDoc.data() };

    // Get questions for this subject and difficulty
    let query = db.collection('questions').where('subject', '==', req.params.subjectId);
    query = query.where('difficulty', '==', difficulty.toLowerCase());
    
    const questionsSnapshot = await query.limit(parseInt(questionCount)).get();
    const questions = [];
    
    questionsSnapshot.forEach(doc => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    // If not enough questions, generate some with AI
    if (questions.length < questionCount) {
      try {
        const aiQuestions = await openRouterService.generateQuizQuestions(
          subject.name, 
          difficulty, 
          questionCount - questions.length
        );
        
        // Add AI questions to the array
        questions.push(...aiQuestions);
      } catch (aiError) {
        console.log('AI question generation failed, using available questions only');
      }
    }

    // Create quiz session
    const quizData = {
      subjectId: req.params.subjectId,
      subject: subject.name,
      difficulty,
      questions: questions.slice(0, questionCount),
      questionCount: Math.min(questions.length, questionCount),
      createdAt: new Date(),
      status: 'active'
    };

    const quizRef = await db.collection('quizzes').add(quizData);
    const quiz = { id: quizRef.id, ...quizData };

    console.log('Quiz selected/created successfully with ID:', quiz.id);
    res.json({
      message: 'Quiz selected successfully',
      data: {
        quizId: quiz.id,
        subject: subject.name,
        difficulty: difficulty,
        questionCount: quiz.questions.length
      }
    });
  } catch (error) {
    console.error('Error selecting quiz:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Quiz generation route
router.get('/:subject/:difficulty', async (req, res) => {
  console.log('=== GET /api/quiz/:subject/:difficulty ===');
  console.log('Subject:', req.params.subject);
  console.log('Difficulty:', req.params.difficulty);

  try {
    // Find subject by name
    const subjectsSnapshot = await db.collection('subjects').get();
    const subjects = [];
    
    subjectsSnapshot.forEach(doc => {
      subjects.push({ id: doc.id, ...doc.data() });
    });
    
    const subject = subjects.find(s =>
      s.name.toLowerCase() === req.params.subject.toLowerCase()
    );

    if (!subject) {
      return res.status(404).json({
        error: 'Subject not found'
      });
    }

    // Get questions for this subject and difficulty
    let query = db.collection('questions').where('subject', '==', subject.id);
    query = query.where('difficulty', '==', req.params.difficulty.toLowerCase());
    
    const questionsSnapshot = await query.limit(parseInt(req.query.count) || 10).get();
    const questions = [];
    
    questionsSnapshot.forEach(doc => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    const quiz = {
      subject: subject.name,
      difficulty: req.params.difficulty,
      questions,
      questionCount: questions.length
    };

    console.log('Quiz generated successfully');
    res.json({
      message: 'Quiz generated successfully',
      data: { quiz }
    });
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Submit quiz answers and get results
router.post('/submit', requireUser, async (req, res) => {
  console.log('=== POST /api/quiz/submit ===');
  console.log('User ID:', req.user.uid);
  console.log('Request body:', req.body);

  try {
    const { quizId, answers, timeTaken, subject, difficulty } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: 'Quiz ID and answers array are required'
      });
    }

    if (answers.length === 0) {
      return res.status(400).json({
        error: 'At least one answer is required'
      });
    }

    // Get quiz data
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    
    if (!quizDoc.exists) {
      return res.status(404).json({
        error: 'Quiz not found'
      });
    }

    const quizData = quizDoc.data();
    const questions = quizData.questions;

    // Calculate results
    let correctAnswers = 0;
    const results = [];

    answers.forEach((answer, index) => {
      if (index < questions.length) {
        const isCorrect = answer === questions[index].correctAnswer;
        if (isCorrect) correctAnswers++;
        
        results.push({
          questionId: questions[index]._id || questions[index].id,
          question: questions[index].question,
          userAnswer: answer,
          correctAnswer: questions[index].correctAnswer,
          isCorrect,
          explanation: questions[index].explanation
        });
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    // Create quiz result
    const resultData = {
      userId: req.user.uid,
      quizId,
      subject,
      difficulty,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken: timeTaken || 0,
      answers: results,
      completedAt: new Date()
    };

    const resultRef = await db.collection('quizResults').add(resultData);
    const result = { id: resultRef.id, ...resultData };

    // Update user stats
    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update({
      totalQuizzes: admin.firestore.FieldValue.increment(1),
      lastStudyDate: new Date()
    });

    // Add to completed quizzes array
    const completedQuiz = {
      quizId: result.id,
      subject,
      difficulty,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      completedAt: new Date()
    };

    await userRef.update({
      completedQuizzes: admin.firestore.FieldValue.arrayUnion(completedQuiz)
    });

    console.log('Quiz submitted successfully - Score:', result.score + '%');
    res.json({
      message: 'Quiz submitted successfully',
      data: { result }
    });
  } catch (error) {
    console.error('Error submitting quiz:', error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get quiz history for the authenticated user
router.get('/history', requireUser, async (req, res) => {
  console.log('=== GET /api/quiz/history ===');
  console.log('User ID:', req.user.uid);

  try {
    const limit = parseInt(req.query.limit) || 50;
    const historySnapshot = await db.collection('quizResults')
      .where('userId', '==', req.user.uid)
      .orderBy('completedAt', 'desc')
      .limit(limit)
      .get();

    const history = [];
    historySnapshot.forEach(doc => {
      history.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Returning ${history.length} quiz history records`);
    res.json({
      message: 'Quiz history retrieved successfully',
      data: { history }
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;