import React, { useState } from "react";
import PosterSelector from "./PosterSelector";
import PosterPreview from "./PosterPreview";
import CustomPosterForm from "./CustomPosterForm";
import PosterLogoManager from "./PosterLogoManager";
import Button from "../common/Button";
import Modal from "../common/Modal";

const PosterManager = ({ matchData, onPosterUpdate, onLogoUpdate }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [showPosterSelector, setShowPosterSelector] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showPosterLogoManager, setShowPosterLogoManager] = useState(false);
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

  const handlePosterLogoUpdate = (poster) => {
    if (poster) {
      setSelectedPoster(poster);
      onPosterUpdate?.(poster);
    }
  };

  const handleLogoUpdateFromManager = (logoData) => {
    if (logoData && logoData.selectedLogo) {
      setSelectedLogo(logoData.selectedLogo);
      onLogoUpdate?.(logoData);
    }
  };

    return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="primary"
            onClick={() => setShowPosterLogoManager(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          >
            <span className="hidden sm:inline">🎨 Chọn Poster & Logo</span>
            <span className="sm:hidden">🎨 Chọn</span>
          </Button>
        </div>

        {/* Status display */}
        {(selectedPoster || selectedLogo) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm">
              {selectedPoster && (
                <p className="text-blue-800 font-medium">
                  ✅ Poster: {selectedPoster.name}
                </p>
              )}
              {selectedLogo && (
                <p className="text-blue-800 font-medium">
                  ✅ Logo: {selectedLogo.name}
                </p>
              )}
            </div>
          </div>
        )}
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa chọn poster & logo
              </h3>
              <p className="text-gray-600 mb-4">
                Chọn poster và logo từ thư viện có sẵn
              </p>
              <Button
                variant="primary"
                onClick={() => setShowPosterLogoManager(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold"
              >
                🎨 Chọn Poster & Logo
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Combined Poster & Logo Selection Modal */}
      <Modal
        isOpen={showPosterLogoManager}
        onClose={() => setShowPosterLogoManager(false)}
        title="🎨 Quản Lý Poster & Logo"
        size="xl"
        className="max-h-screen overflow-hidden"
      >
        <div className="h-full max-h-[85vh] overflow-y-auto">
          <PosterLogoManager
            matchData={matchData}
            onPosterUpdate={handlePosterLogoUpdate}
            onLogoUpdate={handleLogoUpdateFromManager}
            onClose={() => setShowPosterLogoManager(false)}
          />
        </div>
      </Modal>

      {/* Legacy Poster Selection Modal - kept for compatibility */}
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
    </div>
  );
};

export default PosterManager;
