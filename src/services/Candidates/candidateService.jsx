import axios from 'axios';

const CANDIDATE_API_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates';

const candidateApi = axios.create({
  baseURL: CANDIDATE_API_URL,
  headers: {
    'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    
  }
});

// Add auth interceptor
candidateApi.interceptors.request.use(
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

export default {
  // Fetch all candidates
  async fetchCandidates() {
    try {
      const response = await candidateApi.get('/');
      return response.data.candidates || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch candidates');
    }
  },

  // Fetch candidates by job ID
  async fetchCandidatesByJob(jobId) {
    try {
      const response = await candidateApi.get(`/job/${jobId}`);
      return response.data.candidates || [];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch candidates for job');
    }
  },

  // Get candidate by ID
  async getCandidateById(id) {
    try {
      const response = await candidateApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch candidate');
    }
  },

  // Create candidate
  async createCandidate(candidateData, resume = null) {
    try {
      const formData = new FormData();
      Object.keys(candidateData).forEach(key => {
        formData.append(key, candidateData[key]);
      });
      if (resume) formData.append('resume', resume);

      const response = await candidateApi.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create candidate');
    }
  },

  

  // Update candidate
  async updateCandidate(id, updateData, resume = null) {
    try {
      const formData = new FormData();
      Object.keys(updateData).forEach(key => {
        formData.append(key, updateData[key]);
      });
      if (resume) formData.append('resume', resume);

      const response = await candidateApi.put(`/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update candidate');
    }
  },

  // Delete candidate
  async deleteCandidate(id) {
    try {
      const response = await candidateApi.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete candidate');
    }
  },

  // Get candidate stage history
  async getCandidateStageHistory(id) {
    try {
      const response = await candidateApi.get(`/${id}/stage-history`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stage history');
    }
  },

  // Get resume analysis
  async fetchResumeAnalysis(id) {
    try {
      const response = await candidateApi.get(`/${id}/resume-analysis`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch resume analysis');
    }
  },

  // Send bulk emails
  async sendBulkEmails({ recipients, subject, body }) {
    try {
      const response = await candidateApi.post('/bulk-email',{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      }, {
        recipients,
        subject,
        body,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send bulk emails');
    }
  },

  // Schedule interview
  async scheduleInterview(interviewData) {
    try {
      const response = await candidateApi.post('/schedule-interview',{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }

      }, interviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to schedule interview');
    }
  },

async getPipelineData(jobId) {
    try {
      const response = await candidateApi.get(`/job/${jobId}/pipeline`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      },);
      return response.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pipeline data');
    }
  },


  // Update candidate stage
  async updateCandidateStage(candidateId, stageId, rejectionReason = null) {
    try {
      const response = await candidateApi.put(`/${candidateId}/stage`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      }, {
        stageId,
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update candidate stage');
    }
  },

  async getResumeAnalysis(candidateId) {
  try {
    const response = await candidateApi.get(`/${candidateId}/resume-analysis`,{
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running or unreachable');
    }
    
    throw new Error(error.response?.data?.message || 
      error.message || 
      'Failed to fetch resume analysis');
  }
},

  // In candidateService.js
async downloadResume(candidateId) {
  try {
    const response = await candidateApi.get(`/download-resume/${candidateId}`,{
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }
    }, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw new Error('Failed to download resume');
  }
},

async previewResume(candidateId) {
  try {
    const response = await candidateApi.get(`/preview-resume/${candidateId}`,{
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }
    } ,{
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error previewing resume:', error);
    throw new Error('Failed to preview resume');
  }
}

};



