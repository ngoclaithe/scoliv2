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
    console.log("Giá trị của token trước khi gửi là ", token);
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
   * @param {string} [codeData.matchId] - ID của trận đấu
   * @param {string} [codeData.expiresAt] - Ngày hết hạn (ISO string)
   * @param {number} [codeData.maxUses=1] - Số lần sử dụng tối đa
   * @param {object} [codeData.metadata] - Thông tin bổ sung
   * @returns {Promise<Object>} Thông tin mã truy cập đã tạo
   */
  createCode: async (codeData) => {
    try {
      const response = await api.post('/access-codes', {
        matchId: codeData.matchId,
        expiresAt: codeData.expiresAt,
        maxUses: codeData.maxUses || 1,
        metadata: codeData.metadata || {}
      });
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy danh sách mã truy cập
   * @param {Object} params - Tham số lọc
   * @param {string} [params.status] - Trạng thái (active, used, expired, revoked)
   * @param {string} [params.matchId] - Lọc theo ID trận đấu
   * @param {string} [params.createdBy] - Lọc theo người tạo
   * @param {number} [params.page=1] - Số trang hiện tại
   * @param {number} [params.limit=10] - Số lượng kết quả mỗi trang
   * @returns {Promise<Object>} Danh sách mã truy cập
   */
  getCodes: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Thêm các tham số nếu có
      if (params.status) queryParams.append('status', params.status);
      if (params.matchId) queryParams.append('matchId', params.matchId);
      if (params.createdBy) queryParams.append('createdBy', params.createdBy);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/access-codes?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy thông tin chi tiết mã truy cập
   * @param {string} code - Mã truy cập
   * @returns {Promise<Object>} Thông tin chi tiết mã truy cập
   */
  getCode: async (code) => {
    try {
      const response = await api.get(`/access-codes/${code}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Cập nhật mã truy cập
   * @param {string} code - Mã truy cập cần cập nhật
   * @param {Object} updateData - Dữ liệu cập nhật
   * @param {string} [updateData.status] - Trạng thái mới
   * @param {string} [updateData.expiresAt] - Ngày hết hạn mới (ISO string)
   * @param {number} [updateData.maxUses] - Số lần sử dụng tối đa mới
   * @param {object} [updateData.metadata] - Thông tin bổ sung
   * @returns {Promise<Object>} Thông tin mã truy cập đã cập nhật
   */
  updateCode: async (code, updateData) => {
    try {
      const response = await api.put(`/access-codes/${code}`, updateData);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Xóa mã truy cập
   * @param {string} code - Mã truy cập cần xóa
   * @returns {Promise<Object>} Kết quả xóa
   */
  deleteCode: async (code) => {
    try {
      const response = await api.delete(`/access-codes/${code}`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Sử dụng mã truy cập
   * @param {string} code - Mã truy cập cần sử dụng
   * @returns {Promise<Object>} Kết quả sử dụng mã
   */
  useCode: async (code) => {
    try {
      const response = await api.post(`/access-codes/${code}/use`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Cập nhật thông tin trận đấu của mã truy cập
   * @param {string} code - Mã truy cập
   * @param {Object} matchData - Thông tin trận đấu
   * @param {string} [matchData.teamAName] - Tên đội A
   * @param {string} [matchData.teamBName] - Tên đội B
   * @param {string} [matchData.teamALogo] - URL logo đội A
   * @param {string} [matchData.teamBLogo] - URL logo đội B
   * @param {string} [matchData.tournamentName] - Tên giải đấu
   * @param {string} [matchData.tournamentLogo] - URL logo giải đấu
   * @param {string} [matchData.typeMatch] - Loại trận đấu (soccer, pickleball, other)
   * @param {string} [matchData.matchDate] - Ngày giờ diễn ra trận đấu (ISO string)
   * @returns {Promise<Object>} Thông tin trận đấu đã cập nhật
   */
  updateMatchInfo: async (code, matchData) => {
    try {
      const response = await api.put(`/access-codes/${code}/match`, matchData);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
    }
  },

  /**
   * Lấy thông tin trận đấu của mã truy cập
   * @param {string} code - Mã truy cập
   * @returns {Promise<Object>} Thông tin trận đấu
   */
  getMatchInfo: async (code) => {
    try {
      const response = await api.get(`/access-codes/${code}/match`);
      return response.data;
    } catch (error) {
      throw AccessCodeAPI.handleError(error);
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

export default AccessCodeAPI;