import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAudio } from '../../contexts/AudioContext';
import PublicAPI from '../../API/apiPublic';
import MediaSourceAudio from '../audio/MediaSourceAudio';
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
    currentView // Thêm state để điều khiển view hiện tại
  } = usePublicMatch();

  // Sử dụng AudioContext
  const { playAudio, audioEnabled, stopCurrentAudio, forceStopAudio } = useAudio();

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [currentAudioFile, setCurrentAudioFile] = useState(null);

  // Sử dụng useRef để lưu trữ previousView và prevent duplicate calls
  const prevViewRef = useRef();
  const lastAudioPlayedRef = useRef();

  // Xử lý phát audio theo view
  useEffect(() => {
    console.log('🎮 DisplayController audio effect triggered:', {
      currentView,
      audioEnabled,
      prevView: prevViewRef.current,
      prevAudioEnabled: prevViewRef.audioEnabled
    });

    // Chỉ xử lý nếu view thay đổi và audio được bật
    const viewChanged = prevViewRef.current !== currentView;
    const audioEnabledChanged = prevViewRef.audioEnabled !== audioEnabled;

    if (!viewChanged && !audioEnabledChanged) {
      console.log('🎮 No view or audio state change, skipping');
      return;
    }

    // Cập nhật previous values
    prevViewRef.current = currentView;
    prevViewRef.audioEnabled = audioEnabled;

    if (!audioEnabled) {
      console.log('🎮 Audio disabled, force stopping current audio');
      forceStopAudio();
      return;
    }

    if (!currentView) {
      console.log('🎮 No current view, skipping audio');
      return;
    }

    let audioFile = null;

    // Xác định audio key dựa trên view hiện tại
    if (['intro', 'halftime', 'poster'].includes(currentView)) {
      audioFile = 'poster';
    } else if (currentView === 'scoreboard_below') {
      audioFile = 'rasan';
    } else if (currentView?.startsWith('scoreboard')) {
      audioFile = 'gialap';
    }

    // Chỉ phát nếu có audio file và khác với lần phát trước
    if (audioFile) {
      const audioKey = `${audioFile}-${currentView}`;
      if (lastAudioPlayedRef.current !== audioKey) {
        console.log('🎮 Playing audio for view change:', { audioFile, currentView });
        playAudio(audioFile, 'DisplayController');
        lastAudioPlayedRef.current = audioKey;
      } else {
        console.log('🎮 Same audio already played, skipping:', audioKey);
      }
    }
  }, [currentView, audioEnabled, playAudio, forceStopAudio]);

  // Effect để xử lý audio enabled changes ngay lập tức
  useEffect(() => {
    console.log('🎮 [DisplayController] Audio enabled changed:', audioEnabled);
    if (!audioEnabled) {
      console.log('🎮 [DisplayController] Audio disabled - force stopping immediately');
      forceStopAudio();
      lastAudioPlayedRef.current = null;
    }
  }, [audioEnabled, forceStopAudio]);



  // Debug: Listen to socket connection status
  useEffect(() => {
    console.log('🎮 [DisplayController] Socket connection status changed:', {
      connected: socketConnected,
      accessCode,
      socketId: socketService.socket?.id,
      clientType: socketService.clientType
    });
  }, [socketConnected, accessCode]);

  // Khởi tạo kết nối socket
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

        console.log('🎮 Access code verified for display:', accessCode);

        // Khởi tạo socket connection
        await initializeSocket(accessCode);

        // Debug: Check socket status after initialization
        console.log('🎮 [DisplayController] Socket status after init:', {
          connected: socketConnected,
          accessCode,
          socketId: socketService.socket?.id,
          clientType: socketService.clientType
        });

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

    // Cleanup function
    return () => {
      isCleanedUp = true;
      // Reset refs on cleanup
      lastAudioPlayedRef.current = null;
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
        isEnabled={!audioEnabled && !!currentAudioFile}
        onEnded={() => setCurrentAudioFile(null)}
        loop={true}
      />
    </div>
  );
};

export default DisplayController;
