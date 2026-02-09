
import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api/v1";

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (emailData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (otpData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(otpData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, passwords) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(passwords),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Password reset failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    // Get token from localStorage for authorization
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    // Get token from localStorage for authorization
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user details");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const validateFirstLoginToken = async (tokenData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate-first-login-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(tokenData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token validation failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Update the firstLogin function
export const firstLogin = async (data) => {
  try {
    // Determine the endpoint based on whether password is provided
    const endpoint = data.password 
      ? `${API_BASE_URL}/auth/first-login` 
      : `${API_BASE_URL}/auth/validate-first-login-token`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "First login process failed");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// services/authService.js
// services/authService.js
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }
    
    // Use the API endpoint to get user details
    const response = await axios.get(`${API_BASE_URL}/auth/user-details`,{
      headers:{
         Authorization:`Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Full API response:', response.data);
    
    // Handle the API response structure: { status: "success", data: { user: {...} } }
    if (response.data.status === 'success' && response.data.data && response.data.data.user) {
      console.log('User data extracted:', response.data.data.user);
      return response.data.data.user;
    }
    
    // Fallback: try different response structures
    if (response.data.user) {
      console.log('User data from response.data.user:', response.data.user);
      return response.data.user;
    }
    
    if (response.data.data) {
      console.log('User data from response.data:', response.data.data);
      return response.data.data;
    }
    
    console.log('Unexpected API response structure:', response.data);
    return null;
    
  } catch (error) {
    console.error('Error getting current user from API:', error);
    
    // Fallback: try to decode token if API fails
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Fallback - decoded token payload:', payload);
        return {
          _id: payload.id,
          email: payload.email,
          role: payload.role,
          username: payload.username,
          tenantId: payload.tenantId
        };
      }
    } catch (decodeError) {
      console.error('Error decoding token:', decodeError);
    }
    
    return null;
  }
};