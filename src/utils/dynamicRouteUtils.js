import LogoAPI from '../API/apiLogo';
import { getFullLogoUrl } from './logoUtils';

/**
 * Tìm logo URL dựa trên logo code
 * @param {string} logoCode - Mã logo cần tìm
 * @returns {Promise<string|null>} - URL của logo hoặc null nếu không tìm thấy
 */
export const findLogoByCode = async (logoCode) => {
  if (!logoCode || logoCode.trim().length === 0) {
    return null;
  }

  try {
    console.log(`🔍 [dynamicRouteUtils] Searching for logo with code: ${logoCode}`);
    const response = await LogoAPI.searchLogosByCode(logoCode.trim(), true);
    
    if (response?.data?.length > 0) {
      const foundLogo = response.data[0];
      const logoUrl = getFullLogoUrl(foundLogo.url_logo || foundLogo.file_path);
      console.log(`✅ [dynamicRouteUtils] Found logo for code ${logoCode}:`, logoUrl);
      return logoUrl;
    } else {
      console.log(`⚠️ [dynamicRouteUtils] No logo found for code: ${logoCode}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ [dynamicRouteUtils] Error finding logo for code ${logoCode}:`, error);
    return null;
  }
};

/**
 * Tìm cả hai logo đội dựa trên code
 * @param {string} teamALogoCode - Mã logo đội A
 * @param {string} teamBLogoCode - Mã logo đội B
 * @returns {Promise<{teamALogo: string|null, teamBLogo: string|null}>}
 */
export const findTeamLogos = async (teamALogoCode, teamBLogoCode) => {
  const [teamALogo, teamBLogo] = await Promise.all([
    findLogoByCode(teamALogoCode),
    findLogoByCode(teamBLogoCode)
  ]);

  return {
    teamALogo,
    teamBLogo
  };
};

/**
 * Validate và parse màu hex từ URL parameter
 * @param {string} colorParam - Tham số màu từ URL (không có #)
 * @returns {string} - Màu hex hợp lệ có dấu #
 */
export const parseColorParam = (colorParam) => {
  if (!colorParam) return '#000000';
  
  // Loại bỏ # nếu có
  const cleanColor = colorParam.replace('#', '');
  
  // Kiểm tra format hex hợp lệ (3 hoặc 6 ký tự)
  const hexPattern = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;
  
  if (hexPattern.test(cleanColor)) {
    return `#${cleanColor}`;
  }
  
  // Trả về màu mặc định nếu không hợp lệ
  return '#000000';
};

/**
 * Parse tên đội từ URL parameter
 * @param {string} teamNameParam - Tham số tên đội từ URL
 * @param {string} defaultName - Tên mặc định nếu không có
 * @returns {string} - Tên đội đã decode
 */
export const parseTeamName = (teamNameParam, defaultName = 'ĐỘI') => {
  if (!teamNameParam) return defaultName;
  
  try {
    return decodeURIComponent(teamNameParam.replace(/_/g, ' '));
  } catch (error) {
    console.warn('Failed to decode team name:', teamNameParam, error);
    return teamNameParam.replace(/_/g, ' ') || defaultName;
  }
};

/**
 * Parse text từ URL parameter
 * @param {string} textParam - Tham số text từ URL
 * @returns {string} - Text đã decode
 */
export const parseTextParam = (textParam) => {
  if (!textParam) return '';
  
  try {
    return decodeURIComponent(textParam.replace(/_/g, ' '));
  } catch (error) {
    console.warn('Failed to decode text param:', textParam, error);
    return textParam.replace(/_/g, ' ') || '';
  }
};

/**
 * Parse số từ URL parameter
 * @param {string} numberParam - Tham số số từ URL
 * @param {number} defaultValue - Giá trị mặc định
 * @returns {number} - Số đã parse
 */
export const parseNumberParam = (numberParam, defaultValue = 0) => {
  if (!numberParam) return defaultValue;
  
  const parsed = parseInt(numberParam, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Tạo URL dynamic route từ các tham số
 * @param {Object} params - Các tham số
 * @returns {string} - URL dynamic route
 */
export const buildDynamicRoute = (params) => {
  const {
    accessCode,
    location = 'stadium',
    matchTitle = 'match',
    liveText = 'live',
    teamALogoCode = 'TEAMA',
    teamBLogoCode = 'TEAMB',
    teamAName = 'TEAM_A',
    teamBName = 'TEAM_B',
    teamAKitColor = 'FF0000',
    teamBKitColor = '0000FF',
    teamAScore = 0,
    teamBScore = 0,
    view = 'poster',
    matchTime = '00:00'
  } = params;

  // Encode các tham số text
  const encodedLocation = encodeURIComponent(location.replace(/ /g, '_'));
  const encodedMatchTitle = encodeURIComponent(matchTitle.replace(/ /g, '_'));
  const encodedLiveText = encodeURIComponent(liveText.replace(/ /g, '_'));
  const encodedTeamAName = encodeURIComponent(teamAName.replace(/ /g, '_'));
  const encodedTeamBName = encodeURIComponent(teamBName.replace(/ /g, '_'));
  const encodedView = encodeURIComponent(view.replace(/ /g, '_'));
  const encodedMatchTime = encodeURIComponent(matchTime.replace(/ /g, '_'));

  // Loại bỏ # khỏi màu
  const cleanTeamAColor = teamAKitColor.replace('#', '');
  const cleanTeamBColor = teamBKitColor.replace('#', '');

  return `/${accessCode}/${encodedLocation}/${encodedMatchTitle}/${encodedLiveText}/${teamALogoCode}/${teamBLogoCode}/${encodedTeamAName}/${encodedTeamBName}/${cleanTeamAColor}/${cleanTeamBColor}/${teamAScore}/${teamBScore}/${encodedView}/${encodedMatchTime}`;
};

export default {
  findLogoByCode,
  findTeamLogos,
  parseColorParam,
  parseTeamName,
  parseTextParam,
  parseNumberParam,
  buildDynamicRoute
};
