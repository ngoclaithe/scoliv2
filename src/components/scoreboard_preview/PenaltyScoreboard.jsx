import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../../utils/logoUtils';
import DisplayLogo from '../common/DisplayLogo';
import ScoreboardLogos from './ScoreboardLogos';

const PenaltyScoreboard = () => {
    const {
        matchData,
        displaySettings,
        penaltyData,
        socketConnected,
        sponsors,
        organizing,
        mediaPartners,
        tournamentLogo
    } = usePublicMatch();
    console.log("Giá trị của penaltyData là:", penaltyData);

    const shootHistory = penaltyData?.shootHistory || [];
    const sortedHistory = [...shootHistory].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const getPenaltyHistory = () => {
        const rounds = {};
        sortedHistory.forEach(shot => {
            if (!rounds[shot.round]) {
                rounds[shot.round] = {};
            }
            rounds[shot.round][shot.team] = shot.result;
        });
        return rounds;
    };

    const penaltyHistory = getPenaltyHistory();
    const maxRounds = Object.keys(penaltyHistory).length > 0 ? Math.max(...Object.keys(penaltyHistory).map(Number)) : 0;

    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: matchData?.teamA?.logo || "/api/placeholder/90/90",
        teamBLogo: matchData?.teamB?.logo || "/api/placeholder/90/90",
        teamAScore: matchData?.teamA?.score || 0,
        teamBScore: matchData?.teamB?.score || 0,
        teamAPenaltyScore: penaltyData?.homeGoals || 0,
        teamBPenaltyScore: penaltyData?.awayGoals || 0,
        teamAKitColor: matchData?.teamAKitColor || "#1e1e1e",
        teamBKitColor: matchData?.teamBKitColor || "#1e1e1e"
    };

    const rawLogoShape = displaySettings?.displaySettings?.logoShape || displaySettings?.logoShape || "round";
    const logoShape = rawLogoShape === 'round' ? 'round' : rawLogoShape;

    // Hàm collect logos giống ScoreboardAbove
    const collectLogosForPosition = (targetPosition) => {
        const allLogos = [];

        if (sponsors?.sponsors?.url_logo && sponsors.sponsors.url_logo.length > 0) {
            sponsors.sponsors.url_logo.forEach((logo, index) => {
                const position = sponsors.sponsors?.position && sponsors.sponsors.position[index]
                    ? (Array.isArray(sponsors.sponsors.position[index]) ? sponsors.sponsors.position[index][0] : sponsors.sponsors.position[index])
                    : 'top-left';
                const behavior = sponsors.sponsors?.behavior;
                const typeDisplay = sponsors.sponsors?.type_display && sponsors.sponsors.type_display[index]
                    ? sponsors.sponsors.type_display[index]
                    : 'square';

                if (position === targetPosition && (!behavior || behavior === 'add')) {
                    allLogos.push({ url: getFullLogoUrl(logo), alt: 'Sponsor', type: 'sponsor', typeDisplay });
                }
            });
        }

        if (organizing?.organizing?.url_logo && organizing.organizing.url_logo.length > 0) {
            organizing.organizing.url_logo.forEach((logo, index) => {
                const position = organizing.organizing?.position && organizing.organizing.position[index]
                    ? (Array.isArray(organizing.organizing.position[index]) ? organizing.organizing.position[index][0] : organizing.organizing.position[index])
                    : 'bottom-left';
                const behavior = organizing.organizing?.behavior;
                const typeDisplay = organizing.organizing?.type_display && organizing.organizing.type_display[index]
                    ? organizing.organizing.type_display[index]
                    : 'square';

                if (position === targetPosition && (!behavior || behavior === 'add')) {
                    allLogos.push({ url: getFullLogoUrl(logo), alt: 'Organizing', type: 'organizing', typeDisplay });
                }
            });
        }

        if (mediaPartners?.mediaPartners?.url_logo && mediaPartners.mediaPartners.url_logo.length > 0) {
            mediaPartners.mediaPartners.url_logo.forEach((logo, index) => {
                const position = mediaPartners.mediaPartners?.position && mediaPartners.mediaPartners.position[index]
                    ? (Array.isArray(mediaPartners.mediaPartners.position[index]) ? mediaPartners.mediaPartners.position[index][0] : mediaPartners.mediaPartners.position[index])
                    : 'bottom-right';
                const behavior = mediaPartners.mediaPartners?.behavior;
                const typeDisplay = mediaPartners.mediaPartners?.type_display && mediaPartners.mediaPartners.type_display[index]
                    ? mediaPartners.mediaPartners.type_display[index]
                    : 'square';

                if (position === targetPosition && (!behavior || behavior === 'add')) {
                    allLogos.push({ url: getFullLogoUrl(logo), alt: 'Media Partner', type: 'media', typeDisplay });
                }
            });
        }

        return allLogos;
    };

    // Lấy tournament logo
    const tournamentLogoUrl = tournamentLogo?.url_logo && tournamentLogo.url_logo.length > 0
        ? getFullLogoUrl(tournamentLogo.url_logo[0])
        : null;

    return (
        <div className="w-full h-screen relative overflow-hidden">
            {/* Main wrapper container với responsive scaling */}
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-4 md:pb-6 lg:pb-8">
                
                {/* Combined container cho logo và scoreboard */}
                <div className="combined-container relative flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
                    
                    {/* ScoLiv Logo - Positioned relative to container */}
                    <div className="self-start ml-2 sm:ml-4 md:ml-6 lg:ml-8">
                        <img
                            src="/images/basic/ScoLivLogo.png"
                            alt="ScoLiv"
                            className="logo-image w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
                            onError={(e) => {
                                e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="%23007acc"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="white" font-weight="bold">ScoLiv</text></svg>`;
                            }}
                        />
                    </div>

                    {/* Main Penalty Scoreboard */}
                    <div className="bg-transparent rounded-lg shadow-2xl p-2 sm:p-3 md:p-4 min-w-[350px] sm:min-w-[420px] md:min-w-[500px] lg:min-w-[550px] xl:min-w-[600px] max-w-[98vw] sm:max-w-[95vw] md:max-w-[90vw]">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-full px-2 gap-0">
                                {/* Logo team A */}
                                <DisplayLogo
                                    logos={[currentData.teamALogo]}
                                    alt={currentData.teamAName}
                                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                                    type_play={logoShape}
                                />

                                {/* Score + team A name */}
                                <div className="flex items-center gap-0">
                                    <div className="score-box bg-yellow-400 text-black font-bold px-2 py-0.5 text-center text-sm sm:text-base md:text-lg lg:text-xl min-w-[1.6rem] sm:min-w-[1.8rem] md:min-w-[2rem] lg:min-w-[2.2rem]"
                                        style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}>
                                        {currentData.teamAScore}
                                    </div>
                                    <div className="bg-red-500 text-white font-bold px-2 py-0.5 text-center text-xs sm:text-sm md:text-base lg:text-lg min-w-[1.4rem] sm:min-w-[1.6rem] md:min-w-[1.8rem] lg:min-w-[2rem]">
                                        ({currentData.teamAPenaltyScore})
                                    </div>
                                    <div className="flex flex-col items-center w-[90px] sm:w-[110px] md:w-[130px] lg:w-[140px] xl:w-[150px]">
                                        <div className="bg-blue-600 text-white px-2 py-0.5 font-semibold whitespace-nowrap text-center truncate w-full text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm">
                                            {currentData.teamAName}
                                        </div>
                                        <div className="bg-gray-900 relative flex items-center justify-center gap-1 w-full h-2 sm:h-2.5 md:h-3">
                                            {/* Penalty dots cho Team A */}
                                            {Array.from({ length: Math.max(maxRounds, 10) }, (_, i) => {
                                                const round = i + 1;
                                                const result = penaltyHistory[round]?.teamA;
                                                return (
                                                    <div
                                                        key={round}
                                                        className={`rounded-full w-1.5 h-1.5 sm:w-2 sm:h-2 ${
                                                            result === 'goal' 
                                                                ? 'bg-green-400' 
                                                                : result === 'miss' 
                                                                ? 'bg-red-500'
                                                                : 'bg-white bg-opacity-50'
                                                        }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Penalty indicator */}
                                <div className="bg-black text-white px-2 py-1 font-bold whitespace-nowrap text-xs sm:text-sm md:text-base">
                                    PENALTY
                                </div>

                                {/* Score + team B name */}
                                <div className="flex items-center gap-0">
                                    <div className="flex flex-col items-center w-[90px] sm:w-[110px] md:w-[130px] lg:w-[140px] xl:w-[150px]">
                                        <div className="bg-blue-600 text-white px-2 py-0.5 font-semibold whitespace-nowrap text-center truncate w-full text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm">
                                            {currentData.teamBName}
                                        </div>
                                        <div className="bg-gray-900 relative flex items-center justify-center gap-1 w-full h-2 sm:h-2.5 md:h-3">
                                            {/* Penalty dots cho Team B */}
                                            {Array.from({ length: Math.max(maxRounds, 10) }, (_, i) => {
                                                const round = i + 1;
                                                const result = penaltyHistory[round]?.teamB;
                                                return (
                                                    <div
                                                        key={round}
                                                        className={`rounded-full w-1.5 h-1.5 sm:w-2 sm:h-2 ${
                                                            result === 'goal' 
                                                                ? 'bg-green-400' 
                                                                : result === 'miss' 
                                                                ? 'bg-red-500'
                                                                : 'bg-white bg-opacity-50'
                                                        }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="bg-red-500 text-white font-bold px-2 py-0.5 text-center text-xs sm:text-sm md:text-base lg:text-lg min-w-[1.4rem] sm:min-w-[1.6rem] md:min-w-[1.8rem] lg:min-w-[2rem]">
                                        ({currentData.teamBPenaltyScore})
                                    </div>
                                    <div className="score-box bg-yellow-400 text-black font-bold px-2 py-0.5 text-center text-sm sm:text-base md:text-lg lg:text-xl min-w-[1.6rem] sm:min-w-[1.8rem] md:min-w-[2rem] lg:min-w-[2.2rem]"
                                        style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)' }}>
                                        {currentData.teamBScore}
                                    </div>
                                </div>

                                {/* Logo team B */}
                                <DisplayLogo
                                    logos={[currentData.teamBLogo]}
                                    alt={currentData.teamBName}
                                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                                    type_play={logoShape}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .combined-container {
                    transform-origin: center bottom;
                    transform: scale(0.6);
                }
                
                .score-box {
                }
                
                /* Responsive scaling */
                @media (min-width: 360px) {
                    .combined-container {
                        transform: scale(0.7);
                    }
                }
                
                @media (min-width: 480px) {
                    .combined-container {
                        transform: scale(0.8);
                    }
                }
                
                @media (min-width: 768px) {
                    .combined-container {
                        transform: scale(0.9);
                    }
                }
                
                @media (min-width: 1024px) {
                    .combined-container {
                        transform: scale(1);
                    }
                }

                /* Landscape Mobile orientation */
                @media (max-height: 500px) and (orientation: landscape) {
                    .combined-container {
                        transform: scale(0.65);
                    }
                }
            `}</style>
        </div>
    );
};

export default PenaltyScoreboard;
