import React, { useRef } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../utils/logoUtils';

export default function VangKimMatchIntro() {
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
    matchTitle: contextMatchData.matchTitle || 'CÚP VÀNG CHAMPION',
    team1: contextMatchData.teamA.name || 'GOLDEN LIONS',
    team2: contextMatchData.teamB.name || 'SILVER WOLVES',
    logo1: getFullLogoUrl(contextMatchData.teamA.logo) || '/images/background-poster/default_logoA.png',
    logo2: getFullLogoUrl(contextMatchData.teamB.logo) || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ HÀNG ĐÀY',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '15:00',
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
    accentColor: posterSettings?.accentColor || '#f59e0b'
  };
  console.log("Giá trị của tournament_logos là:", matchData.tournamentLogos);
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

  const allPartners = [...sponsorLogos, ...organizingLogos, ...mediaPartnerLogos];

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
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-1 sm:p-2 md:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg4.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col p-1 sm:p-3 md:p-6">

          {/* Top Section - Tournament Logos and Live Unit */}
          <div className="flex justify-between items-start mb-2 sm:mb-4 md:mb-6 min-h-[6vh] sm:min-h-[8vh]">

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

            {/* Live Unit */}
            {matchData.liveUnit && (
              <div className="bg-red-600 text-white px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg shadow-lg flex items-center space-x-1 sm:space-x-2">
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                <img
                  src={matchData.liveUnit}
                  alt="Live Unit"
                  className="h-3 sm:h-4 md:h-5 object-contain"
                />
              </div>
            )}
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col justify-center min-h-0">

            {/* Title */}
            <div className="text-center mb-3 sm:mb-4 md:mb-6">
              <h1
                className="font-black uppercase text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-2 mb-2 sm:mb-4"
                style={{
                  textShadow: '#d97706 2px 2px 4px'
                }}
              >
                {matchData.matchTitle}
              </h1>

              <div className="flex items-center justify-center mt-2 sm:mt-4">
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
              </div>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between w-full px-2 sm:px-4 md:px-8 mb-3 sm:mb-4 md:mb-6">

              <div className="flex-1 flex flex-col items-center max-w-[30%]" style={{ gap: 'clamp(4px, 0.8vw, 16px)' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className={getLogoShapeClass("relative object-cover border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                    style={{
                      width: 'clamp(40px, 6vw, 120px)',
                      height: 'clamp(40px, 6vw, 120px)',
                      borderWidth: 'clamp(1px, 0.15vw, 3px)'
                    }}
                  />
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2 max-w-[80%]" style={{ padding: 'clamp(2px, 0.3vw, 6px) clamp(4px, 0.8vw, 16px)' }}>
                  <span
                    className="font-bold uppercase tracking-wide text-white text-center block"
                    style={{
                      fontSize: 'clamp(8px, 0.9vw, 18px)',
                      lineHeight: '1.2',
                      wordBreak: 'break-word'
                    }}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center max-w-[35%]">
                <img
                  src="/images/background-poster/vs5.png"
                  alt="VS"
                  className="object-contain animate-pulse"
                  style={{ width: 'clamp(30px, 4vw, 80px)', height: 'clamp(30px, 4vw, 80px)' }}
                />
              </div>

              <div className="flex-1 flex flex-col items-center max-w-[30%]" style={{ gap: 'clamp(4px, 0.8vw, 16px)' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className={getLogoShapeClass("relative object-cover border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                    style={{
                      width: 'clamp(40px, 6vw, 120px)',
                      height: 'clamp(40px, 6vw, 120px)',
                      borderWidth: 'clamp(1px, 0.15vw, 3px)'
                    }}
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2 max-w-[80%]" style={{ padding: 'clamp(2px, 0.3vw, 6px) clamp(4px, 0.8vw, 16px)' }}>
                  <span
                    className="font-bold uppercase tracking-wide text-white text-center block"
                    style={{
                      fontSize: 'clamp(8px, 0.9vw, 18px)',
                      lineHeight: '1.2',
                      wordBreak: 'break-word'
                    }}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

            {/* Date & Stadium */}
            <div className="text-center">
              <div className="inline-block bg-black/50 backdrop-blur-sm rounded-xl border border-white/30" style={{ padding: 'clamp(4px, 0.5vw, 10px) clamp(8px, 1.5vw, 30px)' }}>
                <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 'clamp(2px, 1vw, 20px)' }}>
                  {(matchData.showTimer || matchData.showDate) && (
                    <span className="font-semibold text-white whitespace-nowrap" style={{ fontSize: 'clamp(8px, 1vw, 20px)' }}>
                      {matchData.showTimer && matchData.roundedTime}{matchData.showTimer && matchData.showDate && ' - '}{matchData.showDate && matchData.currentDate}
                    </span>
                  )}
                  {(matchData.showTimer || matchData.showDate) && matchData.showStadium && matchData.stadium && (
                    <div className="bg-white/50 hidden sm:block" style={{ width: '1px', height: 'clamp(12px, 1.5vw, 30px)' }}></div>
                  )}
                  {matchData.showStadium && matchData.stadium && (
                    <span className="font-semibold text-white flex items-center" style={{ fontSize: 'clamp(8px, 1vw, 20px)' }}>
                      📍 {matchData.stadium}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {allPartners.length > 0 && (
            <div className="px-[2vw]" style={{ paddingBottom: 'clamp(12px, 2vw, 40px)', paddingTop: 'clamp(4px, 0.5vw, 10px)' }}>
              <div className="text-center">
                <div style={{ marginBottom: 'clamp(4px, 1vw, 20px)' }}>
                  <span
                    className="font-bold text-white bg-black/50 backdrop-blur-sm rounded-lg border border-white/30"
                    style={{ fontSize: 'clamp(10px, 1.6vw, 32px)', padding: 'clamp(2px, 0.4vw, 8px) clamp(8px, 1.6vw, 32px)' }}
                  >
                    Các đơn vị
                  </span>
                </div>
                <div
                  className="flex justify-center items-center flex-wrap"
                  style={{ gap: 'clamp(4px, 1vw, 20px)' }}
                >
                  {allPartners.map((partner, index) => (
                    <div
                      key={index}
                      className={getPartnerLogoShapeClass(
                        "flex justify-center items-center bg-white shadow-lg",
                        partner.typeDisplay
                      )}
                      style={{
                        width: 'clamp(20px, 4vw, 80px)',
                        height: 'clamp(20px, 4vw, 80px)',
                        padding: 'clamp(1px, 0.3vw, 6px)'
                      }}
                    >
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-yellow-900 via-amber-900 to-orange-900 border-t-2 border-yellow-400 overflow-hidden z-20" style={{ height: '4vw' }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap font-bold text-yellow-300 drop-shadow-lg"
              style={{
                fontSize: '1.5vw',
                animation: 'marquee 30s linear infinite'
              }}
            >
              {marquee.text}
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-yellow-300 to-amber-400 opacity-80"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderRadius: '50%',
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%) translateY(-50%); }
            100% { transform: translateX(-100%) translateY(-50%); }
          }
          @keyframes sparkle {
            0%, 100% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: scale(1) rotate(180deg);
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
