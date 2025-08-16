import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { UserIcon } from '@heroicons/react/24/outline';

const UserProfileSection = ({
  currentUser,
  loading,
  showEditProfileModal,
  setShowEditProfileModal,
  showChangePasswordModal,
  setShowChangePasswordModal,
  profileData,
  setProfileData,
  passwordData,
  setPasswordData,
  onUpdateProfile,
  onChangePassword
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loading size="lg" />
        </div>
      ) : currentUser ? (
        <div className="space-y-6">
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
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowEditProfileModal(true)}
                        className="text-sm"
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() => setShowChangePasswordModal(true)}
                        className="text-sm"
                      >
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
              </dl>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Không thể tải thông tin tài khoản</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => {
          setShowEditProfileModal(false);
          setProfileData({
            name: currentUser?.name || '',
            email: currentUser?.email || ''
          });
        }}
        title="Chỉnh sửa thông tin"
      >
        <div className="space-y-4">
          <Input
            label="Tên đầy đủ"
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            placeholder="Nhập tên đầy đủ"
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            placeholder="Nhập địa chỉ email"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => {
              setShowEditProfileModal(false);
              setProfileData({
                name: currentUser?.name || '',
                email: currentUser?.email || ''
              });
            }}
          >
            Hủy
          </Button>
          <Button onClick={onUpdateProfile} disabled={loading}>
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
            variant="secondary"
            onClick={() => {
              setShowChangePasswordModal(false);
              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }}
          >
            Hủy
          </Button>
          <Button onClick={onChangePassword} disabled={loading}>
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfileSection;
