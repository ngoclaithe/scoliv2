import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';

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

const InfoPaymentAPI = {
  getInfoPayment: async () => {
    try {
      const response = await api.get('/info-payments');
      return response.data;
    } catch (error) {
      throw InfoPaymentAPI.handleError(error);
    }
  },

  getInfoPaymentById: async (id) => {
    try {
      const response = await api.get(`/info-payments/${id}`);
      return response.data;
    } catch (error) {
      throw InfoPaymentAPI.handleError(error);
    }
  },
  createInfoPayment: async (paymentData) => {
    try {
      const response = await api.post('/info-payments', paymentData);
      return response.data;
    } catch (error) {
      throw InfoPaymentAPI.handleError(error);
    }
  },

  updateInfoPayment: async (id, updateData) => {
    try {
      const response = await api.put(`/info-payments/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw InfoPaymentAPI.handleError(error);
    }
  },

  deleteInfoPayment: async (id) => {
    try {
      const response = await api.delete(`/info-payments/${id}`);
      return response.data;
    } catch (error) {
      throw InfoPaymentAPI.handleError(error);
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

export default InfoPaymentAPI;
