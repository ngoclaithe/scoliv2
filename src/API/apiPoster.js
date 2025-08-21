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

const PosterAPI = {
  uploadPoster: async (file, accessCode, name = '', description = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('accessCode', accessCode);
      if (name) formData.append('name', name);
      if (description) formData.append('description', description);

      const response = await api.post('/posters', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw PosterAPI.handleError(error);
    }
  },

  getPosters: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.name) {
        params.append('name', filters.name);
      }
      if (filters.accessCode) {
        params.append('accessCode', filters.accessCode);
      }
      if (filters.accessCode) {
        params.append('accessCode', filters.accessCode);
      }
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (filters.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }

      const response = await api.get(`/posters?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw PosterAPI.handleError(error);
    }
  },

  getPosterByAccesscode: async (accessCode) => {
    try {
      const response = await api.get(`/posters/access-code/${accessCode}`);
      return response.data;
    } catch (error) {
      throw PosterAPI.handleError(error);
    }
  },

  updatePoster: async (id, updateData) => {
    try {
      const formData = new FormData();
      
      if (updateData.file) {
        formData.append('file', updateData.file);
      }
      if (updateData.name) {
        formData.append('name', updateData.name);
      }
      if (updateData.description) {
        formData.append('description', updateData.description);
      }

      const response = await api.put(`/posters/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw PosterAPI.handleError(error);
    }
  },

  deletePoster: async (id) => {
    try {
      const response = await api.delete(`/posters/${id}`);
      return response.data;
    } catch (error) {
      throw PosterAPI.handleError(error);
    }
  },

  searchPosters: async (searchTerm) => {
    try {
      const response = await api.get(`/posters?name=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw PosterAPI.handleError(error);
    }
  },

  handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'Đã xảy ra lỗi';
      return new Error(`API Error (${status}): ${message}`);
    } else if (error.request) {
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      return new Error(`Request error: ${error.message}`);
    }
  },
};

export default PosterAPI;
