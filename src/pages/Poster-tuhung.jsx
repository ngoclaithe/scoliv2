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
    <div className="w-full h-screen bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">

      <div className="relative w-full max-w-7xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">

        {/* Tournament logos and Live unit header */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-black/60 to-transparent z-30">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 md:px-8">
            
            {/* Tournament Logos */}
            <div className="flex items-center gap-3 sm:gap-4">
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
                <div className="flex gap-2 sm:gap-3">
                  {matchData.tournamentLogos.slice(0, 3).map((logo, index) => (
                    <div key={index} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur-sm opacity-70 animate-pulse"></div>
                      <img
                        src={logo}
                        alt={`Tournament Logo ${index + 1}`}
                        className="relative object-contain h-8 sm:h-12 md:h-16 max-w-16 sm:max-w-24 md:max-w-32 bg-white/95 rounded-lg p-1 sm:p-2 shadow-xl border-2 border-white/50"
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
                  <div className="absolute inset-0 bg-red-500 rounded-xl blur-md opacity-80 animate-pulse"></div>
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
        </div>

        {/* Main content - True LEFT/RIGHT split */}
        <div className="absolute inset-0 pt-16 sm:pt-20 pb-16 sm:pb-20">
          <div className="h-full flex">
            
            {/* LEFT SIDE - TEAMS ONLY */}
            <div className="w-1/2 relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-r-4 border-yellow-500">
              
              {/* Background pattern for left side */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
                
                {/* Geometric patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/20 transform rotate-45"></div>
                  <div className="absolute top-1/2 left-8 w-12 h-12 bg-white/10 rounded-full"></div>
                </div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 space-y-8 sm:space-y-12 md:space-y-16">
                
                {/* Team A */}
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-lg opacity-60 animate-pulse scale-125"></div>
                    <div
                      className="relative rounded-full bg-white p-4 sm:p-5 md:p-6 shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden"
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
                  
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl shadow-2xl border-2 border-white/40 backdrop-blur-sm max-w-xs">
                    <span
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wide text-white text-center block drop-shadow-lg"
                      ref={(el) => el && adjustFontSize(el)}
                    >
                      {matchData.team1}
                    </span>
                  </div>
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-lg opacity-60 animate-pulse scale-125"></div>
                    <div
                      className="relative rounded-full bg-white p-4 sm:p-5 md:p-6 shadow-2xl border-4 border-white/50 flex items-center justify-center overflow-hidden"
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
                  
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl shadow-2xl border-2 border-white/40 backdrop-blur-sm max-w-xs">
                    <span
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wide text-white text-center block drop-shadow-lg"
                      ref={(el) => el && adjustFontSize(el)}
                    >
                      {matchData.team2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - MATCH INFO ONLY */}
            <div className="w-1/2 relative bg-gradient-to-bl from-gray-800 via-gray-900 to-black">
              
              {/* Background pattern for right side */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
                
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 md:px-12 space-y-6 sm:space-y-8 md:space-y-10">
                
                {/* Match Title */}
                <div className="text-center">
                  <h1
                    className="font-black uppercase text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight mb-4 sm:mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 25%, #f59e0b 50%, #ffffff 75%, #fbbf24 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 30px rgba(251, 191, 36, 0.3)',
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
                </div>

                {/* Round and Group */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
                  {matchData.showRound && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-2xl shadow-xl text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white border-2 border-white/30">
                        VÒNG {matchData.round}
                      </div>
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-2xl shadow-xl text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white border-2 border-white/30">
                        BẢNG {matchData.group}
                      </div>
                    </div>
                  )}
                </div>

                {/* Match Details */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  
                  {/* Date/Time */}
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative bg-black/50 backdrop-blur-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-2xl border border-white/30 shadow-2xl text-center">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-300">
                          {matchData.showTimer && matchData.roundedTime}
                          {matchData.showTimer && matchData.showDate && ' • '}
                          {matchData.showDate && matchData.currentDate}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stadium */}
                  {matchData.showStadium && matchData.stadium && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative bg-black/50 backdrop-blur-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-2xl border border-white/30 shadow-2xl text-center">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300">
                          🏟️ {matchData.stadium}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Text */}
                  {matchData.liveText && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-lg animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-2xl shadow-2xl border-2 border-white/30 text-center">
                        <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-ping"></div>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/80 rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">🎥 {matchData.liveText}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with sponsors and partners */}
        <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 px-4 sm:px-6 md:px-8 z-30">
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
            
            {/* Sponsors */}
            {hasSponsors && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 shadow-xl">
                <div className="text-[8px] sm:text-[10px] font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                  💰 NHÀ TÀI TRỢ
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center max-w-32 sm:max-w-48">
                  {sponsorLogos.slice(0, 6).map((sponsor, index) => (
                    <img
                      key={index}
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className={`${getDisplayEachLogo('object-contain bg-white/95 border border-yellow-300/50 shadow-lg')} w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 p-0.5 sm:p-1`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Organizing */}
            {hasOrganizing && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 shadow-xl">
                <div className="text-[8px] sm:text-[10px] font-bold text-blue-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                  🏛️ BAN TỔ CHỨC
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center max-w-32 sm:max-w-48">
                  {organizingLogos.slice(0, 6).map((organizing, index) => (
                    <img
                      key={index}
                      src={organizing.logo}
                      alt={organizing.name}
                      className={`${getDisplayEachLogo('object-contain bg-white/95 border border-blue-300/50 shadow-lg')} w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 p-0.5 sm:p-1`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Media Partners */}
            {hasMediaPartners && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 shadow-xl">
                <div className="text-[8px] sm:text-[10px] font-bold text-green-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                  📺 TRUYỀN THÔNG
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 justify-center max-w-32 sm:max-w-48">
                  {mediaPartnerLogos.slice(0, 6).map((media, index) => (
                    <img
                      key={index}
                      src={media.logo}
                      alt={media.name}
                      className={`${getDisplayEachLogo('object-contain bg-white/95 border border-green-300/50 shadow-lg')} w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 p-0.5 sm:p-1`}
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
            className="absolute bottom-0 left-0 w-full h-6 sm:h-8 md:h-12 overflow-hidden z-40 border-t-4 border-yellow-500"
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
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-white/20 to-yellow-300/30 animate-floating"
              style={{
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 4}s`
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
          
          @keyframes floating {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-15px) rotate(180deg);
              opacity: 0.8;
            }
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
