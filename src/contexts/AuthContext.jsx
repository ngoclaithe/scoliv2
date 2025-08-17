import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthAPI from '../API/apiAuth';
import AccessCodeAPI from '../API/apiAccessCode';
import TokenUtils from '../utils/tokenUtils';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authType, setAuthType] = useState(null); // 'account', 'code', 'full'
  const [matchCode, setMatchCode] = useState(null); // Code trận đấu hiện tại
  const [codeOnly, setCodeOnly] = useState(false); // Đăng nhập chỉ bằng code
  const [typeMatch, setTypeMatch] = useState('soccer'); // 'soccer', 'pickleball'

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);

      // Migration token cũ trước khi check
      TokenUtils.migrateOldTokens();

      if (TokenUtils.isUserAuthenticated()) {
        const token = TokenUtils.getUserToken();
        if (token && token.includes('fake-user-token')) {
          // Demo user
          const userData = {
            id: 'user-demo',
            email: 'demo@user.com',
            name: 'User Demo',
            role: 'user',
            avatar: null
          };
          setUser(userData);
          setIsAuthenticated(true);
          setAuthType('account');
          setCodeOnly(false);
        } else {
          // Thực tế call API
          try {
            const userData = await AuthAPI.getMe();
            if (userData && userData.role !== 'admin') {
              setUser({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                avatar: userData.avatar
              });
              setIsAuthenticated(true);
              setAuthType('account'); // User account từ API
              setCodeOnly(false);
            } else {
              // Nếu là admin, không được đăng nhập ở user context
              TokenUtils.removeUserToken();
            }
          } catch (apiError) {
            // Nếu API fail, clear token
            TokenUtils.removeUserToken();
          }
        }
      }
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
      TokenUtils.removeUserToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    try {
      setLoading(true);

      if (credentials.email === 'demo@user.com' && credentials.password === 'demo123') {
        const userData = {
          id: 'user-demo',
          email: 'demo@user.com',
          name: 'User Demo',
          role: 'user',
          avatar: null
        };

        setUser(userData);
        setCodeOnly(false);
        setAuthType('account'); 
        setIsAuthenticated(true);

        TokenUtils.setUserToken('fake-user-token');

        return { success: true, user: userData };
      }

      const { user: userData } = await AuthAPI.login(credentials);

      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar: userData.avatar
      });

      setCodeOnly(false);
      setAuthType('account'); 
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithCode = async (code) => {
    try {
      setLoading(true);

      const response = await AccessCodeAPI.verifyCodeForLogin(code);

      if (response.success && response.isValid) {
        const matchInfo = response.data?.match;
        const typeMatch = response.data?.type_match || 'soccer';
        const userData = {
          id: 'code-user-' + code,
          email: null,
          name: matchInfo ? `${matchInfo.teamAName} vs ${matchInfo.teamBName}` : `Code User - ${code}`,
          role: 'code-only',
          avatar: null
        };

        setUser(userData);
        setMatchCode(code);
        setCodeOnly(true);
        setAuthType('code');
        setIsAuthenticated(true);
        setTypeMatch(typeMatch);

        return {
          success: true,
          user: userData,
          matchInfo: matchInfo,
          typeMatch: typeMatch
        };
      } else {
        return {
          success: false,
          error: response.message || 'Mã không hợp lệ. Vui lòng thử lại.'
        };
      }
    } catch (error) {
      console.error('Lỗi đăng nhập với code:', error);
      return {
        success: false,
        error: error.message || 'Mã không hợp lệ. Vui lòng thử lại.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await AuthAPI.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user' 
      });

      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        avatar: response.user.avatar
      });

      setCodeOnly(false);
      setAuthType('account');
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      // Chỉ clear user token, không động đến admin token
      TokenUtils.removeUserToken();
      setUser(null);
      setIsAuthenticated(false);
      setAuthType(null);
      setMatchCode(null);
      setCodeOnly(false);
      setTypeMatch('soccer');
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await AuthAPI.updateDetails(userData);
      
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email
      }));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await AuthAPI.updatePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await AuthAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await AuthAPI.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const enterMatchCode = async (code) => {
    try {
      setLoading(true);

      const response = await AccessCodeAPI.verifyCodeForLogin(code);
      if (response.success && response.isValid) {
        const typeMatch = response.data?.type_match || 'soccer';
        setMatchCode(code);
        setAuthType('full'); // Có cả tài khoản và code
        setTypeMatch(typeMatch);
        return {
          success: true,
          matchData: response.data?.match,
          codeInfo: response.data,
          typeMatch: typeMatch
        };
      } else {
        return {
          success: false,
          error: response.message || 'Mã trận đấu không hợp lệ.'
        };
      }
    } catch (error) {
      console.error('Lỗi xác thực mã trận đấu:', error);
      return {
        success: false,
        error: error.message || 'Mã trận đấu không hợp lệ.'
      };
    } finally {
      setLoading(false);
    }
  };

  const clearMatchCode = () => {
    setMatchCode(null);
    setTypeMatch('soccer');
    if (authType === 'full') {
      setAuthType('account');
    }
  };

  // Hàm kiểm tra và xử lý lỗi hết hạn truy cập
  const handleExpiredAccess = useCallback((error) => {
    if (error?.message && error.message.includes('Mã truy cập đã bị hết hạn')) {
      toast.error('Mã truy cập đã hết hạn. Đang đăng xuất...', {
        position: "top-center",
        autoClose: 3000,
      });

      // Delay logout một chút để user thấy thông báo
      setTimeout(() => {
        logout();
        // Redirect về trang login hoặc home
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }, 1000);

      return true; // Đã xử lý error
    }
    return false; // Không phải lỗi hết hạn
  }, [logout]);

  const hasAccountAccess = authType === 'account' || authType === 'full';
  const hasMatchAccess = authType === 'code' || authType === 'full';
  const canAccessProfile = hasAccountAccess && !codeOnly;

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithCode,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    // Thêm các giá trị mới
    authType,
    matchCode,
    codeOnly,
    typeMatch,
    hasAccountAccess,
    hasMatchAccess,
    canAccessProfile,
    enterMatchCode,
    clearMatchCode,
    handleExpiredAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
