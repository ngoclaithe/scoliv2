import React, { useState, useCallback } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import ScoreDisplay from "../scoreboard/ScoreDisplay";
import PosterManager from "../poster/PosterManager";
import TeamLineupModal from "../lineup/TeamLineupModal";
import Modal from "../common/Modal";
import SimplePenaltyModal from "../common/SimplePenaltyModal";

const MatchManagementSection = () => {
  // State cho match data
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

  // State cho custom time và cài đặt chữ chạy nâng cao
  const [customTime, setCustomTime] = useState("");
  const [tickerColor, setTickerColor] = useState("#ffffff");
  const [tickerFontSize, setTickerFontSize] = useState(16);

  // State cho số lỗi futsal
  const [futsalErrors, setFutsalErrors] = useState(0);

  // State cho thống kê bóng đá cho cả 2 đội
  const [matchStats, setMatchStats] = useState({
    possession: { team1: 45, team2: 55 }, // Kiểm soát bóng (%)
    totalShots: { team1: 8, team2: 12 }, // Tổng số cú sút
    shotsOnTarget: { team1: 3, team2: 5 }, // Sút trúng đích
    corners: { team1: 2, team2: 6 }, // Phạt góc
    yellowCards: { team1: 1, team2: 3 }, // Thẻ vàng
    fouls: { team1: 7, team2: 9 }, // Phạm lỗi
  });

  // State cho chế độ chỉnh sửa thống kê
  const [isEditingStats, setIsEditingStats] = useState(false);

  // Skin data configuration
  const skinData = {
    1: { name: "Template 1", image: "/images/templates/skin1.png" },
    2: { name: "Template 2", image: "/images/templates/skin2.png" },
    3: { name: "Template 3", image: "/images/templates/skin3.png" },
    4: { name: "Template 4", image: "/images/templates/skin4.png" },
    5: { name: "Template 5", image: "/images/templates/skin5.png" }
  };

  // State cho modals
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);

  // State cho penalty shootout
  const [penaltyData, setPenaltyData] = useState({
    homeGoals: 0,
    awayGoals: 0,
    currentTurn: 'home',
    shootHistory: [],
    status: 'ready',
    lastUpdated: null
  });

  // Memoized callback to prevent infinite loops
  const handlePenaltyChange = useCallback((newPenaltyData) => {
    setPenaltyData(newPenaltyData);
    setSelectedOption("penalty");
  }, []);

  const handleScoreChange = (team, increment) => {
    setMatchData((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        score: Math.max(0, prev[team].score + increment),
      },
    }));
  };

  // Hàm cập nhật thống kê
  const updateStat = (statKey, team, value) => {
    setMatchStats(prev => ({
      ...prev,
      [statKey]: {
        ...prev[statKey],
        [team]: Math.max(0, parseInt(value) || 0)
      }
    }));
  };

  // Hàm cập nhật kiểm soát bóng (đảm bảo tổng = 100%)
  const updatePossession = (team, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    const otherTeam = team === 'team1' ? 'team2' : 'team1';
    const otherValue = 100 - newValue;

    setMatchStats(prev => ({
      ...prev,
      possession: {
        [team]: newValue,
        [otherTeam]: otherValue
      }
    }));
  };

  // Component để hiển thị/chỉnh sửa thống kê
  const EditableStatBar = ({ label, statKey, team1Value, team2Value, isPercentage = false, onUpdate }) => {
    if (!isEditingStats) {
      // Chế độ hiển thị
      return (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">{team1Value}{isPercentage ? '%' : ''}</span>
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-semibold">{team2Value}{isPercentage ? '%' : ''}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-red-500"
                style={{
                  width: isPercentage
                    ? `${team1Value}%`
                    : `${team1Value === 0 && team2Value === 0 ? 50 : (team1Value / (team1Value + team2Value)) * 100}%`
                }}
              ></div>
              <div
                className="bg-gray-800"
                style={{
                  width: isPercentage
                    ? `${team2Value}%`
                    : `${team1Value === 0 && team2Value === 0 ? 50 : (team2Value / (team1Value + team2Value)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    // Chế độ chỉnh sửa
    return (
      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
        <div className="text-center">
          <span className="font-medium text-gray-700 text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs text-red-600 font-medium mb-1">Đội nhà</label>
            <input
              type="number"
              min="0"
              max={isPercentage ? "100" : "99"}
              value={team1Value}
              onChange={(e) => onUpdate('team1', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-red-500 focus:outline-none text-center"
            />
          </div>
          <div className="text-gray-400 text-sm">vs</div>
          <div className="flex-1">
            <label className="block text-xs text-gray-800 font-medium mb-1">Đội khách</label>
            <input
              type="number"
              min="0"
              max={isPercentage ? "100" : "99"}
              value={team2Value}
              onChange={(e) => onUpdate('team2', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-gray-700 focus:outline-none text-center"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
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
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="space-y-4">
            {/* Header với nút chỉnh sửa */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">📊 Thông số trận đấu</h3>
              <Button
                variant={isEditingStats ? "primary" : "outline"}
                size="sm"
                onClick={() => setIsEditingStats(!isEditingStats)}
                className="flex items-center space-x-1"
              >
                <span>{isEditingStats ? "💾" : "✏️"}</span>
                <span className="text-xs">{isEditingStats ? "Lưu" : "Sửa"}</span>
              </Button>
            </div>

            {/* Stats Display */}
            <div className="space-y-3">
              {/* Kiểm soát bóng */}
              <EditableStatBar
                label="Kiểm soát bóng"
                statKey="possession"
                team1Value={matchStats.possession.team1}
                team2Value={matchStats.possession.team2}
                isPercentage={true}
                onUpdate={(team, value) => updatePossession(team, value)}
              />

              {/* Tổng số cú sút */}
              <EditableStatBar
                label="Tổng số cú sút"
                statKey="totalShots"
                team1Value={matchStats.totalShots.team1}
                team2Value={matchStats.totalShots.team2}
                onUpdate={(team, value) => updateStat('totalShots', team, value)}
              />

              {/* Sút trúng đích */}
              <EditableStatBar
                label="Sút trúng đích"
                statKey="shotsOnTarget"
                team1Value={matchStats.shotsOnTarget.team1}
                team2Value={matchStats.shotsOnTarget.team2}
                onUpdate={(team, value) => updateStat('shotsOnTarget', team, value)}
              />

              {/* Phạt góc */}
              <EditableStatBar
                label="Phạt góc"
                statKey="corners"
                team1Value={matchStats.corners.team1}
                team2Value={matchStats.corners.team2}
                onUpdate={(team, value) => updateStat('corners', team, value)}
              />

              {/* Thẻ vàng */}
              <EditableStatBar
                label="Thẻ vàng"
                statKey="yellowCards"
                team1Value={matchStats.yellowCards.team1}
                team2Value={matchStats.yellowCards.team2}
                onUpdate={(team, value) => updateStat('yellowCards', team, value)}
              />

              {/* Phạm lỗi */}
              <EditableStatBar
                label="Phạm lỗi"
                statKey="fouls"
                team1Value={matchStats.fouls.team1}
                team2Value={matchStats.fouls.team2}
                onUpdate={(team, value) => updateStat('fouls', team, value)}
              />


            </div>

            {/* Control buttons */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  setMatchStats({
                    possession: { team1: 50, team2: 50 },
                    totalShots: { team1: 0, team2: 0 },
                    shotsOnTarget: { team1: 0, team2: 0 },
                    corners: { team1: 0, team2: 0 },
                    yellowCards: { team1: 0, team2: 0 },
                    fouls: { team1: 0, team2: 0 },
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-1">🔄</span>
                ĐẶT LẠI TẤT CẢ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Options - Các action buttons điều khiển */}
      {selectedOption !== "chon-skin" && selectedOption !== "thong-so" && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
            {/* Poster */}
            <button
              onClick={() => setShowPosterModal(true)}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🎨</span>
              <span className="text-xs font-bold text-center">POSTER</span>
            </button>

            {/* Danh sách */}
            <button
              onClick={() => {
                setSelectedOption("danh-sach");
                setShowLineupModal(true);
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">📋</span>
              <span className="text-xs font-bold text-center">DANH SÁCH</span>
            </button>

            {/* Penalty */}
            <button
              onClick={() => setShowPenaltyModal(true)}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🥅</span>
              <span className="text-xs font-bold text-center">PENALTY</span>
            </button>

            {/* Timer Modal */}
            <button
              onClick={() => setShowTimerModal(true)}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-700 hover:from-teal-200 hover:to-cyan-300"
            >
              <span className="text-sm mr-1">🕰️</span>
              <span className="text-xs font-bold text-center">ĐẾM T</span>
            </button>
          </div>
        </div>
      )}

      {/* Clock Settings */}
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

          {/* Text content */}
          <Input
            placeholder="Nội dung chữ chạy..."
            value={clockText}
            onChange={(e) => setClockText(e.target.value)}
            maxLength={100}
            className="w-full text-xs"
          />

          {/* Color and Font Size */}
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

          {/* Apply Button */}
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

      {/* Modals */}
      <Modal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        title="🎨 Quản Lý Poster & Logo"
        size="full"
      >
        <PosterManager
          matchData={matchData}
          onPosterUpdate={(poster) => console.log("Updated poster:", poster)}
          onLogoUpdate={(logoData) => console.log("Updated logo:", logoData)}
        />
      </Modal>

      <TeamLineupModal
        isOpen={showLineupModal}
        onClose={() => setShowLineupModal(false)}
        onSave={(lineupData) => {
          console.log("Saved lineup data:", lineupData);
          setShowLineupModal(false);
        }}
        matchData={matchData}
      />

      <SimplePenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        matchData={matchData}
        penaltyData={penaltyData}
        onPenaltyChange={handlePenaltyChange}
      />

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
            <span className="text-sm font-medium text-yellow-800">phút</span>
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
    </div>
  );
};

export default MatchManagementSection;
