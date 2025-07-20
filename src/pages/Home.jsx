import React, { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ScoreDisplay from "../components/scoreboard/ScoreDisplay";
import PosterManager from "../components/poster/PosterManager";
import Modal from "../components/common/Modal";

const Home = () => {
  const [activeTab, setActiveTab] = useState("upload-logo");
  const [matchCode, setMatchCode] = useState("");
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeInfo, setCodeInfo] = useState(null);

  // State cho upload logo
  const [homeTeamLogo, setHomeTeamLogo] = useState(null);
  const [awayTeamLogo, setAwayTeamLogo] = useState(null);
  const [homeTeamName, setHomeTeamName] = useState("");
  const [awayTeamName, setAwayTeamName] = useState("");
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

  // State cho modal poster
  const [showPosterModal, setShowPosterModal] = useState(false);

  const tabs = [
    { id: "upload-logo", name: "UP LOGO" },
    { id: "quan-ly-tran", name: "QUẢN LÝ TRẬN" },
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
          status: "active", // active, inactive, expired
          accessCount: 0,
          maxAccess: 100,
          expiryDays: 15,
          expiryDate: "16:13:11 3/8/2025",
          lastUsed: null,
        });
        setIsLoading(false);
      }, 1000);
    } else {
      alert("Code không đúng. Vui lòng thử lại!");
    }
  };

  const handleLogoUpload = (teamType) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (teamType === "home") {
            setHomeTeamLogo(e.target.result);
          } else {
            setAwayTeamLogo(e.target.result);
          }
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
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <span className="mr-3">🏆</span>
          QUẢN LÝ LOGO ĐỘI BÓNG
          <span className="ml-3">🏆</span>
        </h2>
        <p className="text-gray-600">
          Tải lên và quản lý logo cho các đội bóng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Đội nhà */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
          <h3 className="text-center text-lg font-bold text-blue-700 mb-6 flex items-center justify-center">
            <span className="mr-2">🏠</span>
            ĐỘI NHÀ
          </h3>

          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => handleLogoUpload("home")}
            >
              <span className="mr-2">📁</span>
              CHỌN LOGO
            </Button>

            {homeTeamLogo ? (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300">
                  <img
                    src={homeTeamLogo}
                    alt="Home team logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-28 h-28 bg-white border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-sm">Chưa có logo</span>
                </div>
              </div>
            )}

            <Input
              placeholder="TÊN ĐỘI NHÀ"
              value={homeTeamName}
              onChange={(e) => setHomeTeamName(e.target.value)}
              className="text-center font-semibold"
            />

            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="mr-2">⬆️</span>
              TẢI LÊN
            </Button>
          </div>
        </div>

        {/* Đội khách */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
          <h3 className="text-center text-lg font-bold text-purple-700 mb-6 flex items-center justify-center">
            <span className="mr-2">✈️</span>
            ĐỘI KHÁCH
          </h3>

          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => handleLogoUpload("away")}
            >
              <span className="mr-2">📁</span>
              CHỌN LOGO
            </Button>

            {awayTeamLogo ? (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-300">
                  <img
                    src={awayTeamLogo}
                    alt="Away team logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-28 h-28 bg-white border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400 text-sm">Chưa có logo</span>
                </div>
              </div>
            )}

            <Input
              placeholder="TÊN ĐỘI KHÁCH"
              value={awayTeamName}
              onChange={(e) => setAwayTeamName(e.target.value)}
              className="text-center font-semibold"
            />

            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="mr-2">⬆️</span>
              TẢI LÊN
            </Button>
          </div>
        </div>
      </div>

      {/* Tìm kiếm logo */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-center text-lg font-bold text-green-700 mb-4 flex items-center justify-center">
          <span className="mr-2">🔍</span>
          TÌM KIẾM LOGO
        </h3>
        <Input
          placeholder="Tìm theo tên đội hoặc mã logo..."
          value={logoSearch}
          onChange={(e) => setLogoSearch(e.target.value)}
          className="w-full text-center"
        />
      </div>

      {/* Hướng dẫn */}
      <div className="text-center">
        <Button
          variant="secondary"
          size="lg"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-12 py-4 font-bold text-lg rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
        >
          <span className="mr-3">📚</span>
          HƯỚNG DẪN - HỖ TRỢ
          <span className="ml-3">💬</span>
        </Button>
      </div>
    </div>
  );

  const renderQuanLyTranTab = () => {
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

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCodeSubmit}
              loading={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "XÁC NHẬN"}
            </Button>

            <div className="text-center text-xs text-gray-500">
              Nhập "ffff" để demo
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Code Information */}
        {codeInfo && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin mã truy cập
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã code:</span>
                  <span className="font-mono font-bold">{codeInfo.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Được tạo lúc:</span>
                  <span className="font-medium">{codeInfo.generatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lần truy cập:</span>
                  <span className="font-medium">
                    {codeInfo.accessCount}/{codeInfo.maxAccess}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời hạn sử dụng:</span>
                  <span className="font-medium">
                    {codeInfo.expiryDays} ngày
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hết hạn vào:</span>
                  <span className="font-medium text-orange-600">
                    {codeInfo.expiryDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lần cuối sử dụng:</span>
                  <span className="font-medium">
                    {codeInfo.lastUsed || "Chưa sử dụng"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl p-6 border-4 border-yellow-400 shadow-2xl">
          <ScoreDisplay
            homeTeam={matchData.homeTeam}
            awayTeam={matchData.awayTeam}
            matchTime={matchData.matchTime}
            period={matchData.period}
            status={matchData.status}
            backgroundColor="bg-transparent"
            size="md"
          />

          <div className="text-center mt-6">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              <span className="mr-2">📺</span>
              MÀN HÌNH GIỚI THIỆU
              <span className="ml-2">✨</span>
            </div>
          </div>
        </div>

        {/* Score Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-center text-lg font-bold text-gray-800 mb-6 flex items-center justify-center">
            <span className="mr-2">⚽</span>
            ĐIỀU KHIỂN TỈ SỐ
            <span className="ml-2">⚽</span>
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Đội nhà */}
            <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-200">
              <h4 className="text-center font-bold text-blue-700 mb-4">
                {matchData.homeTeam.name}
              </h4>
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleScoreChange("homeTeam", 1)}
                >
                  <span className="text-xl">+</span>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleScoreChange("homeTeam", -1)}
                >
                  <span className="text-xl">-</span>
                </Button>
              </div>
            </div>

            {/* Đội khách */}
            <div className="bg-white rounded-lg p-4 shadow-md border-2 border-purple-200">
              <h4 className="text-center font-bold text-purple-700 mb-4">
                {matchData.awayTeam.name}
              </h4>
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleScoreChange("awayTeam", 1)}
                >
                  <span className="text-xl">+</span>
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleScoreChange("awayTeam", -1)}
                >
                  <span className="text-xl">-</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedOption("dieu-khien")}
              className={`py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                selectedOption === "dieu-khien"
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-xl"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
            >
              <span className="mr-2">🎮</span>
              ĐIỀU KHIỂN
            </button>
            <button
              onClick={() => setSelectedOption("chon-skin")}
              className={`py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                selectedOption === "chon-skin"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl"
                  : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300"
              }`}
            >
              <span className="mr-2">🎨</span>
              CHỌN SKIN
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
          <h3 className="text-center text-lg font-bold text-indigo-800 mb-6 flex items-center justify-center">
            <span className="mr-2">⚙️</span>
            TÙY CHỌN HIỂN THỊ
            <span className="ml-2">⚙️</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="poster"
                  checked={selectedOption === "poster"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>POSTER</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="ti-so-duoi"
                  checked={selectedOption === "ti-so-duoi"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>TỈ SỐ DƯỚI</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="dem-20"
                  checked={selectedOption === "dem-20"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>ĐẾM 20'</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="dem-35"
                  checked={selectedOption === "dem-35"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>ĐẾM 35'</label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="gioi-thieu"
                  checked={selectedOption === "gioi-thieu"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label className="text-red-500">GIỚI THIỆU</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="dem-0"
                  checked={selectedOption === "dem-0"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>ĐẾM 0'</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="dem-25"
                  checked={selectedOption === "dem-25"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>ĐẾM 25'</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="tat"
                  checked={selectedOption === "tat"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>TẮT</label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="danh-sach"
                  checked={selectedOption === "danh-sach"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>DANH SÁCH</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="nghi-hiep"
                  checked={selectedOption === "nghi-hiep"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>NGHỈ HIỆP</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="dem-30"
                  checked={selectedOption === "dem-30"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>ĐẾM 30'</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="option"
                  value="penalty"
                  checked={selectedOption === "penalty"}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <label>PENALTY</label>
              </div>
            </div>
          </div>
        </div>

        {/* Clock Settings */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <h3 className="font-bold text-center text-lg text-orange-800 mb-6 flex items-center justify-center">
            <span className="mr-2">📰</span>
            CÀI ĐẶT CHỮ CHẠY
            <span className="ml-2">📰</span>
          </h3>

          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="clock"
                value="khong"
                checked={clockSetting === "khong"}
                onChange={(e) => setClockSetting(e.target.value)}
              />
              <label>KHÔNG</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="clock"
                value="lien-tuc"
                checked={clockSetting === "lien-tuc"}
                onChange={(e) => setClockSetting(e.target.value)}
              />
              <label>LIÊN TỤC</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="clock"
                value="moi-2"
                checked={clockSetting === "moi-2"}
                onChange={(e) => setClockSetting(e.target.value)}
              />
              <label>MỖI 2'</label>
            </div>
          </div>

          <Input
            placeholder="Nhập nội dung chữ chạy"
            value={clockText}
            onChange={(e) => setClockText(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Apply Button */}
          <Button
            variant="primary"
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="mr-3">🚀</span>
            ÁP DỤNG
            <span className="ml-3">✨</span>
          </Button>

          {/* Poster Manager Button - Hiển thị khi chọn option POSTER */}
          {selectedOption === "poster" && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowPosterModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-3">🎨</span>
              QUẢN LÝ POSTER
              <span className="ml-3">🖼️</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-xl border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">⚽</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Football Livestream Tool
                  </h1>
                  <p className="text-blue-200 text-sm">
                    Công cụ quản lý trận đấu trực tiếp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 border-b-4 border-gray-300 shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-5 px-8 text-center font-bold text-lg border-b-4 transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? tab.id === "upload-logo"
                    ? "border-blue-500 text-blue-700 bg-gradient-to-t from-blue-100 to-blue-50 shadow-lg"
                    : "border-purple-500 text-purple-700 bg-gradient-to-t from-purple-100 to-purple-50 shadow-lg"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center">
                {tab.id === "upload-logo" ? (
                  <>
                    <span className="mr-2">🏆</span>
                    {tab.name}
                  </>
                ) : (
                  <>
                    <span className="mr-2">⚽</span>
                    {tab.name}
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
        </div>
      </main>
    </div>
  );
};

export default Home;
