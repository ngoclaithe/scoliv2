/**
 * Generates a random alphanumeric code of specified length
 * @param {number} length - Length of the code to generate
 * @param {boolean} [numbersOnly=true] - Whether to generate numbers only
 * @returns {string} - Generated code
 */
const generateRandomCode = (length = 6, numbersOnly = true) => {
  let result = '';
  let characters = '0123456789';
  
  if (!numbersOnly) {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * Formats a number to VND currency format
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
const formatCurrencyVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function toDateInputFormat(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

/**
 * Formats date to Vietnamese format (dd.mm.yyyy)
 * @param {string|Date} dateInput - Date to format
 * @returns {string} - Formatted date string
 */
function formatVietnameseDate(dateInput) {
  let date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date();
  }

  if (isNaN(date.getTime())) {
    date = new Date();
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

module.exports = {
  generateRandomCode,
  formatCurrencyVND,
  toDateInputFormat,
  formatVietnameseDate
};
