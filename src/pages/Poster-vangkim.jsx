import React, { useRef } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';

export default function VangKimMatchIntro() {
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
    matchTitle: contextMatchData.tournament || 'CÚP VÀNG CHAMPION',
    team1: contextMatchData.teamA.name || 'GOLDEN LIONS',
    team2: contextMatchData.teamB.name || 'SILVER WOLVES',
    logo1: contextMatchData.teamA.logo || '/images/background-poster/default_logoA.png',
    logo2: contextMatchData.teamB.logo || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ HÀNG ĐÀY',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '15:00',
    currentDate: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN'),
    // Các biến mới từ context - sử dụng structure mới
    sponsors: sponsors?.sponsors?.url_logo || [],
    sponsorsTypeDisplay: sponsors?.sponsors?.type_display || [],
    organizing: organizing?.organizing?.url_logo || [],
    organizingTypeDisplay: organizing?.organizing?.type_display || [],
    mediaPartners: mediaPartners?.mediaPartners?.url_logo || [],
    mediaPartnersTypeDisplay: mediaPartners?.mediaPartners?.type_display || [],
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
    accentColor: posterSettings?.accentColor || '#f59e0b'
  };

  // Helper function để lấy shape của logo dựa trên type_display
  const getLogoShape = (typeDisplay) => {
    switch (typeDisplay) {
      case 'round': return 'circle';
      case 'hexagonal': return 'hexagon';
      case 'square':
      default: return 'square';
    }
  };

  // Tạo arrays riêng cho từng loại logo với type_display
  const sponsorLogos = matchData.showSponsors ? matchData.sponsors.map((url, index) => ({
    logo: url,
    name: 'Sponsor',
    type: 'sponsor',
    typeDisplay: matchData.sponsorsTypeDisplay[index] || 'square'
  })) : [];

  const organizingLogos = matchData.showOrganizing ? matchData.organizing.map((url, index) => ({
    logo: url,
    name: 'Organizing',
    type: 'organizing',
    typeDisplay: matchData.organizingTypeDisplay[index] || 'square'
  })) : [];

  const mediaPartnerLogos = matchData.showMediaPartners ? matchData.mediaPartners.map((url, index) => ({
    logo: url,
    name: 'Media Partner',
    type: 'media',
    typeDisplay: matchData.mediaPartnersTypeDisplay[index] || 'square'
  })) : [];

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

  const hasSponsors = sponsorLogos.length > 0;
  const hasOrganizing = organizingLogos.length > 0;
  const hasMediaPartners = mediaPartnerLogos.length > 0;

  // Helper function để lấy class cho logo shape (cho team logos)
  const getLogoShapeClass = (baseClass) => {
    switch (matchData.logoShape) {
      case 'square':
        return `${baseClass} rounded-lg`;
      case 'hexagon':
        return `${baseClass} rounded-full`; // Tạm thời dùng rounded-full
      case 'shield':
        return `${baseClass} rounded-lg`;
      case 'circle':
      default:
        return `${baseClass} rounded-full`;
    }
  };

  // Helper function để lấy class cho individual partner logo shapes
  const getPartnerLogoShapeClass = (baseClass, typeDisplay) => {
    const shape = getLogoShape(typeDisplay);
    switch (shape) {
      case 'square':
        return `${baseClass} rounded-lg`;
      case 'hexagon':
        return `${baseClass} rounded-full`; // Tạm thời dùng rounded-full
      case 'circle':
      default:
        return `${baseClass} rounded-full`;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      {/* Main container with fixed aspect ratio */}
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg4.jpg')"
          }}
        >
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-6">
          
          {/* Top Section */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Tournament Title */}
            <div className="text-center mb-3 sm:mb-6">
              <h1 
                className="font-black uppercase text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                style={{
                  textShadow: '#d97706 2px 2px 4px',
                }}
              >
                {matchData.matchTitle}
              </h1>
              
              {/* Divider */}
              <div className="flex items-center justify-center mt-2 sm:mt-4">
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
              </div>
            </div>

            {/* Match Section */}
            <div className="flex items-center justify-between w-full px-2 sm:px-8">

              {/* Team 1 */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className={getLogoShapeClass("relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                  />
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
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
                    src="/images/background-poster/vs5.png"
                    alt="VS"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse"
                  />
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  {matchData.showLiveIndicator && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-yellow-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold animate-pulse shadow-lg text-white">
                        LIVE
                      </div>
                    </div>
                  )}
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="text-xs sm:text-sm font-semibold bg-black/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center">
                      {matchData.showTimer && matchData.roundedTime}{matchData.showTimer && matchData.showDate && ' - '}{matchData.showDate && matchData.currentDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className={getLogoShapeClass("relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-500 to-slate-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
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
            {matchData.showStadium && matchData.stadium && (
              <div className="text-center mt-3 sm:mt-4">
                <div className="inline-block bg-black/50 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-white/30">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">
                    📍 {matchData.stadium}
                  </span>
                </div>
              </div>
            )}

            {/* Tournament Logo */}
            {matchData.showTournamentLogo && matchData.tournamentLogo && (
              <div className="text-center mt-3 sm:mt-4">
                <div className="inline-flex items-center justify-center">
                  <img
                    src={matchData.tournamentLogo}
                    alt="Tournament Logo"
                    className="h-8 sm:h-12 md:h-16 max-w-32 sm:max-w-40 object-contain"
                  />
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Live Unit - Top right corner */}
        {matchData.liveUnit && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <div className="bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <img
                src={matchData.liveUnit}
                alt="Live Unit"
                className="h-4 sm:h-5 object-contain"
              />
              <span className="text-xs sm:text-sm font-bold">LIVE</span>
            </div>
          </div>
        )}

        {/* Marquee - Hidden by default, will show when socket updates */}
        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-12 bg-gradient-to-r from-yellow-900 via-amber-900 to-orange-900 border-t-2 border-yellow-400 overflow-hidden">
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap text-sm sm:text-lg font-bold text-yellow-300 drop-shadow-lg"
              style={{
                animation: 'marquee 30s linear infinite'
              }}
            >
              {marquee.text}
            </div>
          </div>
        )}

        {/* Golden Sparkles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-yellow-300 to-amber-400 opacity-80"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderRadius: '50%',
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
              transform: scale(1) rotate(180deg);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
