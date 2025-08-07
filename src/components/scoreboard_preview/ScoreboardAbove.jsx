import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../../utils/logoUtils';
import ScoreboardType1 from './scoreboard_types/ScoreboardType1';
import ScoreboardType2 from './scoreboard_types/ScoreboardType2';
import ScoreboardType3 from './scoreboard_types/ScoreboardType3';
import ScoreboardType4 from './scoreboard_types/ScoreboardType4';
import ScoreboardLogos from './ScoreboardLogos';
import ScoreboardMarquee from './ScoreboardMarquee';
import DisplayLogo from '../common/DisplayLogo';
import PickleballScoreboardTable from './PickleballScoreboardTable';
import PickleballScoreboardSimple from './scoreboard_types/PickleballScoreboardSimple';

const ScoreboardAbove = ({ type = 1 }) => {
    const {
        matchData,
        displaySettings,
        marqueeData,
        sponsors,
        organizing,
        mediaPartners,
        tournamentLogo
    } = usePublicMatch();

    const [currentType, setCurrentType] = useState(type);

    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: getFullLogoUrl(matchData?.teamA?.logo) || "/api/placeholder/90/90",
        teamBLogo: getFullLogoUrl(matchData?.teamB?.logo) || "/api/placeholder/90/90",
        teamAScore: matchData?.teamA?.score || 0,
        teamBScore: matchData?.teamB?.score || 0,
        teamAScoreSet: matchData?.teamA?.scoreSet || 0,
        teamBScoreSet: matchData?.teamB?.scoreSet || 0,
        matchTime: matchData?.matchTime || "00:00",
        period: matchData?.period || "Chưa bắt đầu",
        status: matchData?.status || "waiting",
        teamAKitColor: matchData?.teamA?.teamAKitColor || "#FF0000",
        teamA2KitColor: matchData?.teamA?.teamA2KitColor || "#FF0000",
        teamBKitColor: matchData?.teamB?.teamBKitColor || "#0000FF",
        teamB2KitColor: matchData?.teamB?.teamB2KitColor || "#FF0000",
        leagueLogo: "/api/placeholder/40/40",
        typeMatch: matchData?.typeMatch || "soccer"
    };

    const rawLogoShape = displaySettings?.displaySettings?.logoShape || displaySettings?.logoShape || "round";
    const logoShape = rawLogoShape === 'round' ? 'round' : rawLogoShape;
    const showMatchTime = currentData.status === 'live' || currentData.status === 'pause';

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

    useEffect(() => {
        if (displaySettings?.selectedSkin) {
            setCurrentType(displaySettings.selectedSkin);
        }
    }, [displaySettings?.selectedSkin]);

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

    const renderScoreboard = () => {
        // For pickleball, always use simple table format (like Type 5)
        if (currentData.typeMatch === 'pickleball') {
            return <PickleballScoreboardSimple currentData={currentData} logoShape={logoShape} showMatchTime={showMatchTime} />;
        }

        // For soccer, use the selected type
        switch (currentType) {
            case 1: return <ScoreboardType1 currentData={currentData} logoShape={logoShape} showMatchTime={showMatchTime} />;
            case 2: return <ScoreboardType2 currentData={currentData} logoShape={logoShape} showMatchTime={showMatchTime} />;
            case 3: return <ScoreboardType3 currentData={currentData} logoShape={logoShape} showMatchTime={showMatchTime} />;
            case 4: return <ScoreboardType4 currentData={currentData} logoShape={logoShape} showMatchTime={showMatchTime} />;
            default: return <ScoreboardType1 currentData={currentData} logoShape={logoShape} showMatchTime={showMatchTime} />;
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
                    <ScoreboardLogos 
                        allLogos={collectLogosForPosition('top-left')} 
                        logoShape={logoShape} 
                        rotateDisplay={displaySettings?.displaySettings?.rotateDisplay || displaySettings?.rotateDisplay} 
                    />
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

                {/* Main Scoreboard - Positioned differently for pickleball vs soccer */}
                {currentData.typeMatch === 'pickleball' ? (
                    // Pickleball table - centered
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30
                        md:scale-100 sm:scale-90 max-[480px]:scale-75 max-[360px]:scale-60">
                        <div className="bg-transparent rounded-lg shadow-2xl">
                            {renderScoreboard()}
                        </div>
                    </div>
                ) : (
                    // Soccer scoreboard - top right
                    <div className="absolute top-4 right-4 z-30 origin-top-right
                        md:top-4 md:right-4 md:scale-100
                        sm:top-3 sm:right-3 sm:scale-75
                        max-[480px]:top-2 max-[480px]:right-2 max-[480px]:scale-[0.6]
                        max-[360px]:top-1.5 max-[360px]:right-1.5 max-[360px]:scale-50">
                        <div className="bg-transparent rounded-lg shadow-2xl">
                            {renderScoreboard()}
                        </div>
                    </div>
                )}

                {/* Bottom Left Position */}
                <div className="absolute bottom-4 left-4 z-40 origin-center
                    md:bottom-4 md:left-4 md:scale-100
                    sm:bottom-3 sm:left-3 sm:scale-75 
                    max-[480px]:bottom-2 max-[480px]:left-2 max-[480px]:scale-[0.6] 
                    max-[360px]:bottom-1.5 max-[360px]:left-1.5 max-[360px]:scale-50">
                    <ScoreboardLogos 
                        allLogos={collectLogosForPosition('bottom-left')} 
                        logoShape={logoShape} 
                        rotateDisplay={displaySettings?.displaySettings?.rotateDisplay || displaySettings?.rotateDisplay} 
                    />
                </div>

                {/* Bottom Right Position */}
                <div className="absolute bottom-4 right-4 z-40 origin-center
                    md:bottom-4 md:right-4 md:scale-100
                    sm:bottom-3 sm:right-3 sm:scale-75 
                    max-[480px]:bottom-2 max-[480px]:right-2 max-[480px]:scale-[0.6] 
                    max-[360px]:bottom-1.5 max-[360px]:right-1.5 max-[360px]:scale-50">
                    <ScoreboardLogos 
                        allLogos={collectLogosForPosition('bottom-right')} 
                        logoShape={logoShape} 
                        rotateDisplay={displaySettings?.displaySettings?.rotateDisplay || displaySettings?.rotateDisplay} 
                    />
                </div>

                <ScoreboardMarquee scrollData={scrollData} />
            </div>

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
