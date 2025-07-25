import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// Tạo instance axios với cấu hình cơ bản
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
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
      // Lưu token vào localStorage nếu có
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      // Lưu token vào localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise<Object>} Thông tin người dùng
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Xử lý lỗi 401 (Unauthorized) - xóa token nếu hết hạn
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
      }
      throw this.handleError(error);
    }
  },

  /**
   * Cập nhật thông tin cá nhân
   * @param {Object} userData - Thông tin cập nhật
   * @param {string} [userData.name] - Tên mới
   * @param {string} [userData.email] - Email mới
   * @returns {Promise<Object>} Thông tin người dùng đã cập nhật
   */
  updateDetails: async (userData) => {
    try {
      const response = await api.put('/auth/updatedetails', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      throw this.handleError(error);
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
      throw this.handleError(error);
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
      throw this.handleError(error);
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
