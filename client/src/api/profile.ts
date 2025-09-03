import api from './api';

// Description: Get user profile information
// Endpoint: GET /api/users/profile
// Request: {}
// Response: { success: boolean, profile: { username: string, email: string, bio: string, role: string, plan: string, joinedDate: string, avatar: string, stats: { totalQuizzes: number, averageScore: number, studyStreak: number, achievements: number }, subjectStats: Array<{ name: string, score: number }>, recentActivity: Array<{ action: string, date: string, score: number }>, nextBilling?: string, dailyQuizLimit: number, dailyQuizzesTaken: number, canTakeMoreQuizzes: boolean } }
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Update user profile information
// Endpoint: PUT /api/users/profile
// Request: { username: string, email: string, bio: string, plan?: string }
// Response: { success: boolean, message: string, user: { username: string, email: string, bio: string, plan: string } }
export const updateProfile = async (data: { username: string; email: string; bio: string; plan?: string }) => {
  console.log('=== API UPDATE PROFILE CALL ===')
  console.log('Data being sent to API:', data)
  
  try {
    console.log('Making PUT request to /api/users/profile')
    const response = await api.put('/api/users/profile', data);
    console.log('API response received:', response)
    console.log('Response data:', response.data)
    return response.data;
  } catch (error: any) {
    console.error('=== API UPDATE PROFILE ERROR ===')
    console.error('Error in updateProfile API call:', error)
    console.error('Error response:', error.response)
    console.error('Error response data:', error.response?.data)
    console.error('Error response status:', error.response?.status)
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Complete user onboarding
// Endpoint: PUT /api/users/profile
// Request: { onboardingData: any, onboardingCompleted: boolean, plan: string }
// Response: { success: boolean, message: string }
export const completeOnboardingProfile = async (data: { onboardingData: any, onboardingCompleted: boolean, plan: string }) => {
  try {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}