// import axios from 'axios';

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   };
// };

// export const getJobs = async () => {
//   try {
//     const response = await axios.get(API_BASE_URL, getAuthHeaders());
//     return response.data.data.jobs || [];
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
//   }
// };

// export const createJob = async (jobData) => {
//   try {
//     const response = await axios.post(API_BASE_URL, jobData, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to create job');
//   }
// };

// export const deleteJob = async (jobId) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/${jobId}`, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to delete job');
//   }
// };

import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job'; // Adjust endpoint path

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'ngrok-skip-browser-warning': 'true',
    },
  };
};

export const getJobs = async () => {
  try {
    console.log('Authorization header:', getAuthHeaders());
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    return response.data.jobs || [];
  } catch (error) {
    console.error('Fetch jobs error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await axios.post(API_BASE_URL, jobData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create job');
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${jobId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete job');
  }
};
