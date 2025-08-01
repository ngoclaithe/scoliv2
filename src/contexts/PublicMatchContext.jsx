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
    liveText: "",
    teamAKitColor: "#FF0000", // Default team A kit color
    teamBKitColor: "#0000FF"  // Default team B kit color
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
    showLineup: false,
    logoShape: 'round', // 'round', 'square', 'hexagon'
    rotateDisplay: false, // thêm rotateDisplay
    showTournamentLogo: true,
    showSponsors: true,
    showOrganizing: true,
    showMediaPartners: true
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
    sponsors: {
      code_logo: [],
      url_logo: [],
      position: [],
      type_display: [],
      behavior: 'add'
    }
  });

  const [organizing, setOrganizing] = useState({
    code_logo: [],
    url_logo: [],
    position: [],
    type_display: [],
    behavior: 'add'
  });

  const [mediaPartners, setMediaPartners] = useState({
    code_logo: [],
    url_logo: [],
    position: [],
    type_display: [],
    behavior: 'add'
  });

  const [tournamentLogo, setTournamentLogo] = useState({

  });

  // State cho đơn vị live/sản xuất
  const [liveUnit, setLiveUnit] = useState({
    code_logo: [],
    url_logo: [],
    name: 'LIVE STREAMING',
    position: 'top-right'
  });

  // State cho cài đặt hiển thị poster
  const [posterSettings, setPosterSettings] = useState({
    showTimer: true,
    showDate: true,
    showStadium: true,
    showLiveIndicator: true,
    backgroundOpacity: 0.8,
    textColor: '#ffffff',
    accentColor: '#3b82f6'
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
        teamA: data.lineupData.teamA || [],
        teamB: data.lineupData.teamB || []
      });
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật nhà tài trợ
    socketService.on('sponsors_updated', (data) => {
      console.log('📝 [PublicMatchContext] sponsors_updated received:', data);
    
      setSponsors(prev => {
        const newSponsors = { ...prev };
        const behavior = data.behavior; // add | update | remove
        const d = data.sponsors;
    
        if (!d || !Array.isArray(d.code_logo)) return prev;
    
        const current = prev.sponsors || {
          url_logo: [],
          code_logo: [],
          position: [],
          type_display: [],
        };
    
        let updatedSponsors = {
          url_logo: [...current.url_logo],
          code_logo: [...current.code_logo],
          position: [...current.position],
          type_display: [...current.type_display],
        };
    
        d.code_logo.forEach((code, i) => {
          const index = updatedSponsors.code_logo.findIndex(c => c === code);
          const newUrl = d.url_logo?.[i];
          const newPos = d.position?.[i];
          const newType = d.type_display?.[i];
    
          if (behavior === 'add') {
            if (index === -1) {
              updatedSponsors.code_logo.push(code);
              updatedSponsors.url_logo.push(newUrl || '');
              updatedSponsors.position.push(newPos || []);
              updatedSponsors.type_display.push(newType || '');
            }
          }
    
          if (behavior === 'update') {
            if (index !== -1) {
              if (newPos !== undefined) updatedSponsors.position[index] = newPos;
              if (newUrl !== undefined) updatedSponsors.url_logo[index] = newUrl;
              if (newType !== undefined) updatedSponsors.type_display[index] = newType;
            }
          }
    
          if (behavior === 'remove') {
            if (index !== -1) {
              updatedSponsors.code_logo.splice(index, 1);
              updatedSponsors.url_logo.splice(index, 1);
              updatedSponsors.position.splice(index, 1);
              updatedSponsors.type_display.splice(index, 1);
            }
          }
        });
    
        newSponsors.sponsors = updatedSponsors;
        return newSponsors;
      });
    
      setLastUpdateTime(Date.now());
    });
    

    // Lắng nghe cập nhật đơn vị truyền thông
    socketService.on('media_partners_updated', (data) => {
      // console.log('📝 [PublicMatchContext] media_partners_updated received:', data);
      setMediaPartners(prev => ({
        ...prev,
        ...data,
        // Append vào arrays thay vì replace
        url_logo: data.url_logo ?
          [...(prev.url_logo || []), ...data.url_logo] :
          (prev.url_logo || []),
        code_logo: data.code_logo ?
          [...(prev.code_logo || []), ...data.code_logo] :
          (prev.code_logo || []),
        position: data.position ?
          [...(prev.position || []), ...data.position] :
          (prev.position || []),
        type_display: data.type_display ?
          [...(prev.type_display || []), ...data.type_display] :
          (prev.type_display || [])
      }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật logo giải đấu
    socketService.on('tournament_logo_updated', (data) => {
      setTournamentLogo(prev => ({ ...prev, ...data.tournamentLogo }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật đơn vị live
    socketService.on('live_unit_updated', (data) => {
      setLiveUnit(prev => ({ ...prev, ...data.liveUnit }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật cài đặt poster
    socketService.on('poster_settings_updated', (data) => {
      setPosterSettings(prev => ({ ...prev, ...data.posterSettings }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật display settings
    socketService.on('display_settings_updated', (data) => {
      // console.log('📝 [PublicMatchContext] display_settings_updated received:', data);
      setDisplaySettings(prev => ({ ...prev, ...data }));
      setLastUpdateTime(Date.now());
    });

    // Lắng nghe cập nhật view hiện tại (MỚI) - KHÔNG update time để tránh re-render
    socketService.on('view_updated', (data) => {
      setCurrentView(data.viewType);
      // console.log('[Audio] View updated to:', data.viewType);
    });

    // Lắng nghe audio control events - để nhận referee voice từ CommentarySection
    socketService.on('audio_control', (data) => {
      console.log('🎙️ [PublicMatchContext] Received audio_control:', {
        command: data.command,
        target: data.target,
        dataSize: data.payload?.audioData?.byteLength || data.payload?.audioData?.length || 'unknown',
        mimeType: data.payload?.mimeType
      });

      if (data.target === 'display' && data.command === 'PLAY_REFEREE_VOICE' && data.payload) {
        const { audioData, mimeType } = data.payload;
        try {
          // Kiểm tra nhanh data type và size
          if (!audioData) {
            console.error('❌ No audio data provided');
            return;
          }

          let processedData = null;

          if (audioData instanceof ArrayBuffer && audioData.byteLength > 0) {
            console.log('🎙️ Processing ArrayBuffer, size:', audioData.byteLength, 'bytes');
            processedData = audioData;
          } else if (Array.isArray(audioData) && audioData.length > 0) {
            console.log('🎙️ Processing Array, converting to ArrayBuffer, size:', audioData.length, 'bytes');
            const uint8Array = new Uint8Array(audioData);
            processedData = uint8Array.buffer;
          } else if (audioData instanceof Uint8Array && audioData.length > 0) {
            console.log('🎙️ Processing Uint8Array, converting to ArrayBuffer, size:', audioData.length, 'bytes');
            processedData = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
          } else {
            console.error('❌ Unsupported audio data format:', {
              type: typeof audioData,
              isArrayBuffer: audioData instanceof ArrayBuffer,
              isArray: Array.isArray(audioData),
              isUint8Array: audioData instanceof Uint8Array,
              size: audioData?.byteLength || audioData?.length || 'unknown'
            });
            return;
          }

          // Validate processed data
          if (!processedData || processedData.byteLength === 0) {
            console.error('❌ Processed data is empty or invalid');
            return;
          }

          // Sử dụng mimeType từ payload hoặc fallback
          const finalMimeType = mimeType || 'audio/webm;codecs=opus';

          console.log('✅ Audio data processed successfully:', {
            originalSize: audioData?.byteLength || audioData?.length || 'unknown',
            processedSize: processedData.byteLength,
            mimeType: finalMimeType
          });

          // Truyền trực tiếp ArrayBuffer và mimeType cho audioUtils
          audioUtils.playRefereeVoice(processedData, finalMimeType);
          console.log('✅ [PublicMatchContext] Referee voice sent to audioUtils');

        } catch (error) {
          console.error('❌ Error processing referee voice in PublicMatchContext:', {
            error: error.message,
            stack: error.stack,
            audioDataType: typeof audioData,
            mimeType
          });
        }
      }
    });
    // Lắng nghe trạng thái kết nối
    socketService.on('disconnect', () => {
      setSocketConnected(false);
    });

    socketService.on('connect', () => {
      setSocketConnected(true);
    });
  }, [updateLastTime]);

  // Khởi tạo socket connection cho public route
  const initializeSocket = useCallback(async (accessCode) => {
    try {
      // Tránh khởi tạo socket trùng lặp
      if (currentAccessCode === accessCode && socketConnected) {
        return;
      }

      // Public route luôn sử dụng clientType 'display'
      await socketService.connect(accessCode, 'display');
      setSocketConnected(true);
      setCurrentAccessCode(accessCode);
      
      // Lắng nghe các event từ server
      setupSocketListeners();
    } catch (error) {
      console.error('Failed to initialize public socket:', error);
      setSocketConnected(false);
    }
  }, [currentAccessCode, socketConnected, setupSocketListeners]);

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
    organizing: organizing || { code_logo: [], url_logo: [], position: [], type_display: [] },
    mediaPartners: mediaPartners || { code_logo: [], url_logo: [], position: [], type_display: [] },
    tournamentLogo: tournamentLogo || { code_logo: [], url_logo: [] },
    liveUnit: liveUnit || { code_logo: [], url_logo: [], name: 'LIVE STREAMING', position: 'top-right' },
    posterSettings: posterSettings || { showTimer: true, showDate: true, showStadium: true, showLiveIndicator: true, backgroundOpacity: 0.8, textColor: '#ffffff', accentColor: '#3b82f6' },

    // Actions
    initializeSocket,
    disconnectSocket,

    // Setters for new states
    setLiveUnit,
    setPosterSettings,
    setDisplaySettings
  };

  return (
    <PublicMatchContext.Provider value={value}>
      {children}
    </PublicMatchContext.Provider>
  );
};

export default PublicMatchContext;
