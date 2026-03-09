
// import axios from 'axios';

// const API_BASE_URL = 'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.comapi/v1/departments';

// export const fetchDepartments=async ()=>{
//     try{
//         const response = await axios.get(API_BASE_URL);
//         return response.data
 
//     }
//     catch(err){
//         throw new Error(err.response?.data?.error || err.message)
//     }
// }

// export const addDepartment = async (name) => {
//   const res = await axios.post(API_BASE_URL, { name });
//   return res.data.departments;
// };
//----


import axios from 'axios';

const API_BASE_URL = '/api/v1/departments';

export const fetchDepartments = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });

    // Response is a plain array
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};


export const addDepartment = async (name) => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      { name },
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );

    // Response has { message, departments }
    return response.data.departments; // ✅ return the array only
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};
