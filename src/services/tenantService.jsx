// // src/services/tenantService.js
// import axios from 'axios';

// const API_URL = 'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.com//api/v1';

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

// const API_BASE_URL = 'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.com//api/v1/tenants';

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














// // services/tenantService.js
// import axios from 'axios';

// const API_URL = '/api/v1/tenants';

// const getToken = () => localStorage.getItem('token');

// // Get all tenants
// export const getTenants = async () => {
//   const response = await axios.get(API_URL, {
//     headers: { Authorization: `Bearer ${getToken()}`,'ngrok-skip-browser-warning': 'true' },
//   });
//   return response.data;
// };

// // Create tenant
// export const createTenant = async (tenantData) => {
//   const response = await axios.post(API_URL, tenantData, {
//     headers: { 
//       Authorization: `Bearer ${getToken()}`,
//       'Content-Type': 'application/json',
//       'ngrok-skip-browser-warning': 'true'
//     },
//   });
//   return response.data;
// };

// // Update tenant status
// export const updateTenantStatus = async (id, isActive) => {
//   const response = await axios.patch(`${API_URL}/${id}`, { isActive }, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return response.data;
// };

// // Delete tenant
// export const deleteTenant = async (id) => {
//   const response = await axios.delete(`${API_URL}/${id}`, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return response.data;
// };

// // Resend welcome email to tenant admin
// export const resendWelcomeEmail = async (tenantId) => {
//   const response = await axios.post(`${API_URL}/${tenantId}/resend-welcome`, {}, {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return response.data;
// };



// import axios from 'axios';

// const API_URL = '/api/v1/tenants';

// const getToken = () => localStorage.getItem('token');

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'ngrok-skip-browser-warning': 'true'
//   }
// });

// api.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const getTenants = async () => {
//   try {
//     const response = await api.get('/');
//     return response.data;
//   } catch (error) {
//     console.error('Get tenants error:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Create tenant — logs FULL error details to help debug "Required fields missing"
// export const createTenant = async (tenantData) => {
//   try {
//     console.log('▶ createTenant sending:', JSON.stringify(tenantData, null, 2));
//     const response = await api.post('/', tenantData);
//     return response.data;
//   } catch (error) {
//     // Expanded logging — check browser console for which field is rejected
//     console.error('✖ createTenant failed:', {
//       httpStatus:   error.response?.status,
//       apiMessage:   error.response?.data?.message,
//       apiErrors:    error.response?.data?.errors,   // may contain field-level details
//       fullResponse: error.response?.data,
//       sentPayload:  tenantData,
//     });
//     throw error;
//   }
// };

// export const updateTenantStatus = async (id, isActive) => {
//   try {
//     const response = await api.patch(`/${id}`, { isActive });
//     return response.data;
//   } catch (error) {
//     console.error('Update status error:', error.response?.data || error.message);
//     throw error;
//   }
// };

// export const deleteTenant = async (id) => {
//   try {
//     const response = await api.delete(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Delete tenant error:', error.response?.data || error.message);
//     throw error;
//   }
// };

// export const resendWelcomeEmail = async (tenantId) => {
//   try {
//     const response = await api.post(`/${tenantId}/resend-welcome`, {});
//     return response.data;
//   } catch (error) {
//     console.error('Resend email error:', error.response?.data || error.message);
//     throw error;
//   }
// };

import axios from 'axios';

const API_URL = '/api/v1/tenants';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTenants = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Get tenants error:', error.response?.data || error.message);
    throw error;
  }
};

// Create tenant — logs FULL error details to help debug "Required fields missing"
export const createTenant = async (tenantData) => {
  try {
    console.log('▶ createTenant sending:', JSON.stringify(tenantData, null, 2));
    const response = await api.post('/', tenantData);
    return response.data;
  } catch (error) {
    // Expanded logging — check browser console for which field is rejected
    console.error('✖ createTenant failed:', {
      httpStatus:   error.response?.status,
      apiMessage:   error.response?.data?.message,
      apiErrors:    error.response?.data?.errors,   // may contain field-level details
      fullResponse: error.response?.data,
      sentPayload:  tenantData,
    });
    throw error;
  }
};

export const updateTenantStatus = async (id, isActive) => {
  try {
    const response = await api.patch(`/${id}`, { isActive });
    return response.data;
  } catch (error) {
    console.error('Update status error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteTenant = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete tenant error:', error.response?.data || error.message);
    throw error;
  }
};

export const resendWelcomeEmail = async (tenantId) => {
  try {
    const response = await api.post(`/${tenantId}/resend-welcome`, {});
    return response.data;
  } catch (error) {
    console.error('Resend email error:', error.response?.data || error.message);
    throw error;
  }
};

// Update tenant (for edit form)
export const updateTenant = async (id, tenantData) => {
  try {
    console.log('▶ updateTenant sending:', JSON.stringify(tenantData, null, 2));
    const response = await api.put(`/${id}`, tenantData);
    return response.data;
  } catch (error) {
    console.error('✖ updateTenant failed:', { status: error.response?.status, data: error.response?.data });
    throw error;
  }
};