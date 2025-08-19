import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType4 = ({ currentData, logoShape, tournamentLogo }) => {
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;

        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '19px';
            if (length <= 12) return '18px';
            if (length <= 16) return '17px';
            return '16px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '32px';
            if (length <= 12) return '28px';
            if (length <= 16) return '24px';
            return '24px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[800px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main scoreboard row */}
            <div className="w-full flex justify-center px-[4px] sm:px-[8px]">
                <div className="flex flex-row items-end min-h-[64px] sm:min-h-[72px] relative bg-transparent">

                    {/* Tournament/League Logo - Đặt riêng phía trên */}
                    <div className="absolute left-1/2 top-[-8px] sm:top-[-16px] -translate-x-1/2 w-[16px] h-[16px] sm:w-[52px] sm:h-[52px] z-50">
                        <div className="w-full h-full rounded-full bg-yellow-500 border-2 border-transparent shadow-lg flex items-center justify-center overflow-hidden">
                            <img
                                src={getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo}
                                alt="Tournament"
                                className="w-[80%] h-[80%] object-contain"
                            />
                        </div>
                    </div>

                    {/* Các box chính */}
                    <div className="flex flex-col items-center z-20 relative">
                        <div className="flex flex-row items-end space-x-[-32px] sm:space-x-[-40px]">
                            {/* Team A fouls + name */}
                            <div className="flex flex-col items-center">
                                {/* Team A name */}
                                <div
                                    className="text-white font-normal flex items-center justify-center z-10"
                                    style={{
                                        width: '320px',
                                        height: '47px',
                                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 150%, 0% 100%)',
                                        background: 'linear-gradient(to right, #ef4444, #f97316)',
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640)
                                    }}
                                >
                                    <span className="truncate text-center">{currentData.teamAName}</span>
                                </div>
                            </div>

                            {/* Team A kit color - Chia đôi màu */}
                            <div
                                className="flex flex-col items-end z-30"
                                style={{
                                    width: '32px',
                                    height: '47px',
                                    clipPath: 'polygon(0% 0%, 40% 0%, 100% 100%, 60% 100%)',
                                }}
                            >
                                {/* Nửa trên */}
                                <div
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamAKitColor,
                                    }}
                                />
                                {/* Nửa dưới */}
                                <div
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamA2KitColor,
                                    }}
                                />
                            </div>

                            {/* Score box */}
                            <div
                                className="relative bg-blue-900 flex items-center z-0"
                                style={{
                                    width: '190px',
                                    height: '58px',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                }}
                            >
                                {/* Team A Score */}
                                <div className="absolute left-[30px] top-[0px] w-[32px] text-white font-normal text-xl sm:text-5xl text-center" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                                    {currentData.teamAScore}
                                </div>

                                {/* Team B Score */}
                                <div className="absolute right-[30px] top-[0px] w-[32px] text-white font-normal text-xl sm:text-5xl text-center" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                                    {currentData.teamBScore}
                                </div>
                            </div>

                            {/* Team B kit color - Chia đôi màu */}
                            <div
                                className="flex flex-col items-end z-30"
                                style={{
                                    width: '30px',
                                    height: '47px',
                                    clipPath: 'polygon(60% 0%, 100% 0%, 40% 100%, 0% 100%)',
                                }}
                            >
                                {/* Nửa trên */}
                                <div
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamBKitColor,
                                    }}
                                />
                                {/* Nửa dưới */}
                                <div
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamB2KitColor,
                                    }}
                                />
                            </div>

                            {/* Team B fouls + name */}
                            <div className="flex flex-col items-center">
                                {/* Team B name */}
                                <div
                                    className="text-white font-normal flex items-center justify-center"
                                    style={{
                                        width: '320px',
                                        height: '47px',
                                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 5% 100%)',
                                        background: 'linear-gradient(to right, #ef4444, #f97316)',
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640)
                                    }}
                                >
                                    <span className="truncate text-center">{currentData.teamBName}</span>
                                </div>
                            </div>
                        </div>

                        {/* TRỰC TIẾP TRẬN BÓNG ĐÁ text */}
                        <div
                            className="text-3xl font-normal px-2 text-center"
                            style={{
                                color: '#b64513',
                                backgroundColor: '#FFCB00',
                                clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                                fontFamily: 'UTM Bebas, sans-serif',
                                width: '55%',
                                height: '37px',
                            }}
                        >
                            TRỰC TIẾP TRẬN BÓNG ĐÁ
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType4;