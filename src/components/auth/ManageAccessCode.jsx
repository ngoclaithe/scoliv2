import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import AccessCodeAPI from '../../API/apiAccessCode';

const ManageAccessCode = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [selectedCode, setSelectedCode] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form tạo code mới
  const [createForm, setCreateForm] = useState({
    name: '',
    duration: 24,
    description: ''
  });

  // Load danh sách codes
  const loadCodes = useCallback(async (page = 1, status = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Trong demo, tạo dữ liệu giả
      const mockData = {
        success: true,
        pagination: {
          page,
          pages: 2,
          total: 15,
          limit: 10
        },
        data: [
          {
            id: '1',
            code: 'DEMO2024',
            name: 'Code Demo trận đấu',
            description: 'Mã demo cho trận đấu thử nghiệm',
            status: 'active',
            duration: 24,
            createdAt: '2024-01-15T10:30:00Z',
            expiresAt: '2024-01-16T10:30:00Z',
            usageCount: 5,
            maxUsage: 100,
            lastUsed: '2024-01-15T15:20:00Z'
          },
          {
            id: '2',
            code: 'MATCH001',
            name: 'Trận Hà Nội vs TPHCM',
            description: 'Code cho trận đấu chính thức',
            status: 'active',
            duration: 48,
            createdAt: '2024-01-14T08:00:00Z',
            expiresAt: '2024-01-16T08:00:00Z',
            usageCount: 12,
            maxUsage: 50,
            lastUsed: '2024-01-15T16:45:00Z'
          },
          {
            id: '3',
            code: 'EXPIRE001',
            name: 'Code đã hết hạn',
            description: 'Mã test đã hết hạn sử dụng',
            status: 'expired',
            duration: 12,
            createdAt: '2024-01-10T12:00:00Z',
            expiresAt: '2024-01-10T24:00:00Z',
            usageCount: 8,
            maxUsage: 20,
            lastUsed: '2024-01-10T23:30:00Z'
          }
        ]
      };

      setCodes(mockData.data);
      setPagination(mockData.pagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  // Tạo code mới
  const handleCreateCode = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      setError('Vui lòng nhập tên cho mã truy cập');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Trong demo, giả lập tạo code thành công
      const newCode = {
        id: Date.now().toString(),
        code: `CODE${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name: createForm.name,
        description: createForm.description,
        status: 'active',
        duration: createForm.duration,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + createForm.duration * 3600000).toISOString(),
        usageCount: 0,
        maxUsage: 100,
        lastUsed: null
      };

      setCodes(prev => [newCode, ...prev]);
      setCreateForm({ name: '', duration: 24, description: '' });
      setShowCreateModal(false);
      setSuccess('Tạo mã truy cập thành công!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xóa code
  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã truy cập này?')) {
      return;
    }

    try {
      setLoading(true);
      setCodes(prev => prev.filter(code => code.id !== codeId));
      setSuccess('Xóa mã truy cập thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle trạng thái code
  const handleToggleStatus = async (codeId, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      setCodes(prev => prev.map(code => 
        code.id === codeId ? { ...code, status: newStatus } : code
      ));
      
      setSuccess(`${newStatus === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'} mã thành công!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
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
                <p className="text-purple-100 text-sm">Tạo và quản lý mã code cho trận đấu</p>
              </div>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/10 rounded-full px-3 py-2">
                <span className="text-white text-sm mr-2">👤</span>
                <span className="text-white text-sm font-medium">{user?.name}</span>
              </div>
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
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Danh sách mã
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ➕ Tạo mã mới
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Thống kê
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Tab content */}
        {activeTab === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Danh sách mã truy cập</h2>
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                className="bg-purple-600 hover:bg-purple-700"
              >
                ➕ Tạo mã mới
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
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tạo mã truy cập mới</h2>
            
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleCreateCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên mã truy cập *
                  </label>
                  <Input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({...prev, name: e.target.value}))}
                    placeholder="VD: Trận Hà Nội vs TPHCM"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian sử dụng (giờ) *
                  </label>
                  <select
                    value={createForm.duration}
                    onChange={(e) => setCreateForm(prev => ({...prev, duration: parseInt(e.target.value)}))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={1}>1 giờ</option>
                    <option value={3}>3 giờ</option>
                    <option value={6}>6 giờ</option>
                    <option value={12}>12 giờ</option>
                    <option value={24}>24 giờ</option>
                    <option value={48}>48 giờ</option>
                    <option value={72}>72 giờ</option>
                    <option value={168}>1 tuần</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Mô tả chi tiết về mã truy cập này..."
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setCreateForm({ name: '', duration: 24, description: '' })}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Tạo mã truy cập
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống kê sử dụng</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-sm text-gray-600">Tổng số mã</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Đang hoạt động</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Tạm dừng</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-gray-600">Hết hạn</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sử dụng theo thời gian</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Code Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo mã truy cập mới"
        size="md"
      >
        <form onSubmit={handleCreateCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên mã truy cập *
            </label>
            <Input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm(prev => ({...prev, name: e.target.value}))}
              placeholder="VD: Trận Hà Nội vs TPHCM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian sử dụng (giờ) *
            </label>
            <select
              value={createForm.duration}
              onChange={(e) => setCreateForm(prev => ({...prev, duration: parseInt(e.target.value)}))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value={1}>1 giờ</option>
              <option value={3}>3 giờ</option>
              <option value={6}>6 giờ</option>
              <option value={12}>12 giờ</option>
              <option value={24}>24 giờ</option>
              <option value={48}>48 giờ</option>
              <option value={72}>72 giờ</option>
              <option value={168}>1 tuần</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm(prev => ({...prev, description: e.target.value}))}
              placeholder="Mô tả chi tiết về mã truy cập này..."
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Tạo mã
            </Button>
          </div>
        </form>
      </Modal>

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
    </div>
  );
};

export default ManageAccessCode;
