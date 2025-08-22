import React from 'react';
import DisplayLogo from '../../common/DisplayLogo';
import { FoulsDisplay } from '../../../utils/futsalUtils';

const ScoreboardType5 = ({ currentData, logoShape, showMatchTime, tournamentLogo }) => {
    const defaultTournamentLogo = '/images/basic/logo-skin4.png';
    
    const getTeamNameFontSize = (teamName, isMobile = false) => {
        const length = teamName ? teamName.length : 0;
        
        if (isMobile) {
            // Mobile font sizes
            if (length <= 8) return '11px';
            if (length <= 12) return '10px';
            if (length <= 16) return '9px';
            return '8px';
        } else {
            // Desktop font sizes
            if (length <= 8) return '32px';
            if (length <= 12) return '28px';
            if (length <= 16) return '24px';
            return '24px';
        }
    };

    return (
        <div className="flex flex-col items-center w-[700px] scale-100 sm:scale-100 max-[480px]:scale-[0.67] max-[360px]:scale-[0.5]">
            {/* Multilayer background decoration */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Background layer 1 - Large geometric shapes */}
                <div
                    className="absolute -top-12 -left-12 w-32 h-32"
                    style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                    }}
                />
                <div
                    className="absolute -top-12 -right-12 w-32 h-32"
                    style={{
                        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.2))',
                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 75% 100%, 25% 100%, 0% 75%)',
                    }}
                />
                {/* Background layer 2 - Overlapping diamonds */}
                <div
                    className="absolute top-8 left-16 w-20 h-20"
                    style={{
                        background: 'linear-gradient(45deg, rgba(255, 107, 107, 0.15), rgba(78, 205, 196, 0.15))',
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    }}
                />
                <div
                    className="absolute top-8 right-16 w-20 h-20"
                    style={{
                        background: 'linear-gradient(45deg, rgba(69, 183, 209, 0.15), rgba(150, 206, 180, 0.15))',
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    }}
                />
                {/* Background layer 3 - Triangular patterns */}
                <div
                    className="absolute bottom-12 left-8 w-12 h-12"
                    style={{
                        background: 'linear-gradient(45deg, rgba(255, 234, 167, 0.25), rgba(221, 160, 221, 0.25))',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                />
                <div
                    className="absolute bottom-12 right-8 w-12 h-12"
                    style={{
                        background: 'linear-gradient(45deg, rgba(255, 183, 77, 0.25), rgba(255, 128, 128, 0.25))',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                />
            </div>

            {/* Main scoreboard row */}
            <div className="w-full flex justify-center px-[4px] sm:px-[8px] relative z-10">
                <div className="flex flex-row items-end min-h-[64px] sm:min-h-[72px] relative bg-transparent">

                    {/* Tournament/League Logo with crystal design */}
                    <div className="absolute left-1/2 top-[-12px] sm:top-[-20px] -translate-x-1/2 w-[20px] h-[20px] sm:w-[56px] sm:h-[56px] z-50">
                        {/* Crystal layer 1 - Outer ring */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'conic-gradient(from 0deg, #FFD700, #FFA500, #FF8C00, #FFD700)',
                                clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                                transform: 'scale(1.2)',
                            }}
                        />
                        {/* Crystal layer 2 - Middle ring */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                                transform: 'scale(1.1)',
                            }}
                        />
                        {/* Crystal layer 3 - Main body */}
                        <div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                                clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)',
                                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
                            }}
                        >
                            <DisplayLogo
                                logos={[tournamentLogo || defaultTournamentLogo]}
                                alt="Tournament"
                                type_play="round"
                                className="w-[70%] h-[70%]"
                                logoSize="w-[16px] h-[16px] sm:w-[40px] sm:h-[40px]"
                            />
                        </div>
                        {/* Crystal layer 4 - Inner highlights */}
                        <div
                            className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white opacity-70"
                            style={{
                                filter: 'blur(0.5px)',
                            }}
                        />
                        <div
                            className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-yellow-200 opacity-50"
                        />
                    </div>

                    {/* Main content structure with layered design */}
                    <div className="flex flex-col items-center z-20 relative">
                        <div className="flex flex-row items-end space-x-[-25px] sm:space-x-[-30px]">
                            
                            {/* Team A section with complex layering */}
                            <div className="flex flex-col items-center relative">
                                {/* Team A fouls */}
                                <div className="flex items-center justify-center mb-1">
                                    <FoulsDisplay foulsCount={currentData.teamAFouls} className="text-[9px]" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                                </div>
                                
                                {/* Team A name with multilayer design */}
                                <div className="relative">
                                    {/* Layer 1 - Deep shadow */}
                                    <div
                                        className="absolute top-3 left-3"
                                        style={{
                                            width: '240px', 
                                            height: '55px',
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                            filter: 'blur(2px)',
                                        }}
                                    />
                                    {/* Layer 2 - Gradient border */}
                                    <div
                                        className="absolute top-1 left-1"
                                        style={{
                                            width: '240px', 
                                            height: '55px',
                                            background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                        }}
                                    />
                                    {/* Layer 3 - Inner gradient */}
                                    <div
                                        className="absolute top-2 left-2"
                                        style={{
                                            width: '236px', 
                                            height: '51px',
                                            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                        }}
                                    />
                                    {/* Layer 4 - Main team name */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center z-10"
                                        style={{
                                            width: '240px', 
                                            height: '55px', 
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamAName, window.innerWidth <= 640),
                                            textShadow: '0 0 12px rgba(0,255,255,0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                                            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        <span className="truncate text-center">{currentData.teamAName}</span>
                                        {/* Inner light overlay */}
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                                                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team A kit color with architectural design */}
                            <div className="relative z-30">
                                {/* Architecture layer 1 - Outer frame */}
                                <div
                                    className="absolute -top-2 -left-2"
                                    style={{
                                        width: '32px',
                                        height: '58px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)',
                                    }}
                                />
                                {/* Architecture layer 2 - Border accent */}
                                <div
                                    className="absolute -top-1 -left-1"
                                    style={{
                                        width: '30px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                        clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)',
                                    }}
                                />
                                {/* Architecture layer 3 - Main kit container */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '28px',
                                        height: '55px',
                                        clipPath: 'polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)',
                                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2 relative overflow-hidden"
                                        style={{ backgroundColor: currentData.teamAKitColor }}
                                    >
                                        {/* Inner texture */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                                                backgroundSize: '4px 4px',
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="w-full h-1/2 relative overflow-hidden"
                                        style={{ backgroundColor: currentData.teamA2KitColor }}
                                    >
                                        {/* Inner texture */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                                                backgroundSize: '4px 4px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Central score box with dimensional architecture */}
                            <div className="relative z-40">
                                {/* Architecture layer 1 - Deep foundation */}
                                <div
                                    className="absolute top-3 left-3"
                                    style={{
                                        width: '160px',
                                        height: '65px',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                        filter: 'blur(3px)',
                                    }}
                                />
                                {/* Architecture layer 2 - Support structure */}
                                <div
                                    className="absolute top-2 left-2"
                                    style={{
                                        width: '160px',
                                        height: '65px',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                    }}
                                />
                                {/* Architecture layer 3 - Frame structure */}
                                <div
                                    className="absolute top-1 left-1"
                                    style={{
                                        width: '158px',
                                        height: '63px',
                                        background: 'conic-gradient(from 0deg, #667eea, #764ba2, #667eea)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                    }}
                                />
                                {/* Architecture layer 4 - Inner chamber */}
                                <div
                                    className="absolute top-2 left-2 right-2 bottom-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                    }}
                                />
                                {/* Architecture layer 5 - Score display */}
                                <div
                                    className="relative flex items-center justify-around px-3"
                                    style={{
                                        width: '160px',
                                        height: '65px',
                                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
                                    }}
                                >
                                    {/* Team A Score with depth */}
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 text-cyan-300 font-bold text-xl sm:text-4xl text-center opacity-50"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                transform: 'translate(2px, 2px)',
                                                filter: 'blur(1px)',
                                            }}
                                        >
                                            {currentData.teamAScore}
                                        </div>
                                        <div
                                            className="relative text-white font-bold text-xl sm:text-4xl text-center"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(0,255,255,0.8), 3px 3px 6px rgba(0,0,0,0.8)',
                                                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                            }}
                                        >
                                            {currentData.teamAScore}
                                        </div>
                                    </div>

                                    {/* Team B Score with depth */}
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 text-pink-300 font-bold text-xl sm:text-4xl text-center opacity-50"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                transform: 'translate(-2px, 2px)',
                                                filter: 'blur(1px)',
                                            }}
                                        >
                                            {currentData.teamBScore}
                                        </div>
                                        <div
                                            className="relative text-white font-bold text-xl sm:text-4xl text-center"
                                            style={{
                                                fontFamily: 'UTM Bebas, sans-serif',
                                                textShadow: '0 0 15px rgba(255,0,255,0.8), 3px 3px 6px rgba(0,0,0,0.8)',
                                                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                            }}
                                        >
                                            {currentData.teamBScore}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Team B kit color with architectural design */}
                            <div className="relative z-30">
                                {/* Architecture layer 1 - Outer frame */}
                                <div
                                    className="absolute -top-2 -left-2"
                                    style={{
                                        width: '32px',
                                        height: '58px',
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
                                    }}
                                />
                                {/* Architecture layer 2 - Border accent */}
                                <div
                                    className="absolute -top-1 -left-1"
                                    style={{
                                        width: '30px',
                                        height: '56px',
                                        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                        clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
                                    }}
                                />
                                {/* Architecture layer 3 - Main kit container */}
                                <div
                                    className="relative flex flex-col items-center"
                                    style={{
                                        width: '28px',
                                        height: '55px',
                                        clipPath: 'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
                                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)',
                                    }}
                                >
                                    <div
                                        className="w-full h-1/2 relative overflow-hidden"
                                        style={{ backgroundColor: currentData.teamBKitColor }}
                                    >
                                        {/* Inner texture */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                                                backgroundSize: '4px 4px',
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="w-full h-1/2 relative overflow-hidden"
                                        style={{ backgroundColor: currentData.teamB2KitColor }}
                                    >
                                        {/* Inner texture */}
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.3) 75%)',
                                                backgroundSize: '4px 4px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team B section with complex layering */}
                            <div className="flex flex-col items-center relative">
                                {/* Team B fouls */}
                                <div className="flex items-center justify-center mb-1">
                                    <FoulsDisplay foulsCount={currentData.teamBFouls} className="text-[9px]" style={{ fontFamily: 'UTM Bebas, sans-serif' }} />
                                </div>
                                
                                {/* Team B name with multilayer design */}
                                <div className="relative">
                                    {/* Layer 1 - Deep shadow */}
                                    <div
                                        className="absolute top-3 left-3"
                                        style={{
                                            width: '240px', 
                                            height: '55px',
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                            filter: 'blur(2px)',
                                        }}
                                    />
                                    {/* Layer 2 - Gradient border */}
                                    <div
                                        className="absolute top-1 left-1"
                                        style={{
                                            width: '240px', 
                                            height: '55px',
                                            background: 'linear-gradient(45deg, #f5576c, #f093fb, #764ba2, #667eea)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                        }}
                                    />
                                    {/* Layer 3 - Inner gradient */}
                                    <div
                                        className="absolute top-2 left-2"
                                        style={{
                                            width: '236px', 
                                            height: '51px',
                                            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                        }}
                                    />
                                    {/* Layer 4 - Main team name */}
                                    <div
                                        className="relative text-white font-bold flex items-center justify-center"
                                        style={{
                                            width: '240px', 
                                            height: '55px', 
                                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                            fontFamily: 'UTM Bebas, sans-serif',
                                            fontSize: getTeamNameFontSize(currentData.teamBName, window.innerWidth <= 640),
                                            textShadow: '0 0 12px rgba(255,0,255,0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                                            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        <span className="truncate text-center">{currentData.teamBName}</span>
                                        {/* Inner light overlay */}
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                                                clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status display with architectural layering */}
                        <div className="relative mt-3">
                            {/* Status layer 1 - Foundation shadow */}
                            <div
                                className="absolute top-2 left-2"
                                style={{
                                    width: '200px',
                                    height: '35px',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                    filter: 'blur(2px)',
                                }}
                            />
                            {/* Status layer 2 - Border frame */}
                            <div
                                className="absolute top-1 left-1"
                                style={{
                                    width: '198px',
                                    height: '33px',
                                    background: showMatchTime ? 
                                        'linear-gradient(90deg, #dc2626, #ef4444, #dc2626)' : 
                                        'linear-gradient(90deg, #16a34a, #22c55e, #16a34a)',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                }}
                            />
                            {/* Status layer 3 - Main content */}
                            <div
                                className={`relative text-white text-lg sm:text-2xl font-bold px-4 py-1 flex items-center justify-center ${showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}
                                style={{ 
                                    width: '200px',
                                    height: '35px',
                                    fontFamily: 'UTM Bebas, sans-serif',
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                                    textShadow: '0 0 8px rgba(255,255,255,0.6), 2px 2px 4px rgba(0,0,0,0.8)',
                                    boxShadow: `inset 0 2px 4px rgba(255,255,255,0.2), 0 0 20px ${showMatchTime ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
                                }}
                            >
                                {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Logo ScoLiv with layered design */}
            <div className="flex justify-center w-full mt-4 relative">
                {/* Logo shadow layer */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="ScoLiv Logo Shadow"
                        className="w-[30%] h-auto opacity-20 filter blur-sm"
                    />
                </div>
                {/* Main logo */}
                <img
                    src="/images/basic/ScoLivLogo.png"
                    alt="ScoLiv Logo"
                    className="w-[30%] h-auto opacity-80 relative z-10"
                />
            </div>
        </div>
    );
};

export default ScoreboardType5;
