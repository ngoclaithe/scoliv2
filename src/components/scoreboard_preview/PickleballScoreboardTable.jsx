import React from 'react';
import DisplayLogo from '../common/DisplayLogo';

const PickleballScoreboardTable = ({ 
  currentData, 
  logoShape, 
  showMatchTime 
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">PICKLEBALL</h2>
          {showMatchTime && (
            <div className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
              {currentData.matchTime}
            </div>
          )}
          {!showMatchTime && (
            <div className="bg-green-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              ● TRỰC TIẾP
            </div>
          )}
        </div>
      </div>

      {/* Scoreboard Table */}
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">
                ĐỘI THI ĐẤU
              </th>
              <th className="border border-gray-300 p-3 text-center font-bold text-gray-700 w-20">
                SET
              </th>
              <th className="border border-gray-300 p-3 text-center font-bold text-gray-700 w-20">
                ĐIỂM
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Team A Row */}
            <tr className="hover:bg-blue-50 transition-colors">
              <td className="border border-gray-300 p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex-shrink-0">
                    <DisplayLogo
                      logos={[currentData.teamALogo]}
                      alt={currentData.teamAName}
                      className="w-full h-full"
                      type_play={logoShape}
                      logoSize="w-12 h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-800">
                      {currentData.teamAName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Đội A
                    </div>
                  </div>
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="bg-blue-100 text-blue-800 font-bold text-xl py-2 px-3 rounded-lg">
                  {currentData.teamAScoreSet || 0}
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="bg-green-100 text-green-800 font-bold text-xl py-2 px-3 rounded-lg">
                  {currentData.teamAScore || 0}
                </div>
              </td>
            </tr>

            {/* Team B Row */}
            <tr className="hover:bg-red-50 transition-colors">
              <td className="border border-gray-300 p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex-shrink-0">
                    <DisplayLogo
                      logos={[currentData.teamBLogo]}
                      alt={currentData.teamBName}
                      className="w-full h-full"
                      type_play={logoShape}
                      logoSize="w-12 h-12"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-800">
                      {currentData.teamBName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Đội B
                    </div>
                  </div>
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="bg-red-100 text-red-800 font-bold text-xl py-2 px-3 rounded-lg">
                  {currentData.teamBScoreSet || 0}
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="bg-green-100 text-green-800 font-bold text-xl py-2 px-3 rounded-lg">
                  {currentData.teamBScore || 0}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-2 px-4 text-center text-sm text-gray-600">
        {currentData.period || "Trận đấu Pickleball"}
      </div>
    </div>
  );
};

export default PickleballScoreboardTable;
