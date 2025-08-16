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
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-7xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">

        {/* Dynamic geometric background */}
        <div className="absolute inset-0">
          {/* Main diagonal split */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-700 to-blue-800"
            style={{
              clipPath: 'polygon(0 0, 75% 0, 45% 100%, 0 100%)'
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-tl from-orange-500 via-red-600 to-pink-700"
            style={{
              clipPath: 'polygon(75% 0, 100% 0, 100% 100%, 45% 100%)'
            }}
          />
          
          {/* Overlaying geometric shapes */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/30 to-purple-600/20"
            style={{
              clipPath: 'polygon(20% 30%, 80% 20%, 70% 80%, 10% 90%)'
            }}
          />
          
          {/* Animated floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-white/10 to-yellow-300/20 animate-floating"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col">

          {/* Header section - diagonal layout */}
          <div className="relative h-1/4 p-3 sm:p-6">
            
            {/* Tournament logos - top left corner with rotation */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 transform -rotate-12 z-20">
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
                <div className="flex flex-col gap-2">
                  {matchData.tournamentLogos.slice(0, 2).map((logo, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
                      <img
                        src={logo}
                        alt={`Tournament Logo ${index + 1}`}
                        className="relative object-contain h-6 sm:h-10 md:h-14 lg:h-16 max-w-16 sm:max-w-24 md:max-w-32 bg-white/90 rounded-lg p-1 sm:p-2 shadow-xl border-2 border-white/50 transform hover:scale-110 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live unit - top right with special styling */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
              {matchData.liveUnit && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-500 rounded-2xl blur-md opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-2xl shadow-2xl flex items-center space-x-2 sm:space-x-3 border-2 border-white/30 transform hover:scale-105 transition-all duration-300">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/80 rounded-full animate-ping"></div>
                    </div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className="h-4 sm:h-5 md:h-6 lg:h-8 object-contain"
                    />
                    <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wider">LIVE</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sponsors and partners - diagonal arrangement */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-2 sm:px-4 pb-2">
              
              {/* Left side - Sponsors */}
              {hasSponsors && (
                <div className="transform -skew-x-12 bg-black/30 backdrop-blur-sm rounded-2xl p-2 sm:p-3 border border-white/20">
                  <div className="transform skew-x-12">
                    <div className="text-[8px] sm:text-[10px] font-bold text-yellow-300 mb-1 sm:mb-2 drop-shadow-lg">
                      💰 Nhà tài trợ
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 max-w-32 sm:max-w-48">
                      {sponsorLogos.slice(0, 8).map((sponsor, index) => (
                        <img
                          key={index}
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className={`${getDisplayEachLogo('object-contain bg-white/90 border border-yellow-300/50 shadow-lg transform hover:scale-110 transition-all duration-300')} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 p-0.5 sm:p-1`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Center - Organizing */}
              {hasOrganizing && (
                <div className="transform rotate-6 bg-black/30 backdrop-blur-sm rounded-2xl p-2 sm:p-3 border border-white/20 mx-2">
                  <div className="transform -rotate-6">
                    <div className="text-[8px] sm:text-[10px] font-bold text-blue-300 mb-1 sm:mb-2 drop-shadow-lg text-center">
                      🏛️ Ban tổ chức
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center max-w-24 sm:max-w-32">
                      {organizingLogos.slice(0, 6).map((organizing, index) => (
                        <img
                          key={index}
                          src={organizing.logo}
                          alt={organizing.name}
                          className={`${getDisplayEachLogo('object-contain bg-white/90 border border-blue-300/50 shadow-lg transform hover:scale-110 transition-all duration-300')} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 p-0.5 sm:p-1`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Right side - Media Partners */}
              {hasMediaPartners && (
                <div className="transform skew-x-12 bg-black/30 backdrop-blur-sm rounded-2xl p-2 sm:p-3 border border-white/20">
                  <div className="transform -skew-x-12">
                    <div className="text-[8px] sm:text-[10px] font-bold text-green-300 mb-1 sm:mb-2 drop-shadow-lg text-right">
                      📺 Truyền thông
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-end max-w-32 sm:max-w-48">
                      {mediaPartnerLogos.slice(0, 6).map((media, index) => (
                        <img
                          key={index}
                          src={media.logo}
                          alt={media.name}
                          className={`${getDisplayEachLogo('object-contain bg-white/90 border border-green-300/50 shadow-lg transform hover:scale-110 transition-all duration-300')} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 p-0.5 sm:p-1`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main content - innovative layout */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8">
            
            {/* Central content container */}
            <div className="relative w-full max-w-6xl">
              
              {/* Title section with dynamic styling */}
              <div className="text-center mb-6 sm:mb-10 relative">
                
                {/* Background effects for title */}
                <div className="absolute inset-0 -m-4 sm:-m-8">
                  <div 
                    className="w-full h-full bg-gradient-to-r from-purple-600/20 via-pink-500/30 to-orange-500/20 rounded-3xl blur-xl"
                    style={{
                      transform: 'skewY(-2deg) rotate(-1deg)'
                    }}
                  />
                </div>
                
                <div className="relative z-10">
                  <h1
                    className="font-black uppercase text-white text-base sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl px-4 transform hover:scale-105 transition-all duration-500"
                    style={{
                      textShadow: '#8b5cf6 0 0 20px, #ec4899 0 0 40px, #f97316 0 0 60px',
                      background: 'linear-gradient(45deg, #ffffff, #fbbf24, #f59e0b, #ffffff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.8))'
                    }}
                  >
                    {matchData.matchTitle}
                  </h1>

                  {/* Subtitle with special effects */}
                  {matchData.showSubtitle && matchData.subtitle && (
                    <div className="text-white/95 text-sm sm:text-lg md:text-xl font-semibold mt-3 sm:mt-4 px-4 transform skew-x-2">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {matchData.subtitle}
                      </span>
                    </div>
                  )}

                  {/* Round and Group with dynamic positioning */}
                  <div className="flex items-center justify-center gap-4 sm:gap-8 mt-4 sm:mt-6">
                    {matchData.showRound && (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg text-xs sm:text-sm md:text-base font-bold text-white border border-white/30 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                          VÒNG {matchData.round}
                        </div>
                      </div>
                    )}
                    {matchData.showGroup && (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-gradient-to-r from-orange-600 to-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg text-xs sm:text-sm md:text-base font-bold text-white border border-white/30 transform rotate-3 hover:rotate-0 transition-all duration-300">
                          BẢNG {matchData.group}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Teams layout - diagonal arrangement */}
              <div className="relative">
                
                {/* Team A - positioned diagonally top-left */}
                <div className="absolute top-0 left-0 transform -translate-x-4 sm:-translate-x-8 -translate-y-4 sm:-translate-y-8 z-30">
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4 transform -rotate-12 hover:rotate-0 transition-all duration-500">
                    
                    {/* Team A Logo */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 scale-125"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-300 rounded-full blur-md opacity-50 animate-pulse scale-150"></div>
                      <div
                        className="relative rounded-full bg-gradient-to-br from-white to-gray-100 p-3 sm:p-4 shadow-2xl border-4 border-white/60 flex items-center justify-center overflow-hidden transform hover:scale-110 transition duration-300"
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
                    
                    {/* Team A Name */}
                    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl border-2 border-white/40 backdrop-blur-sm max-w-32 sm:max-w-48 transform skew-x-6">
                      <span
                        className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block truncate drop-shadow-lg transform -skew-x-6"
                        ref={(el) => el && adjustFontSize(el)}
                      >
                        {matchData.team1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team B - positioned diagonally bottom-right */}
                <div className="absolute bottom-0 right-0 transform translate-x-4 sm:translate-x-8 translate-y-4 sm:translate-y-8 z-30">
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4 transform rotate-12 hover:rotate-0 transition-all duration-500">
                    
                    {/* Team B Logo */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-bl from-orange-500 via-red-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 scale-125"></div>
                      <div className="absolute inset-0 bg-gradient-to-bl from-orange-400 via-red-400 to-pink-400 rounded-full blur-md opacity-50 animate-pulse scale-150"></div>
                      <div
                        className="relative rounded-full bg-gradient-to-bl from-white to-gray-100 p-3 sm:p-4 shadow-2xl border-4 border-white/60 flex items-center justify-center overflow-hidden transform hover:scale-110 transition duration-300"
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
                    
                    {/* Team B Name */}
                    <div className="bg-gradient-to-l from-orange-500 via-red-500 to-pink-500 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl border-2 border-white/40 backdrop-blur-sm max-w-32 sm:max-w-48 transform -skew-x-6">
                      <span
                        className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block truncate drop-shadow-lg transform skew-x-6"
                        ref={(el) => el && adjustFontSize(el)}
                      >
                        {matchData.team2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Central VS and info section */}
                <div className="flex flex-col items-center justify-center min-h-32 sm:min-h-48 relative z-20">
                  
                  {/* VS Section with 3D effect */}
                  <div className="relative mb-4 sm:mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-60 animate-pulse scale-150"></div>
                    <div className="relative bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full p-4 sm:p-6 md:p-8 shadow-2xl border-4 border-white/50 transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                      <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl">
                        VS
                      </span>
                    </div>
                  </div>

                  {/* Match info with modern design */}
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    
                    {/* Date/Time/Stadium */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-gray-800/60 rounded-2xl blur backdrop-blur-sm"></div>
                      <div className="relative bg-black/40 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/30 shadow-xl transform hover:scale-105 transition-all duration-300">
                        <div className="text-xs sm:text-sm md:text-base font-semibold text-white text-center whitespace-nowrap">
                          {(matchData.showTimer || matchData.showDate) && (
                            <span className="text-yellow-300">
                              {matchData.showTimer && matchData.roundedTime}
                              {matchData.showTimer && matchData.showDate && ' • '}
                              {matchData.showDate && matchData.currentDate}
                            </span>
                          )}
                          {(matchData.showTimer || matchData.showDate) && matchData.showStadium && matchData.stadium && (
                            <span className="text-white/80"> | </span>
                          )}
                          {matchData.showStadium && matchData.stadium && (
                            <span className="text-cyan-300">🏟️ {matchData.stadium}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Live indicator */}
                    {matchData.liveText && (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-red-600 to-pink-600 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl backdrop-blur-sm text-white text-center whitespace-nowrap flex items-center space-x-2 sm:space-x-3 shadow-xl border border-white/30 transform hover:scale-105 transition-all duration-300">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></div>
                            <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-xs sm:text-sm md:text-base font-bold">🎥 {matchData.liveText}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Marquee Section with enhanced styling */}
        {isMarqueeRunning && scrollData.text && (
          <div 
            ref={marqueeContainerRef}
            className="absolute bottom-0 left-0 w-full h-6 sm:h-8 md:h-10 overflow-hidden z-40 border-t-4 border-white/20"
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

        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* Lightning effect */}
          <div className="absolute top-1/4 left-1/2 w-1 h-16 sm:h-24 bg-gradient-to-b from-yellow-300 via-white to-transparent transform -translate-x-1/2 -skew-x-12 opacity-80 animate-lightning"></div>
          
          {/* Geometric decorations */}
          <div className="absolute top-8 right-8 w-6 h-6 sm:w-10 sm:h-10 border-2 border-white/40 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 left-12 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400/60 transform rotate-45 animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-3 h-3 sm:w-5 sm:h-5 bg-purple-400/60 rounded-full animate-bounce"></div>
          
          {/* Energy lines */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
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
              transform: translateY(0) rotate(0deg) scale(1);
              opacity: 0.4;
            }
            33% {
              transform: translateY(-10px) rotate(120deg) scale(1.1);
              opacity: 0.7;
            }
            66% {
              transform: translateY(5px) rotate(240deg) scale(0.9);
              opacity: 0.5;
            }
          }
          
          @keyframes lightning {
            0%, 90%, 100% {
              opacity: 0;
              transform: translateX(-50%) scaleY(0);
            }
            5%, 85% {
              opacity: 1;
              transform: translateX(-50%) scaleY(1);
            }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-floating {
            animation: floating 6s ease-in-out infinite;
          }
          
          .animate-lightning {
            animation: lightning 4s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 12s linear infinite;
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
