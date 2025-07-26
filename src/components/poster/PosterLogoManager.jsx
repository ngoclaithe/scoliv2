import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const PosterLogoManager = ({ matchData, onPosterUpdate, onLogoUpdate, onClose }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [logoItems, setLogoItems] = useState([]); // Gộp chung logo và banner
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

  // Logo data với tên đơn vị
  const sampleLogos = [
    {
      id: "logo-1",
      unitName: "Liên đoàn bóng đá VN",
      code: "VFF",
      type: "logo",
      url: null,
      category: "organizer",
      displayPositions: [] // ["top-left", "top-right", "bottom"]
    },
    {
      id: "logo-2",
      unitName: "VPF Vietnam",
      code: "VPF",
      type: "logo",
      url: null,
      category: "organizer",
      displayPositions: []
    },
    {
      id: "logo-3",
      unitName: "Đài Truyền hình VN",
      code: "VTV",
      type: "logo",
      url: null,
      category: "media",
      displayPositions: []
    },
    {
      id: "logo-4",
      unitName: "FPT Play",
      code: "FPTPLAY",
      type: "logo",
      url: null,
      category: "media",
      displayPositions: []
    },
    {
      id: "logo-5",
      unitName: "Bia Saigon",
      code: "SAIGON",
      type: "logo",
      url: null,
      category: "sponsor",
      displayPositions: []
    },
    {
      id: "logo-6",
      unitName: "Vingroup",
      code: "VIN",
      type: "logo",
      url: null,
      category: "sponsor",
      displayPositions: []
    },
    {
      id: "logo-7",
      unitName: "VietinBank",
      code: "VTB",
      type: "logo",
      url: null,
      category: "sponsor",
      displayPositions: []
    },
    {
      id: "logo-8",
      unitName: "FPT Corporation",
      code: "FPT",
      type: "logo",
      url: null,
      category: "sponsor",
      displayPositions: []
    },
    {
      id: "logo-9",
      unitName: "V-League 2024",
      code: "VL2024",
      type: "logo",
      url: null,
      category: "tournament",
      displayPositions: []
    },
    {
      id: "logo-10",
      unitName: "AFF Cup",
      code: "AFF",
      type: "logo",
      url: null,
      category: "tournament",
      displayPositions: []
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

  // Kết hợp sample logos với custom items
  const allLogoItems = [...sampleLogos, ...logoItems];

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

  const LogoItem = ({ item, onUpdate, onRemove }) => {
    const getShapeClass = () => {
      switch (logoDisplayOptions.shape) {
        case 'square': return 'rounded';
        case 'hexagon': return 'rounded-lg';
        default: return 'rounded-full';
      }
    };

    const handlePositionToggle = (position) => {
      const newPositions = item.displayPositions.includes(position)
        ? item.displayPositions.filter(p => p !== position)
        : [...item.displayPositions, position];
      
      onUpdate(item.id, { ...item, displayPositions: newPositions });
    };

    const handleCodeChange = (newCode) => {
      onUpdate(item.id, { ...item, code: newCode });
    };

    return (
      <div className="flex-none w-24 bg-white border border-gray-200 rounded p-2 relative">
        {/* Remove button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
        >
          ×
        </button>

        {/* Logo preview */}
        <div className={`aspect-square bg-gray-100 ${getShapeClass()} mb-1 flex items-center justify-center text-xs font-bold`}>
          {item.url ? (
            <img
              src={item.url}
              alt={item.unitName}
              className="w-full h-full object-contain p-0.5"
            />
          ) : (
            <span className="text-gray-600">{item.code}</span>
          )}
        </div>

        {/* Unit name */}
        <div className="text-xs font-medium text-gray-900 truncate mb-1" title={item.unitName}>
          {item.unitName}
        </div>

        {/* Code input */}
        <input
          type="text"
          value={item.code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-full text-xs text-center border border-gray-200 rounded px-1 py-0.5 font-mono mb-2"
          placeholder="Mã"
        />

        {/* Position toggles */}
        <div className="text-xs text-gray-600 mb-1">Hiển thị:</div>
        <div className="flex justify-center gap-1">
          {[
            { key: 'top-left', icon: '📍', title: 'Góc trái trên' },
            { key: 'top-right', icon: '🎯', title: 'Góc phải trên' },
            { key: 'bottom', icon: '🏷️', title: 'Góc dưới' }
          ].map((pos) => (
            <button
              key={pos.key}
              onClick={() => handlePositionToggle(pos.key)}
              className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition-all ${
                item.displayPositions.includes(pos.key)
                  ? 'border-blue-500 bg-blue-100 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
              title={pos.title}
            >
              {pos.icon}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster);
  };

  const handleItemUpdate = (itemId, updatedItem) => {
    const isFromSample = sampleLogos.find(logo => logo.id === itemId);
    
    if (isFromSample) {
      // Update sample logos in-place (for this session)
      const sampleIndex = sampleLogos.findIndex(logo => logo.id === itemId);
      if (sampleIndex !== -1) {
        sampleLogos[sampleIndex] = updatedItem;
      }
    } else {
      // Update custom items
      setLogoItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
    }
  };

  const handleItemRemove = (itemId) => {
    const isFromSample = sampleLogos.find(logo => logo.id === itemId);
    
    if (isFromSample) {
      // Reset sample logo to default state
      const sampleIndex = sampleLogos.findIndex(logo => logo.id === itemId);
      if (sampleIndex !== -1) {
        sampleLogos[sampleIndex].displayPositions = [];
      }
    } else {
      // Remove custom item
      setLogoItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleAddNewLogo = () => {
    const newLogo = {
      id: `custom-logo-${Date.now()}`,
      unitName: `Logo ${logoItems.filter(item => item.type === 'logo').length + 1}`,
      code: `LOGO${logoItems.filter(item => item.type === 'logo').length + 1}`,
      type: "logo",
      category: activeLogoCategory,
      url: null,
      displayPositions: []
    };
    setLogoItems(prev => [...prev, newLogo]);
  };

  const handleAddNewBanner = () => {
    const newBanner = {
      id: `custom-banner-${Date.now()}`,
      unitName: `Banner ${logoItems.filter(item => item.type === 'banner').length + 1}`,
      code: `BAN${logoItems.filter(item => item.type === 'banner').length + 1}`,
      type: "banner",
      category: activeLogoCategory,
      url: null,
      displayPositions: []
    };
    setLogoItems(prev => [...prev, newBanner]);
  };

  const handleSave = () => {
    if (selectedPoster) {
      onPosterUpdate?.(selectedPoster);
    }
    
    const activeItems = allLogoItems.filter(item => 
      item.category === activeLogoCategory && 
      (item.displayPositions.length > 0 || logoItems.includes(item))
    );
    
    if (activeItems.length > 0) {
      onLogoUpdate?.({
        logoItems: activeItems,
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

  const renderLogoSection = () => {
    const currentItems = allLogoItems.filter(item => item.category === activeLogoCategory);

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

        {/* Items scroll list */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* Existing items */}
          {currentItems.map((item) => (
            <LogoItem
              key={item.id}
              item={item}
              onUpdate={handleItemUpdate}
              onRemove={handleItemRemove}
            />
          ))}

          {/* Add Logo Button */}
          <div
            onClick={handleAddNewLogo}
            className="flex-none w-24 bg-white border-2 border-dashed border-gray-300 rounded p-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center h-28"
          >
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mb-1">
              <span className="text-xs text-gray-400">+</span>
            </div>
            <p className="text-xs text-gray-600 font-medium text-center">
              Thêm Logo
            </p>
          </div>

          {/* Add Banner Button */}
          <div
            onClick={handleAddNewBanner}
            className="flex-none w-24 bg-white border-2 border-dashed border-orange-300 rounded p-2 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex flex-col items-center justify-center h-28"
          >
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mb-1">
              <span className="text-xs text-orange-400">+</span>
            </div>
            <p className="text-xs text-orange-600 font-medium text-center">
              Thêm Banner
            </p>
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
            
            {allLogoItems.filter(item => item.displayPositions.length > 0).length > 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Logo/Banner: {allLogoItems.filter(item => item.displayPositions.length > 0).length} đã chọn
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
            disabled={!selectedPoster && allLogoItems.filter(item => item.displayPositions.length > 0).length === 0}
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
