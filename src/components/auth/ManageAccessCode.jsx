import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import AccessCodeAPI from '../../API/apiAccessCode';
import PaymentAccessCodeAPI from '../../API/apiPaymentAccessCode';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

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
  const handleCreateCode = async (typeMatch = 'soccer') => {
    try {
      setCreateLoading(true);
      
      const response = await AccessCodeAPI.createCode({ typeMatch });
      
      if (response && response.data) {
        // Cập nhật danh sách mã sau khi tạo thành công
        setCodes(prev => [response.data, ...prev]);
        const sportName = {
          'soccer': 'bóng đá',
          'futsal': 'futsal',
          'pickleball': 'pickleball'
        }[typeMatch] || '';
        
        toast.success(`Tạo mã truy cập ${sportName} thành công!`, {
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
      case 'inactive': return '⚪ Chưa kích hoạt';
      default: return '❓ Không xác định';
    }
  };

  // Xử lý mua mã access code
  const handlePurchaseCode = async (accessCode) => {
    try {
      setPaymentLoading(true);

      const paymentRequest = {
        accessCode: accessCode,
        bankAccountNumber: "1468651509999",
        bankName: "MBBANK",
        amount: "10000",
        transactionNote: `Mua ma truy cap ${accessCode}`
      };

      const response = await PaymentAccessCodeAPI.createPaymentRequest(paymentRequest);

      if (response.success) {
        setPaymentData(response.data);
        setShowPaymentModal(true);
        toast.success('Tạo yêu cầu thanh toán thành công!', {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response?.message || 'Không thể tạo yêu cầu thanh toán');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo thanh toán: ' + (error.message || 'Vui lòng thử lại sau'), {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Lỗi khi tạo thanh toán:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Map mã ngân hàng theo chuẩn VietQR
  const getBankCode = (bankName) => {
    const bankCodes = {
      'MBBANK': '970422',
      'VIETCOMBANK': '970436', 
      'TECHCOMBANK': '970407',
      'VIETINBANK': '970415',
      'AGRIBANK': '970405',
      'SACOMBANK': '970403',
      'BIDV': '970418',
      'VPBANK': '970432',
      'TPBANK': '970423',
      'ACBBANK': '970416',
      'VIB': '970441',
      'DONGABANK': '970406',
      'EXIMBANK': '970431',
      'HDBANK': '970437',
      'LIENVIETPOSTBANK': '970449',
      'MARITIMEBANK': '970426',
      'NAMABANK': '970428',
      'OCEANBANK': '970414',
      'PGBANK': '970430',
      'PUBLICBANK': '970439',
      'SEABANK': '970440',
      'SHBBANK': '970443',
      'STANDARDCHARTERED': '970410',
      'VIETABANK': '970427',
      'VIETCAPITALBANK': '970454',
      'WOORIBANK': '970457'
    };
    return bankCodes[bankName.toUpperCase()] || '970422';
  };

  // Tạo QR code data theo chuẩn VietQR EMVCo
  const generateVietQRData = (paymentInfo) => {
    if (!paymentInfo) return '';

    try {
      const bankCode = getBankCode(paymentInfo.bankName);
      const accountNumber = paymentInfo.bankAccountNumber;
      const amount = parseFloat(paymentInfo.amount);
      const memo = paymentInfo.code_pay;

      // Format theo chuẩn EMVCo QR Code
      let qrString = '';
      
      // Payload Format Indicator
      qrString += '000201';
      
      // Point of Initiation Method
      qrString += '010212';
      
      // Merchant Account Information
      const merchantInfo = `0010A000000727` + 
                          `01${('0' + bankCode.length).slice(-2)}${bankCode}` +
                          `02${('0' + accountNumber.length).slice(-2)}${accountNumber}`;
      qrString += `38${('0' + merchantInfo.length).slice(-2)}${merchantInfo}`;
      
      // Transaction Currency (VND = 704)
      qrString += '5303704';
      
      // Transaction Amount
      if (amount > 0) {
        const amountStr = amount.toString();
        qrString += `54${('0' + amountStr.length).slice(-2)}${amountStr}`;
      }
      
      // Country Code
      qrString += '5802VN';
      
      // Additional Data Field
      if (memo) {
        const additionalData = `08${('0' + memo.length).slice(-2)}${memo}`;
        qrString += `62${('0' + additionalData.length).slice(-2)}${additionalData}`;
      }
      
      // CRC (sẽ tính sau)
      qrString += '6304';
      
      // Tính CRC16
      const crc = calculateCRC16(qrString);
      qrString += crc.toUpperCase();
      
      return qrString;
    } catch (error) {
      console.error('Lỗi tạo VietQR data:', error);
      return '';
    }
  };

  // Tính CRC16 theo chuẩn ISO/IEC 13239
  const calculateCRC16 = (data) => {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < data.length; i++) {
      crc ^= (data.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
      }
    }
    
    return (crc & 0xFFFF).toString(16).padStart(4, '0');
  };

  // Tạo URL VietQR cho hiển thị ảnh (backup)
  const generateQRImageUrl = (paymentInfo) => {
    if (!paymentInfo) return '';

    try {
      const amount = paymentInfo.amount;
      const memo = encodeURIComponent(paymentInfo.code_pay);
      const bankCode = getBankCode(paymentInfo.bankName);
      
      return `https://img.vietqr.io/image/${bankCode}-${paymentInfo.bankAccountNumber}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=NGUOI%20NHAN`;
    } catch (error) {
      console.error('Lỗi tạo QR image URL:', error);
      return '';
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

  // Xử lý nhanh vào trận với code cụ thể
  const handleQuickEnter = async (code) => {
    const result = await enterMatchCode(code);
    if (result.success) {
      toast.success('Vào trận thành công!', {
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
                  <span className="text-white text-sm">🏠Vào trận</span>
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
              Danh sách mã
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab content */}
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
                          {onNavigate && code.status === 'active' && (
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
                {/* QR Code */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-3">Quét mã QR để thanh toán</h4>
                  <div className="bg-white p-4 rounded-lg inline-block shadow-sm border-2 border-gray-200">
                    <QRCodeCanvas
                      value={generateVietQRData(paymentData)}
                      size={220}
                      level="M"
                      includeMargin={true}
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Quét bằng app ngân hàng Việt Nam
                  </p>
                  
                  {/* Backup: Hiển thị QR từ VietQR API nếu cần */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Hoặc dùng QR từ VietQR:</p>
                    <img 
                      src={generateQRImageUrl(paymentData)} 
                      alt="VietQR Code"
                      className="mx-auto border rounded"
                      style={{ maxWidth: '200px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin chuyển khoản</h4>

                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Ngân hàng</div>
                    <div className="font-semibold">{paymentData.bankName}</div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Số tài khoản</div>
                    <div className="font-mono font-semibold">{paymentData.bankAccountNumber}</div>
                  </div>

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
                    toast.success('Đã sao chép thông tin thanh toán!', {
                      position: "top-left",
                      autoClose: 2000,
                    });
                  }).catch(() => {
                    toast.error('Không thể sao chép. Vui lòng sao chép thủ công.', {
                      position: "top-left",
                      autoClose: 3000,
                    });
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
    </div>
  );
};

export default ManageAccessCode;