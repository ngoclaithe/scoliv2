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
  const logoSize = isMobile ? 60 : isTablet ? 80 : 100;

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
    text: marqueeData?.text || "TRỰC TIẾP GIẢI ĐẤU TỨ HÙNG",
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
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">

        {/* Header with tournament logos and live unit */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 md:h-24 flex items-center justify-between px-4 sm:px-6 md:px-8 z-30">
          
          {/* Tournament Logos */}
          <div className="flex items-center gap-3 sm:gap-4">
            {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
              <div className="flex gap-2 sm:gap-3">
                {matchData.tournamentLogos.slice(0, 3).map((logo, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur-sm opacity-60 animate-pulse"></div>
                    <img
                      src={logo}
                      alt={`Tournament Logo ${index + 1}`}
                      className="relative object-contain h-8 sm:h-12 md:h-16 lg:h-18 max-w-16 sm:max-w-24 md:max-w-32 bg-white/95 rounded-lg p-1 sm:p-2 shadow-xl border-2 border-white/50"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Unit */}
          <div className="flex items-center">
            {matchData.liveUnit && (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-xl blur-md opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl shadow-xl flex items-center space-x-2 sm:space-x-3 border-2 border-white/30">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/80 rounded-full animate-ping"></div>
                  </div>
                  <img
                    src={matchData.liveUnit}
                    alt="Live Unit"
                    className="h-4 sm:h-5 md:h-6 lg:h-8 object-contain"
                  />
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold">LIVE</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content - Split layout */}
        <div className="absolute inset-0 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
          <div className="h-full flex">
            
            {/* LEFT SIDE - Teams */}
            <div className="w-1/2 flex flex-col items-center justify-center relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-r border-white/20">
              
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>

              <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-8 md:space-y-12">
                
                {/* Team A */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-lg opacity-60 animate-pulse scale-110"></div>
                    <div
                      className="relative rounded-full bg-white p-3 sm:p-4 shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden"
                      style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`
                      }}
                    >
                      <img
                        src={matchData.logo1}
                        alt={matchData.team1}
                        className="object-contain w-[85%] h-[85%] drop-shadow-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD4KPHN2Zz4K';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-xl border-2 border-white/30 backdrop-blur-sm">
                    <span
                      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide text-white text-center block drop-shadow-lg"
                      ref={(el) => el && adjustFontSize(el)}
                    >
                      {matchData.team1}
                    </span>
                  </div>
                </div>

                {/* VS Section */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full p-3 sm:p-4 md:p-6 shadow-2xl border-4 border-white/50">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                        VS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-lg opacity-60 animate-pulse scale-110"></div>
                    <div
                      className="relative rounded-full bg-white p-3 sm:p-4 shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden"
                      style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`
                      }}
                    >
                      <img
                        src={matchData.logo2}
                        alt={matchData.team2}
                        className="object-contain w-[85%] h-[85%] drop-shadow-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWY0NDQ0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD4KPHN2Zz4K';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-xl border-2 border-white/30 backdrop-blur-sm">
                    <span
                      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide text-white text-center block drop-shadow-lg"
                      ref={(el) => el && adjustFontSize(el)}
                    >
                      {matchData.team2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Match Info */}
            <div className="w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-8 relative bg-gradient-to-bl from-purple-600/20 to-indigo-600/20">
              
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
              </div>

              <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-8">
                
                {/* Match Title */}
                <div className="text-center">
                  <h1
                    className="font-black uppercase text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight"
                    style={{
                      textShadow: '#8b5cf6 0 0 20px, #ec4899 0 0 40px',
                      background: 'linear-gradient(45deg, #ffffff, #fbbf24, #f59e0b, #ffffff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {matchData.matchTitle}
                  </h1>

                  {/* Subtitle */}
                  {matchData.showSubtitle && matchData.subtitle && (
                    <div className="text-white/90 text-sm sm:text-base md:text-lg font-semibold mt-2 sm:mt-3">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {matchData.subtitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* Round and Group */}
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  {matchData.showRound && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg text-sm sm:text-base font-bold text-white border border-white/30">
                      VÒNG {matchData.round}
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="bg-gradient-to-r from-orange-600 to-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg text-sm sm:text-base font-bold text-white border border-white/30">
                      BẢNG {matchData.group}
                    </div>
                  )}
                </div>

                {/* Match Details */}
                <div className="space-y-3 sm:space-y-4">
                  
                  {/* Date/Time */}
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="bg-black/40 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/30 shadow-xl text-center">
                      <div className="text-base sm:text-lg md:text-xl font-bold text-yellow-300">
                        {matchData.showTimer && matchData.roundedTime}
                        {matchData.showTimer && matchData.showDate && ' • '}
                        {matchData.showDate && matchData.currentDate}
                      </div>
                    </div>
                  )}

                  {/* Stadium */}
                  {matchData.showStadium && matchData.stadium && (
                    <div className="bg-black/40 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/30 shadow-xl text-center">
                      <div className="text-base sm:text-lg md:text-xl font-bold text-cyan-300">
                        🏟️ {matchData.stadium}
                      </div>
                    </div>
                  )}

                  {/* Live Text */}
                  {matchData.liveText && (
                    <div className="bg-gradient-to-r from-red-600 to-pink-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl backdrop-blur-sm text-white text-center shadow-xl border border-white/30">
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></div>
                          <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-base sm:text-lg md:text-xl font-bold">🎥 {matchData.liveText}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with sponsors and partners */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-0 right-0 px-4 sm:px-6 md:px-8 z-30">
          <div className="flex items-end justify-between">
            
            {/* Left - Sponsors */}
            {hasSponsors && (
              <div className="flex-1 max-w-xs sm:max-w-sm">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-[8px] sm:text-[10px] font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                    💰 Nhà tài trợ
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {sponsorLogos.slice(0, 8).map((sponsor, index) => (
                      <img
                        key={index}
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className={`${getDisplayEachLogo('object-contain bg-white/90 border border-yellow-300/50 shadow-lg')} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 p-0.5 sm:p-1`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Center - Organizing */}
            {hasOrganizing && (
              <div className="flex-1 max-w-xs sm:max-w-sm mx-2 sm:mx-4">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-[8px] sm:text-[10px] font-bold text-blue-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                    🏛️ Ban tổ chức
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {organizingLogos.slice(0, 6).map((organizing, index) => (
                      <img
                        key={index}
                        src={organizing.logo}
                        alt={organizing.name}
                        className={`${getDisplayEachLogo('object-contain bg-white/90 border border-blue-300/50 shadow-lg')} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 p-0.5 sm:p-1`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Right - Media Partners */}
            {hasMediaPartners && (
              <div className="flex-1 max-w-xs sm:max-w-sm">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20">
                  <div className="text-[8px] sm:text-[10px] font-bold text-green-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                    📺 Truyền thông
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {mediaPartnerLogos.slice(0, 6).map((media, index) => (
                      <img
                        key={index}
                        src={media.logo}
                        alt={media.name}
                        className={`${getDisplayEachLogo('object-contain bg-white/90 border border-green-300/50 shadow-lg')} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 p-0.5 sm:p-1`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Marquee Section */}
        {isMarqueeRunning && scrollData.text && (
          <div 
            ref={marqueeContainerRef}
            className="absolute bottom-0 left-0 w-full h-6 sm:h-8 md:h-12 overflow-hidden z-40 border-t-4 border-white/20"
            style={{
              background: `linear-gradient(90deg, ${scrollData.bgColor}, ${scrollData.bgColor}dd, ${scrollData.bgColor})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg font-bold drop-shadow-2xl"
              style={{
                color: scrollData.color,
                textShadow: `${scrollData.color === '#FFFFFF' ? '#000' : '#FFF'} 1px 1px 2px`,
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

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-white/20 to-yellow-300/40 rounded-full animate-floating"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            />
          ))}
          
          {/* Corner decorations */}
          <div className="absolute top-8 right-8 w-4 h-4 sm:w-6 sm:h-6 border-2 border-white/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 left-8 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400/40 rounded-full animate-pulse"></div>
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
          
          @keyframes floating {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-15px) rotate(180deg);
              opacity: 0.8;
            }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-floating {
            animation: floating 6s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
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
