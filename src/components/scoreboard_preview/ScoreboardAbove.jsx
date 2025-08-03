import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';
import { getFullLogoUrl, getFullLogoUrls } from '../../utils/logoUtils';

const ScoreboardAbove = ({
    type = 1
}) => {
    const {
        matchData,
        displaySettings,
        marqueeData,
        penaltyData,
        socketConnected,
        sponsors,
        organizing,
        mediaPartners,
        tournamentLogo
    } = usePublicMatch();
    console.log("Giá trị display Setting là:", displaySettings);
    const [currentType, setCurrentType] = useState(type);
    console.log("Giá trị organizing là:", organizing);
    console.log("Giá trị sponsors là:", sponsors);
    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: getFullLogoUrl(matchData?.teamA?.logo) || "/api/placeholder/90/90",
        teamBLogo: getFullLogoUrl(matchData?.teamB?.logo) || "/api/placeholder/90/90",
        teamAScore: matchData?.teamA?.score || 0,
        teamBScore: matchData?.teamB?.score || 0,
        matchTime: matchData?.matchTime || "00:00",
        period: matchData?.period || "Chưa bắt đầu",
        status: matchData?.status || "waiting",
        teamAKitColor: matchData?.teamAKitColor || "#FF0000", 
        teamBKitColor: matchData?.teamBKitColor || "#0000FF", 
        leagueLogo: "/api/placeholder/40/40"
    };

    const rawLogoShape = displaySettings?.logoShape || "round";
    const logoShape = rawLogoShape === 'round' ? 'circle' : rawLogoShape;

    if (displaySettings?.logoShape !== 'round') {
        console.log('🔧 [ScoreboardAbove] Logo shape changed to:', rawLogoShape, '-> mapped to:', logoShape);
    }

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
        repeat: 3,
        mode: marqueeData?.mode || 'khong',
        interval: marqueeData?.mode === 'moi-2' ? 120000 : 
                  marqueeData?.mode === 'moi-5' ? 300000 : 
                  marqueeData?.mode === 'lien-tuc' ? 30000 : 0 
    };

    const showMatchTime = currentData.status === 'live' || currentData.status === 'pause';

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

    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    // Function để collect logos theo position
    const collectLogosForPosition = (targetPosition) => {
        const allLogos = [];

        // Collect sponsors (đã có sponsors.sponsors structure)
        if (sponsors?.sponsors?.url_logo && sponsors.sponsors.url_logo.length > 0) {
            sponsors.sponsors.url_logo.forEach((logo, index) => {
                const position = sponsors.sponsors?.position && sponsors.sponsors.position[index]
                    ? (Array.isArray(sponsors.sponsors.position[index]) ? sponsors.sponsors.position[index][0] : sponsors.sponsors.position[index])
                    : 'top-left'; // default position
                const behavior = sponsors.sponsors?.behavior;
                const typeDisplay = sponsors.sponsors?.type_display && sponsors.sponsors.type_display[index]
                    ? sponsors.sponsors.type_display[index]
                    : 'square'; // default vuông

                if (position === targetPosition && (!behavior || behavior === 'add')) {
                    allLogos.push({ url: getFullLogoUrl(logo), alt: 'Sponsor', type: 'sponsor', typeDisplay });
                }
            });
        }

        // Collect organizing (cần thêm organizing.organizing structure giống sponsors)
        if (organizing?.organizing?.url_logo && organizing.organizing.url_logo.length > 0) {
            organizing.organizing.url_logo.forEach((logo, index) => {
                const position = organizing.organizing?.position && organizing.organizing.position[index]
                    ? (Array.isArray(organizing.organizing.position[index]) ? organizing.organizing.position[index][0] : organizing.organizing.position[index])
                    : 'bottom-left'; // default position
                const behavior = organizing.organizing?.behavior;
                const typeDisplay = organizing.organizing?.type_display && organizing.organizing.type_display[index]
                    ? organizing.organizing.type_display[index]
                    : 'square'; // default vuông

                if (position === targetPosition && (!behavior || behavior === 'add')) {
                    allLogos.push({ url: getFullLogoUrl(logo), alt: 'Organizing', type: 'organizing', typeDisplay });
                }
            });
        }

        // Collect media partners (cần thêm mediaPartners.mediaPartners structure giống sponsors)
        if (mediaPartners?.mediaPartners?.url_logo && mediaPartners.mediaPartners.url_logo.length > 0) {
            mediaPartners.mediaPartners.url_logo.forEach((logo, index) => {
                const position = mediaPartners.mediaPartners?.position && mediaPartners.mediaPartners.position[index]
                    ? (Array.isArray(mediaPartners.mediaPartners.position[index]) ? mediaPartners.mediaPartners.position[index][0] : mediaPartners.mediaPartners.position[index])
                    : 'bottom-right'; // default position
                const behavior = mediaPartners.mediaPartners?.behavior;
                const typeDisplay = mediaPartners.mediaPartners?.type_display && mediaPartners.mediaPartners.type_display[index]
                    ? mediaPartners.mediaPartners.type_display[index]
                    : 'square'; // default vuông

                if (position === targetPosition && (!behavior || behavior === 'add')) {
                    allLogos.push({ url: getFullLogoUrl(logo), alt: 'Media Partner', type: 'media', typeDisplay });
                }
            });
        }

        return allLogos;
    };

    // Function render logos
    const renderLogos = (allLogos) => {
        if (allLogos.length === 0) return null;

        // Helper function để convert typeDisplay thành shape
        const getLogoShape = (typeDisplay) => {
            switch (typeDisplay) {
                case 'round': return 'circle';
                case 'hexagonal': return 'hexagon';
                case 'square':
                default: return 'square';
            }
        };

        if (displaySettings?.rotateDisplay && allLogos.length > 1) {
            // Slide mode - luân phiên hiển thị 3 logo 1 lần
            return (
                <DisplayLogo
                    logos={allLogos.map(logo => logo.url)}
                    alt="Sponsors & Partners"
                    className="w-16 h-16"
                    type_play={logoShape}
                    slideMode={true}
                    maxVisible={3}
                    slideInterval={3000}
                />
            );
        } else {
            // Hiển thị tất cả logos cùng lúc với individual shapes
            return (
                <div className="flex gap-2 flex-wrap max-w-sm">
                    {allLogos.map((logo, index) => (
                        <div key={index} className="flex-shrink-0">
                            <DisplayLogo
                                logos={[logo.url]}
                                alt={logo.alt}
                                className="w-14 h-14"
                                type_play={getLogoShape(logo.typeDisplay)}
                                slideMode={false}
                            />
                        </div>
                    ))}
                </div>
            );
        }
    };

    const renderScoreboardType1 = () => (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full px-2 gap-0">
                <DisplayLogo 
                    logos={[currentData.teamALogo]} 
                    alt={currentData.teamAName} 
                    className="w-14 h-14" 
                    type_play={logoShape}
                />

                <div className="flex items-center gap-0">
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}>
                        {currentData.teamAScore}
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

                {showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                        {currentData.matchTime}
                    </div>
                )}

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
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)' }}>
                        {currentData.teamBScore}
                    </div>
                </div>

                <DisplayLogo 
                    logos={[currentData.teamBLogo]} 
                    alt={currentData.teamBName} 
                    className="w-14 h-14" 
                    type_play={logoShape}
                />
            </div>

            {!showMatchTime && (
                <div className="text-center mt-2">
                    <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded animate-pulse">
                        ● TRỰC TIẾP
                    </span>
                </div>
            )}
        </div>
    );

    const renderScoreboardType2 = () => (
        <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center items-center m-0 p-0">
                <div
                    className="flex items-center justify-center relative z-10 h-8 rounded-md m-0 p-0 gap-0"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        overflow: 'hidden',
                        width: showMatchTime ? '285px' : '265px',
                    }}
                >
                    <div
                        className="text-sm font-semibold flex items-center justify-center truncate m-0 p-0 relative"
                        style={{
                            width: '120px',
                            height: '100%',
                            fontSize: 'clamp(10px, 4vw, 16px)',
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAName}
                    </div>

                    <div
                        className="text-white font-extrabold text-2xl text-center m-0 p-0"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.5rem',
                            height: '100%',
                            lineHeight: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAScore}
                    </div>

                    {showMatchTime && (
                        <div className="bg-yellow-400 text-black text-xs font-bold rounded m-0"
                            style={{
                                padding: '0 4px',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {currentData.matchTime}
                        </div>
                    )}

                    <div
                        className="text-white font-extrabold text-2xl text-center m-0 p-0"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.5rem',
                            height: '100%',
                            lineHeight: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBScore}
                    </div>

                    <div
                        className="text-sm font-semibold flex items-center justify-center truncate m-0 p-0 relative"
                        style={{
                            width: '120px',
                            height: '100%',
                            fontSize: 'clamp(10px, 4vw, 16px)',
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBName}
                    </div>
                </div>

                <div
                    className="absolute z-20"
                    style={{
                        left: `calc(50% - ${showMatchTime ? '168px' : '158px'})`,
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

                <div
                    className="absolute z-20"
                    style={{
                        right: `calc(50% - ${showMatchTime ? '168px' : '158px'})`,
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

            {!showMatchTime && (
                <div className="text-center mt-2">
                    <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded animate-pulse">
                        ● TRỰC TIẾP
                    </span>
                </div>
            )}
        </div>
    );

    const renderScoreboardType3 = () => (
        <div className="flex items-center justify-between w-full px-2">
            <DisplayLogo 
                logos={[currentData.teamALogo]} 
                alt={currentData.teamAName} 
                className="w-12 h-12" 
                type_play={logoShape}
            />

            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1 shadow-xl">
                <div className="flex items-center">
                    <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate">
                        {currentData.teamAName}
                    </div>
                    <div
                        className="w-1 h-6 ml-1 rounded-full"
                        style={{ backgroundColor: currentData.teamAKitColor }}
                    />
                </div>

                <div className="mx-4 flex flex-col items-center">
                    <div className="flex items-center bg-white/95 px-4 py-1 rounded-md shadow-sm">
                        <span className="font-bold text-xl text-gray-900">{currentData.teamAScore}</span>
                        <span className="mx-2 text-gray-400 font-light">:</span>
                        <span className="font-bold text-xl text-gray-900">{currentData.teamBScore}</span>
                    </div>
                    {showMatchTime && (
                        <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-medium rounded-sm mt-1">
                            {currentData.matchTime}
                        </div>
                    )}
                    {!showMatchTime && (
                        <div className="bg-green-600 text-white px-2 py-0.5 text-[10px] font-medium rounded-sm mt-1 animate-pulse whitespace-nowrap">
                            ● TRỰC TIẾP
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <div
                        className="w-1 h-6 mr-1 rounded-full"
                        style={{ backgroundColor: currentData.teamBKitColor }}
                    />
                    <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate text-right">
                        {currentData.teamBName}
                    </div>
                </div>
            </div>

            <DisplayLogo 
                logos={[currentData.teamBLogo]} 
                alt={currentData.teamBName} 
                className="w-12 h-12" 
                type_play={logoShape}
            />
        </div>
    );

    const renderScoreboardType4 = () => (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full">
                <DisplayLogo 
                    logos={[currentData.teamALogo]} 
                    alt={currentData.teamAName} 
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" 
                    type_play={logoShape}
                />

                <div className="flex items-center z-20">
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -mr-6"
                        style={{
                            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
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
                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center">
                            {currentData.teamAScore}
                        </div>

                        <div className="mx-2 sm:mx-3 relative" style={{ top: '-6px' }}>
                            <DisplayLogo
                                logos={[currentData.leagueLogo]}
                                alt="League"
                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0"
                                type_play={logoShape}
                            />
                        </div>

                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center">
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
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
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
                />
            </div>
        </div>
    );

    const renderScoreboard = () => {
        switch (currentType) {
            case 1: return renderScoreboardType1();
            case 2: return renderScoreboardType2();
            case 3: return renderScoreboardType3();
            case 4: return renderScoreboardType4();
            default: return renderScoreboardType1();
        }
    };

    return (
        <div className="w-full h-screen relative overflow-hidden">
            <div className="w-full h-full relative bg-transparent scoreboard-container">
                {/* Top Left Position */}
                <div className="absolute top-4 left-4 z-40 corner-logo top-left">
                    {renderLogos(collectLogosForPosition('top-left'))}
                </div>

                {/* Tournament Logo - Top Left (if no sponsors) */}
                {collectLogosForPosition('top-left').length === 0 && tournamentLogo?.url_logo && tournamentLogo.url_logo.length > 0 && (
                    <div className="absolute top-4 left-4 z-40 corner-logo top-left">
                        <DisplayLogo
                            logos={getFullLogoUrls(tournamentLogo.url_logo)}
                            alt="Tournament"
                            className="w-16 h-16"
                            type_play={logoShape}
                        />
                    </div>
                )}

                {/* Main Scoreboard - Top Right */}
                <div className="absolute top-4 right-4 z-30 scoreboard-position">
                    <div className="scoreboard-main bg-transparent rounded-lg shadow-2xl">
                        {renderScoreboard()}
                    </div>
                </div>

                {/* Bottom Left Position */}
                <div className="absolute bottom-4 left-4 z-40 corner-logo bottom-left">
                    {renderLogos(collectLogosForPosition('bottom-left'))}
                </div>

                {/* Bottom Right Position */}
                <div className="absolute bottom-4 right-4 z-40 corner-logo bottom-right">
                    {renderLogos(collectLogosForPosition('bottom-right'))}
                </div>

                {/* Scrolling Text */}
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

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                .scoreboard-main {
                    transform-origin: top right;
                }

                .corner-logo {
                    transform-origin: center;
                }

                .scoreboard-position {
                    transform-origin: top right;
                }

                /* Tablet */
                @media (max-width: 768px) {
                    .scoreboard-main {
                        transform: scale(0.75);
                    }
                    .corner-logo {
                        transform: scale(0.75);
                    }
                    .corner-logo.top-left {
                        top: 12px;
                        left: 12px;
                    }
                    .corner-logo.bottom-left {
                        bottom: 12px;
                        left: 12px;
                    }
                    .corner-logo.bottom-right {
                        bottom: 12px;
                        right: 12px;
                    }
                    .scoreboard-position {
                        top: 12px;
                        right: 12px;
                    }
                }

                /* Mobile */
                @media (max-width: 480px) {
                    .scoreboard-main {
                        transform: scale(0.6);
                    }
                    .corner-logo {
                        transform: scale(0.6);
                    }
                    .corner-logo.top-left {
                        top: 8px;
                        left: 8px;
                    }
                    .corner-logo.bottom-left {
                        bottom: 8px;
                        left: 8px;
                    }
                    .corner-logo.bottom-right {
                        bottom: 8px;
                        right: 8px;
                    }
                    .scoreboard-position {
                        top: 8px;
                        right: 8px;
                    }
                }

                /* Small Mobile */
                @media (max-width: 360px) {
                    .scoreboard-main {
                        transform: scale(0.5);
                    }
                    .corner-logo {
                        transform: scale(0.5);
                    }
                    .corner-logo.top-left {
                        top: 6px;
                        left: 6px;
                    }
                    .corner-logo.bottom-left {
                        bottom: 6px;
                        left: 6px;
                    }
                    .corner-logo.bottom-right {
                        bottom: 6px;
                        right: 6px;
                    }
                    .scoreboard-position {
                        top: 6px;
                        right: 6px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ScoreboardAbove;
