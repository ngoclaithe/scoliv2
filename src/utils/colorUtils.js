// Color mapping cho các màu thông dụng
const COLOR_MAPPING = {
  // Màu cơ bản
  'do': '#FF0000',
  'đỏ': '#FF0000',
  'red': '#FF0000',
  
  'xanh': '#0000FF',
  'blue': '#0000FF',
  'xanh_duong': '#0000FF',
  'xanhduong': '#0000FF',
  
  'xanh_la': '#00FF00',
  'xanhla': '#00FF00',
  'green': '#00FF00',
  'la': '#00FF00',
  
  'vang': '#FFFF00',
  'vàng': '#FFFF00',
  'yellow': '#FFFF00',
  
  'tim': '#800080',
  'tím': '#800080',
  'purple': '#800080',
  
  'hong': '#FFC0CB',
  'hồng': '#FFC0CB',
  'pink': '#FFC0CB',
  
  'cam': '#FFA500',
  'orange': '#FFA500',
  
  'den': '#000000',
  'đen': '#000000',
  'black': '#000000',
  
  'trang': '#FFFFFF',
  'trắng': '#FFFFFF',
  'white': '#FFFFFF',
  
  'xam': '#808080',
  'xám': '#808080',
  'gray': '#808080',
  'grey': '#808080',
  
  'nau': '#8B4513',
  'nâu': '#8B4513',
  'brown': '#8B4513',
  
  // Màu đặc biệt cho bóng đá
  'xanh_chelsea': '#034694',
  'xanh_man_city': '#6CABDD',
  'do_mu': '#DA020E',
  'do_liverpool': '#C8102E',
  'xanh_arsenal': '#EF0107',
  'xanh_tottenham': '#132257',
  
  // Màu nhạt
  'xanh_nhat': '#87CEEB',
  'do_nhat': '#FFB6C1',
  'vang_nhat': '#FFFFE0',
  'tim_nhat': '#DDA0DD',
  
  // Màu đậm
  'xanh_dam': '#00008B',
  'do_dam': '#8B0000',
  'vang_dam': '#FFD700',
  'tim_dam': '#4B0082'
};

/**
 * Chuyển đổi tên màu thành mã màu hex
 * @param {string} colorInput - Tên màu hoặc mã màu
 * @returns {string} - Mã màu hex
 */
export const parseColorParam = (colorInput) => {
  if (!colorInput) return null;
  
  try {
    // Decode URL encoding
    const decoded = decodeURIComponent(colorInput).toLowerCase().trim();
    
    // Nếu đã là mã màu hex, trả về luôn
    if (decoded.startsWith('#') && /^#[0-9A-Fa-f]{6}$/.test(decoded)) {
      return decoded.toUpperCase();
    }
    
    // Thay thế khoảng trắng bằng underscore để match với mapping
    const normalizedColor = decoded.replace(/\s+/g, '_');
    
    // Tìm trong color mapping
    if (COLOR_MAPPING[normalizedColor]) {
      return COLOR_MAPPING[normalizedColor];
    }
    
    // Thử tìm với key gốc (không có underscore)
    if (COLOR_MAPPING[decoded.replace(/\s+/g, '')]) {
      return COLOR_MAPPING[decoded.replace(/\s+/g, '')];
    }
    
    console.log(`⚠️ [ColorUtils] Unknown color: "${colorInput}", using default`);
    return null;
    
  } catch (error) {
    console.error('❌ [ColorUtils] Error parsing color:', error);
    return null;
  }
};

/**
 * Lấy tên màu từ mã hex (để hiển thị)
 * @param {string} hexColor - Mã màu hex
 * @returns {string} - Tên màu tiếng Việt
 */
export const getColorName = (hexColor) => {
  if (!hexColor) return '';
  
  const upperHex = hexColor.toUpperCase();
  
  for (const [name, hex] of Object.entries(COLOR_MAPPING)) {
    if (hex === upperHex) {
      return name;
    }
  }
  
  return hexColor;
};

/**
 * Kiểm tra xem có phải mã màu hợp lệ không
 * @param {string} color - Màu cần kiểm tra
 * @returns {boolean}
 */
export const isValidColor = (color) => {
  if (!color) return false;
  
  // Kiểm tra hex color
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return true;
  }
  
  // Kiểm tra tên màu
  const normalized = color.toLowerCase().replace(/\s+/g, '_');
  return !!COLOR_MAPPING[normalized];
};

/**
 * Lấy danh sách tất cả màu có sẵn
 * @returns {Array} - Danh sách các màu
 */
export const getAvailableColors = () => {
  return Object.keys(COLOR_MAPPING).map(name => ({
    name,
    hex: COLOR_MAPPING[name],
    displayName: name.replace(/_/g, ' ')
  }));
};

/**
 * Default team colors
 */
export const DEFAULT_TEAM_COLORS = {
  teamA: {
    kitColor: '#FF0000', // Đỏ
    kitColor2: '#0000FF' // Xanh dương
  },
  teamB: {
    kitColor: '#000000', // Đen
    kitColor2: '#FFFFFF' // Trắng
  }
};

export default {
  parseColorParam,
  getColorName,
  isValidColor,
  getAvailableColors,
  DEFAULT_TEAM_COLORS,
  COLOR_MAPPING
};
