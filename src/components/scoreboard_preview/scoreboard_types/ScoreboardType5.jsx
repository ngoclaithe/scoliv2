import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType5 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    const defaultTournamentLogo = '/images/basic/logo-skin4.png';
    
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;
        
        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '12px';
            if (length <= 12) return '11px';
            if (length <= 16) return '10px';
            return '9px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '28px';
            if (length <= 12) return '26px';
            if (length <= 16) return '24px';
            return '22px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[650px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Stadium-style main container */}
            <div className="w-full relative">
                {/* Tournament logo - Professional floating badge */}
                <div className="absolute left-1/2 top-[-25px] sm:top-[-35px] -translate-x-1/2 w-[35px] h-[35px] sm:w-[60px] sm:h-[60px] z-50">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                            border: '3px solid #2563eb',
                            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3), inset 0 2px 4px rgba(255,255,255,0.8)',
                        }}
                    >
                        <DisplayLogo
                            logos={[tournamentLogo || defaultTournamentLogo]}
                            alt="Tournament"
                            type_play="round"
                            className="w-[70%] h-[70%]"
                            logoSize="w-[20px] h-[20px] sm:w-[40px] sm:h-[40px]"
                        />
                    </div>
                </div>

                {/* Main scoreboard container - Stadium panel style */}
                <div
                    className="relative px-8 py-6 rounded-lg"
                    style={{
                        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        border: '2px solid #334155',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Top info bar */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Team A fouls */}
                        <div className="flex items-center space-x-2">
                            <span className="text-slate-400 text-xs font-medium">FOULS</span>
                            <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-sm" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                        </div>
                        
                        {/* Status indicator */}
                        <div
                            className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider ${showMatchTime ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                            style={{
                                boxShadow: showMatchTime ? '0 0 20px rgba(239,68,68,0.5)' : '0 0 20px rgba(34,197,94,0.5)',
                            }}
                        >
                            {showMatchTime ? 'LIVE' : 'READY'}
                        </div>

                        {/* Team B fouls */}
                        <div className="flex items-center space-x-2">
                            <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-sm" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                            <span className="text-slate-400 text-xs font-medium">FOULS</span>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-5 gap-4 items-center">
                        {/* Team A section */}
                        <div className="col-span-2">
                            {/* Team A name */}
                            <div
                                className="relative p-4 rounded-lg mb-3"
                                style={{
                                    background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                                    border: '1px solid #3b82f6',
                                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                                }}
                            >
                                <div
                                    className="text-white font-bold text-center tracking-wide"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>
                            </div>
                            
                            {/* Team A kit colors */}
                            <div className="flex justify-center">
                                <div
                                    className="w-12 h-12 rounded-lg flex flex-col overflow-hidden"
                                    style={{
                                        border: '2px solid #64748b',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
                                className="relative p-6 rounded-xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                                    border: '3px solid #334155',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                                }}
                            >
                                {/* Scores */}
                                <div className="flex items-center justify-center space-x-3">
                                    <div
                                        className="text-white font-bold text-4xl sm:text-6xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 3px 3px 6px rgba(0,0,0,0.8)',
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>
                                    <div className="text-slate-400 text-xl font-bold">-</div>
                                    <div
                                        className="text-white font-bold text-4xl sm:text-6xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 3px 3px 6px rgba(0,0,0,0.8)',
                                        }}
                                    >
                                        {currentData.teamBScore}
                                    </div>
                                </div>
                                
                                {/* Time display */}
                                {showMatchTime && (
                                    <div className="mt-3">
                                        <div
                                            className="text-green-400 text-lg font-bold tracking-widest"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(34, 197, 94, 0.8)',
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
                                className="relative p-4 rounded-lg mb-3"
                                style={{
                                    background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                                    border: '1px solid #ef4444',
                                    boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                                }}
                            >
                                <div
                                    className="text-white font-bold text-center tracking-wide"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>
                            </div>
                            
                            {/* Team B kit colors */}
                            <div className="flex justify-center">
                                <div
                                    className="w-12 h-12 rounded-lg flex flex-col overflow-hidden"
                                    style={{
                                        border: '2px solid #64748b',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamBKitColor }} />
                                    <div className="h-1/2" style={{ backgroundColor: currentData.teamB2KitColor }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom status bar */}
                    <div className="mt-6 text-center">
                        <div
                            className="inline-block px-8 py-2 rounded-full text-white font-bold tracking-widest"
                            style={{
                                background: 'linear-gradient(90deg, #1e293b, #334155, #1e293b)',
                                border: '1px solid #475569',
                                fontFamily: 'UTM Bebas, sans-serif',
                                fontSize: '18px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                        >
                            PROFESSIONAL SPORTS BROADCAST
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo ScoLiv - Professional placement */}
            <div className="flex justify-center w-full mt-6">
                <div
                    className="p-2 rounded-lg"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                >
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="ScoLiv Logo"
                        className="w-20 h-auto opacity-90"
                    />
                </div>
            </div>
        </div>
    );
};

export default ScoreboardType5;
