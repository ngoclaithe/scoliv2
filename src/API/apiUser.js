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

const UserAPI = {
  /**
   * Get all users (admin only)
   * @param {Object} [params] - Optional query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @param {string} [params.name] - Filter by name
   * @param {string} [params.email] - Filter by email
   * @param {string} [params.role] - Filter by role (user|admin)
   * @returns {Promise<Object>} Paginated users data
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      throw UserAPI.handleError(error);
    }
  },

  /**
   * Get user by ID (admin only)
   * @param {string} id - User ID
   * @returns {Promise<Object>} User data
   */
  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw UserAPI.handleError(error);
    }
  },

  /**
   * Update user (admin only)
   * @param {string} id - User ID
   * @param {Object} data - Update data
   * @param {string} [data.name] - New name
   * @param {string} [data.email] - New email
   * @param {string} [data.role] - New role (user|admin)
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw UserAPI.handleError(error);
    }
  },

  /**
   * Delete user (admin only)
   * @param {string} id - User ID to delete
   * @returns {Promise<Object>} Success status
   */
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw UserAPI.handleError(error);
    }
  },

  /**
   * Handle API errors
   * @private
   */
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

export default UserAPI;