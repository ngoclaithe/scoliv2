import React, { useState } from "react";
import Button from "../common/Button";

const LogoTypeSelector = ({
  selectedType,
  onTypeSelect,
  showPreview = true,
  className = "",
}) => {
  const [hoveredType, setHoveredType] = useState(null);

  const logoTypes = [
    {
      id: "official",
      name: "Logo chính thức",
      description: "Logo chính thức của đội bóng",
      icon: "🏆",
      features: ["Chất lượng cao", "Được cấp phép", "Cập nhật mới nhất"],
      preview: "/previews/official-logo.jpg",
    },
    {
      id: "alternative",
      name: "Logo phụ",
      description: "Logo phụ hoặc biến thể của đội",
      icon: "⚽",
      features: ["Đa dạng phong cách", "Phù hợp nhiều ngữ cảnh", "Sáng tạo"],
      preview: "/previews/alt-logo.jpg",
    },
    {
      id: "vintage",
      name: "Logo cổ điển",
      description: "Logo phong cách retro, cổ điển",
      icon: "📜",
      features: ["Phong cách retro", "Tôn vinh lịch sử", "Độc đáo"],
      preview: "/previews/vintage-logo.jpg",
    },
    {
      id: "minimal",
      name: "Logo tối giản",
      description: "Thiết kế đơn giản, hiện đại",
      icon: "⚪",
      features: ["Đơn giản", "Hiện đại", "Dễ nhận diện"],
      preview: "/previews/minimal-logo.jpg",
    },
    {
      id: "custom",
      name: "Logo tùy chỉnh",
      description: "Tạo logo riêng theo ý tưởng",
      icon: "🎨",
      features: ["Hoàn toàn tùy chỉnh", "Sáng tạo tự do", "Độc quyền"],
      preview: "/previews/custom-logo.jpg",
    },
    {
      id: "text-only",
      name: "Chỉ có chữ",
      description: "Logo dạng text, không có hình ảnh",
      icon: "📝",
      features: ["Dễ đọc", "Phù hợp mọi kích thước", "Chuyên nghiệp"],
      preview: "/previews/text-logo.jpg",
    },
  ];

  const handleTypeSelect = (type) => {
    onTypeSelect(type);
  };

  const getTypeStyle = (type) => {
    const isSelected = selectedType === type.id;
    const isHovered = hoveredType === type.id;

    return `
      relative p-4 rounded-xl border-2 transition-all cursor-pointer
      ${
        isSelected
          ? "border-primary-500 bg-primary-50 shadow-md"
          : isHovered
            ? "border-primary-300 bg-primary-25 shadow-sm"
            : "border-gray-200 hover:border-gray-300 bg-white"
      }
    `;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chọn loại logo
          </h3>
          <p className="text-gray-600">
            Lựa chọn phong cách logo phù hợp với đội bóng của bạn
          </p>
        </div>

        {/* Logo Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logoTypes.map((type) => (
            <div
              key={type.id}
              className={getTypeStyle(type)}
              onClick={() => handleTypeSelect(type)}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
            >
              {/* Selection Indicator */}
              {selectedType === type.id && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="text-center mb-3">
                <span className="text-3xl">{type.icon}</span>
              </div>

              {/* Type Info */}
              <div className="text-center mb-3">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {type.name}
                </h4>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {type.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs text-gray-500"
                  >
                    <svg
                      className="w-3 h-3 text-green-500 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Preview (if enabled) */}
              {showPreview && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="w-full h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {type.preview ? (
                      <img
                        src={type.preview}
                        alt={`${type.name} preview`}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <div className="text-gray-400 text-xs hidden">
                      Xem trước
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Type Info */}
        {selectedType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">
                  {logoTypes.find((t) => t.id === selectedType)?.icon}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Đã chọn: {logoTypes.find((t) => t.id === selectedType)?.name}
                </h4>
                <p className="text-blue-700 text-sm mb-2">
                  {logoTypes.find((t) => t.id === selectedType)?.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {logoTypes
                    .find((t) => t.id === selectedType)
                    ?.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!selectedType}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          >
            Tìm logo theo loại
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!selectedType}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Tạo logo mới
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>
            💡 <strong>Mẹo:</strong> Logo chính thức thường có chất lượng tốt
            nhất. Logo tùy chỉnh cho phép bạn sáng tạo theo ý muốn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoTypeSelector;
