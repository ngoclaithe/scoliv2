import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAuth } from '../../contexts/AuthContext';
import PublicAPI from '../../API/apiPublic';
import socketService from '../../services/socketService';
import {
  findTeamLogos,
  parseColorParam,
  parseTeamName,
  parseTextParam,
  parseNumberParam
} from '../../utils/dynamicRouteUtils';

// Import các component hiển thị
import PosterTreTrung from '../../pages/Poster-tretrung';
import PosterHaoQuang from '../../pages/Poster-haoquang';
import PosterDoDen from '../../pages/Poster-doden';
import PosterVangKim from '../../pages/Poster-vangkim';
import PosterVangXanh from '../../pages/Poster-vangxanh';
import PosterXanhDuong from '../../pages/Poster-xanhduong';
import Intro from '../introduce/Intro';
import HalfTime from '../halftime/HalfTime';
import ScoreboardAbove from '../scoreboard_preview/ScoreboardAbove';
import ScoreboardBelowNew from '../scoreboard_preview/ScoreboardBelowNew';
import PenaltyScoreboard from '../scoreboard_preview/PenaltyScoreboard';
import PlayerList from '../lineup/PlayerList';
import Stat from '../sections/Stat';

const UnifiedDisplayController = () => {
  const params = useParams();
  console.log('🌐 [UnifiedDisplayController] Route params:', params);

  // Destructure all possible params
  const {
    accessCode,
    location,
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

  const {
    initializeSocket,
    displaySettings,
    currentView
  } = usePublicMatch();
  const { handleExpiredAccess } = useAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [isDynamicRoute, setIsDynamicRoute] = useState(false);

  // Kiểm tra xem có phải dynamic route không
  const checkIfDynamicRoute = useCallback(() => {
    const hasDynamicParams = Boolean(
      location || matchTitle || liveText || 
      teamALogoCode || teamBLogoCode || 
      teamAName || teamBName || 
      teamAKitColor || teamBKitColor || 
      teamAScore || teamBScore ||
      view || matchTime
    );
    
    console.log('🔍 [UnifiedDisplayController] Dynamic route check:', hasDynamicParams);
    return hasDynamicParams;
  }, [location, matchTitle, liveText, teamALogoCode, teamBLogoCode, teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore, view, matchTime]);

  // Parse và validate parameters từ URL (chỉ cho dynamic route)
  const parseUrlParams = useCallback(() => {
    if (!isDynamicRoute) return null;

    console.log('🔍 [UnifiedDisplayController] Raw URL params:', {
      location, matchTitle, liveText, teamALogoCode, teamBLogoCode,
      teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore,
      view, matchTime
    });

    const params = {
      location: parseTextParam(location),
      matchTitle: parseTextParam(matchTitle),
      liveText: parseTextParam(liveText),
      view: parseTextParam(view),
      matchTime: parseTextParam(matchTime),
      teamA: {
        name: parseTeamName(teamAName, 'ĐỘI-A'),
        score: parseNumberParam(teamAScore, 0),
        logoCode: teamALogoCode || '',
        kitColor: parseColorParam(teamAKitColor) || '#FF0000'
      },
      teamB: {
        name: parseTeamName(teamBName, 'ĐỘI-B'),
        score: parseNumberParam(teamBScore, 0),
        logoCode: teamBLogoCode || '',
        kitColor: parseColorParam(teamBKitColor) || '#0000FF'
      }
    };

    console.log('🌐 [UnifiedDisplayController] Parsed URL params:', params);
    return params;
  }, [isDynamicRoute, location, matchTitle, liveText, teamALogoCode, teamBLogoCode, teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore, view, matchTime]);

  // Chờ socket connection và gửi cập nhật
  const waitForSocketAndUpdate = useCallback(async (params, maxAttempts = 10) => {
    if (!params) return;

    console.log('⏳ [UnifiedDisplayController] Waiting for socket connection...');

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (socketService.getConnectionStatus().isConnected) {
        console.log(`✅ [UnifiedDisplayController] Socket connected on attempt ${attempt}, updating params...`);
        await updateSocketWithParams(params);
        return;
      }

      console.log(`⏳ [UnifiedDisplayController] Attempt ${attempt}/${maxAttempts}, socket not ready yet...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.error('❌ [UnifiedDisplayController] Socket connection timeout after', maxAttempts, 'attempts');
  }, []);

  // Gửi cập nhật lên socket khi có tham số từ URL
  const updateSocketWithParams = useCallback(async (params) => {
    if (!params) return;

    console.log('🔄 [UnifiedDisplayController] updateSocketWithParams called with:', params);

    try {
      // Cập nhật view nếu có (ưu tiên đầu tiên)
      if (params.view) {
        console.log('👁️ [UnifiedDisplayController] Updating view:', params.view);
        socketService.emit('view_update', { viewType: params.view });
      }

      // Cập nhật thông tin trận đấu
      if (params.matchTitle || params.location || params.liveText || params.matchTime) {
        const matchInfo = {
          matchTitle: params.matchTitle,
          stadium: params.location,
          liveText: params.liveText,
          matchTime: params.matchTime
        };
        console.log('📝 [UnifiedDisplayController] Updating match info:', matchInfo);
        socketService.updateMatchInfo(matchInfo);
      }

      // Cập nhật tên đội
      if (params.teamA.name || params.teamB.name) {
        console.log('📛 [UnifiedDisplayController] Updating team names:', params.teamA.name, params.teamB.name);
        socketService.updateTeamNames(params.teamA.name, params.teamB.name);
      }

      // Cập nhật tỉ số
      if (params.teamA.score !== undefined || params.teamB.score !== undefined) {
        console.log('⚽ [UnifiedDisplayController] Updating scores:', params.teamA.score, params.teamB.score);
        socketService.updateScore(params.teamA.score, params.teamB.score);
      }

      // Cập nhật màu áo đội nếu có
      const matchInfoWithColors = {
        teamAKitColor: params.teamA.kitColor,
        teamBKitColor: params.teamB.kitColor
      };
      console.log('👕 [UnifiedDisplayController] Updating kit colors:', matchInfoWithColors);
      socketService.updateMatchInfo(matchInfoWithColors);

      // Tìm và cập nhật logo đội dựa trên code
      if (params.teamA.logoCode || params.teamB.logoCode) {
        console.log('🏆 [UnifiedDisplayController] Team logo codes received:', params.teamA.logoCode, params.teamB.logoCode);
        try {
          const { teamALogo, teamBLogo } = await findTeamLogos(params.teamA.logoCode, params.teamB.logoCode);
          if (teamALogo || teamBLogo) {
            console.log('🏆 [UnifiedDisplayController] Found team logos, updating...', { teamALogo, teamBLogo });
            socketService.updateTeamLogos(teamALogo, teamBLogo);
          }
        } catch (error) {
          console.error('❌ [UnifiedDisplayController] Failed to find team logos:', error);
        }
      }

    } catch (error) {
      console.error('❌ [UnifiedDisplayController] Failed to update socket with params:', error);
    }
  }, []);

  // Khởi tạo kết nối socket và cập nhật parameters
  useEffect(() => {
    let isCleanedUp = false;

    const initializeDisplay = async () => {
      try {
        // Kiểm tra loại route trước
        const isDynamic = checkIfDynamicRoute();
        setIsDynamicRoute(isDynamic);
        
        console.log(`🎯 [UnifiedDisplayController] Route type: ${isDynamic ? 'Dynamic' : 'Standard'}`);

        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        await initializeSocket(accessCode);

        if (!isCleanedUp) {
          setIsInitialized(true);
          console.log('✅ [UnifiedDisplayController] Initialized successfully');

          // Chỉ xử lý parameters nếu là dynamic route
          if (isDynamic) {
            const params = parseUrlParams();
            console.log('📋 [UnifiedDisplayController] About to update socket with params:', params);

            if (params && Object.keys(params).length > 0) {
              // Sử dụng method chờ socket connection mới
              console.log('⏰ [UnifiedDisplayController] Starting socket wait process...');
              waitForSocketAndUpdate(params);
            }
          }
        }
      } catch (err) {
        console.error('❌ [UnifiedDisplayController] Failed to initialize display:', err);
        if (!isCleanedUp) {
          if (handleExpiredAccess && handleExpiredAccess(err)) {
            return;
          }
          setError('Không thể kết nối đến hệ thống');
        }
      }
    };

    if (accessCode && !isCleanedUp) {
      initializeDisplay();
    }

    return () => {
      isCleanedUp = true;
    };
  }, [accessCode, initializeSocket, handleExpiredAccess, checkIfDynamicRoute, parseUrlParams, updateSocketWithParams]);

  // Render poster component theo type
  const renderPoster = (posterType) => {
    switch (posterType) {
      case 'haoquang':
        return <PosterHaoQuang accessCode={accessCode} />;
      case 'tretrung':
        return <PosterTreTrung accessCode={accessCode} />;
      case 'doden':
        return <PosterDoDen accessCode={accessCode} />;
      case 'vangkim':
        return <PosterVangKim accessCode={accessCode} />;
      case 'vangxanh':
        return <PosterVangXanh accessCode={accessCode} />;
      case 'xanhduong':
        return <PosterXanhDuong accessCode={accessCode} />;
      default:
        return <PosterHaoQuang accessCode={accessCode} />;
    }
  };

  // Render component theo currentView
  const renderCurrentView = () => {
    // Ưu tiên view từ URL params nếu có (cho dynamic route)
    const viewToRender = (isDynamicRoute && view) ? view : currentView;
    console.log('🎯 [UnifiedDisplayController] Rendering view:', viewToRender, '(isDynamic:', isDynamicRoute, ', urlView:', view, ', contextView:', currentView, ')');

    switch (viewToRender) {
      case 'intro':
        return <Intro accessCode={accessCode} />;
      case 'halftime':
        return <HalfTime accessCode={accessCode} />;
      case 'scoreboard':
        return <ScoreboardAbove accessCode={accessCode} />;
      case 'scoreboard_below':
        return <ScoreboardBelowNew
          accessCode={accessCode}
          type={displaySettings.selectedSkin || 1}
        />;
      case 'penalty_scoreboard':
        return <PenaltyScoreboard
          accessCode={accessCode}
          type={displaySettings.selectedSkin || 1}
        />;
      case 'player_list':
        return <PlayerList accessCode={accessCode} />;
      case 'stat':
        return <Stat accessCode={accessCode} />;
      case 'poster':
      default:
        const posterType = displaySettings.selectedPoster?.id || displaySettings.selectedPoster;
        return renderPoster(posterType);
    }
  };

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">��</div>
          <h1 className="text-2xl font-bold mb-2">Đang kết nối...</h1>
          <p className="text-gray-300">Mã truy cập: {accessCode}</p>
          <div className="mt-4 w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
          {isDynamicRoute && (teamAName || teamBName) && (
            <>
              <p className="text-gray-400 mt-2 text-sm">
                {teamAName ? decodeURIComponent(teamAName) : 'ĐỘI-A'} vs {teamBName ? decodeURIComponent(teamBName) : 'ĐỘI-B'}
              </p>
              {view && <p className="text-gray-500 mt-1 text-xs">View: {decodeURIComponent(view)}</p>}
              {matchTime && <p className="text-gray-500 mt-1 text-xs">Time: {decodeURIComponent(matchTime)}</p>}
            </>
          )}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-red-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Lỗi kết nối</h1>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Th��� lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">

      <div className="w-full h-full">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default UnifiedDisplayController;
