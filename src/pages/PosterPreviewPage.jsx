import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { useAuth } from '../contexts/AuthContext';
import PublicAPI from '../API/apiPublic';
import domtoimage from 'dom-to-image';
import { getFullPosterUrl } from '../utils/logoUtils';

// Import các poster templates
import PosterTretrung from './Poster-tretrung';
import PosterHaoquang from './Poster-haoquang';
import PosterDoden from './Poster-doden';
import PosterVangkim from './Poster-vangkim';
import PosterVangxanh from './Poster-vangxanh';
import PosterXanhduong from './Poster-xanhduong';
import PosterTuHung from './Poster-tuhung';

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
          if (verifyResult.message && (
            verifyResult.message.includes('hết hạn') ||
            verifyResult.message.includes('expired') ||
            verifyResult.message.includes('không hợp lệ')
          )) {
            setError(`❌ Mã truy cập đã hết hạn hoặc không hợp lệ: ${accessCode}\n\n⏰ Vui lòng liên hệ admin để cấp mã mới.`);
          } else {
            setError(`❌ Mã truy cập không hợp lệ: ${accessCode}\n\n${verifyResult.message || 'Vui lòng kiểm tra lại mã truy cập.'}`);
          }
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

  // Hàm tải ảnh poster với dom-to-image
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;

    setDownloading(true);
    try {
      // Đợi tất cả fonts được load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Đợi tất cả images được load
      const images = posterRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = resolve; // Không reject để tránh break toàn bộ process
          });
        })
      );

      // Thêm delay nhỏ để đảm bảo render hoàn tất
      await new Promise(resolve => setTimeout(resolve, 100));

      const scale = 2; // Tăng quality
      const node = posterRef.current;
      
      // Lấy kích thước thực tế của element
      const rect = node.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Cấu hình cho dom-to-image
      const config = {
        quality: 1,
        width: width * scale,
        height: height * scale,
        bgcolor: '#ffffff',
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: width + 'px',
          height: height + 'px'
        },
        filter: (node) => {
          // Loại bỏ các element không cần thiết
          if (node.tagName === 'SCRIPT') return false;
          if (node.tagName === 'STYLE' && node.innerHTML.includes('capture-mode')) return false;
          return true;
        },
        imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        cacheBust: true
      };

      // Sử dụng toPng của dom-to-image
      const dataUrl = await domtoimage.toPng(node, config);

      // Tạo và tải file
      const link = document.createElement('a');
      link.download = `poster_${matchData?.teamA?.name || 'TeamA'}_vs_${matchData?.teamB?.name || 'TeamB'}_${new Date().getTime()}.png`;
      link.href = dataUrl;
      
      // Thêm vào DOM, click, và remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Poster đã được tải thành công!');
      
    } catch (error) {
      console.error('❌ Lỗi khi tải ảnh poster:', error);
      
      // Fallback: thử với config đơn giản hơn
      try {
        console.log('🔄 Thử lại với cấu hình đơn giản...');
        const simpleConfig = {
          quality: 0.95,
          bgcolor: '#ffffff',
          cacheBust: true
        };
        
        const dataUrl = await domtoimage.toPng(posterRef.current, simpleConfig);
        
        const link = document.createElement('a');
        link.download = `poster_${matchData?.teamA?.name || 'TeamA'}_vs_${matchData?.teamB?.name || 'TeamB'}_${new Date().getTime()}.png`;
        link.href = dataUrl;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Poster đã được tải thành công (fallback)!');
      } catch (fallbackError) {
        console.error('❌ Fallback cũng thất bại:', fallbackError);
        alert('Có lỗi xảy ra khi tải ảnh poster. Vui lòng thử lại sau!');
      }
    } finally {
      setDownloading(false);
    }
  };

  const renderPosterComponent = () => {
    const selectedPoster = displaySettings?.selectedPoster;
    const customPosterUrl = displaySettings?.url_custom_poster;
    const posterType = selectedPoster || 'tretrung';

    // Kiểm tra nếu posterType là 'custom' và có URL
    if (selectedPoster === 'custom' && customPosterUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <img
            src={customPosterUrl}
            alt="Custom Poster"
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '800px' }}
            crossOrigin="anonymous"
          />
        </div>
      );
    }

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
      case 'tuhung':
        return <PosterTuHung accessCode={accessCode} />;
      default:
        return <PosterTretrung accessCode={accessCode} />;
    }
  };

  // Render error state
  if (error) {
    const isExpiredError = error.includes('hết hạn') || error.includes('expired');

    return (
      <div className={`min-h-screen ${isExpiredError ? 'bg-gradient-to-br from-red-50 via-orange-50 to-red-50' : 'bg-red-50'} flex items-center justify-center p-4`}>
        <div className="text-center max-w-lg">
          <div className={`text-6xl mb-4 ${isExpiredError ? 'animate-pulse' : ''}`}>
            {isExpiredError ? '⏰' : '❌'}
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-700">
            {isExpiredError ? 'Mã truy cập hết hạn' : 'Lỗi kết nối'}
          </h1>
          <div className="text-red-600 mb-6 whitespace-pre-line text-sm leading-relaxed">
            {error}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Thử lại
            </button>
            {isExpiredError && (
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🏠 Về trang chủ
              </button>
            )}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Access Code: {accessCode}
          </div>
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
      <style>{`
        .capture-mode *, .capture-mode *::before, .capture-mode *::after {
          animation: none !important;
          transition: none !important;
        }
        
        /* Đảm bảo fonts được render đúng khi capture */
        .poster-container * {
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
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
      <div className="max-w-10xl mx-auto p-4">
        <div 
          className={`poster-container bg-white rounded-lg shadow-lg overflow-hidden ${downloading ? 'capture-mode' : ''}`} 
          ref={posterRef}
        >
          {renderPosterComponent()}
        </div>
      </div>
    </div>
  );
};

export default PosterPreviewPage;