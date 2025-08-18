import React from 'react';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType1 = ({ currentData, logoShape, showMatchTime }) => {
    return (
        <div className="flex flex-col items-center scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5] sm:h-10 max-w-[600px]">
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
                                className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 text-center sm:w-8 font-"
                                style={{ fontFamily: 'UTM Bebas, sans-serif', height: '56px' }}
                            >
                                {currentData.teamAScore}
                            </div>

                            <div className="w-[180px]">
                                <div className="w-full text-white text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]" style={{ backgroundColor: '#004d73', fontFamily: 'UTM Bebas, sans-serif', height: '56px' }}>
                                    {currentData.teamAName}
                                </div>

                                <div className="flex w-full h-2">
                                    <div
                                        className="flex-1 h-full"
                                        style={{ backgroundColor: currentData.teamAKitColor }}
                                    />
                                    <div
                                        className="flex-1 h-full"
                                        style={{ backgroundColor: currentData.teamA2KitColor }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                        {currentData.matchTime}
                        <div className="h-1 bg-black"></div>
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
                            <div className="w-[180px]">
                                <div className="w-full text-white text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)] h-6" style={{ backgroundColor: '#004d73', fontFamily: 'UTM Bebas, sans-serif' }}>
                                    {currentData.teamBName}
                                </div>

                                <div className="flex w-full h-2">
                                    <div
                                        className="flex-1 h-full"
                                        style={{ backgroundColor: currentData.teamB2KitColor }}
                                    />
                                    <div
                                        className="flex-1 h-full"
                                        style={{ backgroundColor: currentData.teamBKitColor }}
                                    />
                                </div>
                            </div>
                            <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 text-center sm:w-8" style={{ fontFamily: 'UTM Bebas, sans-serif', height: '56px' }}>
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
