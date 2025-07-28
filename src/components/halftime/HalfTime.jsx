import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAudio } from '../../contexts/AudioContext';

const HalftimeBreakPoster = () => {
    // Sử dụng dữ liệu từ PublicMatchContext
    const { matchData: contextMatchData, marqueeData } = usePublicMatch();

    // Sử dụng AudioContext để phát audio
    const { playAudio, isComponentPlaying } = useAudio();

    // Kết hợp dữ liệu từ context với dữ liệu mặc định
    const matchData = {
        matchTitle: contextMatchData.tournament || "GIẢI BÓNG ĐÁ PHONG TRÀO",
        stadium: contextMatchData.stadium || "Sân vận động Thiên Trường",
        time: contextMatchData.startTime || contextMatchData.time || "19:30",
        date: contextMatchData.matchDate || new Date().toLocaleDateString('vi-VN'),
        team1: contextMatchData.teamA.name || "ĐỘI A",
        team2: contextMatchData.teamB.name || "ĐỘI B",
        logo1: contextMatchData.teamA.logo || "/images/background-poster/default_logoA.png",
        logo2: contextMatchData.teamB.logo || "/images/background-poster/default_logoB.png",
        liveText: contextMatchData.liveText || "FACEBOOK LIVE",
        showMarquee: marqueeData.mode !== 'none',
        marqueeText: marqueeData.text || ""
    };

    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    // Tự động phát audio poster.mp3 khi component mount
    useEffect(() => {
        playAudio('poster', 'halftime');
    }, [playAudio]);

    // Check if live text contains specific keywords
    const liveTextLower = matchData.liveText.toLowerCase();
    const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
    const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
    const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

    // Responsive values based on screen width
    const isMobile = screenSize.width < 768;
    const isTablet = screenSize.width < 1024;

    return (
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
            {/* Main container with gradient background and rounded corners */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="football-pattern"></div>
                </div>

                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>

                {/* Top left logos */}
                {showNSBLogo && (
                    <div 
                        className="absolute top-8 left-8 z-50 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center text-white font-bold px-4 shadow-lg transform hover:scale-105 transition-transform duration-300"
                        style={{ 
                            height: isMobile ? '6vw' : '4vw',
                            minHeight: '32px',
                            fontSize: isMobile ? '3vw' : '2vw',
                            minFontSize: '14px'
                        }}
                    >
                        NSB
                    </div>
                )}

                {showBDPXTLogo && (
                    <div 
                        className="absolute top-8 left-8 z-50 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold px-4 shadow-lg transform hover:scale-105 transition-transform duration-300"
                        style={{ 
                            height: isMobile ? '6vw' : '4vw',
                            minHeight: '32px',
                            fontSize: isMobile ? '3vw' : '2vw',
                            minFontSize: '14px'
                        }}
                    >
                        BDPXT
                    </div>
                )}

                {/* Main poster container */}
                <div className="w-full max-w-6xl mx-auto px-8 py-8 relative z-10">
                    <div className="text-white text-center">
                        {/* Title with enhanced glow effect */}
                        <h1 className={`font-bold text-yellow-400 mb-6 animate-pulse-glow ${
                            isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-5xl'
                        }`} style={{
                            textShadow: '0 0 20px rgba(255, 235, 59, 0.8), 0 0 40px rgba(255, 235, 59, 0.6), 0 0 60px rgba(255, 235, 59, 0.4)'
                        }}>
                            {matchData.matchTitle}
                        </h1>

                        {/* Subtitle with glass morphism effect */}
                        <div className={`backdrop-blur-sm bg-white/10 rounded-2xl px-6 py-4 mb-8 border border-white/20 shadow-xl ${
                            isMobile ? 'text-lg' : isTablet ? 'text-2xl' : 'text-4xl'
                        }`}>
                            <div className="font-semibold">{matchData.time} - {matchData.date}</div>
                            {matchData.stadium && matchData.stadium !== 'san' && (
                                <div className={`text-gray-200 ${isMobile ? 'text-base mt-2' : 'mt-1'}`}>
                                    📍 {matchData.stadium}
                                </div>
                            )}
                        </div>

                        {/* Match section with enhanced design */}
                        <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-12 mb-8">
                            {/* Team 1 */}
                            <div className="flex-1 flex flex-col items-center max-w-xs">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin-slow"></div>
                                    <img
                                        src={matchData.logo1}
                                        alt={matchData.team1}
                                        className={`relative z-10 rounded-full bg-white p-2 object-cover shadow-2xl hover:scale-110 transition-transform duration-500 ${
                                            isMobile ? 'w-20 h-20' : isTablet ? 'w-32 h-32' : 'w-48 h-48'
                                        }`}
                                        style={{
                                            animation: 'spin 8s linear infinite'
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBBPC90ZXh0Pgo8L3N2Zz4K';
                                        }}
                                    />
                                </div>
                                <div className={`bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl font-bold text-center w-full shadow-lg border border-white/10 ${
                                    isMobile ? 'text-sm' : isTablet ? 'text-lg' : 'text-3xl'
                                }`}>
                                    <div className="truncate">{matchData.team1}</div>
                                </div>
                            </div>

                            {/* VS with enhanced animation */}
                            <div className="flex-shrink-0">
                                <div className={`font-bold text-yellow-400 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-2xl animate-bounce-subtle border-4 border-yellow-300 ${
                                    isMobile ? 'text-2xl' : isTablet ? 'text-4xl' : 'text-6xl'
                                }`} style={{
                                    textShadow: '0 0 15px rgba(255, 235, 59, 0.8)'
                                }}>
                                    VS
                                </div>
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1 flex flex-col items-center max-w-xs">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-spin-slow-reverse"></div>
                                    <img
                                        src={matchData.logo2}
                                        alt={matchData.team2}
                                        className={`relative z-10 rounded-full bg-white p-2 object-cover shadow-2xl hover:scale-110 transition-transform duration-500 ${
                                            isMobile ? 'w-20 h-20' : isTablet ? 'w-32 h-32' : 'w-48 h-48'
                                        }`}
                                        style={{
                                            animation: 'spin 8s linear infinite reverse'
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZGMyNjI2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBCPC90ZXh0Pgo8L3N2Zz4K';
                                        }}
                                    />
                                </div>
                                <div className={`bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl font-bold text-center w-full shadow-lg border border-white/10 ${
                                    isMobile ? 'text-sm' : isTablet ? 'text-lg' : 'text-3xl'
                                }`}>
                                    <div className="truncate">{matchData.team2}</div>
                                </div>
                            </div>
                        </div>

                        {/* Halftime break message with enhanced styling */}
                        <div className={`bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white px-8 py-4 inline-block rounded-2xl font-bold shadow-2xl border-4 border-yellow-300 animate-pulse-slow ${
                            isMobile ? 'text-xl' : isTablet ? 'text-3xl' : 'text-5xl'
                        }`} style={{
                            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                            boxShadow: '0 0 30px rgba(255, 165, 0, 0.6)'
                        }}>
                            ⏱️ NGHỈ GIỮA 2 HIỆP ⏱️
                        </div>
                    </div>
                </div>

                {/* Bottom left SCO logo */}
                {showSCOLogo && (
                    <div 
                        className="absolute bottom-8 left-8 z-50 transform hover:scale-110 transition-transform duration-300"
                        style={{ 
                            width: isMobile ? '60px' : '96px',
                            height: isMobile ? '60px' : '96px'
                        }}
                    >
                        <img
                            src="/images/basic/ScoLivLogo.png"
                            alt="SCO Live"
                            className="w-full h-full object-contain rounded-full shadow-xl bg-white/10 backdrop-blur-sm p-2"
                            onError={(e) => {
                                // Fallback to text version if image fails to load
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div 
                            className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-full items-center justify-center text-white font-bold text-lg hidden shadow-xl"
                            style={{ display: 'none' }}
                        >
                            SCO
                        </div>
                    </div>
                )}

                {/* Marquee (if enabled) */}
                {matchData.showMarquee && matchData.marqueeText && (
                    <div 
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-sm text-white flex items-center overflow-hidden z-50 border-t border-white/20"
                        style={{ 
                            height: isMobile ? '6vw' : '3vw',
                            minHeight: '32px'
                        }}
                    >
                        <div 
                            className="animate-marquee whitespace-nowrap font-bold"
                            style={{ 
                                fontSize: isMobile ? '4vw' : '2.4vw',
                                minFontSize: '16px',
                                paddingBottom: '0.2vw',
                                textShadow: '0 0 5px rgba(0, 0, 0, 0.8)'
                            }}
                        >
                            {matchData.marqueeText}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced custom styles for animations */}
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes spin-slow-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { 
                        text-shadow: 0 0 20px rgba(255, 235, 59, 0.8), 0 0 40px rgba(255, 235, 59, 0.6), 0 0 60px rgba(255, 235, 59, 0.4);
                        transform: scale(1);
                    }
                    50% { 
                        text-shadow: 0 0 30px rgba(255, 235, 59, 1), 0 0 60px rgba(255, 235, 59, 0.8), 0 0 90px rgba(255, 235, 59, 0.6);
                        transform: scale(1.05);
                    }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }
                
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
                
                .animate-pulse-glow {
                    animation: pulse-glow 4s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                
                .animate-spin-slow-reverse {
                    animation: spin-slow-reverse 20s linear infinite;
                }
                
                .football-pattern {
                    background-image: 
                        radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 2px),
                        radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2px, transparent 2px);
                    background-size: 100px 100px;
                    background-position: 0 0, 50px 50px;
                    width: 100%;
                    height: 100%;
                    animation: float 10s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateX(0px) translateY(0px); }
                    25% { transform: translateX(10px) translateY(-10px); }
                    50% { transform: translateX(-5px) translateY(10px); }
                    75% { transform: translateX(-10px) translateY(-5px); }
                }

                /* Ensure text stays readable on very small screens */
                @media (max-width: 480px) {
                    .truncate {
                        font-size: 12px !important;
                        line-height: 1.2;
                    }
                }
            `}</style>
        </div>
    );
};

export default HalftimeBreakPoster;
