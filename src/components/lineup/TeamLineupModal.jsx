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
  const [lineups, setLineups] = useState({
    home: Array.from({ length: 11 }, (_, i) => ({ number: i + 1, name: "" })),
    away: Array.from({ length: 11 }, (_, i) => ({ number: i + 1, name: "" })),
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

  const handleQuickFill = (team, type) => {
    let names = [];
    const teamName = team === "home" ? 
      (matchData.homeTeam?.name || "Đội nhà") : 
      (matchData.awayTeam?.name || "Đội khách");

    switch (type) {
      case "numbers":
        names = Array.from({ length: 11 }, (_, i) => `Cầu thủ ${i + 1}`);
        break;
      case "team":
        names = Array.from({ length: 11 }, (_, i) => `${teamName} ${i + 1}`);
        break;
      case "positions":
        names = ["Thủ môn", "Hậu vệ trái", "Trung vệ", "Trung vệ", "Hậu vệ phải", 
                "Tiền vệ trái", "Tiền vệ", "Tiền vệ", "Tiền vệ phải", "Tiền đạo", "Tiền đạo"];
        break;
      default:
        return;
    }

    setLineups(prev => ({
      ...prev,
      [team]: prev[team].map((player, i) => ({
        ...player,
        name: names[i] || player.name,
      })),
    }));
  };

  const handleBulkInput = () => {
    const lines = bulkText.trim().split('\n').filter(line => line.trim());
    const names = lines.slice(0, 11); // Take first 11 lines
    
    setLineups(prev => ({
      ...prev,
      [activeTeam]: prev[activeTeam].map((player, i) => ({
        ...player,
        name: names[i]?.trim() || player.name,
      })),
    }));
    
    setBulkText("");
    setBulkMode(false);
  };

  const clearTeam = (team) => {
    setLineups(prev => ({
      ...prev,
      [team]: prev[team].map(player => ({ ...player, name: "" })),
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
                {/* Team Selection */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-2">
          <button
            onClick={() => setActiveTeam("home")}
                        className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all min-h-[2.5rem] ${
              activeTeam === "home"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">🏠</span>
              <span className="text-xs sm:text-sm font-medium">
                {matchData.homeTeam?.name || "Đội nhà"}
              </span>
              <span className="text-xs text-gray-500">({homeCount}/11)</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTeam("away")}
            className={`flex-1 py-3 px-2 rounded-md text-sm font-medium transition-all min-h-[3rem] ${
              activeTeam === "away"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">✈️</span>
              <span className="text-xs sm:text-sm font-medium">
                {matchData.awayTeam?.name || "Đội khách"}
              </span>
              <span className="text-xs text-gray-500">({awayCount}/11)</span>
            </div>
          </button>
        </div>

                {/* Quick Actions */}
        <div className="space-y-2">
          {/* Top row - main actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill(activeTeam, "numbers")}
              className="h-12 flex flex-col items-center justify-center"
            >
              <span className="text-lg">📝</span>
              <span className="text-xs">Cầu thủ 1-11</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkMode(!bulkMode)}
              className="h-12 flex flex-col items-center justify-center"
            >
              <span className="text-lg">📋</span>
              <span className="text-xs">Nhập hàng loạt</span>
            </Button>
          </div>
          {/* Bottom row - secondary actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickFill(activeTeam, "team")}
              className="h-10 text-xs"
            >
              🏆 Theo tên đội
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearTeam(activeTeam)}
              className="text-red-600 border-red-300 hover:bg-red-50 h-10 text-xs"
            >
              🗑️ Xóa hết
            </Button>
          </div>
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
              placeholder="Nhập tên cầu thủ, mỗi dòng một người&#10;Ví dụ:&#10;Nguyễn Văn A&#10;Trần Văn B&#10;Lê Văn C&#10;..."
              className="w-full h-32 p-3 border border-yellow-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={6}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-yellow-700">
                💡 Mỗi dòng một tên cầu thủ, tối đa 11 người
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
                                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 ${
                  activeTeam === "home" ? "bg-blue-500" : "bg-red-500"
                }`}>
                  {player.number}
                </div>
                                <div className="flex-1 min-w-0">
                  <Input
                    value={player.name}
                    onChange={(e) => handlePlayerChange(activeTeam, index, e.target.value)}
                                        placeholder={`Tên cầu thủ số ${player.number}...`}
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

        {/* Summary */}
        <div className="hidden sm:block bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Tổng quan</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl mb-1">🏠</div>
              <div className="font-semibold text-blue-600 text-lg">{homeCount}/11</div>
              <div className="text-blue-500 text-sm">{matchData.homeTeam?.name || "Đội nhà"}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl mb-1">✈️</div>
              <div className="font-semibold text-red-600 text-lg">{awayCount}/11</div>
              <div className="text-red-500 text-sm">{matchData.awayTeam?.name || "Đội khách"}</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Mẹo sử dụng:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Chuyển đổi giữa hai đội bằng các tab ở trên</li>
            <li>• Sử dụng "Nhập hàng loạt" để dán danh sách từ Excel/Word</li>
            <li>• Điền nhanh bằng các nút "Cầu thủ 1-11" hoặc "Theo tên đội"</li>
            <li>• Cần đủ 11 cầu thủ cho mỗi đội mới có thể lưu</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default TeamLineupModal;
