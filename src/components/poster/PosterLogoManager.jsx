import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const PosterLogoManager = ({ matchData, onPosterUpdate, onLogoUpdate, onClose }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedLogos, setSelectedLogos] = useState([]);
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [activeLogoCategory, setActiveLogoCategory] = useState("sponsor");
  
  // State cho các tùy chọn hiển thị logo
  const [logoDisplayOptions, setLogoDisplayOptions] = useState({
    shape: "round", // round, square, hexagon
    rotateDisplay: false
  });

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
      code: "VFF",
      url: null,
      category: "organizer",
    },
    {
      id: "logo-2",
      name: "VPF - Công ty CP bóng đá chuyên nghiệp Việt Nam",
      code: "VPF",
      url: null,
      category: "organizer",
    },
    {
      id: "logo-3",
      name: "VTV - Đài Truyền hình Việt Nam",
      code: "VTV",
      url: null,
      category: "media",
    },
    {
      id: "logo-4",
      name: "FPT Play - Nền tảng giải trí số",
      code: "FPTPLAY",
      url: null,
      category: "media",
    },
    {
      id: "logo-5",
      name: "Bia Saigon - Nhà tài trợ chính",
      code: "SAIGON",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-6",
      name: "Vingroup - Tập đoàn đa ngành",
      code: "VIN",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-7",
      name: "VietinBank - Ngân hàng thương mại",
      code: "VTB",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-8",
      name: "FPT - Tập đoàn công nghệ",
      code: "FPT",
      url: null,
      category: "sponsor",
    },
    {
      id: "logo-9",
      name: "V-League 2024 - Giải đấu",
      code: "VL2024",
      url: null,
      category: "tournament",
    },
    {
      id: "logo-10",
      name: "AFF Cup - Giải vô địch",
      code: "AFF",
      url: null,
      category: "tournament",
    },
  ];

  const logoTypes = [
    {
      id: "sponsor",
      name: "TÀI TRỢ",
      icon: "💰",
    },
    {
      id: "organizer",
      name: "TỔ CHỨC",
      icon: "🏛️",
    },
    {
      id: "media",
      name: "TRUYỀN THÔNG",
      icon: "📺",
    },
    {
      id: "tournament",
      name: "GIẢI ĐẤU",
      icon: "🏆",
    },
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
          <span className="text-gray-500 font-medium text-xs">{poster.name}</span>
        </div>
      </div>

      <div className="p-2">
        <h4 className="font-medium text-xs text-gray-900 truncate">
          {poster.name}
        </h4>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
        return prev.filter(l => l.id !== logo.id);
      } else {
        return [...prev, logo];
      }
    });
  };

  const handleBannerSelect = (banner) => {
    setSelectedBanners(prev => {
      const isSelected = prev.find(b => b.id === banner.id);
      if (isSelected) {
        return prev.filter(b => b.id !== banner.id);
      } else {
        return [...prev, banner];
      }
    });
  };

  const handleAddNewLogo = () => {
    const newLogo = {
      id: `custom-logo-${Date.now()}`,
      code: `LOGO${selectedLogos.length + 1}`,
      name: `Logo ${selectedLogos.length + 1}`,
      category: activeLogoCategory,
      url: null
    };
    setSelectedLogos(prev => [...prev, newLogo]);
  };

  const handleAddNewBanner = () => {
    const newBanner = {
      id: `custom-banner-${Date.now()}`,
      code: `BAN${selectedBanners.length + 1}`,
      name: `Banner ${selectedBanners.length + 1}`,
      category: activeLogoCategory,
      url: null
    };
    setSelectedBanners(prev => [...prev, newBanner]);
  };

  const handleSave = () => {
    if (selectedPoster) {
      onPosterUpdate?.(selectedPoster);
    }
    if (selectedLogos.length > 0 || selectedBanners.length > 0) {
      onLogoUpdate?.({
        selectedLogos,
        selectedBanners,
        displayOptions: logoDisplayOptions
      });
    }
    onClose();
  };

  const renderPosterSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="text-sm">🎨</span>
          <h3 className="text-sm font-semibold text-gray-900">Poster</h3>
        </div>
        
        {selectedPoster && (
          <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
            <p className="text-xs font-medium text-blue-800">
              ✅ {selectedPoster.name}
            </p>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availablePosters.map((poster) => (
            <div key={poster.id} className="flex-none w-32">
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
  };

  const LogoItem = ({ item, isSelected, onToggle, onCodeChange, type = "logo" }) => {
    const getShapeClass = () => {
      switch (logoDisplayOptions.shape) {
        case 'square': return 'rounded';
        case 'hexagon': return 'rounded-lg';
        default: return 'rounded-full';
      }
    };

    return (
      <div className="flex-none w-20 bg-white border border-gray-200 rounded p-1 relative">
        <button
          onClick={onToggle}
          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs ${
            isSelected 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
          }`}
        >
          {isSelected ? '✓' : '+'}
        </button>

        <div className={`aspect-square bg-gray-100 ${getShapeClass()} mb-1 flex items-center justify-center text-xs font-bold`}>
          {item.url ? (
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-contain p-0.5"
            />
          ) : (
            <span className="text-gray-600">{item.code}</span>
          )}
        </div>

        <input
          type="text"
          value={item.code}
          onChange={(e) => onCodeChange(item.id, e.target.value)}
          className="w-full text-xs text-center border border-gray-200 rounded px-1 py-0.5 font-mono"
          placeholder="Mã"
        />
      </div>
    );
  };

  const renderLogoSection = () => {
    const availableLogos = sampleLogos.filter(logo => logo.category === activeLogoCategory);
    const currentSelectedLogos = selectedLogos.filter(logo => logo.category === activeLogoCategory);
    const currentSelectedBanners = selectedBanners.filter(banner => banner.category === activeLogoCategory);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="text-sm">🏆</span>
          <h3 className="text-sm font-semibold text-gray-900">Logo & Banner</h3>
        </div>
        
        {/* Logo Category Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded p-0.5">
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

        {/* Available + Selected Logos in one row */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Logo:</div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {/* Available Logos */}
            {availableLogos.map((logo) => (
              <LogoItem
                key={logo.id}
                item={logo}
                isSelected={selectedLogos.find(l => l.id === logo.id)}
                onToggle={() => handleLogoSelect(logo)}
                onCodeChange={(id, newCode) => {
                  const updatedLogos = selectedLogos.map(l => 
                    l.id === id ? { ...l, code: newCode } : l
                  );
                  if (updatedLogos.find(l => l.id === id)) {
                    setSelectedLogos(updatedLogos);
                  }
                }}
                type="logo"
              />
            ))}
            
            {/* Custom Selected Logos */}
            {currentSelectedLogos.filter(logo => !availableLogos.find(a => a.id === logo.id)).map((logo) => (
              <LogoItem
                key={logo.id}
                item={logo}
                isSelected={true}
                onToggle={() => handleLogoSelect(logo)}
                onCodeChange={(id, newCode) => {
                  setSelectedLogos(prev => prev.map(l => 
                    l.id === id ? { ...l, code: newCode } : l
                  ));
                }}
                type="logo"
              />
            ))}

            {/* Add Logo Button */}
            <div
              onClick={handleAddNewLogo}
              className="flex-none w-20 bg-white border-2 border-dashed border-gray-300 rounded p-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center h-16"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-400">+</span>
              </div>
              <p className="text-xs text-gray-600 font-medium text-center mt-1">
                Logo
              </p>
            </div>
          </div>

          <div className="text-xs font-medium text-gray-700">Banner:</div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {/* Custom Selected Banners */}
            {currentSelectedBanners.map((banner) => (
              <LogoItem
                key={banner.id}
                item={banner}
                isSelected={true}
                onToggle={() => handleBannerSelect(banner)}
                onCodeChange={(id, newCode) => {
                  setSelectedBanners(prev => prev.map(b => 
                    b.id === id ? { ...b, code: newCode } : b
                  ));
                }}
                type="banner"
              />
            ))}

            {/* Add Banner Button */}
            <div
              onClick={handleAddNewBanner}
              className="flex-none w-20 bg-white border-2 border-dashed border-gray-300 rounded p-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center h-16"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-400">+</span>
              </div>
              <p className="text-xs text-gray-600 font-medium text-center mt-1">
                Banner
              </p>
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="border-t border-gray-200 pt-2 space-y-2">
          <div className="text-xs font-medium text-gray-700">Tùy chọn hiển thị:</div>
          
          {/* Shape Options */}
          <div className="flex gap-2">
            {[
              { value: 'round', label: 'Tròn', icon: '⭕' },
              { value: 'square', label: 'Vuông', icon: '⬜' },
              { value: 'hexagon', label: 'Lục giác', icon: '⬡' }
            ].map((shape) => (
              <label key={shape.value} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="logoShape"
                  value={shape.value}
                  checked={logoDisplayOptions.shape === shape.value}
                  onChange={(e) => setLogoDisplayOptions(prev => ({ ...prev, shape: e.target.value }))}
                  className="w-3 h-3"
                />
                <span className="text-xs">{shape.icon}</span>
                <span className="text-xs">{shape.label}</span>
              </label>
            ))}
          </div>

          {/* Rotate Display Option */}
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={logoDisplayOptions.rotateDisplay}
              onChange={(e) => setLogoDisplayOptions(prev => ({ ...prev, rotateDisplay: e.target.checked }))}
              className="w-3 h-3"
            />
            <span className="text-xs">🔄 Hiển thị luân phiên</span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Copy Poster Section */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-700">Copy poster trận trước:</span>
        <select className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white">
          <option value="">Chọn trận</option>
          <option value="match1">Hà Nội vs TPHCM (15/01)</option>
          <option value="match2">Viettel vs HAGL (12/01)</option>
          <option value="match3">SHB vs Thanh Hóa (10/01)</option>
        </select>
      </div>

      {/* Poster Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        {renderPosterSection()}
      </div>

      {/* Logo Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        {renderLogoSection()}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <div className="flex flex-wrap items-center gap-1">
            {selectedPoster ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ✅ Poster: {selectedPoster.name}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ❌ Chưa chọn poster
              </span>
            )}
            {(selectedLogos.length > 0 || selectedBanners.length > 0) ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Logo: {selectedLogos.length} | Banner: {selectedBanners.length}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ❌ Chưa chọn logo/banner
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 sm:flex-none text-xs px-3 py-1"
          >
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="flex-1 sm:flex-none text-xs px-3 py-1"
            disabled={!selectedPoster && selectedLogos.length === 0 && selectedBanners.length === 0}
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
