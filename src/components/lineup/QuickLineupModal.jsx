import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

const QuickLineupModal = ({
  isOpen,
  onClose,
  onSave,
  matchData = {},
  className = "",
}) => {
  const [activeTeam, setActiveTeam] = useState("home");
  const [formations, setFormations] = useState({
    home: "4-4-2",
    away: "4-4-2",
  });
  
  const [lineups, setLineups] = useState({
    home: {
      players: Array.from({ length: 11 }, (_, i) => ({
        number: i + 1,
        name: "",
        position: "",
      })),
    },
    away: {
      players: Array.from({ length: 11 }, (_, i) => ({
        number: i + 1,
        name: "",
        position: "",
      })),
    },
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const formationPresets = [
    { id: "4-4-2", name: "4-4-2", positions: ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"] },
    { id: "4-3-3", name: "4-3-3", positions: ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "CM", "LW", "ST", "RW"] },
    { id: "3-5-2", name: "3-5-2", positions: ["GK", "CB", "CB", "CB", "LWB", "CDM", "CM", "CDM", "RWB", "ST", "ST"] },
    { id: "4-5-1", name: "4-5-1", positions: ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "CM", "RM", "ST"] },
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

  const handleFormationChange = (team, formation) => {
    const preset = formationPresets.find(f => f.id === formation);
    if (!preset) return;

    setFormations(prev => ({ ...prev, [team]: formation }));
    
    // Update positions based on formation
    setLineups(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.map((player, index) => ({
          ...player,
          position: preset.positions[index] || "",
        })),
      },
    }));
  };

  const handlePlayerChange = (team, index, field, value) => {
    setLineups(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.map((player, i) =>
          i === index ? { ...player, [field]: value } : player
        ),
      },
    }));
  };

  const handleQuickFill = (team, pattern) => {
    let names = [];
    const teamName = team === "home" ? matchData.homeTeam?.name : matchData.awayTeam?.name;
    
    switch (pattern) {
      case "numbers":
        names = Array.from({ length: 11 }, (_, i) => `Cầu thủ ${i + 1}`);
        break;
      case "positions":
        const formation = formationPresets.find(f => f.id === formations[team]);
        names = formation ? formation.positions.map(pos => positionNames[pos] || pos) : [];
        break;
      case "team":
        names = Array.from({ length: 11 }, (_, i) => `${teamName || "Đội"} ${i + 1}`);
        break;
      default:
        return;
    }

    setLineups(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.map((player, i) => ({
          ...player,
          name: names[i] || player.name,
        })),
      },
    }));
  };

  const handleClearTeam = (team) => {
    setLineups(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.map(player => ({ ...player, name: "" })),
      },
    }));
  };

  const validateAndSave = () => {
    const homeValid = lineups.home.players.every(p => p.name.trim());
    const awayValid = lineups.away.players.every(p => p.name.trim());

    if (!homeValid || !awayValid) {
      alert("Vui lòng điền đầy đủ tên cầu thủ cho cả hai đội");
      return;
    }

    const lineupData = {
      home: {
        formation: formations.home,
        players: lineups.home.players,
      },
      away: {
        formation: formations.away,
        players: lineups.away.players,
      },
    };

    onSave(lineupData);
    onClose();
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < 10) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else if (activeTeam === "home") {
      setActiveTeam("away");
      setCurrentPlayerIndex(0);
    }
  };

  const prevPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1);
    } else if (activeTeam === "away") {
      setActiveTeam("home");
      setCurrentPlayerIndex(10);
    }
  };

  const currentPlayer = lineups[activeTeam].players[currentPlayerIndex];
  const currentPosition = currentPlayer?.position;
  const progress = ((activeTeam === "home" ? 0 : 11) + currentPlayerIndex + 1) / 22 * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhập danh sách cầu thủ"
      size="full"
      footer={
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          <div className="flex gap-2 flex-1">
            <Button 
              variant="outline" 
              onClick={prevPlayer}
              disabled={activeTeam === "home" && currentPlayerIndex === 0}
              className="flex-1 sm:flex-none"
            >
              ← Trước
            </Button>
            <Button 
              variant="outline" 
              onClick={nextPlayer}
              disabled={activeTeam === "away" && currentPlayerIndex === 10}
              className="flex-1 sm:flex-none"
            >
              Sau →
            </Button>
          </div>
          <div className="flex gap-2 flex-1 sm:flex-none">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              Hủy
            </Button>
            <Button variant="primary" onClick={validateAndSave} className="flex-1 sm:flex-none">
              Lưu danh sách
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Team Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTeam("home")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTeam === "home"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            🏠 {matchData.homeTeam?.name || "Đội nhà"}
          </button>
          <button
            onClick={() => setActiveTeam("away")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTeam === "away"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            ✈️ {matchData.awayTeam?.name || "Đội khách"}
          </button>
        </div>

        {/* Formation Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sơ đồ chiến thuật {activeTeam === "home" ? "đội nhà" : "đội khách"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {formationPresets.map((formation) => (
              <button
                key={formation.id}
                onClick={() => handleFormationChange(activeTeam, formation.id)}
                className={`p-2 sm:p-3 rounded-lg text-sm font-medium transition-colors ${
                  formations[activeTeam] === formation.id
                    ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                }`}
              >
                {formation.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Điền nhanh cho {activeTeam === "home" ? "đội nhà" : "đội khách"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill(activeTeam, "numbers")}
              className="w-full"
            >
              📝 Cầu thủ 1-11
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill(activeTeam, "positions")}
              className="w-full"
            >
              🎯 Theo vị trí
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClearTeam(activeTeam)}
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              🗑️ Xóa hết
            </Button>
          </div>
        </div>

        {/* Current Player Input */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cầu thủ số {currentPlayer?.number}
              </h3>
              <p className="text-sm text-gray-600">
                {positionNames[currentPosition] || currentPosition} ({currentPosition})
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {currentPlayerIndex + 1}/11
              </div>
              <div className="text-xs text-gray-500">
                {activeTeam === "home" ? "Đội nhà" : "Đội khách"}
              </div>
            </div>
          </div>

          <Input
            label="Tên cầu thủ"
            value={currentPlayer?.name || ""}
            onChange={(e) => handlePlayerChange(activeTeam, currentPlayerIndex, "name", e.target.value)}
            placeholder={`Nhập tên ${positionNames[currentPosition]?.toLowerCase() || "cầu thủ"}...`}
            className="text-lg"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                nextPlayer();
              }
            }}
          />

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Nhấn Enter để chuyển cầu thủ tiếp theo
            </div>
            <div className="flex items-center space-x-2">
              {activeTeam === "home" ? (
                <span className="text-blue-600">🏠</span>
              ) : (
                <span className="text-red-600">✈️</span>
              )}
              <span className="text-sm font-medium">
                {((activeTeam === "home" ? 0 : 11) + currentPlayerIndex + 1)}/22
              </span>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Tình trạng nhập liệu
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">🏠</div>
              <div className="font-semibold text-gray-900">
                {lineups.home.players.filter(p => p.name.trim()).length}/11
              </div>
              <div className="text-gray-600">Đội nhà</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">✈️</div>
              <div className="font-semibold text-gray-900">
                {lineups.away.players.filter(p => p.name.trim()).length}/11
              </div>
              <div className="text-gray-600">Đội khách</div>
            </div>
          </div>
        </div>

        {/* Mini Player List */}
        <div className="bg-white border rounded-lg">
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">
              Danh sách {activeTeam === "home" ? "đội nhà" : "đội khách"}
            </h4>
          </div>
                    <div className="max-h-48 sm:max-h-40 overflow-y-auto">
            {lineups[activeTeam].players.map((player, index) => (
              <button
                key={index}
                onClick={() => setCurrentPlayerIndex(index)}
                className={`w-full flex items-center justify-between p-2 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === currentPlayerIndex ? "bg-primary-50 border-primary-200" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    activeTeam === "home" ? "bg-blue-500" : "bg-red-500"
                  }`}>
                    {player.number}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {player.name || "Chưa nhập"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {positionNames[player.position] || player.position}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {player.name.trim() ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickLineupModal;
