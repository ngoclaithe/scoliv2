import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicAPI from '../../API/apiPublic';
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
import DynamicScoreboard from './DynamicScoreboard';
import DynamicPoster from './DynamicPoster';
import ScoreboardAbove from '../scoreboard_preview/ScoreboardAbove';
import ScoreboardBelowNew from '../scoreboard_preview/ScoreboardBelowNew';
import PenaltyScoreboard from '../scoreboard_preview/PenaltyScoreboard';
import PlayerList from '../lineup/PlayerList';
import Stat from '../sections/Stat';

const DynamicDisplayController = () => {
  const params = useParams();
  console.log('🌐 [DynamicDisplayController] Route params:', params);

  // Destructure all params
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

  // State riêng cho dynamic data
  const [dynamicData, setDynamicData] = useState({
    teamA: {
      name: "ĐỘI-A",
      score: 0,
      logo: null,
      kitColor: "#FF0000"
    },
    teamB: {
      name: "ĐỘI-B", 
      score: 0,
      logo: null,
      kitColor: "#0000FF"
    },
    matchTitle: "",
    stadium: "",
    liveText: "",
    matchTime: "00:00",
    view: "poster"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse và load data từ URL
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        setIsLoading(true);
        
        // Verify access code
        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);
        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        // Parse URL params
        const parsedData = {
          teamA: {
            name: parseTeamName(teamAName, 'ĐỘI-A'),
            score: parseNumberParam(teamAScore, 0),
            logo: null, // Sẽ được load sau
            kitColor: parseColorParam(teamAKitColor) || '#FF0000'
          },
          teamB: {
            name: parseTeamName(teamBName, 'ĐỘI-B'),
            score: parseNumberParam(teamBScore, 0),
            logo: null, // Sẽ được load sau
            kitColor: parseColorParam(teamBKitColor) || '#0000FF'
          },
          matchTitle: parseTextParam(matchTitle),
          stadium: parseTextParam(location),
          liveText: parseTextParam(liveText),
          matchTime: parseTextParam(matchTime),
          view: parseTextParam(view) || 'poster'
        };

        console.log('📊 [DynamicDisplayController] Parsed data:', parsedData);

        // Load team logos
        if (teamALogoCode || teamBLogoCode) {
          try {
            const { teamALogo, teamBLogo } = await findTeamLogos(teamALogoCode, teamBLogoCode);
            parsedData.teamA.logo = teamALogo;
            parsedData.teamB.logo = teamBLogo;
            console.log('🏆 [DynamicDisplayController] Loaded logos:', { teamALogo, teamBLogo });
          } catch (error) {
            console.error('❌ [DynamicDisplayController] Failed to load logos:', error);
          }
        }

        setDynamicData(parsedData);
        setIsLoading(false);

        console.log('✅ [DynamicDisplayController] Dynamic data loaded successfully');

      } catch (err) {
        console.error('❌ [DynamicDisplayController] Failed to load dynamic data:', err);
        setError('Không thể tải dữ li��u trận đấu');
        setIsLoading(false);
      }
    };

    if (accessCode) {
      loadDynamicData();
    }
  }, [accessCode, location, matchTitle, liveText, teamALogoCode, teamBLogoCode, teamAName, teamBName, teamAKitColor, teamBKitColor, teamAScore, teamBScore, view, matchTime]);

  // Render poster component theo type
  const renderPoster = (posterType) => {
    // Tạo props cho poster components
    const posterProps = {
      accessCode: accessCode,
      // Override data with dynamic data
      dynamicData: dynamicData
    };

    switch (posterType) {
      case 'haoquang':
        return <PosterHaoQuang {...posterProps} />;
      case 'tretrung':
        return <PosterTreTrung {...posterProps} />;
      case 'doden':
        return <PosterDoDen {...posterProps} />;
      case 'vangkim':
        return <PosterVangKim {...posterProps} />;
      case 'vangxanh':
        return <PosterVangXanh {...posterProps} />;
      case 'xanhduong':
        return <PosterXanhDuong {...posterProps} />;
      default:
        return <PosterHaoQuang {...posterProps} />;
    }
  };

  // Render component theo view
  const renderCurrentView = () => {
    const viewProps = {
      accessCode: accessCode,
      dynamicData: dynamicData
    };

    console.log('🎯 [DynamicDisplayController] Rendering view:', dynamicData.view);

    switch (dynamicData.view) {
      case 'intro':
        return <Intro {...viewProps} />;
      case 'halftime':
        return <HalfTime {...viewProps} />;
      case 'scoreboard':
        return <DynamicScoreboard dynamicData={dynamicData} type={1} />;
      case 'scoreboard_below':
        return <DynamicScoreboard dynamicData={dynamicData} type={2} />;
      case 'penalty_scoreboard':
        return <DynamicScoreboard dynamicData={dynamicData} type={3} />;
      case 'player_list':
        return <PlayerList {...viewProps} />;
      case 'stat':
        return <Stat {...viewProps} />;
      case 'poster':
      default:
        return <DynamicPoster dynamicData={dynamicData} posterType="tretrung" />;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold mb-2">Đang tải dữ liệu động...</h1>
          <p className="text-gray-300">Mã truy cập: {accessCode}</p>
          <div className="mt-4">
            <p className="text-gray-400 text-sm">
              {teamAName ? decodeURIComponent(teamAName.replace(/_/g, ' ')) : 'ĐỘI-A'} vs {teamBName ? decodeURIComponent(teamBName.replace(/_/g, ' ')) : 'ĐỘI-B'}
            </p>
            <p className="text-gray-500 text-xs">View: {view} | Time: {matchTime}</p>
          </div>
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
          <h1 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h1>
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
      <div className="w-full h-full">
        {renderCurrentView()}
      </div>
      
      {/* Debug info */}
      <div className="fixed bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded opacity-20 hover:opacity-100 transition-opacity">
        <div>Dynamic Mode | View: {dynamicData.view}</div>
        <div>{dynamicData.teamA.name} {dynamicData.teamA.score} - {dynamicData.teamB.score} {dynamicData.teamB.name}</div>
        <div>{dynamicData.stadium} | {dynamicData.matchTime}</div>
      </div>
    </div>
  );
};

export default DynamicDisplayController;
