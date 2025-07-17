import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const MatchInfo = ({
  match,
  showHeader = true,
  showStats = true,
  showEvents = true,
  layout = "vertical",
  className = "",
}) => {
  const [showFullStats, setShowFullStats] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const mockStats = {
    possession: { home: 58, away: 42 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 8, away: 11 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 1 },
    passes: { home: 324, away: 278 },
    passAccuracy: { home: 87, away: 82 },
  };

  const mockEvents = [
    {
      id: 1,
      time: "15'",
      type: "goal",
      team: "home",
      player: "Nguyễn Văn A",
      description: "Bàn thắng mở tỷ số",
    },
    {
      id: 2,
      time: "23'",
      type: "yellow_card",
      team: "away",
      player: "Trần Văn B",
      description: "Phạm lỗi với đối thủ",
    },
    {
      id: 3,
      time: "35'",
      type: "goal",
      team: "away",
      player: "Lê Văn C",
      description: "Gỡ hòa 1-1",
    },
    {
      id: 4,
      time: "67'",
      type: "substitution",
      team: "home",
      player: "Nguyễn Văn D → Phạm Văn E",
      description: "Thay người",
    },
    {
      id: 5,
      time: "78'",
      type: "goal",
      team: "away",
      player: "Hoàng Văn F",
      description: "Dẫn trước 2-1",
    },
  ];

  const tabs = [
    { id: "overview", name: "Tổng quan", icon: "📊" },
    { id: "events", name: "Sự kiện", icon: "⚽" },
    { id: "stats", name: "Thống kê", icon: "📈" },
    { id: "lineups", name: "Đội hình", icon: "👥" },
  ];

  const getEventIcon = (type) => {
    const icons = {
      goal: "⚽",
      yellow_card: "🟨",
      red_card: "🟥",
      substitution: "🔄",
      corner: "📐",
      freekick: "🦶",
      penalty: "🎯",
      offside: "🚩",
    };
    return icons[type] || "⚪";
  };

  const getEventColor = (type) => {
    const colors = {
      goal: "text-green-600",
      yellow_card: "text-yellow-600",
      red_card: "text-red-600",
      substitution: "text-blue-600",
      corner: "text-purple-600",
      freekick: "text-orange-600",
      penalty: "text-red-700",
      offside: "text-gray-600",
    };
    return colors[type] || "text-gray-600";
  };

  const StatBar = ({ label, homeValue, awayValue, isPercentage = false }) => {
    const total = homeValue + awayValue;
    const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
    const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-blue-600">
            {homeValue}
            {isPercentage ? "%" : ""}
          </span>
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-red-600">
            {awayValue}
            {isPercentage ? "%" : ""}
          </span>
        </div>
        <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 transition-all duration-300"
            style={{ width: `${homePercent}%` }}
          ></div>
          <div
            className="bg-red-500 transition-all duration-300"
            style={{ width: `${awayPercent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="text-center">
        <div className="flex justify-center items-center space-x-6 mb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
              {match.homeTeam.logo ? (
                <img
                  src={match.homeTeam.logo}
                  alt="Home"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-blue-600">
                  {match.homeTeam.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="font-semibold text-sm">{match.homeTeam.name}</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {match.homeTeam.score} - {match.awayTeam.score}
            </div>
            <div className="text-sm text-gray-600">{match.matchTime}</div>
            <div className="text-xs text-gray-500">{match.period}</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
              {match.awayTeam.logo ? (
                <img
                  src={match.awayTeam.logo}
                  alt="Away"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-red-600">
                  {match.awayTeam.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="font-semibold text-sm">{match.awayTeam.name}</div>
          </div>
        </div>

        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            match.status === "live"
              ? "bg-green-100 text-green-800"
              : match.status === "pause"
                ? "bg-yellow-100 text-yellow-800"
                : match.status === "ended"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {match.status === "live"
            ? "🔴 Đang diễn ra"
            : match.status === "pause"
              ? "⏸️ Tạm dừng"
              : match.status === "ended"
                ? "🏁 Kết thúc"
                : "⏳ Chưa bắt đầu"}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockStats.shots.home}
          </div>
          <div className="text-sm text-gray-600">Cú sút</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {mockStats.shots.away}
          </div>
          <div className="text-sm text-gray-600">Cú sút</div>
        </div>
      </div>

      {/* Match Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Giải đấu:</span>
          <span className="font-medium">{match.league}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sân vận động:</span>
          <span className="font-medium">{match.stadium}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ngày giờ:</span>
          <span className="font-medium">
            {match.date} • {match.time}
          </span>
        </div>
        {match.referee && (
          <div className="flex justify-between">
            <span className="text-gray-600">Trọng tài:</span>
            <span className="font-medium">{match.referee}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Thời tiết:</span>
          <span className="font-medium">
            {match.weather} • {match.temperature}
          </span>
        </div>
      </div>
    </div>
  );

  const EventsTab = () => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Diễn biến trận đấu</h4>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-xs font-mono text-gray-600">
                {event.time}
              </div>
            </div>
            <div
              className={`flex-shrink-0 text-lg ${getEventColor(event.type)}`}
            >
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {event.player}
              </div>
              <div className="text-xs text-gray-600">{event.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                {event.team === "home"
                  ? match.homeTeam.name
                  : match.awayTeam.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatsTab = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Thống kê chi tiết</h4>
      <div className="space-y-4">
        <StatBar
          label="Kiểm soát bóng (%)"
          homeValue={mockStats.possession.home}
          awayValue={mockStats.possession.away}
          isPercentage={true}
        />
        <StatBar
          label="Cú sút"
          homeValue={mockStats.shots.home}
          awayValue={mockStats.shots.away}
        />
        <StatBar
          label="Sút trúng đích"
          homeValue={mockStats.shotsOnTarget.home}
          awayValue={mockStats.shotsOnTarget.away}
        />
        <StatBar
          label="Phạt góc"
          homeValue={mockStats.corners.home}
          awayValue={mockStats.corners.away}
        />
        <StatBar
          label="Phạm lỗi"
          homeValue={mockStats.fouls.home}
          awayValue={mockStats.fouls.away}
        />
        <StatBar
          label="Thẻ vàng"
          homeValue={mockStats.yellowCards.home}
          awayValue={mockStats.yellowCards.away}
        />
        <StatBar
          label="Chuyền bóng"
          homeValue={mockStats.passes.home}
          awayValue={mockStats.passes.away}
        />
        <StatBar
          label="Độ chính xác chuyền bóng (%)"
          homeValue={mockStats.passAccuracy.home}
          awayValue={mockStats.passAccuracy.away}
          isPercentage={true}
        />
      </div>
    </div>
  );

  const LineupsTab = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Đội hình xuất phát</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-blue-600 mb-2">
            {match.homeTeam.name}
          </h5>
          <div className="space-y-1 text-sm">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </span>
                <span>Cầu thủ {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-medium text-red-600 mb-2">
            {match.awayTeam.name}
          </h5>
          <div className="space-y-1 text-sm">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </span>
                <span>Cầu thủ {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "events":
        return <EventsTab />;
      case "stats":
        return <StatsTab />;
      case "lineups":
        return <LineupsTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (!match) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="text-gray-500">Chưa có thông tin trận đấu</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full max-w-2xl mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          {showHeader && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin trận đấu
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullStats(true)}
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
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  }
                >
                  Toàn màn hình
                </Button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <TabContent />
          </div>
        </div>
      </div>

      {/* Full Stats Modal */}
      <Modal
        isOpen={showFullStats}
        onClose={() => setShowFullStats(false)}
        title="Thông tin chi tiết trận đấu"
        size="xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <OverviewTab />
          </div>
          <div>
            <StatsTab />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <EventsTab />
        </div>
      </Modal>
    </>
  );
};

export default MatchInfo;
