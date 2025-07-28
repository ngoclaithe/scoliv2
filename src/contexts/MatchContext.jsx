import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';
import { useAuth } from './AuthContext';

const MatchContext = createContext();

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch phải được sử dụng trong MatchProvider');
  }
  return context;
};

export const MatchProvider = ({ children }) => {
  const { matchCode, isAuthenticated, user } = useAuth();
  
  // State cho thông tin trận đấu
  const [matchData, setMatchData] = useState({
    teamA: {
      name: "ĐỘI-A",
      score: 0,
      logo: null
    },
    teamB: {
      name: "ĐỘI-B",
      score: 0,
      logo: null
    },
    matchTime: "00:00",
    period: "Chưa bắt đầu",
    status: "waiting", // waiting, live, paused, ended
    tournament: "",
    stadium: "",
    matchDate: "",
    liveText: ""
  });

  // State cho thống kê trận đấu
  const [matchStats, setMatchStats] = useState({
    possession: { team1: 50, team2: 50 },
    totalShots: { team1: 0, team2: 0 },
    shotsOnTarget: { team1: 0, team2: 0 },
    corners: { team1: 0, team2: 0 },
    yellowCards: { team1: 0, team2: 0 },
    fouls: { team1: 0, team2: 0 },
  });

  // State cho lỗi futsal
  const [futsalErrors, setFutsalErrors] = useState({
    teamA: 0,
    teamB: 0
  });

  // State cho penalty
  const [penaltyData, setPenaltyData] = useState({
    teamAGoals: 0,
    teamBGoals: 0,
    currentTurn: 'teamA',
    shootHistory: [],
    status: 'ready',
    lastUpdated: null
  });

  // State cho chữ chạy
  const [marqueeData, setMarqueeData] = useState({
    text: '',
    mode: 'none', // none, continuous, interval
    interval: 0,
    color: '#ffffff',
    fontSize: 16
  });

  // State cho template và poster
  const [displaySettings, setDisplaySettings] = useState({
    selectedSkin: 1,
    selectedPoster: 'tretrung', // tretrung, haoquang
    showStats: false,
    showPenalty: false,
    showLineup: false
  });

  // State cho danh sách cầu thủ
  const [lineupData, setLineupData] = useState({
    teamA: [],
    teamB: []
  });

  // State cho nhà tài trợ
  const [sponsors, setSponsors] = useState({
    main: [],
    secondary: [],
    media: []
  });

  // State cho socket connection
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // State cho timer tự động
  const [timerInterval, setTimerInterval] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // Kết nối socket khi có matchCode (cho authenticated users)
  useEffect(() => {
    if (matchCode && isAuthenticated) {
      initializeSocket(matchCode);
    } else if (!matchCode && isAuthenticated) {
      disconnectSocket();
    }

    return () => {
      // Chỉ disconnect nếu không có external socket connection
      if (isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [matchCode, isAuthenticated]);

  // Hàm helper để chuyển đổi thời gian
  const parseTimeToSeconds = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return 0;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  const formatSecondsToTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Timer tự động để cập nhật thời gian trận đấu
  useEffect(() => {
    // Dọn dẹp interval cũ
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Tạo interval mới nếu status là "live"
    if (matchData.status === "live") {
      const currentTime = parseTimeToSeconds(matchData.matchTime);
      const now = Date.now();
      const calculatedStartTime = now - (currentTime * 1000); // Tính thời điểm bắt đầu
      setStartTime(calculatedStartTime);

      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - calculatedStartTime) / 1000);
        const newTime = formatSecondsToTime(elapsed);

        setMatchData(prev => {
          if (prev.status === "live" && prev.matchTime !== newTime) {
            // Chỉ cập nhật local state, không emit socket để tránh tốn tài nguyên
            return { ...prev, matchTime: newTime };
          }
          return prev;
        });
      }, 1000);

      setTimerInterval(interval);
    }

    // Cleanup khi component unmount hoặc status thay đổi
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [matchData.status, matchData.matchTime]);

  // Khởi tạo socket connection
  const initializeSocket = useCallback(async (accessCode) => {
    try {
      // Tất cả người vào Home.jsx đều là admin (theo yêu cầu)
      let clientType = 'admin';

      // Tránh khởi tạo socket trùng lặp
      if (socketService.getConnectionStatus().accessCode === accessCode &&
          socketService.getConnectionStatus().isConnected &&
          socketService.getConnectionStatus().clientType === clientType) {
        console.log(`Socket already connected for access code: ${accessCode}`);
        return;
      }

      await socketService.connect(accessCode, clientType);
      setSocketConnected(true);

      // Lắng nghe các event từ server
      setupSocketListeners();

      console.log(`Socket initialized for access code: ${accessCode}`);
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setSocketConnected(false);
    }
  }, []);

  // Thiết lập các listener cho socket
  const setupSocketListeners = useCallback(() => {
    // Lắng nghe cập nhật thông tin trận đấu
    socketService.on('match_info_updated', (data) => {
      setMatchData(prev => ({ ...prev, ...data.matchInfo }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật tỉ số
    socketService.on('score_updated', (data) => {
      console.log('⚽ [MatchContext] Received score_updated:', data);
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, score: data.scores.teamA || data.scores.home },
        teamB: { ...prev.teamB, score: data.scores.teamB || data.scores.away }
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật thống kê
    socketService.on('match_stats_updated', (data) => {
      setMatchStats(prev => ({ ...prev, ...data.stats }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật template
    socketService.on('template_updated', (data) => {
      setDisplaySettings(prev => ({ ...prev, selectedSkin: data.templateId }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật poster
    socketService.on('poster_updated', (data) => {
      setDisplaySettings(prev => ({ ...prev, selectedPoster: data.posterType }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật logo đội
    socketService.on('team_logos_updated', (data) => {
      console.log('🏆 [MatchContext] Received team_logos_updated:', data);
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, logo: data.logos.teamA },
        teamB: { ...prev.teamB, logo: data.logos.teamB }
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật tên đội
    socketService.on('team_names_updated', (data) => {
      console.log('📛 [MatchContext] Received team_names_updated:', data);
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, name: data.names.teamA },
        teamB: { ...prev.teamB, name: data.names.teamB }
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật chữ chạy
    socketService.on('marquee_updated', (data) => {
      setMarqueeData(prev => ({ ...prev, ...data.marqueeData }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật thời gian
    socketService.on('match_time_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.time.matchTime,
        period: data.time.period,
        status: data.time.status
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật penalty
    socketService.on('penalty_updated', (data) => {
      setPenaltyData(prev => ({ ...prev, ...data.penaltyData }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật danh sách
    socketService.on('lineup_updated', (data) => {
      setLineupData({
        teamA: data.lineup.teamA,
        teamB: data.lineup.teamB
      });
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật nhà tài trợ
    socketService.on('sponsors_updated', (data) => {
      setSponsors(prev => ({ ...prev, ...data.sponsors }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe trạng thái kết nối
    socketService.on('disconnect', () => {
      setSocketConnected(false);
    });

    socketService.on('connect', () => {
      setSocketConnected(true);
    });
  }, []);

  // Ngắt kết nối socket
  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    setSocketConnected(false);
  }, []);

  // === ACTION FUNCTIONS ===

  // Cập nhật tỉ số và thông tin đội
  const updateScore = useCallback((team, increment, additionalData = {}) => {
    const newMatchData = { ...matchData };

    // Cập nhật tỉ số nếu có increment
    if (increment !== 0) {
      newMatchData[team].score = Math.max(0, newMatchData[team].score + increment);
    }

    // Cập nhật thông tin bổ sung (tên đội, logo, etc.)
    if (additionalData && Object.keys(additionalData).length > 0) {
      newMatchData[team] = { ...newMatchData[team], ...additionalData };
    }

    setMatchData(newMatchData);

    // Emit to socket
    if (socketConnected) {
      socketService.updateScore(newMatchData.teamA.score, newMatchData.teamB.score);
    }
  }, [matchData, socketConnected]);

  // Cập nhật thông tin trận đấu
  const updateMatchInfo = useCallback((newMatchInfo) => {
    setMatchData(prev => ({ ...prev, ...newMatchInfo }));
    
    if (socketConnected) {
      socketService.updateMatchInfo(newMatchInfo);
    }
  }, [socketConnected]);

  // Cập nhật thống kê
  const updateStats = useCallback((newStats) => {
    setMatchStats(prev => ({ ...prev, ...newStats }));
    
    if (socketConnected) {
      socketService.updateMatchStats(newStats);
    }
  }, [socketConnected]);

  // Cập nhật template
  const updateTemplate = useCallback((templateId) => {
    setDisplaySettings(prev => ({ ...prev, selectedSkin: templateId }));
    
    if (socketConnected) {
      socketService.updateTemplate(templateId);
    }
  }, [socketConnected]);

  // Cập nhật poster
  const updatePoster = useCallback((posterType) => {
    console.log('🎨 [MatchContext] updatePoster called with:', posterType);
    console.log('🎨 [MatchContext] socketConnected:', socketConnected);

    setDisplaySettings(prev => {
      const newSettings = { ...prev, selectedPoster: posterType };
      console.log('🎨 [MatchContext] Updated displaySettings:', newSettings);
      return newSettings;
    });

    if (socketConnected) {
      console.log('🎨 [MatchContext] Emitting updatePoster via socket:', posterType);
      socketService.updatePoster(posterType);
    } else {
      console.log('⚠️ [MatchContext] Socket not connected, cannot emit poster update');
    }
  }, [socketConnected]);

  // Cập nhật logo đội
  const updateTeamLogos = useCallback((teamALogo, teamBLogo) => {
    setMatchData(prev => ({
      ...prev,
      teamA: { ...prev.teamA, logo: teamALogo },
      teamB: { ...prev.teamB, logo: teamBLogo }
    }));

    if (socketConnected) {
      socketService.updateTeamLogos(teamALogo, teamBLogo);
    }
  }, [socketConnected]);

  // Cập nhật tên đội
  const updateTeamNames = useCallback((teamAName, teamBName) => {
    setMatchData(prev => ({
      ...prev,
      teamA: { ...prev.teamA, name: teamAName },
      teamB: { ...prev.teamB, name: teamBName }
    }));

    if (socketConnected) {
      socketService.updateTeamNames(teamAName, teamBName);
    }
  }, [socketConnected]);

  // Cập nhật chữ chạy
  const updateMarquee = useCallback((newMarqueeData) => {
    setMarqueeData(prev => ({ ...prev, ...newMarqueeData }));
    
    if (socketConnected) {
      socketService.updateMarquee(newMarqueeData);
    }
  }, [socketConnected]);

  // Cập nhật thời gian trận đấu
  const updateMatchTime = useCallback((matchTime, period, status) => {
    const currentTime = parseTimeToSeconds(matchTime);
    const now = Date.now();

    // Cập nhật startTime khi set thời gian mới
    if (status === "live") {
      setStartTime(now - (currentTime * 1000));
    }

    setMatchData(prev => ({ ...prev, matchTime, period, status }));

    if (socketConnected) {
      socketService.updateMatchTime(matchTime, period, status);
    }
  }, [socketConnected, parseTimeToSeconds]);

  // Cập nhật penalty
  const updatePenalty = useCallback((newPenaltyData) => {
    setPenaltyData(prev => ({ ...prev, ...newPenaltyData }));
    
    if (socketConnected) {
      socketService.updatePenalty(newPenaltyData);
    }
  }, [socketConnected]);

  // Cập nhật danh sách cầu thủ
  const updateLineup = useCallback((teamALineup, teamBLineup) => {
    setLineupData({ teamA: teamALineup, teamB: teamBLineup });

    if (socketConnected) {
      socketService.updateLineup(teamALineup, teamBLineup);
    }
  }, [socketConnected]);

  // Cập nhật lỗi futsal
  const updateFutsalErrors = useCallback((team, increment) => {
    setFutsalErrors(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] + increment)
    }));
  }, []);

  // Cập nhật view hiện tại cho route dynamic (MỚI)
  const updateView = useCallback((viewType) => {
    if (socketConnected) {
      socketService.emit('view_update', { viewType });
      console.log('Sent view update:', viewType);
    }
  }, [socketConnected]);

  // Reset toàn bộ dữ liệu trận đấu
  const resetMatch = useCallback(() => {
    setMatchData({
      teamA: { name: "ĐỘI-A", score: 0, logo: null },
      teamB: { name: "ĐỘI-B", score: 0, logo: null },
      matchTime: "00:00",
      period: "Chưa bắt đầu",
      status: "waiting",
      tournament: "",
      stadium: "",
      matchDate: "",
      liveText: ""
    });
    
    setMatchStats({
      possession: { team1: 50, team2: 50 },
      totalShots: { team1: 0, team2: 0 },
      shotsOnTarget: { team1: 0, team2: 0 },
      corners: { team1: 0, team2: 0 },
      yellowCards: { team1: 0, team2: 0 },
      fouls: { team1: 0, team2: 0 },
    });
    
    setFutsalErrors({ teamA: 0, teamB: 0 });
    setPenaltyData({
      teamAGoals: 0,
      teamBGoals: 0,
      currentTurn: 'teamA',
      shootHistory: [],
      status: 'ready',
      lastUpdated: null
    });
  }, []);

  const value = {
    // State
    matchData,
    matchStats,
    futsalErrors,
    penaltyData,
    marqueeData,
    displaySettings,
    lineupData,
    sponsors,
    socketConnected,
    lastUpdateTime,
    
    // Actions
    updateScore,
    updateMatchInfo,
    updateStats,
    updateTemplate,
    updatePoster,
    updateTeamLogos,
    updateTeamNames,
    updateMarquee,
    updateMatchTime,
    updatePenalty,
    updateLineup,
    updateFutsalErrors,
    updateView,
    resetMatch,

    // Socket functions
    initializeSocket,
    disconnectSocket
  };

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;
