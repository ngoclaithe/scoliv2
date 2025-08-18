import React from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5] sm:h-10 w-[600px]">
            <div className="flex items-end justify-center w-full px-2 gap-0">

                <div className="flex">
                    <div className="flex flex-col items-center">
                        {/* Fouls for Team A */}
                        <div className="flex justify-center">
                            <div className="[&>*]:!w-3 [&>*]:!h-1">
                                <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div
                                className="bg-yellow-400 text-black font-bold text-4xl px-2 py-0.5 text-center sm:w-8 font- flex items-center justify-center"
                                style={{ fontFamily: 'UTM Bebas, sans-serif', height: '56px' }}
                            >
                                {currentData.teamAScore}
                            </div>

                            <div className="w-[220px]">
                                <div className="w-full text-white font-normal whitespace-nowrap text-center truncate flex items-center justify-center" style={{ backgroundColor: '#004d73', fontFamily: 'UTM Bebas, sans-serif', height: '48px', fontSize: `${Math.max(40, Math.min(22, 220 / Math.max(1, currentData.teamAName.length) * 1.5))}px` }}>
                                    {currentData.teamAName}
                                </div>

                                <div className="flex w-full" style={{ height: '8px' }}>
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamAKitColor, height: '8px' }}
                                    />
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamA2KitColor, height: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap flex items-center justify-center" style={{ height: '56px' }}>
                        {currentData.matchTime}
                    </div>
                )}
    
                <div className="flex">
                    <div className="flex flex-col items-center">
                        {/* Fouls for Team B */}
                        <div className="flex justify-center">
                            <div className="[&>*]:!w-3 [&>*]:!h-1">
                                <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="w-[220px]">
                                <div className="w-full text-white font-normal whitespace-nowrap text-center truncate flex items-center justify-center" style={{ backgroundColor: '#004d73', fontFamily: 'UTM Bebas, sans-serif', height: '48px', fontSize: `${Math.max(40, Math.min(22, 220 / Math.max(1, currentData.teamBName.length) * 1.5))}px` }}>
                                    {currentData.teamBName}
                                </div>

                                <div className="flex w-full" style={{ height: '8px' }}>
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamB2KitColor, height: '8px' }}
                                    />
                                    <div
                                        className="flex-1"
                                        style={{ backgroundColor: currentData.teamBKitColor, height: '8px' }}
                                    />
                                </div>
                            </div>
                            <div className="bg-yellow-400 text-black font-bold text-4xl px-2 py-0.5 text-center sm:w-8 flex items-center justify-center" style={{ fontFamily: 'UTM Bebas, sans-serif', height: '56px' }}>
                                {currentData.teamBScore}
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
                    className="w-[46%] h-auto"
                />
            </div>

        </div>
    );
};

export default ScoreboardType1;