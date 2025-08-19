import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { getFullLogoUrl } from '../../../utils/logoUtils';

const ScoreboardBelowType4 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full">
                <DisplayLogo
                    logos={[currentData.teamALogo]}
                    alt={currentData.teamAName}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
                    type_play={logoShape}
                    logoSize="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />

                <div className="flex items-center z-20">
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -mr-6"
                        style={{
                            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamAName}</span>
                    </div>
                    <div
                        className="w-12 h-8 -ml-3 z-0 mr-2.5"
                        style={{
                            backgroundColor: currentData.teamAKitColor,
                            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)'
                        }}
                    />
                </div>

                <div className="flex flex-col items-center -mr-12 -ml-12">
                    <div
                        className="hex-logo flex items-center justify-center sm:px-3 md:px-4 relative py-1"
                        style={{
                            backgroundColor: '#213f80',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                            minHeight: '48px'
                        }}
                    >
                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamAScore}
                        </div>

                        <div className="mx-2 sm:mx-3 relative" style={{ top: '-6px' }}>
                            <DisplayLogo
                                logos={[getFullLogoUrl(tournamentLogo?.url_logo?.[0]) || currentData.leagueLogo]}
                                alt="Tournament"
                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0"
                                type_play={logoShape}
                                logoSize="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                            />
                        </div>

                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamBScore}
                        </div>
                    </div>
                    <div className={`text-white text-xs font-bold px-2 py-0.5 ${showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}>
                        {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                    </div>
                </div>

                <div className="flex items-center z-20">
                    <div
                        className="w-12 h-8 -mr-3 z-0 ml-2.5"
                        style={{
                            backgroundColor: currentData.teamBKitColor,
                            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)'
                        }}
                    />
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -ml-6"
                        style={{
                            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamBName}</span>
                    </div>
                </div>

                <DisplayLogo
                    logos={[currentData.teamBLogo]}
                    alt={currentData.teamBName}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
                    type_play={logoShape}
                    logoSize="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
            </div>
        </div>
    );
};

export default ScoreboardBelowType4;
