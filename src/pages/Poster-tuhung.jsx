import React, { useRef, useState, useEffect } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function TuHungMatchIntro() {
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
    matchTitle: contextMatchData.matchTitle || 'GIẢI ĐẤU BÓNG ĐÁ TỨ HÙNG',
    team1: contextMatchData.teamA.name || 'ĐỘI RỒNG VÀNG',
    team2: contextMatchData.teamB.name || 'ĐỘI SƯ TỬ XANH',
    logo1: getFullLogoUrl(contextMatchData.teamA.logo) || '/images/background-poster/default_logoA.png',
    logo2: getFullLogoUrl(contextMatchData.teamB.logo) || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ TỨ HÙNG',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '19:30',
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
    accentColor: posterSettings?.accentColor || '#8b5cf6',
    liveText: contextMatchData.liveText || 'YOUTUBE LIVE',
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
  const logoSize = isMobile ? 50 : isTablet ? 68 : 84;

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
    text: marqueeData?.text || "TRỰC TIẾP GIẢI ĐẤU TỰ HƯNG",
    color: marqueeData?.color === 'white-black' ? '#FFFFFF' :
        marqueeData?.color === 'black-white' ? '#000000' :
            marqueeData?.color === 'white-blue' ? '#FFFFFF' :
                marqueeData?.color === 'white-red' ? '#FFFFFF' :
                    marqueeData?.color === 'white-green' ? '#FFFFFF' : "#FFFFFF",
    bgColor: marqueeData?.color === 'white-black' ? '#000000' :
        marqueeData?.color === 'black-white' ? '#FFFFFF' :
            marqueeData?.color === 'white-blue' ? '#2563eb' :
                marqueeData?.color === 'white-red' ? '#dc2626' :
                    marqueeData?.color === 'white-green' ? '#16a34a' : "#8b5cf6",
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
    const minFontSize = 12;

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
        return `${baseClass} rounded-lg`;
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
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl">

        {/* Background with asymmetric gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800"
          style={{
            clipPath: 'polygon(0 0, 70% 0, 100% 30%, 100% 100%, 30% 100%, 0 70%)'
          }}
        >
        </div>

        {/* Secondary background element */}
        <div
          className="absolute inset-0 bg-gradient-to-tl from-yellow-400 via-orange-500 to-red-500 opacity-20"
          style={{
            clipPath: 'polygon(60% 0, 100% 0, 100% 40%, 80% 60%, 40% 40%)'
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-3 sm:p-6">

          {/* Asymmetric top section */}
          <div className="flex justify-between items-start mb-2 sm:mb-4 md:mb-6 min-h-[10vh] sm:min-h-[14vh] md:min-h-[16vh]">

            {/* Left side - Tournament logos positioned asymmetrically */}
            <div className="flex flex-col items-start gap-2 sm:gap-3 flex-shrink-0" style={{ minWidth: '20%', maxWidth: '25%' }}>
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
                <div className="flex flex-col gap-1 sm:gap-2">
                  {matchData.tournamentLogos.map((logo, index) => (
                    <img
                      key={index}
                      src={logo}
                      alt={`Tournament Logo ${index + 1}`}
                      className="object-contain h-8 sm:h-12 md:h-16 lg:h-20 max-w-20 sm:max-w-28 md:max-w-36 flex-shrink-0 drop-shadow-lg"
                    />
                  ))}
                </div>
              )}

              {/* Live Unit positioned below tournament */}
              {matchData.liveUnit && (
                <div className="flex-shrink-0 mt-2">
                  <div className="bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl shadow-xl flex items-center space-x-1 sm:space-x-2 border-2 border-white/30">
                    <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-pulse"></div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className="h-4 sm:h-5 md:h-6 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Sponsors, Organizing, Media arranged asymmetrically */}
            <div className="flex flex-col items-end gap-3 sm:gap-4 flex-shrink-0" style={{ minWidth: '35%', maxWidth: '45%' }}>
              
              {/* Top row - Sponsors */}
              {hasSponsors && (
                <div className="flex-shrink-0 w-full">
                  <div className="text-[8px] sm:text-xs font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-lg text-right">
                    💰 Nhà tài trợ chính
                  </div>
                  <div className="flex justify-end">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 sm:gap-2">
                      {sponsorLogos.slice(0, 12).map((sponsor, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/95 border-2 border-yellow-300/50 shadow-lg')} w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-1`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Middle row - Organizing (offset to left) */}
              {hasOrganizing && (
                <div className="flex-shrink-0 w-4/5 mr-8">
                  <div className="text-[8px] sm:text-xs font-bold text-blue-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                    🏛️ Ban tổ chức
                  </div>
                  <div className="flex justify-center">
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {organizingLogos.slice(0, 8).map((organizing, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={organizing.logo}
                            alt={organizing.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/95 border-2 border-blue-300/50 shadow-lg')} w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 p-1`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom row - Media Partners (offset to right) */}
              {hasMediaPartners && (
                <div className="flex-shrink-0 w-3/4 ml-6">
                  <div className="text-[8px] sm:text-xs font-bold text-green-300 mb-1 sm:mb-2 drop-shadow-lg text-left">
                    📺 Đối tác truyền thông
                  </div>
                  <div className="flex justify-start">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {mediaPartnerLogos.slice(0, 6).map((media, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={media.logo}
                            alt={media.name}
                            className={`${getDisplayEachLogo('object-contain bg-white/95 border-2 border-green-300/50 shadow-lg')} w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-1`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Main content section - asymmetric design */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* Title section with asymmetric positioning */}
            <div className="text-center mb-2 sm:mb-3 md:mb-4 relative">
              
              {/* Background shape for title */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-blue-800/30 to-transparent rounded-3xl"
                style={{
                  clipPath: 'polygon(5% 20%, 95% 0%, 90% 80%, 0% 100%)',
                  transform: 'skewX(-5deg)'
                }}
              ></div>
              
              <div className="relative z-10">
                <h1
                  className="font-black uppercase text-white text-sm sm:text-base md:text-xl lg:text-3xl xl:text-4xl px-2 sm:px-4 transform -skew-x-1"
                  style={{
                    textShadow: '#8b5cf6 3px 3px 6px, #000 1px 1px 3px',
                    filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
                  }}
                >
                  {matchData.matchTitle}
                </h1>

                {/* Subtitle display */}
                {matchData.showSubtitle && matchData.subtitle && (
                  <div className="text-white/95 text-[10px] sm:text-sm md:text-base lg:text-lg font-semibold mt-1 sm:mt-2 px-2 drop-shadow-lg">
                    {matchData.subtitle}
                  </div>
                )}

                {/* Round and Group display - positioned asymmetrically */}
                <div className="flex items-center justify-center gap-3 sm:gap-6 mt-2 sm:mt-3">
                  {matchData.showRound && (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg text-[8px] sm:text-[10px] md:text-xs font-bold text-white border border-white/30 transform rotate-1">
                      VÒNG {matchData.round}
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg text-[8px] sm:text-[10px] md:text-xs font-bold text-white border border-white/30 transform -rotate-1">
                      BẢNG {matchData.group}
                    </div>
                  )}
                </div>

                {/* Decorative asymmetric line */}
                <div className="flex items-center justify-center mt-3 sm:mt-5">
                  <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-purple-400 to-transparent rounded transform -skew-x-12"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full mx-2 sm:mx-3 animate-pulse"></div>
                  <div className="w-16 sm:w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 rounded"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full mx-2 sm:mx-3 animate-pulse"></div>
                  <div className="w-8 sm:w-16 h-1 bg-gradient-to-l from-red-400 to-transparent rounded transform skew-x-12"></div>
                </div>
              </div>
            </div>

            {/* Teams section - asymmetric layout */}
            <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-10 mb-2 sm:mb-3 md:mb-5">

              {/* Team A - positioned higher */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 max-w-[28%] transform -translate-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 scale-110"></div>
                  <div
                    className="relative rounded-full bg-gradient-to-br from-white to-gray-100 p-3 shadow-2xl border-4 border-white/40 flex items-center justify-center overflow-hidden transform rotate-3 hover:rotate-0 transition duration-300"
                    style={{
                      width: `${logoSize}px`,
                      height: `${logoSize}px`
                    }}
                  >
                    <img
                      src={matchData.logo1}
                      alt={matchData.team1}
                      className="object-contain w-[90%] h-[90%] drop-shadow-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD4KPHN2Zz4K';
                      }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white/30 backdrop-blur-sm w-full transform -skew-x-2">
                  <span
                    className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide text-white text-center block truncate drop-shadow-lg"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>

              {/* VS Section - centered with special design */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 max-w-[35%]">
                <div className="relative flex flex-col items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full p-2 sm:p-3 md:p-4 shadow-2xl border-4 border-white/50">
                    <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg transform hover:scale-110 transition duration-300">
                      VS
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold bg-black/60 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm text-white text-center whitespace-nowrap border border-white/20 shadow-lg">
                    {(matchData.showTimer || matchData.showDate) && (
                      <span>
                        {matchData.showTimer && matchData.roundedTime}{matchData.showTimer && matchData.showDate && ' • '}{matchData.showDate && matchData.currentDate}
                      </span>
                    )}
                    {(matchData.showTimer || matchData.showDate) && matchData.showStadium && matchData.stadium && (
                      <span> | </span>
                    )}
                    {matchData.showStadium && matchData.stadium && (
                      <span>🏟️ {matchData.stadium}</span>
                    )}
                  </div>
                  {matchData.liveText && (
                    <div className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-semibold bg-gradient-to-r from-red-600 to-pink-600 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm text-white text-center whitespace-nowrap flex items-center space-x-1 sm:space-x-2 shadow-lg border border-white/30">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
                      <span>🎥 {matchData.liveText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Team B - positioned lower */}
              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 max-w-[28%] transform translate-y-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-bl from-orange-500 via-red-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 scale-110"></div>
                  <div
                    className="relative rounded-full bg-gradient-to-bl from-white to-gray-100 p-3 shadow-2xl border-4 border-white/40 flex items-center justify-center overflow-hidden transform -rotate-3 hover:rotate-0 transition duration-300"
                    style={{
                      width: `${logoSize}px`,
                      height: `${logoSize}px`
                    }}
                  >
                    <img
                      src={matchData.logo2}
                      alt={matchData.team2}
                      className="object-contain w-[90%] h-[90%] drop-shadow-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWY0NDQ0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD4KPHN2Zz4K';
                      }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-l from-orange-500 via-red-500 to-pink-500 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white/30 backdrop-blur-sm w-full transform skew-x-2">
                  <span
                    className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide text-white text-center block truncate drop-shadow-lg"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom spacer */}
          <div className="h-4 sm:h-6 md:h-8 flex-shrink-0"></div>
        </div>

        {/* Fixed Marquee Section */}
        {isMarqueeRunning && scrollData.text && (
          <div 
            ref={marqueeContainerRef}
            className="absolute bottom-0 left-0 w-full h-4 sm:h-5 md:h-7 border-t-3 overflow-hidden z-20"
            style={{
              backgroundColor: scrollData.bgColor,
              borderTopColor: scrollData.color === '#FFFFFF' ? '#8b5cf6' : scrollData.bgColor
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 whitespace-nowrap text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-bold drop-shadow-lg"
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

        {/* Asymmetric decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        {/* Geometric decorative shapes */}
        <div className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 border-2 border-white/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-16 left-8 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400/40 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 right-16 w-4 h-4 sm:w-6 sm:h-6 bg-purple-400/40 rounded-full animate-bounce"></div>

        <style>{`
          @keyframes marquee-scroll-fixed {
            0% { 
              left: 100%;
            }
            100% { 
              left: -100%;
            }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-10px) rotate(180deg);
              opacity: 0.8;
            }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          
          /* Hexagon styles */
          .hexagon-clip {
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            position: relative;
          }
          
          .hexagon-glow {
            filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
          }
        `}</style>
      </div>
    </div>
  );
}
