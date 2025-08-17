import axios from 'axios';
import { toast } from 'react-toastify';
import TokenUtils from '../utils/tokenUtils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor cho admin - sử dụng admin token
adminApi.interceptors.request.use(
  (config) => {
    const token = TokenUtils.getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor cho admin
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý 401 cho admin
      const isAuthEndpoint = error.config.url.includes('/auth');
      if (isAuthEndpoint) {
        TokenUtils.removeAdminToken();
        toast.error('Phiên đăng nhập admin đã hết hạn. Vui lòng đăng nhập lại.', {
          position: "top-right",
          autoClose: 3000,
        });
        return Promise.resolve({ data: null, success: false, message: 'Unauthorized' });
      }
    }
    return Promise.reject(error);
  }
);

const AdminAuthAPI = {
  /**
   * Đăng nhập admin
   * @param {Object} credentials - Thông tin đăng nhập
   * @param {string} credentials.email - Email
   * @param {string} credentials.password - Mật khẩu
   * @returns {Promise<Object>} Thông tin admin và token
   */
  login: async (credentials) => {
    try {
      const response = await adminApi.post('/auth/login', credentials);
      
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return { success: false, message: 'Đăng nhập thất bại' };
      }

      // Kiểm tra role admin
      if (response.data.success && response.data.user.role === 'admin') {
        // Lưu admin token
        if (response.data.token) {
          TokenUtils.setAdminToken(response.data.token);
        }
        return response.data;
      } else {
        return { 
          success: false, 
          message: 'Bạn không có quyền truy cập vào trang quản trị' 
        };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { 
        success: false, 
        message: 'Thông tin đăng nhập chưa chính xác' 
      };
    }
  },

  /**
   * Lấy thông tin admin hiện tại
   * @returns {Promise<Object>} Thông tin admin
   */
  getMe: async () => {
    try {
      const response = await adminApi.get('/auth/me');
      
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return { success: false, message: 'Không thể lấy thông tin admin' };
      }

      // Kiểm tra role admin
      if (response.data.success && response.data.user.role === 'admin') {
        return response.data;
      } else {
        TokenUtils.removeAdminToken();
        return { success: false, message: 'Không có quyền admin' };
      }
    } catch (error) {
      console.error('Get admin info error:', error);
      return { success: false, message: 'Lỗi khi lấy thông tin admin' };
    }
  },

  /**
   * Đăng xuất admin
   * @returns {Promise<Object>} Kết quả đăng xuất
   */
  logout: async () => {
    try {
      const response = await adminApi.get('/auth/logout');
      // Xóa admin token khỏi localStorage khi đăng xuất
      TokenUtils.removeAdminToken();
      return response.data;
    } catch (error) {
      // Vẫn xóa token ngay cả khi có lỗi
      TokenUtils.removeAdminToken();
      console.error('Admin logout error:', error);
      return { success: true }; // Vẫn return success để UI có thể logout
    }
  },

  /**
   * Kiểm tra xem admin đã đăng nhập chưa
   * @returns {boolean} Đã đăng nhập hay chưa
   */
  isAuthenticated: () => {
    return TokenUtils.isAdminAuthenticated();
  },

  /**
   * Lấy admin token từ localStorage
   * @returns {string|null} Token hoặc null nếu không có
   */
  getToken: () => {
    return TokenUtils.getAdminToken();
  }
};

export default AdminAuthAPI;
