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


          </div>
        </div>


      </div>
    </div>
  );
};

export default PosterPreview;
