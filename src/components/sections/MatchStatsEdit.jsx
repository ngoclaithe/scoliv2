import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import PlayerListAPI from '../../API/apiPlayerList';
import { useMatch } from '../../contexts/MatchContext';

const MatchStatsEdit = ({
  matchStats,
  futsalErrors,
  onUpdateStats,
  onUpdateFutsalErrors,
  onUpdateGoalScorers,
  onUpdateView,
  onPlayAudio,
  accessCode,
}) => {
  const { handleCardEvent } = useMatch();
  const [goalScorers, setGoalScorers] = useState({
    teamA: { player: '', minute: '' },
    teamB: { player: '', minute: '' }
  });
  const [playersTeamA, setPlayersTeamA] = useState([]);
  const [playersTeamB, setPlayersTeamB] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchPaused, setMatchPaused] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState(null);
  const [matchDuration, setMatchDuration] = useState(90); // phút
  const [teamAControlling, setTeamAControlling] = useState(false);
  const [teamBControlling, setTeamBControlling] = useState(false);
  const [possessionStartTime, setPossessionStartTime] = useState(null);
  const [currentController, setCurrentController] = useState(null);
  const [totalPossessionA, setTotalPossessionA] = useState(0); // tính bằng ms
  const [totalPossessionB, setTotalPossessionB] = useState(0); // tính bằng ms

  // Local state cho các chỉ số cần manual update
  const [localStats, setLocalStats] = useState({
    possession: { team1: 50, team2: 50 },
    totalShots: { team1: 0, team2: 0 },
    shotsOnTarget: { team1: 0, team2: 0 },
    corners: { team1: 0, team2: 0 },
    fouls: { team1: 0, team2: 0 }
  });

  // Khởi tạo localStats từ matchStats khi component mount
  useEffect(() => {
    setLocalStats({
      possession: matchStats.possession || { team1: 50, team2: 50 },
      totalShots: matchStats.totalShots || { team1: 0, team2: 0 },
      shotsOnTarget: matchStats.shotsOnTarget || { team1: 0, team2: 0 },
      corners: matchStats.corners || { team1: 0, team2: 0 },
      fouls: matchStats.fouls || { team1: 0, team2: 0 }
    });
  }, [matchStats]);

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
            _id: player._id || `${player.name}_${index}`,
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

  // Hàm update local stats (không gọi onUpdateStats)
  const updateLocalStat = (statKey, team, increment) => {
    setLocalStats(prev => {
      const currentValue = prev[statKey][team] || 0;
      const newValue = Math.max(0, currentValue + increment);
      
      return {
        ...prev,
        [statKey]: {
          ...prev[statKey],
          [team]: newValue
        }
      };
    });
  };

  // Hàm update local possession (không gọi onUpdateStats)
  const updateLocalPossession = (team, increment) => {
    setLocalStats(prev => {
      const currentValue = prev.possession[team] || 0;
      const newValue = Math.max(0, Math.min(100, currentValue + increment));
      const otherTeam = team === 'team1' ? 'team2' : 'team1';
      const otherValue = 100 - newValue;

      return {
        ...prev,
        possession: {
          [team]: newValue,
          [otherTeam]: otherValue
        }
      };
    });
  };

  // Hàm manual update - gửi tất cả local stats lên backend
  const handleManualUpdate = () => {
    const newStats = {
      ...matchStats,
      ...localStats
    };
    onUpdateStats(newStats);
  };

  const startMatch = () => {
    const startTime = Date.now();
    setMatchStarted(true);
    setMatchStartTime(startTime);
    setPossessionStartTime(startTime);
    setCurrentController(null);
    setTotalPossessionA(0);
    setTotalPossessionB(0);
  };

  const handlePossessionChange = (team) => {
    const now = Date.now();

    if (!matchStarted || !matchStartTime) return;

    // Cập nhật thời gian kiểm soát của đội trước đó
    if (currentController && possessionStartTime) {
      const duration = now - possessionStartTime;
      if (currentController === 'teamA') {
        setTotalPossessionA(prev => prev + duration);
      } else if (currentController === 'teamB') {
        setTotalPossessionB(prev => prev + duration);
      }
    }

    // Cập nhật đội hi���n tại kiểm soát
    setCurrentController(team);
    setPossessionStartTime(now);

    // Cập nhật UI checkboxes
    if (team === 'teamA') {
      setTeamAControlling(true);
      setTeamBControlling(false);
    } else if (team === 'teamB') {
      setTeamAControlling(false);
      setTeamBControlling(true);
    }
  };

  // Tính toán % kiểm soát theo thời gian thực
  const calculatePossessionPercentage = () => {
    if (!matchStarted || !matchStartTime) return { team1: 50, team2: 50 };

    const now = Date.now();
    const totalMatchTime = now - matchStartTime;

    let currentTotalA = totalPossessionA;
    let currentTotalB = totalPossessionB;

    // Thêm thời gian hiện tại nếu có đội đang kiểm soát
    if (currentController === 'teamA' && possessionStartTime) {
      currentTotalA += (now - possessionStartTime);
    } else if (currentController === 'teamB' && possessionStartTime) {
      currentTotalB += (now - possessionStartTime);
    }

    const totalPossessionTime = currentTotalA + currentTotalB;

    if (totalPossessionTime === 0) {
      return { team1: 50, team2: 50 };
    }

    const percentageA = Math.round((currentTotalA / totalPossessionTime) * 100);
    const percentageB = 100 - percentageA;

    return { team1: percentageA, team2: percentageB };
  };

  // Cập nhật local possession stats theo thời gian thực (không gọi onUpdateStats)
  useEffect(() => {
    if (!matchStarted) return;

    const interval = setInterval(() => {
      const newPossession = calculatePossessionPercentage();
      setLocalStats(prev => ({
        ...prev,
        possession: newPossession
      }));
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(interval);
  }, [matchStarted, currentController, possessionStartTime, totalPossessionA, totalPossessionB]);

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

  const handleCardEventLocal = (team, cardType) => {
    const scorer = goalScorers[team];
    const playerValue = scorer?.player || '';
    const minuteValue = scorer?.minute || '';

    if (playerValue.trim() && minuteValue.trim()) {
      const players = team === 'teamA' ? playersTeamA : playersTeamB;
      const playerInfo = players.find(p => p._id === playerValue) ||
                        players.find(p => p.name === playerValue);

      const playerData = {
        id: playerInfo?._id || playerValue,
        name: playerInfo?.name || playerValue
      };

      // Gọi hàm từ MatchContext
      handleCardEvent(team, cardType, playerData, minuteValue);

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

  const PlayerDropdown = ({ team, players, selectedPlayerId, onSelect, show, onToggle }) => {
    const [searchText, setSearchText] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    // Lọc danh sách cầu thủ theo text search
    const filteredPlayers = players.filter(player =>
      player.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchText(value);
      // Nếu không có dropdown hiển thị và người dùng đang nhập, hiện dropdown
      if (!show && value.trim()) {
        onToggle();
      }
    };

    const handleInputFocus = () => {
      setIsInputFocused(true);
      // Hiện dropdown khi focus vào input
      if (!show) {
        onToggle();
      }
    };

    const handleInputBlur = () => {
      setIsInputFocused(false);
      // Delay để cho phép click vào dropdown item
      setTimeout(() => {
        if (!isInputFocused) {
          setSearchText('');
        }
      }, 200);
    };

    const handlePlayerSelect = (playerId, playerName) => {
      onSelect(team, playerId, playerName);
      setSearchText('');
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && searchText.trim()) {
        // Nếu có text, sử dụng làm tên cầu thủ manual
        onSelect(team, searchText.trim(), searchText.trim());
        setSearchText('');
      }
    };

    // Hiển thị giá trị trong input
    const getDisplayValue = () => {
      if (searchText) return searchText;
      if (selectedPlayerId) {
        return getSelectedPlayerName(team, selectedPlayerId) || selectedPlayerId;
      }
      return '';
    };

    return (
      <div className="relative flex-1">
        <input
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          placeholder="Chọn hoặc nhập tên cầu thủ..."
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-gray-700 focus:outline-none bg-white"
        />

        {show && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto z-10">
            {loadingPlayers ? (
              <div className="px-2 py-1 text-xs text-gray-500">Đang tải...</div>
            ) : (
              <>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <div
                      key={player._id}
                      className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()} // Ngăn blur khi click
                      onClick={() => handlePlayerSelect(player._id, player.name)}
                    >
                      {player.name} {player.jerseyNumber && `(#${player.jerseyNumber})`}
                    </div>
                  ))
                ) : (
                  searchText ? (
                    <div
                      className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 cursor-pointer font-medium"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onSelect(team, searchText.trim(), searchText.trim());
                        setSearchText('');
                      }}
                    >
                      ✏️ Sử dụng "{searchText}"
                    </div>
                  ) : (
                    <div className="px-2 py-1 text-xs text-gray-500">Không tìm thấy cầu thủ</div>
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

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
            onClick={handleManualUpdate}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-xs font-bold text-center">Cập nhật</span>
          </button>
          <button
            onClick={() => {
              onUpdateView('event');
              onPlayAudio('poster');
            }}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-xs font-bold text-center">Sự kiện</span>
          </button>
          <button
            onClick={() => {
              onUpdateView('stat');
              onPlayAudio('poster');
            }}
            className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-xs font-bold text-center">Chỉ số</span>
          </button>
        </div>
      </div>

      {/* Stats Display - Gom chung vào 1 thẻ với padding và spacing giảm */}
      <div className="bg-gray-50 rounded-lg p-1.5 space-y-1">
        {/* Kiểm soát bóng */}
        <div className="py-0.5">
          <div className="text-center mb-1">
            <span className="font-medium text-gray-700 text-sm">Kiểm soát bóng</span>
          </div>

          {/* Button trận đấu bắt đầu và select thời gian */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={startMatch}
              disabled={matchStarted}
              className={`px-3 py-1 text-xs rounded font-medium ${
                matchStarted
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {matchStarted ? '✓ Đã bắt đầu' : 'Trận đấu bắt đầu'}
            </button>
            <select
              value={matchDuration}
              onChange={(e) => setMatchDuration(parseInt(e.target.value))}
              disabled={matchStarted}
              className="px-2 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            >
              <option value={40}>40 phút</option>
              <option value={50}>50 phút</option>
              <option value={60}>60 phút</option>
              <option value={70}>70 phút</option>
              <option value={80}>80 phút</option>
              <option value={90}>90 phút</option>
            </select>
          </div>

          {/* Hiển thị % kiểm soát - sử dụng localStats */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center border border-red-300 rounded">
                {localStats.possession.team1}%
              </div>
            </div>
            <div className="text-gray-400 text-xs">vs</div>
            <div className="flex-1">
              <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold min-w-8 text-center border border-gray-300 rounded">
                {localStats.possession.team2}%
              </div>
            </div>
          </div>

          {/* Checkbox kiểm soát bóng */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={teamAControlling}
                  onChange={() => handlePossessionChange('teamA')}
                  disabled={!matchStarted}
                  className="w-3 h-3"
                />
                <span className="text-red-600 font-medium">Đội A kiểm soát</span>
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-1 text-xs justify-end">
                <span className="text-gray-600 font-medium">Đội B kiểm soát</span>
                <input
                  type="checkbox"
                  checked={teamBControlling}
                  onChange={() => handlePossessionChange('teamB')}
                  disabled={!matchStarted}
                  className="w-3 h-3"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Tổng số cú sút - sử dụng local stats */}
        <StatControl
          label="Tổng số cú sút"
          statKey="totalShots"
          team1Value={localStats.totalShots.team1}
          team2Value={localStats.totalShots.team2}
          onUpdate={(team, increment) => updateLocalStat('totalShots', team, increment)}
        />

        {/* Sút trúng đích - sử dụng local stats */}
        <StatControl
          label="Sút trúng đích"
          statKey="shotsOnTarget"
          team1Value={localStats.shotsOnTarget.team1}
          team2Value={localStats.shotsOnTarget.team2}
          onUpdate={(team, increment) => updateLocalStat('shotsOnTarget', team, increment)}
        />

        {/* Phạt góc - sử dụng local stats */}
        <StatControl
          label="Phạt góc"
          statKey="corners"
          team1Value={localStats.corners.team1}
          team2Value={localStats.corners.team2}
          onUpdate={(team, increment) => updateLocalStat('corners', team, increment)}
        />

        {/* Thẻ vàng - chỉ hiển thị, không cho chỉnh tay */}
        <div className="py-0.5">
          <div className="text-center mb-0.5">
            <span className="font-medium text-gray-700 text-sm">Thẻ vàng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold min-w-8 text-center border border-yellow-300 rounded">
                {Array.isArray(matchStats.yellowCards?.team1) ? matchStats.yellowCards.team1.length : matchStats.yellowCards?.team1 || 0}
              </div>
            </div>
            <div className="text-gray-400 text-xs">vs</div>
            <div className="flex-1">
              <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold min-w-8 text-center border border-yellow-300 rounded">
                {Array.isArray(matchStats.yellowCards?.team2) ? matchStats.yellowCards.team2.length : matchStats.yellowCards?.team2 || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Thẻ đỏ - chỉ hiển thị, không cho chỉnh tay */}
        <div className="py-0.5">
          <div className="text-center mb-0.5">
            <span className="font-medium text-gray-700 text-sm">Thẻ đỏ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center border border-red-300 rounded">
                {Array.isArray(matchStats.redCards?.team1) ? matchStats.redCards.team1.length : matchStats.redCards?.team1 || 0}
              </div>
            </div>
            <div className="text-gray-400 text-xs">vs</div>
            <div className="flex-1">
              <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center border border-red-300 rounded">
                {Array.isArray(matchStats.redCards?.team2) ? matchStats.redCards.team2.length : matchStats.redCards?.team2 || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Phạm lỗi - sử dụng local stats */}
        <StatControl
          label="Phạm lỗi"
          statKey="fouls"
          team1Value={localStats.fouls.team1}
          team2Value={localStats.fouls.team2}
          onUpdate={(team, increment) => updateLocalStat('fouls', team, increment)}
        />

        {/* Lỗi Futsal - giữ nguyên logic update ngay lập tức */}
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

        {/* Cầu thủ ghi bàn - giữ nguyên logic */}
        <div className="py-0.5 border-t border-gray-200 pt-1">
          <div className="text-center mb-1.5">
            <span className="font-medium text-gray-700 text-sm">Sự kiện</span>
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
                ⚽
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border border-yellow-500 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                onClick={() => handleCardEventLocal('teamA', 'yellow')}
                disabled={!(goalScorers?.teamA?.player?.trim()) || !(goalScorers?.teamA?.minute?.trim())}
              >
                🟨
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border border-red-500 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleCardEventLocal('teamA', 'red')}
                disabled={!(goalScorers?.teamA?.player?.trim()) || !(goalScorers?.teamA?.minute?.trim())}
              >
                🟥
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
                ⚽
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border border-yellow-500 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                onClick={() => handleCardEventLocal('teamB', 'yellow')}
                disabled={!(goalScorers?.teamB?.player?.trim()) || !(goalScorers?.teamB?.minute?.trim())}
              >
                🟨
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 text-xs border border-red-500 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleCardEventLocal('teamB', 'red')}
                disabled={!(goalScorers?.teamB?.player?.trim()) || !(goalScorers?.teamB?.minute?.trim())}
              >
                🟥
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStatsEdit;
