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
  const logoSize = isMobile ? 70 : isTablet ? 96 : 128; // Giảm nhỏ hơn cho mobile

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
    <div className="w-full h-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden" style={{background: 'transparent'}}>
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg3.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-1 sm:p-3">

          {/* Header section với khoảng cách nhỏ hơn */}
          <div className={`flex justify-between items-start ${isMobile ? 'mb-1' : 'mb-1 sm:mb-2 md:mb-2'}`}>

            {/* Top-left: Sponsors and Organizing */}
            <div className="flex items-start gap-2 sm:gap-4 flex-shrink-0" style={{ minWidth: '25%', maxWidth: '35%' }}>
              {hasSponsors && (
                <div className="flex-shrink-0">
                  <div className="text-[8px] sm:text-xs font-bold text-white mb-1 drop-shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Nhà tài trợ
                  </div>
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: Math.ceil(Math.min(sponsorLogos.length, 6) / 3) }, (_, rowIndex) => (
                      <div key={`sponsor-row-${rowIndex}`} className="flex gap-1 flex-nowrap">
                        {sponsorLogos.slice(rowIndex * 3, (rowIndex + 1) * 3).slice(0, 3).map((sponsor, index) => (
                          <div key={`sponsor-${rowIndex}-${index}`} className="flex-shrink-0">
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasOrganizing && (
                <div className="flex-shrink-0">
                  <div className="text-[8px] sm:text-xs font-bold text-white mb-1 drop-shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Đơn vị đồng hành
                  </div>
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: Math.ceil(Math.min(organizingLogos.length, 6) / 3) }, (_, rowIndex) => (
                      <div key={`organizing-row-${rowIndex}`} className="flex gap-1 flex-nowrap">
                        {organizingLogos.slice(rowIndex * 3, (rowIndex + 1) * 3).slice(0, 3).map((organizing, index) => (
                          <div key={`organizing-${rowIndex}-${index}`} className="flex-shrink-0">
                            <img
                              src={organizing.logo}
                              alt={organizing.name}
                              className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top-center: Tournament Logos */}
            <div className={`flex ${getTournamentPositionClass()} items-center flex-1 gap-1 sm:gap-2 md:gap-4 px-4`}>
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 &&
                matchData.tournamentLogos.map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Tournament Logo ${index + 1}`}
                    className="object-contain h-6 sm:h-8 md:h-12 lg:h-16 max-w-16 sm:max-w-24 md:max-w-32 flex-shrink-0"
                  />
                ))
              }
            </div>

            {/* Top-right: Media Partners and Live Unit */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0" style={{ minWidth: '25%', maxWidth: '30%' }}>
              {hasMediaPartners && (
                <div className="flex-shrink-0 w-full">
                  <div className="text-[8px] sm:text-xs font-bold text-white mb-1 drop-shadow-lg text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Đơn vị truyền thông
                  </div>
                  <div className="flex gap-1 justify-end overflow-x-auto scrollbar-hide">
                    <div className="flex gap-1 flex-nowrap">
                      {mediaPartnerLogos.map((media, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={media.logo}
                            alt={media.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 p-1`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {matchData.liveUnit && (
                <div className="flex-shrink-0">
                  <div className="bg-red-600 text-white px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg shadow-lg flex items-center space-x-1 sm:space-x-2">
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className="h-3 sm:h-4 md:h-5 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Main content section */}
          <div className="flex-1 flex flex-col justify-start min-h-0">

            {/* Title section - Tăng font lên 2 lần và giảm padding top */}
            <div className="text-center">
              <h1
                className="font-black uppercase px-2 sm:px-4 md:px-6"
                style={{
                  color: '#ef4444',
                  WebkitTextStroke: '2px white',
                  textStroke: '2px white',
                  fontFamily: "'UTM Colossalis', 'Arial Black', sans-serif",
                  fontSize: isMobile ? '20px' : isTablet ? '24px' : '48px'
                }}
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
                  <div className="bg-red-600/80 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[6px] sm:text-[8px] md:text-[10px] font-bold text-white">
                    BẢNG {matchData.group}
                  </div>
                )}
              </div>

            </div>

            {/* Teams section và Time/Date section ngang hàng */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 w-full px-1 sm:px-2 md:px-4">

              {/* Team A */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative rounded-full bg-white p-1 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${isMobile ? logoSize * 0.25 : logoSize}px`, // Giảm xuống 1/4 cho mobile
                      height: `${isMobile ? logoSize * 0.25 : logoSize}px`
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
                <div className="px-1 sm:px-2 md:px-3">
                  <span
                    className="text-[8px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide text-center block truncate"
                    style={{
                      color: '#ffe006',
                      fontFamily: "'UTM Colossalis', sans-serif",
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>

              {/* Time and Date section - Ngang hàng với teams */}
              <div className="flex flex-col items-center px-2 sm:px-4">
                {matchData.showTimer && (
                  <div
                    className="text-white font-bold"
                    style={{
                      fontSize: isMobile ? '20px' : isTablet ? '32px' : '60px'
                    }}
                  >
                    {matchData.roundedTime}
                  </div>
                )}
                {matchData.showDate && (
                  <div
                    className="text-white/90 font-bold mt-1"
                    style={{
                      fontSize: isMobile ? '12px' : isTablet ? '18px' : '24px'
                    }}
                  >
                    {matchData.currentDate}
                  </div>
                )}
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-black rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative rounded-full bg-white p-1 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${isMobile ? logoSize * 0.25 : logoSize}px`, // Giảm xuống 1/4 cho mobile
                      height: `${isMobile ? logoSize * 0.25 : logoSize}px`
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
                <div className="px-1 sm:px-2 md:px-3">
                  <span
                    className="text-[8px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide text-center block truncate"
                    style={{
                      color: '#ffe006',
                      fontFamily: "'UTM Colossalis', sans-serif",
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom section - Stadium và Live Text - Đưa ra ngoài để width bằng poster */}
        <div className="absolute bottom-[20%] left-0 right-0 z-10 bg-white">
          <div className="flex justify-center items-center gap-2 sm:gap-8 md:gap-16 px-2 sm:px-4 md:px-8 py-2 rounded-t-lg mx-4 sm:mx-8">
            {/* Stadium */}
            {matchData.showStadium && (
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-gray-800 font-normal" style={{
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
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-red-600 font-bold" style={{
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

        {/* Hiệu ứng mưa sao băng từ tâm ra 8 hướng */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(40)].map((_, i) => {
            const angle = (i % 8) * 45; // 8 hướng: 0, 45, 90, 135, 180, 225, 270, 315 độ
            const distance = 30 + (i % 5) * 15; // Khoảng cách khác nhau
            const delay = (i % 8) * 0.2; // Độ trễ cho mỗi hướng

            return (
              <div
                key={i}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `shootingStar-${angle} ${3 + Math.random() * 2}s ease-out infinite`,
                  animationDelay: `${delay}s`,
                  opacity: 0.8
                }}
              />
            );
          })}
        </div>

        {/* Bụi sao nhỏ rơi rơi ngẫu nhiên */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute bg-white rounded-full opacity-60"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <style>{`
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

          /* Shooting star animations for 8 directions */
          @keyframes shootingStar-0 {
            0% {
              transform: translate(-50%, -50%) translateX(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translateX(0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translateX(600px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-45 {
            0% {
              transform: translate(-50%, -50%) translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translate(0, 0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translate(450px, -450px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-90 {
            0% {
              transform: translate(-50%, -50%) translateY(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translateY(0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translateY(-600px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-135 {
            0% {
              transform: translate(-50%, -50%) translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translate(0, 0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translate(-450px, -450px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-180 {
            0% {
              transform: translate(-50%, -50%) translateX(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translateX(0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translateX(-600px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-225 {
            0% {
              transform: translate(-50%, -50%) translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translate(0, 0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translate(-450px, 450px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-270 {
            0% {
              transform: translate(-50%, -50%) translateY(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translateY(0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translateY(600px) scale(0);
              opacity: 0;
            }
          }

          @keyframes shootingStar-315 {
            0% {
              transform: translate(-50%, -50%) translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(-50%, -50%) translate(0, 0) scale(1);
            }
            100% {
              transform: translate(-50%, -50%) translate(450px, 450px) scale(0);
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
