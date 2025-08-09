import React from 'react';

const ScoreboardTypePickleball = ({ currentData, showMatchTime }) => {
    return (
        <div className="w-full flex justify-center px-[4px] sm:px-[8px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            <div className="flex flex-col items-center min-h-[64px] sm:min-h-[72px] relative bg-transparent">
                
                {/* Table container */}
                <div className="bg-blue-900 rounded-lg overflow-hidden shadow-lg">
                    <table className="border-collapse">
                        <tbody>
                            {/* Team A Row */}
                            <tr className="border-b border-blue-700">
                                <td className="px-4 py-2 text-white text-sm sm:text-base font-semibold bg-gradient-to-r from-red-500 to-orange-500 min-w-[100px]">
                                    <span className="truncate">{currentData.teamAName}</span>
                                </td>
                                <td className="px-4 py-2 text-white text-lg sm:text-xl font-bold text-center min-w-[60px] bg-blue-800">
                                    {currentData.teamAScoreSet}
                                </td>
                                <td className="px-4 py-2 text-white text-lg sm:text-xl font-bold text-center min-w-[60px] bg-blue-800">
                                    {currentData.teamAScore}
                                </td>
                            </tr>
                            
                            {/* Team B Row */}
                            <tr>
                                <td className="px-4 py-2 text-white text-sm sm:text-base font-semibold bg-gradient-to-r from-red-500 to-orange-500 min-w-[100px]">
                                    <span className="truncate">{currentData.teamBName}</span>
                                </td>
                                <td className="px-4 py-2 text-white text-lg sm:text-xl font-bold text-center min-w-[60px] bg-blue-800">
                                    {currentData.teamBScoreSet}
                                </td>
                                <td className="px-4 py-2 text-white text-lg sm:text-xl font-bold text-center min-w-[60px] bg-blue-800">
                                    {currentData.teamBScore}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* LIVE/Match Time indicator */}
                <div
                    className={`mt-2 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded ${
                        showMatchTime ? 'bg-red-600' : 'bg-green-600'
                    }`}
                >
                    {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                </div>
            </div>
        </div>
    );
};

export default ScoreboardTypePickleball;
