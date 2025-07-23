import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// Mock API functions
const mockAPI = {
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo: chấp nhận bất kỳ email/password nào hoặc code "ffff"
        if (credentials.code === 'ffff' || (credentials.email && credentials.password)) {
          resolve({
            user: {
              id: 1,
              email: credentials.email || 'demo@example.com',
              name: 'Người dùng Demo',
              avatar: null
            },
            token: 'demo-jwt-token-' + Date.now()
          });
        } else {
          reject(new Error('Thông tin đăng nhập không đúng'));
        }
      }, 1000);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: Date.now(),
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            avatar: null
          },
          token: 'demo-jwt-token-' + Date.now()
        });
      }, 1500);
    });
  },

  me: async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token && token.startsWith('demo-jwt-token')) {
          resolve({
            id: 1,
            email: 'demo@example.com',
            name: 'Người dùng Demo',
            avatar: null
          });
        } else {
          reject(new Error('Token không hợp lệ'));
        }
      }, 500);
    });
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token từ localStorage khi khởi tạo
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await mockAPI.me(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
        console.error('Lỗi xác thực:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await mockAPI.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', response.token);
      
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithCode = async (code) => {
    return login({ code });
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await mockAPI.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', response.token);
      
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithCode,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
