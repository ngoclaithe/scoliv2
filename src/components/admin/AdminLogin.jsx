import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Input from '../common/Input';
import Loading from '../common/Loading';

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
      // Demo login - in production you would validate credentials
      if (formData.email === 'admin@demo.com' && formData.password === 'admin123') {
        const adminData = {
          id: 'admin-1',
          name: 'Admin Demo',
          email: 'admin@demo.com',
          role: 'admin'
        };
        
        onLogin(adminData);
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100">
            <LockClosedIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Quản trị hệ thống livestream
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email admin"
              error={error && !formData.email ? 'Email là bắt buộc' : ''}
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                error={error && !formData.password ? 'Mật khẩu là bắt buộc' : ''}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Lỗi đăng nhập
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loading size="sm" color="white" />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
                  </span>
                  Đăng nhập
                </>
              )}
            </Button>
          </div>

          {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Email:</strong> admin@demo.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
