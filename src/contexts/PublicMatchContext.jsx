import React, { createContext, useContext, useState, useCallback } from 'react';
import socketService from '../services/socketService';
import audioUtils from '../utils/audioUtils';

const PublicMatchContext = createContext();

export const usePublicMatch = () => {
  const context = useContext(PublicMatchContext);
  if (!context) {
    throw new Error('usePublicMatch phải được sử dụng trong PublicMatchProvider');
  }
  return context;
};

export const PublicMatchProvider = ({ children }) => {
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
    status: "waiting",
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
    mode: 'none',
    interval: 0,
    color: '#ffffff',
    fontSize: 16
  });

  // State cho template và poster
  const [displaySettings, setDisplaySettings] = useState({
    selectedSkin: 1,
    selectedPoster: 'tretrung',
    showStats: false,
    showPenalty: false,
    showLineup: false
  });

  // State cho view hiện tại trên route dynamic
  const [currentView, setCurrentView] = useState('poster'); // poster, intro, halftime, scoreboard

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

  // State cho logo và banner
  const [logoData, setLogoData] = useState({
    sponsor: [],
    organizer: [],
    media: [],
    tournament: [],
    displayOptions: {
      shape: "round",
      rotateDisplay: false
    }
  });

  // State cho socket connection
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [currentAccessCode, setCurrentAccessCode] = useState(null);

  // Simple update time function - không cần debounce nữa
  const updateLastTime = useCallback(() => {
    setLastUpdateTime(Date.now());
  }, []);

  // Thiết lập các listener cho socket
  const setupSocketListeners = useCallback(() => {
    console.log('🔧 [PublicMatchContext] Setting up socket listeners...');

    // Clear existing listeners trước khi thêm mới để tránh duplicate
    const eventsToClean = [
      'match_info_updated', 'score_updated', 'match_stats_updated', 'template_updated',
      'poster_updated', 'team_logos_updated', 'team_names_updated', 'marquee_updated',
      'match_time_updated', 'timer_tick', 'timer_started', 'timer_paused', 'timer_resumed',
      'timer_reset', 'penalty_updated', 'lineup_updated', 'sponsors_updated', 'logo_data_updated',
      'view_updated', 'audio_control', 'disconnect', 'connect'
    ];

    eventsToClean.forEach(eventName => {
      socketService.removeAllListeners(eventName);
    });

    console.log('🧹 [PublicMatchContext] Cleaned up existing listeners');
    // Lắng nghe cập nhật thông tin trận đấu
    socketService.on('match_info_updated', (data) => {
      setMatchData(prev => ({ ...prev, ...data.matchInfo }));
      updateLastTime();
    });

    // Lắng nghe cập nhật tỉ số
    socketService.on('score_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, score: data.scores.teamA || data.scores.home || 0 },
        teamB: { ...prev.teamB, score: data.scores.teamB || data.scores.away || 0 }
      }));
      updateLastTime();
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
      setDisplaySettings(prev => {
        const newSettings = { ...prev, selectedPoster: data.posterType };
        return newSettings;
      });
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật logo đội
    socketService.on('team_logos_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, logo: data.logos.teamA || data.logos.home },
        teamB: { ...prev.teamB, logo: data.logos.teamB || data.logos.away }
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật tên đội
    socketService.on('team_names_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, name: data.names.teamA || data.names.home },
        teamB: { ...prev.teamB, name: data.names.teamB || data.names.away }
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

    // Lắng nghe timer tick real-time từ backend
    socketService.on('timer_tick', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.displayTime
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer started
    socketService.on('timer_started', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.initialTime,
        status: 'live'
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer paused
    socketService.on('timer_paused', (data) => {
      setMatchData(prev => ({
        ...prev,
        status: 'pause'
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer resumed
    socketService.on('timer_resumed', (data) => {
      setMatchData(prev => ({
        ...prev,
        status: 'live'
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe timer reset
    socketService.on('timer_reset', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.resetTime || '00:00',
        status: 'waiting'
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

    // Lắng nghe cập nhật logo và banner
    socketService.on('logo_data_updated', (data) => {
      setLogoData(prev => ({ ...prev, ...data.logoData }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật view hiện tại (MỚI) - KHÔNG update time để tránh re-render
    socketService.on('view_updated', (data) => {
      console.log('🎯 [PublicMatchContext] Received view_updated event:', data);
      if (data.viewType) {
        setCurrentView(data.viewType);
        console.log('✅ [PublicMatchContext] View updated to:', data.viewType);
      } else {
        console.warn('⚠️ [PublicMatchContext] view_updated event missing viewType:', data);
      }
    });

    // Lắng nghe audio control events - để nhận referee voice từ CommentarySection
    socketService.on('audio_control', (data) => {
      console.log('🎙️ [PublicMatchContext] Received audio_control event:', data);
      console.log('🎙️ [PublicMatchContext] Event details:', {
        target: data.target,
        command: data.command,
        hasPayload: !!data.payload,
        timestamp: data.timestamp
      });

      // Chỉ xử lý event dành cho display clients
      if (data.target === 'display' && data.command === 'PLAY_REFEREE_VOICE' && data.payload) {
        console.log('✅ [PublicMatchContext] Processing referee voice for display client');
        const { audioData, mimeType } = data.payload;
        try {
          const uint8Array = new Uint8Array(audioData);
          const audioBlob = new Blob([uint8Array], { type: mimeType || 'audio/webm' });
          console.log('🎙️ [PublicMatchContext] Created audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
          audioUtils.playRefereeVoice(audioBlob);
        } catch (error) {
          console.error('❌ [PublicMatchContext] Error processing referee voice:', error);
        }
      } else {
        console.log('⚠️ [PublicMatchContext] Audio control event ignored:');
        console.log('   - Target match (display):', data.target === 'display');
        console.log('   - Command match (PLAY_REFEREE_VOICE):', data.command === 'PLAY_REFEREE_VOICE');
        console.log('   - Has payload:', !!data.payload);
      }
    });

    // Lắng nghe trạng thái kết nối
    socketService.on('disconnect', () => {
      console.log('🔌 [PublicMatchContext] Socket disconnected');
      setSocketConnected(false);
    });

    socketService.on('connect', () => {
      console.log('✅ [PublicMatchContext] Socket connected');
      setSocketConnected(true);
    });

    console.log('✅ [PublicMatchContext] All socket listeners set up successfully');
  }, [updateLastTime]);

  // Kh���i tạo socket connection cho public route
  const initializeSocket = useCallback(async (accessCode) => {
    try {
      // Tránh khởi tạo socket trùng lặp
      if (currentAccessCode === accessCode && socketConnected) {
        console.log('🔄 [PublicMatchContext] Socket already connected for', accessCode);
        return;
      }

      console.log('🔌 [PublicMatchContext] Initializing socket for access code:', accessCode);

      // Public route luôn sử dụng clientType 'display'
      await socketService.connect(accessCode, 'display');
      setSocketConnected(true);
      setCurrentAccessCode(accessCode);

      console.log('✅ [PublicMatchContext] Socket connected, setting up listeners...');
      // Lắng nghe các event từ server - luôn setup lại
      setupSocketListeners();

      // Request current state để đồng bộ data
      setTimeout(() => {
        console.log('🔄 [PublicMatchContext] Requesting current state from server...');
        socketService.requestCurrentState();
      }, 1000);

      console.log('✅ [PublicMatchContext] Socket initialization completed');
    } catch (error) {
      console.error('❌ [PublicMatchContext] Failed to initialize public socket:', error);
      setSocketConnected(false);
    }
  }, [currentAccessCode, socketConnected, setupSocketListeners]);

  // Ngắt kết nối socket
  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    setSocketConnected(false);
    setCurrentAccessCode(null);
  }, []);

  const value = {
    // State
    matchData,
    matchStats,
    penaltyData,
    marqueeData,
    displaySettings,
    lineupData,
    sponsors,
    logoData,
    socketConnected,
    lastUpdateTime,
    currentAccessCode,
    currentView,

    // Actions
    initializeSocket,
    disconnectSocket
  };

  return (
    <PublicMatchContext.Provider value={value}>
      {children}
    </PublicMatchContext.Provider>
  );
};

export default PublicMatchContext;
