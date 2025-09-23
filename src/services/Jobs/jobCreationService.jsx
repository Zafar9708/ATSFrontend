// import axios from 'axios';

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   };
// };

// export const createJob = async (jobData) => {
//   try {
//     // Pass jobData in POST body, and attach Authorization headers
//     const response = await axios.post(API_BASE_URL, jobData, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to create job');
//   }
// };

// services/Jobs/jobCreationService.js
import axios from 'axios';

const API_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const createJob = async (jobData) => {
  try {
    console.log('Creating job with data:', jobData);
    const response = await api.post('/job', jobData);
    console.log('Job created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { error: 'Failed to create job' };
  }
};

export const updateJob = async (id, jobData) => {
  try {
    console.log('Updating job:', id, jobData);
    const response = await api.put(`/jobs/${id}`, jobData);
    console.log('Job updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating job:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { error: 'Failed to update job' };
  }
};

export const fetchJobDetails = async (id) => {
  try {
    console.log('Fetching job details:', id);
    const response = await api.get(`/jobs/${id}`);
    console.log('Job details fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { error: 'Failed to fetch job details' };
  }
};