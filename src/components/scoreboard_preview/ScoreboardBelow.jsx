import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import ScoreboardBelowTemplate1 from './ScoreboardBelowTemplate1';
import ScoreboardBelowTemplate2 from './ScoreboardBelowTemplate2';

const ScoreboardBelow = ({
  accessCode,
  onTeamUpdate,
  onScoreUpdate,
  onLogoUpdate,
  template = 1
}) => {
  // Sử dụng PublicMatchContext để nhận dữ liệu real-time
  const {
    matchData,
    displaySettings,
    marqueeData,
    penaltyData,
    socketConnected
  } = usePublicMatch();

  // State cho scoreboard data (merge với context data)
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

  // Cập nhật state khi nhận dữ liệu từ context
  useEffect(() => {
    if (matchData) {
      setScoreboardData(prev => ({
        ...prev,
        team1: matchData.teamA?.name || prev.team1,
        team2: matchData.teamB?.name || prev.team2,
        score1: matchData.teamA?.score || 0,
        score2: matchData.teamB?.score || 0,
        logo1: matchData.teamA?.logo || prev.logo1,
        logo2: matchData.teamB?.logo || prev.logo2,
        timer: matchData.matchTime || prev.timer,
        period: matchData.period || prev.period
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

  // Cập nhật penalty data từ context
  useEffect(() => {
    if (penaltyData) {
      setScoreboardData(prev => ({
        ...prev,
        penaltyMode: penaltyData.status !== 'ready',
        penaltyScore1: penaltyData.teamAGoals || 0,
        penaltyScore2: penaltyData.teamBGoals || 0
      }));
    }
  }, [penaltyData]);

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

  // Sử dụng template từ displaySettings context, fallback về prop
  const currentTemplate = displaySettings?.selectedSkin || template;
  const templateStyles = getTemplateStyles(currentTemplate);

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

  // Render the appropriate template based on selectedSkin
  const renderTemplate = () => {
    const templateProps = {
      matchTitle: "TRỰC TIẾP BÓNG ĐÁ",
      team1: scoreboardData.team1,
      team2: scoreboardData.team2,
      score1: scoreboardData.score1.toString(),
      score2: scoreboardData.score2.toString(),
      logo1: scoreboardData.logo1 || "/api/placeholder/90/90",
      logo2: scoreboardData.logo2 || "/api/placeholder/90/90",
      color1: scoreboardData.color1,
      color2: scoreboardData.color2,
      live: scoreboardData.live,
      marqueeText: scoreboardData.showMarquee ? scoreboardData.marqueeText : ""
    };

    switch (currentTemplate) {
      case 1:
        return <ScoreboardBelowTemplate1 {...templateProps} />;
      case 2:
        return <ScoreboardBelowTemplate2 {...templateProps} />;
      case 3:
        return <ScoreboardBelowTemplate1 {...templateProps} />; // Fallback to template 1
      case 4:
        return <ScoreboardBelowTemplate1 {...templateProps} />; // Fallback to template 1
      default:
        return <ScoreboardBelowTemplate1 {...templateProps} />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none bg-white">
      {/* Render appropriate template component */}
      {renderTemplate()}


    </div>
  );
};

export default ScoreboardBelow;
