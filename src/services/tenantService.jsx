// // src/services/tenantService.js
// import axios from 'axios';

// const API_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1';

// const getTenants = async () => {
//   const token = localStorage.getItem('token');
//   const response = await axios.get(`${API_URL}/tenants`, {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });
//   return response.data;
// };

// export default {
//   getTenants
// };

// import axios from 'axios';

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/tenants';

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   };
// };

// export const getTenants = async () => {
//   try {
//     const response = await axios.get(API_BASE_URL, getAuthHeaders());
//     return response.data.data.tenants;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to fetch tenants');
//   }
// };

// export const createTenant = async (tenantData) => {
//   try {
//     const response = await axios.post(API_BASE_URL, tenantData, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to create tenant');
//   }
// };

// export const updateTenantStatus = async (tenantId, isActive) => {
//   try {
//     const response = await axios.patch(
//       `${API_BASE_URL}/${tenantId}`,
//       { isActive },
//       getAuthHeaders()
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to update tenant status');
//   }
// };

// export const deleteTenant = async (tenantId) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/${tenantId}`, getAuthHeaders());
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Failed to delete tenant');
//   }
// };



//-------

// services/tenantService.js
import axios from 'axios';

const API_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/tenants';

const getToken = () => localStorage.getItem('token');

// Get all tenants
export const getTenants = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}`,'ngrok-skip-browser-warning': 'true' },
  });
  return response.data;
};

// Create tenant
export const createTenant = async (tenantData) => {
  const response = await axios.post(API_URL, tenantData, {
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
  });
  return response.data;
};

// Update tenant status
export const updateTenantStatus = async (id, isActive) => {
  const response = await axios.patch(`${API_URL}/${id}`, { isActive }, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Delete tenant
export const deleteTenant = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Resend welcome email to tenant admin
export const resendWelcomeEmail = async (tenantId) => {
  const response = await axios.post(`${API_URL}/${tenantId}/resend-welcome`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};