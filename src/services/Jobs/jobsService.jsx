import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/job';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
       'ngrok-skip-browser-warning': 'true'
    
   
    }
  };
};

export const getJobs = async () => {
  try {
    console.log('Fetching jobs from:', API_BASE_URL); // Debug log
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    console.log('Jobs API response:', response); // Debug log
    
    // Return the entire response data
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error.response || error);
    throw error;
  }
};

export const getJobById = async (jobId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${jobId}`,getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const fetchNotesByJob = async (jobId) => {
  try {
    const response = await axios.get(`https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/notes/${jobId}`,{
      headers:{
           'ngrok-skip-browser-warning': 'true'
      }

    }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const createNote = async (jobId, content) => {
  try {
    const response = await axios.post(
      `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/notes/${jobId}`,{
        headers:{
                'ngrok-skip-browser-warning': 'true'
        }
      },
      { content },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const updateNote = async (noteId, content) => {
  try {
    const response = await axios.put(
      `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/notes/${noteId}`,{
        headers:{
                'ngrok-skip-browser-warning': 'true'
        }
      },
      { content },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error.response || error);
    throw error.response?.data || error.message;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await axios.delete(
      `https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/notes/${noteId}`,
      {
        headers:{
                'ngrok-skip-browser-warning': 'true'
        }
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error.response || error);
    throw error.response?.data || error.message;
  }
};


export const fetchPipelineData = async (jobId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stages/by-job/${jobId}`,
      {
        headers:{
                'ngrok-skip-browser-warning': 'true'
        }
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};