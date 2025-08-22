import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType5 = ({ currentData, logoShape, tournamentLogo }) => {
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
            <div className="w-full flex justify-center px-[4px] sm:px-[8px] relative">
                {/* Background decorative layer */}
                <div className="absolute inset-0 z-0">
                    {/* Left wing decoration */}
                    <div
                        className="absolute left-0 top-0"
                        style={{
                            width: '200px',
                            height: '50px',
                            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
                            clipPath: 'polygon(0% 0%, 85% 0%, 70% 100%, 0% 100%)',
                            transform: 'skew(-15deg)',
                        }}
                    />
                    {/* Right wing decoration */}
                    <div
                        className="absolute right-0 top-0"
                        style={{
                            width: '200px',
                            height: '50px',
                            background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))',
                            clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 30% 100%)',
                            transform: 'skew(15deg)',
                        }}
                    />
                </div>

                <div className="flex flex-row items-center min-h-[64px] sm:min-h-[72px] relative bg-transparent z-10">
                    {/* Tournament/League Logo - Floating above */}
                    <div className="absolute left-1/2 top-[-12px] sm:top-[-20px] -translate-x-1/2 w-[20px] h-[20px] sm:w-[56px] sm:h-[56px] z-50">
                        <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-3 border-white shadow-xl flex items-center justify-center overflow-hidden">
                            <img
                                src={getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo}
                                alt="Tournament"
                                className="w-[75%] h-[75%] object-contain"
                            />
                        </div>
                    </div>

                    {/* Main content container with hexagonal frame */}
                    <div className="flex flex-col items-center z-20 relative">
                        <div className="flex flex-row items-center space-x-[-28px] sm:space-x-[-32px]">
                            {/* Team A section with multilayer design */}
                            <div className="flex flex-col items-center relative">
                                {/* Team A name with layered background */}
                                <div className="relative">
                                    {/* Background layer 1 - shadow */}
                                    <div
                                        className="absolute top-1 left-1"
                                        style={{
                                            width: '320px',
                                            height: '50px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            clipPath: 'polygon(8% 0%, 92% 0%, 100% 80%, 15% 100%, 0% 20%)',
                                            transform: 'rotate(-1deg)',
                                        }}
                                    />
                                    {/* Background layer 2 - gradient */}
                                    <div
                                        className="absolute top-0 left-0"
                                        style={{
                                            width: '320px',
                                            height: '50px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            clipPath: 'polygon(8% 0%, 92% 0%, 100% 80%, 15% 100%, 0% 20%)',
                                        }}
                                    />
                                    {/* Main text layer */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center z-10"
                                        style={{
                                            width: '320px',
                                            height: '50px',
                                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                                            clipPath: 'polygon(8% 0%, 92% 0%, 100% 80%, 15% 100%, 0% 20%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        <span className="truncate text-center">{currentData.teamAName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Team A kit color with diamond design */}
                            <div className="relative z-30">
                                {/* Diamond outer layer */}
                                <div
                                    className="absolute -top-1 -left-1"
                                    style={{
                                        width: '40px',
                                        height: '52px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                                    }}
                                />
                                {/* Diamond main layer */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '36px',
                                        height: '50px',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2"
                                        style={{ backgroundColor: currentData.teamAKitColor }}
                                    />
                                    <div
                                        className="w-full h-1/2"
                                        style={{ backgroundColor: currentData.teamA2KitColor }}
                                    />
                                </div>
                            </div>

                            {/* Central score box with 3D effect */}
                            <div className="relative z-40">
                                {/* 3D shadow layers */}
                                <div
                                    className="absolute top-2 left-2"
                                    style={{
                                        width: '200px',
                                        height: '60px',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                    }}
                                />
                                <div
                                    className="absolute top-1 left-1"
                                    style={{
                                        width: '200px',
                                        height: '60px',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                    }}
                                />
                                {/* Main score container */}
                                <div
                                    className="relative flex items-center justify-between px-4"
                                    style={{
                                        width: '200px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
                                    }}
                                >
                                    {/* Team A Score */}
                                    <div
                                        className="text-white font-bold text-xl sm:text-5xl text-center"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>

                                    {/* VS separator */}
                                    <div
                                        className="text-yellow-300 font-bold text-sm"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                        }}
                                    >
                                        VS
                                    </div>

                                    {/* Team B Score */}
                                    <div
                                        className="text-white font-bold text-xl sm:text-5xl text-center"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                        }}
                                    >
                                        {currentData.teamBScore}
                                    </div>
                                </div>
                            </div>

                            {/* Team B kit color with diamond design */}
                            <div className="relative z-30">
                                {/* Diamond outer layer */}
                                <div
                                    className="absolute -top-1 -left-1"
                                    style={{
                                        width: '40px',
                                        height: '52px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                                    }}
                                />
                                {/* Diamond main layer */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '36px',
                                        height: '50px',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2"
                                        style={{ backgroundColor: currentData.teamBKitColor }}
                                    />
                                    <div
                                        className="w-full h-1/2"
                                        style={{ backgroundColor: currentData.teamB2KitColor }}
                                    />
                                </div>
                            </div>

                            {/* Team B section with multilayer design */}
                            <div className="flex flex-col items-center relative">
                                {/* Team B name with layered background */}
                                <div className="relative">
                                    {/* Background layer 1 - shadow */}
                                    <div
                                        className="absolute top-1 left-1"
                                        style={{
                                            width: '320px',
                                            height: '50px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            clipPath: 'polygon(8% 0%, 92% 0%, 100% 80%, 85% 100%, 0% 20%)',
                                            transform: 'rotate(1deg)',
                                        }}
                                    />
                                    {/* Background layer 2 - gradient */}
                                    <div
                                        className="absolute top-0 left-0"
                                        style={{
                                            width: '320px',
                                            height: '50px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            clipPath: 'polygon(8% 0%, 92% 0%, 100% 80%, 85% 100%, 0% 20%)',
                                        }}
                                    />
                                    {/* Main text layer */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center"
                                        style={{
                                            width: '320px',
                                            height: '50px',
                                            background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                                            clipPath: 'polygon(8% 0%, 92% 0%, 100% 80%, 85% 100%, 0% 20%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        <span className="truncate text-center">{currentData.teamBName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom status bar with animated gradient */}
                        <div
                            className="text-white text-2xl font-bold px-4 py-1 mt-2 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)',
                                backgroundSize: '300% 100%',
                                animation: 'gradientShift 3s ease infinite',
                                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                fontFamily: 'UTM Bebas, sans-serif',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                            }}
                        >
                            TRỰC TIẾP THỂ THAO
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

export default ScoreboardBelowType5;
