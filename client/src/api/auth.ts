import api from './api';

// Description: User login
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, message: string, data: { user: object, accessToken: string, refreshToken: string } }
export const login = async (data: { email: string; password: string }) => {
  console.log('=== AUTH API LOGIN START ===')
  console.log('Login API called with email:', data.email)
  
  try {
    console.log('Making POST request to /api/auth/login...')
    const response = await api.post('/api/auth/login', data);
    console.log('Login API response received:', response)
    console.log('Response status:', response.status)
    console.log('Response data:', response.data)
    
    return response.data;
  } catch (error: any) {
    console.error('=== AUTH API LOGIN ERROR ===')
    console.error('Login API error:', error)
    console.error('Error response:', error.response)
    console.error('Error response data:', error.response?.data)
    console.error('Error response status:', error.response?.status)
    
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: User registration
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string, username: string }
// Response: { success: boolean, message: string, data: { user: object, accessToken: string } }
export const register = async (data: { email: string; password: string; username: string }) => {
  console.log('=== AUTH API REGISTER START ===')
  console.log('Register API called with email:', data.email, 'username:', data.username)
  
  try {
    console.log('Making POST request to /api/auth/register...')
    const response = await api.post('/api/auth/register', data);
    console.log('Register API response received:', response)
    console.log('Response status:', response.status)
    console.log('Response data:', response.data)
    
    return response.data;
  } catch (error: any) {
    console.error('=== AUTH API REGISTER ERROR ===')
    console.error('Register API error:', error)
    console.error('Error response:', error.response)
    console.error('Error response data:', error.response?.data)
    
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: User logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  console.log('=== AUTH API LOGOUT START ===')
  
  try {
    console.log('Making POST request to /api/auth/logout...')
    const response = await api.post('/api/auth/logout');
    console.log('Logout API response received:', response)
    
    return response.data;
  } catch (error: any) {
    console.error('=== AUTH API LOGOUT ERROR ===')
    console.error('Logout API error:', error)
    
    throw new Error(error?.response?.data?.message || error.message);
  }
};