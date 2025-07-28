import React, { useState, useEffect } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';

const HalftimeBreakPoster = () => {
    // Sử dụng dữ liệu từ PublicMatchContext
    const { matchData: contextMatchData, marqueeData } = usePublicMatch();

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

    const [posterScale, setPosterScale] = useState(1);
    const [logoScale, setLogoScale] = useState(1);

    // Auto-adjust scales based on window size
    useEffect(() => {
        const adjustScales = () => {
            const windowWidth = window.innerWidth;

            // Poster scale adjustment - using 700px as original width like in template
            const originalPosterWidth = 700;
            const targetPosterWidth = 0.5 * windowWidth;
            const newPosterScale = Math.min(targetPosterWidth / originalPosterWidth, 1);
            setPosterScale(newPosterScale);

            // Logo scale for mobile responsiveness
            const newLogoScale = windowWidth < 768 ? 0.7 : 1;
            setLogoScale(newLogoScale);
        };

        adjustScales();
        window.addEventListener('resize', adjustScales);

        return () => window.removeEventListener('resize', adjustScales);
    }, []);

    // Check if live text contains specific keywords
    const liveTextLower = matchData.liveText.toLowerCase();
    const showNSBLogo = liveTextLower.includes('nsb') || liveTextLower.includes('nga son biz');
    const showBDPXTLogo = liveTextLower.includes('bdpxt') || liveTextLower.includes('xu thanh');
    const showSCOLogo = !showNSBLogo && !showBDPXTLogo;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-800/70 to-green-700/70 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Top left logos */}
            {showNSBLogo && (
                <div className="fixed top-8 left-8 z-50" style={{ height: '8vw', width: 'auto' }}>
                    <div className="h-full bg-red-600 rounded flex items-center justify-center text-white font-bold px-4">
                        NSB
                    </div>
                </div>
            )}

            {showBDPXTLogo && (
                <div className="fixed top-8 left-8 z-50" style={{ height: '8vw', width: 'auto' }}>
                    <div className="h-full bg-blue-600 rounded flex items-center justify-center text-white font-bold px-4">
                        BDPXT
                    </div>
                </div>
            )}

            {/* Main poster */}
            <div
                className="relative text-white text-center"
                style={{
                    width: '1000px',
                    height: '620px',
                    transform: `scale(${posterScale})`,
                    transformOrigin: 'center'
                }}
            >
                {/* Title */}
                <h1 className="text-5xl font-bold text-yellow-400 mt-8 drop-shadow-lg">
                    {matchData.matchTitle}
                </h1>

                {/* Subtitle with time and venue */}
                <div className="text-4xl mt-2 drop-shadow-md">
                    {matchData.time} - {matchData.date}
                    {matchData.stadium && matchData.stadium !== 'san' && (
                        <span> | Địa điểm: {matchData.stadium}</span>
                    )}
                </div>

                {/* Match section */}
                <div className="flex items-center justify-center mt-8 space-x-4">
                    {/* Team 1 */}
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={matchData.logo1}
                                alt={matchData.team1}
                                className="w-48 h-48 rounded-full bg-white p-2 object-cover"
                                style={{
                                    animation: 'spin 4s linear infinite',
                                    transform: `scale(${logoScale})`
                                }}
                            />
                        </div>
                        <div
                            className="bg-black/50 px-4 py-2 rounded-lg mt-6 text-3xl font-bold"
                            style={{ width: '240px' }}
                        >
                            {matchData.team1}
                        </div>
                    </div>

                    {/* VS */}
                    <div className="flex-shrink-0">
                        <div className="text-8xl font-bold text-yellow-400 drop-shadow-lg px-8" style={{ height: '261px', display: 'flex', alignItems: 'center' }}>
                            VS
                        </div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={matchData.logo2}
                                alt={matchData.team2}
                                className="w-48 h-48 rounded-full bg-white p-2 object-cover"
                                style={{
                                    animation: 'spin 4s linear infinite reverse',
                                    transform: `scale(${logoScale})`
                                }}
                            />
                        </div>
                        <div
                            className="bg-black/50 px-4 py-2 rounded-lg mt-6 text-3xl font-bold"
                            style={{ width: '240px' }}
                        >
                            {matchData.team2}
                        </div>
                    </div>
                </div>

                {/* Halftime break message */}
                <div className="bg-orange-500 text-white px-16 py-2 inline-block mt-7 text-5xl font-bold rounded">
                    NGHỈ GIỮA 2 HIỆP
                </div>
            </div>

            {/* Bottom left SCO logo */}
            {showSCOLogo && (
                <div className="fixed bottom-12 left-12 z-50" style={{ transformOrigin: 'bottom left' }}>
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        SCO
                    </div>
                </div>
            )}

            {/* Partner positions */}
            <div className="fixed top-4 left-4 w-16 h-16 bg-white/20 rounded border-2 border-dashed border-white/50 flex items-center justify-center text-white text-xs z-40">
                L-UP
            </div>

            <div className="fixed bottom-16 left-4 w-16 h-16 bg-white/20 rounded border-2 border-dashed border-white/50 flex items-center justify-center text-white text-xs z-40">
                L-DOWN
            </div>

            <div className="fixed bottom-16 right-4 w-16 h-16 bg-white/20 rounded border-2 border-dashed border-white/50 flex items-center justify-center text-white text-xs z-40">
                R-DOWN
            </div>

            {/* Marquee (if enabled) */}
            {matchData.showMarquee && matchData.marqueeText && (
                <div className="fixed bottom-0 left-0 w-full bg-black/30 text-white flex items-center overflow-hidden z-50" style={{ height: '3vw' }}>
                    <div className="animate-marquee whitespace-nowrap font-bold" style={{ fontSize: '2.4vw', paddingBottom: '0.2vw' }}>
                        {matchData.marqueeText}
                    </div>
                </div>
            )}

            {/* Custom styles for animations */}
            <style jsx>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(8%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>

            {/* Control Panel for Demo */}

            {/* Capture mode indicator */}
            {matchData.captureMode && (
                <div className="fixed top-1/2 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                    CAPTURE MODE
                </div>
            )}
        </div>
    );
};

export default HalftimeBreakPoster;
