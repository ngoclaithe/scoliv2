import React, { useState } from "react";
import PosterSelector from "./PosterSelector";
import PosterPreview from "./PosterPreview";
import CustomPosterForm from "./CustomPosterForm";
import LogoSettings from "../logo/LogoSettings";
import Button from "../common/Button";
import Modal from "../common/Modal";

const PosterManager = ({ matchData, onPosterUpdate, onLogoUpdate }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showPosterSelector, setShowPosterSelector] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showLogoSettings, setShowLogoSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  // Posters từ thư mục public/images/posters
  const availablePosters = [
    {
      id: "poster-1",
      name: "Poster Template 1",
      thumbnail: "/images/posters/poster1.jpg",
    },
    {
      id: "poster-2",
      name: "Poster Template 2",
      thumbnail: "/images/posters/poster2.jpg",
    },
    {
      id: "poster-3",
      name: "Poster Template 3",
      thumbnail: "/images/posters/poster3.jpg",
    },
    {
      id: "poster-4",
      name: "Poster Template 4",
      thumbnail: "/images/posters/poster4.jpg",
    },
    {
      id: "poster-5",
      name: "Poster Template 5",
      thumbnail: "/images/posters/poster5.jpg",
    },
    {
      id: "poster-6",
      name: "Poster Template 6",
      thumbnail: "/images/posters/poster6.jpg",
    },
  ];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster);
    onPosterUpdate?.(poster);
    setShowPosterSelector(false);
  };

  const handleCustomPoster = () => {
    setShowPosterSelector(false);
    setShowCustomForm(true);
  };

  const handleCustomPosterSave = (posterData) => {
    const customPoster = {
      id: `custom-${Date.now()}`,
      name: posterData.name,
      category: "custom",
      customData: posterData,
      dimensions: posterData.dimensions,
    };
    setSelectedPoster(customPoster);
    onPosterUpdate?.(customPoster);
    setShowCustomForm(false);
  };

    return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản Lý Poster</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Chọn mẫu poster và cài đặt logo cho livestream
          </p>
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowLogoSettings(true)}
            size="sm"
            className="flex-1 sm:flex-none"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          >
            <span className="hidden sm:inline">Cài Đặt Logo</span>
            <span className="sm:hidden">Logo</span>
          </Button>
        </div>
      </div>

            {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Side - Current Poster */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {selectedPoster ? (
            <PosterPreview
              poster={selectedPoster}
              matchData={matchData}
              onEdit={() => {
                if (selectedPoster.category === "custom") {
                  setShowCustomForm(true);
                } else {
                  setShowPosterSelector(true);
                }
              }}
              onDownload={(format) => console.log("Download poster as", format)}
              onShare={(platform) => console.log("Share to", platform)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa chọn poster
                </h3>
                <p className="text-gray-600 mb-4">
                  Chọn một poster từ thư viện có sẵn
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowPosterSelector(true)}
                >
                  Chọn Poster
                </Button>
              </div>
            </div>
          )}
        </div>

                {/* Right Side - Quick Info */}
        <div className="space-y-4 order-1 lg:order-2">
          {/* Poster Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Thông Tin Poster
            </h3>
            {selectedPoster ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium">{selectedPoster.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại:</span>
                  <span className="font-medium">
                    {selectedPoster.category === "match" && "⚽ Trận đấu"}
                    {selectedPoster.category === "lineup" && "👥 Đội hình"}
                    {selectedPoster.category === "intro" && "🎬 Giới thiệu"}
                    {selectedPoster.category === "halftime" && "⏰ Giải lao"}
                    {selectedPoster.category === "celebration" && "🎉 Ăn mừng"}
                    {selectedPoster.category === "custom" && "🎨 Tùy chỉnh"}
                  </span>
                </div>
                {selectedPoster.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kích thước:</span>
                    <span className="font-medium">
                      {selectedPoster.dimensions.width} x{" "}
                      {selectedPoster.dimensions.height}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Chưa chọn poster</p>
            )}
          </div>

          {/* Match Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Thông Tin Trận Đấu
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Đội nhà:</span>
                <span className="font-medium">
                  {matchData?.homeTeam?.name || "Chưa đặt"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đội khách:</span>
                <span className="font-medium">
                  {matchData?.awayTeam?.name || "Chưa đặt"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giải đấu:</span>
                <span className="font-medium">
                  {matchData?.league || "Chưa đặt"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày:</span>
                <span className="font-medium">
                  {matchData?.date || "Chưa đặt"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Poster Selection Modal */}
      <Modal
        isOpen={showPosterSelector}
        onClose={() => setShowPosterSelector(false)}
        title="Chọn Mẫu Poster"
        size="xl"
      >
        <PosterSelector
          posters={availablePosters}
          selectedPoster={selectedPoster}
          onPosterSelect={handlePosterSelect}
          onCustomPoster={handleCustomPoster}
          loading={loading}
        />
      </Modal>

      {/* Custom Poster Form Modal */}
      <CustomPosterForm
        isOpen={showCustomForm}
        onClose={() => setShowCustomForm(false)}
        onSave={handleCustomPosterSave}
        matchData={matchData}
      />

      {/* Logo Settings Modal */}
      <LogoSettings
        isOpen={showLogoSettings}
        onClose={() => setShowLogoSettings(false)}
        onLogoUpdate={onLogoUpdate}
        matchData={matchData}
      />
    </div>
  );
};

export default PosterManager;
