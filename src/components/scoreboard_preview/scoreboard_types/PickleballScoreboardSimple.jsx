import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const PickleballScoreboardSimple = ({ currentData, logoShape, showMatchTime }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 flex justify-between items-center">
        <h3 className="font-bold text-sm">PICKLEBALL</h3>
        {showMatchTime ? (
          <div className="bg-red-600 px-2 py-1 rounded text-xs font-bold">
            {currentData.matchTime}
          </div>
        ) : (
          <div className="bg-green-600 px-2 py-1 rounded text-xs font-bold animate-pulse">
            ● LIVE
          </div>
        )}
      </div>

      {/* Simple 2-row table */}
      <div className="p-3">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-2 mb-2 text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">
          <div className="text-left">ĐỘI</div>
          <div className="text-center">SET</div>
          <div className="text-center">ĐIỂM</div>
          <div className="text-center">LOGO</div>
        </div>

        {/* Team A row */}
        <div className="grid grid-cols-4 gap-2 items-center py-2 hover:bg-blue-50 rounded">
          <div className="text-left">
            <div className="font-semibold text-sm text-gray-800 truncate">
              {currentData.teamAName}
            </div>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 font-bold text-lg py-1 px-2 rounded">
              {currentData.teamAScoreSet || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="bg-green-100 text-green-800 font-bold text-lg py-1 px-2 rounded">
              {currentData.teamAScore || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto">
              <DisplayLogo
                logos={[currentData.teamALogo]}
                alt={currentData.teamAName}
                className="w-full h-full"
                type_play={logoShape}
                logoSize="w-8 h-8"
              />
            </div>
          </div>
        </div>

        {/* Team B row */}
        <div className="grid grid-cols-4 gap-2 items-center py-2 hover:bg-red-50 rounded">
          <div className="text-left">
            <div className="font-semibold text-sm text-gray-800 truncate">
              {currentData.teamBName}
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-100 text-red-800 font-bold text-lg py-1 px-2 rounded">
              {currentData.teamBScoreSet || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="bg-green-100 text-green-800 font-bold text-lg py-1 px-2 rounded">
              {currentData.teamBScore || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto">
              <DisplayLogo
                logos={[currentData.teamBLogo]}
                alt={currentData.teamBName}
                className="w-full h-full"
                type_play={logoShape}
                logoSize="w-8 h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-3 py-1 text-center text-xs text-gray-600">
        {currentData.period || "Trận đấu Pickleball"}
      </div>
    </div>
  );
};

export default PickleballScoreboardSimple;
