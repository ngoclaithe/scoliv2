import React from 'react';

const ScoreboardPreview = ({ matchData, displaySettings }) => {
  const currentData = {
    teamAName: matchData?.teamA?.name || "ĐỘI A",
    teamBName: matchData?.teamB?.name || "ĐỘI B",
    teamALogo: matchData?.teamA?.logo || "/api/placeholder/90/90",
    teamBLogo: matchData?.teamB?.logo || "/api/placeholder/90/90",
    teamAScore: matchData?.teamA?.score || 0,
    teamBScore: matchData?.teamB?.score || 0,
    matchTime: matchData?.matchTime || "00:00",
    period: matchData?.period || "Chưa bắt đầu",
    status: matchData?.status || "waiting",
    teamAKitColor: matchData?.teamAKitColor || "#FF0000", 
    teamBKitColor: matchData?.teamBKitColor || "#0000FF"
  };
  console.log("Giá trị matchData hiện tại là:", matchData);

  const currentType = displaySettings?.selectedSkin || 1;
  const showMatchTime = currentData.status === 'live' || currentData.status === 'paused';

  const getTextColor = (backgroundColor) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const renderScoreboardType1 = () => (
    <div className="flex items-center justify-center gap-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={currentData.teamALogo} 
          alt="Team A Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
          A
        </div>
      </div>

      <div className="flex items-center gap-0">
        <div className="bg-yellow-400 text-black font-bold text-sm px-1 py-0.5 min-w-[1.5rem] text-center"
          style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}>
          {currentData.teamAScore}
        </div>
        <div className="flex flex-col items-center w-[60px]">
          <div className="w-full bg-blue-600 text-white px-1 py-0.5 text-xs font-semibold text-center truncate">
            {currentData.teamAName}
          </div>
          <div
            className="w-full h-2"
            style={{ backgroundColor: currentData.teamAKitColor }}
          />
        </div>
      </div>

      {showMatchTime && (
        <div className="bg-black text-white px-1 py-0.5 text-xs font-bold">
          {currentData.matchTime}
        </div>
      )}

      <div className="flex items-center gap-0">
        <div className="flex flex-col items-center w-[60px]">
          <div className="w-full bg-blue-600 text-white px-1 py-0.5 text-xs font-semibold text-center truncate">
            {currentData.teamBName}
          </div>
          <div
            className="w-full h-2"
            style={{ backgroundColor: currentData.teamBKitColor }}
          />
        </div>
        <div className="bg-yellow-400 text-black font-bold text-sm px-1 py-0.5 min-w-[1.5rem] text-center"
          style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)' }}>
          {currentData.teamBScore}
        </div>
      </div>

      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={currentData.teamBLogo} 
          alt="Team B Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
          B
        </div>
      </div>
    </div>
  );

  const renderScoreboardType2 = () => (
    <div className="flex justify-center items-center">
      <div className="flex items-center mr-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
          <img 
            src={currentData.teamALogo} 
            alt="Team A Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
            A
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-center h-6 rounded-md gap-0"
        style={{
          background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
          overflow: 'hidden',
          width: showMatchTime ? '200px' : '180px',
        }}
      >
        <div
          className="text-xs font-semibold flex items-center justify-center truncate"
          style={{
            width: '80px',
            height: '100%',
            color: getTextColor(currentData.teamAKitColor),
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {currentData.teamAName}
        </div>

        <div
          className="text-white font-bold text-sm text-center"
          style={{
            WebkitTextStroke: '1px black',
            width: '1.5rem',
            height: '100%',
            lineHeight: '1.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {currentData.teamAScore}
        </div>

        {showMatchTime && (
          <div className="bg-yellow-400 text-black text-xs font-bold rounded px-1 h-full flex items-center">
            {currentData.matchTime}
          </div>
        )}

        <div
          className="text-white font-bold text-sm text-center"
          style={{
            WebkitTextStroke: '1px black',
            width: '1.5rem',
            height: '100%',
            lineHeight: '1.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {currentData.teamBScore}
        </div>

        <div
          className="text-xs font-semibold flex items-center justify-center truncate"
          style={{
            width: '80px',
            height: '100%',
            color: getTextColor(currentData.teamBKitColor),
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {currentData.teamBName}
        </div>
      </div>

      <div className="flex items-center ml-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
          <img 
            src={currentData.teamBLogo} 
            alt="Team B Logo" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
            B
          </div>
        </div>
      </div>
    </div>
  );

  const renderScoreboardType3 = () => (
    <div className="flex items-center justify-between">
      <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={currentData.teamALogo} 
          alt="Team A Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
          A
        </div>
      </div>

      <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1">
        <div className="flex items-center">
          <div className="text-white px-2 py-1 text-xs font-medium bg-gray-800/80 rounded w-[80px] truncate">
            {currentData.teamAName}
          </div>
          <div
            className="w-1 h-4 ml-1 rounded-full"
            style={{ backgroundColor: currentData.teamAKitColor }}
          />
        </div>

        <div className="mx-2 flex flex-col items-center">
          <div className="flex items-center bg-white/95 px-2 py-0.5 rounded shadow-sm">
            <span className="font-bold text-sm text-gray-900">{currentData.teamAScore}</span>
            <span className="mx-1 text-gray-400 font-light">:</span>
            <span className="font-bold text-sm text-gray-900">{currentData.teamBScore}</span>
          </div>
          {showMatchTime && (
            <div className="bg-red-600 text-white px-1 py-0.5 text-xs font-medium rounded-sm mt-1">
              {currentData.matchTime}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div
            className="w-1 h-4 mr-1 rounded-full"
            style={{ backgroundColor: currentData.teamBKitColor }}
          />
          <div className="text-white px-2 py-1 text-xs font-medium bg-gray-800/80 rounded w-[80px] truncate text-right">
            {currentData.teamBName}
          </div>
        </div>
      </div>

      <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={currentData.teamBLogo} 
          alt="Team B Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
          B
        </div>
      </div>
    </div>
  );

  const renderScoreboardType4 = () => (
    <div className="flex items-center justify-between">
      <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={currentData.teamALogo} 
          alt="Team A Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
          A
        </div>
      </div>

      <div className="flex items-center">
        <div
          className="text-white text-xs font-semibold flex items-center justify-center w-16 h-5"
          style={{
            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
          }}
        >
          <span className="truncate text-center">{currentData.teamAName}</span>
        </div>
        <div
          className="w-8 h-5"
          style={{
            backgroundColor: currentData.teamAKitColor,
            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)'
          }}
        />
      </div>

      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center px-2 relative"
          style={{
            backgroundColor: '#213f80',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            minHeight: '32px'
          }}
        >
          <div className="text-white font-bold text-sm min-w-[1rem] text-center">
            {currentData.teamAScore}
          </div>
          <div className="mx-1 w-5 h-5 rounded-full flex items-center justify-center text-xs overflow-hidden">
            <img 
              src="/api/placeholder/20/20" 
              alt="League Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
              L
            </div>
          </div>
          <div className="text-white font-bold text-sm min-w-[1rem] text-center">
            {currentData.teamBScore}
          </div>
        </div>
        <div className={`text-white text-xs font-bold px-1 py-0.5 ${showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}>
          {showMatchTime ? currentData.matchTime : '● LIVE'}
        </div>
      </div>

      <div className="flex items-center">
        <div
          className="w-8 h-5"
          style={{
            backgroundColor: currentData.teamBKitColor,
            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)'
          }}
        />
        <div
          className="text-white text-xs font-semibold flex items-center justify-center w-16 h-5"
          style={{
            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
          }}
        >
          <span className="truncate text-center">{currentData.teamBName}</span>
        </div>
      </div>

      <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={currentData.teamBLogo} 
          alt="Team B Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold" style={{display: 'none'}}>
          B
        </div>
      </div>
    </div>
  );

  const renderScoreboard = () => {
    switch (currentType) {
      case 1: return renderScoreboardType1();
      case 2: return renderScoreboardType2();
      case 3: return renderScoreboardType3();
      case 4: return renderScoreboardType4();
      default: return renderScoreboardType1();
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="scoreboard-preview">
        {renderScoreboard()}
      </div>
      {!showMatchTime && (
        <div className="absolute bottom-1 right-1">
          <span className="bg-green-600 text-white px-2 py-0.5 text-xs font-bold rounded animate-pulse">
            ● LIVE
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreboardPreview;