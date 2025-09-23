// services/jobStatusService.js
import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/jobStatus';


const token=localStorage.getItem('token')
const getAuthHeaders = () => {
  return {
    headers: {
       Authorization:`Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  };
};

export const updateJobStatus = async (jobId, newStatus, reason = '') => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${jobId}/status`,
      { newStatus, reason },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const archiveJob = async (jobId, reason) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${jobId}/archive`,
      { reason },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error archiving job:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const getStatusHistory = async (jobId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${jobId}/status-history`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching status history:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const getJobsByStatus = async (status = 'all', filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (status && status !== 'all') {
      params.append('status', status);
    }
    
    // Add filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/status?${queryString}` : `${API_BASE_URL}/status`;
    
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs by status:', error.response || error);
    throw error.response?.data || error.message;
  }
};