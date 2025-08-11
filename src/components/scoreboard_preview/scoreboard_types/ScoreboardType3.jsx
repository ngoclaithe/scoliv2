import React from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType3 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center w-full scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main scoreboard row */}
            <div className="flex items-center justify-center w-full px-2 max-w-sm mx-auto">
            {/* Logo đội A */}
            <div className="flex-shrink-0 mr-2 sm:mr-3">
                <div
                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                        width: '48px',
                        height: '48px'
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
            </div>

            {/* Container chính */}
            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1 shadow-xl flex-1">
                {/* Thông tin đội A */}
                <div className="flex flex-col items-center mr-1 sm:mr-2">
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

                {/* Tỉ số và thời gian */}
                <div className="flex flex-col items-center mx-1.5 sm:mx-2">
                    <div className="flex items-center bg-white/95 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm">
                        <span className="font-bold text-base sm:text-lg text-gray-900">{currentData.teamAScore}</span>
                        <span className="mx-1.5 sm:mx-2 text-gray-400 font-light text-sm sm:text-base">:</span>
                        <span className="font-bold text-base sm:text-lg text-gray-900">{currentData.teamBScore}</span>
                    </div>
                    {showMatchTime && (
                        <div className="bg-red-600 text-white px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-sm mt-0.5 sm:mt-1 whitespace-nowrap">
                            {currentData.matchTime}
                        </div>
                    )}
                    {!showMatchTime && (
                        <div className="bg-green-600 text-white px-1.5 sm:px-2 py-0.5 text-[9px] font-medium rounded-sm mt-0.5 sm:mt-1 animate-pulse whitespace-nowrap">
                            ��� TRỰC TIẾP
                        </div>
                    )}
                </div>

                {/* Thông tin đội B */}
                <div className="flex flex-col items-center ml-1 sm:ml-2">
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

            {/* Logo đội B - CÙNG HÀNG với teamA */}
            <div className="flex-shrink-0 ml-2 sm:ml-3">
                <div
                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                    style={{
                        width: '48px',
                        height: '48px'
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

            </div>

            {/* Goal scorers và fouls - NẰM DƯỚI, không ngang cấp */}
            <div className="mt-3 flex justify-between items-center px-2 w-full max-w-xs mx-auto">
                {/* Team A scorers and fouls */}
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="text-[10px] text-gray-700 max-w-[140px] overflow-hidden max-h-[60px]">
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
                    <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                </div>

                {/* Team B fouls and scorers */}
                <div className="flex items-center space-x-2 flex-1 justify-end min-w-0">
                    <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                    <div className="text-[10px] text-gray-700 max-w-[140px] overflow-hidden text-right max-h-[60px]">
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
            </div>

        </div>
    );
};

export default ScoreboardType3;
