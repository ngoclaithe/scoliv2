import React, { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const LineupManager = ({
  lineup,
  onLineupUpdate,
  teamType = "home",
  className = "",
}) => {
  const [currentLineup, setCurrentLineup] = useState({
    formation: "4-4-2",
    players: [],
    substitutes: [],
    ...lineup,
  });

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const formations = [
    { id: "4-4-2", name: "4-4-2", positions: 11 },
    { id: "4-3-3", name: "4-3-3", positions: 11 },
    { id: "3-5-2", name: "3-5-2", positions: 11 },
    { id: "4-5-1", name: "4-5-1", positions: 11 },
    { id: "5-3-2", name: "5-3-2", positions: 11 },
    { id: "4-2-3-1", name: "4-2-3-1", positions: 11 },
  ];

  const positionNames = {
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

  const getFormationPositions = (formation) => {
    const positions = {
      "4-4-2": [
        { id: 1, position: "GK", x: 50, y: 5, number: 1 },
        { id: 2, position: "LB", x: 20, y: 25, number: 3 },
        { id: 3, position: "CB", x: 40, y: 25, number: 4 },
        { id: 4, position: "CB", x: 60, y: 25, number: 5 },
        { id: 5, position: "RB", x: 80, y: 25, number: 2 },
        { id: 6, position: "LM", x: 20, y: 55, number: 11 },
        { id: 7, position: "CM", x: 40, y: 55, number: 6 },
        { id: 8, position: "CM", x: 60, y: 55, number: 8 },
        { id: 9, position: "RM", x: 80, y: 55, number: 7 },
        { id: 10, position: "ST", x: 35, y: 80, number: 9 },
        { id: 11, position: "ST", x: 65, y: 80, number: 10 },
      ],
      "4-3-3": [
        { id: 1, position: "GK", x: 50, y: 5, number: 1 },
        { id: 2, position: "LB", x: 20, y: 25, number: 3 },
        { id: 3, position: "CB", x: 40, y: 25, number: 4 },
        { id: 4, position: "CB", x: 60, y: 25, number: 5 },
        { id: 5, position: "RB", x: 80, y: 25, number: 2 },
        { id: 6, position: "CDM", x: 50, y: 45, number: 6 },
        { id: 7, position: "CM", x: 35, y: 55, number: 8 },
        { id: 8, position: "CM", x: 65, y: 55, number: 10 },
        { id: 9, position: "LW", x: 20, y: 80, number: 11 },
        { id: 10, position: "ST", x: 50, y: 80, number: 9 },
        { id: 11, position: "RW", x: 80, y: 80, number: 7 },
      ],
      "3-5-2": [
        { id: 1, position: "GK", x: 50, y: 5, number: 1 },
        { id: 2, position: "CB", x: 30, y: 25, number: 3 },
        { id: 3, position: "CB", x: 50, y: 25, number: 4 },
        { id: 4, position: "CB", x: 70, y: 25, number: 5 },
        { id: 5, position: "LWB", x: 15, y: 50, number: 11 },
        { id: 6, position: "CDM", x: 35, y: 50, number: 6 },
        { id: 7, position: "CM", x: 50, y: 55, number: 8 },
        { id: 8, position: "CDM", x: 65, y: 50, number: 10 },
        { id: 9, position: "RWB", x: 85, y: 50, number: 2 },
        { id: 10, position: "ST", x: 40, y: 80, number: 9 },
        { id: 11, position: "ST", x: 60, y: 80, number: 7 },
      ],
    };
    return positions[formation] || positions["4-4-2"];
  };

  const handleFormationChange = (newFormation) => {
    const newPositions = getFormationPositions(newFormation);
    const updatedLineup = {
      ...currentLineup,
      formation: newFormation,
      positions: newPositions,
    };
    setCurrentLineup(updatedLineup);
    onLineupUpdate?.(updatedLineup);
  };

  const handlePlayerEdit = (position) => {
    setSelectedPosition(position);
    setEditingPlayer(
      position.player || {
        name: "",
        number: position.number,
        position: position.position,
      },
    );
    setShowPlayerModal(true);
  };

  const handlePlayerSave = () => {
    const updatedPositions =
      currentLineup.positions?.map((pos) =>
        pos.id === selectedPosition.id
          ? { ...pos, player: editingPlayer }
          : pos,
      ) ||
      getFormationPositions(currentLineup.formation).map((pos) =>
        pos.id === selectedPosition.id
          ? { ...pos, player: editingPlayer }
          : pos,
      );

    const updatedLineup = {
      ...currentLineup,
      positions: updatedPositions,
    };

    setCurrentLineup(updatedLineup);
    onLineupUpdate?.(updatedLineup);
    setShowPlayerModal(false);
    setEditingPlayer(null);
    setSelectedPosition(null);
  };

  const handleAutoFill = () => {
    const positions = getFormationPositions(currentLineup.formation);
    const autoFilledPositions = positions.map((pos) => ({
      ...pos,
      player: {
        name: `Cầu thủ ${pos.number}`,
        number: pos.number,
        position: pos.position,
      },
    }));

    const updatedLineup = {
      ...currentLineup,
      positions: autoFilledPositions,
    };

    setCurrentLineup(updatedLineup);
    onLineupUpdate?.(updatedLineup);
  };

  const handleClearLineup = () => {
    const clearedPositions = getFormationPositions(currentLineup.formation);
    const updatedLineup = {
      ...currentLineup,
      positions: clearedPositions,
    };

    setCurrentLineup(updatedLineup);
    onLineupUpdate?.(updatedLineup);
  };

  const getPlayerAtPosition = (positionId) => {
    return currentLineup.positions?.find((pos) => pos.id === positionId)
      ?.player;
  };

  return (
    <>
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Quản lý đội hình {teamType === "home" ? "đội nhà" : "đội khách"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Sắp xếp đội hình và cầu thủ cho trận đấu
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
              >
                Tự động
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLineup}
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                }
              >
                Xóa hết
              </Button>
            </div>
          </div>

          {/* Formation Selector */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Sơ đồ chiến thuật
            </h4>
            <div className="flex flex-wrap gap-2">
              {formations.map((formation) => (
                <button
                  key={formation.id}
                  onClick={() => handleFormationChange(formation.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentLineup.formation === formation.id
                      ? "bg-primary-100 text-primary-800 border border-primary-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {formation.name}
                </button>
              ))}
            </div>
          </div>

          {/* Formation Display */}
          <div className="mb-6">
            <div className="relative bg-green-600 rounded-lg aspect-[3/4] overflow-hidden">
              {/* Football Field Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-700">
                {/* Field Lines */}
                <div className="absolute inset-4 border-2 border-white border-opacity-50 rounded-lg">
                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white border-opacity-50 rounded-full"></div>

                  {/* Penalty Areas */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 border-t-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-12 border-b-2 border-l-2 border-r-2 border-white border-opacity-50"></div>

                  {/* Goal Areas */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-6 border-t-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-6 border-b-2 border-l-2 border-r-2 border-white border-opacity-50"></div>
                </div>
              </div>

              {/* Players */}
              {getFormationPositions(currentLineup.formation).map(
                (position) => {
                  const player = getPlayerAtPosition(position.id);
                  return (
                    <div
                      key={position.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${position.x}%`, top: `${position.y}%` }}
                      onClick={() => handlePlayerEdit(position)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-sm transition-all hover:scale-110 ${
                          teamType === "home"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {player?.number || position.number}
                      </div>
                      {player?.name && (
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded whitespace-nowrap">
                          {player.name}
                        </div>
                      )}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs">
                        {positionNames[position.position] || position.position}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Player List */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Danh sách cầu thủ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFormationPositions(currentLineup.formation).map(
                (position) => {
                  const player = getPlayerAtPosition(position.id);
                  return (
                    <div
                      key={position.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handlePlayerEdit(position)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            teamType === "home" ? "bg-blue-500" : "bg-red-500"
                          }`}
                        >
                          {player?.number || position.number}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {player?.name || "Chưa có cầu thủ"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {positionNames[position.position] ||
                              position.position}
                          </div>
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Player Edit Modal */}
      <Modal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        title={`Chỉnh sửa cầu thủ - ${positionNames[selectedPosition?.position] || selectedPosition?.position}`}
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowPlayerModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handlePlayerSave}>
              Lưu cầu thủ
            </Button>
          </div>
        }
      >
        {editingPlayer && (
          <div className="space-y-4">
            <Input
              label="Tên cầu thủ"
              value={editingPlayer.name}
              onChange={(e) =>
                setEditingPlayer((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập tên cầu thủ..."
              required
            />

            <Input
              label="Số áo"
              type="number"
              value={editingPlayer.number}
              onChange={(e) =>
                setEditingPlayer((prev) => ({
                  ...prev,
                  number: parseInt(e.target.value) || 0,
                }))
              }
              min="1"
              max="99"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vị trí
              </label>
              <select
                value={editingPlayer.position}
                onChange={(e) =>
                  setEditingPlayer((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {Object.entries(positionNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name} ({key})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Tuổi (tùy chọn)"
              type="number"
              value={editingPlayer.age || ""}
              onChange={(e) =>
                setEditingPlayer((prev) => ({
                  ...prev,
                  age: parseInt(e.target.value) || null,
                }))
              }
              min="16"
              max="45"
            />

            <Input
              label="Quốc tịch (tùy chọn)"
              value={editingPlayer.nationality || ""}
              onChange={(e) =>
                setEditingPlayer((prev) => ({
                  ...prev,
                  nationality: e.target.value,
                }))
              }
              placeholder="VD: Việt Nam"
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default LineupManager;
