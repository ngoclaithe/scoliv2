import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
// Audio moved to audioUtils

const TopScoreboard = ({ template = 1, accessCode }) => {
  // Sử dụng PublicMatchContext để nhận dữ liệu real-time
  const {
    matchData,
    displaySettings,
    marqueeData,
    sponsors,
    socketConnected
  } = usePublicMatch();

  // Audio đã được chuyển sang MatchManagementSection để quản lý tập trung
  // const { playAudio } = useAudio();

  // Sample data - sẽ được override bởi context data
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

  // Cập nhật state khi nhận dữ liệu từ context
  useEffect(() => {
    if (matchData) {
      setScoreboardData(prev => ({
        ...prev,
        team1: matchData.teamA?.name || prev.team1,
        team2: matchData.teamB?.name || prev.team2,
        score1: String(matchData.teamA?.score || 0),
        score2: String(matchData.teamB?.score || 0),
        timer: matchData.matchTime || prev.timer
      }));
    }
  }, [matchData]);

  // Cập nhật marquee data từ context
  useEffect(() => {
    if (marqueeData) {
      setScoreboardData(prev => ({
        ...prev,
        showMarquee: marqueeData.mode !== 'none',
        marqueeText: marqueeData.text || prev.marqueeText
      }));
    }
  }, [marqueeData]);

  // Cập nhật sponsors data từ context
  useEffect(() => {
    if (sponsors) {
      setScoreboardData(prev => ({
        ...prev,
        partnerPositions: {
          leftUp: sponsors.main || [],
          leftDown: sponsors.secondary || [],
          rightDown: sponsors.media || []
        }
      }));
    }
  }, [sponsors]);

  const [scoreboardScale, setScoreboardScale] = useState(1);

  // Template styles based on provided images
  const getTemplateStyles = (templateId) => {
    switch (templateId) {
      case 1: // Classic Navy - Template 1
        return {
          background: 'bg-blue-900',
          border: 'border-yellow-400',
          scoreBackground: 'bg-white',
          scoreText: 'text-blue-900',
          timerBackground: 'bg-blue-900',
          timerText: 'text-white',
          teamBackground: 'bg-blue-900',
          teamText: 'text-white',
          team1Background: 'bg-blue-900',
          team2Background: 'bg-blue-900'
        };
      case 2: // Blue Red - Template 2
        return {
          background: 'bg-blue-600',
          border: 'border-yellow-500',
          scoreBackground: 'bg-white',
          scoreText: 'text-blue-900',
          timerBackground: 'bg-gray-700',
          timerText: 'text-white',
          teamBackground: 'bg-blue-600',
          teamText: 'text-white',
          team1Background: 'bg-blue-600',
          team2Background: 'bg-red-600'
        };
      case 3: // Teal Modern - Template 3
        return {
          background: 'bg-teal-500',
          border: 'border-white',
          scoreBackground: 'bg-red-600',
          scoreText: 'text-white',
          timerBackground: 'bg-teal-600',
          timerText: 'text-white',
          teamBackground: 'bg-teal-500',
          teamText: 'text-white',
          team1Background: 'bg-teal-500',
          team2Background: 'bg-teal-500'
        };
      case 4: // Red Orange - Template 4
        return {
          background: 'bg-red-500',
          border: 'border-yellow-300',
          scoreBackground: 'bg-blue-900',
          scoreText: 'text-white',
          timerBackground: 'bg-yellow-500',
          timerText: 'text-blue-900',
          teamBackground: 'bg-red-500',
          teamText: 'text-white',
          team1Background: 'bg-red-500',
          team2Background: 'bg-red-500'
        };
      default:
        return {
          background: 'bg-blue-900',
          border: 'border-yellow-400',
          scoreBackground: 'bg-white',
          scoreText: 'text-blue-900',
          timerBackground: 'bg-blue-900',
          timerText: 'text-white',
          teamBackground: 'bg-blue-900',
          teamText: 'text-white',
          team1Background: 'bg-blue-900',
          team2Background: 'bg-blue-900'
        };
    }
  };

  // Sử dụng template từ displaySettings context, fallback về prop
  const currentTemplate = displaySettings?.selectedSkin || template;
  const templateStyles = getTemplateStyles(currentTemplate);

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

  // Audio đã được chuyển sang MatchManagementSection để quản lý tập trung
  // useEffect(() => {
  //   playAudio('gialap');
  // }, []);

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
          <div className={`flex items-center h-14 ${templateStyles.teamText} rounded-lg overflow-hidden shadow-lg border-2 ${templateStyles.border}`}>
            {/* Team 1 Score */}
            <div className={`w-11 h-14 ${templateStyles.scoreBackground} ${templateStyles.scoreText} flex items-center justify-center text-4xl font-bold`}>
              {scoreboardData.score1}
            </div>

            {/* Team 1 */}
            <div className={`w-48 h-14 ${templateStyles.team1Background} relative flex items-center justify-center pb-2`}>
              <div
                className={`${templateStyles.teamText} font-bold uppercase whitespace-nowrap z-10 leading-none`}
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
            <div className={`w-24 h-14 ${templateStyles.timerBackground} ${templateStyles.timerText} flex items-center justify-center text-3xl font-bold relative`}>
              <div className="z-10">{scoreboardData.timer}</div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-green-500"></div>
            </div>

            {/* Team 2 */}
            <div className={`w-48 h-14 ${templateStyles.team2Background} relative flex items-center justify-center pb-2`}>
              <div
                className={`${templateStyles.teamText} font-bold uppercase whitespace-nowrap z-10 leading-none`}
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
            <div className={`w-11 h-14 ${templateStyles.scoreBackground} ${templateStyles.scoreText} flex items-center justify-center text-4xl font-bold`}>
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
            {partner.url_logo && (
              <img src={partner.url_logo} alt={partner.name || 'Sponsor'} className="w-12 h-12 rounded-full object-cover" style={{ height: '4vw', width: 'auto' }} />
            )}
            {partner.name && <span>{partner.name}</span>}
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



    </div>
  );
};

export default TopScoreboard;
