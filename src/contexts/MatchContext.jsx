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
    liveText: "",
    matchTitle: ""
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
    showLineup: false,
    logoShape: 'round', // 'round', 'square', 'hexagon'
    rotateDisplay: false // thêm rotateDisplay
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

  // Timer tự động DISABLED - Sử dụng server timer thay thế
  useEffect(() => {
    // Dọn dẹp interval cũ nếu có
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    // Cleanup khi component unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [matchData.status, socketConnected]);

  // Khởi tạo socket connection
  const initializeSocket = useCallback(async (accessCode) => {
    try {
      // Tất cả người vào Home.jsx đều là admin (theo yêu cầu)
      let clientType = 'admin';

      // Tránh khởi tạo socket trùng lặp
      if (socketService.getConnectionStatus().accessCode === accessCode &&
          socketService.getConnectionStatus().isConnected &&
          socketService.getConnectionStatus().clientType === clientType) {
        return;
      }

      await socketService.connect(accessCode, clientType);
      setSocketConnected(true);

      // Lắng nghe các event từ server
      setupSocketListeners();

      // Lắng nghe trạng thái room (room_joined, room_left, room_error)
      setupRoomStatusListener();

      // Request state hiện tại từ server sau khi connect
      setTimeout(() => {
        socketService.requestCurrentState();
        console.log('🔄 [MatchContext] Requested current state from server');
      }, 1000); // Delay 1s để đảm bảo connect thành công

      console.log(`Socket initialized for access code: ${accessCode}`);
    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setSocketConnected(false);
    }
  }, []);

  // Thiết lập listener cho trạng thái room
  const setupRoomStatusListener = useCallback(() => {
    socketService.onRoomStatus((eventType, data) => {
      console.log(`🏠 [MatchContext] Room event: ${eventType}`, data);

      if (eventType === 'room_joined' && data) {
        // Khi join_room thành công, backend sẽ emit room_joined với current state
        console.log('✅ [MatchContext] Successfully joined room, processing current state from room_joined...');

        // Cập nhật tất cả dữ liệu từ backend nếu có trong room_joined response
        if (data.currentState) {
          const state = data.currentState;

          if (state.matchData) {
            console.log('🔄 [MatchContext] Updating matchData from room_joined:', state.matchData);
            setMatchData(prev => ({ ...prev, ...state.matchData }));
          }

          if (state.matchStats) {
            console.log('📊 [MatchContext] Updating matchStats from room_joined:', state.matchStats);
            setMatchStats(prev => ({ ...prev, ...state.matchStats }));
          }

          if (state.displaySettings) {
            console.log('🎨 [MatchContext] Updating displaySettings from room_joined:', state.displaySettings);
            setDisplaySettings(prev => ({ ...prev, ...state.displaySettings }));
          }

          if (state.marqueeData) {
            console.log('📢 [MatchContext] Updating marqueeData from room_joined:', state.marqueeData);
            setMarqueeData(prev => ({ ...prev, ...state.marqueeData }));
          }

          if (state.penaltyData) {
            console.log('⚽ [MatchContext] Updating penaltyData from room_joined:', state.penaltyData);
            setPenaltyData(prev => ({ ...prev, ...state.penaltyData }));
          }

          if (state.lineupData) {
            console.log('📋 [MatchContext] Updating lineupData from room_joined:', state.lineupData);
            setLineupData(state.lineupData);
          }

          if (state.futsalErrors) {
            console.log('🚫 [MatchContext] Updating futsalErrors from room_joined:', state.futsalErrors);
            setFutsalErrors(prev => ({ ...prev, ...state.futsalErrors }));
          }

          if (state.sponsors) {
            console.log('🏢 [MatchContext] Updating sponsors from room_joined:', state.sponsors);
            setSponsors(prev => ({ ...prev, ...state.sponsors }));
          }

          console.log('✅ [MatchContext] All data updated from room_joined event');
          setLastUpdateTime(Date.now());
        }
      } else if (eventType === 'room_error') {
        console.error('❌ [MatchContext] Room join error:', data);
      } else if (eventType === 'room_left') {
        console.log('👋 [MatchContext] Left room:', data);
      }
    });
  }, []);

  // Thiết lập các listener cho socket
  const setupSocketListeners = useCallback(() => {
    // Lắng nghe cập nhật thông tin trận đấu
    socketService.on('match_info_updated', (data) => {
      console.log('📝 [MatchContext] match_info_updated received:', data);
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

    // Lắng nghe cập nhật tiêu đề trận đấu
    socketService.on('match_title_updated', (data) => {
      setMatchData(prev => ({ ...prev, matchTitle: data.matchTitle }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật đơn vị live
    socketService.on('live_unit_updated', (data) => {
      console.log('📝 [MatchContext] live_unit_updated received:', data);
      if (data.liveUnit && (data.liveUnit.text || data.liveUnit.name)) {
        setMatchData(prev => ({
          ...prev,
          liveText: data.liveUnit.text || data.liveUnit.name || prev.liveText
        }));
      }
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

    // === TIMER REAL-TIME LISTENERS ===



    // Lắng nghe timer real-time updates từ server
    socketService.on('timer_tick', (data) => {
      setMatchData(prev => {
        const newTime = data.displayTime || data.currentTime;
        const newStatus = prev.status === 'paused' ? 'paused' : 'live';

        // Chỉ cập nhật nếu có thay đổi thực sự
        if (prev.matchTime === newTime && prev.status === newStatus) {
          return prev;
        }

        return {
          ...prev,
          matchTime: newTime,
          status: newStatus,
          serverTimestamp: data.timestamp || data.serverTimestamp
        };
      });
    });

    // Lắng nghe timer start từ server
    socketService.on('timer_started', (data) => {
      // console.log('▶️ [MatchContext] Timer started from server:', data);
      setMatchData(prev => ({
        ...prev,
        matchTime: data.currentTime,
        period: data.period,
        status: 'live',
        serverTimestamp: data.serverTimestamp
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer pause từ server
    socketService.on('timer_paused', (data) => {
      console.log('⏸️ [MatchContext] Timer paused from server:', data);
      setMatchData(prev => ({
        ...prev,
        matchTime: data.currentTime,
        status: 'paused',
        serverTimestamp: data.serverTimestamp
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer resume từ server
    socketService.on('timer_resumed', (data) => {
      console.log('▶️ [MatchContext] Timer resumed from server:', data);
      setMatchData(prev => ({
        ...prev,
        matchTime: data.currentTime,
        status: 'live',
        serverTimestamp: data.serverTimestamp
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer reset từ server
    socketService.on('timer_reset', (data) => {
      console.log('🔄 [MatchContext] Timer reset from server:', data);
      setMatchData(prev => ({
        ...prev,
        matchTime: data.resetTime,
        period: data.period,
        status: 'waiting',
        serverTimestamp: data.serverTimestamp
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
        teamA: data.lineupData.teamA,
        teamB: data.lineupData.teamB
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

    // Lắng nghe response state hiện tại từ server
    socketService.on('current_state_response', (data) => {
      console.log('🔄 [MatchContext] Received current_state_response:', data);

      if (data.matchData) {
        setMatchData(prev => ({ ...prev, ...data.matchData }));
      }

      if (data.matchStats) {
        setMatchStats(prev => ({ ...prev, ...data.matchStats }));
      }

      if (data.displaySettings) {
        setDisplaySettings(prev => ({ ...prev, ...data.displaySettings }));
      }

      if (data.marqueeData) {
        setMarqueeData(prev => ({ ...prev, ...data.marqueeData }));
      }

      if (data.penaltyData) {
        setPenaltyData(prev => ({ ...prev, ...data.penaltyData }));
      }

      if (data.lineupData) {
        setLineupData(data.lineupData);
      }

      if (data.futsalErrors) {
        setFutsalErrors(prev => ({ ...prev, ...data.futsalErrors }));
      }

      console.log('✅ [MatchContext] State loaded from server successfully');
      setLastUpdateTime(Date.now());
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

  // Cập nh���t poster
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

  // Cập nhật nhà tài trợ
  const updateSponsors = useCallback((newSponsors) => {
    setSponsors(prev => ({ ...prev, ...newSponsors }));

    if (socketConnected) {
      socketService.updateSponsors(newSponsors);
    }
  }, [socketConnected]);

  // Cập nhật tiêu đề trận đấu
  const updateMatchTitle = useCallback((matchTitle) => {
    setMatchData(prev => ({ ...prev, matchTitle }));

    if (socketConnected) {
      socketService.updateMatchTitle(matchTitle);
    }
  }, [socketConnected]);

  // Cập nhật đơn vị tổ chức
  const updateOrganizing = useCallback((newOrganizing) => {
    console.log('[MatchContext] updateOrganizing called:', newOrganizing, 'socketConnected:', socketConnected);
    if (socketConnected) {
      socketService.updateOrganizing(newOrganizing);
    }
  }, [socketConnected]);

  // Cập nhật đơn vị truyền thông
  const updateMediaPartners = useCallback((newMediaPartners) => {
    console.log('[MatchContext] updateMediaPartners called:', newMediaPartners, 'socketConnected:', socketConnected);
    if (socketConnected) {
      socketService.updateMediaPartners(newMediaPartners);
    }
  }, [socketConnected]);

  // Cập nhật logo giải đấu
  const updateTournamentLogo = useCallback((newTournamentLogo) => {
    console.log('[MatchContext] updateTournamentLogo called:', newTournamentLogo, 'socketConnected:', socketConnected);
    if (socketConnected) {
      socketService.updateTournamentLogo(newTournamentLogo);
    }
  }, [socketConnected]);

  // Cập nhật đơn vị live
  const updateLiveUnit = useCallback((newLiveUnit) => {
    console.log('[MatchContext] updateLiveUnit called:', newLiveUnit, 'socketConnected:', socketConnected);
    if (socketConnected) {
      socketService.updateLiveUnit(newLiveUnit);
    }
  }, [socketConnected]);

  // Cập nhật cài đặt poster
  const updatePosterSettings = useCallback((newPosterSettings) => {
    console.log('[MatchContext] updatePosterSettings called:', newPosterSettings, 'socketConnected:', socketConnected);
    if (socketConnected) {
      socketService.updatePosterSettings(newPosterSettings);
    }
  }, [socketConnected]);

  // Cập nhật display settings
  const updateDisplaySettings = useCallback((newDisplaySettings) => {
    // console.log('[MatchContext] updateDisplaySettings called:', newDisplaySettings, 'socketConnected:', socketConnected);
    setDisplaySettings(prev => ({ ...prev, ...newDisplaySettings }));
    if (socketConnected) {
      socketService.updateDisplaySettings(newDisplaySettings);
    }
  }, [socketConnected]);

  const updateMatchTime = useCallback((matchTime, period, status) => {
    setMatchData(prev => ({ ...prev, matchTime, period, status }));

    if (socketConnected) {
      if (status === "live") {
        socketService.startServerTimer(matchTime, period, "live");
        // console.log('▶️ [MatchContext] Started server timer:', { matchTime, period, status: "live" });
      } else if (status === "paused") {
        socketService.pauseServerTimer();
        // console.log('⏸️ [MatchContext] Paused server timer');
      } else if (status === "waiting") {
        socketService.resetServerTimer(matchTime, period, "waiting");
        // console.log('🔄 [MatchContext] Reset server timer:', { matchTime, period, status: "waiting" });
      }
    }
  }, [socketConnected]);

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

  // Resume timer từ server
  const resumeTimer = useCallback(() => {
    if (socketConnected) {
      socketService.resumeServerTimer();
      console.log('▶️ [MatchContext] Resumed server timer');
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
      liveText: "",
      matchTitle: ""
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
    updateMatchTitle,

    // Logo update functions
    updateSponsors,
    updateOrganizing,
    updateMediaPartners,
    updateTournamentLogo,
    updateLiveUnit,
    updatePosterSettings,
    updateDisplaySettings,

    // Timer functions
    resumeTimer,

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
