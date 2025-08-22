import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType5 = ({ currentData, logoShape, tournamentLogo }) => {
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
            if (length <= 8) return '18px';
            if (length <= 12) return '16px';
            if (length <= 16) return '14px';
            return '12px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[900px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main container - wider but shorter */}
            <div className="w-full relative">
                {/* Tournament logo - minimal */}
                <div className="absolute left-1/2 top-[-12px] sm:top-[-16px] -translate-x-1/2 w-[20px] h-[20px] sm:w-[32px] sm:h-[32px] z-50">
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                            border: '2px solid #1e293b',
                            boxShadow: '0 4px 12px rgba(30, 41, 59, 0.4)',
                        }}
                    >
                        <img
                            src={getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo}
                            alt="Tournament"
                            className="w-[65%] h-[65%] object-contain"
                        />
                    </div>
                </div>

                {/* Main scoreboard panel - minimal height */}
                <div
                    className="relative px-4 py-3 rounded-xl"
                    style={{
                        background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                        border: '1px solid #334155',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Main content layout */}
                    <div className="grid grid-cols-7 gap-4 items-center">
                        {/* Team A section */}
                        <div className="col-span-3">
                            <div
                                className="relative p-3 rounded-lg"
                                style={{
                                    background: 'linear-gradient(145deg, #2563eb, #1e40af)',
                                    border: '1px solid #3b82f6',
                                }}
                            >
                                {/* Team A name */}
                                <div
                                    className="text-white font-bold text-center mb-2"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>
                                
                                {/* Team A kit colors */}
                                <div className="flex justify-center">
                                    <div
                                        className="w-8 h-8 rounded-lg flex flex-col overflow-hidden"
                                        style={{
                                            border: '1px solid #1e40af',
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
                                className="relative p-3 rounded-xl text-center"
                                style={{
                                    background: 'linear-gradient(145deg, #000000, #1e293b)',
                                    border: '2px solid #475569',
                                }}
                            >
                                {/* Scores display */}
                                <div className="space-y-1">
                                    <div
                                        className="text-white font-bold text-2xl sm:text-3xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(59, 130, 246, 0.9)',
                                        }}
                                    >
                                        {currentData.teamAScore}
                                    </div>
                                    
                                    <div className="text-slate-500 text-sm font-bold">VS</div>
                                    
                                    <div
                                        className="text-white font-bold text-2xl sm:text-3xl"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            textShadow: '0 0 10px rgba(239, 68, 68, 0.9)',
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
                                className="relative p-3 rounded-lg"
                                style={{
                                    background: 'linear-gradient(145deg, #dc2626, #b91c1c)',
                                    border: '1px solid #ef4444',
                                }}
                            >
                                {/* Team B name */}
                                <div
                                    className="text-white font-bold text-center mb-2"
                                    style={{
                                        fontFamily: 'UTM Bebas, sans-serif',
                                        fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>
                                
                                {/* Team B kit colors */}
                                <div className="flex justify-center">
                                    <div
                                        className="w-8 h-8 rounded-lg flex flex-col overflow-hidden"
                                        style={{
                                            border: '1px solid #b91c1c',
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

                {/* Professional details strip - minimal */}
                <div className="mt-2">
                    <div className="flex justify-center">
                        <img
                            src="/images/basic/ScoLivLogo.png"
                            alt="ScoLiv Logo"
                            className="h-3 opacity-90"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType5;
