import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Input from '../common/Input';
import Loading from '../common/Loading';
import AuthAPI from '../../API/apiAuth';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        if (response.user.role === 'admin') {
          onLogin(response.user);
        } else {
          setError('Bạn không có quyền truy cập vào trang quản trị');
          AuthAPI.logout();
        }
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div>
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
              <ShieldCheckIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">
              Đăng nhập Admin
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Quản trị hệ thống livestream
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>

              <div className="group relative">
                <label className="block text-sm font-medium text-white mb-2">
                  Mật khẩu
                </label>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu admin"
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-11 text-gray-400 hover:text-white transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 backdrop-blur-sm p-4 border border-red-500/20 animate-shake">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-400">
                      Lỗi đăng nhập
                    </h3>
                    <div className="mt-1 text-sm text-red-300">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loading size="sm" color="white" />
                    <span className="ml-2">Đang đăng nhập...</span>
                  </div>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors duration-200" />
                    </span>
                    Đăng nhập
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Chỉ dành cho quản trị viên hệ thống
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <ShieldCheckIcon className="h-4 w-4 mr-1" />
            Kết nối được bảo mật bằng SSL
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;