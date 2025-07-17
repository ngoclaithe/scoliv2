import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const PosterSettings = ({
  settings = {},
  onSettingsChange,
  onSave,
  onReset,
  className = "",
}) => {
  const [localSettings, setLocalSettings] = useState({
    // Text settings
    titleText: settings.titleText || "",
    titleColor: settings.titleColor || "#ffffff",
    titleSize: settings.titleSize || 48,
    titleFont: settings.titleFont || "Inter",

    // Background settings
    backgroundColor: settings.backgroundColor || "#1e40af",
    backgroundOpacity: settings.backgroundOpacity || 100,
    backgroundBlur: settings.backgroundBlur || 0,

    // Logo settings
    showLogos: settings.showLogos !== false,
    logoSize: settings.logoSize || 80,
    logoPosition: settings.logoPosition || "top",

    // Score settings
    showScore: settings.showScore !== false,
    scoreSize: settings.scoreSize || 64,
    scoreColor: settings.scoreColor || "#ffffff",
    scorePosition: settings.scorePosition || "center",

    // Layout settings
    layout: settings.layout || "horizontal",
    padding: settings.padding || 40,
    spacing: settings.spacing || 20,

    // Animation settings
    enableAnimations: settings.enableAnimations !== false,
    animationType: settings.animationType || "fade",
    animationDuration: settings.animationDuration || 500,

    ...settings,
  });

  const fonts = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Playfair Display",
    "Dancing Script",
  ];

  const layouts = [
    { id: "horizontal", name: "Ngang", icon: "↔️" },
    { id: "vertical", name: "Dọc", icon: "↕️" },
    { id: "centered", name: "Trung tâm", icon: "⚫" },
    { id: "split", name: "Chia đôi", icon: "⬜" },
  ];

  const logoPositions = [
    { id: "top", name: "Trên cùng" },
    { id: "center", name: "Giữa" },
    { id: "bottom", name: "Dưới cùng" },
    { id: "sides", name: "Hai bên" },
  ];

  const animationTypes = [
    { id: "none", name: "Không" },
    { id: "fade", name: "Mờ dần" },
    { id: "slide", name: "Trượt" },
    { id: "zoom", name: "Phóng to" },
    { id: "bounce", name: "Nảy" },
  ];

  const handleChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleSave = () => {
    onSave?.(localSettings);
  };

  const handleReset = () => {
    const defaultSettings = {
      titleText: "",
      titleColor: "#ffffff",
      titleSize: 48,
      titleFont: "Inter",
      backgroundColor: "#1e40af",
      backgroundOpacity: 100,
      backgroundBlur: 0,
      showLogos: true,
      logoSize: 80,
      logoPosition: "top",
      showScore: true,
      scoreSize: 64,
      scoreColor: "#ffffff",
      scorePosition: "center",
      layout: "horizontal",
      padding: 40,
      spacing: 20,
      enableAnimations: true,
      animationType: "fade",
      animationDuration: 500,
    };
    setLocalSettings(defaultSettings);
    onSettingsChange?.(defaultSettings);
    onReset?.();
  };

  const ColorPicker = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="flex-1"
        />
      </div>
    </div>
  );

  const RangeSlider = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = "",
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {value}
        {unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Cài đặt poster
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Tùy chỉnh giao diện poster
          </p>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Text Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📝 Văn bản</h4>
            <div className="space-y-3">
              <Input
                label="Tiêu đề"
                value={localSettings.titleText}
                onChange={(e) => handleChange("titleText", e.target.value)}
                placeholder="Nhập tiêu đề..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font chữ
                </label>
                <select
                  value={localSettings.titleFont}
                  onChange={(e) => handleChange("titleFont", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {fonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <ColorPicker
                label="Màu chữ"
                value={localSettings.titleColor}
                onChange={(value) => handleChange("titleColor", value)}
              />

              <RangeSlider
                label="Kích thước chữ"
                value={localSettings.titleSize}
                onChange={(value) => handleChange("titleSize", value)}
                min={16}
                max={128}
                unit="px"
              />
            </div>
          </div>

          {/* Background Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🎨 Nền</h4>
            <div className="space-y-3">
              <ColorPicker
                label="Màu nền"
                value={localSettings.backgroundColor}
                onChange={(value) => handleChange("backgroundColor", value)}
              />

              <RangeSlider
                label="Độ trong suốt"
                value={localSettings.backgroundOpacity}
                onChange={(value) => handleChange("backgroundOpacity", value)}
                min={0}
                max={100}
                unit="%"
              />

              <RangeSlider
                label="Độ mờ"
                value={localSettings.backgroundBlur}
                onChange={(value) => handleChange("backgroundBlur", value)}
                min={0}
                max={50}
                unit="px"
              />
            </div>
          </div>

          {/* Logo Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🏆 Logo</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showLogos"
                  checked={localSettings.showLogos}
                  onChange={(e) => handleChange("showLogos", e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showLogos"
                  className="ml-2 text-sm text-gray-700"
                >
                  Hiển thị logo đội
                </label>
              </div>

              {localSettings.showLogos && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vị trí logo
                    </label>
                    <select
                      value={localSettings.logoPosition}
                      onChange={(e) =>
                        handleChange("logoPosition", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {logoPositions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <RangeSlider
                    label="Kích thước logo"
                    value={localSettings.logoSize}
                    onChange={(value) => handleChange("logoSize", value)}
                    min={40}
                    max={200}
                    unit="px"
                  />
                </>
              )}
            </div>
          </div>

          {/* Score Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">⚽ Tỉ số</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showScore"
                  checked={localSettings.showScore}
                  onChange={(e) => handleChange("showScore", e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showScore"
                  className="ml-2 text-sm text-gray-700"
                >
                  Hiển thị tỉ số
                </label>
              </div>

              {localSettings.showScore && (
                <>
                  <ColorPicker
                    label="Màu tỉ số"
                    value={localSettings.scoreColor}
                    onChange={(value) => handleChange("scoreColor", value)}
                  />

                  <RangeSlider
                    label="Kích thước tỉ số"
                    value={localSettings.scoreSize}
                    onChange={(value) => handleChange("scoreSize", value)}
                    min={24}
                    max={128}
                    unit="px"
                  />
                </>
              )}
            </div>
          </div>

          {/* Layout Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📐 Bố cục</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kiểu bố cục
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {layouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => handleChange("layout", layout.id)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        localSettings.layout === layout.id
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="block text-lg">{layout.icon}</span>
                      {layout.name}
                    </button>
                  ))}
                </div>
              </div>

              <RangeSlider
                label="Khoảng cách lề"
                value={localSettings.padding}
                onChange={(value) => handleChange("padding", value)}
                min={0}
                max={100}
                unit="px"
              />

              <RangeSlider
                label="Khoảng cách giữa"
                value={localSettings.spacing}
                onChange={(value) => handleChange("spacing", value)}
                min={0}
                max={100}
                unit="px"
              />
            </div>
          </div>

          {/* Animation Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">✨ Hiệu ứng</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAnimations"
                  checked={localSettings.enableAnimations}
                  onChange={(e) =>
                    handleChange("enableAnimations", e.target.checked)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="enableAnimations"
                  className="ml-2 text-sm text-gray-700"
                >
                  Bật hiệu ứng động
                </label>
              </div>

              {localSettings.enableAnimations && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kiểu hiệu ứng
                    </label>
                    <select
                      value={localSettings.animationType}
                      onChange={(e) =>
                        handleChange("animationType", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {animationTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <RangeSlider
                    label="Thời gian hiệu ứng"
                    value={localSettings.animationDuration}
                    onChange={(value) =>
                      handleChange("animationDuration", value)
                    }
                    min={100}
                    max={2000}
                    step={100}
                    unit="ms"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-4 flex space-x-3">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Đặt lại
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PosterSettings;
