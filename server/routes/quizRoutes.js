const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const { requireUser } = require('./middleware/firebaseAuth');
const openRouterService = require('../services/openRouterService');

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


// --- Subject Routes ---

// GET /api/quiz/subjects - Get all quiz subjects
router.get('/subjects', asyncHandler(async (req, res) => {
  console.log('-> GET /api/quiz/subjects');
  const subjectsSnapshot = await db.collection('subjects').get();
  const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(`Found ${subjects.length} subjects.`);
  res.status(200).json({ success: true, data: { subjects } });
}));

// GET /api/quiz/subjects/:id - Get a single subject by ID
router.get('/subjects/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`-> GET /api/quiz/subjects/${id}`);
  const subjectDoc = await db.collection('subjects').doc(id).get();

  if (!subjectDoc.exists) {
    return res.status(404).json({ success: false, message: 'Subject not found.' });
  }

  res.status(200).json({ success: true, data: { subject: { id: subjectDoc.id, ...subjectDoc.data() } } });
}));


// --- Quiz Generation and Interaction ---

// POST /api/quiz/generate - Generate a new quiz using AI
router.post('/generate', requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { subject, difficulty, count = 5 } = req.body;
  console.log(`-> POST /api/quiz/generate for UID: ${uid}`);

  if (!subject || !difficulty) {
    return res.status(400).json({ success: false, message: 'Subject and difficulty are required.' });
  }

  // Check user's quiz-taking eligibility
  const userDocRef = db.collection('users').doc(uid);
  const userDoc = await userDocRef.get();
  const userData = userDoc.data();

  if (userData.subscriptionStatus !== 'premium') {
    const today = new Date().toDateString();
    const lastReset = new Date(userData.lastQuizResetDate).toDateString();
    if (today !== lastReset) {
      await userDocRef.update({ dailyQuizzesTaken: 0, lastQuizResetDate: new Date() });
      userData.dailyQuizzesTaken = 0;
    }
    if (userData.dailyQuizzesTaken >= userData.dailyQuizLimit) {
      return res.status(403).json({ success: false, message: 'Daily quiz limit reached. Upgrade to premium for unlimited quizzes.' });
    }
  }

  // Generate questions via AI service
  const questions = await openRouterService.generateQuizQuestions(subject, difficulty, count);
  
  const quizData = {
    userId: uid,
    subject,
    difficulty,
    questions,
    questionCount: questions.length,
    createdAt: new Date(),
    status: 'active'
  };

  const quizRef = await db.collection('quizzes').add(quizData);
  
  // Increment user's daily quiz count
  if (userData.subscriptionStatus !== 'premium') {
    await userDocRef.update({ dailyQuizzesTaken: admin.firestore.FieldValue.increment(1) });
  }

  console.log(`AI quiz generated with ID: ${quizRef.id}`);
  res.status(201).json({ success: true, data: { quiz: { id: quizRef.id, ...quizData } } });
}));

// POST /api/quiz/submit - Submit quiz answers and get results
router.post('/submit', requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { quizId, answers } = req.body;
  console.log(`-> POST /api/quiz/submit for UID: ${uid} and QuizID: ${quizId}`);

  if (!quizId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'Quiz ID and a valid answers array are required.' });
  }

  const quizDoc = await db.collection('quizzes').doc(quizId).get();
  if (!quizDoc.exists) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  const quizData = quizDoc.data();
  const questions = quizData.questions;
  let correctAnswers = 0;
  const results = questions.map((q, i) => {
    const isCorrect = answers[i] === q.correctAnswer;
    if (isCorrect) correctAnswers++;
    return { ...q, userAnswer: answers[i], isCorrect };
  });

  const score = Math.round((correctAnswers / questions.length) * 100);

  const resultData = {
    userId: uid,
    quizId,
    subject: quizData.subject,
    difficulty: quizData.difficulty,
    score,
    totalQuestions: questions.length,
    correctAnswers,
    answers: results,
    completedAt: new Date(),
  };

  const resultRef = await db.collection('quizResults').add(resultData);
  
  // Update user statistics
  const userRef = db.collection('users').doc(uid);
  await userRef.update({
    totalQuizzes: admin.firestore.FieldValue.increment(1),
    averageScore: admin.firestore.FieldValue.increment(score - (userRef.data.averageScore || 0)) / (userRef.data.totalQuizzes || 1), // Simplified avg score update
    lastStudyDate: new Date(),
    completedQuizzes: admin.firestore.FieldValue.arrayUnion({
      quizId: resultRef.id,
      subject: quizData.subject,
      score,
      completedAt: new Date(),
    }),
  });

  console.log(`Quiz ${quizId} submitted. Score: ${score}%`);
  res.status(200).json({ success: true, data: { result: { id: resultRef.id, ...resultData } } });
}));


// GET /api/quiz/history - Get the user's quiz history
router.get('/history', requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  console.log(`-> GET /api/quiz/history for UID: ${uid}`);

  const limit = parseInt(req.query.limit) || 20;
  const historySnapshot = await db.collection('quizResults')
    .where('userId', '==', uid)
    .orderBy('completedAt', 'desc')
    .limit(limit)
    .get();

  const history = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(`Found ${history.length} history records.`);
  res.status(200).json({ success: true, data: { history } });
}));


module.exports = router;
