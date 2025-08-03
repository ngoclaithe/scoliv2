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
    tournamentLogo: getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || null,
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
  console.log("Giá trị của tournament_logo là:", matchData.tournamentLogo);
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
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg4.jpg')"
          }}
        >
        </div>

        <div className="relative z-10 h-full flex flex-col" style={{ fontSize: 'clamp(8px, 1.5vw, 24px)' }}>

          {/* Top Section - Tournament Logo & Live Unit */}
          <div className="flex justify-between items-start px-[1vw] py-[0.5vw]">

            <div className={`flex ${getTournamentPositionClass()} flex-1`}>
              {matchData.showTournamentLogo && matchData.tournamentLogo && (
                <img
                  src={matchData.tournamentLogo.tournament_lgo.url_logo}
                  alt="Tournament Logo"
                  className="object-contain"
                  style={{ height: '4vw', maxWidth: '15vw' }}
                />
              )}
            </div>

            {matchData.liveUnit && (
              <div className="bg-red-600 text-white rounded-lg shadow-lg flex items-center" style={{ padding: '0.3vw 0.8vw', gap: '0.3vw' }}>
                <div className="bg-white rounded-full animate-pulse" style={{ width: '0.5vw', height: '0.5vw' }}></div>
                <img
                  src={matchData.liveUnit}
                  alt="Live Unit"
                  className="object-contain"
                  style={{ height: '1.5vw' }}
                />
              </div>
            )}
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col justify-center px-[2vw]">

            {/* Title */}
            <div className="text-center" style={{ marginBottom: '1.5vw' }}>
              <h1
                className="font-black uppercase text-white"
                style={{
                  fontSize: '2.5vw',
                  textShadow: '#d97706 2px 2px 4px',
                  marginBottom: '0.8vw'
                }}
              >
                {matchData.matchTitle}
              </h1>

              <div className="flex items-center justify-center">
                <div className="bg-white" style={{ width: '4vw', height: '2px' }}></div>
                <div className="bg-yellow-400 rounded-full" style={{ width: '0.5vw', height: '0.5vw', margin: '0 0.5vw' }}></div>
                <div className="bg-amber-500 rounded-full" style={{ width: '0.5vw', height: '0.5vw', margin: '0 0.5vw' }}></div>
                <div className="bg-orange-500 rounded-full" style={{ width: '0.5vw', height: '0.5vw', margin: '0 0.5vw' }}></div>
                <div className="bg-white" style={{ width: '4vw', height: '2px' }}></div>
              </div>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-between w-full" style={{ marginBottom: '1.5vw' }}>

              <div className="flex-1 flex flex-col items-center max-w-[30%]" style={{ gap: '0.8vw' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className={getLogoShapeClass("relative object-cover border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                    style={{
                      width: '6vw',
                      height: '6vw',
                      borderWidth: '0.15vw'
                    }}
                  />
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2" style={{ padding: '0.3vw 0.8vw' }}>
                  <span
                    className="font-bold uppercase tracking-wide text-white text-center block truncate"
                    style={{ fontSize: '0.9vw' }}
                    ref={(el) => el && adjustFontSize(el)}
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
                  style={{ width: '4vw', height: '4vw' }}
                />
              </div>

              <div className="flex-1 flex flex-col items-center max-w-[30%]" style={{ gap: '0.8vw' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className={getLogoShapeClass("relative object-cover border-white shadow-2xl transform hover:scale-110 transition duration-300")}
                    style={{
                      width: '6vw',
                      height: '6vw',
                      borderWidth: '0.15vw'
                    }}
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl shadow-lg border border-white/30 backdrop-blur-sm w-1/2" style={{ padding: '0.3vw 0.8vw' }}>
                  <span
                    className="font-bold uppercase tracking-wide text-white text-center block truncate"
                    style={{ fontSize: '0.9vw' }}
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>

            {/* Date & Stadium */}
            <div className="text-center" style={{ marginBottom: '1.5vw' }}>
              <div className="inline-block bg-black/50 backdrop-blur-sm rounded-xl border border-white/30" style={{ padding: '0.5vw 1.5vw' }}>
                <div className="flex items-center justify-center" style={{ gap: '1vw' }}>
                  {(matchData.showTimer || matchData.showDate) && (
                    <span className="font-semibold text-white whitespace-nowrap" style={{ fontSize: '1vw' }}>
                      {matchData.showTimer && matchData.roundedTime}{matchData.showTimer && matchData.showDate && ' - '}{matchData.showDate && matchData.currentDate}
                    </span>
                  )}
                  {(matchData.showTimer || matchData.showDate) && matchData.showStadium && matchData.stadium && (
                    <div className="bg-white/50" style={{ width: '1px', height: '1.5vw' }}></div>
                  )}
                  {matchData.showStadium && matchData.stadium && (
                    <span className="font-semibold text-white flex items-center" style={{ fontSize: '1vw' }}>
                      📍 {matchData.stadium}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {allPartners.length > 0 && (
            <div className="px-[2vw]" style={{ paddingBottom: '1.5vw' }}>
              <div className="text-center">
                <div style={{ marginBottom: '1vw' }}> {/* tăng khoảng cách trên một chút */}
                  <span
                    className="font-bold text-white bg-black/50 backdrop-blur-sm rounded-lg border border-white/30"
                    style={{ fontSize: '1.6vw', padding: '0.4vw 1.6vw' }} // gấp đôi
                  >
                    Các đơn vị
                  </span>
                </div>
                <div
                  className="flex justify-center items-center flex-wrap"
                  style={{ gap: '1vw' }} // gấp đôi
                >
                  {allPartners.map((partner, index) => (
                    <div
                      key={index}
                      className={getPartnerLogoShapeClass(
                        "flex justify-center items-center bg-white shadow-lg",
                        partner.typeDisplay
                      )}
                      style={{
                        width: '3vw',  // gấp đôi
                        height: '3vw', // gấp đôi
                        padding: '0.2vw' // gấp đôi
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

        <style jsx>{`
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