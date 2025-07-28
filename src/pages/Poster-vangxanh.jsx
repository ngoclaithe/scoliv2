import React, { useState, useRef, useEffect } from 'react';

export default function MatchIntroduction() {
  const [matchData, setMatchData] = useState({
    matchTitle: 'TRỰC TIẾP TRẬN BÓNG ĐÁ',
    team1: 'TEAM ALPHA',
    team2: 'TEAM BETA',
    logo1: '/images/background-poster/default_logoA.png',
    logo2: '/images/background-poster/default_logoB.png',
    stadium: 'SVĐ THỐNG NHẤT',
    matchTime: '15:30',
    matchDate: new Date().toLocaleDateString('vi-VN')
  });

  const [sponsors, setSponsors] = useState({
    media: [], // Đơn vị truyền thông - trái
    organizer: [], // Đơn vị tổ chức - giữa  
    sponsor: [] // Đơn vị tài trợ - phải
  });

  const [marquee, setMarquee] = useState({
    text: '',
    isRunning: false
  });

  const marqueeRef = useRef(null);
  const starsRef = useRef([]);

  // Create falling stars effect
  useEffect(() => {
    const createStar = () => {
      const star = {
        id: Math.random(),
        x: Math.random() * 100,
        y: -5,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2
      };
      return star;
    };

    const updateStars = () => {
      starsRef.current = starsRef.current.map(star => ({
        ...star,
        y: star.y + star.speed
      })).filter(star => star.y < 105);

      // Add new stars randomly
      if (Math.random() < 0.3) {
        starsRef.current.push(createStar());
      }
    };

    const animationInterval = setInterval(updateStars, 100);
    return () => clearInterval(animationInterval);
  }, []);

  // Font size adjustment function
  const adjustFontSize = (element) => {
    if (!element) return;
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);
    const minFontSize = 14;
    
    while (element.scrollWidth > element.offsetWidth && fontSize > minFontSize) {
      fontSize -= 1;
      element.style.fontSize = fontSize + "px";
    }
  };

  // Star component
  const FallingStar = ({ star }) => (
    <div
      key={star.id}
      className="absolute text-yellow-300 pointer-events-none"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        fontSize: `${star.size}px`,
        opacity: star.opacity,
        animation: `twinkle 2s ease-in-out infinite`
      }}
    >
      ★
    </div>
  );

  const renderSponsorSection = (sponsorList, title) => {
    if (sponsorList.length === 0) return null;
    
    return (
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        <h4 className="text-white text-xs sm:text-sm font-semibold uppercase tracking-wide opacity-80">
          {title}
        </h4>
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
          {sponsorList.map((item, index) => (
            <div key={index} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex justify-center items-center bg-white rounded-full p-1 shadow-lg">
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
            backgroundImage: "url('/images/background-poster/bg5.jpg')"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Falling Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {starsRef.current.map(star => (
            <FallingStar key={star.id} star={star} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3 sm:p-6">
          
          {/* Top Sponsors Section */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {/* Đơn vị truyền thông - Trái */}
            <div className="flex justify-start">
              {renderSponsorSection(sponsors.media, "Truyền thông")}
            </div>
            
            {/* Đơn vị tổ chức - Giữa */}
            <div className="flex justify-center">
              {renderSponsorSection(sponsors.organizer, "Tổ chức")}
            </div>
            
            {/* Đơn vị tài trợ - Phải */}
            <div className="flex justify-end">
              {renderSponsorSection(sponsors.sponsor, "Tài trợ")}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Tournament Title */}
            <div className="text-center mb-4 sm:mb-8">
              <h1 
                className="font-black uppercase"
                style={{
                  color: '#3e90ff',
                  fontSize: 'clamp(24px, 5vw, 80px)',
                  textAlign: 'center',
                  textShadow: '#fff -3px -3px 0px',
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
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo1}
                    alt={matchData.team1}
                    className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img
                    src={matchData.logo2}
                    alt={matchData.team2}
                    className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full object-cover border-2 sm:border-4 border-white shadow-2xl transform hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
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
                  backgroundColor: '#3e90ff',
                  borderColor: '#fff',
                  borderRadius: '25px',
                  borderStyle: 'solid',
                  borderWidth: '5.33333px',
                  boxShadow: '#1877f21c 0px 4px 20px 0px',
                  color: '#fff',
                  display: 'flex',
                  fontSize: 'clamp(12px, 3vw, 60px)',
                  justifyContent: 'center',
                  letterSpacing: '1px',
                  padding: '8px 20px 12px',
                  textAlign: 'center',
                  textShadow: '#0e306c22 1px 2px 3px',
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
        </div>

        {/* Marquee - Hidden by default, will show when socket updates */}
        {marquee.isRunning && marquee.text && (
          <div className="absolute bottom-0 left-0 w-full h-8 sm:h-12 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 border-t-2 border-yellow-400 overflow-hidden">
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
          
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}