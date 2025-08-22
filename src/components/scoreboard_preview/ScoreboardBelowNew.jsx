import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import ScoreboardBelowType1 from './scoreboard_below_types/ScoreboardBelowType1';
import ScoreboardBelowType2 from './scoreboard_below_types/ScoreboardBelowType2';
import ScoreboardBelowType3 from './scoreboard_below_types/ScoreboardBelowType3';
import ScoreboardBelowType4 from './scoreboard_below_types/ScoreboardBelowType4';
import ScoreboardBelowType5 from './scoreboard_below_types/ScoreboardBelowType5';

const ScoreboardBelowNew = ({ type = 1 }) => {
    const {
        matchData,
        futsalErrors,
        displaySettings,
        marqueeData,
        socketConnected,
        tournamentLogo
    } = usePublicMatch();

    const [currentType, setCurrentType] = useState(type);

    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: matchData?.teamA?.logo || "/images/basic/logo-skin4.png",
        teamBLogo: matchData?.teamB?.logo || "/images/basic/logo-skin4.png",
        teamAScore: matchData?.teamA?.score || 0,
        teamBScore: matchData?.teamB?.score || 0,
        teamAScorers: matchData?.teamA?.teamAScorers || [],
        teamBScorers: matchData?.teamB?.teamBScorers || [],
        teamAFouls: futsalErrors?.teamA || 0,
        teamBFouls: futsalErrors?.teamB || 0,
        matchTime: matchData?.matchTime || "00:00",
        period: matchData?.period || "Chưa bắt đầu",
        status: matchData?.status || "waiting",
        teamAKitColor: matchData?.teamA?.teamAKitColor || "#FF0000",
        teamBKitColor: matchData?.teamB?.teamBKitColor || "#0000FF",
        teamA2KitColor: matchData?.teamA?.teamA2KitColor || "#FF0000",
        teamB2KitColor: matchData?.teamB?.teamB2KitColor || "#0000FF",
        leagueLogo: "/images/basic/logo-skin4.png",
        typeMatch: matchData?.typeMatch || "soccer"
    };

    const [showScrollingText, setShowScrollingText] = useState(false);

    const scrollData = {
        text: marqueeData?.text || "TRỰC TIẾP BÓNG ĐÁ",
        color: marqueeData?.color === 'white-black' ? '#FFFFFF' :
            marqueeData?.color === 'black-white' ? '#000000' :
                marqueeData?.color === 'white-blue' ? '#FFFFFF' :
                    marqueeData?.color === 'white-red' ? '#FFFFFF' :
                        marqueeData?.color === 'white-green' ? '#FFFFFF' : "#FFFFFF",
        bgColor: marqueeData?.color === 'white-black' ? '#000000' :
            marqueeData?.color === 'black-white' ? '#FFFFFF' :
                marqueeData?.color === 'white-blue' ? '#2563eb' :
                    marqueeData?.color === 'white-red' ? '#dc2626' :
                        marqueeData?.color === 'white-green' ? '#16a34a' : "#FF0000",
        repeat: 1,
        mode: marqueeData?.mode || 'khong',
        interval: marqueeData?.mode === 'moi-2' ? 120000 :
            marqueeData?.mode === 'moi-5' ? 300000 :
                marqueeData?.mode === 'lien-tuc' ? 30000 : 0
    };

    const showMatchTime = currentData.status === 'live' || currentData.status === 'pause';
    const logoShape = displaySettings?.logoShape || "square";

    useEffect(() => {
        if (displaySettings?.selectedSkin) {
            setCurrentType(displaySettings.selectedSkin);
        }
    }, [displaySettings?.selectedSkin]);

    useEffect(() => {
        let timer;

        if (scrollData.mode === 'khong') {
            setShowScrollingText(false);
        } else if (scrollData.mode === 'lien-tuc') {
            setShowScrollingText(true);
            timer = setInterval(() => {
                setShowScrollingText(false);
                setTimeout(() => setShowScrollingText(true), 2000);
            }, scrollData.interval);
        } else if (scrollData.mode === 'moi-2' || scrollData.mode === 'moi-5') {
            timer = setInterval(() => {
                setShowScrollingText(true);
                setTimeout(() => setShowScrollingText(false), 5000);
            }, scrollData.interval);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [scrollData.mode, scrollData.interval]);

    const renderScoreboard = () => {
        const props = {
            currentData,
            logoShape,
            showMatchTime,
            tournamentLogo
        };

        switch (currentType) {
            case 1: return <ScoreboardBelowType1 {...props} />;
            case 2: return <ScoreboardBelowType2 {...props} />;
            case 3: return <ScoreboardBelowType3 {...props} />;
            case 4: return <ScoreboardBelowType4 {...props} />;
            case 5: return <ScoreboardBelowType5 {...props} />;
            default: return <ScoreboardBelowType1 {...props} />;
        }
    };

    return (
        <div className="w-full h-screen relative overflow-hidden">
            {/* Container for all elements */}
            <div className="w-full h-full relative bg-transparent">
                {/* ScoLiv Logo*/}
                <div className="absolute bottom-10 left-1 sm:left-2 z-40">
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="ScoLiv"
                        className="w-24 h-24 sm:w-72 sm:h-72 object-contain object-bottom"
                    />
                </div>

                {/* Main Scoreboard */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="scoreboard-main bg-transparent">
                        {renderScoreboard()}
                    </div>
                </div>

                {/* Commentator Display - Center - Positioned closer to marquee */}
                {currentData.commentator && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30
                        md:bottom-3
                        sm:bottom-2
                        max-[480px]:bottom-1
                        max-[360px]:bottom-1">
                        <div className="text-white px-3 py-1
                            md:px-4 md:py-2
                            sm:px-3 sm:py-1
                            max-[480px]:px-2 max-[480px]:py-1">
                            <span className="text-sm font-bold
                                md:text-lg
                                sm:text-base
                                max-[480px]:text-xs
                                max-[360px]:text-[10px]">
                                BLV: {currentData.commentator}
                            </span>
                        </div>
                    </div>
                )}

                {/* Scrolling text */}
                {scrollData.mode !== 'khong' && showScrollingText && (
                    <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden" style={{ backgroundColor: scrollData.bgColor }}>
                        <div
                            className="animate-scroll whitespace-nowrap py-2 text-sm font-semibold"
                            style={{
                                color: scrollData.color,
                                animation: 'scroll 30s linear infinite'
                            }}
                        >
                            {Array(scrollData.repeat).fill(scrollData.text).join(' • ')}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                /* Uniform scaling for mobile - like image zoom while staying centered bottom */
                .scoreboard-main {
                    transform-origin: bottom center;
                }

                @media (max-width: 768px) {
                    .scoreboard-main {
                        transform: scale(0.75);
                    }
                }

                @media (max-width: 480px) {
                    .scoreboard-main {
                        transform: scale(0.6);
                    }
                }

                @media (max-width: 360px) {
                    .scoreboard-main {
                        transform: scale(0.5);
                    }
                }

                /* Logo styling to prevent corner cutting */
                .logo-container {
                    border-radius: 50%;
                    overflow: hidden;
                    background: white;
                    padding: 2px;
                }
            `}</style>
        </div>
    );
};

export default ScoreboardBelowNew;
