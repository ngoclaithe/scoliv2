import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";

const PenaltyModal = ({ isOpen, onClose, onPenaltyChange, matchData, penaltyData }) => {
  const [penalties, setPenalties] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('home');

  // Load trạng thái penalty từ props khi mở modal
  useEffect(() => {
    if (isOpen && penaltyData) {
      setPenalties(penaltyData.penalties || []);
      setCurrentTurn(penaltyData.currentTurn || 'home');
    }
  }, [isOpen, penaltyData]);

  // Auto-save mỗi khi có thay đổi
  useEffect(() => {
    if (isOpen) {
      const homeGoals = penalties.filter(p => p.team === 'home' && p.result === 'goal').length;
      const awayGoals = penalties.filter(p => p.team === 'away' && p.result === 'goal').length;
      
      const newPenaltyData = {
        penalties: penalties,
        currentTurn: currentTurn,
        homeGoals: homeGoals,
        awayGoals: awayGoals
      };
      
      if (onPenaltyChange) {
        onPenaltyChange(newPenaltyData);
      }
    }
  }, [penalties, currentTurn, isOpen, onPenaltyChange]);

  const handleAddPenalty = (result) => {
    const newPenalty = {
      turn: penalties.length + 1,
      team: currentTurn,
      result: result,
      teamName: currentTurn === 'home' ? matchData?.homeTeam?.name : matchData?.awayTeam?.name
    };

    setPenalties(prev => [...prev, newPenalty]);
    setCurrentTurn(prev => prev === 'home' ? 'away' : 'home');
  };

  const handleRemoveLastPenalty = () => {
    if (penalties.length > 0) {
      const lastPenalty = penalties[penalties.length - 1];
      setPenalties(prev => prev.slice(0, -1));
      setCurrentTurn(lastPenalty.team);
    }
  };

  const handleEditPenalty = (index) => {
    setPenalties(prev => 
      prev.map((penalty, i) => 
        i === index 
          ? { ...penalty, result: penalty.result === 'goal' ? 'miss' : 'goal' }
          : penalty
      )
    );
  };

  const handleClearAll = () => {
    setPenalties([]);
    setCurrentTurn('home');
  };

  const homeGoals = penalties.filter(p => p.team === 'home' && p.result === 'goal').length;
  const awayGoals = penalties.filter(p => p.team === 'away' && p.result === 'goal').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🥅 Penalty Shootout - Tương tác trực tiếp"
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="secondary"
            onClick={handleClearAll}
            className="text-red-600 hover:bg-red-50"
          >
            🗑️ Xóa tất cả
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Auto-save indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <span className="text-green-700 text-sm font-medium">
            ✅ Tự động lưu - Mọi thay đổi được áp dụng ngay lập tức
          </span>
        </div>

        {/* Current Score */}
        <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-4 border">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-700">{matchData?.homeTeam?.name || "ĐỘI NHÀ"}</div>
              <div className="text-3xl font-bold text-blue-800">{homeGoals}</div>
            </div>
            <div className="text-2xl font-bold text-gray-400">-</div>
            <div className="text-center">
              <div className="text-sm font-semibold text-red-700">{matchData?.awayTeam?.name || "ĐỘI KHÁCH"}</div>
              <div className="text-3xl font-bold text-red-800">{awayGoals}</div>
            </div>
          </div>
        </div>

        {/* Current Turn */}
        <div className={`p-4 rounded-lg border-2 ${
          currentTurn === 'home' 
            ? 'bg-blue-50 border-blue-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-2 ${
              currentTurn === 'home' ? 'text-blue-800' : 'text-red-800'
            }`}>
              Lượt {penalties.length + 1}: {
                currentTurn === 'home' 
                  ? matchData?.homeTeam?.name || "ĐỘI NHÀ"
                  : matchData?.awayTeam?.name || "ĐỘI KHÁCH"
              }
            </h3>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleAddPenalty('goal')}
                className="px-6 py-3 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg"
              >
                ✅ VÀO
              </button>
              
              <button
                onClick={() => handleAddPenalty('miss')}
                className="px-6 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg"
              >
                ❌ TRƯỢT
              </button>
            </div>
          </div>
        </div>

        {/* Penalty History */}
        {penalties.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">
                Lịch sử các lượt sút ({penalties.length} lượt):
              </h4>
              <button
                onClick={handleRemoveLastPenalty}
                className="text-sm bg-orange-200 hover:bg-orange-300 px-3 py-1 rounded text-orange-700 transition-colors"
              >
                ↶ Hoàn tác lượt cuối
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {penalties.map((penalty, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      penalty.team === 'home' 
                        ? 'bg-blue-50 border-blue-200 text-blue-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="font-medium">
                        Lượt {penalty.turn}: {penalty.teamName}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                        penalty.result === 'goal' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {penalty.result === 'goal' ? '✅ VÀO' : '❌ TRƯỢT'}
                      </span>
                      
                      <button
                        onClick={() => handleEditPenalty(index)}
                        className="text-xs bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded-full text-blue-700 transition-all transform hover:scale-105"
                        title={`Click để thay đổi: ${penalty.result === 'goal' ? 'VÀO → TRƯỢT' : 'TRƯỢT → VÀO'}`}
                      >
                        🔄 Đổi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-xs text-gray-500 text-center">
                💡 Click "🔄 Đổi" để thay đổi kết quả VÀO ↔ TRƯỢT
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm text-center">
            📺 Hiển thị trên livestream:
          </h4>
          <div className="bg-white rounded border p-4">
            <div className="text-center mb-3">
              <div className="text-sm text-gray-600 mb-2">🥅 PENALTY SHOOTOUT</div>
              <div className="flex items-center justify-center space-x-4 mb-3">
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-sm">{matchData?.homeTeam?.name || "ĐỘI-A"}</div>
                  <div className="text-2xl font-bold text-blue-800">{homeGoals}</div>
                </div>
                <div className="text-gray-400">-</div>
                <div className="text-center">
                  <div className="text-red-600 font-bold text-sm">{matchData?.awayTeam?.name || "ĐỘI-B"}</div>
                  <div className="text-2xl font-bold text-red-800">{awayGoals}</div>
                </div>
              </div>
            </div>
            
            {penalties.length > 0 && (
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">Các lượt gần nhất:</div>
                <div className="flex justify-center space-x-2 flex-wrap">
                  {penalties.slice(-8).map((penalty, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center text-white mb-1 ${
                        penalty.team === 'home' ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      title={`Lượt ${penalty.turn}: ${penalty.teamName} - ${penalty.result === 'goal' ? 'VÀO' : 'TRƯỢT'}`}
                    >
                      {penalty.result === 'goal' ? '✓' : '✗'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {penalties.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                <div className="text-sm">Chưa có lượt sút nào</div>
                <div className="text-xs mt-1">Bắt đầu penalty shootout ↑</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PenaltyModal;
