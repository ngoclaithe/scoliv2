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
        <div className="flex flex-col items-center w-full mx-auto">
            {/* Header - Trực tiếp trận đấu */}
            <div className="flex justify-center w-full">
                <div
                    className="bg-yellow-400 text-center font-normal rounded-t-lg"
                    style={{
                        color: '#004d73',
                        fontFamily: 'UTM Bebas, sans-serif',
                    }}
                >
                    TRỰC TIẾP TRẬN BÓNG ĐÁ
                </div>
            </div>

            {/* Main wrapper với responsive layout */}
            <div className="relative w-full flex items-center justify-center scoreboard-container">
                {/* Team A container với logo bên ngoài */}
                <div className="relative flex items-center team-a-container">
                    {/* Logo team A - absolute positioning bên trái */}
                    <div 
                        className="absolute top-1/2 rounded-full flex items-center justify-center border-2 overflow-hidden z-10 logo-team-a"
                        style={{ 
                            transform: 'translateY(-50%)',
                            backgroundColor: '#FFFFFF',
                            borderColor: currentData.teamAKitColor,
                            borderRadius: '50%'
                        }}
                    >
                        <img
                            src={getFullLogoUrl(currentData.teamALogo)}
                            alt={currentData.teamAName}
                            className="object-contain logo-img-team-a"
                        />
                    </div>
                    
                    {/* Team A name section */}
                    <div
                        className="flex flex-col items-center justify-center truncate relative team-name-a"
                        style={{
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            background: currentData.teamAKitColor,
                        }}
                    >
                        <span className="w-full font-normal text-center leading-[1.2] px-2 team-name-text" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamAName}
                        </span>
                    </div>
                </div>

                {/* Score section */}
                <div 
                    className="flex score-section"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                    }}
                >
                    <div
                        className="text-white font-normal text-center flex items-center justify-center score-item"
                        style={{
                            WebkitTextStroke: '1px black',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        {currentData.teamAScore}
                    </div>
                    <div
                        className="text-white font-normal text-center flex items-center justify-center score-item"
                        style={{
                            WebkitTextStroke: '1px black',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        {currentData.teamBScore}
                    </div>
                </div>

                {/* Team B container với logo bên ngoài */}
                <div className="relative flex items-center team-b-container">
                    {/* Team B name section */}
                    <div
                        className="flex flex-col items-center justify-center truncate relative team-name-b"
                        style={{
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            background: currentData.teamBKitColor,
                        }}
                    >
                        <span className="w-full font-normal text-center leading-[1.2] px-2 team-name-text" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamBName}
                        </span>
                    </div>
                    
                    {/* Logo team B - absolute positioning bên phải */}
                    <div 
                        className="absolute top-1/2 rounded-full flex items-center justify-center border-2 overflow-hidden z-10 logo-team-b"
                        style={{ 
                            transform: 'translateY(-50%)',
                            backgroundColor: '#FFFFFF',
                            borderColor: currentData.teamBKitColor,
                            borderRadius: '50%'
                        }}
                    >
                        <img
                            src={getFullLogoUrl(currentData.teamBLogo)}
                            alt={currentData.teamBName}
                            className="object-contain logo-img-team-b"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Desktop (mặc định) - giữ nguyên */
                .scoreboard-container {
                    width: 800px;
                }

                .bg-yellow-400 {
                    padding: 4px 8px;
                    font-size: 30px;
                    width: auto;
                    max-width: 50%;
                }

                .logo-team-a {
                    left: -60px;
                    width: 80px;
                    height: 80px;
                }

                .logo-img-team-a {
                    width: 64px;
                    height: 64px;
                }

                .team-name-a {
                    width: 300px;
                    height: 48px;
                    font-size: ${Math.min(40, Math.max(22, 300 / Math.max(1, currentData.teamAName.length) * 1.5))}px;
                    padding-left: 30px;
                }

                .score-section {
                    height: 48px;
                }

                .score-item {
                    width: 40px;
                    font-size: 48px;
                }

                .team-name-b {
                    width: 285px;
                    height: 48px;
                    font-size: ${Math.min(40, Math.max(22, 285 / Math.max(1, currentData.teamBName.length) * 1.5))}px;
                    padding-right: 30px;
                }

                .logo-team-b {
                    right: -60px;
                    width: 80px;
                    height: 80px;
                }

                .logo-img-team-b {
                    width: 64px;
                    height: 64px;
                }

                .team-name-text {
                    font-size: inherit;
                }

                /* Tablet (768px - 1023px) */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .scoreboard-container {
                        width: 600px;
                    }

                    .bg-yellow-400 {
                        padding: 3px 6px;
                        font-size: 24px;
                        max-width: 55%;
                    }

                    .logo-team-a {
                        left: -45px;
                        width: 60px;
                        height: 60px;
                    }

                    .logo-img-team-a {
                        width: 48px;
                        height: 48px;
                    }

                    .team-name-a {
                        width: 225px;
                        height: 36px;
                        font-size: ${Math.min(30, Math.max(18, 225 / Math.max(1, currentData.teamAName.length) * 1.3))}px;
                        padding-left: 25px;
                    }

                    .score-section {
                        height: 36px;
                    }

                    .score-item {
                        width: 32px;
                        font-size: 36px;
                    }

                    .team-name-b {
                        width: 215px;
                        height: 36px;
                        font-size: ${Math.min(30, Math.max(18, 215 / Math.max(1, currentData.teamBName.length) * 1.3))}px;
                        padding-right: 25px;
                    }

                    .logo-team-b {
                        right: -45px;
                        width: 60px;
                        height: 60px;
                    }

                    .logo-img-team-b {
                        width: 48px;
                        height: 48px;
                    }
                }

                /* Mobile (< 768px) */
                @media (max-width: 767px) {
                    .scoreboard-container {
                        width: 400px;
                    }

                    .bg-yellow-400 {
                        padding: 2px 4px;
                        font-size: 16px;
                        max-width: 60%;
                    }

                    .logo-team-a {
                        left: -30px;
                        width: 40px;
                        height: 40px;
                    }

                    .logo-img-team-a {
                        width: 32px;
                        height: 32px;
                    }

                    .team-name-a {
                        width: 150px;
                        height: 24px;
                        font-size: ${Math.min(20, Math.max(14, 150 / Math.max(1, currentData.teamAName.length) * 1.2))}px;
                        padding-left: 18px;
                    }

                    .score-section {
                        height: 24px;
                    }

                    .score-item {
                        width: 24px;
                        font-size: 24px;
                    }

                    .team-name-b {
                        width: 142px;
                        height: 24px;
                        font-size: ${Math.min(20, Math.max(14, 142 / Math.max(1, currentData.teamBName.length) * 1.2))}px;
                        padding-right: 18px;
                    }

                    .logo-team-b {
                        right: -30px;
                        width: 40px;
                        height: 40px;
                    }

                    .logo-img-team-b {
                        width: 32px;
                        height: 32px;
                    }

                    .team-name-text {
                        font-size: 12px;
                    }
                }

                /* Small Mobile (< 480px) */
                @media (max-width: 479px) {
                    .scoreboard-container {
                        width: 320px;
                    }

                    .bg-yellow-400 {
                        padding: 1px 3px;
                        font-size: 14px;
                        max-width: 65%;
                    }

                    .logo-team-a {
                        left: -25px;
                        width: 32px;
                        height: 32px;
                    }

                    .logo-img-team-a {
                        width: 24px;
                        height: 24px;
                    }

                    .team-name-a {
                        width: 120px;
                        height: 20px;
                        font-size: ${Math.min(16, Math.max(12, 120 / Math.max(1, currentData.teamAName.length) * 1.1))}px;
                        padding-left: 15px;
                    }

                    .score-section {
                        height: 20px;
                    }

                    .score-item {
                        width: 20px;
                        font-size: 20px;
                    }

                    .team-name-b {
                        width: 115px;
                        height: 20px;
                        font-size: ${Math.min(16, Math.max(12, 115 / Math.max(1, currentData.teamBName.length) * 1.1))}px;
                        padding-right: 15px;
                    }

                    .logo-team-b {
                        right: -25px;
                        width: 32px;
                        height: 32px;
                    }

                    .logo-img-team-b {
                        width: 24px;
                        height: 24px;
                    }

                    .team-name-text {
                        font-size: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ScoreboardBelowType2;