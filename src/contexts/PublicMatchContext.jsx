import React, { createContext, useContext, useState, useCallback } from 'react';
import socketService from '../services/socketService';

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
    homeTeam: { 
      name: "ĐỘI-A", 
      score: 0, 
      logo: null 
    },
    awayTeam: { 
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
    homeGoals: 0,
    awayGoals: 0,
    currentTurn: 'home',
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
    homeTeam: [],
    awayTeam: []
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
  const [currentAccessCode, setCurrentAccessCode] = useState(null);

  // Thiết lập các listener cho socket
  const setupSocketListeners = useCallback(() => {
    // Lắng nghe cập nhật thông tin trận đấu
    socketService.on('match_info_updated', (data) => {
      setMatchData(prev => ({ ...prev, ...data.matchInfo }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật tỉ số
    socketService.on('score_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        homeTeam: { ...prev.homeTeam, score: data.scores.home },
        awayTeam: { ...prev.awayTeam, score: data.scores.away }
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
      setMatchData(prev => ({
        ...prev,
        homeTeam: { ...prev.homeTeam, logo: data.logos.home },
        awayTeam: { ...prev.awayTeam, logo: data.logos.away }
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật tên đội
    socketService.on('team_names_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        homeTeam: { ...prev.homeTeam, name: data.names.home },
        awayTeam: { ...prev.awayTeam, name: data.names.away }
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
        homeTeam: data.lineup.home,
        awayTeam: data.lineup.away
      });
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật nhà tài trợ
    socketService.on('sponsors_updated', (data) => {
      setSponsors(prev => ({ ...prev, ...data.sponsors }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật view hiện tại (MỚI)
    socketService.on('view_updated', (data) => {
      setCurrentView(data.viewType);
      setLastUpdateTime(Date.now());
      console.log('View updated to:', data.viewType);
    });

    // Lắng nghe trạng thái kết nối
    socketService.on('disconnect', () => {
      setSocketConnected(false);
    });

    socketService.on('connect', () => {
      setSocketConnected(true);
    });
  }, []);

  // Khởi tạo socket connection cho public route
  const initializeSocket = useCallback(async (accessCode) => {
    try {
      // Tránh khởi tạo socket trùng lặp
      if (currentAccessCode === accessCode && socketConnected) {
        console.log(`Public socket already connected for: ${accessCode}`);
        return;
      }

      console.log(`Initializing public socket for: ${accessCode}`);
      
      await socketService.connect(accessCode);
      setSocketConnected(true);
      setCurrentAccessCode(accessCode);
      
      // Lắng nghe các event từ server
      setupSocketListeners();
      
      console.log(`Public socket initialized for access code: ${accessCode}`);
    } catch (error) {
      console.error('Failed to initialize public socket:', error);
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
