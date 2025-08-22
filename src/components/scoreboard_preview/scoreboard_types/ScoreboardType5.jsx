import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType5 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    const defaultTournamentLogo = '/images/basic/logo-skin4.png';
    
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;
        
        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '9px';
            if (length <= 12) return '8px';
            if (length <= 16) return '7px';
            return '6px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '18px';
            if (length <= 12) return '16px';
            if (length <= 16) return '14px';
            return '12px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[380px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Stadium-style main container */}
            <div className="w-full relative">
                {/* Tournament logo - Compact badge */}
                <div className="absolute left-1/2 top-[-12px] sm:top-[-16px] -translate-x-1/2 w-[20px] h-[20px] sm:w-[32px] sm:h-[32px] z-50">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                            border: '2px solid #2563eb',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3), inset 0 1px 2px rgba(255,255,255,0.8)',
                        }}
                    >
                        <DisplayLogo
                            logos={[tournamentLogo || defaultTournamentLogo]}
                            alt="Tournament"
                            type_play="round"
                            className="w-[70%] h-[70%]"
                            logoSize="w-[12px] h-[12px] sm:w-[20px] sm:h-[20px]"
                        />
                    </div>
                </div>

                {/* Main scoreboard container - Compact panel */}
                <div
                    className="relative px-4 py-3 rounded-lg"
                    style={{
                        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        border: '1px solid #334155',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Compact info bar */}
                    <div className="flex items-center justify-between mb-2">
                        {/* Team A fouls */}
                        <div className="flex items-center space-x-1">
                            <span className="text-slate-400 text-xs font-medium">F</span>
                            <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-xs" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                        </div>
                        
                        {/* Status indicator */}
                        <div
                            className={`px-2 py-1 rounded-full text-xs font-bold ${showMatchTime ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                            style={{
                                boxShadow: showMatchTime ? '0 0 10px rgba(239,68,68,0.5)' : '0 0 10px rgba(34,197,94,0.5)',
                            }}
                        >
                            {showMatchTime ? 'LIVE' : 'READY'}
                        </div>

                        {/* Team B fouls */}
                        <div className="flex items-center space-x-1">
                            <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-xs" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                            <span className="text-slate-400 text-xs font-medium">F</span>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-5 gap-2 items-center">
                        {/* Team A section */}
                        <div className="col-span-2">
                            {/* Team A name */}
                            <div
                                className="relative p-2 rounded-md mb-2"
                                style={{
                                    background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                                    border: '1px solid #3b82f6',
                                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                                }}
                            >
                                <div
                                    className="text-white font-bold text-center"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>
                            </div>
                            
                            {/* Team A kit colors */}
                            <div className="flex justify-center">
                                <div
                                    className="w-6 h-6 rounded-md flex flex-col overflow-hidden"
                                    style={{
                                        border: '1px solid #64748b',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamAKitColor }} />
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamA2KitColor }} />
                                </div>
                            </div>
                        </div>

                        {/* Central score display */}
                        <div className="col-span-1">
                            <div
                                className="relative p-3 rounded-lg text-center"
                                style={{
                                    background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                                    border: '2px solid #334155',
                                    boxShadow: '0 6px 15px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)',
                                }}
                            >
                                {/* Scores */}
                                <div className="flex items-center justify-center space-x-1">
                                    <div
                                        className="text-white font-bold text-lg sm:text-2xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>
                                    <div className="text-slate-400 text-sm font-bold">-</div>
                                    <div
                                        className="text-white font-bold text-lg sm:text-2xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 2px 2px 4px rgba(0,0,0,0.8)',
                                        }}
                                    >
                                        {currentData.teamBScore}
                                    </div>
                                </div>
                                
                                {/* Time display */}
                                {showMatchTime && (
                                    <div className="mt-1">
                                        <div
                                            className="text-green-400 text-xs font-bold"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                                            }}
                                        >
                                            {currentData.matchTime}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Team B section */}
                        <div className="col-span-2">
                            {/* Team B name */}
                            <div
                                className="relative p-2 rounded-md mb-2"
                                style={{
                                    background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                                    border: '1px solid #ef4444',
                                    boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                                }}
                            >
                                <div
                                    className="text-white font-bold text-center"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>
                            </div>
                            
                            {/* Team B kit colors */}
                            <div className="flex justify-center">
                                <div
                                    className="w-6 h-6 rounded-md flex flex-col overflow-hidden"
                                    style={{
                                        border: '1px solid #64748b',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamBKitColor }} />
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamB2KitColor }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom status bar */}
                    <div className="mt-2 text-center">
                        <div
                            className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs"
                            style={{
                                background: 'linear-gradient(90deg, #1e293b, #334155, #1e293b)',
                                border: '1px solid #475569',
                                fontFamily: 'UTM Bebas, sans-serif',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                        >
                            SPORTS BROADCAST
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo ScoLiv - Compact */}
            <div className="flex justify-center w-full mt-2">
                <div
                    className="p-1 rounded-md"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="ScoLiv Logo"
                        className="w-10 h-auto opacity-90"
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreboardType5;
