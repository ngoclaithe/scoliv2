import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { getFullLogoUrl } from "../../utils/logoUtils";

const MatchPreview = ({
  match,
  layout = "horizontal",
  showControls = true,
  onEdit,
  onShare,
  onExport,
  className = "",
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const shareOptions = [
    {
      name: "Facebook",
      icon: "📘",
      color: "bg-blue-600",
      description: "Chia sẻ lên Facebook",
    },
    {
      name: "YouTube Live",
      icon: "📺",
      color: "bg-red-600",
      description: "Stream trực tiếp YouTube",
    },
    {
      name: "OBS Studio",
      icon: "📹",
      color: "bg-gray-800",
      description: "Sử dụng với OBS",
    },
    {
      name: "Twitch",
      icon: "🎮",
      color: "bg-purple-600",
      description: "Stream lên Twitch",
    },
  ];

  const exportFormats = [
    { format: "png", name: "PNG", description: "Hình ảnh chất lượng cao" },
    { format: "jpg", name: "JPG", description: "Hình ảnh nén" },
    { format: "mp4", name: "MP4", description: "Video overlay" },
    { format: "html", name: "HTML", description: "Widget web" },
  ];

  if (!match) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có trận đấu
          </h3>
          <p className="text-gray-500">
            Tạo hoặc tải một trận đấu để xem trước
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "pause":
        return "bg-yellow-500 text-white";
      case "ended":
        return "bg-gray-500 text-white";
      case "halftime":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "live":
        return "TRỰC TIẾP";
      case "pause":
        return "TẠM DỪNG";
      case "ended":
        return "KẾT THÚC";
      case "halftime":
        return "GIẢI LAO";
      case "pending":
        return "CHUẨN BỊ";
      default:
        return status.toUpperCase();
    }
  };

  const MatchDisplay = ({ isFullPreview = false }) => {
    const containerClass = isFullPreview
      ? "w-full aspect-video"
      : "w-full aspect-video";

    return (
      <div
        className={`${containerClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg overflow-hidden relative cursor-pointer`}
        onClick={() => !isFullPreview && setShowFullPreview(true)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className={
              'w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
            }
          ></div>
        </div>

        {/* Content */}
        <div className="relative h-full p-4 md:p-8 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm opacity-90">
              <div>{match.league}</div>
              <div>
                {match.date} • {match.time}
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(match.status)}`}
            >
              {getStatusText(match.status)}
            </div>
          </div>

          {/* Teams và Score */}
          <div className="flex-1 flex items-center justify-between">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {match.homeTeam.logo ? (
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-8 h-8 md:w-12 md:h-12 object-contain"
                  />
                ) : (
                  <span className="text-xl md:text-3xl font-bold">
                    {match.homeTeam.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm md:text-lg mb-1 truncate">
                {match.homeTeam.name}
              </h3>
              <div className="text-xs opacity-75">Chủ nhà</div>
            </div>

            {/* Score */}
            <div className="flex-1 text-center">
              <div className="text-3xl md:text-6xl font-bold mb-2">
                {match.homeTeam.score} - {match.awayTeam.score}
              </div>
              <div className="text-sm md:text-base opacity-90">
                {match.matchTime}
              </div>
              <div className="text-xs md:text-sm opacity-75 mt-1">
                {match.period}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {match.awayTeam.logo ? (
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-8 h-8 md:w-12 md:h-12 object-contain"
                  />
                ) : (
                  <span className="text-xl md:text-3xl font-bold">
                    {match.awayTeam.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm md:text-lg mb-1 truncate">
                {match.awayTeam.name}
              </h3>
              <div className="text-xs opacity-75">Khách</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end text-xs opacity-75">
            <div>{match.stadium}</div>
            <div>
              {match.weather} • {match.temperature}
            </div>
          </div>
        </div>

        {/* Live Indicator */}
        {match.status === "live" && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">LIVE</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Preview Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xem trước trận đấu
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
              </div>
              {showControls && (
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
                    Sửa
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowShareModal(true)}
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                    }
                  >
                    Chia sẻ
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Match Preview */}
          <div className="p-4">
            <MatchDisplay />
          </div>

          {/* Quick Actions */}
          {showControls && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2 justify-center">
                {exportFormats.map((format) => (
                  <Button
                    key={format.format}
                    variant="outline"
                    size="sm"
                    onClick={() => onExport?.(format.format)}
                    className="text-xs"
                  >
                    Xuất {format.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Preview Modal */}
      <Modal
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        title="Xem trước toàn màn hình"
        size="xl"
      >
        <div className="space-y-4">
          <MatchDisplay isFullPreview={true} />

          <div className="text-center text-sm text-gray-600">
            <p>Đây là cách trận đấu sẽ hiển thị trên livestream</p>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Chia sẻ trận đấu"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Chọn nền tảng để chia sẻ hoặc stream trận đấu
          </p>

          <div className="grid grid-cols-1 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => onShare?.(option.name.toLowerCase())}
                className={`${option.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-left`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h4 className="font-semibold">{option.name}</h4>
                    <p className="text-sm opacity-90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Link chia sẻ:</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={`https://stream.example.com/match/${match.code || "demo"}`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://stream.example.com/match/${match.code || "demo"}`,
                  );
                }}
              >
                Sao chép
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MatchPreview;
