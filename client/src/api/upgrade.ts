import api from './api';

// Description: Upgrade user to premium subscription
// Endpoint: POST /api/users/upgrade
// Request: { plan: string }
// Response: { success: boolean, message: string, user: { subscriptionStatus: string, subscriptionStartDate: string, subscriptionEndDate: string } }
export const upgradeToPremium = async (data: { plan: string }) => {
  console.log('=== UPGRADE API CALL START ===')
  console.log('Upgrade data being sent:', data)
  console.log('Making POST request to /api/users/upgrade')
  
  try {
    const response = await api.post('/api/users/upgrade', data);
    console.log('=== UPGRADE API CALL SUCCESS ===')
    console.log('API response received:', response)
    console.log('Response data:', response.data)
    return response.data;
  } catch (error: any) {
    console.error('=== UPGRADE API CALL ERROR ===')
    console.error('Error in upgradeToPremium API call:', error)
    console.error('Error response:', error.response)
    console.error('Error response data:', error.response?.data)
    console.error('Error response status:', error.response?.status)
    console.error('Error config:', error.config)
    throw new Error(error?.response?.data?.message || error.message);
  }
}