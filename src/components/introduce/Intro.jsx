import React, { useState, useEffect } from 'react';

const FootballMatchPoster = () => {
  // Sample data - in real app this would be props
  const [matchData, setMatchData] = useState({
    matchTitle: "GIẢI BÓNG ĐÁ PHONG TRÀO",
    stadium: "Sân vận động Thiên Trường",
    time: "19:30",
    date: "15/12/2024",
    team1: "ĐỘI A",
    team2: "ĐỘI B",
    logo1: "https://via.placeholder.com/200x200/ff0000/ffffff?text=A",
    logo2: "https://via.placeholder.com/200x200/0000ff/ffffff?text=B",
    liveText: "FACEBOOK LIVE",
    showMarquee: false,
    marqueeText: ""
  });

  const [posterScale, setPosterScale] = useState(1);
  const [logoScale, setLogoScale] = useState(1);

  // Auto-adjust scales based on window size
  useEffect(() => {
    const adjustScales = () => {
      const windowWidth = window.innerWidth;
      
      // Poster scale adjustment
      const originalPosterWidth = 1000;
      const targetPosterWidth = 0.6 * windowWidth;
      const newPosterScale = Math.min(targetPosterWidth / originalPosterWidth, 1);
      setPosterScale(newPosterScale);

      // Logo scale for mobile responsiveness
      const newLogoScale = windowWidth < 768 ? 0.7 : 1;
      setLogoScale(newLogoScale);
    };

    adjustScales();
    window.addEventListener('resize', adjustScales);
    
    return () => window.removeEventListener('resize', adjustScales);
  }, []);

  // Check if live text contains specific keywords
  const liveTextLower = matchData.liveText.toLowerCase();
  const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
  const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
  const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
      {/* Top left logos */}
      {showNSBLogo && (
        <div className="fixed top-8 left-8 z-50">
          <div className="w-32 h-16 bg-red-600 rounded flex items-center justify-center text-white font-bold">
            NSB
          </div>
        </div>
      )}
      
      {showBDPXTLogo && (
        <div className="fixed top-8 left-8 z-50">
          <div className="w-32 h-16 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            BDPXT
          </div>
        </div>
      )}

      {/* Main poster */}
      <div 
        className="relative bg-gradient-to-br from-blue-800/70 to-green-700/70 rounded-3xl p-8 text-white text-center shadow-2xl"
        style={{ 
          width: '1000px', 
          height: '620px',
          transform: `scale(${posterScale})`,
          transformOrigin: 'center'
        }}
      >
        {/* Title */}
        <h1 className="text-5xl font-bold text-yellow-400 mt-8 drop-shadow-lg">
          {matchData.matchTitle}
        </h1>
        
        {/* Subtitle with time and venue */}
        <div className="text-3xl mt-2 drop-shadow-md">
          {matchData.time} - {matchData.date}
          {matchData.stadium && matchData.stadium !== 'san' && (
            <span> | Địa điểm: {matchData.stadium}</span>
          )}
        </div>

        {/* Match section */}
        <div className="flex items-center justify-center mt-8 space-x-4">
          {/* Team 1 */}
          <div className="flex-1 flex flex-direction-column items-center">
            <div className="relative">
              <img 
                src={matchData.logo1} 
                alt={matchData.team1}
                className="w-48 h-48 rounded-full bg-white p-2 object-cover animate-spin"
                style={{ 
                  animation: 'spin 4s linear infinite',
                  transform: `scale(${logoScale})`
                }}
              />
            </div>
            <div 
              className="bg-black/50 px-4 py-2 rounded-lg mt-6 text-2xl font-bold"
              style={{ width: '240px' }}
            >
              {matchData.team1}
            </div>
          </div>

          {/* VS */}
          <div className="flex-shrink-0">
            <div className="text-8xl font-bold text-yellow-400 drop-shadow-lg px-8">
              VS
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex flex-direction-column items-center">
            <div className="relative">
              <img 
                src={matchData.logo2} 
                alt={matchData.team2}
                className="w-48 h-48 rounded-full bg-white p-2 object-cover animate-spin"
                style={{ 
                  animation: 'spin 4s linear infinite reverse',
                  transform: `scale(${logoScale})`
                }}
              />
            </div>
            <div 
              className="bg-black/50 px-4 py-2 rounded-lg mt-6 text-2xl font-bold"
              style={{ width: '240px' }}
            >
              {matchData.team2}
            </div>
          </div>
        </div>

        {/* Live stream info */}
        <div className="bg-orange-500 text-white px-6 py-2 inline-block mt-6 text-2xl font-bold rounded">
          LIVESTREAM TRỰC TIẾP
          {matchData.liveText && `: ${matchData.liveText}`}
        </div>
      </div>

      {/* Bottom left SCO logo */}
      {showSCOLogo && (
        <div className="fixed bottom-12 left-12 z-50">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            SCO
          </div>
        </div>
      )}

      {/* Marquee (if enabled) */}
      {matchData.showMarquee && matchData.marqueeText && (
        <div className="fixed bottom-0 left-0 w-full h-12 bg-black/30 text-white flex items-center overflow-hidden z-50">
          <div className="animate-marquee whitespace-nowrap text-2xl font-bold">
            {matchData.marqueeText}
          </div>
        </div>
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>

      {/* Control Panel for Demo */}
      <div className="fixed top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg text-black max-w-xs">
        <h3 className="font-bold mb-2">Demo Controls:</h3>
        
        <div className="mb-2">
          <label className="block text-sm">Match Title:</label>
          <input 
            className="w-full p-1 border rounded text-sm"
            value={matchData.matchTitle}
            onChange={(e) => setMatchData({...matchData, matchTitle: e.target.value})}
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm">Team 1:</label>
          <input 
            className="w-full p-1 border rounded text-sm"
            value={matchData.team1}
            onChange={(e) => setMatchData({...matchData, team1: e.target.value})}
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm">Team 2:</label>
          <input 
            className="w-full p-1 border rounded text-sm"
            value={matchData.team2}
            onChange={(e) => setMatchData({...matchData, team2: e.target.value})}
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm">Live Text:</label>
          <input 
            className="w-full p-1 border rounded text-sm"
            value={matchData.liveText}
            onChange={(e) => setMatchData({...matchData, liveText: e.target.value})}
            placeholder="NSB, BDPXT, or other"
          />
        </div>
        
        <div className="mb-2">
          <label className="block text-sm">Stadium:</label>
          <input 
            className="w-full p-1 border rounded text-sm"
            value={matchData.stadium}
            onChange={(e) => setMatchData({...matchData, stadium: e.target.value})}
          />
        </div>

        <div className="mb-2">
          <label className="flex items-center text-sm">
            <input 
              type="checkbox"
              checked={matchData.showMarquee}
              onChange={(e) => setMatchData({...matchData, showMarquee: e.target.checked})}
              className="mr-2"
            />
            Show Marquee
          </label>
        </div>

        {matchData.showMarquee && (
          <div className="mb-2">
            <label className="block text-sm">Marquee Text:</label>
            <input 
              className="w-full p-1 border rounded text-sm"
              value={matchData.marqueeText}
              onChange={(e) => setMatchData({...matchData, marqueeText: e.target.value})}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballMatchPoster;