import React, { useState } from 'react';
import Button from '../common/Button';

const MatchStatsEdit = ({
  matchStats,
  futsalErrors,
  onUpdateStats,
  onUpdateFutsalErrors,
  onUpdateGoalScorers,
  onUpdateView,
  onPlayAudio
}) => {
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [goalScorers, setGoalScorers] = useState({
    teamA: { player: '', minute: '' },
    teamB: { player: '', minute: '' }
  });

  // Hàm cập nhật thống kê với nút +/-
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
    <div className="py-1">
      <div className="text-center mb-1">
        <span className="font-medium text-gray-700 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center bg-white rounded border border-gray-300">
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs border-0 hover:bg-red-50 text-red-600"
              onClick={() => onUpdate('team1', -1)}
            >
              -
            </Button>
            <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center">
              {team1Value}{isPercentage ? '%' : ''}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs border-0 hover:bg-red-50 text-red-600"
              onClick={() => onUpdate('team1', 1)}
            >
              +
            </Button>
          </div>
        </div>
        <div className="text-gray-400 text-xs">vs</div>
        <div className="flex-1">
          <div className="flex items-center bg-white rounded border border-gray-300">
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs border-0 hover:bg-gray-50 text-gray-600"
              onClick={() => onUpdate('team2', -1)}
            >
              -
            </Button>
            <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold min-w-8 text-center">
              {team2Value}{isPercentage ? '%' : ''}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs border-0 hover:bg-gray-50 text-gray-600"
              onClick={() => onUpdate('team2', 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleAddGoalScorer = (team) => {
    const scorer = goalScorers[team];
    if (scorer.player.trim() && scorer.minute.trim()) {
      // Emit socket để thêm cầu thủ ghi bàn
      console.log(`Thêm cầu thủ ghi bàn ${team}:`, scorer);
      // Reset input
      setGoalScorers(prev => ({
        ...prev,
        [team]: { player: '', minute: '' }
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
      {/* Header với nút chỉnh sửa và thống kê */}
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

      {/* Stats Display - Gom chung vào 1 thẻ */}
      <div className="bg-gray-50 rounded-lg p-2 space-y-2">
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
        <div className="py-1">
          <div className="text-center mb-1">
            <span className="font-medium text-gray-700 text-sm">Lỗi Futsal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center bg-white rounded border border-gray-300">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs border-0 hover:bg-red-50 text-red-600"
                  onClick={() => onUpdateFutsalErrors('teamA', -1)}
                >
                  -
                </Button>
                <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold min-w-8 text-center">
                  {futsalErrors.teamA}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs border-0 hover:bg-red-50 text-red-600"
                  onClick={() => onUpdateFutsalErrors('teamA', 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="text-gray-400 text-xs">vs</div>
            <div className="flex-1">
              <div className="flex items-center bg-white rounded border border-gray-300">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs border-0 hover:bg-gray-50 text-gray-600"
                  onClick={() => onUpdateFutsalErrors('teamB', -1)}
                >
                  -
                </Button>
                <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold min-w-8 text-center">
                  {futsalErrors.teamB}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 py-1 text-xs border-0 hover:bg-gray-50 text-gray-600"
                  onClick={() => onUpdateFutsalErrors('teamB', 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cầu thủ ghi bàn */}
        <div className="py-1 border-t border-gray-200 pt-2">
          <div className="text-center mb-2">
            <span className="font-medium text-gray-700 text-sm">Cầu thủ ghi bàn</span>
          </div>
          
          {/* Đội A */}
          <div className="mb-2">
            <div className="text-xs text-red-600 mb-1">Đội A:</div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Tên cầu thủ"
                value={goalScorers.teamA.player}
                onChange={(e) => setGoalScorers(prev => ({
                  ...prev,
                  teamA: { ...prev.teamA, player: e.target.value }
                }))}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:border-red-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Phút"
                value={goalScorers.teamA.minute}
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
                disabled={!goalScorers.teamA.player.trim() || !goalScorers.teamA.minute.trim()}
              >
                OK
              </Button>
            </div>
          </div>

          {/* Đội B */}
          <div>
            <div className="text-xs text-gray-800 mb-1">Đội B:</div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Tên cầu thủ"
                value={goalScorers.teamB.player}
                onChange={(e) => setGoalScorers(prev => ({
                  ...prev,
                  teamB: { ...prev.teamB, player: e.target.value }
                }))}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:border-gray-700 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Phút"
                value={goalScorers.teamB.minute}
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
                disabled={!goalScorers.teamB.player.trim() || !goalScorers.teamB.minute.trim()}
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
