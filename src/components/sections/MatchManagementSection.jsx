import React, { useState, useCallback, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import ScoreDisplay from "../scoreboard/ScoreDisplay";
import PosterManager from "../poster/PosterManager";
import TeamLineupModal from "../lineup/TeamLineupModal";
import Modal from "../common/Modal";
import SimplePenaltyModal from "../common/SimplePenaltyModal";
import { useMatch } from "../../contexts/MatchContext";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from 'react-toastify';
import audioUtils from '../../utils/audioUtils';

import LogoAPI from '../../API/apiLogo';
import MatchTimeDisplay from './MatchTimeDisplay';

const MatchManagementSection = ({ isActive = true }) => {
  // Sử dụng MatchContext thay vì state local
  const {
    matchData,
    matchStats,
    futsalErrors,
    penaltyData,

    displaySettings,

    updateScore,
    updateMatchInfo,
    updateMatchTime,
    updateStats,
    updateTemplate,
    updatePoster,
    updateTeamNames,
    updateTeamLogos,
    updateFutsalErrors,
    updatePenalty,

    updateView,
    resumeTimer,
    updateMarquee,

    // Logo update functions
    updateSponsors,
    updateOrganizing,
    updateMediaPartners,
    updateTournamentLogo,
    updateLiveUnit,
    updateDisplaySettings,

  } = useMatch();

  const { matchCode } = useAuth();

  // Audio state management
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState(null);

  // State cho các tùy chọn điều khiển UI
  const [selectedOption, setSelectedOption] = useState("gioi-thieu");
  const [clockSetting, setClockSetting] = useState("khong");
  const [clockText, setClockText] = useState("");
  const [showMatchInfo, setShowMatchInfo] = useState(false);

  // State cho custom time
  const [customTime, setCustomTime] = useState("");
  const [customSeconds, setCustomSeconds] = useState("");
  const [quickCustomMinutes, setQuickCustomMinutes] = useState(""); // Phút
  const [tickerColor, setTickerColor] = useState("#ffffff");

  // State cho thông tin đội và trận đấu
  const [teamAInfo, setTeamAInfo] = useState({
    name: matchData.teamA.name || "",
    logo: matchData.teamA.logo || ""
  });
  const [teamBInfo, setTeamBInfo] = useState({
    name: matchData.teamB.name || "",
    logo: matchData.teamB.logo || ""
  });
  const [matchTitle, setMatchTitle] = useState(matchData.title || "");
  const [liveUnit, setLiveUnit] = useState(matchData.liveUnit || "");

  // Sync team info khi matchData thay đổi (từ server)
  useEffect(() => {
    setTeamAInfo(prev => ({
      name: matchData.teamA.name || prev.name,
      logo: matchData.teamA.logo || prev.logo
    }));
    setTeamBInfo(prev => ({
      name: matchData.teamB.name || prev.name,
      logo: matchData.teamB.logo || prev.logo
    }));
  }, [matchData.teamA.name, matchData.teamA.logo, matchData.teamB.name, matchData.teamB.logo]);
  const [matchInfo, setMatchInfo] = useState({
    startTime: matchData.startTime || "19:30",
    location: matchData.stadium || "SÂN VẬN ĐỘNG QUỐC GIA",
    matchDate: matchData.matchDate || new Date().toISOString().split('T')[0]
  });

  // Sync match info khi matchData thay đổi
  useEffect(() => {
    if (matchData.startTime || matchData.stadium || matchData.matchDate) {
      setMatchInfo(prev => ({
        startTime: matchData.startTime || prev.startTime,
        location: matchData.stadium || prev.location,
        matchDate: matchData.matchDate || prev.matchDate
      }));
    }
  }, [matchData.startTime, matchData.stadium, matchData.matchDate]);


  const playAudioForAction = (audioType) => {
    if (!isActive || !audioEnabled) {
      return;
    }

    audioUtils.playAudio(audioType);
    setIsPlaying(true);
    setCurrentAudioFile(audioType);
  };

  const pauseCurrentAudio = () => {
    audioUtils.stopAllAudio();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const resumeCurrentAudio = () => {
    if (currentAudioFile) {
      audioUtils.playAudio(currentAudioFile);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const stopCurrentAudio = () => {
    audioUtils.stopAllAudio();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentAudioFile(null);
  };

  const toggleAudioEnabled = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    audioUtils.setAudioEnabled(newState);
    if (!newState) {
      stopCurrentAudio();
    }
  };

  useEffect(() => {
    if (!isActive && isPlaying) {
      pauseCurrentAudio();
    }
  }, [isActive, isPlaying]);

  // State cho chế độ ch���nh sửa thống kê
  const [isEditingStats, setIsEditingStats] = useState(false);

  // Skin data configuration
  const skinData = {
    1: { name: "Template 1", image: "/images/templates/skin1.png" },
    2: { name: "Template 2", image: "/images/templates/skin2.png" },
    3: { name: "Template 3", image: "/images/templates/skin3.png" },
    4: { name: "Template 4", image: "/images/templates/skin4.png" },
    5: { name: "Template 5", image: "/images/templates/skin5.png" }
  };

  // State cho modals
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [logoCodeA, setLogoCodeA] = useState("");
  const [logoCodeB, setLogoCodeB] = useState("");
  const [isSearchingLogoA, setIsSearchingLogoA] = useState(false);
  const [isSearchingLogoB, setIsSearchingLogoB] = useState(false);

  // Xử lý tìm kiếm logo cho đội A
  const handleSearchLogoA = async () => {
    if (!logoCodeA.trim()) return;

    setIsSearchingLogoA(true);
    try {
      const response = await LogoAPI.searchLogosByCode(logoCodeA.trim(), true);
      if (response.success && response.data && response.data.length > 0) {
        const logo = response.data[0];
        setTeamAInfo(prev => ({ ...prev, logo: logo.url_logo }));
        setLogoCodeA("");
      } else {
        toast.error(`⚠️ Không tìm thấy logo với code "${logoCodeA}"`);
      }
    } catch (error) {
      toast.error('❌ Lỗi tìm kiếm logo A');
    } finally {
      setIsSearchingLogoA(false);
    }
  };

  // Xử lý tìm kiếm logo cho đội B
  const handleSearchLogoB = async () => {
    if (!logoCodeB.trim()) return;

    setIsSearchingLogoB(true);
    try {
      const response = await LogoAPI.searchLogosByCode(logoCodeB.trim(), true);
      if (response.success && response.data && response.data.length > 0) {
        const logo = response.data[0];
        setTeamBInfo(prev => ({ ...prev, logo: logo.url_logo }));
        setLogoCodeB("");
      } else {
        toast.error(`⚠️ Không tìm thấy logo với code "${logoCodeB}"`);
      }
    } catch (error) {
      toast.error('❌ Lỗi tìm kiếm logo B');
    } finally {
      setIsSearchingLogoB(false);
    }
  };

  // Memoized callback to prevent infinite loops
  const handlePenaltyChange = useCallback((newPenaltyData) => {
    updatePenalty(newPenaltyData);
    updateView('penalty_scoreboard');
    setSelectedOption("penalty");
  }, [updatePenalty, updateView]);

  const handleScoreChange = (team, increment) => {
    updateScore(team, increment);
  };

  // Hàm cập nhật thống kê
  const updateStat = (statKey, team, value) => {
    const newStats = {
      ...matchStats,
      [statKey]: {
        ...matchStats[statKey],
        [team]: Math.max(0, parseInt(value) || 0)
      }
    };
    updateStats(newStats);
  };

  // Hàm cập nhật kiểm soát bóng (đảm bảo tổng = 100%)
  const updatePossession = (team, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    const otherTeam = team === 'team1' ? 'team2' : 'team1';
    const otherValue = 100 - newValue;

    const newStats = {
      ...matchStats,
      possession: {
        [team]: newValue,
        [otherTeam]: otherValue
      }
    };
    updateStats(newStats);
  };

  // Component để hiển thị/chỉnh sửa thống kê
  const EditableStatBar = ({ label, statKey, team1Value, team2Value, isPercentage = false, onUpdate }) => {
    if (!isEditingStats) {
      // Chế đ��� hiển thị
      return (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">{team1Value}{isPercentage ? '%' : ''}</span>
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-semibold">{team2Value}{isPercentage ? '%' : ''}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-red-500"
                style={{
                  width: isPercentage
                    ? `${team1Value}%`
                    : `${team1Value === 0 && team2Value === 0 ? 50 : (team1Value / (team1Value + team2Value)) * 100}%`
                }}
              ></div>
              <div
                className="bg-gray-800"
                style={{
                  width: isPercentage
                    ? `${team2Value}%`
                    : `${team1Value === 0 && team2Value === 0 ? 50 : (team2Value / (team1Value + team2Value)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    // Chế độ chỉnh sửa
    return (
      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
        <div className="text-center">
          <span className="font-medium text-gray-700 text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {/* <label className="hidden sm:block text-xs text-red-600 font-medium mb-1">Đội A</label> */}
            <input
              type="number"
              min="0"
              max={isPercentage ? "100" : "99"}
              value={team1Value}
              onChange={(e) => onUpdate('team1', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-red-500 focus:outline-none text-center"
            />
          </div>
          <div className="text-gray-400 text-sm">vs</div>
          <div className="flex-1">
            {/* <label className="hidden sm:block text-xs text-gray-800 font-medium mb-1">Đội B</label> */}
            <input
              type="number"
              min="0"
              max={isPercentage ? "100" : "99"}
              value={team2Value}
              onChange={(e) => onUpdate('team2', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-gray-700 focus:outline-none text-center"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sm:p-0 space-y-0 sm:space-y-0">
      {/* Scoreboard */}
      <div className="sm:p-0 shadow-xl h-auto">
        {displaySettings.selectedSkin && skinData[displaySettings.selectedSkin] ? (
          <div className="w-full h-8 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={skinData[displaySettings.selectedSkin].image}
              alt={skinData[displaySettings.selectedSkin].name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
              <span className="text-gray-600 font-medium">
                {skinData[displaySettings.selectedSkin].name}
              </span>
            </div>
          </div>
        ) : (
          <ScoreDisplay
            teamA={matchData.teamA}
            teamB={matchData.teamB}
            matchTime={matchData.matchTime}
            period={matchData.period}
            status={matchData.status}
            backgroundColor="bg-transparent"
            size="md"
          />
        )}
      </div>

      {/* Score Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-4 border border-blue-200">
        {/* Hiển thị thời gian trận đấu khi đang diễn ra */}
        <MatchTimeDisplay
          matchTime={matchData.matchTime}
          period={matchData.period}
          status={matchData.status}
        />

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Đ���i A */}
          <div className="bg-white rounded-lg p-1.5 sm:p-3 shadow-md border border-blue-200">
            <div className="flex space-x-1">
              <Button
                variant="primary"
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-7 sm:h-9 text-sm sm:text-base"
                style={{flex: 2}}
                onClick={() => handleScoreChange("teamA", 1)}
              >
                <span className="text-sm sm:text-lg">+</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-7 sm:h-9 text-sm sm:text-base"
                style={{flex: 1}}
                onClick={() => handleScoreChange("teamA", -1)}
              >
                <span className="text-sm sm:text-lg">-</span>
              </Button>
            </div>
          </div>

          {/* Đội B */}
          <div className="bg-white rounded-lg p-1.5 sm:p-3 shadow-md border border-purple-200">
            <div className="flex space-x-1">
              <Button
                variant="primary"
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-7 sm:h-9 text-sm sm:text-base"
                style={{flex: 2}}
                onClick={() => handleScoreChange("teamB", 1)}
              >
                <span className="text-sm sm:text-lg">+</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 h-7 sm:h-9 text-sm sm:text-base"
                style={{flex: 1}}
                onClick={() => handleScoreChange("teamB", -1)}
              >
                <span className="text-sm sm:text-lg">-</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Nút TẠM DỪNG, NGH�� GIỮA HIỆP và THÔNG TIN */}
        <div className="flex justify-center items-center mt-2 space-x-2">
          {/* Audio Pause/Play Button */}
          <Button
            variant="primary"
            size="sm"
            className={`px-2 py-1 ${isPlaying
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              : isPaused
                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
              } text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
            onClick={() => {
              console.log('🎵 [MatchManagement] Audio pause/play clicked - isPlaying:', isPlaying, 'isPaused:', isPaused);

              if (isPlaying) {
                // Nếu đang phát -> pause
                console.log('⏸️ [MatchManagement] Pausing current audio');
                pauseCurrentAudio();
                toast.info('⏸️ Đã tạm dừng audio');
              } else if (isPaused && currentAudioFile) {
                // Nếu đang pause và có audio -> resume
                console.log('▶️ [MatchManagement] Resuming paused audio');
                resumeCurrentAudio();
                toast.info('▶️ Đã tiếp tục phát audio');
              } else {
                // Không có audio nào -> toggle audio enabled
                console.log('ὐ9 [MatchManagement] No audio to resume, toggling audio enabled state');
                toggleAudioEnabled();
                toast.info(audioEnabled ? '🔇 Đã tắt audio tĩnh' : '🔊 Đã bật audio tĩnh');
              }
            }}
            title={
              isPlaying
                ? "Tạm dừng audio đang phát"
                : isPaused && currentAudioFile
                  ? "Tiếp tục phát audio"
                  : audioEnabled
                    ? "Tắt audio tĩnh"
                    : "Bật audio tĩnh"
            }
          >
            <span className="mr-1">
              {isPlaying ? "⏸️" : isPaused && currentAudioFile ? "▶️" : audioEnabled ? "🔊" : "🔇"}
            </span>
            <span className="hidden sm:inline">
              {isPlaying ? "PAUSE" : isPaused && currentAudioFile ? "RESUME" : audioEnabled ? "AUDIO" : "OFF"}
            </span>
            <span className="sm:hidden">
              {isPlaying ? "⏸️" : isPaused && currentAudioFile ? "���️" : audioEnabled ? "ON" : "OFF"}
            </span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            className={`px-2 py-1 ${matchData.status === "paused"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              } text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200`}
            onClick={() => {
              if (matchData.status === "paused") {
                // Resume timer từ server
                resumeTimer();
                toast.info('▶️ Đã tiếp tục timer từ server');
              } else {
                // Pause timer - sử dụng updateMatchTime với status paused
                updateMatchTime(matchData.matchTime, matchData.period, "paused");
                toast.info('⏸️ Đã tạm dừng timer');
              }
            }}
          >
            <span className="mr-1">{matchData.status === "paused" ? "▶️" : "⏸️"}</span>
            <span className="hidden sm:inline">{matchData.status === "paused" ? "TIẾP TỤC" : "TẠM DỪNG"}</span>
            <span className="sm:hidden">{matchData.status === "paused" ? "TIẾP" : "DỪNG"}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => setShowMatchInfo(!showMatchInfo)}
          >
            <span className="mr-1">ℹ️</span>
            <span className="hidden sm:inline">THÔNG TIN</span>
            <span className="sm:hidden">INFO</span>
          </Button>


        </div>
      </div>

      {showMatchInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 border border-blue-200 space-y-2">
          {/* Tên trận đấu & Đơn vị live - 1 hàng */}
          <div className="grid grid-cols-2 gap-1">
            <input
              type="text"
              placeholder="Tên trận đấu"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
              className="w-full min-w-0 px-2 py-1 text-xs font-medium text-center text-blue-700 bg-white border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              maxLength={50}
            />
            <input
              type="text"
              placeholder="Đơn v�� live"
              value={liveUnit}
              onChange={(e) => setLiveUnit(e.target.value)}
              className="w-full min-w-0 px-2 py-1 text-xs font-medium text-center text-blue-700 bg-white border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
              maxLength={50}
            />
          </div>

          {/* Tên đội */}
          <div className="flex gap-1 items-center">
            <input
              type="text"
              placeholder="Đội A"
              value={teamAInfo.name}
              onChange={(e) => setTeamAInfo(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0 px-2 py-1 text-xs font-medium text-center text-red-600 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-300"
              maxLength={20}
            />
            <span className="text-xs font-bold text-gray-500 px-1 flex-shrink-0">VS</span>
            <input
              type="text"
              placeholder="Đội B"
              value={teamBInfo.name}
              onChange={(e) => setTeamBInfo(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0 px-2 py-1 text-xs font-medium text-center text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
              maxLength={20}
            />
          </div>

          {/* Logo đội - compact */}
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-red-600 flex-shrink-0">A:</span>
              <input
                type="text"
                placeholder="Code"
                value={logoCodeA}
                onChange={(e) => setLogoCodeA(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearchLogoA()}
                className="w-16 min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-red-500 text-center bg-white flex-shrink-0"
              />
              <button
                onClick={handleSearchLogoA}
                disabled={!logoCodeA.trim() || isSearchingLogoA}
                className="px-1 py-1 text-xs border border-red-500 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex-shrink-0"
              >
                {isSearchingLogoA ? '���' : '🔍'}
              </button>
              {teamAInfo.logo && (
                <div className="w-4 h-4 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                  <img src={teamAInfo.logo} alt="A" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-gray-800 flex-shrink-0">B:</span>
              <input
                type="text"
                placeholder="Code"
                value={logoCodeB}
                onChange={(e) => setLogoCodeB(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearchLogoB()}
                className="w-16 min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-gray-700 text-center bg-white flex-shrink-0"
              />
              <button
                onClick={handleSearchLogoB}
                disabled={!logoCodeB.trim() || isSearchingLogoB}
                className="px-1 py-1 text-xs border border-gray-700 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50 flex-shrink-0"
              >
                {isSearchingLogoB ? '⏳' : '🔍'}
              </button>
              {teamBInfo.logo && (
                <div className="w-4 h-4 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                  <img src={teamBInfo.logo} alt="B" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Màu áo - 1 hàng compact */}
          <div className="grid grid-cols-2 gap-1">
            {/* Đội A */}
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-red-600 flex-shrink-0">A:</span>
              <input
                type="color"
                value={teamAInfo.shirtColor || '#ff0000'}
                onChange={(e) => setTeamAInfo(prev => ({ ...prev, shirtColor: e.target.value }))}
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                title="Áo A"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">Áo</span>
            </div>
            {/* Đội B */}
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-gray-800 flex-shrink-0">B:</span>
              <input
                type="color"
                value={teamBInfo.shirtColor || '#000000'}
                onChange={(e) => setTeamBInfo(prev => ({ ...prev, shirtColor: e.target.value }))}
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer flex-shrink-0"
                title="Áo B"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">Áo</span>
            </div>
          </div>

          {/* Thời gian & Địa điểm - 1 h��ng */}
          <div className="grid grid-cols-3 gap-1">
            <input
              type="date"
              value={matchInfo.matchDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, matchDate: e.target.value }))}
              className="w-full min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
            />
            <input
              type="time"
              value={matchInfo.startTime}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
            />
            <input
              type="text"
              placeholder="Sân..."
              value={matchInfo.location}
              onChange={(e) => setMatchInfo(prev => ({ ...prev, location: e.target.value }))}
              className="w-full min-w-0 px-1 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center bg-white"
              maxLength={20}
            />
          </div>

          {/* Nút áp dụng - compact */}
          <div className="flex justify-center pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                updateTeamNames(teamAInfo.name || matchData.teamA.name, teamBInfo.name || matchData.teamB.name);
                updateTeamLogos(
                  teamAInfo.logo || matchData.teamA.logo || "",
                  teamBInfo.logo || matchData.teamB.logo || ""
                );
                updateMatchInfo({
                  startTime: matchInfo.startTime,
                  stadium: matchInfo.location,
                  matchDate: matchInfo.matchDate || new Date().toISOString().split('T')[0],
                  title: matchTitle,
                  time: matchInfo.startTime
                });
                // Emit team kit colors via socket
                const teamColorsData = {
                  teamAKitColor: teamAInfo.shirtColor || '#ff0000',
                  teamBKitColor: teamBInfo.shirtColor || '#000000'
                };

                // Update team kit colors in MatchContext with logo URLs
                updateMatchInfo({
                  ...teamColorsData,
                  startTime: matchInfo.startTime,
                  stadium: matchInfo.location,
                  matchDate: matchInfo.matchDate || new Date().toISOString().split('T')[0],
                  title: matchTitle,
                  time: matchInfo.startTime,
                  liveUnit: liveUnit,
                  logoTeamA: teamAInfo.logo || matchData.teamA.logo || "",
                  logoTeamB: teamBInfo.logo || matchData.teamB.logo || ""
                });


                toast.success('✅ Đã cập nhật thông tin trận đấu và màu áo thành công!');
              }}
              className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xs rounded shadow transform hover:scale-105 transition-all duration-200"
            >
              ÁP DỤNG
            </Button>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedOption("thong-so")}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 shadow-md ${selectedOption === "thong-so"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl"
              : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300"
              }`}
          >
            <span className="mr-0.5 text-xs">📊</span>
            <span className="hidden sm:inline">THÔNG SỐ</span>
            <span className="sm:hidden">TS</span>
          </button>
          <button
            onClick={() => setSelectedOption("dieu-khien")}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 shadow-md ${selectedOption === "dieu-khien"
              ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-xl"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
          >
            <span className="mr-0.5 text-xs">����</span>
            <span className="hidden sm:inline">ĐIỀU KHIỂN</span>
            <span className="sm:hidden">DK</span>
          </button>
          <button
            onClick={() => {
              setSelectedOption(selectedOption === "chon-skin" ? "dieu-khien" : "chon-skin");
            }}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 shadow-md ${selectedOption === "chon-skin"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl"
              : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300"
              }`}
          >
            <span className="mr-0.5 text-xs">🎨</span>
            <span className="hidden sm:inline">Skin</span>
            <span className="sm:hidden">Skin</span>
          </button>
        </div>
      </div>

      {/* Inline Template Selection */}
      {selectedOption === "chon-skin" && (
        <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg border border-gray-200 animate-slide-up">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((skinNumber) => (
              <div
                key={skinNumber}
                onClick={() => {
                  updateTemplate(skinNumber);
                }}
                className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${displaySettings.selectedSkin === skinNumber
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300"
                  }`}
              >
                <img
                  src={`/images/templates/skin${skinNumber}.png`}
                  alt={`Template ${skinNumber}`}
                  className="w-full h-12 sm:h-20 object-contain bg-gray-50"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-12 sm:h-20 bg-gray-100 items-center justify-center hidden">
                  <span className="text-gray-500 font-medium text-xs">T{skinNumber}</span>
                </div>

                {displaySettings.selectedSkin === skinNumber && (
                  <div className="absolute top-0.5 right-0.5 bg-blue-500 text-white rounded-full w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center">
                    <span className="text-xs sm:text-sm">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Tab Thông số */}
      {selectedOption === "thong-so" && (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="space-y-4">
            {/* Header với nút chỉnh sửa */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Thông số trận đấu</h3>
              <Button
                variant={isEditingStats ? "primary" : "outline"}
                size="sm"
                onClick={() => setIsEditingStats(!isEditingStats)}
                className="flex items-center space-x-1"
              >
                <span>{isEditingStats ? "💾" : "✏️"}</span>
                <span className="text-xs">{isEditingStats ? "Lưu" : "Sửa"}</span>
              </Button>
            </div>

            {/* Stats Display */}
            <div className="space-y-3">
              {/* Kiểm soát bóng */}
              <EditableStatBar
                label="Kiểm soát bóng"
                statKey="possession"
                team1Value={matchStats.possession.team1}
                team2Value={matchStats.possession.team2}
                isPercentage={true}
                onUpdate={(team, value) => updatePossession(team, value)}
              />

              {/* Tổng số cú sút */}
              <EditableStatBar
                label="Tổng số cú sút"
                statKey="totalShots"
                team1Value={matchStats.totalShots.team1}
                team2Value={matchStats.totalShots.team2}
                onUpdate={(team, value) => updateStat('totalShots', team, value)}
              />

              {/* Sút trúng đích */}
              <EditableStatBar
                label="Sút trúng đích"
                statKey="shotsOnTarget"
                team1Value={matchStats.shotsOnTarget.team1}
                team2Value={matchStats.shotsOnTarget.team2}
                onUpdate={(team, value) => updateStat('shotsOnTarget', team, value)}
              />

              {/* Phạt góc */}
              <EditableStatBar
                label="Phạt g��c"
                statKey="corners"
                team1Value={matchStats.corners.team1}
                team2Value={matchStats.corners.team2}
                onUpdate={(team, value) => updateStat('corners', team, value)}
              />

              {/* Thẻ vàng */}
              <EditableStatBar
                label="Thẻ vàng"
                statKey="yellowCards"
                team1Value={matchStats.yellowCards.team1}
                team2Value={matchStats.yellowCards.team2}
                onUpdate={(team, value) => updateStat('yellowCards', team, value)}
              />

              {/* Phạm lỗi */}
              <EditableStatBar
                label="Phạm lỗi"
                statKey="fouls"
                team1Value={matchStats.fouls.team1}
                team2Value={matchStats.fouls.team2}
                onUpdate={(team, value) => updateStat('fouls', team, value)}
              />

              {/* Lỗi Futsal */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
                <div className="text-center">
                  <span className="font-medium text-gray-700 text-sm">Lỗi Futsal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="hidden sm:block text-xs text-red-600 font-medium mb-1">Đội A</label>
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 text-xs border-0 hover:bg-red-50 text-red-600"
                        onClick={() => updateFutsalErrors('teamA', -1)}
                      >
                        -
                      </Button>
                      <div className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold min-w-8 text-center">
                        {futsalErrors.teamA}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 text-xs border-0 hover:bg-red-50 text-red-600"
                        onClick={() => updateFutsalErrors('teamA', 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">vs</div>
                  <div className="flex-1">
                    <label className="hidden sm:block text-xs text-gray-800 font-medium mb-1">Đội B</label>
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 text-xs border-0 hover:bg-gray-50 text-gray-600"
                        onClick={() => updateFutsalErrors('teamB', -1)}
                      >
                        -
                      </Button>
                      <div className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-bold min-w-8 text-center">
                        {futsalErrors.teamB}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 text-xs border-0 hover:bg-gray-50 text-gray-600"
                        onClick={() => updateFutsalErrors('teamB', 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Control buttons */}
            <div className="flex justify-center pt-4 border-t border-gray-200">
              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  updateStats({
                    possession: { team1: 50, team2: 50 },
                    totalShots: { team1: 0, team2: 0 },
                    shotsOnTarget: { team1: 0, team2: 0 },
                    corners: { team1: 0, team2: 0 },
                    yellowCards: { team1: 0, team2: 0 },
                    fouls: { team1: 0, team2: 0 },
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-1">🔄</span>
                ĐẶT LẠI TẤT CẢ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Options - Các action buttons điều khiển */}
      {selectedOption === "dieu-khien" && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 sm:p-3 border border-indigo-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
            {/* Poster */}
            <button
              onClick={() => {
                playAudioForAction('poster');
                setShowPosterModal(true);
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🎨</span>
              <span className="text-xs font-bold text-center">POSTER</span>
            </button>

            {/* Danh sách */}
            <button
              onClick={() => {
                setShowLineupModal(true);
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">📋</span>
              <span className="text-xs font-bold text-center">DANH SÁCH</span>
            </button>

            {/* Penalty */}
            <button
              onClick={() => setShowPenaltyModal(true)}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">⚽</span>
              <span className="text-xs font-bold text-center">PENALTY</span>
            </button>

            {/* Đếm 0 */}
            <button
              onClick={() => {
                const timeString = "00:00";
                updateMatchTime(timeString, "Hiệp 1", "live");
                updateView('scoreboard');
                playAudioForAction('gialap');
                toast.success('⏰ Đã bắt đầu timer từ 0:00!');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1"></span>
              <span className="text-xs font-bold text-center">ĐẾM 0</span>
            </button>

            {/* Đếm 25' */}
            <button
              onClick={() => {
                const timeString = "20:00";
                updateMatchTime(timeString, "Hiệp 1", "live");
                updateView('scoreboard');
                playAudioForAction('gialap');
                toast.success('⏰ Đã bắt đầu timer từ 20:00!');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕐</span>
              <span className="text-xs font-bold text-center">ĐẾM 20'</span>
            </button>

            {/* Đếm 30' */}
            <button
              onClick={() => {
                const timeString = "30:00";
                updateMatchTime(timeString, "Hiệp 1", "live");
                updateView('scoreboard');
                playAudioForAction('gialap');
                toast.success('⏰ Đã bắt đầu timer từ 30:00!');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕑</span>
              <span className="text-xs font-bold text-center">ĐẾM 30'</span>
            </button>

            {/* Đếm 35' */}
            <button
              onClick={() => {
                const timeString = "35:00";
                updateMatchTime(timeString, "Hiệp 1", "live");
                updateView('scoreboard');
                playAudioForAction('gialap');
                toast.success('⏰ Đã bắt đầu timer từ 35:00!');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕒</span>
              <span className="text-xs font-bold text-center">ĐẾM 35'</span>
            </button>

            {/* Đếm 40' */}
            <button
              onClick={() => {
                const timeString = "40:00";
                updateMatchTime(timeString, "Hiệp 1", "live");
                updateView('scoreboard');
                playAudioForAction('gialap');
                toast.success('⏰ Đã bắt đầu timer từ 40:00!');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕓</span>
              <span className="text-xs font-bold text-center">ĐẾM 40'</span>
            </button>

            {/* Đếm 45' */}
            <button
              onClick={() => {
                const timeString = "45:00";
                updateMatchTime(timeString, "Hi���p 1", "live");
                updateView('scoreboard');
                playAudioForAction('gialap');
                toast.success('⏰ Đã bắt đầu timer từ 45:00!');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🕔</span>
              <span className="text-xs font-bold text-center">ĐẾM 45'</span>
            </button>

            {/* Giới thiệu */}
            <button
              onClick={() => {
                updateView('intro');
                playAudioForAction('poster');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {/* <span className="text-sm mr-1"></span> */}
              <span className="text-xs font-bold text-center">GIỚI THIỆU</span>
            </button>

            {/* Tỉ số trên */}
            <button
              onClick={() => {
                updateView('scoreboard');
                playAudioForAction('gialap');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">📊</span>
              <span className="text-xs font-bold text-center">TỈ SỐ TRÊN</span>
            </button>

            {/* Tỉ số dứới */}
            <button
              onClick={() => {
                updateView('scoreboard_below');
                playAudioForAction('rasan');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">📊</span>
              <span className="text-xs font-bold text-center">TỈ SỐ DƯỚI</span>
            </button>

            {/* Nghỉ giữa hiệp */}
            <button
              onClick={() => {
                updateView('halftime');
                playAudioForAction('poster');
              }}
              className="flex flex-row items-center justify-center p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm mr-1">🥤</span>
              <span className="text-xs font-bold text-center">NGHỈ GIỮA</span>
            </button>
          </div>

          {/* Đếm T - Input phút đơn giản */}
          <div className="mt-2 bg-white rounded-lg p-2 border border-teal-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentValue = parseInt(quickCustomMinutes) || 25;
                  if (currentValue > 1) {
                    setQuickCustomMinutes((currentValue - 1).toString());
                  }
                }}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border text-sm font-bold"
              >
                -
              </button>

              <input
                type="number"
                min="1"
                max="120"
                value={quickCustomMinutes}
                onChange={(e) => setQuickCustomMinutes(e.target.value)}
                placeholder="25"
                className="w-16 text-sm border border-gray-300 rounded px-2 py-1 focus:border-teal-500 focus:outline-none text-center font-bold h-8"
              />

              <button
                onClick={() => {
                  const currentValue = parseInt(quickCustomMinutes) || 25;
                  if (currentValue < 120) {
                    setQuickCustomMinutes((currentValue + 1).toString());
                  }
                }}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded border text-sm font-bold"
              >
                +
              </button>

              <button
                className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold h-8"
                onClick={() => {
                  const minutes = parseInt(quickCustomMinutes) || 25;

                  if (minutes > 0) {
                    const timeString = `${minutes.toString().padStart(2, '0')}:00`;
                    updateMatchTime(timeString, "Hiệp 1", "live");
                    updateView('scoreboard');
                    playAudioForAction('gialap');
                    toast.success(`⏰ Đã bắt đầu timer từ ${timeString}!`);
                  } else {
                    toast.warning('⚠️ Vui lòng nhập thời gian hợp lệ!');
                  }
                }}
                disabled={!quickCustomMinutes || quickCustomMinutes === '0'}
                title="Áp dụng"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clock Settings */}
      {selectedOption === "dieu-khien" && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 sm:p-3 border border-indigo-200">
        <div className="space-y-3">
          {/* Radio buttons */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                name="clock"
                value="khong"
                checked={clockSetting === "khong"}
                onChange={(e) => setClockSetting(e.target.value)}
                className="scale-75"
              />
              <label className="text-xs">KHÔNG</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                name="clock"
                value="lien-tuc"
                checked={clockSetting === "lien-tuc"}
                onChange={(e) => setClockSetting(e.target.value)}
                className="scale-75"
              />
              <label className="text-xs">LIÊN TỤC</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                name="clock"
                value="moi-2"
                checked={clockSetting === "moi-2"}
                onChange={(e) => setClockSetting(e.target.value)}
                className="scale-75"
              />
              <label className="text-xs">MỖI 2'</label>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="radio"
                name="clock"
                value="moi-5"
                checked={clockSetting === "moi-5"}
                onChange={(e) => setClockSetting(e.target.value)}
                className="scale-75"
              />
              <label className="text-xs">MỖI 5'</label>
            </div>
          </div>

          {/* Text content */}
          <Input
            placeholder="Nội dung chữ chạy..."
            value={clockText}
            onChange={(e) => setClockText(e.target.value)}
            maxLength={100}
            className="w-full text-xs"
          />

          {/* Text Style Selection */}
          <div>
            <div className="flex gap-1 flex-wrap justify-center">
              <button
                onClick={() => setTickerColor("white-black")}
                className={`px-2 py-1 text-xs font-medium rounded border-2 bg-black text-white ${tickerColor === "white-black" ? "border-orange-600" : "border-gray-300"
                  }`}
              >
                Chữ
              </button>
              <button
                onClick={() => setTickerColor("black-white")}
                className={`px-2 py-1 text-xs font-medium rounded border-2 bg-white text-black ${tickerColor === "black-white" ? "border-orange-600" : "border-gray-300"
                  }`}
              >
                Chữ
              </button>
              <button
                onClick={() => setTickerColor("white-blue")}
                className={`px-2 py-1 text-xs font-medium rounded border-2 bg-blue-600 text-white ${tickerColor === "white-blue" ? "border-orange-600" : "border-gray-300"
                  }`}
              >
                Chữ
              </button>
              <button
                onClick={() => setTickerColor("white-red")}
                className={`px-2 py-1 text-xs font-medium rounded border-2 bg-red-600 text-white ${tickerColor === "white-red" ? "border-orange-600" : "border-gray-300"
                  }`}
              >
                Ch���
              </button>
              <button
                onClick={() => setTickerColor("white-green")}
                className={`px-2 py-1 text-xs font-medium rounded border-2 bg-green-600 text-white ${tickerColor === "white-green" ? "border-orange-600" : "border-gray-300"
                  }`}
              >
                Chữ
              </button>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center pt-2 border-t border-indigo-200">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                // Tạo marquee data từ clock settings
                const marqueeSettings = {
                  text: clockText || "TRỰC TIẾP BÓNG ĐÁ",
                  mode: clockSetting,
                  color: tickerColor,
                  interval: clockSetting === 'moi-2' ? 2 : clockSetting === 'moi-5' ? 5 : 0
                };

                // Update marquee qua MatchContext
                updateMarquee(marqueeSettings);



                toast.success('✅ Đã áp dụng cài đặt chữ chạy!');
              }}
              className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium text-xs rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              ÁP DỤNG
            </Button>
          </div>
        </div>
      </div>
      )}
      {/* Modals */}
      <Modal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        title="🎨 Quản Lý Poster & Logo"
        size="full"
      >
        <PosterManager
          matchData={matchData}
          accessCode={matchCode}
          initialData={{
            selectedPoster: displaySettings.selectedPoster ? { id: displaySettings.selectedPoster, name: displaySettings.selectedPoster } : null,
            displayOptions: {
              shape: displaySettings.logoShape || 'round',
              rotateDisplay: displaySettings.rotateDisplay || false
            }
          }}
          onPosterUpdate={(poster) => {

            if (poster) {
              const posterType = poster.id || poster.name;
              console.log("[MatchManagementSection] About to call updatePoster with:", posterType);
              updatePoster(posterType);

              console.log("🎨 [MatchManagementSection] About to call updateView with: poster");
              updateView('poster');

              console.log("🎨 [MatchManagementSection] Setting selectedOption to: chon-poster");
              setSelectedOption("chon-poster");
            } else {
              console.log("⚠ [MatchManagementSection] No poster provided to onPosterUpdate");
            }
          }}
          onLogoUpdate={(logoData) => {

            // Handle individual item change with behavior
            if (logoData.changedItem && logoData.behavior) {
              const item = logoData.changedItem;
              const behavior = logoData.behavior;

              console.log(`[MatchManagementSection] ${behavior} logo:`, item);

              // Prepare data with behavior
              const logoUpdateData = {
                code_logo: [item.code],
                url_logo: [item.url],
                position: item.displayPositions,
                type_display: [item.type || 'default'],
                behavior: behavior
              };

              // Emit to specific category with behavior
              switch (item.category) {
                case 'sponsor':
                  console.log("[MatchManagementSection] Calling updateSponsors with logoUpdateData:", logoUpdateData);
                  
                  updateSponsors(logoUpdateData);
                  break;
                case 'organizing':
                  console.log("[MatchManagementSection] Calling updateOrganizing with behavior:", behavior);
                  updateOrganizing(logoUpdateData);
                  break;
                case 'media':
                  console.log("[MatchManagementSection] Calling updateMediaPartners with behavior:", behavior);
                  updateMediaPartners(logoUpdateData);
                  break;
                case 'tournament':
                  console.log("[MatchManagementSection] Calling updateTournamentLogo with behavior:", behavior);
                  updateTournamentLogo({
                    code_logo: [item.code],
                    url_logo: [item.url],
                    behavior: behavior
                  });
                  break;
              }
            }

            // Handle bulk update (fallback cho compatibility)
            if (logoData && logoData.logoItems && !logoData.changedItem) {
              // Phân loại logo items theo category
              const logosByCategory = logoData.logoItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                  acc[item.category] = [];
                }
                acc[item.category].push({
                  code_logo: item.code,
                  url_logo: item.url,
                  position: item.displayPositions || [],
                  type_display: item.type || 'default'
                });
                return acc;
              }, {});

              console.log("[MatchManagementSection] logosByCategory:", logosByCategory);

              // Emit socket events cho từng category
              if (logosByCategory.sponsor) {
                console.log("[MatchManagementSection] Calling updateSponsors");
                updateSponsors({
                  code_logo: logosByCategory.sponsor.map(s => s.code_logo),
                  url_logo: logosByCategory.sponsor.map(s => s.url_logo),
                  position: logosByCategory.sponsor.map(s => s.position),
                  type_display: logosByCategory.sponsor.map(s => s.type_display)
                });
              }

              if (logosByCategory.organizing) {
                console.log("[MatchManagementSection] Calling updateOrganizing");
                updateOrganizing({
                  code_logo: logosByCategory.organizing.map(o => o.code_logo),
                  url_logo: logosByCategory.organizing.map(o => o.url_logo),
                  position: logosByCategory.organizing.map(o => o.position),
                  type_display: logosByCategory.organizing.map(o => o.type_display)
                });
              }

              if (logosByCategory.media) {
                console.log("[MatchManagementSection] Calling updateMediaPartners");
                updateMediaPartners({
                  code_logo: logosByCategory.media.map(m => m.code_logo),
                  url_logo: logosByCategory.media.map(m => m.url_logo),
                  position: logosByCategory.media.map(m => m.position),
                  type_display: logosByCategory.media.map(m => m.type_display)
                });
              }

              if (logosByCategory.tournament) {
                console.log("[MatchManagementSection] Calling updateTournamentLogo");
                updateTournamentLogo({
                  code_logo: logosByCategory.tournament.map(t => t.code_logo),
                  url_logo: logosByCategory.tournament.map(t => t.url_logo)
                });
              }

              if (logosByCategory.live) {
                console.log("[MatchManagementSection] Calling updateLiveUnit");
                updateLiveUnit({
                  code_logo: logosByCategory.live.map(l => l.code_logo),
                  url_logo: logosByCategory.live.map(l => l.url_logo),
                  name: 'LIVE STREAMING',
                  position: 'top-right'
                });
              }
            }

            // Cập nhật display options nếu có
            if (logoData && logoData.displayOptions) {
              console.log("[MatchManagementSection] Calling updateDisplaySettings");
              const displayOptions = {
                logoShape: logoData.displayOptions.shape || 'round',
                rotateDisplay: logoData.displayOptions.rotateDisplay || false
              };
              console.log('[MatchManagementSection] Display options to update:', displayOptions);
              updateDisplaySettings(displayOptions);
            }
          }}
          onPositionChange={(updatedItem) => {
            // Handle real-time position changes
            console.log('📍 [MatchManagementSection] Position changed for item:', updatedItem);

            // Create immediate update with just this item
            const logoData = {
              logoItems: [updatedItem],
              displayOptions: displaySettings
            };

            if (logoData && logoData.logoItems) {
              const logosByCategory = logoData.logoItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                  acc[item.category] = [];
                }
                acc[item.category].push({
                  code_logo: item.code,
                  url_logo: item.url,
                  position: item.displayPositions || [],
                  type_display: item.type || 'default'
                });
                return acc;
              }, {});

              // Emit immediate updates for the specific category
              if (logosByCategory.sponsor) {
                updateSponsors({
                  code_logo: logosByCategory.sponsor.map(s => s.code_logo),
                  url_logo: logosByCategory.sponsor.map(s => s.url_logo),
                  position: logosByCategory.sponsor.map(s => s.position),
                  type_display: logosByCategory.sponsor.map(s => s.type_display)
                });
              }

              if (logosByCategory.organizing) {
                updateOrganizing({
                  code_logo: logosByCategory.organizing.map(o => o.code_logo),
                  url_logo: logosByCategory.organizing.map(o => o.url_logo),
                  position: logosByCategory.organizing.map(o => o.position),
                  type_display: logosByCategory.organizing.map(o => o.type_display)
                });
              }

              if (logosByCategory.media) {
                updateMediaPartners({
                  code_logo: logosByCategory.media.map(m => m.code_logo),
                  url_logo: logosByCategory.media.map(m => m.url_logo),
                  position: logosByCategory.media.map(m => m.position),
                  type_display: logosByCategory.media.map(m => m.type_display)
                });
              }
            }
          }}
          onClose={() => setShowPosterModal(false)}
        />
      </Modal>

      <TeamLineupModal
        isOpen={showLineupModal}
        onClose={() => setShowLineupModal(false)}
        onSave={(lineupData) => {
          console.log("Saved lineup data:", lineupData);
          setShowLineupModal(false);
        }}
        matchData={matchData}
      />

      <SimplePenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
        matchData={matchData}
        penaltyData={penaltyData}
        onPenaltyChange={handlePenaltyChange}
      />



      <Modal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        title="🕰️ Thiết Lập Thời Gian Tùy Chỉnh"
        size="md"
      >
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-yellow-800 flex items-center justify-center">
              <span className="mr-2">🕰️</span>
              THIẾT LẬP ĐẾM T
              <span className="ml-2">🕰️</span>
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Trận đấu sẽ bắt đầu chạy từ thời điểm này
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="Nhập phút (VD: 30)"
                  className="text-sm border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 font-bold text-center"
                />
                <label className="block text-xs text-center text-yellow-700 mt-1">Phút</label>
              </div>

              <span className="text-yellow-600 font-bold text-lg">:</span>

              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={customSeconds || ''}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  placeholder="Nhập giây (VD: 30)"
                  className="text-sm border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500 font-bold text-center"
                />
                <label className="block text-xs text-center text-yellow-700 mt-1">Giây</label>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-yellow-700 mb-4">
            ⏱️ Trận đấu sẽ bắt đầu từ: <strong>
              {(parseInt(customTime) || 0).toString().padStart(2, '0')}:
              {(parseInt(customSeconds) || 0).toString().padStart(2, '0')}
            </strong>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowTimerModal(false)}
              className="px-4 py-2"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                const minutes = parseInt(customTime) || 0;
                const seconds = parseInt(customSeconds) || 0;

                if (minutes > 0 || seconds > 0) {
                  // Format thời gian (phút:giây)
                  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                  // Set thời gian và bắt đầu đếm tiến từ server timer
                  updateMatchTime(timeString, "Hiệp 1", "live");

                  // Chuyển sang tỉ số trên
                  updateView('scoreboard');
                  setSelectedOption("ti-so-tren");

                  console.log('🕰�� Áp dụng thời gian tùy chỉnh từ modal - Timer sẽ đếm từ:', timeString);
                  console.log('���� Server sẽ emit timer_tick events với displayTime format từ:', timeString);

                  toast.success(`⏰ Đã bắt đầu timer từ ${timeString}!`);
                } else {
                  toast.warning('⚠️ Vui lòng nhập thời gian hợp lệ!');
                }
                setShowTimerModal(false);
              }}
            >
              <span className="mr-1">✅</span>
              ÁP DỤNG
            </Button>
          </div>
        </div>
      </Modal>


    </div>
  );
};

export default MatchManagementSection;
