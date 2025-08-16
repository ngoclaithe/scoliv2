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
            
            {/* LEFT SIDE - TEAMS (Always 40% width) */}
            <div className="w-2/5 relative bg-transparent from-purple-900/80 via-blue-900/80 to-indigo-900/80 border-r border-yellow-500 flex-shrink-0">
              
              {/* Complex geometric background pattern for left side */}
              <div className="absolute inset-0">
                {/* Main diagonal shapes */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-0 w-4/5 h-2/3 bg-gradient-to-br from-purple-600/30 to-transparent transform -skew-y-12 rounded-tr-[50px]"></div>
                  <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-gradient-to-tl from-blue-600/25 to-transparent transform skew-x-12 rounded-tl-[40px]"></div>
                </div>

                {/* Overlapping hexagons */}
                <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-purple-500/20 transform rotate-45 animate-pulse" style={{
                  clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)'
                }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-cyan-400/15 transform -rotate-12 animate-pulse" style={{
                  animationDelay: '1.5s',
                  clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)'
                }}></div>

                {/* Triangle overlays */}
                <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-bounce-subtle" style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}></div>
                <div className="absolute bottom-1/4 left-2/3 w-8 h-8 bg-gradient-to-l from-pink-400/15 to-purple-400/15 animate-pulse" style={{
                  animationDelay: '2.5s',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}></div>

                {/* Diamond shapes */}
                <div className="absolute top-2/3 left-1/6 w-6 h-6 bg-indigo-400/20 transform rotate-45 animate-pulse"></div>
                <div className="absolute top-1/6 right-1/3 w-4 h-4 bg-teal-400/15 transform rotate-12 animate-pulse" style={{
                  animationDelay: '3s'
                }}></div>
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

                {/* Subtitle - moved from right side */}
                {matchData.showSubtitle && matchData.subtitle && (
                  <div className="relative">
                    {/* Decorative background shape for subtitle */}
                    <div className="absolute inset-0 transform -skew-x-6">
                      <div className="bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-purple-500/30 rounded-lg blur-sm"></div>
                    </div>
                    <div className="relative bg-black/30 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 border border-purple-400/40 shadow-xl" style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
                    }}>
                      <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold text-center block">
                        <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                          {matchData.subtitle}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Partners section - moved below subtitle */}
                {matchData.partners.length > 0 && (
                  <div className="flex items-center justify-center">
                    {/* Creative container with multiple overlapping shapes */}
                    <div className="relative">
                      {/* Background geometric pattern */}
                      <div className="absolute inset-0 transform rotate-2">
                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg blur-sm"></div>
                      </div>
                      <div className="absolute inset-0 transform -rotate-1">
                        <div className="bg-gradient-to-tl from-blue-500/15 to-cyan-500/15 rounded-full blur"></div>
                      </div>

                      <div className="relative bg-black/40 backdrop-blur-sm px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 border border-white/20 shadow-lg" style={{
                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 90% 100%, 10% 100%, 0% 75%)'
                      }}>
                        <div className="text-[6px] sm:text-[7px] md:text-[8px] font-bold text-yellow-300 mb-0.5 sm:mb-1 text-center">
                          🤝 CÁC ĐƠN VỊ ĐỒNG HÀNH
                        </div>
                        <div className="flex gap-0.5 sm:gap-1 justify-center max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px]">
                          {matchData.partners.slice(0, isMobile ? 4 : isTablet ? 6 : 8).map((partner, index) => (
                            <div key={index} className="relative">
                              {/* Creative border for partner logos */}
                              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/50 to-orange-400/50 rounded transform rotate-45 scale-110 animate-pulse" style={{
                                animationDelay: `${index * 0.2}s`
                              }}></div>
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="relative object-contain bg-white/95 border border-yellow-300/50 shadow-sm w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 p-0.5" style={{
                                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - MATCH INFO (Always 60% width) */}
            <div className="w-3/5 relative bg-transparent from-gray-800/80 via-gray-900/80 to-black/80 flex-shrink-0">
              
              {/* Complex geometric background pattern for right side */}
              <div className="absolute inset-0">
                {/* Main angular shapes */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
                  <div className="absolute top-0 right-0 w-4/5 h-3/5 bg-gradient-to-bl from-yellow-600/25 to-transparent transform skew-y-6 rounded-bl-[60px]"></div>
                  <div className="absolute bottom-0 left-0 w-2/3 h-2/5 bg-gradient-to-tr from-orange-600/20 to-transparent transform -skew-x-6 rounded-tr-[45px]"></div>
                </div>

                {/* Geometric overlays */}
                <div className="absolute top-1/5 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-orange-400/15 transform rotate-12 animate-pulse" style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 60%, 80% 100%, 20% 100%, 0% 40%)'
                }}></div>
                <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-tl from-red-400/12 to-pink-400/12 transform -rotate-45 animate-pulse" style={{
                  animationDelay: '2s',
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                }}></div>

                {/* Floating parallelograms */}
                <div className="absolute top-2/5 left-1/5 w-12 h-8 bg-cyan-400/15 transform skew-x-12 rotate-6 animate-bounce-subtle"></div>
                <div className="absolute bottom-2/5 right-1/6 w-10 h-6 bg-purple-400/12 transform -skew-x-6 rotate-12 animate-pulse" style={{
                  animationDelay: '1.8s'
                }}></div>

                {/* Star-like shapes */}
                <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-gradient-to-r from-white/10 to-yellow-300/15 animate-pulse" style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animationDelay: '2.5s'
                }}></div>
                <div className="absolute bottom-1/5 left-2/5 w-6 h-6 bg-gradient-to-l from-orange-300/12 to-red-300/12 animate-pulse" style={{
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  animationDelay: '4s'
                }}></div>

                {/* Curved overlays */}
                <div className="absolute top-1/6 right-1/5 w-14 h-14 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full transform rotate-45 animate-pulse" style={{
                  animationDelay: '3.2s'
                }}></div>

                {/* Modern grid pattern */}
                <div className="absolute inset-0 opacity-8" style={{
                  backgroundImage: `
                    linear-gradient(45deg, rgba(255,215,0,0.1) 1px, transparent 1px),
                    linear-gradient(-45deg, rgba(255,140,0,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '25px 25px'
                }}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center items-center px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">

                {/* Match Title - Compact container */}
                <div className="relative">
                  {/* Decorative background for title */}
                  <div className="absolute inset-0 transform -skew-x-3">
                    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 blur-xl animate-pulse" style={{
                      clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
                    }}></div>
                  </div>
                  <div className="relative bg-black/40 backdrop-blur-md px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 border border-white/30 shadow-xl" style={{
                    clipPath: 'polygon(8% 0%, 92% 0%, 100% 30%, 92% 100%, 8% 100%, 0% 70%)'
                  }}>
                    <h1
                      className="font-black uppercase text-white text-[9px] sm:text-[10px] md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl leading-tight text-center"
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
                  </div>
                </div>

                {/* Round and Group - Redesigned with geometric shapes */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                  {matchData.showRound && (
                    <div className="relative">
                      {/* Multi-layer geometric background */}
                      <div className="absolute inset-0 transform rotate-3">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 blur opacity-40 animate-pulse" style={{
                          clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
                        }}></div>
                      </div>
                      <div className="absolute inset-0 transform -rotate-2 scale-95">
                        <div className="bg-gradient-to-l from-cyan-400 to-blue-400 blur-sm opacity-30 animate-pulse" style={{
                          animationDelay: '0.5s'
                        }}></div>
                      </div>
                      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-1 sm:px-1.5 md:px-2 lg:px-3 py-0.5 sm:py-1 md:py-1.5 shadow-xl text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold text-white border border-white/30" style={{
                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
                      }}>
                        VÒNG {matchData.round}
                      </div>
                    </div>
                  )}
                  {matchData.showGroup && (
                    <div className="relative">
                      {/* Layered diamond-like shapes */}
                      <div className="absolute inset-0 transform rotate-45 scale-110">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded blur opacity-40 animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 transform -rotate-12">
                        <div className="bg-gradient-to-tl from-red-400 to-orange-400 blur-sm opacity-30 animate-pulse" style={{
                          animationDelay: '0.8s'
                        }}></div>
                      </div>
                      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 px-1 sm:px-1.5 md:px-2 lg:px-3 py-0.5 sm:py-1 md:py-1.5 shadow-xl text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-bold text-white border border-white/30" style={{
                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                      }}>
                        BẢNG {matchData.group}
                      </div>
                    </div>
                  )}
                </div>

                {/* Match Details - Organized in layered containers */}
                <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4">

                  {/* Date/Time - Compact centered container */}
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="relative">
                      {/* Decorative background */}
                      <div className="absolute inset-0 transform skew-x-2">
                        <div className="bg-gradient-to-r from-yellow-500/25 to-orange-500/25 blur-lg animate-pulse" style={{
                          clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
                        }}></div>
                      </div>
                      <div className="relative bg-black/60 backdrop-blur-md px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 border border-white/40 shadow-xl" style={{
                        clipPath: 'polygon(12% 0%, 88% 0%, 100% 40%, 88% 100%, 12% 100%, 0% 60%)'
                      }}>
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold text-yellow-300 text-center whitespace-nowrap">
                          {matchData.showTimer && matchData.roundedTime}
                          {matchData.showTimer && matchData.showDate && ' • '}
                          {matchData.showDate && matchData.currentDate}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stadium - Compact centered container */}
                  {matchData.showStadium && matchData.stadium && (
                    <div className="relative">
                      {/* Decorative background */}
                      <div className="absolute inset-0 transform -skew-x-1">
                        <div className="bg-gradient-to-r from-cyan-500/25 to-blue-500/25 blur-lg animate-pulse" style={{
                          clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)'
                        }}></div>
                      </div>
                      <div className="relative bg-black/60 backdrop-blur-md px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 border border-white/40 shadow-xl" style={{
                        clipPath: 'polygon(18% 0%, 82% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 65%)'
                      }}>
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold text-cyan-300 text-center whitespace-nowrap">
                          🏟️ {matchData.stadium}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Text - Compact centered container */}
                  {matchData.liveText && (
                    <div className="relative">
                      {/* Decorative background */}
                      <div className="absolute inset-0 transform rotate-1">
                        <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 blur-lg animate-pulse" style={{
                          clipPath: 'polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)'
                        }}></div>
                      </div>
                      <div className="relative bg-gradient-to-r from-red-600/90 to-pink-600/90 backdrop-blur-md px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 shadow-xl border border-white/40" style={{
                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
                      }}>
                        <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2">
                          <div className="flex items-center space-x-0.5">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white animate-ping rounded-full"></div>
                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-white/80 rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-bold text-white whitespace-nowrap">🎥 {matchData.liveText}</span>
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

          .w-2\\/5 {
            width: 40% !important;
          }

          .w-3\\/5 {
            width: 60% !important;
          }
        `}</style>
      </div>
    </div>
  );
}
