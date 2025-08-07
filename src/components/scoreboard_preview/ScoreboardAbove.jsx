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

    const [currentType, setCurrentType] = useState(type);
    console.log("Giá trị của matchData.TeamAKitColor là:", matchData);

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
        teamAKitColor: matchData?.teamA?.teamAKitColor || "#FF0000",
        teamA2KitColor: matchData?.teamA?.teamA2KitColor || "#FF0000",
        teamBKitColor: matchData?.teamB?.teamBKitColor || "#0000FF",
        teamB2KitColor: matchData?.teamB?.teamB2KitColor || "#FF0000",
        leagueLogo: "/api/placeholder/40/40"
    };

    const rawLogoShape = displaySettings?.displaySettings?.logoShape || displaySettings?.logoShape || "round";
    const logoShape = rawLogoShape === 'round' ? 'round' : rawLogoShape;

    if (displaySettings?.displaySettings?.logoShape !== 'round') {
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

    const renderLogos = (allLogos) => {
        if (allLogos.length === 0) return null;

        const getLogoShape = (typeDisplay) => {
            switch (typeDisplay) {
                case 'round': return 'round';
                case 'hexagonal': return 'hexagon';
                case 'square':
                default: return 'square';
            }
        };

        if ((displaySettings?.displaySettings?.rotateDisplay || displaySettings?.rotateDisplay) && allLogos.length > 1) {
            return (
                <DisplayLogo
                    logos={allLogos.map(logo => logo.url)}
                    alt="Sponsors & Partners"
                    className="w-full h-full"
                    type_play={logoShape}
                    slideMode={true}
                    maxVisible={3}
                    slideInterval={5000}
                />
            );
        } else {
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

                <div className="flex items-center">
                    <div
                        className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}
                    >
                        {currentData.teamAScore}
                    </div>

                    <div className="flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamAName}
                        </div>

                        <div className="flex w-full h-3">
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

                {showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                        {currentData.matchTime}
                    </div>
                )}

                <div className="flex items-center">
                    <div className="flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamBName}
                        </div>

                        <div className="flex w-full h-3">
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
            <div className="relative w-full flex justify-center items-center max-w-sm">
                {/* Logo A - Positioned outside left */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30">
                    <DisplayLogo
                        logos={[currentData.teamALogo]}
                        alt={currentData.teamAName}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        style={{
                            borderColor: currentData.teamAKitColor,
                            borderRadius: logoShape === 'round' ? '50%' : logoShape === 'hexagon' ? '0' : '8px',
                        }}
                        type_play={logoShape}
                    />
                </div>
    
                {/* Main scoreboard container */}
                <div
                    className="flex items-center justify-center relative z-10 h-8 sm:h-9 rounded-md mx-14 sm:mx-16"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        width: showMatchTime ? '250px' : '230px',
                        maxWidth: showMatchTime ? '250px' : '230px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Tên đội A */}
                    <div
                        className="flex flex-col items-start justify-center truncate"
                        style={{
                            width: '90px',
                            height: '100%',
                            fontSize: 'clamp(10px, 3.5vw, 14px)',
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        <span className="w-full text-xs sm:text-sm font-semibold text-center leading-[1.2] px-1 sm:px-2">
                            {currentData.teamAName}
                        </span>
                        <div className="flex w-full h-[3px] sm:h-[4px] px-1 sm:px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamAKitColor }} />
                            <div className="flex-1" style={{ backgroundColor: currentData.teamA2KitColor }} />
                        </div>
                    </div>
    
                    {/* Tỉ số A */}
                    <div
                        className="text-white font-extrabold text-xl sm:text-2xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.2rem',
                            height: '100%',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAScore}
                    </div>
    
                    {/* Thời gian */}
                    {showMatchTime && (
                        <div
                            className="bg-yellow-400 text-black text-xs font-bold flex items-center justify-center rounded mx-1 sm:mx-2"
                            style={{
                                padding: '0 6px',
                                height: '70%',
                                minWidth: '40px',
                            }}
                        >
                            {currentData.matchTime}
                        </div>
                    )}
    
                    {/* Tỉ số B */}
                    <div
                        className="text-white font-extrabold text-xl sm:text-2xl text-center flex items-center justify-center"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.2rem',
                            height: '100%',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBScore}
                    </div>
    
                    {/* Tên đội B */}
                    <div
                        className="flex flex-col items-end justify-center truncate"
                        style={{
                            width: '90px',
                            height: '100%',
                            fontSize: 'clamp(10px, 3.5vw, 14px)',
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        <span className="w-full text-xs sm:text-sm font-semibold text-center leading-[1.2] px-1 sm:px-2">
                            {currentData.teamBName}
                        </span>
                        <div className="flex w-full h-[3px] sm:h-[4px] px-1 sm:px-2">
                            <div className="flex-1" style={{ backgroundColor: currentData.teamBKitColor }} />
                            <div className="flex-1" style={{ backgroundColor: currentData.teamB2KitColor }} />
                        </div>
                    </div>
                </div>
    
                {/* Logo B - Positioned outside right */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
                    <DisplayLogo
                        logos={[currentData.teamBLogo]}
                        alt={currentData.teamBName}
                        className="w-12 h-12 sm:w-14 sm:h-14"
                        style={{
                            borderColor: currentData.teamBKitColor,
                            borderRadius: logoShape === 'round' ? '50%' : logoShape === 'hexagon' ? '0' : '8px',
                        }}
                        type_play={logoShape}
                    />
                </div>
            </div>
    
            {/* LIVE indicator */}
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
        <div className="flex items-center justify-center w-full px-2 max-w-sm mx-auto">
            {/* Logo đội A */}
            <div className="flex-shrink-0 mr-2 sm:mr-3">
                <DisplayLogo
                    logos={[currentData.teamALogo]}
                    alt={currentData.teamAName}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    type_play={logoShape}
                />
            </div>

            {/* Container chính */}
            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 shadow-xl flex-1">
                {/* Thông tin đội A */}
                <div className="flex flex-col items-center mr-2 sm:mr-3">
                    <div className="text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gray-800/80 rounded-md w-[70px] sm:w-[90px] truncate text-center">
                        {currentData.teamAName}
                    </div>
                    <div className="flex w-full h-1 mt-1 rounded-full overflow-hidden">
                        <div
                            className="flex-1"
                            style={{ backgroundColor: currentData.teamAKitColor }}
                        />
                        <div
                            className="flex-1"
                            style={{ backgroundColor: currentData.teamA2KitColor }}
                        />
                    </div>
                </div>

                {/* Tỉ số và thời gian */}
                <div className="flex flex-col items-center mx-2 sm:mx-3">
                    <div className="flex items-center bg-white/95 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-sm">
                        <span className="font-bold text-lg sm:text-xl text-gray-900">{currentData.teamAScore}</span>
                        <span className="mx-2 sm:mx-3 text-gray-400 font-light text-base sm:text-lg">:</span>
                        <span className="font-bold text-lg sm:text-xl text-gray-900">{currentData.teamBScore}</span>
                    </div>
                    {showMatchTime && (
                        <div className="bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-sm mt-1 sm:mt-2 whitespace-nowrap">
                            {currentData.matchTime}
                        </div>
                    )}
                    {!showMatchTime && (
                        <div className="bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] font-medium rounded-sm mt-1 sm:mt-2 animate-pulse whitespace-nowrap">
                            ● TRỰC TIẾP
                        </div>
                    )}
                </div>

                {/* Thông tin đội B */}
                <div className="flex flex-col items-center ml-2 sm:ml-3">
                    <div className="text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-gray-800/80 rounded-md w-[70px] sm:w-[90px] truncate text-center">
                        {currentData.teamBName}
                    </div>
                    <div className="flex w-full h-1 mt-1 rounded-full overflow-hidden">
                        <div
                            className="flex-1"
                            style={{ backgroundColor: currentData.teamBKitColor }}
                        />
                        <div
                            className="flex-1"
                            style={{ backgroundColor: currentData.teamB2KitColor }}
                        />
                    </div>
                </div>
            </div>

            {/* Logo đội B */}
            <div className="flex-shrink-0 ml-2 sm:ml-3">
                <DisplayLogo
                    logos={[currentData.teamBLogo]}
                    alt={currentData.teamBName}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                    type_play={logoShape}
                />
            </div>
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
                    {/* Team A Name with custom clip-path */}
                    <div 
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -mr-6 bg-gradient-to-r from-red-500 to-orange-400"
                        style={{
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamAName}</span>
                    </div>
                    {/* Team A Kit Color with custom clip-path */}
                    <div
                        className="w-12 h-8 -ml-3 z-0 mr-2.5"
                        style={{
                            backgroundColor: currentData.teamAKitColor,
                            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)'
                        }}
                    />
                </div>
    
                {/* Score Section */}
                <div className="flex flex-col items-center -mr-12 -ml-12">
                    <div
                        className="flex items-center justify-center sm:px-3 md:px-4 relative py-1 bg-blue-900 min-h-[48px]"
                        style={{
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                        }}
                    >
                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center">
                            {currentData.teamAScore}
                        </div>
    
                        {/* League Logo with custom positioning */}
                        <div className="mx-2 sm:mx-3 relative -top-3">
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
                    
                    {/* Live Status */}
                    <div className={`text-white text-xs font-bold px-2 py-0.5 ${showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}>
                        {showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                    </div>
                </div>
    
                <div className="flex items-center z-20">
                    {/* Team B Kit Color with custom clip-path */}
                    <div
                        className="w-12 h-8 -mr-3 z-0 ml-2.5"
                        style={{
                            backgroundColor: currentData.teamBKitColor,
                            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)'
                        }}
                    />
                    {/* Team B Name with custom clip-path */}
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -ml-6 bg-gradient-to-r from-red-500 to-orange-400"
                        style={{
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
            <div className="w-full h-full relative bg-transparent">
                {/* Top Left Position */}
                <div className="absolute top-4 left-4 z-40 
                    md:top-4 md:left-4 
                    sm:top-3 sm:left-3 sm:scale-75 
                    max-[480px]:top-2 max-[480px]:left-2 max-[480px]:scale-[0.6] 
                    max-[360px]:top-1.5 max-[360px]:left-1.5 max-[360px]:scale-50">
                    {renderLogos(collectLogosForPosition('top-left'))}
                </div>

                {/* Tournament Logo - Top Left (if no sponsors) */}
                {collectLogosForPosition('top-left').length === 0 && tournamentLogo?.url_logo && tournamentLogo.url_logo.length > 0 && (
                    <div className="absolute top-4 left-4 z-40 
                        md:top-4 md:left-4 
                        sm:top-3 sm:left-3 sm:scale-75 
                        max-[480px]:top-2 max-[480px]:left-2 max-[480px]:scale-[0.6] 
                        max-[360px]:top-1.5 max-[360px]:left-1.5 max-[360px]:scale-50">
                        <DisplayLogo
                            logos={getFullLogoUrls(tournamentLogo.url_logo)}
                            alt="Tournament"
                            className="w-16 h-16"
                            type_play={logoShape}
                        />
                    </div>
                )}

                {/* Main Scoreboard - Top Right */}
                <div className="absolute top-4 right-4 z-30 origin-top-right
                    md:top-4 md:right-4 md:scale-100
                    sm:top-3 sm:right-3 sm:scale-75 
                    max-[480px]:top-2 max-[480px]:right-2 max-[480px]:scale-[0.6] 
                    max-[360px]:top-1.5 max-[360px]:right-1.5 max-[360px]:scale-50">
                    <div className="bg-transparent rounded-lg shadow-2xl">
                        {renderScoreboard()}
                    </div>
                </div>

                {/* Bottom Left Position */}
                <div className="absolute bottom-4 left-4 z-40 origin-center
                    md:bottom-4 md:left-4 md:scale-100
                    sm:bottom-3 sm:left-3 sm:scale-75 
                    max-[480px]:bottom-2 max-[480px]:left-2 max-[480px]:scale-[0.6] 
                    max-[360px]:bottom-1.5 max-[360px]:left-1.5 max-[360px]:scale-50">
                    {renderLogos(collectLogosForPosition('bottom-left'))}
                </div>

                {/* Bottom Right Position */}
                <div className="absolute bottom-4 right-4 z-40 origin-center
                    md:bottom-4 md:right-4 md:scale-100
                    sm:bottom-3 sm:right-3 sm:scale-75 
                    max-[480px]:bottom-2 max-[480px]:right-2 max-[480px]:scale-[0.6] 
                    max-[360px]:bottom-1.5 max-[360px]:right-1.5 max-[360px]:scale-50">
                    {renderLogos(collectLogosForPosition('bottom-right'))}
                </div>

                {/* Scrolling Text */}
                {scrollData.mode !== 'khong' && showScrollingText && (
                    <div 
                        className="absolute bottom-0 left-0 w-full z-20 overflow-hidden" 
                        style={{ backgroundColor: scrollData.bgColor }}
                    >
                        <div
                            className="whitespace-nowrap py-2 text-sm font-semibold animate-[scroll_30s_linear_infinite]"
                            style={{ color: scrollData.color }}
                        >
                            {Array(scrollData.repeat).fill(scrollData.text).join(' • ')}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Keyframes cho animation scroll */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default ScoreboardAbove;