import React, { useState } from 'react';

const ScoreboardBelow = ({
  teamAName = "Barcelona",
  teamBName = "Real Madrid", 
  teamALogo = "/images/teams/barca.png",
  teamBLogo = "/images/teams/real.png",
  teamAScore = 2,
  teamBScore = 1,
  matchTime = "90'",
  teamAKitColor = "#004D98",
  teamBKitColor = "#FFFFFF",
  leagueLogo = "/images/leagues/laliga.png",
  runningTextColor = "#FFFFFF",
  runningTextBg = "#FF0000",
  runningTextRepeat = 3,
  penaltyPosition = null,
  type = 1,
  showMatchTime = false
}) => {
  
  const [currentType, setCurrentType] = useState(type);

  // Test data cho 4 loại
  const testData = [
    {
      type: 1,
      teamAName: "Manchester City",
      teamBName: "Liverpool",
      teamALogo: "/images/teams/mancity.png", 
      teamBLogo: "/images/teams/liverpool.png",
      teamAScore: 3,
      teamBScore: 2,
      matchTime: "85'",
      teamAKitColor: "#6CABDD",
      teamBKitColor: "#C8102E"
    },
    {
      type: 2,
      teamAName: "Chelsea",
      teamBName: "Arsenal", 
      teamALogo: "/images/teams/chelsea.png",
      teamBLogo: "/images/teams/arsenal.png",
      teamAScore: 1,
      teamBScore: 1,
      matchTime: "67'",
      teamAKitColor: "#034694",
      teamBKitColor: "#EF0107"
    },
    {
      type: 3,
      teamAName: "PSG",
      teamBName: "Marseille",
      teamALogo: "/images/teams/psg.png",
      teamBLogo: "/images/teams/marseille.png", 
      teamAScore: 4,
      teamBScore: 0,
      matchTime: "78'",
      teamAKitColor: "#004170",
      teamBKitColor: "#2FAEE0"
    },
    {
      type: 4,
      teamAName: "Juventus",
      teamBName: "AC Milan",
      teamALogo: "/images/teams/juventus.png",
      teamBLogo: "/images/teams/milan.png",
      teamAScore: 2,
      teamBScore: 3, 
      matchTime: "90+3'",
      teamAKitColor: "#000000",
      teamBKitColor: "#AC1E2C",
      leagueLogo: "/images/leagues/seriea.png"
    }
  ];

  const currentData = testData[currentType - 1] || {
    teamAName,
    teamBName,
    teamALogo,
    teamBLogo,
    teamAScore,
    teamBScore,
    matchTime,
    teamAKitColor,
    teamBKitColor,
    leagueLogo
  };

  const runningText = "⚽ Trực tiếp bóng đá hôm nay • Kết quả trực tuyến • Thông tin nhanh nhất ";

  const renderType1 = () => (
    <div className="flex items-center justify-between w-full bg-white">
      {/* Team A */}
      <div className="flex items-center">
        <img 
          src={currentData.teamALogo} 
          alt="Team A" 
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          style={{clipPath: 'circle(50%)'}}
        />
        <div className="ml-2 bg-yellow-400 text-black px-3 py-2 font-bold text-lg min-w-[40px] text-center">
          {currentData.teamAScore}
        </div>
      </div>

      {/* Center section */}
      <div className="flex-1 mx-4">
        <div className="container-name-color mb-1">
          <div className="bg-blue-600 text-white px-4 py-1 text-center font-semibold">
            {currentData.teamAName}
          </div>
          <div 
            className="h-2 w-full"
            style={{backgroundColor: currentData.teamAKitColor}}
          ></div>
        </div>
        
        {showMatchTime && (
          <div className="bg-black text-white px-4 py-1 text-center font-bold my-2">
            {currentData.matchTime}
          </div>
        )}
        
        <div className="container-name-color">
          <div className="bg-blue-600 text-white px-4 py-1 text-center font-semibold">
            {currentData.teamBName}
          </div>
          <div 
            className="h-2 w-full"
            style={{backgroundColor: currentData.teamBKitColor}}
          ></div>
        </div>
      </div>

      {/* Team B */}
      <div className="flex items-center">
        <div className="mr-2 bg-yellow-400 text-black px-3 py-2 font-bold text-lg min-w-[40px] text-center">
          {currentData.teamBScore}
        </div>
        <img 
          src={currentData.teamBLogo} 
          alt="Team B" 
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          style={{clipPath: 'circle(50%)'}}
        />
      </div>
    </div>
  );

  const renderType2 = () => (
    <div 
      className="flex items-center justify-between w-full relative z-10"
      style={{
        background: 'linear-gradient(to right, #0088FF 30%, #FF0000 70%)'
      }}
    >
      {/* Team A */}
      <div className="flex items-center text-white">
        <img 
          src={currentData.teamALogo} 
          alt="Team A" 
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
          style={{clipPath: 'circle(50%)'}}
        />
        <div className="ml-3">
          <div className="container-name-color">
            <div className="text-white font-semibold px-2 py-1">
              {currentData.teamAName}
            </div>
            <div 
              className="h-2 w-full"
              style={{backgroundColor: currentData.teamAKitColor}}
            ></div>
          </div>
        </div>
        <div className="ml-3 text-white font-bold text-xl">
          {currentData.teamAScore}
        </div>
      </div>

      {/* Center */}
      {showMatchTime && (
        <div className="bg-red-600 text-white px-4 py-2 font-bold rounded">
          {currentData.matchTime}
        </div>
      )}

      {/* Team B */}
      <div className="flex items-center text-white">
        <div className="mr-3 text-white font-bold text-xl">
          {currentData.teamBScore}
        </div>
        <div className="mr-3">
          <div className="container-name-color">
            <div className="text-white font-semibold px-2 py-1">
              {currentData.teamBName}
            </div>
            <div 
              className="h-2 w-full"
              style={{backgroundColor: currentData.teamBKitColor}}
            ></div>
          </div>
        </div>
        <img 
          src={currentData.teamBLogo} 
          alt="Team B" 
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
          style={{clipPath: 'circle(50%)'}}
        />
      </div>
    </div>
  );

  const renderType3 = () => (
    <div className="flex items-center justify-between w-full bg-gray-800">
      {/* Team A */}
      <div className="flex items-center">
        <img 
          src={currentData.teamALogo} 
          alt="Team A" 
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          style={{clipPath: 'circle(50%)'}}
        />
        <div className="ml-3">
          <div className="container-name-color">
            <div className="text-white px-3 py-1 font-semibold" style={{backgroundColor: '#0d94a4'}}>
              {currentData.teamAName}
            </div>
            <div 
              className="h-2 w-full"
              style={{backgroundColor: currentData.teamAKitColor}}
            ></div>
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="text-center">
        <div className="text-white font-bold text-xl mb-1">
          {currentData.teamAScore} - {currentData.teamBScore}
        </div>
        {showMatchTime && (
          <div className="bg-red-600 text-white px-3 py-1 font-bold text-sm rounded">
            {currentData.matchTime}
          </div>
        )}
      </div>

      {/* Team B */}
      <div className="flex items-center">
        <div className="mr-3">
          <div className="container-name-color">
            <div className="text-white px-3 py-1 font-semibold" style={{backgroundColor: '#0d94a4'}}>
              {currentData.teamBName}
            </div>
            <div 
              className="h-2 w-full"
              style={{backgroundColor: currentData.teamBKitColor}}
            ></div>
          </div>
        </div>
        <img 
          src={currentData.teamBLogo} 
          alt="Team B" 
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          style={{clipPath: 'circle(50%)'}}
        />
      </div>
    </div>
  );

  const renderType4 = () => (
    <div className="flex items-center justify-between w-full bg-gray-900">
      {/* Team A */}
      <div className="flex items-center">
        <img 
          src={currentData.teamALogo} 
          alt="Team A" 
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          style={{clipPath: 'circle(50%)'}}
        />
        <div className="ml-3 flex items-center">
          <div className="container-name-color mr-2">
            <div 
              className="text-white px-3 py-1 font-semibold"
              style={{background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))'}}
            >
              {currentData.teamAName}
            </div>
          </div>
          <div 
            className="h-8 w-3 mr-2"
            style={{backgroundColor: currentData.teamAKitColor}}
          ></div>
        </div>
      </div>

      {/* Center Hex Logo */}
      <div className="text-center">
        <div 
          className="hex-logo px-4 py-2 relative"
          style={{backgroundColor: '#213f80'}}
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-white font-bold text-lg">{currentData.teamAScore}</span>
            {currentData.leagueLogo && (
              <img 
                src={currentData.leagueLogo} 
                alt="League" 
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-white font-bold text-lg">{currentData.teamBScore}</span>
          </div>
        </div>
        {showMatchTime && (
          <div className="bg-red-600 text-white px-3 py-1 font-bold text-sm rounded mt-1">
            {currentData.matchTime}
          </div>
        )}
      </div>

      {/* Team B */}
      <div className="flex items-center">
        <div className="mr-3 flex items-center">
          <div 
            className="h-8 w-3 mr-2"
            style={{backgroundColor: currentData.teamBKitColor}}
          ></div>
          <div className="container-name-color">
            <div 
              className="text-white px-3 py-1 font-semibold"
              style={{background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))'}}
            >
              {currentData.teamBName}
            </div>
          </div>
        </div>
        <img 
          src={currentData.teamBLogo} 
          alt="Team B" 
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          style={{clipPath: 'circle(50%)'}}
        />
      </div>
    </div>
  );

  const renderScoreboard = () => {
    switch(currentType) {
      case 1: return renderType1();
      case 2: return renderType2();
      case 3: return renderType3();
      case 4: return renderType4();
      default: return renderType1();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 relative overflow-x-auto">
      {/* Running Text */}
      <div 
        className="w-full py-2 overflow-hidden relative"
        style={{
          backgroundColor: runningTextBg,
          color: runningTextColor
        }}
      >
        <div className="animate-marquee whitespace-nowrap">
          {Array(runningTextRepeat).fill(runningText).join('')}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative flex flex-col items-center pt-8">
        {/* ScoLiv Logo */}
        <div className="absolute bottom-4 left-4">
          <img 
            src="/images/basic/ScoLivLogo.png" 
            alt="ScoLiv" 
            className="w-16 h-16 object-cover"
          />
        </div>

        {/* Scoreboard Main */}
        <div className="scoreboard-main w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {renderScoreboard()}
          </div>
        </div>

        {/* Live Match Tag */}
        <div className="mt-4 bg-white text-black px-6 py-2 rounded-full border-2 border-black font-semibold">
          Trực tiếp trận đấu
        </div>

        {/* Test Controls */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[1, 2, 3, 4].map(typeNum => (
            <button
              key={typeNum}
              onClick={() => setCurrentType(typeNum)}
              className={`px-4 py-2 rounded font-semibold ${
                currentType === typeNum 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Loại {typeNum}
            </button>
          ))}
          <button
            onClick={() => setShowMatchTime(!showMatchTime)}
            className={`px-4 py-2 rounded font-semibold ml-4 ${
              showMatchTime 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showMatchTime ? 'Ẩn' : 'Hiện'} Thời gian
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .container-name-color {
          display: flex;
          flex-direction: column;
        }
        .hex-logo {
          position: relative;
          border-radius: 4px;
        }
        .hex-logo::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: #213f80;
          transform: skewX(-30deg);
        }
        .hex-logo::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: #213f80;
          transform: skewX(30deg);
        }
        @media (max-width: 768px) {
          .scoreboard-main {
            font-size: 0.875rem;
          }
          .scoreboard-main img {
            width: 2.5rem;
            height: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ScoreboardBelow;