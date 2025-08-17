/**
 * Match Time utilities
 * Xử lý format matchTime mới: T41 thay vì 41:00
 */

/**
 * Parse matchTime từ URL parameter (format: T41)
 * @param {string} matchTimeParam - Tham số matchTime từ URL (T41, T90, etc.)
 * @returns {string} - MatchTime format chuẩn (41:00, 90:00)
 */
export const parseMatchTimeParam = (matchTimeParam) => {
  if (!matchTimeParam) return '00:00';
  
  // Nếu đã là format cũ (41:00), trả về như cũ
  if (matchTimeParam.includes(':')) {
    return matchTimeParam;
  }
  
  // Nếu có tiền tố T (T41)
  if (matchTimeParam.startsWith('T')) {
    const minutes = matchTimeParam.substring(1);
    const minutesNum = parseInt(minutes, 10);
    
    if (isNaN(minutesNum)) {
      console.warn('⚠️ [matchTimeUtils] Invalid matchTime format:', matchTimeParam);
      return '00:00';
    }
    
    // Format: MM:00 (mặc định giây là 00)
    const formattedTime = `${minutesNum.toString().padStart(2, '0')}:00`;
    console.log(`🕐 [matchTimeUtils] Parsed matchTime: ${matchTimeParam} -> ${formattedTime}`);
    return formattedTime;
  }
  
  // Nếu chỉ là số (41)
  const minutesNum = parseInt(matchTimeParam, 10);
  if (!isNaN(minutesNum)) {
    const formattedTime = `${minutesNum.toString().padStart(2, '0')}:00`;
    console.log(`🕐 [matchTimeUtils] Parsed matchTime: ${matchTimeParam} -> ${formattedTime}`);
    return formattedTime;
  }
  
  console.warn('⚠️ [matchTimeUtils] Could not parse matchTime:', matchTimeParam);
  return '00:00';
};

/**
 * Encode matchTime cho URL (format: T41)
 * @param {string} matchTime - MatchTime format chuẩn (41:00, 90:00)
 * @returns {string} - MatchTime format URL (T41, T90)
 */
export const encodeMatchTimeForUrl = (matchTime) => {
  if (!matchTime || matchTime === '00:00') return 'T0';
  
  // Parse minutes từ format MM:SS
  const [minutes, seconds] = matchTime.split(':');
  const minutesNum = parseInt(minutes, 10);
  
  if (isNaN(minutesNum)) {
    console.warn('⚠️ [matchTimeUtils] Invalid matchTime format for encoding:', matchTime);
    return 'T0';
  }
  
  const encoded = `T${minutesNum}`;
  console.log(`🔗 [matchTimeUtils] Encoded matchTime: ${matchTime} -> ${encoded}`);
  return encoded;
};

/**
 * Kiểm tra xem matchTime có hợp lệ không
 * @param {string} matchTime - MatchTime cần kiểm tra
 * @returns {boolean} - True nếu hợp lệ
 */
export const isValidMatchTime = (matchTime) => {
  if (!matchTime) return false;
  
  // Format T41
  if (matchTime.startsWith('T')) {
    const minutes = matchTime.substring(1);
    const minutesNum = parseInt(minutes, 10);
    return !isNaN(minutesNum) && minutesNum >= 0 && minutesNum <= 120;
  }
  
  // Format 41:00
  if (matchTime.includes(':')) {
    const [minutes, seconds] = matchTime.split(':');
    const minutesNum = parseInt(minutes, 10);
    const secondsNum = parseInt(seconds, 10);
    
    return !isNaN(minutesNum) && !isNaN(secondsNum) && 
           minutesNum >= 0 && minutesNum <= 120 && 
           secondsNum >= 0 && secondsNum <= 59;
  }
  
  // Format 41
  const minutesNum = parseInt(matchTime, 10);
  return !isNaN(minutesNum) && minutesNum >= 0 && minutesNum <= 120;
};

/**
 * Lấy display text cho matchTime
 * @param {string} matchTime - MatchTime (T41, 41:00, etc.)
 * @returns {string} - Display text (41:00)
 */
export const getMatchTimeDisplay = (matchTime) => {
  return parseMatchTimeParam(matchTime);
};

/**
 * Tạo URL-friendly matchTime
 * @param {string} matchTime - MatchTime input từ user
 * @returns {string} - URL-friendly format (T41)
 */
export const createUrlFriendlyMatchTime = (matchTime) => {
  if (!matchTime) return 'T0';
  
  // Nếu đã là format URL (T41), return as-is
  if (matchTime.startsWith('T')) {
    return matchTime;
  }
  
  // Convert từ các format khác
  return encodeMatchTimeForUrl(parseMatchTimeParam(matchTime));
};

export default {
  parseMatchTimeParam,
  encodeMatchTimeForUrl,
  isValidMatchTime,
  getMatchTimeDisplay,
  createUrlFriendlyMatchTime
};
