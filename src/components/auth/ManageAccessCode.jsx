import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import AccessCodeAPI from '../../API/apiAccessCode';
import PaymentAccessCodeAPI from '../../API/apiPaymentAccessCode';
import InfoPaymentAPI from '../../API/apiInfoPayment';
import UserAPI from '../../API/apiUser';
import AuthAPI from '../../API/apiAuth';
import AccessCodeList from './AccessCodeList';
import ActivityList from './ActivityList';
import UserProfileSection from './UserProfileSection';
import ActivitiesAPI from '../../API/apiActivities';

const ManageAccessCode = ({ onNavigate }) => {
  const { user, logout, enterMatchCode, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [matchCode, setMatchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [codes, setCodes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [selectedCode, setSelectedCode] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  
  const loadCodes = useCallback(async (page = 1, status = '') => {
    try {
      setLoading(true);
      const response = await AccessCodeAPI.getCodes({ page, limit: pagination.limit, status });
      if (response.success) {
        setCodes(response.data);
        setPagination(prev => ({
          ...prev,
          page: response.pagination.page,
          pages: response.pagination.pages,
          total: response.pagination.total
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách codes:', error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const handleCreateCode = async (typeMatch = 'soccer') => {
    try {
      setCreateLoading(true);

      const response = await AccessCodeAPI.createCode({ typeMatch });
      console.log("Giá trị của response sau khi tạo code là:", response.data);
      if (response && response.data) {
        setCodes(prev => [response.data, ...prev]);
        const sportName = {
          'soccer': 'bóng đá',
          'futsal': 'futsal',
          'pickleball': 'pickleball'
        }[typeMatch] || '';

        console.log(`Tạo mã truy cập ${sportName} thành công!`);
        
        // Reload activities sau khi tạo code thành công
        if (activeTab === 'activities') {
          loadActivities();
        }
      } else {
        throw new Error(response?.message || 'Không thể tạo mã truy cập');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi tạo mã:', error.message || 'Vui lòng thử lại sau');
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
    loadPaymentInfo();
    if (activeTab === 'activities') {
      loadActivities();
    }
    if (activeTab === 'account') {
      loadCurrentUser();
    }
  }, [activeTab]);

  const loadPaymentInfo = async () => {
    try {
      const response = await InfoPaymentAPI.getInfoPayment();
      if (response && response.data && response.data.length > 0) {
        const activePaymentInfo = response.data.find(info => info.isActive) || response.data[0];
        setPaymentInfo(activePaymentInfo);
      }
    } catch (error) {
      setPaymentInfo(null);
    }
  };

  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await ActivitiesAPI.getActivities();
      
      if (response && response.success) {
        // Transform API data to match the expected format
        const transformedActivities = response.data.map(activity => ({
          id: activity.id.toString(),
          type: getActivityType(activity.action, activity.status),
          description: getActivityDescription(activity.action, activity.status, activity.code),
          timestamp: activity.createdAt,
          details: {
            code: activity.code,
            status: activity.status,
            createdBy: activity.createdBy?.name || 'Không rõ',
            expiredAt: activity.expiredAt
          }
        }));
        
        setActivities(transformedActivities);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const getActivityType = (action, status) => {
    if (action === 'create_access_code') {
      if (status === 'used') return 'code_used';
      if (status === 'expired') return 'code_expired';
      return 'code_created';
    }
    return 'other';
  };

  const getActivityDescription = (action, status, code) => {
    if (action === 'create_access_code') {
      if (status === 'active') {
        return `Tạo mã truy cập ${code} - Đang hoạt động`;
      } else if (status === 'used') {
        return `Mã truy cập ${code} đã được sử dụng`;
      } else if (status === 'expired') {
        return `Mã truy cập ${code} đã hết hạn`;
      }
      return `Tạo mã truy cập ${code}`;
    }
    return 'Hoạt động khác';
  };

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        setProfileData({
          name: user.name || '',
          email: user.email || ''
        });
      } else {
        const mockUser = {
          id: '1',
          name: 'Người dùng',
          email: 'user@example.com',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(mockUser);
        setProfileData({
          name: mockUser.name,
          email: mockUser.email
        });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      const fallbackUser = {
        id: '1',
        name: 'Người dùng',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(fallbackUser);
      setProfileData({
        name: fallbackUser.name,
        email: fallbackUser.email
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.updateUser(currentUser.id, profileData);
      if (response.success) {
        setCurrentUser(prev => ({ ...prev, ...profileData }));
        setShowEditProfileModal(false);
        console.log('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        console.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
        return;
      }
      if (passwordData.newPassword.length < 6) {
        console.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
      }
      setLoading(true);
      setShowChangePasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      console.log('Đổi mật khẩu thành công!');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCode = async (accessCode) => {
    try {
      setPaymentLoading(true);

      if (!paymentInfo) {
        throw new Error('Chưa có thông tin thanh toán. Vui lòng liên hệ admin.');
      }

      const paymentRequest = {
        accessCode: accessCode,
        bankAccountNumber: paymentInfo.bankAccountNumber,
        bankName: paymentInfo.bankName,
        amount: "10000",
        transactionNote: `Mua ma truy cap ${accessCode}`
      };

      const response = await PaymentAccessCodeAPI.createPaymentRequest(paymentRequest);

      if (response.success) {
        setPaymentData(response.data);
        setShowPaymentModal(true);
        console.log('Tạo yêu cầu thanh toán thành công!');
      } else {
        throw new Error(response?.message || 'Không thể tạo yêu cầu thanh toán');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi tạo thanh toán:', error.message || 'Vui lòng thử lại sau');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleEnterCode = async (e) => {
    e.preventDefault();
    if (!matchCode.trim()) {
      console.error('Vui lòng nhập mã trận đấu');
      return;
    }

    const result = await enterMatchCode(matchCode);
    if (result.success) {
      setShowCodeEntry(false);
      setMatchCode('');
      console.log('Nhập mã thành công!');
      if (onNavigate) {
        onNavigate('home');
      }
    } else {
      console.error(result.error);
    }
  };

  const handleQuickEnter = async (code) => {
    const result = await enterMatchCode(code);
    if (result.success) {
      console.log('Vào trận thành công!');
      if (onNavigate) {
        onNavigate('home');
      }
    } else {
      console.error(result.error);
    }
  };

  if (loading && codes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">🔑</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Quản lý mã truy cập</h1>
              </div>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-2">
                <span className="text-white text-sm mr-2">👤</span>
              </div>
              {onNavigate && (
                <button
                  onClick={() => setShowCodeEntry(true)}
                  className="flex items-center bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition-colors"
                  title="Về trang chủ (cần nhập code)"
                >
                  <span className="text-white text-sm">🚀Vào trận</span>
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition-colors"
                title="Đăng xuất"
              >
                <span className="text-white text-sm">🚪 Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'list'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Danh sách mã
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'activities'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Hoạt động mới
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'account'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Thông tin tài khoản
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab content */}
        <div>
          {activeTab === 'list' && (
            <AccessCodeList
              codes={codes}
              pagination={pagination}
              loading={loading}
              createLoading={createLoading}
              paymentLoading={paymentLoading}
              selectedCode={selectedCode}
              showDetailModal={showDetailModal}
              setShowDetailModal={setShowDetailModal}
              setSelectedCode={setSelectedCode}
              showPaymentModal={showPaymentModal}
              setShowPaymentModal={setShowPaymentModal}
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              onCreateCode={handleCreateCode}
              onPurchaseCode={handlePurchaseCode}
              onQuickEnter={handleQuickEnter}
              onNavigate={onNavigate}
              onLoadCodes={loadCodes}
            />
          )}

          {activeTab === 'activities' && (
            <ActivityList
              activities={activities}
              loading={activitiesLoading}
            />
          )}

          {activeTab === 'account' && (
            <UserProfileSection
              currentUser={currentUser}
              loading={loading}
              showEditProfileModal={showEditProfileModal}
              setShowEditProfileModal={setShowEditProfileModal}
              showChangePasswordModal={showChangePasswordModal}
              setShowChangePasswordModal={setShowChangePasswordModal}
              profileData={profileData}
              setProfileData={setProfileData}
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
            />
          )}
        </div>
      </main>

      {/* Code Entry Modal để vào Home */}
      <Modal
        isOpen={showCodeEntry}
        onClose={() => {
          setShowCodeEntry(false);
          setMatchCode('');
        }}
        title="Nhập mã để vào trang chủ"
        size="sm"
      >
        <form onSubmit={handleEnterCode} className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-lg">🔑</span>
            </div>
            <p className="text-sm text-gray-600">
              Để truy cập trang chủ quản lý trận đấu, vui lòng nhập mã:
            </p>
          </div>

          <div>
            <Input
              type="text"
              placeholder="Nhập mã trận đấu"
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value)}
              className="w-full text-center font-mono"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCodeEntry(false);
                setMatchCode('');
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={authLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xác nhận
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAccessCode;
