import axios from "axios";
import { auth } from "@/config/firebase";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", // Corrected Port
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting Firebase ID token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Only sign out on specific auth-related 401 errors, not all 401s
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      
      // Only sign out if it's specifically a token expiration or invalid token
      if (errorMessage.includes('token expired') || 
          errorMessage.includes('invalid token') ||
          errorMessage.includes('Token has expired')) {
        console.log("Firebase token expired, signing out user");
        await auth.signOut();
      } else {
        // For other 401 errors (like wrong credentials), just log but don't sign out
        console.log("401 error but not token-related:", errorMessage);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
