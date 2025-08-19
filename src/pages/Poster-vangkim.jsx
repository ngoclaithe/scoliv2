import React, { useRef, useState, useEffect } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function DodenMatchIntro() {
  const {
    matchData: contextMatchData,
    sponsors,
    organizing,
    mediaPartners,
    tournamentLogo,
    liveUnit,
    displaySettings,
    posterSettings
  } = usePublicMatch();

  const matchData = {
    matchTitle: contextMatchData.matchTitle || 'GIẢI VÔ ĐỊCH QUỐC GIA',
    team1: contextMatchData.teamA.name || 'FIRE TIGERS',
    team2: contextMatchData.teamB.name || 'BLACK EAGLES',
    logo1: getFullLogoUrl(contextMatchData.teamA.logo) || '/images/background-poster/default_logoA.png',
    logo2: getFullLogoUrl(contextMatchData.teamB.logo) || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ MỸ ĐÌNH',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '20:00',
    currentDate: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN'),
    sponsors: getFullLogoUrls(sponsors?.sponsors?.url_logo || []),
    sponsorsTypeDisplay: sponsors?.sponsors?.type_display || [],
    organizing: getFullLogoUrls(organizing?.organizing?.url_logo || []),
    organizingTypeDisplay: organizing?.organizing?.type_display || [],
    mediaPartners: getFullLogoUrls(mediaPartners?.mediaPartners?.url_logo || []),
    mediaPartnersTypeDisplay: mediaPartners?.mediaPartners?.type_display || [],
    tournamentLogos: getFullLogoUrls(tournamentLogo?.url_logo || []),
    tournamentPosition: displaySettings?.tournamentPosition || 'top-center',
    liveUnit: getFullLogoUrl(liveUnit?.url_logo?.[0]) || null,
    logoShape: displaySettings?.displaySettings?.logoShape || 'round',
    showTournamentLogo: displaySettings?.showTournamentLogo !== false,
    showSponsors: displaySettings?.showSponsors !== false,
    showOrganizing: displaySettings?.showOrganizing !== false,
    showMediaPartners: displaySettings?.showMediaPartners !== false,
    showTimer: posterSettings?.showTimer !== false,
    showDate: posterSettings?.showDate !== false,
    showStadium: posterSettings?.showStadium !== false,
    showLiveIndicator: posterSettings?.showLiveIndicator !== false,
    accentColor: posterSettings?.accentColor || '#ef4444',
    liveText: contextMatchData.liveText || 'FACEBOOK LIVE',
    round: contextMatchData.round || 1,
    group: contextMatchData.group || 'A',
    subtitle: contextMatchData.subtitle || '',
    showRound: contextMatchData.showRound === true,
    showGroup: contextMatchData.showGroup === true,
    showSubtitle: contextMatchData.showSubtitle !== false
  };

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Refs for team name containers
  const teamANameRef = useRef(null);
  const teamBNameRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to adjust font size to fit container
  const adjustFontSize = (element, text, containerWidth, containerHeight) => {
    if (!element) return;
    
    let fontSize = isMobile ? 16 : isTablet ? 48 : 64; // Starting font size
    element.style.fontSize = fontSize + 'px';
    
    while ((element.scrollWidth > containerWidth || element.scrollHeight > containerHeight) && fontSize > 8) {
      fontSize -= 1;
      element.style.fontSize = fontSize + 'px';
    }
  };

  useEffect(() => {
    const teamAContainer = teamANameRef.current;
    const teamBContainer = teamBNameRef.current;
    
    if (teamAContainer && teamBContainer) {
      const containerWidth = isMobile ? 80 : isTablet ? 200 : 280;
      const containerHeight = isMobile ? 20 : isTablet ? 60 : 80;
      
      adjustFontSize(teamAContainer, matchData.team1, containerWidth, containerHeight);
      adjustFontSize(teamBContainer, matchData.team2, containerWidth, containerHeight);
    }
  }, [matchData.team1, matchData.team2, windowSize]);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const logoSize = isMobile ? 40 : isTablet ? 100 : 160; // Giảm size đáng kể cho mobile

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

  const hasSponsors = sponsorLogos.length > 0;
  const hasOrganizing = organizingLogos.length > 0;
  const hasMediaPartners = mediaPartnerLogos.length > 0;

  const getDisplayEachLogo = (baseClass) => {
    switch (matchData.logoShape) {
      case 'round':
        return `${baseClass} rounded-full`;
      case 'hexagon':
        return `${baseClass} hexagon-clip hexagon-glow`;
      case 'square':
        return `${baseClass} rounded-none`;
      default:
        return `${baseClass} rounded-full`;
    }
  };

  const getTournamentPositionClass = () => {
    switch (matchData.tournamentPosition) {
      case 'top-left':
        return 'justify-start';
      case 'top-right':
        return 'justify-end';
      case 'top-center':
      default:
        return 'justify-center';
    }
  };

  // Team name container dimensions
  const getTeamNameContainerStyle = () => ({
    width: isMobile ? '80px' : isTablet ? '200px' : '280px',
    height: isMobile ? '20px' : isTablet ? '60px' : '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  });

  return (
    <div className="w-full h-screen bg-transparent flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg4.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col pt-2 px-2 pb-0 sm:pt-4 sm:px-4 sm:pb-0 md:pt-6 md:px-6 md:pb-0">


          {/* Top section với logos - Mobile responsive */}
          <div className={`flex justify-between items-start mb-2 sm:mb-3 md:mb-4 ${isMobile ? 'min-h-[6vh]' : 'min-h-[10vh] sm:min-h-[12vh] md:min-h-[14vh]'}`}>

            {/* Top-left: Sponsors and Organizing - Show on mobile but smaller */}
            <div className={`flex items-start flex-shrink-0 ${isMobile ? 'gap-1' : 'gap-2 sm:gap-4'}`} style={{ minWidth: isMobile ? '20%' : '25%', maxWidth: isMobile ? '25%' : '35%' }}>
                {hasSponsors && (
                  <div className="flex-shrink-0">
                    <div className={`font-bold text-white mb-0.5 drop-shadow-lg ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-base'}`}>
                      Nhà tài trợ
                    </div>
                    <div className="flex gap-0.5">
                      {sponsorLogos.slice(0, isMobile ? 3 : 6).map((sponsor, index) => (
                        <div key={`sponsor-${index}`} className="flex-shrink-0">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} ${isMobile ? 'w-3 h-3 p-0.5' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-0.5 sm:p-1'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasOrganizing && (
                  <div className="flex-shrink-0">
                    <div className={`font-bold text-white mb-0.5 drop-shadow-lg ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-base'}`}>
                      Đơn vị tổ chức
                    </div>
                    <div className="flex gap-0.5">
                      {organizingLogos.slice(0, isMobile ? 3 : 6).map((organizing, index) => (
                        <div key={`organizing-${index}`} className="flex-shrink-0">
                          <img
                            src={organizing.logo}
                            alt={organizing.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} ${isMobile ? 'w-3 h-3 p-0.5' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-0.5 sm:p-1'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            {/* Top-center: Tournament Logos */}
            <div className={`flex ${getTournamentPositionClass()} items-center flex-1 gap-1 sm:gap-2 md:gap-4 ${isMobile ? 'px-2' : 'px-4'}`}>
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 &&
                matchData.tournamentLogos.slice(0, isMobile ? 2 : matchData.tournamentLogos.length).map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Tournament Logo ${index + 1}`}
                    className={`object-contain flex-shrink-0 ${
                      isMobile
                        ? 'h-4 max-w-12'
                        : 'h-6 sm:h-8 md:h-12 lg:h-16 max-w-16 sm:max-w-24 md:max-w-32'
                    }`}
                  />
                ))
              }
            </div>

            {/* Top-right: Media Partners and Live Unit - Show on mobile but smaller */}
            <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0" style={{ minWidth: isMobile ? '20%' : '25%', maxWidth: '30%' }}>
              {hasMediaPartners && (
                <div className="flex-shrink-0 w-full">
                  <div className={`font-bold text-white mb-0.5 drop-shadow-lg text-right ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-base'}`}>
                    Đơn vị truyền thông
                  </div>
                  <div className="flex gap-0.5 justify-end overflow-x-auto scrollbar-hide">
                    <div className="flex gap-0.5 flex-nowrap">
                      {mediaPartnerLogos.slice(0, isMobile ? 2 : mediaPartnerLogos.length).map((media, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={media.logo}
                            alt={media.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} ${isMobile ? 'w-3 h-3 p-0.5' : 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {matchData.liveUnit && (
                <div className="flex-shrink-0">
                  <div className={`bg-red-600 text-white rounded-md sm:rounded-lg shadow-lg flex items-center space-x-1 sm:space-x-2 ${
                    isMobile ? 'px-1 py-0.5' : 'px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5'
                  }`}>
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className={`object-contain ${isMobile ? 'h-2.5' : 'h-3 sm:h-4 md:h-5'}`}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Main content section - compact layout */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* Title section - compact */}
            <div className="text-center mb-1 sm:mb-2 md:mb-3">
              <h1 className="title text-white mb-1 sm:mb-2 px-1 sm:px-2">
                {matchData.matchTitle}
              </h1>

              {/* Subtitle display */}
              {matchData.showSubtitle && matchData.subtitle && (
                <div className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg font-medium mt-1 sm:mt-2 px-2">
                  {matchData.subtitle}
                </div>
              )}

              {/* Round and Group display - Hidden on mobile to save space */}
              {!isMobile && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                  {matchData.showRound && (
                    <div className="bg-blue-600/80 px-2 py-1 rounded text-xs sm:text-sm font-bold text-white">
                      VÒNG {matchData.round}
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="bg-green-600/80 px-2 py-1 rounded text-xs sm:text-sm font-bold text-white">
                      BẢNG {matchData.group}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Teams section - compact and mobile responsive */}
            <div className={`flex items-center justify-center w-full mb-1 sm:mb-2 md:mb-3 ${
              isMobile
                ? 'px-2 gap-1'
                : 'px-4 sm:px-8 md:px-12 gap-2 sm:gap-4 md:gap-6'
            }`}>

              {/* Team A */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative rounded-full bg-white p-2 sm:p-3 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${logoSize}px`,
                      height: `${logoSize}px`
                    }}
                  >
                    <img
                      src={matchData.logo1}
                      alt={matchData.team1}
                      className="object-contain w-[100%] h-[100%]"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBBPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                </div>
                {/* Team A Name Container */}
                <div style={getTeamNameContainerStyle()}>
                  <div
                    ref={teamANameRef}
                    className="text-white font-bold uppercase tracking-wide text-center"
                    style={{
                      color: '#ffffff',
                      fontFamily: 'Baloo Bhai 2, sans-serif',
                      fontWeight: '800',
                      textShadow: '4px 4px #727272',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {matchData.team1}
                  </div>
                </div>
              </div>

              {/* Time and Date Section */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="text-white font-bold text-center">
                  {matchData.showTimer && (
                    <div className="text-xs sm:text-sm md:text-lg lg:text-xl mb-1">
                      {matchData.roundedTime}
                    </div>
                  )}
                  {matchData.showDate && (
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg">
                      {matchData.currentDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative rounded-full bg-white p-2 sm:p-3 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${logoSize}px`,
                      height: `${logoSize}px`
                    }}
                  >
                    <img
                      src={matchData.logo2}
                      alt={matchData.team2}
                      className="object-contain w-[100%] h-[100%]"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBCPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                </div>
                {/* Team B Name Container */}
                <div style={getTeamNameContainerStyle()}>
                  <div
                    ref={teamBNameRef}
                    className="text-white font-bold uppercase tracking-wide text-center"
                    style={{
                      color: '#ffffff',
                      fontFamily: 'Baloo Bhai 2, sans-serif',
                      fontWeight: '800',
                      textShadow: '4px 4px #727272',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {matchData.team2}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Stadium and Live sections - Bottom position and mobile responsive */}
          <div className="mt-auto mb-0">
            <div className="flex justify-center items-center gap-2 sm:gap-8 md:gap-16 px-2 sm:px-4 md:px-8">
              {/* Stadium */}
              {matchData.showStadium && (
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-white font-normal" style={{
                  fontSize: isMobile ? '6px' : isTablet ? '18px' : '24px'
                }}>
                  <img
                    src="/images/basic/stadium.png"
                    alt="Stadium"
                    className={`object-contain ${isMobile ? 'w-2 h-2' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'}`}
                  />
                  <span>{matchData.stadium}</span>
                </div>
              )}

              {/* Live Text */}
              {matchData.showLiveIndicator && (
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-white font-normal" style={{
                  fontSize: isMobile ? '6px' : isTablet ? '18px' : '24px'
                }}>
                  <img
                    src="/images/basic/live-logo1.gif"
                    alt="Live"
                    className={`object-contain ${isMobile ? 'w-2 h-2' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'}`}
                  />
                  <span>{matchData.liveText}</span>
                </div>
              )}
            </div>
          </div>
        </div>

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

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          
          .title {
            color: #ffffff !important;
            font-family: 'Baloo Bhai 2', 'BalooBhai2-Bold', sans-serif !important;
            font-weight: 800 !important;
            font-size: 65px;
            height: auto;
            text-shadow: 4px 4px #727272;
            line-height: 1.2;
          }

          @media (max-width: 768px) {
            .title {
              font-size: 14px !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .title {
              font-size: 40px !important;
            }
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
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          /* Hexagon styles */
          .hexagon-clip {
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            position: relative;
          }
          
          .hexagon-border {
            position: relative;
            margin: 2px;
          }
          
          .hexagon-border::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #ef4444, #f97316, #eab308);
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            z-index: -1;
          }
          
          .hexagon-glow {
            filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4));
          }
        `}</style>
      </div>
    </div>
  );
}
