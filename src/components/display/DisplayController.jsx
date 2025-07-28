import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAudio } from '../../contexts/AudioContext';
import PublicAPI from '../../API/apiPublic';
import MediaSourceAudio from '../audio/MediaSourceAudio';

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
    currentView // Thêm state để điều khiển view hiện tại
  } = usePublicMatch();

  // Sử dụng AudioContext
  const { playAudio, audioEnabled } = useAudio();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [currentAudioFile, setCurrentAudioFile] = useState(null);

  // Khởi tạo kết nối socket và thiết lập audio listeners
  useEffect(() => {
    let isCleanedUp = false;

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

        if (!isCleanedUp) {
          setIsInitialized(true);
        }

      } catch (err) {
        console.error('Failed to initialize display:', err);
        if (!isCleanedUp) {
          setError('Không thể kết nối đến hệ thống');
        }
      }
    };


    if (accessCode && !isCleanedUp) {
      initializeDisplay();

    }

    // Cleanup function
    return () => {
      isCleanedUp = true;
    };
  }, [accessCode]); // Chỉ dependency accessCode

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
        return <Intro accessCode={accessCode} />;
      case 'halftime':
        return <HalfTime accessCode={accessCode} />;
      case 'scoreboard':
        return <ScoreboardAbove accessCode={accessCode} />;
      case 'scoreboard_below':
        return <ScoreboardBelow accessCode={accessCode} />;
      case 'poster':
        // Render poster theo selectedPoster với id mapping
        const posterType = displaySettings.selectedPoster?.id || displaySettings.selectedPoster;

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
      default:
        // Mặc định hiển thị poster với id mapping
        const defaultPosterType = displaySettings.selectedPoster?.id || displaySettings.selectedPoster;

        switch (defaultPosterType) {
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
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Current view content */}
      <div className="w-full h-full">
        {renderCurrentView()}
      </div>

      {/* MediaSource Audio Player (when audio is OFF) */}
      <MediaSourceAudio
        audioFile={currentAudioFile}
        isEnabled={!audioEnabled && currentAudioFile}
        onEnded={() => setCurrentAudioFile(null)}
      />
    </div>
  );
};

export default DisplayController;
