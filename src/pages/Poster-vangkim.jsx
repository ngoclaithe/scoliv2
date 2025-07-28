import React, { useState, useRef, useEffect } from 'react';

export default function VangKimMatchIntro() {
  const [matchData, setMatchData] = useState({
    matchTitle: 'CÚP VÀNG CHAMPION',
    team1: 'GOLDEN LIONS',
    team2: 'SILVER WOLVES',
    logo1: '/images/background-poster/default_logoA.png',
    logo2: '/images/background-poster/default_logoB.png',
    stadium: 'SVĐ HÀNG ĐÀY',
    matchTime: '15:00',
    matchDate: new Date().toLocaleDateString('vi-VN')
  });

  const [sponsors, setSponsors] = useState({
    media: [], // Truyền thông - trái
    organizer: [], // Tổ chức - phải  
    sponsor: [] // Tài trợ - giữa
  });

  const [marquee, setMarquee] = useState({
    text: '',
    isRunning: false
  });

  const marqueeRef = useRef(null);
  const goldParticlesRef = useRef([]);

  // Create golden particles effect
  useEffect(() => {
    const createGoldParticle = () => {
      const particle = {
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        floatSpeed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * 360
      };
      return particle;
    };

    const updateGoldParticles = () => {
      goldParticlesRef.current = goldParticlesRef.current.map(particle => ({
        ...particle,
        y: particle.y - particle.floatSpeed * 0.1,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.2,
        rotation: particle.rotation + 1,
        opacity: particle.opacity * 0.998
      })).filter(particle => particle.opacity > 0.1);

      // Add new particles randomly
      if (Math.random() < 0.1) {
        goldParticlesRef.current.push(createGoldParticle());
      }
    };

    const animationInterval = setInterval(updateGoldParticles, 100);
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

  // Gold particle component
  const GoldParticle = ({ particle }) => (
    <div
      key={particle.id}
      className="absolute text-yellow-400 pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        fontSize: `${particle.size}px`,
        opacity: particle.opacity,
        transform: `rotate(${particle.rotation}deg)`,
        animation: `goldShimmer 3s ease-in-out infinite`
      }}
    >
      ✨
    </div>
  );

  const renderSponsorSection = (sponsorList, title) => {
    if (sponsorList.length === 0) return null;
    
    return (
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        <h4 className="text-yellow-200 text-xs sm:text-sm font-semibold uppercase tracking-wide opacity-90">
          {title}
        </h4>
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
          {sponsorList.map((item, index) => (
            <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex justify-center items-center bg-white rounded-full p-1 shadow-lg border-2 border-yellow-400">
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
            backgroundImage: "url('/images/background-poster/bg4.jpg')"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/70 via-yellow-800/60 to-amber-900/80"></div>
        </div>

        {/* Gold Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {goldParticlesRef.current.map(particle => (
            <GoldParticle key={particle.id} particle={particle} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-6">
          
          {/* Tournament Title */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 
              className="font-black uppercase"
              style={{
                color: '#fbbf24',
                fontSize: 'clamp(24px, 5vw, 80px)',
                textAlign: 'center',
                textShadow: '#92400e -3px -3px 0px, #92400e -3px 3px 0px, #92400e 3px -3px 0px, #92400e 3px 3px 0px, #000 4px 4px 8px',
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
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={matchData.logo1}
                  alt={matchData.team1}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-yellow-400 shadow-2xl transform hover:scale-110 transition duration-300"
                />
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-yellow-300/30 backdrop-blur-sm">
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
                  src="/images/background-poster/vs5.png"
                  alt="VS"
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain animate-pulse"
                />
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={matchData.logo2}
                  alt={matchData.team2}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-gray-400 shadow-2xl transform hover:scale-110 transition duration-300"
                />
              </div>
              <div className="bg-gradient-to-r from-gray-500 to-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-gray-300/30 backdrop-blur-sm">
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
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-3xl border-solid shadow-lg text-center uppercase font-bold tracking-wider"
              style={{
                alignItems: 'center',
                backgroundColor: '#d97706',
                borderColor: '#fff',
                borderRadius: '25px',
                borderStyle: 'solid',
                borderWidth: '4px',
                boxShadow: '#d9770680 0px 4px 20px 0px',
                color: '#fff',
                display: 'flex',
                fontSize: 'clamp(12px, 3vw, 50px)',
                justifyContent: 'center',
                letterSpacing: '1px',
                padding: '8px 20px 12px',
                textAlign: 'center',
                textShadow: '#92400e 1px 2px 3px',
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

          {/* Sponsors Section - Below time and location */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {/* Truyền thông - Trái */}
            <div className="flex justify-start">
              {renderSponsorSection(sponsors.media, "Truyền thông")}
            </div>
            
            {/* Tài trợ - Giữa */}
            <div className="flex justify-center">
              {renderSponsorSection(sponsors.sponsor, "Tài trợ")}
            </div>
            
            {/* Tổ chức - Phải */}
            <div className="flex justify-end">
              {renderSponsorSection(sponsors.organizer, "Tổ chức")}
            </div>
          </div>

        </div>

        {/* Marquee */}
        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-12 bg-gradient-to-r from-yellow-900 via-amber-800 to-yellow-900 border-t-2 border-yellow-400 overflow-hidden">
            <div className="absolute inset-0 bg-black/50"></div>
            <div
              ref={marqueeRef}
              className="absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap text-sm sm:text-lg font-bold text-yellow-300 drop-shadow-lg"
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
          
          @keyframes goldShimmer {
            0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
