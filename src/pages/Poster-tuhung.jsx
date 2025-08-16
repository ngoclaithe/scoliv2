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
  const logoSize = isMobile ? 60 : isTablet ? 70 : 80;

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

      <div className="relative w-full max-w-7xl aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">

        {/* Tournament logos and Live unit header */}
        <div className="absolute top-0 left-0 right-0 h-12 sm:h-14 bg-gradient-to-b from-black/60 to-transparent z-30">
          <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6">
            
            {/* Tournament Logos */}
            <div className="flex items-center gap-2 sm:gap-3">
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 && (
                <div className="flex gap-1 sm:gap-2">
                  {matchData.tournamentLogos.slice(0, 3).map((logo, index) => (
                    <div key={index} className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded blur-sm opacity-70 animate-pulse"></div>
                      <img
                        src={logo}
                        alt={`Tournament Logo ${index + 1}`}
                        className="relative object-contain h-6 sm:h-8 md:h-10 max-w-12 sm:max-w-16 md:max-w-20 bg-white/95 rounded p-1 shadow-xl border border-white/50"
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
                  <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg shadow-xl flex items-center space-x-1 sm:space-x-2 border border-white/30">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white/80 rounded-full animate-ping"></div>
                    </div>
                    <img
                      src={matchData.liveUnit}
                      alt="Live Unit"
                      className="h-3 sm:h-4 md:h-5 object-contain"
                    />
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-bold">LIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Main content */}
        <div className="absolute inset-0 pt-12 sm:pt-14 pb-12 sm:pb-16">
          <div className="h-full flex">
            
            {/* LEFT SIDE - TEAMS */}
            <div className="w-1/2 relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-r-2 border-yellow-500">
              
              {/* Background pattern for left side */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6">
                
                {/* Team Logos Row */}
                <div className="flex items-center justify-center gap-12 sm:gap-16 md:gap-20">
                  {/* Team A Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur opacity-60 animate-pulse scale-110"></div>
                    <div
                      className="relative rounded-full bg-white p-2 sm:p-3 md:p-4 shadow-xl border-2 border-white/50 flex items-center justify-center overflow-hidden"
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

                  {/* Team B Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur opacity-60 animate-pulse scale-110"></div>
                    <div
                      className="relative rounded-full bg-white p-2 sm:p-3 md:p-4 shadow-xl border-2 border-white/50 flex items-center justify-center overflow-hidden"
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

                {/* Partners section - below team logos */}
                {matchData.partners.length > 0 && (
                  <div className="flex items-center justify-center">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2 border border-white/20 shadow-lg">
                      <div className="text-[8px] sm:text-[9px] font-bold text-yellow-300 mb-1 text-center">
                        🤝 CÁC ĐƠN VỊ ĐỒNG HÀNH
                      </div>
                      <div className="flex gap-1 sm:gap-2 justify-center max-w-sm">
                        {matchData.partners.slice(0, 8).map((partner, index) => (
                          <img
                            key={index}
                            src={partner.logo}
                            alt={partner.name}
                            className="object-contain bg-white/95 border border-yellow-300/50 shadow-sm rounded w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 p-0.5"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Names Row */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
                  {/* Team A Name */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg shadow-xl border border-white/40 backdrop-blur-sm max-w-[120px] sm:max-w-[140px]">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black uppercase tracking-wide text-white text-center block drop-shadow-lg">
                      {matchData.team1}
                    </span>
                  </div>

                  {/* Team B Name */}
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg shadow-xl border border-white/40 backdrop-blur-sm max-w-[120px] sm:max-w-[140px]">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black uppercase tracking-wide text-white text-center block drop-shadow-lg">
                      {matchData.team2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - MATCH INFO */}
            <div className="w-1/2 relative bg-gradient-to-bl from-gray-800 via-gray-900 to-black">
              
              {/* Background pattern for right side */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '3s'}}></div>
                
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 space-y-3 sm:space-y-4 md:space-y-6">
                
                {/* Match Title */}
                <div className="text-center">
                  <h1
                    className="font-black uppercase text-white text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tight mb-2 sm:mb-3"
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
                    <div className="text-white/90 text-[10px] sm:text-xs md:text-sm font-semibold mb-2 sm:mb-3">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {matchData.subtitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* Round and Group */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                  {matchData.showRound && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg shadow-xl text-[10px] sm:text-xs md:text-sm font-bold text-white border border-white/30">
                        VÒNG {matchData.round}
                      </div>
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-60 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg shadow-xl text-[10px] sm:text-xs md:text-sm font-bold text-white border border-white/30">
                        BẢNG {matchData.group}
                      </div>
                    </div>
                  )}
                </div>

                {/* Match Details */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  
                  {/* Date/Time */}
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg blur-lg"></div>
                      <div className="relative bg-black/50 backdrop-blur-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg border border-white/30 shadow-xl text-center">
                        <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-yellow-300">
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
                      <div className="relative bg-black/50 backdrop-blur-lg px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg border border-white/30 shadow-xl text-center">
                        <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-cyan-300">
                          🏟️ {matchData.stadium}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Text */}
                  {matchData.liveText && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-red-600 to-pink-600 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg shadow-xl border border-white/30 text-center">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></div>
                            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/80 rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">🎥 {matchData.liveText}</span>
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
            className="absolute bottom-0 left-0 w-full h-4 sm:h-6 md:h-8 overflow-hidden z-40 border-t-2 border-yellow-500"
            style={{
              background: `linear-gradient(90deg, ${scrollData.bgColor}, ${scrollData.bgColor}ee, ${scrollData.bgColor})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 whitespace-nowrap text-xs sm:text-sm md:text-base font-bold drop-shadow-2xl"
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
                width: `${3 + Math.random() * 4}px`,
                height: `${3 + Math.random() * 4}px`,
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
        `}</style>
      </div>
    </div>
  );
}