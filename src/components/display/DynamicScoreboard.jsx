import React from 'react';

const DynamicScoreboard = ({ dynamicData, type = 1 }) => {
  if (!dynamicData) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-800 to-green-900 text-white flex items-center justify-center">
      <div className="bg-black bg-opacity-50 p-8 rounded-xl shadow-2xl w-full max-w-4xl mx-4">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{dynamicData.matchTitle || 'TRẬN ĐẤU'}</h1>
          <p className="text-gray-300">{dynamicData.stadium || 'Sân vận động'}</p>
          <p className="text-orange-400">{dynamicData.liveText || 'LIVE'}</p>
        </div>

        {/* Main Scoreboard */}
        <div className="grid grid-cols-3 gap-8 items-center">
          
          {/* Team A */}
          <div className="text-center">
            <div className="mb-4">
              {dynamicData.teamA.logo ? (
                <img 
                  src={dynamicData.teamA.logo} 
                  alt={dynamicData.teamA.name}
                  className="w-24 h-24 object-contain mx-auto rounded-full bg-white p-2"
                />
              ) : (
                <div 
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: dynamicData.teamA.kitColor }}
                >
                  A
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{dynamicData.teamA.name}</h2>
            <div 
              className="text-6xl font-bold p-4 rounded-lg"
              style={{ backgroundColor: dynamicData.teamA.kitColor + '40' }}
            >
              {dynamicData.teamA.score}
            </div>
          </div>

          {/* VS & Time */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-4">VS</div>
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
              <div className="text-xl font-bold">{dynamicData.matchTime}</div>
              <div className="text-sm">LIVE</div>
            </div>
          </div>

          {/* Team B */}
          <div className="text-center">
            <div className="mb-4">
              {dynamicData.teamB.logo ? (
                <img 
                  src={dynamicData.teamB.logo} 
                  alt={dynamicData.teamB.name}
                  className="w-24 h-24 object-contain mx-auto rounded-full bg-white p-2"
                />
              ) : (
                <div 
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: dynamicData.teamB.kitColor }}
                >
                  B
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{dynamicData.teamB.name}</h2>
            <div 
              className="text-6xl font-bold p-4 rounded-lg"
              style={{ backgroundColor: dynamicData.teamB.kitColor + '40' }}
            >
              {dynamicData.teamB.score}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400">
          <p>⚡ Dynamic Route Scoreboard</p>
          <p className="text-xs">View: {dynamicData.view} | Type: {type}</p>
        </div>
      </div>
    </div>
  );
};

export default DynamicScoreboard;
