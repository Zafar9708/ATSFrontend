// // src/services/Candidates/bulkUploadService.js
// import axios from 'axios';

// const API_URL = "https://f0937721124b.ngrok-free.app";

// // Download Excel template
// export const downloadTemplate = async () => {
//   try {
//     const token=localStorage.getItem('token')
//     const response = await axios.get(`${API_URL}/api/v1/candidates/download/template`, {
//         headers:{
//              Authorization:`Bearer ${token}`,
//              responseType: 'blob',
//              'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

//         }
     
//     });
    
//     // Create a blob from the response
//     const blob = new Blob([response.data], {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     });
    
//     // Create download link
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'candidate_upload_template.xlsx');
//     document.body.appendChild(link);
//     link.click();
    
//     // Clean up
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(link);
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error downloading template:', error);
//     throw new Error(error.response?.data?.message || 'Failed to download template');
//   }
// };

// // Upload Excel file for bulk candidate creation
// export const bulkUploadCandidates = async (file, jobId = null) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
//     if (jobId) {
//       formData.append('jobId', jobId);
//     }

//     const response = await axios.post(`${API_URL}/api/v1/candidates/bulk-upload`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error uploading bulk candidates:', error);
//     throw new Error(error.response?.data?.message || 'Failed to upload candidates');
//   }
// };

// // Get upload status
// export const getBulkUploadStatus = async (uploadId) => {
//   try {
//     const response = await axios.get(`${API_URL}/api/v1/candidates/upload-status/${uploadId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error getting upload status:', error);
//     throw new Error(error.response?.data?.message || 'Failed to get upload status');
//   }
// };

// src/services/Candidates/bulkUploadService.js
// import axios from 'axios';

// const API_URL = "https://f0937721124b.ngrok-free.app";

// // Download Excel template
// export const downloadTemplate = async () => {
//   try {
//     const token = localStorage.getItem('token');
    
//     const response = await axios.get(`${API_URL}/api/v1/candidates/download/template`, {
//       responseType: 'blob', // This should be in the config object
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       }
//     });
    
//     // Create a blob from the response
//     const blob = new Blob([response.data], {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     });
    
//     // Create download link
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'candidate_upload_template.xlsx');
//     document.body.appendChild(link);
//     link.click();
    
//     // Clean up
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(link);
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error downloading template:', error);
//     throw new Error(error.response?.data?.message || 'Failed to download template');
//   }
// };

// // Upload Excel file for bulk candidate creation
// export const bulkUploadCandidates = async (file, jobId = null) => {
//   try {
//     const token = localStorage.getItem('token');
//     const formData = new FormData();
//     formData.append('file', file);
//     if (jobId) {
//       formData.append('jobId', jobId);
//     }

//     const response = await axios.post(`${API_URL}/api/v1/candidates/bulk-upload`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`,
//                 'ngrok-skip-browser-warning': 'true'

//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error uploading bulk candidates:', error);
//     throw new Error(error.response?.data?.message || 'Failed to upload candidates');
//   }
// };

// // Get upload status
// export const getBulkUploadStatus = async (uploadId) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_URL}/api/v1/candidates/upload-status/${uploadId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//                 'ngrok-skip-browser-warning': 'true'

//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error getting upload status:', error);
//     throw new Error(error.response?.data?.message || 'Failed to get upload status');
//   }
// };


import axios from 'axios';

const API_URL = "https://ungroupable-appallingly-bryan.ngrok-free.dev";

// Download Excel template - FIXED implementation
export const downloadTemplate = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios({
      method: 'GET',
      url: `${API_URL}/api/v1/candidates/download/template`,
      responseType: 'blob', // Important for file downloads
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    // Create a blob from the response data
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to download template';
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response.status === 403) {
        errorMessage = 'You do not have permission to download templates.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

// Upload Excel file for bulk candidate creation - FIXED implementation
export const bulkUploadCandidates = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/api/v1/candidates/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      timeout: 300000, // 5 minutes timeout for large files
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading bulk candidates:', error);
    
    let errorMessage = 'Failed to upload candidates';
    if (error.response) {
      if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.status === 413) {
        errorMessage = 'File too large. Please upload a smaller file.';
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid file format. Please upload a valid Excel file.';
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Upload timeout. Please try again with a smaller file.';
    }
    
    throw new Error(errorMessage);
  }
};

// Get upload status
export const getBulkUploadStatus = async (uploadId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/v1/candidates/upload-status/${uploadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error getting upload status:', error);
    throw new Error(error.response?.data?.message || 'Failed to get upload status');
  }
};