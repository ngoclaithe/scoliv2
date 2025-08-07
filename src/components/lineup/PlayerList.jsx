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
        teamAKitColor: matchData?.teamAKitColor || "#FF0000",
        teamBKitColor: matchData?.teamBKitColor || "#0000FF",
        teamAPlayers: lineupData?.teamA || [],
        teamBPlayers: lineupData?.teamB || []
    };

    // Get logo shape from display settings
    const logoShape = displaySettings?.logoShape || "square";

    const EmptyPlayerState = () => (
        <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
            </div>
            <h3 className="text-white/90 text-base font-semibold mb-2 text-stroke">Chưa có danh sách cầu thủ</h3>
            <p className="text-white/60 text-xs leading-relaxed text-stroke">Vui lòng cập nhật danh sách từ phần quản lý</p>
        </div>
    );

    const PlayerCard = ({ player, index, teamKitColor, isTeamA, totalPlayers }) => {
        // Tính toán chiều cao động dựa trên số lượng cầu thủ
        const cardHeight = totalPlayers > 10 ? 'h-8' : totalPlayers > 8 ? 'h-10' : 'h-12';
        
        return (
        <div className={`relative bg-white/5 hover:bg-white/8 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 p-1 sm:p-1.5 ${cardHeight} flex items-center`}>
            <div className="flex items-center gap-2 w-full">
                {/* Player Number - Compact */}
                <div className="relative flex-shrink-0">
                    <div 
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-lg backdrop-blur-sm border border-white/20"
                        style={{ 
                            background: `linear-gradient(135deg, ${teamKitColor}ee, ${teamKitColor}bb)`
                        }}
                    >
                        {player.number || index + 1}
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white">
                        <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Player Info - Responsive text */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium tracking-wide truncate text-xs text-stroke">
                        {player.name || `Cầu thủ ${index + 1}`}
                    </h4>
                </div>

                {/* Status Indicator - Smaller */}
                <div className="flex-shrink-0">
                    <div className="flex flex-col gap-0.5">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-emerald-400/60 rounded-full"></div>
                        <div className="w-1 h-1 bg-emerald-400/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
        );
    };

    const TeamSection = ({ team, players, kitColor, logo, isTeamA }) => (
        <div className="flex-1 bg-transparent overflow-hidden rounded-lg">
            {/* Team Header - Compact */}
            <div className="relative overflow-hidden">
                <div 
                    className="px-3 py-2 sm:px-4 sm:py-3 text-center relative"
                    style={{ 
                        background: `linear-gradient(135deg, ${kitColor}dd, ${kitColor}aa, ${kitColor}77)`
                    }}
                >
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-t-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent rounded-t-lg"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2">
                            <DisplayLogo
                                logos={[logo]}
                                alt={team}
                                className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg"
                                type_play={logoShape}
                            />
                            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide drop-shadow-lg truncate text-stroke">
                                {team}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Players List - Compact spacing với chiều cao động */}
            <div className="p-2 sm:p-3 flex-1 flex flex-col min-h-0">
                {players.length > 0 ? (
                    <div className="flex-1 space-y-0.5 overflow-hidden">
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
            `}</style>
            {/* Scalable Container - Thu nhỏ toàn bộ như một bức ảnh */}
            <div className="w-full h-full scale-90 sm:scale-95 md:scale-100 origin-center transform">
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div 
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }}
                        ></div>
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        {/* Main Title - Compact */}
                        <div className="px-4 py-3 sm:py-4 flex-shrink-0">
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-wider drop-shadow-lg text-stroke">
                                    DANH SÁCH CẦU THỦ
                                </h1>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
                                    <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                                    <div className="w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Player Lists Container - Luôn giữ layout ngang */}
                        <div className="flex-1 px-2 sm:px-4 pb-20 sm:pb-24 min-h-0">
                            <div className="max-w-6xl mx-auto h-full">
                                {/* Luôn sử dụng flex-row, không chuyển sang flex-col */}
                                <div className="flex flex-row gap-3 sm:gap-6 h-full">
                                    <TeamSection
                                        team={currentData.teamAName}
                                        players={currentData.teamAPlayers}
                                        kitColor={currentData.teamAKitColor}
                                        logo={currentData.teamALogo}
                                        isTeamA={true}
                                    />
                                    <TeamSection
                                        team={currentData.teamBName}
                                        players={currentData.teamBPlayers}
                                        kitColor={currentData.teamBKitColor}
                                        logo={currentData.teamBLogo}
                                        isTeamA={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ScoLiv Logo */}
                        <div className="absolute bottom-6 left-8 z-50">
                            <div className="bg-transparent p-3">
                                <img
                                    src="/images/basic/ScoLivLogo.png"
                                    alt="ScoLiv"
                                    className="w-24 h-24 object-contain drop-shadow-lg"
                                    onError={(e) => {
                                        e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23007acc"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="white" font-weight="bold">ScoLiv</text></svg>`;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerList;
