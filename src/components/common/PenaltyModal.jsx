import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const PenaltyModal = ({ isOpen, onClose, onSelectOption, matchData }) => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const handleConfirm = () => {
    if (onSelectOption) {
      onSelectOption({
        type: "penalty",
        homeScore: parseInt(homeScore) || 0,
        awayScore: parseInt(awayScore) || 0
      });
    }
    onClose();
  };

  const handleCancel = () => {
    setHomeScore(0);
    setAwayScore(0);
    onClose();
  };

  const incrementScore = (team) => {
    if (team === 'home') {
      setHomeScore(prev => Math.max(0, prev + 1));
    } else {
      setAwayScore(prev => Math.max(0, prev + 1));
    }
  };

  const decrementScore = (team) => {
    if (team === 'home') {
      setHomeScore(prev => Math.max(0, prev - 1));
    } else {
      setAwayScore(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="🥅 Tỷ số đá phạt đền"
      size="md"
      footer={
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            Xác nhận
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600 text-center">
          Nhập số lượt sút thành công của mỗi đội
        </p>
        
        {/* Home Team */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-center mb-3">
            <h3 className="font-bold text-lg text-blue-800">
              {matchData?.homeTeam?.name || "ĐỘI NHÀ"}
            </h3>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => decrementScore('home')}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors"
            >
              -
            </button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-800 bg-white rounded-lg px-4 py-2 min-w-[80px]">
                {homeScore}
              </div>
              <p className="text-xs text-blue-600 mt-1">Sút thành công</p>
            </div>
            
            <button
              onClick={() => incrementScore('home')}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-500">VS</div>
        </div>

        {/* Away Team */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-center mb-3">
            <h3 className="font-bold text-lg text-red-800">
              {matchData?.awayTeam?.name || "ĐỘI KHÁCH"}
            </h3>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => decrementScore('away')}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors"
            >
              -
            </button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-800 bg-white rounded-lg px-4 py-2 min-w-[80px]">
                {awayScore}
              </div>
              <p className="text-xs text-red-600 mt-1">Sút thành công</p>
            </div>
            
            <button
              onClick={() => incrementScore('away')}
              className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm text-center">Xem trước hiển thị:</h4>
          <div className="bg-white rounded border p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">🥅 PENALTY SHOOTOUT</div>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-blue-600 font-bold">{matchData?.homeTeam?.name || "ĐỘI-A"}</div>
                <div className="text-2xl font-bold text-blue-800">{homeScore}</div>
              </div>
              <div className="text-gray-400">-</div>
              <div className="text-center">
                <div className="text-red-600 font-bold">{matchData?.awayTeam?.name || "ĐỘI-B"}</div>
                <div className="text-2xl font-bold text-red-800">{awayScore}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PenaltyModal;
