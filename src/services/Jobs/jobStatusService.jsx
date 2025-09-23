// services/Jobs/jobStatusService.js
import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    //   'ngrok-skip-browser-warning': 'true'
    }
  };
};

export const updateJobStatus = async (jobId, data) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/jobStatus/${jobId}/status`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error.response?.data || { message: 'Failed to update job status' };
  }
};

export const archiveJob = async (jobId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jobStatus/${jobId}/archive`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error archiving job:', error);
    throw error.response?.data || { message: 'Failed to archive job' };
  }
};

export const getJobsByStatus = async (status) => {
  try {
    const url = status ? `${API_BASE_URL}/jobStatus/status/${status}` : `${API_BASE_URL}/jobStatus/status`;
    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs by status:', error);
    throw error.response?.data || { message: 'Failed to fetch jobs by status' };
  }
};

export const getStatusHistory = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobStatus/${jobId}/status-history`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching status history:', error);
    throw error.response?.data || { message: 'Failed to fetch status history' };
  }
};