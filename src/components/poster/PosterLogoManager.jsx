import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Loading from "../common/Loading";

const PosterLogoManager = ({ matchData, onPosterUpdate, onLogoUpdate, onClose }) => {
  const [activeSection, setActiveSection] = useState("posters");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedLogos, setSelectedLogos] = useState([]); // Thay đổi thành array để chọn nhiều logo
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLogoCategory, setActiveLogoCategory] = useState("sponsor"); // Tab hiện tại cho logo
  const [showAddLogoForm, setShowAddLogoForm] = useState(false); // Hiển thị form thêm logo

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

  // Logo data
  const sampleLogos = [
    {
      id: "logo-1",
      name: "VFF - Liên đoàn bóng đá Việt Nam",
      url: null,
      category: "organizer",
    },
    {
      id: "logo-2",
      name: "VPF - Công ty CP bóng đá chuyên nghiệp Việt Nam",
      url: null,
      category: "organizer",
    },
    {
      id: "logo-3",
      name: "VTV - Đài Truyền hình Việt Nam",
      url: null,
      category: "media",
    },
    {
      id: "logo-4",
      name: "FPT Play - Nền tảng giải trí số",
      url: null,
      category: "media",
    },
    {
      id: "logo-5",
      name: "Bia Saigon - Nhà tài trợ chính",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-6",
      name: "Vingroup - Tập đoàn đa ngành",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-7",
      name: "VietinBank - Ngân hàng thương mại",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-8",
      name: "FPT - Tập đoàn công nghệ",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-9",
      name: "V-League 2024 - Giải đấu",
      url: null,
      category: "tournament",
    },
    {
      id: "logo-10",
      name: "AFF Cup - Giải vô địch",
      url: null,
      category: "tournament",
    },
  ];

  const logoTypes = [
    {
      id: "sponsor",
      name: "TÀI TRỢ",
      icon: "💰",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "organizer",
      name: "TỔ CHỨC",
      icon: "🏛️",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "media",
      name: "TRUYỀN THÔNG",
      icon: "📺",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "tournament",
      name: "GIẢI ĐẤU",
      icon: "🏆",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const sections = [
    { id: "posters", name: "Chọn Poster", icon: "🎨" },
    { id: "logos", name: "Chọn Logo", icon: "🏆" },
  ];

  const filteredLogos = sampleLogos.filter((logo) =>
    logo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PosterCard = ({ poster, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg 
        transition-all duration-200 cursor-pointer group
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:scale-105"}
      `}
    >
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {poster.thumbnail ? (
          <img
            src={poster.thumbnail}
            alt={poster.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
          <span className="text-gray-500 font-medium">{poster.name}</span>
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-900 truncate">
          {poster.name}
        </h4>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );

  const LogoCard = ({ logo, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }
      `}
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        {logo.url ? (
          <img
            src={logo.url}
            alt={logo.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="text-gray-400 text-2xl font-bold">
            {logo.name.charAt(0)}
          </div>
        )}
      </div>

      <div>
        <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
          {logo.name}
        </h4>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            logoTypes.find((type) => type.id === logo.category)?.color
          }`}
        >
          {logoTypes.find((type) => type.id === logo.category)?.icon}
          <span className="ml-1">
            {logoTypes.find((type) => type.id === logo.category)?.name}
          </span>
        </span>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster);
  };

  const handleLogoSelect = (logo) => {
    setSelectedLogos(prev => {
      const isSelected = prev.find(l => l.id === logo.id);
      if (isSelected) {
        // Bỏ chọn logo
        return prev.filter(l => l.id !== logo.id);
      } else {
        // Thêm logo vào danh sách đã chọn
        return [...prev, logo];
      }
    });
  };

  const handleAddNewLogo = (newLogoData) => {
    // Logic thêm logo mới
    const newLogo = {
      id: `custom-${Date.now()}`,
      name: newLogoData.name,
      url: newLogoData.url,
      category: activeLogoCategory,
      position: newLogoData.position || "default"
    };

    setSelectedLogos(prev => [...prev, newLogo]);
    setShowAddLogoForm(false);
  };

  const handleSave = () => {
    if (selectedPoster) {
      onPosterUpdate?.(selectedPoster);
    }
    if (selectedLogo) {
      onLogoUpdate?.({
        selectedLogo: selectedLogo,
        logoData: { logo: selectedLogo, position: "default" }
      });
    }
    onClose();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "posters":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Chọn Poster Template
              </h3>
              {selectedPoster && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-sm font-medium text-blue-800">
                    ✅ Đã chọn: {selectedPoster.name}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-96 overflow-y-auto">
              {availablePosters.map((poster) => (
                <PosterCard
                  key={poster.id}
                  poster={poster}
                  isSelected={selectedPoster?.id === poster.id}
                  onClick={() => handlePosterSelect(poster)}
                />
              ))}
            </div>
          </div>
        );

      case "logos":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Chọn Logo
              </h3>
              {selectedLogo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-sm font-medium text-blue-800">
                    ✅ Đã chọn: {selectedLogo.name}
                  </p>
                </div>
              )}
            </div>

            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm logo..."
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
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
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-80 overflow-y-auto">
              {filteredLogos.map((logo) => (
                <LogoCard
                  key={logo.id}
                  logo={logo}
                  isSelected={selectedLogo?.id === logo.id}
                  onClick={() => handleLogoSelect(logo)}
                />
              ))}
            </div>

            {filteredLogos.length === 0 && (
              <div className="text-center py-8">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy logo
                </h3>
                <p className="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex-1 py-3 px-4 text-center font-medium text-sm border-b-2 transition-all duration-200
                ${
                  activeSection === section.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span className="mr-2">{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderContent()}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p>
            {selectedPoster ? `Poster: ${selectedPoster.name}` : "Chưa chọn poster"}
            {selectedPoster && selectedLogo && " • "}
            {selectedLogo ? `Logo: ${selectedLogo.name}` : selectedPoster ? "" : "Chưa chọn logo"}
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="flex-1 sm:flex-none"
            disabled={!selectedPoster && !selectedLogo}
          >
            <span className="mr-1">💾</span>
            Lưu & Áp Dụng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PosterLogoManager;
