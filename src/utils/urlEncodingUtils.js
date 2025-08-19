/**
 * URL encoding utilities để xử lý các ký tự đặc biệt trong URL
 * Đặc biệt xử lý matchTitle có dấu "/"
 */

// Mapping cho các ký tự đặc biệt
const SPECIAL_CHAR_MAPPING = {
  // Encode
  '/': '___SLASH___',
  '\\': '___BACKSLASH___',
  '?': '___QUESTION___',
  '#': '___HASH___',
  '&': '___AMP___',
  '=': '___EQUALS___',
  '+': '___PLUS___',
  '%': '___PERCENT___',
  
  // Reverse mapping
  '___SLASH___': '/',
  '___BACKSLASH___': '\\',
  '___QUESTION___': '?',
  '___HASH___': '#',
  '___AMP___': '&',
  '___EQUALS___': '=',
  '___PLUS___': '+',
  '___PERCENT___': '%'
};

/**
 * Encode matchTitle để an toàn cho URL
 * @param {string} matchTitle - Match title gốc
 * @returns {string} - Match title đã encode
 */
export const encodeMatchTitle = (matchTitle) => {
  if (!matchTitle) return '';
  
  let encoded = matchTitle;
  
  // Thay thế các ký tự đặc biệt
  Object.keys(SPECIAL_CHAR_MAPPING).forEach(char => {
    if (char.length < 5) { // Chỉ encode, không decode
      const placeholder = SPECIAL_CHAR_MAPPING[char];
      encoded = encoded.replace(new RegExp(escapeRegExp(char), 'g'), placeholder);
    }
  });
  
  // Thay thế space bằng underscore
  encoded = encoded.replace(/ /g, '_');
  
  // URI encode cuối cùng
  encoded = encodeURIComponent(encoded);
  
  console.log(`🔒 [urlEncoding] Encoded matchTitle: "${matchTitle}" -> "${encoded}"`);
  return encoded;
};

/**
 * Decode matchTitle từ URL
 * @param {string} encodedMatchTitle - Match title đã encode
 * @returns {string} - Match title gốc
 */
export const decodeMatchTitle = (encodedMatchTitle) => {
  if (!encodedMatchTitle) return '';
  
  let decoded = encodedMatchTitle;
  
  try {
    // URI decode trước
    decoded = decodeURIComponent(decoded);
  } catch (error) {
    console.warn('⚠️ [urlEncoding] Failed to URI decode, using as-is:', encodedMatchTitle);
  }
  
  // Thay thế placeholder bằng ký tự gốc
  Object.keys(SPECIAL_CHAR_MAPPING).forEach(placeholder => {
    if (placeholder.length > 5) { // Chỉ decode placeholder
      const originalChar = SPECIAL_CHAR_MAPPING[placeholder];
      decoded = decoded.replace(new RegExp(escapeRegExp(placeholder), 'g'), originalChar);
    }
  });
  
  // Thay thế underscore bằng space
  decoded = decoded.replace(/_/g, ' ');
  
  console.log(`🔓 [urlEncoding] Decoded matchTitle: "${encodedMatchTitle}" -> "${decoded}"`);
  return decoded;
};

/**
 * Encode text parameter chung
 * @param {string} text - Text cần encode
 * @returns {string} - Text đã encode
 */
export const encodeTextParam = (text) => {
  if (!text) return '';
  
  let encoded = text;
  
  // Thay thế các ký tự đặc biệt cơ bản
  encoded = encoded.replace(/\//g, '___SLASH___');
  encoded = encoded.replace(/ /g, '_');
  
  // URI encode
  encoded = encodeURIComponent(encoded);
  
  return encoded;
};

/**
 * Decode text parameter chung
 * @param {string} encodedText - Text đã encode
 * @returns {string} - Text gốc
 */
export const decodeTextParam = (encodedText) => {
  if (!encodedText) return '';
  
  let decoded = encodedText;
  
  try {
    // URI decode
    decoded = decodeURIComponent(decoded);
  } catch (error) {
    console.warn('⚠️ [urlEncoding] Failed to URI decode text param:', encodedText);
  }
  
  // Thay thế placeholder
  decoded = decoded.replace(/___SLASH___/g, '/');
  decoded = decoded.replace(/_/g, ' ');
  
  return decoded;
};

/**
 * Escape special characters for RegExp
 * @param {string} string - String cần escape
 * @returns {string} - String đã escape
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Kiểm tra xem string có chứa ký tự đặc biệt không
 * @param {string} text - Text cần kiểm tra
 * @returns {boolean} - True nếu có ký tự đặc biệt
 */
export const hasSpecialChars = (text) => {
  if (!text) return false;
  
  const specialChars = ['/', '\\', '?', '#', '&', '=', '+', '%'];
  return specialChars.some(char => text.includes(char));
};

/**
 * Tạo match title an toàn cho URL (không có ký tự đặc biệt)
 * @param {string} matchTitle - Match title gốc
 * @returns {string} - Match title an toàn
 */
export const createSafeMatchTitle = (matchTitle) => {
  if (!matchTitle) return 'untitled-match';
  
  let safe = matchTitle
    .replace(/[/\\?#&=+%]/g, '-') // Thay thế ký tự đặc biệt bằng dấu gạch ngang
    .replace(/\s+/g, '-') // Thay thế space bằng dấu gạch ngang
    .replace(/-+/g, '-') // Gộp nhiều dấu gạch ngang thành một
    .replace(/^-|-$/g, '') // Xóa dấu gạch ngang ở đầu và cuối
    .toLowerCase();
  
  return safe || 'untitled-match';
};

export default {
  encodeMatchTitle,
  decodeMatchTitle,
  encodeTextParam,
  decodeTextParam,
  hasSpecialChars,
  createSafeMatchTitle,
  SPECIAL_CHAR_MAPPING
};
