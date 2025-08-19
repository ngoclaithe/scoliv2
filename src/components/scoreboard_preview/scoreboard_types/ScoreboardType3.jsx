import React, { useEffect, useState } from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType3 = ({ currentData, logoShape, showMatchTime }) => {
    const [fontSize, setFontSize] = useState('text-xs');

    const calculateFontSize = (teamAName, teamBName) => {
        const maxLength = Math.max(teamAName?.length || 0, teamBName?.length || 0);
        
        if (maxLength <= 8) return 'text-6xl';       
        if (maxLength <= 12) return 'text-4xl';      
        if (maxLength <= 16) return 'text-[22px]';  
        if (maxLength <= 20) return 'text-[20px]';  
        if (maxLength <= 24) return 'text-[18px]';   
        return 'text-[18px]';                        
    };

    useEffect(() => {
        const newFontSize = calculateFontSize(currentData.teamAName, currentData.teamBName);
        setFontSize(newFontSize);
    }, [currentData.teamAName, currentData.teamBName]);

    return (
        <div className="flex flex-col items-center w-[520px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            
            <div className="flex items-center justify-between w-full bg-white">
                <div className="flex flex-col flex-1">
                    
                    {/* Fouls */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex justify-start items-center">
                            <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                        </div>
                        <div className="flex justify-end items-center">
                            <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                        </div>
                    </div>
                    
                    {/* Main content row - grid 3 cột */}
                    <div className="grid grid-cols-[1fr_auto_1fr] w-full items-stretch">
                        
                        {/* Team A */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`text-white ${fontSize} font-medium w-full truncate text-center min-h-[34px] flex items-center justify-center`}
                                style={{ backgroundColor: '#0d94a4' }}
                            >
                                {currentData.teamAName}
                            </div>
                            <div className="flex w-full h-[7px] overflow-hidden">
                                <div className="flex-1" style={{ backgroundColor: currentData.teamAKitColor }} />
                                <div className="flex-1" style={{ backgroundColor: currentData.teamA2KitColor }} />
                            </div>
                        </div>

                        {/* Score + time */}
                        <div className="flex flex-col items-center">
                            <div className="flex items-center bg-white h-full px-2 py-[2px]">
                                <span className="font-bold text-lg sm:text-xl text-gray-900">{currentData.teamAScore}</span>
                                <span className="text-gray-400 font-light text-sm sm:text-base mx-1">:</span>
                                <span className="font-bold text-lg sm:text-xl text-gray-900">{currentData.teamBScore}</span>
                            </div>
                            {showMatchTime && (
                                <div className="bg-red-600 text-white text-xs sm:text-sm font-semibold whitespace-nowrap w-full text-center py-[1px]">
                                    {currentData.matchTime}
                                </div>
                            )}
                        </div>

                        {/* Team B */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`text-white ${fontSize} font-medium w-full truncate text-center min-h-[34px] flex items-center justify-center`}
                                style={{ backgroundColor: '#0d94a4' }}
                            >
                                {currentData.teamBName}
                            </div>
                            <div className="flex w-full h-[7px] overflow-hidden">
                                <div className="flex-1" style={{ backgroundColor: currentData.teamBKitColor }} />
                                <div className="flex-1" style={{ backgroundColor: currentData.teamB2KitColor }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Logo ScoLiv */}
            <div className="flex justify-center w-full">
                <img
                    src="/images/basic/ScoLivLogo.png"
                    alt="ScoLiv Logo"
                    className="w-[44%] h-auto"
                />
            </div>
        </div>
    );
};

export default ScoreboardType3;