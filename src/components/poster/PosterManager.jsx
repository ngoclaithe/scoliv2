import React, { useState } from "react";
import PosterSelector from "./PosterSelector";
import CustomPosterForm from "./CustomPosterForm";
import PosterLogoManager from "./PosterLogoManager";
import Modal from "../common/Modal";

const PosterManager = ({ matchData, onPosterUpdate, onLogoUpdate, onClose }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [showPosterSelector, setShowPosterSelector] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showPosterLogoManager, setShowPosterLogoManager] = useState(false);
  const [loading] = useState(false);

  // Posters từ thư mục public/images/posters
  const availablePosters = [
    {
      id: "tretrung",
      name: "Trẻ trung",
      thumbnail: "/images/posters/poster1.jpg",
    },
    {
      id: "haoquang",
      name: "Hào Quang",
      thumbnail: "/images/posters/poster2.jpg",
    },
    {
      id: "doden",
      name: "Đỏ đen",
      thumbnail: "/images/posters/poster3.jpg",
    },
    {
      id: "vangkim",
      name: "Vàng kim",
      thumbnail: "/images/posters/poster4.jpg",
    },
    {
      id: "vangxanh",
      name: "Vàng xanh",
      thumbnail: "/images/posters/poster5.jpg",
    },
    {
      id: "xanhduong",
      name: "Xanh dương",
      thumbnail: "/images/posters/poster6.jpg",
    },
  ];

  const handlePosterSelect = (poster) => {

    setSelectedPoster(poster);

    if (onPosterUpdate) {
      console.log('🎯 [PosterManager] Calling onPosterUpdate with:', poster);
      onPosterUpdate(poster);
    }

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
    console.log('[PosterManager] handleLogoUpdateFromManager called with:', logoData);
    if (logoData && logoData.selectedLogo) {
      setSelectedLogo(logoData.selectedLogo);
      onLogoUpdate?.(logoData);
    } else {
      // Pass through directly to onLogoUpdate
      console.log('[PosterManager] Passing logoData through to onLogoUpdate');
      onLogoUpdate?.(logoData);
    }
  };

    return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header với status display */}
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

      {/* Main Content - Hiển thị trực tiếp PosterLogoManager */}
      <div className="w-full">
        <PosterLogoManager
          matchData={matchData}
          onPosterUpdate={handlePosterLogoUpdate}
          onLogoUpdate={handleLogoUpdateFromManager}
          onClose={onClose}
        />
      </div>

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
