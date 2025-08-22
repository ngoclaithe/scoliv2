import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType5 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    const defaultTournamentLogo = '/images/basic/logo-skin4.png';
    
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;
        
        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '10px';
            if (length <= 12) return '9px';
            if (length <= 16) return '8px';
            return '7px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '20px';
            if (length <= 12) return '18px';
            if (length <= 16) return '16px';
            return '14px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[500px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main container */}
            <div className="w-full relative">
                {/* Tournament logo - Much bigger */}
                <div className="absolute left-1/2 top-[-8px] sm:top-[-10px] -translate-x-1/2 w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] z-10">
                    <div
                        className="w-full h-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                            border: '3px solid #60a5fa',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
                        }}
                    >
                        <DisplayLogo
                            logos={[tournamentLogo || defaultTournamentLogo]}
                            alt="Tournament"
                            type_play="round"
                            className="w-[70%] h-[70%]"
                            logoSize="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]"
                        />
                    </div>
                </div>

                {/* Main scoreboard container - Better background */}
                <div
                    className="relative"
                    style={{
                        background: 'linear-gradient(135deg, #1e40af, #312e81, #1e293b)',
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0% 75%, 0% 25%)',
                        border: '2px solid #60a5fa',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                >
                    {/* Main content grid */}
                    <div className="grid grid-cols-5 gap-2 items-center px-4 py-3">
                        {/* Team A section */}
                        <div className="col-span-2">
                            {/* Team A name - Angular cut */}
                            <div
                                className="relative mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                                    clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)',
                                    border: '1px solid #3b82f6',
                                    boxShadow: '0 0 12px rgba(37, 99, 235, 0.3)',
                                }}
                            >
                                <div
                                    className="text-white font-bold text-center px-2 py-1"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                        textShadow: '0 0 8px rgba(255,255,255,0.5)',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>
                            </div>
                            
                            {/* Team A kit colors - Diamond */}
                            <div className="flex justify-center">
                                <div
                                    className="w-6 h-6 flex flex-col overflow-hidden relative"
                                    style={{
                                        transform: 'rotate(45deg)',
                                        border: '2px solid #1e40af',
                                        boxShadow: '0 0 8px rgba(37, 99, 235, 0.4)',
                                    }}
                                >
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamAKitColor }} />
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamA2KitColor }} />
                                </div>
                            </div>
                        </div>

                        {/* Central score display - Better background, larger fonts */}
                        <div className="col-span-1">
                            <div
                                className="relative text-center"
                                style={{
                                    background: 'linear-gradient(135deg, #0c4a6e, #164e63, #1e293b)',
                                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                    border: '2px solid #0ea5e9',
                                    boxShadow: '0 0 20px rgba(14, 165, 233, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                                }}
                            >
                                <div className="px-3 py-2">
                                    {/* Scores - Much larger */}
                                    <div className="flex items-center justify-center space-x-1">
                                        <div
                                            className="text-white font-bold text-2xl sm:text-3xl"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(59, 130, 246, 0.9), 0 0 6px rgba(255,255,255,0.6)',
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                                            }}
                                        >
                                            {currentData.teamAScore}
                                        </div>
                                        <div 
                                            className="text-slate-200 text-lg font-bold"
                                            style={{ textShadow: '0 0 8px rgba(255,255,255,0.6)' }}
                                        >
                                            -
                                        </div>
                                        <div
                                            className="text-white font-bold text-2xl sm:text-3xl"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(239, 68, 68, 0.9), 0 0 6px rgba(255,255,255,0.6)',
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                                            }}
                                        >
                                            {currentData.teamBScore}
                                        </div>
                                    </div>
                                    
                                    {/* Time display - Larger font */}
                                    {showMatchTime && (
                                        <div className="mt-1">
                                            <div
                                                className="text-green-400 text-sm sm:text-base font-bold"
                                                style={{
                                                    fontFamily: 'UTM Bebas, sans-serif',
                                                    textShadow: '0 0 12px rgba(34, 197, 94, 0.9), 0 0 4px rgba(255,255,255,0.5)',
                                                }}
                                            >
                                                {currentData.matchTime}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Team B section */}
                        <div className="col-span-2">
                            {/* Team B name - Angular cut (mirrored) */}
                            <div
                                className="relative mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
                                    border: '1px solid #ef4444',
                                    boxShadow: '0 0 12px rgba(220, 38, 38, 0.3)',
                                }}
                            >
                                <div
                                    className="text-white font-bold text-center px-2 py-1"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                        textShadow: '0 0 8px rgba(255,255,255,0.5)',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>
                            </div>
                            
                            {/* Team B kit colors - Diamond */}
                            <div className="flex justify-center">
                                <div
                                    className="w-6 h-6 flex flex-col overflow-hidden relative"
                                    style={{
                                        transform: 'rotate(45deg)',
                                        border: '2px solid #b91c1c',
                                        boxShadow: '0 0 8px rgba(220, 38, 38, 0.4)',
                                    }}
                                >
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamBKitColor }} />
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamB2KitColor }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardType5;
