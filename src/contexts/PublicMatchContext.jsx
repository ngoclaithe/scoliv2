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
    teamAKitColor: "#FF0000",
    teamBKitColor: "#0000FF"
  });

  const [matchStats, setMatchStats] = useState({
    possession: { team1: 50, team2: 50 },
    totalShots: { team1: 0, team2: 0 },
    shotsOnTarget: { team1: 0, team2: 0 },
    corners: { team1: 0, team2: 0 },
    yellowCards: { team1: 0, team2: 0 },
    fouls: { team1: 0, team2: 0 },
  });

  const [penaltyData, setPenaltyData] = useState({
    teamAGoals: 0,
    teamBGoals: 0,
    currentTurn: 'teamA',
    shootHistory: [],
    status: 'ready',
    lastUpdated: null
  });

  const [marqueeData, setMarqueeData] = useState({
    text: '',
    mode: 'none',
    interval: 0,
    color: '#ffffff',
    fontSize: 16
  });

  const [displaySettings, setDisplaySettings] = useState({
    selectedSkin: 1,
    selectedPoster: 'tretrung',
    showStats: false,
    showPenalty: false,
    showLineup: false,
    logoShape: 'round',
    rotateDisplay: false,
    showTournamentLogo: true,
    showSponsors: true,
    showOrganizing: true,
    showMediaPartners: true
  });

  const [currentView, setCurrentView] = useState('poster');

  const [lineupData, setLineupData] = useState({
    teamA: [],
    teamB: []
  });

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
    organizing: {
      code_logo: [],
      url_logo: [],
      position: [],
      type_display: [],
      behavior: 'add'
    }
  });

  const [mediaPartners, setMediaPartners] = useState({
    mediaPartners: {
      code_logo: [],
      url_logo: [],
      position: [],
      type_display: [],
      behavior: 'add'
    }
  });

  const [tournamentLogo, setTournamentLogo] = useState({

  });

  const [liveUnit, setLiveUnit] = useState({
    code_logo: [],
    url_logo: [],
    name: 'LIVE STREAMING',
    position: 'top-right'
  });

  const [posterSettings, setPosterSettings] = useState({
    showTimer: true,
    showDate: true,
    showStadium: true,
    showLiveIndicator: true,
    backgroundOpacity: 0.8,
    textColor: '#ffffff',
    accentColor: '#3b82f6'
  });

  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [currentAccessCode, setCurrentAccessCode] = useState(null);

  const updateLastTime = useCallback(() => {
    setLastUpdateTime(Date.now());
  }, []);

  const setupSocketListeners = useCallback(() => {
    socketService.on('match_info_updated', (data) => {
      setMatchData(prev => ({ ...prev, ...data.matchInfo }));
      updateLastTime();
    });

    socketService.on('score_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, score: data.scores.teamA || data.scores.home || 0 },
        teamB: { ...prev.teamB, score: data.scores.teamB || data.scores.away || 0 }
      }));
      updateLastTime();
    });

    socketService.on('match_stats_updated', (data) => {
      setMatchStats(prev => ({ ...prev, ...data.stats }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('template_updated', (data) => {
      setDisplaySettings(prev => ({ ...prev, selectedSkin: data.templateId }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('poster_updated', (data) => {
      setDisplaySettings(prev => {
        const newSettings = { ...prev, selectedPoster: data.posterType };
        return newSettings;
      });
      setLastUpdateTime(Date.now());
    });

    socketService.on('team_logos_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, logo: data.logos.teamA || data.logos.home },
        teamB: { ...prev.teamB, logo: data.logos.teamB || data.logos.away }
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('team_names_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, name: data.names.teamA || data.names.home },
        teamB: { ...prev.teamB, name: data.names.teamB || data.names.away }
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('marquee_updated', (data) => {
      setMarqueeData(prev => ({ ...prev, ...data.marqueeData }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('match_time_updated', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.time.matchTime,
        period: data.time.period,
        status: data.time.status
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('timer_tick', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.displayTime
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('timer_started', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.initialTime,
        status: 'live'
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('timer_paused', (data) => {
      setMatchData(prev => ({
        ...prev,
        status: 'pause'
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('timer_resumed', (data) => {
      setMatchData(prev => ({
        ...prev,
        status: 'live'
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('timer_reset', (data) => {
      setMatchData(prev => ({
        ...prev,
        matchTime: data.resetTime || '00:00',
        status: 'waiting'
      }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('penalty_updated', (data) => {
      setPenaltyData(prev => ({ ...prev, ...data.penaltyData }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('lineup_updated', (data) => {
      setLineupData({
        teamA: data.lineupData.teamA || [],
        teamB: data.lineupData.teamB || []
      });
      setLastUpdateTime(Date.now());
    });

    socketService.on('sponsors_updated', (data) => {
      console.log('📝 [PublicMatchContext] sponsors_updated received:', data);
    
      setSponsors(prev => {
        const newSponsors = { ...prev };
        const behavior = data.behavior;
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

    socketService.on('organizing_updated', (data) => {
      console.log('📝 [PublicMatchContext] organizing_updated received:', data);
    
      setOrganizing(prev => {
        const behavior = data.behavior;
        const d = data.organizing;
    
        if (!d || !Array.isArray(d.code_logo)) return prev;
    
        const current = prev || {
          url_logo: [],
          code_logo: [],
          position: [],
          type_display: [],
        };
    
        let updatedOrganizing = {
          url_logo: [...current.url_logo],
          code_logo: [...current.code_logo],
          position: [...current.position],
          type_display: [...current.type_display],
        };
    
        d.code_logo.forEach((code, i) => {
          const index = updatedOrganizing.code_logo.findIndex(c => c === code);
          const newUrl = d.url_logo?.[i];
          const newPos = d.position?.[i];
          const newType = d.type_display?.[i];
    
          if (behavior === 'add') {
            if (index === -1) {
              updatedOrganizing.code_logo.push(code);
              updatedOrganizing.url_logo.push(newUrl || '');
              updatedOrganizing.position.push(newPos || []);
              updatedOrganizing.type_display.push(newType || '');
            }
          }
    
          if (behavior === 'update') {
            if (index !== -1) {
              if (newPos !== undefined) updatedOrganizing.position[index] = newPos;
              if (newUrl !== undefined) updatedOrganizing.url_logo[index] = newUrl;
              if (newType !== undefined) updatedOrganizing.type_display[index] = newType;
            }
          }
    
          if (behavior === 'remove') {
            if (index !== -1) {
              updatedOrganizing.code_logo.splice(index, 1);
              updatedOrganizing.url_logo.splice(index, 1);
              updatedOrganizing.position.splice(index, 1);
              updatedOrganizing.type_display.splice(index, 1);
            }
          }
        });
    
        return updatedOrganizing;
      });
    
      setLastUpdateTime(Date.now());
    });

    socketService.on('media_partners_updated', (data) => {
      console.log('📝 [PublicMatchContext] media_partners_updated received:', data);
    
      setMediaPartners(prev => {
        const behavior = data.behavior;
        const d = data.mediaPartners;
    
        if (!d || !Array.isArray(d.code_logo)) return prev;
    
        const current = prev || {
          url_logo: [],
          code_logo: [],
          position: [],
          type_display: [],
        };
    
        let updatedMediaPartners = {
          url_logo: [...current.url_logo],
          code_logo: [...current.code_logo],
          position: [...current.position],
          type_display: [...current.type_display],
        };
    
        d.code_logo.forEach((code, i) => {
          const index = updatedMediaPartners.code_logo.findIndex(c => c === code);
          const newUrl = d.url_logo?.[i];
          const newPos = d.position?.[i];
          const newType = d.type_display?.[i];
    
          if (behavior === 'add') {
            if (index === -1) {
              updatedMediaPartners.code_logo.push(code);
              updatedMediaPartners.url_logo.push(newUrl || '');
              updatedMediaPartners.position.push(newPos || []);
              updatedMediaPartners.type_display.push(newType || '');
            }
          }
    
          if (behavior === 'update') {
            if (index !== -1) {
              if (newPos !== undefined) updatedMediaPartners.position[index] = newPos;
              if (newUrl !== undefined) updatedMediaPartners.url_logo[index] = newUrl;
              if (newType !== undefined) updatedMediaPartners.type_display[index] = newType;
            }
          }
    
          if (behavior === 'remove') {
            if (index !== -1) {
              updatedMediaPartners.code_logo.splice(index, 1);
              updatedMediaPartners.url_logo.splice(index, 1);
              updatedMediaPartners.position.splice(index, 1);
              updatedMediaPartners.type_display.splice(index, 1);
            }
          }
        });
    
        return updatedMediaPartners;
      });
    
      setLastUpdateTime(Date.now());
    });

    socketService.on('tournament_logo_updated', (data) => {
      setTournamentLogo(prev => ({ ...prev, ...data.tournamentLogo }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('live_unit_updated', (data) => {
      setLiveUnit(prev => ({ ...prev, ...data.liveUnit }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('poster_settings_updated', (data) => {
      setPosterSettings(prev => ({ ...prev, ...data.posterSettings }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('display_settings_updated', (data) => {
      setDisplaySettings(prev => ({ ...prev, ...data }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('view_updated', (data) => {
      setCurrentView(data.viewType);
    });

    socketService.on('audio_control', (data) => {
      if (data.target === 'display' && data.command === 'PLAY_REFEREE_VOICE' && data.payload) {
        const { audioData, mimeType } = data.payload;
        try {
          let isValidData = false;
          let audioBlob = null;
    
          if (audioData instanceof ArrayBuffer && audioData.byteLength > 0) {
            audioBlob = new Blob([audioData], { type: mimeType || 'audio/webm' });
            isValidData = true;
          } else if (Array.isArray(audioData) && audioData.length > 0) {
            const uint8Array = new Uint8Array(audioData);
            audioBlob = new Blob([uint8Array], { type: mimeType || 'audio/webm' });
            isValidData = true;
          } else {
            return;
          }
    
          if (!audioBlob || audioBlob.size === 0) {
            return;
          }
    
          audioUtils.playRefereeVoice(audioBlob, mimeType);
    
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

    socketService.on('disconnect', () => {
      setSocketConnected(false);
    });

    socketService.on('connect', () => {
      setSocketConnected(true);
    });
  }, [updateLastTime]);

  const initializeSocket = useCallback(async (accessCode) => {
    try {
      if (currentAccessCode === accessCode && socketConnected) {
        return;
      }

      await socketService.connect(accessCode, 'display');
      setSocketConnected(true);
      setCurrentAccessCode(accessCode);
      
      setupSocketListeners();
    } catch (error) {
      setSocketConnected(false);
    }
  }, [currentAccessCode, socketConnected, setupSocketListeners]);

  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    setSocketConnected(false);
    setCurrentAccessCode(null);
  }, []);

  const value = {
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

    initializeSocket,
    disconnectSocket,

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