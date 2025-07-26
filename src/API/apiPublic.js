import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// Tạo instance axios cho public API (không cần token)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PublicAPI = {
  /**
   * Xác thực mã truy cập cho hiển thị công khai (không cần token)
   * @param {string} code - Mã truy cập
   * @returns {Promise<Object>} Thông tin xác thực và dữ liệu trận đấu
   */
  verifyAccessCode: async (code) => {
    try {
      const response = await publicApi.get(`/access-codes/${code}/verify-login`);
      return response.data;
    } catch (error) {
      throw PublicAPI.handleError(error);
    }
  },

  /**
   * Lấy thông tin trận đấu công khai
   * @param {string} code - Mã truy cập
   * @returns {Promise<Object>} Thông tin trận đấu
   */
  getMatchInfo: async (code) => {
    try {
      const response = await publicApi.get(`/access-codes/${code}/match`);
      return response.data;
    } catch (error) {
      throw PublicAPI.handleError(error);
    }
  },

  /**
   * Kiểm tra trạng thái mã truy cập công khai
   * @param {string} code - Mã truy cập
   * @returns {Promise<Object>} Thông tin trạng thái
   */
  checkCodeStatus: async (code) => {
    try {
      const response = await publicApi.get(`/access-codes/${code}/status`);
      return response.data;
    } catch (error) {
      throw PublicAPI.handleError(error);
    }
  },

  /**
   * Xử lý lỗi từ API
   * @private
   * @param {Error} error - Lỗi từ axios
   * @throws {Error} Lỗi đã được xử lý
   */
  handleError: (error) => {
    if (error.response) {
      // Lỗi từ phản hồi của server
      const message = error.response.data?.message || 'Đã có lỗi xảy ra';
      const status = error.response.status;
      
      const errorWithStatus = new Error(message);
      errorWithStatus.status = status;
      errorWithStatus.details = error.response.data?.errors;
      
      throw errorWithStatus;
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
    } else {
      // Lỗi khi thiết lập request
      throw new Error('Đã xảy ra lỗi khi thiết lập yêu cầu: ' + error.message);
    }
  }
};

export default PublicAPI;
