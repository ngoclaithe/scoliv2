import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { getFullLogoUrl } from "../../utils/logoUtils";

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
      <div className={`w-full max-w-4xl mx-auto px-2 sm:px-0 ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
            {/* Home Team */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 text-center">
                Đội nhà
              </h4>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center border">
                  {matchData.homeTeam.logo ? (
                    <img
                      src={getFullLogoUrl(matchData.homeTeam.logo)}
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
                      src={getFullLogoUrl(matchData.awayTeam.logo)}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 lg:gap-3 lg:justify-center">
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
              <div className="mb-2 sm:mb-0">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  📊 Tùy chọn hiển thị
                </h4>
                <p className="text-sm text-gray-600">Chọn cách hiển thị thời gian trận đấu</p>
              </div>
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
              <div className="space-y-4 mb-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Chọn loại đếm ngược
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { value: "normal", label: "Bình thường", icon: "⏱️" },
                        { value: "count40", label: "Đếm 40", icon: "4️⃣0️⃣" },
                        { value: "count45", label: "Đếm 45", icon: "4️⃣5️⃣" },
                        { value: "countCustom", label: "Đếm T", icon: "🕰️" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleDisplayOptionChange("countdownType", option.value)}
                          className={`
                            p-3 rounded-lg border-2 text-center transition-all
                            ${
                              matchData.displayOptions.countdownType === option.value
                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="text-lg mb-1">{option.icon}</div>
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {matchData.displayOptions.countdownType === "countCustom" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <label className="block text-sm font-medium text-yellow-800 mb-2">
                        🕰️ Thời gian tùy chỉnh (phút)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        value={matchData.displayOptions.customTime}
                        onChange={(e) => handleDisplayOptionChange("customTime", e.target.value)}
                        placeholder="Nhập số phút (ví dụ: 30)"
                        className="text-sm border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <div className="text-xs text-yellow-700 mt-1">
                        Thời gian đếm ngược sẽ bắt đầu từ {matchData.displayOptions.customTime || "?"} phút về 0
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-primary-800">
                      Chế độ hiện tại:
                    </span>
                    <span className="text-sm font-bold text-primary-700">
                      {matchData.displayOptions.countdownType === "normal" && "⏱️ Bình thường"}
                      {matchData.displayOptions.countdownType === "count40" && "4️⃣0️⃣ Đếm 40 phút"}
                      {matchData.displayOptions.countdownType === "count45" && "4️⃣5️⃣ Đếm 45 phút"}
                      {matchData.displayOptions.countdownType === "countCustom" &&
                        `🕰️ Đếm ${matchData.displayOptions.customTime || "?"} phút`}
                    </span>
                  </div>
                  <div className="text-xs text-primary-600 mt-1">
                    {matchData.displayOptions.countdownType === "normal" && "Thời gian trận đấu sẽ đếm tiến"}
                    {matchData.displayOptions.countdownType === "count40" && "Thời gian sẽ đếm ngược từ 40:00 về 00:00"}
                    {matchData.displayOptions.countdownType === "count45" && "Thời gian sẽ đếm ngược từ 45:00 về 00:00"}
                    {matchData.displayOptions.countdownType === "countCustom" &&
                      `Thời gian sẽ đếm ngược từ ${matchData.displayOptions.customTime || "?"}:00 về 00:00`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ticker Settings */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="mb-2 sm:mb-0">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  📺 Cài đặt chữ chạy
                </h4>
                <p className="text-sm text-gray-600">Tùy chỉnh văn bản chạy trên màn hình</p>
              </div>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      📝 Nội dung chữ chạy
                    </label>
                    <div className="relative">
                      <textarea
                        value={matchData.tickerSettings.text}
                        onChange={(e) => handleTickerSettingChange("text", e.target.value)}
                        placeholder="Nhập nội dung chữ chạy (ví dụ: Chào mừng các bạn đến với trận đấu hôm nay!)"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                        maxLength={200}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {matchData.tickerSettings.text.length}/200
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {[
                        "Chào mừng đến với trận đấu!",
                        "Hãy cổ vũ cho đội bóng yêu thích!",
                        "Trận đấu hấp dẫn đang diễn ra!",
                        "Cảm ơn quý khán giả đã theo dõi!"
                      ].map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleTickerSettingChange("text", template)}
                          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        🎨 Màu chữ
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={matchData.tickerSettings.color}
                            onChange={(e) => handleTickerSettingChange("color", e.target.value)}
                            className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={matchData.tickerSettings.color}
                            onChange={(e) => handleTickerSettingChange("color", e.target.value)}
                            className="text-sm flex-1 uppercase"
                            placeholder="#ffffff"
                          />
                        </div>
                        <div className="flex gap-1">
                          {["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00"].map((color) => (
                            <button
                              key={color}
                              onClick={() => handleTickerSettingChange("color", color)}
                              className={`w-6 h-6 rounded border-2 ${
                                matchData.tickerSettings.color === color ? "border-gray-800" : "border-gray-300"
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        🔤 Kích thước chữ
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-500">12px</span>
                          <input
                            type="range"
                            min="12"
                            max="40"
                            value={matchData.tickerSettings.fontSize}
                            onChange={(e) => handleTickerSettingChange("fontSize", parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((matchData.tickerSettings.fontSize - 12) / 28) * 100}%, #e5e7eb ${((matchData.tickerSettings.fontSize - 12) / 28) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                          <span className="text-xs text-gray-500">40px</span>
                        </div>
                        <div className="text-center">
                          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                            {matchData.tickerSettings.fontSize}px
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ticker-enabled"
                          checked={matchData.tickerSettings.enabled}
                          onChange={(e) => handleTickerSettingChange("enabled", e.target.checked)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                        />
                      </div>
                      <label htmlFor="ticker-enabled" className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                        <span>🟢</span>
                        <span>Hiển thị chữ chạy</span>
                      </label>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      matchData.tickerSettings.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {matchData.tickerSettings.enabled ? "Bật" : "Tắt"}
                    </div>
                  </div>
                </div>

                {/* Enhanced Preview */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 overflow-hidden relative border-2 border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-gray-400 flex items-center space-x-1">
                      <span>👁️</span>
                      <span>Xem trước chữ chạy:</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">LIVE</span>
                    </div>
                  </div>
                  <div className="h-10 flex items-center overflow-hidden bg-black rounded border">
                    <div
                      className={`whitespace-nowrap transition-all duration-300 ${
                        matchData.tickerSettings.enabled ? "animate-bounce" : ""
                      }`}
                      style={{
                        color: matchData.tickerSettings.color,
                        fontSize: `${matchData.tickerSettings.fontSize}px`,
                        opacity: matchData.tickerSettings.enabled ? 1 : 0.3,
                        paddingLeft: "10px",
                      }}
                    >
                      {matchData.tickerSettings.text || "Chào mừng đến với trận đấu!"}
                    </div>
                  </div>
                  {!matchData.tickerSettings.enabled && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                      <span className="text-gray-400 text-sm font-medium">⏸️ Chữ chạy đã tắt</span>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <span>ℹ️</span>
                    <span>Thay đổi sẽ được áp dụng ngay lập tức</span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    className="w-full sm:w-auto"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  >
                    💾 Áp dụng cài đặt
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Match Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-sm">
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
                <div className="text-gray-500">Tr���ng tài</div>
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
    </>
  );
};

export default MatchManager;
