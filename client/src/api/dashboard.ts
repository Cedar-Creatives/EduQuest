import api from './api';

// Description: Get dashboard data including stats, recent quizzes, and achievements
// Endpoint: GET /api/dashboard
// Request: {}
// Response: { stats: { quizzesCompleted: number, averageScore: number, studyStreak: number, achievements: number }, recentQuizzes: Array<{ subject: string, difficulty: string, score: number, date: string }>, achievements: Array<{ title: string, description: string }>, dailyQuizzesUsed: number, studyTimeToday: number, weeklyProgress: number }
export const getDashboardData = async () => {
  try {
    console.log('Fetching dashboard data from API...');
    const response = await api.get('/api/dashboard');
    console.log('Dashboard API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(error?.response?.data?.message || error.message);
  }
}