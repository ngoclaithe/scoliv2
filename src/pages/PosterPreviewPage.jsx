import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicMatch } from '../contexts/PublicMatchContext';
import { useAuth } from '../contexts/AuthContext';
import PublicAPI from '../API/apiPublic';
import { toPng } from 'html-to-image';
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

  // Hàm tải ảnh poster
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;

    setDownloading(true);
    let clone;
    try {
      // 1) Ensure fonts used by poster are loaded. Collect font families from the poster.
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (_) {}

      const collectFontFamilies = () => {
        const families = new Set();
        const els = posterRef.current.querySelectorAll('*');
        els.forEach((el) => {
          try {
            const ff = window.getComputedStyle(el).fontFamily;
            if (ff) {
              // take first family token
              const primary = ff.split(',')[0].replace(/['"]/g, '').trim();
              if (primary) families.add(primary);
            }
          } catch (_) {}
        });
        return Array.from(families);
      };

      const families = collectFontFamilies();
      const fontLoadPromises = [];
      families.forEach((fam) => {
        // load a normal and bold variant to be safe
        try {
          fontLoadPromises.push(document.fonts.load(`16px "${fam}"`));
          fontLoadPromises.push(document.fonts.load(`800 16px "${fam}"`));
        } catch (_) {}
      });
      if (fontLoadPromises.length) await Promise.allSettled(fontLoadPromises);

      // 2) Create a clone and inline computed styles so html2canvas gets exact values
      const original = posterRef.current;
      clone = original.cloneNode(true);
      const rect = original.getBoundingClientRect();

      // Prepare clone container offscreen
      clone.style.width = `${Math.round(rect.width)}px`;
      clone.style.height = `${Math.round(rect.height)}px`;
      clone.style.boxSizing = 'border-box';
      clone.style.position = 'absolute';
      clone.style.left = '-99999px';
      clone.style.top = '0px';
      clone.style.margin = '0';
      clone.style.transform = 'none';
      clone.classList.add('capture-mode');

      document.body.appendChild(clone);

      // Inline computed styles for each element
      const computedProps = [
        'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'white-space', 'word-spacing', 'word-break', 'font-style', 'color', 'text-shadow', 'box-sizing', 'padding', 'margin', 'display', 'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'transform'
      ];

      const allEls = clone.querySelectorAll('*');
      allEls.forEach((el) => {
        try {
          const cs = window.getComputedStyle(original.querySelector(`[data-clone-marker]`) || el) || window.getComputedStyle(el);
          // If mapping original->clone by index, fallback to el's computed style (ok for most)
          const sourceEl = original.querySelectorAll('*')[Array.from(allEls).indexOf(el)] || el;
          const sourceCs = window.getComputedStyle(sourceEl);

          computedProps.forEach((prop) => {
            const val = sourceCs.getPropertyValue(prop);
            if (val) el.style.setProperty(prop, val);
          });

          // Ensure transforms removed
          el.style.transform = 'none';
        } catch (e) {
          // ignore
        }
      });

      // 3) Ensure images in clone are loaded/decoded and handle GIFs / CORS
      const imgs = Array.from(clone.querySelectorAll('img'));
      await Promise.all(imgs.map(async (img) => {
        try {
          // prefer anonymous crossOrigin to allow taint-free drawing
          try { img.crossOrigin = 'anonymous'; } catch (_) {}

          const src = (img.currentSrc || img.src || '').toString();
          const isGif = src.toLowerCase().endsWith('.gif') || src.toLowerCase().includes('.gif');

          if (isGif) {
            // load original gif into temp image and draw first frame to canvas, then replace src with PNG dataURL
            const temp = new Image();
            try { temp.crossOrigin = 'anonymous'; } catch (_) {}
            temp.src = src;
            await (temp.decode ? temp.decode().catch(() => {}) : Promise.resolve());
            const c = document.createElement('canvas');
            c.width = temp.naturalWidth || img.width || img.clientWidth || Math.max(100, img.width || 100);
            c.height = temp.naturalHeight || img.height || img.clientHeight || Math.max(100, img.height || 100);
            const ctx = c.getContext('2d');
            ctx.drawImage(temp, 0, 0, c.width, c.height);
            try {
              const dataUrl = c.toDataURL('image/png');
              img.src = dataUrl;
            } catch (e) {
              // if toDataURL fails due to CORS, leave original src
              console.warn('[poster] gif -> canvas conversion failed (CORS):', e);
            }
          } else {
            if (img.decode) await img.decode().catch(() => {});
          }
        } catch (e) {
          // ignore individual image errors
        }
      }));

      // Wait a couple of frames to stabilize
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      // 4) Capture the clone using html-to-image (toPng)
      const dataUrl = await toPng(clone, {
        cacheBust: true,
        bgcolor: '#ffffff',
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        pixelRatio: Math.max(2, window.devicePixelRatio || 1)
      });

      // 5) Download
      const link = document.createElement('a');
      link.download = `poster_${matchData?.teamA?.name || 'TeamA'}_vs_${matchData?.teamB?.name || 'TeamB'}_${new Date().getTime()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Lỗi khi tải ảnh poster:', error);
      alert('Có lỗi xảy ra khi tải ảnh poster. Vui lòng thử lại!');
    } finally {
      setDownloading(false);
      try {
        if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
      } catch (_) {}
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
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${downloading ? 'capture-mode' : ''}`} ref={posterRef}>
          {renderPosterComponent()}
        </div>
      </div>
    </div>
  );
};

export default PosterPreviewPage;
