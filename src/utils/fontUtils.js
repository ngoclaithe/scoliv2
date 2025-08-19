/**
 * Utility functions for dynamic font sizing based on team name length and device type
 */

/**
 * Determines if the current viewport is mobile, tablet, or desktop
 * @returns {Object} - Object containing boolean flags for device types
 */
export const getDeviceType = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width
  };
};

/**
 * Calculates the appropriate font size based on team name length and device type
 * @param {string} teamName - The team name
 * @param {Object} deviceType - Device type object from getDeviceType()
 * @param {Object} options - Optional configuration
 * @returns {string} - The calculated font size in CSS format
 */
export const calculateTeamNameFontSize = (teamName, deviceType, options = {}) => {
  const {
    minFontSize = { mobile: 8, tablet: 12, desktop: 16 },
    maxFontSize = { mobile: 12, tablet: 18, desktop: 32 },
    maxLength = 15
  } = options;

  const nameLength = teamName?.length || 0;
  const { isMobile, isTablet, isDesktop } = deviceType;

  let baseFontSize, min, max;
  
  if (isMobile) {
    baseFontSize = maxFontSize.mobile;
    min = minFontSize.mobile;
    max = maxFontSize.mobile;
  } else if (isTablet) {
    baseFontSize = maxFontSize.tablet;
    min = minFontSize.tablet;
    max = maxFontSize.tablet;
  } else {
    baseFontSize = maxFontSize.desktop;
    min = minFontSize.desktop;
    max = maxFontSize.desktop;
  }

  // Giảm font size dựa trên độ dài tên
  if (nameLength > maxLength) {
    const reductionFactor = Math.min((nameLength - maxLength) * 0.5, baseFontSize - min);
    baseFontSize = Math.max(min, baseFontSize - reductionFactor);
  }

  return `${baseFontSize}px`;
};

/**
 * Calculates font size for poster team names with more aggressive scaling
 * @param {string} teamName - The team name
 * @param {Object} deviceType - Device type object from getDeviceType()
 * @returns {string} - The calculated font size in CSS format
 */
export const calculatePosterTeamNameFontSize = (teamName, deviceType) => {
  const nameLength = teamName?.length || 0;
  const { isMobile, isTablet } = deviceType;

  if (isMobile) {
    if (nameLength <= 8) return '12px';
    if (nameLength <= 12) return '10px';
    return '8px';
  } else if (isTablet) {
    if (nameLength <= 8) return '18px';
    if (nameLength <= 12) return '16px';
    if (nameLength <= 16) return '14px';
    return '12px';
  } else {
    // Desktop
    if (nameLength <= 8) return '48px';
    if (nameLength <= 12) return '40px';
    if (nameLength <= 16) return '32px';
    if (nameLength <= 20) return '28px';
    return '24px';
  }
};

/**
 * Calculates font size for match title with responsive scaling
 * @param {string} title - The match title
 * @param {Object} deviceType - Device type object from getDeviceType()
 * @returns {string} - The calculated font size in CSS format
 */
export const calculateTitleFontSize = (title, deviceType) => {
  const titleLength = title?.length || 0;
  const { isMobile, isTablet } = deviceType;

  if (isMobile) {
    if (titleLength <= 15) return '20px';
    if (titleLength <= 25) return '16px';
    return '14px';
  } else if (isTablet) {
    if (titleLength <= 15) return '28px';
    if (titleLength <= 25) return '24px';
    return '20px';
  } else {
    // Desktop
    if (titleLength <= 15) return '56px';
    if (titleLength <= 25) return '48px';
    if (titleLength <= 35) return '40px';
    return '36px';
  }
};

/**
 * React hook for dynamic font sizing with window resize handling
 * @param {string} teamAName - Team A name
 * @param {string} teamBName - Team B name
 * @param {string} title - Match title
 * @returns {Object} - Object containing calculated font sizes and device info
 */
export const useDynamicFontSizes = (teamAName, teamBName, title) => {
  const [deviceType, setDeviceType] = React.useState(() => getDeviceType());
  
  React.useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    deviceType,
    teamAFontSize: calculatePosterTeamNameFontSize(teamAName, deviceType),
    teamBFontSize: calculatePosterTeamNameFontSize(teamBName, deviceType),
    titleFontSize: calculateTitleFontSize(title, deviceType),
    // Helper CSS classes
    teamAClass: `text-[${calculatePosterTeamNameFontSize(teamAName, deviceType)}]`,
    teamBClass: `text-[${calculatePosterTeamNameFontSize(teamBName, deviceType)}]`,
    titleClass: `text-[${calculateTitleFontSize(title, deviceType)}]`
  };
};

/**
 * DOM manipulation function to adjust font size dynamically
 * @param {HTMLElement} element - The DOM element to adjust
 * @param {number} minFontSize - Minimum font size in pixels
 */
export const adjustElementFontSize = (element, minFontSize = 12) => {
  if (!element) return;
  
  let fontSize = parseInt(window.getComputedStyle(element).fontSize);
  
  while (element.scrollWidth > element.offsetWidth && fontSize > minFontSize) {
    fontSize -= 1;
    element.style.fontSize = fontSize + "px";
  }
};
