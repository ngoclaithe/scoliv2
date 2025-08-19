import React from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType3 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center w-full scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5] max-w-[600px]">
            {/* Main scoreboard row */}
            <div className="flex items-center justify-center w-full px-2 max-w-sm mx-auto">

                {/* Container chính */}
                <div className="flex flex-col bg-black/20 backdrop-blur-sm rounded-lg p-1 shadow-xl flex-1">
                    {/* Main content row */}
                    <div className="flex items-end">
                        {/* Thông tin đội A với Fouls */}
                        <div className="flex flex-col mr-1 sm:mr-2">
                            {/* Fouls display cho đội A */}
                            <div className="flex justify-start items-center mb-0">
                                <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-gray-800/80 rounded-md w-[60px] sm:w-[80px] truncate text-center">
                                    {currentData.teamAName}
                                </div>
                                <div className="flex w-full h-0.5 mt-0.5 rounded-full overflow-hidden">
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamAKitColor }}
                                    />
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamA2KitColor }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tỉ số và thời gian */}
                        <div className="flex flex-col items-center mx-1.5 sm:mx-2">
                            <div className="flex items-center bg-white/95 rounded-md shadow-sm">
                                <span className="font-bold text-sm sm:text-base text-gray-900">{currentData.teamAScore}</span>
                                <span className="mx-1 sm:mx-1.5 text-gray-400 font-light text-xs sm:text-sm">:</span>
                                <span className="font-bold text-sm sm:text-base text-gray-900">{currentData.teamBScore}</span>
                            </div>
                            {showMatchTime && (
                                <div className="bg-red-600 text-white px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-sm mt-0.5 sm:mt-1 whitespace-nowrap">
                                    {currentData.matchTime}
                                </div>
                            )}
                            {!showMatchTime && (
                                <div className="bg-green-600 text-white px-1.5 sm:px-2 py-0.5 text-[9px] font-medium rounded-sm mt-0.5 sm:mt-1 animate-pulse whitespace-nowrap">
                                    🔴 TRỰC TIẾP
                                </div>
                            )}
                        </div>

                        {/* Thông tin đội B với Fouls */}
                        <div className="flex flex-col ml-1 sm:ml-2">
                            {/* Fouls display cho đội B */}
                            <div className="flex justify-end items-center mb-0">
                                <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-gray-800/80 rounded-md w-[60px] sm:w-[80px] truncate text-center">
                                    {currentData.teamBName}
                                </div>
                                <div className="flex w-full h-0.5 mt-0.5 rounded-full overflow-hidden">
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamBKitColor }}
                                    />
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamB2KitColor }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ScoreboardType3;
