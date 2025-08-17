import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import UserAPI from '../../API/apiUser';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const AccountTab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      setError('');

      // Giả sử user hiện tại có id = 1 (trong thực tế sẽ lấy từ token hoặc context)
      const response = await UserAPI.getUser('1');

      if (response.success) {
        setCurrentUser(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      // Nếu không load được, tạo user giả lập
      setCurrentUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
      setFormData({
        name: 'Admin User',
        email: 'admin@example.com'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await UserAPI.updateUser(currentUser.id, formData);

      if (response.success) {
        setCurrentUser(prev => ({ ...prev, ...formData }));
        setShowEditProfileModal(false);
        setSuccess('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
      }

      setLoading(true);
      setError('');
      setSuccess('');

      // Giả lập API change password
      // const response = await UserAPI.changePassword(currentUser.id, passwordData);

      // Giả lập thành công
      setShowChangePasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Đổi mật khẩu thành công!');
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  };

  const openEditProfileModal = () => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || ''
    });
    setShowEditProfileModal(true);
  };

  const openChangePasswordModal = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePasswordModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Quản trị viên</span>;
      case 'user':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Người dùng</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không thể tải thông tin tài khoản</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Thông tin tài khoản</h2>
          <p className="mt-1 text-sm text-gray-700">Xem và cập nhật thông tin tài khoản của bạn</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-20 w-20">
              <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-gray-600" />
              </div>
            </div>
            <div className="ml-6 flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{currentUser.name || 'Chưa có tên'}</h3>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                  <div className="mt-2">{getRoleBadge(currentUser.role)}</div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={openEditProfileModal}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button onClick={openChangePasswordModal}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết tài khoản</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tên đầy đủ</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentUser.name || 'Chưa cập nhật'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentUser.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {currentUser.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(currentUser.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Lần đăng nhập cuối</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(currentUser.lastLoginAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID tài khoản</dt>
              <dd className="mt-1 text-sm text-gray-900">{currentUser.id}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => {
          setShowEditProfileModal(false);
          resetFormData();
          setError('');
        }}
        title="Chỉnh sửa thông tin"
      >
        <div className="space-y-4">
          <Input
            label="Tên đầy đủ"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nhập tên đầy đủ"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowEditProfileModal(false);
              resetFormData();
              setError('');
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setError('');
        }}
        title="Đổi mật khẩu"
      >
        <div className="space-y-4">
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            placeholder="Nhập mật khẩu hiện tại"
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowChangePasswordModal(false);
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setError('');
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AccountTab;
