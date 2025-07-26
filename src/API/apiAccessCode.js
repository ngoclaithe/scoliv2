import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API để xác thực access code
export const verifyAccessCode = async (code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-code`, {
      code: code
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Lỗi khi xác thực mã code'
    };
  }
};

// API để xác thực mã trận đấu
export const verifyMatchCode = async (code, userToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/match/verify-code`, {
      code: code
    }, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Lỗi khi xác thực mã trận đấu'
    };
  }
};

// API để lấy thông tin trận đấu từ access code
export const getMatchDataByCode = async (code) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/match/by-code/${code}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Lỗi khi lấy thông tin trận đấu'
    };
  }
};

// API để cập nhật thông tin trận đấu
export const updateMatchData = async (code, matchData, userToken) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/match/update/${code}`, {
      matchData: matchData
    }, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Lỗi khi cập nhật thông tin trận đấu'
    };
  }
};

// API để cập nhật poster và logo
export const updatePosterLogo = async (code, posterData, logoData, userToken) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/match/poster-logo/${code}`, {
      posterData: posterData,
      logoData: logoData
    }, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Lỗi khi cập nhật poster và logo'
    };
  }
};

export default {
  verifyAccessCode,
  verifyMatchCode,
  getMatchDataByCode,
  updateMatchData,
  updatePosterLogo
};
