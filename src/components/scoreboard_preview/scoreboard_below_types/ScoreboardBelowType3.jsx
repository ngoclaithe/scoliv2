import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const ScoreboardBelowType3 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-between w-full px-2">
                <DisplayLogo
                    logos={[currentData.teamALogo]}
                    alt={currentData.teamAName}
                    className="w-12 h-12"
                    type_play={logoShape}
                    logoSize="w-12 h-12"
                />

                <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1 shadow-xl">
                    {/* Team A */}
                    <div className="flex items-center">
                        <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamAName}
                        </div>
                        <div
                            className="w-1 h-6 ml-1 rounded-full"
                            style={{ backgroundColor: currentData.teamAKitColor }}
                        />
                    </div>

                    {/* Score */}
                    <div className="mx-4 flex flex-col items-center">
                        <div className="flex items-center bg-white/95 px-4 py-1 rounded-md shadow-sm" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            <span className="font-bold text-xl text-gray-900">{currentData.teamAScore}</span>
                            <span className="mx-2 text-gray-400 font-light">:</span>
                            <span className="font-bold text-xl text-gray-900">{currentData.teamBScore}</span>
                        </div>
                        {showMatchTime && (
                            <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-medium rounded-sm mt-1">
                                {currentData.matchTime}
                            </div>
                        )}
                    </div>

                    {/* Team B */}
                    <div className="flex items-center">
                        <div
                            className="w-1 h-6 mr-1 rounded-full"
                            style={{ backgroundColor: currentData.teamBKitColor }}
                        />
                        <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate text-right" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamBName}
                        </div>
                    </div>
                </div>

                <DisplayLogo
                    logos={[currentData.teamBLogo]}
                    alt={currentData.teamBName}
                    className="w-12 h-12"
                    type_play={logoShape}
                    logoSize="w-12 h-12"
                />
            </div>
        </div>
    );
};

export default ScoreboardBelowType3;
