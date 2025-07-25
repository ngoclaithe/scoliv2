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

const AccessCodeAPI = {
  /**
   * Tạo mã truy cập mới
   * @param {Object} codeData - Thông tin mã truy cập
   * @param {string} codeData.name - Tên mô tả cho mã
   * @param {number} codeData.duration - Thời gian sử dụng (giờ)
   * @param {string} [codeData.description] - Mô tả chi tiết
   * @returns {Promise<Object>} Thông tin mã truy cập đã tạo
   */
  createCode: async (codeData) => {
    try {
      const response = await api.post('/access-codes', codeData);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy danh sách mã truy cập của người dùng
   * @param {Object} params - Tham số lọc
   * @param {number} [params.page=1] - Trang hiện tại
   * @param {number} [params.limit=10] - Số lượng mỗi trang
   * @param {string} [params.status] - Trạng thái (active, expired, used)
   * @returns {Promise<Object>} Danh sách mã truy cập
   */
  getCodes: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/access-codes?${queryParams}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy thông tin chi tiết một mã truy cập
   * @param {string} codeId - ID của mã truy cập
   * @returns {Promise<Object>} Thông tin chi tiết mã truy cập
   */
  getCodeById: async (codeId) => {
    try {
      const response = await api.get(`/access-codes/${codeId}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Cập nhật thông tin mã truy cập
   * @param {string} codeId - ID của mã truy cập
   * @param {Object} updateData - Dữ liệu cập nhật
   * @param {string} [updateData.name] - Tên mới
   * @param {string} [updateData.description] - Mô tả mới
   * @param {boolean} [updateData.isActive] - Trạng thái hoạt động
   * @returns {Promise<Object>} Thông tin mã truy cập đã cập nhật
   */
  updateCode: async (codeId, updateData) => {
    try {
      const response = await api.put(`/access-codes/${codeId}`, updateData);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Xóa mã truy cập
   * @param {string} codeId - ID của mã truy cập
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteCode: async (codeId) => {
    try {
      const response = await api.delete(`/access-codes/${codeId}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Gia hạn mã truy cập
   * @param {string} codeId - ID của mã truy cập
   * @param {number} additionalHours - Số giờ gia hạn thêm
   * @returns {Promise<Object>} Thông tin mã truy cập sau khi gia hạn
   */
  extendCode: async (codeId, additionalHours) => {
    try {
      const response = await api.post(`/access-codes/${codeId}/extend`, {
        additionalHours
      });
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Kích hoạt/Vô hiệu hóa mã truy cập
   * @param {string} codeId - ID của mã truy cập
   * @param {boolean} isActive - Trạng thái kích hoạt
   * @returns {Promise<Object>} Kết quả thay đổi trạng thái
   */
  toggleCodeStatus: async (codeId, isActive) => {
    try {
      const response = await api.patch(`/access-codes/${codeId}/status`, {
        isActive
      });
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy thống kê sử dụng mã truy cập
   * @param {string} [timeRange='30d'] - Khoảng thời gian (7d, 30d, 90d)
   * @returns {Promise<Object>} Thống kê sử dụng
   */
  getUsageStats: async (timeRange = '30d') => {
    try {
      const response = await api.get(`/access-codes/stats?range=${timeRange}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Xác thực mã truy cập (dành cho việc đăng nhập bằng code)
   * @param {string} code - Mã truy cập cần xác thực
   * @returns {Promise<Object>} Kết quả xác thực
   */
  validateCode: async (code) => {
    try {
      const response = await api.post('/access-codes/validate', { code });
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy lịch sử sử dụng của một mã truy cập
   * @param {string} codeId - ID của mã truy cập
   * @param {Object} params - Tham số lọc
   * @param {number} [params.page=1] - Trang hiện tại
   * @param {number} [params.limit=10] - Số lượng mỗi trang
   * @returns {Promise<Object>} Lịch sử sử dụng
   */
  getCodeHistory: async (codeId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/access-codes/${codeId}/history?${queryParams}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
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
      // L��i khi thiết lập yêu cầu
      return new Error(`Lỗi yêu cầu: ${error.message}`);
    }
  }
};

export default AccessCodeAPI;
