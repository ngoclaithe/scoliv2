import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAudio } from '../../contexts/AudioContext';
import PublicAPI from '../../API/apiPublic';
import socketService from '../../services/socketService';

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
import ScoreboardBelow from '../scoreboard_preview/ScoreboardBelow';

const DisplayController = () => {
  const { accessCode } = useParams();
  const {
    initializeSocket,
    displaySettings,
    socketConnected,
    lastUpdateTime,
    currentView // Thêm state để điều khiển view hiện tại
  } = usePublicMatch();

  // Sử dụng AudioContext
  const { playAudio } = useAudio();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Khởi tạo kết nối socket
  useEffect(() => {
    const initializeDisplay = async () => {
      try {
        // Xác thực access code
        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        console.log('Access code verified for display:', accessCode);

        // Khởi tạo socket connection
        await initializeSocket(accessCode);
        setIsInitialized(true);

        // Thiết lập audio event listeners
        setupAudioListeners();

      } catch (err) {
        console.error('Failed to initialize display:', err);
        setError('Không thể kết nối đến hệ thống');
      }
    };

    if (accessCode) {
      initializeDisplay();
    }
  }, [accessCode, initializeSocket]);

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

  // Hàm render component theo currentView từ context
  const renderCurrentView = () => {
    switch (currentView) {
      case 'intro':
        console.log('🚀 [DisplayController] Rendering Intro view');
        return <Intro accessCode={accessCode} />;
      case 'halftime':
        console.log('⏱️ [DisplayController] Rendering HalfTime view');
        return <HalfTime accessCode={accessCode} />;
      case 'scoreboard':
        console.log('📊 [DisplayController] Rendering ScoreboardAbove view');
        return <ScoreboardAbove accessCode={accessCode} />;
      case 'scoreboard_below':
        console.log('📊 [DisplayController] Rendering ScoreboardBelow view');
        return <ScoreboardBelow accessCode={accessCode} />;
      case 'poster':
        // Render poster theo selectedPoster với id mapping
        const posterType = displaySettings.selectedPoster?.id || displaySettings.selectedPoster;

        switch (posterType) {
          case 'haoquang':
            // console.log('✅ [DisplayController] Loading PosterHaoQuang');
            return <PosterHaoQuang accessCode={accessCode} />;
          case 'tretrung':
            // console.log('✅ [DisplayController] Loading PosterTreTrung');
            return <PosterTreTrung accessCode={accessCode} />;
          case 'doden':
            // console.log('✅ [DisplayController] Loading PosterDoDen');
            return <PosterDoDen accessCode={accessCode} />;
          case 'vangkim':
            // console.log('✅ [DisplayController] Loading PosterVangKim');
            return <PosterVangKim accessCode={accessCode} />;
          case 'vangxanh':
            // console.log('✅ [DisplayController] Loading PosterVangXanh');
            return <PosterVangXanh accessCode={accessCode} />;
          case 'xanhduong':
            // console.log('✅ [DisplayController] Loading PosterXanhDuong');
            return <PosterXanhDuong accessCode={accessCode} />;
          default:
            console.log('⚠️ [DisplayController] Unknown poster type, defaulting to PosterHaoQuang');
            return <PosterHaoQuang accessCode={accessCode} />;
        }
      default:
        // Mặc định hiển thị poster với id mapping
        const defaultPosterType = displaySettings.selectedPoster?.id || displaySettings.selectedPoster;

        switch (defaultPosterType) {
          case 'haoquang':
            console.log('✅ [DisplayController] Loading PosterHaoQuang (default)');
            return <PosterHaoQuang accessCode={accessCode} />;
          case 'tretrung':
            console.log('✅ [DisplayController] Loading PosterTreTrung (default)');
            return <PosterTreTrung accessCode={accessCode} />;
          case 'doden':
            console.log('✅ [DisplayController] Loading PosterDoDen (default)');
            return <PosterDoDen accessCode={accessCode} />;
          case 'vangkim':
            console.log('✅ [DisplayController] Loading PosterVangKim (default)');
            return <PosterVangKim accessCode={accessCode} />;
          case 'vangxanh':
            console.log('✅ [DisplayController] Loading PosterVangXanh (default)');
            return <PosterVangXanh accessCode={accessCode} />;
          case 'xanhduong':
            console.log('✅ [DisplayController] Loading PosterXanhDuong (default)');
            return <PosterXanhDuong accessCode={accessCode} />;
          default:
            console.log('⚠️ [DisplayController] Unknown poster type in default, defaulting to PosterHaoQuang');
            return <PosterHaoQuang accessCode={accessCode} />;
        }
    }
  };

  return (
    <div className="relative min-h-screen bg-white">

      {/* Current view content */}
      <div className="w-full h-full">
        {renderCurrentView()}
      </div>


    </div>
  );
};

export default DisplayController;
