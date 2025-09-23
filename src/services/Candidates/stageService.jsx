import axios from 'axios';

const STAGE_API_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/stages';

const stageApi = axios.create({
  baseURL: STAGE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Add auth interceptor
stageApi.interceptors.request.use(
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

const defaultStages = [
  { _id: '1', name: 'Sourced', order: 1 },
  { _id: '2', name: 'Interview', order: 2 },
  { _id: '3', name: 'Preboarding', order: 3 },
  { _id: '4', name: 'Hired', order: 4 },
  { _id: '5', name: 'Rejected', order: 5 },
  { _id: '6', name: 'Archived', order: 6 }
];

const defaultStageOptions = [
  { _id: '1', name: 'Sourced' },
  { _id: '2', name: 'Interview' },
  { _id: '3', name: 'Preboarding' },
  { _id: '4', name: 'Hired' },
  { _id: '5', name: 'Rejected' },
  { _id: '6', name: 'Archived' }
];

export default {
  async fetchStages() {
    try {
      const response = await stageApi.get('/');
      return response.data || defaultStages;
    } catch (error) {
      console.error("Error fetching stages:", error);
      return defaultStages;
    }
  },

  async fetchStageOptions() {
    try {
      const response = await stageApi.get('/options');
      return response.data || defaultStageOptions;
    } catch (error) {
      console.error("Error fetching stage options:", error);
      return defaultStageOptions;
    }
  },

  async fetchRejectionTypes() {
    try {
      const response = await stageApi.get('/rejection-types');
      return response.data || ["R1 Rejected", "R2 Rejected", "Client Rejected"];
    } catch (error) {
      console.error("Error fetching rejection types:", error);
      return ["R1 Rejected", "R2 Rejected", "Client Rejected"];
    }
  }
};