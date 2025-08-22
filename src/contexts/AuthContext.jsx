import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthAPI from '../API/apiAuth';
import AccessCodeAPI from '../API/apiAccessCode';
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

  const [authType, setAuthType] = useState(null); 
  const [matchCode, setMatchCode] = useState(null); 
  const [codeOnly, setCodeOnly] = useState(false); 
  const [typeMatch, setTypeMatch] = useState('soccer'); 

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      if (AuthAPI.isAuthenticated()) {
        const token = AuthAPI.getToken();
        if (token && (token.includes('user-token') || token.includes('admin-token'))) {
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
          try {
            const userData = await AuthAPI.getMe();
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              avatar: userData.avatar
            });
            setIsAuthenticated(true);
            setAuthType('account');
            setCodeOnly(false);
          } catch (apiError) {
            AuthAPI.logout();
          }
        }
      }
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
      AuthAPI.logout();
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

        localStorage.setItem('token', 'fake-user-token');

        toast.success('Đăng nhập thành công!');
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
      
      toast.success('Đăng nhập thành công!');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
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

        toast.success('Đăng nhập bằng mã thành công!');

        return {
          success: true,
          user: userData,
          matchInfo: matchInfo,
          typeMatch: typeMatch
        };
      } else {
        const errorMessage = response.message || 'Mã không hợp lệ. Vui lòng thử lại.';
        toast.error(errorMessage);
        
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Lỗi đăng nhập với code:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Mã không hợp lệ. Vui lòng thử lại.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      console.log('Đăng ký với dữ liệu:', userData);

      const response = await AuthAPI.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user' 
      });

      console.log('Phản hồi đăng ký thành công:', response);

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
      
      toast.success('Đăng ký thành công!');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      console.error('Chi tiết lỗi:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      let errorDetails = [];

      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorDetails = error.response.data.errors;
          errorMessage = error.response.data.message || 'Đăng ký thất bại';
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.log('Thông báo lỗi sẽ hiển thị:', errorMessage);
      console.log('Chi tiết lỗi:', errorDetails);

      if (errorDetails.length > 0) {
        errorDetails.forEach(detail => {
          toast.error(detail, {
            position: "top-right",
            autoClose: 5000,
          });
        });
      } else {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }

      return {
        success: false,
        error: errorMessage,
        errors: errorDetails
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
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
      console.log('Cập nhật profile với dữ liệu:', userData);
      
      const updatedUser = await AuthAPI.updateDetails(userData);
      
      console.log('Cập nhật profile thành công:', updatedUser);
      
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email
      }));
      
      toast.success('Cập nhật thông tin thành công!');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Cập nhật thông tin thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      console.log('Đổi mật khẩu...');
      
      await AuthAPI.updatePassword({ currentPassword, newPassword });
      
      console.log('Đổi mật khẩu thành công');
      toast.success('Đổi mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Đổi mật khẩu thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      console.log('Gửi yêu cầu reset mật khẩu cho email:', email);
      
      await AuthAPI.forgotPassword(email);
      
      console.log('Gửi email reset mật khẩu thành công');
      toast.success('Email đặt lại mật khẩu đã được gửi!');
      return { success: true };
    } catch (error) {
      console.error('Lỗi gửi email reset mật khẩu:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Gửi email thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      console.log('Đặt lại mật khẩu với token:', token);
      
      await AuthAPI.resetPassword(token, newPassword);
      
      console.log('Đặt lại mật khẩu thành công');
      toast.success('Đặt lại mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Đặt lại mật khẩu thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const enterMatchCode = async (code) => {
    try {
      setLoading(true);
      console.log('Nhập mã trận đấu:', code);

      const response = await AccessCodeAPI.verifyCodeForLogin(code);
      if (response.success && response.isValid) {
        const typeMatch = response.data?.type_match || 'soccer';
        setMatchCode(code);
        setAuthType('full');
        setTypeMatch(typeMatch);
        
        console.log('Nhập mã trận đấu thành công:', response.data);
        toast.success('Nhập mã trận đấu thành công!');
        
        return {
          success: true,
          matchData: response.data?.match,
          codeInfo: response.data,
          typeMatch: typeMatch
        };
      } else {
        const errorMessage = response.message || 'Mã trận đấu không hợp lệ.';
        console.log('Mã trận đấu không hợp lệ:', errorMessage);
        toast.error(errorMessage);
        
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Lỗi xác thực mã trận đấu:', error);
      
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message 
        || error.message 
        || 'Mã trận đấu không hợp lệ.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
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
    console.log('Đã xóa mã trận đấu');
  };

  const handleExpiredAccess = useCallback((error) => {
    if (error?.message && error.message.includes('Mã truy cập đã bị hết hạn')) {
      console.log('Mã truy cập đã hết hạn, đang đăng xuất...');
      
      toast.error('Mã truy cập đã hết hạn. Đang đăng xuất...', {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        logout();
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }, 1000);

      return true; 
    }
    return false; 
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