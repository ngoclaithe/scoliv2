import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType5 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    const defaultTournamentLogo = '/images/basic/logo-skin4.png';
    
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;
        
        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '11px';
            if (length <= 12) return '10px';
            if (length <= 16) return '9px';
            return '8px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '32px';
            if (length <= 12) return '28px';
            if (length <= 16) return '24px';
            return '24px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[600px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Animated background circles */}
                <div
                    className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-20"
                    style={{
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                        animation: 'pulse 3s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
                    style={{
                        background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
                        animation: 'pulse 3s ease-in-out infinite 1.5s',
                    }}
                />
            </div>

            {/* Main scoreboard row */}
            <div className="w-full flex justify-center px-[4px] sm:px-[8px] relative z-10">
                <div className="flex flex-row items-end min-h-[64px] sm:min-h-[72px] relative bg-transparent">

                    {/* Tournament/League Logo - Floating crystal design */}
                    <div className="absolute left-1/2 top-[-12px] sm:top-[-20px] -translate-x-1/2 w-[20px] h-[20px] sm:w-[56px] sm:h-[56px] z-50">
                        {/* Crystal outer glow */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0.2) 50%, transparent 100%)',
                                transform: 'scale(1.3)',
                            }}
                        />
                        {/* Crystal main body */}
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                                clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                            }}
                        >
                            <DisplayLogo
                                logos={[tournamentLogo || defaultTournamentLogo]}
                                alt="Tournament"
                                type_play="round"
                                className="w-[70%] h-[70%]"
                                logoSize="w-[16px] h-[16px] sm:w-[40px] sm:h-[40px]"
                            />
                        </div>
                    </div>

                    {/* Main content structure */}
                    <div className="flex flex-col items-center z-20 relative">
                        <div className="flex flex-row items-end space-x-[-20px] sm:space-x-[-24px]">
                            
                            {/* Team A section with futuristic design */}
                            <div className="flex flex-col items-center relative">
                                {/* Team A fouls */}
                                <div className="flex items-center justify-center mb-1">
                                    <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[9px]" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                                </div>
                                
                                {/* Team A name with neon effect */}
                                <div className="relative">
                                    {/* Neon glow layers */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            width: '220px', 
                                            height: '50px',
                                            background: 'rgba(0, 255, 255, 0.3)',
                                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                                            filter: 'blur(4px)',
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            width: '220px', 
                                            height: '50px',
                                            background: 'rgba(0, 255, 255, 0.2)',
                                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                                            filter: 'blur(8px)',
                                        }}
                                    />
                                    {/* Main team name */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center z-10"
                                        style={{
                                            width: '220px', 
                                            height: '50px', 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                            textShadow: '0 0 10px rgba(0,255,255,0.8), 0 0 20px rgba(0,255,255,0.4)',
                                            border: '1px solid rgba(0,255,255,0.5)',
                                        }}
                                    >
                                        <span className="truncate text-center">{currentData.teamAName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Team A kit color with holographic effect */}
                            <div className="relative z-30">
                                {/* Holographic outer layer */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        width: '28px',
                                        height: '50px',
                                        background: 'linear-gradient(45deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3), rgba(255,255,0,0.3))',
                                        clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)',
                                        animation: 'hologramShift 2s ease-in-out infinite',
                                    }}
                                />
                                {/* Main kit color */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '24px',
                                        height: '50px',
                                        clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2"
                                        style={{ 
                                            backgroundColor: currentData.teamAKitColor,
                                            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 8px ${currentData.teamAKitColor}40`
                                        }}
                                    />
                                    <div
                                        className="w-full h-1/2"
                                        style={{ 
                                            backgroundColor: currentData.teamA2KitColor,
                                            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 8px ${currentData.teamA2KitColor}40`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Central score box with quantum effect */}
                            <div className="relative z-40">
                                {/* Quantum field background */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        width: '140px',
                                        height: '60px',
                                        background: 'conic-gradient(from 0deg, #667eea, #764ba2, #667eea)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                        animation: 'rotate 6s linear infinite',
                                    }}
                                />
                                {/* Inner quantum core */}
                                <div
                                    className="absolute top-1 left-1 right-1 bottom-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                    }}
                                />
                                {/* Score content */}
                                <div
                                    className="relative flex items-center justify-around px-2"
                                    style={{
                                        width: '140px',
                                        height: '60px',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                    }}
                                >
                                    {/* Team A Score */}
                                    <div
                                        className="text-white font-bold text-xl sm:text-4xl text-center"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(0,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>

                                    {/* Team B Score */}
                                    <div
                                        className="text-white font-bold text-xl sm:text-4xl text-center"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(255,0,255,0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                        }}
                                    >
                                        {currentData.teamBScore}
                                    </div>
                                </div>
                            </div>

                            {/* Team B kit color with holographic effect */}
                            <div className="relative z-30">
                                {/* Holographic outer layer */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        width: '28px',
                                        height: '50px',
                                        background: 'linear-gradient(45deg, rgba(255,255,0,0.3), rgba(0,255,255,0.3), rgba(255,0,255,0.3))',
                                        clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
                                        animation: 'hologramShift 2s ease-in-out infinite 1s',
                                    }}
                                />
                                {/* Main kit color */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '24px',
                                        height: '50px',
                                        clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2"
                                        style={{ 
                                            backgroundColor: currentData.teamBKitColor,
                                            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 8px ${currentData.teamBKitColor}40`
                                        }}
                                    />
                                    <div
                                        className="w-full h-1/2"
                                        style={{ 
                                            backgroundColor: currentData.teamB2KitColor,
                                            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.4), 0 0 8px ${currentData.teamB2KitColor}40`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Team B section with neon effect */}
                            <div className="flex flex-col items-center relative">
                                {/* Team B fouls */}
                                <div className="flex items-center justify-center mb-1">
                                    <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[9px]" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                                </div>
                                
                                {/* Team B name with neon effect */}
                                <div className="relative">
                                    {/* Neon glow layers */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            width: '220px', 
                                            height: '50px',
                                            background: 'rgba(255, 0, 255, 0.3)',
                                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                                            filter: 'blur(4px)',
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            width: '220px', 
                                            height: '50px',
                                            background: 'rgba(255, 0, 255, 0.2)',
                                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                                            filter: 'blur(8px)',
                                        }}
                                    />
                                    {/* Main team name */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center"
                                        style={{
                                            width: '220px', 
                                            height: '50px', 
                                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                            textShadow: '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(255,0,255,0.4)',
                                            border: '1px solid rgba(255,0,255,0.5)',
                                        }}
                                    >
                                        <span className="truncate text-center">{currentData.teamBName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status display with pulsing effect */}
                        <div
                            className={`text-white text-lg sm:text-2xl font-bold px-4 py-1 mt-2 relative ${showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}
                            style={{ 
                                fontFamily: 'UTM Bebas, sans-serif',
                                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                textShadow: '0 0 8px rgba(255,255,255,0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                                animation: showMatchTime ? 'pulse 1.5s ease-in-out infinite' : 'none',
                                boxShadow: `0 0 20px ${showMatchTime ? 'rgba(239,68,68,0.6)' : 'rgba(34,197,94,0.6)'}`,
                            }}
                        >
                            {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                        </div>
                    </div>

                </div>
            </div>

            {/* Logo ScoLiv */}
            <div className="flex justify-center w-full mt-2">
                <img
                    src="/images/basic/ScoLivLogo.png"
                    alt="ScoLiv Logo"
                    className="w-[30%] h-auto opacity-80"
                />
            </div>

            <style jsx>{`
                @keyframes hologramShift {
                    0% { opacity: 0.7; transform: translateX(-1px); }
                    50% { opacity: 1; transform: translateX(1px); }
                    100% { opacity: 0.7; transform: translateX(-1px); }
                }
                
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default ScoreboardType5;
