import React from 'react';

const ScoreboardType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center">
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
