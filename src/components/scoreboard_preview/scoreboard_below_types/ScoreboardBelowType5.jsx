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
        <div className="flex flex-col items-center w-[900px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Multilayer background decoration */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Background layer 1 - Large geometric shapes */}
                <div
                    className="absolute -top-20 -left-20 w-40 h-40"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))',
                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    }}
                />
                <div
                    className="absolute -top-20 -right-20 w-40 h-40"
                    style={{
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(59, 130, 246, 0.15))',
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 80%)',
                    }}
                />
                {/* Background layer 2 - Medium overlapping circles */}
                <div
                    className="absolute top-10 left-20 w-32 h-32 rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, #FFD700 0%, #FF8C00 100%)',
                    }}
                />
                <div
                    className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, #FF6B6B 0%, #4ECDC4 100%)',
                    }}
                />
                {/* Background layer 3 - Small triangular patterns */}
                <div
                    className="absolute bottom-20 left-10 w-16 h-16 opacity-20"
                    style={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                />
                <div
                    className="absolute bottom-20 right-10 w-16 h-16 opacity-20"
                    style={{
                        background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                />
            </div>

            {/* Main scoreboard container */}
            <div className="w-full flex justify-center px-[4px] sm:px-[8px] relative z-10">
                <div className="flex flex-row items-center min-h-[80px] sm:min-h-[90px] relative bg-transparent">
                    
                    {/* Central tournament logo with crystal effect */}
                    <div className="absolute left-1/2 top-[-25px] sm:top-[-35px] -translate-x-1/2 w-[40px] h-[40px] sm:w-[70px] sm:h-[70px] z-50">
                        {/* Crystal layer 1 - Outer glow */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,140,0,0.2) 60%, transparent 100%)',
                                transform: 'scale(1.4)',
                            }}
                        />
                        {/* Crystal layer 2 - Middle ring */}
                        <div
                            className="absolute inset-0 rounded-full border-2"
                            style={{
                                borderColor: 'rgba(255,215,0,0.6)',
                                transform: 'scale(1.2)',
                            }}
                        />
                        {/* Crystal layer 3 - Main gemstone */}
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFD700 75%, #FFA500 100%)',
                                clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                                boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.4), 0 8px 20px rgba(0,0,0,0.3)',
                            }}
                        >
                            <img
                                src={getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo}
                                alt="Tournament"
                                className="w-[60%] h-[60%] object-contain"
                            />
                        </div>
                        {/* Crystal layer 4 - Inner shine */}
                        <div
                            className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white opacity-60"
                            style={{
                                filter: 'blur(1px)',
                            }}
                        />
                    </div>

                    {/* Main content area with multilayer frame */}
                    <div className="flex flex-col items-center relative z-20">
                        <div className="flex flex-row items-center space-x-[-35px] sm:space-x-[-40px]">
                            
                            {/* Team A section with complex layering */}
                            <div className="flex flex-col items-center relative">
                                <div className="relative">
                                    {/* Layer 1 - Shadow base */}
                                    <div
                                        className="absolute top-3 left-3"
                                        style={{
                                            width: '350px',
                                            height: '60px',
                                            background: 'rgba(0, 0, 0, 0.4)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 20% 100%, 0% 30%)',
                                            filter: 'blur(2px)',
                                        }}
                                    />
                                    {/* Layer 2 - Gradient outline */}
                                    <div
                                        className="absolute top-1 left-1"
                                        style={{
                                            width: '350px',
                                            height: '60px',
                                            background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 20% 100%, 0% 30%)',
                                        }}
                                    />
                                    {/* Layer 3 - Inner gradient */}
                                    <div
                                        className="absolute top-2 left-2"
                                        style={{
                                            width: '346px',
                                            height: '56px',
                                            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 20% 100%, 0% 30%)',
                                        }}
                                    />
                                    {/* Layer 4 - Main team name container */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center"
                                        style={{
                                            width: '350px',
                                            height: '60px',
                                            background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E53 50%, #FF6B6B 100%)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 20% 100%, 0% 30%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
                                        }}
                                    >
                                        <span className="truncate text-center relative z-10">{currentData.teamAName}</span>
                                        {/* Inner glow overlay */}
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                                clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 20% 100%, 0% 30%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team A kit display with prism effect */}
                            <div className="relative z-30">
                                {/* Prism layer 1 - Outer glow */}
                                <div
                                    className="absolute -top-2 -left-2"
                                    style={{
                                        width: '50px',
                                        height: '64px',
                                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)',
                                    }}
                                />
                                {/* Prism layer 2 - Border frame */}
                                <div
                                    className="absolute -top-1 -left-1"
                                    style={{
                                        width: '46px',
                                        height: '62px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)',
                                    }}
                                />
                                {/* Prism layer 3 - Main kit colors */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '44px',
                                        height: '60px',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)',
                                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2 relative"
                                        style={{ backgroundColor: currentData.teamAKitColor }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)',
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="w-full h-1/2 relative"
                                        style={{ backgroundColor: currentData.teamA2KitColor }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.5) 100%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Central score display with dimensional effect */}
                            <div className="relative z-40">
                                {/* Dimensional layer 1 - Deep shadow */}
                                <div
                                    className="absolute top-4 left-4"
                                    style={{
                                        width: '220px',
                                        height: '70px',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                        filter: 'blur(3px)',
                                    }}
                                />
                                {/* Dimensional layer 2 - Medium shadow */}
                                <div
                                    className="absolute top-2 left-2"
                                    style={{
                                        width: '220px',
                                        height: '70px',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                    }}
                                />
                                {/* Dimensional layer 3 - Border glow */}
                                <div
                                    className="absolute top-1 left-1"
                                    style={{
                                        width: '218px',
                                        height: '68px',
                                        background: 'linear-gradient(45deg, #667eea, #764ba2, #667eea)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                    }}
                                />
                                {/* Dimensional layer 4 - Main score container */}
                                <div
                                    className="relative flex items-center justify-around px-4"
                                    style={{
                                        width: '220px',
                                        height: '70px',
                                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                                        clipPath: 'polygon(20% 0%, 80% 0%, 95% 100%, 5% 100%)',
                                        boxShadow: 'inset 0 4px 8px rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {/* Team A Score with multiple text layers */}
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 text-cyan-400 font-bold text-xl sm:text-5xl text-center"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                filter: 'blur(2px)',
                                                transform: 'translate(1px, 1px)',
                                            }}
                                        >
                                            {currentData.teamAScore}
                                        </div>
                                        <div
                                            className="relative text-white font-bold text-xl sm:text-5xl text-center"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(0,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                                            }}
                                        >
                                            {currentData.teamAScore}
                                        </div>
                                    </div>

                                    {/* VS separator with glow */}
                                    <div
                                        className="text-yellow-400 font-bold text-sm relative"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(255,255,0,0.8)',
                                        }}
                                    >
                                        VS
                                    </div>

                                    {/* Team B Score with multiple text layers */}
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 text-pink-400 font-bold text-xl sm:text-5xl text-center"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                filter: 'blur(2px)',
                                                transform: 'translate(-1px, 1px)',
                                            }}
                                        >
                                            {currentData.teamBScore}
                                        </div>
                                        <div
                                            className="relative text-white font-bold text-xl sm:text-5xl text-center"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(255,0,255,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                                            }}
                                        >
                                            {currentData.teamBScore}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team B kit display with prism effect */}
                            <div className="relative z-30">
                                {/* Prism layer 1 - Outer glow */}
                                <div
                                    className="absolute -top-2 -left-2"
                                    style={{
                                        width: '50px',
                                        height: '64px',
                                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)',
                                    }}
                                />
                                {/* Prism layer 2 - Border frame */}
                                <div
                                    className="absolute -top-1 -left-1"
                                    style={{
                                        width: '46px',
                                        height: '62px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)',
                                    }}
                                />
                                {/* Prism layer 3 - Main kit colors */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '44px',
                                        height: '60px',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 40%, 85% 100%, 15% 100%, 0% 40%)',
                                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2 relative"
                                        style={{ backgroundColor: currentData.teamBKitColor }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)',
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="w-full h-1/2 relative"
                                        style={{ backgroundColor: currentData.teamB2KitColor }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.5) 100%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team B section with complex layering */}
                            <div className="flex flex-col items-center relative">
                                <div className="relative">
                                    {/* Layer 1 - Shadow base */}
                                    <div
                                        className="absolute top-3 left-3"
                                        style={{
                                            width: '350px',
                                            height: '60px',
                                            background: 'rgba(0, 0, 0, 0.4)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 80% 100%, 0% 30%)',
                                            filter: 'blur(2px)',
                                        }}
                                    />
                                    {/* Layer 2 - Gradient outline */}
                                    <div
                                        className="absolute top-1 left-1"
                                        style={{
                                            width: '350px',
                                            height: '60px',
                                            background: 'linear-gradient(45deg, #f5576c, #f093fb, #764ba2, #667eea)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 80% 100%, 0% 30%)',
                                        }}
                                    />
                                    {/* Layer 3 - Inner gradient */}
                                    <div
                                        className="absolute top-2 left-2"
                                        style={{
                                            width: '346px',
                                            height: '56px',
                                            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 80% 100%, 0% 30%)',
                                        }}
                                    />
                                    {/* Layer 4 - Main team name container */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center"
                                        style={{
                                            width: '350px',
                                            height: '60px',
                                            background: 'linear-gradient(45deg, #FF8E53 0%, #FF6B6B 50%, #FF8E53 100%)',
                                            clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 80% 100%, 0% 30%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)'
                                        }}
                                    >
                                        <span className="truncate text-center relative z-10">{currentData.teamBName}</span>
                                        {/* Inner glow overlay */}
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                                clipPath: 'polygon(10% 0%, 90% 0%, 100% 70%, 80% 100%, 0% 30%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom status bar with layered design */}
                        <div className="relative mt-4">
                            {/* Status bar layer 1 - Shadow */}
                            <div
                                className="absolute top-2 left-2"
                                style={{
                                    width: '300px',
                                    height: '40px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                    filter: 'blur(2px)',
                                }}
                            />
                            {/* Status bar layer 2 - Gradient border */}
                            <div
                                className="absolute top-1 left-1"
                                style={{
                                    width: '298px',
                                    height: '38px',
                                    background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD)',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                }}
                            />
                            {/* Status bar layer 3 - Main content */}
                            <div
                                className="relative text-white text-2xl font-bold px-4 py-1 flex items-center justify-center"
                                style={{
                                    width: '300px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                    fontFamily: 'UTM Bebas, sans-serif',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.5)',
                                    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)',
                                }}
                            >
                                TRỰC TIẾP THỂ THAO
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType5;
