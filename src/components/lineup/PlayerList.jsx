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
            <div className={`relative bg-white/5 backdrop-blur-sm rounded-md border border-white/10 p-1.5 ${cardHeight} flex items-center`}>
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

    // Component áo quần đơn giản và đẹp
    const Jersey3D = ({ kitColor, kitColor2, teamName, isTeamA }) => {
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
                {/* Kit Preview */}
                <div className="relative">
                    {/* T-Shirt với tay áo dài hơn */}
                    <div className="relative w-28 h-32 sm:w-32 sm:h-36 mx-auto">
                        {/* Main body của t-shirt */}
                        <div
                            className="w-20 h-28 sm:w-24 sm:h-32 mx-auto shadow-lg relative"
                            style={{
                                background: `linear-gradient(135deg, ${kitColor} 0%, ${kitColor}dd 70%, ${kitColor}bb 100%)`,
                                boxShadow: `0 8px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
                                borderRadius: '8px 8px 4px 4px'
                            }}
                        >
                            {/* Round neck collar - KHÔNG màu sắc */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                                <div
                                    className="w-8 h-4 sm:w-10 sm:h-5 rounded-b-full border-2 bg-white"
                                    style={{
                                        borderColor: `${kitColor}cc`
                                    }}
                                />
                            </div>

                            {/* T-shirt number */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="text-2xl sm:text-3xl font-black leading-none select-none"
                                    style={{
                                        color: numberColor,
                                        textShadow: `
                                            2px 2px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'},
                                            -1px -1px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'},
                                            1px -1px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'},
                                            -1px 1px 0 ${numberColor === '#FFFFFF' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}
                                        `
                                    }}
                                >
                                    {isTeamA ? '10' : '9'}
                                </div>
                            </div>

                            {/* T-shirt hem */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b"></div>
                        </div>

                        {/* Left sleeve của t-shirt - DÀI HỚN */}
                        <div
                            className="absolute left-0 top-1 w-6 h-16 sm:w-7 sm:h-18 rounded-lg shadow-md"
                            style={{
                                background: `linear-gradient(90deg, ${kitColor} 0%, ${kitColor}dd 100%)`,
                                boxShadow: `-2px 2px 6px rgba(0,0,0,0.15)`
                            }}
                        />

                        {/* Right sleeve của t-shirt - DÀI HỚN */}
                        <div
                            className="absolute right-0 top-1 w-6 h-16 sm:w-7 sm:h-18 rounded-lg shadow-md"
                            style={{
                                background: `linear-gradient(-90deg, ${kitColor} 0%, ${kitColor}dd 100%)`,
                                boxShadow: `2px 2px 6px rgba(0,0,0,0.15)`
                            }}
                        />
                    </div>

                    {/* Shorts với 2 ống chân riêng biệt */}
                    <div className="mt-2 relative">
                        {/* Waistband */}
                        <div
                            className="w-20 h-2 sm:w-24 sm:h-2.5 mx-auto rounded-t-md shadow-sm"
                            style={{
                                background: `linear-gradient(90deg, ${kitColor}cc 0%, ${kitColor} 50%, ${kitColor}cc 100%)`
                            }}
                        />

                        {/* 2 ống chân riêng biệt */}
                        <div className="flex justify-center space-x-1">
                            {/* Chân trái */}
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 shadow-md rounded-b-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${kitColor2} 0%, ${kitColor2}dd 70%, ${kitColor2}bb 100%)`,
                                    boxShadow: `0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
                                }}
                            >
                                {/* Seam chân trái */}
                                <div className="absolute right-0 top-1 bottom-1 w-px bg-white/20"></div>
                            </div>

                            {/* Chân phải */}
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 shadow-md rounded-b-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${kitColor2} 0%, ${kitColor2}dd 70%, ${kitColor2}bb 100%)`,
                                    boxShadow: `0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
                                }}
                            >
                                {/* Seam chân phải */}
                                <div className="absolute left-0 top-1 bottom-1 w-px bg-white/20"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team name */}
                <div className="mt-3 text-center">
                    <div
                        className="px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm"
                        style={{
                            background: `linear-gradient(135deg, ${kitColor}20 0%, ${kitColor}15 100%)`,
                            border: `1px solid ${kitColor}40`
                        }}
                    >
                        <p className="text-white font-semibold text-xs sm:text-sm tracking-wide text-stroke">
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
                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
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
