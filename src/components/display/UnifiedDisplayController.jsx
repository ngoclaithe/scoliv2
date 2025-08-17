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

import PosterTreTrung from '../../pages/Poster-tretrung';
import PosterHaoQuang from '../../pages/Poster-haoquang';
import PosterDoDen from '../../pages/Poster-doden';
import PosterVangKim from '../../pages/Poster-vangkim';
import PosterVangXanh from '../../pages/Poster-vangxanh';
import PosterXanhDuong from '../../pages/Poster-xanhduong';
import PosterTuHung from '../../pages/Poster-tuhung';
import Intro from '../introduce/Intro';
import HalfTime from '../halftime/HalfTime';
import ScoreboardAbove from '../scoreboard_preview/ScoreboardAbove';
import ScoreboardBelowNew from '../scoreboard_preview/ScoreboardBelowNew';
import PenaltyScoreboard from '../scoreboard_preview/PenaltyScoreboard';
import PlayerList from '../lineup/PlayerList';
import Stat from '../sections/Stat';
import Event from '../sections/Event';
const UnifiedDisplayController = () => {
  const params = useParams();
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
    currentView,
    canSendToSocket,
    hasUrlParams,
    updateMatchInfo,
    updateScore,
    updateTeamNames,
    updateTeamLogos,
    updateView
  } = usePublicMatch();
  const { handleExpiredAccess } = useAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [isDynamicRoute, setIsDynamicRoute] = useState(false);

  const checkIfDynamicRoute = useCallback(() => {
    const hasDynamicParams = Boolean(
      location || matchTitle || liveText || 
      teamALogoCode || teamBLogoCode || 
      teamAName || teamBName || 
      teamAKitColor || teamBKitColor || 
      teamAScore || teamBScore ||
      view || matchTime
    );
    
    return hasDynamicParams;
  }, [location, matchTitle, liveText, teamALogoCode, teamBLogoCode, teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore, view, matchTime]);

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

    // console.log('🌐 [UnifiedDisplayController] Parsed URL params:', params);
    return params;
  }, [isDynamicRoute, location, matchTitle, liveText, teamALogoCode, teamBLogoCode, teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore, view, matchTime]);

  const updateSocketWithParams = useCallback(async (params) => {
    if (!params || !canSendToSocket) {
      // console.log('⚠️ [UnifiedDisplayController] Cannot send params - canSend:', canSendToSocket);
      return;
    }

    // console.log('🔄 [UnifiedDisplayController] updateSocketWithParams called with:', params);
    // console.log('✅ [UnifiedDisplayController] Using PublicMatchContext sending functions...');

    try {
      if (params.matchTitle || params.location || params.matchTime || params.liveText) {
        const matchInfo = {
          matchTitle: params.matchTitle,
          stadium: params.location,
          liveText: params.liveText,
          matchTime: params.matchTime,
          teamAKitColor: params.teamA.kitColor,
          teamBKitColor: params.teamB.kitColor
        };
        // console.log('📝 [UnifiedDisplayController] Updating match info via context:', matchInfo);
        updateMatchInfo(matchInfo);
      }

      if (params.view) {
        // console.log('👁️ [UnifiedDisplayController] Updating view via context:', params.view);
        updateView(params.view);
      }

      if (params.teamA.name || params.teamB.name) {
        // console.log('📛 [UnifiedDisplayController] Updating team names via context:', params.teamA.name, params.teamB.name);
        updateTeamNames(params.teamA.name, params.teamB.name);
      }

      if (params.teamA.score !== undefined || params.teamB.score !== undefined) {
        // console.log('⚽ [UnifiedDisplayController] Updating scores via context:', params.teamA.score, params.teamB.score);
        updateScore(params.teamA.score, params.teamB.score);
      }

      if (params.teamA.logoCode || params.teamB.logoCode) {
        // console.log('🏆 [UnifiedDisplayController] Team logo codes received:', params.teamA.logoCode, params.teamB.logoCode);
        try {
          const { teamALogo, teamBLogo } = await findTeamLogos(params.teamA.logoCode, params.teamB.logoCode);
          if (teamALogo || teamBLogo) {
            // console.log('🏆 [UnifiedDisplayController] Found team logos, updating via context...', { teamALogo, teamBLogo });
            updateTeamLogos(teamALogo, teamBLogo);
          }
        } catch (error) {
          console.error('❌ [UnifiedDisplayController] Failed to find team logos:', error);
        }
      }

      // Auto start timer nếu có matchTime (giống ControlButtons.jsx)
      if (params.matchTime && params.matchTime !== '00:00') {
        console.log('⏰ [UnifiedDisplayController] Auto starting timer with time:', params.matchTime);

        // Delay để đảm bảo socket đã sẵn sàng
        setTimeout(() => {
          try {
            console.log('🎯 [UnifiedDisplayController] Starting timer - calling startServerTimer:', {
              startTime: params.matchTime,
              period: "Hiệp 1",
              status: "live"
            });

            socketService.startServerTimer(params.matchTime, "Hiệp 1", "live");

            // Switch to scoreboard view if not specified
            if (!params.view || params.view === 'poster') {
              console.log('👁️ [UnifiedDisplayController] Switching to scoreboard view for timer');
              updateView('scoreboard');
            }
          } catch (error) {
            console.error('❌ [UnifiedDisplayController] Failed to start timer:', error);
          }
        }, 2000);
      }

    } catch (error) {
      console.error('❌ [UnifiedDisplayController] Failed to update socket with params:', error);
    }
  }, [canSendToSocket, updateMatchInfo, updateView, updateTeamNames, updateScore, updateTeamLogos]);

  useEffect(() => {
    let isCleanedUp = false;

    const initializeDisplay = async () => {
      try {
        const isDynamic = checkIfDynamicRoute();
        setIsDynamicRoute(isDynamic);
        
        // console.log(`🎯 [UnifiedDisplayController] Route type: ${isDynamic ? 'Dynamic' : 'Standard'}, hasUrlParams:`, hasUrlParams);

        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          if (verifyResult.message && (
            verifyResult.message.includes('hết hạn') ||
            verifyResult.message.includes('expired') ||
            verifyResult.message.includes('không hợp lệ')
          )) {
            setError(`❌ Mã truy cập đã hết hạn hoặc không hợp lệ: ${accessCode}\n\n⏰ Vui lòng liên hệ admin để cấp mã mới.`);
          } else {
            setError(`❌ Mã truy cập không hợp lệ: ${accessCode}\n\n${verifyResult.message || 'Vui lòng kiểm tra lại mã truy cập.'}`);
          }
          return;
        }

        await initializeSocket(accessCode);

        if (!isCleanedUp) {
          setIsInitialized(true);
          // console.log('��� [UnifiedDisplayController] Initialized successfully');

          if (isDynamic && hasUrlParams) {
            const params = parseUrlParams();
            // console.log('📋 [UnifiedDisplayController] About to update socket with params:', params);
            // console.log('🔧 [UnifiedDisplayController] canSendToSocket:', canSendToSocket);

            if (params && Object.keys(params).length > 0) {
              // console.log('⏰ [UnifiedDisplayController] Setting timeout to update socket params...');

              setTimeout(() => {
                updateSocketWithParams(params);
              }, 1500);

              setTimeout(() => {
                updateSocketWithParams(params);
              }, 3000);
            }
          }
        }
      } catch (err) {
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
  }, [accessCode, initializeSocket, handleExpiredAccess, checkIfDynamicRoute, parseUrlParams, updateSocketWithParams, canSendToSocket, hasUrlParams]);

  const renderPoster = (posterType) => {
    // Kiểm tra nếu là custom poster (poster upload)
    if (displaySettings.selectedPoster && displaySettings.selectedPoster.isCustom) {
      const customPoster = displaySettings.selectedPoster;
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <img
            src={customPoster.thumbnail || customPoster.serverData?.file_path}
            alt={customPoster.name}
            className="max-w-full max-h-full object-contain"
            style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
          />
        </div>
      );
    }

    // Render poster template mặc định
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
      case 'tuhung':
        return <PosterTuHung accessCode={accessCode} />;
      default:
        return <PosterHaoQuang accessCode={accessCode} />;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
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
      case 'event':
        return <Event accessCode={accessCode} />;  
      case 'poster':
      default:
        const posterType = displaySettings.selectedPoster?.id || displaySettings.selectedPoster;
        return renderPoster(posterType);
    }
  };

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚽</div>
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

  if (error) {
    const isExpiredError = error.includes('hết hạn') || error.includes('expired');

    return (
      <div className={`fixed inset-0 ${isExpiredError ? 'bg-gradient-to-br from-red-900 via-red-800 to-red-900' : 'bg-red-900'} text-white flex items-center justify-center p-4`}>
        <div className="text-center max-w-lg">
          <div className={`text-6xl mb-4 ${isExpiredError ? 'animate-pulse' : ''}`}>
            {isExpiredError ? '⏰' : '❌'}
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isExpiredError ? 'Mã truy cập hết hạn' : 'Lỗi kết nối'}
          </h1>
          <div className="text-gray-200 mb-6 whitespace-pre-line text-sm leading-relaxed">
            {error}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Thử lại
            </button>
            {isExpiredError && (
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🏠 Về trang chủ
              </button>
            )}
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Access Code: {accessCode}
          </div>
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
