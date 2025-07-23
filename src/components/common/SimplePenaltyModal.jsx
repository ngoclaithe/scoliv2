import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import Button from "./Button";

const SimplePenaltyModal = ({ isOpen, onClose, onPenaltyChange, matchData, penaltyData }) => {
  // State đơn giản - chỉ cần tỉ số cơ bản cho backend
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [currentTurn, setCurrentTurn] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  // State theo dõi từng lượt sút (có thể chỉnh sửa)
  const [shootHistory, setShootHistory] = useState([]);

  // Load tỉ số penalty từ props
  useEffect(() => {
    if (isOpen && penaltyData) {
      setHomeScore(penaltyData.homeGoals || 0);
      setAwayScore(penaltyData.awayGoals || 0);
      setCurrentTurn(penaltyData.currentTurn || 'home');
      setShootHistory(penaltyData.shootHistory || []);
    } else if (isOpen) {
      // Reset khi mở modal mới
      setHomeScore(0);
      setAwayScore(0);
      setCurrentTurn('home');
      setShootHistory([]);
    }
  }, [isOpen, penaltyData]);

  // Hàm gửi cập nhật lên parent/backend
  const updatePenaltyScore = useCallback(async (newHomeScore, newAwayScore, newTurn, newShootHistory = null) => {
    setIsLoading(true);

    const penaltyUpdate = {
      homeGoals: newHomeScore,
      awayGoals: newAwayScore,
      currentTurn: newTurn,
      shootHistory: newShootHistory || shootHistory,
      // Đơn giản hóa - chỉ gửi data cần thiết cho backend
      status: 'ongoing',
      lastUpdated: new Date().toISOString()
    };

    try {
      // TODO: Khi có backend, thay thế onPenaltyChange bằng API call
      // await api.updatePenaltyScore(matchId, penaltyUpdate);

      if (onPenaltyChange) {
        onPenaltyChange(penaltyUpdate);
      }
    } catch (error) {
      console.error('Lỗi cập nhật penalty score:', error);
      // TODO: Hiển thị toast error
    } finally {
      setIsLoading(false);
    }
  }, [onPenaltyChange, shootHistory]);

  // Xử lý khi ghi bàn
  const handleGoal = () => {
    const newHomeScore = currentTurn === 'home' ? homeScore + 1 : homeScore;
    const newAwayScore = currentTurn === 'away' ? awayScore + 1 : awayScore;
    const newTurn = currentTurn === 'home' ? 'away' : 'home';

    // Thêm vào lịch sử sút
    const newShoot = {
      id: Date.now(),
      team: currentTurn,
      result: 'goal',
      timestamp: new Date().toISOString(),
      round: Math.ceil((shootHistory.length + 1) / 2)
    };
    const newShootHistory = [...shootHistory, newShoot];

    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);
    setCurrentTurn(newTurn);
    setShootHistory(newShootHistory);

    updatePenaltyScore(newHomeScore, newAwayScore, newTurn, newShootHistory);
  };

  // Xử lý khi miss
  const handleMiss = () => {
    const newTurn = currentTurn === 'home' ? 'away' : 'home';

    // Thêm vào lịch sử sút
    const newShoot = {
      id: Date.now(),
      team: currentTurn,
      result: 'miss',
      timestamp: new Date().toISOString(),
      round: Math.ceil((shootHistory.length + 1) / 2)
    };
    const newShootHistory = [...shootHistory, newShoot];

    setCurrentTurn(newTurn);
    setShootHistory(newShootHistory);
    updatePenaltyScore(homeScore, awayScore, newTurn, newShootHistory);
  };

  // Reset penalty shootout
  const handleReset = () => {
    setHomeScore(0);
    setAwayScore(0);
    setCurrentTurn('home');
    setShootHistory([]);
    updatePenaltyScore(0, 0, 'home', []);
  };

  // Điều chỉnh tỉ số thủ công (cho admin)
  const adjustScore = (team, increment) => {
    if (team === 'home') {
      const newScore = Math.max(0, homeScore + increment);
      setHomeScore(newScore);
      updatePenaltyScore(newScore, awayScore, currentTurn);
    } else {
      const newScore = Math.max(0, awayScore + increment);
      setAwayScore(newScore);
      updatePenaltyScore(homeScore, newScore, currentTurn);
    }
  };

  // Chỉnh sửa kết quả từng lượt sút
  const editShootResult = (shootId, newResult) => {
    const newShootHistory = shootHistory.map(shoot =>
      shoot.id === shootId ? { ...shoot, result: newResult } : shoot
    );

    // Tính lại tỉ số từ lịch sử
    const newHomeScore = newShootHistory.filter(s => s.team === 'home' && s.result === 'goal').length;
    const newAwayScore = newShootHistory.filter(s => s.team === 'away' && s.result === 'goal').length;

    setShootHistory(newShootHistory);
    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);
    updatePenaltyScore(newHomeScore, newAwayScore, currentTurn, newShootHistory);
  };

  // Xóa lượt sút cuối
  const removeLastShoot = () => {
    if (shootHistory.length === 0) return;

    const newShootHistory = shootHistory.slice(0, -1);
    const lastShoot = shootHistory[shootHistory.length - 1];

    // Tính lại tỉ số
    const newHomeScore = newShootHistory.filter(s => s.team === 'home' && s.result === 'goal').length;
    const newAwayScore = newShootHistory.filter(s => s.team === 'away' && s.result === 'goal').length;

    // Đặt lại lượt về team của shoot vừa xóa
    const newTurn = lastShoot.team;

    setShootHistory(newShootHistory);
    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);
    setCurrentTurn(newTurn);
    updatePenaltyScore(newHomeScore, newAwayScore, newTurn, newShootHistory);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🥅 Penalty"
      size="sm"
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="text-red-600 hover:bg-red-50 text-xs py-1 px-2"
            disabled={isLoading}
          >
            🔄 Reset
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs py-1 px-3"
          >
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        {/* Thông báo backend ready */}
        <div className="bg-blue-50 border border-blue-200 rounded p-1 text-center">
          <span className="text-blue-700 text-xs">
            ⚡ Sẵn sàng đồng bộ backend
          </span>
        </div>

        {/* Tỉ số hiện tại */}
        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded p-2 border">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-xs font-semibold text-blue-700 mb-1">
                {matchData?.homeTeam?.name || "ĐỘI NHÀ"}
              </div>
              <div className="text-2xl font-bold text-blue-800 mb-1">{homeScore}</div>

              {/* Điều chỉnh tỉ số */}
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => adjustScore('home', -1)}
                  className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 text-xs hover:bg-blue-300 disabled:opacity-50"
                  disabled={isLoading || homeScore === 0}
                >
                  -
                </button>
                <button
                  onClick={() => adjustScore('home', 1)}
                  className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 text-xs hover:bg-blue-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-xl font-bold text-gray-400">-</div>

            <div className="text-center">
              <div className="text-xs font-semibold text-red-700 mb-1">
                {matchData?.awayTeam?.name || "ĐỘI KHÁCH"}
              </div>
              <div className="text-2xl font-bold text-red-800 mb-1">{awayScore}</div>

              {/* Điều chỉnh tỉ số */}
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => adjustScore('away', -1)}
                  className="w-4 h-4 rounded-full bg-red-200 text-red-700 text-xs hover:bg-red-300 disabled:opacity-50"
                  disabled={isLoading || awayScore === 0}
                >
                  -
                </button>
                <button
                  onClick={() => adjustScore('away', 1)}
                  className="w-4 h-4 rounded-full bg-red-200 text-red-700 text-xs hover:bg-red-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử các lượt sút */}
        {shootHistory.length > 0 && (
          <div className="bg-gray-50 rounded p-2 border">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium text-gray-800 text-xs">📝 Lịch sử:</h4>
              <button
                onClick={removeLastShoot}
                className="px-1 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
                disabled={isLoading || shootHistory.length === 0}
              >
                🗑️
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1 max-h-16 overflow-y-auto">
              {shootHistory.map((shoot, index) => (
                <div key={shoot.id} className="flex items-center justify-between bg-white rounded p-1 border">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-mono bg-gray-100 px-1 rounded">
                      #{index + 1}
                    </span>
                    <span className={`text-xs ${
                      shoot.team === 'home' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {shoot.team === 'home' ? 'NH' : 'K'}
                    </span>
                    <span className={`text-xs px-1 rounded ${
                      shoot.result === 'goal'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {shoot.result === 'goal' ? '✅' : '❌'}
                    </span>
                  </div>

                  <button
                    onClick={() => editShootResult(shoot.id, shoot.result === 'goal' ? 'miss' : 'goal')}
                    className="px-1 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    🔄
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lượt hiện tại */}
        <div className={`p-2 rounded border-2 ${
          currentTurn === 'home'
            ? 'bg-blue-50 border-blue-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="text-center">
            <h3 className={`text-sm font-bold mb-2 ${
              currentTurn === 'home' ? 'text-blue-800' : 'text-red-800'
            }`}>
              #{shootHistory.length + 1}: {
                currentTurn === 'home'
                  ? matchData?.homeTeam?.name || "ĐỘI NHÀ"
                  : matchData?.awayTeam?.name || "ĐỘI KHÁCH"
              }
            </h3>

            <div className="flex justify-center space-x-2">
              <button
                onClick={handleGoal}
                className="px-3 py-2 rounded text-xs font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "..." : "✅ GHI BÀN"}
              </button>

              <button
                onClick={handleMiss}
                className="px-3 py-2 rounded text-xs font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "..." : "❌ MISS"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview cho livestream */}
        <div className="bg-gray-50 rounded p-2 border">
          <h4 className="font-medium text-gray-800 mb-1 text-xs text-center">
            📺 Preview:
          </h4>
          <div className="bg-white rounded border p-2">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">🥅 PENALTY</div>
              <div className="flex items-center justify-center space-x-2">
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-xs">{matchData?.homeTeam?.name || "ĐỘI-A"}</div>
                  <div className="text-lg font-bold text-blue-800">{homeScore}</div>
                </div>
                <div className="text-gray-400 text-sm">-</div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-xs">{matchData?.awayTeam?.name || "ĐỘI-B"}</div>
                  <div className="text-lg font-bold text-red-800">{awayScore}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Lượt: {currentTurn === 'home' ? 'NH' : 'K'}
              </div>
            </div>
          </div>
        </div>

        {/* Data structure info for backend */}
        <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer font-medium">📋 Data structure cho backend</summary>
            <pre className="mt-2 text-xs">
{JSON.stringify({
  homeGoals: homeScore,
  awayGoals: awayScore,
  currentTurn: currentTurn,
  shootHistory: shootHistory,
  status: 'ongoing',
  lastUpdated: new Date().toISOString()
}, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </Modal>
  );
};

export default SimplePenaltyModal;
