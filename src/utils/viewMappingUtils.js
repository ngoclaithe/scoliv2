/**
 * View mapping utilities cho URL routing
 * Map giữa view names trong URL với internal view names
 */

// Mapping từ URL view names (tiếng Việt thân thiện) sang internal view names
export const URL_TO_INTERNAL_VIEW = {
  // Tiếng Việt mapping
  'tisotren': 'scoreboard',
  'tisoduoi': 'scoreboard_below', 
  'gioithieu': 'intro',
  'nghi': 'halftime',
  'penalty': 'penalty_scoreboard',
  'danhsach': 'player_list',
  'thongke': 'stat',
  'sukien': 'event',
  'poster': 'poster',
  
  // English mapping (giữ compatibility)
  'scoreboard': 'scoreboard',
  'scoreboard_below': 'scoreboard_below',
  'intro': 'intro', 
  'halftime': 'halftime',
  'penalty_scoreboard': 'penalty_scoreboard',
  'player_list': 'player_list',
  'stat': 'stat',
  'event': 'event'
};

// Mapping ngược từ internal view names sang URL view names (tiếng Việt)
export const INTERNAL_TO_URL_VIEW = {
  'scoreboard': 'tisotren',
  'scoreboard_below': 'tisoduoi',
  'intro': 'gioithieu', 
  'halftime': 'nghi',
  'penalty_scoreboard': 'penalty',
  'player_list': 'danhsach',
  'stat': 'thongke',
  'event': 'sukien',
  'poster': 'poster'
};

/**
 * Chuyển đổi view từ URL parameter sang internal view name
 * @param {string} urlView - View parameter từ URL
 * @returns {string} - Internal view name
 */
export const mapUrlViewToInternal = (urlView) => {
  if (!urlView) return 'poster';
  
  const normalizedView = urlView.toLowerCase().trim();
  const internalView = URL_TO_INTERNAL_VIEW[normalizedView];
  
  if (internalView) {
    console.log(`🗺️ [viewMapping] Mapped URL view "${urlView}" -> "${internalView}"`);
    return internalView;
  }
  
  // Fallback: nếu không tìm thấy mapping, trả về view gốc
  console.warn(`⚠️ [viewMapping] No mapping found for view "${urlView}", using as-is`);
  return normalizedView;
};

/**
 * Chuyển đổi internal view name sang URL view name (tiếng Việt)
 * @param {string} internalView - Internal view name
 * @returns {string} - URL view name
 */
export const mapInternalViewToUrl = (internalView) => {
  if (!internalView) return 'poster';
  
  const urlView = INTERNAL_TO_URL_VIEW[internalView];
  
  if (urlView) {
    return urlView;
  }
  
  // Fallback: trả về view gốc nếu không tìm thấy mapping
  return internalView;
};

/**
 * Kiểm tra xem view có hợp lệ không
 * @param {string} view - View cần kiểm tra
 * @returns {boolean} - True nếu view hợp lệ
 */
export const isValidView = (view) => {
  if (!view) return false;
  
  const normalizedView = view.toLowerCase().trim();
  
  // Kiểm tra trong URL mapping hoặc internal views
  return Object.keys(URL_TO_INTERNAL_VIEW).includes(normalizedView) ||
         Object.keys(INTERNAL_TO_URL_VIEW).includes(normalizedView);
};

/**
 * Lấy danh sách tất cả view names có thể sử dụng trong URL
 * @returns {string[]} - Mảng các view names
 */
export const getAllUrlViewNames = () => {
  return Object.keys(URL_TO_INTERNAL_VIEW);
};

/**
 * Lấy danh sách tất cả internal view names
 * @returns {string[]} - Mảng các internal view names
 */
export const getAllInternalViewNames = () => {
  return Object.keys(INTERNAL_TO_URL_VIEW);
};

export default {
  mapUrlViewToInternal,
  mapInternalViewToUrl,
  isValidView,
  getAllUrlViewNames,
  getAllInternalViewNames,
  URL_TO_INTERNAL_VIEW,
  INTERNAL_TO_URL_VIEW
};
