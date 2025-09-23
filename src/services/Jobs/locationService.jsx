// import axios from "axios";

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/location';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   };
// };

// export const fetchLocations = async () => {
//   try {
//     const response = await axios.get(API_BASE_URL, getAuthHeaders());
//     return response.data.data; // Adjust according to your API response structure
//   } catch (error) {
//     console.error('Error fetching locations:', error);
//     throw new Error(error.response?.data?.message || 'Failed to fetch locations');
//   }
// };

// export const addNewLocation = async (name) => {
//   try {
//     const response = await axios.post(API_BASE_URL, { name }, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     console.error('Error adding location:', error);
//     throw new Error(error.response?.data?.message || 'Failed to add location');
//   }
// };

// services/Jobs/locationService.js
import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/location';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  };
};

export const fetchLocations = async () => {
  try {
    const response = await axios.get(API_BASE_URL,getAuthHeaders());
    return response.data.data || []; // Match your API response structure
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const addNewLocation = async (name) => {
  try {
    const response = await axios.post(API_BASE_URL, { name },getAuthHeaders());
    return response.data; // Should return the created location
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};