import axios from 'axios';
import { toast } from 'react-toastify';
import TokenUtils from '../utils/tokenUtils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = TokenUtils.getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Chỉ xử lý 401 cho auth-related endpoints
      const isAuthEndpoint = error.config.url.includes('/auth');
      if (isAuthEndpoint) {
        TokenUtils.removeUserToken();
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
          position: "top-right",
          autoClose: 3000,
        });
        // Không throw error, return rejected promise với null data
        return Promise.resolve({ data: null, success: false, message: 'Unauthorized' });
      }
    }
    return Promise.reject(error);
  }
);

const AuthAPI = {
  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Thông tin đăng ký
   * @param {string} userData.name - Họ và tên
   * @param {string} userData.email - Email
   * @param {string} userData.password - Mật khẩu
   * @param {string} [userData.role=user] - Vai trò (mặc định là 'user')
   * @returns {Promise<Object>} Thông tin người dùng đã đăng ký
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return null;
      }
      if (response.data.token) {
        TokenUtils.setUserToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      // Xử lý các lỗi khác (không phải 401)
      if (error.response && error.response.status === 401) {
        toast.error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.', {
          position: "top-right",
          autoClose: 3000,
        });
        return null;
      }
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Đăng nhập
   * @param {Object} credentials - Thông tin đăng nhập
   * @param {string} credentials.email - Email
   * @param {string} credentials.password - Mật khẩu
   * @returns {Promise<Object>} Thông tin người dùng và token
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return null;
      }
      // Lưu user token
      if (response.data.token) {
        TokenUtils.setUserToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      // Xử lý các lỗi khác (không phải 401)
      if (error.response && error.response.status === 401) {
        toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', {
          position: "top-right",
          autoClose: 3000,
        });
        return null;
      }
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise<Object>} Thông tin người dùng
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return null;
      }
      return response.data;
    } catch (error) {
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Cập nhật thông tin cá nhân
   * @param {Object} userData - Thông tin cập nhật
   * @param {string} [userData.name] - Tên mới
   * @param {string} [userData.email] - Email mới
   * @returns {Promise<Object>} Thông tin người d��ng đã cập nhật
   */
  updateDetails: async (userData) => {
    try {
      const response = await api.put('/auth/updatedetails', userData);
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return null;
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        TokenUtils.removeUserToken();
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
          position: "top-right",
          autoClose: 3000,
        });
        return null;
      }
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Đổi mật khẩu
   * @param {Object} passwords - Thông tin mật khẩu
   * @param {string} passwords.currentPassword - Mật khẩu hiện tại
   * @param {string} passwords.newPassword - Mật khẩu mới
   * @returns {Promise<Object>} Kết quả đổi mật khẩu
   */
  updatePassword: async (passwords) => {
    try {
      const response = await api.put('/auth/updatepassword', passwords);
      // Kiểm tra nếu interceptor đã xử lý 401
      if (response.data === null && response.success === false) {
        return null;
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        TokenUtils.removeUserToken();
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
          position: "top-right",
          autoClose: 3000,
        });
        return null;
      }
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Yêu cầu đặt lại mật khẩu
   * @param {string} email - Email đăng ký
   * @returns {Promise<Object>} Kết quả yêu cầu
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgotpassword', { email });
      return response.data;
    } catch (error) {
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Đặt lại mật khẩu
   * @param {string} resetToken - Token đặt lại mật khẩu
   * @param {string} password - Mật khẩu mới
   * @returns {Promise<Object>} Kết quả đặt lại mật khẩu
   */
  resetPassword: async (resetToken, password) => {
    try {
      const response = await api.put(`/auth/resetpassword/${resetToken}`, { password });
      return response.data;
    } catch (error) {
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Đăng xuất
   * @returns {Promise<Object>} Kết quả đăng xuất
   */
  logout: async () => {
    try {
      const response = await api.get('/auth/logout');
      // Xóa token khỏi localStorage khi đăng xuất
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      // Vẫn xóa token ngay cả khi có lỗi
      localStorage.removeItem('token');
      throw AuthAPI.handleError(error);
    }
  },

  /**
   * Kiểm tra xem người dùng đã đăng nhập chưa
   * @returns {boolean} Đã đăng nhập hay chưa
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Lấy token từ localStorage
   * @returns {string|null} Token hoặc null nếu không có
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Xử lý lỗi từ API
   * @private
   */
  handleError: (error) => {
    if (error.response) {
      // Yêu cầu đã được gửi và server đã phản hồi với mã lỗi
      const { status, data } = error.response;
      const message = data?.message || 'Đã có lỗi xảy ra';
      
      // Tạo thông báo lỗi chi tiết hơn nếu có
      let errorMessage = message;
      if (status === 400 && data.errors) {
        // Xử lý lỗi validate
        errorMessage = Object.values(data.errors).join('\n');
      }
      
      return new Error(`Lỗi (${status}): ${errorMessage}`);
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi
      return new Error('Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Lỗi khi thiết lập yêu cầu
      return new Error(`Lỗi yêu cầu: ${error.message}`);
    }
  },
};

export default AuthAPI;
