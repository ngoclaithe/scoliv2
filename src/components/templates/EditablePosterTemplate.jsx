import React, { useState } from "react";
import PosterTemplate from "./PosterTemplate";
import PosterSettings from "../poster/PosterSettings";
import Button from "../common/Button";

const EditablePosterTemplate = ({
  matchData = {},
  teamLogos = {},
  initialSettings = {},
  onExport,
  className = "",
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [posterSettings, setPosterSettings] = useState({
    backgroundColor: "#1e40af",
    titleText: "",
    titleColor: "#ffffff",
    titleSize: 48,
    titleFont: "Inter",
    showLogos: true,
    logoSize: 80,
    logoPosition: "center",
    showScore: true,
    scoreSize: 64,
    scoreColor: "#ffffff",
    scorePosition: "center",
    layout: "horizontal",
    padding: 40,
    spacing: 20,
    backgroundOpacity: 100,
    backgroundBlur: 0,
    enableAnimations: true,
    animationType: "fade",
    animationDuration: 500,
    ...initialSettings,
  });

  const handleSettingsChange = (newSettings) => {
    setPosterSettings(newSettings);
  };

  const handleSaveSettings = (settings) => {
    setPosterSettings(settings);
    setShowSettings(false);
  };

  const handleResetSettings = () => {
    setPosterSettings({
      backgroundColor: "#1e40af",
      titleText: "",
      titleColor: "#ffffff",
      titleSize: 48,
      titleFont: "Inter",
      showLogos: true,
      logoSize: 80,
      logoPosition: "center",
      showScore: true,
      scoreSize: 64,
      scoreColor: "#ffffff",
      scorePosition: "center",
      layout: "horizontal",
      padding: 40,
      spacing: 20,
      backgroundOpacity: 100,
      backgroundBlur: 0,
      enableAnimations: true,
      animationType: "fade",
      animationDuration: 500,
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-4">
        {/* Settings Toggle */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Poster Template với Cài đặt
          </h3>
          <Button
            variant={showSettings ? "primary" : "outline"}
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2"
          >
            <span>⚙️</span>
            <span>{showSettings ? "Ẩn cài đặt" : "Hiện cài đặt"}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Poster Preview */}
          <div className="lg:col-span-2">
            <PosterTemplate
              matchData={matchData}
              teamLogos={teamLogos}
              settings={posterSettings}
              onExport={onExport}
            />
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:col-span-1">
              <PosterSettings
                settings={posterSettings}
                onSettingsChange={handleSettingsChange}
                onSave={handleSaveSettings}
                onReset={handleResetSettings}
              />
            </div>
          )}
        </div>

        {/* Quick Settings */}
        {!showSettings && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Cài đặt nhanh</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Title Text */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={posterSettings.titleText}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, titleText: e.target.value }))
                  }
                  placeholder="Nhập tiêu đề..."
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Màu nền
                </label>
                <input
                  type="color"
                  value={posterSettings.backgroundColor}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, backgroundColor: e.target.value }))
                  }
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>

              {/* Title Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cỡ chữ: {posterSettings.titleSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="128"
                  value={posterSettings.titleSize}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, titleSize: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              {/* Logo Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cỡ logo: {posterSettings.logoSize}px
                </label>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={posterSettings.logoSize}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, logoSize: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              {/* Show Logos */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="quickShowLogos"
                  checked={posterSettings.showLogos}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, showLogos: e.target.checked }))
                  }
                  className="mr-2"
                />
                <label htmlFor="quickShowLogos" className="text-xs font-medium text-gray-700">
                  Hiện logo
                </label>
              </div>

              {/* Show Score */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="quickShowScore"
                  checked={posterSettings.showScore}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, showScore: e.target.checked }))
                  }
                  className="mr-2"
                />
                <label htmlFor="quickShowScore" className="text-xs font-medium text-gray-700">
                  Hiện tỉ số
                </label>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Font chữ
                </label>
                <select
                  value={posterSettings.titleFont}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, titleFont: e.target.value }))
                  }
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Dancing Script">Dancing Script</option>
                </select>
              </div>

              {/* Layout */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bố cục
                </label>
                <select
                  value={posterSettings.layout}
                  onChange={(e) =>
                    setPosterSettings(prev => ({ ...prev, layout: e.target.value }))
                  }
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:outline-none"
                >
                  <option value="horizontal">Ngang</option>
                  <option value="vertical">Dọc</option>
                  <option value="centered">Trung tâm</option>
                  <option value="split">Chia đôi</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditablePosterTemplate;
