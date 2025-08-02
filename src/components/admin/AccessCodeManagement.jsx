import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import adminAPI from '../../API/apiAdmin';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const AccessCodeManagement = () => {
  const [accessCodes, setAccessCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    expiryDate: '',
    isActive: true,
    maxUsage: 100,
    currentUsage: 0
  });

  useEffect(() => {
    loadAccessCodes();
  }, [currentPage, searchTerm]);

  const loadAccessCodes = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockData = {
        data: [
          {
            id: 1,
            code: 'ABC123',
            description: 'Mã demo cho trận đấu A vs B',
            expiryDate: '2024-12-31',
            isActive: true,
            maxUsage: 100,
            currentUsage: 45,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-20'
          },
          {
            id: 2,
            code: 'XYZ789',
            description: 'Mã demo cho trận đấu C vs D',
            expiryDate: '2024-11-30',
            isActive: false,
            maxUsage: 50,
            currentUsage: 50,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-18'
          },
          {
            id: 3,
            code: 'DEF456',
            description: 'Mã demo cho trận đấu E vs F',
            expiryDate: '2024-12-15',
            isActive: true,
            maxUsage: 200,
            currentUsage: 12,
            createdAt: '2024-01-12',
            updatedAt: '2024-01-16'
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 3
        }
      };

      setAccessCodes(mockData.data);
      setTotalPages(mockData.pagination.totalPages);
    } catch (error) {
      console.error('Error loading access codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      // In production: await adminAPI.accessCodes.create(formData);
      
      // Mock success
      setShowCreateModal(false);
      setFormData({
        code: '',
        description: '',
        expiryDate: '',
        isActive: true,
        maxUsage: 100,
        currentUsage: 0
      });
      loadAccessCodes();
    } catch (error) {
      console.error('Error creating access code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      // In production: await adminAPI.accessCodes.update(selectedCode.id, formData);
      
      // Mock success
      setShowEditModal(false);
      setSelectedCode(null);
      loadAccessCodes();
    } catch (error) {
      console.error('Error updating access code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // In production: await adminAPI.accessCodes.delete(selectedCode.id);
      
      // Mock success
      setShowDeleteModal(false);
      setSelectedCode(null);
      loadAccessCodes();
    } catch (error) {
      console.error('Error deleting access code:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (code) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      description: code.description,
      expiryDate: code.expiryDate,
      isActive: code.isActive,
      maxUsage: code.maxUsage,
      currentUsage: code.currentUsage
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (code) => {
    setSelectedCode(code);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (code) => {
    if (!code.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Tắt</span>;
    }
    
    if (new Date(code.expiryDate) < new Date()) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Hết hạn</span>;
    }
    
    if (code.currentUsage >= code.maxUsage) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Hết lượt</span>;
    }
    
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Hoạt động</span>;
  };

  const getUsagePercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý mã truy cập</h1>
          <p className="mt-2 text-sm text-gray-700">Tạo và quản lý các mã truy cập cho người dùng</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Tạo mã mới
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã truy cập..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tắt</option>
              <option value="expired">Hết hạn</option>
              <option value="full">Hết lượt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Access codes table */}
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
                      Mã truy cập
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accessCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{code.code}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{code.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(code)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {code.currentUsage}/{code.maxUsage}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${getUsagePercentage(code.currentUsage, code.maxUsage)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(code.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(code)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(code)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo mã truy cập mới"
      >
        <div className="space-y-4">
          <Input
            label="Mã truy cập"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            placeholder="Nhập mã truy cập"
            required
          />
          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả mã truy cập"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lượng tối đa"
              type="number"
              value={formData.maxUsage}
              onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value)})}
              min="1"
            />
            <Input
              label="Ngày hết hạn"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Kích hoạt ngay
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(false)}>
            Hủy
          </Button>
          <Button onClick={handleCreate}>
            Tạo mã
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa mã truy cập"
      >
        <div className="space-y-4">
          <Input
            label="Mã truy cập"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            placeholder="Nhập mã truy cập"
            required
          />
          <Input
            label="Mô tả"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả mã truy cập"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lượng tối đa"
              type="number"
              value={formData.maxUsage}
              onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value)})}
              min="1"
            />
            <Input
              label="Ngày hết hạn"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>
          <div className="flex items-center">
            <input
              id="isActiveEdit"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-900">
              Kích hoạt
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button onClick={handleEdit}>
            Cập nhật
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xóa mã truy cập"
      >
        <p className="text-sm text-gray-500">
          Bạn có chắc chắn muốn xóa mã truy cập <span className="font-medium">{selectedCode?.code}</span>? 
          Hành động này không thể hoàn tác.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AccessCodeManagement;
