/**
 * Utility để quản lý token riêng biệt cho user và admin
 * Tránh tình trạng conflict token giữa route / và /admin
 */

const TOKEN_KEYS = {
  USER: 'user_token',
  ADMIN: 'admin_token'
};

const TokenUtils = {
  // User token methods
  setUserToken: (token) => {
    localStorage.setItem(TOKEN_KEYS.USER, token);
    // Đảm bảo clear admin token khi set user token
    localStorage.removeItem(TOKEN_KEYS.ADMIN);
  },

  getUserToken: () => {
    return localStorage.getItem(TOKEN_KEYS.USER);
  },

  removeUserToken: () => {
    localStorage.removeItem(TOKEN_KEYS.USER);
  },

  // Admin token methods
  setAdminToken: (token) => {
    localStorage.setItem(TOKEN_KEYS.ADMIN, token);
    // Đảm bảo clear user token khi set admin token  
    localStorage.removeItem(TOKEN_KEYS.USER);
  },

  getAdminToken: () => {
    return localStorage.getItem(TOKEN_KEYS.ADMIN);
  },

  removeAdminToken: () => {
    localStorage.removeItem(TOKEN_KEYS.ADMIN);
  },

  // Common methods
  isUserAuthenticated: () => {
    return !!TokenUtils.getUserToken();
  },

  isAdminAuthenticated: () => {
    return !!TokenUtils.getAdminToken();
  },

  // Lấy token cho context hiện tại (user hoặc admin)
  getCurrentToken: (isAdminContext = false) => {
    return isAdminContext ? TokenUtils.getAdminToken() : TokenUtils.getUserToken();
  },

  // Clear tất cả tokens
  clearAllTokens: () => {
    localStorage.removeItem(TOKEN_KEYS.USER);
    localStorage.removeItem(TOKEN_KEYS.ADMIN);
    // Cũng clear token cũ để tương thích
    localStorage.removeItem('token');
  },

  // Migration: Convert old token format
  migrateOldTokens: () => {
    const oldToken = localStorage.getItem('token');
    if (oldToken) {
      // Nếu có token cũ, di chuyển nó thành user token và clear token cũ
      if (oldToken.includes('admin')) {
        TokenUtils.setAdminToken(oldToken);
      } else {
        TokenUtils.setUserToken(oldToken);
      }
      localStorage.removeItem('token');
    }
  }
};

export default TokenUtils;
