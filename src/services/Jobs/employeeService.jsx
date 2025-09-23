// import axios from 'axios';

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/employees';
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'ngrok-skip-browser-warning': 'true'
//     }
//   };
// };

// export const fetchEmployees = async () => {
//   try {
//     const response = await axios.get(API_BASE_URL,getAuthHeaders());
//     return response.data.data || []; // Return the data array directly
//   } catch (error) {
//     console.error('Error Fetching Employees', error);
//     throw error;
//   }
// };

// export const createEmployee = async (employeeData) => {
//   try {
//     const response = await axios.post(API_BASE_URL,{
//       headers:{
//         'ngrok-skip-browser-warning': 'true'
//       }
//     }, employeeData,getAuthHeaders());
//     return response.data.data; 
//   } catch (error) {
//     console.error('Error creating employee:', error);
//     throw error;
//   }
// };

//-------

import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/employees';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  };
};

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    return response.data.data || []; // Return the data array directly
  } catch (error) {
    console.error('Error Fetching Employees', error);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    // ✅ Correct order: url, data, config
    const response = await axios.post(API_BASE_URL, employeeData, getAuthHeaders());
    return response.data.data; 
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};
