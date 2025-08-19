import React from 'react';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType2 = ({ currentData, showMatchTime }) => {
    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

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
                        maxWidth: '50%'
                    }}
                >
                    TRỰC TIẾP TRẬN BÓNG ĐÁ
                </div>
            </div>

            {/* Main wrapper với flex layout giống CSS mẫu */}
            <div className="relative w-full flex items-center justify-center">
                {/* Team A container với logo bên ngoài */}
                <div className="relative flex items-center">
                    {/* Logo team A - absolute positioning bên trái */}
                    <div 
                        className="absolute top-1/2 w-20 h-20 rounded-full flex items-center justify-center border-2 overflow-hidden z-10"
                        style={{ 
                            left: '-60px',
                            transform: 'translateY(-50%)',
                            backgroundColor: '#FFFFFF',
                            borderColor: currentData.teamAKitColor,
                            borderRadius: '50%'
                        }}
                    >
                        <img
                            src={getFullLogoUrl(currentData.teamALogo)}
                            alt={currentData.teamAName}
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                    
                    {/* Team A name section - background chạm vào logo */}
                    <div
                        className="flex flex-col items-center justify-center truncate relative"
                        style={{
                            width: '300px',
                            height: '48px',
                            fontSize: `${Math.min(40, Math.max(22, 300 / Math.max(1, currentData.teamAName.length) * 1.5))}px`,
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            background: currentData.teamAKitColor,
                            paddingLeft: '30px' // Tạo space cho logo chạm vào
                        }}
                    >
                        <span className="w-full text-sm sm:text-base font-semibold text-center leading-[1.2] px-2" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamAName}
                        </span>
                    </div>
                </div>

                {/* Score section - Tạo background liên tục */}
                <div 
                    className="flex"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        height: '48px'
                    }}
                >
                    <div
                        className="text-white font-extrabold text-5xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '40px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        {currentData.teamAScore}
                    </div>
                    <div
                        className="text-white font-extrabold text-5xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '40px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        {currentData.teamBScore}
                    </div>
                </div>

                {/* Team B container với logo bên ngoài */}
                <div className="relative flex items-center">
                    {/* Team B name section - background chạm vào logo */}
                    <div
                        className="flex flex-col items-center justify-center truncate relative"
                        style={{
                            width: '285px',
                            height: '48px',
                            fontSize: `${Math.min(40, Math.max(22, 285 / Math.max(1, currentData.teamBName.length) * 1.5))}px`,
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            background: currentData.teamBKitColor,
                            paddingRight: '30px' // Tạo space cho logo chạm vào
                        }}
                    >
                        <span className="w-full text-sm sm:text-base font-semibold text-center leading-[1.2] px-2" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamBName}
                        </span>

                    </div>
                    
                    {/* Logo team B - absolute positioning bên phải */}
                    <div 
                        className="absolute top-1/2 w-20 h-20 rounded-full flex items-center justify-center border-2 overflow-hidden z-10"
                        style={{ 
                            right: '-60px',
                            transform: 'translateY(-50%)',
                            backgroundColor: '#FFFFFF',
                            borderColor: currentData.teamBKitColor,
                            borderRadius: '50%'
                        }}
                    >
                        <img
                            src={getFullLogoUrl(currentData.teamBLogo)}
                            alt={currentData.teamBName}
                            className="w-16 h-16 object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType2;