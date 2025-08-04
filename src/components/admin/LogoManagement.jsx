import React, { useState, useEffect, useRef } from 'react';
import { 
  TrashIcon, 
  PencilIcon, 
  CloudArrowUpIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import LogoAPI from '../../API/apiLogo';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const LogoManagement = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [editingLogo, setEditingLogo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [logoData, setLogoData] = useState({
    name: '',
    type: 'logo',
  });

  const logoTypes = [
    { value: 'logo', label: 'Logo' },
    { value: 'banner', label: 'Banner' },
    { value: 'other', label: 'Khác' },
  ];

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await LogoAPI.getLogos();
      console.log("Giá trị reponse là:", response);
      setLogos(Array.isArray(response) ? response : (response?.data || []));
    } catch (error) {
      console.error('Error loading logos:', error);
      setError(error.message || 'Không thể tải danh sách logo');
      setLogos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Set default name from filename without extension
      const name = selectedFile.name.replace(/\.[^/.]+$/, '');
      setLogoData(prev => ({ ...prev, name }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadLogo = async () => {
    if (!file) {
      setError('Vui lòng chọn file logo');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      await LogoAPI.uploadLogo(file, logoData.type, logoData.name || 'Unnamed Logo');
      
      // Reset form
      setFile(null);
      setLogoData({
        name: '',
        type: 'logo',
      });
      setShowUploadModal(false);
      
      // Refresh logo list
      await loadLogos();
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      setError(error.message || 'Có lỗi khi tải lên logo');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateLogo = async () => {
    if (!editingLogo) return;

    try {
      setUploading(true);
      setError(null);
      
      await LogoAPI.updateLogo(editingLogo.id, {
        name: logoData.name,
        type: logoData.type,
        file: file // file is optional for updates
      });
      
      // Reset form
      setEditingLogo(null);
      setFile(null);
      setLogoData({
        name: '',
        type: 'logo',
      });
      
      // Refresh logo list
      await loadLogos();
      
    } catch (error) {
      console.error('Error updating logo:', error);
      setError(error.message || 'Có lỗi khi cập nhật logo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!selectedLogo) return;

    try {
      setUploading(true);
      setError(null);
      
      await LogoAPI.deleteLogo(selectedLogo.id);
      setShowDeleteModal(false);
      
      // Refresh logo list
      await loadLogos();
      
    } catch (error) {
      console.error('Error deleting logo:', error);
      setError(error.message || 'Có lỗi khi xóa logo');
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (logo) => {
    setEditingLogo(logo);
    setLogoData({
      name: logo.name || '',
      type: logo.type || 'logo',
    });
  };

  const filteredLogos = logos.filter(logo => 
    logo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    logo.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    logo.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLogoTypeLabel = (type) => {
    const typeObj = logoTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Quản lý Logo</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý các logo và banner của hệ thống
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CloudArrowUpIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            Tải lên mới
          </Button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mt-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tìm kiếm logo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 mt-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      ) : (
        /* Logos list */
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Logo
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Tên
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Loại
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Kích thước
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Hành động</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                          {searchTerm ? 'Không tìm thấy logo nào phù hợp' : 'Chưa có logo nào'}
                        </td>
                      </tr>
                    ) : (
                      filteredLogos.map((logo) => (
                        <tr key={logo.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                            <div className="flex items-center">
                              <img
                                src={logo.url || logo.path}
                                alt={logo.name}
                                className="flex-shrink-0 w-12 h-12 rounded-md object-contain bg-gray-100"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/48';
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{logo.name || 'Không có tên'}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(logo.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {getLogoTypeLabel(logo.type)}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {logo.size ? formatFileSize(logo.size) : 'N/A'}
                          </td>
                          <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => startEditing(logo)}
                                className="p-1 text-indigo-600 rounded-md hover:bg-indigo-50"
                                title="Chỉnh sửa"
                              >
                                <PencilIcon className="w-5 h-5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLogo(logo);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1 text-red-600 rounded-md hover:bg-red-50"
                                title="Xóa"
                              >
                                <TrashIcon className="w-5 h-5" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title={editingLogo ? 'Chỉnh sửa logo' : 'Tải lên logo mới'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chọn file ảnh
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            {file && (
              <div className="mt-2 text-sm text-gray-500">
                Đã chọn: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên logo
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={logoData.name}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập tên logo"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Loại
            </label>
            <select
              id="type"
              name="type"
              value={logoData.type}
              onChange={handleInputChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {logoTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowUploadModal(false);
                setEditingLogo(null);
                setFile(null);
                setLogoData({ name: '', type: 'logo' });
              }}
              disabled={uploading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={editingLogo ? handleUpdateLogo : handleUploadLogo}
              disabled={uploading || (!file && !editingLogo)}
            >
              {uploading ? (
                <>
                  <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : editingLogo ? (
                'Cập nhật'
              ) : (
                'Tải lên'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa logo"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa logo <span className="font-semibold">{selectedLogo?.name}</span>? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={uploading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteLogo}
              disabled={uploading}
            >
              {uploading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LogoManagement;
