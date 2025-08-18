import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType4 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    return (
        <div className="flex flex-col items-center w-full scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Main scoreboard row với logo teamB cùng hàng */}
            <div className="w-full flex justify-center px-[4px] sm:px-[8px]">
                <div className="flex flex-row items-end min-h-[64px] sm:min-h-[72px] relative bg-transparent">


                    {/* Các box chính */}
                    <div className="flex flex-col items-center z-20 relative">
                        <div className="flex flex-row items-end space-x-[-10px] sm:space-x-[-16px]">
                            {/* Team A fouls + name */}
                            <div className="flex flex-col items-center">
                                {/* Team A fouls */}
                                <div className="flex items-center justify-center">
                                    <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[9px]" />
                                </div>
                                {/* Team A name */}
                                <div
                                    className="text-white text-[10px] sm:text-sm font-semibold flex items-center justify-center h-[20px] sm:h-[32px] z-10"
                                    style={{
                                        width: '72px',
                                        clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                        background: 'linear-gradient(to right, #ef4444, #f97316)',
                                    }}
                                >
                                    <span className="truncate text-center">{currentData.teamAName}</span>
                                </div>
                            </div>

                            {/* Team A kit color - Chia đôi màu */}
                            <div
                                className="flex flex-col items-end h-[20px] sm:h-[32px] z-20"
                                style={{
                                    width: '20px',
                                    clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)',
                                }}
                            >
                                {/* Nửa trên */}
                                <div 
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamAKitColor,
                                    }}
                                />
                                {/* Nửa dưới */}
                                <div 
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamA2KitColor,
                                    }}
                                />
                            </div>

                            {/* Score box */}
                            <div
                                className="relative h-[40px] sm:h-[48px] bg-blue-900 flex items-center z-0"
                                style={{
                                    width: '140px',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                }}
                            >
                                {/* Team A Score */}
                                <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[24px] text-white font-bold text-xs sm:text-lg text-center">
                                    {currentData.teamAScore}
                                </div>

                                {/* Tournament/League Logo */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]">
                                    <DisplayLogo
                                        logos={[tournamentLogo || currentData.leagueLogo]}
                                        alt="Tournament"
                                        type_play={logoShape}
                                        className="w-full h-full"
                                        logoSize="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]"
                                    />
                                </div>

                                {/* Team B Score */}
                                <div className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[24px] text-white font-bold text-xs sm:text-lg text-center">
                                    {currentData.teamBScore}
                                </div>
                            </div>

                            {/* Team B kit color - Chia đôi màu */}
                            <div
                                className="flex flex-col items-end h-[20px] sm:h-[32px] z-20"
                                style={{
                                    width: '20px',
                                    clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)',
                                }}
                            >
                                {/* Nửa trên */}
                                <div 
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamBKitColor,
                                    }}
                                />
                                {/* Nửa dưới */}
                                <div 
                                    className="w-full h-1/2"
                                    style={{
                                        backgroundColor: currentData.teamB2KitColor,
                                    }}
                                />
                            </div>

                            {/* Team B fouls + name */}
                            <div className="flex flex-col items-center">
                                {/* Team B fouls */}
                                <div className="flex items-center justify-center">
                                    <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[9px]" />
                                </div>
                                {/* Team B name */}
                                <div
                                    className="text-white text-[10px] sm:text-sm font-semibold flex items-center justify-center h-[20px] sm:h-[32px]"
                                    style={{
                                        width: '72px',
                                        clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                        background: 'linear-gradient(to right, #ef4444, #f97316)',
                                    }}
                                >
                                    <span className="truncate text-center">{currentData.teamBName}</span>
                                </div>
                            </div>
                        </div>

                        {/* LIVE Text - được căn giữa dưới toàn bộ scoreboard */}
                        <div
                            className={`mt-[2px] text-white text-[10px] sm:text-xs font-bold px-2 py-[1px] rounded ${showMatchTime ? 'bg-red-600' : 'bg-green-600'
                                }`}
                        >
                            {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ScoreboardType4;
