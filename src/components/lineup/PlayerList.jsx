import React from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';
import DisplayLogo from '../common/DisplayLogo';

const PlayerList = () => {
    const {
        matchData,
        lineupData,
        displaySettings
    } = usePublicMatch();

    // Get data from context with fallbacks
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

    return (
        <div className="w-full h-screen relative overflow-hidden bg-gray-900">
            <div className="w-full h-full relative" style={{
                transform: 'scale(var(--scale-factor, 1))',
                transformOrigin: 'center center'
            }}>
                {/* Header với logo đội */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="flex items-center justify-center space-x-8">
                        {/* Team A */}
                        <div className="flex items-center space-x-4">
                            <DisplayLogo
                                logos={[currentData.teamALogo]}
                                alt={currentData.teamAName}
                                className="w-16 h-16"
                                type_play={logoShape}
                            />
                            <div className="text-white text-xl font-bold">
                                {currentData.teamAName}
                            </div>
                        </div>

                        <div className="text-white text-2xl font-bold">VS</div>

                        {/* Team B */}
                        <div className="flex items-center space-x-4">
                            <div className="text-white text-xl font-bold">
                                {currentData.teamBName}
                            </div>
                            <DisplayLogo
                                logos={[currentData.teamBLogo]}
                                alt={currentData.teamBName}
                                className="w-16 h-16"
                                type_play={logoShape}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content - Player Lists */}
                <div className="absolute top-32 left-0 right-0 bottom-16 z-20">
                    <div className="flex justify-between h-full px-8">
                        {/* Team A Players */}
                        <div className="w-[45%] bg-black/30 backdrop-blur-sm rounded-lg p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    DANH SÁCH CẦU THỦ
                                </h2>
                                <div 
                                    className="text-lg font-semibold px-4 py-2 rounded-lg"
                                    style={{ 
                                        backgroundColor: currentData.teamAKitColor,
                                        color: '#ffffff'
                                    }}
                                >
                                    {currentData.teamAName}
                                </div>
                            </div>
                            
                            <div className="space-y-3 max-h-[calc(100%-120px)] overflow-y-auto">
                                {currentData.teamAPlayers.length > 0 ? (
                                    currentData.teamAPlayers.map((player, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                    style={{ backgroundColor: currentData.teamAKitColor }}
                                                >
                                                    {player.number || index + 1}
                                                </div>
                                                <div className="text-white">
                                                    <div className="font-semibold">{player.name || `Cầu thủ ${index + 1}`}</div>
                                                    <div className="text-sm text-gray-300">{player.position || 'Cầu thủ'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 py-8">
                                        <div className="text-lg">Chưa có danh sách cầu thủ</div>
                                        <div className="text-sm">Vui lòng cập nhật danh sách từ phần quản lý</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Team B Players */}
                        <div className="w-[45%] bg-black/30 backdrop-blur-sm rounded-lg p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    DANH SÁCH CẦU THỦ
                                </h2>
                                <div 
                                    className="text-lg font-semibold px-4 py-2 rounded-lg"
                                    style={{ 
                                        backgroundColor: currentData.teamBKitColor,
                                        color: '#ffffff'
                                    }}
                                >
                                    {currentData.teamBName}
                                </div>
                            </div>
                            
                            <div className="space-y-3 max-h-[calc(100%-120px)] overflow-y-auto">
                                {currentData.teamBPlayers.length > 0 ? (
                                    currentData.teamBPlayers.map((player, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                    style={{ backgroundColor: currentData.teamBKitColor }}
                                                >
                                                    {player.number || index + 1}
                                                </div>
                                                <div className="text-white">
                                                    <div className="font-semibold">{player.name || `Cầu thủ ${index + 1}`}</div>
                                                    <div className="text-sm text-gray-300">{player.position || 'Cầu thủ'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-400 py-8">
                                        <div className="text-lg">Chưa có danh sách cầu thủ</div>
                                        <div className="text-sm">Vui lòng cập nhật danh sách từ phần quản lý</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ScoLiv Logo */}
                <div className="absolute bottom-4 left-4 sm:left-16 z-40">
                    <img
                        src="/images/basic/ScoLivLogo.png"
                        alt="ScoLiv"
                        className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
                        onError={(e) => {
                            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="%23007acc"/><text x="32" y="38" text-anchor="middle" font-size="12" fill="white" font-weight="bold">ScoLiv</text></svg>`;
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                /* Mobile scaling for proportional zoom */
                @media (max-width: 768px) {
                    :root {
                        --scale-factor: 0.85;
                    }
                }
                
                @media (max-width: 480px) {
                    :root {
                        --scale-factor: 0.75;
                    }
                }

                /* Custom scrollbar */
                .space-y-3::-webkit-scrollbar {
                    width: 6px;
                }

                .space-y-3::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }

                .space-y-3::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }

                .space-y-3::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
};

export default PlayerList;
