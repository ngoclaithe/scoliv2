import React, { useState, useRef, useEffect } from 'react';
import { usePublicMatch } from '../contexts/PublicMatchContext';

export default function DodenMatchIntro() {
  const { matchData: contextMatchData, marqueeData, logoData } = usePublicMatch();
  

  const matchData = {
    matchTitle: contextMatchData.tournament || 'GIẢI VÔ ĐỊCH QUỐC GIA',
    team1: contextMatchData.teamA.name || 'FIRE TIGERS',
    team2: contextMatchData.teamB.name || 'BLACK EAGLES',
    logo1: contextMatchData.teamA.logo || '/images/background-poster/default_logoA.png',
    logo2: contextMatchData.teamB.logo || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SVĐ MỸ ĐÌNH',
    roundedTime: contextMatchData.startTime || contextMatchData.time || '20:00',
    currentDate: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN')
  };

  const [partners, setPartners] = useState([]);


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

  const hasPartners = partners.length > 0;

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">

      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
        

        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg3.jpg')"
          }}
        >

        </div>


        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-6">
          

          <div className="flex-1 flex flex-col justify-center">
            

            <div className="text-center mb-3 sm:mb-6">
              <h1 
                className="font-black uppercase text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                style={{
                  textShadow: '#dc2626 2px 2px 4px',
                }}
              >
                {matchData.matchTitle}
              </h1>
              

              <div className="flex items-center justify-center mt-2 sm:mt-4">
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full mx-1 sm:mx-2"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mx-1 sm:mx-2"></div>
                <div className="w-12 sm:w-24 h-0.5 bg-white"></div>
              </div>
            </div>


            <div className="flex items-center justify-between w-full px-2 sm:px-8">


              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="bg-gradient-to-r from-red-600 to-red-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team1}
                  </span>
                </div>
              </div>


              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-4 max-w-xs">
                <div className="relative flex flex-col items-center">
                  <img
                    src="/images/background-poster/vs3.png"
                    alt="VS"
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse"
                  />
                </div>

                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-red-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold animate-pulse shadow-lg text-white">
                      LIVE
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold bg-black/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg backdrop-blur-sm text-white text-center">
                    {matchData.roundedTime} - {matchData.currentDate}
                  </div>
                </div>
              </div>


              <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-black rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="bg-gradient-to-r from-gray-700 to-black px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block"
                    ref={(el) => el && adjustFontSize(el)}
                  >
                    {matchData.team2}
                  </span>
                </div>
              </div>
            </div>


            {matchData.stadium && (
              <div className="text-center mt-3 sm:mt-4">
                <div className="inline-block bg-black/50 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-white/30">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">
                    📍 {matchData.stadium}
                  </span>
                </div>
              </div>
            )}

            {(logoData.sponsor.length > 0 || logoData.organizer.length > 0 || logoData.media.length > 0 || logoData.tournament.length > 0) && (
              <div className="text-center mt-3 sm:mt-4">
                <h3 className="text-red-400 text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 uppercase tracking-wide">
                  🤝 Đơn vị đồng hành
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-4 border border-white/30 mx-4 sm:mx-8">
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {[...logoData.sponsor, ...logoData.organizer, ...logoData.media, ...logoData.tournament].map((logo, index) => (
                      <div key={index} className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex justify-center items-center bg-white rounded-full p-1 shadow-lg">
                        <img
                          src={logo.url}
                          alt={logo.unitName || logo.name}
                          className="max-h-full max-w-full object-contain rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-12 bg-gradient-to-r from-red-900 via-black to-red-900 border-t-2 border-red-500 overflow-hidden">
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap text-sm sm:text-lg font-bold text-red-300 drop-shadow-lg"
              style={{
                animation: 'marquee 30s linear infinite'
              }}
            >
              {marquee.text}
            </div>
          </div>
        )}


        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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
              transform: scale(1.5) rotate(180deg);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
