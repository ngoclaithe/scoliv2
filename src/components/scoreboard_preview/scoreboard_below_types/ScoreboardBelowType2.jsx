import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardBelowType2 = ({ currentData, logoShape, showMatchTime }) => {
    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    return (
        <div className="flex flex-col items-center scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5] w-[600px]">
            <div className="relative w-full flex justify-start items-center">
                {/* Logo team A */}
                <div className="absolute z-20" style={{ left: 'calc(50% - 168px)', top: '50%', transform: 'translateY(-50%)' }}>
                    <div className="w-12 h-12 border-2" style={{ borderColor: currentData.teamAKitColor, borderRadius: logoShape === 'circle' ? '50%' : logoShape === 'hexagon' ? '0' : '8px' }}>
                        <DisplayLogo
                            logos={[currentData.teamALogo]}
                            alt={currentData.teamAName}
                            className="w-full h-full"
                            type_play={logoShape}
                            logoSize="w-12 h-12"
                        />
                    </div>
                </div>

                {/* Main scoreboard container */}
                <div
                    className="flex items-center justify-center relative z-10"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        width: '600px',
                        height: '48px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Tên đội A với fouls */}
                    <div
                        className="flex flex-col items-start justify-center truncate relative"
                        style={{
                            width: '240px',
                            height: '100%',
                            fontSize: `${Math.min(40, Math.max(22, 240 / Math.max(1, currentData.teamAName.length) * 1.5))}px`,
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {/* Fouls for Team A - positioned above */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="[&>*]:!w-3 [&>*]:!h-2">
                                <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[10px]" />
                            </div>
                        </div>

                        <span className="w-full text-sm sm:text-base font-semibold text-center leading-[1.2] px-2" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamAName}
                        </span>
                        <div className="flex w-full h-[6px] px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamA2KitColor }} />
                        </div>
                    </div>

                    {/* Tỉ số A */}
                    <div
                        className="text-white font-extrabold text-5xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '80px',
                            height: '48px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        {currentData.teamAScore}
                    </div>

                    {/* Thời gian */}
                    {showMatchTime && (
                        <div
                            className="bg-red-600 text-white text-3xl font-bold flex items-center justify-center mx-2 leading-none"
                            style={{
                                padding: '0 8px',
                                height: 'auto',
                                minHeight: '48px', 
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {currentData.matchTime}
                        </div>
                    )}

                    {/* Tỉ số B */}
                    <div
                        className="text-white font-extrabold text-5xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '80px',
                            height: '48px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontFamily: 'UTM Bebas, sans-serif'
                        }}
                    >
                        {currentData.teamBScore}
                    </div>

                    {/* Tên đội B với fouls */}
                    <div
                        className="flex flex-col items-end justify-center truncate relative"
                        style={{
                            width: '240px',
                            height: '100%',
                            fontSize: `${Math.min(40, Math.max(22, 240 / Math.max(1, currentData.teamBName.length) * 1.5))}px`,
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {/* Fouls for Team B - positioned above */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="[&>*]:!w-3 [&>*]:!h-2">
                                <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[10px]" />
                            </div>
                        </div>

                        <span className="w-full text-sm sm:text-base font-semibold text-center leading-[1.2] px-2" style={{ fontFamily: 'UTM Bebas, sans-serif' }}>
                            {currentData.teamBName}
                        </span>
                        <div className="flex w-full h-[6px] px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamB2KitColor }} />
                        </div>
                    </div>
                </div>

                {/* Logo team B */}
                <div className="absolute z-20" style={{ right: 'calc(50% - 168px)', top: '50%', transform: 'translateY(-50%)' }}>
                    <div className="w-12 h-12 border-2" style={{ borderColor: currentData.teamBKitColor, borderRadius: logoShape === 'circle' ? '50%' : logoShape === 'hexagon' ? '0' : '8px' }}>
                        <DisplayLogo
                            logos={[currentData.teamBLogo]}
                            alt={currentData.teamBName}
                            className="w-full h-full"
                            type_play={logoShape}
                            logoSize="w-12 h-12"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreboardBelowType2;
