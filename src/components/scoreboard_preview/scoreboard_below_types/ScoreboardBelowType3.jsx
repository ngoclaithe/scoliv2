import React from 'react';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType3 = ({ currentData, logoShape, showMatchTime }) => {
    
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-center w-full relative">
                <div
                    className="flex items-center justify-center bg-white"
                    style={{
                        width: 'min(64px, 12vw)',
                    }}
                >
                </div>
                <div
                    className="flex items-center bg-black/20 backdrop-blur-sm shadow-xl text-4xl"
                    style={{
                        backgroundColor: 'rgb(13 148 164 / 70%)',
                        color: 'white',
                        fontFamily: 'UTM Bebas, sans-serif',
                        // Width tính toán: 2 team names + score section
                        width: 'calc(min(240px, 35vw) + min(240px, 35vw) + min(64px, 8vw))',
                        height: 'min(40px, 8vw)',
                        justifyContent: 'center',
                        padding: '0 min(8px, 1vw)',
                    }}
                >
                    TRỰC TIẾP TRẬN BÓNG ĐÁ
                </div>
                <div
                    className="flex items-center justify-center bg-white"
                    style={{
                        width: 'min(64px, 12vw)',
                    }}
                >
                </div>
            </div>

            <div className="flex items-center justify-center w-full relative">
                {/* Team A Logo - tách riêng */}
                <div
                    className="flex items-center justify-center bg-white overflow-hidden"
                    style={{
                        width: 'min(64px, 12vw)',
                        height: 'min(64px, 12vw)',
                    }}
                >
                    <img
                        src={getFullLogoUrl(currentData.teamALogo)}
                        alt={currentData.teamAName}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Central Scoreboard - chỉ bao gồm team names và score */}
                <div className="flex items-center bg-black/20 backdrop-blur-sm shadow-xl">
                    {/* Team A */}
                    <div className="flex items-center">
                        <div 
                            className="text-white font-medium truncate flex items-center justify-center text-lg sm:text-xl md:text-3xl lg:text-4xl" 
                            style={{ 
                                backgroundColor: '#0d94a4', 
                                fontFamily: 'UTM Bebas, sans-serif',
                                width: 'min(240px, 35vw)',
                                height: 'min(64px, 12vw)',
                            }}
                        >
                            {currentData.teamAName}
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center">
                        <div 
                            className="flex items-center shadow-sm justify-center" 
                            style={{ 
                                backgroundColor: '#FF0000', 
                                fontFamily: 'UTM Bebas, sans-serif',
                                height: 'min(64px, 12vw)',
                                padding: '0 min(8px, 1.5vw)',
                                minWidth: 'min(64px, 8vw)', // Đảm bảo score section có width tối thiểu
                            }}
                        >
                            <span className="font-normal text-white text-lg sm:text-xl md:text-3xl lg:text-4xl">{currentData.teamAScore}</span>
                            <span className="text-white font-light text-sm sm:text-base md:text-xl lg:text-2xl mx-1 sm:mx-2">-</span>
                            <span className="font-normal text-white text-lg sm:text-xl md:text-3xl lg:text-4xl">{currentData.teamBScore}</span>
                        </div>
                    </div>

                    {/* Team B */}
                    <div className="flex items-center">
                        <div 
                            className="text-white font-medium truncate flex items-center justify-center text-lg sm:text-xl md:text-3xl lg:text-4xl" 
                            style={{ 
                                backgroundColor: '#0d94a4', 
                                fontFamily: 'UTM Bebas, sans-serif',
                                width: 'min(240px, 35vw)',
                                height: 'min(64px, 12vw)',
                            }}
                        >
                            {currentData.teamBName}
                        </div>
                    </div>
                </div>

                {/* Team B Logo - tách riêng */}
                <div
                    className="flex items-center justify-center bg-white overflow-hidden"
                    style={{
                        width: 'min(64px, 12vw)',
                        height: 'min(64px, 12vw)',
                    }}
                >
                    <img
                        src={getFullLogoUrl(currentData.teamBLogo)}
                        alt={currentData.teamBName}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType3;