import React, { useState, useEffect } from 'react';

const ScoreboardBelow = ({
  accessCode,
  onTeamUpdate,
  onScoreUpdate,
  onLogoUpdate,
  template = 1
}) => {
  // State cho scoreboard data
  const [scoreboardData, setScoreboardData] = useState({
    team1: "ĐỘI A",
    team2: "ĐỘI B", 
    score1: 0,
    score2: 0,
    logo1: null,
    logo2: null,
    timer: "00:00",
    period: "Chưa bắt đầu",
    color1: "#ff0000",
    color2: "#0000ff",
    live: "FACEBOOK LIVE",
    showMarquee: false,
    marqueeText: "",
    penaltyMode: false,
    penaltyScore1: 0,
    penaltyScore2: 0,
    showPenaltyAnimation: false,
    lastPenaltyTeam: null
  });

  const [scoreboardScale, setScoreboardScale] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [logoUploadMode, setLogoUploadMode] = useState(null); // 'team1' or 'team2'

  // Template styles based on provided images
  const getTemplateStyles = (templateId) => {
    switch (templateId) {
      case 1: // Classic Navy - Template 1
        return {
          background: 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900',
          border: 'border-yellow-400',
          scoreBackground: 'bg-white',
          scoreText: 'text-blue-900',
          timerBackground: 'bg-blue-900',
          timerText: 'text-white',
          teamBackground: 'bg-blue-900',
          teamText: 'text-white',
          team1Background: 'bg-blue-900',
          team2Background: 'bg-blue-900',
          headerBackground: 'bg-yellow-400',
          headerText: 'text-blue-900'
        };
      case 2: // Blue Red - Template 2
        return {
          background: 'bg-gradient-to-r from-blue-600 via-blue-500 to-red-600',
          border: 'border-yellow-500',
          scoreBackground: 'bg-white',
          scoreText: 'text-blue-900',
          timerBackground: 'bg-gray-700',
          timerText: 'text-white',
          teamBackground: 'bg-blue-600',
          teamText: 'text-white',
          team1Background: 'bg-blue-600',
          team2Background: 'bg-red-600',
          headerBackground: 'bg-yellow-500',
          headerText: 'text-blue-900'
        };
      case 3: // Teal Modern - Template 3
        return {
          background: 'bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500',
          border: 'border-white',
          scoreBackground: 'bg-red-600',
          scoreText: 'text-white',
          timerBackground: 'bg-teal-600',
          timerText: 'text-white',
          teamBackground: 'bg-teal-500',
          teamText: 'text-white',
          team1Background: 'bg-teal-500',
          team2Background: 'bg-teal-500',
          headerBackground: 'bg-teal-400',
          headerText: 'text-white'
        };
      case 4: // Red Orange - Template 4
        return {
          background: 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500',
          border: 'border-yellow-300',
          scoreBackground: 'bg-blue-900',
          scoreText: 'text-white',
          timerBackground: 'bg-yellow-500',
          timerText: 'text-blue-900',
          teamBackground: 'bg-red-500',
          teamText: 'text-white',
          team1Background: 'bg-red-500',
          team2Background: 'bg-red-500',
          headerBackground: 'bg-yellow-500',
          headerText: 'text-blue-900'
        };
      default:
        return {
          background: 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900',
          border: 'border-yellow-400',
          scoreBackground: 'bg-white',
          scoreText: 'text-blue-900',
          timerBackground: 'bg-blue-900',
          timerText: 'text-white',
          teamBackground: 'bg-blue-900',
          teamText: 'text-white',
          team1Background: 'bg-blue-900',
          team2Background: 'bg-blue-900',
          headerBackground: 'bg-yellow-400',
          headerText: 'text-blue-900'
        };
    }
  };

  const templateStyles = getTemplateStyles(template);

  // Auto-adjust scale based on window size
  useEffect(() => {
    const adjustScale = () => {
      const windowWidth = window.innerWidth;
      const baseWidth = 800;
      const targetWidth = 0.5 * windowWidth; // 50% of screen width for bottom scoreboard
      const newScale = Math.min(targetWidth / baseWidth, 1.2);
      setScoreboardScale(newScale);
    };

    adjustScale();
    window.addEventListener('resize', adjustScale);
    
    return () => window.removeEventListener('resize', adjustScale);
  }, []);

  // Penalty animation effect
  useEffect(() => {
    if (scoreboardData.showPenaltyAnimation) {
      const timer = setTimeout(() => {
        setScoreboardData(prev => ({
          ...prev,
          showPenaltyAnimation: false,
          lastPenaltyTeam: null
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scoreboardData.showPenaltyAnimation]);

  // Adjust font size based on content length
  const adjustFontSize = (text, minSize = 18, maxSize = 32) => {
    const baseLength = 8;
    const ratio = Math.max(0.5, Math.min(1, baseLength / text.length));
    return Math.max(minSize, Math.min(maxSize, maxSize * ratio));
  };

  // Handle score updates
  const handleScoreUpdate = (team, increment) => {
    setScoreboardData(prev => {
      const newData = { ...prev };
      if (team === 'team1') {
        newData.score1 = Math.max(0, prev.score1 + increment);
      } else {
        newData.score2 = Math.max(0, prev.score2 + increment);
      }
      return newData;
    });
    
    if (onScoreUpdate) {
      onScoreUpdate(team, scoreboardData[team === 'team1' ? 'score1' : 'score2']);
    }
  };

  // Handle penalty score updates
  const handlePenaltyUpdate = (team, increment) => {
    setScoreboardData(prev => {
      const newData = { 
        ...prev,
        showPenaltyAnimation: increment > 0,
        lastPenaltyTeam: increment > 0 ? team : null
      };
      if (team === 'team1') {
        newData.penaltyScore1 = Math.max(0, prev.penaltyScore1 + increment);
      } else {
        newData.penaltyScore2 = Math.max(0, prev.penaltyScore2 + increment);
      }
      return newData;
    });
  };

  // Handle team name updates
  const handleTeamNameUpdate = (team, newName) => {
    setScoreboardData(prev => ({
      ...prev,
      [team]: newName
    }));
    
    if (onTeamUpdate) {
      onTeamUpdate(team, newName);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (team, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        setScoreboardData(prev => ({
          ...prev,
          [team === 'team1' ? 'logo1' : 'logo2']: logoUrl
        }));
        
        if (onLogoUpdate) {
          onLogoUpdate(team, logoUrl);
        }
      };
      reader.readAsDataURL(file);
    }
    setLogoUploadMode(null);
  };

  // Check live text for special logos
  const liveTextLower = scoreboardData.live.toLowerCase();
  const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
  const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
  const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Main Scoreboard - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
        <div 
          className="flex flex-col items-center"
          style={{ 
            transform: `scale(${scoreboardScale})`,
            transformOrigin: 'bottom center'
          }}
        >
          {/* Scoreboard Container */}
          <div className="relative">
            {/* Penalty Animation Overlay */}
            {scoreboardData.showPenaltyAnimation && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-3xl font-bold animate-bounce shadow-2xl border-4 border-yellow-600">
                  ⚽ GOAL! ⚽
                </div>
              </div>
            )}

            {/* Main Scoreboard */}
            <div className={`flex items-center ${templateStyles.background} rounded-xl overflow-hidden shadow-2xl border-4 ${templateStyles.border}`}>
              {/* Team 1 Section */}
              <div className="flex items-center">
                {/* Team 1 Logo */}
                <div
                  className={`w-16 h-16 ${templateStyles.teamBackground} flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 group`}
                  onClick={() => setLogoUploadMode('team1')}
                >
                  {scoreboardData.logo1 ? (
                    <img 
                      src={scoreboardData.logo1} 
                      alt={scoreboardData.team1}
                      className="w-12 h-12 object-contain rounded-full border-2 border-white/30"
                    />
                  ) : (
                    <div className="text-white/60 text-xs text-center group-hover:text-white/80">
                      📷<br/>LOGO
                    </div>
                  )}
                </div>

                {/* Team 1 Name */}
                <div className={`w-40 px-4 py-2 relative ${templateStyles.team1Background}`}>
                  {editMode ? (
                    <input
                      type="text"
                      value={scoreboardData.team1}
                      onChange={(e) => handleTeamNameUpdate('team1', e.target.value)}
                      className={`w-full bg-transparent ${templateStyles.teamText} font-bold text-center border-b-2 border-white/50 focus:border-white outline-none`}
                      style={{ fontSize: `${adjustFontSize(scoreboardData.team1)}px` }}
                    />
                  ) : (
                    <div
                      className={`${templateStyles.teamText} font-bold text-center cursor-pointer hover:text-yellow-300 transition-colors`}
                      style={{ fontSize: `${adjustFontSize(scoreboardData.team1)}px` }}
                      onClick={() => setEditMode(true)}
                    >
                      {scoreboardData.team1}
                    </div>
                  )}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-1"
                    style={{ backgroundColor: scoreboardData.color1 }}
                  ></div>
                </div>

                {/* Team 1 Score */}
                <div className={`w-20 h-16 ${templateStyles.scoreBackground} ${templateStyles.scoreText} flex flex-col items-center justify-center font-bold border-r-2 border-white/20`}>
                  <div className="text-4xl leading-none">{scoreboardData.score1}</div>
                  {scoreboardData.penaltyMode && (
                    <div className="text-xs leading-none text-blue-700">
                      P: {scoreboardData.penaltyScore1}
                    </div>
                  )}
                </div>
              </div>

              {/* Center Section - Timer & Period */}
              <div className={`w-32 h-16 ${templateStyles.timerBackground} ${templateStyles.timerText} flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className="text-2xl font-bold leading-none z-10">{scoreboardData.timer}</div>
                <div className="text-xs font-medium z-10">{scoreboardData.period}</div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
                
                {/* Live indicator */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>

              {/* Team 2 Section */}
              <div className="flex items-center">
                {/* Team 2 Score */}
                <div className={`w-20 h-16 ${templateStyles.scoreBackground} ${templateStyles.scoreText} flex flex-col items-center justify-center font-bold border-l-2 border-white/20`}>
                  <div className="text-4xl leading-none">{scoreboardData.score2}</div>
                  {scoreboardData.penaltyMode && (
                    <div className="text-xs leading-none text-blue-700">
                      P: {scoreboardData.penaltyScore2}
                    </div>
                  )}
                </div>

                {/* Team 2 Name */}
                <div className={`w-40 px-4 py-2 relative ${templateStyles.team2Background}`}>
                  {editMode ? (
                    <input
                      type="text"
                      value={scoreboardData.team2}
                      onChange={(e) => handleTeamNameUpdate('team2', e.target.value)}
                      className={`w-full bg-transparent ${templateStyles.teamText} font-bold text-center border-b-2 border-white/50 focus:border-white outline-none`}
                      style={{ fontSize: `${adjustFontSize(scoreboardData.team2)}px` }}
                    />
                  ) : (
                    <div
                      className={`${templateStyles.teamText} font-bold text-center cursor-pointer hover:text-yellow-300 transition-colors`}
                      style={{ fontSize: `${adjustFontSize(scoreboardData.team2)}px` }}
                      onClick={() => setEditMode(true)}
                    >
                      {scoreboardData.team2}
                    </div>
                  )}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-1"
                    style={{ backgroundColor: scoreboardData.color2 }}
                  ></div>
                </div>

                {/* Team 2 Logo */}
                <div
                  className={`w-16 h-16 ${templateStyles.teamBackground} flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 group`}
                  onClick={() => setLogoUploadMode('team2')}
                >
                  {scoreboardData.logo2 ? (
                    <img 
                      src={scoreboardData.logo2} 
                      alt={scoreboardData.team2}
                      className="w-12 h-12 object-contain rounded-full border-2 border-white/30"
                    />
                  ) : (
                    <div className="text-white/60 text-xs text-center group-hover:text-white/80">
                      📷<br/>LOGO
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Stream Info */}
            <div className={`mt-2 ${templateStyles.headerBackground} ${templateStyles.headerText} px-4 py-1 rounded-full text-center font-bold text-sm shadow-lg`}>
              TRỰC TIẾP TRẬN BÓNG ĐÁ
            </div>
          </div>

          {/* SCO Logo below scoreboard */}
          {showSCOLogo && (
            <div className="mt-3 bg-gray-700/80 px-3 py-1 rounded-lg">
              <div className="text-white font-bold text-sm">SCO</div>
            </div>
          )}
        </div>
      </div>

      {/* Partner Logos */}
      {showNSBLogo && (
        <div className="fixed bottom-8 left-8 z-50 pointer-events-auto">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">NSB</div>
        </div>
      )}
      
      {showBDPXTLogo && (
        <div className="fixed bottom-8 left-8 z-50 pointer-events-auto">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">BDPXT</div>
        </div>
      )}

      {/* Marquee */}
      {scoreboardData.showMarquee && scoreboardData.marqueeText && (
        <div className="fixed bottom-0 left-0 w-full bg-black/40 text-white flex items-center overflow-hidden z-30" style={{ height: '3vw' }}>
          <div className="animate-marquee whitespace-nowrap font-bold text-yellow-300" style={{ fontSize: '2.2vw' }}>
            {scoreboardData.marqueeText}
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={(el) => {
          if (logoUploadMode === 'team1' && el) el.click();
        }}
        onChange={(e) => handleLogoUpload('team1', e)}
      />
      <input
        type="file"
        accept="image/*" 
        style={{ display: 'none' }}
        ref={(el) => {
          if (logoUploadMode === 'team2' && el) el.click();
        }}
        onChange={(e) => handleLogoUpload('team2', e)}
      />

      {/* Interactive Control Panel (Show when in edit mode) */}
      {editMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl text-black max-w-5xl pointer-events-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">📊 Scoreboard Controls</h3>
            <button
              onClick={() => setEditMode(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-bold"
            >
              ✖ Close
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Team 1 Controls */}
            <div className="bg-red-50 p-3 rounded-lg border-2 border-red-200">
              <label className="block text-sm font-bold mb-2 text-red-700">Team 1:</label>
              <input 
                className="w-full p-2 border rounded mb-2 text-sm"
                value={scoreboardData.team1}
                onChange={(e) => handleTeamNameUpdate('team1', e.target.value)}
                placeholder="Team name"
              />
              <div className="flex gap-1 mb-2">
                <button 
                  onClick={() => handleScoreUpdate('team1', 1)}
                  className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600"
                >
                  +1
                </button>
                <button 
                  onClick={() => handleScoreUpdate('team1', -1)}
                  className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-600"
                >
                  -1
                </button>
              </div>
              <input 
                type="color"
                className="w-full border rounded"
                value={scoreboardData.color1}
                onChange={(e) => setScoreboardData({...scoreboardData, color1: e.target.value})}
              />
            </div>
            
            {/* Team 2 Controls */}
            <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
              <label className="block text-sm font-bold mb-2 text-blue-700">Team 2:</label>
              <input 
                className="w-full p-2 border rounded mb-2 text-sm"
                value={scoreboardData.team2}
                onChange={(e) => handleTeamNameUpdate('team2', e.target.value)}
                placeholder="Team name"
              />
              <div className="flex gap-1 mb-2">
                <button 
                  onClick={() => handleScoreUpdate('team2', 1)}
                  className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600"
                >
                  +1
                </button>
                <button 
                  onClick={() => handleScoreUpdate('team2', -1)}
                  className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-600"
                >
                  -1
                </button>
              </div>
              <input 
                type="color"
                className="w-full border rounded"
                value={scoreboardData.color2}
                onChange={(e) => setScoreboardData({...scoreboardData, color2: e.target.value})}
              />
            </div>

            {/* Timer Controls */}
            <div className="bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
              <label className="block text-sm font-bold mb-2">Timer:</label>
              <input 
                className="w-full p-2 border rounded mb-2 text-sm"
                value={scoreboardData.timer}
                onChange={(e) => setScoreboardData({...scoreboardData, timer: e.target.value})}
                placeholder="00:00"
              />
              <input 
                className="w-full p-2 border rounded text-sm"
                value={scoreboardData.period}
                onChange={(e) => setScoreboardData({...scoreboardData, period: e.target.value})}
                placeholder="Period"
              />
            </div>

            {/* Penalty Controls */}
            <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
              <label className="flex items-center text-sm font-bold mb-2">
                <input 
                  type="checkbox"
                  checked={scoreboardData.penaltyMode}
                  onChange={(e) => setScoreboardData({...scoreboardData, penaltyMode: e.target.checked})}
                  className="mr-2"
                />
                Penalty Mode
              </label>
              {scoreboardData.penaltyMode && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handlePenaltyUpdate('team1', 1)}
                      className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600"
                    >
                      T1 +⚽
                    </button>
                    <button 
                      onClick={() => handlePenaltyUpdate('team1', -1)}
                      className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-600"
                    >
                      T1 -1
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handlePenaltyUpdate('team2', 1)}
                      className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-600"
                    >
                      T2 +⚽
                    </button>
                    <button 
                      onClick={() => handlePenaltyUpdate('team2', -1)}
                      className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-600"
                    >
                      T2 -1
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Stream Controls */}
            <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
              <label className="block text-sm font-bold mb-2">Live Stream:</label>
              <input 
                className="w-full p-2 border rounded text-sm"
                value={scoreboardData.live}
                onChange={(e) => setScoreboardData({...scoreboardData, live: e.target.value})}
                placeholder="Platform name"
              />
            </div>

            {/* Marquee Controls */}
            <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
              <label className="flex items-center text-sm font-bold mb-2">
                <input 
                  type="checkbox"
                  checked={scoreboardData.showMarquee}
                  onChange={(e) => setScoreboardData({...scoreboardData, showMarquee: e.target.checked})}
                  className="mr-2"
                />
                Marquee
              </label>
              {scoreboardData.showMarquee && (
                <input 
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Marquee text..."
                  value={scoreboardData.marqueeText}
                  onChange={(e) => setScoreboardData({...scoreboardData, marqueeText: e.target.value})}
                />
              )}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-600 text-center">
            💡 Click team names to edit • Click logo areas to upload • Penalty mode shows sub-scores • Responsive design auto-scales
          </div>
        </div>
      )}

      {/* Edit Mode Toggle Button */}
      {!editMode && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 font-bold text-sm"
          >
            ⚙️ Edit
          </button>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(0, -30px, 0);
          }
          70% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0,-4px,0);
          }
        }

        .animate-bounce {
          animation: bounce 1s;
        }
      `}</style>
    </div>
  );
};

export default ScoreboardBelow;
