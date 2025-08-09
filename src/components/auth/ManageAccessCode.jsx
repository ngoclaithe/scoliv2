import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import AccessCodeAPI from '../../API/apiAccessCode';
import PaymentAccessCodeAPI from '../../API/apiPaymentAccessCode';
import InfoPaymentAPI from '../../API/apiInfoPayment';
import { PlusIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import UserAPI from '../../API/apiUser';

const ManageAccessCode = ({ onNavigate }) => {
  const { user, logout, enterMatchCode, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [activities, setActivities] = useState([]);
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
      console.log("Giá trị của reponse sau khi tạo code là:", response.data);
      if (response && response.data) {
        setCodes(prev => [response.data, ...prev]);
        const sportName = {
          'soccer': 'bóng đá',
          'futsal': 'futsal',
          'pickleball': 'pickleball'
        }[typeMatch] || '';

        console.log(`Tạo mã truy cập ${sportName} thành công!`);
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
      setLoading(true);
      // Tạo dữ liệu hoạt động giả lập vì user không có quyền truy cập getUsers
      const mockActivities = [
        {
          id: '1',
          type: 'code_created',
          description: 'Tạo mã truy cập mới cho bóng đá',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 phút trước
          details: { code: 'SOCCER123' }
        },
        {
          id: '2',
          type: 'code_used',
          description: 'Sử dụng mã truy cập để vào trận',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 phút trước
          details: { code: 'FUTSAL456' }
        },
        {
          id: '3',
          type: 'profile_updated',
          description: 'Cập nhật thông tin tài khoản',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 giờ trước
          details: { field: 'name' }
        },
        {
          id: '4',
          type: 'payment_completed',
          description: 'Thanh toán mã truy cập thành công',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 ngày trước
          details: { amount: '10000 VNĐ' }
        },
        {
          id: '5',
          type: 'login',
          description: 'Đăng nhập vào hệ thống',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 ngày trước
          details: { device: 'Chrome Browser' }
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      // Giả sử user hiện tại có id = 1
      const response = await UserAPI.getUser('1');
      if (response.success) {
        setCurrentUser(response.data);
        setProfileData({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      // Tạo user giả lập
      setCurrentUser({
        id: '1',
        name: 'Người dùng',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date().toISOString()
      });
      setProfileData({
        name: 'Người dùng',
        email: 'user@example.com'
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
      // Giả lập API change password
      setShowChangePasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      console.log('Đổi mật khẩu thành công!');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'used':
        return 'text-yellow-600 bg-yellow-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '🟢 Sẵn sàng';
      case 'expired': return '🔴 Hết hạn';
      case 'inactive': return '⚪ Chưa kích hoạt';
      case 'used': return '🟡 Đang sử dụng';
      default: return '❓ Không xác định';
    }
  };

  const generateSepayQRUrl = (paymentData) => {
    const baseUrl = 'https://qr.sepay.vn/img';
    const params = new URLSearchParams({
      acc: paymentData.accountNumber,
      name: paymentData.name,
      bank: paymentData.bank,
      amount: paymentData.amount,
      des: paymentData.code_pay,
      template: 'compact'
    });
    return `${baseUrl}?${params.toString()}`;
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
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý mã truy cập</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                onClick={() => handleCreateCode('soccer')}
                disabled={createLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Bóng đá
              </Button>
              <Button
                onClick={() => handleCreateCode('futsal')}
                disabled={createLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Futsal
              </Button>
              <Button
                onClick={() => handleCreateCode('pickleball')}
                disabled={createLoading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Pickleball
              </Button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã / Tên
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Trạng thái
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {codes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                            {code.code}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{code.name}</div>
                          {/* Show status on mobile */}
                          <div className="sm:hidden mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code.status)}`}>
                              {getStatusText(code.status)}
                            </span>
                          </div>
                        </div>
                      </td>
                      {/* Hide status column on mobile */}
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code.status)}`}>
                          {getStatusText(code.status)}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                          {/* Quick Enter Button */}
                          {onNavigate && (code.status === 'active' || code.status === 'used') && (
                            <button
                              onClick={() => handleQuickEnter(code.code)}
                              className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded text-xs transition-colors"
                              title="Vào trận nhanh với mã này"
                            >
                              🚀 Vào trận
                            </button>
                          )}
                          {/* Purchase Button for inactive codes */}
                          {code.status === 'inactive' && (
                            <button
                              onClick={() => handlePurchaseCode(code.code)}
                              disabled={paymentLoading}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs transition-colors disabled:opacity-50"
                              title="Mua mã truy cập này"
                            >
                              💳 Mua
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedCode(code);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded text-xs transition-colors"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => loadCodes(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => loadCodes(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> đến{' '}
                      <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> trong{' '}
                      <span className="font-medium">{pagination.total}</span> kết quả
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => loadCodes(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === i + 1
                              ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Hoạt động mới</h2>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loading size="lg" />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {activity.type === 'code_created' && <PlusIcon className="h-5 w-5 text-green-500" />}
                            {activity.type === 'code_used' && <UserIcon className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'profile_updated' && <UserIcon className="h-5 w-5 text-yellow-500" />}
                            {activity.type === 'payment_completed' && <ClockIcon className="h-5 w-5 text-green-600" />}
                            {activity.type === 'login' && <ClockIcon className="h-5 w-5 text-gray-500" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.description}
                                </p>
                                {activity.details && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {activity.details.code && `Mã: ${activity.details.code}`}
                                    {activity.details.amount && `Số tiền: ${activity.details.amount}`}
                                    {activity.details.device && `Thiết bị: ${activity.details.device}`}
                                    {activity.details.field && `Trường: ${activity.details.field}`}
                                  </p>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleString('vi-VN')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
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
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {currentUser.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}
                          </dd>
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
            </div>
          )}
        </div>
      </main>

      {/* Code Detail Modal */}
      {selectedCode && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCode(null);
          }}
          title="Chi tiết mã truy cập"
          size="lg"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-2xl font-mono font-bold text-purple-600 bg-white px-4 py-2 rounded border inline-block">
                  {selectedCode.code}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Tên:</span>
                  <div className="mt-1">{selectedCode.name}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Trạng thái:</span>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCode.status)}`}>
                      {getStatusText(selectedCode.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tạo lúc:</span>
                  <div className="mt-1">{formatDate(selectedCode.createdAt)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Hết hạn:</span>
                  <div className="mt-1">{formatDate(selectedCode.expiresAt)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Đã s��� dụng:</span>
                  <div className="mt-1">{selectedCode.usageCount}/{selectedCode.maxUsage}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Sử dụng cuối:</span>
                  <div className="mt-1">{selectedCode.lastUsed ? formatDate(selectedCode.lastUsed) : 'Chưa sử dụng'}</div>
                </div>
              </div>

              {selectedCode.description && (
                <div className="mt-4">
                  <span className="font-medium text-gray-600">Mô tả:</span>
                  <div className="mt-1 text-gray-800">{selectedCode.description}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCode(null);
                }}
              >
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

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

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPaymentData(null);
        }}
        title="Thanh toán mã truy cập"
        size="lg"
      >
        {paymentData && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thanh toán cho mã: {paymentData.accessCode}
              </h3>
              <p className="text-sm text-gray-600">
                Mã giao dịch: <span className="font-mono font-bold">{paymentData.code_pay}</span>
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code using Sepay */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">Quét mã QR để thanh toán</h4>
                  <div className="bg-white p-4 rounded-lg inline-block shadow-sm border-2 border-gray-200">
                    <img
                      src={generateSepayQRUrl(paymentData)}
                      alt="Sepay QR Code"
                      className="mx-auto"
                      style={{ width: '220px', height: '220px' }}
                      onError={(e) => {
                        console.error('Error loading Sepay QR code');
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Quét bằng app ngân hàng Việt Nam
                  </p>
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin chuyển khoản</h4>

                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Ngân hàng</div>
                    <div className="font-semibold">{paymentData.bank}</div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Số tài khoản</div>
                    <div className="font-mono font-semibold">{paymentData.accountNumber}</div>
                  </div>

                  {paymentData?.name && (
                    <div className="bg-white p-3 rounded border">
                      <div className="text-sm text-gray-600">Chủ tài khoản</div>
                      <div className="font-semibold">{paymentData.name}</div>
                    </div>
                  )}

                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Số tiền</div>
                    <div className="font-semibold text-green-600">
                      {parseInt(paymentData.amount).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Nội dung chuyển khoản</div>
                    <div className="font-mono text-sm break-all">
                      {paymentData.code_pay}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vui lòng chuyển khoản đúng số tiền và nội dung</li>
                    <li>Mã truy cập sẽ được kích hoạt sau khi thanh toán thành công</li>
                    <li>Thời gian xử lý: 1-5 phút sau khi chuyển khoản</li>
                    <li>Nếu có vấn đề, vui lòng liên hệ hỗ trợ với mã giao dịch: {paymentData.code_pay}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentData(null);
                }}
              >
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const paymentInfo = `Ngân hàng: ${paymentData.bankName}\nSố TK: ${paymentData.bankAccountNumber}\nSố tiền: ${parseInt(paymentData.amount).toLocaleString('vi-VN')} VNĐ\nNội dung: ${paymentData.code_pay}`;
                  navigator.clipboard.writeText(paymentInfo).then(() => {
                    console.log('Đã sao chép thông tin thanh toán!');
                  }).catch(() => {
                    console.error('Không thể sao chép. Vui lòng sao chép thủ công.');
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                📋 Sao chép thông tin
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
          <Button onClick={handleChangePassword} disabled={loading}>
            {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAccessCode;
