

// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const inviteVendor = async (email) => {
  return await api.post('/vendor/invite', { email });
};