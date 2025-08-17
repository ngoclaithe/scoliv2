import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://scoliv2.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

  getDisplaySettings: async (accessCode) => {
    try {
      // console.log('🌐 [DisplaySettingsAPI] Making request to:', `${API_BASE_URL}/display-settings/access-code/${accessCode}`);
      const response = await api.get(`/display-settings/access-code/${accessCode}`);
      // console.log('🌐 [DisplaySettingsAPI] Raw response:', response);
      // console.log('🌐 [DisplaySettingsAPI] Response status:', response.status);
      // console.log('🌐 [DisplaySettingsAPI] Response data:', response.data);
      return response.data;
    } catch (error) {
      // console.error('🌐 [DisplaySettingsAPI] API call failed:', error);
      throw DisplaySettingsAPI.handleError(error);
    }
  },

  handleError: (error) => {
    if (error.response) {

      const { status, data } = error.response;
      const message = data?.message || 'An error occurred';
      return new Error(`API Error (${status}): ${message}`);
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.');
    } else {
      return new Error(`Request error: ${error.message}`);
    }
  },
};

export default DisplaySettingsAPI;
