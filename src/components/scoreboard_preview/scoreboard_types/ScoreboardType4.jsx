import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const ScoreboardType4 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    return (
        <div className="w-full flex justify-center px-[4px] sm:px-[8px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            <div className="flex flex-row items-end min-h-[64px] sm:min-h-[72px] relative bg-transparent">

                {/* Team A logo */}
                <div className="w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] mr-[4px] sm:mr-[8px] shrink-0 flex items-center justify-center z-10">
                    <div
                        className="w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] relative rounded-full bg-white p-1 sm:p-2 shadow-xl border-2 sm:border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    >
                        <img
                            src={currentData.teamALogo}
                            alt={currentData.teamAName}
                            className="object-contain w-[100%] h-[100%]"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBBPC90ZXh0Pgo8L3N2Zz4K';
                            }}
                        />
                    </div>
                </div>

                {/* Các box chính */}
                <div className="flex flex-col items-center z-20 relative">
                    <div className="flex flex-row items-end space-x-[-10px] sm:space-x-[-16px]">
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

                            {/* Tournament/League Logo */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]">
                                <DisplayLogo
                                    logos={[tournamentLogo || currentData.leagueLogo]}
                                    alt="Tournament"
                                    type_play={logoShape}
                                    className="w-full h-full"
                                    logoSize="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]"
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
                    </div>

                    {/* LIVE Text - được căn giữa dưới toàn bộ scoreboard */}
                    <div
                        className={`mt-[2px] text-white text-[10px] sm:text-xs font-bold px-2 py-[1px] rounded ${showMatchTime ? 'bg-red-600' : 'bg-green-600'
                            }`}
                    >
                        {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                    </div>
                </div>

                {/* Team B logo */}
                <div className="w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] ml-[4px] sm:ml-[8px] shrink-0 flex items-center justify-center z-10">
                    <div
                        className="w-[32px] h-[32px] sm:w-[56px] sm:h-[56px] relative rounded-full bg-white p-1 sm:p-2 shadow-xl border-2 sm:border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    >
                        <img
                            src={currentData.teamBLogo}
                            alt={currentData.teamBName}
                            className="object-contain w-[100%] h-[100%]"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBCPC90ZXh0Pgo8L3N2Zz4K';
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardType4;
