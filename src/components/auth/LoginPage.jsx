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
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(loginForm);
    if (result.success) {
      resetForms();
    } else {
      setError(result.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    setShowRegister(false);
    setShowCodeLogin(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-blue-800 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl">
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

              <form className="space-y-3" onSubmit={handleLoginSubmit}>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full text-sm"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                    className="w-full text-sm"
                    required
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
                >
                  {loading ? "Đang xử lý..." : "Gửi"}
                </Button>
              </form>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowCodeLogin(true)}
                  className="w-full py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  🔑 Chỉ quản lý trận (code only)
                </button>
              </div>

              <div className="mt-3 space-y-2 text-center text-xs text-gray-600">
                <div className="bg-blue-50 rounded p-2">
                  <div className="text-blue-800 font-medium">💡 Đăng nhập tài khoản:</div>
                  <div className="text-blue-700">Để mua code + quản lý trận (cần nhập code sau)</div>
                </div>
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
                    placeholder="Nhập mã (demo: ffff)"
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
