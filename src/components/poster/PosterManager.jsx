import React, { useState } from "react";
import PosterSelector from "./PosterSelector";
import PosterPreview from "./PosterPreview";
import CustomPosterForm from "./CustomPosterForm";
import PosterLogoManager from "./PosterLogoManager";
import Button from "../common/Button";
import Modal from "../common/Modal";

const PosterManager = ({ matchData, onPosterUpdate, onLogoUpdate }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showPosterSelector, setShowPosterSelector] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showLogoSettings, setShowLogoSettings] = useState(false);
  const [loading] = useState(false);

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
        <div className="flex items-center justify-between space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowPosterSelector(true)}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          >
            <span className="hidden sm:inline">{selectedPoster ? 'Đổi Poster' : 'Chọn Poster'}</span>
            <span className="sm:hidden">{selectedPoster ? 'Đổi' : 'Chọn'}</span>
          </Button>

          <Button
            variant="primary"
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
      <div className="w-full">
        {/* Current Poster Display */}
        <div className="w-full">
          {selectedPoster ? (
            <PosterPreview
              poster={selectedPoster}
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
