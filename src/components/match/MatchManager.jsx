import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

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
    ...match,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState(null);

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

  const leagues = [
    "V-League 2024",
    "Hạng Nhất 2024",
    "Cúp Quốc gia 2024",
    "AFC Champions League",
    "AFF Cup",
    "World Cup 2026",
    "Giao hữu quốc tế",
    "Giải tự tổ chức",
  ];

  const weatherOptions = [
    "☀️ Nắng",
    "⛅ Nhiều mây",
    "🌧️ Mưa",
    "⛈️ Dông",
    "🌫️ Sương mù",
    "❄️ Tuyết",
  ];

  const handleChange = (field, value) => {
    const newData = { ...matchData, [field]: value };
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
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                }
              >
                Chỉnh sửa
              </Button>
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
