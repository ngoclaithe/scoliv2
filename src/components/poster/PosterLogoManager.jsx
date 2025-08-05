import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Button from "../common/Button";
import LogoAPI from "../../API/apiLogo";
import DisplaySettingsAPI from "../../API/apiSettingDisplay";
import { getFullLogoUrl } from "../../utils/logoUtils";

const PosterLogoManager = React.memo(({ onPosterUpdate, onLogoUpdate, initialData, accessCode }) => {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [logoItems, setLogoItems] = useState([]);
  const [apiLogos, setApiLogos] = useState([]);
  const [activeLogoCategory, setActiveLogoCategory] = useState("sponsor");
  const [loading, setLoading] = useState(true);
  const [selectedLogosCount, setSelectedLogosCount] = useState({ sponsor: 0, organizing: 0, media: 0, tournament: 0 });

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
      id: "organizing",
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

  // Function to update selected logos count
  const updateSelectedLogosCount = useCallback(() => {
    const counts = { sponsor: 0, organizing: 0, media: 0, tournament: 0 };

    [...apiLogos, ...logoItems].forEach(item => {
      if (item.displayPositions && item.displayPositions.length > 0) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });

    setSelectedLogosCount(counts);
  }, [apiLogos, logoItems]);

  useEffect(() => {
    let isMounted = true;

    const loadLogos = async () => {
      try {
        setLoading(true);

        // Load initial data if provided (for display options only)
        if (initialData) {
          if (initialData.selectedPoster) {
            setSelectedPoster(initialData.selectedPoster);
          }
          if (initialData.displayOptions) {
            setLogoDisplayOptions(initialData.displayOptions);
          }
        }

        // Load display settings from API only once
        if (accessCode && isMounted) {
          try {
            console.log('🔍 [PosterLogoManager] Loading display settings from API for:', accessCode);
            const response = await DisplaySettingsAPI.getDisplaySettings(accessCode);

            if (response?.success && response?.data && isMounted) {
              const loadedLogos = [];

              // Process sponsors
              if (response.data.sponsors && Array.isArray(response.data.sponsors)) {
                response.data.sponsors.forEach((item) => {
                  // Parse position từ string "{bottom-left}" thành array
                  let positions = [];
                  if (item.position) {
                    try {
                      const cleanPosition = item.position.replace(/[{}]/g, '');
                      positions = [cleanPosition];
                    } catch (e) {
                      console.warn('Failed to parse position:', item.position);
                      positions = [];
                    }
                  }

                  loadedLogos.push({
                    id: `sponsor-${item.id}`,
                    unitName: item.code_logo || `Sponsor ${item.id}`,
                    code: item.code_logo || `SP${item.id}`,
                    type: item.type_display || 'logo',
                    category: 'sponsor',
                    url: getFullLogoUrl(item.url_logo),
                    displayPositions: positions
                  });
                });
              }

              // Process organizing (nếu có trong response)
              if (response.data.organizing && Array.isArray(response.data.organizing)) {
                response.data.organizing.forEach((item) => {
                  let positions = [];
                  if (item.position) {
                    try {
                      const cleanPosition = item.position.replace(/[{}]/g, '');
                      positions = [cleanPosition];
                    } catch (e) {
                      console.warn('Failed to parse position:', item.position);
                      positions = [];
                    }
                  }

                  loadedLogos.push({
                    id: `organizing-${item.id}`,
                    unitName: item.code_logo || `Organizing ${item.id}`,
                    code: item.code_logo || `ORG${item.id}`,
                    type: item.type_display || 'logo',
                    category: 'organizing',
                    url: getFullLogoUrl(item.url_logo),
                    displayPositions: positions
                  });
                });
              }

              // Process media (nếu có trong response)
              if (response.data.media && Array.isArray(response.data.media)) {
                response.data.media.forEach((item) => {
                  let positions = [];
                  if (item.position) {
                    try {
                      const cleanPosition = item.position.replace(/[{}]/g, '');
                      positions = [cleanPosition];
                    } catch (e) {
                      console.warn('Failed to parse position:', item.position);
                      positions = [];
                    }
                  }

                  loadedLogos.push({
                    id: `media-${item.id}`,
                    unitName: item.code_logo || `Media ${item.id}`,
                    code: item.code_logo || `MED${item.id}`,
                    type: item.type_display || 'logo',
                    category: 'media',
                    url: getFullLogoUrl(item.url_logo),
                    displayPositions: positions
                  });
                });
              }

              // Process tournament (nếu có trong response)
              if (response.data.tournament && Array.isArray(response.data.tournament)) {
                response.data.tournament.forEach((item) => {
                  let positions = [];
                  if (item.position) {
                    try {
                      const cleanPosition = item.position.replace(/[{}]/g, '');
                      positions = [cleanPosition];
                    } catch (e) {
                      console.warn('Failed to parse position:', item.position);
                      positions = [];
                    }
                  }

                  loadedLogos.push({
                    id: `tournament-${item.id}`,
                    unitName: item.code_logo || `Tournament ${item.id}`,
                    code: item.code_logo || `TOUR${item.id}`,
                    type: item.type_display || 'logo',
                    category: 'tournament',
                    url: getFullLogoUrl(item.url_logo),
                    displayPositions: positions
                  });
                });
              }

              if (isMounted) {
                setApiLogos(loadedLogos);
                console.log(`✅ [PosterLogoManager] Loaded ${loadedLogos.length} display settings from API`);
              }
            }
          } catch (err) {
            console.warn('⚠️ [PosterLogoManager] Failed to load display settings from API:', err);
            if (isMounted) {
              setApiLogos([]);
            }
          }
        }

      } catch (err) {
        console.error("Error loading logos:", err);
        if (isMounted) {
          setApiLogos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLogos();

    return () => {
      isMounted = false;
    };
  }, [accessCode]); // Chỉ depend vào accessCode thôi, không depend vào initialData

  // Handle initialData separately
  useEffect(() => {
    if (initialData) {
      if (initialData.selectedPoster) {
        setSelectedPoster(initialData.selectedPoster);
      }
      if (initialData.displayOptions) {
        setLogoDisplayOptions(initialData.displayOptions);
      }
    }
  }, [initialData]);

  // Update count whenever logo data changes
  useEffect(() => {
    updateSelectedLogosCount();
  }, [updateSelectedLogosCount]);

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
          ? {
            ...logo,
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
            url: getFullLogoUrl(response.data.url || response.data.url_logo),
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
    const [localCodeRef, setLocalCodeRef] = useState(item.code);
    const inputRef = useRef(null);
    const lastFocusedRef = useRef(false);

    // Chỉ update localCode khi item.code thay đổi thật sự, không phải do re-render
    useEffect(() => {
      if (item.code !== localCodeRef) {
        // Lưu trạng thái focus trước khi update
        const wasFocused = inputRef.current && document.activeElement === inputRef.current;
        lastFocusedRef.current = wasFocused;

        setLocalCode(item.code);
        setLocalCodeRef(item.code);

        // Khôi phục focus sau khi update
        if (wasFocused && inputRef.current) {
          setTimeout(() => {
            inputRef.current.focus();
          }, 0);
        }
      }
    }, [item.code, localCodeRef]);

    const handleCodeChange = useCallback((e) => {
      const newCode = e.target.value.toUpperCase();
      setLocalCode(newCode);
    }, []);

    const handleSearch = async () => {
      if (localCode.trim().length >= 3) {
        try {
          setIsSearching(true);
          const response = await LogoAPI.searchLogosByCode(localCode.trim(), true);

          if (response?.data?.length > 0) {
            const foundLogo = response.data[0];
            if (foundLogo.url_logo || foundLogo.file_path) {
              onUpdate(item.id, {
                ...item,
                code: localCode.trim(),
                url: getFullLogoUrl(foundLogo.url_logo || foundLogo.file_path),
                unitName: foundLogo.name || item.unitName,
                displayPositions: [...item.displayPositions]
              });
            } else {
              onUpdate(item.id, { ...item, code: localCode.trim() });
            }
          } else {
            onUpdate(item.id, { ...item, code: localCode.trim() });
          }
        } catch (error) {
          console.error("Lỗi khi tìm kiếm logo:", error);
        } finally {
          setIsSearching(false);
        }
      }
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
      // Logic: Mỗi logo chỉ được chọn 1 position duy nhất
      const newPositions = item.displayPositions.includes(position)
        ? [] // Nếu đang chọn position này thì bỏ chọn (xóa hết)
        : [position]; // Nếu chưa chọn thì chọn position này (thay thế position cũ)

      const updatedItem = { ...item, displayPositions: newPositions };
      onUpdate(item.id, updatedItem);

      // Also trigger immediate logo update with behavior
      const allCurrentItems = [...apiLogos, ...logoItems].map(logoItem =>
        logoItem.id === item.id ? updatedItem : logoItem
      );

      const activeItems = allCurrentItems.filter(logoItem =>
        logoItem.category === activeLogoCategory &&
        logoItem.displayPositions && logoItem.displayPositions.length > 0
      );

      let behavior;
      if (item.displayPositions.length === 0 && newPositions.length > 0) {
        behavior = 'add';
      } else if (item.displayPositions.length > 0 && newPositions.length === 0) {
        behavior = 'remove';
      } else if (item.displayPositions.length > 0 && newPositions.length > 0) {
        behavior = 'update';
      } else {
        behavior = 'add'; // fallback
      }

      if (onLogoUpdate) {
        onLogoUpdate({
          logoItems: activeItems,
          displayOptions: logoDisplayOptions,
          changedItem: updatedItem,
          behavior: behavior
        });
      }
    };

    return (
      <div className="bg-white rounded-lg border-2 border-green-400 p-3 shadow-lg relative w-48 flex-shrink-0">
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
            <div className="relative w-12 h-12">
              <div
                className={`w-full h-full ${getShapeClass()} border-2 border-green-400 overflow-hidden shadow-lg relative`}
              >
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

          {/* Logo code display */}
          {/* <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded p-1 mb-1">
            <div className="text-xs text-green-700 bg-white rounded px-1 py-0.5 font-bold truncate">
              {item.code}
            </div>
          </div> */}
        </div>

        <div className="mt-2">
          {/* Input tìm kiếm với icon */}
          <div className="relative">
            <input
              ref={inputRef}
              id="logo-search-code"
              name="logoSearchCode"
              type="text"
              value={localCode}
              onChange={handleCodeChange}
              className={`w-full text-xs text-center border rounded px-1 py-1 pr-6 font-mono transition-colors focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none ${isSearching ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              placeholder="Nhập mã"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || localCode.trim().length < 3}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:text-gray-300"
            >
              🔍
            </button>
          </div>

          {isSearching && (
            <div className="text-xs text-blue-600 text-center mt-1 animate-pulse">
              🔍 Đang tìm kiếm...
            </div>
          )}

          {/* Position toggles */}
          <div className="mt-2">
            <div className="text-xs text-gray-600 mb-1">Vị trí hiển thị:</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { key: 'top-left', icon: '↖️', title: 'Trên trái' },
                { key: 'bottom-left', icon: '↙️', title: 'Dưới trái' },
                { key: 'bottom-right', icon: '↘️', title: 'Dưới phải' }
              ].map((pos) => (
                <button
                  key={pos.key}
                  onClick={() => handlePositionToggle(pos.key)}
                  className={`flex flex-col items-center p-1 border rounded text-xs relative ${
                    item.displayPositions.includes(pos.key)
                      ? 'border-blue-500 bg-blue-100 text-blue-600 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }`}
                  title={pos.title}
                >
                  <span className="text-base">{pos.icon}</span>
                  {item.displayPositions.includes(pos.key) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* File upload cho custom logo */}
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
              className={`block w-full text-xs text-center border rounded px-1 py-1 cursor-pointer transition-colors ${item.uploadStatus === 'preview' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
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
  }, (prevProps, nextProps) => {
    // Only rerender if item properties actually changed
    const itemChanged = (
      prevProps.item.id !== nextProps.item.id ||
      prevProps.item.code !== nextProps.item.code ||
      prevProps.item.url !== nextProps.item.url ||
      JSON.stringify(prevProps.item.displayPositions) !== JSON.stringify(nextProps.item.displayPositions)
    );

    const callbacksChanged = (
      prevProps.onUpdate !== nextProps.onUpdate ||
      prevProps.onRemove !== nextProps.onRemove
    );

    // Return true to prevent re-render, false to allow re-render
    return !itemChanged && !callbacksChanged;
  });

  const handlePosterSelect = useCallback((poster) => {
    console.log('🎨 [PosterLogoManager] handlePosterSelect called with:', poster);
    setSelectedPoster(poster);
    // Immediate update
    if (onPosterUpdate) {
      console.log('🎨 [PosterLogoManager] Calling onPosterUpdate immediately with:', poster);
      onPosterUpdate(poster);
    }
  }, [onPosterUpdate]);

  const handleItemUpdate = useCallback(async (itemId, updatedItem) => {
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
  }, [apiLogos]);

  const handleItemRemove = useCallback(async (itemId) => {
    console.log('🗑️ [PosterLogoManager] Removing item:', itemId);

    const isFromAPI = apiLogos.find(logo => logo.id === itemId);
    const item = logoItems.find(logo => logo.id === itemId);

    // Clean up blob URLs
    if (item && item.url && item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url);
    }

    if (isFromAPI) {
      // Clear display positions for API logos (don't remove from list)
      setApiLogos(prev => prev.map(logo =>
        logo.id === itemId ? { ...logo, displayPositions: [] } : logo
      ));
      console.log('🗑️ [PosterLogoManager] Cleared positions for API logo:', itemId);
    } else {
      // Remove custom logos completely
      setLogoItems(prev => prev.filter(logo => logo.id !== itemId));
      console.log('🗑️ [PosterLogoManager] Removed custom logo:', itemId);
    }

    // Trigger immediate update to reflect changes with remove behavior
    const allCurrentItems = [...apiLogos, ...logoItems].map(logoItem =>
      logoItem.id === itemId ? { ...logoItem, displayPositions: [] } : logoItem
    );

    const activeItems = allCurrentItems.filter(logoItem =>
      logoItem.category === activeLogoCategory &&
      logoItem.displayPositions && logoItem.displayPositions.length > 0
    );

    // Find the removed item to pass as changedItem
    const removedItem = (isFromAPI ? apiLogos : logoItems).find(logo => logo.id === itemId);

    if (onLogoUpdate && removedItem) {
      onLogoUpdate({
        logoItems: activeItems,
        displayOptions: logoDisplayOptions,
        changedItem: { ...removedItem, displayPositions: [] },
        behavior: 'remove'
      });
    }
  }, [apiLogos, logoItems, activeLogoCategory, logoDisplayOptions, onLogoUpdate]);

  const handleAddNewLogo = async () => {
    const newLogo = {
      id: `custom-logo-${Date.now()}`,
      unitName: `Logo ${logoItems.filter(item => item.type === 'logo').length + 1}`,
      code: ` `,
      type: "logo",
      category: activeLogoCategory,
      url: null,
      displayPositions: [],
      isCustom: true,
      // name: `LOGO${logoItems.filter(item => item.type === 'logo').length + 1}`
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



  const renderPosterSection = () => {
    return (
      <div className="space-y-1">
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

  const currentItems = useMemo(() => {
    return allLogoItems.filter(item => {
      if (item.category !== activeLogoCategory) return false;
      if (logoItems.find(logo => logo.id === item.id)) return true;
      return item.displayPositions && item.displayPositions.length > 0;
    });
  }, [allLogoItems, activeLogoCategory, logoItems]);

  const renderLogoSection = () => {

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs">🏷️</span>
            <h3 className="text-xs font-semibold text-gray-900">Logo & Banner</h3>
            <span className="text-xs text-gray-500">({Object.values(selectedLogosCount).reduce((a, b) => a + b, 0)} đã chọn)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-0.5">
          {logoTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveLogoCategory(type.id)}
              className={`px-1 py-0.5 rounded text-xs font-medium transition-colors relative ${activeLogoCategory === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span className="mr-1">{type.icon}</span>
              {type.name}
              {selectedLogosCount[type.id] > 0 && (
                <span className={`ml-1 px-1 py-0.5 rounded-full text-xs font-bold ${
                  activeLogoCategory === type.id
                    ? 'bg-white text-blue-500'
                    : 'bg-blue-500 text-white'
                }`}>
                  {selectedLogosCount[type.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Logo items và Add buttons cùng một hàng */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {/* Hiển thị các logo items hiện có */}
          {currentItems.map((item) => (
            <LogoItem
              key={item.id}
              item={item}
              onUpdate={handleItemUpdate}
              onRemove={handleItemRemove}
            />
          ))}

          {/* Add buttons container wrapper */}
          <div className="flex-shrink-0">
            {/* Add buttons container */}
            <div className="flex flex-col gap-2">
              <div
                onClick={handleAddNewLogo}
                className="w-12 h-12 bg-white border-2 border-dashed border-gray-300 rounded p-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center"
              >
                <div className="w-3 h-3 bg-gray-100 rounded-full flex items-center justify-center mb-0.5">
                  <span className="text-xs text-gray-400">+</span>
                </div>
                <p className="text-xs text-gray-600 font-medium text-center leading-tight">
                  Thêm logo
                </p>
              </div>

              <div
                onClick={handleAddNewBanner}
                className="w-12 h-12 bg-white border-2 border-dashed border-orange-300 rounded p-1 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex flex-col items-center justify-center"
              >
                <div className="w-3 h-3 bg-orange-100 rounded-full flex items-center justify-center mb-0.5">
                  <span className="text-xs text-orange-400">+</span>
                </div>
                <p className="text-xs text-orange-600 font-medium text-center">
                  Thêm banner
                </p>
              </div>
            </div>
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
                  id={`logo-shape-${shape.value}`}
                  name="logoShape"
                  type="radio"
                  value={shape.value}
                  checked={logoDisplayOptions.shape === shape.value}
                  onChange={(e) => {
                    const newShape = e.target.value;
                    setLogoDisplayOptions(prev => ({ ...prev, shape: newShape }));
                    console.log('🎨 [PosterLogoManager] Logo shape changed to:', newShape);

                    if (onLogoUpdate) {
                      const activeItems = allLogoItems.filter(item =>
                        item.category === activeLogoCategory &&
                        item.displayPositions && item.displayPositions.length > 0
                      );
                      onLogoUpdate({
                        logoItems: activeItems,
                        displayOptions: { ...logoDisplayOptions, shape: newShape }
                      });
                    }
                  }}
                  className="w-2 h-2"
                />

                <span className="text-xs">{shape.icon}</span>
                <span className="text-xs">{shape.label}</span>
              </label>
            ))}
          </div>

          <label className="flex items-center gap-0.5 cursor-pointer">
            <input
              type="checkbox"
              checked={logoDisplayOptions.rotateDisplay}
              onChange={(e) => {
                const isRotate = e.target.checked;
                setLogoDisplayOptions(prev => ({ ...prev, rotateDisplay: isRotate }));
                console.log('🔄 [PosterLogoManager] Rotate display changed to:', isRotate);
                // Immediate update
                if (onLogoUpdate) {
                  const activeItems = allLogoItems.filter(item =>
                    item.category === activeLogoCategory &&
                    item.displayPositions && item.displayPositions.length > 0
                  );
                  onLogoUpdate({
                    logoItems: activeItems,
                    displayOptions: { ...logoDisplayOptions, rotateDisplay: isRotate }
                  });
                }
              }}
              className="w-2 h-2"
            />
            <span className="text-xs">🔄 Hiển thị luân phiên</span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-medium text-gray-700">Copy poster trận trước:</span>
        <select className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white">
          <option value="">Chọn trận</option>
          <option value="match1">Hà Nội vs TPHCM (15/01)</option>
          <option value="match2">Viettel vs HAGL (12/01)</option>
          <option value="match3">SHB vs Thanh Hóa (10/01)</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-2">
        {renderPosterSection()}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-2">
        {renderLogoSection()}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-2">
        <div className="flex justify-center">
          <button
            onClick={() => {
              // Mở preview trong tab mới với dynamic route
              const previewUrl = `/${accessCode}/preview`;
              window.open(previewUrl, '_blank');
            }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>👁️</span>
            <span>PREVIEW POSTER</span>
          </button>
        </div>
      </div>

    </div>
  );
});

export default PosterLogoManager;
