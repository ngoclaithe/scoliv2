import React, { useState, useEffect, useRef } from 'react';

const FootballMatchIntro = ({ accessCode }) => {
  // Mock data - replace with actual context later
  const contextMatchData = {
    teamA: { name: 'ĐỘI-A', logo: '/images/background-poster/default_logoA.png' },
    teamB: { name: 'ĐỘI-B', logo: '/images/background-poster/default_logoB.png' },
    stadium: 'SÂN VẬN ĐỘNG QUỐC GIA',
    liveText: 'KÊNH THỂ THAO'
  };

  const marqueeData = {
    mode: 'none',
    text: '',
    interval: 5
  };

  const sponsors = {
    main: [],
    secondary: [],
    media: []
  };

  const socketConnected = false;

  // Transform context data to poster format
  const [matchData, setMatchData] = useState({
    matchTitle: 'GIẢI BÓNG ĐÁ',
    subTitle: 'VÒNG CHUNG KẾT',
    team1: contextMatchData.teamA.name || 'ĐỘI-A',
    team2: contextMatchData.teamB.name || 'ĐỘI-B',
    logo1: contextMatchData.teamA.logo || '/images/background-poster/default_logoA.png',
    logo2: contextMatchData.teamB.logo || '/images/background-poster/default_logoB.png',
    stadium: contextMatchData.stadium || 'SÂN VẬN ĐỘNG QUỐC GIA',
    liveText: contextMatchData.liveText || 'KÊNH THỂ THAO',
    time: '19:30',
    date: new Date().toLocaleDateString('vi-VN'),
    skin: 'skin1',
    poster: 'poster1'
  });

  // Partners state - transform sponsors to partners format
  const [partners, setPartners] = useState({
    sponsor: sponsors.main || [],
    organizer: sponsors.secondary || [],
    media: sponsors.media || []
  });

  const [isMarqueeRunning, setIsMarqueeRunning] = useState(false);
  const [currentMarqueeText, setCurrentMarqueeText] = useState('');
  const [lastMarqueeTime, setLastMarqueeTime] = useState(0);

  // Refs
  const marqueeRef = useRef(null);
  const starsContainerRef = useRef(null);
  const teamTextRef1 = useRef(null);
  const teamTextRef2 = useRef(null);

  // Sync context data with local state
  useEffect(() => {
    setMatchData(prev => ({
      ...prev,
      team1: contextMatchData.teamA.name || 'ĐỘI-A',
      team2: contextMatchData.teamB.name || 'ĐỘI-B',
      logo1: contextMatchData.teamA.logo || '/api/placeholder/200/200',
      logo2: contextMatchData.teamB.logo || '/api/placeholder/200/200',
      stadium: contextMatchData.stadium || 'SÂN VẬN ĐỘNG QUỐC GIA',
      liveText: contextMatchData.liveText || 'KÊNH THỂ THAO'
    }));
  }, [contextMatchData]);

  // Sync sponsors data
  useEffect(() => {
    setPartners({
      sponsor: sponsors.main || [],
      organizer: sponsors.secondary || [],
      media: sponsors.media || []
    });
  }, [sponsors]);

  // Socket connection status
  useEffect(() => {
    console.log(`Poster-tretrung: Socket status: ${socketConnected ? 'Connected' : 'Disconnected'}`);
    console.log(`Access code: ${accessCode}`);
  }, [socketConnected, accessCode]);

  // Stars animation effect
  useEffect(() => {
    const spawnStar = () => {
      if (!starsContainerRef.current) return;

      const star = document.createElement('div');
      star.className = 'absolute w-12 h-12 opacity-100 pointer-events-none z-50';
      
      star.innerHTML = `
        <svg viewBox="0 0 24 24" fill="white" class="w-full h-full">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
      
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;

      const duration = 10 + Math.random() * 20;
      star.style.transition = `all ${duration}s linear`;
      star.style.transform = 'translateY(0)';

      setTimeout(() => {
        star.style.opacity = '0';
        star.style.transform = 'translateY(100vh)';
      }, 100);

      setTimeout(() => {
        star.remove();
      }, duration * 1000);

      starsContainerRef.current.appendChild(star);
    };

    const starInterval = setInterval(spawnStar, 200);
    return () => clearInterval(starInterval);
  }, []);

  // Marquee animation
  useEffect(() => {
    if (marqueeData.mode === 'none' || !marqueeData.text) {
      setIsMarqueeRunning(false);
      setCurrentMarqueeText('');
      return;
    }

    if (marqueeData.mode === 'continuous') {
      if (marqueeData.text !== currentMarqueeText) {
        setCurrentMarqueeText(marqueeData.text);
        setIsMarqueeRunning(true);
      }
    } else if (marqueeData.mode === 'interval') {
      const currentTime = Date.now();
      const interval = marqueeData.interval * 60 * 1000;
      
      if (marqueeData.text !== currentMarqueeText || 
          (!isMarqueeRunning && currentTime - lastMarqueeTime >= interval)) {
        setCurrentMarqueeText(marqueeData.text);
        setLastMarqueeTime(currentTime);
        setIsMarqueeRunning(true);
        
        // Stop after one cycle for interval mode
        setTimeout(() => {
          setIsMarqueeRunning(false);
        }, 20000);
      }
    }
  }, [marqueeData, currentMarqueeText, isMarqueeRunning, lastMarqueeTime]);

  // Auto-adjust font size for team names
  const adjustFontSize = (element) => {
    if (!element) return;
    
    let fontSize = 60;
    element.style.fontSize = `${fontSize}px`;
    
    while (element.scrollWidth > element.offsetWidth && fontSize > 20) {
      fontSize--;
      element.style.fontSize = `${fontSize}px`;
    }
  };

  useEffect(() => {
    adjustFontSize(teamTextRef1.current);
    adjustFontSize(teamTextRef2.current);
  }, [matchData.team1, matchData.team2]);

  // Render partners section - Vị trí bên dưới thời gian và địa điểm
  const renderPartners = () => {
    const hasAnyPartners = partners.sponsor.length > 0 ||
                          partners.organizer.length > 0 ||
                          partners.media.length > 0;

    if (!hasAnyPartners) return null;

    return (
      <div className="grid grid-cols-3 gap-4 mx-8 mt-6 mb-4">
        {/* Tài trợ - Trái */}
        <div className="flex justify-start">
          {partners.sponsor.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white text-lg font-bold mb-3 uppercase tracking-wide opacity-80">
                Tài trợ
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {partners.sponsor.map((sponsor, idx) => (
                  <img key={idx} src={`/logo/${sponsor.logo}.png`} alt="Sponsor"
                       className="w-12 h-12 rounded-full object-cover bg-white p-1 shadow-lg" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Truy���n thông - Giữa */}
        <div className="flex justify-center">
          {partners.media.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white text-lg font-bold mb-3 uppercase tracking-wide opacity-80">
                Truyền thông
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {partners.media.map((media, idx) => (
                  <img key={idx} src={`/logo/${media.logo}.png`} alt="Media"
                       className="w-12 h-12 rounded-full object-cover bg-white p-1 shadow-lg" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tổ chức - Phải */}
        <div className="flex justify-end">
          {partners.organizer.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white text-lg font-bold mb-3 uppercase tracking-wide opacity-80">
                Tổ chức
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {partners.organizer.map((org, idx) => (
                  <img key={idx} src={`/logo/${org.logo}.png`} alt="Organizer"
                       className="w-12 h-12 rounded-full object-cover bg-white p-1 shadow-lg" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat text-white overflow-hidden uppercase font-bold"
         style={{ backgroundImage: "url('/images/background-poster/bg1.jpg')" }}>
      
      {/* Stars container */}
      <div ref={starsContainerRef} className="fixed inset-0 pointer-events-none"></div>
      
      {/* Main poster wrapper */}
      <div className="absolute inset-0 w-full h-full max-w-screen-2xl max-h-screen mx-auto"
           style={{ aspectRatio: '16/9' }}>
        

        
        {/* Match info section */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center"
             style={{ top: '48%' }}>
          
          {/* Match title with updated style */}
          <div className="mb-8" style={{ marginTop: '-70px', marginBottom: '30px' }}>
            <h1 
              className="font-bold mb-8 leading-tight"
              style={{ 
                color: '#fff',
                fontSize: '80px',
                lineHeight: '96px',
                textAlign: 'center',
                textShadow: '#727272 4px 4px 0px',
                textTransform: 'uppercase'
              }}>
              {matchData.matchTitle}
            </h1>
            {matchData.subTitle && (
              <h2 className="text-yellow-300 font-bold whitespace-nowrap"
                  style={{ 
                    fontSize: '50px',
                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.4)' 
                  }}>
                {matchData.subTitle}
              </h2>
            )}
          </div>
          
          {/* Teams section */}
          <div className="flex justify-between items-start mx-auto"
               style={{ 
                 marginTop: '6%',
                 marginLeft: '240px',
                 marginRight: '240px'
               }}>
            {/* Team 1 */}
            <div className="flex-1 flex flex-col items-center min-w-0">
              <img src={matchData.logo1} alt={matchData.team1} 
                   className="rounded-full bg-white object-cover mb-2"
                   style={{ height: '180px', width: '180px' }} />
              <div ref={teamTextRef1}
                   className="text-white font-bold px-8 py-2 whitespace-nowrap w-fit"
                   style={{ 
                     fontSize: '60px',
                     textShadow: '4px 4px #727272',
                     minWidth: '35%'
                   }}>
                {matchData.team1}
              </div>
            </div>
            
            {/* VS section with vs3.png */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <img src="/images/background-poster/vs3.png" alt="VS" 
                   className="w-auto object-contain"
                   style={{ height: '200px', marginTop: '55px' }} />
            </div>
            
            {/* Team 2 */}
            <div className="flex-1 flex flex-col items-center min-w-0">
              <img src={matchData.logo2} alt={matchData.team2} 
                   className="rounded-full bg-white object-cover mb-2"
                   style={{ height: '180px', width: '180px' }} />
              <div ref={teamTextRef2}
                   className="text-white font-bold px-8 py-2 whitespace-nowrap w-fit"
                   style={{ 
                     fontSize: '60px',
                     textShadow: '4px 4px #727272',
                     minWidth: '35%'
                   }}>
                {matchData.team2}
              </div>
            </div>
          </div>
        </div>
        
        {/* Time section with updated style */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-50"
             style={{ bottom: '200px' }}>
          <div
            className="border-solid text-white font-bold flex items-center justify-center text-center uppercase"
            style={{
              alignItems: 'center',
              backgroundImage: 'linear-gradient(to right, rgb(255, 49, 49), rgb(255, 145, 77))',
              borderColor: '#fff',
              borderRadius: '45px',
              borderStyle: 'solid',
              borderWidth: '5.33333px',
              boxShadow: '#1877f21c 0px 4px 20px 0px',
              color: '#fff',
              display: 'flex',
              fontSize: '50px',
              justifyContent: 'center',
              letterSpacing: '1px',
              padding: '8px 40px 12px',
              textAlign: 'center',
              textShadow: '#0e306c22 1px 2px 3px',
              textTransform: 'uppercase'
            }}>
            {matchData.time} NGÀY {matchData.date}
          </div>
        </div>

        {/* Partners section - moved below time and location */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full z-40"
             style={{ bottom: '100px' }}>
          {renderPartners()}
        </div>
        
        {/* Info bar */}
        {matchData.stadium && (
          <div className="absolute bottom-0 left-0 w-full bg-transparent flex justify-center items-center py-1 z-10"
               style={{ gap: '300px', padding: '5px 0' }}>
            <div className="flex items-center text-white font-bold"
                 style={{ fontSize: '50px' }}>
              <img src="/api/placeholder/60/60" alt="Stadium" 
                   className="w-auto px-5"
                   style={{ height: '60px' }} />
              {matchData.stadium}
            </div>
            <div className="flex items-center text-white font-bold"
                 style={{ fontSize: '50px' }}>
              <img src="/api/placeholder/70/70" alt="Live" 
                   className="w-auto px-5"
                   style={{ height: '70px' }} />
              LIVESTREAM TRỰC TIẾP
              {matchData.liveText && `: ${matchData.liveText}`}
            </div>
          </div>
        )}
      </div>
      
      {/* Marquee */}
      {isMarqueeRunning && currentMarqueeText && (
        <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-30 text-white overflow-hidden z-50 whitespace-nowrap"
             style={{ height: '3vw' }}>
          <div ref={marqueeRef} 
               className="absolute bottom-1 left-0 whitespace-nowrap font-bold"
               style={{
                 fontSize: '2.3vw',
                 animation: marqueeData.mode === 'continuous' 
                   ? 'marquee 20s linear infinite' 
                   : 'marquee 20s linear 1'
               }}>
            {currentMarqueeText}
          </div>
        </div>
      )}
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes fallFade {
          0% { opacity: 1; transform: translateY(0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default FootballMatchIntro;
