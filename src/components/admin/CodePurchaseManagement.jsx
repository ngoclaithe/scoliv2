import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadPurchases();
    loadStats();
  }, [currentPage, searchTerm, statusFilter]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockData = {
        data: [
          {
            id: 1,
            orderCode: 'ORD-001',
            userEmail: 'nguyenvana@example.com',
            userName: 'Nguyễn Văn A',
            packageName: 'Gói 10 Code',
            quantity: 10,
            unitPrice: 50000,
            totalAmount: 500000,
            status: 'pending',
            paymentMethod: 'bank_transfer',
            paymentProof: 'https://example.com/proof1.jpg',
            note: 'Đang chờ xác nhận chuyển khoản',
            createdAt: '2024-01-20T09:30:00Z',
            processedAt: null,
            processedBy: null
          },
          {
            id: 2,
            orderCode: 'ORD-002',
            userEmail: 'tranthib@example.com',
            userName: 'Trần Thị B',
            packageName: 'Gói 5 Code',
            quantity: 5,
            unitPrice: 50000,
            totalAmount: 250000,
            status: 'approved',
            paymentMethod: 'momo',
            paymentProof: 'https://example.com/proof2.jpg',
            note: 'Đã xác nhận và cấp code',
            createdAt: '2024-01-19T14:15:00Z',
            processedAt: '2024-01-19T15:20:00Z',
            processedBy: 'Admin'
          },
          {
            id: 3,
            orderCode: 'ORD-003',
            userEmail: 'levanc@example.com',
            userName: 'Lê Văn C',
            packageName: 'Gói 20 Code',
            quantity: 20,
            unitPrice: 45000,
            totalAmount: 900000,
            status: 'rejected',
            paymentMethod: 'bank_transfer',
            paymentProof: 'https://example.com/proof3.jpg',
            note: 'Chuyển khoản không đúng số tiền',
            createdAt: '2024-01-18T11:45:00Z',
            processedAt: '2024-01-18T16:30:00Z',
            processedBy: 'Admin'
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 3
        }
      };

      setPurchases(mockData.data);
      setTotalPages(mockData.pagination.totalPages);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats for demo
      const mockStats = {
        totalOrders: 150,
        totalRevenue: 7500000,
        pendingOrders: 12,
        approvedToday: 8,
        rejectedToday: 2
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      // In production: await adminAPI.codePurchases.updateStatus(selectedPurchase.id, newStatus, statusNote);
      
      // Mock success
      setShowStatusModal(false);
      setSelectedPurchase(null);
      setStatusNote('');
      loadPurchases();
    } catch (error) {
      console.error('Error updating status:', error);
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
    setStatusNote(purchase.note || '');
    setShowStatusModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
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
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800', icon: XCircleIcon }
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

  const getPaymentMethodLabel = (method) => {
    const methods = {
      bank_transfer: 'Chuyển khoản',
      momo: 'MoMo',
      zalopay: 'ZaloPay',
      card: 'Thẻ tín dụng'
    };
    return methods[method] || method;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý mua code</h1>
        <p className="mt-2 text-sm text-gray-700">Xử lý và theo dõi các đơn hàng mua code</p>
      </div>

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
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</dd>
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
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</dd>
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
                    <dd className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</dd>
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
                    <dd className="text-2xl font-semibold text-gray-900">{stats.approvedToday}</dd>
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
                    <dd className="text-2xl font-semibold text-gray-900">{stats.rejectedToday}</dd>
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
                placeholder="Tìm kiếm theo mã đơn, email..."
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
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Tất cả phương thức</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="momo">MoMo</option>
              <option value="zalopay">ZaloPay</option>
            </select>
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
                      Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gói mua
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
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{purchase.orderCode}</div>
                        <div className="text-sm text-gray-500">{getPaymentMethodLabel(purchase.paymentMethod)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{purchase.userName}</div>
                        <div className="text-sm text-gray-500">{purchase.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{purchase.packageName}</div>
                        <div className="text-sm text-gray-500">{purchase.quantity} code</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(purchase.totalAmount)}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(purchase.unitPrice)}/code</div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết đơn hàng"
      >
        {selectedPurchase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                <p className="text-sm text-gray-900">{selectedPurchase.orderCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <div className="mt-1">{getStatusBadge(selectedPurchase.status)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
                <p className="text-sm text-gray-900">{selectedPurchase.userName}</p>
                <p className="text-sm text-gray-500">{selectedPurchase.userEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                <p className="text-sm text-gray-900">{getPaymentMethodLabel(selectedPurchase.paymentMethod)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gói mua</label>
                <p className="text-sm text-gray-900">{selectedPurchase.packageName}</p>
                <p className="text-sm text-gray-500">{selectedPurchase.quantity} code</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tổng tiền</label>
                <p className="text-sm text-gray-900">{formatCurrency(selectedPurchase.totalAmount)}</p>
                <p className="text-sm text-gray-500">{formatCurrency(selectedPurchase.unitPrice)}/code</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Minh chứng thanh toán</label>
              {selectedPurchase.paymentProof ? (
                <img 
                  src={selectedPurchase.paymentProof} 
                  alt="Payment proof" 
                  className="mt-1 max-w-full h-auto rounded border"
                />
              ) : (
                <p className="text-sm text-gray-500">Không có minh chứng</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
              <p className="text-sm text-gray-900">{selectedPurchase.note || 'Không có ghi chú'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                <p className="text-sm text-gray-900">{formatDate(selectedPurchase.createdAt)}</p>
              </div>
              {selectedPurchase.processedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày xử lý</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedPurchase.processedAt)}</p>
                  <p className="text-sm text-gray-500">Bởi: {selectedPurchase.processedBy}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Xử lý đơn hàng"
      >
        {selectedPurchase && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700">
                Đơn hàng: <span className="font-medium">{selectedPurchase.orderCode}</span>
              </p>
              <p className="text-sm text-gray-700">
                Khách hàng: <span className="font-medium">{selectedPurchase.userName}</span>
              </p>
              <p className="text-sm text-gray-700">
                Số tiền: <span className="font-medium">{formatCurrency(selectedPurchase.totalAmount)}</span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú xử lý</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập ghi chú về việc xử lý đơn hàng..."
              />
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowStatusModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={() => handleStatusUpdate('rejected')}>
            Từ chối
          </Button>
          <Button onClick={() => handleStatusUpdate('approved')}>
            Duyệt đơn
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CodePurchaseManagement;
