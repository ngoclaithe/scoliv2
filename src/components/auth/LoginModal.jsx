import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, loginWithCode, register, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
      onClose();
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

    const result = await register(registerForm);
    if (result.success) {
      onClose();
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
      onClose();
      resetForms();
    } else {
      setError(result.error);
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '', rememberMe: false });
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    });
    setCodeForm('');
    setShowRegister(false);
    setShowCodeLogin(false);
    setError('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      size="md"
      className="overflow-hidden"
    >
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg">
        {!showRegister && !showCodeLogin ? (
          // Login Form
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
              <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email hoặc Tên đăng nhập
                </label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full"
                  required
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                  className="w-full"
                  required
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm(prev => ({...prev, rememberMe: e.target.checked}))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-500">Hoặc</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowCodeLogin(true)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="mr-2">🔑</span>
                  Đăng nhập bằng mã code
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        ) : showCodeLogin ? (
          // Code Login Form
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">🔑</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập bằng mã</h2>
              <p className="text-gray-600">Nhập mã code để truy cập</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleCodeSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã code
                </label>
                <Input
                  type="text"
                  placeholder="Nhập mã code (demo: ffff)"
                  value={codeForm}
                  onChange={(e) => setCodeForm(e.target.value)}
                  className="w-full text-center font-mono"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {loading ? "Đang xử lý..." : "Xác Nhận"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => setShowCodeLogin(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ← Quay lại đăng nhập thường
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Register Form
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng Ký</h2>
              <p className="text-gray-600">Tạo tài khoản mới để sử dụng dịch vụ</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  <Input
                    type="text"
                    placeholder="Nguyễn"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm(prev => ({...prev, firstName: e.target.value}))}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <Input
                    type="text"
                    placeholder="Văn A"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm(prev => ({...prev, lastName: e.target.value}))}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({...prev, email: e.target.value}))}
                  className="w-full"
                  required
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <Input
                  type="tel"
                  placeholder="0901234567"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm(prev => ({...prev, phone: e.target.value}))}
                  className="w-full"
                  required
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({...prev, password: e.target.value}))}
                  className="w-full"
                  required
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm(prev => ({...prev, confirmPassword: e.target.value}))}
                  className="w-full"
                  required
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={registerForm.terms}
                  onChange={(e) => setRegisterForm(prev => ({...prev, terms: e.target.checked}))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Điều khoản sử dụng
                  </a>
                  {' '}và{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Chính sách bảo mật
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {loading ? "Đang đăng ký..." : "Đăng Ký"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  onClick={() => setShowRegister(false)}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
