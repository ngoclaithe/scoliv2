import React from 'react';
import { getFullLogoUrl } from '../../utils/logoUtils';

const ScoreboardPreview = ({ matchData, displaySettings }) => {
  const currentData = {
    teamAName: matchData?.teamA?.name || matchData?.homeTeam?.name || "ĐỘI A",
    teamBName: matchData?.teamB?.name || matchData?.awayTeam?.name || "ĐỘI B",
    teamALogo: getFullLogoUrl(matchData?.teamA?.logo || matchData?.homeTeam?.logo) || "/api/placeholder/90/90",
    teamBLogo: getFullLogoUrl(matchData?.teamB?.logo || matchData?.awayTeam?.logo) || "/api/placeholder/90/90",
    teamAScore: matchData?.teamA?.score || 0,
    teamBScore: matchData?.teamB?.score || 0,
    matchTime: matchData?.matchTime || "00:00",
    period: matchData?.period || "Chưa bắt đầu",
    status: matchData?.status || "waiting",
    teamAKitColor: matchData?.teamAKitColor || "#FF0000",
    teamBKitColor: matchData?.teamBKitColor || "#0000FF"
  };
  // console.log("Giá trị matchData hiện tại là:", matchData);

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

  const renderScoreboardType1 = () => {
    const getClampedFontSize = (name) => {
      const dynamicSize = (120 / Math.max(1, name.length)) * 1.5;
      return Math.max(12, Math.min(20, dynamicSize));
    };

    return (
      <div className="flex items-end justify-center gap-0 scale-75">
        <div className="flex">
          <div className="flex flex-col items-center">
            <div
              className="bg-yellow-400 text-black font-bold text-lg px-2 py-0.5 text-center flex items-center justify-center"
              style={{ fontFamily: 'UTM Bebas, sans-serif', height: '32px', minWidth: '32px' }}
            >
              {currentData.teamAScore}
            </div>
            <div className="w-[120px]">
              <div
                className="w-full text-white font-normal whitespace-nowrap text-center truncate flex items-center justify-center"
                style={{
                  backgroundColor: '#004d73',
                  fontFamily: 'UTM Bebas, sans-serif',
                  height: '24px',
                  fontSize: `${getClampedFontSize(currentData.teamAName)}px`
                }}
              >
                {currentData.teamAName}
              </div>
              <div className="flex w-full" style={{ height: '4px' }}>
                <div
                  className="flex-1"
                  style={{ backgroundColor: currentData.teamAKitColor }}
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: currentData.teamA2KitColor || currentData.teamAKitColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {showMatchTime && (
          <div
            className="bg-black text-white px-2 py-1 text-xs font-bold whitespace-nowrap flex items-center justify-center"
            style={{ height: '32px' }}
          >
            {currentData.matchTime}
          </div>
        )}

        <div className="flex">
          <div className="flex flex-col items-center">
            <div
              className="bg-yellow-400 text-black font-bold text-lg px-2 py-0.5 text-center flex items-center justify-center"
              style={{ fontFamily: 'UTM Bebas, sans-serif', height: '32px', minWidth: '32px' }}
            >
              {currentData.teamBScore}
            </div>
            <div className="w-[120px]">
              <div
                className="w-full text-white font-normal whitespace-nowrap text-center truncate flex items-center justify-center"
                style={{
                  backgroundColor: '#004d73',
                  fontFamily: 'UTM Bebas, sans-serif',
                  height: '24px',
                  fontSize: `${getClampedFontSize(currentData.teamBName)}px`
                }}
              >
                {currentData.teamBName}
              </div>
              <div className="flex w-full" style={{ height: '4px' }}>
                <div
                  className="flex-1"
                  style={{ backgroundColor: currentData.teamB2KitColor || currentData.teamBKitColor }}
                />
                <div
                  className="flex-1"
                  style={{ backgroundColor: currentData.teamBKitColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const renderScoreboardType3 = () => {
    const calculateFontSize = (teamAName, teamBName) => {
      const maxLength = Math.max(teamAName?.length || 0, teamBName?.length || 0);

      if (maxLength <= 8) return 'text-sm';
      if (maxLength <= 12) return 'text-xs';
      if (maxLength <= 16) return 'text-[10px]';
      return 'text-[9px]';
    };

    const fontSize = calculateFontSize(currentData.teamAName, currentData.teamBName);

    return (
      <div className="flex flex-col items-center w-[260px] scale-75">
        <div className="flex items-center justify-between w-full bg-white">
          <div className="flex flex-col flex-1">
            {/* Main content row - grid 3 columns */}
            <div className="grid grid-cols-[1fr_auto_1fr] w-full items-stretch">
              {/* Team A */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-white ${fontSize} font-medium w-full truncate text-center min-h-[20px] flex items-center justify-center`}
                  style={{ backgroundColor: '#0d94a4', fontFamily: 'UTM Bebas, sans-serif' }}
                >
                  {currentData.teamAName}
                </div>
                <div className="flex w-full h-[3px] overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: currentData.teamAKitColor }} />
                  <div className="flex-1" style={{ backgroundColor: currentData.teamA2KitColor || currentData.teamAKitColor }} />
                </div>
              </div>

              {/* Score + time */}
              <div className="flex flex-col items-center">
                <div className="flex items-center bg-white h-full px-1 py-[1px]" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                  <span className="font-bold text-sm text-gray-900" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>{currentData.teamAScore}</span>
                  <span className="text-gray-400 font-light text-xs mx-1">:</span>
                  <span className="font-bold text-sm text-gray-900" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>{currentData.teamBScore}</span>
                </div>
                {showMatchTime && (
                  <div className="bg-red-600 text-white text-[10px] font-semibold whitespace-nowrap w-full text-center py-[1px]">
                    {currentData.matchTime}
                  </div>
                )}
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-white ${fontSize} font-medium w-full truncate text-center min-h-[20px] flex items-center justify-center`}
                  style={{ backgroundColor: '#0d94a4', fontFamily: 'UTM Bebas, sans-serif' }}
                >
                  {currentData.teamBName}
                </div>
                <div className="flex w-full h-[3px] overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: currentData.teamBKitColor }} />
                  <div className="flex-1" style={{ backgroundColor: currentData.teamB2KitColor || currentData.teamBKitColor }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderScoreboardType4 = () => (
    <div className="flex items-center justify-center gap-0 scale-75 origin-center">
      {/* Team A Logo */}
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

      <div className="flex items-center gap-0 -space-x-2">
        <div
          className="text-white text-xs font-semibold flex items-center justify-center w-24 h-6"
          style={{
            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
          }}
        >
          <span className="truncate text-center">{currentData.teamAName}</span>
        </div>
        <div
          className="w-8 h-6 z-10"
          style={{
            backgroundColor: currentData.teamAKitColor,
            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)'
          }}
        />
      </div>

      <div className="flex flex-col items-center -mx-1">
        <div
          className="flex items-center justify-center px-2 relative"
          style={{
            backgroundColor: '#213f80',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            minHeight: '32px',
            width: '80px'
          }}
        >
          <div className="text-white font-bold text-sm min-w-[1rem] text-center">
            {currentData.teamAScore}
          </div>
          <div className="mx-1 w-4 h-4 rounded-full flex items-center justify-center text-xs overflow-hidden">
            <img
              src="/images/basic/logo-skin4.png"
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
        <div className={`text-white text-xs font-bold px-1 py-0.5 rounded ${showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}>
          {showMatchTime ? currentData.matchTime : '● LIVE'}
        </div>
      </div>

      <div className="flex items-center gap-0 -space-x-2">
        <div
          className="w-8 h-6 z-10"
          style={{
            backgroundColor: currentData.teamBKitColor,
            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)'
          }}
        />
        <div
          className="text-white text-xs font-semibold flex items-center justify-center w-24 h-6"
          style={{
            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
          }}
        >
          <span className="truncate text-center">{currentData.teamBName}</span>
        </div>
      </div>

      {/* Team B Logo */}
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
    </div>
  );
};

export default ScoreboardPreview;
