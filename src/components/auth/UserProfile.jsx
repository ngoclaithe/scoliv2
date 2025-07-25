import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const UserProfile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Cập nhật form data khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile({
        name: formData.name,
        email: formData.email,
      });

      if (result.success) {
        setSuccess('Cập nhật thông tin thành công');
        setIsEditing(false);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi cập nhật thông tin');
      console.error('Update profile error:', error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        setSuccess('Đổi mật khẩu thành công');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đổi mật khẩu');
      console.error('Change password error:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <h2 className="text-xl font-bold">Thông tin tài khoản</h2>
        <p className="text-sm opacity-80">Quản lý thông tin cá nhân và bảo mật</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {success}
          </div>
        )}

        {!isEditing && !isChangingPassword && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user.name || 'Người dùng'}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">
                  {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full"
              >
                Chỉnh sửa thông tin
              </Button>
              <Button
                onClick={() => {
                  setIsChangingPassword(true);
                  setIsEditing(false);
                }}
                variant="outline"
                className="w-full"
              >
                Đổi mật khẩu
              </Button>
              <Button
                onClick={() => setShowLogoutModal(true)}
                variant="danger"
                className="w-full"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <Button type="submit" className="flex-1">
                Lưu thay đổi
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </form>
        )}

        {isChangingPassword && (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full"
                required
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <Button type="submit" className="flex-1">
                Đổi mật khẩu
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Xác nhận đăng xuất"
        size="sm"
      >
        <div className="p-4">
          <p className="mb-4">Bạn có chắc chắn muốn đăng xuất?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
