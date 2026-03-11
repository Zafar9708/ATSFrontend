

// // services/api.js
// import axios from 'axios';

// const API_BASE_URL = '/api/v1';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a request interceptor to include the auth token if needed
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

// export const inviteVendor = async (email) => {
//   return await api.post('/vendor/invite', { email });
// };

// services/api.js
import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token if needed
api.interceptors.request.use(
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

export default api;

export const inviteVendor = async (vendorData) => {
  const token = localStorage.getItem('token');
  return await axios.post(
    '/api/admin/vendors/create',
    {
      firstName:      vendorData.firstName,
      lastName:       vendorData.lastName,
      email:          vendorData.email,
      phone:          vendorData.phone,
      designation:    vendorData.designation,
      companyName:    vendorData.companyName,
      companyEmail:   vendorData.companyEmail,
      companyPhone:   vendorData.companyPhone,
      companyAddress: vendorData.companyAddress,
      industry:       vendorData.industry,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};