import React, { useState, useEffect, useRef } from 'react';

const FootballMatchIntro = () => {
  // Khai báo các biến state lên đầu
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  
  // Match data state
  const [matchData, setMatchData] = useState({
    matchTitle: 'GIẢI BÓNG ĐÁ',
    subTitle: 'VÒNG CHUNG KẾT',
    team1: 'DOI-A',
    team2: 'DOI-B',
    logo1: '/api/placeholder/200/200',
    logo2: '/api/placeholder/200/200',
    stadium: 'SÂN VẬN ĐỘNG QUỐC GIA',
    liveText: 'KÊNH THỂ THAO',
    time: '19:30',
    date: '25/12/2024',
    skin: 'skin1',
    poster: 'poster1'
  });

  // Partners state
  const [partners, setPartners] = useState({
    sponsor: [],
    organizer: [],
    media: []
  });

  // Marquee state
  const [marqueeData, setMarqueeData] = useState({
    text: '',
    mode: 'none',
    interval: 0
  });

  const [isMarqueeRunning, setIsMarqueeRunning] = useState(false);
  const [currentMarqueeText, setCurrentMarqueeText] = useState('');
  const [lastMarqueeTime, setLastMarqueeTime] = useState(0);

  // Refs
  const marqueeRef = useRef(null);
  const socketRef = useRef(null);
  const starsContainerRef = useRef(null);
  const teamTextRef1 = useRef(null);
  const teamTextRef2 = useRef(null);

  // WebSocket connection với kiểm tra trạng thái
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Thay thế với URL WebSocket thực tế
        socketRef.current = new WebSocket('ws://103.216.112.171:5000');
        
        socketRef.current.onopen = () => {
          console.log("Socket đã kết nối thành công");
          setSocketConnected(true);
          setLastUpdateTime(Date.now());
        };

        socketRef.current.onclose = () => {
          console.log("Socket đã ngắt kết nối");
          setSocketConnected(false);
        };

        socketRef.current.onerror = (error) => {
          console.error("Lỗi socket:", error);
          setSocketConnected(false);
        };

        socketRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastUpdateTime(Date.now());
            
            // Xử lý các loại message từ socket
            switch(data.type) {
              case 'updateConfig':
                setMatchData(prev => ({ ...prev, ...data.config }));
                break;
              case 'updatePartners':
                setPartners(data.partners);
                break;
              case 'updateMarquee':
                setMarqueeData(data.marquee);
                break;
              case 'updateTeams':
                setMatchData(prev => ({
                  ...prev,
                  team1: data.team1 || prev.team1,
                  team2: data.team2 || prev.team2
                }));
                break;
              default:
                console.log("Nhận dữ liệu từ socket:", data);
            }
          } catch (error) {
            console.error("Lỗi parse dữ liệu socket:", error);
          }
        };

      } catch (error) {
        console.error("Lỗi kết nối socket:", error);
        setSocketConnected(false);
        
        // Simulate data cho demo khi không có socket
        simulateSocketData();
      }
    };

    const simulateSocketData = () => {
      console.log("Chạy mode demo - không có socket thực");
      
      // Simulate periodic updates
      setInterval(() => {
        if (Math.random() > 0.8) {
          setMatchData(prev => ({
            ...prev,
            team1: prev.team1 === 'DOI-A' ? 'ĐOÀN QUÂN' : 'DOI-A',
            team2: prev.team2 === 'DOI-B' ? 'CHIẾN BINH' : 'DOI-B'
          }));
        }
      }, 5000);

      // Simulate marquee
      setTimeout(() => {
        setMarqueeData({
          text: 'CHÀO MỪNG QUÝ KHÁN GIẢ ĐẾN VỚI TRẬN ĐẤU HÔM NAY',
          mode: 'continuous',
          interval: 0
        });
      }, 3000);
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

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

  // Render partners section
  const renderPartners = () => {
    const hasAnyPartners = partners.sponsor.length > 0 || 
                          partners.organizer.length > 0 || 
                          partners.media.length > 0;

    if (!hasAnyPartners) return null;

    return (
      <div className="flex justify-between mx-8 mt-10 mb-5">
        <div className="flex gap-8">
          {partners.sponsor.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white text-2xl font-bold mb-5">ĐƠN VỊ TÀI TRỢ</div>
              <div className="flex flex-wrap gap-4">
                {partners.sponsor.map((sponsor, idx) => (
                  <img key={idx} src={`/logo/${sponsor.logo}.png`} alt="Sponsor" 
                       className="w-20 h-20 rounded-full object-cover" />
                ))}
              </div>
            </div>
          )}
          
          {partners.organizer.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white text-2xl font-bold mb-5">ĐƠN VỊ TỔ CHỨC</div>
              <div className="flex flex-wrap gap-4">
                {partners.organizer.map((org, idx) => (
                  <img key={idx} src={`/logo/${org.logo}.png`} alt="Organizer" 
                       className="w-20 h-20 rounded-full object-cover" />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-8">
          {partners.media.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white text-2xl font-bold mb-5">TRUYỀN THÔNG</div>
              <div className="flex flex-wrap gap-4">
                {partners.media.map((media, idx) => (
                  <img key={idx} src={`/logo/${media.logo}.png`} alt="Media" 
                       className="w-20 h-20 rounded-full object-cover" />
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
      
      {/* Socket status indicator */}
      <div className="absolute top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded text-sm ${
          socketConnected ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {socketConnected ? '🟢 Socket OK' : '🔴 Socket Offline'}
        </div>
        <div className="text-xs text-gray-300 mt-1">
          Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
        </div>
      </div>
      
      {/* Stars container */}
      <div ref={starsContainerRef} className="fixed inset-0 pointer-events-none"></div>
      
      {/* Main poster wrapper - điều chỉnh để giống HTML */}
      <div className="absolute inset-0 w-full h-full max-w-screen-2xl max-h-screen mx-auto"
           style={{ aspectRatio: '16/9' }}>
        
        {/* Partners section */}
        {renderPartners()}
        
        {/* Match info section - điều chỉnh vị trí giống HTML */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center"
             style={{ top: '48%' }}>
          
          {/* Match title */}
          <div className="mb-8" style={{ marginTop: '-70px', marginBottom: '30px' }}>
            <h1 className="text-white font-bold mb-8 leading-tight"
                style={{ 
                  fontSize: '80px',
                  textShadow: '4px 4px #727272',
                  lineHeight: '1.2'
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
          
          {/* Divider - giống HTML */}
          <div className="flex items-center justify-center my-5 h-6">
            <div className="bg-white" style={{ width: '35%', height: '1%' }}></div>
            <div className="w-4 h-4 bg-white rounded-full mx-2"></div>
            <div className="bg-white" style={{ width: '35%', height: '1%' }}></div>
          </div>
          
          {/* Teams section - điều chỉnh margin giống HTML */}
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
                   style={{ height: '70%', width: 'auto' }} />
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
            
            {/* VS section */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <img src="/api/placeholder/200/200" alt="VS" 
                   className="w-auto"
                   style={{ height: '200px', marginTop: '55px' }} />
            </div>
            
            {/* Team 2 */}
            <div className="flex-1 flex flex-col items-center min-w-0">
              <img src={matchData.logo2} alt={matchData.team2} 
                   className="rounded-full bg-white object-cover mb-2"
                   style={{ height: '70%', width: 'auto' }} />
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
        
        {/* Time section - điều chỉnh vị trí giống HTML */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-50"
             style={{ bottom: '120px' }}>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 border-6 border-white rounded-full text-white font-bold"
               style={{
                 fontSize: '50px',
                 padding: '8px 40px 12px 40px',
                 boxShadow: '0 4px 20px rgba(24, 119, 242, 0.11)',
                 letterSpacing: '1px',
                 textShadow: '1px 2px 3px rgba(14, 48, 108, 0.13)'
               }}>
            {matchData.time} NGÀY {matchData.date}
          </div>
        </div>
        
        {/* Info bar - giống HTML */}
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