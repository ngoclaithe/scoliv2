import React, { useRef, useState, useEffect } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function HaoQuangMatchIntro() {
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
    matchTitle: contextMatchData.matchTitle || 'TRỰC TIẾP TRẬN BÓNG ĐÁ',
    team1: contextMatchData.teamA.name || 'TEAM ALPHA',
    team2: contextMatchData.teamB.name || 'TEAM BETA',
    logo1: getFullLogoUrl(contextMatchData.teamA.logo) || '/images/background-poster/default_logoA.png',
    logo2: getFullLogoUrl(contextMatchData.teamB.logo) || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ THỐNG NHẤT',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '15:30',
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
    accentColor: posterSettings?.accentColor || '#3b82f6',
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

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  // Auto-resize font for team names
  useEffect(() => {
    const adjustTeamNameFontSize = () => {
      const teamNameElements = document.querySelectorAll('.team-name-text');
      teamNameElements.forEach((element) => {
        const container = element.parentElement;
        const containerWidth = container.offsetWidth - 30; // subtract padding
        let fontSize = isMobile ? 7 : isTablet ? 20 : 34;
        const minFontSize = isMobile ? 4 : isTablet ? 8 : 14;

        element.style.fontSize = fontSize + 'px';

        while (element.scrollWidth > containerWidth && fontSize > minFontSize) {
          fontSize -= 1;
          element.style.fontSize = fontSize + 'px';
        }
      });
    };

    // Delay to ensure DOM is ready
    setTimeout(adjustTeamNameFontSize, 100);
  }, [matchData.team1, matchData.team2, isMobile, isTablet]);
  const logoSize = isMobile ? 40 : isTablet ? 100 : 160;

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


  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg2.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-1 sm:p-2">

          {/* Top section với tournament logos only - chỉ hiển thị khi có logos */}
          {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
            <div className="flex justify-center items-start mb-0 sm:mb-1 md:mb-2 min-h-[6vh] sm:min-h-[8vh] md:min-h-[10vh]">
              {/* Tournament Logos */}
              <div className={`flex ${getTournamentPositionClass()} items-center gap-1 sm:gap-2 md:gap-4 px-4`}>
                {matchData.tournamentLogos.map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Tournament Logo ${index + 1}`}
                    className="object-contain h-6 sm:h-8 md:h-12 lg:h-16 max-w-16 sm:max-w-24 md:max-w-32 flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main content section */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* Title section */}
            <div className="text-center mb-0 sm:mb-1 md:mb-2">
              <h1
                className="title text-white px-1 sm:px-2"
              >
                {matchData.matchTitle}
              </h1>

              {/* Subtitle display */}
              {matchData.showSubtitle && matchData.subtitle && (
                <div className="text-white/90 text-[8px] sm:text-xs md:text-sm lg:text-base font-medium mt-1 sm:mt-2 px-2">
                  {matchData.subtitle}
                </div>
              )}

              {/* Round and Group display - Moved below title */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                {matchData.showRound && (
                  <div className="bg-blue-600/80 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[6px] sm:text-[8px] md:text-[10px] font-bold text-white">
                    VÒNG {matchData.round}
                  </div>
                )}
                {matchData.showGroup && (
                  <div className="bg-orange-600/80 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[6px] sm:text-[8px] md:text-[10px] font-bold text-white">
                    BẢNG {matchData.group}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center mt-1 sm:mt-2">
                <div className="w-32 sm:w-64 md:w-80 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-32 sm:w-64 md:w-80 h-0.5 bg-white"></div>
              </div>
            </div>

            {/* Teams section với Match info ngang hàng */}
            <div className={`flex items-center justify-center w-full mb-1 sm:mb-2 md:mb-3 ${
              isMobile
                ? 'px-8 gap-3'
                : 'px-16 sm:px-20 md:px-24 gap-4 sm:gap-6 md:gap-8'
            }`}>

              {/* Team A */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
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
                <div
                  className="text-white font-bold uppercase tracking-wide text-center team-name-container"
                  style={{
                    background: 'linear-gradient(135deg, #1eae99, #008582)',
                    borderRadius: isMobile ? '8px' : '17px',
                    marginTop: isMobile ? '20px' : '45px',
                    textAlign: 'center',
                    fontSize: isMobile ? '6px' : isTablet ? '16px' : '28px',
                    padding: isMobile ? '2px 8px' : '4px 15px',
                    width: isMobile ? '104px' : isTablet ? '195px' : '260px',
                    height: isMobile ? '20px' : isTablet ? '36px' : '48px',
                    minWidth: 'unset',
                    border: isMobile ? 'solid 2px #ffffff' : 'solid 5px #ffffff',
                    color: '#ffffff',
                    fontFamily: 'Baloo Bhai 2, sans-serif',
                    fontWeight: '800',
                    textShadow: isMobile ? '2px 2px #727272' : '4px 4px #727272',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <span className="team-name-text" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {matchData.team1}
                  </span>
                </div>
              </div>

              {/* VS Section with Match Info */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative flex flex-col items-center">
                  <img
                    src="/images/background-poster/vs2.png"
                    alt="VS"
                    className="object-contain animate-pulse"
                    style={{
                      width: isMobile ? '40px' : isTablet ? '120px' : '160px',
                      height: isMobile ? '40px' : isTablet ? '120px' : '160px'
                    }}
                  />
                </div>

                {/* Match Info - Time, Date, Stadium */}
                <div className="flex flex-col items-center space-y-1 text-white text-center">
                  {(matchData.showTimer || matchData.showDate) && (
                    <div
                      className="font-bold"
                      style={{
                        fontSize: isMobile ? '8px' : isTablet ? '14px' : '18px'
                      }}
                    >
                      {matchData.showTimer && matchData.roundedTime}
                      {matchData.showTimer && matchData.showDate && ' - '}
                      {matchData.showDate && matchData.currentDate}
                    </div>
                  )}

                  {matchData.showStadium && matchData.stadium && (
                    <div
                      className="font-normal"
                      style={{
                        fontSize: isMobile ? '7px' : isTablet ? '12px' : '16px'
                      }}
                    >
                      Địa điểm: {matchData.stadium}
                    </div>
                  )}
                </div>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
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
                <div
                  className="text-white font-bold uppercase tracking-wide text-center team-name-container"
                  style={{
                    background: 'linear-gradient(135deg, #1eae99, #008582)',
                    borderRadius: isMobile ? '8px' : '17px',
                    marginTop: isMobile ? '20px' : '45px',
                    textAlign: 'center',
                    fontSize: isMobile ? '6px' : isTablet ? '16px' : '28px',
                    padding: isMobile ? '2px 8px' : '4px 15px',
                    width: isMobile ? '104px' : isTablet ? '195px' : '260px',
                    height: isMobile ? '20px' : isTablet ? '36px' : '48px',
                    minWidth: 'unset',
                    border: isMobile ? 'solid 2px #ffffff' : 'solid 5px #ffffff',
                    color: '#ffffff',
                    fontFamily: 'Baloo Bhai 2, sans-serif',
                    fontWeight: '800',
                    textShadow: isMobile ? '2px 2px #727272' : '4px 4px #727272',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <span className="team-name-text" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

            {/* Các đơn vị đồng hành */}
            {(hasSponsors || hasOrganizing || hasMediaPartners) && (
              <div className="flex flex-col items-center mt-2 sm:mt-4 mb-2 sm:mb-4">
                <div className="font-bold mb-2" style={{color: '#FFD700', fontSize: isMobile ? '10px' : isTablet ? '17px' : '20px'}}>
                  Các đơn vị đồng hành
                </div>
                <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap" style={{backgroundColor: 'white', padding: '8px', borderRadius: '8px'}}>
                  {/* Sponsors */}
                  {sponsorLogos.map((sponsor, index) => (
                    <div key={`all-sponsor-${index}`} className="flex-shrink-0" style={{backgroundColor: 'white', padding: '2px', borderRadius: '4px'}}>
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} ${isMobile ? 'w-4 h-4 p-0.5' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-0.5 sm:p-1'}`}
                      />
                    </div>
                  ))}

                  {/* Organizing */}
                  {organizingLogos.map((organizing, index) => (
                    <div key={`all-organizing-${index}`} className="flex-shrink-0" style={{backgroundColor: 'white', padding: '2px', borderRadius: '4px'}}>
                      <img
                        src={organizing.logo}
                        alt={organizing.name}
                        className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} ${isMobile ? 'w-4 h-4 p-0.5' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-0.5 sm:p-1'}`}
                      />
                    </div>
                  ))}

                  {/* Media Partners */}
                  {mediaPartnerLogos.map((media, index) => (
                    <div key={`all-media-${index}`} className="flex-shrink-0" style={{backgroundColor: 'white', padding: '2px', borderRadius: '4px'}}>
                      <img
                        src={media.logo}
                        alt={media.name}
                        className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} ${isMobile ? 'w-4 h-4 p-0.5' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-0.5 sm:p-1'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom spacer */}
          <div className="h-3 sm:h-4 md:h-6 flex-shrink-0"></div>
        </div>


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

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@400;500;600;700;800&display=swap');

          .title {
            color: #ffffff !important;
            font-family: 'Baloo Bhai 2', 'BalooBhai2-Bold', sans-serif !important;
            font-weight: 800 !important;
            font-size: 64px;
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
