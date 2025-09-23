const API_BASE_URL = 'https://ungroupable-appallingly-bryan.ngrok-free.dev/api/v1/job';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  };
};


export const fetchInterviewData = async () => {
  try {
    const [onlineInterviews, offlineInterviews, upcomingInterviews] = await Promise.all([
      axios.get(`${API_BASE_URL}/interviews/schedule`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      }, getAuthHeaders()),
      axios.get(`${API_BASE_URL}/offline-interviews/get`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      }, getAuthHeaders()),
      axios.get(`${API_BASE_URL}/interviews/upcoming`,{
        headers:{
          'ngrok-skip-browser-warning': 'true'
        }
      }, getAuthHeaders())
    ]);

    return {
      online: onlineInterviews.data.count || 0,
      offline: offlineInterviews.data.data?.length || 0,
      upcoming: upcomingInterviews.data.count || 0,
      upcomingInterviews: upcomingInterviews.data.data || []
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};