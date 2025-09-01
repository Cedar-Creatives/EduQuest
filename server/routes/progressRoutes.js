
```javascript
const express = require('express');
const router = express.Router();
const { firestore } = require('../config/firebase');

// Import authentication middleware
const path = require('path');
const middlewarePath = path.join(__dirname, 'middleware', 'firebaseAuth.js');
let requireUser;

try {
  const authMiddleware = require(middlewarePath);
  requireUser = authMiddleware.requireUser || authMiddleware;
} catch (error) {
  console.log('Firebase auth middleware not found, using mock auth');
  // Mock auth middleware for development
  requireUser = (req, res, next) => {
    req.user = { uid: 'test-user-123' };
    next();
  };
}

// Get comprehensive progress data
router.get('/progress', requireUser, async (req, res) => {
  try {
    console.log("=== FETCHING PROGRESS DATA ===");
    console.log("User ID:", req.user.uid);

    const userId = req.user.uid;

    // Get user profile
    const userDoc = await firestore.collection('users').doc(userId).get();
    const user = userDoc.exists ? userDoc.data() : {};

    // Get all quiz attempts
    const quizAttemptsSnapshot = await firestore
      .collection('quizAttempts')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const quizAttempts = quizAttemptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));

    // Calculate overall statistics
    const totalQuizzes = quizAttempts.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / totalQuizzes)
      : 0;

    // Calculate study time (estimate based on quiz completion times)
    const totalStudyTime = quizAttempts.reduce((sum, attempt) => 
      sum + (attempt.totalTimeSpent || 0), 0
    );

    // Calculate current study streak
    const studyStreak = calculateStudyStreak(quizAttempts);

    // Group by subjects
    const subjectStats = {};
    quizAttempts.forEach(attempt => {
      const subject = attempt.subject || 'Unknown';
      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          name: subject,
          quizzesTaken: 0,
          totalScore: 0,
          scores: [],
          lastTaken: null
        };
      }
      
      subjectStats[subject].quizzesTaken++;
      subjectStats[subject].totalScore += attempt.score || 0;
      subjectStats[subject].scores.push(attempt.score || 0);
      
      if (!subjectStats[subject].lastTaken || attempt.timestamp > subjectStats[subject].lastTaken) {
        subjectStats[subject].lastTaken = attempt.timestamp;
      }
    });

    // Process subject data
    const subjects = Object.values(subjectStats).map(subject => ({
      name: subject.name,
      quizzesTaken: subject.quizzesTaken,
      averageScore: Math.round(subject.totalScore / subject.quizzesTaken),
      improvement: calculateImprovement(subject.scores),
      lastTaken: subject.lastTaken ? subject.lastTaken.toLocaleDateString() : 'Never'
    }));

    // Generate weekly progress data
    const weeklyProgress = generateWeeklyProgress(quizAttempts);

    // Get achievements
    const achievements = await getUnlockedAchievements(userId, {
      totalQuizzes,
      averageScore,
      studyStreak,
      subjects
    });

    // Generate insights
    const insights = generateInsights(subjects, quizAttempts);

    const progressData = {
      overall: {
        totalQuizzes,
        averageScore,
        studyStreak,
        totalStudyTime
      },
      subjects: subjects.sort((a, b) => b.averageScore - a.averageScore),
      weekly: weeklyProgress,
      achievements,
      streaks: {
        current: studyStreak,
        longest: user.longestStreak || studyStreak,
        weeklyGoal: user.weeklyGoal || 10,
        monthlyGoal: user.monthlyGoal || 40
      },
      insights
    };

    console.log("Progress data prepared:", {
      userId,
      totalQuizzes,
      averageScore,
      studyStreak,
      subjectsCount: subjects.length,
      achievementsCount: achievements.length
    });

    res.json(progressData);
  } catch (error) {
    console.error("=== PROGRESS DATA FETCH ERROR ===");
    console.error("Error fetching progress data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress data"
    });
  }
});

// Helper function to calculate study streak
function calculateStudyStreak(quizAttempts) {
  if (quizAttempts.length === 0) return 0;

  const today = new Date();
  const sortedAttempts = quizAttempts.sort((a, b) => b.timestamp - a.timestamp);
  
  let streak = 0;
  let currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) { // Check last 30 days
    const dayAttempts = sortedAttempts.filter(attempt => {
      const attemptDate = new Date(attempt.timestamp);
      attemptDate.setHours(0, 0, 0, 0);
      return attemptDate.getTime() === currentDate.getTime();
    });

    if (dayAttempts.length > 0) {
      streak++;
    } else if (streak > 0) {
      break; // Streak is broken
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

// Helper function to calculate improvement
function calculateImprovement(scores) {
  if (scores.length < 2) return 0;
  
  const recent = scores.slice(-3); // Last 3 attempts
  const older = scores.slice(0, -3); // Earlier attempts
  
  if (older.length === 0) return 0;
  
  const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
  const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;
  
  return Math.round(recentAvg - olderAvg);
}

// Helper function to generate weekly progress
function generateWeeklyProgress(quizAttempts) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekData = days.map(day => ({
    day,
    quizzes: 0,
    avgScore: 0,
    studyTime: 0
  }));

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentAttempts = quizAttempts.filter(attempt => 
    attempt.timestamp >= oneWeekAgo
  );

  recentAttempts.forEach(attempt => {
    const dayIndex = attempt.timestamp.getDay();
    weekData[dayIndex].quizzes++;
    weekData[dayIndex].studyTime += attempt.totalTimeSpent || 0;
  });

  // Calculate average scores
  weekData.forEach((day, index) => {
    const dayAttempts = recentAttempts.filter(attempt => 
      attempt.timestamp.getDay() === index
    );
    
    if (dayAttempts.length > 0) {
      day.avgScore = Math.round(
        dayAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / dayAttempts.length
      );
    }
  });

  return weekData;
}

// Helper function to get unlocked achievements
async function getUnlockedAchievements(userId, stats) {
  const achievements = [];
  
  // Define achievement criteria
  const achievementDefinitions = [
    {
      id: 'first_quiz',
      title: 'Getting Started',
      description: 'Completed your first quiz',
      rarity: 'common',
      criteria: (stats) => stats.totalQuizzes >= 1
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Completed 10 quizzes',
      rarity: 'rare',
      criteria: (stats) => stats.totalQuizzes >= 10
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Achieved 90%+ average score',
      rarity: 'epic',
      criteria: (stats) => stats.averageScore >= 90
    },
    {
      id: 'streak_warrior',
      title: 'Streak Warrior',
      description: 'Maintained a 7-day study streak',
      rarity: 'epic',
      criteria: (stats) => stats.studyStreak >= 7
    },
    {
      id: 'subject_expert',
      title: 'Subject Expert',
      description: 'Mastered a subject with 95%+ average',
      rarity: 'legendary',
      criteria: (stats) => stats.subjects.some(s => s.averageScore >= 95)
    }
  ];

  // Check which achievements are unlocked
  for (const def of achievementDefinitions) {
    if (def.criteria(stats)) {
      achievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        rarity: def.rarity,
        unlockedAt: new Date().toISOString() // In real app, track actual unlock date
      });
    }
  }

  return achievements;
}

// Helper function to generate insights
function generateInsights(subjects, quizAttempts) {
  if (subjects.length === 0) {
    return {
      strongestSubject: 'None yet',
      weakestSubject: 'None yet',
      bestTimeOfDay: 'Unknown',
      recommendedFocus: ['Complete more quizzes for insights']
    };
  }

  const strongestSubject = subjects.reduce((best, current) => 
    current.averageScore > best.averageScore ? current : best
  ).name;

  const weakestSubject = subjects.reduce((worst, current) => 
    current.averageScore < worst.averageScore ? current : worst
  ).name;

  // Analyze best time of day (simplified)
  const timeAnalysis = {};
  quizAttempts.forEach(attempt => {
    const hour = attempt.timestamp.getHours();
    let timeSlot;
    if (hour < 6) timeSlot = 'Late Night';
    else if (hour < 12) timeSlot = 'Morning';
    else if (hour < 18) timeSlot = 'Afternoon';
    else timeSlot = 'Evening';

    if (!timeAnalysis[timeSlot]) {
      timeAnalysis[timeSlot] = { attempts: 0, totalScore: 0 };
    }
    timeAnalysis[timeSlot].attempts++;
    timeAnalysis[timeSlot].totalScore += attempt.score || 0;
  });

  const bestTimeOfDay = Object.entries(timeAnalysis)
    .map(([time, data]) => ({
      time,
      avgScore: data.totalScore / data.attempts
    }))
    .sort((a, b) => b.avgScore - a.avgScore)[0]?.time || 'Morning';

  // Generate recommendations
  const recommendations = [];
  if (subjects.some(s => s.averageScore < 60)) {
    recommendations.push('Focus on weak subjects');
  }
  if (quizAttempts.length < 5) {
    recommendations.push('Take more practice quizzes');
  }
  recommendations.push(`Study during ${bestTimeOfDay.toLowerCase()}`);
  recommendations.push('Review missed questions');

  return {
    strongestSubject,
    weakestSubject,
    bestTimeOfDay,
    recommendedFocus: recommendations
  };
}

module.exports = router;
```
