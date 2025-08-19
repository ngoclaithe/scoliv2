import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const getClampedFontSize = (name) => {
    const dynamicSize = (220 / Math.max(1, name.length)) * 1.5;
    return Math.max(22, Math.min(40, dynamicSize));
};

const ScoreboardBelowType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center w-full sm:w-[800px] mx-auto px-2 sm:px-0">
            {/* Header - Trực tiếp trận đấu */}
            <div className="flex justify-center w-full">
                <div
                    className="bg-yellow-400 text-center font-normal rounded-t-lg px-2 py-1"
                    style={{
                        color: '#004d73',
                        fontFamily: 'UTM Bebas, sans-serif',
                        fontSize: 'clamp(16px, 4vw, 30px)',
                        width: 'auto',
                        maxWidth: '90%'
                    }}
                >
                    TRỰC TIẾP TRẬN BÓNG ĐÁ
                </div>
            </div>

            {/* Main scoreboard */}
            <div className="flex items-center justify-center w-full relative bg-white/95 backdrop-blur-sm rounded-b-lg rounded-t-none shadow-lg overflow-hidden min-h-[40px]">
                {/* Logo team A */}
                <div className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-20">
                    <DisplayLogo
                        logos={[currentData.teamALogo]}
                        alt={currentData.teamAName}
                        className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                        type_play={logoShape}
                        logoSize="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                    />
                </div>

                {/* Team A info */}
                <div className="flex-1 flex flex-col pl-8 sm:pl-12 md:pl-16">
                    <div
                        className="text-white font-normal text-center truncate flex items-center justify-center px-1"
                        style={{
                            backgroundColor: '#004d73',
                            fontFamily: 'UTM Bebas, sans-serif',
                            height: 'clamp(32px, 8vw, 48px)',
                            fontSize: `clamp(12px, 3vw, ${getClampedFontSize(currentData.teamAName)}px)`
                        }}
                    >
                        {currentData.teamAName}
                    </div>
                </div>

                {/* Center scores display */}
                <div className="flex">
                    <div
                        className="text-white px-1 sm:px-2 md:px-3 font-bold whitespace-nowrap flex items-center justify-center min-w-[24px] sm:min-w-[32px] md:min-w-[40px]"
                        style={{
                            backgroundColor: '#333',
                            height: 'clamp(32px, 8vw, 48px)',
                            fontFamily: 'UTM Bebas, sans-serif',
                            fontSize: 'clamp(18px, 5vw, 48px)'
                        }}
                    >
                        {currentData.teamAScore}
                    </div>
                    <div
                        className="text-white px-1 sm:px-2 md:px-3 font-bold whitespace-nowrap flex items-center justify-center min-w-[24px] sm:min-w-[32px] md:min-w-[40px]"
                        style={{
                            backgroundColor: '#333',
                            height: 'clamp(32px, 8vw, 48px)',
                            fontFamily: 'UTM Bebas, sans-serif',
                            fontSize: 'clamp(18px, 5vw, 48px)'
                        }}
                    >
                        {currentData.teamBScore}
                    </div>
                </div>

                {/* Team B info */}
                <div className="flex-1 flex flex-col pr-8 sm:pr-12 md:pr-16">
                    <div
                        className="text-white font-normal text-center truncate flex items-center justify-center px-1"
                        style={{
                            backgroundColor: '#004d73',
                            fontFamily: 'UTM Bebas, sans-serif',
                            height: 'clamp(32px, 8vw, 48px)',
                            fontSize: `clamp(12px, 3vw, ${getClampedFontSize(currentData.teamBName)}px)`
                        }}
                    >
                        {currentData.teamBName}
                    </div>
                </div>

                {/* Logo team B */}
                <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-20">
                    <DisplayLogo
                        logos={[currentData.teamBLogo]}
                        alt={currentData.teamBName}
                        className="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                        type_play={logoShape}
                        logoSize="w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType1;