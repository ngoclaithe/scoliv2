import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const adminAPI = {
  // Admin authentication
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đăng nhập admin thất bại');
    }
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  },

  // Get admin token
  getToken: () => {
    return localStorage.getItem('admin_token');
  },

  // Admin logout
  logout: () => {
    localStorage.removeItem('admin_token');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Get current admin info
  getMe: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/me`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin admin');
    }
  },

  // Dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy thống kê dashboard');
    }
  },

  // Access code management
  accessCodes: {
    getAll: async (page = 1, limit = 10, search = '') => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/access-codes`, {
          params: { page, limit, search }
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách mã truy cập');
      }
    },

    create: async (codeData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/access-codes`, codeData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể tạo mã truy cập');
      }
    },

    update: async (id, codeData) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/admin/access-codes/${id}`, codeData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật mã truy cập');
      }
    },

    delete: async (id) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/admin/access-codes/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể xóa mã truy cập');
      }
    },

    getById: async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/access-codes/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin mã truy cập');
      }
    }
  },

  // User account management
  accounts: {
    getAll: async (page = 1, limit = 10, search = '') => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/accounts`, {
          params: { page, limit, search }
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tài khoản');
      }
    },

    create: async (accountData) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/accounts`, accountData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể tạo tài khoản');
      }
    },

    update: async (id, accountData) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/admin/accounts/${id}`, accountData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật tài khoản');
      }
    },

    delete: async (id) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/admin/accounts/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản');
      }
    },

    getById: async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/accounts/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin tài khoản');
      }
    },

    updateStatus: async (id, status) => {
      try {
        const response = await axios.patch(`${API_BASE_URL}/admin/accounts/${id}/status`, { status });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái tài khoản');
      }
    }
  },

  // Code purchase management
  codePurchases: {
    getAll: async (page = 1, limit = 10, search = '', status = '') => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/code-purchases`, {
          params: { page, limit, search, status }
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách mua code');
      }
    },

    getById: async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/code-purchases/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin mua code');
      }
    },

    updateStatus: async (id, status, note = '') => {
      try {
        const response = await axios.patch(`${API_BASE_URL}/admin/code-purchases/${id}/status`, 
          { status, note }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái mua code');
      }
    },

    getStats: async (from, to) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/code-purchases/stats`, {
          params: { from, to }
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thống kê mua code');
      }
    }
  },

  // Active rooms management
  activeRooms: {
    getAll: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/active-rooms`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách phòng hoạt động');
      }
    },

    getById: async (roomId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/active-rooms/${roomId}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin phòng');
      }
    },

    closeRoom: async (roomId) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/active-rooms/${roomId}/close`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể đóng phòng');
      }
    },

    kickUser: async (roomId, userId) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/active-rooms/${roomId}/kick`, {
          userId
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể kick user');
      }
    },

    getStats: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/active-rooms/stats`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy thống kê phòng');
      }
    }
  }
};

// Interceptor để xử lý token expires
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && adminAPI.isAuthenticated()) {
      adminAPI.logout();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminAPI;
