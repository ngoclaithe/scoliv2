export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN');
};

export const getStatusColor = (status) => {
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

export const getStatusText = (status) => {
  switch (status) {
    case 'active': return '🟢 Sẵn sàng';
    case 'expired': return '🔴 Hết hạn';
    case 'inactive': return '⚪ Chưa kích hoạt';
    case 'used': return '🟡 Đang sử dụng';
    default: return '❓ Không xác định';
  }
};

export const generateSepayQRUrl = (paymentData) => {
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
