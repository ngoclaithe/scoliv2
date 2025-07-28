import React, { useState, useRef, useEffect } from 'react';

export default function DodenMatchIntro() {
  const [matchData, setMatchData] = useState({
    matchTitle: 'GIẢI VÔ ĐỊCH QUỐC GIA',
    team1: 'FIRE TIGERS',
    team2: 'BLACK EAGLES',
    logo1: '/images/background-poster/default_logoA.png',
    logo2: '/images/background-poster/default_logoB.png',
    stadium: 'SVĐ MỸ ĐÌNH',
    matchTime: '20:00',
    matchDate: new Date().toLocaleDateString('vi-VN')
  });

  const [sponsors, setSponsors] = useState({
    media: [], // Truyền thông - phải
    organizer: [], // Tổ chức - giữa  
    sponsor: [] // Tài trợ - trái
  });

  const [marquee, setMarquee] = useState({
    text: '',
    isRunning: false
  });

  const marqueeRef = useRef(null);
  const flamesRef = useRef([]);

  // Create flame particles effect
  useEffect(() => {
    const createFlame = () => {
      const flame = {
        id: Math.random(),
        x: Math.random() * 100,
        y: 100 + Math.random() * 20,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.5 ? '#ff4444' : '#ff8800'
      };
      return flame;
    };

    const updateFlames = () => {
      flamesRef.current = flamesRef.current.map(flame => ({
        ...flame,
        y: flame.y - flame.speed,
        opacity: flame.opacity * 0.95
      })).filter(flame => flame.y > -10 && flame.opacity > 0.1);

      // Add new flames randomly
      if (Math.random() < 0.15) {
        flamesRef.current.push(createFlame());
      }
    };

    const animationInterval = setInterval(updateFlames, 100);
    return () => clearInterval(animationInterval);
  }, []);

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

  // Flame component
  const FlameParticle = ({ flame }) => (
    <div
      key={flame.id}
      className="absolute pointer-events-none"
      style={{
        left: `${flame.x}%`,
        top: `${flame.y}%`,
        fontSize: `${flame.size}px`,
        opacity: flame.opacity,
        color: flame.color,
        animation: `flicker 0.5s ease-in-out infinite alternate`
      }}
    >
      🔥
    </div>
  );

  const renderSponsorSection = (sponsorList, title) => {
    if (sponsorList.length === 0) return null;
    
    return (
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        <h4 className="text-red-200 text-xs sm:text-sm font-semibold uppercase tracking-wide opacity-90">
          {title}
        </h4>
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
          {sponsorList.map((item, index) => (
            <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex justify-center items-center bg-white rounded-full p-1 shadow-lg border-2 border-red-500">
              <img
                src={item.logo}
                alt={item.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-2 sm:p-4">
      {/* Main container with fixed aspect ratio */}
      <div className="relative w-full max-w-7xl aspect-video bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-poster/bg3.jpg')"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-black/70 to-red-900/80"></div>
        </div>

        {/* Flame Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {flamesRef.current.map(flame => (
            <FlameParticle key={flame.id} flame={flame} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-6">
          
          {/* Sponsors Section - Top */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {/* Tài trợ - Trái */}
            <div className="flex justify-start">
              {renderSponsorSection(sponsors.sponsor, "Tài trợ")}
            </div>
            
            {/* Tổ chức - Giữa */}
            <div className="flex justify-center">
              {renderSponsorSection(sponsors.organizer, "Tổ chức")}
            </div>
            
            {/* Truyền thông - Phải */}
            <div className="flex justify-end">
              {renderSponsorSection(sponsors.media, "Truyền thông")}
            </div>
          </div>

          {/* Tournament Title */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 
              className="font-black uppercase"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(24px, 5vw, 80px)',
                textAlign: 'center',
                textShadow: '#dc2626 -2px -2px 0px, #dc2626 -2px 2px 0px, #dc2626 2px -2px 0px, #dc2626 2px 2px 0px, #000 4px 4px 8px',
                textTransform: 'uppercase'
              }}
            >
              {matchData.matchTitle}
            </h1>
          </div>

          {/* Match Section */}
          <div className="flex items-center justify-between w-full px-2 sm:px-8 mb-4 sm:mb-6">
            
            {/* Team 1 */}
            <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={matchData.logo1}
                  alt={matchData.team1}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-red-500 shadow-2xl transform hover:scale-110 transition duration-300"
                />
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-red-400/30 backdrop-blur-sm">
                <span 
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block"
                  ref={(el) => el && adjustFontSize(el)}
                >
                  {matchData.team1}
                </span>
              </div>
            </div>

            {/* VS Section */}
            <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-4 max-w-xs">
              <div className="relative flex flex-col items-center">
                <img
                  src="/images/background-poster/vs3.png"
                  alt="VS"
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse"
                />
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-black rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={matchData.logo2}
                  alt={matchData.team2}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-gray-500 shadow-2xl transform hover:scale-110 transition duration-300"
                />
              </div>
              <div className="bg-gradient-to-r from-gray-700 to-black px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-gray-400/30 backdrop-blur-sm">
                <span 
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white text-center block"
                  ref={(el) => el && adjustFontSize(el)}
                >
                  {matchData.team2}
                </span>
              </div>
            </div>
          </div>

          {/* Date, Time, Stadium Info */}
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center rounded-3xl border-solid shadow-lg text-center uppercase font-bold tracking-wider"
              style={{
                alignItems: 'center',
                backgroundColor: '#dc2626',
                borderColor: '#fff',
                borderRadius: '25px',
                borderStyle: 'solid',
                borderWidth: '4px',
                boxShadow: '#dc262680 0px 4px 20px 0px',
                color: '#fff',
                display: 'flex',
                fontSize: 'clamp(12px, 3vw, 50px)',
                justifyContent: 'center',
                letterSpacing: '1px',
                padding: '8px 20px 12px',
                textAlign: 'center',
                textShadow: '#7f1d1d 1px 2px 3px',
                textTransform: 'uppercase'
              }}
            >
              <span className="mx-2">📅 {matchData.matchDate}</span>
              <span className="mx-2">•</span>
              <span className="mx-2">⏰ {matchData.matchTime}</span>
              <span className="mx-2">•</span>
              <span className="mx-2">📍 {matchData.stadium}</span>
            </div>
          </div>

        </div>

        {/* Marquee */}
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

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%) translateY(-50%); }
            100% { transform: translateX(-100%) translateY(-50%); }
          }
          
          @keyframes flicker {
            0% { opacity: 0.8; transform: scale(1) rotate(-2deg); }
            100% { opacity: 1; transform: scale(1.1) rotate(2deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
