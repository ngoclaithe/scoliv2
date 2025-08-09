import React, { useRef } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function MatchIntroduction() {
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
    matchTitle: contextMatchData.matchTitle || 'TRỰC TIẾP TRẬN BÓNG ĐÁ',
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
    logoShape: displaySettings?.logoShape || 'circle',
    showTournamentLogo: displaySettings?.showTournamentLogo !== false,
    showSponsors: displaySettings?.showSponsors !== false,
    showOrganizing: displaySettings?.showOrganizing !== false,
    showMediaPartners: displaySettings?.showMediaPartners !== false,
    showTimer: posterSettings?.showTimer !== false,
    showDate: posterSettings?.showDate !== false,
    showStadium: posterSettings?.showStadium !== false,
    showLiveIndicator: posterSettings?.showLiveIndicator !== false,
    accentColor: posterSettings?.accentColor || '#3b82f6'
  };

  const getLogoShape = (typeDisplay) => {
    switch (typeDisplay) {
      case 'round': return 'circle';
      case 'hexagonal': return 'hexagon';
      case 'square':
      default: return 'square';
    }
  };

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

  const marquee = {
    text: marqueeData.text || '',
    isRunning: marqueeData.mode !== 'none'
  };

  const marqueeRef = useRef(null);

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

  const getLogoShapeClass = (baseClass) => {
    switch (matchData.logoShape) {
      case 'square':
        return `${baseClass} rounded-lg`;
      case 'hexagon':
        return `${baseClass} rounded-full`;
      case 'shield':
        return `${baseClass} rounded-lg`;
      case 'circle':
      default:
        return `${baseClass} rounded-full`;
    }
  };

  const getPartnerLogoShapeClass = (baseClass, typeDisplay) => {
    const shape = getLogoShape(typeDisplay);
    switch (shape) {
      case 'square':
        return `${baseClass} rounded-lg`;
      case 'hexagon':
        return `${baseClass} rounded-full`;
      case 'circle':
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
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg2.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-3 sm:p-6">

          <div className="flex justify-between items-start mb-1 sm:mb-3 md:mb-5 min-h-[8vh] sm:min-h-[12vh] md:min-h-[14vh]">

            <div className="flex gap-2 sm:gap-4">
              {hasSponsors && (
                <div className="flex-shrink-0">
                  <div className="text-xs font-bold text-green-400 mb-1 drop-shadow-lg">
                    Nhà tài trợ
                  </div>
                  <div className="flex gap-1 flex-wrap max-w-[15vw]">
                    {sponsorLogos.map((sponsor, index) => {
                      const getContainerShape = (typeDisplay) => {
                        switch (typeDisplay) {
                          case 'round': return 'rounded-full';
                          case 'hexagonal': return 'rounded-full';
                          case 'square':
                          default: return 'rounded-lg';
                        }
                      };
                      const logoSize = Math.max(20, Math.min(35, window.innerWidth * 0.025));
                      return (
                        <div key={index} className={`relative bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden ${getContainerShape(sponsor.typeDisplay)}`} style={{width: `${logoSize}px`, height: `${logoSize}px`}}>
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="object-contain w-[100%] h-[100%]"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasOrganizing && (
                <div className="flex-shrink-0">
                  <div className="text-xs font-bold text-blue-400 mb-1 drop-shadow-lg">
                    Đơn vị tổ chức
                  </div>
                  <div className="flex gap-1 flex-wrap max-w-[15vw]">
                    {organizingLogos.map((organizing, index) => {
                      const getContainerShape = (typeDisplay) => {
                        switch (typeDisplay) {
                          case 'round': return 'rounded-full';
                          case 'hexagonal': return 'rounded-full';
                          case 'square':
                          default: return 'rounded-lg';
                        }
                      };
                      const logoSize = Math.max(20, Math.min(35, window.innerWidth * 0.025));
                      return (
                        <div key={index} className={`relative bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden ${getContainerShape(organizing.typeDisplay)}`} style={{width: `${logoSize}px`, height: `${logoSize}px`}}>
                          <img
                            src={organizing.logo}
                            alt={organizing.name}
                            className="object-contain w-[100%] h-[100%]"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className={`flex ${getTournamentPositionClass()} items-center flex-1 gap-1 sm:gap-2 md:gap-4`}>
              {matchData.showTournamentLogo && matchData.tournamentLogos && matchData.tournamentLogos.length > 0 &&
                matchData.tournamentLogos.map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Tournament Logo ${index + 1}`}
                    className="object-contain h-6 sm:h-8 md:h-12 lg:h-16 max-w-16 sm:max-w-24 md:max-w-32"
                  />
                ))
              }
            </div>

            <div className="flex flex-col items-end gap-2">
              {hasMediaPartners && (
                <div className="flex-shrink-0">
                  <div className="text-xs font-bold text-purple-400 mb-1 drop-shadow-lg text-right">
                    Đơn vị truyền thông
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end max-w-[15vw]">
                    {mediaPartnerLogos.map((media, index) => {
                      const getContainerShape = (typeDisplay) => {
                        switch (typeDisplay) {
                          case 'round': return 'rounded-full';
                          case 'hexagonal': return 'rounded-full';
                          case 'square':
                          default: return 'rounded-lg';
                        }
                      };
                      const logoSize = Math.max(20, Math.min(35, window.innerWidth * 0.025));
                      return (
                        <div key={index} className={`relative bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden ${getContainerShape(media.typeDisplay)}`} style={{width: `${logoSize}px`, height: `${logoSize}px`}}>
                          <img
                            src={media.logo}
                            alt={media.name}
                            className="object-contain w-[100%] h-[100%]"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K';
                            }}
                          />
                        </div>
                      );
                    })}
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

          <div className="flex-1 flex flex-col justify-center min-h-0">

            <div className="text-center mb-1 sm:mb-2 md:mb-3">
              <h1
                className="font-black uppercase text-white text-sm sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl px-1 sm:px-2"
                style={{
                  textShadow: '#0006 2px 2px 4px',
                }}
              >
                {matchData.matchTitle}
              </h1>

              <div className="flex items-center justify-center mt-2 sm:mt-4">
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full px-2 sm:px-4 md:px-8 mb-1 sm:mb-2 md:mb-4">

              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className={getLogoShapeClass("relative w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 xl:w-26 xl:h-26 object-cover border-2 sm:border-3 md:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                  />
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block truncate"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative flex flex-col items-center">
                  <img
                    src="/images/background-poster/vs2.png"
                    alt="VS"
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain animate-pulse"
                  />
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="text-[8px] sm:text-[10px] md:text-xs font-semibold bg-black/50 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center whitespace-nowrap">
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
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className={getLogoShapeClass("relative w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 xl:w-26 xl:h-26 object-cover border-2 sm:border-3 md:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                  />
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block truncate"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>


          </div>

          {/* Bottom spacer để marquee không đè lên content */}
          <div className="h-3 sm:h-4 md:h-6 flex-shrink-0"></div>
        </div>

        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-3 sm:h-4 md:h-6 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-t-2 border-yellow-400 overflow-hidden z-20">
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs font-bold text-yellow-300 drop-shadow-lg"
              style={{
                animation: 'marquee 30s linear infinite'
              }}
            >
              {marquee.text}
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full opacity-60"
              style={{
                width: `${8 + Math.random() * 16}px`,
                height: `${8 + Math.random() * 16}px`,
                left: `${Math.random() * 100}%`,
                bottom: '-20px',
                animation: `floatUp ${8 + Math.random() * 12}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%) translateY(-50%); }
            100% { transform: translateX(-100%) translateY(-50%); }
          }
          @keyframes floatUp {
            0% {
              transform: translateY(0) translateX(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
              transform: scale(1);
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) scale(0);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
