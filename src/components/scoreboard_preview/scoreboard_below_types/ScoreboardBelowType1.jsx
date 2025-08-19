import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const getClampedFontSize = (name) => {
    const dynamicSize = (220 / Math.max(1, name.length)) * 1.5;
    return Math.max(22, Math.min(40, dynamicSize));
};

const ScoreboardBelowType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center w-full w-[600px] mx-auto">
            {/* Header - Trực tiếp trận đấu */}
            <div className="flex justify-center w-full mb-1">
                <div
                    className="bg-yellow-400 text-center font-normal rounded-t-lg"
                    style={{
                        color: '#004d73',
                        fontFamily: 'UTM Bebas, sans-serif',
                        fontSize: '32px',
                        width: 'auto',
                        maxWidth: '280px'
                    }}
                >
                    TRỰC TIẾP TRẬN BÓNG ĐÁ
                </div>
            </div>
            
            {/* Main scoreboard */}
            <div className="flex items-center justify-center w-full gap-0 relative bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                {/* Logo team A */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                    <DisplayLogo
                        logos={[currentData.teamALogo]}
                        alt={currentData.teamAName}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        type_play={logoShape}
                        logoSize="w-12 h-12 sm:w-14 sm:h-14"
                    />
                </div>

                {/* Team A info */}
                <div className="flex-1 flex flex-col pl-16 pr-2">
                    <div
                        className="text-white font-normal text-center truncate flex items-center justify-center"
                        style={{
                            backgroundColor: '#004d73',
                            fontFamily: 'UTM Bebas, sans-serif',
                            height: '48px',
                            fontSize: `clamp(16px, ${getClampedFontSize(currentData.teamAName)}px, 32px)`
                        }}
                    >
                        {currentData.teamAName}
                    </div>
                    <div className="flex w-full h-2">
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

                {/* Center scores display */}
                <div
                    className="bg-black text-white px-3 sm:px-4 py-1 font-bold whitespace-nowrap flex items-center justify-center min-w-[80px]"
                    style={{
                        height: '50px',
                        fontFamily: 'UTM Bebas, sans-serif',
                        fontSize: 'clamp(36px, 6vw, 48px)',
                        gap: '0'
                    }}
                >
                    <span>{currentData.teamAScore}</span><span>-</span><span>{currentData.teamBScore}</span>
                </div>

                {/* Team B info */}
                <div className="flex-1 flex flex-col pr-16 pl-2">
                    <div
                        className="text-white font-normal text-center truncate flex items-center justify-center"
                        style={{
                            backgroundColor: '#004d73',
                            fontFamily: 'UTM Bebas, sans-serif',
                            height: '48px',
                            fontSize: `clamp(16px, ${getClampedFontSize(currentData.teamBName)}px, 32px)`
                        }}
                    >
                        {currentData.teamBName}
                    </div>
                    <div className="flex w-full h-2">
                        <div
                            className="flex-1"
                            style={{ backgroundColor: currentData.teamB2KitColor }}
                        />
                        <div
                            className="flex-1"
                            style={{ backgroundColor: currentData.teamBKitColor }}
                        />
                    </div>
                </div>

                {/* Logo team B */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
                    <DisplayLogo
                        logos={[currentData.teamBLogo]}
                        alt={currentData.teamBName}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        type_play={logoShape}
                        logoSize="w-12 h-12 sm:w-14 sm:h-14"
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType1;