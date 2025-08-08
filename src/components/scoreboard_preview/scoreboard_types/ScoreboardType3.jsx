import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const ScoreboardType3 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex items-center justify-center w-full px-2 max-w-sm mx-auto">
            {/* Logo đội A */}
            <div className="flex-shrink-0 mr-2 sm:mr-3">
                <DisplayLogo
                    logos={[currentData.teamALogo]}
                    alt={currentData.teamAName}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    logoSize="w-10 h-10 sm:w-12 sm:h-12"
                    type_play={logoShape}
                />
            </div>

            {/* Container chính */}
            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-xl flex-1">
                {/* Thông tin đội A */}
                <div className="flex flex-col items-center mr-2 sm:mr-3">
                    <div className="text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gray-800/80 rounded-md w-[70px] sm:w-[90px] truncate text-center">
                        {currentData.teamAName}
                    </div>
                    <div className="flex w-full h-1 mt-1 rounded-full overflow-hidden">
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

                {/* Tỉ số và thời gian */}
                <div className="flex flex-col items-center mx-2 sm:mx-3">
                    <div className="flex items-center bg-white/95 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-sm">
                        <span className="font-bold text-lg sm:text-xl text-gray-900">{currentData.teamAScore}</span>
                        <span className="mx-2 sm:mx-3 text-gray-400 font-light text-base sm:text-lg">:</span>
                        <span className="font-bold text-lg sm:text-xl text-gray-900">{currentData.teamBScore}</span>
                    </div>
                    {showMatchTime && (
                        <div className="bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-sm mt-1 sm:mt-2 whitespace-nowrap">
                            {currentData.matchTime}
                        </div>
                    )}
                    {!showMatchTime && (
                        <div className="bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] font-medium rounded-sm mt-1 sm:mt-2 animate-pulse whitespace-nowrap">
                            ● TRỰC TIẾP
                        </div>
                    )}
                </div>

                {/* Thông tin đội B */}
                <div className="flex flex-col items-center ml-2 sm:ml-3">
                    <div className="text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gray-800/80 rounded-md w-[70px] sm:w-[90px] truncate text-center">
                        {currentData.teamBName}
                    </div>
                    <div className="flex w-full h-1 mt-1 rounded-full overflow-hidden">
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

            {/* Logo đội B */}
            <div className="flex-shrink-0 ml-2 sm:ml-3">
                <DisplayLogo
                    logos={[currentData.teamBLogo]}
                    alt={currentData.teamBName}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    logoSize="w-10 h-10 sm:w-12 sm:h-12"
                    type_play={logoShape}
                />
            </div>
        </div>
    );
};

export default ScoreboardType3;
