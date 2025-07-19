import React, { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ScoreDisplay from "../components/scoreboard/ScoreDisplay";

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
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Đội nhà */}
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => handleLogoUpload("home")}
          >
            CHỌN LOGO
          </Button>

          {homeTeamLogo && (
            <div className="flex justify-center">
              <img
                src={homeTeamLogo}
                alt="Home team logo"
                className="w-20 h-20 object-contain"
              />
            </div>
          )}

          <Input
            placeholder="TÊN ĐỘI"
            value={homeTeamName}
            onChange={(e) => setHomeTeamName(e.target.value)}
            className="text-center"
          />

          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            TẢI LÊN
          </Button>
        </div>

        {/* Đội khách */}
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => handleLogoUpload("away")}
          >
            CHỌN LOGO
          </Button>

          {awayTeamLogo && (
            <div className="flex justify-center">
              <img
                src={awayTeamLogo}
                alt="Away team logo"
                className="w-20 h-20 object-contain"
              />
            </div>
          )}

          <Input
            placeholder="TÊN ĐỘI"
            value={awayTeamName}
            onChange={(e) => setAwayTeamName(e.target.value)}
            className="text-center"
          />

          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            TẢI LÊN
          </Button>
        </div>
      </div>

      {/* Tìm kiếm logo */}
      <div className="mt-8">
        <Input
          placeholder="Tìm theo tên đội hoặc mã logo..."
          value={logoSearch}
          onChange={(e) => setLogoSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Hướng dẫn */}
      <div className="mt-8 text-center">
        <Button
          variant="secondary"
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white px-8"
        >
          HƯỚNG DẪN - HỖ TRỢ
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
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedOption("dieu-khien")}
            className={`py-3 px-4 rounded-lg font-medium ${
              selectedOption === "dieu-khien"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            ĐIỀU KHIỂN
          </button>
          <button
            onClick={() => setSelectedOption("chon-skin")}
            className={`py-3 px-4 rounded-lg font-medium ${
              selectedOption === "chon-skin"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            CHỌN SKIN
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
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
        <div className="space-y-4">
          <h3 className="font-bold text-center">CÀI ĐẶT CHỮ CHẠY:</h3>

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

        {/* Apply Button */}
        <div className="text-center">
          <Button variant="primary" size="lg" className="px-16">
            ÁP DỤNG
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚽</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Football Livestream Tool
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? tab.id === "upload-logo"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
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
