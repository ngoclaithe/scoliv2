import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

const PenaltyScoreboard = ({ type = 1 }) => {
    const {
        matchData,
        displaySettings,
        penaltyData,
        socketConnected
    } = usePublicMatch();

    // Get real data from context with fallbacks
    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: matchData?.teamA?.logo || "/api/placeholder/90/90",
        teamBLogo: matchData?.teamB?.logo || "/api/placeholder/90/90",
        teamAScore: matchData?.teamA?.score || 0,
        teamBScore: matchData?.teamB?.score || 0,
        teamAPenaltyScore: penaltyData?.teamAGoals || 0,
        teamBPenaltyScore: penaltyData?.teamBGoals || 0,
        teamAKitColor: matchData?.teamAKitColor || "#FF0000",
        teamBKitColor: matchData?.teamBKitColor || "#0000FF"
    };

    // Get logo shape from display settings, default to square
    const logoShape = displaySettings?.logoShape || "square";

    // Hàm tính độ sáng của màu để chọn màu chữ phù hợp
    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const renderPenaltyScoreboardType1 = () => (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full px-2 gap-0">
                {/* Logo team A */}
                <DisplayLogo
                    logos={[currentData.teamALogo]}
                    alt={currentData.teamAName}
                    className="w-14 h-14"
                    type_play={logoShape}
                />

                {/* Score + team A name */}
                <div className="flex items-center gap-0">
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}>
                        {currentData.teamAScore}
                    </div>
                    <div className="bg-red-500 text-white font-bold text-lg px-2 py-0.5 min-w-[2rem] text-center">
                        ({currentData.teamAPenaltyScore})
                    </div>
                    <div className="container-name-color-left flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white px-2 py-0.5 text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamAName}
                        </div>
                        <div
                            className="w-full h-3"
                            style={{ backgroundColor: currentData.teamAKitColor }}
                        />
                    </div>
                </div>

                {/* Penalty indicator */}
                <div className="bg-red-600 text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                    PENALTY
                </div>

                {/* Score + team B name */}
                <div className="flex items-center gap-0">
                    <div className="container-name-color-right flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white px-2 py-0.5 text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamBName}
                        </div>
                        <div
                            className="w-full h-3"
                            style={{ backgroundColor: currentData.teamBKitColor }}
                        />
                    </div>
                    <div className="bg-red-500 text-white font-bold text-lg px-2 py-0.5 min-w-[2rem] text-center">
                        ({currentData.teamBPenaltyScore})
                    </div>
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)' }}>
                        {currentData.teamBScore}
                    </div>
                </div>

                {/* Logo team B */}
                <DisplayLogo
                    logos={[currentData.teamBLogo]}
                    alt={currentData.teamBName}
                    className="w-14 h-14"
                    type_play={logoShape}
                />
            </div>
        </div>
    );

    const renderPenaltyScoreboardType2 = () => (
        <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center items-center m-0 p-0">
                {/* Scoreboard chính */}
                <div
                    className="flex items-center justify-center relative z-10 h-8 rounded-md m-0 p-0 gap-0"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        overflow: 'hidden',
                        width: '320px',
                    }}
                >
                    {/* Team A Name */}
                    <div
                        className="text-sm font-semibold flex items-center justify-center truncate m-0 p-0 relative"
                        style={{
                            width: '100px',
                            height: '100%',
                            fontSize: 'clamp(10px, 4vw, 14px)',
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAName}
                    </div>

                    {/* Score A */}
                    <div
                        className="text-white font-extrabold text-lg text-center m-0 p-0"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2rem',
                            height: '100%',
                            lineHeight: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAScore}
                    </div>

                    {/* Penalty Score A */}
                    <div className="bg-red-500 text-white text-xs font-bold rounded m-0"
                        style={{
                            padding: '0 4px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        ({currentData.teamAPenaltyScore})
                    </div>

                    {/* Penalty indicator */}
                    <div className="bg-red-600 text-white text-xs font-bold rounded m-0"
                        style={{
                            padding: '0 6px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        PEN
                    </div>

                    {/* Penalty Score B */}
                    <div className="bg-red-500 text-white text-xs font-bold rounded m-0"
                        style={{
                            padding: '0 4px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        ({currentData.teamBPenaltyScore})
                    </div>

                    {/* Score B */}
                    <div
                        className="text-white font-extrabold text-lg text-center m-0 p-0"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2rem',
                            height: '100%',
                            lineHeight: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBScore}
                    </div>

                    {/* Team B Name */}
                    <div
                        className="text-sm font-semibold flex items-center justify-center truncate m-0 p-0 relative"
                        style={{
                            width: '100px',
                            height: '100%',
                            fontSize: 'clamp(10px, 4vw, 14px)',
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBName}
                    </div>
                </div>

                {/* Logo Team A */}
                <div
                    className="absolute z-20"
                    style={{
                        left: 'calc(50% - 200px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div
                        className="w-12 h-12 border-2"
                        style={{
                            borderColor: currentData.teamAKitColor,
                            borderRadius: logoShape === 'circle' ? '50%' : logoShape === 'hexagon' ? '0' : '8px'
                        }}
                    >
                        <DisplayLogo
                            logos={[currentData.teamALogo]}
                            alt={currentData.teamAName}
                            className="w-full h-full"
                            type_play={logoShape}
                        />
                    </div>
                </div>

                {/* Logo Team B */}
                <div
                    className="absolute z-20"
                    style={{
                        right: 'calc(50% - 200px)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div
                        className="w-12 h-12 border-2"
                        style={{
                            borderColor: currentData.teamBKitColor,
                            borderRadius: logoShape === 'circle' ? '50%' : logoShape === 'hexagon' ? '0' : '8px'
                        }}
                    >
                        <DisplayLogo
                            logos={[currentData.teamBLogo]}
                            alt={currentData.teamBName}
                            className="w-full h-full"
                            type_play={logoShape}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPenaltyScoreboard = () => {
        switch (type) {
            case 1: return renderPenaltyScoreboardType1();
            case 2: return renderPenaltyScoreboardType2();
            default: return renderPenaltyScoreboardType1();
        }
    };

    return (
        <div className="w-full h-screen relative overflow-hidden">
            <div className="w-full h-full relative bg-transparent" style={{
                transform: 'scale(var(--scale-factor, 1))',
                transformOrigin: 'center center'
            }}>
                {/* ScoLiv Logo */}
                <div className="absolute bottom-4 left-4 sm:left-16 z-40">
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="ScoLiv"
                        className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
                        onError={(e) => {
                            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="%23007acc"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="white" font-weight="bold">ScoLiv</text></svg>`;
                        }}
                    />
                </div>

                {/* Main Penalty Scoreboard */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="scoreboard-main bg-transparent rounded-lg shadow-2xl min-w-[400px] py-3">
                        {renderPenaltyScoreboard()}
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Mobile scaling for proportional zoom */
                @media (max-width: 768px) {
                    :root {
                        --scale-factor: 0.85;
                    }
                    
                    .scoreboard-main {
                        min-width: 350px;
                        max-width: 95vw;
                    }
                    
                    .container-name-color-left,
                    .container-name-color-right {
                        min-width: 60px;
                    }
                }
                
                @media (max-width: 480px) {
                    :root {
                        --scale-factor: 0.75;
                    }
                }
            `}</style>
        </div>
    );
};

export default PenaltyScoreboard;
