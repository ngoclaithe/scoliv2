import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const MatchManager = ({
  match,
  onMatchUpdate,
  onMatchSave,
  onMatchReset,
  className = "",
}) => {
  const [matchData, setMatchData] = useState({
    homeTeam: { name: "Đội nhà", score: 0, logo: null },
    awayTeam: { name: "Đội khách", score: 0, logo: null },
    matchTime: "00:00",
    period: "Hiệp 1",
    status: "pending", // pending, live, pause, ended
    league: "V-League 2024",
    stadium: "Sân vận động Quốc gia Mỹ Đình",
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    referee: "",
    weather: "Nắng",
    temperature: "28°C",
    attendance: "",
    // Thêm cài đặt hiển thị
    displayOptions: {
      countdownType: "normal", // normal, count40, count45, countCustom
      customTime: "", // cho đếm t
    },
    // Thêm cài đặt chữ chạy
    tickerSettings: {
      text: "Chào mừng đến với trận đấu!",
      color: "#ffffff",
      fontSize: 16,
      enabled: true,
    },
    ...match,
  });

  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [showTickerSettings, setShowTickerSettings] = useState(false);

  const periods = [
    "Hiệp 1",
    "Hiệp 2",
    "Hiệp phụ 1",
    "Hiệp phụ2",
    "Loạt sút luân lưu",
    "Kết thúc",
  ];

  const statuses = [
    { id: "pending", name: "Chưa bắt đầu", color: "gray", icon: "⏳" },
    { id: "live", name: "Đang diễn ra", color: "green", icon: "🔴" },
    { id: "pause", name: "Tạm dừng", color: "yellow", icon: "⏸️" },
    { id: "halftime", name: "Giải lao", color: "blue", icon: "☕" },
    { id: "ended", name: "Kết thúc", color: "red", icon: "🏁" },
  ];



  const handleChange = (field, value) => {
    const newData = { ...matchData, [field]: value };
    setMatchData(newData);
    onMatchUpdate?.(newData);
  };

  const handleDisplayOptionChange = (field, value) => {
    const newData = {
      ...matchData,
      displayOptions: {
        ...matchData.displayOptions,
        [field]: value,
      },
    };
    setMatchData(newData);
    onMatchUpdate?.(newData);
  };

  const handleTickerSettingChange = (field, value) => {
    const newData = {
      ...matchData,
      tickerSettings: {
        ...matchData.tickerSettings,
        [field]: value,
      },
    };
    setMatchData(newData);
    onMatchUpdate?.(newData);
  };

  const handleTeamChange = (team, field, value) => {
    const newData = {
      ...matchData,
      [team]: {
        ...matchData[team],
        [field]: value,
      },
    };
    setMatchData(newData);
    onMatchUpdate?.(newData);
  };

  const handleScoreChange = (team, increment) => {
    const currentScore = matchData[team].score;
    const newScore = Math.max(0, currentScore + increment);
    handleTeamChange(team, "score", newScore);
  };

  const handleStatusChange = (status) => {
    handleChange("status", status);
  };

  const handleSave = () => {
    onMatchSave?.(matchData);
  };

  const handleReset = () => {
    const resetData = {
      homeTeam: { name: "Đội nhà", score: 0, logo: null },
      awayTeam: { name: "Đội khách", score: 0, logo: null },
      matchTime: "00:00",
      period: "Hiệp 1",
      status: "pending",
      league: "V-League 2024",
      stadium: "Sân vận động Quốc gia Mỹ Đình",
      date: new Date().toISOString().split("T")[0],
      time: "19:00",
      referee: "",
      weather: "Nắng",
      temperature: "28°C",
      attendance: "",
      displayOptions: {
        countdownType: "normal",
        customTime: "",
      },
      tickerSettings: {
        text: "Chào mừng đến với trận đấu!",
        color: "#ffffff",
        fontSize: 16,
        enabled: true,
      },
    };
    setMatchData(resetData);
    onMatchReset?.(resetData);
  };

  const formatTime = (timeString) => {
    // Convert seconds to MM:SS format
    if (typeof timeString === "number") {
      const minutes = Math.floor(timeString / 60);
      const seconds = timeString % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return timeString;
  };

  const getCurrentStatus = () => {
    return statuses.find((s) => s.id === matchData.status) || statuses[0];
  };

  return (
    <>
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Quản lý trận đấu
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Cập nhật thông tin và tỉ số trận đấu trực tiếp
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleSave}>
                Lưu thay đổi
              </Button>
            </div>
          </div>

          {/* Match Status */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusChange(status.id)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      matchData.status === status.id
                        ? `bg-${status.color}-100 text-${status.color}-800 border border-${status.color}-300`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <span className="mr-1">{status.icon}</span>
                  {status.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Match Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Home Team */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 text-center">
                Đội nhà
              </h4>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center border">
                  {matchData.homeTeam.logo ? (
                    <img
                      src={matchData.homeTeam.logo}
                      alt="Home"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold">
                      {matchData.homeTeam.name.charAt(0)}
                    </span>
                  )}
                </div>

                <Input
                  value={matchData.homeTeam.name}
                  onChange={(e) =>
                    handleTeamChange("homeTeam", "name", e.target.value)
                  }
                  className="text-center font-semibold"
                />

                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange("homeTeam", -1)}
                    disabled={matchData.homeTeam.score === 0}
                  >
                    -
                  </Button>
                  <span className="text-3xl font-bold text-primary-600 min-w-12 text-center">
                    {matchData.homeTeam.score}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange("homeTeam", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Match Info Center */}
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="text-center space-y-3">
                <div className="text-sm text-primary-600 font-medium">
                  {formatTime(matchData.matchTime)}
                </div>

                <select
                  value={matchData.period}
                  onChange={(e) => handleChange("period", e.target.value)}
                  className="w-full text-center bg-white border border-primary-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>

                <div className="text-center">
                  <div
                    className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${
                      getCurrentStatus().color === "green"
                        ? "bg-green-100 text-green-800"
                        : getCurrentStatus().color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : getCurrentStatus().color === "red"
                            ? "bg-red-100 text-red-800"
                            : getCurrentStatus().color === "blue"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                    }
                  `}
                  >
                    <span className="mr-1">{getCurrentStatus().icon}</span>
                    {getCurrentStatus().name}
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  <div>{matchData.league}</div>
                  <div>
                    {matchData.date} • {matchData.time}
                  </div>
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 text-center">
                Đội khách
              </h4>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center border">
                  {matchData.awayTeam.logo ? (
                    <img
                      src={matchData.awayTeam.logo}
                      alt="Away"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold">
                      {matchData.awayTeam.name.charAt(0)}
                    </span>
                  )}
                </div>

                <Input
                  value={matchData.awayTeam.name}
                  onChange={(e) =>
                    handleTeamChange("awayTeam", "name", e.target.value)
                  }
                  className="text-center font-semibold"
                />

                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange("awayTeam", -1)}
                    disabled={matchData.awayTeam.score === 0}
                  >
                    -
                  </Button>
                  <span className="text-3xl font-bold text-primary-600 min-w-12 text-center">
                    {matchData.awayTeam.score}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange("awayTeam", 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatusChange("live")}
              disabled={matchData.status === "live"}
            >
              Bắt đầu trận đấu
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleStatusChange("pause")}
              disabled={matchData.status !== "live"}
            >
              Tạm dừng
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("halftime")}
            >
              Giải lao
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleStatusChange("ended")}
            >
              Kết thúc
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Đặt lại
            </Button>
          </div>

          {/* Display Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
                Tùy chọn hiển thị
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisplaySettings(!showDisplaySettings)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={showDisplaySettings ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                }
              >
                {showDisplaySettings ? "Thu gọn" : "Mở rộng"}
              </Button>
            </div>

            {showDisplaySettings && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Loại đếm ngược
                  </label>
                  <select
                    value={matchData.displayOptions.countdownType}
                    onChange={(e) => handleDisplayOptionChange("countdownType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="count40">Đếm 40</option>
                    <option value="count45">Đếm 45</option>
                    <option value="countCustom">Đếm T</option>
                  </select>
                </div>

                {matchData.displayOptions.countdownType === "countCustom" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Thời gian tùy chỉnh (phút)
                    </label>
                    <Input
                      type="number"
                      value={matchData.displayOptions.customTime}
                      onChange={(e) => handleDisplayOptionChange("customTime", e.target.value)}
                      placeholder="Nhập thời gian"
                      className="text-sm"
                    />
                  </div>
                )}

                <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 w-full">
                    <strong>Loại đếm hiện tại:</strong>
                    <span className="ml-2">
                      {matchData.displayOptions.countdownType === "normal" && "Bình thường"}
                      {matchData.displayOptions.countdownType === "count40" && "Đếm 40 phút"}
                      {matchData.displayOptions.countdownType === "count45" && "Đếm 45 phút"}
                      {matchData.displayOptions.countdownType === "countCustom" &&
                        `Đếm ${matchData.displayOptions.customTime || "?"} phút`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ticker Settings */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
                Cài đặt chữ chạy
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTickerSettings(!showTickerSettings)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={showTickerSettings ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                }
              >
                {showTickerSettings ? "Thu gọn" : "Mở rộng"}
              </Button>
            </div>

            {showTickerSettings && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nội dung chữ chạy
                    </label>
                    <textarea
                      value={matchData.tickerSettings.text}
                      onChange={(e) => handleTickerSettingChange("text", e.target.value)}
                      placeholder="Nhập nội dung chữ chạy..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Màu chữ
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={matchData.tickerSettings.color}
                            onChange={(e) => handleTickerSettingChange("color", e.target.value)}
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={matchData.tickerSettings.color}
                            onChange={(e) => handleTickerSettingChange("color", e.target.value)}
                            className="text-sm flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Kích thước chữ (px)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="range"
                            min="12"
                            max="32"
                            value={matchData.tickerSettings.fontSize}
                            onChange={(e) => handleTickerSettingChange("fontSize", parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium min-w-8 text-center">
                            {matchData.tickerSettings.fontSize}px
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ticker-enabled"
                        checked={matchData.tickerSettings.enabled}
                        onChange={(e) => handleTickerSettingChange("enabled", e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="ticker-enabled" className="text-sm font-medium text-gray-700">
                        Hiển thị chữ chạy
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-900 rounded-lg p-4 overflow-hidden relative">
                  <div className="text-xs text-gray-400 mb-2">Xem trước chữ chạy:</div>
                  <div className="h-8 flex items-center overflow-hidden">
                    <div
                      className="animate-pulse whitespace-nowrap"
                      style={{
                        color: matchData.tickerSettings.color,
                        fontSize: `${matchData.tickerSettings.fontSize}px`,
                        opacity: matchData.tickerSettings.enabled ? 1 : 0.3,
                      }}
                    >
                      {matchData.tickerSettings.text || "Chào mừng đến với trận đấu!"}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  >
                    Áp dụng cài đặt
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Match Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-500">Sân vận động</div>
                <div className="font-medium">{matchData.stadium}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Thời tiết</div>
                <div className="font-medium">
                  {matchData.weather} • {matchData.temperature}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Trọng tài</div>
                <div className="font-medium">
                  {matchData.referee || "Chưa cập nhật"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Khán giả</div>
                <div className="font-medium">
                  {matchData.attendance || "Chưa cập nhật"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal sẽ được implement riêng */}
    </>
  );
};

export default MatchManager;
