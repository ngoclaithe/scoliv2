import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import { useMatch } from "../../contexts/MatchContext";
import PlayerListAPI from "../../API/apiPlayerList";
import { toast } from "react-toastify";

const TeamLineupModal = ({
  isOpen,
  onClose,
  onSave,
  matchData = {},
  className = "",
  accessCode = null,
}) => {
  const { updateLineup, updateView } = useMatch();
  const [activeTeam, setActiveTeam] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [historyMatches, setHistoryMatches] = useState([]);
  const [showHistorySelection, setShowHistorySelection] = useState(false);
  
  const defaultPlayers = [
    { number: "GK", name: "" },
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

  // Load current lineup data from API when modal opens
  useEffect(() => {
    if (isOpen && accessCode) {
      loadCurrentLineup();
    }
  }, [isOpen, accessCode]);

  // Load history matches when component mounts
  useEffect(() => {
    if (isOpen) {
      loadHistoryMatches();
    }
  }, [isOpen]);

  const loadCurrentLineup = async () => {
    if (!accessCode) return;

    setIsLoading(true);
    try {
      const [teamAResponse, teamBResponse] = await Promise.all([
        PlayerListAPI.getPlayerListByAccessCode(accessCode, 'teamA'),
        PlayerListAPI.getPlayerListByAccessCode(accessCode, 'teamB')
      ]);

      // Xử lý dữ liệu giống như trong MatchStatsEdit.jsx
      const processPlayers = (players) => {
        if (!Array.isArray(players)) return [];
        return players.map(player => ({
          number: player.number || player.jerseyNumber || '',
          name: player.name || ''
        }));
      };

      const teamAPlayers = processPlayers(teamAResponse.data?.players || []);
      const teamBPlayers = processPlayers(teamBResponse.data?.players || []);

      if (teamAPlayers.length > 0) {
        setLineups(prev => ({
          ...prev,
          home: [...teamAPlayers, ...defaultPlayers.slice(teamAPlayers.length)]
        }));
      }

      if (teamBPlayers.length > 0) {
        setLineups(prev => ({
          ...prev,
          away: [...teamBPlayers, ...defaultPlayers.slice(teamBPlayers.length)]
        }));
      }
    } catch (error) {
      if (!error.message.includes('AccessCode is not associated to PlayerList')) {
        console.error('Error loading current lineup:', error);
        toast.error('Không thể tải danh sách cầu thủ hiện tại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryMatches = async () => {
    try {
      const response = await PlayerListAPI.getHistory10MatchAndPlayerList();
      if (response.success && response.data) {
        setHistoryMatches(response.data);
      }
    } catch (error) {
      console.error('Error loading history matches:', error);
    }
  };

  const loadHistoryLineup = (matchData) => {
    const { playerLists } = matchData;

    playerLists.forEach(teamData => {
      const { teamType, players } = teamData;
      const mappedPlayers = players.map(player => ({
        number: player.number,
        name: player.name
      }));

      if (teamType === 'teamA') {
        setLineups(prev => ({
          ...prev,
          home: [...mappedPlayers, ...defaultPlayers.slice(mappedPlayers.length)]
        }));
      } else if (teamType === 'teamB') {
        setLineups(prev => ({
          ...prev,
          away: [...mappedPlayers, ...defaultPlayers.slice(mappedPlayers.length)]
        }));
      }
    });

    setShowHistorySelection(false);
    toast.success('Đã tải đội hình từ trận đấu cũ');
  };

  const handlePlayerChange = (team, index, field, value) => {
    setLineups(prev => ({
      ...prev,
      [team]: prev[team].map((player, i) =>
        i === index ? { ...player, [field]: value } : player
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
          number: "1",
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

    // Sắp xếp theo số áo
    players.sort((a, b) => parseInt(a.number) - parseInt(b.number));

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

  const updateOnly = () => {
    const lineupData = {
      teamA: lineups.home.filter(p => p.name.trim()),
      teamB: lineups.away.filter(p => p.name.trim()),
    };
    console.log("Giá trị của lineupData (cập nhật):", lineupData);

    // Chỉ emit socket, không thay đổi view
    updateLineup(lineupData.teamA, lineupData.teamB);
    onSave(lineupData);
    onClose();
  };

  const validateAndSave = () => {
    const lineupData = {
      teamA: lineups.home.filter(p => p.name.trim()),
      teamB: lineups.away.filter(p => p.name.trim()),
    };
    console.log("Giá trị của lineupData (hiển thị):", lineupData);

    // Emit socket và chuyển view
    updateLineup(lineupData.teamA, lineupData.teamB);
    updateView('player_list');
    onSave(lineupData);
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
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Team Selection */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-2">
          <button
            onClick={() => setActiveTeam("home")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTeam === "home"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm font-medium">
              {matchData.homeTeam?.name || "Đội A"}
            </span>
          </button>
          <button
            onClick={() => setActiveTeam("away")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTeam === "away"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm font-medium">
              {matchData.awayTeam?.name || "Đội B"}
            </span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkMode(!bulkMode)}
            className="h-10 flex items-center justify-center"
          >
            <span className="text-xs">Nhập hàng loạt</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistorySelection(!showHistorySelection)}
            className="h-10 flex items-center justify-center"
          >
            <span className="text-xs">Trận cũ</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={updateOnly}
            className="h-10 flex items-center justify-center text-xs bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
            disabled={isLoading}
          >
            <span className="text-xs">Cập nhật</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={validateAndSave}
            className="h-10 flex items-center justify-center text-xs"
            disabled={isLoading}
          >
            <span className="text-xs">Hiển thị</span>
          </Button>
        </div>

        {/* History Selection Mode */}
        {showHistorySelection && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-60 overflow-y-auto">
            <h4 className="font-medium text-blue-800 mb-3">
              Chọn đội hình từ trận đấu cũ
            </h4>
            <div className="space-y-2">
              {historyMatches.length > 0 ? (
                historyMatches.map((match, index) => (
                  <div
                    key={index}
                    className="border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => loadHistoryLineup(match)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">
                          {match.matchInfo.teamAName} vs {match.matchInfo.teamBName}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(match.matchInfo.matchDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-blue-600">
                          Mã: {match.accessCode}
                        </div>
                      </div>
                      <span className="text-blue-600">→</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Không có dữ liệu trận đấu cũ
                </div>
              )}
            </div>
            <div className="flex justify-end mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistorySelection(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Input Mode */}
        {bulkMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">
              Nhập hàng loạt - {activeTeam === "home" ? "Đội nhà" : "Đội khách"}
            </h4>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Nhập theo format số áo + tên:&#10;1 Mai Đức Anh&#10;12 Hoàng Hải&#10;13 Đức Long&#10;10 Nam Hải&#10;7 Messi&#10;..."
              className="w-full h-40 p-3 border border-yellow-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
              rows={8}
            />
            <div className="flex justify-between items-center mt-3">
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
                {isLoading && <span className="ml-2 text-blue-500">Đang tải...</span>}
              </h4>
              <div className="text-sm text-gray-500">
                {currentTeamData.filter(p => p.name.trim()).length}/11 cầu thủ
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 space-y-2 max-h-[50vh] sm:max-h-[55vh] lg:max-h-[60vh] overflow-y-auto">
            {currentTeamData.map((player, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 min-h-[2rem] py-0.5">
                {/* Số thứ tự */}
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs flex-shrink-0">
                  {index + 1}
                </div>
                
                {/* Số áo có thể chỉnh sửa */}
                <div className="w-12 sm:w-14">
                  <Input
                    value={player.number}
                    onChange={(e) => handlePlayerChange(activeTeam, index, 'number', e.target.value)}
                    className="text-center text-xs sm:text-sm font-bold h-7 sm:h-8"
                    maxLength={3}
                  />
                </div>
                
                {/* Tên cầu thủ */}
                <div className="flex-1 min-w-0">
                  <Input
                    value={player.name}
                    onChange={(e) => handlePlayerChange(activeTeam, index, 'name', e.target.value)}
                    placeholder={`Tên cầu thủ số ${player.number}...`}
                    className="text-sm sm:text-base w-full"
                  />
                </div>
                
                {/* Icon xác nhận */}
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
