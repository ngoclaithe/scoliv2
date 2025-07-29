import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

const TeamLineupModal = ({
  isOpen,
  onClose,
  onSave,
  matchData = {},
  className = "",
}) => {
  const [activeTeam, setActiveTeam] = useState("home");
  
  // Khởi tạo với số áo thực tế, GK đầu tiên
  const defaultPlayers = [
    { number: "GK", name: "" }, // Thủ môn
    { number: "2", name: "" },
    { number: "3", name: "" },
    { number: "4", name: "" },
    { number: "5", name: "" },
    { number: "6", name: "" },
    { number: "7", name: "" },
    { number: "8", name: "" },
    { number: "9", name: "" },
    { number: "10", name: "" },
    { number: "11", name: "" },
  ];

  const [lineups, setLineups] = useState({
    home: [...defaultPlayers],
    away: [...defaultPlayers],
  });

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const handlePlayerChange = (team, index, value) => {
    setLineups(prev => ({
      ...prev,
      [team]: prev[team].map((player, i) =>
        i === index ? { ...player, name: value } : player
      ),
    }));
  };



  const handleBulkInput = () => {
    const lines = bulkText.trim().split('\n').filter(line => line.trim());
    const players = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('GK ')) {
        // Thủ môn
        players.push({
          number: "GK",
          name: trimmedLine.substring(3).trim()
        });
      } else {
        // Cầu thủ khác với số áo
        const match = trimmedLine.match(/^(\d+)\s+(.+)$/);
        if (match) {
          players.push({
            number: match[1],
            name: match[2].trim()
          });
        }
      }
    });

    // Sắp xếp: GK đầu tiên, rồi theo số áo
    players.sort((a, b) => {
      if (a.number === "GK") return -1;
      if (b.number === "GK") return 1;
      return parseInt(a.number) - parseInt(b.number);
    });

    // Cập nhật lineup
    setLineups(prev => ({
      ...prev,
      [activeTeam]: prev[activeTeam].map((player, i) => {
        if (players[i]) {
          return {
            number: players[i].number,
            name: players[i].name
          };
        }
        return player;
      }),
    }));
    
    setBulkText("");
    setBulkMode(false);
  };

  const clearTeam = (team) => {
    setLineups(prev => ({
      ...prev,
      [team]: [...defaultPlayers],
    }));
  };

  const validateAndSave = () => {
    const homeValid = lineups.home.filter(p => p.name.trim()).length >= 11;
    const awayValid = lineups.away.filter(p => p.name.trim()).length >= 11;

    if (!homeValid || !awayValid) {
      alert("Vui lòng điền đầy đủ tên cầu thủ cho cả hai đội (11 cầu thủ mỗi đội)");
      return;
    }

    onSave({
      home: lineups.home.filter(p => p.name.trim()),
      away: lineups.away.filter(p => p.name.trim()),
    });
    onClose();
  };

  const currentTeamData = lineups[activeTeam];
  const homeCount = lineups.home.filter(p => p.name.trim()).length;
  const awayCount = lineups.away.filter(p => p.name.trim()).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📋 Danh sách cầu thủ hai đội"
      size="xl"
      footer={
        <div className="flex flex-col gap-3 w-full">
          {/* Mobile progress indicator */}
          <div className="flex gap-2 sm:hidden">
            <div className="flex-1 text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-600">{homeCount}/11</div>
              <div className="text-xs text-blue-500">Đội nhà</div>
            </div>
            <div className="flex-1 text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-600">{awayCount}/11</div>
              <div className="text-xs text-red-500">Đội khách</div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none min-h-[2.75rem]">
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={validateAndSave}
              className="flex-1 sm:flex-none min-h-[2.75rem]"
              disabled={homeCount < 11 || awayCount < 11}
            >
              Lưu danh sách ({homeCount + awayCount}/22)
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Team Selection - Thu gọn header */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-2">
          <button
            onClick={() => setActiveTeam("home")}
            className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all min-h-[2rem] ${
              activeTeam === "home"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm">🏠</span>
              <span className="text-xs font-medium">
                {matchData.homeTeam?.name || "Đội nhà"}
              </span>
              <span className="text-xs text-gray-500">({homeCount}/11)</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTeam("away")}
            className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-all min-h-[2rem] ${
              activeTeam === "away"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm">✈️</span>
              <span className="text-xs font-medium">
                {matchData.awayTeam?.name || "Đội khách"}
              </span>
              <span className="text-xs text-gray-500">({awayCount}/11)</span>
            </div>
          </button>
        </div>

        {/* Quick Actions - Bỏ nút xóa hết, thay bằng nút Lưu */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkMode(!bulkMode)}
            className="h-10 flex flex-col items-center justify-center"
          >
            <span className="text-lg">📋</span>
            <span className="text-xs">Nhập hàng loạt</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={validateAndSave}
            className="h-10 flex flex-col items-center justify-center text-xs"
            disabled={homeCount < 11 || awayCount < 11}
          >
            <span className="text-lg">💾</span>
            <span className="text-xs">Lưu ({homeCount + awayCount}/22)</span>
          </Button>
        </div>

        {/* Bulk Input Mode */}
        {bulkMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              Nhập hàng loạt - {activeTeam === "home" ? "Đội nhà" : "Đội khách"}
            </h4>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Nhập theo format số áo + tên:&#10;GK Mai Đức Anh&#10;12 Hoàng Hải&#10;13 Đức Long&#10;10 Nam Hải&#10;7 Messi&#10;..."
              className="w-full h-40 p-3 border border-yellow-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
              rows={8}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-yellow-700">
                💡 Format: "GK Tên thủ môn" hoặc "Số_áo Tên_cầu_thủ"
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setBulkMode(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleBulkInput}
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Player Input Grid */}
        <div className="bg-white border rounded-lg">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">
                Danh sách {activeTeam === "home" ? "đội nhà" : "đội khách"}
              </h4>
              <div className="text-sm text-gray-500">
                {currentTeamData.filter(p => p.name.trim()).length}/11 cầu thủ
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 space-y-3 max-h-[40vh] sm:max-h-[50vh] lg:max-h-96 overflow-y-auto">
            {currentTeamData.map((player, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 min-h-[2.5rem] py-1">
                <div className={`w-10 h-8 sm:w-12 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 ${
                  player.number === "GK" 
                    ? "bg-green-500" 
                    : activeTeam === "home" ? "bg-blue-500" : "bg-red-500"
                }`}>
                  {player.number}
                </div>
                <div className="flex-1 min-w-0">
                  <Input
                    value={player.name}
                    onChange={(e) => handlePlayerChange(activeTeam, index, e.target.value)}
                    placeholder={player.number === "GK" ? "Tên thủ môn..." : `Tên cầu thủ số ${player.number}...`}
                    className="text-sm sm:text-base w-full"
                  />
                </div>
                {player.name.trim() && (
                  <span className="text-green-500 flex-shrink-0">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>




      </div>
    </Modal>
  );
};

export default TeamLineupModal;
