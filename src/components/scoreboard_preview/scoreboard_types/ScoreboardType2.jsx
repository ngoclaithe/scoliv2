import React from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType2 = ({ currentData, logoShape, showMatchTime }) => {
    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    return (
        <div className="flex flex-col items-center scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            <div className="relative w-full flex justify-center items-center max-w-sm">
                {/* Main scoreboard container */}
                <div
                    className="flex items-center justify-center relative z-10 h-8 sm:h-9 rounded-md"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        width: showMatchTime ? '250px' : '230px',
                        maxWidth: showMatchTime ? '250px' : '230px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Tên đội A với fouls */}
                    <div
                        className="flex flex-col items-start justify-center truncate relative"
                        style={{
                            width: '90px',
                            height: '100%',
                            fontSize: 'clamp(10px, 3.5vw, 14px)',
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {/* Fouls for Team A - positioned above */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="[&>*]:!w-3 [&>*]:!h-2">
                                <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                            </div>
                        </div>

                        <span className="w-full text-xs sm:text-sm font-semibold text-center leading-[1.2] px-1 sm:px-2">
                            {currentData.teamAName}
                        </span>
                        <div className="flex w-full h-[3px] sm:h-[4px] px-1 sm:px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamA2KitColor }} />
                        </div>
                    </div>

                    {/* Tỉ số A */}
                    <div
                        className="text-white font-extrabold text-xl sm:text-2xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.2rem',
                            height: '100%',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAScore}
                    </div>

                    {/* Thời gian */}
                    {showMatchTime && (
                        <div
                            className="bg-yellow-400 text-black text-xs font-bold flex items-center justify-center rounded mx-1 sm:mx-2"
                            style={{
                                padding: '0 6px',
                                height: '70%',
                                minWidth: '40px',
                            }}
                        >
                            {currentData.matchTime}
                        </div>
                    )}

                    {/* Tỉ số B */}
                    <div
                        className="text-white font-extrabold text-xl sm:text-2xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.2rem',
                            height: '100%',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBScore}
                    </div>

                    {/* Tên đội B với fouls */}
                    <div
                        className="flex flex-col items-end justify-center truncate relative"
                        style={{
                            width: '90px',
                            height: '100%',
                            fontSize: 'clamp(10px, 3.5vw, 14px)',
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {/* Fouls for Team B - positioned above */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="[&>*]:!w-3 [&>*]:!h-2">
                                <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                            </div>
                        </div>

                        <span className="w-full text-xs sm:text-sm font-semibold text-center leading-[1.2] px-1 sm:px-2">
                            {currentData.teamBName}
                        </span>
                        <div className="flex w-full h-[3px] sm:h-[4px] px-1 sm:px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamB2KitColor }} />
                        </div>
                    </div>
                </div>

            </div>

            {/* LIVE indicator */}
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

export default ScoreboardType2;
