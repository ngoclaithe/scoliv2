import React, { useRef, useState, useEffect } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function VangXanhMatchIntro() {
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
    matchTitle: contextMatchData.matchTitle || 'GIẢI BÓNG ĐÁ VÀNG XANH',
    team1: contextMatchData.teamA.name || 'TEAM ALPHA',
    team2: contextMatchData.teamB.name || 'TEAM BETA',
    logo1: getFullLogoUrl(contextMatchData.teamA.logo) || '/images/background-poster/default_logoA.png',
    logo2: getFullLogoUrl(contextMatchData.teamB.logo) || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ THỐNG NHẤT',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '15:30',
    currentDate: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN'),
    // Format time in Vietnamese style
    formattedDateTime: (() => {
      const time = contextMatchData.startTime || contextMatchData.time || '15:30';
      const date = contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN');
      return `${time} ngày ${date}`;
    })(),
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
    accentColor: posterSettings?.accentColor || '#10b981',
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
  const logoSize = isMobile ? 40 : isTablet ? 100 : 215; 

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
    <div className="w-full h-screen bg-transparent flex items-start justify-center overflow-hidden">
      <div className="relative w-full max-w-7xl h-full bg-white overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg5.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-0">


          {/* Top section với logos - Mobile responsive */}
          <div className={`flex justify-between items-start mb-1 sm:mb-2 md:mb-2 pt-1 px-2 sm:pt-2 sm:px-4 md:pt-1 md:px-6 ${isMobile ? 'min-h-[5vh]' : 'min-h-[8vh] sm:min-h-[10vh] md:min-h-[10vh]'}`}>

            {/* Top-left: Sponsors and Organizing - Show on mobile but smaller */}
            <div className={`flex items-start flex-shrink-0 ${isMobile ? 'gap-1' : 'gap-2 sm:gap-4'}`} style={{ minWidth: isMobile ? '20%' : '25%', maxWidth: isMobile ? '25%' : '35%' }}>
                {hasSponsors && (
                  <div className="flex-shrink-0">
                    <div className={`font-normal text-white mb-0.5 drop-shadow-lg ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-2xl'}`}>
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
                    <div className={`font-normal text-white mb-0.5 drop-shadow-lg ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-2xl'}`}>
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
                  <div className={`font-normal text-white mb-0.5 drop-shadow-lg text-right ${isMobile ? 'text-xs' : 'text-xs sm:text-sm md:text-2xl'}`}>
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
          <div className="flex-1 flex flex-col justify-center min-h-0 px-2 sm:px-4 md:px-6">

            {/* Title section - compact */}
            <div className="text-center mb-1 sm:mb-1 md:mb-1">
              <h1 className="title text-white mb-1 sm:mb-1 px-1 sm:px-2">
                {matchData.matchTitle}
              </h1>

              {/* Subtitle display */}
              {matchData.showSubtitle && matchData.subtitle && (
                <div className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg font-medium mt-1 sm:mt-1 px-2">
                  {matchData.subtitle}
                </div>
              )}

              {/* Round and Group display - Hidden on mobile to save space */}
              {!isMobile && (
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-0.5 sm:mt-0.5">
                  {matchData.showRound && (
                    <div className="bg-blue-600/80 px-2 py-1 rounded text-xs sm:text-sm font-normal text-white">
                      VÒNG {matchData.round}
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="bg-green-600/80 px-2 py-1 rounded text-xs sm:text-sm font-normal text-white">
                      BẢNG {matchData.group}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Teams section - compact and mobile responsive */}
            <div className={`flex items-center justify-center w-full mb-1 sm:mb-1 md:mb-1 ${
              isMobile
                ? 'px-2 gap-1'
                : 'px-4 sm:px-8 md:px-12 gap-2 sm:gap-4 md:gap-6'
            }`}>

              {/* Team A */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
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
                    className="text-white font-normal uppercase tracking-wide text-center"
                    style={{
                      color: '#3e90ff',
                      fontFamily: 'iCielBCCubano, sans-serif',
                      fontWeight: '800',
                      textShadow: '2px 2px #ffffff',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {matchData.team1}
                  </div>
                </div>
              </div>

              {/* VS Section */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="relative flex flex-col items-center">
                  <img
                    src="/images/background-poster/vs5.png"
                    alt="VS"
                    className="object-contain animate-pulse"
                    style={{
                      width: isMobile ? '40px' : isTablet ? '120px' : '160px',
                      height: isMobile ? '40px' : isTablet ? '120px' : '240px'
                    }}
                  />
                </div>
              </div>

              {/* Team B */}
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
                    className="text-white font-normal uppercase tracking-wide text-center"
                    style={{
                      color: '#3e90ff',
                      fontFamily: 'iCielBCCubano, sans-serif',
                      fontWeight: '800',
                      textShadow: '2px 2px #ffffff',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {matchData.team2}
                  </div>
                </div>
              </div>
            </div>

            {/* Match time and date - Below team names */}
            <div className={`flex justify-center items-center ${isMobile ? 'mb-1 mt-2' : 'mb-2 sm:mb-2 md:mb-3 mt-4 sm:mt-6 md:mt-8'}`}>
              <div
                className="time-date-container"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
                  border: isMobile ? '1px solid #fff' : '6px solid #fff',
                  borderRadius: isMobile ? '8px' : '16px',
                  color: '#fff',
                  fontSize: isMobile ? '6px' : isTablet ? '17px' : '37px',
                  fontFamily: 'iCielBCCubano, Bebas Neue, UTM Bebas, sans-serif',
                  padding: isMobile ? '3px 6px' : '8px 16px',
                  boxShadow: '0 2px 10px rgba(24, 119, 242, 0.11)',
                  letterSpacing: '1px',
                  textShadow: '1px 2px 3px #0e306c22',
                  whiteSpace: 'nowrap'
                }}
              >
                {(matchData.showTimer || matchData.showDate) && matchData.formattedDateTime}
              </div>
            </div>

          </div>

          {/* Stadium and Live sections - Bottom position and mobile responsive */}
          <div className="mt-auto mb-0">
            <div
              className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 px-3 py-2 w-full"
              style={{
                backgroundColor: '#FF6011',
                fontFamily: 'iCielBCCubano, sans-serif'
              }}
            >
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
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-cyan-300 to-blue-600 opacity-70"
              style={{
                width: `${6 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderRadius: '50% 0 50% 0',
                animation: `bouncingLeaves ${3 + Math.random() * 4}s ease-in-out infinite`
              }}
            />
          ))}

          {/* Falling stars effect - kích thước gấp đôi */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-white opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${32 + Math.random() * 32}px`, // Tăng từ 16 lên 32 (gấp đôi)
                animation: `fallingStar ${8 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          
          .title {
            color: #3e90ff !important;
            font-family: 'iCielBCCubano', 'Baloo Bhai 2', 'BalooBhai2-Bold', sans-serif !important;
            font-weight: 800 !important;
            font-size: 65px;
            height: auto;
            text-shadow: 4px 4px #ffffff;
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

          @keyframes bouncingLeaves {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.7;
            }
            25% {
              transform: translateY(-20px) rotate(15deg);
              opacity: 0.9;
            }
            50% {
              transform: translateY(-10px) rotate(-10deg);
              opacity: 0.8;
            }
            75% {
              transform: translateY(-30px) rotate(20deg);
              opacity: 0.9;
            }
          }

          @keyframes fallingStar {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
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
