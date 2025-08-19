import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';

const getClampedFontSize = (name) => {
    const dynamicSize = (220 / Math.max(1, name.length)) * 1.5;
    return Math.max(22, Math.min(40, dynamicSize));
};

const ScoreboardBelowType1 = ({ currentData, logoShape }) => {
    return (
        <div className="flex flex-col items-center scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5] w-[600px]">
            {/* Header - Trực tiếp trận đấu */}
            <div className="flex justify-center w-full">
                <div 
                    className="bg-yellow-400 text-center font-normal rounded-t-lg"
                    style={{
                        color: '#004d73',
                        fontFamily: 'UTM Bebas, sans-serif',
                        width: '46%',
                        fontSize: '40px',
                        padding: '8px 0'
                    }}
                >
                    TRỰC TIẾP TRẬN BÓNG ĐÁ
                </div>
            </div>
            
            {/* Main scoreboard */}
            <div className="flex items-end justify-center w-full px-2 gap-0 relative">
                {/* Logo team A */}
                <div className="relative z-10">
                    <DisplayLogo
                        logos={[currentData.teamALogo]}
                        alt={currentData.teamAName}
                        className="w-14 h-14"
                        type_play={logoShape}
                        logoSize="w-14 h-14"
                    />
                </div>

                {/* Team A info */}
                <div className="flex">
                    <div className="flex flex-col items-center">
                        <div className="flex items-start">
                            <div className="w-[220px]">
                                <div
                                    className="w-full text-white font-normal whitespace-nowrap text-center truncate flex items-center justify-center"
                                    style={{
                                        backgroundColor: '#004d73',
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        height: '48px',
                                        fontSize: `${getClampedFontSize(currentData.teamAName)}px`
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>

                                <div className="flex w-full" style={{ height: '8px' }}>
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamAKitColor, height: '8px' }}
                                    />
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamA2KitColor, height: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center scores display */}
                <div
                    className="bg-black text-white px-4 py-1 text-xl font-bold whitespace-nowrap flex items-center justify-center gap-2"
                    style={{ height: '56px', fontFamily: 'UTM Bebas, sans-serif' }}
                >
                    <span>{currentData.teamAScore}</span>
                    <span>-</span>
                    <span>{currentData.teamBScore}</span>
                </div>

                {/* Team B info */}
                <div className="flex">
                    <div className="flex flex-col items-center">
                        <div className="flex items-start">
                            <div className="w-[220px]">
                                <div
                                    className="w-full text-white font-normal whitespace-nowrap text-center truncate flex items-center justify-center"
                                    style={{
                                        backgroundColor: '#004d73',
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        height: '48px',
                                        fontSize: `${getClampedFontSize(currentData.teamBName)}px`
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>

                                <div className="flex w-full" style={{ height: '8px' }}>
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamB2KitColor, height: '8px' }}
                                    />
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamBKitColor, height: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logo team B */}
                <div className="relative z-10">
                    <DisplayLogo
                        logos={[currentData.teamBLogo]}
                        alt={currentData.teamBName}
                        className="w-14 h-14"
                        type_play={logoShape}
                        logoSize="w-14 h-14"
                    />
                </div>
            </div>

            {/* Bottom section with match time and period info */}
            <div className="flex justify-center w-full mt-2">
                <div 
                    className="bg-red-600 text-white text-center font-bold rounded-b-lg px-4 py-2"
                    style={{
                        fontFamily: 'UTM Bebas, sans-serif',
                        fontSize: '24px',
                        minWidth: '200px'
                    }}
                >
                    {currentData.status === 'live' || currentData.status === 'pause' 
                        ? `${currentData.matchTime} - ${currentData.period}` 
                        : currentData.period
                    }
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType1;
