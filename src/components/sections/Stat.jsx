import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';

const Stat = () => {
  const { matchData, matchStats } = usePublicMatch();

  const StatBar = ({ label, team1Value, team2Value, isPercentage = false }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="font-semibold text-red-600 w-12 text-left">{team1Value}{isPercentage ? '%' : ''}</span>
          <span className="font-medium text-gray-700 text-center flex-1 px-2">{label}</span>
          <span className="font-semibold text-blue-600 w-12 text-right">{team2Value}{isPercentage ? '%' : ''}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-red-500 transition-all duration-300"
              style={{
                width: isPercentage
                  ? `${team1Value}%`
                  : `${team1Value === 0 && team2Value === 0 ? 50 : (team1Value / (team1Value + team2Value)) * 100}%`
              }}
            ></div>
            <div
              className="bg-blue-500 transition-all duration-300"
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
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-2 sm:p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/basic/sanconhantao.jpg')`
      }}
    >
      <div className="w-full max-w-4xl">
        {/* ScoLiv Logo */}
        <div className="text-center mb-4 sm:mb-6">
          <img 
            src="/images/basic/ScoLivLogo.png" 
            alt="ScoLiv Logo" 
            className="h-12 sm:h-16 md:h-20 mx-auto drop-shadow-lg"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Scoreboard Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              {/* Team A */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
                  {matchData.teamA.logo ? (
                    <img 
                      src={matchData.teamA.logo} 
                      alt={matchData.teamA.name || 'ĐỘI A'} 
                      className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
                    />
                  ) : (
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">A</span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-center leading-tight">
                  {matchData.teamA.name || 'ĐỘI A'}
                </h3>
              </div>

              {/* Score Section */}
              <div className="flex flex-col items-center px-4 sm:px-6">
                <div className="flex items-center space-x-2 sm:space-x-4 mb-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white text-green-800 px-3 py-1 rounded-lg shadow-inner">
                    {matchData.teamA.score || 0}
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">-</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white text-green-800 px-3 py-1 rounded-lg shadow-inner">
                    {matchData.teamB.score || 0}
                  </span>
                </div>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
                  {matchData.teamB.logo ? (
                    <img 
                      src={matchData.teamB.logo} 
                      alt={matchData.teamB.name || 'ĐỘI B'} 
                      className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
                    />
                  ) : (
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">B</span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-center leading-tight">
                  {matchData.teamB.name || 'ĐỘI B'}
                </h3>
              </div>
            </div>
          </div>

          {/* Stats Content */}
          <div className="p-4 sm:p-6 md:p-8">
            <div className="space-y-4 sm:space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default Stat;