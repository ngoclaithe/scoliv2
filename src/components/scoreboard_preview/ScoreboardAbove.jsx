import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

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
    // console.log('[ScoreboardAbove] sponsors.url_logo', sponsors.sponsors.url_logo);
    // console.log('[ScoreboardAbove] sponsors.position', sponsors.sponsors.position);

    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: matchData?.teamA?.logo || "/api/placeholder/90/90",
        teamBLogo: matchData?.teamB?.logo || "/api/placeholder/90/90",
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
    // Convert shape names to match DisplayLogo expectations
    const logoShape = rawLogoShape === 'round' ? 'circle' : rawLogoShape;

    // Debug log - only when displaySettings change
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
        interval: marqueeData?.mode === 'moi-2' ? 120000 : // 2 minutes = 120 seconds
                  marqueeData?.mode === 'moi-5' ? 300000 : // 5 minutes = 300 seconds
                  marqueeData?.mode === 'lien-tuc' ? 30000 : 0 // liên tục = 30 seconds
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

    const renderScoreboardType1 = () => (
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

                {/* Thời gian trận đấu (nếu có) */}
                {showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                        {currentData.matchTime}
                    </div>
                )}

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

            {/* Live Match Label cho Type 1 */}
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
                {/* Scoreboard chính */}
                <div
                    className="flex items-center justify-center relative z-10 h-8 rounded-md m-0 p-0 gap-0"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        overflow: 'hidden',
                        width: showMatchTime ? '285px' : '265px',
                    }}
                >
                    {/* Team A Name */}
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

                    {/* Score A */}
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

                    {/* Nếu có thời gian thì hiển thị */}
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

                    {/* Score B */}
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

                    {/* Team B Name */}
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

                {/* Logo Team A – đè lên phía ngoài teamAName */}
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

                {/* Logo Team B – đè lên phía ngoài teamBName */}
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

            {/* Live Match Label cho Type 2 */}
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
                {/* Team A */}
                <div className="flex items-center">
                    <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate">
                        {currentData.teamAName}
                    </div>
                    <div
                        className="w-1 h-6 ml-1 rounded-full"
                        style={{ backgroundColor: currentData.teamAKitColor }}
                    />
                </div>

                {/* Score */}
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

                {/* Team B */}
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
                    {/* Hình thang cân xuôi cho tên đội A */}
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -mr-6"
                        style={{
                            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamAName}</span>
                    </div>
                    {/* Màu áo đội A - hình bình hành khít vào hình thang xuôi */}
                    <div
                        className="w-12 h-8 -ml-3 z-0 mr-2.5"
                        style={{
                            backgroundColor: currentData.teamAKitColor,
                            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)'
                        }}
                    />
                </div>

                {/* Hình thang cân xuôi cho phần tỉ số */}
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

                        {/* Logo League - đặt vào container riêng để không bị cắt */}
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
                    {/* Màu áo đội B - hình bình hành khít vào hình thang xuôi */}
                    <div
                        className="w-12 h-8 -mr-3 z-0 ml-2.5"
                        style={{
                            backgroundColor: currentData.teamBKitColor,
                            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)'
                        }}
                    />
                    {/* Hình thang cân xuôi cho tên đội B */}
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
            {/* Container for all elements */}
            <div className="w-full h-full relative bg-transparent">
                {/* Sponsors, Organizing, Media Partners at their assigned positions */}

                {/* Top Left Position */}
                <div className="absolute top-4 left-4 z-40">
                    {(() => {
                        const allLogos = [];

                        // Collect sponsors with top-left position (check for non-empty arrays)
                        if (sponsors.sponsors?.url_logo && sponsors.sponsors.url_logo.length > 0 && sponsors.sponsors?.position && sponsors.sponsors.position.length > 0) {
                            sponsors.sponsors.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(sponsors.sponsors.position[index]) ? sponsors.sponsors.position[index][0] : sponsors.sponsors.position[index];
                                if (position === 'top-left') {
                                    allLogos.push({ url: logo, alt: 'Sponsor', type: 'sponsor' });
                                }
                            });
                        }

                        // Collect organizing with top-left position (check for non-empty arrays)
                        if (organizing?.url_logo && organizing.url_logo.length > 0 && organizing?.position && organizing.position.length > 0) {
                            organizing.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(organizing.position[index]) ? organizing.position[index][0] : organizing.position[index];
                                if (position === 'top-left') {
                                    allLogos.push({ url: logo, alt: 'Organizing', type: 'organizing' });
                                }
                            });
                        }

                        // Collect media partners with top-left position (check for non-empty arrays)
                        if (mediaPartners?.url_logo && mediaPartners.url_logo.length > 0 && mediaPartners?.position && mediaPartners.position.length > 0) {
                            mediaPartners.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(mediaPartners.position[index]) ? mediaPartners.position[index][0] : mediaPartners.position[index];
                                if (position === 'top-left') {
                                    allLogos.push({ url: logo, alt: 'Media Partner', type: 'media' });
                                }
                            });
                        }

                        // Fallback for sponsors without position specified
                        if (sponsors?.url_logo && sponsors.url_logo.length > 0 && (!sponsors?.position || sponsors.position.length === 0)) {
                            sponsors.url_logo.forEach(logo => {
                                allLogos.push({ url: logo, alt: 'Sponsor', type: 'sponsor' });
                            });
                        }

                        if (allLogos.length === 0) return null;

                        if (displaySettings?.rotateDisplay && allLogos.length > 1) {
                            // Slide mode for multiple logos
                            return (
                                <DisplayLogo
                                    logos={allLogos.map(logo => logo.url)}
                                    alt="Sponsors & Partners"
                                    className="w-16 h-16"
                                    type_play={logoShape}
                                    slideMode={true}
                                    maxVisible={1}
                                    slideInterval={5000}
                                />
                            );
                        } else {
                            // Horizontal layout for multiple logos
                            const maxItems = 6;
                            const displayItems = allLogos.slice(0, maxItems);

                            return (
                                <div className="flex gap-1 flex-wrap">
                                    {displayItems.map((logo, index) => (
                                        <div key={index} className="flex-shrink-0">
                                            <DisplayLogo
                                                logos={[logo.url]}
                                                alt={logo.alt}
                                                className="w-12 h-12"
                                                type_play={logoShape}
                                                slideMode={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    })()}
                </div>

                {/* Tournament Logo - Top Left (if no sponsors) */}
                {(!sponsors?.url_logo || sponsors.url_logo.length === 0) && tournamentLogo?.url_logo && tournamentLogo.url_logo.length > 0 && (
                    <div className="absolute top-4 left-4 z-40">
                        <DisplayLogo
                            logos={tournamentLogo.url_logo}
                            alt="Tournament"
                            className="w-16 h-16"
                            type_play={logoShape}
                        />
                    </div>
                )}

                {/* Main Scoreboard - Top Right */}
                <div className="absolute top-4 right-4 z-30">
                    <div className="scoreboard-main bg-transparent rounded-lg shadow-2xl">
                        {renderScoreboard()}
                    </div>
                </div>

                {/* Bottom Left Position */}
                <div className="absolute bottom-4 left-4 z-40">
                    {(() => {
                        const allLogos = [];

                        // Collect sponsors with bottom-left position
                        if (sponsors?.url_logo && sponsors.url_logo.length > 0 && sponsors?.position) {
                            sponsors.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(sponsors.position[index]) ? sponsors.position[index][0] : sponsors.position[index];
                                if (position === 'bottom-left') {
                                    allLogos.push({ url: logo, alt: 'Sponsor', type: 'sponsor' });
                                }
                            });
                        }

                        // Collect organizing with bottom-left position
                        if (organizing?.url_logo && organizing.url_logo.length > 0 && organizing?.position) {
                            organizing.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(organizing.position[index]) ? organizing.position[index][0] : organizing.position[index];
                                if (position === 'bottom-left') {
                                    allLogos.push({ url: logo, alt: 'Organizing', type: 'organizing' });
                                }
                            });
                        }

                        // Collect media partners with bottom-left position
                        if (mediaPartners?.url_logo && mediaPartners.url_logo.length > 0 && mediaPartners?.position) {
                            mediaPartners.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(mediaPartners.position[index]) ? mediaPartners.position[index][0] : mediaPartners.position[index];
                                if (position === 'bottom-left') {
                                    allLogos.push({ url: logo, alt: 'Media Partner', type: 'media' });
                                }
                            });
                        }

                        // Fallback for organizing without position specified
                        if (organizing?.url_logo && organizing.url_logo.length > 0 && (!organizing?.position || organizing.position.length === 0)) {
                            organizing.url_logo.forEach(logo => {
                                allLogos.push({ url: logo, alt: 'Organizing', type: 'organizing' });
                            });
                        }

                        if (allLogos.length === 0) return null;

                        if (displaySettings?.rotateDisplay && allLogos.length > 1) {
                            // Slide mode for multiple logos
                            return (
                                <DisplayLogo
                                    logos={allLogos.map(logo => logo.url)}
                                    alt="Sponsors & Partners"
                                    className="w-16 h-16"
                                    type_play={logoShape}
                                    slideMode={true}
                                    maxVisible={1}
                                    slideInterval={5000}
                                />
                            );
                        } else {
                            // Horizontal layout for multiple logos
                            const maxItems = 6;
                            const displayItems = allLogos.slice(0, maxItems);

                            return (
                                <div className="flex gap-1 flex-wrap">
                                    {displayItems.map((logo, index) => (
                                        <div key={index} className="flex-shrink-0">
                                            <DisplayLogo
                                                logos={[logo.url]}
                                                alt={logo.alt}
                                                className="w-12 h-12"
                                                type_play={logoShape}
                                                slideMode={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    })()}
                </div>

                {/* Bottom Right Position */}
                <div className="absolute bottom-4 right-4 z-40">
                    {(() => {
                        const allLogos = [];

                        // Collect sponsors with bottom-right position
                        if (sponsors?.url_logo && sponsors.url_logo.length > 0 && sponsors?.position) {
                            sponsors.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(sponsors.position[index]) ? sponsors.position[index][0] : sponsors.position[index];
                                if (position === 'bottom-right') {
                                    allLogos.push({ url: logo, alt: 'Sponsor', type: 'sponsor' });
                                }
                            });
                        }

                        // Collect organizing with bottom-right position
                        if (organizing?.url_logo && organizing.url_logo.length > 0 && organizing?.position) {
                            organizing.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(organizing.position[index]) ? organizing.position[index][0] : organizing.position[index];
                                if (position === 'bottom-right') {
                                    allLogos.push({ url: logo, alt: 'Organizing', type: 'organizing' });
                                }
                            });
                        }

                        // Collect media partners with bottom-right position
                        if (mediaPartners?.url_logo && mediaPartners.url_logo.length > 0 && mediaPartners?.position) {
                            mediaPartners.url_logo.forEach((logo, index) => {
                                const position = Array.isArray(mediaPartners.position[index]) ? mediaPartners.position[index][0] : mediaPartners.position[index];
                                if (position === 'bottom-right') {
                                    allLogos.push({ url: logo, alt: 'Media Partner', type: 'media' });
                                }
                            });
                        }

                        // Fallback for media partners without position specified
                        if (mediaPartners?.url_logo && mediaPartners.url_logo.length > 0 && (!mediaPartners?.position || mediaPartners.position.length === 0)) {
                            mediaPartners.url_logo.forEach(logo => {
                                allLogos.push({ url: logo, alt: 'Media Partner', type: 'media' });
                            });
                        }

                        if (allLogos.length === 0) return null;

                        if (displaySettings?.rotateDisplay && allLogos.length > 1) {
                            // Slide mode for multiple logos
                            return (
                                <DisplayLogo
                                    logos={allLogos.map(logo => logo.url)}
                                    alt="Sponsors & Partners"
                                    className="w-16 h-16"
                                    type_play={logoShape}
                                    slideMode={true}
                                    maxVisible={1}
                                    slideInterval={5000}
                                />
                            );
                        } else {
                            // Horizontal layout for multiple logos
                            const maxItems = 6;
                            const displayItems = allLogos.slice(0, maxItems);

                            return (
                                <div className="flex gap-1 flex-wrap">
                                    {displayItems.map((logo, index) => (
                                        <div key={index} className="flex-shrink-0">
                                            <DisplayLogo
                                                logos={[logo.url]}
                                                alt={logo.alt}
                                                className="w-12 h-12"
                                                type_play={logoShape}
                                                slideMode={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    })()}
                </div>

                {/* Scrolling Text - only show if mode is not 'khong' and visibility is true */}
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

                /* Uniform scaling for mobile - like image zoom while staying top-right */
                .scoreboard-main {
                    transform-origin: top right;
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
            `}</style>
        </div>
    );
};

export default ScoreboardAbove;
