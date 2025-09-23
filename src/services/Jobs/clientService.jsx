// import axios from 'axios';

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/clients';

// export const fetchClients = async () => {
//   try {
//     const response = await axios.get(API_BASE_URL);
//     return response.data || [];
//   } catch (error) {
//     console.error('Error Fetching Clients', error);
//     throw error;
//   }
// };

// export const createClient = async (name) => {
//   try {
//     const response = await axios.post(API_BASE_URL,{ name });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating client:', error);
//     throw error;
//   }
// };

// export const deleteClient = async (clientId) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/${clientId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting client:', error);
//     throw error;
//   }
// };


// services/Jobs/clientService.js
import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/clients';

export const fetchClients = async () => {
  try {
    const response = await axios.get(API_BASE_URL,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      });
    return response.data.clients || []; // Return the clients array directly
  } catch (error) {
    console.error('Error Fetching Clients', error);
    throw error;
  }
};

export const createClient = async (name) => {
  try {
    const response = await axios.post(API_BASE_URL, { name }, 
           { headers: { 'ngrok-skip-browser-warning': 'true' } }
);
    return {
      success: response.data.success,
      client: response.data.client // Return the created client object
    };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const deleteClient = async (clientId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${clientId}`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      });
    return { success: true };
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};