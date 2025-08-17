import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const { login, loginWithCode, register, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [codeForm, setCodeForm] = useState('');
  const [showCodeLogin, setShowCodeLogin] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');



  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password length
    if (registerForm.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) {
      setError('Email phải có dạng xxx@yyy.com');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!registerForm.terms) {
      setError('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }

    // Chỉ gửi các trường cần thiết lên backend
    const userData = {
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role: 'user' // Mặc định là user
    };

    const result = await register(userData);
    if (result.success) {
      resetForms();
    } else {
      setError(result.error);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginWithCode(codeForm);
    if (result.success) {
      resetForms();
    } else {
      setError(result.error);
    }
  };

  const handleAccessCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (accessCode.trim()) {
      // Đăng nhập bằng code
      const result = await loginWithCode(accessCode.trim());
      if (result.success) {
        resetForms();
      } else {
        setError(result.error);
      }
    } else if (loginForm.email.trim() && loginForm.password.trim()) {
      // Đăng nhập bằng tài khoản
      const result = await login(loginForm);
      if (result.success) {
        resetForms();
      } else {
        setError(result.error);
      }
    } else {
      setError('Vui lòng chọn một cách đăng nhập');
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '', rememberMe: false });
    setRegisterForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    });
    setCodeForm('');
    setAccessCode('');
    setShowRegister(false);
    setShowCodeLogin(false);
    setError('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/images/basic/background_login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl relative z-10">
        {/* Header */}
        <div className="text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-2xl">⚽</span>
          </div>
          <h1 className="text-white text-sm font-bold">scoliv</h1>
        </div>

        <div className="p-4">
          {!showRegister && !showCodeLogin ? (
            // Form đăng nhập chính
            <div>
              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                  {error}
                </div>
              )}

              {/* Section 2: Đăng nhập bằng mã trận đấu */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    <span className="mr-1">🔑</span>
                    Đăng nhập bằng mã trận đấu
                  </h3>
                </div>

                <form className="space-y-3" onSubmit={(e) => {
                  e.preventDefault();
                  setError('');
                  if (accessCode.trim()) {
                    handleAccessCodeSubmit(e);
                  } else {
                    setError('Vui lòng nhập mã trận đấu');
                  }
                }}>
                  <div>
                    <Input
                      type="text"
                      placeholder="Nhập mã trận đấu"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="w-full text-center font-mono text-sm"
                      required={loginForm.email.trim() === '' && loginForm.password.trim() === ''}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-2 rounded text-sm"
                    disabled={loginForm.email.trim() !== '' || loginForm.password.trim() !== ''}
                  >
                    {loading ? "Đang xử lý..." : "Vào trận"}
                  </Button>
                </form>
              </div>

              {/* Divider */}
              <div className="my-4 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="mx-3 text-xs text-gray-500 font-medium">HOẶC</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Section 1: Đăng nhập bằng tài khoản */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Đăng nhập bằng tài khoản</h3>
                </div>

                <form className="space-y-3" onSubmit={(e) => {
                  e.preventDefault();
                  setError('');
                  handleAccessCodeSubmit(e);
                }}>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                      className="w-full text-sm"
                      required={!accessCode.trim()}
                    />
                  </div>

                  <div>
                    <Input
                      type="password"
                      placeholder="Mật khẩu"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                      className="w-full text-sm"
                      required={!accessCode.trim()}
                    />
                  </div>

                  <div className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm(prev => ({...prev, rememberMe: e.target.checked}))}
                      className="h-3 w-3 text-blue-600"
                    />
                    <label htmlFor="remember" className="ml-1 text-gray-600">
                      Ghi nhớ
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 rounded text-sm"
                    disabled={accessCode.trim() !== ''}
                  >
                    {loading ? "Đang xử lý..." : "Đăng nhập"}
                  </Button>
                </form>
              </div>



              <div className="mt-3 space-y-2 text-center text-xs text-gray-600">
  
                <div>
                  Chưa có tài khoản?{' '}
                  <button
                    onClick={() => setShowRegister(true)}
                    className="text-blue-600 font-medium"
                  >
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          ) : showCodeLogin ? (
            // Form đăng nhập bằng mã
            <div>
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-lg">🔑</span>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Quản lý trận (chỉ code)</h2>
                <p className="text-xs text-gray-600 mt-1">
                  Chỉ để quản lý trận đấu, không thể mua code
                </p>
              </div>

              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                  {error}
                </div>
              )}

              <form className="space-y-3" onSubmit={handleCodeSubmit}>
                <div>
                  <Input
                    type="text"
                    placeholder="Nhập mã trận đấu"
                    value={codeForm}
                    onChange={(e) => setCodeForm(e.target.value)}
                    className="w-full text-center font-mono text-sm"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-2 rounded text-sm"
                >
                  {loading ? "Đang xử lý..." : "Gửi"}
                </Button>
              </form>

              <div className="mt-3 text-center text-xs">
                <button
                  onClick={() => setShowCodeLogin(false)}
                  className="text-blue-600"
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </div>
          ) : (
            // Form đăng ký
            <div>
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Đăng ký tài khoản</h2>
              </div>

              {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                  {error}
                </div>
              )}

              <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                <Input
                  type="text"
                  placeholder="Họ và tên"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm(prev => ({...prev, name: e.target.value}))}
                  className="w-full text-sm"
                  required
                />

                <Input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full text-sm"
                  required
                />

                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                  className="w-full text-sm"
                  required
                />

                <Input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm(prev => ({...prev, confirmPassword: e.target.value}))}
                  className="w-full text-sm"
                  required
                />

                <div className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={registerForm.terms}
                    onChange={(e) => setRegisterForm(prev => ({...prev, terms: e.target.checked}))}
                    className="h-3 w-3 text-blue-600"
                    required
                  />
                  <label htmlFor="terms" className="ml-1 text-gray-600">
                    Đồng ý điều khoản
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-2 rounded text-sm"
                >
                  {loading ? "Đang xử lý..." : "Gửi"}
                </Button>
              </form>

              <div className="mt-3 text-center text-xs">
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-600"
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-2 bg-gray-50 rounded-b-lg">
          <a
            href="tel:0923415678"
            className="text-xs text-gray-600 hover:text-blue-600"
          >
            📞 Hotline: 0923415678
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;