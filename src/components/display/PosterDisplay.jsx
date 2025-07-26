import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import PublicAPI from '../../API/apiPublic';
import PosterTreTrung from '../../pages/Poster-tretrung';
import PosterHaoQuang from '../../pages/Poster-haoquang';

const PosterDisplay = () => {
  const { accessCode } = useParams();
  const { initializeSocket, displaySettings, socketConnected, lastUpdateTime } = useMatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Khởi tạo kết nối khi component mount
  useEffect(() => {
    const initializeDisplay = async () => {
      try {
        // Xác thực access code mà không cần đăng nhập
        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        console.log('Access code verified for display:', accessCode);

        // Khởi tạo socket connection trực tiếp
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

  // Render error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Lỗi kết nối</h1>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚽</div>
          <h1 className="text-2xl font-bold mb-2">Đang kết nối...</h1>
          <p className="text-gray-400">Mã truy cập: {accessCode}</p>
        </div>
      </div>
    );
  }

  // Render poster theo selectedPoster
  const renderPoster = () => {
    switch (displaySettings.selectedPoster) {
      case 'tretrung':
        return <PosterTreTrung accessCode={accessCode} />;
      case 'haoquang':
        return <PosterHaoQuang accessCode={accessCode} />;
      default:
        return <PosterTreTrung accessCode={accessCode} />;
    }
  };

  return (
    <div className="relative">
      {/* Connection status indicator */}
      <div className="absolute top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded text-sm ${
          socketConnected ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {socketConnected ? '🟢 Kết nối' : '🔴 Mất kết nối'}
        </div>
        <div className="text-xs text-gray-300 mt-1">
          Code: {accessCode}
        </div>
        <div className="text-xs text-gray-300">
          Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
        </div>
      </div>

      {/* Poster content */}
      {renderPoster()}
    </div>
  );
};

export default PosterDisplay;
