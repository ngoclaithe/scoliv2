import React, { useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";

const LineupDisplay = ({
  lineup,
  teamInfo = {},
  showPlayerDetails = true,
  showStats = false,
  interactive = false,
  size = "md",
  onPlayerClick,
  className = "",
}) => {
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [viewMode, setViewMode] = useState("field"); // 'field', 'list', 'formation'

  const sizes = {
    sm: { container: "h-64", player: "w-6 h-6", text: "text-xs" },
    md: { container: "h-80", player: "w-8 h-8", text: "text-sm" },
    lg: { container: "h-96", player: "w-10 h-10", text: "text-base" },
  };

  const currentSize = sizes[size];

  const getPositionColor = (position) => {
    if (position === "GK") return "bg-yellow-500";
    if (["CB", "LB", "RB", "LWB", "RWB"].includes(position))
      return "bg-blue-500";
    if (["CDM", "CM", "CAM", "LM", "RM"].includes(position))
      return "bg-green-500";
    if (["LW", "RW", "CF", "ST"].includes(position)) return "bg-red-500";
    return "bg-gray-500";
  };

  const getPositionName = (position) => {
    const names = {
      GK: "Thủ môn",
      CB: "Trung vệ",
      LB: "Hậu vệ trái",
      RB: "Hậu vệ phải",
      LWB: "Hậu vệ biên trái",
      RWB: "Hậu vệ biên phải",
      CDM: "Tiền vệ phòng ngự",
      CM: "Tiền vệ trung tâm",
      CAM: "Tiền vệ tấn công",
      LM: "Tiền vệ trái",
      RM: "Tiền vệ phải",
      LW: "Cánh trái",
      RW: "Cánh phải",
      CF: "Tiền đạo lùi",
      ST: "Tiền đạo",
    };
    return names[position] || position;
  };

  const handlePlayerClick = (player, position) => {
    if (interactive) {
      setSelectedPlayer({ ...player, position });
      setShowPlayerModal(true);
      onPlayerClick?.(player, position);
    }
  };

  const groupPlayersByPosition = () => {
    if (!lineup.positions) return {};

    const groups = {
      goalkeepers: [],
      defenders: [],
      midfielders: [],
      forwards: [],
    };

    lineup.positions.forEach((pos) => {
      if (!pos.player) return;

      const player = {
        ...pos.player,
        position: pos.position,
        positionData: pos,
      };

      if (pos.position === "GK") {
        groups.goalkeepers.push(player);
      } else if (["CB", "LB", "RB", "LWB", "RWB"].includes(pos.position)) {
        groups.defenders.push(player);
      } else if (["CDM", "CM", "CAM", "LM", "RM"].includes(pos.position)) {
        groups.midfielders.push(player);
      } else if (["LW", "RW", "CF", "ST"].includes(pos.position)) {
        groups.forwards.push(player);
      }
    });

    return groups;
  };

  const FieldView = () => (
    <div
      className={`relative bg-green-600 rounded-lg ${currentSize.container} overflow-hidden`}
    >
      {/* Football Field Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-700">
        {/* Field Lines */}
        <div className="absolute inset-4 border-2 border-white border-opacity-50 rounded-lg">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 border-2 border-white border-opacity-50 rounded-full"></div>

          {/* Penalty Areas */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 md:w-16 md:h-12 border-t-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-8 md:w-16 md:h-12 border-b-2 border-l-2 border-r-2 border-white border-opacity-50"></div>

          {/* Goal Areas */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-4 md:w-8 md:h-6 border-t-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-4 md:w-8 md:h-6 border-b-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
        </div>
      </div>

      {/* Players */}
      {lineup.positions?.map((position) => {
        if (!position.player) return null;

        return (
          <div
            key={position.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={() => handlePlayerClick(position.player, position)}
          >
            <div
              className={`${currentSize.player} rounded-full border-2 border-white flex items-center justify-center font-bold text-white transition-all ${
                interactive ? "hover:scale-110" : ""
              } ${getPositionColor(position.position)}`}
            >
              {position.player.number}
            </div>

            {showPlayerDetails && (
              <>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-white text-xs font-medium bg-black bg-opacity-60 px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {position.player.name}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-75">
                  {position.position}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Formation Display */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
        {lineup.formation || "4-4-2"}
      </div>

      {/* Team Info */}
      {teamInfo.name && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
          {teamInfo.name}
        </div>
      )}
    </div>
  );

  const ListView = () => {
    const groups = groupPlayersByPosition();

    return (
      <div className="space-y-4">
        {Object.entries(groups).map(([groupName, players]) => {
          if (players.length === 0) return null;

          const groupTitles = {
            goalkeepers: "Thủ môn",
            defenders: "Hậu vệ",
            midfielders: "Tiền vệ",
            forwards: "Tiền đạo",
          };

          const groupColors = {
            goalkeepers: "border-yellow-200 bg-yellow-50",
            defenders: "border-blue-200 bg-blue-50",
            midfielders: "border-green-200 bg-green-50",
            forwards: "border-red-200 bg-red-50",
          };

          return (
            <div
              key={groupName}
              className={`border rounded-lg p-4 ${groupColors[groupName]}`}
            >
              <h4 className="font-medium text-gray-900 mb-3">
                {groupTitles[groupName]} ({players.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {players.map((player) => (
                  <div
                    key={player.number}
                    className={`flex items-center space-x-3 p-2 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${
                      interactive ? "hover:bg-gray-50" : ""
                    }`}
                    onClick={() =>
                      handlePlayerClick(player, player.positionData)
                    }
                  >
                    <div
                      className={`${currentSize.player} rounded-full flex items-center justify-center text-white font-bold ${currentSize.text} ${getPositionColor(player.position)}`}
                    >
                      {player.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getPositionName(player.position)}
                        {player.age && ` • ${player.age} tuổi`}
                        {player.nationality && ` • ${player.nationality}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const FormationView = () => (
    <div className="text-center">
      <div className="text-6xl font-bold text-gray-800 mb-4">
        {lineup.formation || "4-4-2"}
      </div>
      <div className="text-lg text-gray-600 mb-6">Sơ đồ chiến thuật</div>

      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {Object.entries(groupPlayersByPosition()).map(
          ([groupName, players]) => {
            if (players.length === 0) return null;

            const groupIcons = {
              goalkeepers: "🥅",
              defenders: "🛡️",
              midfielders: "⚙️",
              forwards: "⚽",
            };

            return (
              <div key={groupName} className="text-center">
                <div className="text-2xl mb-2">{groupIcons[groupName]}</div>
                <div className="text-lg font-bold text-gray-800">
                  {players.length}
                </div>
                <div className="text-xs text-gray-500">
                  {groupName === "goalkeepers"
                    ? "GK"
                    : groupName === "defenders"
                      ? "DF"
                      : groupName === "midfielders"
                        ? "MF"
                        : "FW"}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );

  if (!lineup || !lineup.positions) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có đội hình
          </h3>
          <p className="text-gray-500">Hãy thiết lập đội hình để hiển thị</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Đội hình {teamInfo.name || ""}
                </h3>
                <p className="text-sm text-gray-500">
                  {lineup.formation} •{" "}
                  {lineup.positions?.filter((p) => p.player).length || 0}/11 cầu
                  thủ
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("field")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    viewMode === "field"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sân bóng
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Danh sách
                </button>
                <button
                  onClick={() => setViewMode("formation")}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    viewMode === "formation"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sơ đồ
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {viewMode === "field" && <FieldView />}
            {viewMode === "list" && <ListView />}
            {viewMode === "formation" && <FormationView />}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-900">
                    {Object.values(groupPlayersByPosition()).flat().length}
                  </div>
                  <div className="text-gray-500">Tổng cầu thủ</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(
                      Object.values(groupPlayersByPosition())
                        .flat()
                        .reduce((sum, p) => sum + (p.age || 25), 0) /
                        Object.values(groupPlayersByPosition()).flat().length,
                    ) || 0}
                  </div>
                  <div className="text-gray-500">Tuổi TB</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(
                      Object.values(groupPlayersByPosition())
                        .flat()
                        .reduce((sum, p) => sum + (p.height || 175), 0) /
                        Object.values(groupPlayersByPosition()).flat().length,
                    ) || 0}
                    cm
                  </div>
                  <div className="text-gray-500">Chiều cao TB</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {
                      new Set(
                        Object.values(groupPlayersByPosition())
                          .flat()
                          .map((p) => p.nationality),
                      ).size
                    }
                  </div>
                  <div className="text-gray-500">Quốc tịch</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Player Detail Modal */}
      <Modal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        title={`Thông tin cầu thủ #${selectedPlayer?.number}`}
        size="md"
      >
        {selectedPlayer && (
          <div className="space-y-4">
            <div className="text-center">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 ${getPositionColor(selectedPlayer.position)}`}
              >
                {selectedPlayer.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedPlayer.name}
              </h3>
              <p className="text-gray-600">
                {getPositionName(selectedPlayer.position)} (
                {selectedPlayer.position})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {selectedPlayer.age && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {selectedPlayer.age}
                  </div>
                  <div className="text-gray-500">Tuổi</div>
                </div>
              )}
              {selectedPlayer.nationality && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {selectedPlayer.nationality}
                  </div>
                  <div className="text-gray-500">Quốc tịch</div>
                </div>
              )}
              {selectedPlayer.height && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {selectedPlayer.height}cm
                  </div>
                  <div className="text-gray-500">Chiều cao</div>
                </div>
              )}
              {selectedPlayer.weight && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {selectedPlayer.weight}kg
                  </div>
                  <div className="text-gray-500">Cân nặng</div>
                </div>
              )}
            </div>

            {selectedPlayer.preferredFoot && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">
                  {selectedPlayer.preferredFoot === "right"
                    ? "Chân phải"
                    : selectedPlayer.preferredFoot === "left"
                      ? "Chân trái"
                      : "Cả hai chân"}
                </div>
                <div className="text-gray-500">Chân thuận</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default LineupDisplay;
