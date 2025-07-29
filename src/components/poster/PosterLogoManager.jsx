import React, { useState, useEffect, useCallback } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import LogoAPI from "../../API/apiLogo";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PosterLogoManager = ({ matchData, onPosterUpdate, onLogoUpdate, onClose }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [logoItems, setLogoItems] = useState([]);
  const [apiLogos, setApiLogos] = useState([]);
  const [activeLogoCategory, setActiveLogoCategory] = useState("sponsor");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [logoDisplayOptions, setLogoDisplayOptions] = useState({
    shape: "round",
    rotateDisplay: false
  });

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

  useEffect(() => {
    const loadLogos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        setApiLogos([]);
        
      } catch (err) {
        console.error("Error loading logos:", err);
        setError("Không thể tải danh sách logo. Vui lòng thử lại.");
        setApiLogos([]);
      } finally {
        setLoading(false);
      }
    };

    loadLogos();
  }, []);

  const getCategoryFromType = (type) => {
    const typeMapping = {
      'banner': 'sponsor',
      'logo': 'sponsor',
      'organizer': 'organizer',
      'media': 'media',
      'tournament': 'tournament',
      'other': 'sponsor'
    };
    return typeMapping[type] || 'sponsor';
  };

  const handleFileUpload = async (event, item) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file tối đa là 5MB");
      return;
    }

    // Kiểm tra định dạng file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Tạo preview ảnh
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const previewUrl = e.target.result;
      
      // Cập nhật UI với preview ảnh
      setLogoItems(prev => prev.map(logo => 
        logo.id === item.id 
          ? { ...logo, 
              url: previewUrl, 
              file, 
              uploadStatus: 'uploading',
              uploadProgress: 0 
            } 
          : logo
      ));

      try {
        // Upload ảnh lên server
        const response = await LogoAPI.uploadLogo(file, item.type, item.unitName, 
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setLogoItems(prev => prev.map(logo => 
              logo.id === item.id 
                ? { ...logo, uploadProgress: progress }
                : logo
            ));
          }
        );
        
        if (response && response.data) {
          const apiLogo = {
            id: response.data.id,
            unitName: response.data.name || item.unitName,
            code: item.code,
            type: response.data.type || item.type,
            url: response.data.url || response.data.url_logo,
            category: item.category,
            displayPositions: item.displayPositions,
            uploadStatus: 'completed',
            uploadProgress: 100
          };
          
          // Xóa preview URL và cập nhật danh sách logo
          URL.revokeObjectURL(previewUrl);
          setLogoItems(prev => prev.filter(logo => logo.id !== item.id));
          setApiLogos(prev => [apiLogo, ...prev]);
          
          // Thông báo thành công
          alert(`Tải lên ${item.type} thành công!`);
        }
      } catch (error) {
        console.error("Lỗi khi tải lên:", error);
        
        // Cập nhật trạng thái lỗi
        setLogoItems(prev => prev.map(logo => 
          logo.id === item.id 
            ? { ...logo, uploadStatus: 'error' }
            : logo
        ));
        
        // Thông báo lỗi
        alert(`Lỗi khi tải lên: ${error.message || 'Đã xảy ra lỗi'}`);
      }
    };
    
    // Bắt đầu đọc file
    reader.readAsDataURL(file);
  };

  const allLogoItems = [...apiLogos, ...logoItems];

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

  const LogoItem = React.memo(function LogoItem({ item, onUpdate, onRemove }) {
    const [localCode, setLocalCode] = useState(item.code);
    const [isSearching, setIsSearching] = useState(false);
    
    const debouncedCode = useDebounce(localCode, 1500);

    useEffect(() => {
      let isMounted = true;
      
      const searchByCode = async () => {
        if (debouncedCode && debouncedCode.length >= 3 && debouncedCode !== item.code) {
          try {
            setIsSearching(true);
            const response = await LogoAPI.searchLogosByCode(debouncedCode, true);
            
            if (!isMounted) return;
            
            if (response?.data?.length > 0) {
              const foundLogo = response.data[0];
              // Kiểm tra xem URL có hợp lệ không trước khi cập nhật
              if (foundLogo.url_logo || foundLogo.file_path) {
                onUpdate(item.id, {
                  ...item,
                  code: debouncedCode, // Cập nhật mã code mới
                  url: foundLogo.url_logo || foundLogo.file_path,
                  unitName: foundLogo.name || item.unitName,
                  displayPositions: [...item.displayPositions] // Tạo mảng mới để trigger re-render
                });
              } else {
                console.warn("Logo tìm thấy nhưng không có URL hợp lệ");
              }
            } else {
              // Nếu không tìm thấy, chỉ cập nhật code mà không thay đổi URL
              onUpdate(item.id, {
                ...item,
                code: debouncedCode
              });
            }
          } catch (error) {
            console.error("Lỗi khi tìm kiếm logo:", error);
          } finally {
            if (isMounted) {
              setIsSearching(false);
            }
          }
        }
      };

      searchByCode();
      
      return () => {
        isMounted = false;
      };
    }, [debouncedCode, item.id, item, onUpdate]);

    const handleCodeChange = (e) => {
      const newCode = e.target.value.toUpperCase();
      setLocalCode(newCode);
    };

    const handleCodeKeyPress = (e) => {
      if (e.key === 'Enter' && localCode.length >= 3) {
        const searchByCode = async () => {
          try {
            setIsSearching(true);
            const response = await LogoAPI.searchLogosByCode(localCode, true);
            
            if (response?.data?.length > 0) {
              const foundLogo = response.data[0];
              if (foundLogo.url_logo || foundLogo.file_path) {
                onUpdate(item.id, {
                  ...item,
                  code: localCode,
                  url: foundLogo.url_logo || foundLogo.file_path,
                  unitName: foundLogo.name || item.unitName,
                  displayPositions: [...item.displayPositions] // Tạo mảng mới
                });
              } else {
                console.warn("Logo tìm thấy nhưng không có URL hợp lệ");
                // Vẫn cập nhật code nếu muốn
                onUpdate(item.id, {
                  ...item,
                  code: localCode
                });
              }
            } else {
              // Nếu không tìm thấy, vẫn cập nhật code
              onUpdate(item.id, {
                ...item,
                code: localCode
              });
            }
          } catch (error) {
            console.error("Lỗi khi tìm kiếm logo:", error);
          } finally {
            setIsSearching(false);
          }
        };
        searchByCode();
      }
    };

    const handleCodeBlur = () => {
      onUpdate(item.id, { 
        ...item, 
        code: localCode 
      });
    };

    const getShapeClass = () => {
      switch (logoDisplayOptions.shape) {
        case 'round': return 'rounded-full';
        case 'square': return 'rounded-sm';
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

    return (
      <div className="bg-white rounded-lg border-2 border-green-400 p-2 shadow-lg relative w-48 flex-shrink-0">
        {/* X button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
          title="Xóa"
        >
          ×
        </button>
        
        <div className="text-center">
          <div className="text-xs font-bold text-green-600 mb-1">
            {item.type === 'banner' ? '🖼️' : '📁'}
          </div>
          
          {/* Logo preview */}
          <div className="flex justify-center mb-2">
            <div className="relative w-16 h-16">
              <div className={`w-full h-full ${getShapeClass()} border-2 border-green-400 overflow-hidden shadow-lg relative`}>
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.code}
                    className="w-full h-full object-contain bg-white"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Logo code */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded p-1 mb-1">
            <div className="text-xs text-green-700 bg-white rounded px-1 py-0.5 font-bold truncate">
              {item.code}
            </div>
          </div>
          
          
        </div>

        <div className="mt-2">
          <input
            type="text"
            value={localCode}
            onChange={handleCodeChange}
            onKeyPress={handleCodeKeyPress}
            onBlur={handleCodeBlur}
            className={`w-full text-xs text-center border rounded px-1 py-1 font-mono transition-colors focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none ${
              isSearching ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Mã (Enter để tìm)"
          />

          {isSearching && (
            <div className="text-xs text-blue-600 text-center mt-1 animate-pulse">
              🔍 Đang tìm kiếm...
            </div>
          )}

          <div className="mt-2">
            <div className="grid grid-cols-6 gap-1">
              {[
                { key: 'top-left', icon: '↖️', title: 'Trên trái' },
                { key: 'top', icon: '⬆️', title: 'Trên giữa' },
                { key: 'top-right', icon: '↗️', title: 'Trên phải' },
                { key: 'bottom-left', icon: '↙️', title: 'Dưới trái' },
                { key: 'bottom', icon: '⬇️', title: 'Dưới giữa' },
                { key: 'bottom-right', icon: '↘️', title: 'Dưới phải' }
              ].map((pos) => (
                <button
                  key={pos.key}
                  onClick={() => handlePositionToggle(pos.key)}
                  className={`flex flex-col items-center p-1 border rounded text-xs ${item.displayPositions.includes(pos.key)
                    ? 'border-blue-500 bg-blue-100 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'}`}
                  title={pos.title}
                >
                  <span className="text-sm">{pos.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {item.isCustom && (
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, item)}
              className="hidden"
              id={`file-${item.id}`}
            />
            <label
              htmlFor={`file-${item.id}`}
              className={`block w-full text-xs text-center border rounded px-1 py-1 cursor-pointer transition-colors ${
                item.uploadStatus === 'preview' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                item.uploadStatus === 'error' ? 'bg-red-50 border-red-300 text-red-700' :
                'bg-blue-50 border-blue-300 hover:bg-blue-100'
              }`}
            >
              {item.uploadStatus === 'preview' ? '⏳ Đang tải...' :
               item.uploadStatus === 'error' ? '❌ Thử lại' :
               '📁 Chọn file'}
            </label>
          </div>
        )}
      </div>
    );
  });

  const handlePosterSelect = (poster) => {
    console.log('🎨 [PosterLogoManager] handlePosterSelect called with:', poster);
    console.log('[PosterLogoManager] Current selectedPoster before update:', selectedPoster);

    setSelectedPoster(poster);
  };

  const handleItemUpdate = async (itemId, updatedItem) => {
    const isFromAPI = apiLogos.find(logo => logo.id === itemId);
    
    if (isFromAPI) {
      try {
        setApiLogos(prev => prev.map(item => 
          item.id === itemId ? updatedItem : item
        ));
      } catch (error) {
        console.error("Error updating API logo:", error);
        setApiLogos(prev => prev.map(item => 
          item.id === itemId ? updatedItem : item
        ));
      }
    } else {
      setLogoItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
    }
  };

  const handleItemRemove = async (itemId) => {
    // Ngăn xóa logo mặc định
    if (itemId.startsWith('default-')) {
      console.log('Cannot remove default logo');
      return;
    }

    const isFromAPI = apiLogos.find(logo => logo.id === itemId);
    const item = logoItems.find(logo => logo.id === itemId);

    if (item && item.url && item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }

    if (isFromAPI) {
      try {
        setApiLogos(prev => prev.map(item =>
          item.id === itemId ? { ...item, displayPositions: [] } : item
        ));
      } catch (error) {
        console.error("Error resetting API logo:", error);
        setApiLogos(prev => prev.map(item =>
          item.id === itemId ? { ...item, displayPositions: [] } : item
        ));
      }
    } else {
      setLogoItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleAddNewLogo = async () => {
    const newLogo = {
      id: `custom-logo-${Date.now()}`,
      unitName: `Logo ${logoItems.filter(item => item.type === 'logo').length + 1}`,
      code: `LOGO${logoItems.filter(item => item.type === 'logo').length + 1}`,
      type: "logo",
      category: activeLogoCategory,
      url: null,
      displayPositions: [],
      isCustom: true
    };
    
    setLogoItems(prev => [...prev, newLogo]);
  };

  const handleAddNewBanner = async () => {
    const newBanner = {
      id: `custom-banner-${Date.now()}`,
      unitName: `Banner ${logoItems.filter(item => item.type === 'banner').length + 1}`,
      code: `BAN${logoItems.filter(item => item.type === 'banner').length + 1}`,
      type: "banner",
      category: activeLogoCategory,
      url: null,
      displayPositions: [],
      isCustom: true
    };
    
    setLogoItems(prev => [...prev, newBanner]);
  };

  const handleSave = () => {
    console.log('💾 [PosterLogoManager] handleSave called');
    console.log('💾 [PosterLogoManager] selectedPoster:', selectedPoster);
    console.log('💾 [PosterLogoManager] onPosterUpdate function exists:', !!onPosterUpdate);

    if (selectedPoster) {
      console.log('💾 [PosterLogoManager] Calling onPosterUpdate with selectedPoster:', selectedPoster);
      onPosterUpdate?.(selectedPoster);
    } else {
      console.log('⚠️ [PosterLogoManager] No selectedPoster to update');
    }

    const activeItems = allLogoItems.filter(item =>
      item.category === activeLogoCategory &&
      (item.displayPositions.length > 0 || logoItems.includes(item))
    );

    console.log('💾 [PosterLogoManager] activeItems for logo update:', activeItems);

    if (activeItems.length > 0) {
      console.log('💾 [PosterLogoManager] Calling onLogoUpdate');
      onLogoUpdate?.({
        logoItems: activeItems,
        displayOptions: logoDisplayOptions
      });
    }

    console.log('💾 [PosterLogoManager] Calling onClose');
    onClose?.();
  };

  const renderPosterSection = () => {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-xs">🎨</span>
          <h3 className="text-xs font-semibold text-gray-900">Poster</h3>
        </div>

        {selectedPoster && (
          <div className="bg-blue-50 border border-blue-200 rounded px-1 py-0.5">
            <p className="text-xs font-medium text-blue-800">
              ✅ {selectedPoster.name}
            </p>
          </div>
        )}

        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {availablePosters.map((poster) => (
            <div key={poster.id} className="flex-none w-24">
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
    const currentLogos = allLogoItems.filter(item => item.category === activeLogoCategory && item.type === 'logo');
    const currentBanners = allLogoItems.filter(item => item.category === activeLogoCategory && item.type === 'banner');

    // Tạo logo mặc định nếu chưa có
    const defaultLogos = currentLogos.length === 0 ? [{
      id: 'default-logo-1',
      unitName: 'Default Logo',
      code: 'LOGO1',
      type: 'logo',
      category: activeLogoCategory,
      url: '/images/logos/default-logo.png',
      displayPositions: [],
      isDefault: true
    }] : [];

    const allCurrentLogos = [...defaultLogos, ...currentLogos];

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs">🏷️</span>
            <h3 className="text-xs font-semibold text-gray-900">Logo & Banner</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-0.5">
          {logoTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveLogoCategory(type.id)}
              className={`px-1 py-0.5 rounded text-xs font-medium transition-colors ${
                activeLogoCategory === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Logo Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-gray-800">📁 Logo</h4>
            <button
              onClick={handleAddNewLogo}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              + Thêm Logo
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {allCurrentLogos.map((item) => (
              <LogoItem
                key={item.id}
                item={item}
                onUpdate={handleItemUpdate}
                onRemove={handleItemRemove}
              />
            ))}
          </div>
        </div>

        {/* Banner Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-gray-800">🖼️ Banner</h4>
            <button
              onClick={handleAddNewBanner}
              className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              + Thêm Banner
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {currentBanners.map((item) => (
              <LogoItem
                key={item.id}
                item={item}
                onUpdate={handleItemUpdate}
                onRemove={handleItemRemove}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-1 space-y-1">
          <div className="text-xs font-medium text-gray-700">Tùy chọn hiển thị:</div>

          <div className="flex gap-1">
            {[
              { value: 'round', label: 'Tròn', icon: '⭕' },
              { value: 'square', label: 'Vuông', icon: '⬜' },
              { value: 'hexagon', label: 'Lục giác', icon: '⬡' }
            ].map((shape) => (
              <label key={shape.value} className="flex items-center gap-0.5 cursor-pointer">
                <input
                  type="radio"
                  name="logoShape"
                  value={shape.value}
                  checked={logoDisplayOptions.shape === shape.value}
                  onChange={(e) => setLogoDisplayOptions(prev => ({ ...prev, shape: e.target.value }))}
                  className="w-2 h-2"
                />
                <span className="text-xs">{shape.icon}</span>
                <span className="text-xs">{shape.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-medium text-gray-700">Copy poster trận trước:</span>
        <select className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white">
          <option value="">Chọn trận</option>
          <option value="match1">Hà Nội vs TPHCM (15/01)</option>
          <option value="match2">Viettel vs HAGL (12/01)</option>
          <option value="match3">SHB vs Thanh Hóa (10/01)</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-1.5">
        {renderPosterSection()}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-1.5">
        {renderLogoSection()}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pt-1.5 border-t border-gray-200">
        <div className="flex gap-1 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => onClose?.()}
            className="flex-1 sm:flex-none text-xs px-2 py-1 h-8"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1 sm:flex-none text-xs px-2 py-1 h-8"
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
