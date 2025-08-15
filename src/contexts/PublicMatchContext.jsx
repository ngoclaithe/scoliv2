import React, { createContext, useContext, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import socketService from '../services/socketService';
import audioUtils from '../utils/audioUtils';
import { logRouteInfo, logSocketOperation } from '../utils/contextDebug';

const PublicMatchContext = createContext();

export const usePublicMatch = () => {
  const context = useContext(PublicMatchContext);
  if (!context) {
    throw new Error('usePublicMatch phải được sử dụng trong PublicMatchProvider');
  }
  return context;
};

export const PublicMatchProvider = ({ children }) => {
  const params = useParams();
  const location = useLocation();

  logRouteInfo(params, location);

  const hasUrlParams = useCallback(() => {
    const {
      location: routeLocation,
      matchTitle,
      liveText,
      teamALogoCode,
      teamBLogoCode,
      teamAName,
      teamBName,
      teamAKitColor,
      teamBKitColor,
      teamAScore,
      teamBScore,
      view,
      matchTime
    } = params;

    const hasParams = Boolean(
      routeLocation || matchTitle || liveText ||
      teamALogoCode || teamBLogoCode ||
      teamAName || teamBName ||
      teamAKitColor || teamBKitColor ||
      teamAScore || teamBScore ||
      view || matchTime
    );

    console.log('🔍 [PublicMatchContext] hasUrlParams result:', hasParams);
    return hasParams;
  }, [params]);

  const [canSendToSocket, setCanSendToSocket] = useState(false);
  const [matchData, setMatchData] = useState({
    teamA: {
      name: "ĐỘI-A",
      score: 0,
      logo: null,
      teamAKitColor: "#FF0000",
      teamBKitColor: "#0000FF",
      scoreSet: 0,
      teamAScorers: [],
    },
    teamB: {
      name: "ĐỘI-B",
      score: 0,
      logo: null,
      teamA2KitColor: "#FF0000",
      teamB2KitColor: "#0000FF",
      scoreSet: 0,
      teamBScorers: [],
    },
    matchTime: "00:00",
    period: "Chưa bắt đầu",
    status: "waiting",
    tournament: "",
    stadium: "",
    matchDate: "",
    liveText: "",
    matchTitle: "",
    typeMatch: "soccer"
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

  const [futsalErrors, setFutsalErrors] = useState({
    teamA: 0,
    teamB: 0
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
    tournamentLogo: {
      code_logo: [],
      url_logo: [],
      position: [],
      type_display: [],
      behavior: 'add'
    }
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
      setMatchData(prev => ({
        ...prev,
        ...data.matchInfo,
        teamA: {
          ...prev.teamA,
          teamAKitColor: data.matchInfo.teamAkitcolor || prev.teamA.teamAKitColor,
          teamA2KitColor: data.matchInfo.teamA2kitcolor || prev.teamA.teamA2KitColor
        },
        teamB: {
          ...prev.teamB,
          teamBKitColor: data.matchInfo.teamBkitcolor || prev.teamB.teamBKitColor,
          teamB2KitColor: data.matchInfo.teamB2kitcolor || prev.teamB.teamB2KitColor
        }
      }));
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
    socketService.on('team_score_set_updated', (data) => {
      console.log("Giá trị của data khi nhận team_score_set_updated là:", data);
      setMatchData(prev => ({
        ...prev,
        teamA: { ...prev.teamA, scoreSet: data.teamAScoreSet || 0 },
        teamB: { ...prev.teamB, scoreSet: data.teamBScoreSet || 0 }
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
      console.log('📝 [PublicMatchContext] poster_updated received:', data);
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

    socketService.on('match_title_updated', (data) => {
      setMatchData(prev => ({ ...prev, matchTitle: data.matchTitle }));
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

    socketService.on('futsal_errors_updated', (data) => {
      console.log('🚫 [PublicMatchContext] futsal_errors_updated received:', data);
      setFutsalErrors(prev => ({ ...prev, ...data.futsalErrors }));
      setLastUpdateTime(Date.now());
    });

    socketService.on('goal_scorers_updated', (data) => {
      const { team, scorer } = data;

      // Xác định đúng teamKey dựa trên cấu trúc state
      const teamKey = team === 'teamA' ? 'teamA' : 'teamB';
      const scorersKey = team === 'teamA' ? 'teamAScorers' : 'teamBScorers';

      setMatchData(prev => {
        const newState = { ...prev };

        if (!newState[teamKey][scorersKey]) {
          newState[teamKey][scorersKey] = [];
        }

        const currentScorers = [...newState[teamKey][scorersKey]];
        const existingPlayerIndex = currentScorers.findIndex(s => s.player === scorer.player);

        if (existingPlayerIndex >= 0) {
          const existingTimes = currentScorers[existingPlayerIndex].times || [];
          if (!existingTimes.includes(scorer.minute)) {
            currentScorers[existingPlayerIndex] = {
              ...currentScorers[existingPlayerIndex],
              times: [...existingTimes, scorer.minute].sort((a, b) => a - b)
            };
          }
        } else {
          currentScorers.push({
            player: scorer.player,
            times: [scorer.minute]
          });
        }

        newState[teamKey][scorersKey] = currentScorers;
        return newState;
      });
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

        const current = prev.organizing || {
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

        return { organizing: updatedOrganizing };
      });

      setLastUpdateTime(Date.now());
    });

    socketService.on('media_partners_updated', (data) => {
      console.log('📝 [PublicMatchContext] media_partners_updated received:', data);

      setMediaPartners(prev => {
        const behavior = data.behavior;
        const d = data.mediaPartners;

        if (!d || !Array.isArray(d.code_logo)) return prev;

        const current = prev.mediaPartners || {
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

        return { mediaPartners: updatedMediaPartners };
      });

      setLastUpdateTime(Date.now());
    });

    socketService.on('tournament_logo_updated', (data) => {
      console.log('📝 [PublicMatchContext] tournament_logo_updated received:', data);

      setTournamentLogo(prev => {
        const behavior = data.behavior;
        const d = data.tournamentLogo;

        if (!d || !Array.isArray(d.code_logo)) return prev;

        const current = prev || {
          url_logo: [],
          code_logo: [],
          position: [],
          type_display: [],
        };

        let updatedTournamentLogo = {
          url_logo: Array.isArray(current.url_logo) ? [...current.url_logo] : [],
          code_logo: Array.isArray(current.code_logo) ? [...current.code_logo] : [],
          position: Array.isArray(current.position) ? [...current.position] : [],
          type_display: Array.isArray(current.type_display) ? [...current.type_display] : [],
        };

        d.code_logo.forEach((code, i) => {
          const index = updatedTournamentLogo.code_logo.findIndex(c => c === code);
          const newUrl = d.url_logo?.[i];
          const newPos = d.position?.[i];
          const newType = d.type_display?.[i];

          if (behavior === 'add') {
            if (index === -1) {
              updatedTournamentLogo.code_logo.push(code);
              updatedTournamentLogo.url_logo.push(newUrl || '');
              updatedTournamentLogo.position.push(newPos || []);
              updatedTournamentLogo.type_display.push(newType || '');
            }
          }

          if (behavior === 'update') {
            if (index !== -1) {
              if (newPos !== undefined) updatedTournamentLogo.position[index] = newPos;
              if (newUrl !== undefined) updatedTournamentLogo.url_logo[index] = newUrl;
              if (newType !== undefined) updatedTournamentLogo.type_display[index] = newType;
            }
          }

          if (behavior === 'remove') {
            if (index !== -1) {
              updatedTournamentLogo.code_logo.splice(index, 1);
              updatedTournamentLogo.url_logo.splice(index, 1);
              updatedTournamentLogo.position.splice(index, 1);
              updatedTournamentLogo.type_display.splice(index, 1);
            }
          }
        });

        return updatedTournamentLogo;
      });

      setLastUpdateTime(Date.now());
    });


    socketService.on('live_unit_updated', (data) => {
      console.log('📝 [PublicMatchContext] live_unit_updated received:', data);
      setLiveUnit(prev => ({ ...prev, ...data.liveUnit }));

      if (data.liveUnit && (data.liveUnit.text)) {
        setMatchData(prev => ({
          ...prev,
          liveText: data.liveUnit.text || prev.liveText
        }));
      }

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

      console.log("Giá trị currentView", data.viewType);
      setCurrentView(data.viewType);
    });

    socketService.on('audio_control', (data) => {
      if (data.target === 'display' && data.command === 'PLAY_REFEREE_VOICE' && data.payload) {
        const { audioData, mimeType } = data.payload;
        try {
          if (!audioData || (Array.isArray(audioData) && audioData.length === 0)) {
            return;
          }

          // audioUtils.playRefereeVoice đã tự động detect và xử lý tất cả các format
          audioUtils.playRefereeVoice(audioData, mimeType);

        } catch (error) {
          console.error('❌ Error processing referee voice:', error.message);
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

  const setupRoomStatusListener = useCallback(() => {
    socketService.onRoomStatus((eventType, data) => {
      console.log(`🏠 [PublicMatchContext] Room event: ${eventType}`, data);

      if (eventType === 'room_joined' || eventType === 'join_roomed') {
        console.log('✅ [PublicMatchContext] Successfully joined room, processing current state from join_roomed...');

        if (data && data.currentState) {
          const state = data.currentState;

          if (state.matchData) {
            console.log('🔄 [PublicMatchContext] Updating matchData from join_roomed:', state.matchData);

            // Properly map backend scorers data to frontend structure
            const mappedMatchData = { ...state.matchData };

            if (mappedMatchData.teamA && mappedMatchData.teamA.scorers) {
              mappedMatchData.teamA.teamAScorers = mappedMatchData.teamA.scorers.map(scorer => ({
                player: scorer.player,
                times: scorer.score ? scorer.score.split(',').map(time => parseInt(time.trim())) : []
              }));
            }

            if (mappedMatchData.teamB && mappedMatchData.teamB.scorers) {
              mappedMatchData.teamB.teamBScorers = mappedMatchData.teamB.scorers.map(scorer => ({
                player: scorer.player,
                times: scorer.score ? scorer.score.split(',').map(time => parseInt(time.trim())) : []
              }));
            }

            setMatchData(prev => ({ ...prev, ...mappedMatchData }));
          }

          if (state.matchStats) {
            console.log('📊 [PublicMatchContext] Updating matchStats from join_roomed:', state.matchStats);
            // Kiểm tra nếu server trả về array thay vì object
            if (Array.isArray(state.matchStats)) {
              console.log('⚠️ [PublicMatchContext] Server returned array for matchStats, skipping update');
            } else {
              setMatchStats(prev => ({ ...prev, ...state.matchStats }));
            }
          }

          if (state.displaySettings) {
            console.log('🎨 [PublicMatchContext] Updating displaySettings from join_roomed:', state.displaySettings);
            setDisplaySettings(prev => ({ ...prev, ...state.displaySettings }));

            // Process logos from displaySettings.logos if they exist
            if (state.displaySettings.logos && Array.isArray(state.displaySettings.logos)) {
              console.log('🔄 [PublicMatchContext] Processing logos from displaySettings:', state.displaySettings.logos);

              // Separate logos by type
              const sponsorLogos = state.displaySettings.logos.filter(logo => logo.type === 'sponsors');
              const organizingLogos = state.displaySettings.logos.filter(logo => logo.type === 'organizing');
              const mediaPartnerLogos = state.displaySettings.logos.filter(logo => logo.type === 'media_partners');

              // Update sponsors if found
              if (sponsorLogos.length > 0) {
                const sponsorData = {
                  url_logo: sponsorLogos.map(logo => logo.urlLogo),
                  code_logo: sponsorLogos.map(logo => logo.codelogo),
                  position: sponsorLogos.map(logo => logo.position),
                  type_display: sponsorLogos.map(logo => logo.typeDisplay || 'square'),
                  behavior: 'add'
                };
                console.log('🏢 [PublicMatchContext] Setting sponsors from logos:', sponsorData);
                setSponsors({ sponsors: sponsorData });
              }

              // Update organizing if found
              if (organizingLogos.length > 0) {
                const organizingData = {
                  url_logo: organizingLogos.map(logo => logo.urlLogo),
                  code_logo: organizingLogos.map(logo => logo.codelogo),
                  position: organizingLogos.map(logo => logo.position),
                  type_display: organizingLogos.map(logo => logo.typeDisplay || 'square'),
                  behavior: 'add'
                };
                console.log('🏛️ [PublicMatchContext] Setting organizing from logos:', organizingData);
                console.log('🏛️ [PublicMatchContext] Total organizing logos found:', organizingLogos.length);
                setOrganizing({ organizing: organizingData });
              }

              // Update media partners if found
              if (mediaPartnerLogos.length > 0) {
                const mediaPartnerData = {
                  url_logo: mediaPartnerLogos.map(logo => logo.urlLogo),
                  code_logo: mediaPartnerLogos.map(logo => logo.codelogo),
                  position: mediaPartnerLogos.map(logo => logo.position),
                  type_display: mediaPartnerLogos.map(logo => logo.typeDisplay || 'square'),
                  behavior: 'add'
                };
                console.log('📺 [PublicMatchContext] Setting mediaPartners from logos:', mediaPartnerData);
                setMediaPartners({ mediaPartners: mediaPartnerData });
              }
            }
          }

          if (state.marqueeData) {
            console.log('📢 [PublicMatchContext] Updating marqueeData from join_roomed:', state.marqueeData);
            setMarqueeData(prev => ({ ...prev, ...state.marqueeData }));
          }

          if (state.penaltyData) {
            console.log('⚽ [PublicMatchContext] Updating penaltyData from join_roomed:', state.penaltyData);
            setPenaltyData(prev => ({ ...prev, ...state.penaltyData }));
          }

          if (state.lineupData) {
            console.log('📋 [PublicMatchContext] Updating lineupData from join_roomed:', state.lineupData);
            setLineupData(state.lineupData);
          }

          if (state.futsalErrors) {
            console.log('🚫 [PublicMatchContext] Updating futsalErrors from join_roomed:', state.futsalErrors);
            setFutsalErrors(prev => ({ ...prev, ...state.futsalErrors }));
          }

          // Also map futsal fouls from matchData if available
          if (state.matchData) {
            const teamAFouls = state.matchData.teamA?.futsalFouls;
            const teamBFouls = state.matchData.teamB?.futsalFouls;

            if (teamAFouls !== undefined || teamBFouls !== undefined) {
              setFutsalErrors(prev => ({
                teamA: teamAFouls !== undefined ? teamAFouls : prev.teamA,
                teamB: teamBFouls !== undefined ? teamBFouls : prev.teamB
              }));
            }
          }

          if (state.sponsors) {
            console.log('🏢 [PublicMatchContext] Updating sponsors from join_roomed:', state.sponsors);
            setSponsors(prev => ({ ...prev, sponsors: state.sponsors }));
          }

          if (state.organizing) {
            console.log('🏛️ [PublicMatchContext] Updating organizing from join_roomed:', state.organizing);
            console.log('🏛️ [PublicMatchContext] Total organizing items from state.organizing:', state.organizing?.url_logo?.length || 0);
            // Only update if no logos were processed from displaySettings.logos
            setOrganizing(prev => {
              const currentLogos = prev.organizing?.url_logo?.length || 0;
              if (currentLogos === 0) {
                return { ...prev, organizing: state.organizing };
              }
              console.log('🏛️ [PublicMatchContext] Skipping organizing update from state - already have', currentLogos, 'logos from displaySettings');
              return prev;
            });
          }

          if (state.mediaPartners) {
            console.log('📺 [PublicMatchContext] Updating mediaPartners from join_roomed:', state.mediaPartners);
            setMediaPartners(prev => ({ ...prev, mediaPartners: state.mediaPartners }));
          }

          if (state.tournamentLogo) {
            console.log('🏆 [PublicMatchContext] Updating tournamentLogo from join_roomed:', state.tournamentLogo);
            setTournamentLogo(state.tournamentLogo);
          }

          if (state.liveUnit) {
            console.log('[PublicMatchContext] Updating liveUnit from join_roomed:', state.liveUnit);
            setLiveUnit(prev => ({ ...prev, ...state.liveUnit }));
          }

          if (state.posterSettings) {
            console.log('🖼️ [PublicMatchContext] Updating posterSettings from join_roomed:', state.posterSettings);
            setPosterSettings(prev => ({ ...prev, ...state.posterSettings }));
          }

          if (state.view) {
            console.log('👁️ [PublicMatchContext] Updating currentView from join_roomed:', state.view);
            setCurrentView(state.view);
          }

          console.log('✅ [PublicMatchContext] All data updated from join_roomed event');
          setLastUpdateTime(Date.now());
        }
      } else if (eventType === 'room_error') {
        console.error('❌ [PublicMatchContext] Room join error:', data);
      } else if (eventType === 'room_left') {
        console.log('👋 [PublicMatchContext] Left room:', data);
      }
    });
  }, []);

  const initializeSocket = useCallback(async (accessCode, clientType = null) => {
    try {
      if (currentAccessCode === accessCode && socketConnected) {
        return;
      }

      // Xác định clientType dựa trên URL params
      const hasDynamicParams = hasUrlParams();
      const finalClientType = clientType || (hasDynamicParams ? 'admin' : 'display');

      console.log('🔌 [PublicMatchContext] Connecting with clientType:', finalClientType, 'hasDynamicParams:', hasDynamicParams);

      await socketService.connect(accessCode, finalClientType);
      setSocketConnected(true);
      setCurrentAccessCode(accessCode);
      setCanSendToSocket(hasDynamicParams);

      setupSocketListeners();
      setupRoomStatusListener();

      console.log('✅ [PublicMatchContext] Socket initialized successfully', {
        accessCode,
        clientType: finalClientType,
        canSend: hasDynamicParams
      });
    } catch (error) {
      console.error('❌ [PublicMatchContext] Failed to initialize socket:', error);
      setSocketConnected(false);
    }
  }, [currentAccessCode, socketConnected, setupSocketListeners, hasUrlParams]);

  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    setSocketConnected(false);
    setCurrentAccessCode(null);
  }, []);

  // ===== SENDING FUNCTIONS (CHỈ KHI CÓ URL PARAMS) =====

  const updateMatchInfo = useCallback((newMatchInfo) => {
    logSocketOperation('updateMatchInfo', newMatchInfo, canSendToSocket, socketConnected);
    if (canSendToSocket && socketConnected) {
      socketService.updateMatchInfo(newMatchInfo);
    }
  }, [canSendToSocket, socketConnected]);

  const updateScore = useCallback((teamAScore, teamBScore) => {
    logSocketOperation('updateScore', { teamAScore, teamBScore }, canSendToSocket, socketConnected);
    if (canSendToSocket && socketConnected) {
      socketService.updateScore(teamAScore, teamBScore);
    }
  }, [canSendToSocket, socketConnected]);

  const updateTeamNames = useCallback((teamAName, teamBName) => {
    logSocketOperation('updateTeamNames', { teamAName, teamBName }, canSendToSocket, socketConnected);
    if (canSendToSocket && socketConnected) {
      socketService.updateTeamNames(teamAName, teamBName);
    }
  }, [canSendToSocket, socketConnected]);

  const updateTeamLogos = useCallback((teamALogo, teamBLogo) => {
    logSocketOperation('updateTeamLogos', { teamALogo, teamBLogo }, canSendToSocket, socketConnected);
    if (canSendToSocket && socketConnected) {
      socketService.updateTeamLogos(teamALogo, teamBLogo);
    }
  }, [canSendToSocket, socketConnected]);

  const updateView = useCallback((viewType) => {
    logSocketOperation('updateView', { viewType }, canSendToSocket, socketConnected);
    if (canSendToSocket && socketConnected) {
      socketService.emit('view_update', { viewType });
    }
  }, [canSendToSocket, socketConnected]);

  const updateDisplaySettings = useCallback((newDisplaySettings) => {
    setDisplaySettings(prev => ({ ...prev, ...newDisplaySettings }));
    if (canSendToSocket && socketConnected) {
      console.log('🎨 [PublicMatchContext] Sending display settings update:', newDisplaySettings);
      socketService.updateDisplaySettings(newDisplaySettings);
    }
  }, [canSendToSocket, socketConnected]);

  const value = {
    // ===== STATE DATA =====
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
    currentAccessCode,
    currentView,
    organizing: organizing || { code_logo: [], url_logo: [], position: [], type_display: [] },
    mediaPartners: mediaPartners || { code_logo: [], url_logo: [], position: [], type_display: [] },
    tournamentLogo: tournamentLogo || { code_logo: [], url_logo: [], position: [], type_display: [] },
    liveUnit: liveUnit || { code_logo: [], url_logo: [], name: 'LIVE STREAMING', position: 'top-right' },
    posterSettings: posterSettings || { showTimer: true, showDate: true, showStadium: true, showLiveIndicator: true, backgroundOpacity: 0.8, textColor: '#ffffff', accentColor: '#3b82f6' },

    initializeSocket,
    disconnectSocket,

    setLiveUnit,
    setPosterSettings,
    setDisplaySettings,

    canSendToSocket,
    hasUrlParams: hasUrlParams(),
    updateMatchInfo,
    updateScore,
    updateTeamNames,
    updateTeamLogos,
    updateView,
    updateDisplaySettings
  };

  return (
    <PublicMatchContext.Provider value={value}>
      {children}
    </PublicMatchContext.Provider>
  );
};

export default PublicMatchContext;
