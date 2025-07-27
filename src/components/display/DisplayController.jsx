import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import PublicAPI from '../../API/apiPublic';

// Import các component hiển thị
import PosterTreTrung from '../../pages/Poster-tretrung';
import PosterHaoQuang from '../../pages/Poster-haoquang';
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
        return <Intro accessCode={accessCode} />;
      case 'halftime':
        return <HalfTime accessCode={accessCode} />;
      case 'scoreboard':
        return <ScoreboardAbove accessCode={accessCode} />;
      case 'scoreboard_below':
        return <ScoreboardBelow accessCode={accessCode} />;
      case 'poster':
        // Render poster theo selectedPoster
        switch (displaySettings.selectedPoster) {
          case 'haoquang':
            return <PosterHaoQuang accessCode={accessCode} />;
          case 'tretrung':
          default:
            return <PosterTreTrung accessCode={accessCode} />;
        }
      default:
        // Mặc định hiển thị poster
        switch (displaySettings.selectedPoster) {
          case 'haoquang':
            return <PosterHaoQuang accessCode={accessCode} />;
          case 'tretrung':
          default:
            return <PosterTreTrung accessCode={accessCode} />;
        }
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Connection status indicator */}
      <div className="absolute top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
          socketConnected 
            ? 'bg-green-600/80 text-white' 
            : 'bg-red-600/80 text-white animate-pulse'
        }`}>
          {socketConnected ? '🟢 Kết nối' : '🔴 Mất kết nối'}
        </div>
        <div className="text-xs text-gray-300 mt-1 bg-black/50 px-2 py-1 rounded">
          Code: {accessCode}
        </div>
        <div className="text-xs text-gray-300 bg-black/50 px-2 py-1 rounded">
          View: {currentView || 'poster'}
        </div>
        <div className="text-xs text-gray-300 bg-black/50 px-2 py-1 rounded">
          Last: {new Date(lastUpdateTime).toLocaleTimeString()}
        </div>
      </div>

      {/* Current view content */}
      <div className="w-full h-full">
        {renderCurrentView()}
      </div>

      {/* Debug info (chỉ hiện khi development) */}
    </div>
  );
};

export default DisplayController;
