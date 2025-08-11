import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Button from "../common/Button";
import MemoizedPosterManager from "./MemoizedPosterManager";
import TeamLineupModal from "../lineup/TeamLineupModal";
import Modal from "../common/Modal";
import SimplePenaltyModal from "../common/SimplePenaltyModal";
import { useMatch } from "../../contexts/MatchContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTimer } from "../../contexts/TimerContext";
import audioUtils from '../../utils/audioUtils';
import LogoAPI from '../../API/apiLogo';
import ScoreboardPreview from './ScoreboardPreview';
import { getFullLogoUrl } from '../../utils/logoUtils';

import ScoreControls from './ScoreControls';
import AudioControls from './AudioControls';
import MatchInfo from './MatchInfo';
import MatchStatsEdit from './MatchStatsEdit';
import ControlButtons from './ControlButtons';

const MatchManagementSection = ({ isActive = true }) => {
  const {
    matchData,
    matchStats,
    futsalErrors,
    penaltyData,

    displaySettings,
    currentView,

    updateScore,
    updateSetScore,
    updateMatchInfo,
    updateStats,
    updateTemplate,
    updatePoster,
    updateTeamNames,
    updateTeamLogos,
    updateFutsalErrors,
    updateGoalScorers,
    updatePenalty,

    updateView,
    updateMarquee,
    updateMatchTitle,

    // Logo update functions
    updateSponsors,
    updateOrganizing,
    updateMediaPartners,
    updateTournamentLogo,
    updateLiveUnit,
    updateDisplaySettings,

  } = useMatch();

  const {
    timerData,
    updateMatchTime,
    resumeTimer
  } = useTimer();

  const { matchCode, typeMatch } = useAuth();

  const stableMatchData = useMemo(() => {
    return {
      teamA: {
        name: matchData.teamA.name,
        logo: matchData.teamA.logo,
        score: matchData.teamA.score
      },
      teamB: {
        name: matchData.teamB.name,
        logo: matchData.teamB.logo,
        score: matchData.teamB.score
      },
      tournament: matchData.tournament,
      stadium: matchData.stadium,
      matchDate: matchData.matchDate,
      liveText: matchData.liveText,
      matchTitle: matchData.matchTitle
    };
  }, [
    matchData.teamA.name, matchData.teamA.logo, matchData.teamA.score,
    matchData.teamB.name, matchData.teamB.logo, matchData.teamB.score,
    matchData.tournament, matchData.stadium, matchData.matchDate,
    matchData.liveText, matchData.matchTitle
  ]);

  const stableInitialData = useMemo(() => ({
    selectedPoster: displaySettings.selectedPoster ? { id: displaySettings.selectedPoster, name: displaySettings.selectedPoster } : null,
    displayOptions: {
      shape: displaySettings.logoShape || 'round',
      rotateDisplay: displaySettings.rotateDisplay || false
    }
  }), [displaySettings.selectedPoster, displaySettings.logoShape, displaySettings.rotateDisplay]);

  // Audio state management
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState(null);

  // State cho các tùy chọn điều khiển UI
  const [selectedOption, setSelectedOption] = useState("thong-so");
  const [clockSetting, setClockSetting] = useState("khong");
  const [clockText, setClockText] = useState("");
  const [showMatchInfo, setShowMatchInfo] = useState(false);

  // State cho custom time
  const [customTime, setCustomTime] = useState("");
  const [customSeconds, setCustomSeconds] = useState("");
  const [quickCustomMinutes, setQuickCustomMinutes] = useState(""); 
  const [tickerColor, setTickerColor] = useState("#ffffff");

  // State cho thông tin đội và trận đấu
  const [teamAInfo, setTeamAInfo] = useState({
    name: matchData.teamA.name || "",
    logo: matchData.teamA.logo || "",
    teamAKitcolor: matchData.teamA.teamAKitcolor || "",
    teamA2Kitcolor: matchData.teamA.teamA2Kitcolor || "",
  });
  const [teamBInfo, setTeamBInfo] = useState({
    name: matchData.teamB.name || "",
    logo: matchData.teamB.logo || "",
    teamBKitcolor: matchData.teamB.teamBKitcolor || "",
    teamB2Kitcolor: matchData.teamB.teamB2Kitcolor || "",
  });
  const [matchTitle, setMatchTitle] = useState(matchData.matchTitle || "");
  const [liveText, setLiveText] = useState(matchData.liveText || "");

  useEffect(() => {
    console.log("Giá trị đồng bộ từ backend socket là", matchData);
    setTeamAInfo(prev => {
      const newTeamAInfo = {
        name: matchData.teamA.name || prev.name,
        logo: matchData.teamA.logo || prev.logo,
        teamAKitcolor: matchData.teamA.teamAKitColor || matchData.teamAKitColor || prev.teamAKitcolor,
        teamA2Kitcolor: matchData.teamA.teamA2KitColor || matchData.teamA2KitColor || prev.teamA2Kitcolor,
      };

      if (JSON.stringify(newTeamAInfo) !== JSON.stringify(prev)) {
        return newTeamAInfo;
      }
      return prev;
    });

    setTeamBInfo(prev => {
      const newTeamBInfo = {
        name: matchData.teamB.name || prev.name,
        logo: matchData.teamB.logo || prev.logo,
        teamBKitcolor: matchData.teamB.teamBKitColor || matchData.teamBKitColor || prev.teamBKitcolor,
        teamB2Kitcolor: matchData.teamB.teamB2KitColor || matchData.teamB2KitColor || prev.teamB2Kitcolor,
      };

      if (JSON.stringify(newTeamBInfo) !== JSON.stringify(prev)) {
        return newTeamBInfo;
      }
      return prev;
    });
  }, [matchData.teamA.name, matchData.teamA.logo, matchData.teamB.name, matchData.teamB.logo, matchData.teamA.teamAKitColor, matchData.teamAKitColor, matchData.teamB.teamBKitColor, matchData.teamBKitColor]);
  
  const [matchInfo, setMatchInfo] = useState({
    startTime: matchData.startTime || "19:30",
    location: matchData.stadium || "SÂN VẬN ĐỘNG QUỐC GIA",
    matchDate: matchData.matchDate || new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (matchData.startTime || matchData.stadium || matchData.matchDate) {
      setMatchInfo(prev => ({
        startTime: matchData.startTime || prev.startTime,
        location: matchData.stadium || prev.location,
        matchDate: matchData.matchDate || prev.matchDate
      }));
    }
  }, [matchData.startTime, matchData.stadium, matchData.matchDate]);

  useEffect(() => {
    if (matchData.matchTitle !== undefined) {
      setMatchTitle(matchData.matchTitle);
    }
    if (matchData.liveText !== undefined) {
      setLiveText(matchData.liveText);
    }
  }, [matchData.matchTitle, matchData.liveText]);

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

  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [logoCodeA, setLogoCodeA] = useState("");
  const [logoCodeB, setLogoCodeB] = useState("");
  const [isSearchingLogoA, setIsSearchingLogoA] = useState(false);
  const [isSearchingLogoB, setIsSearchingLogoB] = useState(false);

  const handleSearchLogoA = async () => {
    if (!logoCodeA.trim()) return;

    setIsSearchingLogoA(true);
    try {
      const response = await LogoAPI.searchLogosByCode(logoCodeA.trim(), true);
      if (response.success && response.data && response.data.length > 0) {
        const logo = response.data[0];
        setTeamAInfo(prev => ({ ...prev, logo: getFullLogoUrl(logo.url_logo) }));
        setLogoCodeA("");
      } else {
        console.log(`⚠Không tìm thấy logo với code "${logoCodeA}"`);
      }
    } catch (error) {
      console.log('❌ Lỗi tìm kiếm logo A');
    } finally {
      setIsSearchingLogoA(false);
    }
  };

  const handleSearchLogoB = async () => {
    if (!logoCodeB.trim()) return;

    setIsSearchingLogoB(true);
    try {
      const response = await LogoAPI.searchLogosByCode(logoCodeB.trim(), true);
      if (response.success && response.data && response.data.length > 0) {
        const logo = response.data[0];
        setTeamBInfo(prev => ({ ...prev, logo: getFullLogoUrl(logo.url_logo) }));
        setLogoCodeB("");
      } else {
        console.log(`⚠️ Không tìm thấy logo với code "${logoCodeB}"`);
      }
    } catch (error) {
      console.log('❌ Lỗi tìm kiếm logo B');
    } finally {
      setIsSearchingLogoB(false);
    }
  };

  const handlePenaltyChange = useCallback((newPenaltyData) => {
    updatePenalty(newPenaltyData);
    updateView('penalty_scoreboard');
  }, [updatePenalty, updateView]);

  const onLogoUpdateRef = useRef();
  const onPosterUpdateRef = useRef();

  const handleLogoUpdate = useCallback((logoData) => {
    if (logoData.changedItem && logoData.behavior) {
      const item = logoData.changedItem;
      const behavior = logoData.behavior;

      console.log(`[MatchManagementSection] ${behavior} logo:`, item);

      const logoUpdateData = {
        code_logo: [item.code],
        url_logo: [item.url],
        position: item.displayPositions,
        type_display: [item.type || 'default'],
        behavior: behavior
      };

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
        default:
          console.warn("[MatchManagementSection] Unknown logo category:", item.category);
          break;
      }
    }

    if (logoData && logoData.logoItems && !logoData.changedItem) {
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
    }

    if (logoData && logoData.displayOptions) {
      console.log("[MatchManagementSection] Calling updateDisplaySettings");
      const displayOptions = {
        logoShape: logoData.displayOptions.shape || 'round',
        rotateDisplay: logoData.displayOptions.rotateDisplay || false
      };
      console.log('[MatchManagementSection] Display options to update:', displayOptions);
      updateDisplaySettings(displayOptions);
    }
  }, [updateSponsors, updateOrganizing, updateMediaPartners, updateTournamentLogo, updateDisplaySettings]);

  onLogoUpdateRef.current = handleLogoUpdate;
  onPosterUpdateRef.current = useCallback((poster) => {
    if (poster) {
      const posterType = poster.id || poster.name;
      updatePoster(posterType);
      updateView('poster');
    }
  }, [updatePoster, updateView]);

  const handleScoreChange = (team, increment) => {
    updateScore(team, increment);
  };

  const handleApplyChanges = () => {
    updateTeamNames(teamAInfo.name || matchData.teamA.name, teamBInfo.name || matchData.teamB.name);
    updateTeamLogos(
      teamAInfo.logo || getFullLogoUrl(matchData.teamA.logo) || "",
      teamBInfo.logo || getFullLogoUrl(matchData.teamB.logo) || ""
    );
    updateMatchTitle(matchTitle);

    const matchInfoData = {
      startTime: matchInfo.startTime,
      stadium: matchInfo.location,
      matchDate: matchInfo.matchDate || new Date().toISOString().split('T')[0],
      title: matchTitle,
      time: matchInfo.startTime,
      teamAKitColor: teamAInfo.teamAKitcolor || '#ff0000',
      teamBKitColor: teamBInfo.teamBKitcolor || '#000000',
      teamA2KitColor: teamAInfo.teamA2Kitcolor || '#0000ff',
      teamB2KitColor: teamBInfo.teamB2Kitcolor || '#00ff00',
      liveText: liveText,
      logoTeamA: teamAInfo.logo || getFullLogoUrl(matchData.teamA.logo) || "",
      logoTeamB: teamBInfo.logo || getFullLogoUrl(matchData.teamB.logo) || ""
    };

    console.log("🎨 [DEBUG] Gửi updateMatchInfo với:", matchInfoData);
    updateMatchInfo(matchInfoData);

    if (liveText !== matchData.liveText) {
      updateLiveUnit({
        text: liveText
      });
    }
  };

  const handleCountdownClick = (timeString) => {
    console.log('🎯 [MatchManagementSection] Clicked countdown - calling updateMatchTime:', { timeString, period: "Hiệp 1", status: "live" });
    updateMatchTime(timeString, "Hiệp 1", "live");
    updateView('scoreboard');
    playAudioForAction('gialap');
  };

  const viewMap = {
    scoreboard: 'Tỉ số trên',
    scoreboard_below: 'Tỉ số dưới',
    poster: 'Poster',
    intro: 'Giới thiệu',
    halftime: 'Nghỉ giữa hiệp',
    player_list: 'Danh sách cầu thủ',
  };
  
  return (
    <div className="sm:p-0 space-y-0 sm:space-y-0">
      {/* Scoreboard */}
      <div className="sm:p-0 p-2 shadow-md h-auto">
        <div className="w-full h-12 sm:h-16 bg-gray-100 rounded-md overflow-hidden relative">
          {/* Hiển thị view hiện tại */}
          <div className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold z-10">
            Màn hình: {viewMap[currentView || 'intro'] || 'Giới thiệu'}
          </div>
          <ScoreboardPreview
            matchData={{
              ...matchData,
              ...timerData, 
              teamA: {
                ...matchData.teamA,
                name: teamAInfo.name || matchData.teamA.name,
                logo: teamAInfo.logo || getFullLogoUrl(matchData.teamA.logo)
              },
              teamB: {
                ...matchData.teamB,
                name: teamBInfo.name || matchData.teamB.name,
                logo: teamBInfo.logo || getFullLogoUrl(matchData.teamB.logo)
              },
              matchTitle: matchTitle || matchData.matchTitle,
              teamAKitColor: teamAInfo.teamAKitcolor || matchData.teamAKitColor || matchData.teamAKitColor || '#ff0000',
              teamBKitColor: teamBInfo.teamBKitcolor || matchData.teamBKitColor || matchData.teamBKitColor || '#000000'
            }}
            displaySettings={displaySettings}
          />
        </div>
      </div>

      {/* Score Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 sm:p-4 border border-blue-200">
        <ScoreControls
          typeMatch={typeMatch}
          matchData={matchData}
          onScoreChange={handleScoreChange}
          onSetScoreChange={updateSetScore}
        />

        {/* Audio và Timer Controls */}
        <AudioControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          currentAudioFile={currentAudioFile}
          audioEnabled={audioEnabled}
          timerData={timerData}
          showMatchInfo={showMatchInfo}
          onPauseAudio={pauseCurrentAudio}
          onResumeAudio={resumeCurrentAudio}
          onToggleAudio={toggleAudioEnabled}
          onResumeTimer={resumeTimer}
          onPauseTimer={() => updateMatchTime(timerData.matchTime, timerData.period, "paused")}
          onToggleMatchInfo={() => setShowMatchInfo(!showMatchInfo)}
        />

        {/* Match Info */}
        <MatchInfo
          showMatchInfo={showMatchInfo}
          setShowMatchInfo={setShowMatchInfo}
          matchTitle={matchTitle}
          setMatchTitle={setMatchTitle}
          liveText={liveText}
          setLiveText={setLiveText}
          teamAInfo={teamAInfo}
          setTeamAInfo={setTeamAInfo}
          teamBInfo={teamBInfo}
          setTeamBInfo={setTeamBInfo}
          matchInfo={matchInfo}
          setMatchInfo={setMatchInfo}
          logoCodeA={logoCodeA}
          setLogoCodeA={setLogoCodeA}
          logoCodeB={logoCodeB}
          setLogoCodeB={setLogoCodeB}
          isSearchingLogoA={isSearchingLogoA}
          isSearchingLogoB={isSearchingLogoB}
          onSearchLogoA={handleSearchLogoA}
          onSearchLogoB={handleSearchLogoB}
          onApplyChanges={handleApplyChanges}
        />
      </div>

      {/* Tab Controls */}
      <div className="bg-white rounded-lg p-2 sm:p-3 shadow-lg border border-gray-200">
        <div className={`grid ${typeMatch === 'pickleball' ? 'grid-cols-1' : 'grid-cols-3'} gap-1.5 sm:gap-2`}>
          {typeMatch !== 'pickleball' && (
            <button
            onClick={() => setSelectedOption("thong-so")}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 shadow-md ${selectedOption === "thong-so"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
          >
            <span className="hidden sm:inline">THÔNG SỐ</span>
            <span className="sm:hidden">Thông Số</span>
            </button>
          )}
          <button
            onClick={() => setSelectedOption("dieu-khien")}
            className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 shadow-md ${selectedOption === "dieu-khien"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
              }`}
          >
            <span className="hidden sm:inline">ĐIỀU KHIỂN</span>
            <span className="sm:hidden">Điều khiển</span>
          </button>
          {typeMatch !== 'pickleball' && (
            <button
              onClick={() => {
                setSelectedOption(selectedOption === "chon-skin" ? "dieu-khien" : "chon-skin");
              }}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 shadow-md ${selectedOption === "chon-skin"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl"
                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300"
                }`}
            >
              <span className="hidden sm:inline">Skin</span>
              <span className="sm:hidden">Skin</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Template Selection */}
      {selectedOption === "chon-skin" && typeMatch !== 'pickleball' && (
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
      {selectedOption === "thong-so" && typeMatch !== 'pickleball' && (
        <div className="space-y-2">
          <MatchStatsEdit
            matchStats={matchStats}
            futsalErrors={futsalErrors}
            onUpdateStats={updateStats}
            onUpdateFutsalErrors={updateFutsalErrors}
            onUpdateGoalScorers={updateGoalScorers}
            onUpdateView={updateView}
            onPlayAudio={playAudioForAction}
            accessCode={matchCode}
          />

          {/* Clock Setting - Thiết lập đồng hồ */}
          <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Thiết lập đồng hồ</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Chế độ:</label>
                <select
                  value={clockSetting}
                  onChange={(e) => setClockSetting(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                >
                  <option value="khong">Không hiện</option>
                  <option value="dem-len">Đếm lên</option>
                  <option value="dem-xuong">Đếm xuống</option>
                  <option value="ticker">Ticker text</option>
                </select>
              </div>

              {clockSetting === "ticker" && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nội dung ticker..."
                    value={clockText}
                    onChange={(e) => setClockText(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="color"
                    value={tickerColor}
                    onChange={(e) => setTickerColor(e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    title="Màu ticker"
                  />
                </div>
              )}

              {(clockSetting === "dem-len" || clockSetting === "dem-xuong") && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="mm:ss"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                  />
                  <input
                    type="number"
                    placeholder="Giây"
                    value={customSeconds}
                    onChange={(e) => setCustomSeconds(e.target.value)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-center"
                    min="0"
                    max="59"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const minutes = customTime.split(':')[0] || '0';
                      const seconds = customTime.split(':')[1] || customSeconds || '0';
                      const timeString = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
                      updateMatchTime(timeString, "Hiệp 1", "live");
                      updateView('scoreboard');
                    }}
                    className="px-3 py-1 text-xs"
                  >
                    Áp dụng
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Options - Các action buttons điều khiển */}
      {selectedOption === "dieu-khien" && (
        <ControlButtons
          typeMatch={typeMatch}
          onShowPosterModal={setShowPosterModal}
          onShowLineupModal={setShowLineupModal}
          onShowPenaltyModal={setShowPenaltyModal}
          onCountdownClick={handleCountdownClick}
          onUpdateMatchTime={updateMatchTime}
          onUpdateView={updateView}
          onPlayAudio={playAudioForAction}
          quickCustomMinutes={quickCustomMinutes}
          setQuickCustomMinutes={setQuickCustomMinutes}
        />
      )}

      {/* Modals */}
      {showPosterModal && (
        <Modal
          isOpen={showPosterModal}
          onClose={() => setShowPosterModal(false)}
          title="Chọn Poster"
          size="xl"
        >
          <MemoizedPosterManager
            initialData={stableInitialData}
            onLogoUpdate={onLogoUpdateRef.current}
            onPosterUpdate={onPosterUpdateRef.current}
            onClose={() => setShowPosterModal(false)}
          />
        </Modal>
      )}

      {showLineupModal && (
        <TeamLineupModal
          isOpen={showLineupModal}
          onClose={() => setShowLineupModal(false)}
          onSave={(lineupData) => {
            console.log("Saved lineup data:", lineupData);
            setShowLineupModal(false);
          }}
          matchData={{ ...matchData, ...timerData }}
        />
      )}

      {showPenaltyModal && (
        <SimplePenaltyModal
          isOpen={showPenaltyModal}
          onClose={() => setShowPenaltyModal(false)}
          onPenaltyChange={handlePenaltyChange}
          initialData={penaltyData}
        />
      )}
    </div>
  );
};

export default MatchManagementSection;
