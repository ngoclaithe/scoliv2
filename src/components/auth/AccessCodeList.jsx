import React from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { getStatusColor, getStatusText, formatDate, generateSepayQRUrl } from '../../utils/accessCodeUtils';

const AccessCodeList = ({ 
  codes, 
  pagination, 
  loading, 
  createLoading, 
  paymentLoading,
  selectedCode,
  showDetailModal,
  setShowDetailModal,
  setSelectedCode,
  showPaymentModal,
  setShowPaymentModal,
  paymentData,
  setPaymentData,
  onCreateCode,
  onPurchaseCode,
  onQuickEnter,
  onNavigate,
  onLoadCodes
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý mã truy cập</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            onClick={() => onCreateCode('soccer')}
            disabled={createLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <span className="text-sm">+</span>
            Bóng đá
          </Button>
          <Button
            onClick={() => onCreateCode('futsal')}
            disabled={createLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <span className="text-sm">+</span>
            Futsal
          </Button>
          <Button
            onClick={() => onCreateCode('pickleball')}
            disabled={createLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <span className="text-sm">+</span>
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
                      <div className="sm:hidden mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code.status)}`}>
                          {getStatusText(code.status)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(code.status)}`}>
                      {getStatusText(code.status)}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-end">
                      {onNavigate && (code.status === 'active' || code.status === 'used') && (
                        <button
                          onClick={() => onQuickEnter(code.code)}
                          className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded text-xs transition-colors"
                          title="Vào trận nhanh với mã này"
                        >
                          🚀 Vào trận
                        </button>
                      )}
                      {code.status === 'inactive' && (
                        <button
                          onClick={() => onPurchaseCode(code.code)}
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

        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onLoadCodes(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => onLoadCodes(pagination.page + 1)}
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
                      onClick={() => onLoadCodes(i + 1)}
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
    </div>
  );
};

export default AccessCodeList;
