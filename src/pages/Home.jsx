import React, { useState, useCallback } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ScoreDisplay from "../components/scoreboard/ScoreDisplay";
import PosterManager from "../components/poster/PosterManager";
import TeamLineupModal from "../components/lineup/TeamLineupModal";
import Modal from "../components/common/Modal";
import SimplePenaltyModal from "../components/common/SimplePenaltyModal";

const Home = () => {
  const [activeTab, setActiveTab] = useState("upload-logo");
  const [matchCode, setMatchCode] = useState("");
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeInfo, setCodeInfo] = useState(null);

  // State cho upload logo - s�� dụng chung với tab quản lý trận
  const [logoData, setLogoData] = useState(null);
  const [bannerData, setBannerData] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [logoSearch, setLogoSearch] = useState("");

  // State cho match data sau khi nhập code
  const [matchData, setMatchData] = useState({
    homeTeam: { name: "ĐỘI-A", score: 0, logo: null },
    awayTeam: { name: "ĐỘI-B", score: 0, logo: null },
    matchTime: "39:15",
    period: "Hiệp 1",
    status: "live",
  });

  // State cho các tùy chọn điều khiển
  const [selectedOption, setSelectedOption] = useState("gioi-thieu");
  const [clockSetting, setClockSetting] = useState("khong");
  const [clockText, setClockText] = useState("");
  const [selectedSkin, setSelectedSkin] = useState(1);
  const [isCodeInfoExpanded, setIsCodeInfoExpanded] = useState(false);

  // State cho custom time và cài đặt chữ chạy nâng cao
  const [customTime, setCustomTime] = useState("");
  const [tickerColor, setTickerColor] = useState("#ffffff");
  const [tickerFontSize, setTickerFontSize] = useState(16);

  // State cho số lỗi futsal
  const [futsalErrors, setFutsalErrors] = useState(0);

  // State cho thống kê bóng đá
  const [footballStats, setFootballStats] = useState({
    totalShots: 0,
    shotsOnTarget: 0,
    corners: 0,
    yellowCards: 0,
    fouls: 0
  });

  // Skin data configuration
  const skinData = {
    1: { name: "Template 1", image: "/images/templates/skin1.png" },
    2: { name: "Template 2", image: "/images/templates/skin2.png" },
    3: { name: "Template 3", image: "/images/templates/skin3.png" },
    4: { name: "Template 4", image: "/images/templates/skin4.png" },
    5: { name: "Template 5", image: "/images/templates/skin5.png" }
  };

        // State cho modal poster
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showCodeInfoModal, setShowCodeInfoModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // State cho form login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

      // State cho penalty shootout - đơn giản hóa cho backend
  const [penaltyData, setPenaltyData] = useState({
    homeGoals: 0,
    awayGoals: 0,
    currentTurn: 'home',
    status: 'ready', // ready, ongoing, completed
    lastUpdated: null
  });

  // Memoized callback to prevent infinite loops
  const handlePenaltyChange = useCallback((newPenaltyData) => {
    setPenaltyData(newPenaltyData);
    setSelectedOption("penalty");
  }, []);

  const tabs = [
    { id: "upload-logo", name: "UP LOGO" },
    { id: "quan-ly-tran", name: "QUẢN LÝ TRẬN" },
    { id: "binh-luan", name: "BÌNH LUẬN" },
  ];

  const handleCodeSubmit = async () => {
    if (matchCode.toLowerCase() === "ffff") {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        setIsCodeEntered(true);
        setCodeInfo({
          code: matchCode.toUpperCase(),
          generatedAt: "16:13:11 19/7/2025",
          status: "active",
          expiryDate: "16:13:11 3/8/2025"
        });
        setIsLoading(false);
      }, 1000);
    } else {
      alert("Code không đúng. Vui lòng thử lại!");
    }
  };

  const handleUploadCodeSubmit = () => {
    if (matchCode.toLowerCase() === "ffff") {
      setIsCodeEntered(true);
      setCodeInfo({
        code: matchCode.toUpperCase(),
        generatedAt: "16:13:11 19/7/2025",
        status: "active",
        expiryDate: "16:13:11 3/8/2025"
      });
    } else {
      alert("Code không đúng. Vui lòng thử lại!");
    }
  };

  const handleLogoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoData({
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleBannerUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBannerData({
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleScoreChange = (team, increment) => {
    setMatchData((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        score: Math.max(0, prev[team].score + increment),
      },
    }));
  };

  const renderUploadLogoTab = () => (
    <div className="p-2 sm:p-4 space-y-3">
      {/* Upload Section - Require Code */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-center justify-center mb-2">
          <span className="text-sm">📁</span>
          <h3 className="text-xs font-bold text-gray-800 mx-2">UPLOAD</h3>
        </div>

        {!isCodeEntered ? (
          <div className="space-y-3">
            <Input
              placeholder="Nhập code..."
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value)}
              className="text-center text-sm"
            />
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                className="w-20 h-7 text-xs"
                onClick={handleUploadCodeSubmit}
                style={{ fontSize: '10px' }}
              >
                XÁC NHẬN
              </Button>
            </div>
            <div className="text-center text-xs text-gray-500">
              Nhập "ffff" để demo
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Upload Buttons Row */}
            <div className="flex justify-center space-x-3">
              {/* Upload Logo */}
              <button
                onClick={handleLogoUpload}
                className="w-16 h-12 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg mb-0.5">+</span>
                <span className="text-xs font-bold">LOGO</span>
              </button>

              {/* Upload Banner */}
              <button
                onClick={handleBannerUpload}
                className="w-16 h-12 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg flex flex-col items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg mb-0.5">+</span>
                <span className="text-xs font-bold">BANNER</span>
              </button>
            </div>

            {/* Preview and Name Input */}
            {(logoData || bannerData) && (
              <div className="bg-white rounded border border-gray-200 p-3">
                {logoData && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={logoData.preview}
                        alt="Logo"
                        className="w-12 h-12 object-contain border rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-green-600 font-medium mb-1">📁 Logo</div>
                        <Input
                          placeholder="Nhập tên logo..."
                          value={logoName}
                          onChange={(e) => setLogoName(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {bannerData && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bannerData.preview}
                        alt="Banner"
                        className="w-12 h-6 object-cover border rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-blue-600 font-medium mb-1">🖼️ Banner</div>
                        <Input
                          placeholder="Nhập tên banner..."
                          value={bannerName}
                          onChange={(e) => setBannerName(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Section - No Code Required */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-center justify-center mb-2">
          <span className="text-sm">🔍</span>
          <h3 className="text-xs font-bold text-green-700 mx-2">TÌM KIẾM LOGO</h3>
        </div>
        <Input
          placeholder="Tìm theo tên đội..."
          value={logoSearch}
          onChange={(e) => setLogoSearch(e.target.value)}
          className="text-center text-sm h-8"
        />
      </div>

      {/* Help Section */}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          size="sm"
          className="w-20 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-1 text-xs rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          style={{ fontSize: '10px' }}
        >
          <span className="mr-1 text-xs">📚</span>
          HỖ TRỢ
        </Button>
      </div>
    </div>
  );

  const renderQuanLyTranTab = () => {
    if (!isCodeEntered) {
      return (
        <div className="p-3 sm:p-6 max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2h-6m6 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nhập mã truy cập
              </h3>
              <p className="text-gray-600 text-sm">
                Vui lòng nhập mã code để truy cập và quản lý trận đấu
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Nhập code..."
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value)}
              className="text-center text-lg font-mono"
            />

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                className="w-32"
                onClick={handleCodeSubmit}
                loading={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "XÁC NHẬN"}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Nhập "ffff" để demo
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Code Information - Compact */}
        {codeInfo && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-white/50 rounded-lg p-2 transition-colors"
              onClick={() => setIsCodeInfoExpanded(!isCodeInfoExpanded)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mã truy cập:</span>
                <span className={`font-mono font-bold text-sm ${!isCodeInfoExpanded ? 'filter blur-sm select-none' : ''}`}>
                  {isCodeInfoExpanded ? codeInfo.code : '••••'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    codeInfo.status === "active"
                      ? "bg-green-100 text-green-800"
                      : codeInfo.status === "inactive"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {codeInfo.status === "active"
                    ? "🟢 Đã kích hoạt"
                    : codeInfo.status === "inactive"
                      ? "🟡 Chưa kích hoạt"
                      : "🔴 Đã hết hạn"}
                </span>
                <span className={`text-gray-400 transition-transform duration-200 ${isCodeInfoExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </div>

            {isCodeInfoExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-200 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Được tạo lúc:</span>
                      <span className="font-medium">{codeInfo.generatedAt}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hết hạn vào:</span>
                      <span className="font-medium text-orange-600">
                        {codeInfo.expiryDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scoreboard */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl p-3 sm:p-4 border-2 sm:border-4 border-yellow-400 shadow-2xl">
          {selectedSkin && skinData[selectedSkin] ? (
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={skinData[selectedSkin].image}
                alt={skinData[selectedSkin].name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
                <span className="text-gray-600 font-medium">{skinData[selectedSkin].name}</span>
              </div>
            </div>
          ) : (
            <ScoreDisplay
              homeTeam={matchData.homeTeam}
              awayTeam={matchData.awayTeam}
              matchTime={matchData.matchTime}
              period={matchData.period}
              status={matchData.status}
              backgroundColor="bg-transparent"
              size="md"
            />
          )}
        </div>

        {/* Score Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 border border-blue-200">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Đội nhà */}
            <div className="bg-white rounded-lg p-2 sm:p-4 shadow-md border border-blue-200">
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-8 sm:h-10"
                  onClick={() => handleScoreChange("homeTeam", 1)}
                >
                  <span className="text-lg sm:text-xl">+</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-8 sm:h-10"
                  onClick={() => handleScoreChange("homeTeam", -1)}
                >
                  <span className="text-lg sm:text-xl">-</span>
                </Button>
              </div>
            </div>

            {/* Đội khách */}
            <div className="bg-white rounded-lg p-2 sm:p-4 shadow-md border border-purple-200">
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-8 sm:h-10"
                  onClick={() => handleScoreChange("awayTeam", 1)}
                >
                  <span className="text-lg sm:text-xl">+</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-8 sm:h-10"
                  onClick={() => handleScoreChange("awayTeam", -1)}
                >
                  <span className="text-lg sm:text-xl">-</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Nút TẠM DỪNG và LỖI(FUTSAL) */}
          <div className="flex justify-center items-center mt-3 space-x-3">
            <Button
              variant="primary"
              size="sm"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setSelectedOption("tam-dung")}
            >
              <span className="mr-1">⏸️</span>
              TẠM DỪNG
            </Button>

            <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm">
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border-0 hover:bg-red-50"
                onClick={() => setFutsalErrors(prev => prev + 1)}
              >
                <span className="mr-1">⚠️</span>
                Lỗi(futsal)
              </Button>
              <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-6 text-center rounded-r">
                {futsalErrors}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedOption("thong-so")}
              className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 shadow-md ${
                selectedOption === "thong-so"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl"
                  : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300"
              }`}
            >
              <span className="mr-1 text-sm">📊</span>
              <span className="hidden sm:inline">THÔNG SỐ</span>
              <span className="sm:hidden">STATS</span>
            </button>
            <button
              onClick={() => setSelectedOption("dieu-khien")}
              className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 shadow-md ${
                selectedOption === "dieu-khien"
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-xl"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
            >
              <span className="mr-1 text-sm">🎮</span>
              <span className="hidden sm:inline">ĐIỀU KHIỂN</span>
              <span className="sm:hidden">CTRL</span>
            </button>
            <button
              onClick={() => {
                setSelectedOption(selectedOption === "chon-skin" ? "dieu-khien" : "chon-skin");
              }}
              className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 shadow-md ${
                selectedOption === "chon-skin"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl"
                  : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300"
              }`}
            >
              <span className="mr-1 text-sm">🎨</span>
              <span className="hidden sm:inline">TEMPLATE</span>
              <span className="sm:hidden">TPL</span>
            </button>
          </div>
        </div>

        {/* Inline Template Selection */}
        {selectedOption === "chon-skin" && (
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-gray-200 animate-slide-up">
            <h3 className="text-center text-sm sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center">
              <span className="mr-1 sm:mr-2 text-sm">🎨</span>
              CHỌN TEMPLATE
              <span className="ml-1 sm:ml-2 text-sm">🎨</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((skinNumber) => (
                <div
                  key={skinNumber}
                  onClick={() => {
                    setSelectedSkin(skinNumber);
                    console.log('Template selected:', skinNumber);
                  }}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                    selectedSkin === skinNumber
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <img
                    src={`/images/templates/skin${skinNumber}.png`}
                    alt={`Template ${skinNumber}`}
                    className="w-full h-16 sm:h-24 object-contain bg-gray-50"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-16 sm:h-24 bg-gray-100 items-center justify-center hidden">
                    <span className="text-gray-500 font-medium text-xs sm:text-sm">Template {skinNumber}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-center py-1">
                    <span className="text-xs font-medium">Template {skinNumber}</span>
                  </div>
                  {selectedSkin === skinNumber && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Thông số */}
        {selectedOption === "thong-so" && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <h3 className="text-center text-sm sm:text-lg font-bold text-green-800 mb-4 flex items-center justify-center">
              <span className="mr-2 text-sm">📊</span>
              THỐNG KÊ TRẬN ĐẤU
              <span className="ml-2 text-sm">📊</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Tổng số cú sút */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">
                    {footballStats.totalShots}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Tổng số cú sút</div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, totalShots: Math.max(0, prev.totalShots - 1)}))}
                      className="w-6 h-6 p-0 text-xs"
                      disabled={footballStats.totalShots === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, totalShots: prev.totalShots + 1}))}
                      className="w-6 h-6 p-0 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sút trúng đích */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">
                    {footballStats.shotsOnTarget}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Sút trúng đích</div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, shotsOnTarget: Math.max(0, prev.shotsOnTarget - 1)}))}
                      className="w-6 h-6 p-0 text-xs"
                      disabled={footballStats.shotsOnTarget === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, shotsOnTarget: prev.shotsOnTarget + 1}))}
                      className="w-6 h-6 p-0 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Phạt góc */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">
                    {footballStats.corners}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Phạt góc</div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, corners: Math.max(0, prev.corners - 1)}))}
                      className="w-6 h-6 p-0 text-xs"
                      disabled={footballStats.corners === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, corners: prev.corners + 1}))}
                      className="w-6 h-6 p-0 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Thẻ vàng */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600 mb-1">
                    {footballStats.yellowCards}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Thẻ vàng</div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, yellowCards: Math.max(0, prev.yellowCards - 1)}))}
                      className="w-6 h-6 p-0 text-xs"
                      disabled={footballStats.yellowCards === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, yellowCards: prev.yellowCards + 1}))}
                      className="w-6 h-6 p-0 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Phạm lỗi */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-red-600 mb-1">
                    {footballStats.fouls}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Phạm lỗi</div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, fouls: Math.max(0, prev.fouls - 1)}))}
                      className="w-6 h-6 p-0 text-xs"
                      disabled={footballStats.fouls === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFootballStats(prev => ({...prev, fouls: prev.fouls + 1}))}
                      className="w-6 h-6 p-0 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lỗi Futsal */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-1">
                    {futsalErrors}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Lỗi(futsal)</div>
                  <div className="flex justify-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFutsalErrors(prev => Math.max(0, prev - 1))}
                      className="w-6 h-6 p-0 text-xs"
                      disabled={futsalErrors === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setFutsalErrors(prev => prev + 1)}
                      className="w-6 h-6 p-0 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  setFootballStats({
                    totalShots: 0,
                    shotsOnTarget: 0,
                    corners: 0,
                    yellowCards: 0,
                    fouls: 0
                  });
                  setFutsalErrors(0);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-1">🔄</span>
                ĐẶT LẠI TẤT CẢ
              </Button>
            </div>
          </div>
        )}

        {/* Options - Thay đổi action buttons */}
        {selectedOption !== "chon-skin" && selectedOption !== "thong-so" && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-200">
          {/* Grid responsive cho mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
            {/* Poster */}
            <button
              onClick={() => setShowPosterModal(true)}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🎨</span>
              <span className="text-xs font-bold text-center">
                POSTER
              </span>
            </button>

            {/* Giới thiệu */}
            <button
              onClick={() => {
                setSelectedOption("gioi-thieu");
              }}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "gioi-thieu"
                  ? "bg-gradient-to-br from-red-500 to-orange-600 text-white"
                  : "bg-gradient-to-br from-red-100 to-orange-200 text-red-700 hover:from-red-200 hover:to-orange-300"
              }`}
            >
              <span className="text-sm mr-1">🎬</span>
              <span className="text-xs font-bold text-center">
                GIỚI THIỆU
              </span>
            </button>

                        {/* Danh sách */}
            <button
              onClick={() => {
                setSelectedOption("danh-sach");
                setShowLineupModal(true);
              }}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "danh-sach"
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                  : "bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-700 hover:from-blue-200 hover:to-indigo-300"
              }`}
            >
              <span className="text-sm mr-1">📋</span>
              <span className="text-xs font-bold text-center">
                DANH SÁCH
              </span>
            </button>

            {/* Tỉ số dưới */}
            <button
              onClick={() => {
                setSelectedOption("ti-so-duoi");
                // Có thể mở modal tỉ số ở đây
              }}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "ti-so-duoi"
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                  : "bg-gradient-to-br from-green-100 to-emerald-200 text-green-700 hover:from-green-200 hover:to-emerald-300"
              }`}
            >
              <span className="text-sm mr-1">⚽</span>
              <span className="text-xs font-bold text-center">
                TỈ SỐ DƯỚI
              </span>
            </button>

            {/* Nghỉ hiệp */}
            <button
              onClick={() => {
                setSelectedOption("nghi-hiep");
                // Có thể mở modal nghỉ hiệp ở đây
              }}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "nghi-hiep"
                  ? "bg-gradient-to-br from-yellow-500 to-orange-600 text-white"
                  : "bg-gradient-to-br from-yellow-100 to-orange-200 text-yellow-700 hover:from-yellow-200 hover:to-orange-300"
              }`}
            >
              <span className="text-sm mr-1">⏰</span>
              <span className="text-xs font-bold text-center">
                NGHỈ HIỆP
              </span>
            </button>

                        {/* Penalty */}
            <button
              onClick={() => {
                setShowPenaltyModal(true);
              }}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption?.startsWith("penalty")
                  ? "bg-gradient-to-br from-gray-600 to-gray-800 text-white"
                  : "bg-gradient-to-br from-gray-100 to-gray-300 text-gray-700 hover:from-gray-200 hover:to-gray-400"
              }`}
            >
              <span className="text-sm mr-1">🥅</span>
              <span className="text-xs font-bold text-center">
                PENALTY
              </span>
            </button>

            {/* Đếm giờ buttons - Đầy đủ tất cả options */}
            <button
              onClick={() => setSelectedOption("dem-0")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-0"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 0'
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("dem-20")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-20"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 20'
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("dem-25")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-25"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 25'
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("dem-30")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-30"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 30'
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("dem-35")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-35"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 35'
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("dem-40")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-40"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">4️⃣0️⃣</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 40
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("dem-45")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "dem-45"
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                  : "bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
              }`}
            >
              <span className="text-sm mr-1">4️⃣5️⃣</span>
              <span className="text-xs font-bold text-center">
                ĐẾM 45
              </span>
            </button>

            <button
              onClick={() => setShowTimerModal(true)}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
            >
              <span className="text-sm mr-1">🕰️</span>
              <span className="text-xs font-bold text-center">
                ĐẾM T
              </span>
            </button>



            {/* Tắt */}
            <button
              onClick={() => setSelectedOption("tat")}
              className={`flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                selectedOption === "tat"
                  ? "bg-gradient-to-br from-red-600 to-red-800 text-white"
                  : "bg-gradient-to-br from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300"
              }`}
            >
              <span className="text-sm mr-1">❌</span>
              <span className="text-xs font-bold text-center">
                TẮT
              </span>
            </button>
          </div>


        </div>
        )}

        {/* Clock Settings - Compact */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 border border-orange-200">

          <div className="space-y-3">
            {/* Radio buttons */}
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="clock"
                  value="khong"
                  checked={clockSetting === "khong"}
                  onChange={(e) => setClockSetting(e.target.value)}
                  className="scale-75"
                />
                <label className="text-xs">KHÔNG</label>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="clock"
                  value="lien-tuc"
                  checked={clockSetting === "lien-tuc"}
                  onChange={(e) => setClockSetting(e.target.value)}
                  className="scale-75"
                />
                <label className="text-xs">LIÊN TỤC</label>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="clock"
                  value="moi-2"
                  checked={clockSetting === "moi-2"}
                  onChange={(e) => setClockSetting(e.target.value)}
                  className="scale-75"
                />
                <label className="text-xs">MỖI 2'</label>
              </div>
            </div>

            {/* Text content - compact for mobile */}
            <Input
              placeholder="Nội dung chữ chạy..."
              value={clockText}
              onChange={(e) => setClockText(e.target.value)}
              maxLength={100}
              className="w-full text-xs"
            />

            {/* Color and Font Size - compact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <input
                    type="color"
                    value={tickerColor}
                    onChange={(e) => setTickerColor(e.target.value)}
                    className="w-5 h-5 border border-orange-300 rounded cursor-pointer"
                  />
                </div>
                <div className="flex gap-0.5 flex-wrap">
                  {["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff6600", "#ff00ff"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setTickerColor(color)}
                      className={`w-3 h-3 rounded border ${
                        tickerColor === color ? "border-orange-600 border-2" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <input
                    type="range"
                    min="12"
                    max="32"
                    value={tickerFontSize}
                    onChange={(e) => setTickerFontSize(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-orange-200 rounded appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-medium min-w-8">
                    {tickerFontSize}px
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button - compact */}
            <div className="flex justify-center pt-2 border-t border-orange-200">
              <Button
                variant="primary"
                size="sm"
                className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                ÁP DỤNG
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBinhLuanTab = () => {
    if (!isCodeEntered) {
      return (
        <div className="p-6 max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nhập mã truy cập
              </h3>
              <p className="text-gray-600 text-sm">
                Vui lòng nhập mã code để truy cập chức năng bình luận
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Nhập code..."
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value)}
              className="text-center text-lg font-mono"
            />

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                className="w-32"
                onClick={handleCodeSubmit}
                loading={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "XÁC NHẬN"}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Nhập "ffff" để demo
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Không hiển thị thông tin mã truy cập trong tab bình luận */}

        {/* Microphone Section */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border border-red-200">
          <h3 className="text-center text-lg font-bold text-red-800 mb-8 flex items-center justify-center">
            <span className="mr-2">🎙️</span>
            THU ÂM BÌNH LUẬN
            <span className="ml-2">🎙️</span>
          </h3>

          <div className="flex justify-center">
            <button
              onClick={() => {
                // Logic thu âm sẽ được thêm sau
                console.log("Microphone clicked - logic will be added later");
              }}
              className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
            >
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H6c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Nhấn vào micro để bắt đ��u thu âm bình luận
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-xl border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-12 sm:h-14">
            {/* Icons - Top Left */}
            <div className="flex items-center space-x-2">
              {/* Login Icon */}
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Đăng nhập"
              >
                <span className="text-white text-sm">👤</span>
              </button>

              {/* Icon Key - chỉ hiển thị khi đã nhập code */}
              {isCodeEntered && codeInfo && (
                <button
                  onClick={() => setShowCodeInfoModal(true)}
                  className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                  title="Xem thông tin mã truy cập"
                >
                  <span className="text-white text-sm">🔑</span>
                </button>
              )}

              {/* Icon điện thoại - luôn hiển thị */}
              <a
                href="tel:0923415678"
                className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 hover:bg-white/20 transition-colors"
                title="Gọi hotline hỗ trợ: 0923415678"
              >
                <span className="text-white text-sm">📞</span>
              </a>
            </div>

            {/* Center Logo and Title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-sm sm:text-lg">⚽</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Football Livestream Tool
                </h1>
                <p className="text-blue-200 text-xs">
                  Công cụ quản lý trận đấu trực tiếp
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-white">
                  scoliv
                </h1>
              </div>
            </div>

            {/* Right spacer for balance */}
            <div className="w-16 sm:w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300 shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-2 sm:py-3 sm:px-4 text-center font-bold text-xs sm:text-sm border-b-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? tab.id === "upload-logo"
                    ? "border-blue-500 text-blue-700 bg-gradient-to-t from-blue-100 to-blue-50 shadow-lg"
                    : tab.id === "quan-ly-tran"
                    ? "border-purple-500 text-purple-700 bg-gradient-to-t from-purple-100 to-purple-50 shadow-lg"
                    : "border-red-500 text-red-700 bg-gradient-to-t from-red-100 to-red-50 shadow-lg"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center">
                {tab.id === "upload-logo" ? (
                  <>
                    <span className="mr-1 text-sm">🏆</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">LOGO</span>
                  </>
                ) : tab.id === "quan-ly-tran" ? (
                  <>
                    <span className="mr-1 text-sm">⚽</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">TRẬN</span>
                  </>
                ) : (
                  <>
                    <span className="mr-1 text-sm">🎙️</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">AUDIO</span>
                  </>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white min-h-screen">
          {activeTab === "upload-logo" && renderUploadLogoTab()}
          {activeTab === "quan-ly-tran" && renderQuanLyTranTab()}
          {activeTab === "binh-luan" && renderBinhLuanTab()}
        </div>
      </main>

      {/* Poster Manager Modal - Responsive */}
      <Modal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        title="🎨 Quản Lý Poster & Logo"
        size="full"
        className="max-h-screen overflow-hidden"
      >
        <div className="h-full max-h-[85vh] overflow-y-auto">
          <div className="p-2 sm:p-4 lg:p-6">
            {/* Search Bar */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="🔍 Tìm kiếm poster, logo, template..."
                    className="w-full text-center sm:text-left"
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
                </div>
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <span className="mr-2">🔍</span>
                  <span className="hidden sm:inline">Tìm Kiếm</span>
                </Button>
              </div>
            </div>

            {/* Poster Manager Component */}
            <div className="bg-white rounded-lg">
              <PosterManager
                matchData={matchData}
                onPosterUpdate={(poster) => {
                  console.log("Updated poster:", poster);
                  // Có thể thêm toast notification ở đây
                }}
                onLogoUpdate={(logoData) => {
                  console.log("Updated logo:", logoData);
                  // Có thể thêm toast notification ở đây
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile-friendly footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            💡 <strong>Tip:</strong> Chọn poster trước, sau đó cài đặt logo và
            chữ chạy
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPosterModal(false)}
              className="w-20 py-2"
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              className="w-32 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2"
              onClick={() => {
                setShowPosterModal(false);
                // Logic lưu cài đặt poster
              }}
            >
              <span className="mr-1">💾</span>
              Lưu & Áp Dụng
            </Button>
                    </div>
        </div>
      </Modal>

            {/* Team Lineup Modal */}
      <TeamLineupModal
        isOpen={showLineupModal}
        onClose={() => setShowLineupModal(false)}
        onSave={(lineupData) => {
          console.log("Saved lineup data:", lineupData);
          setShowLineupModal(false);
          // Có thể thêm thông báo thành công ở đây
        }}
        matchData={matchData}
      />

                  {/* Penalty Modal */}
                        <SimplePenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        matchData={matchData}
        penaltyData={penaltyData}
        onPenaltyChange={handlePenaltyChange}
      />

      {/* Timer Modal */}
      <Modal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        title="🕰️ Thiết Lập Thời Gian Tùy Chỉnh"
        size="md"
      >
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-yellow-800 flex items-center justify-center">
              <span className="mr-2">🕰️</span>
              THIẾT LẬP ĐẾM T
              <span className="ml-2">🕰️</span>
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Trận đấu sẽ bắt đầu chạy từ thời điểm này
            </p>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="number"
              min="0"
              max="120"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="Nhập phút (VD: 30)"
              className="flex-1 text-sm border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 font-bold text-center"
            />
            <span className="text-sm font-medium text-yellow-800">ph��t</span>
          </div>

          <div className="text-center text-sm text-yellow-700 mb-4">
            ⏱️ Trận đấu sẽ bắt đầu từ: <strong>{customTime || "0"}:00</strong>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowTimerModal(false)}
              className="px-4 py-2"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                // Gửi về backend
                console.log('Áp dụng thời gian tùy chỉnh:', customTime);
                alert(`Đã áp dụng: Trận đấu bắt đầu từ ${customTime || 0} phút`);
                setShowTimerModal(false);
              }}
            >
              <span className="mr-1">✅</span>
              ÁP DỤNG
            </Button>
          </div>
        </div>
      </Modal>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setShowRegister(false);
          setLoginForm({ email: '', password: '', rememberMe: false });
        }}
        title=""
        size="md"
        className="overflow-hidden"
      >
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg">
          {!showRegister ? (
            // Login Form
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-white">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng Nhập</h2>
                <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                setLoginLoading(true);
                // Simulate login
                setTimeout(() => {
                  setLoginLoading(false);
                  setShowLoginModal(false);
                  alert('Đăng nhập thành công!');
                }, 1500);
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email hoặc Tên đăng nhập
                  </label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full"
                    required
                    icon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                    className="w-full"
                    required
                    icon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm(prev => ({...prev, rememberMe: e.target.checked}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loginLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {loginLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-500">Hoặc đăng nhập với</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <button
                    onClick={() => setShowRegister(true)}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </div>
          ) : (
            // Register Form
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl text-white">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng Ký</h2>
                <p className="text-gray-600">Tạo tài khoản mới để sử dụng dịch vụ</p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <Input
                      type="text"
                      placeholder="Nguyễn"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <Input
                      type="text"
                      placeholder="Văn A"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    className="w-full"
                    required
                    icon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <Input
                    type="tel"
                    placeholder="0901234567"
                    className="w-full"
                    required
                    icon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    required
                    icon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                    required
                    icon={
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Điều khoản sử dụng
                    </a>
                    {' '}và{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Chính sách bảo mật
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Đăng Ký
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{' '}
                  <button
                    onClick={() => setShowRegister(false)}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Code Info Modal */}
      <Modal
        isOpen={showCodeInfoModal}
        onClose={() => setShowCodeInfoModal(false)}
        title="🔑 Thông Tin Mã Truy Cập"
        size="md"
      >
        {codeInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl">🔑</span>
              </div>
              <h4 className="text-lg font-bold text-blue-800 mb-2">
                MÃ TRUY CẬP TRẬN ĐẤU
              </h4>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Mã truy cập:</span>
                  <span className="font-mono font-bold text-lg text-blue-600 bg-blue-50 px-3 py-1 rounded">
                    {codeInfo.code}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        codeInfo.status === "active"
                          ? "bg-green-100 text-green-800"
                          : codeInfo.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {codeInfo.status === "active"
                        ? "🟢 Đã kích hoạt"
                        : codeInfo.status === "inactive"
                          ? "🟡 Chưa kích hoạt"
                          : "🔴 Đã hết hạn"}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Được tạo lúc:</span>
                    <span className="font-medium">{codeInfo.generatedAt}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hết hạn vào:</span>
                    <span className="font-medium text-orange-600">
                      {codeInfo.expiryDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <div className="text-sm text-yellow-800">
                    <strong>Lưu ý bảo mật:</strong>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Không chia sẻ mã này với người khác</li>
                      <li>Mã sẽ hết hạn sau thời gian quy định</li>
                      <li>Liên hệ hotline nếu gặp vấn đề</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="primary"
                onClick={() => setShowCodeInfoModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg"
              >
                <span className="mr-1">✅</span>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Home;
