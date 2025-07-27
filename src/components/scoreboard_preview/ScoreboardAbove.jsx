import React, { useState, useEffect } from 'react';

const TopScoreboard = () => {
  // Sample data - in real app this would be props
  const [scoreboardData, setScoreboardData] = useState({
    team1: "HÀ NỘI FC",
    team2: "HCM CITY",
    score1: "2",
    score2: "1",
    timer: "45'",
    color1: "#ff0000",
    color2: "#0000ff",
    live: "FACEBOOK LIVE",
    showMarquee: false,
    marqueeText: "",
    partnerPositions: {
      leftUp: [],
      leftDown: [],
      rightDown: []
    }
  });

  const [scoreboardScale, setScoreboardScale] = useState(1);

  // Auto-adjust scale based on window size
  useEffect(() => {
    const adjustScale = () => {
      const windowWidth = window.innerWidth;
      const baseWidth = 700;
      const targetWidth = 0.42 * windowWidth; // 42% of screen width
      const newScale = Math.min(targetWidth / baseWidth, 1);
      setScoreboardScale(newScale);
    };

    adjustScale();
    window.addEventListener('resize', adjustScale);
    
    return () => window.removeEventListener('resize', adjustScale);
  }, []);

  // Adjust font size based on content length
  const adjustFontSize = (text, minSize = 20, maxSize = 35) => {
    const baseLength = 8; // Base character length
    const ratio = Math.max(0.6, Math.min(1, baseLength / text.length));
    return Math.max(minSize, Math.min(maxSize, maxSize * ratio));
  };

  // Check if live text contains specific keywords
  const liveTextLower = scoreboardData.live.toLowerCase();
  const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
  const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
  const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top left logos */}
      {showNSBLogo && (
        <div className="fixed top-8 left-8 z-50 pointer-events-auto" style={{ height: '8vw', width: 'auto' }}>
          <div className="h-full bg-red-600 rounded flex items-center justify-center text-white font-bold px-4">
            NSB
          </div>
        </div>
      )}
      
      {showBDPXTLogo && (
        <div className="fixed top-8 left-8 z-50 pointer-events-auto" style={{ height: '8vw', width: 'auto' }}>
          <div className="h-full bg-blue-600 rounded flex items-center justify-center text-white font-bold px-4">
            BDPXT
          </div>
        </div>
      )}

      {/* Main Scoreboard */}
      <div className="fixed top-8 right-8 z-40 flex flex-col items-end pointer-events-auto">
        <div 
          className="flex flex-col items-center"
          style={{ 
            transform: `scale(${scoreboardScale})`,
            transformOrigin: 'top right'
          }}
        >
          {/* Scoreboard Container */}
          <div className="flex items-center h-14 text-white rounded-lg overflow-hidden shadow-lg">
            {/* Team 1 Score */}
            <div className="w-11 h-14 bg-yellow-400 text-blue-900 flex items-center justify-center text-4xl font-bold">
              {scoreboardData.score1}
            </div>
            
            {/* Team 1 */}
            <div className="w-48 h-14 bg-blue-900 relative flex items-center justify-center pb-2">
              <div 
                className="text-white font-bold uppercase whitespace-nowrap z-10 leading-none"
                style={{ fontSize: `${adjustFontSize(scoreboardData.team1)}px` }}
              >
                {scoreboardData.team1}
              </div>
              <div 
                className="absolute bottom-0 left-0 w-full h-1.5"
                style={{ backgroundColor: scoreboardData.color1 }}
              ></div>
            </div>
            
            {/* Timer */}
            <div className="w-24 h-14 bg-gray-800 text-white flex items-center justify-center text-3xl font-bold relative">
              <div className="z-10">{scoreboardData.timer}</div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-green-500"></div>
            </div>
            
            {/* Team 2 */}
            <div className="w-48 h-14 bg-blue-900 relative flex items-center justify-center pb-2">
              <div 
                className="text-white font-bold uppercase whitespace-nowrap z-10 leading-none"
                style={{ fontSize: `${adjustFontSize(scoreboardData.team2)}px` }}
              >
                {scoreboardData.team2}
              </div>
              <div 
                className="absolute bottom-0 left-0 w-full h-1.5"
                style={{ backgroundColor: scoreboardData.color2 }}
              ></div>
            </div>
            
            {/* Team 2 Score */}
            <div className="w-11 h-14 bg-yellow-400 text-blue-900 flex items-center justify-center text-4xl font-bold">
              {scoreboardData.score2}
            </div>
          </div>
          
          {/* SCO Logo below scoreboard */}
          {showSCOLogo && (
            <div className="mt-2 bg-transparent p-2">
              <div className="w-16 h-8 bg-gray-700 rounded flex items-center justify-center text-white font-bold text-sm">
                SCO
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partner Positions */}
      <div className="fixed top-8 left-8 z-40 flex gap-2 pointer-events-auto">
        {scoreboardData.partnerPositions.leftUp.map((partner, index) => (
          <div key={index} className="flex items-center gap-1 text-white text-2xl">
            <img src={partner.image} alt={partner.name} className="w-12 h-12 rounded-full" style={{ height: '4vw', width: 'auto' }} />
            <span>{partner.name}</span>
          </div>
        ))}
      </div>
      
      <div 
        className={`fixed left-8 z-40 flex gap-2 pointer-events-auto transition-all duration-300 ${
          scoreboardData.showMarquee ? 'bottom-14' : 'bottom-8'
        }`}
      >
        {scoreboardData.partnerPositions.leftDown.map((partner, index) => (
          <div key={index} className="flex items-center gap-1 text-white text-2xl">
            <img src={partner.image} alt={partner.name} className="w-12 h-12 rounded-full" style={{ height: '4vw', width: 'auto' }} />
            <span>{partner.name}</span>
          </div>
        ))}
      </div>
      
      <div 
        className={`fixed right-8 z-40 flex gap-2 pointer-events-auto transition-all duration-300 ${
          scoreboardData.showMarquee ? 'bottom-14' : 'bottom-8'
        }`}
      >
        {scoreboardData.partnerPositions.rightDown.map((partner, index) => (
          <div key={index} className="flex items-center gap-1 text-white text-2xl">
            <img src={partner.image} alt={partner.name} className="w-12 h-12 rounded-full" style={{ height: '4vw', width: 'auto' }} />
            <span>{partner.name}</span>
          </div>
        ))}
      </div>

      {/* Marquee (if enabled) */}
      {scoreboardData.showMarquee && scoreboardData.marqueeText && (
        <div className="fixed bottom-0 left-0 w-full bg-black/30 text-white flex items-center overflow-hidden z-50" style={{ height: '3vw' }}>
          <div className="animate-marquee whitespace-nowrap font-bold" style={{ fontSize: '2.4vw', paddingBottom: '0.2vw' }}>
            {scoreboardData.marqueeText}
          </div>
        </div>
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(8%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>

      {/* Control Panel for Demo */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/95 p-4 rounded-lg shadow-lg text-black max-w-4xl pointer-events-auto">
        <h3 className="font-bold mb-4 text-center">Scoreboard Demo Controls</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team 1:</label>
            <input 
              className="w-full p-2 border rounded text-sm"
              value={scoreboardData.team1}
              onChange={(e) => setScoreboardData({...scoreboardData, team1: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Score 1:</label>
            <input 
              className="w-full p-2 border rounded text-sm"
              value={scoreboardData.score1}
              onChange={(e) => setScoreboardData({...scoreboardData, score1: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Team 2:</label>
            <input 
              className="w-full p-2 border rounded text-sm"
              value={scoreboardData.team2}
              onChange={(e) => setScoreboardData({...scoreboardData, team2: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Score 2:</label>
            <input 
              className="w-full p-2 border rounded text-sm"
              value={scoreboardData.score2}
              onChange={(e) => setScoreboardData({...scoreboardData, score2: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Timer:</label>
            <input 
              className="w-full p-2 border rounded text-sm"
              value={scoreboardData.timer}
              onChange={(e) => setScoreboardData({...scoreboardData, timer: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Team 1 Color:</label>
            <input 
              type="color"
              className="w-full p-1 border rounded"
              value={scoreboardData.color1}
              onChange={(e) => setScoreboardData({...scoreboardData, color1: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Team 2 Color:</label>
            <input 
              type="color"
              className="w-full p-1 border rounded"
              value={scoreboardData.color2}
              onChange={(e) => setScoreboardData({...scoreboardData, color2: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Live Text:</label>
            <input 
              className="w-full p-2 border rounded text-sm"
              value={scoreboardData.live}
              onChange={(e) => setScoreboardData({...scoreboardData, live: e.target.value})}
              placeholder="NSB, BDPXT, or other"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center text-sm">
            <input 
              type="checkbox"
              checked={scoreboardData.showMarquee}
              onChange={(e) => setScoreboardData({...scoreboardData, showMarquee: e.target.checked})}
              className="mr-2"
            />
            Show Marquee
          </label>

          {scoreboardData.showMarquee && (
            <div className="flex-1">
              <input 
                className="w-full p-2 border rounded text-sm"
                placeholder="Marquee text..."
                value={scoreboardData.marqueeText}
                onChange={(e) => setScoreboardData({...scoreboardData, marqueeText: e.target.value})}
              />
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-600 text-center">
          Scoreboard automatically scales to 42% of screen width • Partner positions available for sponsor logos
        </div>
      </div>
    </div>
  );
};

export default TopScoreboard;