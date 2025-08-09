import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { useAuth } from '../contexts/AuthContext';
import PublicAPI from '../API/apiPublic';
import html2canvas from 'html2canvas';

// Import các poster templates
import PosterTretrung from './Poster-tretrung';
import PosterHaoquang from './Poster-haoquang';
import PosterDoden from './Poster-doden';
import PosterVangkim from './Poster-vangkim';
import PosterVangxanh from './Poster-vangxanh';
import PosterXanhduong from './Poster-xanhduong';

const PosterPreviewPage = () => {
  const { accessCode } = useParams();
  const {
    initializeSocket,
    matchData,
    displaySettings,
    sponsors,
    organizing,
    mediaPartners,
    tournamentLogo,
    liveUnit,
    posterSettings
  } = usePublicMatch();
  const { handleExpiredAccess } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const posterRef = useRef(null);

  // Khởi tạo kết nối socket giống như DisplayController
  useEffect(() => {
    let isCleanedUp = false;

    const initializePreview = async () => {
      try {
        const verifyResult = await PublicAPI.verifyAccessCode(accessCode);

        if (!verifyResult.success || !verifyResult.isValid) {
          setError(`Mã truy cập không hợp lệ: ${accessCode}`);
          return;
        }

        await initializeSocket(accessCode);

        if (!isCleanedUp) {
          // Delay để đảm bảo dữ liệu được tải
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      } catch (err) {
        console.error('❌ [PosterPreviewPage] Failed to initialize preview:', err);
        if (!isCleanedUp) {
          // Kiểm tra lỗi hết hạn truy cập trước
          if (handleExpiredAccess && handleExpiredAccess(err)) {
            // Đã xử lý lỗi hết hạn, không cần set error
            return;
          }
          setError('Không thể kết nối đến hệ thống');
        }
      }
    };

    if (accessCode && !isCleanedUp) {
      initializePreview();
    }

    return () => {
      isCleanedUp = true;
    };
  }, [accessCode, initializeSocket, handleExpiredAccess]);

  // Hàm tải ảnh poster
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2, // Độ phân giải cao hơn
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: posterRef.current.offsetWidth,
        height: posterRef.current.offsetHeight,
      });

      // Tạo link download
      const link = document.createElement('a');
      link.download = `poster_${matchData?.teamA?.name || 'TeamA'}_vs_${matchData?.teamB?.name || 'TeamB'}_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Lỗi khi tải ảnh poster:', error);
      alert('Có lỗi xảy ra khi tải ảnh poster. Vui lòng thử lại!');
    } finally {
      setDownloading(false);
    }
  };

  const renderPosterComponent = () => {
    const posterType = displaySettings?.selectedPoster?.id || displaySettings?.selectedPoster || 'tretrung';

    // Truyền accessCode như trong DisplayController để poster components có thể sử dụng
    switch (posterType) {
      case 'tretrung':
        return <PosterTretrung accessCode={accessCode} />;
      case 'haoquang':
        return <PosterHaoquang accessCode={accessCode} />;
      case 'doden':
        return <PosterDoden accessCode={accessCode} />;
      case 'vangkim':
        return <PosterVangkim accessCode={accessCode} />;
      case 'vangxanh':
        return <PosterVangxanh accessCode={accessCode} />;
      case 'xanhduong':
        return <PosterXanhduong accessCode={accessCode} />;
      default:
        return <PosterTretrung accessCode={accessCode} />;
    }
  };

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2 text-red-700">Lỗi kết nối</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Đang tải poster...</h2>
          <p className="text-gray-500 mt-2">Access Code: {accessCode}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Poster Preview - {matchData?.teamA?.name || 'ĐỘI A'} vs {matchData?.teamB?.name || 'ĐỘI B'}
              </h1>
              <p className="text-sm text-gray-500">Access Code: {accessCode}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPoster}
                disabled={downloading}
                className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  downloading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>Tải ảnh</span>
                  </>
                )}
              </button>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium text-sm rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Poster Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" ref={posterRef}>
          {renderPosterComponent()}
        </div>
      </div>
    </div>
  );
};

export default PosterPreviewPage;