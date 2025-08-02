import React, { useRef } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';

export default function DodenMatchIntro() {
  // Sử dụng dữ liệu từ PublicMatchContext
  const {
    matchData: contextMatchData,
    marqueeData,
    sponsors,
    organizing,
    mediaPartners,
    tournamentLogo,
    liveUnit,
    displaySettings,
    posterSettings
  } = usePublicMatch();
  
  // Kết hợp dữ liệu từ context với dữ liệu mặc định
  const matchData = {
    matchTitle: contextMatchData.tournament || 'GIẢI VÔ ĐỊCH QUỐC GIA',
    team1: contextMatchData.teamA.name || 'FIRE TIGERS',
    team2: contextMatchData.teamB.name || 'BLACK EAGLES',
    logo1: contextMatchData.teamA.logo || '/images/background-poster/default_logoA.png',
    logo2: contextMatchData.teamB.logo || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ MỸ ĐÌNH',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '20:00',
    currentDate: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN'),
    
    sponsors: sponsors?.url_logo || [],
    organizing: organizing?.url_logo || [], 
    mediaPartners: mediaPartners?.url_logo || [],
    tournamentLogo: tournamentLogo?.url_logo?.[0] || null,
    liveUnit: liveUnit?.url_logo?.[0] || null,
    logoShape: displaySettings?.logoShape || 'circle',
    showTournamentLogo: displaySettings?.showTournamentLogo !== false,
    showSponsors: displaySettings?.showSponsors !== false,
    showOrganizing: displaySettings?.showOrganizing !== false,
    showMediaPartners: displaySettings?.showMediaPartners !== false,
    showTimer: posterSettings?.showTimer !== false,
    showDate: posterSettings?.showDate !== false,
    showStadium: posterSettings?.showStadium !== false,
    showLiveIndicator: posterSettings?.showLiveIndicator !== false,
    accentColor: posterSettings?.accentColor || '#ef4444'
  };

  // Sử dụng marquee data từ context
  const marquee = {
    text: marqueeData.text || '',
    isRunning: marqueeData.mode !== 'none'
  };

  const marqueeRef = useRef(null);

  // Font size adjustment function
  const adjustFontSize = (element) => {
    if (!element) return;
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);
    const minFontSize = 14;
    
    while (element.scrollWidth > element.offsetWidth && fontSize > minFontSize) {
      fontSize -= 1;
      element.style.fontSize = fontSize + "px";
    }
  };

  // Hàm kiểm tra loại logo từ code
  const getLogoType = (logoUrl) => {
    if (typeof logoUrl !== 'string') return 'unknown';
    const filename = logoUrl.split('/').pop().split('.')[0]; // Lấy tên file không có extension
    if (filename.startsWith('L')) return 'logo'; // Logo thường - có thể bo tròn/lục giác
    if (filename.startsWith('B')) return 'badge'; // Badge/Shield - chỉ vuông/chữ nhật
    return 'unknown';
  };

  // Hàm lấy class cho shape logo dựa trên type và shape setting
  const getLogoShapeClass = (logoUrl, shape) => {
    const logoType = getLogoType(logoUrl);
    
    // Nếu là badge (B prefix), luôn dùng vuông/chữ nhật
    if (logoType === 'badge') {
      return 'rounded-lg'; // Bo góc nhẹ để giữ hình dạng nguyên bản
    }
    
    // Nếu là logo thường (L prefix), áp dụng shape setting
    if (logoType === 'logo') {
      switch (shape) {
        case 'square':
          return 'rounded-lg';
        case 'hexagon':
          return 'clip-hexagon';
        case 'shield':
          return 'clip-shield';
        case 'circle':
        default:
          return 'rounded-full';
      }
    }
    
    // Unknown type - dùng shape setting
    switch (shape) {
      case 'square':
        return 'rounded-lg';
      case 'hexagon':
        return 'clip-hexagon';
      case 'shield':
        return 'clip-shield';
      case 'circle':
      default:
        return 'rounded-full';
    }
  };

  const hasSponsors = matchData.sponsors.length > 0;
  const hasOrganizing = matchData.organizing.length > 0;
  const hasMediaPartners = matchData.mediaPartners.length > 0;
  const hasTournamentLogo = matchData.tournamentLogo;
  const hasLiveUnit = matchData.liveUnit;

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      {/* Main container with fixed aspect ratio */}
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg3.jpg')"
          }}
        >
          {/* Overlay */}
        </div>

        {/* Tournament Logo - Top Left Corner */}
        {hasTournamentLogo && (
          <div className="absolute top-1 sm:top-2 md:top-4 left-1 sm:left-2 md:left-4 z-20">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-0.5 sm:p-1 md:p-2 border border-white/30">
              <img
                src={matchData.tournamentLogo}
                alt="Tournament Logo"
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain ${getLogoShapeClass(matchData.tournamentLogo, matchData.logoShape)}`}
              />
            </div>
          </div>
        )}

        {/* Live Unit - Top Right Corner */}
        {hasLiveUnit && (
          <div className="absolute top-1 sm:top-2 md:top-4 right-1 sm:right-2 md:right-4 z-20">
            <div className="bg-red-600/90 backdrop-blur-sm rounded-lg p-0.5 sm:p-1 md:p-2 border border-white/30">
              <img
                src={matchData.liveUnit}
                alt="Live Unit"
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain ${getLogoShapeClass(matchData.liveUnit, matchData.logoShape)}`}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-6">
          
          {/* Top Section */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Tournament Title */}
            <div className="text-center mb-3 sm:mb-6">
              <h1 
                className="font-black uppercase text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                style={{
                  textShadow: '#dc2626 2px 2px 4px',
                }}
              >
                {matchData.matchTitle}
              </h1>
              
              {/* Divider */}
              <div className="flex items-center justify-center mt-2 sm:mt-4">
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mx-1 sm:mx-2"></div>
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
              </div>
            </div>

            {/* Match Section */}
            <div className="flex items-center justify-between w-full px-2 sm:px-8">

              {/* Team 1 */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 ${getLogoShapeClass(matchData.logo1, matchData.logoShape)} object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300`}
                  />
                </div>
                <div className="bg-gradient-to-r from-red-600 to-red-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>

              {/* VS Section */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-4 max-w-xs">
                <div className="relative flex flex-col items-center">
                  <img
                    src="/images/background-poster/vs3.png"
                    alt="VS"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse"
                  />
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-red-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold animate-pulse shadow-lg text-white">
                      LIVE
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold bg-black/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center">
                    {matchData.roundedTime} - {matchData.currentDate}
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-black rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 ${getLogoShapeClass(matchData.logo2, matchData.logoShape)} object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300`}
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-700 to-black px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

            {/* Stadium */}
            {matchData.stadium && (
              <div className="text-center mt-3 sm:mt-4">
                <div className="inline-block bg-black/50 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-white/30">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">
                    📍 {matchData.stadium}
                  </span>
                </div>
              </div>
            )}

            {/* Sponsors Section */}
            {hasSponsors && (
              <div className="text-center mt-2 sm:mt-3">
                <h3 className="text-yellow-400 text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 uppercase tracking-wide">
                  💰 Nhà tài trợ
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/30 mx-4 sm:mx-8">
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {matchData.sponsors.map((sponsor, index) => (
                      <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex justify-center items-center bg-white rounded p-0.5 shadow-lg">
                        <img
                          src={sponsor}
                          alt={`Sponsor ${index + 1}`}
                          className={`max-h-full max-w-full object-contain ${getLogoShapeClass(sponsor, matchData.logoShape)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* organizings Section */}
            {hasOrganizing && (
              <div className="text-center mt-2 sm:mt-3">
                <h3 className="text-blue-400 text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 uppercase tracking-wide">
                  🤝 Đơn vị tổ chức
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/30 mx-4 sm:mx-8">
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {matchData.organizing.map((organizingItem, index) => (
                      <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex justify-center items-center bg-white rounded p-0.5 shadow-lg">
                        <img
                          src={organizingItem}
                          alt={`Organizing ${index + 1}`}
                          className={`max-h-full max-w-full object-contain ${getLogoShapeClass(organizingItem, matchData.logoShape)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section - Media Partners */}
          {hasMediaPartners && (
            <div className="mt-2 sm:mt-4">
              <div className="text-center">
                <h3 className="text-green-400 text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 uppercase tracking-wide">
                  📺 Đơn vị truyền thông
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/30 mx-4 sm:mx-8">
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {matchData.mediaPartners.map((media, index) => (
                      <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex justify-center items-center bg-white rounded p-0.5 shadow-lg">
                        <img
                          src={media}
                          alt={`Media ${index + 1}`}
                          className={`max-h-full max-w-full object-contain ${getLogoShapeClass(media, matchData.logoShape)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Marquee - Hidden by default, will show when socket updates */}
        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-12 bg-gradient-to-r from-red-900 via-black to-red-900 border-t-2 border-red-500 overflow-hidden">
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap text-sm sm:text-lg font-bold text-red-300 drop-shadow-lg"
              style={{
                animation: 'marquee 30s linear infinite'
              }}
            >
              {marquee.text}
            </div>
          </div>
        )}

        {/* Sparkling Fire Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%) translateY(-50%); }
            100% { transform: translateX(-100%) translateY(-50%); }
          }
          @keyframes sparkle {
            0%, 100% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.5) rotate(180deg);
              opacity: 1;
            }
          }
          .clip-hexagon {
            clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
          }
          .clip-shield {
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }
        `}</style>
      </div>
    </div>
  );
}
