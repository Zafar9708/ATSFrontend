// import axios from 'axios';

// const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/templates';

// export const fetchJobTemplates = async () => {
//     try {
//       const response = await axios.get(API_BASE_URL);
//       return response.data; 
//     } catch (err) {
//       throw new Error(err.response?.data?.error || err.message);
//     }
//   };

//-------

import axios from 'axios';

const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/templates';

export const fetchJobTemplates = async () => {
    try {
        const response = await axios.get(API_BASE_URL,{
          headers:{
              'ngrok-skip-browser-warning': 'true'
          }
        });
        // The API returns an array directly
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || err.message);
    }
};