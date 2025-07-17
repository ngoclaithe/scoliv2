import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const MatchControls = ({
  match,
  onMatchUpdate,
  onTimerStart,
  onTimerPause,
  onTimerReset,
  isTimerRunning = false,
  className = "",
}) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const matchEvents = [
    { id: "goal", name: "Bàn thắng", icon: "⚽", color: "bg-green-500" },
    { id: "yellow_card", name: "Thẻ vàng", icon: "🟨", color: "bg-yellow-500" },
    { id: "red_card", name: "Thẻ đỏ", icon: "🟥", color: "bg-red-500" },
    {
      id: "substitution",
      name: "Thay người",
      icon: "🔄",
      color: "bg-blue-500",
    },
    { id: "corner", name: "Phạt góc", icon: "📐", color: "bg-purple-500" },
    { id: "freekick", name: "Đá phạt", icon: "🦶", color: "bg-orange-500" },
    { id: "penalty", name: "Penalty", icon: "🎯", color: "bg-red-600" },
    { id: "offside", name: "Việt vị", icon: "🚩", color: "bg-gray-500" },
  ];

  const quickActions = [
    {
      id: "start_match",
      name: "Bắt đầu",
      icon: "▶️",
      action: () => handleStatusChange("live"),
      condition: ["pending", "pause"],
    },
    {
      id: "pause_match",
      name: "Tạm dừng",
      icon: "⏸️",
      action: () => handleStatusChange("pause"),
      condition: ["live"],
    },
    {
      id: "halftime",
      name: "Giải lao",
      icon: "☕",
      action: () => handleStatusChange("halftime"),
      condition: ["live"],
    },
    {
      id: "end_match",
      name: "Kết thúc",
      icon: "🏁",
      action: () => handleStatusChange("ended"),
      condition: ["live", "pause", "halftime"],
    },
  ];

  const handleStatusChange = (newStatus) => {
    onMatchUpdate({
      ...match,
      status: newStatus,
    });

    // Auto handle timer based on status
    if (newStatus === "live" && !isTimerRunning) {
      onTimerStart?.();
    } else if (newStatus === "pause" && isTimerRunning) {
      onTimerPause?.();
    }
  };

  const handleScoreChange = (team, increment) => {
    const currentScore = match[team].score;
    const newScore = Math.max(0, currentScore + increment);

    onMatchUpdate({
      ...match,
      [team]: {
        ...match[team],
        score: newScore,
      },
    });
  };

  const handleAddEvent = (event, team = null) => {
    setSelectedEvent({ ...event, team, timestamp: match.matchTime });
    setShowEventModal(true);
  };

  const handleEventSave = (eventData) => {
    // Add event to match history
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      timestamp: match.matchTime,
      period: match.period,
    };

    // If it's a goal, update score
    if (eventData.type === "goal") {
      handleScoreChange(eventData.team, 1);
    }

    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const isActionAvailable = (action) => {
    return action.condition.includes(match.status);
  };

  return (
    <>
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Điều khiển trận đấu
            </h3>
            <p className="text-gray-600 text-sm">
              Quản lý trận đấu trực tiếp và cập nhật sự kiện
            </p>
          </div>

          {/* Timer Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 text-center">
              Điều khiển thời gian
            </h4>
            <div className="flex justify-center space-x-3">
              <Button
                variant={isTimerRunning ? "warning" : "success"}
                onClick={isTimerRunning ? onTimerPause : onTimerStart}
                icon={isTimerRunning ? "⏸️" : "▶️"}
              >
                {isTimerRunning ? "Tạm dừng" : "Bắt đầu"}
              </Button>
              <Button variant="outline" onClick={onTimerReset} icon="🔄">
                Đặt lại
              </Button>
              <div className="flex items-center px-4 py-2 bg-white rounded-lg border">
                <span className="text-sm text-gray-600 mr-2">Thời gian:</span>
                <span className="font-mono font-bold text-primary-600">
                  {match.matchTime}
                </span>
              </div>
            </div>
          </div>

          {/* Score Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Team */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-center mb-3 text-blue-900">
                {match.homeTeam.name} (Chủ nhà)
              </h4>
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold text-blue-600">
                  {match.homeTeam.score}
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange("homeTeam", -1)}
                    disabled={match.homeTeam.score === 0}
                    className="w-10 h-10 p-0"
                  >
                    -1
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleScoreChange("homeTeam", 1)}
                    className="w-10 h-10 p-0"
                  >
                    +1
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {matchEvents.slice(0, 4).map((event) => (
                    <Button
                      key={event.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddEvent(event, "homeTeam")}
                      className="text-xs"
                    >
                      <span className="mr-1">{event.icon}</span>
                      {event.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-center mb-3 text-red-900">
                {match.awayTeam.name} (Khách)
              </h4>
              <div className="text-center space-y-3">
                <div className="text-4xl font-bold text-red-600">
                  {match.awayTeam.score}
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreChange("awayTeam", -1)}
                    disabled={match.awayTeam.score === 0}
                    className="w-10 h-10 p-0"
                  >
                    -1
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleScoreChange("awayTeam", 1)}
                    className="w-10 h-10 p-0"
                  >
                    +1
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {matchEvents.slice(0, 4).map((event) => (
                    <Button
                      key={event.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddEvent(event, "awayTeam")}
                      className="text-xs"
                    >
                      <span className="mr-1">{event.icon}</span>
                      {event.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-3">Thao tác nhanh</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={isActionAvailable(action) ? "primary" : "outline"}
                  size="sm"
                  onClick={action.action}
                  disabled={!isActionAvailable(action)}
                  className="min-w-24"
                >
                  <span className="mr-1">{action.icon}</span>
                  {action.name}
                </Button>
              ))}
            </div>
          </div>

          {/* More Events */}
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-3">Sự kiện khác</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {matchEvents.slice(4).map((event) => (
                <Button
                  key={event.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddEvent(event)}
                  className="text-xs"
                >
                  <span className="mr-1">{event.icon}</span>
                  {event.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div>
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
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
                    ? "Đang diễn ra"
                    : match.status === "pause"
                      ? "Tạm dừng"
                      : match.status === "ended"
                        ? "Kết thúc"
                        : match.status === "halftime"
                          ? "Giải lao"
                          : "Chưa bắt đầu"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Hiệp:</span>
                <span className="ml-2 font-medium">{match.period}</span>
              </div>
              <div>
                <span className="text-gray-600">Tỉ số:</span>
                <span className="ml-2 font-bold text-primary-600">
                  {match.homeTeam.score} - {match.awayTeam.score}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title={`Thêm sự kiện: ${selectedEvent?.name}`}
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => handleEventSave(selectedEvent)}
            >
              Thêm sự kiện
            </Button>
          </div>
        }
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-2 rounded-lg text-white ${selectedEvent.color}`}
              >
                <span className="text-lg mr-2">{selectedEvent.icon}</span>
                <span className="font-medium">{selectedEvent.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Thời gian:</span>
                <span className="ml-2 font-mono">{match.matchTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Hiệp:</span>
                <span className="ml-2">{match.period}</span>
              </div>
              {selectedEvent.team && (
                <div className="col-span-2">
                  <span className="text-gray-600">Đội:</span>
                  <span className="ml-2 font-medium">
                    {selectedEvent.team === "homeTeam"
                      ? match.homeTeam.name
                      : match.awayTeam.name}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Sự kiện sẽ được ghi lại vào lịch sử trận
                đấu và có thể được hiển thị trên livestream.
                {selectedEvent.id === "goal" &&
                  " Bàn thắng sẽ tự động cập nhật tỉ số."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MatchControls;
