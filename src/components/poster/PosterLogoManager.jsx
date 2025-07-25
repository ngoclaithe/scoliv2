import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const PosterLogoManager = ({ matchData, onPosterUpdate, onLogoUpdate, onClose }) => {
  const [activeSection, setActiveSection] = useState("posters");
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedLogos, setSelectedLogos] = useState([]); // Thay đổi thành array để chọn nhiều logo
  const [activeLogoCategory, setActiveLogoCategory] = useState("sponsor"); // Tab hiện tại cho logo
  const [showAddLogoForm, setShowAddLogoForm] = useState(false); // Hiển thị form thêm logo

  // Posters từ thư mục public/images/posters
  const availablePosters = [
    {
      id: "poster-1",
      name: "Trẻ trung",
      thumbnail: "/images/posters/poster1.jpg",
    },
    {
      id: "poster-2",
      name: "Hào Quang",
      thumbnail: "/images/posters/poster2.jpg",
    },
    {
      id: "poster-3",
      name: "Cầu trường",
      thumbnail: "/images/posters/poster3.jpg",
    },
    {
      id: "poster-4",
      name: "Nền vàng",
      thumbnail: "/images/posters/poster4.jpg",
    },
    {
      id: "poster-5",
      name: "Vàng xanh",
      thumbnail: "/images/posters/poster5.jpg",
    },
    {
      id: "poster-6",
      name: "Tranh tài",
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
      name: "VPF - Công ty CP bóng đá chuyên nghi���p Việt Nam",
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



  const PosterCard = ({ poster, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg
        transition-shadow duration-200 cursor-pointer group
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
      `}
    >
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {poster.thumbnail ? (
          <img
            src={poster.thumbnail}
            alt={poster.name}
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
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

      <div className="p-2">
        <h4 className="font-medium text-xs text-gray-900 truncate">
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



  const AddLogoForm = () => {
    const [logoData, setLogoData] = useState({
      name: "",
      logoCode: "",
      position: "corner-left"
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (logoData.logoCode.trim()) {
        handleAddNewLogo({
          ...logoData,
          name: logoData.logoCode // Dùng logoCode làm name
        });
        setLogoData({ name: "", logoCode: "", position: "" });
      }
    };

    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MÃ LOGO:</label>
            <Input
              value={logoData.logoCode}
              onChange={(e) => setLogoData(prev => ({ ...prev, logoCode: e.target.value }))}
              placeholder="Nhập mã logo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HIỂN THỊ TRONG TRẬN:</label>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setLogoData(prev => ({
                  ...prev,
                  position: prev.position === "corner-left" ? "" : "corner-left"
                }))}
                className={`
                  w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all
                  ${logoData.position === "corner-left"
                    ? 'border-blue-500 bg-blue-100 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }
                `}
                title="Góc trái trên"
              >
                📍
              </button>
              <button
                type="button"
                onClick={() => setLogoData(prev => ({
                  ...prev,
                  position: prev.position === "corner-right" ? "" : "corner-right"
                }))}
                className={`
                  w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all
                  ${logoData.position === "corner-right"
                    ? 'border-blue-500 bg-blue-100 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }
                `}
                title="Góc trái dưới"
              >
                🎯
              </button>
              <button
                type="button"
                onClick={() => setLogoData(prev => ({
                  ...prev,
                  position: prev.position === "bottom" ? "" : "bottom"
                }))}
                className={`
                  w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all
                  ${logoData.position === "bottom"
                    ? 'border-blue-500 bg-blue-100 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }
                `}
                title="Góc phải dưới"
              >
                🏷️
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              THÊM
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowAddLogoForm(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              XÓA
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster);
    // Không tự động chuyển tab nữa vì đã bỏ preview
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
    if (selectedLogos.length > 0) {
      onLogoUpdate?.({
        selectedLogos: selectedLogos,
        logoData: selectedLogos.map(logo => ({ logo, position: logo.position || "default" }))
      });
    }
    onClose();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "posters":
        return (
          <div className="space-y-2">
            {selectedPoster && (
              <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
                <p className="text-xs font-medium text-blue-800">
                  ✅ Đã chọn: {selectedPoster.name}
                </p>
              </div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {availablePosters.map((poster) => (
                <div key={poster.id} className="flex-none w-40">
                  <PosterCard
                    poster={poster}
                    isSelected={selectedPoster?.id === poster.id}
                    onClick={() => handlePosterSelect(poster)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "logos":
        const currentCategoryLogos = selectedLogos.filter(logo => logo.category === activeLogoCategory);

        return (
          <div className="space-y-2">
            {/* Logo Category Tabs */}
            <div className="flex justify-center mb-3">
              <div className="inline-flex bg-gray-100 rounded p-1">
                {logoTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveLogoCategory(type.id)}
                    className={`
                      px-2 py-1 text-xs font-medium rounded transition-all duration-200
                      ${activeLogoCategory === type.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Logos Display - Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-3">
              {currentCategoryLogos.map((logo) => (
                <div key={logo.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleLogoSelect(logo)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {logo.url ? (
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {logo.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">MÃ LOGO</h4>
                    <p className="text-xs text-gray-600 mb-2 font-mono">{logo.logoCode || logo.name}</p>

                    <div className="text-xs text-gray-600">
                      <span className="font-medium">HIỂN THỊ TRONG TRẬN:</span>
                      <div className="mt-2 flex justify-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" title="Góc trái trên">
                          📍
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" title="Góc trái dưới">
                          🎯
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" title="Góc phải dưới">
                          🏷️
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                    >
                      THÊM
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleLogoSelect(logo)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                    >
                      XÓA
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Logo Card */}
              {showAddLogoForm ? (
                <AddLogoForm />
              ) : (
                <div
                  onClick={() => setShowAddLogoForm(true)}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center min-h-[300px]"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium text-center">
                    Thêm {logoTypes.find(t => t.id === activeLogoCategory)?.name}
                  </p>
                </div>
              )}
            </div>

            
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Copy Poster Section */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-gray-700">Copy poster trận trước:</span>
        <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
          <option value="">Chọn trận</option>
          <option value="match1">Hà Nội vs TPHCM (15/01)</option>
          <option value="match2">Viettel vs HAGL (12/01)</option>
          <option value="match3">SHB vs Thanh Hóa (10/01)</option>
        </select>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex-1 py-2 px-2 text-center font-medium text-xs border-b-2 transition-all duration-200
                ${
                  activeSection === section.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span className="mr-1">{section.icon}</span>
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
          <div className="flex flex-wrap items-center gap-2">
            {selectedPoster ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ✅ Poster: {selectedPoster.name}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ❌ Chưa chọn poster
              </span>
            )}
            {selectedLogos.length > 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Logo: {selectedLogos.length} đã chọn
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ❌ Chưa chọn logo
              </span>
            )}
          </div>
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
            disabled={!selectedPoster && selectedLogos.length === 0}
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
