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
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
            </div>
            <h3 className="text-white/90 text-base font-semibold mb-2 text-shadow-lg">Chưa có danh sách cầu thủ</h3>
            <p className="text-white/60 text-sm leading-relaxed text-shadow-lg">Vui lòng cập nhật danh sách từ phần quản lý</p>
        </div>
    );

    const PlayerCard = ({ player, index, teamKitColor, isTeamA, totalPlayers }) => {
        const cardHeight = totalPlayers > 12 ? 'min-h-[2.5rem]' : totalPlayers > 8 ? 'min-h-[3rem]' : 'min-h-[3.5rem]';
        
        return (
            <div className={`relative bg-white/15 backdrop-blur-md rounded-xl border border-white/20 p-3 ${cardHeight} flex items-center hover:bg-white/20 transition-all duration-300 shadow-lg`}>
                <div className="flex items-center gap-3 w-full">
                    <div className="relative flex-shrink-0">
                        <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xl backdrop-blur-sm border border-white/30"
                            style={{ 
                                background: `linear-gradient(135deg, ${teamKitColor}ee, ${teamKitColor}cc, ${teamKitColor}aa)`
                            }}
                        >
                            {player.number || index + 1}
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg">
                            <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold tracking-wide truncate text-sm text-shadow-lg">
                            {player.name || `Cầu thủ ${index + 1}`}
                        </h4>
                        {player.position && (
                            <p className="text-white/70 text-xs mt-0.5 text-shadow-md">
                                {player.position}
                            </p>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex flex-col gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-md"></div>
                            <div className="w-2 h-2 bg-emerald-400/60 rounded-full shadow-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Component áo quần với 3D effect
    const Jersey3D = ({ kitColor, kitColor2, teamName, isTeamA, logo }) => {
        const getContrastColor = (hexColor) => {
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#FFFFFF';
        };

        const numberColor = getContrastColor(kitColor);

        return (
            <div className="flex flex-col items-center justify-center">
                {/* Team Logo */}
                <div className="mb-4">
                    <DisplayLogo
                        logos={[logo]}
                        alt={teamName}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-2xl"
                        type_play={logoShape}
                    />
                </div>

                {/* Kit Preview with enhanced 3D effect */}
                <div className="relative">
                    {/* T-Shirt */}
                    <div className="relative w-32 h-36 sm:w-36 sm:h-40 mx-auto">
                        {/* Main body */}
                        <div
                            className="w-24 h-32 sm:w-28 sm:h-36 mx-auto shadow-2xl relative transform perspective-1000"
                            style={{
                                background: `linear-gradient(135deg, ${kitColor} 0%, ${kitColor}dd 70%, ${kitColor}bb 100%)`,
                                boxShadow: `0 15px 35px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.15)`,
                                borderRadius: '12px 12px 6px 6px'
                            }}
                        >
                            {/* V-neck collar */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                                <div
                                    className="w-10 h-6 sm:w-12 sm:h-7 rounded-b-full border-2 bg-white shadow-md"
                                    style={{
                                        borderColor: `${kitColor}cc`
                                    }}
                                />
                            </div>

                            {/* Jersey number with better shadow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="text-3xl sm:text-4xl font-black leading-none select-none transform rotate-3"
                                    style={{
                                        color: numberColor,
                                        textShadow: `
                                            3px 3px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'},
                                            -2px -2px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'},
                                            2px -2px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'},
                                            -2px 2px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'},
                                            0 0 15px ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
                                        `
                                    }}
                                >
                                    {isTeamA ? '10' : '9'}
                                </div>
                            </div>

                            {/* Jersey hem with gradient */}
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/20 to-transparent rounded-b"></div>
                        </div>

                        {/* Enhanced sleeves */}
                        <div
                            className="absolute left-0 top-2 w-8 h-20 sm:w-9 sm:h-22 rounded-xl shadow-xl transform -rotate-12"
                            style={{
                                background: `linear-gradient(90deg, ${kitColor} 0%, ${kitColor}dd 100%)`,
                                boxShadow: `-4px 4px 12px rgba(0,0,0,0.25)`
                            }}
                        />

                        <div
                            className="absolute right-0 top-2 w-8 h-20 sm:w-9 sm:h-22 rounded-xl shadow-xl transform rotate-12"
                            style={{
                                background: `linear-gradient(-90deg, ${kitColor} 0%, ${kitColor}dd 100%)`,
                                boxShadow: `4px 4px 12px rgba(0,0,0,0.25)`
                            }}
                        />
                    </div>

                    {/* Enhanced Shorts */}
                    <div className="mt-3 relative">
                        {/* Waistband */}
                        <div
                            className="w-24 h-5 sm:w-28 sm:h-6 mx-auto rounded-t-xl shadow-lg"
                            style={{
                                background: `linear-gradient(90deg, ${kitColor2}cc 0%, ${kitColor2} 50%, ${kitColor2}cc 100%)`
                            }}
                        />

                        {/* 2 separate legs with better 3D effect */}
                        <div className="flex justify-center space-x-2">
                            <div
                                className="w-10 h-12 sm:w-12 sm:h-14 shadow-xl rounded-b-xl transform -rotate-1"
                                style={{
                                    background: `linear-gradient(135deg, ${kitColor2} 0%, ${kitColor2}dd 70%, ${kitColor2}bb 100%)`,
                                    boxShadow: `0 8px 25px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1)`
                                }}
                            >
                                <div className="absolute right-0 top-2 bottom-2 w-px bg-white/30"></div>
                            </div>

                            <div
                                className="w-10 h-12 sm:w-12 sm:h-14 shadow-xl rounded-b-xl transform rotate-1"
                                style={{
                                    background: `linear-gradient(135deg, ${kitColor2} 0%, ${kitColor2}dd 70%, ${kitColor2}bb 100%)`,
                                    boxShadow: `0 8px 25px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1)`
                                }}
                            >
                                <div className="absolute left-0 top-2 bottom-2 w-px bg-white/30"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team name with enhanced styling */}
                <div className="mt-4 text-center">
                    <div
                        className="px-4 py-2 rounded-xl shadow-xl backdrop-blur-md border border-white/30"
                        style={{
                            background: `linear-gradient(135deg, ${kitColor}30 0%, ${kitColor}20 100%)`,
                        }}
                    >
                        <p className="text-white font-bold text-sm sm:text-base tracking-wide text-shadow-lg">
                            {teamName}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const CompactTeamSection = ({ team, players, kitColor, kitColor2, logo, isTeamA }) => (
        <div className="w-full bg-white/10 backdrop-blur-md overflow-hidden rounded-2xl h-full flex flex-col border border-white/20 shadow-2xl">
            {/* Team Header with enhanced gradient */}
            <div className="relative overflow-hidden flex-shrink-0">
                <div 
                    className="px-4 py-4 text-center relative"
                    style={{ 
                        background: `linear-gradient(135deg, ${kitColor}dd, ${kitColor}bb, ${kitColor}99)`
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-t-2xl"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <DisplayLogo
                            logos={[logo]}
                            alt={team}
                            className="w-8 h-8 drop-shadow-xl"
                            type_play={logoShape}
                        />
                        <h2 className="text-sm sm:text-base font-bold text-white tracking-wide drop-shadow-lg truncate text-shadow-lg">
                            {team}
                        </h2>
                    </div>
                </div>
            </div>
            
            {/* Players List with better spacing */}
            <div className="p-4 flex-1 min-h-0 overflow-y-auto">
                {players.length > 0 ? (
                    <div className="space-y-3">
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
        <div className="w-full h-screen overflow-hidden relative">
            <style>{`
                .text-shadow-lg {
                    text-shadow: 
                        -2px -2px 0 #000,
                        2px -2px 0 #000,
                        -2px 2px 0 #000,
                        2px 2px 0 #000,
                        -3px 0 0 #000,
                        3px 0 0 #000,
                        0 -3px 0 #000,
                        0 3px 0 #000,
                        0 0 10px rgba(0,0,0,0.8);
                }
                .text-shadow-md {
                    text-shadow: 
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                        1px 1px 0 #000,
                        0 0 5px rgba(0,0,0,0.6);
                }
                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
            `}</style>
            
            {/* Background với teamlineup.jpg */}
            <div className="w-full h-full relative">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/images/basic/teamlineup.jpg')`,
                    }}
                />
                
                {/* Overlay gradient để text dễ đọc hơn */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
                
                {/* Enhanced Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
                                linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)
                            `,
                            backgroundSize: '300px 300px, 400px 400px, 100px 100px'
                        }}
                    ></div>
                </div>

                {/* Dynamic Gradient Overlays */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 h-full flex flex-col">
                    {/* Main Title with enhanced styling */}
                    <div className="px-4 py-4 sm:py-6 flex-shrink-0">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider drop-shadow-2xl text-shadow-lg">
                                DANH SÁCH CẦU THỦ
                            </h1>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full"></div>
                                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full"></div>
                                <div className="w-12 h-1 bg-gradient-to-r from-pink-500 via-purple-400 to-transparent rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Responsive Layout */}
                    <div className="flex-1 px-3 sm:px-6 pb-20 sm:pb-24 min-h-0 overflow-hidden">
                        <div className="max-w-7xl mx-auto h-full">
                            {/* Desktop Layout */}
                            <div className="hidden lg:flex items-center justify-center gap-12 h-full">
                                <div className="flex-1 max-w-sm">
                                    <CompactTeamSection
                                        team={currentData.teamAName}
                                        players={currentData.teamAPlayers}
                                        kitColor={currentData.teamAKitColor}
                                        kitColor2={currentData.teamA2KitColor}
                                        logo={currentData.teamALogo}
                                        isTeamA={true}
                                    />
                                </div>
                                
                                <div className="flex gap-16">
                                    <Jersey3D 
                                        kitColor={currentData.teamAKitColor}
                                        kitColor2={currentData.teamA2KitColor}
                                        teamName={currentData.teamAName}
                                        isTeamA={true}
                                        logo={currentData.teamALogo}
                                    />
                                    <Jersey3D 
                                        kitColor={currentData.teamBKitColor}
                                        kitColor2={currentData.teamB2KitColor}
                                        teamName={currentData.teamBName}
                                        isTeamA={false}
                                        logo={currentData.teamBLogo}
                                    />
                                </div>
                                
                                <div className="flex-1 max-w-sm">
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

                            {/* Mobile & Tablet Layout */}
                            <div className="lg:hidden h-full flex flex-col">
                                {/* Jersey showcase */}
                                <div className="flex justify-center gap-3 sm:gap-6 mb-6 flex-shrink-0">
                                    <div className="scale-75 sm:scale-85 md:scale-95">
                                        <Jersey3D 
                                            kitColor={currentData.teamAKitColor}
                                            kitColor2={currentData.teamA2KitColor}
                                            teamName={currentData.teamAName}
                                            isTeamA={true}
                                            logo={currentData.teamALogo}
                                        />
                                    </div>
                                    <div className="scale-75 sm:scale-85 md:scale-95">
                                        <Jersey3D 
                                            kitColor={currentData.teamBKitColor}
                                            kitColor2={currentData.teamB2KitColor}
                                            teamName={currentData.teamBName}
                                            isTeamA={false}
                                            logo={currentData.teamBLogo}
                                        />
                                    </div>
                                </div>

                                {/* Team lists */}
                                <div className="flex gap-3 sm:gap-6 flex-1 min-h-0">
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

                    {/* ScoLiv Logo với enhanced styling */}
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 z-50">
                        <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl">
                            <img
                                src="/images/basic/ScoLivLogo.png"
                                alt="ScoLiv"
                                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-2xl"
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
