import { buildDynamicRoute } from './dynamicRouteUtils';

/**
 * Tạo URL demo với các tham số mẫu
 * @param {string} accessCode - Mã truy cập
 * @param {Object} options - Tùy chọn override
 * @returns {string} - URL hoàn chỉnh
 */
export const createDemoUrl = (accessCode, options = {}) => {
  const defaultParams = {
    accessCode,
    location: 'SVĐ_MỸ_ĐÌNH',
    matchTitle: 'VÒNG_LOẠI_WORLD_CUP',
    liveText: 'FACEBOOK_LIVE',
    teamALogoCode: 'VN',
    teamBLogoCode: 'TH',
    teamAName: 'VIỆT_NAM',
    teamBName: 'THÁI_LAN',
    teamAKitColor: 'do',
    teamBKitColor: 'xanh',
    teamAScore: 2,
    teamBScore: 1,
    view: 'scoreboard',
    matchTime: '45:00',
    ...options
  };

  return buildDynamicRoute(defaultParams);
};

/**
 * Các template URL cho testing
 */
export const URL_TEMPLATES = {
  // Template cơ bản
  basic: (accessCode) => createDemoUrl(accessCode, {
    teamAScore: 0,
    teamBScore: 0,
    view: 'poster',
    matchTime: '00:00'
  }),

  // Template đang thi đấu
  live: (accessCode) => createDemoUrl(accessCode, {
    view: 'scoreboard',
    matchTime: '25:00'
  }),

  // Template penalty
  penalty: (accessCode) => createDemoUrl(accessCode, {
    view: 'penalty_scoreboard',
    teamAScore: 1,
    teamBScore: 1,
    matchTime: '90:00'
  }),

  // Template với màu đặc biệt
  colorDemo: (accessCode) => createDemoUrl(accessCode, {
    teamAKitColor: 'tim',
    teamBKitColor: 'vang',
    view: 'poster'
  }),

  // Template tự động start timer
  autoStart: (accessCode, minutes = 25) => createDemoUrl(accessCode, {
    view: 'scoreboard',
    matchTime: `${minutes}:00`
  })
};

/**
 * Danh sách các màu có sẵn cho URL
 */
export const AVAILABLE_URL_COLORS = [
  'do', 'xanh', 'vang', 'tim', 'hong', 'cam', 'den', 'trang', 'xam',
  'do_dam', 'xanh_dam', 'vang_dam', 'tim_dam',
  'do_nhat', 'xanh_nhat', 'vang_nhat', 'tim_nhat',
  'xanh_chelsea', 'xanh_man_city', 'do_mu', 'do_liverpool'
];

/**
 * Tạo URL với màu ngẫu nhiên
 * @param {string} accessCode - Mã truy cập
 * @returns {string} - URL với màu ngẫu nhiên
 */
export const createRandomColorUrl = (accessCode) => {
  const randomColorA = AVAILABLE_URL_COLORS[Math.floor(Math.random() * AVAILABLE_URL_COLORS.length)];
  const randomColorB = AVAILABLE_URL_COLORS[Math.floor(Math.random() * AVAILABLE_URL_COLORS.length)];

  return createDemoUrl(accessCode, {
    teamAKitColor: randomColorA,
    teamBKitColor: randomColorB
  });
};

/**
 * Parse URL hiện tại để lấy thông tin
 * @param {string} url - URL cần parse
 * @returns {Object} - Thông tin parsed
 */
export const parseCurrentUrl = (url = window.location.pathname) => {
  const parts = url.split('/').filter(Boolean);
  
  if (parts.length >= 14) {
    return {
      accessCode: parts[0],
      location: decodeURIComponent(parts[1].replace(/_/g, ' ')),
      matchTitle: decodeURIComponent(parts[2].replace(/_/g, ' ')),
      liveText: decodeURIComponent(parts[3].replace(/_/g, ' ')),
      teamALogoCode: parts[4],
      teamBLogoCode: parts[5],
      teamAName: decodeURIComponent(parts[6].replace(/_/g, ' ')),
      teamBName: decodeURIComponent(parts[7].replace(/_/g, ' ')),
      teamAKitColor: parts[8],
      teamBKitColor: parts[9],
      teamAScore: parseInt(parts[10]) || 0,
      teamBScore: parseInt(parts[11]) || 0,
      view: decodeURIComponent(parts[12].replace(/_/g, ' ')),
      matchTime: decodeURIComponent(parts[13])
    };
  }
  
  return null;
};

/**
 * Validate URL format
 * @param {string} url - URL cần validate
 * @returns {boolean} - True nếu hợp lệ
 */
export const isValidDynamicUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return parts.length >= 14;
};

export default {
  createDemoUrl,
  URL_TEMPLATES,
  AVAILABLE_URL_COLORS,
  createRandomColorUrl,
  parseCurrentUrl,
  isValidDynamicUrl
};
