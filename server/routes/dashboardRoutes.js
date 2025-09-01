const express = require("express");
const { requireUser } = require("./middleware/firebaseAuth.js");
const { db } = require("../config/firebase");

const router = express.Router();

// --- Utility for consistent error handling ---
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Helper Functions ---

/**
 * Fetches and prepares user data, handling subscription status and daily quiz resets.
 * @param {string} uid - The user's unique ID.
 * @returns {object|null} - The user data object or null if not found.
 */
const getUserData = async (uid) => {
  const userDocRef = db.collection("users").doc(uid);
  const userDoc = await userDocRef.get();

  if (!userDoc.exists) {
    console.warn(`User document not found for UID: ${uid}`);
    return null;
  }

  let user = userDoc.data();
  const today = new Date();

  // Check for subscription expiry
  if (user.subscriptionStatus === "premium" && user.subscriptionEndDate && today > new Date(user.subscriptionEndDate)) {
    console.log(`Subscription for user ${uid} has expired. Downgrading.`);
    await userDocRef.update({
      plan: "freemium",
      subscriptionStatus: "freemium",
      subscriptionState: "expired",
      dailyQuizLimit: 3,
    });
    // Re-fetch user data to reflect the downgrade
    const updatedUserDoc = await userDocRef.get();
    user = updatedUserDoc.data();
  }

  // Reset daily quiz count if it's a new day
  if (user.lastQuizResetDate && today.toDateString() !== new Date(user.lastQuizResetDate).toDateString()) {
    console.log(`Resetting daily quiz count for user ${uid}.`);
    await userDocRef.update({
      dailyQuizzesTaken: 0,
      lastQuizResetDate: today,
    });
    user.dailyQuizzesTaken = 0;
  }

  return user;
};

/**
 * Calculates recent quizzes from user data.
 * @param {object} user - The user data object.
 * @returns {Array} - An array of recent quiz objects.
 */
const getRecentQuizzes = (user) => {
  if (!user.completedQuizzes || user.completedQuizzes.length === 0) {
    return [];
  }
  return user.completedQuizzes
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 3)
    .map((quiz) => ({
      subject: quiz.subject.charAt(0).toUpperCase() + quiz.subject.slice(1),
      difficulty: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1),
      score: quiz.score,
      date: formatTimeAgo(quiz.completedAt),
    }));
};

/**
 * Determines user achievements based on their stats.
 * @param {object} user - The user data object.
 * @returns {Array} - An array of achievement objects.
 */
const getAchievements = (user) => {
  const achievements = [];
  if ((user.totalQuizzes || 0) >= 20) {
    achievements.push({ title: "Quiz Master", description: "Completed 20 quizzes" });
  }
  if (user.completedQuizzes && user.completedQuizzes.some((quiz) => quiz.score === 100)) {
    achievements.push({ title: "Perfect Score", description: "Got 100% on a quiz" });
  }
  if ((user.studyStreak || 0) >= 5) {
    achievements.push({ title: "Study Streak", description: `${user.studyStreak} days in a row` });
  }
  return achievements;
};

/**
 * Formats a date to a human-readable "time ago" string.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted time ago string.
 */
const formatTimeAgo = (date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
};

// --- Dashboard Route ---

// GET /api/dashboard - Get aggregated dashboard data
router.get("/", requireUser, asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  console.log(`-> GET /api/dashboard for UID: ${uid}`);

  const user = await getUserData(uid);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const recentQuizzes = getRecentQuizzes(user);
  const achievements = getAchievements(user);

  // Mock data for weekly progress and study time
  const weeklyQuizzes = user.completedQuizzes ? user.completedQuizzes.filter(q => new Date(q.completedAt) >= new Date(new Date().setDate(new Date().getDate() - 7))).length : 0;
  const weeklyProgress = Math.min((weeklyQuizzes / 7) * 100, 100);

  const dashboardData = {
    stats: {
      quizzesCompleted: user.totalQuizzes || 0,
      averageScore: user.averageScore || 0,
      studyStreak: user.studyStreak || 0,
      achievements: achievements.length,
    },
    recentQuizzes,
    achievements,
    dailyQuizzesUsed: user.dailyQuizzesTaken || 0,
    studyTimeToday: (user.dailyQuizzesTaken || 0) * 15, // Mock value
    weeklyProgress: Math.round(weeklyProgress),
  };

  console.log(`Successfully prepared dashboard data for UID: ${uid}`);
  res.status(200).json({ success: true, data: dashboardData });
}));

module.exports = router;
