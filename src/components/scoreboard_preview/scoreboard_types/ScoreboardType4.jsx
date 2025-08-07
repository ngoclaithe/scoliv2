import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const ScoreboardType4 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="w-full flex justify-center px-[4px] sm:px-[8px]">
            <div className="flex flex-row items-end min-h-[64px] sm:min-h-[72px] relative bg-transparent">

                {/* Team A logo */}
                <div className="w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] mr-[4px] sm:mr-[8px] shrink-0 flex items-center justify-center z-10">
                    <DisplayLogo
                        logos={[currentData.teamALogo]}
                        alt={currentData.teamAName}
                        className="w-full h-full"
                        type_play={logoShape}
                    />
                </div>

                {/* Các box chính */}
                <div className="flex flex-row items-end space-x-[-10px] sm:space-x-[-16px] z-20 relative shrink">

                    {/* Team A name */}
                    <div
                        className="text-white text-[10px] sm:text-sm font-semibold flex items-center justify-center h-[20px] sm:h-[32px]"
                        style={{
                            width: '72px',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                            background: 'linear-gradient(to right, #ef4444, #f97316)',
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamAName}</span>
                    </div>

                    {/* Team A kit color */}
                    <div
                        className="flex items-end h-[20px] sm:h-[32px] z-20"
                        style={{
                            width: '20px',
                            backgroundColor: currentData.teamAKitColor,
                            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)',
                        }}
                    />

                    {/* Score box */}
                    <div
                        className="relative h-[40px] sm:h-[48px] bg-blue-900 flex items-center z-10"
                        style={{
                            width: '140px',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                        }}
                    >
                        {/* Team A Score */}
                        <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[24px] text-white font-bold text-xs sm:text-lg text-center">
                            {currentData.teamAScore}
                        </div>

                        {/* League Logo */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px]">
                            <DisplayLogo
                                logos={[currentData.leagueLogo]}
                                alt="League"
                                type_play={logoShape}
                                className="w-full h-full"
                                logoSize="w-full h-full"
                                noPadding
                            />
                        </div>

                        {/* Team B Score */}
                        <div className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[24px] text-white font-bold text-xs sm:text-lg text-center">
                            {currentData.teamBScore}
                        </div>
                    </div>

                    {/* Team B kit color */}
                    <div
                        className="flex items-end h-[20px] sm:h-[32px] z-20"
                        style={{
                            width: '20px',
                            backgroundColor: currentData.teamBKitColor,
                            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)',
                        }}
                    />

                    {/* Team B name */}
                    <div
                        className="text-white text-[10px] sm:text-sm font-semibold flex items-center justify-center h-[20px] sm:h-[32px]"
                        style={{
                            width: '72px',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                            background: 'linear-gradient(to right, #ef4444, #f97316)',
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamBName}</span>
                    </div>

                    {/* LIVE Text */}
                    <div
                        className={`absolute left-1/2 top-[100%] mt-[2px] -translate-x-1/2 text-white text-[10px] sm:text-xs font-bold px-2 py-[1px] ${showMatchTime ? 'bg-red-600' : 'bg-green-600'
                            }`}
                    >
                        {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                    </div>
                </div>

                {/* Team B logo */}
                <div className="w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] ml-[4px] sm:ml-[8px] shrink-0 flex items-center justify-center z-10">
                    <DisplayLogo
                        logos={[currentData.teamBLogo]}
                        alt={currentData.teamBName}
                        className="w-full h-full"
                        type_play={logoShape}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreboardType4;