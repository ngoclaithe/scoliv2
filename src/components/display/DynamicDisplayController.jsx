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

const DynamicDisplayController = () => {
  const params = useParams();
  console.log('🌐 [DynamicDisplayController] Route params:', params);

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
    teamBScore
  } = params;

  const {
    initializeSocket,
    displaySettings,
    currentView
  } = usePublicMatch();
  const { handleExpiredAccess } = useAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Parse và validate parameters từ URL
  const parseUrlParams = useCallback(() => {
    const params = {
      location: parseTextParam(location),
      matchTitle: parseTextParam(matchTitle),
      liveText: parseTextParam(liveText),
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

    console.log('🌐 [DynamicDisplayController] Parsed URL params:', params);
    return params;
  }, [location, matchTitle, liveText, teamALogoCode, teamBLogoCode, teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore]);

  // Gửi cập nhật lên socket khi có tham số từ URL
  const updateSocketWithParams = useCallback(async (params) => {
    if (!socketService.getConnectionStatus().isConnected) {
      console.warn('⚠️ [DynamicDisplayController] Socket not connected, cannot update parameters');
      return;
    }

    try {
      // Cập nhật thông tin trận đấu
      if (params.matchTitle || params.location) {
        const matchInfo = {
          matchTitle: params.matchTitle,
          stadium: params.location,
          liveText: params.liveText
        };
        console.log('📝 [DynamicDisplayController] Updating match info:', matchInfo);
        socketService.updateMatchInfo(matchInfo);
      }

      // Cập nhật tên đội
      if (params.teamA.name || params.teamB.name) {
        console.log('📛 [DynamicDisplayController] Updating team names:', params.teamA.name, params.teamB.name);
        socketService.updateTeamNames(params.teamA.name, params.teamB.name);
      }

      // Cập nhật tỉ số
      if (params.teamA.score !== undefined || params.teamB.score !== undefined) {
        console.log('⚽ [DynamicDisplayController] Updating scores:', params.teamA.score, params.teamB.score);
        socketService.updateScore(params.teamA.score, params.teamB.score);
      }

      // Cập nhật màu áo đội nếu có
      const matchInfoWithColors = {
        teamAKitColor: params.teamA.kitColor,
        teamBKitColor: params.teamB.kitColor
      };
      console.log('👕 [DynamicDisplayController] Updating kit colors:', matchInfoWithColors);
      socketService.updateMatchInfo(matchInfoWithColors);

      // Tìm và cập nhật logo đội dựa trên code
      if (params.teamA.logoCode || params.teamB.logoCode) {
        console.log('🏆 [DynamicDisplayController] Team logo codes received:', params.teamA.logoCode, params.teamB.logoCode);
        try {
          const { teamALogo, teamBLogo } = await findTeamLogos(params.teamA.logoCode, params.teamB.logoCode);
          if (teamALogo || teamBLogo) {
            console.log('🏆 [DynamicDisplayController] Found team logos, updating...', { teamALogo, teamBLogo });
            socketService.updateTeamLogos(teamALogo, teamBLogo);
          }
        } catch (error) {
          console.error('❌ [DynamicDisplayController] Failed to find team logos:', error);
        }
      }

    } catch (error) {
      console.error('❌ [DynamicDisplayController] Failed to update socket with params:', error);
    }
  }, []);

  // Khởi tạo kết nối socket và cập nhật parameters
  useEffect(() => {
    let isCleanedUp = false;

    const initializeDisplay = async () => {
      try {
        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        await initializeSocket(accessCode);

        if (!isCleanedUp) {
          setIsInitialized(true);
          
          // Parse parameters từ URL và gửi lên socket
          const params = parseUrlParams();
          if (Object.keys(params).length > 0) {
            // Delay một chút để đảm bảo socket đã kết nối hoàn toàn
            setTimeout(() => {
              updateSocketWithParams(params);
            }, 1000);
          }
        }
      } catch (err) {
        console.error('❌ [DynamicDisplayController] Failed to initialize display:', err);
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
  }, [accessCode, initializeSocket, handleExpiredAccess, parseUrlParams, updateSocketWithParams]);

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
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold mb-2">Đang kết nối...</h1>
          <p className="text-gray-300">Mã truy cập: {accessCode}</p>
          <div className="mt-4 w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
          {(teamAName || teamBName) && (
            <p className="text-gray-400 mt-2 text-sm">
              {teamAName ? decodeURIComponent(teamAName) : 'ĐỘI-A'} vs {teamBName ? decodeURIComponent(teamBName) : 'ĐỘI-B'}
            </p>
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
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-75 text-white p-2 text-xs z-50">
          <div>Dynamic Route Active</div>
          <div>Access: {accessCode}</div>
          <div>Teams: {teamAName} vs {teamBName}</div>
          <div>Score: {teamAScore}-{teamBScore}</div>
          <div>View: {currentView}</div>
        </div>
      )}

      <div className="w-full h-full">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default DynamicDisplayController;
