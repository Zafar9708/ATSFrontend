// import axios from "axios";

// const API_BASE_URL = "https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1";

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'ngrok-skip-browser-warning': 'true'

//     },
//   };
// };

// export const createCandidate = async (formData) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/candidates`,{
//         headers:{
//        'ngrok-skip-browser-warning': 'true'
//         }
//       },
//       formData,
//       getAuthHeader()
//     );
//     return response.data;
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || 
//                          error.response?.data?.error || 
//                          'Failed to create candidate';
//     throw new Error(errorMessage);
//   }
// };


// export const getAllLocations = async () => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/location`,
//       getAuthHeader()
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const addLocation = async (name) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/location`,{
//         headers:{
//                   'ngrok-skip-browser-warning': 'true'

//         }
//       },
//       { name },
//       getAuthHeader()
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getAllSources = async () => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/source`,{
//         headers:{
//                   'ngrok-skip-browser-warning': 'true'

//         }
//       },
//       getAuthHeader()
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const addSource = async (name) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/source`,{
//         headers:{
//                   'ngrok-skip-browser-warning': 'true'

//         }
//       },
//       { name, isCustom: true },
//       getAuthHeader()
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getAllStages = async () => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/stages/all`,{
//         headers:{
//         'ngrok-skip-browser-warning': 'true'

//         }
//       },
//       getAuthHeader()
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const analyzeResume = async (file, jobId = null) => {
//   try {
//     const formData = new FormData();
//     formData.append("resume", file);
    
//     if (jobId) {
//       formData.append("jobId", jobId);
//     }
    
//     const response = await axios.post(
//       `${API_BASE_URL}/candidates/resumes/analyze`,
//       formData,
//       {
//         ...getAuthHeader(),
//         headers: {
//           ...getAuthHeader().headers,
//           'Content-Type': 'multipart/form-data',
//            'ngrok-skip-browser-warning': 'true'

//         }
//       }
//     );
//     return response.data; // This returns the entire response including success flag
//   } catch (error) {
//     // Make sure to return the error response if available
//     if (error.response) {
//       throw error.response.data;
//     }
//     throw error;
//   }
// };


//---------

import axios from "axios";

const API_BASE_URL = "https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'

    },
  };
};

export const createCandidate = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/candidates`,
      formData,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to create candidate';
    throw new Error(errorMessage);
  }
};



export const getAllLocations = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/location`,
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addLocation = async (name) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/location`,
      { name },
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllSources = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/source`,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};


export const addSource = async (name) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/source`,
      { name, isCustom: true },
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllStages = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stages/all`,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


// export const analyzeResume = async (file, jobId = null) => {
//   try {
//     const formData = new FormData();
//     formData.append("resume", file);
    
//     if (jobId) {
//       formData.append("jobId", jobId);
//     }
    
//     const response = await axios.post(
//       "https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/resumes/analyze",
//       formData,
//       {
//         ...getAuthHeader(),
//         headers: {
//           ...getAuthHeader().headers,
//           'Content-Type': 'multipart/form-data',
//            'ngrok-skip-browser-warning': 'true'

//         }
//       }
//     );
//     return response.data; // This returns the entire response including success flag
//   } catch (error) {
//     // Make sure to return the error response if available
//     if (error.response) {
//       throw error.response.data;
//     }
//     throw error;
//   }
// };

export const analyzeResume = async (file, jobId = null) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    
    if (jobId) {
      formData.append("jobId", jobId);
    }
    
    const response = await axios.post(
      "https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/candidates/resumes/analyze",
      formData,
      {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          'ngrok-skip-browser-warning': 'true'
          // remove 'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
