import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import LogoAPI from "../../API/apiLogo";
import PosterAPI from "../../API/apiPoster";
import DisplaySettingsAPI from "../../API/apiSettingDisplay";
import RoomSessionAPI from "../../API/apiRoomSession";
import { getFullLogoUrl, getFullPosterUrl } from "../../utils/logoUtils";
import socketService from "../../services/socketService";

const PosterLogoManager = React.memo(({ onPosterUpdate, onLogoUpdate, initialData, accessCode }) => {
  // console.log('🗨️ [PosterLogoManager] Component initialized with props:', {
  //   onPosterUpdate: !!onPosterUpdate,
  //   onLogoUpdate: !!onLogoUpdate,
  //   initialData,
  //   accessCode
  // });
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [logoItems, setLogoItems] = useState([]);
  const [apiLogos, setApiLogos] = useState([]);
  const [activeLogoCategory, setActiveLogoCategory] = useState("sponsor");
  const [loading, setLoading] = useState(true);
  const [selectedLogosCount, setSelectedLogosCount] = useState({ sponsor: 0, organizing: 0, media: 0, tournament: 0 });
  const [historyMatches, setHistoryMatches] = useState([]);
  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState("");

  const [logoDisplayOptions, setLogoDisplayOptions] = useState({
    shape: "round",
    rotateDisplay: false
  });

  const [roundGroupOptions, setRoundGroupOptions] = useState({
    round: 1,
    showRound: false,
    group: "A",
    showGroup: false,
    subtitle: "",
    showSubtitle: false
  });

  const [customPosters, setCustomPosters] = useState([]);
  const [savedPosters, setSavedPosters] = useState([]);

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
    {
      id: "tuhung",
      name: "Tứ hùng",
      thumbnail: "/images/posters/tuhung.png",
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

  const updateSelectedLogosCount = useCallback(() => {
    const counts = { sponsor: 0, organizing: 0, media: 0, tournament: 0 };

    [...apiLogos, ...logoItems].forEach(item => {
      if (item.displayPositions && item.displayPositions.length > 0) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });

    setSelectedLogosCount(counts);
  }, [apiLogos, logoItems]);

  const loadHistoryMatches = async () => {
    try {
      console.log('🔍 [PosterLogoManager] Loading history matches from API...');
      const response = await RoomSessionAPI.getHistoryMatches();
      console.log('📋 [PosterLogoManager] History matches response:', response);
      console.log('📋 [PosterLogoManager] History matches response structure:', JSON.stringify(response, null, 2));

      if (response?.success && response?.data && Array.isArray(response.data)) {
        console.log('📋 [PosterLogoManager] Processing', response.data.length, 'history matches');
        const transformedMatches = response.data.map(match => {
          const displaySettings = match.accessCodeInfo?.displaySettings || [];
          console.log('📋 [PosterLogoManager] Match:', match.accessCode, 'has', displaySettings.length, 'display settings');
          return {
            id: match.id,
            accessCode: match.accessCode,
            status: match.status,
            expiredAt: match.expiredAt,
            displaySettings: displaySettings
          };
        });
        setHistoryMatches(transformedMatches);
        console.log(`✅ [PosterLogoManager] Loaded ${transformedMatches.length} history matches`);
      } else {
        console.warn('⚠️ [PosterLogoManager] Invalid history matches response format:', response);
        setHistoryMatches([]);
      }
    } catch (error) {
      console.error('❌ [PosterLogoManager] Failed to load history matches:', error);
      console.error('❌ [PosterLogoManager] Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      setHistoryMatches([]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadLogos = async () => {
      try {
        // console.log('🗨️ [PosterLogoManager] useEffect loadLogos triggered with accessCode:', accessCode);
        setLoading(true);

        await loadHistoryMatches();

        // Load saved posters từ API
        if (accessCode) {
          try {
            const posterResponse = await PosterAPI.getPosters({ accessCode });
            if (posterResponse?.success && posterResponse?.data) {
              const savedPosterList = posterResponse.data.map(poster => ({
                id: `api-poster-${poster.id}`,
                name: poster.name || 'Poster tùy chỉnh',
                thumbnail: getFullPosterUrl(poster.url_poster),
                isCustom: true,
                serverData: poster
              }));
              setSavedPosters(savedPosterList);
            }
          } catch (error) {
            console.error('Failed to load saved posters:', error);
          }
        }

        if (initialData) {
          if (initialData.selectedPoster) {
            setSelectedPoster(initialData.selectedPoster);
          }
          if (initialData.displayOptions) {
            setLogoDisplayOptions(initialData.displayOptions);
          }
        }

        if (accessCode && isMounted) {
          try {
            console.log('🔍 [PosterLogoManager] Loading display settings from API for:', accessCode);
            const response = await DisplaySettingsAPI.getDisplaySettings(accessCode);
            // console.log('[PosterLogoManager] Full API response:', response);
            // console.log('📋 [PosterLogoManager] Response data structure:', JSON.stringify(response?.data, null, 2));

            if (response?.success && response?.data && isMounted) {

              const loadedLogos = [];

              // Process sponsors
              if (response.data.sponsors && Array.isArray(response.data.sponsors)) {
                console.log('📋 [PosterLogoManager] Processing sponsors:', response.data.sponsors.length, 'items');
                response.data.sponsors.forEach((item, index) => {
                  console.log(`📋 [PosterLogoManager] Sponsor ${index + 1}:`, item);
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

                  const logoItem = {
                    id: `sponsor-${item.id}`,
                    unitName: item.code_logo || `Sponsor ${item.id}`,
                    code: item.code_logo || `SP${item.id}`,
                    type: item.type_display || 'logo',
                    category: 'sponsor',
                    url: getFullLogoUrl(item.url_logo),
                    displayPositions: positions
                  };
                  console.log('📋 [PosterLogoManager] Created sponsor logo item:', logoItem);
                  loadedLogos.push(logoItem);
                });
              } else {
                console.log('📋 [PosterLogoManager] No sponsors found or sponsors is not an array');
              }

              // Process organizing (nếu có trong response)
              if (response.data.organizing && Array.isArray(response.data.organizing)) {
                console.log('📋 [PosterLogoManager] Processing organizing:', response.data.organizing.length, 'items');
                response.data.organizing.forEach((item, index) => {
                  console.log(`📋 [PosterLogoManager] Organizing ${index + 1}:`, item);
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

                  const logoItem = {
                    id: `organizing-${item.id}`,
                    unitName: item.code_logo || `Organizing ${item.id}`,
                    code: item.code_logo || `ORG${item.id}`,
                    type: item.type_display || 'logo',
                    category: 'organizing',
                    url: getFullLogoUrl(item.url_logo),
                    displayPositions: positions
                  };
                  console.log('📋 [PosterLogoManager] Created organizing logo item:', logoItem);
                  loadedLogos.push(logoItem);
                });
              } else {
                console.log('📋 [PosterLogoManager] No organizing found or organizing is not an array');
              }

              // Process media (nếu có trong response)
              if (response.data.media_partners && Array.isArray(response.data.media_partners)) {
                response.data.media_partners.forEach((item) => {
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
              if (response.data.tournament_logo && Array.isArray(response.data.tournament_logo)) {
                response.data.tournament_logo.forEach((item) => {
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
                console.log(`✅ [PosterLogoManager] Final loaded logos array:`, loadedLogos);
                console.log(`✅ [PosterLogoManager] Setting ${loadedLogos.length} display settings from API`);
                setApiLogos(loadedLogos);
              }
            }
          } catch (err) {
            console.error('❌ [PosterLogoManager] Failed to load display settings from API:', err);
            console.error('❌ [PosterLogoManager] Error details:', {
              message: err.message,
              stack: err.stack,
              response: err.response?.data
            });
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
  }, [accessCode]); 

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

  useEffect(() => {
    updateSelectedLogosCount();
  }, [updateSelectedLogosCount]);

  const handlePosterUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra giới hạn tối đa 3 poster
    const uploadedPostersCount = [...savedPosters, ...customPosters].length;
    if (uploadedPostersCount >= 3) {
      alert("Chỉ được phép upload tối đa 3 poster!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file tối đa là 5MB");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
      return;
    }

    try {
      // Tạo preview trước khi upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        const previewPoster = {
          id: `uploading-poster-${Date.now()}`,
          name: `Đang tải lên...`,
          thumbnail: e.target.result,
          isCustom: true,
          uploading: true
        };

        setCustomPosters(prev => [...prev, previewPoster]);

        try {
          // Upload poster lên server
          const response = await PosterAPI.uploadPoster(
            file,
            accessCode,
            `Poster tùy chỉnh ${customPosters.length + 1}`,
            'Poster được tải lên bởi người dùng'
          );

          if (response.success && response.data) {
            // Tạo poster từ response của server
            const uploadedPoster = {
              id: `uploaded-poster-${response.data.id}`,
              name: response.data.name,
              thumbnail: getFullPosterUrl(response.data.url_poster),
              isCustom: true,
              uploading: false,
              serverData: response.data
            };

            // Thay thế poster đang upload bằng poster đã upload thành công
            setCustomPosters(prev => prev.map(poster =>
              poster.id === previewPoster.id ? uploadedPoster : poster
            ));

            // Thêm vào savedPosters
            setSavedPosters(prev => [...prev, uploadedPoster]);
            // Tự động chọn poster vừa upload
            handlePosterSelect(uploadedPoster);

            console.log('✅ [PosterLogoManager] Poster uploaded successfully:', response.data);
          }
        } catch (error) {
          console.error('❌ [PosterLogoManager] Failed to upload poster:', error);

          // Xóa poster đang upload nếu lỗi
          setCustomPosters(prev => prev.filter(poster => poster.id !== previewPoster.id));

          alert(`Lỗi khi tải lên poster: ${error.message || 'Đã xảy ra lỗi'}`);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ [PosterLogoManager] Error processing poster upload:', error);
      alert(`Lỗi khi xử lý file: ${error.message || 'Đã xảy ra lỗi'}`);
    }
  };

  const handleFileUpload = async (event, item) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file tối đa là 5MB");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const previewUrl = e.target.result;

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

          URL.revokeObjectURL(previewUrl);
          setLogoItems(prev => prev.filter(logo => logo.id !== item.id));
          setApiLogos(prev => [apiLogo, ...prev]);

          alert(`Tải lên ${item.type} thành công!`);
        }
      } catch (error) {
        console.error("Lỗi khi tải lên:", error);

        setLogoItems(prev => prev.map(logo =>
          logo.id === item.id
            ? { ...logo, uploadStatus: 'error' }
            : logo
        ));

        alert(`Lỗi khi tải lên: ${error.message || 'Đã xảy ra lỗi'}`);
      }
    };

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

    useEffect(() => {
      if (item.code !== localCodeRef) {
        const wasFocused = inputRef.current && document.activeElement === inputRef.current;
        lastFocusedRef.current = wasFocused;

        setLocalCode(item.code);
        setLocalCodeRef(item.code);

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
            if (foundLogo.url_logo ) {
              onUpdate(item.id, {
                ...item,
                code: localCode.trim(),
                url: getFullLogoUrl(foundLogo.url_logo ),
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
      const newPositions = item.displayPositions.includes(position)
        ? [] 
        : [position]; 
      const updatedItem = { ...item, displayPositions: newPositions };
      onUpdate(item.id, updatedItem);

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
        behavior = 'add'; 
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
            <div className="text-xs text-gray-600 mb-1">Vị trí hi���n thị:</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { key: 'top-left', icon: '↖️', title: 'Trên trái' },
                { key: 'bottom-left', icon: '↙️', title: 'Dưới trái' },
                { key: 'bottom-right', icon: '↘️', title: 'Dưới phải' }
              ].map((pos) => (
                <button
                  key={pos.key}
                  onClick={() => handlePositionToggle(pos.key)}
                  className={`flex flex-col items-center p-1 border rounded text-xs relative ${item.displayPositions.includes(pos.key)
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
    setSelectedPoster(poster);
    // Save to backend
    if (accessCode) {
      socketService.emit('poster_update', {
        posterType: poster.id,
        posterData: poster
      });
    }
    if (onPosterUpdate) {
      onPosterUpdate(poster);
    }
  }, [onPosterUpdate, accessCode]);

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

  const handleHistoryMatchSelect = useCallback(async (matchId) => {
    console.log('🔄 [PosterLogoManager] Selecting history match:', matchId);
    setSelectedHistoryMatch(matchId);

    if (!matchId) return;

    try {
      const selectedMatch = historyMatches.find(match => match.id.toString() === matchId);
      if (!selectedMatch) {
        console.warn('⚠️ [PosterLogoManager] Selected match not found');
        return;
      }

      console.log('📋 [PosterLogoManager] Selected match data:', selectedMatch);

      // Clear current logos
      setApiLogos([]);
      setLogoItems([]);

      // Load logos from selected match's display settings
      const loadedLogos = [];

      selectedMatch.displaySettings.forEach((setting) => {
        let category = 'sponsor'; // default

        // Determine category based on setting type
        if (setting.type === 'sponsors') category = 'sponsor';
        else if (setting.type === 'organizing') category = 'organizing';
        else if (setting.type === 'media_partners') category = 'media';
        else if (setting.type === 'tournament_logo') category = 'tournament';

        // Parse position
        let positions = [];
        if (setting.position) {
          try {
            positions = [setting.position.replace(/[{}]/g, '')];
          } catch (e) {
            console.warn('Failed to parse position:', setting.position);
            positions = [];
          }
        }

        loadedLogos.push({
          id: `history-${setting.id}`,
          unitName: setting.code_logo || `Item ${setting.id}`,
          code: setting.code_logo || `HIST${setting.id}`,
          type: setting.type_display || 'logo',
          category: category,
          url: getFullLogoUrl(setting.url_logo),
          displayPositions: positions
        });
      });

      setApiLogos(loadedLogos);
      console.log(`✅ [PosterLogoManager] Loaded ${loadedLogos.length} logos from history match`);

    } catch (error) {
      console.error('❌ [PosterLogoManager] Error loading history match:', error);
    }
  }, [historyMatches]);

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
    // Kiểm tra giới hạn cho tournament
    if (activeLogoCategory === 'tournament' && tournamentItemsCount >= 1) {
      alert('Chỉ được phép có 1 logo hoặc banner duy nhất cho tournament!');
      return;
    }

    const newLogo = {
      id: `custom-logo-${Date.now()}`,
      unitName: `Logo ${logoItems.filter(item => item.type === 'logo').length + 1}`,
      code: ` `,
      type: "logo",
      category: activeLogoCategory,
      url: null,
      displayPositions: [],
      isCustom: true
    };

    setLogoItems(prev => [...prev, newLogo]);
  };

  const handleAddNewBanner = async () => {
    // Kiểm tra giới hạn cho tournament
    if (activeLogoCategory === 'tournament' && tournamentItemsCount >= 1) {
      alert('Chỉ được phép có 1 logo hoặc banner duy nhất cho tournament!');
      return;
    }

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



  const allPosters = [...availablePosters, ...savedPosters, ...customPosters];

  const renderPosterSection = () => {
    const uploadedPostersCount = [...savedPosters, ...customPosters].length;
    const canUploadMore = uploadedPostersCount < 3;

    return (
      <div className="space-y-1">
        {/* Hiển thị số lượng poster đã upload */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs">🖼️</span>
            <h3 className="text-xs font-semibold text-gray-900">Poster Template</h3>
          </div>
          <span className="text-xs text-gray-500">
            Đã upload: {uploadedPostersCount}/3
          </span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {allPosters.map((poster) => (
            <div key={poster.id} className="flex-none w-24">
              <PosterCard
                poster={poster}
                isSelected={selectedPoster?.id === poster.id}
                onClick={() => handlePosterSelect(poster)}
              />
            </div>
          ))}
          {/* Nút thêm poster - chỉ hiện khi chưa đủ 3 poster */}
          {canUploadMore && (
            <div className="flex-none w-24">
              <div className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="hidden"
                  id="poster-upload"
                />
                <label
                  htmlFor="poster-upload"
                  className="block aspect-video bg-gray-50 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-8 h-8 bg-gray-200 hover:bg-blue-200 rounded-full flex items-center justify-center mb-1 transition-colors duration-200">
                      <span className="text-lg text-gray-500 hover:text-blue-500">+</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Thêm poster</span>
                  </div>
                </label>
              </div>
            </div>
          )}
          {/* Thông báo khi đã đủ 3 poster */}
          {!canUploadMore && (
            <div className="flex-none w-24">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md border-2 border-dashed border-gray-300">
                <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1">
                    <span className="text-lg text-gray-500">✓</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium px-1 text-center">Đã đủ 3 poster</span>
                </div>
              </div>
            </div>
          )}
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

  // Kiểm tra xem có banner nào được chọn không (theo code bắt đầu bằng B hoặc type banner)
  const hasBannerSelected = useMemo(() => {
    return currentItems.some(item => {
      const isBannerByCode = item.code && item.code.toUpperCase().startsWith('B');
      const isBannerByType = item.type === 'banner';
      const isActive = item.displayPositions && item.displayPositions.length > 0;
      return (isBannerByCode || isBannerByType) && isActive;
    });
  }, [currentItems]);

  // Kiểm tra xem có logo nào được chọn không
  const hasLogoSelected = useMemo(() => {
    return currentItems.some(item => item.type === 'logo' && item.displayPositions && item.displayPositions.length > 0);
  }, [currentItems]);

  const tournamentItemsCount = useMemo(() => {
    if (activeLogoCategory !== 'tournament') return 0;
    return currentItems.filter(item => item.displayPositions && item.displayPositions.length > 0).length;
  }, [currentItems, activeLogoCategory]);

  const shouldDisableShapeOption = (shapeValue) => {
    if (hasBannerSelected && shapeValue !== 'square') {
      return true;
    }

    return false;
  };

  const handleRoundGroupUpdate = useCallback((type, value, show) => {
    console.log(`🔄 [PosterLogoManager] handleRoundGroupUpdate - type: ${type}, value: ${value}, show: ${show}`);

    if (type === 'round') {
      setRoundGroupOptions(prev => ({ ...prev, round: value, showRound: show }));

      // Emit to backend
      console.log(`📡 [PosterLogoManager] Emitting updateRound to backend - round: ${value}, showRound: ${show}`);
      socketService.emit('round_update', { round: value, showRound: show });

      if (onLogoUpdate) {
        onLogoUpdate({
          roundGroupUpdate: { round: value, showRound: show, type: 'round' }
        });
      }
    } else if (type === 'group') {
      setRoundGroupOptions(prev => ({ ...prev, group: value, showGroup: show }));

      // Emit to backend
      console.log(`📡 [PosterLogoManager] Emitting updateGroup to backend - group: ${value}, showGroup: ${show}`);
      socketService.emit('group_update', { group: value, showGroup: show });

      if (onLogoUpdate) {
        onLogoUpdate({
          roundGroupUpdate: { group: value, showGroup: show, type: 'group' }
        });
      }
    }
  }, [onLogoUpdate]);

  const handleSubtitleUpdate = useCallback((subtitle, show) => {
    console.log(`🔄 [PosterLogoManager] handleSubtitleUpdate - subtitle: ${subtitle}, show: ${show}`);

    setRoundGroupOptions(prev => ({ ...prev, subtitle, showSubtitle: show }));

    // Emit to backend
    console.log(`📡 [PosterLogoManager] Emitting updateSubtitle to backend - subtitle: ${subtitle}, showSubtitle: ${show}`);
    socketService.emit('subtitle_update', { subtitle, showSubtitle: show });

    if (onLogoUpdate) {
      onLogoUpdate({
        subtitleUpdate: { subtitle, showSubtitle: show, type: 'subtitle' }
      });
    }
  }, [onLogoUpdate]);

  const renderRoundGroupSection = () => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="text-xs">🏆</span>
          <h3 className="text-xs font-semibold text-gray-900">Vòng đấu & Bảng đấu & Tiêu đề phụ</h3>
        </div>

        {/* Vòng đấu */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <span className="text-xs text-gray-700">Vòng:</span>
            <select
              value={roundGroupOptions.round}
              onChange={(e) => handleRoundGroupUpdate('round', parseInt(e.target.value), roundGroupOptions.showRound)}
              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>Vòng {num}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={roundGroupOptions.showRound}
              onChange={(e) => handleRoundGroupUpdate('round', roundGroupOptions.round, e.target.checked)}
              className="w-3 h-3"
            />
            <span className="text-xs text-gray-600">Hiện</span>
          </label>
        </div>

        {/* Bảng đấu */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <span className="text-xs text-gray-700">Bảng:</span>
            <select
              value={roundGroupOptions.group}
              onChange={(e) => handleRoundGroupUpdate('group', e.target.value, roundGroupOptions.showGroup)}
              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
            >
              {['A','B','C','D','E','F','G','H'].map(letter => (
                <option key={letter} value={letter}>Bảng {letter}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={roundGroupOptions.showGroup}
              onChange={(e) => handleRoundGroupUpdate('group', roundGroupOptions.group, e.target.checked)}
              className="w-3 h-3"
            />
            <span className="text-xs text-gray-600">Hiện</span>
          </label>
        </div>

        {/* Tiêu đề phụ */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <span className="text-xs text-gray-700">Tiêu đề phụ:</span>
            <input
              type="text"
              value={roundGroupOptions.subtitle}
              onChange={(e) => setRoundGroupOptions(prev => ({ ...prev, subtitle: e.target.value }))}
              onBlur={(e) => handleSubtitleUpdate(e.target.value, roundGroupOptions.showSubtitle)}
              placeholder="Nhập tiêu đề phụ"
              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white flex-1"
            />
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={roundGroupOptions.showSubtitle}
              onChange={(e) => handleSubtitleUpdate(roundGroupOptions.subtitle, e.target.checked)}
              className="w-3 h-3"
            />
            <span className="text-xs text-gray-600">Hiện</span>
          </label>
        </div>
      </div>
    );
  };

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
                <span className={`ml-1 px-1 py-0.5 rounded-full text-xs font-bold ${activeLogoCategory === type.id
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
          {hasBannerSelected && (
            <div className="text-xs text-orange-600 bg-orange-50 p-1 rounded border">
              ⚠️ Đã chọn banner, chỉ được chọn hình vuông
            </div>
          )}
          {activeLogoCategory === 'tournament' && tournamentItemsCount >= 1 && (
            <div className="text-xs text-blue-600 bg-blue-50 p-1 rounded border">
              📝 Tournament chỉ cho phép 1 logo/banner duy nhất
            </div>
          )}

          <div className="flex gap-1">
            {[
              { value: 'round', label: 'Tròn', icon: '⭕' },
              { value: 'square', label: 'Vuông', icon: '⬜' },
              { value: 'hexagon', label: 'Lục giác', icon: '⬡' }
            ].map((shape) => {
              const isDisabled = shouldDisableShapeOption(shape.value);
              return (
                <label key={shape.value} className={`flex items-center gap-0.5 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input
                    id={`logo-shape-${shape.value}`}
                    name="logoShape"
                    type="radio"
                    value={shape.value}
                    checked={logoDisplayOptions.shape === shape.value}
                    disabled={isDisabled}
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
                  {isDisabled && <span className="text-xs text-red-500">(Bị khóa)</span>}
                </label>
              );
            })}
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
        <select
          className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
          value={selectedHistoryMatch}
          onChange={(e) => handleHistoryMatchSelect(e.target.value)}
        >
          <option value="">Chọn trận</option>
          {historyMatches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.accessCode}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-2">
        {renderPosterSection()}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-2">
        {renderLogoSection()}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-2">
        {renderRoundGroupSection()}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-2">
        <div className="flex justify-center">
          <button
            onClick={() => {
              const previewUrl = `/${accessCode}/preview`;
              window.open(previewUrl, '_blank');
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>📥</span>
            <span>Preview</span>
          </button>
        </div>
      </div>

    </div>
  );
});

export default PosterLogoManager;
