import React, { useEffect, useState, useRef } from 'react';
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
    currentView
  } = usePublicMatch();

  // Sử dụng AudioContext - đơn giản hóa
  const { playAudio, audioEnabled, stopCurrentAudio, toggleAudioEnabled } = useAudio();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [showAudioControl, setShowAudioControl] = useState(false);

  // Sử dụng useRef để lưu trữ previousView
  const prevViewRef = useRef();

  // Xử lý phát audio theo view - đơn giản hóa
  useEffect(() => {
    console.log('🎮 DisplayController audio effect:', {
      currentView,
      audioEnabled,
      prevView: prevViewRef.current
    });

    const viewChanged = prevViewRef.current !== currentView;
    if (!viewChanged || !audioEnabled || !currentView) {
      prevViewRef.current = currentView;
      return;
    }

    prevViewRef.current = currentView;

    let audioFile = null;

    // Xác định audio key dựa trên view hiện tại
    if (['intro', 'halftime', 'poster'].includes(currentView)) {
      audioFile = 'poster';
    } else if (currentView === 'scoreboard_below') {
      audioFile = 'rasan';
    } else if (currentView?.startsWith('scoreboard')) {
      audioFile = 'gialap';
    }

    if (audioFile) {
      console.log('🎮 Playing audio for view change:', { audioFile, currentView });
      playAudio(audioFile);
    }
  }, [currentView, audioEnabled, playAudio]);

  // Effect để xử lý audio enabled changes
  useEffect(() => {
    console.log('🎮 [DisplayController] Audio enabled changed:', audioEnabled);
    if (!audioEnabled) {
      console.log('🎮 [DisplayController] Audio disabled - stopping');
      stopCurrentAudio();
    }
  }, [audioEnabled]);

  // Khởi tạo kết nối socket
  useEffect(() => {
    let isCleanedUp = false;

    const initializeDisplay = async () => {
      try {
        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        console.log('🎮 Access code verified for display:', accessCode);
        await initializeSocket(accessCode);

        if (!isCleanedUp) {
          setIsInitialized(true);
        }

      } catch (err) {
        console.error('🎮 Failed to initialize display:', err);
        if (!isCleanedUp) {
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
  }, [accessCode]);

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

      {/* Audio Control Button - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        {!showAudioControl ? (
          <button
            onClick={() => setShowAudioControl(true)}
            className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
            title="Điều khiển âm thanh"
          >
            🎵
          </button>
        ) : (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white min-w-[140px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Audio</span>
              <button
                onClick={() => setShowAudioControl(false)}
                className="text-gray-300 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <button
              onClick={toggleAudioEnabled}
              className={`w-full px-3 py-2 rounded text-sm font-bold transition-all duration-200 ${
                audioEnabled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {audioEnabled ? "🔊 BẬT" : "🔇 TẮT"}
            </button>
            <div className="text-xs text-gray-300 mt-1 text-center">
              Code: {accessCode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayController;
