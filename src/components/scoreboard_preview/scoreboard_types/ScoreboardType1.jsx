import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const ScoreboardType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full px-2 gap-0">
                <DisplayLogo
                    logos={[currentData.teamALogo]}
                    alt={currentData.teamAName}
                    className="w-14 h-14"
                    type_play={logoShape}
                />

                <div className="flex items-center">
                    <div
                        className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}
                    >
                        {currentData.teamAScore}
                    </div>

                    <div className="flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamAName}
                        </div>

                        <div className="flex w-full h-3">
                            <div
                                className="flex-1 h-full"
                                style={{ backgroundColor: currentData.teamAKitColor }}
                            />
                            <div
                                className="flex-1 h-full"
                                style={{ backgroundColor: currentData.teamA2KitColor }}
                            />
                        </div>
                    </div>
                </div>

                {showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                        {currentData.matchTime}
                    </div>
                )}

                <div className="flex items-center">
                    <div className="flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamBName}
                        </div>

                        <div className="flex w-full h-3">
                            <div
                                className="flex-1 h-full"
                                style={{ backgroundColor: currentData.teamB2KitColor }}
                            />
                            <div
                                className="flex-1 h-full"
                                style={{ backgroundColor: currentData.teamBKitColor }}
                            />
                        </div>
                    </div>
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)' }}>
                        {currentData.teamBScore}
                    </div>
                </div>

                <DisplayLogo
                    logos={[currentData.teamBLogo]}
                    alt={currentData.teamBName}
                    className="w-14 h-14"
                    type_play={logoShape}
                />
            </div>

            {!showMatchTime && (
                <div className="text-center mt-2">
                    <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded animate-pulse">
                        ● TRỰC TIẾP
                    </span>
                </div>
            )}
        </div>
    );
};

export default ScoreboardType1;