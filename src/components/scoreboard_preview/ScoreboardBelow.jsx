import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAudio } from '../../contexts/AudioContext';
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

  // Sử dụng template từ displaySettings context, fallback về prop
  const currentTemplate = displaySettings?.selectedSkin || template;

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
