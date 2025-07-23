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
    
    setHomeScore(newHomeScore);
    setAwayScore(newAwayScore);
    setCurrentTurn(newTurn);
    
    updatePenaltyScore(newHomeScore, newAwayScore, newTurn);
  };

  // Xử lý khi miss
  const handleMiss = () => {
    const newTurn = currentTurn === 'home' ? 'away' : 'home';
    setCurrentTurn(newTurn);
    updatePenaltyScore(homeScore, awayScore, newTurn);
  };

  // Reset penalty shootout
  const handleReset = () => {
    setHomeScore(0);
    setAwayScore(0);
    setCurrentTurn('home');
    updatePenaltyScore(0, 0, 'home');
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🥅 Penalty Shootout - Quản lý đơn giản"
      size="md"
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="secondary"
            onClick={handleReset}
            className="text-red-600 hover:bg-red-50"
            disabled={isLoading}
          >
            🔄 Reset
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
            disabled={isLoading}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Thông báo backend ready */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <span className="text-blue-700 text-sm font-medium">
            ⚡ Sẵn sàng đồng bộ với backend - Dữ liệu đơn giản & hiệu quả
          </span>
        </div>

        {/* Tỉ số hiện tại */}
        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-6 border">
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-700 mb-2">
                {matchData?.homeTeam?.name || "ĐỘI NHÀ"}
              </div>
              <div className="text-4xl font-bold text-blue-800 mb-2">{homeScore}</div>
              
              {/* Điều chỉnh tỉ số */}
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => adjustScore('home', -1)}
                  className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 text-xs hover:bg-blue-300 disabled:opacity-50"
                  disabled={isLoading || homeScore === 0}
                >
                  -
                </button>
                <button
                  onClick={() => adjustScore('home', 1)}
                  className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 text-xs hover:bg-blue-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-gray-400">-</div>
            
            <div className="text-center">
              <div className="text-sm font-semibold text-red-700 mb-2">
                {matchData?.awayTeam?.name || "ĐỘI KHÁCH"}
              </div>
              <div className="text-4xl font-bold text-red-800 mb-2">{awayScore}</div>
              
              {/* Điều chỉnh tỉ số */}
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => adjustScore('away', -1)}
                  className="w-6 h-6 rounded-full bg-red-200 text-red-700 text-xs hover:bg-red-300 disabled:opacity-50"
                  disabled={isLoading || awayScore === 0}
                >
                  -
                </button>
                <button
                  onClick={() => adjustScore('away', 1)}
                  className="w-6 h-6 rounded-full bg-red-200 text-red-700 text-xs hover:bg-red-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lượt hiện tại */}
        <div className={`p-4 rounded-lg border-2 ${
          currentTurn === 'home' 
            ? 'bg-blue-50 border-blue-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-4 ${
              currentTurn === 'home' ? 'text-blue-800' : 'text-red-800'
            }`}>
              Lượt của: {
                currentTurn === 'home' 
                  ? matchData?.homeTeam?.name || "ĐỘI NHÀ"
                  : matchData?.awayTeam?.name || "ĐỘI KHÁCH"
              }
            </h3>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoal}
                className="px-8 py-4 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? "..." : "✅ GHI BÀN"}
              </button>
              
              <button
                onClick={handleMiss}
                className="px-8 py-4 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? "..." : "❌ MISS"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview cho livestream */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm text-center">
            📺 Preview livestream:
          </h4>
          <div className="bg-white rounded border p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">🥅 PENALTY SHOOTOUT</div>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-sm">{matchData?.homeTeam?.name || "ĐỘI-A"}</div>
                  <div className="text-2xl font-bold text-blue-800">{homeScore}</div>
                </div>
                <div className="text-gray-400">-</div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-sm">{matchData?.awayTeam?.name || "ĐỘI-B"}</div>
                  <div className="text-2xl font-bold text-red-800">{awayScore}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Lượt: {currentTurn === 'home' ? matchData?.homeTeam?.name || "Đội nhà" : matchData?.awayTeam?.name || "Đội khách"}
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
