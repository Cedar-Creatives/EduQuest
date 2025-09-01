import api from './api';

// Description: Cancel user subscription
// Endpoint: POST /api/users/cancel-subscription
// Request: {}
// Response: { success: boolean, message: string, user: { subscriptionStatus: string, subscriptionState: string, subscriptionEndDate: string, subscriptionCancelledAt: string } }
export const cancelSubscription = async () => {
  try {
    return await api.post('/api/users/cancel-subscription');
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}

// Description: Get subscription details
// Endpoint: GET /api/users/subscription
// Request: {}
// Response: { success: boolean, subscription: { status: string, plan: string, startDate: string, endDate: string, nextBilling: string, amount: number, state: string, dailyQuizLimit: number, dailyQuizzesTaken: number, canTakeMoreQuizzes: boolean, features: object } }
export const getSubscriptionDetails = async () => {
  try {
    const response = await api.get('/api/users/subscription');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
}