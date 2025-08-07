import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

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
        <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center items-center max-w-sm">
                {/* Logo A - Positioned outside left */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30">
                    <DisplayLogo
                        logos={[currentData.teamALogo]}
                        alt={currentData.teamAName}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        style={{
                            borderColor: currentData.teamAKitColor,
                            borderRadius: logoShape === 'round' ? '50%' : logoShape === 'hexagon' ? '0' : '8px',
                        }}
                        type_play={logoShape}
                    />
                </div>

                {/* Main scoreboard container */}
                <div
                    className="flex items-center justify-center relative z-10 h-8 sm:h-9 rounded-md mx-14 sm:mx-16"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        width: showMatchTime ? '250px' : '230px',
                        maxWidth: showMatchTime ? '250px' : '230px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Tên đội A */}
                    <div
                        className="flex flex-col items-start justify-center truncate"
                        style={{
                            width: '90px',
                            height: '100%',
                            fontSize: 'clamp(10px, 3.5vw, 14px)',
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        <span className="w-full text-xs sm:text-sm font-semibold text-center leading-[1.2] px-1 sm:px-2">
                            {currentData.teamAName}
                        </span>
                        <div className="flex w-full h-[3px] sm:h-[4px] px-1 sm:px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamAKitColor }} />
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

                    {/* Tên đội B */}
                    <div
                        className="flex flex-col items-end justify-center truncate"
                        style={{
                            width: '90px',
                            height: '100%',
                            fontSize: 'clamp(10px, 3.5vw, 14px)',
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        <span className="w-full text-xs sm:text-sm font-semibold text-center leading-[1.2] px-1 sm:px-2">
                            {currentData.teamBName}
                        </span>
                        <div className="flex w-full h-[3px] sm:h-[4px] px-1 sm:px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamBKitColor }} />
                            <div className="flex-1" style={{ backgroundColor: currentData.teamB2KitColor }} />
                        </div>
                    </div>
                </div>

                {/* Logo B - Positioned outside right */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
                    <DisplayLogo
                        logos={[currentData.teamBLogo]}
                        alt={currentData.teamBName}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        style={{
                            borderColor: currentData.teamBKitColor,
                            borderRadius: logoShape === 'round' ? '50%' : logoShape === 'hexagon' ? '0' : '8px',
                        }}
                        type_play={logoShape}
                    />
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