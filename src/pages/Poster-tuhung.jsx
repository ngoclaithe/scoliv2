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
  const logoSize = isMobile ? 80 : isTablet ? 100 : 120;

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
    <div className="w-full h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/30 to-pink-600/20"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-bl from-purple-400/10 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-tr from-yellow-400/10 to-orange-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-36 h-36 bg-gradient-to-tl from-green-400/10 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Radial gradient spotlight */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
      </div>

      <div className="relative w-full max-w-7xl aspect-video bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">

        {/* Header Section */}
        <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 md:h-28 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm z-30">
          <div className="flex items-center justify-between h-full px-6 sm:px-8 md:px-12">
            
            {/* Tournament Logos */}
            <div className="flex items-center gap-4 sm:gap-6">
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
                <div className="flex gap-3 sm:gap-4">
                  {matchData.tournamentLogos.slice(0, 3).map((logo, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-conic from-yellow-400 via-orange-500 to-red-500 rounded-xl blur-md opacity-60 animate-spin-slow"></div>
                      <img
                        src={logo}
                        alt={`Tournament Logo ${index + 1}`}
                        className="relative object-contain h-10 sm:h-14 md:h-18 lg:h-20 max-w-20 sm:max-w-28 md:max-w-36 bg-white/95 rounded-xl p-2 sm:p-3 shadow-2xl border-2 border-white/30"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-2xl blur-lg opacity-80 animate-pulse scale-110"></div>
                  <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center space-x-3 sm:space-x-4 border-2 border-white/40">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-ping"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/80 rounded-full animate-pulse"></div>
                    </div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className="h-5 sm:h-6 md:h-8 lg:h-10 object-contain"
                    />
                    <span className="text-sm sm:text-base md:text-lg font-black tracking-widest">LIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24">
          <div className="h-full flex flex-col justify-center px-6 sm:px-8 md:px-12">
            
            {/* Match Title Section */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16 relative">
              {/* Title background effect */}
              <div className="absolute inset-0 -m-8 sm:-m-12">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl rounded-3xl"></div>
              </div>
              
              <div className="relative">
                <h1
                  className="font-black uppercase text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-4 sm:mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 25%, #f59e0b 50%, #ffffff 75%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(251, 191, 36, 0.3), 0 0 60px rgba(245, 158, 11, 0.2)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 4s ease-in-out infinite'
                  }}
                >
                  {matchData.matchTitle}
                </h1>

                {/* Subtitle */}
                {matchData.showSubtitle && matchData.subtitle && (
                  <div className="text-white/90 text-sm sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {matchData.subtitle}
                    </span>
                  </div>
                )}

                {/* Round and Group */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
                  {matchData.showRound && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl text-sm sm:text-base md:text-lg font-bold text-white border-2 border-white/30">
                        VÒNG {matchData.round}
                      </div>
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-xl text-sm sm:text-base md:text-lg font-bold text-white border-2 border-white/30">
                        BẢNG {matchData.group}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Teams Section - Side by side */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-8 sm:mb-12">
              
              {/* Team A */}
              <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                <div className="relative">
                  {/* Animated ring around logo */}
                  <div className="absolute inset-0 bg-gradient-conic from-blue-400 via-cyan-400 to-blue-400 rounded-full blur-lg opacity-60 animate-spin scale-125"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse scale-150"></div>
                  
                  <div
                    className="relative rounded-full bg-gradient-to-br from-white via-gray-50 to-white p-4 sm:p-6 shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${logoSize}px`,
                      height: `${logoSize}px`
                    }}
                  >
                    <img
                      src={matchData.logo1}
                      alt={matchData.team1}
                      className="object-contain w-[80%] h-[80%] drop-shadow-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOGI1Y2Y2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD4KPHN2Zz4K';
                      }}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl border-2 border-white/40 backdrop-blur-sm">
                    <span
                      className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-wide text-white text-center block drop-shadow-lg"
                      ref={(el) => el && adjustFontSize(el)}
                    >
                      {matchData.team1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                <div className="relative">
                  {/* Animated ring around logo */}
                  <div className="absolute inset-0 bg-gradient-conic from-orange-400 via-red-400 to-orange-400 rounded-full blur-lg opacity-60 animate-spin scale-125" style={{animationDirection: 'reverse'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/30 to-red-500/30 rounded-full blur-2xl animate-pulse scale-150"></div>
                  
                  <div
                    className="relative rounded-full bg-gradient-to-bl from-white via-gray-50 to-white p-4 sm:p-6 shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${logoSize}px`,
                      height: `${logoSize}px`
                    }}
                  >
                    <img
                      src={matchData.logo2}
                      alt={matchData.team2}
                      className="object-contain w-[80%] h-[80%] drop-shadow-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZWY0NDQ0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD4KPHN2Zz4K';
                      }}
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-l from-orange-600 to-red-600 rounded-2xl blur opacity-50"></div>
                  <div className="relative bg-gradient-to-l from-orange-600 via-orange-500 to-red-500 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl border-2 border-white/40 backdrop-blur-sm">
                    <span
                      className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase tracking-wide text-white text-center block drop-shadow-lg"
                      ref={(el) => el && adjustFontSize(el)}
                    >
                      {matchData.team2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Info Section */}
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              
              {/* Date/Time */}
              {(matchData.showTimer || matchData.showDate) && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-black/50 backdrop-blur-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/30 shadow-2xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                      <span className="text-yellow-300">
                        {matchData.showTimer && matchData.roundedTime}
                        {matchData.showTimer && matchData.showDate && ' • '}
                        {matchData.showDate && matchData.currentDate}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stadium */}
              {matchData.showStadium && matchData.stadium && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-black/50 backdrop-blur-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/30 shadow-2xl">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-center text-cyan-300">
                      🏟️ {matchData.stadium}
                    </div>
                  </div>
                </div>
              )}

              {/* Live Text */}
              {matchData.liveText && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl border-2 border-white/30">
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-ping"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/80 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">🎥 {matchData.liveText}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with sponsors */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 px-6 sm:px-8 md:px-12 z-30">
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
            
            {/* Sponsors */}
            {hasSponsors && (
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-xl">
                <div className="text-[10px] sm:text-xs font-bold text-yellow-300 mb-2 sm:mb-3 drop-shadow-lg text-center">
                  💰 NHÀ TÀI TRỢ
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-xs sm:max-w-sm">
                  {sponsorLogos.slice(0, 6).map((sponsor, index) => (
                    <img
                      key={index}
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className={`${getDisplayEachLogo('object-contain bg-white/95 border border-yellow-300/50 shadow-lg')} w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-1 sm:p-1.5`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Organizing */}
            {hasOrganizing && (
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-xl">
                <div className="text-[10px] sm:text-xs font-bold text-blue-300 mb-2 sm:mb-3 drop-shadow-lg text-center">
                  🏛️ BAN TỔ CHỨC
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-xs sm:max-w-sm">
                  {organizingLogos.slice(0, 6).map((organizing, index) => (
                    <img
                      key={index}
                      src={organizing.logo}
                      alt={organizing.name}
                      className={`${getDisplayEachLogo('object-contain bg-white/95 border border-blue-300/50 shadow-lg')} w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-1 sm:p-1.5`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Media Partners */}
            {hasMediaPartners && (
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-xl">
                <div className="text-[10px] sm:text-xs font-bold text-green-300 mb-2 sm:mb-3 drop-shadow-lg text-center">
                  📺 TRUYỀN THÔNG
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-xs sm:max-w-sm">
                  {mediaPartnerLogos.slice(0, 6).map((media, index) => (
                    <img
                      key={index}
                      src={media.logo}
                      alt={media.name}
                      className={`${getDisplayEachLogo('object-contain bg-white/95 border border-green-300/50 shadow-lg')} w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 p-1 sm:p-1.5`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Marquee Section */}
        {isMarqueeRunning && scrollData.text && (
          <div 
            ref={marqueeContainerRef}
            className="absolute bottom-0 left-0 w-full h-8 sm:h-10 md:h-12 overflow-hidden z-40 border-t-4 border-white/20"
            style={{
              background: `linear-gradient(90deg, ${scrollData.bgColor}, ${scrollData.bgColor}ee, ${scrollData.bgColor})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 whitespace-nowrap text-sm sm:text-base md:text-lg lg:text-xl font-bold drop-shadow-2xl"
              style={{
                color: scrollData.color,
                textShadow: `${scrollData.color === '#FFFFFF' ? '#000' : '#FFF'} 2px 2px 4px`,
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
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-white/20 to-yellow-300/30 animate-floating"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
          
          {/* Light rays */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-32 sm:h-48 bg-gradient-to-b from-yellow-300/40 via-white/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-24 sm:h-36 bg-gradient-to-b from-cyan-300/40 via-white/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 -rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
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
              opacity: 0.4;
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
              opacity: 0.8;
            }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
          .animate-floating {
            animation: floating 8s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 15s linear infinite;
          }
          
          .bg-gradient-radial {
            background: radial-gradient(circle at center, var(--tw-gradient-stops));
          }
          
          .bg-gradient-conic {
            background: conic-gradient(from 0deg, var(--tw-gradient-stops));
          }
          
          /* Hexagon styles */
          .hexagon-clip {
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            position: relative;
          }
          
          .hexagon-glow {
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.8));
          }
        `}</style>
      </div>
    </div>
  );
}
