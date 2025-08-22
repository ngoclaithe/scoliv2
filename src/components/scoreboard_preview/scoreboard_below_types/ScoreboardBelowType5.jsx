import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType5 = ({ currentData, logoShape, tournamentLogo }) => {
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;

        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '16px';
            if (length <= 12) return '15px';
            if (length <= 16) return '14px';
            return '13px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '36px';
            if (length <= 12) return '32px';
            if (length <= 16) return '28px';
            return '26px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[1000px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Professional stadium-style main container */}
            <div className="w-full relative">
                {/* Tournament logo - Executive badge style */}
                <div className="absolute left-1/2 top-[-30px] sm:top-[-40px] -translate-x-1/2 w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] z-50">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                            border: '4px solid #1e293b',
                            boxShadow: '0 12px 30px rgba(30, 41, 59, 0.4), inset 0 2px 4px rgba(255,255,255,0.9)',
                        }}
                    >
                        <img
                            src={getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo}
                            alt="Tournament"
                            className="w-[65%] h-[65%] object-contain"
                        />
                    </div>
                </div>

                {/* Main scoreboard panel */}
                <div
                    className="relative px-12 py-8 rounded-2xl"
                    style={{
                        background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                        border: '3px solid #334155',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Main content layout */}
                    <div className="grid grid-cols-7 gap-6 items-center">
                        {/* Team A section */}
                        <div className="col-span-3">
                            <div
                                className="relative p-6 rounded-xl"
                                style={{
                                    background: 'linear-gradient(145deg, #2563eb, #1e40af)',
                                    border: '2px solid #3b82f6',
                                    boxShadow: '0 12px 25px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                                }}
                            >
                                {/* Team A name */}
                                <div
                                    className="text-white font-bold text-center tracking-wide mb-4"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                        textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>
                                
                                {/* Team A kit colors */}
                                <div className="flex justify-center">
                                    <div
                                        className="w-16 h-16 rounded-xl flex flex-col overflow-hidden"
                                        style={{
                                            border: '3px solid #1e40af',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        <div className="h-1/2" style={{ backgroundColor: currentData.teamAKitColor }} />
                                        <div className="h-1/2" style={{ backgroundColor: currentData.teamA2KitColor }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Central score display */}
                        <div className="col-span-1">
                            <div
                                className="relative p-8 rounded-2xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, #000000, #1e293b)',
                                    border: '4px solid #475569',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 3px 6px rgba(255,255,255,0.1)',
                                }}
                            >
                                {/* Scores display */}
                                <div className="space-y-2">
                                    <div
                                        className="text-white font-bold text-5xl sm:text-7xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 30px rgba(59, 130, 246, 0.9), 4px 4px 8px rgba(0,0,0,0.8)',
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>
                                    
                                    <div className="text-slate-500 text-2xl font-bold">VS</div>
                                    
                                    <div
                                        className="text-white font-bold text-5xl sm:text-7xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 30px rgba(239, 68, 68, 0.9), 4px 4px 8px rgba(0,0,0,0.8)',
                                        }}
                                    >
                                        {currentData.teamBScore}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team B section */}
                        <div className="col-span-3">
                            <div
                                className="relative p-6 rounded-xl"
                                style={{
                                    background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                                    border: '2px solid #ef4444',
                                    boxShadow: '0 12px 25px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                                }}
                            >
                                {/* Team B name */}
                                <div
                                    className="text-white font-bold text-center tracking-wide mb-4"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                        textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>
                                
                                {/* Team B kit colors */}
                                <div className="flex justify-center">
                                    <div
                                        className="w-16 h-16 rounded-xl flex flex-col overflow-hidden"
                                        style={{
                                            border: '3px solid #b91c1c',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        <div className="h-1/2" style={{ backgroundColor: currentData.teamBKitColor }} />
                                        <div className="h-1/2" style={{ backgroundColor: currentData.teamB2KitColor }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom professional status bar */}
                    <div className="mt-8 text-center">
                        <div
                            className="inline-block px-12 py-4 rounded-full text-white font-bold tracking-[0.3em]"
                            style={{
                                background: 'linear-gradient(90deg, #1e293b, #475569, #1e293b)',
                                border: '2px solid #64748b',
                                fontFamily: 'UTM Bebas, sans-serif',
                                fontSize: '24px',
                                textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)',
                            }}
                        >
                            LIVE SPORTS COVERAGE
                        </div>
                    </div>
                </div>

                {/* Professional details strip */}
                <div className="mt-6">
                    <div
                        className="flex items-center justify-between px-8 py-3 rounded-xl"
                        style={{
                            background: 'linear-gradient(145deg, #374151, #4b5563)',
                            border: '1px solid #6b7280',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Left indicator */}
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-3 h-3 rounded-full bg-green-500"
                                style={{
                                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.8)',
                                }}
                            />
                            <span className="text-slate-300 text-sm font-medium tracking-wide">
                                BROADCASTING LIVE
                            </span>
                        </div>

                        {/* Center logo space */}
                        <div className="flex justify-center">
                            <div
                                className="px-6 py-2 rounded-lg"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}
                            >
                                <img
                                    src="/images/basic/ScoLivLogo.png"
                                    alt="ScoLiv Logo"
                                    className="h-6 opacity-90"
                                />
                            </div>
                        </div>

                        {/* Right indicator */}
                        <div className="flex items-center space-x-3">
                            <span className="text-slate-300 text-sm font-medium tracking-wide">
                                HD QUALITY
                            </span>
                            <div
                                className="w-3 h-3 rounded-full bg-blue-500"
                                style={{
                                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType5;
