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

  // Sử dụng AudioContext - lấy cả playAudio và playRefereeVoice
  const { playAudio, playRefereeVoice, audioEnabled } = useAudio();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Sử dụng useRef để lưu trữ previousView
  const prevViewRef = useRef();

  // Lắng nghe event audio_control từ backend để phát voice trọng tài
  useEffect(() => {
    console.log('🎮 [DisplayController] Registering audio_control listener for referee voice');

    const handleAudioControl = (data) => {
      console.log('🎮 [DisplayController] Received audio_control:', data);

      // Chỉ xử lý voice trọng tài, các audio kh��c đã được chuyển sang MatchManagementSection
      if (data.command === 'PLAY_REFEREE_VOICE' && data.payload) {
        console.log('🎮 [DisplayController] Received referee voice from backend');
        const { audioData, mimeType } = data.payload;

        try {
          // Chuyển audioData từ array về Uint8Array
          const uint8Array = new Uint8Array(audioData);
          const audioBlob = new Blob([uint8Array], { type: mimeType || 'audio/webm' });
          playRefereeVoice(audioBlob);
        } catch (error) {
          console.error('❌ [DisplayController] Error processing referee voice:', error);
        }
      }
    };

    // Đăng ký lắng nghe audio_control
    socketService.onAudioControl(handleAudioControl);

    // Cleanup
    return () => {
      console.log('🧹 [DisplayController] Unregistering audio_control listener');
      socketService.off('audio_control', handleAudioControl);
    };

    prevViewRef.current = currentView;
  }, [currentView, playRefereeVoice]); // Thêm playRefereeVoice vào dependencies

  // DisplayController không cần xử lý audio enabled changes nữa
  // Audio sẽ được quản lý từ MatchManagementSection và voice từ CommentarySection

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
  }, [accessCode, initializeSocket]);

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold mb-2">Đang kết nối...</h1>
          <p className="text-gray-300">Mã truy c���p: {accessCode}</p>
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


    </div>
  );
};

export default DisplayController;
