import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import { useAudio } from '../../contexts/AudioContext';

const Intro = () => {
    // Sử dụng dữ liệu từ PublicMatchContext
    const { matchData: contextMatchData, marqueeData } = usePublicMatch();

    // Sử dụng AudioContext để điều khiển audio tập trung
    const { audioEnabled, playAudio, stopCurrentAudio } = useAudio();

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

    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    // Handle window resize
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

    // Tự động phát audio poster.mp3 qua AudioContext khi component mount
    useEffect(() => {
        if (audioEnabled) {
            console.log('🎵 [Intro] Playing poster audio via AudioContext');
            playAudio('poster');
        } else {
            console.log('🔇 [Intro] Audio disabled, not playing');
        }

        // Cleanup khi unmount
        return () => {
            console.log('🧹 [Intro] Component unmounting, stopping audio');
            stopCurrentAudio();
        };
    }, [audioEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

    // Lắng nghe thay đổi audioEnabled để dừng/phát audio
    useEffect(() => {
        if (!audioEnabled) {
            console.log('🔇 [Intro] Audio disabled, stopping current audio');
            stopCurrentAudio();
        }
    }, [audioEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

    // Responsive calculations
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    
    const posterWidth = isMobile ? windowSize.width - 32 : isTablet ? 700 : 900;
    const posterHeight = isMobile ? windowSize.height * 0.85 : isTablet ? 500 : 580;
    const logoSize = isMobile ? 120 : isTablet ? 140 : 160;
    const titleSize = isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl';
    const subtitleSize = isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl';
    const vsSize = isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl';
    const teamNameSize = isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl';
    const liveSize = isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl';

    // Check if live text contains specific keywords
    const liveTextLower = matchData.liveText.toLowerCase();
    const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
    const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
    const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Top left logos */}
            {showNSBLogo && (
                <div className={`fixed z-50 ${isMobile ? 'top-4 left-4' : 'top-8 left-8'}`}>
                    <div className={`${isMobile ? 'w-24 h-12' : 'w-32 h-16'} bg-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg`}>
                        <span className={isMobile ? 'text-sm' : 'text-base'}>NSB</span>
                    </div>
                </div>
            )}

            {showBDPXTLogo && (
                <div className={`fixed z-50 ${isMobile ? 'top-4 left-4' : 'top-8 left-8'}`}>
                    <div className={`${isMobile ? 'w-24 h-12' : 'w-32 h-16'} bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg`}>
                        <span className={isMobile ? 'text-sm' : 'text-base'}>BDPXT</span>
                    </div>
                </div>
            )}

            {/* Main poster */}
            <div
                className="relative bg-gradient-to-br from-blue-800/70 to-green-700/70 rounded-3xl text-white text-center shadow-2xl"
                style={{
                    width: `${posterWidth}px`,
                    height: `${posterHeight}px`,
                    padding: isMobile ? '16px' : '32px'
                }}
            >
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] rounded-3xl"></div>

                {/* Title */}
                <h1 className={`${titleSize} font-bold text-yellow-300 drop-shadow-2xl relative z-10 ${isMobile ? 'mt-2' : 'mt-4'}`}>
                    {matchData.matchTitle}
                </h1>

                {/* Subtitle with time and venue */}
                <div className={`${subtitleSize} ${isMobile ? 'mt-1' : 'mt-2'} drop-shadow-lg text-white/90 relative z-10`}>
                    <div className="flex flex-col items-center space-y-1">
                        <span className="font-semibold">{matchData.time} - {matchData.date}</span>
                        {matchData.stadium && matchData.stadium !== 'san' && (
                            <span className={`${isMobile ? 'text-base' : 'text-lg'} text-yellow-200`}>
                                📍 {matchData.stadium}
                            </span>
                        )}
                    </div>
                </div>

                {/* Match section */}
                <div className={`flex items-center justify-center space-x-2 relative z-10 ${isMobile ? 'mt-4' : 'mt-6'}`}>
                    {/* Team 1 */}
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm scale-110"></div>
                            <img
                                src={matchData.logo1}
                                alt={matchData.team1}
                                className="relative rounded-full bg-white p-2 object-cover shadow-xl border-4 border-white/30 group-hover:scale-105 transition-transform duration-300"
                                style={{
                                    width: `${logoSize}px`,
                                    height: `${logoSize}px`,
                                    animation: 'rotate 8s linear infinite'
                                }}
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDMzOGNhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBBPC90ZXh0Pgo8L3N2Zz4K';
                                }}
                            />
                        </div>
                        <div className={`bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl ${isMobile ? 'mt-2' : 'mt-4'} ${teamNameSize} font-bold shadow-lg border border-white/20`}>
                            {matchData.team1}
                        </div>
                    </div>

                    {/* VS */}
                    <div className="flex-shrink-0 px-2">
                        <div className={`${vsSize} font-bold text-yellow-300 drop-shadow-2xl animate-pulse`}>
                            VS
                        </div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm scale-110"></div>
                            <img
                                src={matchData.logo2}
                                alt={matchData.team2}
                                className="relative rounded-full bg-white p-2 object-cover shadow-xl border-4 border-white/30 group-hover:scale-105 transition-transform duration-300"
                                style={{
                                    width: `${logoSize}px`,
                                    height: `${logoSize}px`,
                                    animation: 'rotate 8s linear infinite reverse'
                                }}
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZGMyNjI2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVhbSBCPC90ZXh0Pgo8L3N2Zz4K';
                                }}
                            />
                        </div>
                        <div className={`bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl ${isMobile ? 'mt-2' : 'mt-4'} ${teamNameSize} font-bold shadow-lg border border-white/20`}>
                            {matchData.team2}
                        </div>
                    </div>
                </div>

                {/* Live stream info */}
                <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 inline-block ${isMobile ? 'mt-4' : 'mt-6'} ${liveSize} font-bold rounded-xl shadow-lg border-2 border-white/20 relative z-10`}>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <span>LIVESTREAM TRỰC TIẾP</span>
                        {matchData.liveText && <span>: {matchData.liveText}</span>}
                    </div>
                </div>
            </div>

            {/* Bottom left SCO logo */}
            {showSCOLogo && (
                <div className={`fixed z-50 ${isMobile ? 'bottom-4 left-4' : 'bottom-8 left-8'}`}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm scale-110"></div>
                        <img
                            src="/images/basic/ScoLivLogo.png"
                            alt="SCO Logo"
                            className={`relative ${isMobile ? 'h-12' : 'h-16'} w-auto object-contain shadow-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300 rounded-lg`}
                            onError={(e) => {
                                // Fallback to text logo if image fails
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                    <div class="${isMobile ? 'w-24 h-12' : 'w-32 h-16'} bg-gray-700 rounded-lg flex items-center justify-center text-white font-bold shadow-xl border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                                        <span class="${isMobile ? 'text-sm' : 'text-base'}">SCO</span>
                                    </div>
                                `;
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Marquee (if enabled) */}
            {matchData.showMarquee && matchData.marqueeText && (
                <div className={`fixed bottom-0 left-0 w-full ${isMobile ? 'h-10' : 'h-12'} bg-black/80 backdrop-blur-sm text-white flex items-center overflow-hidden z-50 border-t-2 border-white/20`}>
                    <div className={`animate-marquee whitespace-nowrap ${isMobile ? 'text-lg' : 'text-xl'} font-bold px-4`}>
                        {matchData.marqueeText}
                    </div>
                </div>
            )}

            {/* Custom styles for animations */}
            <style jsx>{`
                @keyframes rotate {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
                
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                .animate-marquee {
                    animation: marquee 15s linear infinite;
                }

                @media (max-width: 640px) {
                    .animate-marquee {
                        animation: marquee 20s linear infinite;
                    }
                }
            `}</style>
        </div>
    );
};

export default Intro;
