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
      className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/basic/sanconhantao.jpg')`
      }}
    >
      {/* Small ScoLiv Logo - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <img
          src="/images/basic/ScoLivLogo.png"
          alt="ScoLiv Logo"
          className="h-8 w-8 drop-shadow-lg opacity-80"
        />
      </div>

      <div className="w-full max-w-4xl mx-auto h-full flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden w-full max-h-[90vh]">
          {/* Interlocking Blocks Header */}
          <div className="relative h-24 overflow-hidden">

            {/* Layer 1 - Base geometric blocks */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900"></div>

            {/* Layer 2 - Team A interlocking blocks */}
            <div className="absolute left-0 top-0 w-2/5 h-full">
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 opacity-90"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 85% 35%, 100% 65%, 75% 100%, 0 100%)'
                }}
              ></div>
              <div
                className="absolute top-2 right-4 w-16 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-80"
                style={{
                  clipPath: 'polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%, 20% 50%)'
                }}
              ></div>
            </div>

            {/* Layer 3 - Team B interlocking blocks */}
            <div className="absolute right-0 top-0 w-2/5 h-full">
              <div
                className="absolute inset-0 bg-gradient-to-bl from-orange-600 to-red-700 opacity-90"
                style={{
                  clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 25% 100%, 0 65%, 15% 35%)'
                }}
              ></div>
              <div
                className="absolute top-2 left-4 w-16 h-8 bg-gradient-to-bl from-orange-500 to-orange-600 opacity-80"
                style={{
                  clipPath: 'polygon(20% 0, 100% 0, 80% 50%, 100% 100%, 20% 100%, 0% 50%)'
                }}
              ></div>
            </div>

            {/* Layer 4 - Center interlocking score blocks */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-16">
              <div
                className="absolute left-0 top-0 w-16 h-full bg-gradient-to-br from-white to-gray-100 shadow-xl"
                style={{
                  clipPath: 'polygon(0 20%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 0 80%)'
                }}
              ></div>
              <div
                className="absolute left-12 top-0 w-24 h-full bg-gradient-to-br from-gray-50 to-gray-200 shadow-xl"
                style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 25%, 100% 75%, 80% 100%, 20% 100%, 0% 75%, 0% 25%)'
                }}
              ></div>
              <div
                className="absolute right-0 top-0 w-16 h-full bg-gradient-to-bl from-white to-gray-100 shadow-xl"
                style={{
                  clipPath: 'polygon(20% 0%, 100% 20%, 100% 80%, 20% 100%, 0% 70%, 0% 30%)'
                }}
              ></div>
            </div>

            {/* Layer 5 - Small interlocking accent blocks */}
            <div
              className="absolute left-8 top-4 w-8 h-4 bg-emerald-400 opacity-70"
              style={{
                clipPath: 'polygon(0 0, 70% 0, 100% 100%, 30% 100%)'
              }}
            ></div>
            <div
              className="absolute right-8 bottom-4 w-8 h-4 bg-orange-400 opacity-70"
              style={{
                clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0% 100%)'
              }}
            ></div>

            {/* Content overlay */}
            <div className="relative z-10 h-full flex items-center justify-between px-4">

              {/* Team A Section */}
              <div className="flex items-center gap-3 flex-1">
                {/* Team A Logo - Interlocking shape */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 p-2"
                    style={{
                      background: `linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(255,255,255,0.5))`,
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 85% 70%, 100% 100%, 15% 100%, 0% 70%, 15% 30%)'
                    }}
                  >
                    {matchData.teamA.logo ? (
                      <img
                        src={matchData.teamA.logo}
                        alt={matchData.teamA.name || 'ĐỘI A'}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-800">A</div>
                    )}
                  </div>
                </div>

                {/* Team A Name */}
                <div className="flex-1 min-w-0 relative">
                  <div
                    className="absolute inset-0 opacity-20 bg-gradient-to-r from-emerald-400 to-transparent"
                    style={{
                      clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)'
                    }}
                  ></div>
                  <div className="relative z-10 py-3 px-3">
                    <h3 className="text-sm font-bold text-white drop-shadow-lg truncate">
                      {matchData.teamA.name || 'ĐỘI A'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Central Score Display - Interlocking blocks */}
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="relative flex items-center">
                  {/* Team A Score block */}
                  <div
                    className="px-4 py-3 bg-white text-gray-900 shadow-xl"
                    style={{
                      clipPath: 'polygon(0 20%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 0 80%)'
                    }}
                  >
                    <div className="text-2xl font-black tabular-nums text-emerald-600">
                      {matchData.teamA.score || 0}
                    </div>
                  </div>

                  {/* Center divider block */}
                  <div
                    className="px-2 py-3 bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg -mx-1"
                    style={{
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
                    }}
                  >
                    <div className="text-xs font-bold text-gray-600">VS</div>
                  </div>

                  {/* Team B Score block */}
                  <div
                    className="px-4 py-3 bg-white text-gray-900 shadow-xl"
                    style={{
                      clipPath: 'polygon(20% 0%, 100% 20%, 100% 80%, 20% 100%, 0% 70%, 0% 30%)'
                    }}
                  >
                    <div className="text-2xl font-black tabular-nums text-orange-600">
                      {matchData.teamB.score || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team B Section */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Team B Name */}
                <div className="flex-1 min-w-0 text-right relative">
                  <div
                    className="absolute inset-0 opacity-20 bg-gradient-to-l from-orange-400 to-transparent"
                    style={{
                      clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0% 50%)'
                    }}
                  ></div>
                  <div className="relative z-10 py-3 px-3">
                    <h3 className="text-sm font-bold text-white drop-shadow-lg truncate">
                      {matchData.teamB.name || 'ĐỘI B'}
                    </h3>
                  </div>
                </div>

                {/* Team B Logo - Interlocking shape */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 p-2"
                    style={{
                      background: `linear-gradient(225deg, rgba(234, 88, 12, 0.3), rgba(255,255,255,0.5))`,
                      clipPath: 'polygon(15% 0%, 85% 0%, 100% 30%, 85% 70%, 100% 100%, 15% 100%, 0% 70%, 15% 30%)'
                    }}
                  >
                    {matchData.teamB.logo ? (
                      <img
                        src={matchData.teamB.logo}
                        alt={matchData.teamB.name || 'ĐỘI B'}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-800">B</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Content - Fixed height, no scroll */}
          <div className="p-3 overflow-hidden">
            <div className="space-y-3 max-h-[60vh] overflow-hidden">
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
                team1Value={Array.isArray(matchStats.yellowCards.team1) ? matchStats.yellowCards.team1.length : matchStats.yellowCards.team1 || 0}
                team2Value={Array.isArray(matchStats.yellowCards.team2) ? matchStats.yellowCards.team2.length : matchStats.yellowCards.team2 || 0}
              />

              {/* Thẻ đỏ */}
              <StatBar
                label="Thẻ đỏ"
                team1Value={Array.isArray(matchStats.redCards?.team1) ? matchStats.redCards.team1.length : matchStats.redCards?.team1 || 0}
                team2Value={Array.isArray(matchStats.redCards?.team2) ? matchStats.redCards.team2.length : matchStats.redCards?.team2 || 0}
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
