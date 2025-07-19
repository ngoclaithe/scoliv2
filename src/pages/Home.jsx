import React, { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import ScoreDisplay from "../components/scoreboard/ScoreDisplay";

const Home = () => {
  const [activeTab, setActiveTab] = useState("upload-logo");
  const [matchCode, setMatchCode] = useState("");
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(false);
      }, 1000);
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
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6 mb-6">
            <p className="text-center text-sm mb-2">
              <strong>Code được lấy lúc:</strong> 16:13:11 19/7/2025
            </p>
            <p className="text-center text-red-600 font-bold mb-2">
              CODE CHƯA TRUY CẬP
            </p>
            <p className="text-center text-sm mb-2">
              Code sẽ hết hạn nếu không sử dụng sau 15 ngày
            </p>
            <p className="text-center text-sm">
              <strong>Có thể là lúc:</strong> 16:13:11 3/8/2025
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square border-2 border-gray-300 rounded"
              ></div>
            ))}
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Nhập code..."
              value={matchCode}
              onChange={(e) => setMatchCode(e.target.value)}
              className="text-center text-lg"
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
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Scoreboard */}
        <div className="bg-gray-800 rounded-lg p-4">
          <ScoreDisplay
            homeTeam={matchData.homeTeam}
            awayTeam={matchData.awayTeam}
            matchTime={matchData.matchTime}
            period={matchData.period}
            status={matchData.status}
            backgroundColor="bg-gray-800"
            size="md"
          />

          <div className="text-center mt-4">
            <h3 className="text-white text-lg font-bold">
              MÀN HÌNH GIỚI THIỆU
            </h3>
          </div>
        </div>

        {/* Score Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => handleScoreChange("homeTeam", 1)}
            >
              TĂNG
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => handleScoreChange("homeTeam", -1)}
            >
              GIẢM
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => handleScoreChange("awayTeam", 1)}
            >
              TĂNG
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => handleScoreChange("awayTeam", -1)}
            >
              GIẢM
            </Button>
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
