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

const PaymentAccessCodeAPI = {
  /**
   * Create a new payment request
   * @param {Object} data - Payment request data
   * @param {number} data.amount - Payment amount
   * @param {string} data.description - Payment description
   * @param {string} [data.type] - Payment type
   * @returns {Promise<Object>} The created payment request data
   */
  createPaymentRequest: async (data) => {
    try {
      const response = await api.post('/payment-access-codes', data);
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Get all payment requests for the authenticated user
   * @param {Object} [params] - Query parameters
   * @param {string} [params.status] - Filter by status
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @returns {Promise<Object>} Payment requests data with pagination
   */
  getPaymentRequests: async (params = {}) => {
    try {
      const response = await api.get('/payment-access-codes', { params });
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Get payment request by ID
   * @param {number} id - The payment request ID
   * @returns {Promise<Object>} The payment request data
   */
  getPaymentRequest: async (id) => {
    try {
      const response = await api.get(`/payment-access-codes/${id}`);
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Get payment request by code (public endpoint)
   * @param {string} codePay - The payment code
   * @returns {Promise<Object>} The payment request data
   */
  getPaymentRequestByCode: async (codePay) => {
    try {
      // This endpoint doesn't require authentication
      const response = await axios.get(`${API_BASE_URL}/payment-access-codes/code/${codePay}`);
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Get payment statistics (admin only)
   * @param {Object} [params] - Query parameters
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @returns {Promise<Object>} Payment statistics data
   */
  getPaymentStats: async (params = {}) => {
    try {
      const response = await api.get('/payment-access-codes/stats', { params });
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Approve a payment request (admin only)
   * @param {number} id - The payment request ID
   * @param {Object} [data] - Additional approval data
   * @returns {Promise<Object>} The updated payment request data
   */
  approvePaymentRequest: async (id, data = {}) => {
    try {
      const response = await api.put(`/payment-access-codes/${id}/approve`, data);
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Cancel a payment request (owner or admin only)
   * @param {number} id - The payment request ID
   * @param {Object} [data] - Cancellation reason or additional data
   * @returns {Promise<Object>} The updated payment request data
   */
  cancelPaymentRequest: async (id, data = {}) => {
    try {
      const response = await api.put(`/payment-access-codess/${id}/cancel`, data);
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Delete a payment request (admin only)
   * @param {number} id - The payment request ID to delete
   * @returns {Promise<Object>} Success status
   */
  deletePaymentRequest: async (id) => {
    try {
      const response = await api.delete(`/payment-access-codes/${id}`);
      return response.data;
    } catch (error) {
      throw PaymentAccessCodeAPI.handleError(error);
    }
  },

  /**
   * Handle API errors
   * @private
   */
  handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'Đã xảy ra lỗi';
      return new Error(`API Error (${status}): ${message}`);
    } else if (error.request) {
      return new Error('Không có phản hồi từ server. Vui lòng kiểm tra kết nối.');
    } else {
      return new Error(`Request error: ${error.message}`);
    }
  },
};

export default PaymentAccessCodeAPI;