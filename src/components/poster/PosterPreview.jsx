import React from "react";
import Loading from "../common/Loading";

const PosterPreview = ({
  poster,
  loading = false,
  className = "",
}) => {
  if (loading || !poster) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <Loading size="lg" text="Đang tạo poster..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {poster.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Poster template đã chọn
              </p>
            </div>
          </div>
        </div>

        {/* Poster Display */}
        <div className="p-3 sm:p-6">
          <div className="relative bg-gray-50 rounded-lg overflow-hidden">
            {poster.thumbnail ? (
              <div className="w-full">
                <img
                  src={poster.thumbnail}
                  alt={poster.name}
                  className="w-full h-auto rounded-lg shadow-sm"
                  style={{ 
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    maxHeight: '400px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback khi ảnh không load được */}
                <div 
                  className="w-full aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg hidden items-center justify-center"
                  style={{ maxHeight: '400px' }}
                >
                  <div className="text-center text-white p-4">
                    <div className="text-4xl sm:text-6xl mb-2">🎬</div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1">
                      {poster.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      Preview sẽ hiển thị ở đây
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="w-full aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                style={{ maxHeight: '400px' }}
              >
                <div className="text-center text-white p-4">
                  <div className="text-4xl sm:text-6xl mb-2">🎬</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">
                    {poster.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    Preview sẽ hiển thị ở đây
                  </p>
                </div>
              </div>
            )}

            {/* Overlay thông tin poster */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
              <div className="bg-black bg-opacity-60 backdrop-blur rounded-lg p-2 sm:p-3">
                <div className="flex justify-between items-center text-white text-xs sm:text-sm">
                  <span className="font-medium">✨ {poster.name}</span>
                  <span className="opacity-90">Template poster</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer với thông tin đơn giản */}
        <div className="px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg sm:text-xl">💡</div>
              <div>
                <h4 className="font-medium text-blue-900 text-sm sm:text-base mb-1">
                  Poster đã sẵn sàng
                </h4>
                <p className="text-blue-700 text-xs sm:text-sm">
                  Bạn có thể tiếp tục cài đặt logo tại các vị trí khác nhau trên poster này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;
