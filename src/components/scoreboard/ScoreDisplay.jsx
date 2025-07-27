import React from "react";

const ScoreDisplay = ({
  teamA = { name: "Đội A", score: 0, logo: null },
  teamB = { name: "Đội B", score: 0, logo: null },
  matchTime = "00:00",
  period = "Hiệp 1",
  status = "live", // live, pause, ended
  backgroundColor = "bg-gradient-to-r from-blue-600 to-purple-600",
  textColor = "text-white",
  size = "lg",
  showLogos = true,
  className = "",
}) => {
  const sizes = {
    sm: {
      container: "p-3",
      score: "text-2xl",
      teamName: "text-sm",
      time: "text-xs",
      period: "text-xs",
      logo: "w-8 h-8",
    },
    md: {
      container: "p-4",
      score: "text-3xl",
      teamName: "text-base",
      time: "text-sm",
      period: "text-sm",
      logo: "w-10 h-10",
    },
    lg: {
      container: "p-6",
      score: "text-4xl md:text-5xl",
      teamName: "text-lg md:text-xl",
      time: "text-base",
      period: "text-base",
      logo: "w-12 h-12 md:w-16 md:h-16",
    },
  };

  const currentSize = sizes[size];

  const getStatusIndicator = () => {
    switch (status) {
      case "live":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-300 font-medium">TRỰC TIẾP</span>
          </div>
        );
      case "pause":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-300 font-medium">TẠM DỪNG</span>
          </div>
        );
      case "ended":
        return <span className="text-gray-300 font-medium">KẾT THÚC</span>;
      default:
        return null;
    }
  };

  const TeamLogo = ({ team, position }) => {
    if (!showLogos || !team.logo) {
      return (
        <div
          className={`${currentSize.logo} bg-white bg-opacity-20 rounded-full flex items-center justify-center`}
        >
          <span className="text-white font-bold text-xs">
            {team.name.charAt(0)}
          </span>
        </div>
      );
    }

    return (
      <div
        className={`${currentSize.logo} overflow-hidden rounded-full bg-white`}
      >
        <img
          src={team.logo}
          alt={`${team.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <div
      className={`
      ${backgroundColor} ${textColor} ${currentSize.container} 
      rounded-lg shadow-lg w-full max-w-4xl mx-auto 
      ${className}
    `}
    >
      {/* Header với thời gian và trạng thái */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className={`${currentSize.time} font-mono font-bold`}>
            {matchTime}
          </span>
          <span className={`${currentSize.period} opacity-90`}>{period}</span>
        </div>
        {getStatusIndicator()}
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-between">
        {/* Team A */}
        <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
          <TeamLogo team={teamA} position="teamA" />
          <div className="text-center">
            <h3
              className={`${currentSize.teamName} font-bold truncate max-w-full`}
            >
              {teamA.name}
            </h3>
          </div>
        </div>

        {/* Score */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <span className={`${currentSize.score} font-bold font-mono`}>
              {teamA.score}
            </span>
            <span className={`${currentSize.time} opacity-75`}>-</span>
            <span className={`${currentSize.score} font-bold font-mono`}>
              {teamB.score}
            </span>
          </div>
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col items-center space-y-2 sm:space-y-3">
          <TeamLogo team={teamB} position="teamB" />
          <div className="text-center">
            <h3
              className={`${currentSize.teamName} font-bold truncate max-w-full`}
            >
              {teamB.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Additional info cho mobile */}
      <div className="mt-4 sm:hidden flex justify-center items-center space-x-4 text-xs opacity-90">
        <span>{teamA.name}</span>
        <span>
          {teamA.score} - {teamB.score}
        </span>
        <span>{teamB.name}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;
