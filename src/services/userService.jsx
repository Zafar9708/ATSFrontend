import axios from 'axios';

const API_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/auth';

const userApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Add auth interceptor
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  async getUserDetails() {
    try {
      const response = await userApi.get('/user-details');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }
    
    // Use the API endpoint to get user details instead of decoding token
    const response = await authApi.get('/user-details');
    console.log('User details from API:', response.data);
    
    return response.data.user || response.data;
  } catch (error) {
    console.error('Error getting current user from API:', error);
    
    // Fallback: try to decode token if API fails
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Fallback - decoded token payload:', payload);
        return {
          _id: payload.id,
          email: payload.email,
          role: payload.role,
          username: payload.username,
          tenantId: payload.tenantId
        };
      }
    } catch (decodeError) {
      console.error('Error decoding token:', decodeError);
    }
    
    return null;
  }
};