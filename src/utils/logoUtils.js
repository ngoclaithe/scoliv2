/**
 * Utility functions for handling logo URLs
 */

// Lấy API base URL từ environment variable
const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://192.168.31.186:5000';

/**
 * Kiểm tra xem URL có phải là đường dẫn tuyệt đối hay không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} - true nếu là đường dẫn tuyệt đối
 */
const isAbsoluteUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Kiểm tra nếu URL bắt đầu bằng http:// hoặc https://
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  
  // Kiểm tra nếu URL bắt đầu bằng //
  if (url.startsWith('//')) {
    return true;
  }
  
  // Kiểm tra nếu URL bắt đầu bằng data: (base64)
  if (url.startsWith('data:')) {
    return true;
  }
  
  return false;
};

/**
 * Tạo URL đầy đủ cho logo bằng cách thêm API_BASE_URL nếu cần
 * @param {string} logoUrl - URL logo từ backend (có thể là relative hoặc absolute)
 * @returns {string} - URL đầy đủ có thể sử dụng được
 */
export const getFullLogoUrl = (logoUrl) => {
  // Nếu URL null, undefined hoặc chuỗi rỗng, trả về null
  if (!logoUrl || typeof logoUrl !== 'string' || logoUrl.trim() === '') {
    return null;
  }
  
  // Nếu đã là đường dẫn tuyệt đối, trả về nguyên bản
  if (isAbsoluteUrl(logoUrl)) {
    return logoUrl;
  }
  
  // Nếu là đường dẫn tương đối, thêm API_BASE_URL vào trước
  // Loại bỏ dấu / ở đầu nếu có để tránh double slashes
  const cleanPath = logoUrl.startsWith('/') ? logoUrl.substring(1) : logoUrl;
  
  // Đảm bảo API_BASE_URL không kết thúc bằng dấu /
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Xử lý array các URL logo
 * @param {Array} logoUrls - Mảng các URL logo
 * @returns {Array} - Mảng các URL đầy đủ
 */
export const getFullLogoUrls = (logoUrls) => {
  if (!Array.isArray(logoUrls)) {
    return [];
  }
  
  return logoUrls
    .map(url => getFullLogoUrl(url))
    .filter(url => url !== null); // Loại bỏ các URL null
};

/**
 * Xử lý object chứa url_logo
 * @param {Object} logoObject - Object chứa url_logo
 * @returns {string|null} - URL đầy đủ hoặc null
 */
export const getFullLogoUrlFromObject = (logoObject) => {
  if (!logoObject || typeof logoObject !== 'object') {
    return null;
  }
  
  return getFullLogoUrl(logoObject.url_logo);
};

/**
 * Log để debug (có thể tắt trong production)
 */
export const debugLogUrl = (originalUrl, fullUrl, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[LogoUtils${context ? ` - ${context}` : ''}] Original: "${originalUrl}" -> Full: "${fullUrl}"`);
  }
};

export default {
  getFullLogoUrl,
  getFullLogoUrls,
  getFullLogoUrlFromObject,
  debugLogUrl
};
