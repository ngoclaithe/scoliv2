
import React, { useState } from 'react';
import { usePublicMatch } from '../../contexts/PublicMatchContext';

const ScoreboardBelow = ({
    teamAName = "Arsenal",
    teamBName = "Chelsea",
    teamALogo = "/images/teams/arsenal.png",
    teamBLogo = "/images/teams/chelsea.png",
    teamAScore = 2,
    teamBScore = 1,
    matchTime = "45'",
    teamAKitColor = "#FF0000",
    teamBKitColor = "#0000FF",
    leagueLogo = "/images/leagues/premier.png",
    scrollTextColor = "#FFFFFF",
    scrollTextBg = "#FF0000",
    scrollText = "TRỰC TIẾP: Arsenal vs Chelsea - Trận đấu đỉnh cao tại Emirates Stadium",
    scrollRepeat = 3,
    penaltyPosition = null,
    type = 1,
    showMatchTime = false
}) => {
    const {
        matchData,
        displaySettings,
        marqueeData,
        penaltyData,
        socketConnected
    } = usePublicMatch();
    
    const [currentType, setCurrentType] = useState(type);
    const [debugValues, setDebugValues] = useState({
        teamAName: "Arsenal",
        teamBName: "Chelsea",
        teamAScore: 2,
        teamBScore: 1,
        matchTime: "75'",
        teamAKitColor: "#FF0000",
        teamBKitColor: "#0000FF",
        showMatchTime: false,
        scrollText: "TRỰC TIẾP: Arsenal vs Chelsea - Trận đấu đỉnh cao tại Emirates Stadium",
        scrollTextColor: "#FFFFFF",
        scrollTextBg: "#FF0000",
        scrollRepeat: 3
    });

    const [showDebug, setShowDebug] = useState(false);

    // Test data cho 4 loại
    const testData = [
        {
            type: 1,
            teamAName: debugValues.teamAName,
            teamBName: debugValues.teamBName,
            teamALogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6mx4Lqvs5CEYiOSKn8NpwZkAPkodeXauLdw&s",
            teamBLogo: "/images/teams/chelsea.png",
            teamAScore: debugValues.teamAScore,
            teamBScore: debugValues.teamBScore,
            matchTime: debugValues.matchTime,
            teamAKitColor: debugValues.teamAKitColor,
            teamBKitColor: debugValues.teamBKitColor,
            leagueLogo: "/images/leagues/premier.png"
        },
        {
            type: 2,
            teamAName: debugValues.teamAName,
            teamBName: debugValues.teamBName,
            teamALogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6mx4Lqvs5CEYiOSKn8NpwZkAPkodeXauLdw&s",
            teamBLogo: "/images/teams/real.png",
            teamAScore: debugValues.teamAScore,
            teamBScore: debugValues.teamBScore,
            matchTime: debugValues.matchTime,
            teamAKitColor: debugValues.teamAKitColor,
            teamBKitColor: debugValues.teamBKitColor,
            leagueLogo: "/images/leagues/laliga.png"
        },
        {
            type: 3,
            teamAName: debugValues.teamAName,
            teamBName: debugValues.teamBName,
            teamALogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6mx4Lqvs5CEYiOSKn8NpwZkAPkodeXauLdw&s",
            teamBLogo: "/images/teams/liverpool.png",
            teamAScore: debugValues.teamAScore,
            teamBScore: debugValues.teamBScore,
            matchTime: debugValues.matchTime,
            teamAKitColor: debugValues.teamAKitColor,
            teamBKitColor: debugValues.teamBKitColor,
            leagueLogo: "/images/leagues/premier.png"
        },
        {
            type: 4,
            teamAName: debugValues.teamAName,
            teamBName: debugValues.teamBName,
            teamALogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6mx4Lqvs5CEYiOSKn8NpwZkAPkodeXauLdw&s",
            teamBLogo: "/images/teams/monaco.png",
            teamAScore: debugValues.teamAScore,
            teamBScore: debugValues.teamBScore,
            matchTime: debugValues.matchTime,
            teamAKitColor: debugValues.teamAKitColor,
            teamBKitColor: debugValues.teamBKitColor,
            leagueLogo: "https://logos-world.net/wp-content/uploads/2020/06/Premier-League-Logo.png"
        }
    ];

    const currentData = testData[currentType - 1];

    // Hàm tính độ sáng của màu để chọn màu chữ phù hợp
    const getTextColor = (backgroundColor) => {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const LogoImage = ({ src, alt, className = "" }) => (
        <div className={`relative ${className} rounded-full overflow-hidden p-1`}
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain rounded-full"
                style={{
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                    backgroundColor: 'transparent'
                }}
                onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23ddd" stroke="%23999" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23666">${alt.charAt(0)}</text></svg>`;
                }}
            />
        </div>
    );

    const renderScoreboardType1 = () => (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-full px-2 gap-0">
                {/* Logo team A */}
                <LogoImage src={currentData.teamALogo} alt={currentData.teamAName} className="w-14 h-14 object-contain" style={{ borderRadius: '0 !important' }} />

                {/* Score + team A name */}
                <div className="flex items-center gap-0">
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)' }}>
                        {currentData.teamAScore}
                    </div>
                    <div className="container-name-color-left flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white px-2 py-0.5 text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamAName}
                        </div>
                        <div
                            className="w-full h-3"
                            style={{ backgroundColor: currentData.teamAKitColor }}
                        />
                    </div>
                </div>

                {/* Thời gian trận đấu (nếu có) */}
                {debugValues.showMatchTime && (
                    <div className="bg-black text-white px-2 py-1 text-sm font-bold whitespace-nowrap">
                        {currentData.matchTime}
                    </div>
                )}

                {/* Score + team B name */}
                <div className="flex items-center gap-0">
                    <div className="container-name-color-right flex flex-col items-center w-[90px]">
                        <div className="w-full bg-blue-600 text-white px-2 py-0.5 text-sm font-semibold whitespace-nowrap text-center truncate text-[clamp(10px,4vw,14px)]">
                            {currentData.teamBName}
                        </div>
                        <div
                            className="w-full h-3"
                            style={{ backgroundColor: currentData.teamBKitColor }}
                        />
                    </div>
                    <div className="bg-yellow-400 text-black font-bold text-xl px-2 py-0.5 min-w-[2.2rem] text-center"
                        style={{ clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)' }}>
                        {currentData.teamBScore}
                    </div>
                </div>

                {/* Logo team B */}
                <LogoImage src={currentData.teamBLogo} alt={currentData.teamBName} className="w-14 h-14 object-contain" style={{ borderRadius: '0 !important' }} />
            </div>

            {/* Live Match Label cho Type 1 */}
            {!debugValues.showMatchTime && (
                <div className="text-center mt-2">
                    <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded animate-pulse">
                        ● TRỰC TIẾP
                    </span>
                </div>
            )}
        </div>
    );

    const renderScoreboardType2 = () => (
        <div className="flex flex-col items-center">
            <div className="relative w-full flex justify-center items-center m-0 p-0">
                {/* Scoreboard chính - Thu hẹp width */}
                <div
                    className="flex items-center justify-center relative z-10 h-8 rounded-md m-0 p-0 gap-0"
                    style={{
                        background: `linear-gradient(to right, ${currentData.teamAKitColor}, ${currentData.teamBKitColor})`,
                        overflow: 'hidden',
                        width: debugValues.showMatchTime ? '285px' : '265px', // Thu hẹp width cố định
                    }}
                >
                    {/* Team A Name */}
                    <div
                        className="text-sm font-semibold flex items-center justify-center truncate m-0 p-0 relative"
                        style={{
                            width: '120px',
                            height: '100%',
                            fontSize: 'clamp(10px, 4vw, 16px)',
                            color: getTextColor(currentData.teamAKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)', // Đổ bóng để dễ nhìn hơn
                        }}
                    >
                        {currentData.teamAName}
                    </div>

                    {/* Score A */}
                    <div
                        className="text-white font-extrabold text-2xl text-center m-0 p-0"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.5rem',
                            height: '100%',
                            lineHeight: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamAScore}
                    </div>

                    {/* Nếu có thời gian thì hiển thị */}
                    {debugValues.showMatchTime && (
                        <div className="bg-yellow-400 text-black text-xs font-bold rounded m-0"
                            style={{
                                padding: '0 4px',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {currentData.matchTime}
                        </div>
                    )}

                    {/* Score B */}
                    <div
                        className="text-white font-extrabold text-2xl text-center m-0 p-0"
                        style={{
                            WebkitTextStroke: '1px black',
                            width: '2.5rem',
                            height: '100%',
                            lineHeight: '2rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {currentData.teamBScore}
                    </div>

                    {/* Team B Name */}
                    <div
                        className="text-sm font-semibold flex items-center justify-center truncate m-0 p-0 relative"
                        style={{
                            width: '120px',
                            height: '100%',
                            fontSize: 'clamp(10px, 4vw, 16px)',
                            color: getTextColor(currentData.teamBKitColor),
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)', // Đổ bóng để dễ nhìn hơn
                        }}
                    >
                        {currentData.teamBName}
                    </div>
                </div>

                {/* Logo Team A – đè lên phía ngoài teamAName */}
                <div
                    className="absolute z-20"
                    style={{
                        left: `calc(50% - ${debugValues.showMatchTime ? '168px' : '158px'})`, // Điều chỉnh lại cho phù hợp với width mới
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-full border-2 overflow-hidden"
                        style={{
                            borderColor: currentData.teamAKitColor,
                        }}
                    >
                        <LogoImage
                            src={currentData.teamALogo}
                            alt={currentData.teamAName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Logo Team B – đè lên phía ngoài teamBName */}
                <div
                    className="absolute z-20"
                    style={{
                        right: `calc(50% - ${debugValues.showMatchTime ? '168px' : '158px'})`, // Điều chỉnh lại cho phù hợp với width mới
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-full border-2 overflow-hidden"
                        style={{
                            borderColor: currentData.teamBKitColor,
                        }}
                    >
                        <LogoImage
                            src={currentData.teamBLogo}
                            alt={currentData.teamBName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Live Match Label cho Type 2 */}
            {!debugValues.showMatchTime && (
                <div className="text-center mt-2">
                    <span className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded animate-pulse">
                        ● TRỰC TIẾP
                    </span>
                </div>
            )}
        </div>
    );

    const renderScoreboardType3 = () => (
        <div className="flex items-center justify-between w-full px-2">
            <LogoImage src={currentData.teamALogo} alt={currentData.teamAName} className="w-12 h-12" />

            <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg p-1 shadow-xl">
                {/* Team A */}
                <div className="flex items-center">
                    <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate">
                        {currentData.teamAName}
                    </div>
                    <div
                        className="w-1 h-6 ml-1 rounded-full"
                        style={{ backgroundColor: currentData.teamAKitColor }}
                    />
                </div>

                {/* Score */}
                <div className="mx-4 flex flex-col items-center">
                    <div className="flex items-center bg-white/95 px-4 py-1 rounded-md shadow-sm">
                        <span className="font-bold text-xl text-gray-900">{currentData.teamAScore}</span>
                        <span className="mx-2 text-gray-400 font-light">:</span>
                        <span className="font-bold text-xl text-gray-900">{currentData.teamBScore}</span>
                    </div>
                    {debugValues.showMatchTime && (
                        <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-medium rounded-sm mt-1">
                            {currentData.matchTime}
                        </div>
                    )}
                    {!debugValues.showMatchTime && (
                        <div className="bg-green-600 text-white px-2 py-0.5 text-xs font-medium rounded-sm mt-1 animate-pulse">
                            ● TRỰC TIẾP
                        </div>
                    )}
                </div>

                {/* Team B */}
                <div className="flex items-center">
                    <div
                        className="w-1 h-6 mr-1 rounded-full"
                        style={{ backgroundColor: currentData.teamBKitColor }}
                    />
                    <div className="text-white px-3 py-2 text-sm font-medium bg-gray-800/80 rounded-md w-[120px] truncate text-right">
                        {currentData.teamBName}
                    </div>
                </div>
            </div>

            <LogoImage src={currentData.teamBLogo} alt={currentData.teamBName} className="w-12 h-12" />
        </div>
    );

    const renderScoreboardType4 = () => (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full">
                <LogoImage src={currentData.teamALogo} alt={currentData.teamAName} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" />

                <div className="flex items-center z-20">
                    {/* Hình thang cân xuôi cho tên đội A */}
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -mr-6"
                        style={{
                            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamAName}</span>
                    </div>
                    {/* Màu áo đội A - hình bình hành khít vào hình thang xuôi */}
                    <div
                        className="w-12 h-8 -ml-3 z-0 mr-2.5"
                        style={{
                            backgroundColor: currentData.teamAKitColor,
                            clipPath: 'polygon(0% 0%, 55% 0%, 100% 100%, 45% 100%)'
                        }}
                    />
                </div>

                {/* Hình thang cân xuôi cho phần tỉ số */}
                <div className="flex flex-col items-center -mr-12 -ml-12">
                    <div
                        className="hex-logo flex items-center justify-center sm:px-3 md:px-4 relative py-1"
                        style={{
                            backgroundColor: '#213f80',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                            minHeight: '48px'
                        }}
                    >
                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center">
                            {currentData.teamAScore}
                        </div>

                        {/* Logo League - đặt vào container riêng để không bị cắt */}
                        <div className="mx-2 sm:mx-3 relative" style={{ top: '-6px' }}>
                            <LogoImage
                                src={currentData.leagueLogo}
                                alt="League"
                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0"
                            />
                        </div>

                        <div className="text-white font-bold text-lg sm:text-xl min-w-[1.5rem] sm:min-w-[2rem] text-center">
                            {currentData.teamBScore}
                        </div>
                    </div>
                    <div className={`text-white text-xs font-bold px-2 py-0.5 ${debugValues.showMatchTime ? 'bg-red-600' : 'bg-green-600'}`}>
                        {debugValues.showMatchTime ? currentData.matchTime : '● TRỰC TIẾP'}
                    </div>
                </div>

                <div className="flex items-center z-20">
                    {/* Màu áo đội B - hình bình hành khít vào hình thang xuôi */}
                    <div
                        className="w-12 h-8 -mr-3 z-0 ml-2.5"
                        style={{
                            backgroundColor: currentData.teamBKitColor,
                            clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)'
                        }}
                    />
                    {/* Hình thang cân xuôi cho tên đội B */}
                    <div
                        className="text-white text-sm font-semibold relative flex items-center justify-center w-24 h-8 sm:w-32 md:w-40 z-10 -ml-6"
                        style={{
                            background: 'linear-gradient(90deg, rgb(222, 57, 51), rgb(238, 134, 58))',
                            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                        }}
                    >
                        <span className="truncate text-center">{currentData.teamBName}</span>
                    </div>
                </div>

                <LogoImage src={currentData.teamBLogo} alt={currentData.teamBName} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" />
            </div>
        </div>
    );

    const renderScoreboard = () => {
        switch (currentType) {
            case 1: return renderScoreboardType1();
            case 2: return renderScoreboardType2();
            case 3: return renderScoreboardType3();
            case 4: return renderScoreboardType4();
            default: return renderScoreboardType1();
        }
    };

    const handleDebugChange = (key, value) => {
        setDebugValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 relative overflow-x-auto">
            {/* Debug Panel */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="px-4 py-2 bg-blue-600 text-white rounded mb-2 hover:bg-blue-700"
                >
                    {showDebug ? 'Hide Debug' : 'Show Debug'}
                </button>

                {showDebug && (
                    <div className="bg-white rounded-lg p-4 shadow-lg max-w-md max-h-96 overflow-y-auto">
                        <h3 className="font-bold mb-3 text-black">Debug Panel</h3>

                        {/* Scoreboard Type */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-black mb-1">Scoreboard Type</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setCurrentType(type)}
                                        className={`px-3 py-1 text-sm font-bold rounded ${currentType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-black hover:bg-gray-300'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Team Names */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-black mb-1">Team A Name</label>
                            <input
                                type="text"
                                value={debugValues.teamAName}
                                onChange={(e) => handleDebugChange('teamAName', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-black"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium text-black mb-1">Team B Name</label>
                            <input
                                type="text"
                                value={debugValues.teamBName}
                                onChange={(e) => handleDebugChange('teamBName', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-black"
                            />
                        </div>

                        {/* Scores */}
                        <div className="mb-3 flex space-x-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">Score A</label>
                                <input
                                    type="number"
                                    value={debugValues.teamAScore}
                                    onChange={(e) => handleDebugChange('teamAScore', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border rounded text-black"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">Score B</label>
                                <input
                                    type="number"
                                    value={debugValues.teamBScore}
                                    onChange={(e) => handleDebugChange('teamBScore', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border rounded text-black"
                                />
                            </div>
                        </div>

                        {/* Match Time */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-black mb-1">Match Time</label>
                            <input
                                type="text"
                                value={debugValues.matchTime}
                                onChange={(e) => handleDebugChange('matchTime', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-black"
                            />
                        </div>

                        {/* Show Match Time Toggle */}
                        <div className="mb-3">
                            <label className="flex items-center text-black">
                                <input
                                    type="checkbox"
                                    checked={debugValues.showMatchTime}
                                    onChange={(e) => handleDebugChange('showMatchTime', e.target.checked)}
                                    className="mr-2"
                                />
                                Show Match Time
                            </label>
                        </div>

                        {/* Team Colors */}
                        <div className="mb-3 flex space-x-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">Team A Color</label>
                                <input
                                    type="color"
                                    value={debugValues.teamAKitColor}
                                    onChange={(e) => handleDebugChange('teamAKitColor', e.target.value)}
                                    className="w-full h-8 border rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">Team B Color</label>
                                <input
                                    type="color"
                                    value={debugValues.teamBKitColor}
                                    onChange={(e) => handleDebugChange('teamBKitColor', e.target.value)}
                                    className="w-full h-8 border rounded"
                                />
                            </div>
                        </div>

                        {/* Scroll Text */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-black mb-1">Scroll Text</label>
                            <input
                                type="text"
                                value={debugValues.scrollText}
                                onChange={(e) => handleDebugChange('scrollText', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-black"
                            />
                        </div>

                        {/* Scroll Text Colors */}
                        <div className="mb-3 flex space-x-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">Scroll Text Color</label>
                                <input
                                    type="color"
                                    value={debugValues.scrollTextColor}
                                    onChange={(e) => handleDebugChange('scrollTextColor', e.target.value)}
                                    className="w-full h-8 border rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-black mb-1">Scroll Background</label>
                                <input
                                    type="color"
                                    value={debugValues.scrollTextBg}
                                    onChange={(e) => handleDebugChange('scrollTextBg', e.target.value)}
                                    className="w-full h-8 border rounded"
                                />
                            </div>
                        </div>

                        {/* Scroll Repeat */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-black mb-1">Scroll Repeat</label>
                            <input
                                type="number"
                                value={debugValues.scrollRepeat}
                                onChange={(e) => handleDebugChange('scrollRepeat', parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1 border rounded text-black"
                                min="1"
                                max="10"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ScoLiv Logo - Responsive cho desktop và mobile */}
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

            {/* Main Scoreboard */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                <div className="scoreboard-main bg-transparent rounded-lg shadow-2xl min-w-[400px] py-3">
                    {renderScoreboard()}
                </div>
            </div>

            {/* Scrolling Text */}
            <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden" style={{ backgroundColor: debugValues.scrollTextBg }}>
                <div
                    className="animate-scroll whitespace-nowrap py-2 text-sm font-semibold"
                    style={{
                        color: debugValues.scrollTextColor,
                        animation: 'scroll 30s linear infinite'
                    }}
                >
                    {Array(debugValues.scrollRepeat).fill(debugValues.scrollText).join(' • ')}
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                
                /* Ensure horizontal layout on mobile */
                @media (max-width: 768px) {
                    .scoreboard-main {
                        min-width: 350px;
                        max-width: 95vw;
                    }
                    
                    .container-name-color-left,
                    .container-name-color-right {
                        min-width: 60px;
                    }
                }
                
                /* Logo styling to prevent corner cutting */
                .logo-container {
                    border-radius: 50%;
                    overflow: hidden;
                    background: white;
                    padding: 2px;
                }
            `}</style>
        </div>
    );
};

export default ScoreboardBelow;