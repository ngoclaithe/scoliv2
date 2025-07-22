import React, { useState, useRef } from "react";
import Button from "../common/Button";
import Loading from "../common/Loading";

const PosterPreview = ({
  poster,
  matchData = {},
  teamLogos = {},
  customizations = {},
  onEdit,
  onDownload,
  onShare,
  loading = false,
  className = "",
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);

  const handleExport = async (format = "png") => {
    setIsExporting(true);
    try {
      // Logic để export poster
      await onDownload?.(format);
    } finally {
      setIsExporting(false);
    }
  };

  const shareOptions = [
    { name: "Facebook", icon: "📘", color: "bg-blue-600" },
    {
      name: "Instagram",
      icon: "📷",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    { name: "Twitter", icon: "🐦", color: "bg-blue-400" },
    { name: "Copy Link", icon: "🔗", color: "bg-gray-600" },
  ];

  if (loading || !poster) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-6">
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
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Xem trước poster
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {poster.name} • {poster.dimensions?.width}x
                {poster.dimensions?.height}px
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                }
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>

        {/* Poster Display */}
        <div className="p-6">
          <div className="relative bg-gray-50 rounded-lg overflow-hidden">
            {/* Poster Canvas/Image */}
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative">
              <canvas
                ref={canvasRef}
                className="hidden"
                width={poster.dimensions?.width || 1920}
                height={poster.dimensions?.height || 1080}
              />

              {/* Mock Poster Content */}
              <div className="absolute inset-0 p-8 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className={
                      'w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
                    }
                  ></div>
                </div>

                {/* Team Logos */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-4">
                    {teamLogos.home ? (
                      <img
                        src={teamLogos.home}
                        alt="Home team"
                        className="w-16 h-16 rounded-full bg-white p-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">H</span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold">
                        {matchData.homeTeam?.name || "Đội nhà"}
                      </h2>
                      <p className="text-sm opacity-90">Chủ nhà</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {matchData.homeScore || 0} - {matchData.awayScore || 0}
                    </div>
                    <div className="text-sm opacity-90">
                      {matchData.matchTime || "90:00"}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-right">
                    <div>
                      <h2 className="text-xl font-bold">
                        {matchData.awayTeam?.name || "Đội khách"}
                      </h2>
                      <p className="text-sm opacity-90">Khách</p>
                    </div>
                    {teamLogos.away ? (
                      <img
                        src={teamLogos.away}
                        alt="Away team"
                        className="w-16 h-16 rounded-full bg-white p-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">A</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match Info */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black bg-opacity-30 backdrop-blur rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>{matchData.league || "V-League 2024"}</span>
                      <span>{matchData.stadium || "Sân vận động"}</span>
                      <span>
                        {matchData.date ||
                          new Date().toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Overlay */}
            {isExporting && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 text-center">
                  <Loading size="lg" text="Đang xuất poster..." />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Download Options */}
            <div className="flex space-x-2">
              <Button
                variant="primary"
                onClick={() => handleExport("png")}
                disabled={isExporting}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              >
                Tải PNG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("jpg")}
                disabled={isExporting}
              >
                Tải JPG
              </Button>
            </div>

            {/* Share Options */}
            <div className="flex space-x-2 overflow-x-auto">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  size="sm"
                  onClick={() => onShare?.(option.name.toLowerCase())}
                  className="whitespace-nowrap"
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Chất lượng xuất: HD (1920x1080)</span>
            <span>Định dạng: PNG, JPG</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterPreview;
