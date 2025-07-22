import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Loading from "../common/Loading";

const PosterSelector = ({
  posters = [],
  selectedPoster,
  onPosterSelect,
  onCustomPoster,
  loading = false,
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả", icon: "🎯" },
    { id: "match", name: "Trận đấu", icon: "⚽" },
    { id: "lineup", name: "Đội hình", icon: "👥" },
    { id: "intro", name: "Giới thiệu", icon: "🎬" },
    { id: "halftime", name: "Giải lao", icon: "⏰" },
    { id: "celebration", name: "Ăn mừng", icon: "🎉" },
    { id: "custom", name: "Tùy chỉnh", icon: "🎨" },
  ];

  const filteredPosters = posters.filter(
    (poster) =>
      selectedCategory === "all" || poster.category === selectedCategory,
  );

  const PosterCard = ({ poster, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg 
        transition-all duration-200 cursor-pointer group
        ${isSelected ? "ring-2 ring-primary-500 ring-offset-2" : "hover:scale-105"}
      `}
    >
      {/* Poster Image */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {poster.thumbnail ? (
          <img
            src={poster.thumbnail}
            alt={poster.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
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
        )}
      </div>

      {/* Poster Info */}
      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-900 truncate">
          {poster.name}
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          {poster.category === "match" && "⚽ Trận đấu"}
          {poster.category === "lineup" && "👥 Đội hình"}
          {poster.category === "intro" && "🎬 Giới thiệu"}
          {poster.category === "halftime" && "⏰ Giải lao"}
          {poster.category === "celebration" && "🎉 Ăn mừng"}
          {poster.category === "custom" && "🎨 Tùy chỉnh"}
        </p>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Premium Badge */}
      {poster.isPremium && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          PRO
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`w-full ${className}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Chọn poster template
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 aspect-video rounded-lg mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4 mb-1"></div>
                <div className="bg-gray-300 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
                ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredPosters.slice(0, 8).map((poster) => (
              <PosterCard
                key={poster.id}
                poster={poster}
                isSelected={selectedPoster?.id === poster.id}
                onClick={() => onPosterSelect(poster)}
              />
            ))}
          </div>
        )}

        {filteredPosters.length === 0 && !loading && (
          <div className="text-center py-12">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Không có poster nào
            </h4>
            <p className="text-gray-500 mb-4">
              Chưa có mẫu poster cho danh mục này
            </p>
            <Button variant="primary" onClick={onCustomPoster}>
              Tạo poster tùy chỉnh
            </Button>
          </div>
        )}
      </div>

      {/* Full Poster Selection Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Chọn mẫu poster"
        size="xl"
      >
        <div className="space-y-6">
                    {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                  ${
                    selectedCategory === category.id
                      ? "bg-primary-100 text-primary-800 border border-primary-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <span className="mr-1">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Poster Grid */}
          {loading ? (
            <Loading size="lg" text="Đang tải poster..." />
          ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-96 overflow-y-auto">
              {filteredPosters.map((poster) => (
                <PosterCard
                  key={poster.id}
                  poster={poster}
                  isSelected={selectedPoster?.id === poster.id}
                  onClick={() => {
                    onPosterSelect(poster);
                    setShowModal(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PosterSelector;
