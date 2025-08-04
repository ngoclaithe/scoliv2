import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';

const Stat = () => {
  const { matchData, matchStats } = usePublicMatch();

  // Component để hiển thị thống kê
  const StatBar = ({ label, team1Value, team2Value, isPercentage = false }) => {
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-red-600">{team1Value}{isPercentage ? '%' : ''}</span>
          <span className="font-medium text-gray-700">{label}</span>
          <span className="font-semibold text-gray-800">{team2Value}{isPercentage ? '%' : ''}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-red-500"
              style={{
                width: isPercentage
                  ? `${team1Value}%`
                  : `${team1Value === 0 && team2Value === 0 ? 50 : (team1Value / (team1Value + team2Value)) * 100}%`
              }}
            ></div>
            <div
              className="bg-gray-800"
              style={{
                width: isPercentage
                  ? `${team2Value}%`
                  : `${team1Value === 0 && team2Value === 0 ? 50 : (team2Value / (team1Value + team2Value)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">THỐNG KÊ TRẬN ĐẤU</h1>
            <div className="flex items-center justify-center space-x-4 text-lg md:text-xl">
              <span className="font-semibold">{matchData.teamA.name || 'ĐỘI A'}</span>
              <span className="text-yellow-300 font-bold">VS</span>
              <span className="font-semibold">{matchData.teamB.name || 'ĐỘI B'}</span>
            </div>
          </div>
        </div>

        {/* Stats Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Kiểm soát bóng */}
            <StatBar
              label="Kiểm soát bóng"
              team1Value={matchStats.possession.team1}
              team2Value={matchStats.possession.team2}
              isPercentage={true}
            />

            {/* Tổng số cú sút */}
            <StatBar
              label="Tổng số cú sút"
              team1Value={matchStats.totalShots.team1}
              team2Value={matchStats.totalShots.team2}
            />

            {/* Sút trúng đích */}
            <StatBar
              label="Sút trúng đích"
              team1Value={matchStats.shotsOnTarget.team1}
              team2Value={matchStats.shotsOnTarget.team2}
            />

            {/* Phạt góc */}
            <StatBar
              label="Phạt góc"
              team1Value={matchStats.corners.team1}
              team2Value={matchStats.corners.team2}
            />

            {/* Thẻ vàng */}
            <StatBar
              label="Thẻ vàng"
              team1Value={matchStats.yellowCards.team1}
              team2Value={matchStats.yellowCards.team2}
            />

            {/* Phạm lỗi */}
            <StatBar
              label="Phạm lỗi"
              team1Value={matchStats.fouls.team1}
              team2Value={matchStats.fouls.team2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-gray-600 text-sm">
            Cập nhật thời gian thực • {new Date().toLocaleTimeString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stat;
