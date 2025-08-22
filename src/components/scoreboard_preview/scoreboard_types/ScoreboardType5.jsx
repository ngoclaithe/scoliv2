import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType5 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    const defaultTournamentLogo = '/images/basic/logo-skin4.png';
    
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;
        
        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '8px';
            if (length <= 12) return '7px';
            if (length <= 16) return '6px';
            return '5px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '16px';
            if (length <= 12) return '14px';
            if (length <= 16) return '12px';
            return '10px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[500px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main container */}
            <div className="w-full relative">
                {/* Tournament logo - bigger */}
                <div className="absolute left-1/2 top-[-15px] sm:top-[-20px] -translate-x-1/2 w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] z-50">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                            border: '2px solid #2563eb',
                            boxShadow: '0 4px 8px rgba(37, 99, 235, 0.3)',
                        }}
                    >
                        <DisplayLogo
                            logos={[tournamentLogo || defaultTournamentLogo]}
                            alt="Tournament"
                            type_play="round"
                            className="w-[70%] h-[70%]"
                            logoSize="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]"
                        />
                    </div>
                </div>

                {/* Main scoreboard container - no padding */}
                <div
                    className="relative rounded-lg"
                    style={{
                        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                >
                    {/* Main content grid - no padding */}
                    <div className="grid grid-cols-5 gap-2 items-center">
                        {/* Team A section */}
                        <div className="col-span-2">
                            {/* Team A name */}
                            <div
                                className="relative rounded-md mb-1"
                                style={{
                                    background: 'linear-gradient(145deg, #2563eb, #1d4ed8)',
                                    border: '1px solid #3b82f6',
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
                                    className="w-5 h-5 rounded-sm flex flex-col overflow-hidden"
                                    style={{
                                        border: '1px solid #64748b',
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
                                className="relative rounded-lg text-center"
                                style={{
                                    background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                                    border: '1px solid #334155',
                                }}
                            >
                                {/* Scores */}
                                <div className="flex items-center justify-center space-x-1">
                                    <div
                                        className="text-white font-bold text-lg sm:text-xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 8px rgba(59, 130, 246, 0.8)',
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>
                                    <div className="text-slate-400 text-sm">-</div>
                                    <div
                                        className="text-white font-bold text-lg sm:text-xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                                        }}
                                    >
                                        {currentData.teamBScore}
                                    </div>
                                </div>
                                
                                {/* Time display */}
                                {showMatchTime && (
                                    <div>
                                        <div
                                            className="text-green-400 text-xs font-bold"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
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
                                className="relative rounded-md mb-1"
                                style={{
                                    background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                                    border: '1px solid #ef4444',
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
                                    className="w-5 h-5 rounded-sm flex flex-col overflow-hidden"
                                    style={{
                                        border: '1px solid #64748b',
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
