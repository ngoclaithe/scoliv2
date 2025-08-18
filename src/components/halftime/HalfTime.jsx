import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { getFullLogoUrl, getFullLogoUrls } from '../../utils/logoUtils';

const HalftimeBreakPoster = () => {
    const { matchData: contextMatchData } = usePublicMatch();

    const matchData = {
        matchTitle: contextMatchData.matchTitle || "GIẢI BÓNG ĐÁ PHONG TRÀO",
        stadium: contextMatchData.stadium || "Sân vận động Thiên Trường",
        time: contextMatchData.startTime || contextMatchData.time || "19:30",
        date: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN'),
        team1: contextMatchData.teamA.name || "ĐỘI A",
        team2: contextMatchData.teamB.name || "ĐỘI B",
        logo1: getFullLogoUrl(contextMatchData?.teamA?.logo) || "/api/placeholder/90/90",
        logo2: getFullLogoUrl(contextMatchData?.teamB?.logo) || "/api/placeholder/90/90",
        liveText: contextMatchData.liveText || "FACEBOOK LIVE"
    };

    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

    const logoSize = isMobile ? 120 : isTablet ? 160 : 200;

    const liveTextLower = matchData.liveText.toLowerCase();
    const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
    const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
    const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

    return (
        <div
            className="min-h-screen p-2 sm:p-4 flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom right, rgba(1, 58, 179, 0.7), rgba(1, 122, 44, 0.7))',
                fontFamily: 'UTM Bebas, Arial, sans-serif'
            }}
        >
            <div className="absolute inset-0 opacity-20">
                <div className="football-pattern"></div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>

            {/* Top left logos */}
            {showNSBLogo && (
                <div
                    className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center text-white font-bold px-2 sm:px-4 shadow-lg"
                    style={{
                        height: isMobile ? '40px' : '60px',
                        fontSize: isMobile ? '14px' : '20px',
                        fontFamily: 'UTM Bebas, Arial, sans-serif'
                    }}
                >
                    NSB
                </div>
            )}

            {showBDPXTLogo && (
                <div
                    className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold px-2 sm:px-4 shadow-lg"
                    style={{
                        height: isMobile ? '40px' : '60px',
                        fontSize: isMobile ? '14px' : '20px',
                        fontFamily: 'UTM Bebas, Arial, sans-serif'
                    }}
                >
                    BDPXT
                </div>
            )}

            {/* Main poster container */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 pb-4 sm:pb-8 relative z-10">
                <div className="text-white text-center">
                    {/* Title */}
                    <h1
                        className="font-bold"
                        style={{
                            fontSize: isMobile ? '24px' : isTablet ? '36px' : '52px',
                            color: 'yellow',
                            // Giảm một nửa so với trước (trước là 5px/10px, giờ còn 2.5px/5px)
                            marginTop: isMobile ? '2.5px' : '5px',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                            fontFamily: 'UTM Bebas, Arial, sans-serif'
                        }}
                    >
                        {matchData.matchTitle}
                    </h1>

                    {/* Time and Date with Stadium */}
                    <div
                        className="font-semibold text-white"
                        style={{
                            fontSize: isMobile ? '16px' : isTablet ? '24px' : '40px',
                            marginTop: '5px',
                            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.4)',
                            fontFamily: 'UTM Bebas, Arial, sans-serif',
                            whiteSpace: isMobile ? 'normal' : 'nowrap'
                        }}
                    >
                        {matchData.time} - {matchData.date}
                        {matchData.stadium && matchData.stadium !== 'san' && (
                            <span className="text-white ml-2 sm:ml-4 block sm:inline">
                                {matchData.stadium}
                            </span>
                        )}
                    </div>

                    {/* Match section */}
                    <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 mb-4 sm:mb-8 mt-6 sm:mt-8">
                        {/* Team 1 */}
                        <div className="flex-1 flex flex-col items-center max-w-[120px] sm:max-w-xs">
                            <div className="relative mb-4">
                                <div
                                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                                    style={{
                                        width: `${logoSize}px`,
                                        height: `${logoSize}px`
                                    }}
                                >
                                    <img
                                        src={matchData.logo1}
                                        alt={matchData.team1}
                                        className="object-contain w-[85%] h-[85%]"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBBPC90ZXh0Pgo8L3N2Zz4K';
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className="font-bold text-white"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    padding: '5px 10px',
                                    borderRadius: '7px',
                                    display: 'inline-block',
                                    marginTop: isMobile ? '15px' : '30px',
                                    width: isMobile ? '100px' : isTablet ? '180px' : '240px',
                                    textAlign: 'center',
                                    fontSize: isMobile ? '14px' : isTablet ? '18px' : '24px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontFamily: 'UTM Bebas, Arial, sans-serif'
                                }}
                            >
                                {matchData.team1}
                            </div>
                        </div>

                        {/* VS */}
                        <div className="flex-shrink-0">
                            <img
                                src="/images/basic/vs_nghigiuahiep.png"
                                alt="VS"
                                style={{
                                    height: isMobile ? '120px' : isTablet ? '180px' : '261px',
                                    width: 'auto',
                                    overflowClipMargin: 'content-box',
                                    overflow: 'clip'
                                }}
                                onError={(e) => {
                                    // Fallback to text if image fails
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div
                                className="font-bold text-yellow-400 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl border-4 border-yellow-300"
                                style={{
                                    textShadow: '0 0 15px rgba(255, 235, 59, 0.8)',
                                    display: 'none',
                                    fontSize: isMobile ? '24px' : isTablet ? '36px' : '48px',
                                    fontFamily: 'UTM Bebas, Arial, sans-serif'
                                }}
                            >
                                VS
                            </div>
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 flex flex-col items-center max-w-[120px] sm:max-w-xs">
                            <div className="relative mb-4">
                                <div
                                    className="relative rounded-full bg-white p-2 shadow-xl border-4 border-white/30 flex items-center justify-center overflow-hidden"
                                    style={{
                                        width: `${logoSize}px`,
                                        height: `${logoSize}px`
                                    }}
                                >
                                    <img
                                        src={matchData.logo2}
                                        alt={matchData.team2}
                                        className="object-contain w-[85%] h-[85%]"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBBPC90ZXh0Pgo8L3N2Zz4K';
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className="font-bold text-white"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    padding: '5px 10px',
                                    borderRadius: '7px',
                                    display: 'inline-block',
                                    marginTop: isMobile ? '15px' : '30px',
                                    width: isMobile ? '100px' : isTablet ? '180px' : '240px',
                                    textAlign: 'center',
                                    fontSize: isMobile ? '14px' : isTablet ? '18px' : '24px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontFamily: 'UTM Bebas, Arial, sans-serif'
                                }}
                            >
                                {matchData.team2}
                            </div>
                        </div>
                    </div>

                    {/* Halftime break message */}
                    <div
                        className="font-bold inline-block"
                        style={{
                            fontSize: isMobile ? '20px' : isTablet ? '32px' : '46px',
                            background: '#FF6900',
                            color: 'white',
                            padding: isMobile ? '8px 20px' : isTablet ? '8px 40px' : '10px 60px',
                            display: 'inline-block',
                            marginTop: isMobile ? '15px' : '26px',
                            fontFamily: 'UTM Bebas, Arial, sans-serif'
                        }}
                    >
                        NGHỈ GIỮA 2 HIỆP
                    </div>
                </div>
            </div>

            {/* Bottom left SCO logo - NO rounded background */}
            {showSCOLogo && (
                <>
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="SCO Live"
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: isMobile ? '20px' : '25px',
                            zIndex: 10,
                            width: isMobile ? '80px' : isTablet ? '120px' : '150px',
                            height: 'auto', 
                            objectFit: 'cover'
                        }}
                    />

                    <div
                        className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-full items-center justify-center text-white font-bold text-lg hidden shadow-xl"
                        style={{
                            display: 'none',
                            position: 'absolute',
                            bottom: '0px',
                            left: isMobile ? '5px' : '10px',
                            zIndex: 10,
                            width: isMobile ? '100px' : isTablet ? '140px' : '192px',
                            height: isMobile ? '100px' : isTablet ? '140px' : '192px',
                            fontFamily: 'UTM Bebas, Arial, sans-serif'
                        }}
                    >
                        SCO
                    </div>
                </>
            )}

            {/* Marquee (if enabled) */}
            {matchData.showMarquee && matchData.marqueeText && (
                <div
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-sm text-white flex items-center overflow-hidden z-50 border-t border-white/20"
                    style={{
                        height: isMobile ? '40px' : '60px'
                    }}
                >
                    <div
                        className="animate-marquee whitespace-nowrap font-bold"
                        style={{
                            fontSize: isMobile ? '16px' : isTablet ? '20px' : '24px',
                            paddingBottom: '0.2vw',
                            textShadow: '0 0 5px rgba(0, 0, 0, 0.8)',
                            fontFamily: 'UTM Bebas, Arial, sans-serif'
                        }}
                    >
                        {matchData.marqueeText}
                    </div>
                </div>
            )}

            {/* Styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap');
                
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                
                .football-pattern {
                    background-image: 
                        radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 2px),
                        radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2px, transparent 2px);
                    background-size: 100px 100px;
                    background-position: 0 0, 50px 50px;
                    width: 100%;
                    height: 100%;
                }

                /* Mobile responsive adjustments */
                @media (max-width: 480px) {
                    .truncate {
                        font-size: 12px !important;
                        line-height: 1.2;
                    }
                }

                @media (max-width: 640px) {
                    /* Ensure proper spacing on very small screens */
                    .gap-4 {
                        gap: 1rem !important;
                    }
                    
                    /* Stack time/date/stadium vertically on small screens */
                    .flex-col {
                        align-items: center !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default HalftimeBreakPoster;