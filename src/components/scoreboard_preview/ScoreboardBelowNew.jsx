import React, { useState } from 'react';

const ScoreboardBelow = ({
  teamAName = "Đội A",
  teamBName = "Đội B", 
  teamALogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='20' fill='%23FF0000'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EA%3C/text%3E%3C/svg%3E",
  teamBLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='20' fill='%230088FF'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EB%3C/text%3E%3C/svg%3E",
  teamAScore = 2,
  teamBScore = 1,
  matchTime = "",
  teamAKitColor = "#FF0000",
  teamBKitColor = "#0088FF",
  leagueLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='12' fill='%23FFD700'/%3E%3Ctext x='15' y='19' text-anchor='middle' fill='black' font-size='10' font-weight='bold'%3EL%3C/text%3E%3C/svg%3E",
  scrollTextColor = "#FFFFFF",
  scrollTextBg = "#FF0000",
  scrollTextRepeat = 3,
  penaltyPosition = "none", // "teamA", "teamB", or "none"
  scoreboardType = 1 // 1, 2, 3, or 4
}) => {
  const [scrollText] = useState("TRỰC TIẾP - LIVE SCORE - ");

  // Generate scrolling text with repetition
  const generateScrollText = () => {
    return Array(scrollTextRepeat).fill(scrollText).join(" ");
  };

  const renderScoreboard = () => {
    switch (scoreboardType) {
      case 1:
        return (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <img src={teamALogo} alt="Team A" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-lg">
                  {teamAScore}
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded mt-1 text-sm truncate">
                  {teamAName}
                </div>
                <div 
                  className="w-full h-2 rounded mt-1"
                  style={{ backgroundColor: teamAKitColor }}
                ></div>
              </div>
            </div>

            {matchTime && (
              <div className="bg-black text-white px-4 py-2 rounded mx-4 text-sm font-medium whitespace-nowrap">
                {matchTime}
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex flex-col items-end min-w-0">
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm truncate">
                  {teamBName}
                </div>
                <div 
                  className="w-full h-2 rounded mt-1"
                  style={{ backgroundColor: teamBKitColor }}
                ></div>
                <div className="bg-yellow-400 text-black px-3 py-1 rounded mt-1 font-bold text-lg">
                  {teamBScore}
                </div>
              </div>
              <img src={teamBLogo} alt="Team B" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            </div>
          </div>
        );

      case 2:
        return (
          <div 
            className="flex items-center justify-between p-4 rounded-lg shadow-lg relative z-10 min-w-0"
            style={{
              background: 'linear-gradient(to right, #0088FF 30%, #FF0000 70%)'
            }}
          >
            <div className="flex items-center gap-2 text-white min-w-0">
              <img src={teamALogo} alt="Team A" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="text-white font-medium text-sm truncate">{teamAName}</div>
                <div 
                  className="w-full h-2 rounded mt-1"
                  style={{ backgroundColor: teamAKitColor }}
                ></div>
                <div className="text-white font-bold text-lg">{teamAScore}</div>
              </div>
            </div>

            {matchTime && (
              <div className="bg-red-600 text-white px-4 py-2 rounded mx-4 text-sm font-medium whitespace-nowrap">
                {matchTime}
              </div>
            )}

            <div className="flex items-center gap-2 text-white min-w-0">
              <div className="flex flex-col items-end min-w-0">
                <div className="text-white font-bold text-lg">{teamBScore}</div>
                <div className="text-white font-medium text-sm truncate">{teamBName}</div>
                <div 
                  className="w-full h-2 rounded mt-1"
                  style={{ backgroundColor: teamBKitColor }}
                ></div>
              </div>
              <img src={teamBLogo} alt="Team B" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <img src={teamALogo} alt="Team A" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="text-white px-3 py-1 rounded text-sm truncate" style={{ backgroundColor: '#0d94a4' }}>
                  {teamAName}
                </div>
                <div 
                  className="w-full h-2 rounded mt-1"
                  style={{ backgroundColor: teamAKitColor }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col items-center mx-4">
              <div className="flex items-center gap-2 text-white font-bold text-xl">
                <span>{teamAScore}</span>
                <span>-</span>
                <span>{teamBScore}</span>
              </div>
              {matchTime && (
                <div className="bg-red-600 text-white px-3 py-1 rounded mt-2 text-xs whitespace-nowrap">
                  {matchTime}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex flex-col items-end min-w-0">
                <div className="text-white px-3 py-1 rounded text-sm truncate" style={{ backgroundColor: '#0d94a4' }}>
                  {teamBName}
                </div>
                <div 
                  className="w-full h-2 rounded mt-1"
                  style={{ backgroundColor: teamBKitColor }}
                ></div>
              </div>
              <img src={teamBLogo} alt="Team B" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <img src={teamALogo} alt="Team A" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div className="flex items-center gap-2">
                <div 
                  className="text-white px-3 py-1 rounded text-sm truncate"
                  style={{ background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))' }}
                >
                  {teamAName}
                </div>
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: teamAKitColor }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col items-center mx-4">
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded relative"
                style={{ backgroundColor: '#213f80' }}
              >
                <span className="text-white font-bold text-lg">{teamAScore}</span>
                <img src={leagueLogo} alt="League" className="w-6 h-6 rounded-full" />
                <span className="text-white font-bold text-lg">{teamBScore}</span>
              </div>
              {matchTime && (
                <div className="bg-red-600 text-white px-3 py-1 rounded mt-2 text-xs whitespace-nowrap">
                  {matchTime}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: teamBKitColor }}
                ></div>
                <div 
                  className="text-white px-3 py-1 rounded text-sm truncate"
                  style={{ background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))' }}
                >
                  {teamBName}
                </div>
              </div>
              <img src={teamBLogo} alt="Team B" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-end pb-8 overflow-x-auto">
      {/* Scrolling Text */}
      <div className="w-full overflow-hidden mb-4">
        <div 
          className="animate-scroll whitespace-nowrap py-2 px-4"
          style={{ 
            color: scrollTextColor, 
            backgroundColor: scrollTextBg 
          }}
        >
          {generateScrollText()}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex items-end justify-between px-4 min-w-max">
        {/* ScoLiv Logo */}
        <div className="flex-shrink-0 mb-4">
          <img 
            src="/images/basic/ScoLivLogo.png" 
            alt="ScoLiv" 
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23333' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EScoLiv%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Scoreboard Main */}
        <div className="flex flex-col items-center flex-1 max-w-2xl mx-4">
          <div className="scoreboard-main w-full">
            {renderScoreboard()}
          </div>
          
          {/* Live Match Label */}
          <div className="bg-white text-black px-4 py-2 rounded-lg mt-2 text-sm font-medium shadow-md">
            Trực tiếp trận đấu
          </div>
        </div>

        {/* Right spacing for balance */}
        <div className="w-16 flex-shrink-0"></div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        /* Ensure horizontal scrolling on mobile */
        @media (max-width: 768px) {
          .min-w-max {
            min-width: max-content;
          }
        }
        
        /* Smart logo rounding - preserves shield shapes */
        img[alt*="Team"], img[alt*="League"] {
          border-radius: 20%;
          object-fit: cover;
        }
        
        /* For circular logos */
        .rounded-full {
          border-radius: 50% !important;
        }
      `}</style>
    </div>
  );
};

// Demo component to test different types
const ScoreboardDemo = () => {
  const [currentType, setCurrentType] = useState(1);
  const [showTime, setShowTime] = useState(false);

  const demoProps = {
    teamAName: "Barcelona",
    teamBName: "Real Madrid",
    teamAScore: 2,
    teamBScore: 1,
    matchTime: showTime ? "45'" : "",
    teamAKitColor: "#A50044",
    teamBKitColor: "#FFFFFF",
    scrollTextColor: "#FFFFFF",
    scrollTextBg: "#FF0000",
    scrollTextRepeat: 2,
    scoreboardType: currentType
  };

  return (
    <div className="w-full h-screen">
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Loại Scoreboard:</label>
          <select 
            value={currentType} 
            onChange={(e) => setCurrentType(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={1}>Loại 1</option>
            <option value={2}>Loại 2</option>
            <option value={3}>Loại 3</option>
            <option value={4}>Loại 4</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={showTime} 
              onChange={(e) => setShowTime(e.target.checked)}
            />
            Hiển thị thời gian
          </label>
        </div>
      </div>

      <ScoreboardBelow {...demoProps} />
    </div>
  );
};

export default ScoreboardDemo;