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

        <div className="bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Zigzag Pattern Header */}
          <div className="relative">
            {/* Layer 1 - Base zigzag background */}
            <div
              className="h-24 sm:h-28 lg:h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"
              style={{
                clipPath: 'polygon(0 0, 8% 0, 12% 15%, 18% 0, 25% 0, 30% 20%, 35% 0, 42% 0, 48% 15%, 52% 0, 58% 0, 65% 20%, 70% 0, 75% 0, 82% 15%, 88% 0, 100% 0, 100% 70%, 95% 85%, 88% 70%, 82% 85%, 75% 70%, 70% 85%, 65% 70%, 58% 85%, 52% 70%, 48% 85%, 42% 70%, 35% 85%, 30% 70%, 25% 85%, 18% 70%, 12% 85%, 8% 70%, 0 85%)'
              }}
            ></div>

            {/* Layer 2 - Team A zigzag section */}
            <div
              className="absolute left-0 top-0 w-1/3 h-full opacity-90"
              style={{
                background: `linear-gradient(135deg, ${matchData.teamA?.teamAKitColor || '#FF6B6B'}70, ${matchData.teamA?.teamAKitColor || '#FF6B6B'}40)`,
                clipPath: 'polygon(0 0, 100% 0, 85% 20%, 100% 40%, 80% 60%, 100% 80%, 85% 100%, 0 100%)'
              }}
            ></div>

            {/* Layer 3 - Team B zigzag section */}
            <div
              className="absolute right-0 top-0 w-1/3 h-full opacity-90"
              style={{
                background: `linear-gradient(225deg, ${matchData.teamB?.teamBKitColor || '#4ECDC4'}70, ${matchData.teamB?.teamBKitColor || '#4ECDC4'}40)`,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%, 20% 80%, 0 60%, 15% 40%, 0 20%)'
              }}
            ></div>

            {/* Layer 4 - Center zigzag score area */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-48 lg:w-56 h-16 sm:h-20 lg:h-24">
              <div
                className="w-full h-full bg-gradient-to-br from-white via-gray-100 to-white shadow-2xl"
                style={{
                  clipPath: 'polygon(5% 20%, 15% 0%, 25% 25%, 35% 0%, 45% 20%, 55% 0%, 65% 25%, 75% 0%, 85% 20%, 95% 0%, 100% 30%, 95% 50%, 100% 70%, 85% 80%, 95% 100%, 75% 75%, 85% 100%, 65% 80%, 75% 100%, 55% 75%, 65% 100%, 45% 80%, 55% 100%, 35% 75%, 45% 100%, 25% 80%, 35% 100%, 15% 75%, 25% 100%, 5% 80%, 15% 100%, 0% 70%, 5% 50%, 0% 30%)'
                }}
              ></div>
            </div>

            {/* Layer 5 - Interlocking zigzag accents */}
            <div
              className="absolute left-4 sm:left-6 top-2 w-12 h-6 opacity-80"
              style={{
                background: `linear-gradient(45deg, ${matchData.teamA?.teamAKitColor || '#FF6B6B'}, ${matchData.teamA?.teamAKitColor || '#FF6B6B'}60)`,
                clipPath: 'polygon(0 100%, 20% 0%, 40% 100%, 60% 0%, 80% 100%, 100% 0%, 100% 50%, 80% 50%, 60% 50%, 40% 50%, 20% 50%, 0% 50%)'
              }}
            ></div>
            <div
              className="absolute right-4 sm:right-6 bottom-2 w-12 h-6 opacity-80"
              style={{
                background: `linear-gradient(225deg, ${matchData.teamB?.teamBKitColor || '#4ECDC4'}, ${matchData.teamB?.teamBKitColor || '#4ECDC4'}60)`,
                clipPath: 'polygon(0 0%, 20% 100%, 40% 0%, 60% 100%, 80% 0%, 100% 100%, 100% 50%, 80% 50%, 60% 50%, 40% 50%, 20% 50%, 0% 50%)'
              }}
            ></div>

            {/* Layer 6 - Corner zigzag brackets */}
            <div
              className="absolute top-0 left-0 w-10 h-10 bg-slate-600 opacity-70"
              style={{
                clipPath: 'polygon(0 0, 80% 0, 60% 20%, 80% 40%, 60% 60%, 80% 80%, 60% 100%, 0 100%, 0 80%, 20% 60%, 0 40%, 20% 20%)'
              }}
            ></div>
            <div
              className="absolute top-0 right-0 w-10 h-10 bg-slate-600 opacity-70"
              style={{
                clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 40% 100%, 60% 80%, 40% 60%, 60% 40%, 40% 20%, 60% 0)'
              }}
            ></div>

            {/* Content overlay with zigzag containers */}
            <div className="relative z-10 h-full flex items-center justify-between px-2 sm:px-4 lg:px-6">

              {/* Team A Section - Zigzag container */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                {/* Team A Logo - Zigzag shape */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 p-2 sm:p-3"
                    style={{
                      background: `linear-gradient(135deg, ${matchData.teamA?.teamAKitColor || '#FF6B6B'}30, rgba(255,255,255,0.5))`,
                      clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 90% 50%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 10% 50%, 0% 25%)'
                    }}
                  >
                    {matchData.teamA.logo ? (
                      <img
                        src={matchData.teamA.logo}
                        alt={matchData.teamA.name || 'ĐỘI A'}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl font-bold text-gray-800">A</div>
                    )}
                  </div>
                </div>

                {/* Team A Name - Zigzag background */}
                <div className="flex-1 min-w-0 relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(90deg, ${matchData.teamA?.teamAKitColor || '#FF6B6B'}50, transparent)`,
                      clipPath: 'polygon(0 20%, 5% 0%, 15% 30%, 20% 0%, 30% 25%, 40% 0%, 50% 20%, 60% 0%, 70% 30%, 80% 0%, 90% 25%, 100% 0%, 100% 100%, 90% 75%, 80% 100%, 70% 70%, 60% 100%, 50% 80%, 40% 100%, 30% 75%, 20% 100%, 15% 70%, 5% 100%, 0% 80%)'
                    }}
                  ></div>
                  <div className="relative z-10 py-2 px-3">
                    <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white drop-shadow-lg truncate">
                      {matchData.teamA.name || 'ĐỘI A'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Central Score Display - Complex zigzag shape */}
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="relative">
                  <div
                    className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 bg-white text-gray-900 shadow-2xl"
                    style={{
                      clipPath: 'polygon(8% 0%, 25% 20%, 42% 0%, 58% 0%, 75% 20%, 92% 0%, 100% 30%, 92% 50%, 100% 70%, 92% 100%, 75% 80%, 58% 100%, 42% 100%, 25% 80%, 8% 100%, 0% 70%, 8% 50%, 0% 30%)'
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="text-xl sm:text-2xl lg:text-4xl font-black tabular-nums"
                        style={{ color: matchData.teamA?.teamAKitColor || '#FF6B6B' }}
                      >
                        {matchData.teamA.score || 0}
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-px h-4 sm:h-6 bg-gray-400"></div>
                        <div className="text-xs font-bold text-gray-500">-</div>
                        <div className="w-px h-4 sm:h-6 bg-gray-400"></div>
                      </div>

                      <div
                        className="text-xl sm:text-2xl lg:text-4xl font-black tabular-nums"
                        style={{ color: matchData.teamB?.teamBKitColor || '#4ECDC4' }}
                      >
                        {matchData.teamB.score || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team B Section - Zigzag container */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                {/* Team B Name - Reverse zigzag background */}
                <div className="flex-1 min-w-0 text-right relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(270deg, ${matchData.teamB?.teamBKitColor || '#4ECDC4'}50, transparent)`,
                      clipPath: 'polygon(0 0%, 10% 25%, 20% 0%, 30% 30%, 40% 0%, 50% 20%, 60% 0%, 70% 25%, 80% 0%, 85% 30%, 95% 0%, 100% 20%, 100% 80%, 95% 100%, 85% 70%, 80% 100%, 70% 75%, 60% 100%, 50% 80%, 40% 100%, 30% 70%, 20% 100%, 10% 75%, 0% 100%)'
                    }}
                  ></div>
                  <div className="relative z-10 py-2 px-3">
                    <h3 className="text-xs sm:text-sm lg:text-base font-bold text-white drop-shadow-lg truncate">
                      {matchData.teamB.name || 'ĐỘI B'}
                    </h3>
                  </div>
                </div>

                {/* Team B Logo - Zigzag shape */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 p-2 sm:p-3"
                    style={{
                      background: `linear-gradient(225deg, ${matchData.teamB?.teamBKitColor || '#4ECDC4'}30, rgba(255,255,255,0.5))`,
                      clipPath: 'polygon(10% 0%, 90% 0%, 100% 25%, 90% 50%, 100% 75%, 90% 100%, 10% 100%, 0% 75%, 10% 50%, 0% 25%)'
                    }}
                  >
                    {matchData.teamB.logo ? (
                      <img
                        src={matchData.teamB.logo}
                        alt={matchData.teamB.name || 'ĐỘI B'}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl font-bold text-gray-800">B</div>
                    )}
                  </div>
                </div>
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
