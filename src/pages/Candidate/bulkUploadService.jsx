// src/services/Candidates/bulkUploadService.js
import axios from 'axios';

const API_URL = "https://ungroupable-appallingly-bryan.ngrok-free.dev"
;

// Download Excel template
export const downloadTemplate = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/candidates/template`, {
      responseType: 'blob'
    });
    
    // Create a blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'candidate_upload_template.xlsx');
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading template:', error);
    throw new Error(error.response?.data?.message || 'Failed to download template');
  }
};

// Upload Excel file for bulk candidate creation
export const bulkUploadCandidates = async (file, jobId = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (jobId) {
      formData.append('jobId', jobId);
    }

    const response = await axios.post(`${API_URL}/api/v1/candidates/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading bulk candidates:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload candidates');
  }
};

// Get upload status
export const getBulkUploadStatus = async (uploadId) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/candidates/upload-status/${uploadId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting upload status:', error);
    throw new Error(error.response?.data?.message || 'Failed to get upload status');
  }
};