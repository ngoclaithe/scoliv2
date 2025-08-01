import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

const DisplaySettingsAPI = {
  /**
   * Get display settings by access code
   * @param {string} accessCode - The access code for the match
   * @returns {Promise<Object>} Display settings data
   */
  getDisplaySettings: async (accessCode) => {
    try {
      const response = await api.get(`/display-settings/access-code/${accessCode}`);
      return response.data;
    } catch (error) {
      throw DisplaySettingsAPI.handleError(error);
    }
  },

  /**
   * Handle API errors
   * @private
   */
  handleError: (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const message = data?.message || 'An error occurred';
      return new Error(`API Error (${status}): ${message}`);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(`Request error: ${error.message}`);
    }
  },
};

export default DisplaySettingsAPI;
