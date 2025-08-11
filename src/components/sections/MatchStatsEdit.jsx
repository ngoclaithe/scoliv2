import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import PlayerListAPI from '../../API/apiPlayerList';

const MatchStatsEdit = ({
  matchStats,
  futsalErrors,
  onUpdateStats,
  onUpdateFutsalErrors,
  onUpdateGoalScorers,
  onUpdateView,
  onPlayAudio,
  accessCode 
}) => {
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [goalScorers, setGoalScorers] = useState({
    teamA: { player: '', minute: '' },
    teamB: { player: '', minute: '' }
  });
  const [playersTeamA, setPlayersTeamA] = useState([]);
  const [playersTeamB, setPlayersTeamB] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  // Fetch danh sách cầu thủ khi component mount
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!accessCode) {
        setPlayersTeamA([]);
        setPlayersTeamB([]);
        return;
      }

      setLoadingPlayers(true);
      try {
        const [teamAResponse, teamBResponse] = await Promise.all([
          PlayerListAPI.getPlayerListByAccessCode(accessCode, 'teamA'),
          PlayerListAPI.getPlayerListByAccessCode(accessCode, 'teamB')
        ]);

        // Xử lý dữ liệu players từ API response
        const processPlayers = (players) => {
          if (!Array.isArray(players)) return [];
          return players.map((player, index) => ({
            _id: player._id || `${player.name}_${index}`, // Tạo _id nếu không có
            name: player.name || '',
            jerseyNumber: player.number || player.jerseyNumber || ''
          }));
        };

        setPlayersTeamA(processPlayers(teamAResponse.data?.players || []));
        setPlayersTeamB(processPlayers(teamBResponse.data?.players || []));
      } catch (error) {
        setPlayersTeamA([]);
        setPlayersTeamB([]);

        if (!error.message.includes('AccessCode is not associated to PlayerList')) {
          console.error('Error fetching players:', error);
        }
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [accessCode]);

  const updateStat = (statKey, team, increment) => {
    const currentValue = matchStats[statKey][team] || 0;
    const newValue = Math.max(0, currentValue + increment);
    
    const newStats = {
      ...matchStats,
      [statKey]: {
        ...matchStats[statKey],
        [team]: newValue
      }
    };
    onUpdateStats(newStats);
  };

  const updatePossession = (team, increment) => {
    const currentValue = matchStats.possession[team] || 0;
    const newValue = Math.max(0, Math.min(100, currentValue + increment));
    const otherTeam = team === 'team1' ? 'team2' : 'team1';
    const otherValue = 100 - newValue;

    const newStats = {
      ...matchStats,
      possession: {
        [team]: newValue,
        [otherTeam]: otherValue
      }
    };
    onUpdateStats(newStats);
  };

  const StatControl = ({ label, statKey, team1Value, team2Value, isPercentage = false, onUpdate }) => (
    <div className="py-0.5">
      <div className="text-center mb-0.5">
        <span className="font-medium text-gray-700 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-stretch bg-white rounded border border-gray-300 overflow-hidden">
            <button
              className="px-2 py-1 text-xs bg-white hover:bg-red-50 text-red-600 border-r border-gray-300 transition-colors duration-150"
              onClick={() => onUpdate('team1', -1)}
            >
              -
            </button>
            <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center flex-1">
              {team1Value}{isPercentage ? '%' : ''}
            </div>
            <button
              className="px-2 py-1 text-xs bg-white hover:bg-red-50 text-red-600 border-l border-gray-300 transition-colors duration-150"
              onClick={() => onUpdate('team1', 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="text-gray-400 text-xs">vs</div>
        <div className="flex-1">
          <div className="flex items-stretch bg-white rounded border border-gray-300 overflow-hidden">
            <button
              className="px-2 py-1 text-xs bg-white hover:bg-gray-50 text-gray-600 border-r border-gray-300 transition-colors duration-150"
              onClick={() => onUpdate('team2', -1)}
            >
              -
            </button>
            <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold min-w-8 text-center flex-1">
              {team2Value}{isPercentage ? '%' : ''}
            </div>
            <button
              className="px-2 py-1 text-xs bg-white hover:bg-gray-50 text-gray-600 border-l border-gray-300 transition-colors duration-150"
              onClick={() => onUpdate('team2', 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleAddGoalScorer = (team) => {
    const scorer = goalScorers[team];
    // Kiểm tra an toàn với optional chaining và fallback
    const playerValue = scorer?.player || '';
    const minuteValue = scorer?.minute || '';
    
    if (playerValue.trim() && minuteValue.trim()) {
      // Tìm thông tin chi tiết của cầu thủ
      const players = team === 'teamA' ? playersTeamA : playersTeamB;
      const playerInfo = players.find(p => p._id === playerValue) ||
                        players.find(p => p.name === playerValue);

      onUpdateGoalScorers(team, {
        playerId: playerInfo?._id || playerValue,
        player: playerInfo?.name || playerValue,
        minute: parseInt(minuteValue)
      });

      // Reset input
      setGoalScorers(prev => ({
        ...prev,
        [team]: { player: '', minute: '' }
      }));

      // Đóng dropdown
      if (team === 'teamA') setShowDropdownA(false);
      if (team === 'teamB') setShowDropdownB(false);
    }
  };

  const handlePlayerSelect = (team, playerId, playerName) => {
    setGoalScorers(prev => ({
      ...prev,
      [team]: { ...prev[team], player: playerId }
    }));

    if (team === 'teamA') setShowDropdownA(false);
    if (team === 'teamB') setShowDropdownB(false);
  };

  const getSelectedPlayerName = (team, playerId) => {
    const players = team === 'teamA' ? playersTeamA : playersTeamB;
    const player = players.find(p => p._id === playerId);
    return player?.name || '';
  };

  const PlayerDropdown = ({ team, players, selectedPlayerId, onSelect, show, onToggle }) => (
    <div className="relative flex-1">
      <div
        className="flex items-center justify-between px-2 py-1 text-xs border border-gray-300 rounded focus:border-gray-700 focus:outline-none cursor-pointer bg-white"
        onClick={onToggle}
      >
        <span className={selectedPlayerId ? "text-gray-900" : "text-gray-500"}>
          {selectedPlayerId ? getSelectedPlayerName(team, selectedPlayerId) : "Chọn cầu thủ"}
        </span>
        <span className="text-gray-400">▼</span>
      </div>

      {show && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-32 overflow-y-auto z-10">
          {loadingPlayers ? (
            <div className="px-2 py-1 text-xs text-gray-500">Đang tải...</div>
          ) : players.length === 0 ? (
            <div className="px-2 py-1 text-xs text-gray-500">Không có cầu thủ</div>
          ) : (
            players.map((player) => (
              <div
                key={player._id}
                className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelect(team, player._id, player.name)}
              >
                {player.name} {player.jerseyNumber && `(#${player.jerseyNumber})`}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  // Click outside handler để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.player-dropdown')) {
        setShowDropdownA(false);
        setShowDropdownB(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-gray-900">Thông số trận đấu</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onUpdateView('stat');
              onPlayAudio('poster');
            }}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-sm mr-1">📊</span>
            <span className="text-xs font-bold text-center">THỐNG KÊ</span>
          </button>
        </div>
      </div>

      {/* Stats Display - Gom chung vào 1 thẻ với padding và spacing giảm */}
      <div className="bg-gray-50 rounded-lg p-1.5 space-y-1">
        {/* Kiểm soát bóng */}
        <StatControl
          label="Kiểm soát bóng"
          statKey="possession"
          team1Value={matchStats.possession.team1}
          team2Value={matchStats.possession.team2}
          isPercentage={true}
          onUpdate={(team, increment) => updatePossession(team, increment * 5)}
        />

        {/* Tổng số cú sút */}
        <StatControl
          label="Tổng số cú sút"
          statKey="totalShots"
          team1Value={matchStats.totalShots.team1}
          team2Value={matchStats.totalShots.team2}
          onUpdate={(team, increment) => updateStat('totalShots', team, increment)}
        />

        {/* Sút trúng đích */}
        <StatControl
          label="Sút trúng đích"
          statKey="shotsOnTarget"
          team1Value={matchStats.shotsOnTarget.team1}
          team2Value={matchStats.shotsOnTarget.team2}
          onUpdate={(team, increment) => updateStat('shotsOnTarget', team, increment)}
        />

        {/* Phạt góc */}
        <StatControl
          label="Phạt góc"
          statKey="corners"
          team1Value={matchStats.corners.team1}
          team2Value={matchStats.corners.team2}
          onUpdate={(team, increment) => updateStat('corners', team, increment)}
        />

        {/* Thẻ vàng */}
        <StatControl
          label="Thẻ vàng"
          statKey="yellowCards"
          team1Value={matchStats.yellowCards.team1}
          team2Value={matchStats.yellowCards.team2}
          onUpdate={(team, increment) => updateStat('yellowCards', team, increment)}
        />

        {/* Phạm lỗi */}
        <StatControl
          label="Phạm lỗi"
          statKey="fouls"
          team1Value={matchStats.fouls.team1}
          team2Value={matchStats.fouls.team2}
          onUpdate={(team, increment) => updateStat('fouls', team, increment)}
        />

        {/* Lỗi Futsal */}
        <div className="py-0.5">
          <div className="text-center mb-0.5">
            <span className="font-medium text-gray-700 text-sm">Lỗi Futsal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-stretch bg-white rounded border border-gray-300 overflow-hidden">
                <button
                  className="px-2 py-1 text-xs bg-white hover:bg-red-50 text-red-600 border-r border-gray-300 transition-colors duration-150"
                  onClick={() => onUpdateFutsalErrors('teamA', -1)}
                >
                  -
                </button>
                <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center flex-1">
                  {futsalErrors.teamA}
                </div>
                <button
                  className="px-2 py-1 text-xs bg-white hover:bg-red-50 text-red-600 border-l border-gray-300 transition-colors duration-150"
                  onClick={() => onUpdateFutsalErrors('teamA', 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-gray-400 text-xs">vs</div>
            <div className="flex-1">
              <div className="flex items-stretch bg-white rounded border border-gray-300 overflow-hidden">
                <button
                  className="px-2 py-1 text-xs bg-white hover:bg-gray-50 text-gray-600 border-r border-gray-300 transition-colors duration-150"
                  onClick={() => onUpdateFutsalErrors('teamB', -1)}
                >
                  -
                </button>
                <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold min-w-8 text-center flex-1">
                  {futsalErrors.teamB}
                </div>
                <button
                  className="px-2 py-1 text-xs bg-white hover:bg-gray-50 text-gray-600 border-l border-gray-300 transition-colors duration-150"
                  onClick={() => onUpdateFutsalErrors('teamB', 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cầu thủ ghi bàn */}
        <div className="py-0.5 border-t border-gray-200 pt-1">
          <div className="text-center mb-1.5">
            <span className="font-medium text-gray-700 text-sm">Cầu thủ ghi bàn</span>
          </div>
          
          {/* Đội A */}
          <div className="mb-1.5">
            <div className="text-xs text-red-600 mb-0.5">Đội A:</div>
            <div className="flex items-center gap-1 player-dropdown">
              <PlayerDropdown
                team="teamA"
                players={playersTeamA}
                selectedPlayerId={goalScorers?.teamA?.player || ''}
                onSelect={handlePlayerSelect}
                show={showDropdownA}
                onToggle={() => setShowDropdownA(!showDropdownA)}
              />
              <input
                type="number"
                placeholder="Phút"
                value={goalScorers?.teamA?.minute || ''}
                onChange={(e) => setGoalScorers(prev => ({
                  ...prev,
                  teamA: { ...prev.teamA, minute: e.target.value }
                }))}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:border-red-500 focus:outline-none text-center"
                min="1"
                max="120"
              />
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border border-red-500 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleAddGoalScorer('teamA')}
                disabled={!(goalScorers?.teamA?.player?.trim()) || !(goalScorers?.teamA?.minute?.trim())}
              >
                OK
              </Button>
            </div>
          </div>

          {/* Đội B */}
          <div>
            <div className="text-xs text-gray-800 mb-0.5">Đội B:</div>
            <div className="flex items-center gap-1 player-dropdown">
              <PlayerDropdown
                team="teamB"
                players={playersTeamB}
                selectedPlayerId={goalScorers?.teamB?.player || ''}
                onSelect={handlePlayerSelect}
                show={showDropdownB}
                onToggle={() => setShowDropdownB(!showDropdownB)}
              />
              <input
                type="number"
                placeholder="Phút"
                value={goalScorers?.teamB?.minute || ''}
                onChange={(e) => setGoalScorers(prev => ({
                  ...prev,
                  teamB: { ...prev.teamB, minute: e.target.value }
                }))}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:border-gray-700 focus:outline-none text-center"
                min="1"
                max="120"
              />
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border border-gray-700 bg-gray-700 text-white rounded hover:bg-gray-800"
                onClick={() => handleAddGoalScorer('teamB')}
                disabled={!(goalScorers?.teamB?.player?.trim()) || !(goalScorers?.teamB?.minute?.trim())}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStatsEdit;