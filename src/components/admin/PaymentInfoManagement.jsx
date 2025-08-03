import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import InfoPaymentAPI from '../../API/apiInfoPayment';

const PaymentInfoManagement = () => {
  const [paymentInfos, setPaymentInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    bankAccountNumber: '',
    accountHolderName: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadPaymentInfos();
  }, []);

  const loadPaymentInfos = async () => {
    try {
      setLoading(true);
      const response = await InfoPaymentAPI.getInfoPayment();
      if (response && response.data) {
        setPaymentInfos(response.data);
      } else {
        setPaymentInfos([]);
      }
    } catch (error) {
      setPaymentInfos([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.bankName.trim()) {
      errors.bankName = 'Vui lòng nhập tên ngân hàng';
    }
    
    if (!formData.bankAccountNumber.trim()) {
      errors.bankAccountNumber = 'Vui lòng nhập số tài khoản';
    } else if (!/^\d+$/.test(formData.bankAccountNumber)) {
      errors.bankAccountNumber = 'Số tài khoản chỉ được chứa số';
    }
    
    if (!formData.accountHolderName.trim()) {
      errors.accountHolderName = 'Vui lòng nhập tên chủ tài khoản';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      if (editingInfo) {
        await InfoPaymentAPI.updateInfoPayment(editingInfo.id, formData);
      } else {
        const response = await InfoPaymentAPI.createInfoPayment(formData);
      }
      
      await loadPaymentInfos();
      handleCloseModal();
    } catch (error) {
      setFormErrors({ submit: error.message || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (info) => {
    setEditingInfo(info);
    setFormData({
      bankName: info.bankName || '',
      bankAccountNumber: info.bankAccountNumber || '',
      accountHolderName: info.accountHolderName || '',
      isActive: info.isActive !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      setLoading(true);
      await InfoPaymentAPI.deleteInfoPayment(id);
      await loadPaymentInfos();
      setDeleteConfirm(null);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInfo(null);
    setFormData({
      bankName: '',
      bankAccountNumber: '',
      accountHolderName: '',
      isActive: true
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quản lý thông tin thanh toán</h1>
          <p className="text-slate-600">Quản lý thông tin tài khoản ngân hàng để nhận thanh toán</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5" />
          Thêm thông tin thanh toán
        </Button>
      </div>

      {loading && paymentInfos.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loading size="lg" />
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl border border-slate-200 overflow-hidden">
          {paymentInfos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CreditCardIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có thông tin thanh toán</h3>
              <p className="text-slate-600 mb-4">Thêm thông tin tài khoản ngân hàng để bắt đầu nhận thanh toán</p>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg"
              >
                Thêm ngay
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Ngân hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Số tài khoản
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Chủ tài khoản
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paymentInfos.map((info) => (
                    <tr key={info.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <BanknotesIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {info.bankName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg inline-block">
                          {info.bankAccountNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {info.accountHolderName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          info.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {info.isActive ? '🟢 Hoạt động' : '🔴 Tạm dừng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(info)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(info.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteConfirm === info.id
                                ? 'text-white bg-red-600 hover:bg-red-700'
                                : 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                            }`}
                            title={deleteConfirm === info.id ? "Xác nhận xóa" : "Xóa"}
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
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingInfo ? "Chỉnh sửa thông tin thanh toán" : "Thêm thông tin thanh toán mới"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tên ngân hàng *
              </label>
              <Input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="Ví dụ: MBBANK, Vietcombank, Techcombank..."
                className={formErrors.bankName ? 'border-red-500' : ''}
                required
              />
              {formErrors.bankName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.bankName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Số tài khoản *
              </label>
              <Input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                placeholder="Ví dụ: 1234567890"
                className={`font-mono ${formErrors.bankAccountNumber ? 'border-red-500' : ''}`}
                required
              />
              {formErrors.bankAccountNumber && (
                <p className="mt-1 text-sm text-red-600">{formErrors.bankAccountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tên chủ tài khoản *
              </label>
              <Input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                placeholder="Ví dụ: NGUYEN VAN A"
                className={formErrors.accountHolderName ? 'border-red-500' : ''}
                required
              />
              {formErrors.accountHolderName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.accountHolderName}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-slate-700">
                Kích hoạt tài khoản này
              </label>
            </div>
          </div>

          {formErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{formErrors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              className="px-6 py-2"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2"
            >
              {editingInfo ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentInfoManagement;
