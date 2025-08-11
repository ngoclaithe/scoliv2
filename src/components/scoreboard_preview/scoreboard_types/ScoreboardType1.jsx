import React from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            <div className="flex items-center justify-center w-full px-2 gap-0">
                <div
                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                        width: '56px',
                        height: '56px'
                    }}
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

                <div
                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                        width: '56px',
                        height: '56px'
                    }}
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

            {/* Goal scorers and fouls row */}
            <div className="flex items-start justify-center w-full gap-0 mt-1">
                {/* Spacer for logo A */}
                <div className="w-14"></div>

                {/* Team A stats section */}
                <div className="flex items-start gap-0">
                    {/* Spacer for score */}
                    <div className="min-w-[2.2rem]"></div>
                    <div className="w-[90px] flex justify-between items-start">
                        {/* Goal scorers for Team A */}
                        <div className="flex-1 text-[10px] text-gray-700 leading-tight overflow-hidden max-h-[60px]">
                            {currentData.teamAScorers && currentData.teamAScorers.length > 0 ? (
                                currentData.teamAScorers.slice(0, 4).map((scorer, index) => (
                                    <div key={index} className="truncate">
                                        {scorer.player} {scorer.times.join("' ")}'{scorer.times.length > 0 && ' '}
                                    </div>
                                ))
                            ) : (
                                <div className="text-transparent">-</div>
                            )}
                        </div>

                        {/* Fouls for Team A */}
                        <div className="flex-shrink-0">
                            <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                        </div>
                    </div>
                </div>

                {/* Spacer for match time */}
                <div className="opacity-0 px-2">
                    {currentData.matchTime}
                </div>

                {/* Team B stats section */}
                <div className="flex items-start gap-0">
                    <div className="w-[90px] flex justify-between items-start">
                        {/* Fouls for Team B */}
                        <div className="flex-shrink-0">
                            <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                        </div>

                        {/* Goal scorers for Team B */}
                        <div className="flex-1 text-[10px] text-gray-700 leading-tight overflow-hidden max-h-[60px] text-right">
                            {currentData.teamBScorers && currentData.teamBScorers.length > 0 ? (
                                currentData.teamBScorers.slice(0, 4).map((scorer, index) => (
                                    <div key={index} className="truncate">
                                        {scorer.times.join("' ")}'{scorer.times.length > 0 && ' '} {scorer.player}
                                    </div>
                                ))
                            ) : (
                                <div className="text-transparent">-</div>
                            )}
                        </div>
                    </div>
                    {/* Spacer for score */}
                    <div className="min-w-[2.2rem]"></div>
                </div>

                {/* Spacer for logo B */}
                <div className="w-14"></div>
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
