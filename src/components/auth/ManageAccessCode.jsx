import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import AccessCodeAPI from '../../API/apiAccessCode';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ManageAccessCode = ({ onNavigate }) => {
  const { user, logout, enterMatchCode, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
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

  // Load danh sách codes
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
      toast.error(error.message, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Tạo code mới
  const handleCreateCode = async () => {
    try {
      setCreateLoading(true);
      
      // Gọi API để tạo mã mới với giá trị mặc định
      const response = await AccessCodeAPI.createCode({ maxUses: 1 });
      
      if (response && response.data) {
        // Cập nhật danh sách mã sau khi tạo thành công
        setCodes(prev => [response.data, ...prev]);
        toast.success('Tạo mã truy cập thành công!', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response?.message || 'Không thể tạo mã truy cập');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo mã: ' + (error.message || 'Vui lòng thử lại sau'), {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Lỗi khi tạo mã truy cập:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  // Xóa code - gọi API đúng cách
  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã truy cập này?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Gọi API xóa code
      const response = await AccessCodeAPI.deleteCode(codeId);
      
      if (response.success) {
        // Cập nhật danh sách sau khi xóa thành công
        setCodes(prev => prev.filter(code => code.id !== codeId));
        toast.success('Xóa mã truy cập thành công!', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response?.message || 'Không thể xóa mã truy cập');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa mã: ' + (error.message || 'Vui lòng thử lại sau'), {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Lỗi khi xóa mã truy cập:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật trạng thái code
  const handleToggleStatus = async (codeId, currentStatus) => {
    setLoading(true);
    
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const response = await AccessCodeAPI.updateCode(codeId, { 
        status: newStatus 
      });
      
      if (response.success) {
        setCodes(codes.map(code => 
          code.id === codeId 
            ? { 
                ...code, 
                status: newStatus,
                isActive: newStatus === 'active'
              } 
            : code
        ));
        toast.success(`Đã ${currentStatus === 'active' ? 'vô hiệu hóa' : 'kích hoạt'} mã thành công`, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái: ' + (error.message || 'Vui lòng thử lại sau'), {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '🟢 Hoạt động';
      case 'expired': return '🔴 Hết hạn';
      case 'inactive': return '⚪ Tạm dừng';
      default: return '❓ Không xác định';
    }
  };

  // Xử lý nhập code để vào Home
  const handleEnterCode = async (e) => {
    e.preventDefault();
    if (!matchCode.trim()) {
      toast.error('Vui lòng nhập mã trận đấu', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const result = await enterMatchCode(matchCode);
    if (result.success) {
      setShowCodeEntry(false);
      setMatchCode('');
      toast.success('Nhập mã thành công!', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (onNavigate) {
        onNavigate('home');
      }
    } else {
      toast.error(result.error, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
                <p className="text-purple-100 text-sm">Tạo mã để chia sẻ và quản lý trận đấu</p>
              </div>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-2">
                <span className="text-white text-sm mr-2">👤</span>
                <span className="text-white text-sm font-medium">{user?.name}</span>
              </div>
              {onNavigate && (
                <button
                  onClick={() => setShowCodeEntry(true)}
                  className="flex items-center bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition-colors"
                  title="Về trang chủ (cần nhập code)"
                >
                  <span className="text-white text-sm">🏠 Trang chủ</span>
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ���� Danh sách mã
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab content */}
        <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý mã truy cập</h2>
              <Button
                onClick={handleCreateCode}
                variant="primary"
                className="flex items-center gap-2"
                loading={createLoading}
                disabled={createLoading}
              >
                <PlusIcon className="h-5 w-5" />
                Tạo mã truy cập
              </Button>
            </div>

            {/* Codes list */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã / Tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sử dụng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hết hạn
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {codes.map((code) => (
                      <tr key={code.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                              {code.code}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{code.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code.status)}`}>
                            {getStatusText(code.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {code.usageCount}/{code.maxUsage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(code.expiresAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCode(code);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            👁️ Xem
                          </button>
                          <button
                            onClick={() => handleToggleStatus(code.id, code.status)}
                            className={`${code.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                            disabled={code.status === 'expired'}
                          >
                            {code.status === 'active' ? '⏸️ Tạm dừng' : '▶️ Kích hoạt'}
                          </button>
                          <button
                            onClick={() => handleDeleteCode(code.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === i + 1
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
                  <span className="font-medium text-gray-600">Đã sử dụng:</span>
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
              <Button
                variant="primary"
                onClick={() => handleToggleStatus(selectedCode.id, selectedCode.status)}
                disabled={selectedCode.status === 'expired'}
                className={selectedCode.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {selectedCode.status === 'active' ? '⏸️ Tạm dừng' : '▶️ Kích hoạt'}
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
    </div>
  );
};

export default ManageAccessCode;
