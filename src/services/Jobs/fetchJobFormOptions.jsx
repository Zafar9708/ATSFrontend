import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/options';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  };
};

export const fetchJobFormOptions = async () => {
  try {
    const response = await axios.get(API_BASE_URL,{
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }
    }, getAuthHeaders());
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};