import React, { useRef, useState, useEffect } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function TreTrungMatchIntro() {
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

  const matchData = {
    matchTitle: contextMatchData.matchTitle || 'GIẢI BÓNG ĐÁ TRẺ TRUNG',
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
    accentColor: posterSettings?.accentColor || '#10b981',
    liveText: contextMatchData.liveText || 'FACEBOOK LIVE'
  };

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showMarquee, setShowMarquee] = useState(true);

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

  useEffect(() => {
    if (marqueeRef.current && marqueeContainerRef.current) {
      const textWidth = marqueeRef.current.scrollWidth;
      const containerWidth = marqueeContainerRef.current.offsetWidth;
      setMarqueeWidth(textWidth);
      setContainerWidth(containerWidth);
    }
  }, [marqueeData?.text, windowSize.width]);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const logoSize = isMobile ? 40 : isTablet ? 56 : 72;

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

  const scrollData = {
    text: marqueeData?.text || "TRỰC TIẾP BÓNG ĐÁ",
    color: marqueeData?.color === 'white-black' ? '#FFFFFF' :
        marqueeData?.color === 'black-white' ? '#000000' :
            marqueeData?.color === 'white-blue' ? '#FFFFFF' :
                marqueeData?.color === 'white-red' ? '#FFFFFF' :
                    marqueeData?.color === 'white-green' ? '#FFFFFF' : "#FFFFFF",
    bgColor: marqueeData?.color === 'white-black' ? '#000000' :
        marqueeData?.color === 'black-white' ? '#FFFFFF' :
            marqueeData?.color === 'white-blue' ? '#2563eb' :
                marqueeData?.color === 'white-red' ? '#dc2626' :
                    marqueeData?.color === 'white-green' ? '#16a34a' : "#10b981",
    repeat: 1,
    mode: marqueeData?.mode || 'khong',
    interval: marqueeData?.mode === 'moi-2' ? 120000 :
        marqueeData?.mode === 'moi-5' ? 300000 :
            marqueeData?.mode === 'lien-tuc' ? 30000 : 0
  };

  const marqueeRef = useRef(null);
  const marqueeContainerRef = useRef(null);

  // Calculate proper animation duration based on text length
  const getAnimationDuration = () => {
    if (marqueeWidth && containerWidth) {
      const totalDistance = marqueeWidth + containerWidth;
      const speed = 100; 
      return Math.max(10, totalDistance / speed);
    }
    return 30; 
  };

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

  // Check if marquee should be running
  const isMarqueeRunning = scrollData.mode !== 'khong' && scrollData.mode !== 'none' && scrollData.text && showMarquee;

  // Handle interval-based marquee display
  useEffect(() => {
    if (scrollData.interval > 0 && (scrollData.mode === 'moi-2' || scrollData.mode === 'moi-5')) {
      setShowMarquee(true);
      const intervalId = setInterval(() => {
        setShowMarquee(prev => !prev);
      }, scrollData.interval);

      return () => clearInterval(intervalId);
    } else {
      setShowMarquee(true);
    }
  }, [scrollData.interval, scrollData.mode]);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg1.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-3 sm:p-6">

          <div className="flex justify-between items-start mb-1 sm:mb-3 md:mb-5 min-h-[8vh] sm:min-h-[12vh] md:min-h-[14vh]">

            {/* Top-left: Sponsors and Organizing */}
            <div className="flex items-start gap-2 sm:gap-4 flex-shrink-0" style={{ minWidth: '25%', maxWidth: '35%' }}>
              {hasSponsors && (
                <div className="flex-shrink-0">
                  <div className="text-[8px] sm:text-xs font-bold text-green-400 mb-1 drop-shadow-lg">
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
                              className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 p-0.5 sm:p-1`}
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
                  <div className="text-[8px] sm:text-xs font-bold text-blue-400 mb-1 drop-shadow-lg">
                    Đơn vị tổ chức
                  </div>
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: Math.ceil(Math.min(organizingLogos.length, 6) / 3) }, (_, rowIndex) => (
                      <div key={`organizing-row-${rowIndex}`} className="flex gap-1 flex-nowrap">
                        {organizingLogos.slice(rowIndex * 3, (rowIndex + 1) * 3).slice(0, 3).map((organizing, index) => (
                          <div key={`organizing-${rowIndex}-${index}`} className="flex-shrink-0">
                            <img
                              src={organizing.logo}
                              alt={organizing.name}
                              className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 p-0.5 sm:p-1`}
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
                  <div className="text-[8px] sm:text-xs font-bold text-purple-400 mb-1 drop-shadow-lg text-right">
                    Đơn vị truyền thông
                  </div>
                  <div className="flex gap-1 justify-end overflow-x-auto scrollbar-hide">
                    <div className="flex gap-1 flex-nowrap">
                      {mediaPartnerLogos.map((media, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={media.logo}
                            alt={media.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/90 border border-white/50')} w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-1`}
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
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* Title section */}
            <div className="text-center mb-1 sm:mb-2 md:mb-3">
              <h1
                className="font-black uppercase text-white text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl px-1 sm:px-2"
                style={{
                  textShadow: '#166534 2px 2px 4px',
                }}
              >
                {matchData.matchTitle}
              </h1>

              <div className="flex items-center justify-center mt-2 sm:mt-4">
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-lime-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
              </div>
            </div>

            {/* Teams section */}
            <div className="flex items-center justify-between w-full px-2 sm:px-4 md:px-8 mb-1 sm:mb-2 md:mb-4">

              {/* Team A */}
              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
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
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2">
                  <span
                    className="text-[8px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide text-white text-center block truncate"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>

              {/* VS Section */}
              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative flex flex-col items-center">
                  <img
                    src="/images/background-poster/vs3.png"
                    alt="VS"
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain animate-pulse"
                  />
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-semibold bg-black/50 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center whitespace-nowrap">
                    {(matchData.showTimer || matchData.showDate) && (
                      <span>
                        {matchData.showTimer && matchData.roundedTime}{matchData.showTimer && matchData.showDate && ' - '}{matchData.showDate && matchData.currentDate}
                      </span>
                    )}
                    {(matchData.showTimer || matchData.showDate) && matchData.showStadium && matchData.stadium && (
                      <span> | </span>
                    )}
                    {matchData.showStadium && matchData.stadium && (
                      <span>📍 {matchData.stadium}</span>
                    )}
                  </div>
                  {matchData.liveText && (
                    <div className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-semibold bg-red-600/80 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center whitespace-nowrap flex items-center space-x-1">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
                      <span>Đơn vị Live: {matchData.liveText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Team B */}
              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
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
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2">
                  <span
                    className="text-[8px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide text-white text-center block truncate"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom spacer */}
          <div className="h-3 sm:h-4 md:h-6 flex-shrink-0"></div>
        </div>

        {/* Fixed Marquee Section */}
        {isMarqueeRunning && scrollData.text && (
          <div 
            ref={marqueeContainerRef}
            className="absolute bottom-0 left-0 w-full h-3 sm:h-4 md:h-6 border-t-2 overflow-hidden z-20"
            style={{
              backgroundColor: scrollData.bgColor,
              borderTopColor: scrollData.color === '#FFFFFF' ? '#16a34a' : scrollData.bgColor
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 whitespace-nowrap text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-bold drop-shadow-lg"
              style={{
                color: scrollData.color,
                left: containerWidth ? `${containerWidth}px` : '100%',
                transform: 'translateY(-50%)',
                animation: containerWidth && marqueeWidth ? 
                  `marquee-scroll-fixed ${getAnimationDuration()}s linear infinite` : 
                  'none'
              }}
            >
              {scrollData.text.repeat(scrollData.repeat)}
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-green-300 to-green-600 opacity-70"
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
        </div>

        <style>{`
          @keyframes marquee-scroll-fixed {
            0% { 
              left: 100%;
            }
            100% { 
              left: -100%;
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
