import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

const PlayerList = () => {
    const {
        matchData,
        lineupData,
        displaySettings
    } = usePublicMatch();

    console.log("Giá trị của lineupData là:", lineupData);
    const currentData = {
        teamAName: matchData?.teamA?.name || "ĐỘI A",
        teamBName: matchData?.teamB?.name || "ĐỘI B",
        teamALogo: matchData?.teamA?.logo || "/api/placeholder/90/90",
        teamBLogo: matchData?.teamB?.logo || "/api/placeholder/90/90",
        teamAKitColor: matchData?.teamA?.teamAKitColor || "#FF0000",
        teamA2KitColor: matchData?.teamA?.teamA2KitColor || "#FF0000",
        teamBKitColor: matchData?.teamB?.teamBKitColor || "#0000FF",
        teamB2KitColor: matchData?.teamB?.teamB2KitColor || "#FF0000",
        teamAPlayers: lineupData?.teamA || [],
        teamBPlayers: lineupData?.teamB || []
    };

    const logoShape = displaySettings?.logoShape || "square";

    const EmptyPlayerState = () => (
        <div className="flex flex-col items-center justify-center py-4 px-3 text-center">
            <div className="relative mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
            </div>
            <h3 className="text-white/90 text-sm font-semibold mb-1 text-stroke">Chưa có danh sách cầu thủ</h3>
            <p className="text-white/60 text-xs leading-relaxed text-stroke">Vui lòng cập nhật danh sách từ phần quản lý</p>
        </div>
    );

    const PlayerCard = ({ player, index, teamKitColor, isTeamA, totalPlayers }) => {
        const cardHeight = totalPlayers > 10 ? 'h-6' : totalPlayers > 8 ? 'h-7' : 'h-8';
        
        return (
            <div className={`relative bg-white/5 hover:bg-white/8 backdrop-blur-sm rounded-md border border-white/10 hover:border-white/20 transition-all duration-300 p-1.5 ${cardHeight} flex items-center`}>
                <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-shrink-0">
                        <div 
                            className="w-5 h-5 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-lg backdrop-blur-sm border border-white/20"
                            style={{ 
                                background: `linear-gradient(135deg, ${teamKitColor}ee, ${teamKitColor}bb)`
                            }}
                        >
                            {player.number || index + 1}
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white">
                            <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium tracking-wide truncate text-xs text-stroke">
                            {player.name || `Cầu thủ ${index + 1}`}
                        </h4>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex flex-col gap-0.5">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-emerald-400/60 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Component áo đấu 3D đẹp với background mới
    const Jersey3D = ({ kitColor, kitColor2, teamName, isTeamA }) => {
        // Tạo màu tương phản cho số áo
        const getContrastColor = (hexColor) => {
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#FFFFFF';
        };

        const numberColor = getContrastColor(kitColor);
        const shadowColor = numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';

        return (
            <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                    {/* Spotlight effect background */}
                    <div className="absolute -inset-8 bg-gradient-radial from-white/5 via-transparent to-transparent rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* 3D Jersey Container */}
                    <div className="relative w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56 perspective-1000">
                        <div className="relative w-full h-full transform-style-preserve-3d transition-all duration-700 group-hover:rotate-y-8 group-hover:scale-105">
                            
                            {/* Jersey Shadow Base */}
                            <div 
                                className="absolute inset-0 rounded-t-3xl rounded-b-xl transform translate-y-2 translate-x-2 opacity-30 blur-sm"
                                style={{
                                    background: `linear-gradient(145deg, #000000, #1a1a1a)`,
                                }}
                            ></div>

                            {/* Jersey Main Body */}
                            <div 
                                className="absolute inset-0 rounded-t-3xl rounded-b-xl shadow-2xl transform transition-all duration-500 group-hover:shadow-3xl"
                                style={{
                                    background: `linear-gradient(145deg, ${kitColor}ff, ${kitColor}ee 50%, ${kitColor}cc)`,
                                    boxShadow: `
                                        0 25px 50px rgba(0,0,0,0.4),
                                        inset 0 2px 4px rgba(255,255,255,0.3),
                                        inset 0 -2px 4px rgba(0,0,0,0.2)
                                    `
                                }}
                            >
                                {/* Fabric texture overlay */}
                                <div 
                                    className="absolute inset-0 rounded-t-3xl rounded-b-xl opacity-20"
                                    style={{
                                        backgroundImage: `
                                            repeating-linear-gradient(
                                                45deg,
                                                transparent,
                                                transparent 2px,
                                                rgba(255,255,255,0.1) 2px,
                                                rgba(255,255,255,0.1) 4px
                                            )
                                        `
                                    }}
                                ></div>
                                
                                {/* Highlight gradient */}
                                <div className="absolute inset-0 rounded-t-3xl rounded-b-xl bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                                
                                {/* Collar - Improved Design */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                                    <div 
                                        className="w-8 h-6 sm:w-10 sm:h-8 rounded-b-full border-2 shadow-inner"
                                        style={{ 
                                            background: `linear-gradient(180deg, ${kitColor2}ff, ${kitColor2}dd)`,
                                            borderColor: `${kitColor}aa`,
                                            boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3)`
                                        }}
                                    >
                                        {/* V-neck detail */}
                                        <div 
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-2 rounded-t-full"
                                            style={{ backgroundColor: kitColor2 }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Left Sleeve - Enhanced */}
                                <div 
                                    className="absolute -left-4 top-4 w-8 h-16 sm:w-10 sm:h-20 rounded-l-2xl shadow-xl transform -rotate-3"
                                    style={{
                                        background: `linear-gradient(90deg, ${kitColor}aa, ${kitColor}ff, ${kitColor}ee)`,
                                        boxShadow: `
                                            -5px 5px 15px rgba(0,0,0,0.3),
                                            inset 1px 1px 3px rgba(255,255,255,0.2)
                                        `
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-l-2xl bg-gradient-to-r from-black/10 to-white/10"></div>
                                </div>

                                {/* Right Sleeve - Enhanced */}
                                <div 
                                    className="absolute -right-4 top-4 w-8 h-16 sm:w-10 sm:h-20 rounded-r-2xl shadow-xl transform rotate-3"
                                    style={{
                                        background: `linear-gradient(-90deg, ${kitColor}aa, ${kitColor}ff, ${kitColor}ee)`,
                                        boxShadow: `
                                            5px 5px 15px rgba(0,0,0,0.3),
                                            inset -1px 1px 3px rgba(255,255,255,0.2)
                                        `
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-r-2xl bg-gradient-to-l from-black/10 to-white/10"></div>
                                </div>
                                
                                {/* Jersey Number - Improved Typography */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div 
                                        className="text-4xl sm:text-5xl md:text-6xl font-black text-center leading-none select-none transform transition-transform duration-300 group-hover:scale-110"
                                        style={{ 
                                            color: numberColor,
                                            textShadow: `
                                                3px 3px 0 ${shadowColor},
                                                -1px -1px 0 ${shadowColor},
                                                1px -1px 0 ${shadowColor},
                                                -1px 1px 0 ${shadowColor},
                                                1px 1px 0 ${shadowColor},
                                                0 0 10px rgba(0,0,0,0.5)
                                            `,
                                            fontFamily: 'Arial Black, sans-serif'
                                        }}
                                    >
                                        {isTeamA ? '10' : '9'}
                                    </div>
                                </div>
                                
                                {/* Brand/Sponsor Logo */}
                                <div className="absolute top-3 right-3 w-4 h-4 sm:w-6 sm:h-6 bg-white/30 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"></div>
                                </div>

                                {/* Subtle team logo watermark */}
                                <div className="absolute bottom-6 left-3 opacity-10">
                                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Animated glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Shorts - Redesigned */}
                    <div className="mt-3 relative">
                        <div 
                            className="w-20 h-12 sm:w-24 sm:h-14 md:w-28 md:h-16 rounded-xl shadow-xl mx-auto transform transition-all duration-300 group-hover:scale-105"
                            style={{
                                background: `linear-gradient(145deg, ${kitColor2}ff, ${kitColor2}dd, ${kitColor2}bb)`,
                                boxShadow: `
                                    0 15px 25px rgba(0,0,0,0.3),
                                    inset 0 2px 4px rgba(255,255,255,0.3),
                                    inset 0 -1px 2px rgba(0,0,0,0.2)
                                `
                            }}
                        >
                            {/* Shorts texture */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 via-transparent to-black/15"></div>
                            
                            {/* Side seams */}
                            <div className="absolute left-1 top-1 bottom-1 w-0.5 bg-white/20 rounded-full"></div>
                            <div className="absolute right-1 top-1 bottom-1 w-0.5 bg-white/20 rounded-full"></div>
                            
                            {/* Waistband */}
                            <div 
                                className="absolute top-0 left-0 right-0 h-2 rounded-t-xl"
                                style={{ 
                                    background: `linear-gradient(90deg, ${kitColor}aa, ${kitColor}ff, ${kitColor}aa)`
                                }}
                            ></div>
                        </div>

                        {/* Shorts shadow */}
                        <div 
                            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 rounded-xl opacity-20 blur-md -z-10"
                            style={{ backgroundColor: '#000000' }}
                        ></div>
                    </div>
                </div>
                
                {/* Team name with improved styling */}
                <div className="mt-6 text-center">
                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105">
                        <p className="text-white font-bold text-sm sm:text-base tracking-wide text-stroke">
                            {teamName}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const CompactTeamSection = ({ team, players, kitColor, kitColor2, logo, isTeamA }) => (
        <div className="w-full bg-transparent overflow-hidden rounded-lg h-full flex flex-col">
            {/* Team Header */}
            <div className="relative overflow-hidden flex-shrink-0">
                <div 
                    className="px-2 py-2 text-center relative"
                    style={{ 
                        background: `linear-gradient(135deg, ${kitColor}dd, ${kitColor}aa, ${kitColor}77)`
                    }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-t-lg"></div>
                    <div className="relative z-10">
                        <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-lg truncate text-stroke">
                            {team}
                        </h2>
                    </div>
                </div>
            </div>
            
            {/* Players List */}
            <div className="p-2 flex-1 min-h-0 overflow-y-auto">
                {players.length > 0 ? (
                    <div className="space-y-1">
                        {players.map((player, index) => (
                            <PlayerCard 
                                key={index}
                                player={player}
                                index={index}
                                teamKitColor={kitColor}
                                isTeamA={isTeamA}
                                totalPlayers={players.length}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyPlayerState />
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full h-screen overflow-hidden">
            <style>{`
                .text-stroke {
                    text-shadow: 
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                        1px 1px 0 #000,
                        -2px 0 0 #000,
                        2px 0 0 #000,
                        0 -2px 0 #000,
                        0 2px 0 #000;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-preserve-3d {
                    transform-style: preserve-3d;
                }
                .rotate-y-8 {
                    transform: rotateY(8deg);
                }
                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
            
            {/* Background với gradient mới đẹp hơn */}
            <div className="w-full h-full bg-gradient-to-br from-slate-800 via-blue-900 to-purple-900 relative overflow-hidden">
                {/* Enhanced Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                                linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)
                            `,
                            backgroundSize: '200px 200px, 300px 300px, 50px 50px'
                        }}
                    ></div>
                </div>

                {/* Dynamic Gradient Overlays */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 h-full flex flex-col">
                    {/* Main Title */}
                    <div className="px-4 py-3 sm:py-4 flex-shrink-0">
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-wider drop-shadow-lg text-stroke">
                                DANH SÁCH CẦU THỦ
                            </h1>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full"></div>
                                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full"></div>
                                <div className="w-8 h-0.5 bg-gradient-to-r from-pink-500 via-purple-400 to-transparent rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Responsive Layout */}
                    <div className="flex-1 px-2 sm:px-4 pb-16 sm:pb-20 min-h-0 overflow-hidden">
                        <div className="max-w-7xl mx-auto h-full">
                            {/* Desktop Layout */}
                            <div className="hidden lg:flex items-center justify-center gap-8 h-full">
                                <CompactTeamSection
                                    team={currentData.teamAName}
                                    players={currentData.teamAPlayers}
                                    kitColor={currentData.teamAKitColor}
                                    kitColor2={currentData.teamA2KitColor}
                                    logo={currentData.teamALogo}
                                    isTeamA={true}
                                />
                                
                                <div className="flex gap-12">
                                    <Jersey3D 
                                        kitColor={currentData.teamAKitColor}
                                        kitColor2={currentData.teamA2KitColor}
                                        teamName={currentData.teamAName}
                                        isTeamA={true}
                                    />
                                    <Jersey3D 
                                        kitColor={currentData.teamBKitColor}
                                        kitColor2={currentData.teamB2KitColor}
                                        teamName={currentData.teamBName}
                                        isTeamA={false}
                                    />
                                </div>
                                
                                <CompactTeamSection
                                    team={currentData.teamBName}
                                    players={currentData.teamBPlayers}
                                    kitColor={currentData.teamBKitColor}
                                    kitColor2={currentData.teamB2KitColor}
                                    logo={currentData.teamBLogo}
                                    isTeamA={false}
                                />
                            </div>

                            {/* Mobile & Tablet Layout */}
                            <div className="lg:hidden h-full flex flex-col">
                                {/* Jersey showcase - smaller on mobile */}
                                <div className="flex justify-center gap-2 sm:gap-4 mb-4 flex-shrink-0">
                                    <div className="scale-75 sm:scale-90">
                                        <Jersey3D 
                                            kitColor={currentData.teamAKitColor}
                                            kitColor2={currentData.teamA2KitColor}
                                            teamName={currentData.teamAName}
                                            isTeamA={true}
                                        />
                                    </div>
                                    <div className="scale-75 sm:scale-90">
                                        <Jersey3D 
                                            kitColor={currentData.teamBKitColor}
                                            kitColor2={currentData.teamB2KitColor}
                                            teamName={currentData.teamBName}
                                            isTeamA={false}
                                        />
                                    </div>
                                </div>

                                {/* Team lists - always horizontal */}
                                <div className="flex gap-2 sm:gap-4 flex-1 min-h-0">
                                    <div className="flex-1">
                                        <CompactTeamSection
                                            team={currentData.teamAName}
                                            players={currentData.teamAPlayers}
                                            kitColor={currentData.teamAKitColor}
                                            kitColor2={currentData.teamA2KitColor}
                                            logo={currentData.teamALogo}
                                            isTeamA={true}
                                        />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <CompactTeamSection
                                            team={currentData.teamBName}
                                            players={currentData.teamBPlayers}
                                            kitColor={currentData.teamBKitColor}
                                            kitColor2={currentData.teamB2KitColor}
                                            logo={currentData.teamBLogo}
                                            isTeamA={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ScoLiv Logo */}
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 z-50">
                        <div className="bg-transparent p-2 sm:p-3">
                            <img
                                src="/images/basic/ScoLivLogo.png"
                                alt="ScoLiv"
                                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-lg"
                                onError={(e) => {
                                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23007acc"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="white" font-weight="bold">ScoLiv</text></svg>`;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerList;