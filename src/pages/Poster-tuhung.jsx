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
    tournamentLogos: getFullLogoUrls(tournamentLogo?.url_logo || []),
    liveUnit: getFullLogoUrl(liveUnit?.url_logo?.[0]) || null,
    liveText: contextMatchData.liveText || 'YOUTUBE LIVE',
    round: contextMatchData.round || 1,
    group: contextMatchData.group || 'A',
    subtitle: contextMatchData.subtitle || '',
    showRound: contextMatchData.showRound === true,
    showGroup: contextMatchData.showGroup === true,
    showSubtitle: contextMatchData.showSubtitle !== false,
    showTournamentLogo: displaySettings?.showTournamentLogo !== false,
    showTimer: posterSettings?.showTimer !== false,
    showDate: posterSettings?.showDate !== false,
    showStadium: posterSettings?.showStadium !== false,
    // Combine all partners into one array
    partners: [
      ...((sponsors?.sponsors?.url_logo || []).map((url, index) => ({
        logo: getFullLogoUrl(url),
        name: 'Sponsor',
        type: 'sponsor',
        typeDisplay: sponsors?.sponsors?.type_display?.[index] || 'square'
      }))),
      ...((organizing?.organizing?.url_logo || []).map((url, index) => ({
        logo: getFullLogoUrl(url),
        name: 'Organizing',
        type: 'organizing',
        typeDisplay: organizing?.organizing?.type_display?.[index] || 'square'
      }))),
      ...((mediaPartners?.mediaPartners?.url_logo || []).map((url, index) => ({
        logo: getFullLogoUrl(url),
        name: 'Media Partner',
        type: 'media',
        typeDisplay: mediaPartners?.mediaPartners?.type_display?.[index] || 'square'
      })))
    ].filter(partner => partner.logo)
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
  }, [windowSize.width]);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const logoSize = isMobile ? 40 : isTablet ? 50 : 80;

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
    <div className="w-full h-screen bg-black flex items-center justify-center p-1 sm:p-2 overflow-hidden">
      <div 
        className="relative w-full max-w-7xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-700"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/images/basic/sancodep2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Tournament logos and Live unit header */}
        <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 md:h-12 lg:h-14 bg-gradient-to-b from-black/70 to-transparent z-30">
          <div className="flex items-center justify-between h-full px-2 sm:px-3 md:px-4 lg:px-6">
            
            {/* Tournament Logos */}
            <div className="flex items-center gap-1 sm:gap-2">
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
                <div className="flex gap-1">
                  {matchData.tournamentLogos.slice(0, 3).map((logo, index) => (
                    <div key={index} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded blur-sm opacity-70 animate-pulse"></div>
                      <img
                        src={logo}
                        alt={`Tournament Logo ${index + 1}`}
                        className="relative object-contain h-3 sm:h-4 md:h-6 lg:h-8 xl:h-10 max-w-6 sm:max-w-8 md:max-w-12 lg:max-w-16 xl:max-w-20 bg-white/95 rounded p-0.5 sm:p-1 shadow-xl border border-white/50"
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
                  <div className="absolute inset-0 bg-red-500 rounded-lg blur opacity-80 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white px-1 sm:px-2 md:px-3 lg:px-4 py-0.5 sm:py-1 md:py-1.5 lg:py-2 rounded-lg shadow-xl flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 border border-white/30">
                    <div className="flex space-x-0.5 sm:space-x-1">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
                    </div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className="h-2 sm:h-3 md:h-4 lg:h-5 object-contain"
                    />
                    <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-bold">LIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content - ALWAYS HORIZONTAL LAYOUT */}
        <div className="absolute inset-0 pt-8 sm:pt-10 md:pt-12 lg:pt-14 pb-8 sm:pb-10 md:pb-12 lg:pb-16">
          <div className="h-full flex flex-row">
            
            {/* LEFT SIDE - TEAMS (Always 50% width) */}
            <div className="w-1/2 relative bg-transparent from-purple-900/80 via-blue-900/80 to-indigo-900/80 border-r border-yellow-500 flex-shrink-0">
              
              {/* Background pattern for left side */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center items-center px-1 sm:px-2 md:px-4 lg:px-6 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                
                {/* Team Logos Row */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
                  {/* Team A Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur opacity-60 animate-pulse scale-110"></div>
                    <div
                      className="relative rounded-full bg-white p-1 sm:p-1.5 md:p-2 lg:p-3 shadow-xl border border-white/50 flex items-center justify-center overflow-hidden"
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

                  {/* VS Text */}
                  <div className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl opacity-80">
                    VS
                  </div>

                  {/* Team B Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur opacity-60 animate-pulse scale-110"></div>
                    <div
                      className="relative rounded-full bg-white p-1 sm:p-1.5 md:p-2 lg:p-3 shadow-xl border border-white/50 flex items-center justify-center overflow-hidden"
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
                </div>

                {/* Team Names Row */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
                  {/* Team A Name */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg shadow-xl border border-white/40 backdrop-blur-sm max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px]">
                    <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-black uppercase tracking-tight text-white text-center block drop-shadow-lg leading-tight">
                      {matchData.team1}
                    </span>
                  </div>

                  {/* Team B Name */}
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg shadow-xl border border-white/40 backdrop-blur-sm max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px]">
                    <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-black uppercase tracking-tight text-white text-center block drop-shadow-lg leading-tight">
                      {matchData.team2}
                    </span>
                  </div>
                </div>

                {/* Partners section - moved below team names */}
                {matchData.partners.length > 0 && (
                  <div className="flex items-center justify-center">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 border border-white/20 shadow-lg">
                      <div className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-yellow-300 mb-0.5 sm:mb-1 text-center">
                        🤝 CÁC ĐƠN VỊ ĐỒNG HÀNH
                      </div>
                      <div className="flex gap-0.5 sm:gap-1 justify-center max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px]">
                        {matchData.partners.slice(0, isMobile ? 4 : isTablet ? 6 : 8).map((partner, index) => (
                          <img
                            key={index}
                            src={partner.logo}
                            alt={partner.name}
                            className="object-contain bg-white/95 border border-yellow-300/50 shadow-sm rounded w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 p-0.5"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - MATCH INFO (Always 50% width) */}
            <div className="w-1/2 relative bg-transparent from-gray-800/80 via-gray-900/80 to-black/80 flex-shrink-0">
              
              {/* Background pattern for right side */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 right-1/4 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '3s'}}></div>
                
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4">
                
                {/* Match Title */}
                <div className="text-center">
                  <h1
                    className="font-black uppercase text-white text-[9px] sm:text-[10px] md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl leading-tight mb-1 sm:mb-2"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 25%, #f59e0b 50%, #ffffff 75%, #fbbf24 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
                      backgroundSize: '200% 200%',
                      animation: 'gradientShift 4s ease-in-out infinite'
                    }}
                  >
                    {matchData.matchTitle}
                  </h1>

                  {/* Subtitle */}
                  {matchData.showSubtitle && matchData.subtitle && (
                    <div className="text-white/90 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-semibold mb-1 sm:mb-2">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {matchData.subtitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* Round and Group */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                  {matchData.showRound && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-1 sm:px-1.5 md:px-2 lg:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg shadow-xl text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold text-white border border-white/30">
                        VÒNG {matchData.round}
                      </div>
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 px-1 sm:px-1.5 md:px-2 lg:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg shadow-xl text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold text-white border border-white/30">
                        BẢNG {matchData.group}
                      </div>
                    </div>
                  )}
                </div>

                {/* Match Details */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-3">
                  
                  {/* Date/Time */}
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg blur-lg"></div>
                      <div className="relative bg-black/50 backdrop-blur-lg px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg border border-white/30 shadow-xl text-center">
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold text-yellow-300">
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
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-lg"></div>
                      <div className="relative bg-black/50 backdrop-blur-lg px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg border border-white/30 shadow-xl text-center">
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold text-cyan-300">
                          🏟️ {matchData.stadium}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Text */}
                  {matchData.liveText && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg shadow-xl border border-white/30 text-center">
                        <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 md:space-x-2">
                          <div className="flex items-center space-x-0.5">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping"></div>
                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-white/80 rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold text-white">🎥 {matchData.liveText}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Marquee Section */}
        {isMarqueeRunning && scrollData.text && (
          <div 
            ref={marqueeContainerRef}
            className="absolute bottom-0 left-0 w-full h-2 sm:h-3 md:h-4 lg:h-6 xl:h-8 overflow-hidden z-40 border-t border-yellow-500"
            style={{
              background: `linear-gradient(90deg, ${scrollData.bgColor}, ${scrollData.bgColor}ee, ${scrollData.bgColor})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 whitespace-nowrap text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold drop-shadow-2xl"
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
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-white/20 to-yellow-300/30 animate-floating"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
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
              transform: translateY(-10px) rotate(180deg);
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

          /* Ensure horizontal layout on all screen sizes */
          .flex-row {
            flex-direction: row !important;
          }
          
          .w-1\\/2 {
            width: 50% !important;
          }
        `}</style>
      </div>
    </div>
  );
}