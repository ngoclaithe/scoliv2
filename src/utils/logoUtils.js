const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000';

/**
 * Kiểm tra xem URL có phải là đường dẫn tuyệt đối hay không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} - true nếu là đường dẫn tuyệt đối
 */
const isAbsoluteUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  
  if (url.startsWith('//')) {
    return true;
  }
  
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
  if (!logoUrl || typeof logoUrl !== 'string' || logoUrl.trim() === '') {
    return null;
  }
  
  if (isAbsoluteUrl(logoUrl)) {
    return logoUrl;
  }

  const cleanPath = logoUrl.startsWith('/') ? logoUrl.substring(1) : logoUrl;
  
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
    .filter(url => url !== null);
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
 * Tạo URL đầy đủ cho poster bằng cách thêm API_BASE_URL nếu cần
 * @param {string} posterUrl - URL poster từ backend (có thể là relative hoặc absolute)
 * @returns {string} - URL đầy đủ có thể sử dụng được
 */
export const getFullPosterUrl = (posterUrl) => {
  if (!posterUrl || typeof posterUrl !== 'string' || posterUrl.trim() === '') {
    return null;
  }

  if (isAbsoluteUrl(posterUrl)) {
    return posterUrl;
  }

  const cleanPath = posterUrl.startsWith('/') ? posterUrl.substring(1) : posterUrl;

  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

  return `${baseUrl}/${cleanPath}`;
};

/**
 * Xử lý object chứa url_poster
 * @param {Object} posterObject - Object chứa url_poster
 * @returns {string|null} - URL đầy đủ hoặc null
 */
export const getFullPosterUrlFromObject = (posterObject) => {
  if (!posterObject || typeof posterObject !== 'object') {
    return null;
  }

  return getFullPosterUrl(posterObject.url_poster);
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
  getFullPosterUrl,
  getFullPosterUrlFromObject,
  debugLogUrl
};
