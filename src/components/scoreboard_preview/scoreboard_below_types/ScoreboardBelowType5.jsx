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
            if (length <= 8) return '20px';
            if (length <= 12) return '18px';
            if (length <= 16) return '16px';
            return '14px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[600px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main container */}
            <div className="w-full relative">
                {/* Tournament logo - Much bigger */}
                <div className="absolute left-1/2 top-[-6px] sm:top-[-8px] -translate-x-1/2 w-[45px] h-[22px] sm:w-[50px] sm:h-[25px] z-10">
                    <div
                        className="w-full h-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                            border: '4px solid #60a5fa',
                            boxShadow: '0 0 25px rgba(59, 130, 246, 0.7), inset 0 3px 6px rgba(255,255,255,0.4)',
                        }}
                    >
                        <img
                            src={getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo}
                            alt="Tournament"
                            className="w-[70%] h-[70%] object-contain"
                        />
                    </div>
                </div>

                {/* Main scoreboard panel - Better background */}
                <div
                    className="relative"
                    style={{
                        background: 'linear-gradient(135deg, #1e40af, #312e81, #1e293b)',
                        clipPath: 'polygon(3% 0%, 97% 0%, 100% 20%, 100% 80%, 97% 100%, 3% 100%, 0% 80%, 0% 20%)',
                        border: '3px solid #60a5fa',
                        boxShadow: '0 12px 30px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)',
                    }}
                >
                    {/* Main content layout */}
                    <div className="grid grid-cols-7 gap-4 items-center px-6 py-2">
                        {/* Team A section */}
                        <div className="col-span-3 flex items-center gap-3">
                            {/* Team A Logo */}
                            <div className="w-12 h-6 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img
                                    src={getFullLogoUrl(currentData.teamALogo) || "/api/placeholder/48/48"}
                                    alt="Team A Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                                    A
                                </div>
                            </div>
                            <div
                                className="relative flex-1"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                                    clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)',
                                    border: '2px solid #3b82f6',
                                    boxShadow: '0 0 15px rgba(37, 99, 235, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                                }}
                            >
                                <div className="px-4 py-1">
                                    {/* Team A name */}
                                    <div
                                        className="text-white font-bold text-center mb-1"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                            textShadow: '0 0 12px rgba(255,255,255,0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        {currentData.teamAName}
                                    </div>
                                    
                                    {/* Team A kit colors - Diamond */}
                                    <div className="flex justify-center">
                                        <div
                                            className="w-8 h-4 flex flex-col overflow-hidden relative"
                                            style={{
                                                transform: 'rotate(45deg)',
                                                border: '2px solid #1e40af',
                                                boxShadow: '0 0 8px rgba(37, 99, 235, 0.4)',
                                            }}
                                        >
                                            <div 
                                                className="h-1/2 relative" 
                                                style={{ 
                                                    backgroundColor: currentData.teamAKitColor,
                                                }}
                                            >
                                                <div 
                                                    className="absolute inset-0 opacity-30"
                                                    style={{
                                                        background: 'linear-gradient(45deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                                                    }}
                                                />
                                            </div>
                                            <div 
                                                className="h-1/2 relative" 
                                                style={{ 
                                                    backgroundColor: currentData.teamA2KitColor,
                                                }}
                                            >
                                                <div 
                                                    className="absolute inset-0 opacity-30"
                                                    style={{
                                                        background: 'linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.4) 100%)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Central score display - Better background, much larger fonts */}
                        <div className="col-span-1">
                            <div
                                className="relative text-center"
                                style={{
                                    background: 'linear-gradient(135deg, #0c4a6e, #164e63, #1e293b)',
                                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                    border: '3px solid #0ea5e9',
                                    boxShadow: '0 0 25px rgba(14, 165, 233, 0.5), inset 0 3px 6px rgba(255,255,255,0.2)',
                                }}
                            >
                                <div className="px-4 py-1">
                                    {/* Scores display - Much larger */}
                                    <div className="space-y-1">
                                        <div
                                            className="text-white font-bold text-4xl sm:text-5xl"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 20px rgba(59, 130, 246, 0.9), 0 0 8px rgba(255,255,255,0.6)',
                                                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.8))',
                                            }}
                                        >
                                            {currentData.teamAScore}
                                        </div>
                                        
                                        <div 
                                            className="text-slate-200 text-lg font-bold"
                                            style={{ 
                                                textShadow: '0 0 12px rgba(255,255,255,0.8)',
                                                fontFamily: 'UTM Bebas, sans-serif',
                                            }}
                                        >
                                            VS
                                        </div>
                                        
                                        <div
                                            className="text-white font-bold text-4xl sm:text-5xl"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 20px rgba(239, 68, 68, 0.9), 0 0 8px rgba(255,255,255,0.6)',
                                                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.8))',
                                            }}
                                        >
                                            {currentData.teamBScore}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team B section */}
                        <div className="col-span-3 flex items-center gap-3 flex-row-reverse">
                            {/* Team B Logo */}
                            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img
                                    src={getFullLogoUrl(currentData.teamBLogo) || "/api/placeholder/48/48"}
                                    alt="Team B Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                                    B
                                </div>
                            </div>
                            <div
                                className="relative flex-1"
                                style={{
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    clipPath: 'polygon(10% 0%, 100% 0%, 90% 50%, 100% 100%, 10% 100%, 0% 50%)',
                                    border: '2px solid #ef4444',
                                    boxShadow: '0 0 15px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                                }}
                            >
                                <div className="px-4 py-3">
                                    {/* Team B name */}
                                    <div
                                        className="text-white font-bold text-center mb-2"
                                        style={{
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                            textShadow: '0 0 12px rgba(255,255,255,0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        {currentData.teamBName}
                                    </div>
                                    
                                    {/* Team B kit colors - Diamond */}
                                    <div className="flex justify-center">
                                        <div
                                            className="w-8 h-8 flex flex-col overflow-hidden relative"
                                            style={{
                                                transform: 'rotate(45deg)',
                                                border: '2px solid #b91c1c',
                                                boxShadow: '0 0 8px rgba(220, 38, 38, 0.4)',
                                            }}
                                        >
                                            <div 
                                                className="h-1/2 relative" 
                                                style={{ 
                                                    backgroundColor: currentData.teamBKitColor,
                                                }}
                                            >
                                                <div 
                                                    className="absolute inset-0 opacity-30"
                                                    style={{
                                                        background: 'linear-gradient(45deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                                                    }}
                                                />
                                            </div>
                                            <div 
                                                className="h-1/2 relative" 
                                                style={{ 
                                                    backgroundColor: currentData.teamB2KitColor,
                                                }}
                                            >
                                                <div 
                                                    className="absolute inset-0 opacity-30"
                                                    style={{
                                                        background: 'linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.4) 100%)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType5;
