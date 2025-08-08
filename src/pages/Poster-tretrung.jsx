import React, { useRef } from 'react';
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
    logoShape: displaySettings?.logoShape || 'circle',
    showTournamentLogo: displaySettings?.showTournamentLogo !== false,
    showSponsors: displaySettings?.showSponsors !== false,
    showOrganizing: displaySettings?.showOrganizing !== false,
    showMediaPartners: displaySettings?.showMediaPartners !== false,
    showTimer: posterSettings?.showTimer !== false,
    showDate: posterSettings?.showDate !== false,
    showStadium: posterSettings?.showStadium !== false,
    showLiveIndicator: posterSettings?.showLiveIndicator !== false,
    accentColor: posterSettings?.accentColor || '#10b981'
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
            backgroundImage: "url('/images/background-poster/bg1.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-3 sm:p-6">

          {/* Top section với fixed height để tránh overlap */}
          <div className="flex justify-between items-start mb-2 sm:mb-4 md:mb-6 min-h-[12vh] sm:min-h-[14vh] md:min-h-[16vh]">

            {/* Tournament Logos */}
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

              <div className="flex gap-2 sm:gap-4">
                {hasSponsors && (
                  <div className="flex-shrink-0">
                    <div className="text-xs font-bold text-green-400 mb-1 drop-shadow-lg">
                      Nhà tài trợ
                    </div>
                    <div className="flex gap-1 flex-wrap max-w-[15vw]">
                      {sponsorLogos.map((sponsor, index) => (
                        <div key={index} className={getPartnerLogoShapeClass("flex justify-center items-center bg-white p-0.5 shadow-lg", sponsor.typeDisplay)} style={{width: '2.5vw', height: '2.5vw', minWidth: '20px', minHeight: '20px', maxWidth: '35px', maxHeight: '35px'}}>
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasOrganizing && (
                  <div className="flex-shrink-0">
                    <div className="text-xs font-bold text-blue-400 mb-1 drop-shadow-lg">
                      Đơn vị tổ chức
                    </div>
                    <div className="flex gap-1 flex-wrap max-w-[15vw]">
                      {organizingLogos.map((organizing, index) => (
                        <div key={index} className={getPartnerLogoShapeClass("flex justify-center items-center bg-white p-0.5 shadow-lg", organizing.typeDisplay)} style={{width: '2.5vw', height: '2.5vw', minWidth: '20px', minHeight: '20px', maxWidth: '35px', maxHeight: '35px'}}>
                          <img
                            src={organizing.logo}
                            alt={organizing.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                {hasMediaPartners && (
                  <div className="flex-shrink-0">
                    <div className="text-xs font-bold text-purple-400 mb-1 drop-shadow-lg text-right">
                      Đơn vị truyền thông
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[15vw]">
                      {mediaPartnerLogos.map((media, index) => (
                        <div key={index} className={getPartnerLogoShapeClass("flex justify-center items-center bg-white p-0.5 shadow-lg", media.typeDisplay)} style={{width: '2.5vw', height: '2.5vw', minWidth: '20px', minHeight: '20px', maxWidth: '35px', maxHeight: '35px'}}>
                          <img
                            src={media.logo}
                            alt={media.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
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

          {/* Main content section với proper spacing */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* Title section với margin để tránh overlap */}
            <div className="text-center mb-2 sm:mb-3 md:mb-4">
              <h1
                className="font-black uppercase text-white text-sm sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl px-1 sm:px-2"
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

            {/* Teams section với responsive spacing */}
            <div className="flex items-center justify-between w-full px-2 sm:px-4 md:px-8 mb-3 sm:mb-4 md:mb-6">

              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className={getLogoShapeClass("relative w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 xl:w-26 xl:h-26 object-cover border-2 sm:border-3 md:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                  />
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2">
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
                    src="/images/background-poster/vs3.png"
                    alt="VS"
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain animate-pulse"
                  />
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  {(matchData.showTimer || matchData.showDate) && (
                    <div className="text-xs sm:text-sm font-semibold bg-black/50 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center whitespace-nowrap">
                      {matchData.showTimer && matchData.roundedTime}{matchData.showTimer && matchData.showDate && ' - '}{matchData.showDate && matchData.currentDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2 md:space-y-3 max-w-[30%]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className={getLogoShapeClass("relative w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 xl:w-26 xl:h-26 object-cover border-2 sm:border-3 md:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                  />
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg md:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block truncate"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom section với proper spacing để tránh overlap */}
            <div className="space-y-2 sm:space-y-3">
              {matchData.showStadium && matchData.stadium && (
                <div className="text-center">
                  <div className="inline-block bg-black/50 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-white/30">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">
                      📍 {matchData.stadium}
                    </span>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Bottom spacer để marquee không đè lên content */}
          <div className="h-8 sm:h-12 flex-shrink-0"></div>
        </div>

        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-12 bg-gradient-to-r from-green-900 via-emerald-900 to-green-900 border-t-2 border-green-400 overflow-hidden z-20">
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-base font-bold text-green-300 drop-shadow-lg"
              style={{
                animation: 'marquee 30s linear infinite'
              }}
            >
              {marquee.text}
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
          @keyframes marquee {
            0% { transform: translateX(100%) translateY(-50%); }
            100% { transform: translateX(-100%) translateY(-50%); }
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
        `}</style>
      </div>
    </div>
  );
}
