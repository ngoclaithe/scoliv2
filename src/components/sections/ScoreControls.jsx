import React from 'react';
import Button from '../common/Button';

const ScoreControls = ({ 
  typeMatch, 
  matchData, 
  onScoreChange, 
  onSetScoreChange 
}) => {
  if (typeMatch === 'pickleball') {
    return (
      <div className="space-y-3">
        {/* Set Controls */}
        <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
          <h4 className="text-center font-bold text-sm mb-2 text-yellow-800">ĐIỀU KHIỂN SET</h4>
          <div className="grid grid-cols-2 gap-2">
            {/* Đội A Set */}
            <div className="bg-white rounded-lg p-1 shadow-md border border-yellow-200">
              <div className="flex space-x-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-8 px-2 text-sm"
                  style={{ flex: 2 }}
                  onClick={() => onSetScoreChange("teamA", 1)}
                >
                  +
                </Button>
                <div className="bg-orange-100 text-orange-800 font-bold h-8 px-2 flex items-center justify-center rounded text-sm min-w-8">
                  {matchData.teamA.scoreSet || 0}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold h-8 px-2 text-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSetScoreChange("teamA", -1)}
                >
                  -
                </Button>
              </div>
            </div>

            {/* Đội B Set */}
            <div className="bg-white rounded-lg p-1 shadow-md border border-yellow-200">
              <div className="flex space-x-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-8 px-2 text-sm"
                  style={{ flex: 2 }}
                  onClick={() => onSetScoreChange("teamB", 1)}
                >
                  +
                </Button>
                <div className="bg-orange-100 text-orange-800 font-bold h-8 px-2 flex items-center justify-center rounded text-sm min-w-8">
                  {matchData.teamB.scoreSet || 0}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold h-8 px-2 text-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSetScoreChange("teamB", -1)}
                >
                  -
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Point Controls */}
        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
          <h4 className="text-center font-bold text-sm mb-2 text-green-800">ĐIỀU KHIỂN ĐIỂM</h4>
          <div className="grid grid-cols-2 gap-2">
            {/* Đội A Points */}
            <div className="bg-white rounded-lg p-1 shadow-md border border-green-200">
              <div className="flex space-x-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold h-10 px-2 text-base"
                  style={{ flex: 2 }}
                  onClick={() => onScoreChange("teamA", 1)}
                >
                  +
                </Button>
                <div className="bg-green-100 text-green-800 font-bold h-10 px-2 flex items-center justify-center rounded text-base min-w-10">
                  {matchData.teamA.score || 0}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold h-10 px-2 text-base"
                  style={{ flex: 1 }}
                  onClick={() => onScoreChange("teamA", -1)}
                >
                  -
                </Button>
              </div>
            </div>

            {/* Đội B Points */}
            <div className="bg-white rounded-lg p-1 shadow-md border border-green-200">
              <div className="flex space-x-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold h-10 px-2 text-base"
                  style={{ flex: 2 }}
                  onClick={() => onScoreChange("teamB", 1)}
                >
                  +
                </Button>
                <div className="bg-green-100 text-green-800 font-bold h-10 px-2 flex items-center justify-center rounded text-base min-w-10">
                  {matchData.teamB.score || 0}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold h-10 px-2 text-base"
                  style={{ flex: 1 }}
                  onClick={() => onScoreChange("teamB", -1)}
                >
                  -
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Soccer Score Controls (Original)
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      {/* Đội A */}
      <div className="bg-white rounded-lg p-1 sm:p-2 shadow-md border border-blue-200">
        <div className="flex space-x-1">
          <Button
            variant="primary"
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-10 sm:h-14 px-2 text-base sm:text-lg"
            style={{ flex: 2 }}
            onClick={() => onScoreChange("teamA", 1)}
          >
            <span className="text-lg sm:text-xl">+</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-10 sm:h-14 px-2 text-base sm:text-lg"
            style={{ flex: 1 }}
            onClick={() => onScoreChange("teamA", -1)}
          >
            <span className="text-lg sm:text-xl">-</span>
          </Button>
        </div>
      </div>

      {/* Đội B */}
      <div className="bg-white rounded-lg p-1 sm:p-2 shadow-md border border-purple-200">
        <div className="flex space-x-1">
          <Button
            variant="primary"
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-10 sm:h-14 px-2 text-base sm:text-lg"
            style={{ flex: 2 }}
            onClick={() => onScoreChange("teamB", 1)}
          >
            <span className="text-lg sm:text-xl">+</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-10 sm:h-14 px-2 text-base sm:text-lg"
            style={{ flex: 1 }}
            onClick={() => onScoreChange("teamB", -1)}
          >
            <span className="text-lg sm:text-xl">-</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreControls;
