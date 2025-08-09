import React from 'react';

const DynamicPoster = ({ dynamicData, posterType = 'tretrung' }) => {
  if (!dynamicData) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            {dynamicData.matchTitle || 'TRẬN Đ���U'}
          </h1>
          <p className="text-xl text-gray-300 mb-2">{dynamicData.stadium || 'Sân vận động'}</p>
          <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold animate-pulse">
            {dynamicData.liveText || 'LIVE'}
          </div>
        </div>

        {/* Teams Section */}
        <div className="grid grid-cols-3 gap-12 items-center w-full max-w-5xl">
          
          {/* Team A */}
          <div className="text-center">
            <div className="mb-6">
              {dynamicData.teamA.logo ? (
                <img 
                  src={dynamicData.teamA.logo} 
                  alt={dynamicData.teamA.name}
                  className="w-32 h-32 object-contain mx-auto rounded-full bg-white bg-opacity-20 p-4 shadow-2xl"
                />
              ) : (
                <div 
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl"
                  style={{ backgroundColor: dynamicData.teamA.kitColor }}
                >
                  A
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">{dynamicData.teamA.name}</h2>
            <div 
              className="text-7xl font-bold p-6 rounded-xl shadow-2xl bg-opacity-20"
              style={{ backgroundColor: dynamicData.teamA.kitColor }}
            >
              {dynamicData.teamA.score}
            </div>
          </div>

          {/* VS Section */}
          <div className="text-center">
            <div className="text-6xl font-bold mb-6 text-yellow-400">VS</div>
            <div className="bg-black bg-opacity-50 text-white px-6 py-4 rounded-xl">
              <div className="text-2xl font-bold">{dynamicData.matchTime}</div>
              <div className="text-sm opacity-75">Thời gian</div>
            </div>
          </div>

          {/* Team B */}
          <div className="text-center">
            <div className="mb-6">
              {dynamicData.teamB.logo ? (
                <img 
                  src={dynamicData.teamB.logo} 
                  alt={dynamicData.teamB.name}
                  className="w-32 h-32 object-contain mx-auto rounded-full bg-white bg-opacity-20 p-4 shadow-2xl"
                />
              ) : (
                <div 
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl"
                  style={{ backgroundColor: dynamicData.teamB.kitColor }}
                >
                  B
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">{dynamicData.teamB.name}</h2>
            <div 
              className="text-7xl font-bold p-6 rounded-xl shadow-2xl bg-opacity-20"
              style={{ backgroundColor: dynamicData.teamB.kitColor }}
            >
              {dynamicData.teamB.score}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-black bg-opacity-30 px-8 py-4 rounded-full">
            <p className="text-lg font-semibold">⚡ Dynamic Route Poster</p>
            <p className="text-sm text-gray-300">Template: {posterType} | View: {dynamicData.view}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPoster;
