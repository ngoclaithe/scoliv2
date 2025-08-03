import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import PaymentAccessCodeAPI from '../../API/apiPaymentAccessCode';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Button from '../common/Button';

const CodePurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    loadPurchases();
    loadStats();
  }, [currentPage, searchTerm, statusFilter]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await PaymentAccessCodeAPI.getPaymentRequests(params);
      console.log("Giá trị nhận về khi gọi API get all", response);
      
      let filteredData = response.data || [];
      
      // Transform data to ensure user object structure is consistent
      filteredData = filteredData.map(item => ({
        ...item,
        user: {
          // Handle different possible data structures
          id: item.user?.id || item.userId || null,
          email: item.owner?.email || item.userEmail || 'Chưa cập nhật',
          name: item.owner?.name || item.userName || item.user?.fullName || 'Chưa cập nhật',
          phone: item.user?.phone || item.userPhone || null,
        },
        // Keep backward compatibility
        userEmail: item.owner?.email || item.userEmail || 'Chưa cập nhật',
        userName: item.owner?.name || item.userName || item.user?.fullName || 'Chưa cập nhật',
        userPhone: item.user?.phone || item.userPhone || null,
      }));
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.codePay?.toLowerCase().includes(searchLower) ||
          item.owner.email?.toLowerCase().includes(searchLower) ||
          item.owner.name?.toLowerCase().includes(searchLower) ||
          item.userEmail?.toLowerCase().includes(searchLower) ||
          item.userName?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        );
      }

      setPurchases(filteredData);
      
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
        setTotalItems(response.pagination.totalItems || 0);
      } else {
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
        setTotalItems(filteredData.length);
      }
      
    } catch (error) {
      console.error('Error loading purchases:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await PaymentAccessCodeAPI.getPaymentStats();
      console.log("Giá trị reponse của các chỉ số là", response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        total_requests: 0,
        total_amount: 0,
        pendingOrders: 0,
        completedToday: 0,
        cancelledToday: 0
      });
    }
  };

  const handleApprove = async () => {
    if (!selectedPurchase) return;
    
    try {
      setLoading(true);
      setError('');
      
      await PaymentAccessCodeAPI.approvePaymentRequest(selectedPurchase.id, {
        note: statusNote
      });
      
      setShowStatusModal(false);
      setSelectedPurchase(null);
      setStatusNote('');
      
      // Reload data
      await loadPurchases();
      await loadStats();
      
    } catch (error) {
      console.error('Error approving payment:', error);
      setError(error.message || 'Có lỗi xảy ra khi duyệt đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPurchase) return;
    
    try {
      setLoading(true);
      setError('');
      
      await PaymentAccessCodeAPI.cancelPaymentRequest(selectedPurchase.id, {
        reason: statusNote || 'Từ chối bởi admin'
      });
      
      setShowStatusModal(false);
      setSelectedPurchase(null);
      setStatusNote('');
      
      // Reload data
      await loadPurchases();
      await loadStats();
      
    } catch (error) {
      console.error('Error rejecting payment:', error);
      setError(error.message || 'Có lỗi xảy ra khi từ chối đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPurchase) return;
    
    try {
      setLoading(true);
      setError('');
      
      await PaymentAccessCodeAPI.deletePaymentRequest(selectedPurchase.id);
      
      setShowDeleteModal(false);
      setSelectedPurchase(null);
      
      // Reload data
      await loadPurchases();
      await loadStats();
      
    } catch (error) {
      console.error('Error deleting payment:', error);
      setError(error.message || 'Có lỗi xảy ra khi xóa đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
  };

  const openStatusModal = (purchase) => {
    setSelectedPurchase(purchase);
    setStatusNote('');
    setShowStatusModal(true);
  };

  const openDeleteModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDeleteModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      completed: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800', icon: XCircleIcon }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentTypeLabel = (type) => {
    const types = {
      code_purchase: 'Mua code',
      subscription: 'Đăng ký',
      upgrade: 'Nâng cấp',
      other: 'Khác'
    };
    return types[type] || type || 'Mua code';
  };

  // Helper function to safely get user display name
  const getUserDisplayName = (purchase) => {
    if (!purchase) return 'N/A';
    return purchase.owner?.name || 
           purchase.userName || 
           purchase.user?.fullName || 
           purchase.owner?.email?.split('@')[0] || 
           'Khách hàng';
  };

  // Helper function to safely get user email
  const getUserEmail = (purchase) => {
    if (!purchase) return 'N/A';
    return purchase.owner?.email || 
           purchase.userEmail || 
           'Chưa cập nhật';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý mua code</h1>
        <p className="mt-2 text-sm text-gray-700">Xử lý và theo dõi các yêu cầu thanh toán mua code</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError('')}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng đơn hàng</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.total_requests || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng doanh thu</dt>
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(stats.total_amount)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Chờ duyệt</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.pendingOrders || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Duyệt hôm nay</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.completedToday || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Từ chối hôm nay</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.cancelledToday || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã code, email, tên..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select 
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="completed">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Hiển thị {purchases.length} / {totalItems} kết quả
            </span>
          </div>
        </div>
      </div>

      {/* Purchases table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{purchase.codePay}</div>
                          <div className="text-sm text-gray-500">ID: {purchase.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getUserEmail(purchase)}</div>
                          <div className="text-sm text-gray-500">{getUserDisplayName(purchase)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(purchase.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(purchase.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(purchase.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openDetailModal(purchase)}
                              className="text-primary-600 hover:text-primary-900"
                              title="Xem chi tiết"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {purchase.status === 'pending' && (
                              <button
                                onClick={() => openStatusModal(purchase)}
                                className="text-green-600 hover:text-green-900"
                                title="Xử lý đơn hàng"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => openDeleteModal(purchase)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa đơn hàng"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Hiển thị trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết yêu cầu thanh toán"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedPurchase.codePay}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {selectedPurchase.id}</p>
                  </div>
                </div>
                <div>{getStatusBadge(selectedPurchase.status)}</div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
                    <p className="text-sm text-gray-900">{getUserDisplayName(selectedPurchase)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{getUserEmail(selectedPurchase)}</p>
                  </div>
                  {selectedPurchase.userPhone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <p className="text-sm text-gray-900">{selectedPurchase.userPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Thông tin thanh toán
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại thanh toán</label>
                    <p className="text-sm text-gray-900">{getPaymentTypeLabel(selectedPurchase.type)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPurchase.amount)}</p>
                  </div>
                  {selectedPurchase.paymentMethod && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                      <p className="text-sm text-gray-900">{selectedPurchase.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description and Notes */}
            <div className="space-y-4">
              {selectedPurchase.note && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú xử lý</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-gray-900">{selectedPurchase.note}</p>
                  </div>
                </div>
              )}

              {selectedPurchase.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lý do từ chối</label>
                  <div className="mt-1 p-3 bg-red-50 rounded-md">
                    <p className="text-sm text-red-800">{selectedPurchase.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Time Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedPurchase.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày cập nhật</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedPurchase.updatedAt)}</p>
                </div>
              </div>
              {selectedPurchase.processedAt && (
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày xử lý</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedPurchase.processedAt)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Access Code Information */}
            {selectedPurchase.accessCodes && selectedPurchase.accessCodes.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Access Code đã cấp</h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPurchase.accessCodes.map((code, index) => (
                      <div key={index} className="bg-white rounded-md p-3 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium text-gray-900">{code.code}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            code.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {code.status === 'active' ? 'Hoạt động' : 'Đã sử dụng'}
                          </span>
                        </div>
                        {code.expiresAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Hết hạn: {formatDate(code.expiresAt)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          {selectedPurchase && selectedPurchase.status === 'pending' && (
            <Button onClick={() => {
              setShowDetailModal(false);
              openStatusModal(selectedPurchase);
            }}>
              Xử lý đơn hàng
            </Button>
          )}
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Xử lý yêu cầu thanh toán"
      >
        {selectedPurchase && (
          <div className="space-y-6">
            {/* Purchase Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Thông tin đơn hàng</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700">Mã thanh toán:</span>
                  <p className="font-medium text-gray-900">{selectedPurchase.codePay}</p>
                </div>
                <div>
                  <span className="text-gray-700">Khách hàng:</span>
                  <p className="font-medium text-gray-900">{getUserDisplayName(selectedPurchase)}</p>
                </div>
                <div>
                  <span className="text-gray-700">Số tiền:</span>
                  <p className="font-medium text-green-600">{formatCurrency(selectedPurchase.amount)}</p>
                </div>
                <div>
                  <span className="text-gray-700">Loại:</span>
                  <p className="font-medium text-gray-900">{getPaymentTypeLabel(selectedPurchase.type)}</p>
                </div>
              </div>
            </div>
            
            {/* Status Note Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú xử lý <span className="text-red-500">*</span>
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={4}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập ghi chú về việc xử lý yêu cầu (bắt buộc)..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Ghi chú này sẽ được gửi đến khách hàng và lưu trong hệ thống
              </p>
            </div>

            {/* Access Code Generation (for approval) */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Lưu ý khi duyệt đơn hàng:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hệ thống sẽ tự động tạo access code cho khách hàng</li>
                <li>• Access code sẽ được gửi qua email đã đăng ký</li>
                <li>• Khách hàng có thể sử dụng code ngay sau khi được duyệt</li>
                <li>• Thao tác này không thể hoàn tác</li>
              </ul>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowStatusModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={!statusNote.trim()}
          >
            Từ chối
          </Button>
          <Button 
            onClick={handleApprove}
            disabled={!statusNote.trim()}
          >
            Duyệt đơn hàng
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
      >
        {selectedPurchase && (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Xóa yêu cầu thanh toán
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Bạn có chắc chắn muốn xóa yêu cầu thanh toán này không? Thao tác này không thể hoàn tác.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm">
                <p><strong>Mã thanh toán:</strong> {selectedPurchase.codePay}</p>
                <p><strong>Khách hàng:</strong> {getUserDisplayName(selectedPurchase)}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(selectedPurchase.amount)}</p>
                <p><strong>Trạng thái:</strong> {getStatusBadge(selectedPurchase.status)}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Lưu ý quan trọng
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Xóa yêu cầu sẽ không thể khôi phục</li>
                      <li>Nếu đã có access code được tạo, chúng vẫn sẽ hoạt động</li>
                      <li>Thông tin thanh toán sẽ bị mất khỏi hệ thống</li>
                      <li>Khách hàng sẽ không nhận được thông báo về việc xóa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xác nhận xóa
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CodePurchaseManagement;